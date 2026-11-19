import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import test from 'node:test';
import {loadOffers} from './load-offers.mjs';
import {vpnTerms} from '../src/data/vpnDetails.js';
import {newVpnPages} from '../src/data/vpnUpdates.js';
import {getServiceFacts, getServiceEditorialSections, getServiceSummaryFacts, splitServiceText} from '../src/data/servicePresentation.js';
import {getExternalLinkRel} from '../src/lib/externalLinks.js';
import {isIndexablePath, getIndexAlternates, indexablePaths, getLanguageSwitchPath} from '../src/data/indexPolicy.js';
import {pgonQrAbroad} from '../src/data/pgonQrAbroad.js';
import {createGuideRefreshContent, guideRefreshMeta} from '../src/data/guideRefreshContent.js';
const {OFFERS} = await loadOffers();

test('all nine VPNs share approved allowlist facts with static rendering', () => {
  const expected = {
    'all-vpn': ['50 ГБ в месяц', '50 GB per month'],
    'imp-vpn': ['50 ГБ в месяц', '50 GB per month'],
    'quattro-vpn': ['500 ГБ в месяц', '500 GB per month'],
    'giga-dollar-vpn': ['Безлимит через Ускоритель', 'Unlimited via Accelerator'],
    prostovpn: ['Есть, режим X100', 'Yes, X100 mode'],
    'tochka-g': ['Тариф G Premium', 'G Premium plan'],
    'giga-vpn': ['Есть', 'Yes'],
    'taynik-vpn': ['Есть, отдельный сервер', 'Yes, dedicated server'],
    'ppl-vpn': ['Нет', 'No'],
  };
  const offers = OFFERS.filter(offer => offer.subCategory === 'VPN');
  assert.equal(offers.length, 9);
  for (const offer of offers) for (const [language, index] of [['ru', 0], ['en', 1]]) {
    assert.equal(vpnTerms[offer.slug].allowlist[language], expected[offer.slug][index]);
    assert.ok(getServiceFacts(offer, language).some(fact => fact.key === 'allowlist' && fact.value === expected[offer.slug][index]));
    const summary = getServiceSummaryFacts(offer, language, {vpnPrice: vpnTerms[offer.slug].price[language]});
    assert.ok(summary.length <= 3);
    assert.ok(summary.some(fact => fact.key === 'allowlist'));
  }
});

test('new VPN order, facts and sponsored destinations preserve existing bot links', async () => {
  const offers = OFFERS.filter(offer => offer.subCategory === 'VPN');
  assert.deepEqual(offers.map(offer => offer.id), ['vpn-all', 'vpn-ppl', 'vpn-prosto', 'vpn-imp', 'vpn-quattro', 'vpn-giga', 'vpn-tochka-g', 'vpn-giga-dollar', 'vpn-taynik']);
  const imp = offers.find(offer => offer.id === 'vpn-imp');
  assert.equal(imp.url, 'https://t.me/iMP_VPN_bot?start=6532969757');
  assert.equal(getExternalLinkRel(imp.url), 'sponsored noopener noreferrer');
  assert.deepEqual(imp.platforms, ['Windows', 'macOS', 'Android', 'iOS']);
  for (const language of ['ru', 'en']) {
    assert.ok(getServiceFacts(imp, language).some(fact => fact.key === 'platforms' && fact.value === 'Windows, macOS, Android, iOS'));
  }
  for (const page of newVpnPages) {
    assert.equal(getExternalLinkRel(page.url), 'sponsored noopener noreferrer');
    if (page.webUrl) assert.equal(getExternalLinkRel(page.webUrl), 'sponsored noopener noreferrer');
    assert.ok((await stat(`public${page.logo}`)).size < 20000);
    assert.doesNotMatch(JSON.stringify(page), /—/);
  }
  const quattro = offers.find(offer => offer.id === 'vpn-quattro');
  assert.equal(quattro.webLabel.ru, 'Через сайт');
  assert.equal(quattro.details.geo.ru, '560 серверов');
  assert.equal(quattro.details.devices.ru, 'До 5 устройств');
  assert.equal(vpnTerms['quattro-vpn'].free.ru, 'Нет');
  assert.equal(vpnTerms['taynik-vpn'].free.ru, '14 дней');
  assert.equal(vpnTerms['taynik-vpn'].free.en, '14 days');
  const taynik = offers.find(offer => offer.id === 'vpn-taynik');
  assert.equal(taynik.details.geo.en, '4+, more being restored');
  assert.equal(taynik.details.devices.ru, '3 устройства');
  assert.equal(taynik.details.devices.en, '3 devices');
  assert.equal(taynik.details.paymentMethods.ru, 'Карта РФ, СБП, USDT, Bybit Pay, Telegram Stars');
  assert.equal(taynik.details.paymentMethods.en, 'Russian card, SBP, USDT, Bybit Pay, Telegram Stars');
  assert.ok(taynik.editorial.capabilities.ru.includes('Приложение: Тайник VPN.'));
  const ppl = offers.find(offer => offer.id === 'vpn-ppl');
  assert.equal(ppl.url, 'https://t.me/VPNPPLBot?start=dXNlcl9pZD00NDMwODM');
  assert.equal(ppl.webUrl, 'https://app.privatepeople.top?partner_id=443083');
});

test('new VPNs and every translation remain noindex without expanding sitemap', () => {
  assert.equal(indexablePaths.length, 92);
  for (const page of newVpnPages) for (const prefix of ['', '/en', '/es', '/zh', '/ko']) {
    const route = `${prefix}/proxy-vpn/${page.slug}`;
    assert.equal(isIndexablePath(route), false);
    assert.deepEqual(getIndexAlternates(route), []);
    assert.ok(!indexablePaths.includes(route));
  }
  assert.equal(getLanguageSwitchPath('/proxy-vpn/quattro-vpn', 'en'), '/en/proxy-vpn/quattro-vpn');
});

test('generated VPN HTML keeps the new services closed and the field present in every language', async () => {
  const sitemaps = (await Promise.all(['money', 'core', 'services'].map(name => readFile(`dist/sitemap-${name}.xml`, 'utf8')))).join('');
  for (const page of newVpnPages) for (const prefix of ['', 'en/', 'es/', 'zh/', 'ko/']) {
    const html = await readFile(`dist/${prefix}proxy-vpn/${page.slug}/index.html`, 'utf8');
    assert.match(html, /<meta name="robots" content="noindex, follow"/);
    assert.doesNotMatch(html, /hreflang=/);
    assert.ok(html.includes(page.url.replaceAll('&', '&amp;')));
    assert.ok(html.includes('rel="sponsored noopener noreferrer"'));
    assert.ok(html.includes(prefix ? vpnTerms[page.slug].allowlist.en : vpnTerms[page.slug].allowlist.ru));
    const language = prefix ? 'en' : 'ru';
    assert.ok(html.includes(vpnTerms[page.slug].free[language]));
    assert.ok(html.includes(page.details.paymentMethods[language]));
    for (const item of page.editorial.capabilities[language]) assert.ok(html.includes(item));
    assert.ok(!sitemaps.includes(`/proxy-vpn/${page.slug}`));
  }
  for (const prefix of ['', 'en/']) {
    const html = await readFile(`dist/${prefix}proxy-vpn/index.html`, 'utf8');
    const positions = OFFERS.filter(offer => offer.subCategory === 'VPN').map(offer => html.indexOf(`<section data-service-summary="${offer.id}">`));
    assert.ok(positions.every(position => position >= 0));
    assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  }
  for (const slug of Object.keys(vpnTerms)) {
    const html = await readFile(`dist/proxy-vpn/${slug}/index.html`, 'utf8');
    assert.ok(html.includes(vpnTerms[slug].allowlist.ru), slug);
  }
  for (const prefix of ['', 'en/', 'es/', 'zh/', 'ko/']) {
    const html = await readFile(`dist/${prefix}proxy-vpn/imp-vpn/index.html`, 'utf8');
    assert.ok(html.includes('Windows, macOS, Android, iOS'));
  }
});

test('Telegram fallbacks and Dollar VPN updates use shared linked editorial sections', () => {
  for (const id of ['vpn-ppl', 'vpn-tochka-g']) {
    const offer = OFFERS.find(offer => offer.id === id);
    for (const language of ['ru', 'en']) {
      const section = getServiceEditorialSections(offer, language).find(item => item.key === 'telegramFallback');
      assert.ok(section);
      assert.ok(section.items.flatMap(text => splitServiceText(text, offer, language)).some(part => part.href));
    }
  }
  const dollar = OFFERS.find(offer => offer.id === 'vpn-giga-dollar');
  assert.equal(vpnTerms['giga-dollar-vpn'].price.ru, 'от 169 ₽/мес');
  assert.ok(dollar.editorial.capabilities.ru.some(text => text.includes('https://dollarvpn.shop')));
  assert.ok(dollar.editorial.capabilities.ru.some(text => text.includes('Расширение для Chrome')));
  assert.ok(dollar.editorial.pricing.ru[0].includes('5 устройств'));
});

test('Tochka G keeps its Telegram CTA and adds the free 40 minute secondary link', async () => {
  const offer = OFFERS.find(item => item.id === 'vpn-tochka-g');
  assert.equal(offer.url, 'https://t.me/tochka_GI_bot?start=811308241');
  assert.equal(offer.webUrl, 'https://access.gotam.pro/');
  assert.equal(offer.webLabel.ru, 'Фри 40 минут');
  assert.equal(offer.webLabel.en, 'Free 40 minutes');
  for (const language of ['', 'en/', 'es/', 'zh/', 'ko/']) {
    const html = await readFile(`dist/${language}proxy-vpn/tochka-g/index.html`, 'utf8');
    const label = offer.webLabel[language ? 'en' : 'ru'];
    const secondary = `href="${offer.webUrl}" rel="noopener noreferrer">${label}</a>`;
    assert.ok(html.includes(secondary));
    assert.ok(html.indexOf(offer.url) < html.indexOf(secondary));
  }
});

test('PGON QR abroad appears in both descriptions and the first card use case', () => {
  const card = OFFERS.find(offer => offer.id === 'pgon');
  const crypto = OFFERS.find(offer => offer.id === 'pgon-exchange');
  for (const language of ['ru', 'en', 'es', 'zh', 'ko']) {
    assert.ok(card.editorial.description[language].endsWith(pgonQrAbroad.cardDescription[language]));
    assert.equal(card.editorial.bestFor[language][0], pgonQrAbroad.bestFor[language]);
    assert.equal(card.editorial.considerations[language].at(-1), pgonQrAbroad.consideration[language]);
    assert.ok(crypto.editorial.description[language].endsWith(pgonQrAbroad.exchangeDescription[language]));
    assert.equal(card.details.types[language], pgonQrAbroad.types[language]);
  }
  assert.equal(card.cardStats.type.ru, 'Visa');
  assert.equal(card.url, 'https://t.me/pgon?start=ref_1ob10bl6');
  assert.equal(crypto.qrDetails.countries.ru, 'Россия');
  assert.equal(crypto.qrDetails.fee.ru, '5% с KYC / 15% без');
});

test('only the foreign card guide receives the extra PGON sentence and a new fixed modified date', () => {
  const content = createGuideRefreshContent(OFFERS);
  const blocks = content['guide-foreign-cards'].blocks;
  assert.equal(blocks.filter(block => block.content?.some(part => part.text === pgonQrAbroad.articleSentence)).length, 1);
  assert.equal(guideRefreshMeta['guide-foreign-cards'].datePublished, '2026-10-14T16:08:38+03:00');
  assert.equal(guideRefreshMeta['guide-foreign-cards'].dateModified, '2026-11-16');
  for (const id of ['guide-gmail-forwarding', 'guide-discord-token', 'guide-uids-addresses']) {
    assert.equal(guideRefreshMeta[id].dateModified, '2026-11-10');
    assert.ok(!content[id].blocks.some(block => block.content?.some(part => part.text === pgonQrAbroad.articleSentence)));
  }
});
