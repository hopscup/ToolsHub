import {parse as parseHtml} from 'parse5';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

export function createCriticalCss(source) {
  const stylesheet=postcss.parse(source),selectors=new Map(),cache=new Map();
  stylesheet.walkRules(rule=>{
    const branches=[];
    selectorParser(root=>root.each(selector=>{
      const classes=new Set();let negated=false;
      selector.walkClasses(node=>classes.add(node.value));
      selector.walkPseudos(node=>{if(node.value===':not')negated=true;});
      branches.push({text:selector.toString(),classes,negated});
    })).processSync(rule.selector);
    selectors.set(rule.selector,branches);
  });
  return html=>{
    const classes=new Set();
    const visit=node=>{
      for(const attr of node.attrs||[])if(attr.name==='class')for(const name of attr.value.split(/\s+/))classes.add(name);
      for(const child of node.childNodes||[])visit(child);
      if(node.content)visit(node.content);
    };
    visit(parseHtml(html));
    const key=[...classes].sort().join(' ');
    if(cache.has(key))return cache.get(key);
    const critical=stylesheet.clone();
    critical.walkRules(rule=>{
      // Keep global selectors and negations conservatively, including both themes.
      const keep=selectors.get(rule.selector).filter(branch=>branch.negated||!branch.classes.size||[...branch.classes].some(name=>classes.has(name)));
      if(keep.length)rule.selector=keep.map(branch=>branch.text).join(',');
      else rule.remove();
    });
    critical.walkAtRules(rule=>{if(rule.nodes&&!rule.nodes.length)rule.remove();});
    const result=critical.toString();cache.set(key,result);return result;
  };
}
