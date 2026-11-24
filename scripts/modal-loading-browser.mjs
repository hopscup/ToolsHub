import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
import {loadOffers} from './load-offers.mjs';
import {isAnalyticsUrl,fulfillBlockedAnalytics} from './analytics-test-policy.mjs';
import {getExternalLinkRel} from '../src/lib/externalLinks.js';

const origin=process.env.MODAL_TEST_ORIGIN || 'http://127.0.0.1:3013';
const output=path.resolve(process.env.MODAL_TEST_OUTPUT || '../../reports/modal-loading-2026-11-24');
await mkdir(output,{recursive:true});
const {OFFERS}=await loadOffers();
const ids=['p3','st-dark','vpn-all','zarub','ant-shardx'];
const report={origin,cpuSlowdown:4,network:{latency:150,downloadThroughput:1600000/8,uploadThroughput:750000/8},checks:[],errors:[]};
const browser=await chromium.launch({executablePath:process.env.MODAL_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try {
  for(const theme of ['dark','light']) {
    const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
    await context.addInitScript(value=>{
      localStorage.setItem('hopscup-site-theme',value);
      localStorage.setItem('hopscup-analytics-consent','denied');
    },theme);
    const requests=[],gates=new Map();
    await context.route('**/*',async route=>{
      const url=route.request().url();
      if(isAnalyticsUrl(url))return fulfillBlockedAnalytics(route);
      if(!url.startsWith(origin+'/'))return route.continue();
      const id=new URL(url).pathname.match(/^\/assets\/(p3|st-dark|vpn-all|zarub|ant-shardx)-/)?.[1];
      requests.push({url,id,time:Date.now()});
      if(id && gates.has(id))await gates.get(id).promise;
      return route.continue();
    });
    const page=await context.newPage();
    page.setDefaultTimeout(30000);
    page.on('pageerror',error=>report.errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')report.errors.push(message.text());});
    const cdp=await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions',{offline:false,...report.network,connectionType:'cellular4g'});
    await page.goto(origin+'/',{waitUntil:'networkidle',timeout:60000});
    await page.waitForFunction(()=>document.querySelector('[data-home-featured]'));
    await page.waitForFunction(()=>performance.getEntriesByType('resource').some(entry=>entry.name.includes('/CatalogToolsDialogs-')));
    assert.equal(requests.filter(request=>request.id).length,0,'Idle preload must not fetch all service texts');
    await page.evaluate(()=>{
      window.__modalFrames={rawLoading:false,openedAt:0,clickedAt:0};
      document.addEventListener('pointerdown',()=>{window.__modalFrames.clickedAt=performance.now();window.__modalFrames.openedAt=0;},true);
      new MutationObserver(()=>{
        if(/Загрузка\.\.\.|Loading\.\.\./.test(document.querySelector('#root')?.textContent || ''))window.__modalFrames.rawLoading=true;
        if(document.querySelector('[data-service-modal-frame]')&&!window.__modalFrames.openedAt)window.__modalFrames.openedAt=performance.now();
      }).observe(document.querySelector('#root'),{subtree:true,childList:true,characterData:true});
    });
    for(const id of ids) {
      const offer=OFFERS.find(item=>item.id===id);
      let release;
      gates.set(id,{promise:new Promise(resolve=>{release=resolve;})});
      const card=page.locator(`[data-catalog-card="${id}"]`);
      await card.scrollIntoViewIfNeeded();
      const button=card.getByRole('link',{name:'Подробнее',exact:true});
      await button.tap();
      const dialog=page.locator('[data-service-modal-frame]');
      await dialog.waitFor();
      await dialog.locator('.service-editorial-skeleton').first().waitFor();
      assert.equal(await dialog.locator(`a[href="${offer.url}"]`).count(),1);
      assert.equal(await dialog.locator(`a[href="${offer.url}"]`).getAttribute('rel'),getExternalLinkRel(offer.url));
      assert.equal(await dialog.locator('img').first().getAttribute('alt'),offer.name);
      if(offer.promoCode)assert.ok((await dialog.textContent()).includes(offer.promoCode));
      await page.waitForTimeout(300);
      const before=await dialog.boundingBox();
      const footerBefore=await dialog.locator(`a[href="${offer.url}"]`).boundingBox();
      await page.screenshot({path:path.join(output,`${theme}-${id}-opening.png`)});
      release();
      await dialog.locator('[data-offer-description][aria-busy="false"] [data-service-paragraphs] p').first().waitFor();
      await page.waitForTimeout(200);
      const after=await dialog.boundingBox();
      const footerAfter=await dialog.locator(`a[href="${offer.url}"]`).boundingBox();
      assert.ok(Math.abs(before.height-after.height)<1,'Modal height changed after editorial load');
      assert.ok(Math.abs(footerBefore.y-footerAfter.y)<1,'Primary CTA moved after editorial load');
      assert.equal(await dialog.locator('.service-editorial-skeleton').count(),0);
      await page.screenshot({path:path.join(output,`${theme}-${id}-ready.png`)});
      const timing=await page.evaluate(()=>window.__modalFrames);
      assert.equal(timing.rawLoading,false);
      assert.equal(requests.filter(request=>request.id===id).length,1,'Duplicate editorial request');
      report.checks.push({theme,id,openMs:Math.round(timing.openedAt-timing.clickedAt),heightBefore:before.height,heightAfter:after.height,footerShift:footerAfter.y-footerBefore.y,editorialRequests:1,rawLoading:false});
      console.log(JSON.stringify(report.checks.at(-1)));
      await dialog.getByRole('button',{name:'Закрыть',exact:true}).tap();
      await dialog.waitFor({state:'detached'});
      await page.waitForURL(origin+'/');
      await card.scrollIntoViewIfNeeded();
      await card.getByRole('link',{name:'Подробнее',exact:true}).tap();
      await dialog.locator('[data-offer-description][aria-busy="false"] p').first().waitFor();
      assert.equal(requests.filter(request=>request.id===id).length,1);
      await dialog.getByRole('button',{name:'Закрыть',exact:true}).tap();
      await dialog.waitFor({state:'detached'});
    }
    await page.goto(origin+'/proxy-vpn',{waitUntil:'networkidle',timeout:60000});
    for(const name of ['Прокси чекер','Какие прокси мне выбрать?']) {
      await page.waitForFunction(()=>performance.getEntriesByType('resource').some(entry=>entry.name.includes('/CatalogToolsDialogs-')));
      const button=page.getByRole(name==='Прокси чекер'?'button':'link',{name,exact:true});
      const before=requests.filter(request=>request.url.includes('/CatalogToolsDialogs-')).length;
      await button.tap();
      await page.getByRole('heading',{name,exact:true}).waitFor();
      await page.waitForTimeout(300);
      assert.ok(!/Загрузка\.\.\.|Loading\.\.\./.test(await page.locator('#root').textContent()));
      assert.equal(requests.filter(request=>request.url.includes('/CatalogToolsDialogs-')).length,before);
      await page.screenshot({path:path.join(output,`${theme}-${name==='Прокси чекер'?'checker':'chooser'}.png`)});
      await page.goto(origin+'/proxy-vpn',{waitUntil:'networkidle',timeout:60000});
    }
    await context.close();
  }
  assert.equal(report.errors.length,0);
  report.passed=true;
} catch(error) {
  report.passed=false;report.failure=error.stack;throw error;
} finally {
  await writeFile(path.join(output,'slow-phone.json'),JSON.stringify(report,null,2));
  await browser.close();
}
