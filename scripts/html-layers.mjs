import {parse} from 'parse5';

export function pageLayers(html) {
  const tree=parse(html,{sourceCodeLocationInfo:true,scriptingEnabled:true});
  let mount;
  const visit=node=>{
    if(node.tagName==='div'&&node.attrs?.some(attr=>attr.name==='id'&&attr.value==='root'))mount=node;
    for(const child of node.childNodes||[])visit(child);
  };
  visit(tree);
  const location=mount?.sourceCodeLocation;
  if(!location)throw Error('Missing React root');
  const start=location.startTag.endOffset,end=location.endTag.startOffset;
  const countHeadings=node=>(node.tagName==='h1'?1:0)+(node.content?.childNodes||node.childNodes||[]).reduce((sum,child)=>sum+countHeadings(child),0);
  return {
    prerender:html.slice(start,end),
    headingCount:countHeadings(mount),
    prerendered:mount.attrs.some(attr=>attr.name==='data-prerendered'),
    staticDocument:html.slice(0,start)+html.slice(end),
  };
}
