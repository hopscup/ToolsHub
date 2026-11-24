import {build} from 'vite';
import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parse} from 'parse5';
import {createCriticalCss} from './critical-css.mjs';
import postcss from 'postcss';

const root=process.cwd(),dist=path.join(root,'dist'),server=path.join(root,'.prerender');
await build({build:{ssr:'src/entry-server.tsx',outDir:server,emptyOutDir:true,minify:false,rollupOptions:{output:{entryFileNames:'entry-server.mjs'}}},logLevel:'warn'});
const {renderPage}=await import(pathToFileURL(path.join(server,'entry-server.mjs')));
const walk=(node,visit)=>{visit(node);for(const child of node.childNodes||[])walk(child,visit);};
const attr=(node,name)=>node.attrs?.find(item=>item.name===name)?.value;
const cssCache=new Map();
let extractCss;
let articleFonts;
let count=0;
for(const relative of await readdir(dist,{recursive:true})) {
  if(!relative.endsWith('index.html'))continue;
  const file=path.join(dist,relative),html=await readFile(file,'utf8');
  const document=parse(html,{sourceCodeLocationInfo:true,scriptingEnabled:true});
  let mount,head,htmlNode;
  const preloads=new Set(),edits=[],styles=[];
  walk(document,node=>{
    if(node.tagName==='div'&&attr(node,'id')==='root')mount=node;
    if(node.tagName==='head')head=node;
    if(node.tagName==='html')htmlNode=node;
    if(node.tagName!=='link')return;
    const rel=attr(node,'rel'),href=attr(node,'href');
    if(rel==='modulepreload') {
      if(preloads.has(href)||/\/analytics-[^/]+\.js$/.test(href))edits.push([node.sourceCodeLocation.startOffset,node.sourceCodeLocation.endOffset,'']);
      else preloads.add(href);
    }
    if(rel==='stylesheet'&&href?.startsWith('/assets/')){
      styles.push(href);
      const tag=html.slice(node.sourceCodeLocation.startOffset,node.sourceCodeLocation.endOffset);
      edits.push([node.sourceCodeLocation.startOffset,node.sourceCodeLocation.endOffset,tag.replace(/>$/,' media="print" data-deferred-css onload="this.media=\'all\'" onerror="this.dataset.failed=\'true\';window.__hopscupRecoverChunk?.(new Error(\'Unable to preload CSS for \'+this.href))">')]);
    }
  });
  if(!mount?.sourceCodeLocation||!head?.sourceCodeLocation)throw Error('Missing React mount: '+relative);
  const fallback=html.slice(mount.sourceCodeLocation.startTag.endOffset,mount.sourceCodeLocation.endTag.startOffset);
  if(!fallback.startsWith('<noscript>'))throw Error('Missing original noscript: '+relative);
  const route='/'+relative.replaceAll('\\','/').replace(/(?:\/)?index\.html$/,'').replace(/\/$/,'');
  const rendered=await renderPage(route);
  if(!rendered.includes('<h1'))throw Error('Missing prerendered H1: '+route);
  let css='';
  for(const href of styles){if(!cssCache.has(href))cssCache.set(href,await readFile(path.join(dist,href),'utf8'));css+=cssCache.get(href);}
  if(!css)throw Error('Missing first screen styles: '+route);
  if(!articleFonts){
    const faces=[];
    postcss.parse(css).walkAtRules('font-face',face=>{
      const family=face.nodes.find(node=>node.prop==='font-family')?.value.replaceAll(/['"]/g,'');
      if(family==='Montserrat')faces.push(face.clone());
    });
    articleFonts='';
    for(const face of faces){
      const subset=face.nodes.find(node=>node.prop==='unicode-range').value.includes('0400')?'cyrillic':'latin';
      const bytes=await readFile(path.join(dist,'fonts/montserrat/montserrat-'+subset+'.woff2'));
      face.walkDecls('src',decl=>{decl.value='url("data:font/woff2;base64,'+bytes.toString('base64')+'") format("woff2")';});
      face.walkDecls('font-display',decl=>{decl.value='block';});
      articleFonts+=face.toString();
    }
    if(faces.length!==2)throw Error('Expected two Montserrat subsets');
  }
  extractCss ||= createCriticalCss(css);
  css=extractCss(rendered);
  if(/^\/(?:en\/|es\/|zh\/|ko\/)?guides\/[^/]+/.test(route)){
    css+=articleFonts;
    const location=htmlNode.sourceCodeLocation.startTag;
    edits.push([location.startOffset,location.endOffset,html.slice(location.startOffset,location.endOffset).replace(/>$/,' data-embedded-article-fonts>')]);
  }
  const activate=`<script id="prerender-bootstrap">(()=>{const root=document.getElementById('root');const template=root.querySelector('template[data-prerender-root]');root.replaceChildren(template.content);})();</script>`;
  edits.push([mount.sourceCodeLocation.startOffset,mount.sourceCodeLocation.endOffset,`<div id="root" data-prerendered><template data-prerender-root>${rendered}</template></div>${activate}${fallback}`]);
  edits.push([head.sourceCodeLocation.endTag.startOffset,head.sourceCodeLocation.endTag.startOffset,`<style id="first-screen-css">${css.replaceAll('</style','<\\/style')}</style>`]);
  let result=html;
  for(const [start,end,value]of edits.sort((a,b)=>b[0]-a[0]))result=result.slice(0,start)+value+result.slice(end);
  await writeFile(file,result);
  count++;
}
await mkdir(server,{recursive:true});
await writeFile(path.join(server,'summary.json'),JSON.stringify({pages:count,styles:[...cssCache.keys()],cssBytes:[...cssCache.values()].reduce((sum,text)=>sum+Buffer.byteLength(text),0)},null,2));
console.log('Prerendered '+count+' React pages with original noscript preserved.');
