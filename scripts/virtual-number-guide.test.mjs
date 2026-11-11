import assert from 'node:assert/strict';
import test from 'node:test';
import { stat, readFile } from 'node:fs/promises';
import { virtualNumberArticle, createVirtualNumberContent } from '../src/data/virtualNumberContent.js';
import { guidePages } from '../src/data/guidePages.js';
import { guideCatalog } from '../src/data/guideCatalog.js';
import { seoLandingPages } from '../src/data/seoLandingPages.js';
import { getExternalLinkRel } from '../src/lib/externalLinks.js';
import { loadOffers } from './load-offers.mjs';

const { OFFERS } = await loadOffers();
const { article, checklist } = createVirtualNumberContent(OFFERS);

test('virtual number guide metadata, dates and catalogue use the shared source', () => {
  const page = guidePages.find(page => page.id === article.id);
  assert.equal(page.title.ru, 'Виртуальный номер для ChatGPT, Claude и Discord | Hopscup');
  assert.equal(page.heading.ru, 'Где купить виртуальный номер для ChatGPT, Claude, Google и Discord');
  assert.equal(page.description.ru, article.description);
  assert.equal(page.datePublished, '2026-11-11');
  assert.equal(page.dateModified, '2026-11-11');
  assert.equal(guideCatalog.find(item => item.id === article.id).route, '/guides/virtualnyj-nomer-dlya-registracii');
  assert.ok(OFFERS.some(offer => offer.id === article.id && offer.category === 'Guides'));
  assert.ok(article.blocks.filter(block => block.type === 'heading').every(block => article.headingIds[block.text]));
  assert.ok(!/[—–]/.test(JSON.stringify(article)));
  assert.ok(!/\(Ссылки?:|rel sponsored|placement/.test(JSON.stringify(article)));
});

test('virtual number referrals follow OFFERS including external service headings', () => {
  for (const id of ['sms-hero', 'sms-fast', 'sms-numera', 'p3', 'p4', 'p1']) {
    const offer = OFFERS.find(offer => offer.id === id);
    assert.ok(JSON.stringify({ article, checklist }).includes(offer.url));
    assert.match(getExternalLinkRel(offer.url), /sponsored/);
  }
  assert.equal(article.blocks.find(block => block.type === 'heading' && block.text === 'HeroSMS').href, OFFERS.find(offer => offer.id === 'sms-hero').url);
  const changedOffers = OFFERS.map(offer => offer.id === 'sms-fast' ? { ...offer, url: 'https://example.test/?ref=updated' } : offer);
  const changed = JSON.stringify(createVirtualNumberContent(changedOffers));
  assert.ok(changed.includes('https://example.test/?ref=updated'));
  assert.ok(!changed.includes(OFFERS.find(offer => offer.id === 'sms-fast').url));
  assert.throws(() => createVirtualNumberContent(OFFERS.filter(offer => offer.id !== 'sms-hero')), /Missing virtual number article service: sms-hero/);
});

test('virtual number guide retains numbered steps, bold country labels and checklist order', () => {
  assert.deepEqual(article.blocks.filter(block => block.type === 'list' && block.ordered).map(block => block.items.length), [4, 3, 3]);
  const countries = article.blocks.find(block => block.type === 'list' && !block.ordered);
  assert.deepEqual(countries.items.map(item => item[0]), [{ text: 'Claude:', strong: true }, { text: 'ChatGPT и Codex:', strong: true }, { text: 'Discord:', strong: true }]);
  assert.equal(checklist.items.length, 5);
  assert.deepEqual(checklist.sources.map(source => source.links.map(link => link.text)), [['SMS-Fast', 'HeroSMS', 'NumeraSMS'], ['ProxyWing', 'Proxy-Seller', 'ProxyShard']]);
  assert.equal(checklist.note.map(part => part.text).join(''), 'Промокод hopscup на прокси почти везде.');
  assert.equal(checklist.action.href, '/sms-activators');
  assert.equal(article.introParagraphs[0].find(part => part.href)?.href, '/sms-activators');
});

test('virtual number video reuses ArticleVideo without a standalone cover', async () => {
  assert.equal(article.video.id, 'OUrn5HA4kM8');
  assert.equal(article.video.caption, 'Видеоверсия этого гайда');
  assert.equal(getExternalLinkRel(article.video.url), 'noopener noreferrer');
  assert.equal(article.cover, undefined);
  for (const image of [article.videoPoster, article.catalogCover]) {
    assert.ok((await stat('public' + image.src)).size < 50_000);
    assert.equal(image.width / image.height, 16 / 9);
  }
  const app = await readFile('src/App.tsx', 'utf8');
  assert.ok(app.includes("'guide-virtual-number': { topic: 'accounts'"));
  assert.ok(app.includes('return <VirtualNumberGuideArticle'));
});

test('virtual number landing page shares its article link between React and static rendering', () => {
  assert.deepEqual(seoLandingPages.find(page => page.id === 'virtual-numbers').guideLink, {
    href: '/guides/virtualnyj-nomer-dlya-registracii',
    label: {
      ru: 'Как купить номер и не потерять деньги, разобрал по шагам в гайде',
      en: 'I explain how to buy a number without losing money step by step in the guide',
    },
  });
});
