import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {loadOffers} from './load-offers.mjs';
import {splitServiceParagraphs,normalizeServiceText,serviceCategoryRoutes} from '../src/data/servicePresentation.js';
import {withoutEditorialParagraphBreaks} from './partner-copy-helpers.mjs';
const {OFFERS}=await loadOffers();
const ids=['st-dark','p6','p3','p4','p1','zarub','pgon','bot-lachuga','ant-shardx'];
const fixture=(await readFile(new URL('./fixtures/partner-description-paragraphs.md',import.meta.url),'utf8')).replaceAll('\r\n','\n');
const approved=Object.fromEntries(fixture.split(/\n## /).slice(1).map(section=>[section.match(/^([a-z0-9-]+) /)[1],section.slice(section.indexOf('\n')+1).trim()]));
const escape=text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

test('editorial paragraph splitting supports blank lines, CRLF and empty strings without rewriting sentences',()=>{
 assert.deepEqual(splitServiceParagraphs(' First line\ncontinues.\r\n \r\nSecond.\n\n\nThird. '),['First line\ncontinues.','Second.','Third.']);
 assert.deepEqual(splitServiceParagraphs(''),[]);
 assert.deepEqual(splitServiceParagraphs(undefined),[]);
 assert.equal(normalizeServiceText('First.\n\nSecond.'),'First. Second.');
});

test('nine partner introductions match the supplied paragraph boundaries exactly',()=>{
 for(const id of ids){
  const offer=OFFERS.find(item=>item.id===id);
  assert.equal(offer.editorial.description.ru,approved[id],id);
  assert.equal(splitServiceParagraphs(offer.editorial.description.en).length,splitServiceParagraphs(approved[id]).length,id+': EN');
 }
 for(const id of ['vpn-ppl','vpn-imp','vpn-all','vpn-tochka-g'])assert.equal(OFFERS.find(offer=>offer.id===id).editorial.description.ru,approved[id],id+': fourth batch paragraph boundaries');
});

test('paragraph-only changes leave catalogue copy, metadata, verdicts and all other offer data intact',()=>{
 // The separately tested fourth and fifth batches change copy, not just paragraph boundaries.
 const serialized=JSON.stringify(OFFERS.filter(offer=>!['vpn-ppl','vpn-imp','vpn-all','vpn-tochka-g','vpn-giga-dollar','vpn-giga','vpn-prosto','vpn-quattro','vpn-taynik'].includes(offer.id)).map(withoutEditorialParagraphBreaks));
 assert.equal(createHash('sha256').update(serialized).digest('hex'),'b49c20e723fe9d12e0f8c5e77cc3babb9a84f0919b737d678cd0b25b4d9b422a');
 for(const id of ids)assert.ok(!OFFERS.find(offer=>offer.id===id).description.ru.includes('\n\n'),id);
});

test('the shared React paragraph renderer handles descriptions and future multiline verdicts with safe rich links',async()=>{
 const result=await build({entryPoints:['src/components/ServiceEditorialSections.tsx'],bundle:true,platform:'node',format:'esm',jsx:'automatic',write:false,logLevel:'silent'});
 const {ServiceParagraphs}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
 const offer={editorial:{inlineLinks:{en:[{text:'details',href:'/guides/account-farm'},{text:'partner',href:'https://shardx.com/?ref=hopscup'}]}}};
 for(const text of ['First <safe> paragraph.\n\nSecond details paragraph.','Verdict with partner.\r\n\r\nAnother conclusion.']){
  const html=renderToStaticMarkup(createElement(ServiceParagraphs,{text,offer,language:'en'}));
  assert.equal((html.match(/<p>/g)||[]).length,2);
  assert.match(html,/space-y-4/);
  assert.doesNotMatch(html,/<safe>/);
  if(text.includes('details'))assert.ok(html.includes('href="/en/guides/account-farm"'));
  if(text.includes('partner'))assert.ok(html.includes('rel="sponsored noopener noreferrer"'));
 }
});

test('no-JavaScript cards render each RU and EN introduction paragraph once as a separate p',async()=>{
 for(const id of ids)for(const language of ['ru','en']){
  const offer=OFFERS.find(item=>item.id===id);
  const route=(language==='en'?'/en':'')+serviceCategoryRoutes[offer.category]+'/'+offer.slug;
  const html=await readFile('dist'+route+'/index.html','utf8');
  const body=html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1];
  const hero=body.match(/<header class="fallback-hero">([\s\S]*?)<\/header>/)[1];
  const paragraphs=[...hero.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(match=>match[1]);
  const expected=splitServiceParagraphs(offer.editorial.description[language]).map(escape);
  assert.deepEqual(paragraphs,expected,route);
  for(const text of expected)assert.equal(body.split('<p>'+text+'</p>').length-1,1,route);
 }
});
