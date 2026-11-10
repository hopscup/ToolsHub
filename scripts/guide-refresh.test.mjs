import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { access, readFile, stat } from 'node:fs/promises';
import { articleFallbackContent } from '../src/data/articleFallbackContent.js';
import { foreignCardArticle } from '../src/data/foreignCardArticle.js';
import { discordTokenArticle } from '../src/data/discordTokenArticle.js';
import { createGuideRefreshContent, guideRefreshCovers, guideRefreshMeta, exchangeRegistrationServices } from '../src/data/guideRefreshContent.js';
import { guidePages } from '../src/data/guidePages.js';
import { guideCatalogById } from '../src/data/guideCatalog.js';
import { loadOffers } from './load-offers.mjs';

const { OFFERS } = await loadOffers();
const content = createGuideRefreshContent(OFFERS);
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

test('four-guide refresh preserves the approved Discord, card and Gmail instructions', () => {
  assert.equal(hash(discordTokenArticle.blocks), '9bafc489a31880a14032febd6b46c9b412522f614566eb93e0f012a48823a402');
  assert.equal(hash(foreignCardArticle), '8c617e3ac19bc5c54a9f54d0c7c645541ccc6c3ba4cb9fefe59b25c64a6b4cd3');
  const gmail = articleFallbackContent.gmail;
  assert.equal(hash([gmail.before, gmail.sections, gmail.result]), 'ea5117e5d34e975e6cb644068b8bb2e9205083e6a61a66b8c4f8830802234d30');
  assert.deepEqual(content['guide-discord-token'].blocks.slice(0, -1), discordTokenArticle.blocks);
  const cardBlocks = foreignCardArticle.flatMap(section => [section.heading, ...section.paragraphs, ...(section.links || []).map(link => link.label)]);
  assert.deepEqual(content['guide-foreign-cards'].blocks.slice(0, cardBlocks.length).map(block => block.text || block.content.map(part => part.text).join('')), cardBlocks);
});

test('new article service links follow OFFERS, while existing exchange registrations stay intact', () => {
  const paragraphs = Object.values(content).flatMap(article => article.blocks).filter(block => block.type === 'paragraph');
  for (const id of ['st-dark', 'st1', 'st-funpay', 'pgon', 'vezdekarta', 'zarub']) assert.ok(paragraphs.some(block => block.content.some(part => part.href === OFFERS.find(offer => offer.id === id).url)));
  const cards = content['guide-foreign-cards'];
  const firstMention = cards.blocks.find(block => block.content?.some(part => part.text === 'PGON'));
  assert.deepEqual(firstMention.content.filter(part => part.href).map(part => part.text), ['PGON', 'ВездеКарту', 'Zarub']);
  assert.deepEqual(exchangeRegistrationServices.map(service => service.url).sort(), ['https://okx.com/join/8471428', 'https://www.bgportable.com/ru/referral/register?clacCode=87T3C50T&from=%252Fru%252Fevents%252Freferral-all-program&source=events&utmSource=PremierInviter'].sort());
});

test('OKX precedes Bitget with one warning and sixteen captioned screenshots', async () => {
  const article = content['guide-uids-addresses'];
  assert.equal(article.title, 'Субаккаунты, UID и адреса на OKX и Bitget');
  assert.deepEqual(article.blocks.filter(block => block.type === 'heading').map(block => block.text), ['OKX', 'Bitget']);
  const bitget = article.blocks.findIndex(block => block.type === 'heading' && block.text === 'Bitget');
  assert.equal(article.blocks[bitget + 1].warning, true);
  const images = article.blocks.filter(block => block.type === 'image');
  assert.equal(images.length, 16);
  assert.ok(images.every(image => image.alt && image.caption && !image.src.includes('image-17')));
  for (const image of images) await access('public' + image.src);
  assert.ok(!JSON.stringify(article.blocks).includes('перейдем к ОКХ'));
  const originalSteps = article.blocks.filter(block => block.type === 'paragraph')
    .map(block => block.content.map(part => part.text).join(''))
    .filter(text => !text.startsWith('Регаемся на OKX') && !text.startsWith('На этом'))
    .sort();
  assert.equal(hash(originalSteps), '281e429d1ae82cbcafa25444b94e2edb97cedaec593684906a7e9af10d0c5414');
});

test('four guides use fixed Git-based publication dates and the requested titles', () => {
  for (const [id, meta] of Object.entries(guideRefreshMeta)) {
    const page = guidePages.find(page => page.id === id);
    assert.equal(page.datePublished, meta.datePublished);
    assert.equal(page.dateModified, '2026-11-10');
  }
  assert.equal(guidePages.find(page => page.id === 'guide-discord-token').title.ru, 'Как войти в Discord по токену: расширение и F12 | Hopscup');
  assert.equal(guidePages.find(page => page.id === 'guide-uids-addresses').title.ru, 'Много UID и адресов на OKX: субаккаунты | Hopscup');
  for (const article of Object.values(content)) assert.ok(!/[—–]/.test(JSON.stringify(article.blocks)));
});

test('account farm catalogue cover is separate from the original article cover and mobile comparison is visible', () => {
  const farm = guidePages.find(page => page.id === 'guide-account-farm');
  assert.equal(farm.cover.src, '/article/account-farm/image-01.jpeg');
  assert.equal(guideCatalogById['guide-account-farm'].cover.src, '/article/account-farm/catalog-preview.webp');
  const mobile = OFFERS.find(offer => offer.id === 'guide-best-mobile-proxies');
  assert.ok(mobile);
  assert.equal(mobile.category, 'Guides');
  assert.equal(guideCatalogById[mobile.id].route, '/proxy-vpn/luchshie-mobilnye-proksi');
});

test('four supplied covers use lightweight WebP variants shared by catalogue and article', async () => {
  for (const [id, cover] of Object.entries(guideRefreshCovers)) {
    assert.equal(guidePages.find(page => page.id === id).cover, cover);
    assert.equal(guideCatalogById[id].cover, cover);
    assert.equal(content[id].cover, cover);
    assert.equal(cover.width, 1280);
    assert.ok(cover.alt);
    for (const [src, budget] of [[cover.src, 150_000], [cover.previewSrc, 60_000]]) {
      const file = 'public' + src;
      assert.ok((await stat(file)).size < budget);
      const bytes = await readFile(file);
      assert.equal(bytes.subarray(0, 4).toString(), 'RIFF');
      assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
    }
  }
});
