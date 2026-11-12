import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { isIndexablePath, getCanonicalPath, getIndexAlternates, getLanguageSwitchPath, absoluteIndexUrl } from '../src/data/indexPolicy.js';

export const auditIndexPolicyBrowser = async () => {
  const { chromium } = await import(process.env.SEO_AUDIT_BROWSER_MODULE || 'playwright');
  const dist = path.resolve('dist');
  const server = createServer(async (request, response) => {
    try {
      let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (!path.extname(pathname)) pathname = pathname.replace(/\/$/, '') + '/index.html';
      const file = path.resolve(dist, '.' + pathname);
      if (!file.startsWith(dist + path.sep)) throw Error('Invalid path');
      response.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' })[path.extname(file)] || 'application/octet-stream');
      response.end(await readFile(file));
    } catch { response.statusCode = 404; response.end('Not found'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ headless: true, ...(process.env.SEO_AUDIT_BROWSER_EXECUTABLE ? { executablePath: process.env.SEO_AUDIT_BROWSER_EXECUTABLE } : {}) });
  let checked = 0;
  try {
    const paths = (await readdir(dist, { recursive: true })).filter(file => path.basename(file) === 'index.html')
      .map(file => '/' + file.replaceAll('\\', '/').replace(/(?:\/)?index\.html$/, '').replace(/\/$/, ''));
    let cursor = 0;
    const worker = async () => {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      await context.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
      await context.addInitScript(() => localStorage.setItem('hopscup-analytics-consent', 'denied'));
      const page = await context.newPage();
      try {
        while (cursor < paths.length) {
          const route = paths[cursor++];
          assert.equal((await page.goto(base + route)).status(), 200, route);
          await page.waitForFunction(route => document.documentElement.dataset.indexPolicyPath === route, route);
          const head = await page.evaluate(() => ({
            robots: document.querySelector('meta[name="robots"]')?.content,
            canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
            alternates: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(node => ({ language: node.hreflang, href: node.getAttribute('href') })),
          }));
          assert.equal(head.robots?.startsWith('index, follow'), isIndexablePath(route), route);
          if (!isIndexablePath(route)) assert.equal(head.robots, 'noindex, follow', route);
          assert.equal(head.canonical, absoluteIndexUrl(getCanonicalPath(route)), route);
          assert.deepEqual(head.alternates, getIndexAlternates(route).map(item => ({ language: item.language, href: absoluteIndexUrl(item.path) })), route);
          if (isIndexablePath(route)) assert.ok(isIndexablePath(new URL(head.canonical).pathname), route);
          for (const item of head.alternates) assert.ok(isIndexablePath(new URL(item.href).pathname), route);
          checked++;
          if (checked % 100 === 0) console.log(`React index policy: ${checked}/${paths.length}`);
        }
      } finally { await context.close(); }
    };
    await Promise.all(Array.from({ length: 4 }, worker));

    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await context.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    const page = await context.newPage();
    for (const route of ['/', '/proxy-vpn', '/crypto-exchange', '/en', '/en/guides', '/social-boost', '/guides/antidetekt-na-telefone']) {
      await page.goto(base + route); await page.waitForFunction(route => document.documentElement.dataset.indexPolicyPath === route, route);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route);
      if (route.startsWith('/guides/')) assert.equal(await page.locator('[data-language-link]').getAttribute('href'), getLanguageSwitchPath(route, 'en'));
      else {
        await page.getByRole('button', { name: 'Language', exact: true }).click();
        assert.equal(await page.getByRole('menuitemradio', { name: 'English', exact: true }).getAttribute('href'), getLanguageSwitchPath(route, 'en'));
      }
    }
    const links = [
      ['/antidetect/shardx', '/guides/youtube-ferma', 'Как собрать YouTube-ферму, разобрал отдельно'],
      ['/antidetect/adspower', '/guides/youtube-ferma', 'Как собрать YouTube-ферму, разобрал отдельно'],
      ['/antidetect/dolphin-anty', '/guides/youtube-ferma', 'Как собрать YouTube-ферму, разобрал отдельно'],
      ['/proxy-vpn/luchshie-proksi', '/guides/youtube-ferma', 'Как собрать YouTube-ферму, разобрал отдельно'],
      ['/guides/claude-iz-rossii-bez-bana', '/guides/deshevye-podpiski-chatgpt-claude-gemini', 'Где взять подписку дешевле, разобрал отдельно'],
      ['/guides/claude-iz-rossii-bez-bana', '/guides/claude-zabanili-kak-sohranit-dannye', 'Если всё же забанили, как сохранить данные'],
      ['/guides/account-farm', '/guides/gmail-forwarding', 'Как настроить пересылку писем с Gmail'],
      ['/crypto-exchange', '/guides/exchange-uids-addresses', 'Где найти UID и адрес на бирже'],
    ];
    for (const [route, href, label] of links) {
      await page.goto(base + route); await page.waitForFunction(route => document.documentElement.dataset.indexPolicyPath === route, route);
      const link = page.getByRole('link', { name: label, exact: true });
      assert.equal(await link.getAttribute('href'), href, route);
      const html = await readFile(path.join(dist, route, 'index.html'), 'utf8');
      assert.ok(html.includes(label) && html.includes(`href="${href}"`), route);
    }
    await page.goto(base + '/crypto-exchange'); await page.getByRole('button', { name: 'Language', exact: true }).click();
    await page.getByRole('menuitemradio', { name: 'English', exact: true }).click();
    await page.waitForURL(base + '/en/crypto-exchange');
    await page.waitForFunction(() => document.documentElement.dataset.indexPolicyPath === '/en/crypto-exchange');
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, follow');
    await page.goto(base + '/guides/antidetekt-na-telefone');
    await page.locator('[data-language-link]').click();
    await page.waitForURL(base + '/en');
    await context.close();
    console.log(`React index policy passed: ${checked} pages, mobile language links, 8 contextual crosslinks, existing noindex EN counterpart and untranslated article fallback.`);
  } finally {
    await browser.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
  }
};
