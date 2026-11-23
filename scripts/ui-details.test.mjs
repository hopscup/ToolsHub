import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile,stat} from 'node:fs/promises';
import {categoryFilterCount,groupCatalogOffers,shouldGroupCatalogOffers} from '../src/lib/catalogCounts.js';
import {loadOffers} from './load-offers.mjs';
import {getPartnerIntroduction} from '../src/data/partnerCardRefresh.js';
import {normalizeServiceText,splitServiceParagraphs} from '../src/data/servicePresentation.js';
const {OFFERS}=await loadOffers();
test('filter counts come from current offers, including antidetect and multi-category filters',()=>{
 assert.equal(categoryFilterCount(OFFERS,'Proxy','Proxy'),7);assert.equal(categoryFilterCount(OFFERS,'Proxy','VPN'),9);
 for(const filter of ['PCBasic','PCAdvanced','Mobile'])assert.ok(categoryFilterCount(OFFERS,'Antidetect',filter)>0);
 assert.equal(categoryFilterCount([{category:'Proxy',subCategory:'Other',subCategories:['VPN']}],'Proxy','VPN'),1);
});
test('Montserrat uses local variable WOFF2 Cyrillic and Latin faces for all five requested weights',async()=>{
 const css=await readFile('src/theme.css','utf8');
 for(const subset of ['latin','cyrillic'])assert.equal((await readFile('public/fonts/montserrat/montserrat-'+subset+'.woff2')).subarray(0,4).toString(),'wOF2');
 assert.equal((css.match(/font-display:swap/g)||[]).length,2);assert.equal((css.match(/font-weight:400 800/g)||[]).length,2);
 assert.match(css,/#hero-title \{ font-family:'Space Grotesk'/);assert.doesNotMatch(css,/Unbounded|heading-preview/);
 assert.ok(css.includes('html[data-guide-article] .proxy-guide-article article :is(h2,h3)'));
 const base=await readFile('src/index.css','utf8');assert.ok(base.includes('--font-sans: "Inter"'));assert.ok(!css.includes('font-size:13px;font-weight:600;letter-spacing:.04em'));
 const html=await readFile('index.html','utf8');assert.ok(html.includes("if (guide) ['latin', 'cyrillic']"));assert.ok(!html.includes('<link rel="preload" href="/fonts/montserrat'));
});

test('active counters, secondary outlines, mobile controls and video play have dedicated protected styles',async()=>{
 const css=await readFile('src/theme.css','utf8');
 for(const token of ['--site-secondary-outline:#c084fc','background:rgb(255 255 255 / 22%)','background:rgb(255 255 255 / 8%)','background:rgb(0 0 0 / 6%)','border:1px solid rgb(192 132 252 / 60%)','flex-wrap:nowrap','width:44px;height:44px','background:var(--site-accent)'])assert.ok(css.includes(token));
 assert.ok(!css.includes('background:rgb(0 0 0 / 66%)'));assert.ok(!css.includes('html[data-site-theme] .site-filter-chip:not([aria-pressed="true"])'));
 const video=await readFile('src/components/ArticleVideo.tsx','utf8');assert.ok(video.includes('site-video-play'));assert.ok(!video.includes('rounded-full bg-black/80'));
});

test('dark secondary actions use neutral resting styles and pointer-aware glow; play stays centered and responsive',async()=>{
 const css=await readFile('src/theme.css','utf8');
 for(const token of ['background:#7e1bff !important','background:rgb(255 255 255 / 7%)','border:1px solid rgb(255 255 255 / 12%)','box-shadow:none !important;transition:background-color 200ms,box-shadow 200ms','@media(hover:hover) and (pointer:fine)','@media(hover:none),(pointer:coarse)','0 10px 30px -12px rgb(126 27 255 / 55%)','top:50%;left:50%;transform:translate(-50%,-50%)','width:48px;height:48px','width:72px;height:72px','width:20px;height:20px','width:28px;height:28px','svg.lucide { color:#7e1bff !important; }'])assert.ok(css.includes(token),token);
 const video=await readFile('src/components/ArticleVideo.tsx','utf8');assert.ok(!video.includes('h-14 w-14'));assert.ok(!video.includes('absolute inset-0 flex items-center justify-center'));
 const app=await readFile('src/App.tsx','utf8');for(const token of ['data-touch-pressed','onPointerUpCapture={clearActionPress}','onPointerCancelCapture={clearActionPress}','onPointerLeave={clearActionPress}','contains(event.relatedTarget)'])assert.ok(app.includes(token));
});
test('mobile sky is lightweight and the existing desktop star and film renderer stays in place',async()=>{
 for(const theme of ['dark','light'])assert.ok((await stat('public/sky/'+theme+'.webp')).size<40000);
 const source=await readFile('src/components/BackgroundParticles.tsx','utf8');
 for(const text of ['320','1000 / 60','generateGrain()','drawScratches()','visibilitychange','<DesktopParticles/>'])assert.ok(source.includes(text));
 assert.equal((source.match(/<canvas/g)||[]).length,2);
});
test('card facts, promo area, large Details CTA and desktop navigation keep their original classes',async()=>{
 const app=await readFile('src/App.tsx','utf8');
 for(const text of ['const InfoRow','w-full flex items-center justify-center gap-3 py-5 bg-brand-purple','p-7 rounded-[1.5rem]','shadow-2xl','<LanguageToggle lang={lang} />'])assert.ok(app.includes(text));
 const menu=app.slice(app.indexOf('{/* Bottom Row: Categories */}'),app.indexOf('{/* Hero Section */}'));
 assert.ok(!menu.includes('site-filter-count'));
});
test('recommendation keeps its 26px button and existing tooltip text while changing only glass styling',async()=>{
 const source=await readFile('src/components/RecommendedBadge.tsx','utf8');
 for(const text of ['h-[26px] w-[26px]','Выбираю чаще всего','customLabel','right-4 top-4','linearGradient','#F5A94A','#7E1BFF','site-recommend-tooltip'])assert.ok(source.includes(text));
});

test('new effects use one-shot intersection reveals, successful-copy bursts, reduced motion and neutral social exceptions',async()=>{
 const effects=await readFile('src/lib/uiEffects.ts','utf8'),css=await readFile('src/theme.css','utf8'),particles=await readFile('src/components/BackgroundParticles.tsx','utf8'),app=await readFile('src/App.tsx','utf8');
 for(const token of ['IntersectionObserver','observer?.unobserve','seen.current.add','prefers-reduced-motion: reduce','index < 6','animationend','star.remove()','burst.remove()'])assert.ok(effects.includes(token),token);
 for(const token of ['site-wordmark-window 9s','site-wordmark-text 9s','site-card-rise','site-copy-star','site-star-glint','svg.site-search-icon','site-social-button svg.lucide'])assert.ok(css.includes(token),token);
 for(const token of ['visibilitychange','rgba(45, 45, 52','site-mobile-twinkles'])assert.ok(particles.includes(token),token);
 assert.ok(!particles.includes('prefers-reduced-motion'));assert.equal((particles.match(/<i\/>/g)||[]).length,5);
 assert.ok(app.includes('burstPromoStars(sourceId)'));assert.equal((app.match(/data-promo-source=/g)||[]).length,3);assert.ok(!app.includes('delay: index * 0.1'));assert.ok(!app.includes('initial={{ opacity: 0, y: 30 }}'));
 for(const theme of ['dark','light'])assert.ok((await stat('public/sky/twinkles-'+theme+'.webp')).size<20000);
});

test('light neutral boundaries are explicit and do not replace the accent action borders or dark theme',async()=>{
 const css=await readFile('src/theme.css','utf8'),app=await readFile('src/App.tsx','utf8');
 for(const token of ['--site-line:#c8cbd4;--site-outline:#b4b8c4','border-color:var(--site-outline) !important','site-search-field:focus-within','[data-catalog-card]:hover'])assert.ok(css.includes(token));
 assert.ok(app.includes('site-search-field max-w-2xl'));
 assert.ok(css.includes('html[data-site-theme] .site-section-actions > :is(a,button) { border-color:var(--site-secondary-outline) !important; }'));
 assert.ok(css.includes('html[data-site-theme="light"] .site-section-controls .site-section-actions > :is(a,button) { color:#1d1d1f !important; }'));
 assert.ok(!css.includes('html[data-site-theme="light"] .site-section-controls .site-section-actions svg.lucide { color:inherit !important; }'));
});

test('three approved partner cards retain their authored description before facts in React and static pages',async()=>{
 const app=await readFile('src/App.tsx','utf8');
 assert.ok(app.indexOf('data-offer-description')<app.indexOf('data-offer-facts'));
 assert.ok(app.includes('key={selectedOffer.id} data-offer-scroll'));
 assert.ok(app.includes('getPartnerIntroduction(selectedOffer, lang) || offerDescription(selectedOffer)'));
 for(const [id,route]of [['p3','proxy-vpn/proxywing'],['st-dark','account-shop/darkstore'],['vpn-ppl','proxy-vpn/ppl-vpn']]){
  const offer=OFFERS.find(o=>o.id===id),intro=getPartnerIntroduction(offer,'ru');assert.ok(intro);
  const html=await readFile(`dist/${route}/index.html`,'utf8'),text=normalizeServiceText(html.replace(/<[^>]*>/g,' '));
  for(const paragraph of splitServiceParagraphs(intro))assert.ok(text.includes(normalizeServiceText(paragraph)),id);
  const first=splitServiceParagraphs(intro)[0].replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  assert.ok(html.indexOf(first)>=0&&html.indexOf(first)<html.indexOf('data-service-facts'),id);
 }
});

test('surfaces shield the sky, the light header has a small shadow, and promo stars keep visible sizes',async()=>{
 const css=await readFile('src/theme.css','utf8'),effects=await readFile('src/lib/uiEffects.ts','utf8');
 for(const token of ['backdrop-filter:blur(10px)','rgb(22 20 27 / 90%)','rgb(255 255 255 / 94%)','0 8px 24px -16px rgb(0 0 0 / 12%)','site-copy-star 650ms','rotate(65deg)','background:#a05bff'])assert.ok(css.includes(token),token);
 assert.ok(!css.includes('mask-image:radial-gradient(ellipse 60% 75%'));
 assert.ok(effects.includes('const radius = 28 + index % 3 * 5'));assert.ok(effects.includes('const size = 8 + index % 3'));assert.ok(!effects.includes('42 + index'));
});

test('All catalogue groups retain each service once and preserve relative order in each subtype',()=>{
 const proxy=OFFERS.filter(o=>o.category==='Proxy'),groups=groupCatalogOffers(proxy,['Proxy','VPN']);
 assert.deepEqual(groups.map(g=>[g.id,g.offers.length]),[['Proxy',7],['VPN',9]]);
 for(const group of groups)assert.deepEqual(group.offers.map(o=>o.id),proxy.filter(o=>o.subCategory===group.id).map(o=>o.id));
 const overlap=[{id:'one',subCategory:'NoKYC',subCategories:['WithKYC']},{id:'two',subCategory:'WithKYC'},{id:'other'}];
 const cards=groupCatalogOffers(overlap,['NoKYC','WithKYC']);assert.deepEqual(cards.flatMap(g=>g.offers).map(o=>o.id),['one','two','other']);
});

test('background remains animated with reduced motion while foreground effects remain disabled',async()=>{
 const css=await readFile('src/theme.css','utf8'),source=await readFile('src/components/BackgroundParticles.tsx','utf8');
 const reduced=css.slice(css.lastIndexOf('@media(prefers-reduced-motion:reduce)'));
 assert.ok(!reduced.includes('site-mobile-sky'));assert.ok(!reduced.includes('site-mobile-twinkles'));
 assert.ok(reduced.includes('.site-wordmark-glint,.site-recommend-glint i { animation:none'));
 assert.ok(!source.includes('reducedMotion'));assert.ok(css.includes('animation:site-meteor 20s'));
 for(const delay of ['4s','8s','12s','16s'])assert.ok(css.includes('animation-delay:'+delay));
});

test('only the Proxy section groups its All catalogue; search, home and other categories stay flat',()=>{
 assert.equal(shouldGroupCatalogOffers('Proxy','None',''),true);
 for(const category of ['Antidetect','Stores','AI','Cards','Crypto','Social','Steam','SMS','VPS','Guides'])assert.equal(shouldGroupCatalogOffers(category,'None',''),false,category);
 for(const filter of ['Proxy','VPN'])assert.equal(shouldGroupCatalogOffers('Proxy',filter,''),false);
 assert.equal(shouldGroupCatalogOffers('Proxy','None','test'),false);assert.equal(shouldGroupCatalogOffers('Proxy','None','',true),false);
});

test('catalogue and all article header templates keep theme, language and mobile menu in DOM order',async()=>{
 const app=await readFile('src/App.tsx','utf8'),header=app.slice(app.indexOf('className="site-header-actions'),app.indexOf('{/* Bottom Row: Categories */}'));
 assert.ok(header.indexOf('<SiteThemeToggle')<header.indexOf('<LanguageToggle'));assert.ok(header.indexOf('<LanguageToggle')<header.indexOf('<MobileNavigation'));
 for(const name of ['ImportedGuideArticle','ProxyGuideArticle','AntidetectSetupGuideArticle','GmailForwardingGuideArticle','MobileIpGuideArticle','MobileProxyComparisonArticle']){
  const source=await readFile('src/components/'+name+'.tsx','utf8'),actions=source.slice(source.indexOf('className="site-header-actions'),source.indexOf('</header>'));
  assert.ok(actions.indexOf('className="article-theme-toggle')<actions.indexOf('<ArticleLanguageLink'),name);
  assert.ok(actions.indexOf('<ArticleLanguageLink')<actions.indexOf('<MobileNavigation'),name);
  assert.ok(!actions.slice(actions.indexOf('<MobileNavigation')).includes('<a '),name+' burger must be rightmost');
 }
});
