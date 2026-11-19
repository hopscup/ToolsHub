import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {loadOffers} from './load-offers.mjs';
import {partnerEditorialById, darkShoppingMetadata, getPartnerIntroduction} from '../src/data/partnerCardRefresh.js';
import {accountShopPages} from '../src/data/accountShopPages.js';
import {getServiceEditorialSections} from '../src/data/servicePresentation.js';
import {isIndexablePath, indexablePaths} from '../src/data/indexPolicy.js';
import {getExternalLinkRel} from '../src/lib/externalLinks.js';
const {OFFERS} = await loadOffers();
const fields = ['description', 'capabilities', 'pricing', 'bestFor', 'considerations', 'gettingStarted', 'verdict'];
const hash = data => createHash('sha256').update(JSON.stringify(data)).digest('hex');
const expected = {
  'st-dark': {route: '/account-shop/darkstore', copy: 'f0e5f7a39ed88166971a0970a0200f136e3f80c325688db384a2c2b42571c263', facts: '0e2920c105b65dd61444e86f568833058525f274f6bca156d92195b5dc2c3245'},
  p6: {route: '/proxy-vpn/mobileproxy', copy: 'fcf73024f979aa001ed5a18636da9fd2d64f6041f68b760b5a6d2175a67d4e00', facts: 'be055157733819db203eb2077daa15462230e070ec494829b5a362eb589822ab'},
  p3: {route: '/proxy-vpn/proxywing', copy: '44ca842c66fa8f42c730ccc05c678421a79b4991b2c868ada3e9184d2f06d3e7', facts: 'df8673337fa35b30b5e95cfb3342c5159adf08fc90f5447d76367bff4ed81130'},
};

test('three partner cards preserve the exact approved Russian editorial and original facts', () => {
  for (const [id, snapshot] of Object.entries(expected)) {
    const offer = OFFERS.find(offer => offer.id === id);
    assert.equal(hash(fields.map(key => [key, offer.editorial[key].ru])), snapshot.copy, id);
    const {editorial, description, ...facts} = offer;
    assert.equal(hash(facts), snapshot.facts, id);
    assert.match(getExternalLinkRel(offer.url), /sponsored/);
    assert.doesNotMatch(JSON.stringify(partnerEditorialById[id]), /—/);
    for (const key of fields) assert.ok(partnerEditorialById[id][key].en.length > 0, `${id}: ${key}`);
  }
});

test('only DarkShopping changes SEO metadata while proxy descriptions stay independent', () => {
  const dark = accountShopPages.find(page => page.id === 'st-dark');
  assert.equal(dark.title.ru, 'DarkShopping: отзыв, аккаунты и почты, как покупать | Hopscup');
  assert.deepEqual(dark.title.en, darkShoppingMetadata.title.en);
  assert.equal(dark.description.ru, darkShoppingMetadata.description.ru);
  assert.equal(dark.heading.ru, 'DarkShopping для рабочих аккаунтов и почт');
  for (const id of ['p3', 'p6']) {
    const offer = OFFERS.find(offer => offer.id === id);
    assert.ok(offer.editorial.seoDescription.ru.startsWith('Обзор ' + offer.name));
    assert.ok(offer.editorial.seoDescription.en.startsWith(offer.name + ' review'));
    assert.notEqual(offer.editorial.seoDescription.ru, offer.editorial.description.ru);
  }
  assert.equal(getPartnerIntroduction(OFFERS.find(offer => offer.id === 'p2'), 'ru'), undefined);
  assert.equal(getPartnerIntroduction(OFFERS.find(offer => offer.id === 'p3'), 'es'), undefined);
});

test('partner capabilities, pricing and numbered getting started use common editorial sections', () => {
  for (const id of Object.keys(expected)) for (const language of ['ru', 'en']) {
    const offer = OFFERS.find(offer => offer.id === id);
    const sections = getServiceEditorialSections(offer, language);
    for (const key of ['capabilities', 'pricing', 'gettingStarted']) {
      const section = sections.find(section => section.key === key);
      assert.deepEqual(section.items, partnerEditorialById[id][key][language]);
      assert.equal(section.ordered, key === 'gettingStarted');
    }
    assert.equal(getPartnerIntroduction(offer, language), offer.editorial.description[language]);
  }
});

test('partner card static RU and EN include the author blocks and requested guide links once', async () => {
  assert.equal(indexablePaths.length, 92);
  for (const [id, snapshot] of Object.entries(expected)) for (const prefix of ['', '/en']) {
    const language = prefix ? 'en' : 'ru';
    const html = await readFile(`dist${prefix}${snapshot.route}/index.html`, 'utf8');
    const content = html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1];
    const intro = partnerEditorialById[id].description[language];
    const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
    assert.equal(content.split(escape(intro)).length - 1, 1, snapshot.route);
    for (const key of fields) {
      const value = partnerEditorialById[id][key][language];
      for (const text of Array.isArray(value) ? value : [value]) assert.ok(content.includes(escape(text)), `${id}: ${key}`);
    }
    for (const link of partnerEditorialById[id].links) {
      assert.ok(content.includes(`href="${prefix}${link.href}"`));
      assert.ok(content.includes(escape(link.label[language])));
    }
    assert.ok(content.includes('data-editorial-section="gettingStarted"><h2>'));
    assert.ok(isIndexablePath(prefix + snapshot.route));
    assert.match(html, /name="robots" content="index, follow/);
  }
});
