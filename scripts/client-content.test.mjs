import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile,readdir} from 'node:fs/promises';
import {compactOffer,projectLanguage} from './client-content-plugin.mjs';
import {loadOffers} from './load-offers.mjs';

test('catalogue projections preserve facts and exclude author editorial fields',async()=>{
 const {OFFERS}=await loadOffers();
 for(const offer of OFFERS){
  const compact=compactOffer(offer);
  for(const [key,value]of Object.entries(offer))if(key!=='editorial')assert.deepEqual(compact[key],value,`${offer.id}.${key}`);
  for(const key of ['description','bestFor','considerations','verdict','capabilities','pricing','gettingStarted','links','inlineLinks'])assert.equal(compact.editorial?.[key],undefined,`${offer.id}.${key}`);
 }
});

test('language projection loads one explicit translation and preserves existing fallbacks',()=>{
 const source={description:{ru:'Русский',en:'English',es:'Español'},list:{ru:['Один'],en:['One']}};
 assert.deepEqual(projectLanguage(source,'ru'),{description:{ru:'Русский'},list:{ru:['Один']}});
 assert.deepEqual(projectLanguage(source,'es'),{description:{es:'Español'},list:{en:['One']}});
 assert.deepEqual(projectLanguage({title:{ru:'Только RU'}},'en'),{title:{ru:'Только RU'}});
});

test('every article component is lazy and shell has no motion runtime dependency',async()=>{
 const app=await readFile('src/App.tsx','utf8');
 const articles=[...app.matchAll(/const (\w+Article) = lazy\(\(\) => importWithRecovery\(\(\) => import\('([^']+)'\)/g)];
 assert.equal(articles.length,22);
 assert.ok(!/import \{ \w+Article \} from '\.\/components\//.test(app));
 for(const file of ['src/App.tsx','src/components/HomeHub.tsx','src/components/RecommendedBadge.tsx','src/components/CryptoSubtitle.tsx'])assert.ok(!(await readFile(file,'utf8')).includes("from 'motion/react'"),file);
 const pkg=JSON.parse(await readFile('package.json','utf8'));assert.equal(pkg.dependencies.motion,undefined);
});

test('mobile section strip remains visible with burger and skies stay within 40 KB each',async()=>{
 const app=await readFile('src/App.tsx','utf8'),background=await readFile('src/components/BackgroundParticles.tsx','utf8');
 assert.ok(app.includes('site-section-navigation py-3 px-4 overflow-x-auto scrollbar-hide'));
 assert.ok(app.includes('flex flex-nowrap md:flex-wrap'));assert.ok(app.includes('<MobileNavigation'));
 assert.ok(background.includes('useState<boolean|null>(null)'));
 assert.ok(background.includes('mobile !== false ? <div className="site-mobile-sky" aria-hidden="true"/>'));
 for(const theme of ['dark','light'])assert.ok((await readFile(`public/sky/${theme}.webp`)).length<=40000);
});

test('build contains language catalogues, per-service chunks and no monolithic editorial chunk',async()=>{
 const assets=await readdir('dist/assets');
 assert.ok(!assets.some(file=>file.startsWith('editorial-data-')||file.startsWith('motion-')));
 for(const lang of ['ru','en','es','zh','ko'])assert.ok(assets.some(file=>file.startsWith(lang+'-')));
 assert.ok(assets.filter(file=>file.startsWith('p3-')).length>=5);
 for(const language of ['ru','en','es','zh','ko']){
  const html=await readFile(`dist/${language==='ru'?'':language+'/'}proxy-vpn/index.html`,'utf8');
  const tag=html.match(/<link\b[^>]*\sdata-client-catalogue\s[^>]*>/)?.[0];
  assert.ok(tag,language);assert.match(tag,new RegExp(`href="/assets/${language}-[^\"]+\\.js"`));
 }
});
