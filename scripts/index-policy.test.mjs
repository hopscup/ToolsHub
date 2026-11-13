import assert from 'node:assert/strict';
import test from 'node:test';
import { guidePages } from '../src/data/guidePages.js';
import { seoLandingPages } from '../src/data/seoLandingPages.js';
import { isIndexablePath, indexablePaths, indexableUrlWhitelist, getCanonicalPath, getIndexAlternates, getLanguageSwitchPath, normalizeIndexPath } from '../src/data/indexPolicy.js';
import { serviceContextualGuideLinks, sectionContextualGuideLinks } from '../src/data/contextualGuideLinks.js';
import { proxyGuideBlocks, proxyGuideMeta } from '../src/data/proxyGuideContent.js';
import { claudeGuideArticle } from '../src/data/claudeGuideArticle.js';
import { accountFarmArticle } from '../src/data/accountFarmContent.js';
import { loadOffers } from './load-offers.mjs';
import { serviceCategoryRoutes } from '../src/data/servicePresentation.js';

const { OFFERS } = await loadOffers();

test('index policy has the approved 59 RU and 13 EN whitelist entries plus RU guides', () => {
  assert.equal(indexableUrlWhitelist.ru.length, 59);
  assert.equal(indexableUrlWhitelist.en.length, 13);
  assert.equal(new Set(Object.values(indexableUrlWhitelist).flat()).size, 72);
  assert.equal(indexablePaths.filter(path => !path.startsWith('/en')).length, 76);
  assert.equal(indexablePaths.filter(path => path.startsWith('/en')).length, 13);
  assert.equal(new Set(indexablePaths).size, 89);
  for (const path of indexablePaths) assert.equal(isIndexablePath(path), true);
  for (const guide of guidePages) {
    const route = '/guides/' + guide.slug;
    assert.equal(isIndexablePath(route), guide.indexable !== false);
    for (const language of ['en', 'es', 'zh', 'ko']) assert.equal(isIndexablePath('/' + language + route), false);
  }
});

test('closed services, sections and landings remain noindex regardless of category', () => {
  for (const offer of OFFERS.filter(offer => offer.category === 'Social' || offer.subCategory === 'VPN')) {
    const category = offer.category === 'Social' ? '/social-boost/' : '/proxy-vpn/';
    for (const prefix of ['', '/en']) assert.equal(isIndexablePath(prefix + category + offer.slug), offer.subCategory === 'VPN' && prefix === '');
  }
  for (const route of ['/social-boost', '/social-boost/gde-brat-referalov', '/crypto-exchange/aml-proverka', '/guides/akkaunty-ip-gmail-kripta', '/guides/crypto-otc-kyc', '/crypto-exchange/antarctic-wallet', '/crypto-exchange/pgon', '/crypto-exchange/qr2pay', '/steam-topup/antarctic-wallet', '/steam-topup/ggsel', '/en/guides']) assert.equal(isIndexablePath(route), false, route);
  for (const page of seoLandingPages) assert.equal(isIndexablePath('/en' + page.route), false);
  assert.equal(isIndexablePath('/future-service'), false);
});

test('hreflang contains only indexed equivalents and is absent on closed sources', () => {
  for (const path of indexablePaths) for (const alternate of getIndexAlternates(path)) assert.equal(isIndexablePath(alternate.path), true);
  assert.deepEqual(getIndexAlternates('/proxy-vpn'), [{ language: 'ru', path: '/proxy-vpn' }, { language: 'en', path: '/en/proxy-vpn' }, { language: 'x-default', path: '/proxy-vpn' }]);
  assert.deepEqual(getIndexAlternates('/crypto-exchange'), [{ language: 'ru', path: '/crypto-exchange' }, { language: 'x-default', path: '/crypto-exchange' }]);
  assert.deepEqual(getIndexAlternates('/en/crypto-exchange'), []);
  assert.deepEqual(getIndexAlternates('/guides/crypto-otc-kyc'), []);
});

test('canonical rules preserve self canonical for noindex and RU canonical for article copies', () => {
  assert.equal(getCanonicalPath('/proxy-vpn/all-vpn'), '/proxy-vpn/all-vpn');
  assert.equal(getCanonicalPath('/en/proxy-vpn/all-vpn'), '/en/proxy-vpn/all-vpn');
  assert.equal(getCanonicalPath('/es/antidetect'), '/en/antidetect');
  for (const page of guidePages) for (const prefix of ['', '/en', '/es', '/zh', '/ko']) assert.equal(getCanonicalPath(prefix + '/guides/' + page.slug), '/guides/' + page.slug);
  for (const path of indexablePaths) assert.equal(getCanonicalPath(path), path);
});

test('language links preserve existing noindex counterparts and fall back only for missing translations', () => {
  assert.equal(getLanguageSwitchPath('/', 'en'), '/en');
  assert.equal(getLanguageSwitchPath('/proxy-vpn/mobileproxy', 'en'), '/en/proxy-vpn/mobileproxy');
  assert.equal(getLanguageSwitchPath('/antidetect/shardx', 'en'), '/en/antidetect/shardx');
  assert.equal(getLanguageSwitchPath('/guides/youtube-ferma', 'en'), '/en');
  assert.equal(getLanguageSwitchPath('/en/proxy-vpn/mobileproxy', 'ru'), '/proxy-vpn/mobileproxy');
  assert.equal(getLanguageSwitchPath('/en/social-boost', 'ru'), '/social-boost');
  assert.equal(getLanguageSwitchPath('/proxy-vpn/prostovpn', 'en'), '/en/proxy-vpn/prostovpn');
  assert.equal(getLanguageSwitchPath('/missing-page', 'en'), '/en');
  assert.equal(getLanguageSwitchPath('/en/missing-page', 'ru'), '/');
  for (const offer of OFFERS.filter(offer => offer.category !== 'Guides' && offer.slug)) {
    const route = `${serviceCategoryRoutes[offer.category]}/${offer.slug}`;
    assert.equal(getLanguageSwitchPath(route, 'en'), '/en' + route);
    assert.equal(getLanguageSwitchPath('/en' + route, 'ru'), route);
  }
  for (const page of seoLandingPages) assert.equal(getLanguageSwitchPath(page.route, 'en'), '/en' + page.route);
  assert.equal(normalizeIndexPath('/proxy-vpn/?x=1#start'), '/proxy-vpn');
});

test('all seven RU VPN cards are indexed without exposing their EN copies in sitemap or hreflang', () => {
  for (const slug of ['prostovpn', 'ppl-vpn', 'imp-vpn', 'all-vpn', 'giga-vpn', 'giga-dollar-vpn', 'tochka-g']) {
    const route = '/proxy-vpn/' + slug;
    assert.equal(isIndexablePath(route), true);
    assert.equal(isIndexablePath('/en' + route), false);
    assert.deepEqual(getIndexAlternates(route), [{ language: 'ru', path: route }, { language: 'x-default', path: route }]);
  }
});

test('contextual crosslinks are scoped to the requested pages and keep article dates', () => {
  assert.deepEqual(Object.keys(serviceContextualGuideLinks).sort(), ['ant-shardx', 'ant-adspower', 'ant-dolphin'].sort());
  assert.equal(sectionContextualGuideLinks['/crypto-exchange'][0].href, '/guides/exchange-uids-addresses');
  assert.ok(JSON.stringify(proxyGuideBlocks).includes('Как собрать YouTube-ферму, разобрал отдельно'));
  assert.ok(JSON.stringify(accountFarmArticle.blocks).includes('Как настроить пересылку писем с Gmail'));
  for (const text of ['Где взять подписку дешевле, разобрал отдельно', 'Если всё же забанили, как сохранить данные']) assert.ok(JSON.stringify(claudeGuideArticle.blocks).includes(text));
  assert.equal(proxyGuideMeta.dateModified, '2026-11-02');
  assert.equal(claudeGuideArticle.dateModified, '2026-11-10');
  assert.equal(accountFarmArticle.dateModified, '2026-11-10');
});
