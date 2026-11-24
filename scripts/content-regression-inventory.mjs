import { createHash } from 'node:crypto';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadOffers } from './load-offers.mjs';
import { isAffiliateUrl } from '../src/lib/externalLinks.js';
import { localizedServiceValue, serviceCategoryRoutes, serviceFactLabels, plainSeoText } from '../src/data/servicePresentation.js';
import { getPartnerIntroduction } from '../src/data/partnerCardRefresh.js';

export const languages = ['ru', 'en', 'es', 'zh', 'ko'];
export const normalizeText = value => String(value ?? '').normalize('NFC').replace(/\s+/gu, ' ').trim();
export const hash = value => createHash('sha256').update(value).digest('hex');
export const normalizeUrl = href => {
  try { return new URL(href, 'https://hopscup.tools').href; } catch { return null; }
};
export const isExternalUrl = href => {
  const url = normalizeUrl(href);
  return Boolean(url && /^https?:/.test(url) && new URL(url).hostname !== 'hopscup.tools');
};

// Read the data itself, not the renderer's allowlist of supported fields.
export function selectAuthorIntroduction(offer, language, { localize = localizedServiceValue, translations = {} } = {}) {
  const partner = getPartnerIntroduction(offer, language);
  if (partner) return { text: partner, source: 'getPartnerIntroduction' };
  const own = offer.description?.[language];
  const translated = translations[offer.id]?.[language];
  const ownFirst = ['Stores', 'Antidetect', 'Cards', 'Crypto', 'Guides'].includes(offer.category) && offer.editorial && own;
  return ownFirst ? { text: own, source: 'offer.description' }
    : translated ? { text: translated, source: 'OFFER_DESCRIPTION_TRANSLATIONS' }
    : { text: own || localize(offer.description, language), source: 'offer.description' };
}

const cardStatLabels = {
  issuance: ['Выпуск', 'Issuance', 'Emisión', '开卡', '발급'],
  maintenance: ['Обслуживание', 'Monthly Fee', 'Cuota mensual', '月费', '월 사용료'],
  verification: ['Верификация (KYC)', 'Verification (KYC)', 'Verificación (KYC)', '身份验证 (KYC)', '인증 (KYC)'],
  cashback: ['Кешбек', 'Cashback', '返现', '캐시백'],
  topup: ['Пополнение', 'Top-up', 'Recarga', '充值', '충전'],
  type: ['Тип', 'Type', 'Tipo', '类型', '유형'],
};

export function fieldExpectations(offer, language, localize = localizedServiceValue, { author = selectAuthorIntroduction(offer, language, { localize }), staticCopy = false } = {}) {
  const result = [];
  const localized = value => value && typeof value === 'object' && !Array.isArray(value)
    && languages.some(code => Object.hasOwn(value, code)) ? localize(value, language) : value;
  const add = (field, value) => {
    if (value == null || value === '') return;
    if (Array.isArray(value)) value.forEach((item, index) => add(`${field}[${index}]`, item));
    else if (typeof value === 'object') Object.entries(value).forEach(([key, item]) => add(`${field}.${key}`, item));
    else {
      const key = field.startsWith('cardStats.') ? field.slice('cardStats.'.length) : undefined;
      const original = normalizeText(value);
      const expected = staticCopy ? plainSeoText(original) : original;
      result.push({ field, value: expected, ...(expected !== original ? { sourceValue: original, transformation: 'plainSeoText' } : {}),
        ...(key ? { rowKey: key, rowLabels: [...(serviceFactLabels[key] || [key]), ...(cardStatLabels[key] || [])] } : {}) });
    }
  };
  for (const group of ['details', 'cardStats']) {
    for (const [key, value] of Object.entries(offer[group] || {})) add(`${group}.${key}`, localized(value));
  }
  if (offer.promoCode) add('promoCode', offer.promoCode);
  const description = author.text;
  const firstParagraph = typeof description === 'string' ? description.split(/\r?\n\s*\r?\n/)[0] : '';
  if (firstParagraph) {
    const original = normalizeText(firstParagraph);
    const value = staticCopy ? plainSeoText(original) : original;
    result.push({ field: 'author.firstParagraph', source: author.source, value, paragraph: true,
      ...(value !== original ? { sourceValue: original, transformation: 'plainSeoText' } : {}) });
  }
  return result;
}

export function linkExpectations(offer) {
  return ['url', 'webUrl'].filter(field => offer[field]).map(field => ({ field, href: normalizeUrl(offer[field]), sponsored: isAffiliateUrl(offer[field]) }));
}

export function containsValue(text, value) {
  const haystack = normalizeText(text);
  const needle = normalizeText(value);
  let offset = haystack.indexOf(needle);
  while (offset !== -1) {
    const before = haystack[offset - 1] || '';
    const after = haystack[offset + needle.length] || '';
    const first = needle[0] || '';
    const last = needle.at(-1) || '';
    const partialNumber = /\p{N}/u.test(first) && /\d[.,]$/.test(haystack.slice(Math.max(0, offset - 2), offset));
    if (!partialNumber && !(/[\p{L}\p{N}]/u.test(first) && /[\p{L}\p{N}]/u.test(before))
      && !(/[\p{L}\p{N}]/u.test(last) && /[\p{L}\p{N}]/u.test(after))) return true;
    offset = haystack.indexOf(needle, offset + 1);
  }
  return false;
}

export function checkServiceSnapshot(expected, snapshot) {
  const defects = [];
  for (const item of expected.fields) {
    const rows = item.rowKey ? (snapshot.facts || []).filter(row => row.key === item.rowKey
      || item.rowLabels.some(label => normalizeText(label).toLocaleLowerCase() === normalizeText(row.label).toLocaleLowerCase())) : [];
    const found = item.rowKey ? rows.some(row => containsValue(row.value, item.value)) : item.paragraph
      ? (snapshot.authorParagraphs ?? snapshot.paragraphs).some(text => normalizeText(text) === item.value)
      : containsValue(snapshot.text, item.value);
    if (!found) defects.push({ kind: 'missing-text', field: item.field, expected: item.value });
  }
  for (const item of expected.links) {
    const matches = snapshot.links.filter(link => normalizeUrl(link.href) === item.href);
    if (!matches.length) defects.push({ kind: 'missing-link', field: item.field, expected: item.href });
    else if (item.sponsored && matches.some(link => !String(link.rel || '').split(/\s+/).includes('sponsored'))) {
      defects.push({ kind: 'missing-sponsored', field: item.field, expected: item.href });
    } else if (!item.sponsored && matches.some(link => String(link.rel || '').split(/\s+/).includes('sponsored'))) {
      defects.push({ kind: 'unexpected-sponsored', field: item.field, expected: item.href });
    }
  }
  return defects;
}

export function checkExternalLinkParity(staticSnapshot, reactSnapshot) {
  const expected = [...new Set(staticSnapshot.links.map(link => normalizeUrl(link.href)).filter(isExternalUrl))];
  const actual = new Set(reactSnapshot.links.map(link => normalizeUrl(link.href)));
  return expected.filter(href => !actual.has(href)).map(href => ({ kind: 'missing-external-link', expected: href }));
}

export const routeFromFile = file => '/' + file.replaceAll('\\', '/').replace(/(?:\/)?index\.html$/, '').replace(/\/$/, '');
export const extractNoscript = html => [...html.matchAll(/<noscript\b[^>]*>([\s\S]*?)<\/noscript\s*>/gi)].map(match => match[1]).join('\n');

async function sourceFingerprint(root) {
  const files = ['src/App.tsx', 'src/components/ServiceModal.tsx', 'src/components/CatalogToolsDialogs.tsx', 'scripts/client-content-plugin.mjs', 'src/lib/clientContent.ts', 'src/lib/externalLinks.js', ...(await readdir(path.join(root, 'src/data'), { recursive: true }))
    .filter(file => /\.(?:js|json|ts)$/.test(file)).map(file => 'src/data/' + file.replaceAll('\\', '/'))].sort();
  return hash((await Promise.all(files.map(async file => `${file}:${hash(await readFile(path.join(root, file)))}`))).join('\n'));
}

export async function createInventory({ root = process.cwd(), dist = path.join(root, 'dist') } = {}) {
  const { OFFERS, OFFER_DESCRIPTION_TRANSLATIONS, getLocalizedValue } = await loadOffers({ extraNames: ['getLocalizedValue'] });
  const services = OFFERS.filter(offer => offer.slug && offer.category !== 'Guides');
  if (!services.length) throw Error('No service offers found; refusing an empty audit');
  const serviceRoutes = new Map();
  const expectedServices = [];
  const unusedEditorialDescriptions = [];
  for (const offer of services) {
    const category = serviceCategoryRoutes[offer.category];
    if (!category) throw Error(`Unknown service category: ${offer.category} (${offer.id})`);
    for (const language of languages) {
      const route = `${language === 'ru' ? '' : '/' + language}${category}/${offer.slug}`;
      if (serviceRoutes.has(route)) throw Error(`Duplicate service route: ${route}`);
      const authorReact = selectAuthorIntroduction(offer, language, { localize: getLocalizedValue, translations: OFFER_DESCRIPTION_TRANSLATIONS });
      const editorial = localizedServiceValue(offer.editorial?.description, language);
      if (editorial && authorReact.source !== 'getPartnerIntroduction') unusedEditorialDescriptions.push({ id: offer.id, route, language,
        reason: 'Editorial metadata is not selected as the author introduction', editorialDescription: editorial, selectedSource: authorReact.source,
        sameAsAuthor: normalizeText(editorial) === normalizeText(authorReact.text) });
      const item = { id: offer.id, category: offer.category, language, route,
        links: linkExpectations(offer),
        staticFields: fieldExpectations(offer, language, localizedServiceValue, { author: authorReact, staticCopy: true }),
        // App's documented language fallback can translate a missing EN value.
        // This helper does not select which fields the UI renders.
        reactFields: fieldExpectations(offer, language, getLocalizedValue, { author: authorReact }) };
      serviceRoutes.set(route, item);
      expectedServices.push(item);
    }
  }
  const files = (await readdir(dist, { recursive: true })).filter(file => /(?:^|[\\/])index\.html$/.test(file)).sort();
  const pages = [];
  for (const file of files) {
    const route = routeFromFile(file);
    const html = await readFile(path.join(dist, file), 'utf8');
    const noscript = extractNoscript(html);
    // Every emitted content page is included, even if it is noindex or untranslated.
    if (!noscript.includes('seo-fallback')) throw Error(`Missing static fallback: ${route}`);
    const service = serviceRoutes.get(route);
    pages.push({ route, file, hash: hash(html), noscript, service,
      kind: service ? 'service' : /\/guides\/[^/]+$/.test(route) || /data-static-article=/.test(noscript) ? 'article' : 'section' });
  }
  const emitted = new Set(pages.map(page => page.route));
  const missingPages = expectedServices.filter(item => !emitted.has(item.route));
  const sourceHash = await sourceFingerprint(root);
  const distHash = hash(pages.map(page => `${page.file}:${page.hash}`).join('\n'));
  return { version: 1, root, dist, sourceHash, distHash, generatedAt: new Date().toISOString(),
    languages, serviceCount: services.length, expectedServices, missingPages, pages, unusedEditorialDescriptions,
    ordinaryServiceLinks: services.filter(offer => !isAffiliateUrl(offer.url)).map(offer => ({ id: offer.id, url: offer.url })) };
}

export async function saveInventory(inventory, destination) {
  await mkdir(path.dirname(destination), { recursive: true });
  // Raw HTML is reread by the runner; keep the reusable inventory compact.
  await writeFile(destination, JSON.stringify({ ...inventory, pages: inventory.pages.map(({ noscript, ...page }) => page) }, null, 2) + '\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const inventory = await createInventory();
  const destination = path.resolve(process.env.CONTENT_REGRESSION_REPORT || 'reports/content-regression', 'inventory.json');
  await saveInventory(inventory, destination);
  console.log(JSON.stringify({ destination, services: inventory.serviceCount, serviceVersions: inventory.expectedServices.length,
    pages: inventory.pages.length, missingPages: inventory.missingPages.map(item => item.route), ordinaryServiceLinks: inventory.ordinaryServiceLinks }, null, 2));
  if (inventory.missingPages.length) process.exitCode = 1;
}
