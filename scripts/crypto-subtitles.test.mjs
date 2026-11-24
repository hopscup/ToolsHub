import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {getCryptoSubtitle,cryptoSubtitles} from '../src/data/cryptoSubtitles.js';
import {seoLandingPages} from '../src/data/seoLandingPages.js';

test('crypto subtitles retain exact RU copy with meaningful English variants',()=>{
 const ru={None:'Обменивайте крипту на рубли и обратно без P2P и блокировок',USDTQR:'Оплачивайте криптой прямо на кассе по QR в России и других странах',AML:'Проверьте «чистоту» своего кошелька перед обменом или выводом',Wallet:'Проверенные криптокошельки в разных сетях'};
 for(const [filter,text]of Object.entries(ru)){assert.equal(getCryptoSubtitle(filter,'ru'),text);assert.ok(getCryptoSubtitle(filter,'en').length>20);}
 assert.equal(getCryptoSubtitle('None','es'),cryptoSubtitles.None.en);
 assert.equal(getCryptoSubtitle('unknown','ru'),ru.None);
});

test('direct crypto tab routes initialize the same filters as subtitle selection',async()=>{
 for(const [route,filter]of [['/crypto-exchange/qr-sbp','USDTQR'],['/crypto-exchange/aml-proverka','AML'],['/crypto-exchange/koshelki','Wallet']]){
  assert.equal(seoLandingPages.find(page=>page.route===route).subFilter,filter);
 }
 const app=await readFile('src/App.tsx','utf8');
 assert.ok(app.includes("getSeoLandingFromPath(path)?.subFilter || 'None'"));
 assert.ok(app.includes("activeCategory === 'Crypto' ? <CryptoSubtitle filter={subFilter} language={lang} />"));
 const component=await readFile('src/components/CryptoSubtitle.tsx','utf8');
 for(const token of ['previous.current !== text','[{opacity:0},{opacity:1}]','duration:200'])assert.ok(component.includes(token));
 assert.ok(!component.includes('prefers-reduced-motion'));
 assert.ok(!component.includes('translate'));assert.ok(!component.includes(' y:'));
});

test('crypto subtitle prerender does not change the original noscript or meta description',async()=>{
 const script=await readFile('scripts/postbuild-seo.mjs','utf8');
 assert.ok(!script.includes('cryptoSubtitles'));
 for(const copy of Object.values(cryptoSubtitles))for(const prefix of ['','en/']){
  const html=await readFile(`dist/${prefix}crypto-exchange/index.html`,'utf8');
  const fallback=html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1]||'';
  const description=html.match(/<meta name="description" content="([^"]*)"/)?.[1]||'';
  for(const text of [copy.ru,copy.en]){assert.ok(!fallback.includes(text));assert.ok(!description.includes(text));}
 }
});
