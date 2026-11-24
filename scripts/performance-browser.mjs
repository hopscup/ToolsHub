import assert from 'node:assert/strict';
import path from 'node:path';
import {mkdir,writeFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import {startDistServer} from './content-regression-browser.mjs';
import {isAnalyticsUrl,isWorkstationInjectionUrl,fulfillBlockedAnalytics} from './analytics-test-policy.mjs';

const output=path.resolve(process.env.PERFORMANCE_REPORT || '../../reports/optimization-2026-11-24/browser');
const videoDir=process.env.PERFORMANCE_VIDEO_DIR || 'D:/Projects/ToolsHub/optimization-2026-11-24/videos';
await mkdir(output,{recursive:true});
const server=await startDistServer(path.resolve('dist'));
const browser=await chromium.launch({executablePath:process.env.PERFORMANCE_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const report={matrix:[],recovery:[],navigation:[],videos:[],errors:[],analytics:[],passed:false};
const routes=process.env.PERFORMANCE_ROUTES?.split(',')||['/','/en','/proxy-vpn','/guides','/proxy-vpn/luchshie-proksi','/proxy-vpn/proxywing','/guides/youtube-ferma','/crypto-exchange/qr-sbp'];
const routeName=route=>route.replaceAll('/','-').replace(/^-|-$/g,'')||'home';
async function contextFor(width,theme,slow=true) {
  const mobile=width===390;
  const context=await browser.newContext({viewport:{width,height:mobile?844:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  await context.addInitScript(value=>{
    localStorage.setItem('hopscup-site-theme',value);localStorage.setItem('hopscup-analytics-consent','denied');
    window.__layoutShifts=0;
    window.__layoutShiftDetails=[];
    new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput){window.__layoutShifts+=entry.value;window.__layoutShiftDetails.push({value:entry.value,sources:entry.sources?.map(source=>({html:source.node?.outerHTML?.slice(0,220),before:source.previousRect.toJSON(),after:source.currentRect.toJSON()}))});}}).observe({type:'layout-shift',buffered:true});
  },theme);
  const page=await context.newPage();page.setDefaultTimeout(30000);
  page.on('console',message=>{if(['error','warning'].includes(message.type()))report.errors.push({width,theme,type:message.type(),message:message.text(),url:page.url()});});
  page.on('pageerror',error=>report.errors.push({width,theme,type:'pageerror',message:error.message,url:page.url()}));
  if(mobile&&slow){const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1600000/8,uploadThroughput:750000/8,connectionType:'cellular4g'});}
  return {context,page};
}
async function recordOpening(page,destination) {
  await mkdir(path.dirname(destination),{recursive:true});
  const ffmpeg=spawn(process.env.FFMPEG || 'ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','10','-i','pipe:0','-an','-c:v','libx264','-preset','ultrafast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart',destination],{stdio:['pipe','ignore','pipe'],windowsHide:true});
  let log='';ffmpeg.stderr.on('data',chunk=>{log+=chunk;});
  const finished=new Promise((resolve,reject)=>{ffmpeg.once('error',reject);ffmpeg.once('close',code=>code===0?resolve():reject(Error(log||'ffmpeg failed')));});
  let frame=await page.screenshot({type:'jpeg',quality:85});
  const cdp=await page.context().newCDPSession(page);
  cdp.on('Page.screencastFrame',event=>{frame=Buffer.from(event.data,'base64');void cdp.send('Page.screencastFrameAck',{sessionId:event.sessionId}).catch(()=>{});});
  await cdp.send('Page.startScreencast',{format:'jpeg',quality:85,maxWidth:390,maxHeight:844,everyNthFrame:1});
  const timer=setInterval(()=>ffmpeg.stdin.write(frame),100);
  return async()=>{clearInterval(timer);await cdp.send('Page.stopScreencast');await cdp.detach();ffmpeg.stdin.end();await finished;};
}
try {
  if(!process.env.PERFORMANCE_EXTRAS_ONLY)for(const width of process.env.PERFORMANCE_WIDTHS?.split(',').map(Number)||[1440,390])for(const theme of process.env.PERFORMANCE_THEMES?.split(',')||['dark','light']) {
    const {context,page}=await contextFor(width,theme);
    for(const route of routes) {
      let release;
      const gate=new Promise(resolve=>{release=resolve;});
      await context.route('**/*',async request=>{
        if(isWorkstationInjectionUrl(request.request().url()))return fulfillBlockedAnalytics(request);
        if(isAnalyticsUrl(request.request().url())){
          const timing=await page.evaluate(()=>({readyState:document.readyState,load:performance.getEntriesByType('navigation')[0]?.loadEventEnd||0,now:performance.now()})).catch(()=>({}));
          report.analytics.push({url:request.request().url(),...timing});return fulfillBlockedAnalytics(request);
        }
        if(/\/assets\/index-[\w-]+\.js$/.test(new URL(request.request().url()).pathname))await gate;
        await request.continue().catch(()=>{});
      });
      const response=await page.goto(server.base+route,{waitUntil:'commit',timeout:60000});assert.equal(response.status(),200);
      await page.locator('#root h1').waitFor();
      const before=await page.evaluate(()=>{
        window.__originalHeading=document.querySelector('#root h1');
        return {theme:document.documentElement.dataset.siteTheme,background:getComputedStyle(document.body).backgroundColor,headings:document.querySelectorAll('#root h1').length,text:document.querySelector('#root').textContent.length,hydrated:document.documentElement.dataset.hydrated==='true'};
      });
      assert.equal(before.theme,theme);assert.equal(before.headings,1);assert.ok(before.text>100);assert.equal(before.hydrated,false);
      if(route==='/proxy-vpn/proxywing')await page.locator('[data-service-modal-frame]').waitFor();
      await page.screenshot({path:output+`/${width}-${theme}-${routeName(route)}-prerender.png`});
      release();
      await page.waitForFunction(route=>document.documentElement.dataset.indexPolicyPath===route,route);
      await page.waitForLoadState('networkidle',{timeout:60000});
      const after=await page.evaluate(()=>({theme:document.documentElement.dataset.siteTheme,background:getComputedStyle(document.body).backgroundColor,sameHeading:window.__originalHeading===document.querySelector('#root h1'),headings:document.querySelectorAll('#root h1').length,cls:window.__layoutShifts,shifts:window.__layoutShiftDetails,raw:/Загрузка\.\.\.|Loading\.\.\./.test(document.querySelector('#root').textContent)}));
      assert.equal(after.sameHeading,true,'React replaced prerendered heading: '+route);assert.equal(after.headings,1);assert.equal(after.theme,theme);assert.equal(after.background,before.background);assert.equal(after.raw,false);
      report.matrix.push({width,theme,route,...after});console.log(JSON.stringify(report.matrix.at(-1)));
      await context.unroute('**/*');
    }
    await context.close();
  }
  if(!process.env.PERFORMANCE_NO_EXTRAS) {
  // Before hydration these remain ordinary anchors; browser Back restores the catalogue.
  for(const width of [1440,390]) {
    const {context,page}=await contextFor(width,'dark',false);let release;const gate=new Promise(resolve=>{release=resolve;});
    await context.route('**/*',async request=>{if(isAnalyticsUrl(request.request().url())||isWorkstationInjectionUrl(request.request().url()))return fulfillBlockedAnalytics(request);if(/\/assets\/index-[\w-]+\.js$/.test(new URL(request.request().url()).pathname))await gate;await request.continue().catch(()=>{});});
    await page.goto(server.base+'/proxy-vpn',{waitUntil:'commit'});await page.locator('#root h1').waitFor();
    await page.locator('[data-catalog-card="p3"]').getByRole('link',{name:'Подробнее',exact:true}).click({noWaitAfter:true});await page.waitForURL(url=>url.pathname.replace(/\/$/,'')==='/proxy-vpn/proxywing',{waitUntil:'commit'});await page.locator('[data-service-modal-frame]').waitFor();
    await page.goBack({waitUntil:'commit'});await page.waitForURL(server.base+'/proxy-vpn',{waitUntil:'commit'});await page.locator('#root h1').waitFor();release();
    await page.waitForFunction(()=>document.documentElement.dataset.indexPolicyPath==='/proxy-vpn');
    report.navigation.push({width,unhydratedCardLink:true,back:true});await context.close();
  }
  const withoutJs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const staticPage=await withoutJs.newPage();
  for(const route of ['/','/proxy-vpn/proxywing','/guides/youtube-ferma']){
    await staticPage.goto(server.base+route,{waitUntil:'domcontentloaded'});
    assert.equal(await staticPage.locator('h1').count(),1);
    const duplicates=await staticPage.evaluate(()=>{const seen=new Set(),duplicates=[];for(const node of document.querySelectorAll('[id]')){if(seen.has(node.id))duplicates.push(node.id);seen.add(node.id);}return duplicates;});assert.deepEqual(duplicates,[]);
  }
  await withoutJs.close();
  // A genuine HTTP 404 exercises both the early bootstrap and all dynamic import paths.
  for(const [name,route,pattern]of [
    ['entry','/proxy-vpn',/\/assets\/index-[\w-]+\.js$/],
    ['app','/proxy-vpn',/\/assets\/App-[\w-]+\.js$/],
    ['catalogue','/proxy-vpn',/\/assets\/ru-[\w-]+\.js$/],
    ['editorial','/proxy-vpn/proxywing',/\/assets\/p3-[\w-]+\.js$/],
    ['article','/guides/youtube-ferma',/\/assets\/YoutubeFarmGuideArticle-[\w-]+\.js$/],
    ['tools','/proxy-vpn',/\/assets\/CatalogToolsDialogs-[\w-]+\.js$/],
    ['search','/proxy-vpn',/\/assets\/_virtual_client-search-[\w-]+\.js$/],
  ]) {
    const context=await browser.newContext();await context.addInitScript(()=>localStorage.setItem('hopscup-analytics-consent','denied'));
    const page=await context.newPage();let navigations=0,missing=0;
    page.on('framenavigated',frame=>{if(frame===page.mainFrame()&&frame.url().startsWith(server.base))navigations++;});
    await context.route('**/*',request=>{if(isAnalyticsUrl(request.request().url())||isWorkstationInjectionUrl(request.request().url()))return fulfillBlockedAnalytics(request);if(pattern.test(new URL(request.request().url()).pathname)){missing++;return request.fulfill({status:404,contentType:'application/javascript',body:''});}return request.continue();});
    await page.goto(server.base+route,{waitUntil:'commit'});
    if(name==='search'){
      await page.waitForFunction(()=>document.documentElement.dataset.indexPolicyPath==='/proxy-vpn');await page.locator('.site-search-field input').fill('missing-chunk');
      await page.waitForURL(url=>url.pathname==='/proxy-vpn',{waitUntil:'commit'});await page.waitForFunction(()=>sessionStorage.getItem('hopscup-chunk-reload-attempted')==='1');
      while(navigations<2)await page.waitForTimeout(100);
      await page.waitForFunction(()=>document.documentElement.dataset.indexPolicyPath==='/proxy-vpn');await page.locator('.site-search-field input').fill('missing-chunk');
    }
    await page.locator('[data-site-update]').waitFor({timeout:30000});await page.waitForTimeout(1000);
    assert.equal(navigations,2,name+': more than one automatic reload');assert.ok(missing>=2,name);
    assert.equal(await page.getByRole('button',{name:'Обновить страницу',exact:true}).count(),1);
    assert.ok((await page.locator('#root').textContent()).length>100);
    await page.screenshot({path:output+'/stale-'+name+'.png'});report.recovery.push({name,navigations,missing,message:true});console.log(JSON.stringify(report.recovery.at(-1)));await context.close();
  }
  for(const theme of ['dark','light'])for(const [name,route]of [['home','/'],['card','/proxy-vpn/proxywing']]) {
    const {context,page}=await contextFor(390,theme);
    await context.route('**/*',request=>isAnalyticsUrl(request.request().url())||isWorkstationInjectionUrl(request.request().url())?fulfillBlockedAnalytics(request):request.continue());
    const destination=videoDir+`/phone-${name}-${theme}.mp4`,stop=await recordOpening(page,destination);
    try{await page.goto(server.base+route,{waitUntil:'networkidle',timeout:60000});await page.waitForFunction(route=>document.documentElement.dataset.indexPolicyPath===route,route);await page.waitForTimeout(2500);}finally{await stop();}
    report.videos.push(destination);await context.close();
  }
  }
  assert.deepEqual(report.errors,[]);
  assert.ok(report.analytics.every(entry=>entry.readyState==='complete'&&entry.now>=entry.load),'Analytics began before load');
  report.passed=true;
}catch(error){report.failure=error.stack;throw error;}
finally{await writeFile(output+'/results.json',JSON.stringify(report,null,2));await browser.close();await server.close();}
