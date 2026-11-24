import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createServer} from 'node:http';
import {indexablePaths} from '../src/data/indexPolicy.js';
import {changedPathsBetween,lastCommitChanges} from './indexnow-changes.mjs';
import {parseSitemap,collectSitemapUrls,selectUrls,validateConfig,checkPublicKey,checkPage,submitBatches,parseArgs,runIndexNow,projectRoot} from './indexnow.mjs';

const config=JSON.parse(await readFile(new URL('../indexnow.config.json',import.meta.url),'utf8'));
const origin=config.origin;
const keyUrl=origin+'/'+config.key+'.txt';
const xml=urls=>'<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(url=>'<url><loc>'+url+'</loc></url>').join('')+'</urlset>';
const html=(url,robots='index, follow',canonical=url)=>'<html><head><meta content="'+robots+'" name="robots"><link href="'+canonical+'" rel="canonical"></head><body>Page</body></html>';
const ok=(body,headers={})=>new Response(body,{status:200,headers});
const quiet=()=>{};
const temporaryLogs=async run=>{
  const parent=path.resolve(tmpdir());
  const logDir=await mkdtemp(path.join(parent,'hopscup-indexnow-test-'));
  try{return await run(logDir);}finally{
    const target=path.resolve(logDir);
    assert.equal(path.dirname(target),parent);
    assert.ok(path.basename(target).startsWith('hopscup-indexnow-test-'));
    await rm(target,{recursive:true,force:true});
  }
};

test('IndexNow public UTF-8 key matches config and is served from the built site without an account',async()=>{
  validateConfig(config);
  const source=await readFile('public/'+config.key+'.txt','utf8');
  const built=await readFile('dist/'+config.key+'.txt','utf8');
  assert.equal(source.trim(),config.key);assert.equal(built,source);
  const server=createServer((req,res)=>{
    if(req.url!=='/'+config.key+'.txt'){res.statusCode=404;res.end();return;}
    res.setHeader('Content-Type','text/plain; charset=utf-8');res.end(built);
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{
    const response=await fetch('http://127.0.0.1:'+server.address().port+'/'+config.key+'.txt');
    assert.equal(response.status,200);assert.equal((await response.text()).trim(),config.key);
  }finally{await new Promise(resolve=>server.close(resolve));}
});

test('XML parser reads only sitemap loc values, not hreflang links, and rejects unsafe XML',()=>{
  const parsed=parseSitemap('<urlset xmlns:xhtml="http://www.w3.org/1999/xhtml"><url><loc>https://hopscup.tools/ai</loc><xhtml:link href="https://example.test"/></url></urlset>');
  assert.deepEqual(parsed,{urls:[origin+'/ai'],sitemaps:[]});
  assert.deepEqual(parseSitemap('<sitemapindex><sitemap><loc>'+origin+'/sitemap-core.xml</loc></sitemap></sitemapindex>').sitemaps,[origin+'/sitemap-core.xml']);
  for(const body of ['<!DOCTYPE foo><urlset/>','<urlset><url></urlset>','<html/>','<urlset><url/></urlset>'])assert.throws(()=>parseSitemap(body));
});

test('local production sitemap contains exactly the 93 eligible URLs and no closed pages',async()=>{
  const urls=await collectSitemapUrls({origin,sitemapDir:'dist',fetchImpl:()=>{throw Error('Offline test must not fetch');}});
  assert.deepEqual(urls.map(url=>new URL(url).pathname).sort(),[...indexablePaths].sort());
  assert.equal(urls.length,93);
  assert.ok(urls.includes(origin+'/proxy-vpn/quattro-vpn'));
  assert.ok(!urls.includes(origin+'/proxy-vpn/taynik-vpn'));
});

test('only the intersection of sitemap, index policy and changed routes can be selected',()=>{
  const sitemapUrls=[origin+'/proxy-vpn/quattro-vpn',origin+'/proxy-vpn/taynik-vpn',origin+'/social-boost',origin+'/en/proxy-vpn/quattro-vpn'];
  const changedPaths=['/proxy-vpn/quattro-vpn','/proxy-vpn/taynik-vpn','/ai','/social-boost'];
  assert.deepEqual(selectUrls({sitemapUrls,changedPaths,origin}),[origin+'/proxy-vpn/quattro-vpn']);
  assert.deepEqual(selectUrls({sitemapUrls,origin,all:true}),[origin+'/proxy-vpn/quattro-vpn']);
  assert.throws(()=>selectUrls({sitemapUrls:['https://evil.test/ai'],origin,all:true}),/canonical host/);
});

test('sitemap traversal stays on the configured host and detects cycles without duplication',async()=>{
  const calls=[];
  const fetchImpl=async url=>{
    calls.push(url);
    if(url.endsWith('/sitemap.xml'))return ok('<sitemapindex><sitemap><loc>'+origin+'/child.xml</loc></sitemap></sitemapindex>');
    return ok('<sitemapindex><sitemap><loc>'+origin+'/sitemap.xml</loc></sitemap></sitemapindex>');
  };
  assert.deepEqual(await collectSitemapUrls({origin,fetchImpl}),[]);assert.equal(calls.length,2);
  await assert.rejects(collectSitemapUrls({origin,fetchImpl:async()=>ok('<sitemapindex><sitemap><loc>https://evil.test/private.xml</loc></sitemap></sitemapindex>')}),/canonical host/);
});

test('public key preflight refuses a missing or mismatched key',async()=>{
  assert.equal(await checkPublicKey(config,async()=>ok(config.key)),keyUrl);
  await assert.rejects(checkPublicKey(config,async()=>ok('<html>Fallback</html>')),/does not match/);
  await assert.rejects(checkPublicKey(config,async()=>new Response('',{status:404})),/404/);
});

test('page preflight rejects noindex, X-Robots-Tag and a different canonical',async()=>{
  const url=origin+'/ai';
  await checkPage(url,config,async()=>ok(html(url)));
  await assert.rejects(checkPage(url,config,async()=>ok(html(url,'noindex, follow'))),/not explicitly indexable/);
  await assert.rejects(checkPage(url,config,async()=>ok(html(url),{'X-Robots-Tag':'noindex'})),/not explicitly indexable/);
  await assert.rejects(checkPage(url,config,async()=>ok(html(url,'index, follow',origin+'/antidetect'))),/Canonical mismatch/);
});

test('batch POSTs obey 10000 URL limit and include exact IndexNow payload at both endpoints',async()=>{
  const calls=[],urls=Array.from({length:10001},(_,i)=>origin+'/test-'+i);
  const results=await submitBatches({urls,config,log:quiet,fetchImpl:async(url,options)=>{
    const body=JSON.parse(options.body);calls.push({url,body});
    assert.equal(options.method,'POST');assert.equal(options.redirect,'error');
    assert.equal(body.host,'hopscup.tools');assert.equal(body.key,config.key);assert.equal(body.keyLocation,keyUrl);
    assert.ok(body.urlList.length<=10000);
    return new Response('',{status:202});
  }});
  assert.deepEqual(calls.map(call=>call.body.urlList.length),[10000,1,10000,1]);
  assert.deepEqual([...new Set(calls.map(call=>call.url))],config.endpoints);
  assert.ok(results.every(result=>result.accepted&&result.status===202));
});

test('429 logs Retry-After and stops an endpoint without automatic retries',async()=>{
  let calls=0;
  const results=await submitBatches({urls:[origin+'/ai',origin+'/antidetect'],config:{...config,maxUrlsPerRequest:1},log:quiet,fetchImpl:async()=>{
    calls++;return new Response('slow down',{status:429,headers:{'Retry-After':'600','X-RateLimit-Remaining':'0'}});
  }});
  assert.equal(calls,2);assert.equal(results.length,2);
  assert.ok(results.every(result=>!result.accepted&&result.retryAfter==='600'&&result.body==='slow down'));
});

test('CLI rejects unknown flags and permits local sitemap only in dry-run mode',()=>{
  assert.deepEqual(parseArgs(['--all','--dry-run','--sitemap-dir','dist']),{all:true,dryRun:true,sitemapDir:'dist'});
  for(const args of [['--sitemap-dir','dist'],['--wat'],['--commit']])assert.throws(()=>parseArgs(args));
  assert.throws(()=>validateConfig({...config,maxUrlsPerRequest:10001}));
});

test('offline all dry-run selects 93 URLs and never makes an HTTP request',()=>temporaryLogs(async logDir=>{
  const result=await runIndexNow({all:true,dryRun:true,sitemapDir:'dist'},{logDir,log:quiet,fetchImpl:()=>{throw Error('No network allowed');}});
  assert.equal(result.exitCode,0);assert.equal(result.record.urlList.length,93);assert.deepEqual(result.record.results,[]);
  assert.equal(JSON.parse(await readFile(result.logFile,'utf8')).dryRun,true);
}));

test('default changed mode sends only eligible changed sitemap URLs and logs both service responses',()=>temporaryLogs(async logDir=>{
  const calls=[];
  const fetchImpl=async(url,options={})=>{
    calls.push({url,method:options.method||'GET'});
    if(options.method==='POST'){
      assert.deepEqual(JSON.parse(options.body).urlList,[origin+'/proxy-vpn/quattro-vpn']);
      return ok('accepted');
    }
    if(url===origin+'/sitemap.xml')return ok(xml([origin+'/ai',origin+'/proxy-vpn/quattro-vpn',origin+'/proxy-vpn/taynik-vpn']));
    if(url===keyUrl)return ok(config.key);
    return ok(html(url));
  };
  const result=await runIndexNow({},{logDir,log:quiet,fetchImpl,changes:async()=>({commit:'test',files:[],paths:['/proxy-vpn/quattro-vpn','/proxy-vpn/taynik-vpn']})});
  assert.equal(result.exitCode,0);assert.equal(calls.filter(call=>call.method==='POST').length,2);
  assert.ok(result.record.results.every(result=>result.status===200));
}));

test('preflight failure or Git failure prevents every POST and is recorded',()=>temporaryLogs(async logDir=>{
  let posts=0;
  const fetchImpl=async(url,options={})=>{
    if(options.method==='POST')posts++;
    if(url===origin+'/sitemap.xml')return ok(xml([origin+'/ai']));
    if(url===keyUrl)return ok(config.key);
    return ok(html(url,'noindex, follow'));
  };
  const result=await runIndexNow({all:true},{logDir,log:quiet,fetchImpl});
  assert.equal(result.exitCode,1);assert.equal(posts,0);assert.match(result.record.error,/not explicitly indexable/);
  const gitError=await runIndexNow({},{logDir,log:quiet,fetchImpl,changes:async()=>{throw Error('Missing parent');}});
  assert.equal(gitError.exitCode,1);assert.match(gitError.record.error,/Missing parent/);
}));

test('no changed eligible URL means no key fetch and no POST',()=>temporaryLogs(async logDir=>{
  const calls=[];
  const result=await runIndexNow({},{logDir,log:quiet,fetchImpl:async url=>{calls.push(url);return ok(xml([origin+'/ai']));},changes:async()=>({paths:[],files:[]})});
  assert.equal(result.exitCode,0);assert.deepEqual(calls,[origin+'/sitemap.xml']);
}));

test('change comparison detects modified and newly indexable pages, not tooling-only changes',()=>{
  const before={shell:'same',models:new Map([['/ai','old'],['/antidetect','same']])};
  const after={shell:'same',models:new Map([['/ai','new'],['/antidetect','same'],['/proxy-vpn/quattro-vpn','new']])};
  assert.deepEqual(changedPathsBetween(before,after,['scripts/indexnow.mjs']).paths,['/ai','/proxy-vpn/quattro-vpn']);
  assert.deepEqual(changedPathsBetween(after,after,['scripts/indexnow.mjs','indexnow.config.json']).paths,[]);
  assert.equal(changedPathsBetween(before,after,['src/components/ArticleToc.tsx']).paths.length,3);
});

test('homepage selection changes notify only the two indexable homepages',()=>{
  const site={shell:'same',models:new Map([['/','home'],['/en','home'],['/proxy-vpn','catalogue']])};
  assert.deepEqual(changedPathsBetween(site,site,['src/data/homePage.js']).paths,['/','/en']);
  assert.deepEqual(changedPathsBetween(site,site,['scripts/home-page.test.mjs']).paths,[]);
});

test('real Git comparison of the VPN release detects four indexable cards and excludes Taynik',async()=>{
  const result=await lastCommitChanges({root:projectRoot,revision:'48c8831eb637865baaef9ea85dbcbf51fa6b96a9'});
  assert.deepEqual(result.paths.sort(),['/proxy-vpn/giga-dollar-vpn','/proxy-vpn/giga-vpn','/proxy-vpn/prostovpn','/proxy-vpn/quattro-vpn']);
});

test('IndexNow runs only manually and is not part of build or deploy',async()=>{
  const pkg=JSON.parse(await readFile('package.json','utf8'));
  assert.equal(pkg.scripts.indexnow,'node scripts/indexnow.mjs');
  for(const [name,command] of Object.entries(pkg.scripts))if(name!=='indexnow')assert.ok(!command.includes('indexnow'),name);
});
