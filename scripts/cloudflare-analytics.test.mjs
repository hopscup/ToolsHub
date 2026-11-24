import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile,readdir} from 'node:fs/promises';

const source='https://static.cloudflareinsights.com/beacon.min.js';
const token='6d6b22f25a3f49e5900bef8f27d8a222';
const scriptIn=html=>{
  const tags=[...html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)].map(match=>({tag:match[0],index:match.index})).filter(item=>item.tag.includes(source));
  assert.equal(tags.length,1);
  const {tag,index}=tags[0];
  assert.match(tag,/script.defer = true/);
  assert.match(tag,/script.async = true/);
  assert.match(tag,/script.fetchPriority = 'low'/);
  assert.match(tag,/requestIdleCallback/);
  assert.match(tag,/addEventListener\('load'/);
  assert.ok(!/<script[^>]+src=/.test(tag));
  const data=tag.match(/script.dataset.cfBeacon = '([^']+)'/)[1];
  assert.equal(JSON.parse(data).token,token);
  assert.ok(index<html.lastIndexOf('</body>'));
  assert.ok(index>html.lastIndexOf('</head>'));
};

test('Cloudflare is loaded once after load and idle without changing the Vercel dependency',async()=>{
  scriptIn(await readFile('index.html','utf8'));
  const pkg=JSON.parse(await readFile('package.json','utf8'));
  assert.equal(pkg.dependencies['@vercel/analytics'],'^2.0.1');
});

test('every generated static HTML page, including 404, contains the same deferred Cloudflare snippet',async()=>{
  const pages=(await readdir('dist',{recursive:true})).filter(file=>file.endsWith('.html'));
  assert.equal(pages.length,726);
  assert.ok(pages.includes('404.html'));
  for(const file of pages)scriptIn(await readFile('dist/'+file,'utf8'));
});
