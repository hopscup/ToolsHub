import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { accountShopPages } from '../src/data/accountShopPages.js';
import { antidetectPages } from '../src/data/antidetectPages.js';
import { foreignCardPages } from '../src/data/foreignCardPages.js';

const distDir = path.resolve('dist');
const siteUrl = 'https://hopscup.tools';
const languages = [
  { prefix: '', htmlLang: 'ru-RU', hrefLang: 'ru' },
  { prefix: '/en', htmlLang: 'en', hrefLang: 'en' },
  { prefix: '/es', htmlLang: 'es', hrefLang: 'es' },
  { prefix: '/zh', htmlLang: 'zh-CN', hrefLang: 'zh-CN' },
  { prefix: '/ko', htmlLang: 'ko-KR', hrefLang: 'ko-KR' },
];
const categoryRoutes = [
  '/proxy-vpn',
  '/antidetect',
  '/account-shop',
  '/foreign-cards',
  '/crypto-exchange',
  '/sms-activators',
  '/vps',
  '/social-boost',
  '/steam-topup',
  '/guides',
];
const serviceRoutes = [
  '/proxy-vpn/proxyshard',
  '/proxy-vpn/proxyline',
  '/proxy-vpn/proxywing',
  '/proxy-vpn/proxy-seller',
  '/proxy-vpn/proxy6',
  '/proxy-vpn/mobileproxy',
  '/proxy-vpn/proxys-io',
  '/proxy-vpn/ppl-vpn',
  '/proxy-vpn/prostovpn',
  '/proxy-vpn/tochka-g',
  ...accountShopPages.map((page) => `/account-shop/${page.slug}`),
  ...antidetectPages.map((page) => `/antidetect/${page.slug}`),
  ...foreignCardPages.map((page) => `/foreign-cards/${page.slug}`),
];
const routes = [...categoryRoutes, ...serviceRoutes];

const errors = [];
const titles = new Set();
const read = (file) => readFile(path.join(distDir, file), 'utf8');
const matches = (html, expression) => [...html.matchAll(expression)];

for (const language of languages) {
  for (const route of routes) {
    const localizedRoute = `${language.prefix}${route}`;
    const file = path.join(localizedRoute, 'index.html');
    let html;

    try {
      html = await read(file);
    } catch {
      errors.push(`Missing page: ${localizedRoute}`);
      continue;
    }

    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
    const description = html.match(/<meta name="description" content="([^"]+)" \/>/)?.[1]?.trim();
    const canonical = html.match(/<link rel="canonical" href="([^"]+)" \/>/)?.[1];
    const alternates = matches(html, /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)" \/>/g);
    const h1Count = matches(html, /<h1[\s>]/g).length;
    const internalLinkCount = matches(html, /<a href="\/(?:en\/|es\/|zh\/|ko\/)?(?:proxy-vpn|antidetect|account-shop|foreign-cards|crypto-exchange|sms-activators|vps|social-boost|steam-topup|guides)"/g).length;
    const structuredDataText = html.match(/<script id="structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    const minimumDescriptionLength = language.hrefLang.startsWith('zh') ? 20 : 50;

    if (!title) errors.push(`Missing title: ${localizedRoute}`);
    if (title && titles.has(title)) errors.push(`Duplicate title: ${title}`);
    if (title) titles.add(title);
    if (!description || description.length < minimumDescriptionLength) errors.push(`Weak description: ${localizedRoute}`);
    if (canonical !== `${siteUrl}${localizedRoute}`) errors.push(`Wrong canonical: ${localizedRoute}`);
    if (html.match(/<html lang="([^"]+)"/)?.[1] !== language.htmlLang) errors.push(`Wrong lang: ${localizedRoute}`);
    if (alternates.length !== languages.length + 1) errors.push(`Wrong hreflang count: ${localizedRoute}`);
    if (h1Count !== 1) errors.push(`Expected one H1: ${localizedRoute}`);
    if (internalLinkCount < categoryRoutes.length) errors.push(`Missing crawlable navigation: ${localizedRoute}`);

    try {
      const structuredData = JSON.parse(structuredDataText || 'null');
      const types = Array.isArray(structuredData) ? structuredData.map((item) => item?.['@type']) : [];
      const pageType = serviceRoutes.includes(route) ? 'WebPage' : 'CollectionPage';
      for (const requiredType of ['WebSite', 'Organization', pageType]) {
        if (!types.includes(requiredType)) errors.push(`Missing ${requiredType} schema: ${localizedRoute}`);
      }
    } catch {
      errors.push(`Invalid JSON-LD: ${localizedRoute}`);
    }
  }
}

const rootHtml = await read('index.html');
if (!rootHtml.includes(`<link rel="canonical" href="${siteUrl}/proxy-vpn" />`)) {
  errors.push('Root page must canonicalize to /proxy-vpn');
}

const sitemap = await read('sitemap.xml');
if (matches(sitemap, /<loc>/g).length !== languages.length * routes.length) {
  errors.push('Sitemap has an unexpected number of canonical URLs');
}
if (matches(sitemap, /<xhtml:link /g).length !== languages.length * routes.length * (languages.length + 1)) {
  errors.push('Sitemap has an unexpected number of language alternates');
}

const robots = await read('robots.txt');
if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) errors.push('robots.txt does not reference sitemap.xml');

const notFound = await read('404.html');
if (!notFound.includes('<meta name="robots" content="noindex, follow" />')) errors.push('404 page is indexable');

if (errors.length) {
  console.error(`SEO audit failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`SEO audit passed: ${languages.length * routes.length} localized pages, sitemap, robots.txt, and 404.html.`);
}
