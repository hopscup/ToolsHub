import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { appendFileSync, existsSync } from 'node:fs';
import { createInventory, saveInventory, checkServiceSnapshot, checkExternalLinkParity, hash, normalizeUrl, isExternalUrl } from './content-regression-inventory.mjs';

// Executed both on a detached static document and the actual mounted React DOM.
export function snapshotDom({ html, service = false } = {}) {
  const doc = html === undefined ? document : new DOMParser().parseFromString(html, 'text/html');
  const selector = html !== undefined ? '.seo-fallback' : service ? '[role="dialog"][aria-labelledby="offer-modal-title"]' : '#root';
  const root = doc.querySelector(selector);
  if (!root) throw Error(`Missing content root: ${selector}`);
  const clone = root.cloneNode(true);
  clone.querySelectorAll('noscript, script, style, template').forEach(node => node.remove());
  if (service) clone.querySelectorAll('[data-service-alternatives]').forEach(node => node.remove());
  // Keep block boundaries: adjacent DD/DT or spans must not glue two values together.
  const textNodes = [];
  const walker = doc.createTreeWalker(clone, 4);
  while (walker.nextNode()) textNodes.push(walker.currentNode.textContent);
  const facts = [...clone.querySelectorAll('dt')].map(node => ({ label: node.textContent, value: node.nextElementSibling?.tagName === 'DD' ? node.nextElementSibling.textContent : '' }));
  for (const row of clone.querySelectorAll('[data-card-stat]')) facts.push({ key: row.getAttribute('data-card-stat'), label: row.querySelector('h4')?.textContent, value: row.querySelector('p')?.textContent || '' });
  for (const heading of clone.querySelectorAll('h4')) {
    for (let row = heading.parentElement; row && row !== clone; row = row.parentElement) {
      const values = [...row.querySelectorAll('p')];
      if (values.length) { facts.push({ label: heading.textContent, value: values.map(node => node.textContent).join(' ') }); break; }
    }
  }
  return {
    text: textNodes.join(' '),
    facts,
    paragraphs: [...clone.querySelectorAll('p')].map(node => node.textContent),
    ...(service ? { authorParagraphs: html === undefined
      ? [...clone.querySelectorAll('[data-offer-description] p')].slice(0, 1).map(node => node.textContent)
      : [...clone.querySelectorAll('.fallback-hero > p:first-of-type, [data-service-content] > p:first-of-type')].map(node => node.textContent) } : {}),
    links: [...clone.querySelectorAll('a[href]')].map(node => ({ href: node.getAttribute('href'), rel: node.getAttribute('rel') || '', label: node.textContent })),
  };
}

async function startDistServer(dist) {
  const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain' };
  const server = createServer(async (request, response) => {
    try {
      let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (!path.extname(pathname)) pathname = pathname.replace(/\/$/, '') + '/index.html';
      const file = path.resolve(dist, '.' + pathname);
      if (!file.startsWith(dist + path.sep)) throw Error('Path outside dist');
      const bytes = await readFile(file);
      response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Hash': hash(bytes) });
      response.end(bytes);
    } catch { response.writeHead(404); response.end('Not found'); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  return { base: `http://127.0.0.1:${server.address().port}`, close: async () => {
    server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
  } };
}

export async function runContentRegression({ staticOnly = false, serviceLanguages, output = process.env.CONTENT_REGRESSION_REPORT || 'reports/content-regression' } = {}) {
  const inventory = await createInventory();
  const destination = path.resolve(output);
  await mkdir(destination, { recursive: true });
  await saveInventory(inventory, path.join(destination, 'inventory.json'));
  const report = { generatedAt: new Date().toISOString(), sourceHash: inventory.sourceHash, distHash: inventory.distHash,
    complete: !staticOnly && !serviceLanguages, serviceCount: inventory.serviceCount,
    staticChecks: [], reactChecks: [], defects: inventory.missingPages.map(item => ({ route: item.route, layer: 'static', kind: 'missing-page', id: item.id })),
    scope: { staticLanguages: inventory.languages, serviceLanguages: serviceLanguages || inventory.languages, parityLanguages: inventory.languages },
    externalLinkParity: [], unexecutedReactRoutes: [], ordinaryServiceLinks: inventory.ordinaryServiceLinks };
  const { chromium } = await import(process.env.CONTENT_AUDIT_BROWSER_MODULE || process.env.SEO_AUDIT_BROWSER_MODULE || 'playwright');
  const executablePath = process.env.CONTENT_AUDIT_BROWSER_EXECUTABLE || process.env.SEO_AUDIT_BROWSER_EXECUTABLE;
  const installedEdge = process.platform === 'win32' && [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ].some(file => existsSync(file));
  const server = await startDistServer(inventory.dist);
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : installedEdge ? { channel: 'msedge' } : {}) });
  } catch (error) { await server.close(); throw error; }
  let cursor = 0;
  let finished = 0;
  const snapshots = new Map();
  await writeFile(path.join(destination, 'errors.jsonl'), '');
  const record = (page, layer, defects) => {
    const errors = defects.map(defect => ({ route: page.route, id: page.service?.id, layer, ...defect }));
    report.defects.push(...errors);
    if (errors.length) appendFileSync(path.join(destination, 'errors.jsonl'), errors.map(error => JSON.stringify(error)).join('\n') + '\n');
    report[layer === 'static' ? 'staticChecks' : 'reactChecks'].push({ route: page.route, kind: page.kind, id: page.service?.id, defects: defects.length,
      fieldAssertions: page.service ? page.service[layer === 'static' ? 'staticFields' : 'reactFields'].length : 0,
      serviceLinkAssertions: page.service?.links.length || 0 });
  };
  try {
    const staticContext = await browser.newContext();
    const parser = await staticContext.newPage();
    for (const page of inventory.pages) {
      try {
        const snapshot = await parser.evaluate(snapshotDom, { html: page.noscript, service: Boolean(page.service) });
        snapshots.set(page.route, snapshot);
        const defects = page.service ? checkServiceSnapshot({ fields: page.service.staticFields, links: page.service.links }, snapshot) : [];
        record(page, 'static', defects);
      } catch (error) { record(page, 'static', [{ kind: 'static-parser-error', message: error.message }]); }
    }
    await staticContext.close();
    console.log(`Static: ${report.staticChecks.length}/${inventory.pages.length}, ${report.defects.length} defects`);
    await writeFile(path.join(destination, 'static-defects.json'), JSON.stringify(report.defects, null, 2) + '\n');
    const selectedPages = inventory.pages.filter(page => {
      const language = /^\/(en|es|zh|ko)(?:\/|$)/.exec(page.route)?.[1] || 'ru';
      return !staticOnly && (!page.service || !serviceLanguages || serviceLanguages.includes(language));
    });
    const selected = new Set(selectedPages.map(page => page.route));
    report.unexecutedReactRoutes = inventory.pages.filter(page => !selected.has(page.route)).map(page => page.route);
    const worker = async () => {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
      await context.route('**/*', route => route.request().url().startsWith(server.base + '/') ? route.continue() : route.abort());
      await context.addInitScript(() => localStorage.setItem('hopscup-analytics-consent', 'denied'));
      const tab = await context.newPage();
      tab.setDefaultTimeout(12000);
      let pageErrors = [];
      tab.on('pageerror', error => pageErrors.push(error.message));
      try {
        while (cursor < selectedPages.length) {
          const page = selectedPages[cursor++];
          pageErrors = [];
          try {
            // Refuse asset-stale or rewritten HTML instead of silently auditing another build.
            const response = await tab.goto(server.base + page.route, { waitUntil: 'domcontentloaded' });
            if (!response || response.status() !== 200) throw Error(`HTTP ${response?.status()}`);
            // Chromium may reserialize textual response bodies; hash the exact server bytes instead.
            if (response.headers()['x-content-hash'] !== page.hash) throw Error('HTML changed since inventory creation');
            await tab.waitForFunction(route => document.documentElement.dataset.indexPolicyPath === route, page.route);
            if (page.service) await tab.locator('[role="dialog"][aria-labelledby="offer-modal-title"]').waitFor();
            else await tab.locator('#root main, #root article').first().waitFor();
            const snapshot = await tab.evaluate(snapshotDom, { service: Boolean(page.service) });
            const defects = page.service
              ? checkServiceSnapshot({ fields: page.service.reactFields, links: page.service.links }, snapshot)
              : snapshots.has(page.route) ? checkExternalLinkParity(snapshots.get(page.route), snapshot)
              : [{ kind: 'missing-static-snapshot' }];
            if (!page.service && snapshots.has(page.route)) report.externalLinkParity.push({ route: page.route,
              expected: [...new Set(snapshots.get(page.route).links.map(link => normalizeUrl(link.href)).filter(isExternalUrl))],
              actual: [...new Set(snapshot.links.map(link => normalizeUrl(link.href)).filter(isExternalUrl))],
              missing: defects.filter(item => item.kind === 'missing-external-link').map(item => item.expected) });
            defects.push(...pageErrors.map(message => ({ kind: 'react-page-error', message })));
            record(page, 'react', defects);
          } catch (error) { record(page, 'react', [{ kind: 'react-render-error', message: error.message }]); }
          finished++;
          if (finished % 50 === 0) console.log(`React: ${finished}/${selectedPages.length}, cumulative defects: ${report.defects.length}`);
        }
      } finally { await context.close(); }
    };
    await Promise.all(Array.from({ length: 3 }, worker));
    const after = await createInventory();
    if (after.sourceHash !== inventory.sourceHash || after.distHash !== inventory.distHash) {
      report.complete = false;
      report.defects.push({ kind: 'build-changed-during-audit', layer: 'infrastructure', message: 'Source or dist changed; rerun after the build is stable.' });
    }
  } finally { await browser.close(); await server.close(); }
  report.summary = {
    staticPages: report.staticChecks.length, reactPages: report.reactChecks.length,
    staticServiceVersions: report.staticChecks.filter(item => item.kind === 'service').length,
    reactServiceVersions: report.reactChecks.filter(item => item.kind === 'service').length,
    externalLinkParityPages: report.externalLinkParity.length,
    expectedExternalLinks: report.externalLinkParity.reduce((sum, item) => sum + item.expected.length, 0),
    fieldAssertions: [...report.staticChecks, ...report.reactChecks].reduce((sum, item) => sum + item.fieldAssertions, 0),
    defects: report.defects.length, unexecutedReactPages: report.unexecutedReactRoutes.length,
  };
  report.passed = report.complete && report.defects.length === 0 && report.unexecutedReactRoutes.length === 0;
  await writeFile(path.join(destination, 'results.json'), JSON.stringify(report, null, 2) + '\n');
  await writeFile(path.join(destination, 'external-link-parity.json'), JSON.stringify(report.externalLinkParity, null, 2) + '\n');
  const quote = value => '"' + String(value ?? '').replaceAll('"', '""') + '"';
  await writeFile(path.join(destination, 'defects.csv'), '\uFEFF' + [
    ['route', 'id', 'layer', 'kind', 'field', 'expected', 'message'],
    ...report.defects.map(item => ['route', 'id', 'layer', 'kind', 'field', 'expected', 'message'].map(key => item[key])),
  ].map(row => row.map(quote).join(',')).join('\r\n') + '\r\n');
  console.log(JSON.stringify({ ...report.summary, complete: report.complete, passed: report.passed, output: destination }, null, 2));
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  for (const arg of process.argv.slice(2)) if (arg !== '--static-only' && !arg.startsWith('--service-languages=')) throw Error(`Unknown option: ${arg}`);
  const scope = process.argv.find(arg => arg.startsWith('--service-languages='))?.split('=')[1].split(',');
  if (scope?.some(language => !['ru', 'en', 'es', 'zh', 'ko'].includes(language))) throw Error('Invalid --service-languages');
  const report = await runContentRegression({ staticOnly: process.argv.includes('--static-only'), serviceLanguages: scope });
  if (report.defects.length) process.exitCode = 1;
}
