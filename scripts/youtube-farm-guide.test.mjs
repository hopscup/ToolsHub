import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, stat } from 'node:fs/promises';
import { youtubeFarmArticle, createYoutubeFarmContent } from '../src/data/youtubeFarmContent.js';
import { guidePages } from '../src/data/guidePages.js';
import { guideCatalog } from '../src/data/guideCatalog.js';
import { getExternalLinkRel } from '../src/lib/externalLinks.js';
import { loadOffers } from './load-offers.mjs';

const { OFFERS } = await loadOffers();
const { article, checklist } = createYoutubeFarmContent(OFFERS);

test('YouTube farm guide metadata and dates use the shared author source', () => {
  const page = guidePages.find(page => page.id === article.id);
  assert.equal(page.title.ru, 'YouTube-ферма: антидетект, прокси и теневой бан | Hopscup');
  assert.equal(page.heading.ru, 'YouTube-ферма с нуля: антидетект, прокси и как проверить теневой бан');
  assert.equal(page.description.ru, article.description);
  assert.equal(page.datePublished, '2026-11-11');
  assert.equal(page.dateModified, '2026-11-11');
  assert.ok(article.blocks.filter(block => block.type === 'heading').every(block => article.headingIds[block.text]));
  assert.equal(Object.keys(article.headingIds).length, 9);
  assert.ok(!/[—–]|\(Ссылки?:|ССЫЛКА НА РОЛИК/.test(JSON.stringify(article)));
});

test('YouTube farm uses live proxy referrals and internal antidetect links', () => {
  for (const id of ['p1', 'p2', 'p3', 'p4', 'ant-dolphin', 'ant-adspower']) {
    const offer = OFFERS.find(offer => offer.id === id);
    assert.ok(JSON.stringify({ article, checklist }).includes(offer.url));
    assert.match(getExternalLinkRel(offer.url), /sponsored/);
  }
  for (const href of ['/antidetect/dolphin-anty', '/antidetect/adspower', '/antidetect/incogniton', '/guides/shardx-obzor']) assert.ok(JSON.stringify(article.blocks).includes(href));
  const changed = OFFERS.map(offer => offer.id === 'p2' ? { ...offer, url: 'https://example.test/?ref=updated' } : offer);
  assert.ok(JSON.stringify(createYoutubeFarmContent(changed)).includes('https://example.test/?ref=updated'));
  assert.throws(() => createYoutubeFarmContent(OFFERS.filter(offer => offer.id !== 'p2')), /Missing YouTube farm article service: p2/);
});

test('YouTube farm keeps the author steps, bold labels and analysis lists', () => {
  assert.deepEqual(article.blocks.filter(block => block.type === 'list' && block.ordered).map(block => block.items.length), [6, 3]);
  assert.deepEqual(article.blocks.filter(block => block.type === 'list' && !block.ordered).map(block => block.items.length), [2, 3, 3]);
  assert.ok(article.blocks.some(block => block.content?.some(part => part.text === 'Про гео.' && part.strong)));
  const analytics = article.blocks.findIndex(block => block.type === 'heading' && block.text === 'Есть ли теневой бан: смотрим аналитику');
  assert.ok(analytics > 0);
  assert.ok(!JSON.stringify(article.blocks.slice(analytics)).includes('Про теневой бан подробно в отдельном ролике'));
  assert.ok(JSON.stringify(article.blocks).includes('https://browserleaks.com/'));
  assert.equal(getExternalLinkRel('https://browserleaks.com/'), 'noopener noreferrer');
});

test('YouTube farm checklist keeps the five author items and source order', () => {
  assert.equal(checklist.items.length, 5);
  assert.deepEqual(checklist.sources.map(source => source.links.map(link => link.text)), [['ShardX', 'Dolphin', 'AdsPower'], ['Proxy-Seller', 'ProxyWing', 'ProxyShard']]);
  assert.equal(checklist.sources[0].links[0].href, '/antidetect/shardx');
  assert.equal(checklist.note.map(part => part.text).join(''), 'Промокод hopscup почти везде.');
  assert.equal(checklist.action.href, '/proxy-vpn');
});

test('YouTube farm has the supplied video and small poster without a standalone cover', async () => {
  assert.equal(article.video.id, 'fhEoqQla4UM');
  assert.equal(article.video.caption, 'Видеоверсия этого гайда');
  assert.equal(getExternalLinkRel(article.video.url), 'noopener noreferrer');
  assert.equal(article.cover, undefined);
  for (const image of [article.videoPoster, article.catalogCover]) {
    assert.ok((await stat('public' + image.src)).size < 80_000);
    assert.equal(image.width / image.height, 16 / 9);
  }
});

test('YouTube farm is a native article in the Accounts catalogue', async () => {
  assert.equal(guideCatalog.find(item => item.id === article.id).route, '/guides/youtube-ferma');
  assert.ok(OFFERS.some(offer => offer.id === article.id && offer.category === 'Guides'));
  const app = await readFile('src/App.tsx', 'utf8');
  assert.ok(app.includes("'guide-youtube-farm': { topic: 'accounts'"));
  assert.ok(app.includes('return <YoutubeFarmGuideArticle'));
  assert.ok(app.includes('offer.id === youtubeFarmArticle.id'));
});
