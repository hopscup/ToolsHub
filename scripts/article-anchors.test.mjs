import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { samePageHash, decodeAnchorId, anchorScrollTop, scrollProgress, ARTICLE_SCROLL_DURATION, ARTICLE_HEADER_GAP } from '../src/lib/articleAnchors.js';

test('article anchors intercept only links on the current page, including encoded IDs', () => {
  const current = 'https://hopscup.tools/guides/test?view=full#old';
  for (const href of ['#new', '/guides/test?view=full#new', 'https://hopscup.tools/guides/test?view=full#new']) assert.equal(samePageHash(href, current), '#new');
  for (const href of ['/guides/other#new', '/guides/test#new', 'https://example.com/guides/test?view=full#new', '#', '/']) assert.equal(samePageHash(href, current), null);
  assert.equal(decodeAnchorId('#%D1%88%D0%B0%D0%B3'), 'шаг');
  assert.equal(decodeAnchorId('#bad%escape'), 'bad%escape');
});

test('article scrolling respects measured header offset and document boundaries', () => {
  assert.equal(ARTICLE_SCROLL_DURATION, 500);
  assert.equal(ARTICLE_HEADER_GAP, 20);
  assert.equal(anchorScrollTop(500, 1000, 84, 5000), 1416);
  assert.equal(anchorScrollTop(20, 0, 84, 5000), 0);
  assert.equal(anchorScrollTop(500, 1000, 84, 1200), 1200);
  assert.equal(scrollProgress(0), 0);
  assert.equal(scrollProgress(1), 1);
  assert.ok(scrollProgress(0.5) > 0.5 && scrollProgress(0.5) < 1);
});

test('every article template uses shared navigation and static anchors keep their offset', async () => {
  for (const name of ['ImportedGuideArticle', 'ProxyGuideArticle', 'MobileProxyComparisonArticle', 'MobileIpGuideArticle', 'GmailForwardingGuideArticle', 'AntidetectSetupGuideArticle']) {
    const source = await readFile(`src/components/${name}.tsx`, 'utf8');
    assert.match(source, /<ArticleToc items=/, name);
    assert.doesNotMatch(source, /<nav className="article-toc/, name);
  }
  const html = await readFile('index.html', 'utf8');
  const css = await readFile('src/index.css', 'utf8');
  assert.match(html, /\.seo-fallback :is\(h2, h3, section\)\[id\] \{ scroll-margin-top: 84px; \}/);
  assert.doesNotMatch(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css + html, /scroll-behavior:\s*smooth/);
});
