import assert from 'node:assert/strict';
import test from 'node:test';
import { access } from 'node:fs/promises';
import { accountFarmArticle, createAccountFarmContent } from '../src/data/accountFarmContent.js';
import { guidePages } from '../src/data/guidePages.js';
import { getExternalLinkRel, isAffiliateUrl } from '../src/lib/externalLinks.js';
import { loadOffers } from './load-offers.mjs';

const { OFFERS } = await loadOffers();
const { article, checklist } = createAccountFarmContent(OFFERS);

test('account farm metadata and heading anchors use the shared article source', () => {
  const page = guidePages.find(page => page.id === 'guide-account-farm');
  assert.equal(page.title.ru, 'Ферма аккаунтов: где купить Twitter, Discord, Gmail | Hopscup');
  assert.equal(page.heading.ru, article.title);
  assert.equal(page.description.ru, article.description);
  assert.equal(page.datePublished, '2026-08-30T01:39:58+03:00');
  assert.equal(page.dateModified, '2026-11-10');
  assert.deepEqual(page.articleBlocks, accountFarmArticle.blocks);
  assert.equal(Object.keys(article.headingIds).length, 9);
  assert.ok(article.blocks.filter(block => block.type === 'heading').every(block => article.headingIds[block.text]));
  assert.ok(!/[—–]/.test(JSON.stringify(article)));
});

test('account farm resolves external and internal service links from current OFFERS', () => {
  const paragraphs = article.blocks.filter(block => block.type === 'paragraph');
  const links = paragraphs.flatMap(block => block.content).filter(part => part.href);
  for (const link of links) if (isAffiliateUrl(link.href)) assert.match(getExternalLinkRel(link.href), /sponsored/);
  assert.ok(links.some(link => link.href === OFFERS.find(offer => offer.id === 'st-dark').url));
  assert.ok(links.some(link => link.href === '/antidetect/donut-browser'));
  assert.ok(links.some(link => link.href === '/guides/discord-vhod-po-tokenu'));
  assert.equal(getExternalLinkRel(OFFERS.find(offer => offer.id === 'st-funpay').url), 'noopener noreferrer');
  const changedOffers = OFFERS.map(offer => offer.id === 'p3' ? { ...offer, url: 'https://example.test/?ref=updated' } : offer);
  const changed = createAccountFarmContent(changedOffers);
  assert.ok(JSON.stringify(changed).includes('https://example.test/?ref=updated'));
  assert.ok(!JSON.stringify(changed).includes(OFFERS.find(offer => offer.id === 'p3').url));
  assert.throws(() => createAccountFarmContent(OFFERS.filter(offer => offer.id !== 'p3')), /Missing account farm service: p3/);
});

test('account farm keeps the requested screenshots and removes obsolete instructions', async () => {
  const images = [article.cover, ...article.blocks.filter(block => block.type === 'image')];
  const expected = [1, 2, 3, 4, 5, 21, 6, 7, 8, 9, 10, 15, 16, 22, 23, 24, 28, 29, 30, 31, 32, 33, 34, 35];
  assert.deepEqual(images.map(image => Number(image.src.match(/image-(\d+)/)[1])), expected);
  for (const image of images) {
    assert.ok(image.alt);
    if (image !== article.cover) assert.ok(image.caption);
    await access('public' + image.src);
  }
  assert.ok(!/EditThisCookie|EditCookie|auth_token|Vak-sms|HopsCup_ulru|lhFhNOrKGtYxG0tiZpD|замультиачить|Навигация|10 бесплатных профилей/.test(JSON.stringify(article.blocks)));
  assert.ok(!article.blocks.some(block => block.content?.some(part => /teletype/.test(part.href || ''))));
});

test('account farm checklist follows the approved five items and service order', () => {
  assert.equal(checklist.items.length, 5);
  assert.deepEqual(checklist.sources.map(source => source.links.map(link => link.text)), [['DarkShopping', 'AccsMarket', 'FunPay'], ['ProxyWing', 'Proxy-Seller', 'MobileProxy'], ['AdsPower', 'Dolphin', 'ShardX']]);
  assert.equal(checklist.sources[2].links[2].href, '/antidetect/shardx');
  assert.equal(checklist.action.href, '/account-shop');
  assert.equal(checklist.note.map(part => part.text).join(''), 'Промокод hopscup почти везде.');
});
