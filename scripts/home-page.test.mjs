import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {homeCopy,homeHeroCopy,homeSeo,homeFeaturedIds,homeGuideEnglish,homeLink,getHomeSelections} from '../src/data/homePage.js';
import {homeStats} from '../src/lib/homeStats.js';
import {guideCatalog} from '../src/data/guideCatalog.js';
import {guidePages} from '../src/data/guidePages.js';
import {loadOffers} from './load-offers.mjs';
import {plainSeoText,getServiceFacts} from '../src/data/servicePresentation.js';
const {OFFERS}=await loadOffers(),home=getHomeSelections(OFFERS);

test('homepage counts and featured services use live data without modifying the offer order',()=>{
 assert.equal(home.serviceCount,OFFERS.filter(offer=>offer.category!=='Guides').length);
 assert.equal(home.guideCount,guideCatalog.filter(guide=>guide.indexable!==false).length);
 assert.deepEqual(home.featured.map(offer=>offer.id),homeFeaturedIds);
 assert.deepEqual(homeFeaturedIds,['p6','p3','st-dark','zarub','vpn-all','ant-shardx']);
 const dates=Object.fromEntries(guidePages.map(page=>[page.id,page.datePublished]));
 for(const guide of home.guides)assert.notEqual(guide.indexable,false);
 for(let i=1;i<home.guides.length;i++)assert.ok(Date.parse(dates[home.guides[i-1].id])>=Date.parse(dates[home.guides[i].id]));
 assert.equal(home.guides.length,4);
});

test('RU and EN static homepages contain every authored hub paragraph, link, featured service and latest guide',async()=>{
 for(const language of ['ru','en']){
  const html=await readFile(`dist/${language==='ru'?'':'en/'}index.html`,'utf8');
  const staticHtml=html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1]||'';
  const text=plainSeoText(staticHtml.replace(/<[^>]*>/g,' '));
  assert.equal((staticHtml.match(/<h1[ >]/g)||[]).length,1);
  assert.ok(html.includes(`<title>${homeSeo.title[language]}</title>`));
  for(const copy of [...Object.values(homeCopy),...Object.values(homeHeroCopy)])if(copy?.[language])for(const paragraph of Array.isArray(copy[language])?copy[language]:[copy[language]])assert.ok(text.includes(plainSeoText(paragraph)),paragraph);
  for(const task of homeHeroCopy.tasks){assert.ok(text.includes(task.title[language]));const offer=OFFERS.find(item=>item.id===task.offerId);assert.ok(text.includes(offer.name));}
  assert.ok(staticHtml.includes('id="home-tasks"'));
  assert.deepEqual([...staticHtml.matchAll(/data-service-summary="([^"]+)"/g)].map(match=>match[1]),homeFeaturedIds);
  for(const task of homeCopy.tasks){assert.ok(text.includes(task.title[language]));assert.ok(text.includes(task.text[language]));for(const link of task.links){assert.ok(staticHtml.includes(`href="${homeLink(link.href,language)}"`));assert.ok(text.includes(link.label[language]));}}
  for(const offer of home.featured){
    assert.ok(staticHtml.includes(`data-service-summary="${offer.id}"`));
    if(offer.promoCode)assert.ok(staticHtml.includes(`<code>${offer.promoCode}</code>`));
    for(const fact of getServiceFacts(offer,language))assert.ok(text.includes(plainSeoText(String(fact.value))),`${offer.id}: ${fact.key}`);
  }
  for(const guide of home.guides){assert.ok(staticHtml.includes(`href="${guide.route}"`));if(language==='en'&&homeGuideEnglish[guide.id])assert.ok(text.includes(homeGuideEnglish[guide.id].title));}
  assert.ok(!/[\u2013\u2014]/u.test(Object.values(homeCopy).flatMap(value=>typeof value==='object'&&value?.[language]?[value[language]]:[]).join(' ')));
 }
});

test('homepage composes the existing service and guide renderers and leaves inactive category navigation',async()=>{
 const app=await readFile('src/App.tsx','utf8'),hub=await readFile('src/components/HomeHub.tsx','utf8');
 assert.ok(app.includes('services={renderServiceCards(home.featured)}'));
 assert.ok(app.includes('const isActive = !isHomeHub && activeCategory === cat.id'));
 assert.ok(app.includes('!isHomeHub && Boolean(activeCategoryData'));
 assert.ok(app.includes('isHomeHub ? <HomeHero'));
 assert.ok(app.includes('stats={homeStats(OFFERS, home.guideCount)}'));
 assert.ok(hub.includes('id="home-tasks"'));
 assert.ok(!hub.includes('<style'));assert.ok(!hub.includes('animate='));
 assert.equal(homeLink('/guides/happ-marshrutizaciya','en'),'/guides/happ-marshrutizaciya');
 assert.equal(homeLink('/ai','en'),'/en/ai');
});

test('all three supplied hero files remain byte-identical to hero-code.zip',async()=>{
 const hashes={
  'src/components/HomeHero.tsx':'37a18d868ba565ef5785b5e812721b2881470ed5b22b99dcc5436a741fe57875',
  'src/components/home-hero.css':'398684849a76260ee4a5517fd2f9188bd97330dfb357117d9fdf685c26ad9b24',
  'src/lib/homeStats.js':'0c6810fd85f3adb26312de1c5bbc4f1a0106453fc37004517d724a8ad32cdd6d',
 };
 for(const [file,expected]of Object.entries(hashes))assert.equal(createHash('sha256').update(await readFile(file)).digest('hex'),expected,file);
});

test('supplied stats count actual services, ruble payments and published indexable guides',()=>{
 assert.deepEqual(homeStats(OFFERS,home.guideCount),{services:107,rub:76,guides:21});
 assert.deepEqual(homeStats([{category:'Guides'},{category:'Proxy',details:{paymentMethods:{ru:'СБП'}}},{category:'Cards',cardStats:{topup:{en:'Russian card'}}},{category:'AI',details:{paymentMethods:{ru:'USDT'}}}],7),{services:3,rub:2,guides:7});
});

test('shared header, footer, mobile menu and theme toggle retain their pre-integration source',async()=>{
 const hash=text=>createHash('sha256').update(text.replaceAll('\r\n','\n')).digest('hex'),s=await readFile('src/App.tsx','utf8');
 const header=s.slice(s.indexOf('      {/* Unified Header & Navigation */}'),s.indexOf('      {/* Hero Section */}')),a=s.indexOf('      <footer className='),footer=s.slice(a,s.indexOf('      </footer>',a)+15);
 assert.equal(hash(header.replace('site-section-navigation py-3 px-4 overflow-x-auto scrollbar-hide','site-section-navigation hidden py-3 px-4 overflow-x-auto scrollbar-hide md:block')),'48e2a8a1d78f23e8ceed79bc55d1f39b40c16a517a68b3da0065e1b464ad8a99');
 assert.equal(hash(footer),'9e3a50a951d18276e194d29ea5e87dfabc8f604c63d4e8d0a48ad834e8169d30');
 assert.equal(hash(await readFile('src/components/MobileNavigation.tsx','utf8')),'3355e16243429a9ade4a5123e8289965154351f39d4543044ce052929b73ca9f');
 assert.equal(hash(await readFile('src/components/SiteTheme.tsx','utf8')),'e9303fed97e7bbd53b6ecd6eba1de66f03e908568b0575b478b16e8af9142ec7');
});
