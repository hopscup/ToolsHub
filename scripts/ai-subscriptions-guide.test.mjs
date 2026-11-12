import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, stat } from 'node:fs/promises';
import { aiSubscriptionsArticle, createAiSubscriptionsContent } from '../src/data/aiSubscriptionsContent.js';
import { guidePages } from '../src/data/guidePages.js';
import { guideCatalog } from '../src/data/guideCatalog.js';
import { seoLandingPages } from '../src/data/seoLandingPages.js';
import { getExternalLinkRel } from '../src/lib/externalLinks.js';
import { loadOffers } from './load-offers.mjs';

const { OFFERS } = await loadOffers();
const { article, checklist } = createAiSubscriptionsContent(OFFERS);

test('Plati uses the affiliate homepage in OFFERS and every localized store link', async () => {
  const url = 'https://plati.market/?ai=1422112';
  assert.equal(OFFERS.find(offer => offer.id === 'st-plati').url, url);
  assert.equal(getExternalLinkRel(url), 'sponsored noopener noreferrer');
  const app = await readFile('src/App.tsx', 'utf8');
  assert.ok(!app.includes('plati.market/games/'));
  const links = [...app.matchAll(/<a href="https:\/\/plati\.market\/\?ai=1422112"[^>]*>/g)];
  assert.equal(links.length, 5);
  assert.ok(links.every(([tag]) => tag.includes('rel="sponsored noopener noreferrer"')));
});

test('AI subscription guide metadata and fixed draft dates use the shared source', () => {
  const page = guidePages.find(page => page.id === article.id);
  assert.equal(page.title.ru, 'Дешёвые подписки ChatGPT, Claude и Gemini | Hopscup');
  assert.equal(page.heading.ru, 'Где купить подписку ChatGPT, Claude и Gemini дешевле: Telegram-магазины');
  assert.equal(page.description.ru, article.description);
  assert.equal(page.datePublished, '2026-11-12');
  assert.equal(page.dateModified, '2026-11-12');
  assert.ok(article.blocks.filter(block => block.type === 'heading').every(block => article.headingIds[block.text]));
  assert.equal(Object.keys(article.headingIds).length, 7);
  assert.ok(!/[—–]|\(Ссылки?:|ССЫЛКА НА РОЛИК|Выноска \(warning\):/.test(JSON.stringify(article)));
});

test('AI subscription links resolve by OFFERS id and FunPay remains unsponsored', () => {
  for (const id of ['bot-lachuga', 'bot-crassus', 'bot-apel0sin', 'bot-petrovich', 'st-plati']) {
    const offer = OFFERS.find(offer => offer.id === id);
    assert.ok(JSON.stringify(article.blocks).includes(offer.url));
    assert.match(getExternalLinkRel(offer.url), /sponsored/);
  }
  const funpay = OFFERS.find(offer => offer.id === 'st-funpay');
  assert.ok(JSON.stringify({ article, checklist }).includes(funpay.url));
  assert.equal(getExternalLinkRel(funpay.url), 'noopener noreferrer');
  const changed = OFFERS.map(offer => offer.id === 'bot-crassus' ? { ...offer, url: 'https://example.test/?ref=updated' } : offer);
  assert.ok(JSON.stringify(createAiSubscriptionsContent(changed)).includes('https://example.test/?ref=updated'));
  assert.throws(() => createAiSubscriptionsContent(OFFERS.filter(offer => offer.id !== 'bot-lachuga')), /Missing AI subscriptions article service: bot-lachuga/);
});

test('AI subscription guide preserves its warning and store section order', () => {
  assert.equal(article.introCallout.warning, true);
  assert.ok(article.introCallout.text.startsWith('Этот способ для тех, кто хочет сэкономить, но скупой платит дважды.'));
  assert.deepEqual(article.blocks.filter(block => block.type === 'heading').map(block => block.text), ['Как это работает', 'Лачуга', 'Crassus', 'Апельсин', 'Петрович', 'Если не нравятся боты', 'Когда лучше платить самому']);
  assert.equal(article.blocks.filter(block => block.type === 'list').length, 0);
  assert.ok(JSON.stringify(article.blocks).includes('/foreign-cards/zarub'));
});

test('AI subscription checklist keeps source order and does not invent a promo note', () => {
  assert.equal(checklist.items.length, 5);
  assert.deepEqual(checklist.sources.map(source => source.links.map(link => link.text)), [['Лачуга', 'Crassus', 'Апельсин'], ['FunPay', 'Plati.Market'], ['Zarub', 'PGON']]);
  assert.deepEqual(checklist.sources[2].links.map(link => link.href), ['/foreign-cards/zarub', '/foreign-cards/pgon']);
  assert.deepEqual(checklist.note, []);
  assert.equal(checklist.action.href, '/account-shop/podpiski-neyrosetey');
});

test('AI subscription video uses the supplied clip and small poster, not a cover', async () => {
  assert.equal(article.video.id, 'R3auFZxXIDM');
  assert.equal(article.video.caption, 'Видеоверсия этого гайда');
  assert.equal(getExternalLinkRel(article.video.url), 'noopener noreferrer');
  assert.equal(article.cover, undefined);
  for (const image of [article.videoPoster, article.catalogCover]) {
    assert.ok((await stat('public' + image.src)).size < 50_000);
    assert.equal(image.width / image.height, 16 / 9);
  }
});

test('AI subscription guide is in Accounts and linked from the subscription landing page', async () => {
  assert.equal(guideCatalog.find(item => item.id === article.id).route, '/guides/deshevye-podpiski-chatgpt-claude-gemini');
  assert.ok(OFFERS.some(offer => offer.id === article.id && offer.category === 'Guides'));
  const app = await readFile('src/App.tsx', 'utf8');
  assert.ok(app.includes("'guide-ai-subscriptions': { topic: 'accounts'"));
  assert.ok(app.includes('return <AiSubscriptionsGuideArticle'));
  assert.deepEqual(seoLandingPages.find(page => page.id === 'ai-subscriptions').guideLink, {
    href: '/guides/deshevye-podpiski-chatgpt-claude-gemini',
    label: {
      ru: 'Где дешевле всего и какие риски, разобрал по шагам в гайде',
      en: 'I explain where subscriptions cost less and the risks step by step in the guide',
    },
  });
});
