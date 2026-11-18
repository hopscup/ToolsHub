import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile, readdir, stat} from 'node:fs/promises';
import {happRoutingArticle, createHappRoutingContent} from '../src/data/happRoutingContent.js';
import {guidePages} from '../src/data/guidePages.js';
import {guideCatalog} from '../src/data/guideCatalog.js';
import {isIndexablePath, getCanonicalPath, indexablePaths} from '../src/data/indexPolicy.js';
import {getExternalLinkRel} from '../src/lib/externalLinks.js';
import {loadOffers} from './load-offers.mjs';

const {OFFERS} = await loadOffers();
const {article, checklist} = createHappRoutingContent(OFFERS);
const route = '/guides/happ-marshrutizaciya';

test('Happ guide shares exact metadata, fixed draft dates and catalogue registration', async () => {
  const page = guidePages.find(page => page.id === article.id);
  assert.equal(page.title.ru, 'Маршрутизация в Happ: банки работают с VPN | Hopscup');
  assert.equal(page.heading.ru, 'Как настроить маршрутизацию в Happ, чтобы российские сайты работали с включённым VPN');
  assert.equal(page.description.ru, article.description);
  assert.equal(page.datePublished, '2026-11-18');
  assert.equal(page.dateModified, '2026-11-18');
  assert.equal(guideCatalog.find(guide => guide.id === article.id).route, route);
  assert.equal(OFFERS.find(offer => offer.id === article.id).category, 'Guides');
  const app = await readFile('src/App.tsx', 'utf8');
  assert.ok(app.includes("'guide-happ-routing': { topic: 'proxy'"));
  assert.ok(app.includes('return <HappRoutingGuideArticle'));
  assert.equal(article.video, undefined);
  assert.deepEqual(page.cover, article.cover);
  assert.equal(article.cover.src, '/article/happ-routing/cover.webp');
  assert.equal(article.cover.width, 1280);
  assert.equal(article.cover.height, 721);
  assert.ok((await stat('public' + article.cover.src)).size < 100000);
  assert.deepEqual(page.catalogCover, article.catalogCover);
  assert.deepEqual(guideCatalog.find(guide => guide.id === article.id).cover, article.catalogCover);
  assert.equal(article.catalogCover.src, '/article/happ-routing/preview.webp');
  assert.equal(article.catalogCover.width, 640);
  assert.equal(article.catalogCover.height, 361);
  assert.ok((await stat('public' + article.catalogCover.src)).size < 50000);
  assert.doesNotMatch(JSON.stringify(happRoutingArticle), /—|\[скрин|Выноска:|\(Ссылка:/);
});

test('Happ guide preserves six steps, continued numbering, two callouts and five checklist items', () => {
  assert.equal(article.blocks.filter(block => block.type === 'heading').length, 7);
  assert.ok(article.blocks.filter(block => block.type === 'heading').every(block => article.headingIds[block.text]));
  assert.equal(article.introParagraphs.length, 2);
  assert.ok(article.introCallout.text.startsWith('Часть VPN-сервисов уже присылает'));
  assert.ok(article.blocks.find(block => block.type === 'callout').text.endsWith('например ozon.ru.'));
  const starts = article.blocks.filter(block => block.type === 'list' && block.ordered).map(block => block.start || 1);
  assert.deepEqual(starts, [1, 1, 2, 3, 4, 1, 2, 3, 4, 5]);
  assert.equal(checklist.items.length, 5);
  assert.equal(checklist.sources[1].separator, ' + ');
  assert.equal(checklist.action.label, 'Все VPN на сайте');
  assert.equal(checklist.action.href, '/proxy-vpn');
  assert.deepEqual(checklist.note, [{text: 'Промокод hopscup на прокси почти везде.'}]);
});

test('Happ uses the thirteen original portrait screenshots without the Ozon result', async () => {
  const images = article.blocks.filter(block => block.type === 'image');
  assert.equal(images.length, 13);
  assert.equal((await readdir('public/article/happ-routing')).filter(file => /^happ-\d+/.test(file)).length, 13);
  for (const [index, image] of images.entries()) {
    assert.ok(image.src.includes(`happ-${String(index + 1).padStart(2, '0')}-`));
    assert.ok(image.alt.length > 25);
    assert.equal(image.maxWidth, 360);
    assert.equal(image.width, 800);
    assert.equal(image.height, 1440);
    assert.ok((await stat('public' + image.src)).size < 50000);
  }
  assert.doesNotMatch(JSON.stringify(article), /happ-14|rezultat\.webp|codex-clipboard/);
});

test('Happ VPN summary referrals resolve from OFFERS and remain sponsored', async () => {
  assert.deepEqual(checklist.sources[0].links.map(link => link.text), ['PPL VPN', 'iMP VPN', 'ALL VPN']);
  for (const [index, id] of ['vpn-ppl', 'vpn-imp', 'vpn-all'].entries()) {
    const offer = OFFERS.find(offer => offer.id === id);
    assert.equal(checklist.sources[0].links[index].href, offer.url);
    assert.match(getExternalLinkRel(offer.url), /sponsored/);
  }
  const changed = OFFERS.map(offer => offer.id === 'vpn-ppl' ? {...offer, url: 'https://example.test/?ref=new'} : offer);
  assert.equal(createHappRoutingContent(changed).checklist.sources[0].links[0].href, 'https://example.test/?ref=new');
  const wrapper = await readFile('src/components/HappRoutingGuideArticle.tsx', 'utf8');
  assert.ok(wrapper.includes('trackArticleService(offers, href, placement)'));
  assert.ok(wrapper.includes('related={[]}'));
});

test('Happ full static article is indexed only in RU with correct images, links and list starts', async () => {
  assert.equal(indexablePaths.length, 92);
  assert.equal(isIndexablePath(route), true);
  const sitemap = (await Promise.all(['money', 'core', 'services'].map(name => readFile(`dist/sitemap-${name}.xml`, 'utf8')))).join('');
  assert.ok(sitemap.includes(`<loc>https://hopscup.tools${route}</loc>`));
  for (const prefix of ['', '/en', '/es', '/zh', '/ko']) {
    assert.equal(isIndexablePath(prefix + route), !prefix);
    assert.equal(getCanonicalPath(prefix + route), route);
    assert.ok(!prefix || !sitemap.includes(prefix + route));
    const html = await readFile(`dist${prefix}${route}/index.html`, 'utf8');
    const content = html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1];
    assert.ok(content.includes(`src="${article.cover.src}"`));
    assert.ok(html.includes(`property="og:image" content="https://hopscup.tools${article.cover.src}"`));
    assert.ok(html.includes(`rel="canonical" href="https://hopscup.tools${route}"`));
    assert.ok(html.includes(`name="robots" content="${prefix ? 'noindex' : 'index'}, follow`));
    assert.equal((content.match(/max-width:360px/g) || []).length, 13);
    assert.ok(content.includes('<ol start="5">'));
    for (const link of checklist.sources[0].links) assert.ok(content.includes(`href="${link.href}" rel="sponsored noopener noreferrer"`));
    assert.ok(content.includes('data-article-checklist'));
    assert.ok(content.includes('data-article-social-footer'));
    assert.doesNotMatch(content, /happ-14|iframe|data-article-video|FAQPage|Похожие статьи/);
  }
});
