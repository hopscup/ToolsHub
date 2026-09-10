import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { accountShopPages } from '../src/data/accountShopPages.js';
import { antidetectPages } from '../src/data/antidetectPages.js';
import { cryptoExchangePages } from '../src/data/cryptoExchangePages.js';
import { foreignCardPages } from '../src/data/foreignCardPages.js';
import { guidePages } from '../src/data/guidePages.js';
import { legacyIndexedRoutes } from '../src/data/legacyIndexedRoutes.js';
import { seoLandingPages } from '../src/data/seoLandingPages.js';
import { smsPages } from '../src/data/smsPages.js';
import { socialPages } from '../src/data/socialPages.js';
import { steamPages } from '../src/data/steamPages.js';
import { vpsPages } from '../src/data/vpsPages.js';

const distDir = path.resolve('dist');
const siteUrl = 'https://hopscup.tools';
const languages = [
  { prefix: '', htmlLang: 'ru-RU', hrefLang: 'ru', indexable: true },
  { prefix: '/en', htmlLang: 'en', hrefLang: 'en', indexable: true },
  { prefix: '/es', htmlLang: 'es', hrefLang: 'es', indexable: false },
  { prefix: '/zh', htmlLang: 'zh-CN', hrefLang: 'zh-CN', indexable: false },
  { prefix: '/ko', htmlLang: 'ko-KR', hrefLang: 'ko-KR', indexable: false },
];
const indexLanguages = languages.filter(({ indexable }) => indexable);
const legacyIndexedRouteSet = new Set(legacyIndexedRoutes);
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
  ...seoLandingPages.map((page) => page.route),
];
const serviceRoutes = [
  '/proxy-vpn/luchshie-proksi',
  '/proxy-vpn/luchshie-mobilnye-proksi',
  '/proxy-vpn/proxyshard',
  '/proxy-vpn/proxyline',
  '/proxy-vpn/proxywing',
  '/proxy-vpn/proxy-seller',
  '/proxy-vpn/proxy6',
  '/proxy-vpn/mobileproxy',
  '/proxy-vpn/proxys-io',
  '/proxy-vpn/all-vpn',
  '/proxy-vpn/ppl-vpn',
  '/proxy-vpn/prostovpn',
  '/proxy-vpn/giga-vpn',
  '/proxy-vpn/tochka-g',
  '/proxy-vpn/giga-dollar-vpn',
  ...accountShopPages.map((page) => `/account-shop/${page.slug}`),
  ...antidetectPages.map((page) => `/antidetect/${page.slug}`),
  ...foreignCardPages.map((page) => `/foreign-cards/${page.slug}`),
  ...cryptoExchangePages.map((page) => `/crypto-exchange/${page.slug}`),
  ...smsPages.map((page) => `/sms-activators/${page.slug}`),
  ...vpsPages.map((page) => `/vps/${page.slug}`),
  ...socialPages.map((page) => `/social-boost/${page.slug}`),
  ...steamPages.map((page) => `/steam-topup/${page.slug}`),
  ...guidePages.map((page) => `/guides/${page.slug}`),
];
const routes = [...categoryRoutes, ...serviceRoutes];
const articleRoutes = new Set([
  '/proxy-vpn/luchshie-proksi',
  '/proxy-vpn/luchshie-mobilnye-proksi',
  ...guidePages.map((page) => `/guides/${page.slug}`),
]);

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
    const robotsMeta = html.match(/<meta name="robots" content="([^"]+)" \/>/)?.[1];
    const alternates = matches(html, /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)" \/>/g);
    const h1Count = matches(html, /<h1[\s>]/g).length;
    const internalLinkCount = matches(html, /<a href="\/(?:en\/|es\/|zh\/|ko\/)?(?:proxy-vpn|antidetect|account-shop|foreign-cards|crypto-exchange|sms-activators|vps|social-boost|steam-topup|guides)(?:\/[^"]*)?"/g).length;
    const structuredDataText = html.match(/<script id="structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    const minimumDescriptionLength = language.hrefLang.startsWith('zh') ? 20 : 50;

    if (!title) errors.push(`Missing title: ${localizedRoute}`);
    const russianOnlyArticle = articleRoutes.has(route);
    const untranslatedArticle = russianOnlyArticle && language.hrefLang !== 'ru';
    const preservedLegacyPage = legacyIndexedRouteSet.has(localizedRoute);
    const indexablePage = (language.indexable || preservedLegacyPage) && !untranslatedArticle;
    if (title && indexablePage && titles.has(title)) errors.push(`Duplicate title: ${title}`);
    if (title && indexablePage) titles.add(title);
    if (!description || description.length < minimumDescriptionLength) errors.push(`Weak description: ${localizedRoute}`);
    const expectedCanonical = russianOnlyArticle
      ? `${siteUrl}${route}`
      : language.indexable
        ? `${siteUrl}${localizedRoute}`
        : preservedLegacyPage
          ? `${siteUrl}${localizedRoute}`
        : `${siteUrl}/en${route}`;
    if (canonical !== expectedCanonical) errors.push(`Wrong canonical: ${localizedRoute}`);
    const expectedLang = russianOnlyArticle ? languages[0].htmlLang : language.htmlLang;
    if (html.match(/<html lang="([^"]+)"/)?.[1] !== expectedLang) errors.push(`Wrong lang: ${localizedRoute}`);
    const expectedAlternates = russianOnlyArticle ? 2 : indexLanguages.length + 1;
    if (alternates.length !== expectedAlternates) errors.push(`Wrong hreflang count: ${localizedRoute}`);
    if (!indexablePage && robotsMeta !== 'noindex, follow') errors.push(`Retired or untranslated page is indexable: ${localizedRoute}`);
    if (indexablePage && !robotsMeta?.startsWith('index, follow')) errors.push(`Indexable page has wrong robots meta: ${localizedRoute}`);
    if (h1Count !== 1) errors.push(`Expected one H1: ${localizedRoute}`);
    if (internalLinkCount < categoryRoutes.length) errors.push(`Missing crawlable navigation: ${localizedRoute}`);

    try {
      const structuredData = JSON.parse(structuredDataText || 'null');
      const types = Array.isArray(structuredData) ? structuredData.map((item) => item?.['@type']) : [];
      const pageType = articleRoutes.has(route) ? 'Article' : serviceRoutes.includes(route) ? 'WebPage' : 'CollectionPage';
      for (const requiredType of ['WebSite', 'Organization', pageType]) {
        if (!types.includes(requiredType)) errors.push(`Missing ${requiredType} schema: ${localizedRoute}`);
      }
    } catch {
      errors.push(`Invalid JSON-LD: ${localizedRoute}`);
    }
  }
}

const rootHtml = await read('index.html');
if (!rootHtml.includes(`<link rel="canonical" href="${siteUrl}" />`)) {
  errors.push('Root page must use a self-referencing canonical');
}

const sitemap = await read('sitemap.xml');
if (
  !sitemap.includes(`${siteUrl}/sitemap-money.xml`) ||
  !sitemap.includes(`${siteUrl}/sitemap-core.xml`) ||
  !sitemap.includes(`${siteUrl}/sitemap-services.xml`)
) {
  errors.push('Sitemap index does not reference all child sitemaps');
}
const moneySitemap = await read('sitemap-money.xml');
const coreSitemap = await read('sitemap-core.xml');
const serviceSitemap = await read('sitemap-services.xml');
const combinedSitemaps = `${moneySitemap}\n${coreSitemap}\n${serviceSitemap}`;
const expectedSitemapUrls = indexLanguages.length * (routes.length + 1) - (indexLanguages.length - 1) * articleRoutes.size;
if (matches(combinedSitemaps, /<loc>/g).length !== expectedSitemapUrls) {
  errors.push('Sitemap has an unexpected number of canonical URLs');
}
const expectedSitemapAlternates = (expectedSitemapUrls - articleRoutes.size) * (indexLanguages.length + 1) + articleRoutes.size * 2;
if (matches(combinedSitemaps, /<xhtml:link /g).length !== expectedSitemapAlternates) {
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
  console.log(`SEO audit passed: ${languages.length * (routes.length + 1)} rendered pages, ${expectedSitemapUrls} canonical sitemap URLs, robots.txt, and 404.html.`);
}
