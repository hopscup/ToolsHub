import assert from 'node:assert/strict';
import test from 'node:test';
import {isAnalyticsUrl} from './analytics-test-policy.mjs';

test('browser checks block analytics without blocking site assets or pages',()=>{
  for(const url of [
    'https://static.cloudflareinsights.com/beacon.min.js',
    'https://hopscup.tools/_vercel/insights/script.js',
    'http://localhost:3013/_vercel/insights/view',
    'https://vitals.vercel-insights.com/v1/view',
    'https://www.googletagmanager.com/gtag/js?id=test',
  ])assert.equal(isAnalyticsUrl(url),true,url);
  for(const url of ['https://hopscup.tools/','https://hopscup.tools/assets/App.js','https://hopscup.tools/guides/youtube-ferma'])assert.equal(isAnalyticsUrl(url),false,url);
});
