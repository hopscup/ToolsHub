import assert from 'node:assert/strict';
import test from 'node:test';

test('article dates do not change with the build date', async () => {
  const previousBuildDate = globalThis.__SITE_BUILD_DATE__;
  globalThis.__SITE_BUILD_DATE__ = '2099-12-31';
  try {
    const { mobileProxyMeta, articleFallbackContent } = await import('../src/data/articleFallbackContent.js?fixed-date-test');
    const { proxyGuideMeta } = await import('../src/data/proxyGuideContent.js?fixed-date-test');
    const { mobileIpGuideMeta } = await import('../src/data/mobileIpGuideContent.js?fixed-date-test');
    const { claudeGuideArticle } = await import('../src/data/claudeGuideArticle.js?fixed-date-test');
    assert.equal(mobileProxyMeta.dateModified, '2026-11-07');
    assert.equal(articleFallbackContent.mobile.updated, 'Обновлено 7 ноября 2026 года');
    assert.equal(proxyGuideMeta.dateModified, '2026-11-02');
    assert.equal(mobileIpGuideMeta.dateModified, '2026-11-02');
    assert.equal(claudeGuideArticle.datePublished, '2026-11-01T15:20:49+03:00');
    assert.equal(claudeGuideArticle.dateModified, '2026-11-10');
  } finally {
    if (previousBuildDate === undefined) delete globalThis.__SITE_BUILD_DATE__;
    else globalThis.__SITE_BUILD_DATE__ = previousBuildDate;
  }
});

test('shortened mobile-IP and Claude SEO titles do not replace the article H1', async () => {
  const { mobileIpGuideMeta } = await import('../src/data/mobileIpGuideContent.js');
  const { claudeGuideArticle } = await import('../src/data/claudeGuideArticle.js');
  const { guidePages } = await import('../src/data/guidePages.js');
  assert.equal(mobileIpGuideMeta.title, 'Как сменить IP через режим самолёта | Hopscup');
  assert.equal(mobileIpGuideMeta.heading, 'Как сменить IP через режим самолёта на телефоне и ПК');
  assert.equal(claudeGuideArticle.seoTitle, 'Claude из России без бана: как пользоваться | Hopscup');
  assert.equal(claudeGuideArticle.title, 'Пользуемся Claude без проблем: как не словить бан');
  const claude = guidePages.find(page => page.id === claudeGuideArticle.id);
  assert.equal(claude.title.ru, claudeGuideArticle.seoTitle);
  assert.equal(claude.heading.ru, claudeGuideArticle.title);
  assert.equal(claude.datePublished, claudeGuideArticle.datePublished);
  assert.equal(claude.dateModified, claudeGuideArticle.dateModified);
});

test('mobile comparison footnote distinguishes the checked provider prices', async () => {
  const { mobileProxyCopy } = await import('../src/data/articleFallbackContent.js');
  assert.equal(mobileProxyCopy.comparisonNote, 'Цены ProxyWing и Proxy-Seller сверены в августе 2026 года. Перед оплатой перепроверьте выбранную страну в кабинете сервиса.');
});

test('article footer uses the short site label and keeps its internal link', async () => {
  const { articleSocialLinks } = await import('../src/data/articleSocialFooter.js');
  const site = articleSocialLinks.find(link => link.platform === 'site');
  assert.equal(site.label, 'hopscup.tools');
  assert.equal(site.href, '/');
});
