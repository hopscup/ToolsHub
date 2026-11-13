import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { recommendedOfferIds, recommendedOfferLabels } from '../src/data/recommendedOffers.js';
import { loadOffers } from './load-offers.mjs';
import { getServiceSummaryFacts, getServiceFacts } from '../src/data/servicePresentation.js';

const { OFFERS } = await loadOffers();

test('only the four requested antidetect cards receive the frequent-choice badge', () => {
  const ids = recommendedOfferIds['/antidetect'];
  assert.deepEqual(ids, ['ant-dolphin', 'ant-adspower', 'ant-shardx', 'ant-vision']);
  assert.equal(new Set(ids).size, 4);
  for (const id of ids) {
    assert.equal(OFFERS.find(offer => offer.id === id)?.category, 'Antidetect');
    assert.deepEqual(recommendedOfferLabels[id], { ru: 'Частый выбор', en: 'Frequent pick' });
  }
  assert.ok(!ids.includes('ant-linken-sphere'));
});

test('existing recommendation labels outside the requested cards remain unchanged', () => {
  assert.deepEqual(recommendedOfferIds['/proxy-vpn'], ['p6', 'p3', 'p4', 'p1']);
  assert.equal(recommendedOfferLabels['prosto-exchange'].ru, 'Топ онлайн');
  assert.equal(recommendedOfferLabels['keine-exchange'].ru, 'Топ офлайн');
  assert.equal(recommendedOfferLabels['antarctic-card'].ru, 'Топ');
});

test('Lachuga, FunPay and GGSel use the requested frequently-used label', () => {
  assert.deepEqual(recommendedOfferIds['/account-shop'], ['st-dark', 'bot-lachuga', 'st-funpay', 'st-ggsel']);
  for (const id of ['bot-lachuga', 'st-funpay', 'st-ggsel']) {
    assert.equal(OFFERS.find(offer => offer.id === id)?.category, 'Stores');
    assert.deepEqual(recommendedOfferLabels[id], { ru: 'Часто пользуюсь', en: 'I use it often' });
  }
  assert.equal(recommendedOfferLabels['st-dark'], undefined);
});

test('HeroSMS and SMS Fast use the default go-to badge without changing their order', () => {
  const ids = recommendedOfferIds['/sms-activators'];
  assert.deepEqual(ids, ['sms-hero', 'sms-fast']);
  for (const id of ids) {
    assert.equal(OFFERS.find(offer => offer.id === id)?.category, 'SMS');
    assert.equal(recommendedOfferLabels[id], undefined);
  }
  assert.deepEqual(OFFERS.filter(offer => offer.category === 'SMS').slice(0, 2).map(offer => offer.id), ids);
});

test('Boloto payment wording is short in both card data and static source', () => {
  const offer = OFFERS.find(offer => offer.id === 'bot-boloto');
  assert.equal(offer.details.paymentMethods.ru, 'СБП, карты, крипта');
  for (const language of ['en', 'es', 'zh', 'ko']) assert.equal(offer.details.paymentMethods[language], 'SBP, cards, crypto');
});

test('LIS-SKINS, TF2Lavka, MaCloud and Xorek use default go-to badges while Antarctic stays Top', () => {
  assert.deepEqual(recommendedOfferIds['/steam-topup'], ['steam-antarctic', 'steam-lis-skins', 'steam-tf2lavka']);
  assert.deepEqual(recommendedOfferIds['/vps'], ['vps-macloud', 'vps-xorek']);
  for (const [id, category] of [['steam-lis-skins', 'Steam'], ['steam-tf2lavka', 'Steam'], ['vps-macloud', 'VPS'], ['vps-xorek', 'VPS']]) {
    assert.equal(OFFERS.find(offer => offer.id === id)?.category, category);
    assert.equal(recommendedOfferLabels[id], undefined);
  }
  assert.equal(recommendedOfferLabels['steam-antarctic'].ru, 'Топ');
});

test('Telegram shop previews omit Types without deleting the full service data', async () => {
  const app = await readFile('src/App.tsx', 'utf8');
  assert.ok(app.includes("!(offer.category === 'Stores' && offer.subCategory === 'Bot') && <InfoRow icon={Layers} label={t.types}"));
  for (const id of ['bot-boloto', 'bot-taynik', 'bot-ahlis']) {
    const offer = OFFERS.find(offer => offer.id === id);
    assert.ok(offer.details.types.ru.length > 0);
    assert.ok(getServiceFacts(offer, 'ru').some(fact => fact.key === 'types'));
    assert.ok(!getServiceSummaryFacts(offer, 'ru').some(fact => fact.key === 'types'));
  }
});
