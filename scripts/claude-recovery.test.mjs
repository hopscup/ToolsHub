import assert from 'node:assert/strict';
import test from 'node:test';
import { claudeRecoveryArticle as article } from '../src/data/claudeRecoveryArticle.js';
import { guidePages } from '../src/data/guidePages.js';
import { guideCatalog } from '../src/data/guideCatalog.js';
import { loadOffers } from './load-offers.mjs';

test('Claude recovery guide shares its article data with the catalogue and SEO layer', async () => {
  const page = guidePages.find(page => page.id === article.id);
  assert.equal(page.slug, article.slug);
  assert.equal(page.articleBlocks, article.blocks);
  assert.equal(page.heading.ru, article.title);
  assert.equal(page.intro.ru, article.intro);
  assert.equal(page.cover, article.cover);
  assert.equal(page.dateModified, '2026-11-09');
  assert.equal(guideCatalog.find(guide => guide.id === article.id).route, `/guides/${article.slug}`);
  const { OFFERS } = await loadOffers();
  assert.equal(OFFERS.filter(offer => offer.id === article.id).length, 1);
});

test('Claude recovery guide keeps six prompts, two paths, the summary table and heading anchors', () => {
  const code = article.blocks.filter(block => block.type === 'code');
  assert.equal(code.filter(block => block.label === 'Промпт').length, 6);
  assert.deepEqual(code.filter(block => block.label === 'Путь к папке').map(block => block.text), ['%USERPROFILE%\\.claude\\projects', '%APPDATA%\\Claude']);
  assert.equal(article.blocks.find(block => block.type === 'table').rows.length, 3);
  const headings = article.blocks.filter(block => block.type === 'heading');
  assert.equal(new Set(headings.map(block => block.id)).size, headings.length);
  for (const heading of headings) assert.equal(article.headingIds[heading.text], heading.id);
  assert.ok(!JSON.stringify(article).includes('[ссылка на ролик]'));
  assert.ok(!/[—–]/.test(JSON.stringify(article)));
});
