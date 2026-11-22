import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {loadOffers} from './load-offers.mjs';
import {partnerEditorialById, partnerMetadataById, getPartnerIntroduction} from '../src/data/partnerCardRefresh.js';
import {getServiceEditorialSections, splitServiceParagraphs} from '../src/data/servicePresentation.js';
import {getServiceContextualGuideLinks} from '../src/data/contextualGuideLinks.js';
import {vpnTerms} from '../src/data/vpnDetails.js';
import {guidePages} from '../src/data/guidePages.js';
import {isIndexablePath} from '../src/data/indexPolicy.js';
import {getExternalLinkRel} from '../src/lib/externalLinks.js';
import {normalizeCopy, staticServiceText} from './partner-copy-helpers.mjs';

const {OFFERS} = await loadOffers();
const fields = {description: 'Описание', capabilities: 'Что умеет', pricing: 'Цены', bestFor: 'Подойдёт', considerations: 'Учтите', gettingStarted: 'Как начать', verdict: 'Вывод'};
const source = (await readFile(new URL('./fixtures/partner-cards-4.md', import.meta.url), 'utf8')).replaceAll('\r\n', '\n');
const snapshot = JSON.parse(await readFile(new URL('./fixtures/partner-cards-4-baseline.json', import.meta.url), 'utf8'));
const paragraphSource = (await readFile(new URL('./fixtures/partner-description-paragraphs.md', import.meta.url), 'utf8')).replaceAll('\r\n', '\n');
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const linksFor = offer => [...offer.editorial.links, ...getServiceContextualGuideLinks(offer)];
const approved = source.split(/\n# /).slice(1).map(chunk => {
  const [, name, id, route] = chunk.match(/^(.+?) \((vpn-[a-z-]+), ([^)]+)\)/);
  const editorial = Object.fromEntries(Object.entries(fields).map(([key, label]) => {
    const body = chunk.match(new RegExp('\\*\\*' + label + '(?:\\.)?\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|\\n\\(Ссылки:|$)'))[1].trim();
    return [key, ['description', 'verdict'].includes(key) ? body : body.split('\n').map(line => line.replace(/^(?:-|\d+\.)\s+/, '').trim())];
  }));
  const paragraphSection = paragraphSource.split('\n## ' + id + ' ')[1].split(/\n## /)[0];
  return {name, id, route, editorial,
    paragraphs: paragraphSection.slice(paragraphSection.indexOf('\n') + 1).trim(),
    title: chunk.match(/- Title [^\n]*?: (.+)/)[1],
    description: chunk.match(/- Description [^\n]*?: (.+)/)[1],
    links: [...chunk.matchAll(/«([^»]+)» → (\/[a-z0-9/-]+)/g)].map(match => ({label: match[1], href: match[2]})),
  };
});

test('fourth partner batch matches all seven Russian blocks, SEO and full link captions verbatim', () => {
  assert.equal(approved.length, 4);
  for (const page of approved) {
    const offer = OFFERS.find(item => item.id === page.id);
    for (const [key, value] of Object.entries(page.editorial)) {
      assert.deepEqual(normalizeCopy(offer.editorial[key].ru), normalizeCopy(value), page.id + ': ' + key);
      assert.ok(offer.editorial[key].en.length, page.id + ': EN ' + key);
    }
    assert.equal(offer.editorial.description.ru, page.paragraphs);
    assert.equal(splitServiceParagraphs(offer.editorial.description.en).length, splitServiceParagraphs(page.paragraphs).length);
    assert.equal(partnerMetadataById[page.id].title.ru, page.title);
    assert.equal(offer.editorial.seoDescription.ru, page.description);
    assert.equal(offer.editorial.dateModified, '2026-11-22');
    for (const link of page.links) {
      const matches = linksFor(offer).filter(item => item.href === link.href);
      assert.equal(matches.length, 1, page.id + ': duplicate ' + link.href);
      assert.equal(matches[0].label.ru, link.label);
    }
    assert.doesNotMatch(JSON.stringify(partnerEditorialById[page.id]), /[\u2013\u2014]|\(Ссылки:/);
  }
});

test('fourth batch preserves tiles, VPN terms, referrals, fallback blocks, all other offers and guide dates', () => {
  for (const [id, expected] of Object.entries(snapshot.facts)) {
    const {editorial, ...facts} = OFFERS.find(item => item.id === id);
    assert.equal(hash(facts), expected, id + ': catalogue and service facts');
    for (const [key, value] of Object.entries(snapshot.preservedEditorial[id])) assert.deepEqual(editorial[key], value, id + ': ' + key);
    assert.match(getExternalLinkRel(facts.url), /sponsored/);
  }
  assert.deepEqual(vpnTerms, snapshot.vpnTerms);
  assert.equal(hash(OFFERS.filter(item => !snapshot.facts[item.id])), snapshot.others);
  assert.equal(hash(guidePages.map(page => ({id: page.id, datePublished: page.datePublished, dateModified: page.dateModified}))), snapshot.guideDates);
});

test('fourth-batch closed translations use the English editorial fallback without changing facts', () => {
  for (const page of approved) {
    const offer = OFFERS.find(item => item.id === page.id);
    for (const language of ['es', 'zh', 'ko']) {
      for (const key of Object.keys(fields)) assert.deepEqual(offer.editorial[key][language], offer.editorial[key].en);
      assert.equal(getPartnerIntroduction(offer, language), offer.editorial.description.en);
      for (const link of offer.editorial.links) assert.equal(link.label[language], link.label.en);
    }
  }
});

test('Tochka G replaces pricing and names the fallback block without assuming its position', () => {
  const offer = OFFERS.find(item => item.id === 'vpn-tochka-g');
  const sections = getServiceEditorialSections(offer, 'ru');
  assert.deepEqual(sections.find(section => section.key === 'pricing').items, approved.find(page => page.id === offer.id).editorial.pricing);
  assert.ok(sections.findIndex(section => section.key === 'telegramFallback') > sections.findIndex(section => section.key === 'gettingStarted'));
  assert.equal(offer.editorial.gettingStarted.ru[0], 'Если Telegram не грузит, переходите по бесплатной ссылке на 40 минут: она есть на этой странице в блоке «Если не работает Telegram».');
  assert.equal(offer.editorial.gettingStarted.en[0], 'If Telegram will not load, use the free 40-minute link in the "If Telegram does not work" block on this page.');
});

test('static fourth-batch cards have full copy, separate paragraphs, unique links, fixed dates and unchanged H1', async () => {
  for (const page of approved) for (const prefix of ['', '/en', '/es', '/zh', '/ko']) {
    const language = prefix ? 'en' : 'ru';
    const html = await readFile('dist' + prefix + page.route + '/index.html', 'utf8');
    const content = html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1];
    const visibleText = staticServiceText(content);
    assert.ok(html.includes('<title>' + escape(partnerMetadataById[page.id].title[language]) + '</title>'));
    assert.ok(html.includes('name="description" content="' + escape(partnerMetadataById[page.id].description[language]) + '"'));
    const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(match => JSON.parse(match[1]));
    assert.equal(schemas.find(schema => schema['@type'] === 'WebPage').dateModified, '2026-11-22');
    if (!prefix || prefix === '/en') assert.ok(content.includes('<h1>' + escape(snapshot.headings.find(item => item.route === prefix + page.route).h1) + '</h1>'));
    for (const key of Object.keys(fields)) {
      const value = partnerEditorialById[page.id][key][language];
      for (const text of Array.isArray(value) ? value : [value]) assert.ok(visibleText.includes(escape(normalizeCopy(text))), page.id + ': ' + prefix + ' ' + key);
    }
    for (const paragraph of splitServiceParagraphs(offerFor(page.id).editorial.description[language])) assert.equal(content.split('<p>' + escape(paragraph) + '</p>').length - 1, 1);
    for (const link of linksFor(offerFor(page.id))) {
      const href = prefix + link.href;
      const anchor = '<a href="' + href + '">' + escape(link.label[language] || link.label.en) + '</a>';
      assert.equal(content.split(anchor).length - 1, 1, page.id + ': duplicate editorial link ' + href);
      // Section URLs also occur in breadcrumbs; guide links must not be duplicated anywhere.
      if (link.href.startsWith('/guides/')) assert.equal(content.split('href="' + href + '"').length - 1, 1, page.id + ': duplicate guide ' + href);
    }
    assert.equal(isIndexablePath(prefix + page.route), prefix === '');
    assert.match(html, prefix ? /name="robots" content="noindex, follow"/ : /name="robots" content="index, follow/);
    assert.doesNotMatch(content, /FAQPage|data-related-articles|\(Ссылки:/);
    if (page.id === 'vpn-tochka-g') assert.ok(content.indexOf('data-editorial-section="telegramFallback"') > content.indexOf('data-editorial-section="gettingStarted"'));
  }
});

const offerFor = id => OFFERS.find(item => item.id === id);
