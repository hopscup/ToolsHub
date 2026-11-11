import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile, stat } from 'node:fs/promises';
import { rfNumbersArticle, createRfNumbersContent } from '../src/data/rfNumbersContent.js';
import { virtualNumberArticle } from '../src/data/virtualNumberContent.js';
import { guidePages } from '../src/data/guidePages.js';
import { guideCatalog } from '../src/data/guideCatalog.js';
import { getExternalLinkRel } from '../src/lib/externalLinks.js';
import { loadOffers } from './load-offers.mjs';

const { OFFERS } = await loadOffers();
const { article, checklist } = createRfNumbersContent(OFFERS);

test('RF numbers metadata and fixed draft dates come from the shared source', () => {
  const page = guidePages.find(page => page.id === article.id);
  assert.equal(page.title.ru, 'Много РФ номеров в 2026: смена номера у операторов | Hopscup');
  assert.equal(page.heading.ru, 'Как сделать много российских номеров в 2026: смена номера у операторов');
  assert.equal(page.description.ru, article.description);
  assert.equal(page.datePublished, '2026-11-11');
  assert.equal(page.dateModified, '2026-11-11');
  assert.ok(article.blocks.filter(block => block.type === 'heading').every(block => article.headingIds[block.text]));
  assert.equal(guideCatalog.find(item => item.id === article.id).route, '/guides/mnogo-rf-nomerov');
  assert.ok(OFFERS.some(offer => offer.id === article.id && offer.category === 'Guides'));
  assert.ok(!/[—–]/.test(JSON.stringify(article)));
  assert.ok(!/\(Ссылки?:|Выноска:|rel sponsored|placement/.test(JSON.stringify(article)));
});

test('RF numbers preserves the operator order, nine numbered steps and both callouts', () => {
  assert.deepEqual(article.blocks.filter(block => block.type === 'heading').map(block => block.text), ['Сколько симок можно иметь', 'Т-Мобайл: самый выгодный вариант', 'Tele2', 'Билайн', 'МегаФон', 'Лимиты и как не потерять номер', 'А что с SMS-активаторами']);
  assert.deepEqual(article.blocks.filter(block => block.type === 'list' && block.ordered).map(block => block.items.length), [3, 3, 3]);
  assert.equal(article.introCallout.warning, true);
  assert.ok(article.introCallout.text.startsWith('Эти способы для своих личных нужд'));
  const callout = article.blocks.find(block => block.type === 'callout');
  assert.equal(callout.warning, false);
  assert.ok(callout.text.startsWith('Раз в 2-3 месяца на каждой симке'));
});

test('RF numbers resolves the three SMS referrals from current OFFERS', () => {
  for (const id of ['sms-fast', 'sms-hero', 'sms-365']) {
    const offer = OFFERS.find(offer => offer.id === id);
    assert.ok(JSON.stringify({ article, checklist }).includes(offer.url));
    assert.match(getExternalLinkRel(offer.url), /sponsored/);
  }
  const changed = OFFERS.map(offer => offer.id === 'sms-365' ? { ...offer, url: 'https://example.test/?ref=new' } : offer);
  assert.ok(JSON.stringify(createRfNumbersContent(changed)).includes('https://example.test/?ref=new'));
  assert.throws(() => createRfNumbersContent(OFFERS.filter(offer => offer.id !== 'sms-hero')), /Missing RF numbers article service: sms-hero/);
});

test('RF numbers checklist retains the source wording without an invented promo note', () => {
  assert.equal(checklist.items.length, 5);
  assert.equal(checklist.sourcesHeading, 'Где брать (для зарубежных сервисов и запасной вариант):');
  assert.deepEqual(checklist.sources[0].links.map(link => link.text), ['SMS-Fast', 'HeroSMS', '365-SMS']);
  assert.deepEqual(checklist.note, []);
  assert.equal(checklist.action.href, '/sms-activators');
});

test('RF numbers video uses a small poster without a separate cover', async () => {
  assert.equal(article.video.id, 'n89_q0BJpa8');
  assert.equal(article.video.caption, 'Видеоверсия этого гайда');
  assert.equal(getExternalLinkRel(article.video.url), 'noopener noreferrer');
  assert.equal(article.cover, undefined);
  for (const image of [article.videoPoster, article.catalogCover]) {
    assert.ok((await stat('public' + image.src)).size < 50_000);
    assert.equal(image.width / image.height, 16 / 9);
  }
  const app = await readFile('src/App.tsx', 'utf8');
  assert.ok(app.includes("'guide-rf-numbers': { topic: 'accounts'"));
  assert.ok(app.includes('return <RfNumbersGuideArticle'));
});

test('the virtual number guide links to RF numbers inside its country section', () => {
  const blocks = virtualNumberArticle.blocks;
  const countries = blocks.findIndex(block => block.type === 'heading' && block.text === 'Какую страну выбирать');
  const mistakes = blocks.findIndex(block => block.type === 'heading' && block.text === 'Три частые ошибки новичков');
  assert.ok(blocks.slice(countries, mistakes).some(block => block.content?.some(part => part.href === '/guides/mnogo-rf-nomerov' && part.text === 'Для российских сервисов вроде Ozon и Мегамаркета нужен номер +7: как сделать много российских номеров, разобрал отдельно')));
  assert.ok(JSON.stringify(article.blocks).includes('/guides/virtualnyj-nomer-dlya-registracii'));
});
