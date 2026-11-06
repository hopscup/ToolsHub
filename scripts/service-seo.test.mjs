import assert from 'node:assert/strict';
import test from 'node:test';
import { loadOffers } from './load-offers.mjs';
import { getServiceAlternatives, getServiceFacts, getServiceTextGroups, getServiceSummaryFacts, getServiceParagraphs, isServiceMetaDescription, serviceCategoryRoutes, compactSeoTitle, sectionSeoTitles } from '../src/data/servicePresentation.js';
import { antidetectPages } from '../src/data/antidetectPages.js';

const { OFFERS, CATEGORY_ROUTES } = await loadOffers();
test('build reads the live offer graph without importing React', () => {
  assert.equal(new Set(OFFERS.map(offer => offer.id)).size, OFFERS.length);
  assert.deepEqual(CATEGORY_ROUTES, serviceCategoryRoutes);
  assert.ok(OFFERS.length >= 100);
  for (const offer of OFFERS) assert.ok(offer.id && offer.category && offer.description && offer.url);
});

test('three distinct same-category alternatives follow the configured priorities', () => {
  for (const offer of OFFERS.filter(item => item.category !== 'Guides')) {
    const alternatives = getServiceAlternatives(offer, OFFERS);
    assert.equal(alternatives.length, 3, offer.id);
    assert.equal(new Set(alternatives.map(item => item.id)).size, 3);
    for (const item of alternatives) assert.ok(item.id !== offer.id && item.category === offer.category && item.slug);
  }
  assert.deepEqual(getServiceAlternatives(OFFERS.find(item => item.id === 'p6'), OFFERS).map(item => item.id), ['p3', 'p4', 'p1']);
  assert.deepEqual(getServiceAlternatives(OFFERS.find(item => item.id === 'antarctic-card'), OFFERS).slice(0, 2).map(item => item.id), ['pgon', 'zarub']);
  assert.equal(getServiceAlternatives(OFFERS.find(item => item.id === 'st-ggsel'), OFFERS)[0].id, 'st-dark');
});

test('service facts include all card fields, prices and mobile parameters', () => {
  for (const language of ['ru', 'en']) {
    for (const offer of OFFERS.filter(item => item.cardStats)) {
      const keys = getServiceFacts(offer, language).map(item => item.key);
      for (const key of Object.keys(offer.cardStats)) assert.ok(keys.includes(key), `${offer.id}: ${key}`);
    }
    const ads = OFFERS.find(item => item.id === 'ant-adspower');
    for (const key of ['freeProfiles', 'tariffStartPrice', 'profiles100Price']) assert.ok(getServiceFacts(ads, language).some(item => item.key === key));
  }
});

test('only the eight duplicated antidetect note blocks become a setup-guide link', () => {
  assert.deepEqual(antidetectPages.filter(page => page.editorial.setupGuide).map(page => page.id).sort(), ['ant-dolphin', 'ant-adspower', 'ant-incogniton', 'ant-afina', 'ant-gologin', 'ant-morelogin', 'ant-vision', 'ant-multilogin'].sort());
  for (const page of antidetectPages) {
    if (page.editorial.setupGuide) assert.deepEqual(page.editorial.considerations.ru, []);
    else assert.ok(page.editorial.considerations.ru.length);
  }
  for (const offer of OFFERS) for (const language of ['ru', 'en']) {
    const texts = getServiceTextGroups(offer, language).flatMap(group => group.items);
    assert.equal(texts.length, new Set(texts).size);
  }
});

test('title shortening is scoped to proxy and antidetect RU/EN pages', () => {
  const title = 'ProxyWing review: IPv4, ISP, Residential, and Mobile proxies | Hopscup Tools';
  assert.ok(compactSeoTitle(title, '/proxy-vpn/proxywing', 'en').length <= 60);
  assert.equal(compactSeoTitle(title, '/foreign-cards/pgon', 'en'), title);
  assert.equal(compactSeoTitle(title, '/proxy-vpn/proxywing', 'es'), title);
  assert.equal(sectionSeoTitles['/antidetect'].ru + ' | Hopscup', 'Антидетект браузеры: бесплатные и платные | Hopscup');
  assert.equal(sectionSeoTitles['/antidetect'].en + ' | Hopscup', 'Antidetect browsers: free and paid compared | Hopscup');
});

test('section summaries contain no more than three relevant facts', () => {
  for (const language of ['ru', 'en']) for (const offer of OFFERS) {
    const facts = getServiceSummaryFacts(offer, language);
    assert.ok(facts.length <= 3);
    if (offer.cardStats) assert.deepEqual(facts.map(fact => fact.key), ['issuance', 'topup', 'maintenance']);
  }
  const mobile = OFFERS.find(offer => offer.id === 'p6');
  assert.deepEqual(getServiceSummaryFacts(mobile, 'ru').map(fact => fact.key), ['geo', 'types', 'price']);
});

test('paragraphs matching meta description are omitted after normalization', () => {
  const mobile = OFFERS.find(offer => offer.id === 'p6');
  for (const language of ['ru', 'en']) {
    const meta = mobile.editorial.description[language];
    assert.equal(getServiceParagraphs(mobile, language, meta).some(text => isServiceMetaDescription(text, meta)), false);
    assert.equal(isServiceMetaDescription('  ' + meta + '\n', meta), true);
    assert.equal(isServiceMetaDescription('', meta), false);
  }
});

test('MobileProxy facts and four partner descriptions use the approved copy', () => {
  const expected = {
    p6: 'Пользуюсь больше трёх лет. Трафик безлимитный, IP меняется по кнопке раз в 10 секунд, гео можно выбрать вплоть до города. Есть бесплатный тест на 3 часа.',
    p3: 'С начала 2025 сижу на их ISP. Начинать советую с IPv4, а если площадка принимает их плохо, в том же кабинете есть ISP, Residential и Mobile. Оплата картой РФ.',
    p4: 'Больше 220 стран и все основные типы, от IPv4 до Mobile. Беру, когда нужен большой выбор гео или Residential.',
    p1: 'Сервис от команды бесплатного антидетекта ShardX. SOCKS5 с UDP на всех типах прокси. Пополнение от 5$, оплата криптой или зарубежной картой.',
  };
  for (const [id, description] of Object.entries(expected)) assert.equal(OFFERS.find(offer => offer.id === id).description.ru, description);
  const mobile = OFFERS.find(offer => offer.id === 'p6');
  assert.equal(mobile.details.price.ru, 'от 30-50$ в месяц, безлимит');
  assert.equal(mobile.details.freeTrial.ru, '3 часа');
  assert.equal(mobile.details.ipRotation.ru, 'по кнопке раз в 10 секунд, гео раз в 10 минут');
  for (const language of ['ru', 'en']) for (const key of ['price', 'freeTrial', 'ipRotation']) assert.ok(getServiceFacts(mobile, language).some(fact => fact.key === key && fact.value === mobile.details[key][language]));
});
