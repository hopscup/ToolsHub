import assert from 'node:assert/strict';
import test from 'node:test';

test('article dates do not change with the build date', async () => {
  const previousBuildDate = globalThis.__SITE_BUILD_DATE__;
  globalThis.__SITE_BUILD_DATE__ = '2099-12-31';
  try {
    const { mobileProxyMeta, articleFallbackContent } = await import('../src/data/articleFallbackContent.js?fixed-date-test');
    const { proxyGuideMeta } = await import('../src/data/proxyGuideContent.js?fixed-date-test');
    const { mobileIpGuideMeta } = await import('../src/data/mobileIpGuideContent.js?fixed-date-test');
    assert.equal(mobileProxyMeta.dateModified, '2026-11-07');
    assert.equal(articleFallbackContent.mobile.updated, 'Обновлено 7 ноября 2026 года');
    assert.equal(proxyGuideMeta.dateModified, '2026-11-02');
    assert.equal(mobileIpGuideMeta.dateModified, '2026-11-02');
  } finally {
    if (previousBuildDate === undefined) delete globalThis.__SITE_BUILD_DATE__;
    else globalThis.__SITE_BUILD_DATE__ = previousBuildDate;
  }
});

test('mobile comparison footnote distinguishes the checked provider prices', async () => {
  const { mobileProxyCopy } = await import('../src/data/articleFallbackContent.js');
  assert.equal(mobileProxyCopy.comparisonNote, 'Цены ProxyWing и Proxy-Seller сверены в августе 2026 года. Перед оплатой перепроверьте выбранную страну в кабинете сервиса.');
});
