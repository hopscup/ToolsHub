import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, stat } from 'node:fs/promises';
import { mobileAntidetectArticle, createMobileAntidetectContent } from '../src/data/mobileAntidetectContent.js';
import { guidePages } from '../src/data/guidePages.js';
import { guideCatalog } from '../src/data/guideCatalog.js';
import { getExternalLinkRel } from '../src/lib/externalLinks.js';
import { getServiceGuide, serviceGuideRoutes, serviceGuideLabels } from '../src/data/servicePresentation.js';
import { loadOffers } from './load-offers.mjs';

const { OFFERS } = await loadOffers();
const { article, checklist } = createMobileAntidetectContent(OFFERS);
const all = value => Array.isArray(value) ? value.flatMap(all) : value && typeof value === 'object' ? [value, ...Object.values(value).flatMap(all)] : [];

test('only the six requested mobile service cards link to the mobile guide', () => {
  const ids = ['ant-gologin-mobile', 'ant-octo-mobile', 'ant-vmos-cloud', 'ant-duoplus', 'ant-geelark', 'ant-morelogin-mobile'];
  assert.deepEqual(OFFERS.filter(offer => getServiceGuide(offer).href === '/guides/antidetekt-na-telefone').map(offer => offer.id).sort(), [...ids].sort());
  for (const offer of OFFERS) {
    const guide = getServiceGuide(offer);
    if (ids.includes(offer.id)) {
      assert.deepEqual(guide, { href: '/guides/antidetekt-na-telefone', label: { ru: 'Антидетект на телефоне: что выбрать', en: 'Antidetect on your phone: what to choose' } });
    } else {
      assert.equal(guide.href, serviceGuideRoutes[offer.category] || '/guides');
      assert.deepEqual(guide.label, serviceGuideLabels[offer.category] || { ru: 'Полезные гайды', en: 'Useful guides' });
    }
  }
});

test('mobile antidetect guide shares its metadata and fixed draft dates', () => {
  const page = guidePages.find(page => page.id === article.id);
  assert.equal(article.slug, 'antidetekt-na-telefone');
  assert.equal(page.title.ru, 'Антидетект на телефоне: Android и iPhone | Hopscup');
  assert.equal(page.heading.ru, 'Антидетект на телефоне: как вести много аккаунтов на Android и iPhone');
  assert.equal(page.description.ru, article.description);
  assert.equal(page.datePublished, '2026-11-12');
  assert.equal(page.dateModified, '2026-11-12');
  assert.equal(article.introParagraphs.length, 2);
  assert.equal(Object.keys(article.headingIds).length, 11);
  assert.ok(!/[—–]|\(Ссылки?:|ССЫЛКА НА РОЛИК|FAQ|Похожие статьи/.test(JSON.stringify(mobileAntidetectArticle)));
});

test('mobile antidetect referrals follow live OFFERS and remain sponsored', () => {
  const nodes = all({ article, checklist });
  for (const id of ['ant-gologin-mobile', 'ant-octo-mobile', 'ant-vmos-cloud', 'p3', 'p4', 'p6']) {
    const offer = OFFERS.find(offer => offer.id === id);
    assert.ok(nodes.some(node => node.href === offer.url), id);
    assert.match(getExternalLinkRel(offer.url), /sponsored/);
  }
  const changed = OFFERS.map(offer => offer.id === 'ant-vmos-cloud' ? { ...offer, url: 'https://example.test/?ref=updated' } : offer);
  assert.ok(JSON.stringify(createMobileAntidetectContent(changed)).includes('https://example.test/?ref=updated'));
  assert.throws(() => createMobileAntidetectContent(OFFERS.filter(offer => offer.id !== 'ant-vmos-cloud')), /Missing mobile antidetect article service: ant-vmos-cloud/);
  const steps = article.blocks.filter(block => block.type === 'list' && block.ordered);
  assert.equal(steps[0].items[0].find(node => node.text === 'GoLogin').href, OFFERS.find(offer => offer.id === 'ant-gologin-mobile').url);
  assert.equal(steps[1].items[0].find(node => node.text === 'Octo Browser').href, OFFERS.find(offer => offer.id === 'ant-octo-mobile').url);
  assert.equal(nodes.find(node => node.text === 'VMOS Cloud').href, OFFERS.find(offer => offer.id === 'ant-vmos-cloud').url);
});

test('all six internal service pages exist and cloners remain plain text', () => {
  const nodes = all({ article, checklist });
  for (const slug of ['gologin-mobile', 'octo-browser-mobile', 'vmos-cloud', 'duoplus', 'geelark', 'morelogin-mobile']) {
    assert.ok(OFFERS.some(offer => offer.category === 'Antidetect' && offer.slug === slug));
    assert.ok(nodes.some(node => node.href === '/antidetect/' + slug));
  }
  assert.ok(nodes.some(node => node.href === '/guides/mobile-ip-airplane-mode'));
  assert.ok(nodes.some(node => node.href === '/proxy-vpn/luchshie-proksi'));
  assert.ok(nodes.every(node => !node.href || !/Super Proxy|Parallel Space|Dual Space|Super Clone|App Cloner/.test(node.text)));
});

test('mobile antidetect keeps the author steps, choices, callouts and checklist', () => {
  assert.deepEqual(article.blocks.filter(block => block.type === 'list' && block.ordered).map(block => block.items.length), [7, 5]);
  assert.equal(article.blocks.filter(block => block.type === 'list' && !block.ordered).at(-1).items.length, 5);
  assert.equal(article.blocks.filter(block => block.type === 'callout' && block.warning).length, 2);
  assert.equal(checklist.items.length, 5);
  assert.deepEqual(checklist.sources.map(source => source.links.map(link => link.text)), [['GoLogin', 'Octo Browser', 'VMOS Cloud'], ['ProxyWing', 'Proxy-Seller', 'MobileProxy']]);
  assert.equal(checklist.note.map(segment => segment.text).join(''), 'Промокод hopscup на прокси почти везде.');
  assert.equal(checklist.action.href, '/antidetect');
});

test('mobile antidetect uses the supplied video and lightweight poster, not a cover', async () => {
  assert.equal(article.video.id, 'zMBrPM-cMvk');
  assert.equal(article.video.caption, 'Видеоверсия этого гайда');
  assert.equal(getExternalLinkRel(article.video.url), 'noopener noreferrer');
  assert.equal(article.cover, undefined);
  for (const image of [article.videoPoster, article.catalogCover]) {
    assert.ok((await stat('public' + image.src)).size < 100_000);
    assert.equal(image.width / image.height, 16 / 9);
  }
});

test('mobile antidetect is a native article in the antidetect catalogue topic', async () => {
  assert.equal(guideCatalog.find(item => item.id === article.id).route, '/guides/antidetekt-na-telefone');
  assert.ok(OFFERS.some(offer => offer.id === article.id && offer.category === 'Guides'));
  const app = await readFile('src/App.tsx', 'utf8');
  assert.ok(app.includes("'guide-mobile-antidetect': { topic: 'antidetect'"));
  assert.ok(app.includes('return <MobileAntidetectGuideArticle'));
});
