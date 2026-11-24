import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {createServiceContentCache} from '../src/lib/serviceContentCache.js';
import {createPreloader,scheduleIdlePreload} from '../src/lib/idlePreload.js';

test('service intent, click and reopen share one language-specific request',async()=>{
  const calls=[];
  const cache=createServiceContentCache(async key=>{calls.push(key);return {key};});
  const intent=cache.load('ru/p3');
  assert.equal(cache.get('ru/p3'),undefined);
  assert.equal(cache.load('ru/p3'),intent);
  const value=await intent;
  assert.equal(cache.get('ru/p3'),value);
  assert.equal(await cache.load('ru/p3'),value);
  await cache.load('en/p3');
  assert.deepEqual(calls,['ru/p3','en/p3']);
});

test('failed editorial loads can be retried without reloading the page',async()=>{
  let calls=0;
  const cache=createServiceContentCache(async()=>{if(++calls===1)throw Error('offline');return 'ready';});
  await assert.rejects(cache.load('ru/p3'),/offline/);
  assert.equal(cache.get('ru/p3'),undefined);
  assert.equal(await cache.load('ru/p3'),'ready');
  assert.equal(calls,2);
});

test('idle dialog warming waits for page load, deduplicates imports and supports cancellation',async()=>{
  let load,run,calls=0,cancelled;
  const target={document:{readyState:'loading'},addEventListener:(event,callback)=>{assert.equal(event,'load');load=callback;},removeEventListener:()=>{},requestIdleCallback:(callback,options)=>{assert.equal(options.timeout,2000);run=callback;return 7;},cancelIdleCallback:id=>{cancelled=id;}};
  const preload=createPreloader(async()=>++calls);
  const cancel=scheduleIdlePreload(()=>void preload(),target);
  assert.equal(run,undefined);
  load();assert.equal(calls,0);
  run();await preload();await preload();assert.equal(calls,1);
  cancel();assert.equal(cancelled,7);
  run();await Promise.resolve();assert.equal(calls,1);
});

test('idle warming falls back to a cancellable timeout on unsupported browsers',()=>{
  let run,cleared,calls=0;
  const target={document:{readyState:'complete'},removeEventListener:()=>{},setTimeout:(callback,delay)=>{assert.equal(delay,250);run=callback;return 9;},clearTimeout:id=>{cleared=id;}};
  const cancel=scheduleIdlePreload(()=>calls++,target);
  assert.equal(calls,0);run();assert.equal(calls,1);cancel();run();assert.equal(calls,1);assert.equal(cleared,9);
});

test('card chrome is eager, text is intent-loaded, and lazy windows have no raw loading overlay',async()=>{
  const app=await readFile('src/App.tsx','utf8');
  const frame=await readFile('src/components/ServiceModalFrame.tsx','utf8');
  const css=await readFile('src/components/service-modal.css','utf8');
  assert.ok(app.includes("import {ServiceModalFrame} from './components/ServiceModalFrame'"));
  for(const event of ['onPointerEnter','onFocusCapture','onTouchStart'])assert.ok(app.includes(`${event}={() => handleOfferIntent(offer)}`),event);
  assert.ok(app.includes('getCachedServiceContent(offer.id, lang) || offer'));
  assert.ok(app.includes('scheduleIdlePreload'));
  assert.ok(app.includes('loadCatalogToolsDialogs().then'));
  assert.ok(app.includes('<Suspense fallback={null}><CatalogToolsDialogs'));
  assert.ok(!app.includes('Загрузка...'));assert.ok(!app.includes('Loading...'));
  assert.ok(frame.includes('(loaded || isCatalogModal)'));
  for(const token of ['data-offer-description','selectedOffer.cardStats','selectedOffer.details?.geo','selectedOffer.url','selectedOffer.webUrl','selectedOffer.promoCode','EditorialSkeleton'])assert.ok(frame.includes(token),token);
  assert.ok(css.includes('height:calc(100dvh - 2rem)'));
  assert.ok(css.includes('150ms'));assert.ok(!css.includes('prefers-reduced-motion'));assert.ok(css.includes('data-site-theme="light"'));
});
