import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {loadOffers} from './load-offers.mjs';
import {partnerEditorialById, partnerMetadataById, getPartnerIntroduction} from '../src/data/partnerCardRefresh.js';
import {localizedServiceValue} from '../src/data/servicePresentation.js';
import {accountShopPages} from '../src/data/accountShopPages.js';
import {antidetectPages} from '../src/data/antidetectPages.js';
import {guidePages} from '../src/data/guidePages.js';
import {getServiceContextualGuideLinks} from '../src/data/contextualGuideLinks.js';
import {isIndexablePath} from '../src/data/indexPolicy.js';
import {getExternalLinkRel} from '../src/lib/externalLinks.js';
import {normalizeCopy, staticServiceText, withoutEditorialParagraphBreaks} from './partner-copy-helpers.mjs';

const {OFFERS} = await loadOffers();
const hash = data => createHash('sha256').update(JSON.stringify(data)).digest('hex');
const fields = {description: 'Описание', capabilities: 'Что умеет', pricing: 'Цены', bestFor: 'Подойдёт', considerations: 'Учтите', gettingStarted: 'Как начать', verdict: 'Вывод'};
const source = (await readFile(new URL('./fixtures/partner-cards-3.md', import.meta.url), 'utf8')).replaceAll('\r\n', '\n');
const snapshot = {
  "facts": {
    "ant-shardx": "3a99a06a80a74fc9433906f81eadf72863ee794750403b4793ccfe1b9b78d7b4",
    "bot-lachuga": "956f17ae9ffb52e074f9328ca338f67f4ddb9308794f18c2e4574c2e5992a8a8"
  },
  "others": "57bcf73f1d4006246bedd00b07ce819a58b586ea4a1883326c088fc0d4e2ecdf",
  "guideDates": "0ed3ebd20646d3e7509e5cd31b3af7bbf43a8dd92a7662f8f6d3e472d4f2cfe9",
  "headings": [
    {
      "route": "/account-shop/lachuga-skamera",
      "h1": "Лачуга: дешёвые подписки в Telegram"
    },
    {
      "route": "/en/account-shop/lachuga-skamera",
      "h1": "Lachuga discounted subscriptions"
    },
    {
      "route": "/antidetect/shardx",
      "h1": "ShardX: бесплатный антидетект без лимита профилей"
    },
    {
      "route": "/en/antidetect/shardx",
      "h1": "ShardX: free antidetect with unlimited profiles"
    }
  ]
};
const approved = source.split(/\n# /).slice(1).map(chunk => {
  const [, name, id, route] = chunk.match(/^(.+?) \((bot-lachuga|ant-shardx), ([^)]+)\)/);
  const editorial = Object.fromEntries(Object.entries(fields).map(([key, label]) => {
    const body = chunk.match(new RegExp('\\*\\*' + label + '(?:\\.)?\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*|\\n\\(Ссылки:|$)'))[1].trim();
    return [key, ['description', 'verdict'].includes(key) ? body : body.split('\n').map(line => line.replace(/^(?:-|\d+\.)\s+/, '').trim())];
  }));
  return {name, id, route, editorial,
    title: chunk.match(/- Title [^\n]*?: (.+)/)[1],
    description: chunk.match(/- Description [^\n]*?: (.+)/)[1],
    links: [...chunk.matchAll(/(?:строка )?«([^»]+)» → (\/[a-z0-9/-]+)/g)].map(match => ({label: match[1], href: match[2]})),
  };
});
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const linksFor = offer => [...offer.editorial.links, ...(offer.editorial.setupGuide ? [offer.editorial.setupGuide] : []), ...getServiceContextualGuideLinks(offer)];

test('third partner batch matches all seven Russian fields, SEO and complete link captions in the attachment', () => {
  assert.equal(approved.length, 2);
  for (const page of approved) {
    const offer = OFFERS.find(item => item.id === page.id);
    for (const [key, value] of Object.entries(page.editorial)) {
      assert.deepEqual(normalizeCopy(offer.editorial[key].ru), normalizeCopy(value), page.id + ': ' + key);
      assert.ok(offer.editorial[key].en.length, page.id + ': EN ' + key);
    }
    assert.equal(partnerMetadataById[page.id].title.ru, page.title);
    assert.equal(offer.editorial.seoDescription.ru, page.description);
    for (const link of page.links) {
      const matches = linksFor(offer).filter(item => item.href === link.href);
      assert.equal(matches.length, 1, page.id + ': duplicate ' + link.href);
      assert.equal(matches[0].label.ru, link.label);
    }
    assert.doesNotMatch(JSON.stringify(partnerEditorialById[page.id]), /—|\(Ссылки:/);
    assert.equal(offer.editorial.dateModified, '2026-11-19');
  }
});

test('Lachuga and ShardX keep all original tile fields, other offers and guide dates', () => {
  for (const [id, expected] of Object.entries(snapshot.facts)) {
    const {editorial, ...facts} = OFFERS.find(item => item.id === id);
    assert.equal(hash(facts), expected, id);
  }
  // The fourth approved batch has its own editorial and tile snapshots.
  assert.equal(hash(OFFERS.filter(item => !snapshot.facts[item.id] && !['vpn-ppl', 'vpn-imp', 'vpn-all', 'vpn-tochka-g'].includes(item.id)).map(item => ({id: item.id, hash: hash(withoutEditorialParagraphBreaks(item))}))), snapshot.others);
  assert.equal(hash(guidePages.map(page => ({id: page.id, datePublished: page.datePublished, dateModified: page.dateModified}))), snapshot.guideDates);
  assert.match(getExternalLinkRel(OFFERS.find(item => item.id === 'bot-lachuga').url), /sponsored/);
  assert.equal(getExternalLinkRel(OFFERS.find(item => item.id === 'ant-shardx').url), 'noopener noreferrer');
});

test('only Lachuga overrides the shop metadata and shared bot considerations stay intact', () => {
  const otherBots = accountShopPages.filter(page => ['bot-thegod', 'bot-crassus', 'bot-apel0sin', 'bot-apel0sin-market-2', 'bot-petrovich'].includes(page.id));
  assert.ok(otherBots.length > 1);
  assert.ok(otherBots.every(page => page.editorial.considerations === otherBots[0].editorial.considerations));
  const lachuga = accountShopPages.find(page => page.id === 'bot-lachuga');
  assert.notEqual(lachuga.editorial.considerations, otherBots[0].editorial.considerations);
  const thegod = accountShopPages.find(page => page.id === 'bot-thegod');
  assert.equal(thegod.title.ru, 'TheGod Shop: что продают, оплата и мой опыт | Hopscup Tools');
  for (const id of ['bot-lachuga', 'ant-shardx']) {
    const page = [...accountShopPages, ...antidetectPages].find(page => page.id === id);
    const offer = OFFERS.find(item => item.id === id);
    assert.deepEqual(page.title, partnerMetadataById[id].title);
    assert.deepEqual(page.description, partnerMetadataById[id].description);
    assert.deepEqual(page.tileDescription, offer.description);
  }
});

test('third batch explicitly falls back to unchanged English copy on closed language pages', () => {
  for (const page of approved) {
    const offer = OFFERS.find(item => item.id === page.id);
    for (const language of ['es', 'zh', 'ko']) {
      for (const key of Object.keys(fields)) assert.deepEqual(offer.editorial[key][language], offer.editorial[key].en);
      assert.equal(getPartnerIntroduction(offer, language), offer.editorial.description.en);
      for (const link of linksFor(offer)) assert.equal(link.label[language], link.label.en);
    }
  }
});

test('static third-batch cards have full copy, single review and YouTube links, fixed dates and preserved H1', async () => {
  for (const page of approved) for (const prefix of ['', '/en', '/es', '/zh', '/ko']) {
    const language = prefix ? 'en' : 'ru';
    const html = await readFile('dist' + prefix + page.route + '/index.html', 'utf8');
    const content = html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1];
    const visibleText = staticServiceText(content);
    assert.ok(html.includes('<title>' + escape(partnerMetadataById[page.id].title[language]) + '</title>'));
    assert.ok(html.includes('name="description" content="' + escape(partnerMetadataById[page.id].description[language]) + '"'));
    const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(match => JSON.parse(match[1]));
    assert.equal(schemas.find(schema => schema['@type'] === 'WebPage').dateModified, '2026-11-19');
    if (['', '/en'].includes(prefix)) {
      const heading = snapshot.headings.find(item => item.route === prefix + page.route).h1;
      assert.ok(content.includes('<h1>' + escape(heading) + '</h1>'));
    }
    for (const key of Object.keys(fields)) {
      const value = partnerEditorialById[page.id][key][language];
      for (const text of Array.isArray(value) ? value : [value]) assert.ok(visibleText.includes(escape(normalizeCopy(text))), page.id + ': ' + prefix + ' ' + key);
    }
    assert.equal(visibleText.split(escape(normalizeCopy(partnerEditorialById[page.id].description[language]))).length - 1, 1);
    const offer = OFFERS.find(item => item.id === page.id);
    for (const link of linksFor(offer)) {
      const href = prefix + link.href;
      assert.equal(content.split('href="' + href + '"').length - 1, 1, page.id + ': duplicate ' + href);
      assert.ok(content.includes('<a href="' + href + '">' + escape(localizedServiceValue(link.label, language)) + '</a>'));
    }
    assert.equal(isIndexablePath(prefix + page.route), prefix === '');
    assert.match(html, prefix ? /name="robots" content="noindex, follow"/ : /name="robots" content="index, follow/);
    assert.doesNotMatch(content, /FAQPage|data-related-articles/);
  }
});
