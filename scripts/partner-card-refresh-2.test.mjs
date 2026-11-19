import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {loadOffers} from './load-offers.mjs';
import {partnerEditorialById, partnerMetadataById, getPartnerIntroduction} from '../src/data/partnerCardRefresh.js';
import {localizedServiceValue} from '../src/data/servicePresentation.js';
import {foreignCardPages} from '../src/data/foreignCardPages.js';
import {guidePages} from '../src/data/guidePages.js';
import {pgonQrAbroad, withPgonQrAbroad} from '../src/data/pgonQrAbroad.js';
import {getExternalLinkRel} from '../src/lib/externalLinks.js';

const {OFFERS} = await loadOffers();
const hash = data => createHash('sha256').update(JSON.stringify(data)).digest('hex');
const fields = {description: 'Описание', capabilities: 'Что умеет', pricing: 'Цены', bestFor: 'Подойдёт', considerations: 'Учтите', gettingStarted: 'Как начать', verdict: 'Вывод'};
const source = (await readFile(new URL('./fixtures/partner-cards-2.md', import.meta.url), 'utf8')).replaceAll('\r\n', '\n');
const snapshot = {
  "facts": {
    "p1": "95d711cedd7cc1715bc4e52475d3a55cee2c1454fd8bc671dc7b05366db8ca40",
    "p4": "9ba625c621c48e1bb174bc606343c26e7c94b1434dcc092aa982deaa1f4fe049",
    "zarub": "cd55b328810de4f5cbca2a2c6db9cc94b892d339227dee60910c7bc1e819c24f",
    "pgon": "e13b10499082976ca2aa6f86c7a3e3076af451747be164408abc54fb60775054"
  },
  "others": "84c74878a28f55b062052ffcbf251b990aec7d243f1eb4838cf7082e974ac0e7",
  "guideDates": "0ed3ebd20646d3e7509e5cd31b3af7bbf43a8dd92a7662f8f6d3e472d4f2cfe9",
  "headings": [
    {
      "route": "/proxy-vpn/proxy-seller",
      "h1": "Proxy-Seller: большой выбор прокси и гео"
    },
    {
      "route": "/en/proxy-vpn/proxy-seller",
      "h1": "Proxy-Seller: a large proxy and location catalog"
    },
    {
      "route": "/proxy-vpn/proxyshard",
      "h1": "ProxyShard: разные типы прокси в одном сервисе"
    },
    {
      "route": "/en/proxy-vpn/proxyshard",
      "h1": "ProxyShard: multiple proxy types in one service"
    },
    {
      "route": "/foreign-cards/zarub",
      "h1": "Zarub для оплаты зарубежных сервисов без KYC"
    },
    {
      "route": "/en/foreign-cards/zarub",
      "h1": "Zarub for foreign payments without KYC"
    },
    {
      "route": "/foreign-cards/pgon",
      "h1": "PGON: виртуальная карта и оплата криптой по QR"
    },
    {
      "route": "/en/foreign-cards/pgon",
      "h1": "PGON: a virtual card and crypto payments by QR"
    }
  ]
};
const approved = source.split(/\n# /).slice(1).map(chunk => {
  const [, name, id, route] = chunk.match(/^(.+?) \((p4|p1|zarub|pgon), ([^)]+)\)/);
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

test('second partner batch matches all seven Russian fields, SEO and links in the supplied source verbatim', () => {
  assert.equal(approved.length, 4);
  for (const page of approved) {
    const offer = OFFERS.find(item => item.id === page.id);
    for (const [key, value] of Object.entries(page.editorial)) {
      assert.deepEqual(offer.editorial[key].ru, value, page.id + ': ' + key);
      assert.ok(offer.editorial[key].en.length, page.id + ': EN ' + key);
    }
    assert.equal(partnerMetadataById[page.id].title.ru, page.title);
    assert.equal(offer.editorial.seoDescription.ru, page.description);
    for (const link of page.links) assert.ok(offer.editorial.links.some(item => item.href === link.href && item.label.ru === link.label));
    assert.doesNotMatch(JSON.stringify(partnerEditorialById[page.id]), /—|\(Ссылки:/);
    assert.equal(offer.editorial.dateModified, '2026-11-19');
  }
});

test('second partner batch preserves every tile field, other offers and all guide dates', () => {
  for (const [id, expected] of Object.entries(snapshot.facts)) {
    const {editorial, ...facts} = OFFERS.find(item => item.id === id);
    assert.equal(hash(facts), expected, id);
    assert.match(getExternalLinkRel(facts.url), /sponsored/);
  }
  // The third approved batch has its own editorial and tile snapshots.
  assert.equal(hash(OFFERS.filter(item => !snapshot.facts[item.id] && !['bot-lachuga', 'ant-shardx'].includes(item.id)).map(item => ({id: item.id, hash: hash(item)}))), snapshot.others);
  assert.equal(hash(guidePages.map(page => ({id: page.id, datePublished: page.datePublished, dateModified: page.dateModified}))), snapshot.guideDates);
});

test('only the refreshed foreign cards override card metadata and use EN editorial fallback', () => {
  for (const page of approved) {
    const offer = OFFERS.find(item => item.id === page.id);
    for (const language of ['es', 'zh', 'ko']) {
      for (const key of Object.keys(fields)) assert.deepEqual(offer.editorial[key][language], offer.editorial[key].en);
      for (const link of partnerEditorialById[page.id].links) {
        assert.equal(offer.editorial.links.find(item => item.href === link.href).label[language], link.label.en);
      }
      assert.equal(getPartnerIntroduction(offer, language), offer.editorial.description.en);
    }
  }
  for (const id of ['zarub', 'pgon']) {
    const page = foreignCardPages.find(item => item.id === id);
    assert.deepEqual(page.title, partnerMetadataById[id].title);
    assert.deepEqual(page.description, partnerMetadataById[id].description);
  }
  const cashin = foreignCardPages.find(item => item.id === 'cashinout');
  assert.equal(cashin.title.ru, 'Cashin Out: зарубежная карта, комиссии и оплата сервисов | Hopscup Tools');
});

test('PGON author copy has no legacy QR append while its exchange card and tile retain it', () => {
  const pgon = OFFERS.find(item => item.id === 'pgon');
  const exchange = OFFERS.find(item => item.id === 'pgon-exchange');
  const cardPage = foreignCardPages.find(item => item.id === 'pgon');
  assert.equal(pgon.editorial.capabilities.ru.filter(text => text.includes('Таиланд')).length, 1);
  for (const language of ['ru', 'en', 'es', 'zh', 'ko']) {
    assert.ok(pgon.description[language].endsWith(pgonQrAbroad.cardDescription[language]));
    assert.ok(exchange.editorial.description[language].endsWith(pgonQrAbroad.exchangeDescription[language]));
    assert.equal(pgon.details.types[language], pgonQrAbroad.types[language]);
    assert.equal(withPgonQrAbroad(cardPage).editorial, cardPage.editorial);
    assert.ok(!localizedServiceValue(pgon.editorial.considerations, language).includes(pgonQrAbroad.consideration[language]));
  }
});

test('static cards render complete author copy, exact SEO, unchanged H1 and internal links without sponsored', async () => {
  for (const page of approved) for (const prefix of ['', '/en', '/es', '/zh', '/ko']) {
    const language = prefix ? 'en' : 'ru';
    const html = await readFile('dist' + prefix + page.route + '/index.html', 'utf8');
    const content = html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1];
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
      for (const text of Array.isArray(value) ? value : [value]) assert.ok(content.includes(escape(text)), page.id + ': ' + prefix + ' ' + key);
    }
    assert.equal(content.split(escape(partnerEditorialById[page.id].description[language])).length - 1, 1);
    for (const link of partnerEditorialById[page.id].links) {
      const anchor = '<a href="' + prefix + link.href + '">' + escape(link.label[language]) + '</a>';
      assert.ok(content.includes(anchor), anchor);
    }
    assert.doesNotMatch(content, /FAQPage|data-related-articles/);
  }
});
