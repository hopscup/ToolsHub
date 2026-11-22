import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {loadOffers} from './load-offers.mjs';
import {partnerMetadataById} from '../src/data/partnerCardRefresh.js';
import {pageHeadings} from '../src/data/pageHeadings.js';
import {guidePages} from '../src/data/guidePages.js';
import {indexablePaths} from '../src/data/indexPolicy.js';
import {isAffiliateUrl,getExternalLinkRel} from '../src/lib/externalLinks.js';
const {OFFERS}=await loadOffers();
const proxy=OFFERS.find(offer=>offer.id==='p1');
const antidetect=OFFERS.find(offer=>offer.id==='ant-shardx');
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
test('ShardX proxy rebrand preserves the published route and sponsored referral',async()=>{
 assert.equal(proxy.name,'ShardX');
 assert.equal(proxy.slug,'proxyshard');
 assert.equal(proxy.url,'https://shardx.com/?ref=hopscup');
 assert.equal(isAffiliateUrl(proxy.url),true);
 assert.equal(getExternalLinkRel(proxy.url),'sponsored noopener noreferrer');
 assert.equal(proxy.logoUrl,'/shardx-proxy.webp');
 assert.ok((await stat('public'+proxy.logoUrl)).size<20000);
 assert.equal(partnerMetadataById.p1.title.ru,'ShardX (ProxyShard): отзыв, прокси с UDP | Hopscup');
 assert.equal(partnerMetadataById.p1.title.en,'ShardX (ProxyShard) review: UDP proxies | Hopscup');
 assert.equal(pageHeadings['/proxy-vpn/proxyshard'].ru,'ShardX (бывший ProxyShard): разные типы прокси в одном сервисе');
 assert.equal(pageHeadings['/proxy-vpn/proxyshard'].en,'ShardX (formerly ProxyShard): multiple proxy types in one service');
 assert.ok(proxy.editorial.description.ru.startsWith('ShardX, бывший ProxyShard: сервис недавно переименовали'));
 assert.equal(proxy.editorial.bestFor.ru[2],'Тем, кто уже сидит на антидетекте ShardX и хочет прокси от той же команды.');
});
test('rebrand leaves all remaining author sections and the antidetect GitHub link untouched',()=>{
 const keys=['capabilities','pricing','considerations','gettingStarted','verdict','links','setupGuide'];
 const expected={p1:'af5e3ccd390ff273d5c7a85b80c4794c2e813f043e6555d1c6d6d482fdb4f0d0','ant-shardx':'e79d068a73e16dfcf185c9bd8be32693f9df550162559cdce88bf56c6aa47a93'};
 for(const offer of [proxy,antidetect])assert.equal(hash(keys.map(key=>[key,offer.editorial[key]])),expected[offer.id]);
 assert.equal(antidetect.url,'https://github.com/ProxyShard/ShardBrowser');
 assert.equal(antidetect.logoUrl,'/proxyshard.webp');
 assert.ok(antidetect.description.ru.startsWith('ShardX это бесплатный антидетект'));
 assert.equal(antidetect.editorial.setupGuide.href,'/guides/shardx-obzor');
 assert.ok(antidetect.editorial.description.ru.startsWith('ShardX это полностью бесплатный антидетект от одноимённого прокси-сервиса ShardX, раньше он назывался ProxyShard.'));
 for(const offer of [proxy,antidetect])assert.equal(offer.editorial.dateModified,'2026-11-19');
 assert.equal(hash(guidePages.map(page=>({id:page.id,datePublished:page.datePublished,dateModified:page.dateModified}))),'0ed3ebd20646d3e7509e5cd31b3af7bbf43a8dd92a7662f8f6d3e472d4f2cfe9');
 assert.equal(indexablePaths.length,93);
});
test('every guide introduces the proxy former name once and preserves later short mentions',async()=>{
 for(const route of ['/guides/account-farm','/guides/besplatnye-antidetekt-brauzery','/guides/shardx-obzor','/guides/virtualnyj-nomer-dlya-registracii','/guides/youtube-ferma','/guides/claude-iz-rossii-bez-bana','/guides/kak-nastroit-antidetect-brauzer','/proxy-vpn/luchshie-proksi']){
  const html=await readFile('dist'+route+'/index.html','utf8');
  const body=html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1];
  assert.equal(body.split('ShardX (бывший ProxyShard)').length-1,1,route);
  assert.ok(body.includes('https://shardx.com/?ref=hopscup'),route);
  assert.doesNotMatch(body,/антидетект ShardX от ShardX/);
 }
});
test('all rendered HTML drops the old proxy domain and retains distinct proxy and browser routes',async()=>{
 for(const file of (await readdir('dist',{recursive:true})).filter(file=>file.endsWith('.html'))){
  const html=await readFile('dist/'+file,'utf8');
  assert.doesNotMatch(html,/https?:\/\/(?:www\.)?proxyshard\.com/i,file);
 }
 for(const prefix of ['','/en','/es','/zh','/ko']){
  const html=await readFile('dist'+prefix+'/proxy-vpn/proxyshard/index.html','utf8');
  assert.ok(html.includes('https://shardx.com/?ref=hopscup'));
  assert.ok(html.includes('rel="sponsored noopener noreferrer"'));
  const ant=await readFile('dist'+prefix+'/antidetect/shardx/index.html','utf8');
  assert.ok(ant.includes('https://github.com/ProxyShard/ShardBrowser'));
 }
});
