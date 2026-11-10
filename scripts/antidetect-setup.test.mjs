import assert from 'node:assert/strict';
import test from 'node:test';
import { antidetectSetupMeta, antidetectSetupCopy as copy, antidetectSetupAdditions as additions, getAntidetectGuideServices, resolveAntidetectGuideSegments, createAntidetectGuideChecklist } from '../src/data/antidetectSetupContent.js';
import { guidePages } from '../src/data/guidePages.js';
import { isAffiliateUrl } from '../src/lib/externalLinks.js';
import { loadOffers } from './load-offers.mjs';

const { OFFERS } = await loadOffers();

test('antidetect guide links resolve to the current OFFERS entries', () => {
  const services = getAntidetectGuideServices(OFFERS);
  for (const service of Object.values(services)) assert.equal(service.url, OFFERS.find(offer => offer.id === service.id).url);
  const free = resolveAntidetectGuideSegments(additions.free, services, true).filter(part => part.href);
  assert.deepEqual(free.map(part => part.href), ['/antidetect/adspower', '/antidetect/dolphin-anty', '/antidetect/gologin', '/antidetect/shardx', '/antidetect/donut-browser']);
  for (const part of resolveAntidetectGuideSegments(additions.proxy, services).filter(part => part.href)) assert.ok(isAffiliateUrl(part.href));
});

test('antidetect checklist has the requested sources and uses an internal ShardX link', () => {
  const checklist = createAntidetectGuideChecklist(OFFERS);
  assert.equal(checklist.items.length, 5);
  assert.deepEqual(checklist.sources.map(source => source.links.map(link => link.text)), [['AdsPower', 'Dolphin', 'ShardX'], ['ProxyWing', 'ProxyShard', 'MobileProxy']]);
  assert.equal(checklist.sources[0].links[2].href, '/antidetect/shardx');
  assert.equal(checklist.action.href, '/antidetect');
  assert.equal(checklist.note.map(part => part.text).join(''), 'Промокод hopscup почти везде.');
});

test('antidetect article keeps fixed editorial dates and complete settings and screenshots', () => {
  const page = guidePages.find(page => page.id === 'guide-antidetect-setup');
  assert.equal(page.title.ru, 'Как настроить антидетект: Dolphin, AdsPower, ShardX | Hopscup');
  assert.equal(page.description.ru, 'Практическая настройка антидетект-браузера на примере Dolphin Anty, AdsPower и ShardX: прокси, WebRTC, часовой пояс, язык, геолокация и проверка отпечатка.');
  assert.equal(page.datePublished, '2026-09-06T21:36:58+03:00');
  assert.equal(page.dateModified, '2026-11-10');
  assert.equal(page.cover, antidetectSetupMeta.cover);
  assert.equal(copy.settings.length, 9);
  assert.equal(copy.screenshots.length, 5);
  assert.ok(copy.closing.includes('видео на 15 минут'));
  assert.ok(!/[—–]/.test(JSON.stringify([copy, additions])));
});
