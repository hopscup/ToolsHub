import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {loadOffers} from './load-offers.mjs';
import {partnerEditorialById,partnerMetadataById,getPartnerIntroduction} from '../src/data/partnerCardRefresh.js';
import {splitServiceParagraphs,splitServiceText} from '../src/data/servicePresentation.js';
import {getServiceContextualGuideLinks} from '../src/data/contextualGuideLinks.js';
import {guidePages} from '../src/data/guidePages.js';
import {vpnTerms} from '../src/data/vpnDetails.js';
import {indexablePaths,isIndexablePath,getIndexAlternates} from '../src/data/indexPolicy.js';
import {getExternalLinkRel} from '../src/lib/externalLinks.js';
import {normalizeCopy,staticServiceText} from './partner-copy-helpers.mjs';

const {OFFERS}=await loadOffers();
const source=(await readFile(new URL('./fixtures/partner-cards-5.md',import.meta.url),'utf8')).replaceAll('\r\n','\n');
const snapshot=JSON.parse(await readFile(new URL('./fixtures/partner-cards-5-baseline.json',import.meta.url),'utf8'));
const fields={description:'Описание',capabilities:'Что умеет',pricing:'Цены',bestFor:'Подойдёт',considerations:'Учтите',gettingStarted:'Как начать',verdict:'Вывод'};
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const escape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const linksFor=offer=>[...offer.editorial.links,...getServiceContextualGuideLinks(offer)];
const approved=source.split(/\n# /).slice(1).map(chunk=>{
  const [,name,id,route]=chunk.match(/^(.+?) \((vpn-[a-z-]+), ([^)]+)\)/);
  const editorial=Object.fromEntries(Object.entries(fields).map(([key,label])=>{
    const body=chunk.match(new RegExp('\\*\\*'+label+'(?:\\.)?\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|\\n\\(Ссылки:|$)'))[1].trim();
    return [key,['description','verdict'].includes(key)?body:body.split('\n').filter(Boolean).map(line=>line.replace(/^(?:-|\d+\.)\s+/,'').trim())];
  }));
  const links=[...chunk.matchAll(/«([^»]+)» → (\/[a-z0-9/-]+)/g)].map(match=>({label:match[1],href:match[2]}));
  return {name,id,route,editorial,title:chunk.match(/- Title [^\n]*?: (.+)/)[1],description:chunk.match(/- Description [^\n]*?: (.+)/)[1],links:links.filter((link,index)=>links.findIndex(item=>item.href===link.href)===index)};
});

test('fifth partner batch preserves all Russian copy, paragraph boundaries, metadata and complete link captions',()=>{
  assert.equal(approved.length,5);
  for(const page of approved){
    const offer=OFFERS.find(item=>item.id===page.id);
    for(const [key,value] of Object.entries(page.editorial)){
      assert.deepEqual(offer.editorial[key].ru,value,page.id+': '+key);
      assert.ok(offer.editorial[key].en.length);
    }
    assert.equal(splitServiceParagraphs(offer.editorial.description.ru).length,2);
    assert.equal(splitServiceParagraphs(offer.editorial.description.en).length,2);
    assert.equal(partnerMetadataById[page.id].title.ru,page.title);
    assert.equal(offer.editorial.seoDescription.ru,page.description);
    assert.equal(offer.editorial.dateModified,'2026-11-22');
    for(const link of page.links){
      const matches=linksFor(offer).filter(item=>item.href===link.href);
      assert.equal(matches.length,1,page.id+': duplicate '+link.href);
      assert.equal(matches[0].label.ru,link.label);
    }
    assert.doesNotMatch(JSON.stringify(partnerEditorialById[page.id]),/[\u2013\u2014]|\(Ссылки:|Примечание для Codex/);
  }
  const giga=OFFERS.find(item=>item.id==='vpn-giga');
  assert.equal(giga.editorial.links.filter(link=>link.href==='/guides/vpn-ne-rabotaet-na-4g').length,1);
  const store=OFFERS.find(item=>item.id==='bot-taynik');
  assert.ok(OFFERS.find(item=>item.id==='vpn-taynik').editorial.links.some(link=>link.href==='/account-shop/'+store.slug));
});

test('fifth batch leaves all tile fields, terms, fallbacks, other offers and guide dates unchanged',()=>{
  for(const [id,expected] of Object.entries(snapshot.facts)){
    const {editorial,...facts}=OFFERS.find(item=>item.id===id);
    assert.equal(hash(facts),expected,id);
    for(const [key,value] of Object.entries(snapshot.preservedEditorial[id]))assert.deepEqual(editorial[key],value,id+': '+key);
    assert.match(getExternalLinkRel(facts.url),/sponsored/);
  }
  assert.deepEqual(vpnTerms,snapshot.vpnTerms);
  assert.equal(hash(OFFERS.filter(item=>!snapshot.facts[item.id])),snapshot.others);
  assert.equal(hash(guidePages.map(page=>({id:page.id,datePublished:page.datePublished,dateModified:page.dateModified}))),snapshot.guideDates);
});

test('new editorial and metadata explicitly use English fallback on ES ZH KO',()=>{
  for(const page of approved){
    const offer=OFFERS.find(item=>item.id===page.id);
    for(const language of ['es','zh','ko']){
      for(const key of Object.keys(fields))assert.deepEqual(offer.editorial[key][language],offer.editorial[key].en);
      assert.equal(getPartnerIntroduction(offer,language),offer.editorial.description.en);
      assert.equal(partnerMetadataById[page.id].title[language],partnerMetadataById[page.id].title.en);
      for(const link of offer.editorial.links)assert.equal(link.label[language],link.label.en);
    }
  }
});

test('only the approved RU Quattro card is added to the index while Taynik and translations stay closed',()=>{
  assert.deepEqual(indexablePaths.filter(path=>!snapshot.indexablePaths.includes(path)),['/proxy-vpn/quattro-vpn']);
  assert.deepEqual(snapshot.indexablePaths.filter(path=>!indexablePaths.includes(path)),[]);
  assert.equal(indexablePaths.length,93);
  for(const prefix of ['', '/en','/es','/zh','/ko']){
    assert.equal(isIndexablePath(prefix+'/proxy-vpn/quattro-vpn'),prefix==='');
    assert.equal(isIndexablePath(prefix+'/proxy-vpn/taynik-vpn'),false);
  }
  assert.deepEqual(getIndexAlternates('/proxy-vpn/quattro-vpn'),[{language:'ru',path:'/proxy-vpn/quattro-vpn'},{language:'x-default',path:'/proxy-vpn/quattro-vpn'}]);
  assert.deepEqual(getIndexAlternates('/en/proxy-vpn/quattro-vpn'),[]);
});

test('Dollar homepage remains linked with unchanged inlineLinks when its protocol is omitted in copy',()=>{
  const offer=OFFERS.find(item=>item.id==='vpn-giga-dollar');
  for(const language of ['ru','en','es','zh','ko']){
    const text=offer.editorial.capabilities[language].find(text=>text.includes('dollarvpn.shop'));
    const segments=splitServiceText(text,offer,language);
    assert.equal(segments.map(segment=>segment.text).join(''),text);
    assert.deepEqual(segments.filter(segment=>segment.href),[{text:'dollarvpn.shop',href:'https://dollarvpn.shop'}]);
  }
  assert.deepEqual(splitServiceText('https://dollarvpn.shop',offer,'ru'),[{text:'https://dollarvpn.shop',href:'https://dollarvpn.shop'}]);
  for(const text of ['notdollarvpn.shop','sub.dollarvpn.shop','dollarvpn.shop.evil.test','https://notdollarvpn.shop'])assert.ok(splitServiceText(text,offer,'ru').every(segment=>!segment.href));
});

test('static fifth-batch cards include full copy, single links, fixed dates, original H1 and approved index status',async()=>{
  const sitemap=(await Promise.all(['money','core','services'].map(name=>readFile('dist/sitemap-'+name+'.xml','utf8')))).join('');
  const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>new URL(match[1]).pathname).map(path=>path==='/'?'/':path.replace(/\/$/,''));
  assert.deepEqual(urls.sort(),[...snapshot.indexablePaths,'/proxy-vpn/quattro-vpn'].sort());
  for(const page of approved)for(const prefix of ['', '/en','/es','/zh','/ko']){
    const language=prefix?'en':'ru',offer=OFFERS.find(item=>item.id===page.id);
    const html=await readFile('dist'+prefix+page.route+'/index.html','utf8');
    const body=html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1],text=staticServiceText(body);
    assert.ok(html.includes('<title>'+escape(partnerMetadataById[page.id].title[language])+'</title>'));
    assert.ok(html.includes('name="description" content="'+escape(partnerMetadataById[page.id].description[language])+'"'));
    const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(match=>JSON.parse(match[1]));
    assert.equal(schemas.find(schema=>schema['@type']==='WebPage').dateModified,'2026-11-22');
    if(!prefix||prefix==='/en')assert.ok(body.includes('<h1>'+escape(snapshot.headings.find(item=>item.route===prefix+page.route).h1)+'</h1>'));
    for(const key of Object.keys(fields))for(const value of Array.isArray(offer.editorial[key][language])?offer.editorial[key][language]:[offer.editorial[key][language]])assert.ok(text.includes(escape(normalizeCopy(value))),page.id+': '+key+' '+prefix);
    for(const paragraph of splitServiceParagraphs(offer.editorial.description[language]))assert.equal(body.split('<p>'+escape(paragraph)+'</p>').length-1,1);
    for(const link of linksFor(offer)){
      const href=prefix+link.href,caption=link.label[language]||link.label.en;
      assert.equal(body.split('<a href="'+href+'">'+escape(caption)+'</a>').length-1,1,page.id+': '+href);
      if(link.href.startsWith('/guides/'))assert.equal(body.split('href="'+href+'"').length-1,1);
    }
    assert.match(html,isIndexablePath(prefix+page.route)?/name="robots" content="index, follow/:/name="robots" content="noindex, follow"/);
    if(page.id==='vpn-giga-dollar')assert.ok(body.includes('<a href="https://dollarvpn.shop" rel="noopener noreferrer">dollarvpn.shop</a>'));
    assert.doesNotMatch(body,/FAQPage|data-related-articles|\(Ссылки:|Примечание для Codex/);
  }
});
