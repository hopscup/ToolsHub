import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {XMLParser,XMLValidator} from 'fast-xml-parser';
import {isIndexablePath,absoluteIndexUrl} from '../src/data/indexPolicy.js';
import {lastCommitChanges} from './indexnow-changes.mjs';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const maxXmlBytes = 2 * 1024 * 1024;
const endpoints = ['https://api.indexnow.org/indexnow', 'https://yandex.com/indexnow'];
const parser = new XMLParser({ignoreAttributes: true, removeNSPrefix: true, isArray: (name, location) => ['urlset.url', 'sitemapindex.sitemap'].includes(location)});

export const parseSitemap = xml => {
  if (Buffer.byteLength(xml) > maxXmlBytes || /<!DOCTYPE|<!ENTITY/i.test(xml)) throw Error('Unsafe or oversized sitemap XML');
  if (XMLValidator.validate(xml) !== true) throw Error('Invalid sitemap XML');
  const parsed = parser.parse(xml);
  const index = parsed.sitemapindex;
  const set = parsed.urlset;
  if (!index && !set) throw Error('Expected sitemapindex or urlset');
  const locations = entries => (entries || []).map(entry => {
    if (typeof entry.loc !== 'string' || !entry.loc.trim()) throw Error('Missing sitemap loc');
    return entry.loc.trim();
  });
  return {sitemaps: locations(index?.sitemap), urls: locations(set?.url)};
};

export const canonicalSiteUrl = (value, origin) => {
  const url = new URL(value);
  if (url.origin !== origin || url.username || url.password || url.search || url.hash) throw Error('URL outside the configured canonical host: ' + value);
  return absoluteIndexUrl(url.pathname, origin);
};

const getText = async (url, {fetchImpl, timeoutMs}) => {
  const response = await fetchImpl(url, {redirect: 'error', signal: AbortSignal.timeout(timeoutMs)});
  if (response.status !== 200) throw Error('GET ' + url + ': HTTP ' + response.status);
  return {text: await response.text(), response};
};

export const collectSitemapUrls = async ({origin, fetchImpl = fetch, timeoutMs = 20000, sitemapDir} = {}) => {
  const queue = [origin + '/sitemap.xml'], visited = new Set(), found = new Set();
  while (queue.length) {
    const location = queue.shift();
    if (visited.has(location)) continue;
    if (visited.size >= 20) throw Error('Sitemap file limit exceeded (20)');
    const url = new URL(location);
    canonicalSiteUrl(location, origin);
    if (!url.pathname.endsWith('.xml')) throw Error('Invalid child sitemap: ' + location);
    visited.add(location);
    let xml;
    if (sitemapDir) {
      const root = path.resolve(sitemapDir), target = path.resolve(root, '.' + decodeURIComponent(url.pathname));
      if (!target.startsWith(root + path.sep)) throw Error('Sitemap path escapes local directory');
      xml = await readFile(target, 'utf8');
    } else xml = (await getText(location, {fetchImpl, timeoutMs})).text;
    const entries = parseSitemap(xml);
    for (const child of entries.sitemaps) {
      canonicalSiteUrl(child, origin);
      queue.push(child);
    }
    for (const item of entries.urls) found.add(canonicalSiteUrl(item, origin));
    if (found.size > 50000) throw Error('Sitemap URL safety limit exceeded (50000)');
  }
  return [...found].sort();
};

export const selectUrls = ({sitemapUrls, changedPaths, all = false, origin, indexable = isIndexablePath}) => {
  const changed = new Set((changedPaths || []).map(route => canonicalSiteUrl(new URL(route, origin).href, origin)));
  return [...new Set(sitemapUrls.map(url => canonicalSiteUrl(url, origin)))].filter(url => indexable(new URL(url).pathname) && (all || changed.has(url))).sort();
};

export const validateConfig = config => {
  const origin = new URL(config.origin);
  if (origin.origin !== config.origin || origin.protocol !== 'https:' || origin.host !== 'hopscup.tools') throw Error('IndexNow host must be https://hopscup.tools');
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(config.key)) throw Error('Invalid IndexNow key');
  if (JSON.stringify(config.endpoints) !== JSON.stringify(endpoints)) throw Error('Unexpected IndexNow endpoints');
  if (!Number.isInteger(config.maxUrlsPerRequest) || config.maxUrlsPerRequest < 1 || config.maxUrlsPerRequest > 10000) throw Error('IndexNow batch limit must be between 1 and 10000');
  if (!Number.isInteger(config.timeoutMs) || config.timeoutMs < 1000 || config.timeoutMs > 120000) throw Error('Invalid request timeout');
  return config;
};

export const checkPublicKey = async (config, fetchImpl = fetch) => {
  const keyLocation = config.origin + '/' + config.key + '.txt';
  const {text} = await getText(keyLocation, {fetchImpl, timeoutMs: config.timeoutMs});
  if (text.trim() !== config.key) throw Error('Public key file does not match config. Deploy it before submitting.');
  return keyLocation;
};

const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(match => [match[1].toLowerCase(), match[2] ?? match[3]]));
export const checkPage = async (url, config, fetchImpl = fetch) => {
  const {text, response} = await getText(url, {fetchImpl, timeoutMs: config.timeoutMs});
  const headEnd = text.search(/<\/head\s*>/i);
  if (headEnd < 0) throw Error('Missing HTML head: ' + url);
  const head = text.slice(0, headEnd);
  const metas = [...head.matchAll(/<meta\s[^>]*>/gi)].map(match => attributes(match[0]));
  const robots = metas.filter(meta => /^(robots|bingbot|yandex)$/i.test(meta.name || '')).map(meta => meta.content || '').join(',') + ',' + (response.headers.get('x-robots-tag') || '');
  if (/\b(noindex|none)\b/i.test(robots) || !/\bindex\b/i.test(robots)) throw Error('Page is not explicitly indexable: ' + url);
  const canonical = [...head.matchAll(/<link\s[^>]*>/gi)].map(match => attributes(match[0])).filter(link => link.rel?.toLowerCase() === 'canonical');
  if (canonical.length !== 1 || canonicalSiteUrl(canonical[0].href, config.origin) !== url) throw Error('Canonical mismatch: ' + url);
};

export const submitBatches = async ({urls, config, fetchImpl = fetch, log = console.log}) => {
  const results = [];
  for (const endpoint of config.endpoints) {
    for (let offset = 0; offset < urls.length; offset += config.maxUrlsPerRequest) {
      const urlList = urls.slice(offset, offset + config.maxUrlsPerRequest);
      const payload = {host: new URL(config.origin).host, key: config.key, keyLocation: config.origin + '/' + config.key + '.txt', urlList};
      let result;
      try {
        const response = await fetchImpl(endpoint, {method: 'POST', redirect: 'error', headers: {'Content-Type': 'application/json; charset=utf-8'}, body: JSON.stringify(payload), signal: AbortSignal.timeout(config.timeoutMs)});
        result = {endpoint, batch: offset / config.maxUrlsPerRequest + 1, urls: urlList.length, status: response.status, accepted: [200, 202].includes(response.status), retryAfter: response.headers.get('retry-after'), rateLimit: Object.fromEntries([...response.headers].filter(([name]) => /ratelimit/i.test(name))), body: (await response.text()).slice(0, 16000)};
      } catch (error) { result = {endpoint, urls: urlList.length, accepted: false, error: error.message}; }
      results.push(result);
      log(JSON.stringify(result));
      // Never retry automatically: 429 and Retry-After must be reviewed by the operator.
      if (!result.accepted) break;
    }
  }
  return results;
};

export const parseArgs = args => {
  const options = {all: false, dryRun: false};
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--all') options.all = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--help') options.help = true;
    else if (arg === '--sitemap-dir' || arg === '--commit') {
      const value = args[++index];
      if (!value || value.startsWith('--')) throw Error('Missing value for ' + arg);
      options[arg === '--commit' ? 'revision' : 'sitemapDir'] = value;
    } else throw Error('Unknown argument: ' + arg);
  }
  if (options.sitemapDir && !options.dryRun) throw Error('--sitemap-dir is allowed only with --dry-run');
  return options;
};

export const runIndexNow = async (options, {root = projectRoot, fetchImpl = fetch, changes = lastCommitChanges, log = console.log, logDir = path.join(root, '.indexnow')} = {}) => {
  if (options.sitemapDir && !options.dryRun) throw Error('--sitemap-dir is allowed only with --dry-run');
  const config = validateConfig(JSON.parse(await readFile(path.join(root, 'indexnow.config.json'), 'utf8')));
  const localKey = await readFile(path.join(root, 'public', config.key + '.txt'), 'utf8');
  if (localKey.trim() !== config.key) throw Error('Local key file mismatch');
  const record = {startedAt: new Date().toISOString(), mode: options.all ? 'all' : 'last-commit', dryRun: !!options.dryRun, sitemapSource: options.sitemapDir ? path.resolve(options.sitemapDir) : config.origin + '/sitemap.xml', limitPerPost: config.maxUrlsPerRequest, endpoints: config.endpoints, results: []};
  let exitCode = 0;
  try {
    const sitemapUrls = await collectSitemapUrls({origin: config.origin, fetchImpl, timeoutMs: config.timeoutMs, sitemapDir: options.sitemapDir});
    const changed = options.all ? undefined : await changes({root, revision: options.revision || 'HEAD'});
    record.commit = changed?.commit;
    record.parentCommit = changed?.parent;
    record.changedFiles = changed?.files;
    record.sharedRenderChange = changed?.sharedRenderChange;
    record.sitemapUrls = sitemapUrls.length;
    record.urlList = selectUrls({sitemapUrls, changedPaths: changed?.paths, all: options.all, origin: config.origin});
    log(JSON.stringify({mode: record.mode, sitemapUrls: sitemapUrls.length, selected: record.urlList.length, limitPerPost: config.maxUrlsPerRequest, dailyLimit: 'Not publicly specified; observe HTTP 429 and Retry-After', commit: record.commit}));
    if (options.dryRun) {
      log(JSON.stringify({dryRun: true, urlList: record.urlList}));
    } else if (record.urlList.length) {
      await checkPublicKey(config, fetchImpl);
      // Finish every preflight before the first POST to avoid a partially unsafe submission.
      for (const [index, url] of record.urlList.entries()) {
        await checkPage(url, config, fetchImpl);
        if ((index + 1) % 10 === 0 || index === record.urlList.length - 1) log('Preflight: ' + (index + 1) + '/' + record.urlList.length);
      }
      record.results = await submitBatches({urls: record.urlList, config, fetchImpl, log});
      if (record.results.some(result => !result.accepted)) exitCode = 1;
    } else log('No changed indexable sitemap URLs. No POST requests sent.');
  } catch (error) { record.error = error.message; log('IndexNow error: ' + error.message); exitCode = 1; }
  await mkdir(logDir, {recursive: true});
  const logFile = path.join(logDir, record.startedAt.replace(/[:.]/g, '-') + '.json');
  await writeFile(logFile, JSON.stringify(record, null, 2) + '\n');
  log('IndexNow log: ' + logFile);
  return {exitCode, record, logFile};
};

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) console.log('npm run indexnow -- [--all] [--dry-run] [--sitemap-dir dist] [--commit HEAD]');
    else process.exitCode = (await runIndexNow(options)).exitCode;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
