import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { accountShopPages } from '../src/data/accountShopPages.js';
import { antidetectPages } from '../src/data/antidetectPages.js';
import { cryptoExchangePages } from '../src/data/cryptoExchangePages.js';
import { foreignCardPages } from '../src/data/foreignCardPages.js';
import { guidePages } from '../src/data/guidePages.js';
import { guideCatalog, indexableGuideCatalog } from '../src/data/guideCatalog.js';
import { isAffiliateUrl } from '../src/lib/externalLinks.js';
import { legacyIndexedRoutes } from '../src/data/legacyIndexedRoutes.js';
import { loadOffers } from './load-offers.mjs';
import { getServiceAlternatives, getServiceFacts, getServiceTextGroups, localizedServiceValue, serviceCategoryRoutes, plainSeoText } from '../src/data/servicePresentation.js';
import { siteDateModified } from '../src/data/buildDate.js';
import { proxyGuideMeta } from '../src/data/proxyGuideContent.js';
import { mobileIpGuideMeta } from '../src/data/mobileIpGuideContent.js';
import { isServiceMetaDescription } from '../src/data/servicePresentation.js';
import { seoLandingPages } from '../src/data/seoLandingPages.js';
import { smsPages } from '../src/data/smsPages.js';
import { socialPages } from '../src/data/socialPages.js';
import { steamPages } from '../src/data/steamPages.js';
import { vpsPages } from '../src/data/vpsPages.js';
import { articleFallbackByRoute, mobileProxyChecklist, mobileProxyCopy, mobileProxyMeta, mobileProxyProviders } from '../src/data/articleFallbackContent.js';
import { claudeRecoveryArticle } from '../src/data/claudeRecoveryArticle.js';
import { claudeGuideArticle } from '../src/data/claudeGuideArticle.js';
import { accountFarmArticle, createAccountFarmContent } from '../src/data/accountFarmContent.js';
import { antidetectOverviewArticles, createAntidetectOverviewContent } from '../src/data/antidetectOverviewContent.js';
import { createGuideRefreshContent, guideRefreshMeta } from '../src/data/guideRefreshContent.js';
import { antidetectSetupMeta, antidetectSetupCopy, antidetectSetupAdditions, getAntidetectGuideServices, resolveAntidetectGuideSegments, createAntidetectGuideChecklist } from '../src/data/antidetectSetupContent.js';

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
const { OFFERS } = await loadOffers();
const offerByRoute = new Map(OFFERS.filter(offer => offer.slug && offer.category !== 'Guides').map(offer => [`${serviceCategoryRoutes[offer.category]}/${offer.slug}`, offer]));
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
  '/proxy-vpn/imp-vpn',
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
const noIndexRoutes = new Set(guidePages.filter(page => page.indexable === false).map(page => `/guides/${page.slug}`));

const errors = [];
const titles = new Set();
const read = (file) => readFile(path.join(distDir, file), 'utf8');
const matches = (html, expression) => [...html.matchAll(expression)];
const escapeHtml = (value) => plainSeoText(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const checkServiceContent = (html, offer, language, route) => {
  const code = language.hrefLang;
  const content = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] || '';
  const metaDescription = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const isMeta = text => isServiceMetaDescription(escapeHtml(text), metaDescription);
  for (const fact of getServiceFacts(offer, code)) {
    if (!content.includes(`<dd>${escapeHtml(fact.value)}</dd>`)) errors.push(`Missing service fact ${fact.key}: ${route}`);
  }
  const texts = [localizedServiceValue(offer.description, code), localizedServiceValue(offer.details?.descriptionDetailed, code), localizedServiceValue(offer.details?.targetAudience, code), localizedServiceValue(offer.editorial?.description, code), localizedServiceValue(offer.editorial?.verdict, code), ...(offer.promoCode ? [localizedServiceValue(offer.promoDiscount, code)] : []), ...getServiceTextGroups(offer, code).flatMap(group => group.items)].filter(Boolean);
  for (const text of texts.filter(text => !isMeta(text))) if (!content.includes(escapeHtml(text))) errors.push(`Missing service text: ${route}: ${text}`);
  for (const [, paragraph] of matches(content, /<p\b[^>]*>([\s\S]*?)<\/p>/g)) {
    if (isServiceMetaDescription(paragraph.replace(/<[^>]*>/g, ''), metaDescription)) errors.push(`Service paragraph duplicates meta description: ${route}`);
  }
  if (offer.promoCode && !content.includes(`<code>${escapeHtml(offer.promoCode)}</code>`)) errors.push(`Missing service promo: ${route}`);
  if (!content.includes(`href="${escapeHtml(offer.url)}"`)) errors.push(`Missing service CTA: ${route}`);
  const alternatives = getServiceAlternatives(offer, OFFERS);
  if (alternatives.length !== 3) errors.push(`Expected three alternatives for ${route}`);
  for (const item of alternatives) if (!content.includes(`href="${language.prefix}${serviceCategoryRoutes[item.category]}/${item.slug}"`)) errors.push(`Missing alternative ${item.id}: ${route}`);
  if (html.includes('data-landing-links')) errors.push(`Service page has redundant landing navigation: ${route}`);
};

const checkSectionSummaries = (html, language, route) => {
  const landing = seoLandingPages.find(page => page.route === route);
  const category = landing?.category || Object.keys(serviceCategoryRoutes).find(key => serviceCategoryRoutes[key] === route);
  if (!category || category === 'Guides') return;
  const offers = OFFERS.filter(offer => offer.category === category && (!landing?.subFilter || landing.subFilter === 'None' || offer.subCategory === landing.subFilter || offer.subCategories?.includes(landing.subFilter)));
  const content = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] || '';
  const summaries = matches(content, /<section data-service-summary="([^"]+)">([\s\S]*?)<\/section>/g);
  if (summaries.length !== offers.length) errors.push(`Wrong service summary count: ${route}`);
  for (const [, id, summary] of summaries) {
    const offer = offers.find(item => item.id === id);
    if (!offer) { errors.push(`Unexpected service summary: ${route}: ${id}`); continue; }
    if (/data-service-(?:content|alternatives|group|cta)|href="https?:\/\//.test(summary)) errors.push(`Section summary contains full or external service content: ${route}: ${id}`);
    const facts = summary.match(/<p data-summary-facts>([\s\S]*?)<\/p>/)?.[1] || '';
    if (matches(facts, /<span>/g).length > 3) errors.push(`Too many service summary facts: ${route}: ${id}`);
    if (!summary.includes(escapeHtml(localizedServiceValue(offer.description, language.hrefLang)))) errors.push(`Missing short service description: ${route}: ${id}`);
    if (offer.slug) {
      const href = `${language.prefix}${serviceCategoryRoutes[category]}/${offer.slug}`;
      if (matches(summary, /<a\b/g).length !== 2 || !summary.includes(`<h2><a href="${href}">`)) errors.push(`Wrong internal service summary links: ${route}: ${id}`);
    }
  }
};

const checkArticleContent = (html, route, localizedRoute) => {
  const overview = antidetectOverviewArticles.find(article => `/guides/${article.slug}` === route);
  if (overview) {
    const { article, checklist } = createAntidetectOverviewContent(overview, OFFERS);
    const content = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] || '';
    const visit = value => {
      if (Array.isArray(value)) return value.forEach(visit);
      if (!value || typeof value !== 'object') return;
      if (value.text?.trim() && !content.includes(escapeHtml(value.text.trim()))) errors.push(`Missing antidetect overview text: ${localizedRoute}: ${value.text}`);
      if (value.href && !content.includes(`href="${escapeHtml(value.href)}"`)) errors.push(`Missing antidetect overview link: ${localizedRoute}: ${value.href}`);
      Object.values(value).forEach(visit);
    };
    visit([article.blocks, checklist.items, checklist.sources, checklist.note]);
    for (const text of [article.intro, ...article.introParagraphs, article.video.caption, checklist.action.label]) {
      if (!content.includes(escapeHtml(text))) errors.push(`Incomplete antidetect overview: ${localizedRoute}: ${text}`);
    }
    if (!content.includes(`<h1>${escapeHtml(article.title)}</h1>`) || !content.includes('<table') || !content.includes('data-article-checklist') || !content.includes(`href="${article.video.url}"`) || !content.includes(`src="${article.cover.src}"`)) errors.push(`Missing antidetect overview structure: ${localizedRoute}`);
    if (overview.id === 'guide-free-antidetect' && !content.includes('<blockquote>')) errors.push(`Missing MCP prompt quote: ${localizedRoute}`);
    if (/FAQPage|Похожие статьи|data-related-guides|[—–]/.test(content) || html.includes('"@type":"FAQPage"')) errors.push(`Unrequested antidetect overview blocks or punctuation: ${localizedRoute}`);
    const schema = JSON.parse(html.match(/<script[^>]*id="structured-data"[^>]*>([\s\S]*?)<\/script>/)?.[1] || '[]').find(item => item['@type'] === 'Article');
    if (schema?.datePublished !== article.datePublished || schema?.dateModified !== article.dateModified) errors.push(`Wrong fixed antidetect overview dates: ${localizedRoute}`);
  }
  const refreshedPage = guidePages.find(page => `/guides/${page.slug}` === route && guideRefreshMeta[page.id]);
  if (refreshedPage) {
    const article = createGuideRefreshContent(OFFERS)[refreshedPage.id];
    const meta = guideRefreshMeta[refreshedPage.id];
    const content = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] || '';
    for (const block of article.blocks) {
      const parts = block.type === 'paragraph' ? block.content : block.type === 'list' ? block.items.flat() : [];
      const texts = block.type === 'image' ? [block.caption] : block.text ? [block.text] : parts.map(part => part.text.trim());
      for (const text of texts) if (!content.includes(escapeHtml(text))) errors.push(`Missing refreshed guide text: ${localizedRoute}: ${text}`);
      for (const part of parts.filter(part => part.href)) if (!content.includes(`href="${escapeHtml(part.href)}"`)) errors.push(`Missing refreshed guide link: ${localizedRoute}: ${part.href}`);
      if (block.type === 'image' && (!content.includes(`src="${block.src}"`) || !content.includes(`alt="${escapeHtml(block.alt)}"`))) errors.push(`Missing refreshed guide screenshot: ${localizedRoute}: ${block.src}`);
    }
    if (!content.includes(`<h1>${escapeHtml(article.title)}</h1>`)) errors.push(`Wrong refreshed guide H1: ${localizedRoute}`);
    if (/FAQPage|Похожие статьи|data-related-guides/.test(html)) errors.push(`Unrequested guide blocks: ${localizedRoute}`);
    const schema = JSON.parse(html.match(/<script[^>]*id="structured-data"[^>]*>([\s\S]*?)<\/script>/)?.[1] || '[]').find(item => item['@type'] === 'Article');
    if (schema?.datePublished !== meta.datePublished || schema?.dateModified !== meta.dateModified) errors.push(`Wrong fixed refreshed guide dates: ${localizedRoute}`);
  }
  if (route === '/guides/account-farm') {
    const { article, checklist } = createAccountFarmContent(OFFERS);
    const content = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] || '';
    const parts = [article.title, article.intro, ...article.blocks.flatMap(block => block.type === 'paragraph' ? block.content.map(part => part.text.trim()) : block.type === 'image' ? [block.caption] : [block.text]), ...checklist.items.flat().map(part => part.text), checklist.action.label];
    for (const part of parts) if (!content.includes(escapeHtml(part))) errors.push(`Missing complete account farm text: ${localizedRoute}: ${part}`);
    for (const image of [article.cover, ...article.blocks.filter(block => block.type === 'image')]) {
      if (!content.includes(`src="${image.src}"`) || !content.includes(`alt="${escapeHtml(image.alt)}"`)) errors.push(`Missing account farm image: ${localizedRoute}: ${image.src}`);
    }
    for (const link of [...article.blocks.filter(block => block.type === 'paragraph').flatMap(block => block.content), ...checklist.sources.flatMap(source => source.links)].filter(part => part.href)) {
      if (!content.includes(`href="${escapeHtml(link.href)}"`)) errors.push(`Missing account farm link: ${localizedRoute}: ${link.href}`);
    }
    if (/EditThisCookie|EditCookie|auth_token|Vak-sms|Навигация|Похожие статьи|FAQPage|image-(?:11|12|13|14|17|18|19|20|25|26|27|36)\./.test(content)) errors.push(`Obsolete account farm content returned: ${localizedRoute}`);
    if (!html.includes(`<title>${escapeHtml(article.seoTitle)}</title>`) || !html.includes(`<h1>${escapeHtml(article.title)}</h1>`) || !html.includes(`<meta name="description" content="${escapeHtml(article.description)}"`)) errors.push(`Wrong account farm metadata: ${localizedRoute}`);
    const schema = JSON.parse(html.match(/<script[^>]*id="structured-data"[^>]*>([\s\S]*?)<\/script>/)?.[1] || '[]').find(item => item['@type'] === 'Article');
    if (schema?.datePublished !== article.datePublished || schema?.dateModified !== article.dateModified) errors.push(`Wrong account farm dates: ${localizedRoute}`);
  }
  if (route === '/guides/kak-nastroit-antidetect-brauzer') {
    const copy = antidetectSetupCopy;
    const additions = antidetectSetupAdditions;
    const services = getAntidetectGuideServices(OFFERS);
    const checklist = createAntidetectGuideChecklist(OFFERS);
    const content = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] || '';
    const parts = [copy.mainRule, ...copy.foundation.map(part => part.text.trim()), ...copy.roles.flatMap(role => [role.title, role.text]), ...copy.settings.flatMap(row => [row.name, row.value]), ...copy.browserIntros,
      ...copy.checkers.flatMap(checker => [checker.title, checker.text]), ...copy.checks.flatMap(row => row.map(part => part.text.trim())), copy.warning, ...copy.mistakes, copy.closing,
      ...additions.free.map(part => part.text.trim()), ...additions.proxy.map(part => part.text.trim()), ...additions.airplane.map(part => part.text.trim()), additions.freeMore.text, additions.proxyMore.text, additions.connection,
      ...checklist.items.flat().map(part => part.text), checklist.action.label];
    for (const part of parts) if (!content.includes(escapeHtml(part))) errors.push(`Missing complete antidetect article text: ${localizedRoute}: ${part}`);
    for (const image of [antidetectSetupMeta.cover, ...copy.screenshots]) {
      if (!content.includes(`src="${image.src}"`) || !content.includes(`alt="${escapeHtml(image.alt)}"`) || image.caption && !content.includes(escapeHtml(image.caption))) errors.push(`Missing antidetect article image: ${localizedRoute}: ${image.src}`);
    }
    for (const link of [...resolveAntidetectGuideSegments(additions.free, services, true), ...resolveAntidetectGuideSegments(additions.proxy, services), ...checklist.sources.flatMap(source => source.links)].filter(part => part.href)) {
      if (!content.includes(`href="${escapeHtml(link.href)}"`)) errors.push(`Missing antidetect article link: ${localizedRoute}: ${link.href}`);
    }
    if (content.includes('Похожие статьи') || content.includes('id="faq"') || html.includes('"@type":"FAQPage"')) errors.push(`Removed article block returned: ${localizedRoute}`);
  }
  if (route === `/guides/${claudeRecoveryArticle.slug}`) {
    const content = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] || '';
    const segments = (parts) => parts.map(part => part.text);
    const text = [claudeRecoveryArticle.title, claudeRecoveryArticle.intro, ...claudeRecoveryArticle.blocks.flatMap(block => {
      if (block.type === 'paragraph') return segments(block.content);
      if (block.type === 'list') return block.items.flatMap(segments);
      if (block.type === 'table') return [...block.headers, ...block.rows.flat()].flatMap(segments);
      return [block.text];
    })];
    for (const part of text) if (!content.includes(escapeHtml(part))) errors.push(`Missing recovery article text: ${localizedRoute}: ${part}`);
    if (matches(content, /<pre\b/g).length !== 8 || !content.includes('<table')) errors.push(`Missing recovery article prompts or table: ${localizedRoute}`);
  }
  const article = articleFallbackByRoute[route];
  if (!article) return;
  const text = [article.title, article.intro, ...(article.before || []), ...(article.result ? [article.result] : []), ...article.sections.flatMap((part) => part.steps)];
  const links = [...article.sections.flatMap((part) => part.links), ...(article.links || [])];
  if (route === '/proxy-vpn/luchshie-mobilnye-proksi') {
    text.push(article.updated, mobileProxyCopy.shortHeading, mobileProxyCopy.short, mobileProxyCopy.shortNote, mobileProxyCopy.comparison, mobileProxyCopy.comparisonNote, mobileProxyCopy.methodology, mobileProxyCopy.geo, mobileProxyCopy.setupWarning,
      ...mobileProxyCopy.economy.map(part => part.text.trim()), ...mobileProxyCopy.mobileReasons, ...mobileProxyCopy.ipv4Reasons,
      ...mobileProxyCopy.providerColumns, ...mobileProxyCopy.typeColumns, ...mobileProxyCopy.typeRows.flat(), ...mobileProxyCopy.tariffChecks.flat(), ...mobileProxyCopy.setupSteps,
      mobileProxyChecklist.heading, ...mobileProxyChecklist.items.flat().map(part => part.text));
    links.push(mobileProxyCopy.providerLink, mobileProxyCopy.airplaneLink, mobileProxyChecklist.action, ...mobileProxyCopy.economy.filter(part => part.href));
    const content = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] || '';
    for (const screenshot of [mobileProxyMeta.cover, ...mobileProxyCopy.screenshots]) {
      if (!content.includes(`src="${screenshot.src}"`) || !content.includes(`alt="${escapeHtml(screenshot.alt)}"`)) errors.push(`Missing article image: ${localizedRoute}: ${screenshot.src}`);
      if (screenshot.caption) text.push(screenshot.caption);
    }
    if (content.includes('Частые вопросы') || /FAQPage|id="faq"|data-related-guides/.test(html)) errors.push(`Removed article blocks returned: ${localizedRoute}`);
    if (!html.includes(`<title>${escapeHtml(mobileProxyMeta.title)}</title>`) || !html.includes(`<meta name="description" content="${escapeHtml(mobileProxyMeta.description)}"`)) errors.push(`Wrong mobile comparison metadata: ${localizedRoute}`);
    const schema = JSON.parse(html.match(/<script[^>]*id="structured-data"[^>]*>([\s\S]*?)<\/script>/)?.[1] || '[]').find(item => item['@type'] === 'Article');
    if (schema?.datePublished !== mobileProxyMeta.datePublished || schema?.dateModified !== mobileProxyMeta.dateModified) errors.push(`Wrong mobile comparison dates: ${localizedRoute}`);
    for (const provider of mobileProxyProviders) {
      text.push(provider.name, provider.summary, provider.locations, provider.rotation, provider.billing, provider.entryPrice, ...provider.strengths, ...provider.limitations);
      links.push({ href: provider.url });
    }
  }
  if (!html.includes(`<h1>${escapeHtml(article.title)}</h1>`)) errors.push(`Wrong article H1: ${localizedRoute}`);
  for (const part of text) {
    if (!html.includes(escapeHtml(part))) errors.push(`Missing approved article content: ${localizedRoute}: ${part}`);
  }
  for (const { href } of links) {
    if (!html.includes(`href="${escapeHtml(href)}"`)) errors.push(`Missing article CTA: ${localizedRoute}: ${href}`);
  }
};

const checkArticleFooter = (html, route) => {
  const footer = html.match(/<footer\b[^>]*data-article-social-footer[^>]*>([\s\S]*?)<\/footer>/)?.[1] || '';
  const nav = footer.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)?.[1] || '';
  if (!footer.includes('Больше полезного тут:') || footer.indexOf('</nav>') > footer.indexOf('data-article-footer-banner') || !footer.includes('data-article-footer-banner')) errors.push(`Wrong article footer order: ${route}`);
  const footerLinks = matches(nav, /<a\b[^>]*href="([^"]+)"/g).map(match => match[1]);
  if (footerLinks.join('|') !== 'https://t.me/hopscupcrpt|https://www.youtube.com/@hopscup|/') errors.push(`Wrong article footer links: ${route}`);
  if (!nav.includes('>hopscup.tools</a>')) errors.push(`Wrong article site button: ${route}`);
};

const checkFallback = (html, route) => {
  if (matches(html, /<article class="seo-fallback"/g).length !== 1) {
    errors.push(`Expected one static fallback: ${route}`);
  }
  if (!/<div id="root">\s*<noscript>\s*<article class="seo-fallback"[\s\S]*?<\/article>\s*<\/noscript>\s*<\/div>/.test(html)) {
    errors.push(`Static fallback must be a no-JavaScript page inside React root: ${route}`);
  }
  const rules = matches(html, /\.seo-fallback[^{}]*\{([^{}]*)\}/g);
  const hidingDeclaration = /(?:display\s*:\s*none|visibility\s*:\s*(?:hidden|collapse)|opacity\s*:\s*0(?:\D|$)|(?:max-)?(?:width|height)\s*:\s*[01]px|overflow(?:-[xy])?\s*:\s*hidden|clip(?:-path)?\s*:|position\s*:\s*(?:absolute|fixed)|text-indent\s*:\s*-)/i;
  if (rules.length === 0 || rules.some((rule) => hidingDeclaration.test(rule[1]))) {
    errors.push(`Static fallback has missing or hiding styles: ${route}`);
  }
};

const checkLinkPolicy = (html, route) => {
  for (const [anchor, href] of matches(html, /<a\b[^>]*\bhref="([^"]+)"[^>]*>/g)) {
    const rel = new Set((anchor.match(/\brel="([^"]*)"/)?.[1] || '').split(/\s+/));
    const affiliate = isAffiliateUrl(href.replaceAll('&amp;', '&'));
    if (affiliate && !['sponsored', 'noopener', 'noreferrer'].every((value) => rel.has(value))) {
      errors.push(`Partner link missing rel tokens: ${route}: ${href}`);
    }
    if (!affiliate && rel.has('sponsored')) errors.push(`Non-partner link marked sponsored: ${route}: ${href}`);
  }
};

const checkGuideCatalog = (html, language) => {
  const fallback = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] || '';
  const hrefs = new Set(matches(fallback, /<a\b[^>]*\bhref="([^"]+)"/g).map((match) => match[1]));
  if (indexableGuideCatalog.length < 10) errors.push('Static guide catalogue must contain at least 10 indexable guides');
  for (const guide of guideCatalog) {
    const href = `${language.prefix}${guide.route}`;
    if (guide.indexable === false) {
      if (hrefs.has(href)) errors.push(`Noindex guide must not appear in static catalogue: ${href}`);
      continue;
    }
    if (!hrefs.has(href)) errors.push(`Missing guide catalogue link: ${href}`);
    for (const text of [guide.title, guide.description]) {
      if (!fallback.includes(escapeHtml(text[language.prefix.slice(1) || 'ru'] || text.en || text.ru))) {
        errors.push(`Missing shared guide title or description: ${href}`);
      }
    }
  }
};

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
    checkFallback(html, localizedRoute);
    checkArticleContent(html, route, localizedRoute);
    if (articleRoutes.has(route)) checkArticleFooter(html, localizedRoute);
    checkLinkPolicy(html, localizedRoute);
    if (language.indexable && offerByRoute.has(route)) checkServiceContent(html, offerByRoute.get(route), language, localizedRoute);
    if (language.indexable) checkSectionSummaries(html, language, route);
    if (route === '/guides') checkGuideCatalog(html, language);
    if (['/account-shop', '/account-shop/darkstore'].includes(route) && /DarkStore/.test(html)) {
      errors.push(`Outdated visible DarkStore brand: ${localizedRoute}`);
    }
    const description = html.match(/<meta name="description" content="([^"]+)" \/>/)?.[1]?.trim();
    const canonical = html.match(/<link rel="canonical" href="([^"]+)" \/>/)?.[1];
    const robotsMeta = html.match(/<meta name="robots" content="([^"]+)" \/>/)?.[1];
    const alternates = matches(html, /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)" \/>/g);
    const h1Count = matches(html, /<h1[\s>]/g).length;
    const internalLinkCount = matches(html, /<a href="\/(?:en\/|es\/|zh\/|ko\/)?(?:proxy-vpn|antidetect|account-shop|foreign-cards|crypto-exchange|sms-activators|vps|social-boost|steam-topup|guides)(?:\/[^"]*)?"/g).length;
    const structuredDataText = html.match(/<script id="structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    const minimumDescriptionLength = language.hrefLang.startsWith('zh') ? 20 : 50;

    if (!title) errors.push(`Missing title: ${localizedRoute}`);
    if (language.indexable && /^\/(proxy-vpn|antidetect)(?:\/|$)/.test(route) && title?.length > 60) errors.push(`Proxy/antidetect title exceeds 60 characters: ${localizedRoute}`);
    const russianOnlyArticle = articleRoutes.has(route);
    const untranslatedArticle = russianOnlyArticle && language.hrefLang !== 'ru';
    const indexablePage = language.indexable && !untranslatedArticle && !noIndexRoutes.has(route);
    if (title && indexablePage && titles.has(title)) errors.push(`Duplicate title: ${title}`);
    if (title && indexablePage) titles.add(title);
    if (!description || description.length < minimumDescriptionLength) errors.push(`Weak description: ${localizedRoute}`);
    const expectedCanonical = russianOnlyArticle ? `${siteUrl}${route}` : !language.indexable ? `${siteUrl}/en${route}` : `${siteUrl}${localizedRoute}`;
    if (canonical !== expectedCanonical) errors.push(`Wrong canonical: ${localizedRoute}`);
    const expectedLang = russianOnlyArticle ? languages[0].htmlLang : language.htmlLang;
    if (html.match(/<html lang="([^"]+)"/)?.[1] !== expectedLang) errors.push(`Wrong lang: ${localizedRoute}`);
    const expectedAlternates = russianOnlyArticle ? 2 : indexLanguages.length + 1;
    if (alternates.length !== expectedAlternates) errors.push(`Wrong hreflang count: ${localizedRoute}`);
    if (!indexablePage && robotsMeta !== 'noindex, follow') errors.push(`Page expected to be noindex: ${localizedRoute}`);
    if (indexablePage && !robotsMeta?.startsWith('index, follow')) errors.push(`Indexable page has wrong robots meta: ${localizedRoute}`);
    if (h1Count !== 1) errors.push(`Expected one H1: ${localizedRoute}`);
    if (internalLinkCount < 10) errors.push(`Missing crawlable navigation: ${localizedRoute}`);

    try {
      const structuredData = JSON.parse(structuredDataText || 'null');
      const types = Array.isArray(structuredData) ? structuredData.map((item) => item?.['@type']) : [];
      const pageType = articleRoutes.has(route) ? 'Article' : serviceRoutes.includes(route) ? 'WebPage' : 'CollectionPage';
      for (const requiredType of ['WebSite', 'Organization', pageType]) {
        if (!types.includes(requiredType)) errors.push(`Missing ${requiredType} schema: ${localizedRoute}`);
      }
      if (pageType !== 'Article' && structuredData.find(item => item['@type'] === pageType)?.dateModified !== siteDateModified) errors.push(`Missing build dateModified: ${localizedRoute}`);
      const articleMeta = ({ '/proxy-vpn/luchshie-proksi': proxyGuideMeta, '/proxy-vpn/luchshie-mobilnye-proksi': mobileProxyMeta, '/guides/mobile-ip-airplane-mode': mobileIpGuideMeta, '/guides/kak-nastroit-antidetect-brauzer': antidetectSetupMeta, '/guides/account-farm': accountFarmArticle, '/guides/claude-iz-rossii-bez-bana': claudeGuideArticle })[route];
      if (articleMeta && structuredData.find(item => item['@type'] === 'Article')?.dateModified !== articleMeta.dateModified) errors.push(`Wrong fixed article dateModified: ${localizedRoute}`);
      if (route === '/guides/claude-iz-rossii-bez-bana' && structuredData.find(item => item['@type'] === 'Article')?.datePublished !== claudeGuideArticle.datePublished) errors.push(`Wrong Claude article datePublished: ${localizedRoute}`);
    } catch {
      errors.push(`Invalid JSON-LD: ${localizedRoute}`);
    }
  }
}

const rootHtml = await read('index.html');
checkFallback(rootHtml, '/');
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
const indexedArticleCount = [...articleRoutes].filter(route => !noIndexRoutes.has(route)).length;
const indexableRouteCount = routes.filter(route => !noIndexRoutes.has(route)).length + 1;
const expectedSitemapUrls = indexLanguages.length * indexableRouteCount - (indexLanguages.length - 1) * indexedArticleCount;
if (matches(combinedSitemaps, /<loc>/g).length !== expectedSitemapUrls) {
  errors.push('Sitemap has an unexpected number of canonical URLs');
}
const expectedSitemapAlternates = (expectedSitemapUrls - indexedArticleCount) * (indexLanguages.length + 1) + indexedArticleCount * 2;
if (matches(combinedSitemaps, /<xhtml:link /g).length !== expectedSitemapAlternates) {
  errors.push('Sitemap has an unexpected number of language alternates');
}
for (const route of noIndexRoutes) {
  for (const language of languages) {
    if (combinedSitemaps.includes(`${siteUrl}${language.prefix}${route}`)) errors.push(`Noindex route must not be in sitemap: ${language.prefix}${route}`);
  }
}
for (const route of legacyIndexedRoutes) {
  const html = await read(route.slice(1) + '/index.html');
  const prefix = route.split('/')[1];
  const enRoute = route.replace(`/${prefix}`, '/en');
  const baseRoute = route.replace(`/${prefix}`, '');
  const expectedCanonical = articleRoutes.has(baseRoute) ? baseRoute : enRoute;
  if (!html.includes('<meta name="robots" content="noindex, follow" />')) errors.push(`Legacy page must be noindex: ${route}`);
  if (!html.includes(`<link rel="canonical" href="${siteUrl}${expectedCanonical}" />`)) errors.push(`Wrong legacy canonical target: ${route}`);
  if (combinedSitemaps.includes(`<loc>${siteUrl}${route}</loc>`)) errors.push(`Legacy URL must not be in sitemap: ${route}`);
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
