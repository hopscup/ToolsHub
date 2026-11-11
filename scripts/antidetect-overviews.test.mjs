import assert from 'node:assert/strict';
import test from 'node:test';
import { access, readFile, stat } from 'node:fs/promises';
import { antidetectOverviewArticles, createAntidetectOverviewContent } from '../src/data/antidetectOverviewContent.js';
import { guidePages } from '../src/data/guidePages.js';
import { antidetectPages } from '../src/data/antidetectPages.js';
import { guideCatalog } from '../src/data/guideCatalog.js';
import { getExternalLinkRel } from '../src/lib/externalLinks.js';
import { loadOffers } from './load-offers.mjs';

const { OFFERS } = await loadOffers();
test('ShardX service card links to the detailed review through shared editorial data', () => {
  const expected = {
    href: '/guides/shardx-obzor',
    label: {
      ru: 'Подробный обзор ShardX с настройкой и проверкой на утечки',
      en: 'Detailed ShardX review with setup and leak checks',
    },
  };
  assert.deepEqual(antidetectPages.find(page => page.id === 'ant-shardx').editorial.setupGuide, expected);
  assert.deepEqual(OFFERS.find(offer => offer.id === 'ant-shardx').editorial.setupGuide, expected);
});
for (const source of antidetectOverviewArticles) {
  test(`${source.id}: shared metadata, full content and catalogue route`, () => {
    const page = guidePages.find(page => page.id === source.id);
    assert.equal(page.title.ru, source.seoTitle);
    assert.equal(page.heading.ru, source.title);
    assert.equal(page.description.ru, source.description);
    assert.equal(page.datePublished, '2026-11-11');
    assert.equal(page.dateModified, '2026-11-11');
    assert.ok(!/[—–]/.test(JSON.stringify(source)));
    assert.ok(!/\(Ссылки?:|Выноска \(warning\)|ССЫЛКА НА РОЛИК/.test(JSON.stringify(source.blocks)));
    assert.ok(source.blocks.filter(block => block.type === 'heading').every(block => source.headingIds[block.text]));
    assert.equal(guideCatalog.find(item => item.id === source.id).route, `/guides/${source.slug}`);
    assert.ok(OFFERS.some(offer => offer.id === source.id && offer.category === 'Guides'));
    assert.deepEqual(page.articleBlocks, source.blocks);
    assert.equal(getExternalLinkRel(source.video.url), 'noopener noreferrer');
  });

  test(`${source.id}: live OFFERS links, checklist and lightweight covers`, async () => {
    const { article, checklist } = createAntidetectOverviewContent(source, OFFERS);
    assert.ok(!JSON.stringify({ article, checklist }).includes('serviceId'));
    assert.equal(checklist.items.length, 5);
    assert.equal(checklist.action.href, '/antidetect');
    assert.equal(checklist.note.map(part => part.text).join(''), 'Промокод hopscup почти везде.');
    for (const id of ['p1', 'p3', 'p6']) {
      const url = OFFERS.find(offer => offer.id === id).url;
      assert.ok(JSON.stringify({ article, checklist }).includes(url));
      assert.match(getExternalLinkRel(url), /sponsored/);
    }
    const updated = OFFERS.map(offer => offer.id === 'p3' ? { ...offer, url: 'https://example.test/?ref=changed' } : offer);
    assert.ok(JSON.stringify(createAntidetectOverviewContent(source, updated)).includes('https://example.test/?ref=changed'));
    assert.throws(() => createAntidetectOverviewContent(source, OFFERS.filter(offer => offer.id !== 'p3')), /Missing antidetect overview article service: p3/);
    for (const image of [source.cover, source.catalogCover]) {
      await access('public' + image.src);
      assert.ok((await stat('public' + image.src)).size < 100_000);
      assert.equal(image.width / image.height, 16 / 9);
    }
  });
}

test('free comparison table links all eight services and preserves the prompt and ShardX video', () => {
  const { article } = createAntidetectOverviewContent(antidetectOverviewArticles[0], OFFERS);
  const table = article.blocks.find(block => block.type === 'table');
  assert.equal(table.rows.length, 8);
  assert.deepEqual(table.rows.map(row => row[0][0].href), ['/antidetect/shardx', '/antidetect/donut-browser', '/antidetect/bitbrowser', '/antidetect/dolphin-anty', '/antidetect/gologin', '/antidetect/incogniton', '/antidetect/adspower', '/antidetect/morelogin']);
  assert.equal(article.blocks.filter(block => block.type === 'quote').length, 1);
  assert.equal(article.blocks.filter(block => block.type === 'callout').length, 2);
  assert.equal(article.blocks.filter(block => block.warning).length, 1);
  const link = article.blocks.find(block => block.content?.some(part => part.href === 'https://youtu.be/lWNJBKEr0Fw'));
  assert.ok(link);
  assert.equal(getExternalLinkRel(link.content[0].href), 'noopener noreferrer');
});

test('ShardX table keeps the empty Dolphin storage cell and cross-links both guides', () => {
  const { article } = createAntidetectOverviewContent(antidetectOverviewArticles[1], OFFERS);
  const table = article.blocks.find(block => block.type === 'table');
  assert.equal(table.rows.length, 5);
  assert.equal(table.rows[3][3][0].text, '');
  assert.deepEqual(table.headers.slice(1).map(cell => cell[0].href), ['/antidetect/shardx', '/antidetect/donut-browser', '/antidetect/dolphin-anty', '/antidetect/adspower']);
  assert.ok(JSON.stringify(article.blocks).includes('/guides/besplatnye-antidetekt-brauzery'));
  assert.equal(getExternalLinkRel('https://github.com/ProxyShard/ShardBrowser'), 'noopener noreferrer');
});

test('both overview articles are native React pages in the antidetect catalogue topic', async () => {
  const app = await readFile('src/App.tsx', 'utf8');
  for (const source of antidetectOverviewArticles) assert.ok(app.includes(`'${source.id}': { topic: 'antidetect'`));
  assert.ok(app.includes('return <AntidetectOverviewGuideArticle'));
  assert.ok(app.includes('antidetectOverviewArticles.some(article => article.id === offer.id)'));
});
