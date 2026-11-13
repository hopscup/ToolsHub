import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import test from 'node:test';
import { accountShopPages } from '../src/data/accountShopPages.js';
import { loadOffers } from './load-offers.mjs';

test('Lachuga uses the new lightweight avatar and keeps its existing route and referral', async () => {
  const { OFFERS } = await loadOffers();
  const offer = OFFERS.find(item => item.id === 'bot-lachuga');
  const page = accountShopPages.find(item => item.id === offer.id);
  assert.equal(offer.name, 'Лачуга');
  assert.equal(page.name, offer.name);
  assert.equal(page.slug, 'lachuga-skamera');
  assert.equal(offer.slug, page.slug);
  assert.equal(offer.url, 'https://t.me/LachugaSkamera_Bot?start=ref_467483565');
  assert.equal(offer.logoUrl, '/lachuga-2026.webp');
  assert.equal(page.logo, offer.logoUrl);
  for (const field of ['title', 'description', 'heading', 'keywords']) {
    for (const text of Object.values(page[field])) assert.doesNotMatch(text, /скамера|skamera/iu);
  }
  const asset = await stat(new URL(`../public${offer.logoUrl}`, import.meta.url));
  assert.ok(asset.size < 20_000);
});
