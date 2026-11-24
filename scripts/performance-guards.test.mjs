import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile,readdir} from 'node:fs/promises';
import {parse} from 'parse5';
import {createChunkRecovery,isChunkLoadError,CHUNK_RELOAD_KEY} from '../src/lib/chunkRecoveryPolicy.js';
import {pageLayers} from './html-layers.mjs';
import {createCriticalCss} from './critical-css.mjs';

test('critical CSS retains matching selectors, global rules and both themes without unused component styles',()=>{
  const extract=createCriticalCss('@font-face{font-family:Test;src:url(test.woff2)}body{margin:0}.hero,.unused{color:red}[data-theme=light] .hero{color:black}.future:not(.active){opacity:0}.absent{padding:5px}@media(min-width:700px){.hero{display:flex}.absent{display:none}}');
  const css=extract('<h1 class="hero">Title</h1>');
  assert.ok(css.includes('font-face'));assert.ok(css.includes('body{'));
  assert.ok(css.includes('[data-theme=light] .hero'));assert.ok(css.includes('.future:not(.active)'));
  assert.ok(!css.includes('.unused'));assert.ok(!css.includes('.absent'));
  assert.equal(extract('<h1 class="hero">Another title</h1>'),css);
});

test('cache rules are disjoint and HTML is never immutable',async()=>{
  const config=JSON.parse(await readFile('vercel.json','utf8'));
  const header=pathname=>{
    const matches=config.headers.filter(rule=>new RegExp('^'+rule.source+'$').test(pathname));
    assert.equal(matches.length,1,pathname);
    return matches[0].headers.find(header=>header.key==='Cache-Control').value;
  };
  assert.equal(header('/assets/App-abc12345.js'),'public, max-age=31536000, immutable');
  assert.equal(header('/assets/index-abc12345.css'),'public, max-age=31536000, immutable');
  assert.equal(header('/fonts/montserrat/montserrat-latin.woff2'),'public, max-age=2592000');
  for(const image of ['/logo.webp','/logo.png','/article/cover.jpg','/sky/light.webp'])assert.equal(header(image),'public, max-age=86400, stale-while-revalidate=604800');
  for(const page of ['/','/en','/proxy-vpn','/proxy-vpn/proxywing','/guides/youtube-ferma','/index.html','/404.html'])assert.equal(header(page),'public, max-age=0, must-revalidate');
  for(const file of await readdir('dist/assets'))assert.match(file,/[-.][\w-]{8}\.(?:js|css)$/,'Assets cached immutably must have versioned filenames: '+file);
});

test('stale chunks reload once across page lifetimes and then show the update UI',()=>{
  const data=new Map();let reloads=0,messages=0;
  const environment={storage:{getItem:key=>data.get(key),setItem:(key,value)=>data.set(key,value)},reload:()=>reloads++,showMessage:()=>messages++};
  const first=createChunkRecovery(environment);
  assert.equal(first(Error('Failed to fetch dynamically imported module: /assets/old.js')),true);
  assert.equal(data.get(CHUNK_RELOAD_KEY),'1');assert.equal(reloads,1);assert.equal(messages,0);
  first(Error('Unable to preload CSS for old.css'));assert.equal(reloads,1);
  const afterReload=createChunkRecovery(environment);
  afterReload(Error('Importing a module script failed.'));afterReload(Error('Loading chunk 12 failed'));
  assert.equal(reloads,1);assert.equal(messages,1);
});

test('recovery handles denied storage without reload loops and ignores unrelated application errors',()=>{
  let reloads=0,messages=0;
  const recover=createChunkRecovery({storage:{getItem(){throw Error('denied');}},reload:()=>reloads++,showMessage:()=>messages++});
  assert.equal(recover(Error('Invalid service ID')),false);
  assert.equal(isChunkLoadError(Error('Validation failed')),false);
  assert.equal(recover(Error('Failed to load module script')),true);
  assert.equal(reloads,0);assert.equal(messages,1);
});

test('prerender has real markup, one H1 per layer, inline styles and unique non-analytics preloads',async()=>{
  for(const route of ['','en/','proxy-vpn/','proxy-vpn/proxywing/','guides/youtube-ferma/','antidetect/']) {
    const html=await readFile('dist/'+route+'index.html','utf8'),layers=pageLayers(html);
    assert.equal(layers.prerendered,true,route);assert.equal(layers.headingCount,1,route);
    assert.ok(layers.prerender.includes('<template data-prerender-root>'));
    assert.ok(html.includes('id="prerender-bootstrap"'));assert.ok(html.includes('root.replaceChildren(template.content)'));
    assert.ok(html.includes('id="first-screen-css"'));assert.ok(html.includes('id="site-theme-bootstrap"'));
    assert.ok(html.indexOf('id="site-theme-bootstrap"')<html.indexOf('<body>'));
    assert.equal((layers.staticDocument.match(/<h1[ >]/g)||[]).length,1);
    const preloads=[],styles=[];
    const visit=node=>{if(node.tagName==='link'){const attrs=Object.fromEntries(node.attrs.map(attr=>[attr.name,attr.value]));if(attrs.rel==='modulepreload')preloads.push(attrs.href);if(attrs.rel==='stylesheet')styles.push(attrs);}for(const child of node.childNodes||[])visit(child);};
    visit(parse(html));assert.equal(new Set(preloads).size,preloads.length,route);
    assert.ok(preloads.every(href=>!href.includes('/analytics-')));
    assert.ok(styles.every(attrs=>attrs.media==='print' && 'data-deferred-css' in attrs && attrs.onload.includes("this.media='all'")));
  }
});

test('main hydrates the prerender and analytics cannot enter the initial dependency graph',async()=>{
  const main=await readFile('src/main.tsx','utf8'),analytics=await readFile('src/analytics.ts','utf8'),deferred=await readFile('src/lib/deferredAnalytics.ts','utf8');
  assert.ok(main.includes('hydrateRoot(root,tree)'));assert.ok(main.includes('root.hasAttribute(\'data-prerendered\')'));
  assert.ok(!main.includes("from '@vercel/analytics"));assert.ok(!analytics.includes("from '@vercel/analytics'"));
  assert.ok(deferred.includes('scheduleIdlePreload'));assert.ok(deferred.includes("import('@vercel/analytics')"));
  const content=await readFile('src/lib/clientContent.ts','utf8');
  assert.ok(content.includes("offer.category!=='Guides'"));
  assert.ok(content.includes("route===serviceCategoryRoutes[offer.category]+'/'+offer.slug"),'Duplicate service slugs must be resolved with their category');
});

test('canonical home counters do not depend on the language of payment descriptions',async()=>{
  for(const language of ['ru','en','es','zh','ko']){
    const file=(await readdir('dist/assets')).find(name=>new RegExp('^'+language+'-[\\w-]+\\.js$').test(name));
    const {default:content}=await import(new URL('../dist/assets/'+file,import.meta.url));
    assert.deepEqual(content.constants.HOME_STATS,{services:107,rub:76,guides:21},language);
  }
});

test('owner motion policy is enforced in all effect implementations',async()=>{
  for(const file of ['src/index.css','src/theme.css','src/components/HomeHero.tsx','src/components/home-hero.css','src/components/service-modal.css','src/components/CssTransitions.tsx','src/components/CryptoSubtitle.tsx','src/lib/uiEffects.ts','src/lib/articleAnchors.js'])assert.ok(!(await readFile(file,'utf8')).includes('prefers-reduced-motion'),file);
});
