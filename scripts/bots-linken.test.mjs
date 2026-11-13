import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import content from '../src/data/botAndLinkenContent.json' with { type: 'json' };
import { botShopPages, linkenSpherePages, orderAntidetectAllOffers } from '../src/data/botAndLinkenPages.js';
import { accountShopPages } from '../src/data/accountShopPages.js';
import { antidetectPages } from '../src/data/antidetectPages.js';
import { isIndexablePath, getCanonicalPath, getIndexAlternates, getLanguageSwitchPath } from '../src/data/indexPolicy.js';
import { getExternalLinkRel } from '../src/lib/externalLinks.js';
import { getServiceEditorialSections, splitServiceText, getServiceFacts } from '../src/data/servicePresentation.js';
import { loadOffers } from './load-offers.mjs';

const { OFFERS } = await loadOffers();
const pages = [...botShopPages, ...linkenSpherePages];
const hashes = [
  'ce3395bc44f746925d8f77e1de2f9dada001c5359d454340c41f2d1e18416c8f',
  '6cd46cb37c9a67a75812abff4227c0320dfeeb25155ca20211ceef0f320ad2fa',
  '3092cbddf32976297a3a8ff4a8965eaf8f136ec8a1ed2419a5af53610162cff0',
  '200c9f76826665109c597e4a5e244cca3540053583de4a188223161e167edabf',
];

test('four service pages preserve all supplied author text and metadata', () => {
  assert.equal(content.length, 4);
  for (const [index, source] of content.entries()) {
    assert.equal(createHash('sha256').update(JSON.stringify(source)).digest('hex'), hashes[index]);
    const id = source.metadata.id.split(',')[0];
    const page = pages.find(item => item.id === id);
    assert.equal(page.title.ru, source.metadata.Title);
    assert.equal(page.heading.ru, source.metadata.H1);
    assert.equal(page.description.ru, source.metadata.Description);
    assert.equal(page.details.paymentMethods.ru, source.metadata['Оплата']);
    for (const [key, text] of Object.entries(source.editorial)) assert.deepEqual(page.editorial[key].ru, text);
    assert.equal(OFFERS.find(item => item.id === id).url, source.metadata['Реф-ссылка']);
    assert.ok((page.category === 'Stores' ? accountShopPages : antidetectPages).some(item => item.id === id));
  }
  assert.doesNotMatch(JSON.stringify(pages), /[—–]/);
});

test('bot catalogue inserts the three new stores after Lachuga without reordering older bots', () => {
  assert.deepEqual(OFFERS.filter(offer => offer.category === 'Stores' && offer.subCategory === 'Bot').map(offer => offer.id), [
    'bot-lachuga', 'bot-boloto', 'bot-taynik', 'bot-ahlis', 'bot-thegod', 'bot-crassus', 'bot-apel0sin', 'bot-apel0sin-market-2', 'bot-petrovich',
  ]);
});

test('only the RU Linken Sphere page is newly indexable and translated counterparts remain accessible', () => {
  for (const page of pages) {
    const route = `/${page.category === 'Stores' ? 'account-shop' : 'antidetect'}/${page.slug}`;
    assert.equal(isIndexablePath(route), page.id === 'ant-linken-sphere');
    for (const language of ['en', 'es', 'zh', 'ko']) {
      assert.equal(isIndexablePath('/' + language + route), false);
      assert.equal(getCanonicalPath('/' + language + route), '/en' + route);
      assert.deepEqual(getIndexAlternates('/' + language + route), []);
      assert.equal(getLanguageSwitchPath(route, 'en'), '/en' + route);
    }
  }
});

test('new service referrals are sponsored and have lightweight local WebP logos', async () => {
  for (const page of pages) {
    assert.equal(getExternalLinkRel(page.url), 'sponsored noopener noreferrer');
    const size = (await stat(new URL('../public' + page.logo, import.meta.url))).size;
    assert.ok(size > 0 && size < 20_000);
    const offer = OFFERS.find(item => item.id === page.id);
    assert.equal(offer.logoUrl, page.logo);
  }
});

test('Linken uses shared editorial sections, five free sessions and the supplied guide links', () => {
  const page = linkenSpherePages[0];
  for (const language of ['ru', 'en', 'es', 'zh', 'ko']) {
    assert.deepEqual(getServiceEditorialSections(page, language).map(section => [section.key, section.items.length, section.ordered]), [
      ['capabilities', 6, false], ['pricing', 6, false], ['gettingStarted', 3, true],
    ]);
    assert.ok(getServiceFacts(page, language).some(fact => fact.key === 'freeProfiles' && fact.value.includes('5')));
    const note = page.editorial.considerations[language][1];
    const parts = splitServiceText(note, page, language);
    assert.equal(parts.map(part => part.text).join(''), note);
    assert.ok(parts.some(part => part.href === '/proxy-vpn/luchshie-proksi'));
  }
  assert.equal(page.editorial.links[0].href, '/guides/besplatnye-antidetekt-brauzery');
  assert.equal(page.promoCode, 'hopscup');
  assert.equal(page.promoDiscount, undefined);
  assert.deepEqual(page.platforms, ['Windows', 'macOS']);
});

test('Linken links only the whole word свои and keeps the period outside the anchor', () => {
  const page = linkenSpherePages[0];
  const parts = splitServiceText(page.editorial.considerations.ru[1], page, 'ru');
  assert.deepEqual(parts.filter(part => part.href), [{ text: 'свои', href: '/proxy-vpn/luchshie-proksi' }]);
  assert.equal(parts.at(-1).text, '.');
  assert.equal(splitServiceText('своих', page, 'ru').some(part => part.href), false);
  assert.equal(splitServiceText('своих, свои.', page, 'ru').filter(part => part.href).length, 1);
});

test('All antidetect ordering is Vision, Linken Sphere, ShardX without changing other tabs or unrelated services', async () => {
  const offers = OFFERS.filter(offer => offer.category === 'Antidetect');
  const original = offers.map(offer => offer.id);
  const ordered = orderAntidetectAllOffers(offers).map(offer => offer.id);
  const vision = ordered.indexOf('ant-vision');
  assert.deepEqual(ordered.slice(vision, vision + 3), ['ant-vision', 'ant-linken-sphere', 'ant-shardx']);
  const unaffected = id => !['ant-linken-sphere', 'ant-shardx'].includes(id);
  assert.deepEqual(ordered.filter(unaffected), original.filter(unaffected));
  assert.deepEqual(offers.map(offer => offer.id), original);
  const app = await readFile('src/App.tsx', 'utf8');
  assert.ok(app.includes("activeCategory === 'Antidetect' && subFilter === 'None' && !hasQuery"));
});
