import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile, stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {vpn4gArticle, createVpn4gContent} from '../src/data/vpn4gContent.js';
import {vpnTerms} from '../src/data/vpnDetails.js';
import {guidePages} from '../src/data/guidePages.js';
import {guideCatalog} from '../src/data/guideCatalog.js';
import {isIndexablePath, getCanonicalPath, indexablePaths} from '../src/data/indexPolicy.js';
import {getExternalLinkRel} from '../src/lib/externalLinks.js';
import {getServiceContextualGuideLinks, getSectionContextualGuideLinks, happRoutingGuideLink, vpn4gGuideLink} from '../src/data/contextualGuideLinks.js';
import {loadOffers} from './load-offers.mjs';
const {OFFERS} = await loadOffers();
const {article, checklist} = createVpn4gContent(OFFERS);
const route = '/guides/vpn-ne-rabotaet-na-4g';

test('VPN 4G guide uses source metadata, fixed draft dates and the proxy catalogue topic', async () => {
  const page = guidePages.find(page => page.id === article.id);
  assert.equal(page.title.ru, 'VPN не работает на 4G: что делать в 2026 | Hopscup');
  assert.equal(page.heading.ru, 'VPN не работает на 4G: что делать, если ничего не открывается');
  assert.equal(page.description.ru, article.description);
  assert.equal(page.datePublished, '2026-11-18');
  assert.equal(page.dateModified, '2026-11-18');
  assert.equal(guideCatalog.find(guide => guide.id === article.id).route, route);
  assert.ok(OFFERS.some(offer => offer.id === article.id && offer.category === 'Guides'));
  assert.equal(article.cover, undefined);
  assert.deepEqual(page.catalogCover, article.catalogCover);
  assert.deepEqual(guideCatalog.find(guide => guide.id === article.id).cover, article.catalogCover);
  assert.equal(article.catalogCover.src, '/article/vpn-4g/catalog-preview.webp');
  assert.equal(article.catalogCover.width, 640);
  assert.equal(article.catalogCover.height, 360);
  assert.ok((await stat('public' + article.catalogCover.src)).size < 50000);
  assert.equal(article.video.id, 'Tcv021y6VKo');
  assert.equal(article.video.caption, 'Видеоверсия этого гайда');
  assert.equal(article.videoPoster.src, '/article/vpn-4g/video-poster.webp');
  assert.ok((await stat('public' + article.videoPoster.src)).size < 50000);
  assert.doesNotMatch(JSON.stringify(article), /—|\(Ссылки?:|\[ССЫЛКА/);
  const app = await readFile('src/App.tsx', 'utf8');
  assert.ok(app.includes("'guide-vpn-4g': { topic: 'proxy'"));
  assert.ok(app.includes('return <Vpn4gGuideArticle'));
});

test('VPN 4G comparison resolves every live allowlist value and internal service page', () => {
  const table = article.blocks.find(block => block.type === 'table');
  assert.equal(table.rows.length, 9);
  for (const [index, id] of vpn4gArticle.vpnComparisonIds.entries()) {
    const offer = OFFERS.find(offer => offer.id === id);
    assert.deepEqual(table.rows[index], [[{text: offer.name, href: '/proxy-vpn/' + offer.slug}], [{text: vpnTerms[offer.slug].allowlist.ru}]]);
  }
  const previous = vpnTerms['all-vpn'].allowlist.ru;
  try {
    vpnTerms['all-vpn'].allowlist.ru = 'Updated shared test allowance';
    assert.equal(createVpn4gContent(OFFERS).article.blocks.find(block => block.type === 'table').rows[1][1][0].text, 'Updated shared test allowance');
  } finally { vpnTerms['all-vpn'].allowlist.ru = previous; }
});

test('VPN 4G service links and summary resolve six sponsored live offers', async () => {
  for (const [id, name] of [['vpn-ppl', 'PPL VPN'], ['vpn-imp', 'iMP VPN'], ['vpn-all', 'ALL VPN'], ['p3', 'ProxyWing'], ['p4', 'Proxy-Seller'], ['p6', 'MobileProxy']]) {
    const offer = OFFERS.find(item => item.id === id);
    assert.equal(offer.name, name);
    assert.ok(JSON.stringify(article.blocks).includes(offer.url));
    assert.ok(JSON.stringify(checklist.sources).includes(offer.url));
    assert.match(getExternalLinkRel(offer.url), /sponsored/);
  }
  const changed = OFFERS.map(offer => offer.id === 'p3' ? {...offer, url: 'https://example.test/?ref=updated'} : offer);
  assert.ok(JSON.stringify(createVpn4gContent(changed)).includes('https://example.test/?ref=updated'));
  assert.equal(checklist.items.length, 5);
  assert.equal(article.blocks.filter(block => block.type === 'heading').length, 9);
  assert.ok(article.blocks.filter(block => block.type === 'heading').every(block => article.headingIds[block.text]));
  assert.deepEqual(article.blocks.filter(block => block.type === 'list' && block.ordered).map(block => block.items.length), [3, 3]);
  const wrapper = await readFile('src/components/Vpn4gGuideArticle.tsx', 'utf8');
  assert.ok(wrapper.includes('trackArticleService(offers, href, placement)'));
  assert.ok(wrapper.includes('related={[]}'));
});

test('Happ backlinks are limited to qualifying VPN cards and the VPN tab without changing Happ', async () => {
  const linked = OFFERS.filter(offer => [...(offer.editorial?.links || []), ...getServiceContextualGuideLinks(offer)].some(link => link.href === happRoutingGuideLink.href));
  assert.deepEqual(linked.map(offer => offer.id), ['vpn-all', 'vpn-ppl', 'vpn-prosto', 'vpn-imp', 'vpn-quattro', 'vpn-giga', 'vpn-tochka-g', 'vpn-giga-dollar']);
  for (const offer of OFFERS.filter(offer => offer.slug && offer.category !== 'Guides')) {
    const qualifies = offer.subCategory === 'VPN' && /\b(?:happ|incy)\b/i.test(JSON.stringify([offer.description, offer.editorial, offer.details]));
    const explicitLink = offer.editorial?.links?.some(link => link.href === happRoutingGuideLink.href);
    assert.equal(getServiceContextualGuideLinks(offer).some(link => link.href === happRoutingGuideLink.href), qualifies && !explicitLink);
  }
  assert.deepEqual(getSectionContextualGuideLinks('/proxy-vpn', 'VPN'), [happRoutingGuideLink, vpn4gGuideLink]);
  assert.deepEqual(getSectionContextualGuideLinks('/proxy-vpn', 'Proxy'), []);
  assert.deepEqual(getSectionContextualGuideLinks('/proxy-vpn'), [happRoutingGuideLink, vpn4gGuideLink]);
  const happ = (await readFile('src/data/happRoutingArticle.json', 'utf8')).replace(/\r\n/g, '\n');
  assert.equal(createHash('sha256').update(happ).digest('hex'), '4d7d3ceb85788020d96d066befa3b4cc0e98504ba4768976a6cab998631dec66');
});

test('VPN 4G static HTML is complete and indexed only in RU', async () => {
  assert.equal(indexablePaths.length, 93);
  const sitemap = (await Promise.all(['money', 'core', 'services'].map(name => readFile(`dist/sitemap-${name}.xml`, 'utf8')))).join('');
  assert.ok(sitemap.includes(`<loc>https://hopscup.tools${route}</loc>`));
  for (const prefix of ['', '/en', '/es', '/zh', '/ko']) {
    assert.equal(isIndexablePath(prefix + route), !prefix);
    assert.equal(getCanonicalPath(prefix + route), route);
    assert.ok(!prefix || !sitemap.includes(prefix + route));
    const html = await readFile(`dist${prefix}${route}/index.html`, 'utf8');
    const content = html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1];
    assert.ok(html.includes(`rel="canonical" href="https://hopscup.tools${route}"`));
    assert.ok(html.includes(`name="robots" content="${prefix ? 'noindex' : 'index'}, follow`));
    assert.equal((content.match(/<table/g) || []).length, 1);
    for (const row of article.blocks.find(block => block.type === 'table').rows) assert.ok(content.includes(row[1][0].text));
    assert.ok(content.includes(article.video.url));
    assert.ok(content.includes('data-article-checklist'));
    assert.ok(content.includes('data-article-social-footer'));
    assert.doesNotMatch(content, /FAQPage|Похожие статьи/);
  }
});

test('Happ backlink and new VPN article links exist in static service and section content', async () => {
  const section = await readFile('dist/proxy-vpn/index.html', 'utf8');
  assert.ok(section.includes(happRoutingGuideLink.label.ru));
  assert.ok(section.includes(vpn4gGuideLink.label.ru));
  for (const offer of OFFERS.filter(offer => offer.subCategory === 'VPN')) {
    const html = await readFile(`dist/proxy-vpn/${offer.slug}/index.html`, 'utf8');
    const expected = getServiceContextualGuideLinks(offer).some(link => link.href === happRoutingGuideLink.href);
    assert.equal(html.includes(happRoutingGuideLink.label.ru), expected, offer.slug);
  }
});
