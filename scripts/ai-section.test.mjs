import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import { aiPages, aiSection } from '../src/data/aiPages.js';
import { a6apiArticle, createA6apiContent } from '../src/data/a6apiContent.js';
import { recommendedOfferIds } from '../src/data/recommendedOffers.js';
import { guidePages } from '../src/data/guidePages.js';
import { guideCatalog } from '../src/data/guideCatalog.js';
import { getServiceEditorialSections, splitServiceText } from '../src/data/servicePresentation.js';
import { getExternalLinkRel } from '../src/lib/externalLinks.js';
import { isIndexablePath, getCanonicalPath, getLanguageSwitchPath } from '../src/data/indexPolicy.js';
import { loadOffers } from './load-offers.mjs';

const { OFFERS } = await loadOffers();
const services = OFFERS.filter(offer => offer.category === 'AI');

test('AI tile copy matches approved RU/EN facts without changing editorial text', () => {
  const expected = {
  "ai-syntx": {
    "types": [
      "100+ нейросетей в одном боте: ChatGPT, Claude, Kling, Veo, Suno",
      "100+ AI models in one bot: ChatGPT, Claude, Kling, Veo, Suno"
    ],
    "payment": [
      "Мир, СБП, звёзды Telegram",
      "Mir, SBP, Telegram Stars"
    ],
    "editorialHash": "a90a84712b1ca6576c6c5403b6a560fe20ded36f30b5912fc75ae261be4b1df2"
  },
  "ai-higgsfield": {
    "types": [
      "Хайповые AI-видео: Seedance 2.5 в 4K, 35+ моделей, шаблоны трендов",
      "Viral AI videos: Seedance 2.5 in 4K, 35+ models, trend templates"
    ],
    "payment": [
      "Зарубежная карта, РФ не проходят",
      "Foreign card, Russian cards not accepted"
    ],
    "editorialHash": "6fba9613d3d803e61c123e480077917028d12d103040d0fd1df1f3e6667b47b2"
  },
  "ai-lumean": {
    "types": [
      "Голоса ElevenLabs за копейки, 4200+ голосов, звуковые эффекты",
      "ElevenLabs voices for pennies, 4,200+ voices, sound effects"
    ],
    "payment": [
      "Рубли, крипта",
      "Rubles, crypto"
    ],
    "editorialHash": "b1e869c4d89f83bebd4a7f5cda87c549ca25c9180d1c0b76f4c415f93c14df7d"
  },
  "ai-polza": {
    "types": [
      "400+ моделей по одному API, оплата рублями",
      "400+ models via one API, pay in rubles"
    ],
    "payment": [
      "Карта РФ, СБП, счёт для юрлиц",
      "Russian card, SBP, invoice for companies"
    ],
    "editorialHash": "a59ed8ef48b4a8854ddea00a147948341f61b87047b52c6aa51586d8babe0459"
  },
  "ai-omnirouter": {
    "types": [
      "Claude, GPT и Gemini для Claude Code и Codex без VPN",
      "Claude, GPT and Gemini for Claude Code and Codex without VPN"
    ],
    "payment": [
      "Рубли, крипта",
      "Rubles, crypto"
    ],
    "editorialHash": "c3189765d899ccaa5f3c212aee3b5d50c5a405919d2c88926a27e60eec7320ec"
  },
  "ai-agentrouter": {
    "types": [
      "Бесплатные кредиты на Claude Code через GitHub",
      "Free Claude Code credits via GitHub"
    ],
    "payment": [
      "Бесплатно на старте",
      "Free to start"
    ],
    "editorialHash": "6fe5bf0aab1e74a07300ace4532b1475a57bd548b6c5f200e17f98afce43eef9"
  },
  "ai-a6api": {
    "types": [
      "GPT Image 2 за полцента, Gemini и Grok по API",
      "GPT Image 2 for half a cent, Gemini and Grok via API"
    ],
    "payment": [
      "USDT",
      "USDT"
    ],
    "editorialHash": "c36376288c23718f65ce1f9ed326dc274e3102fd02e1cb9a0ffdf2642a452756"
  },
  "ai-ghostmetal": {
    "types": [
      "GLM и Qwen без логов: чат и API",
      "GLM and Qwen with no logs: chat and API"
    ],
    "payment": [
      "Крипта, зарубежная карта",
      "Crypto, foreign card"
    ],
    "editorialHash": "df7132f09c618947acfc0d1ba70a03248d63216112daa975fb51a766202129f9"
  }
};
  for (const offer of services) {
    const copy = expected[offer.id];
    assert.equal(offer.details.types.ru, copy.types[0]);
    assert.equal(offer.details.paymentMethods.ru, copy.payment[0]);
    for (const language of ['en', 'es', 'zh', 'ko']) {
      assert.equal(offer.details.types[language], copy.types[1]);
      assert.equal(offer.details.paymentMethods[language], copy.payment[1]);
    }
    assert.equal(createHash('sha256').update(JSON.stringify(offer.editorial)).digest('hex'), copy.editorialHash);
  }
});

test('AI catalogue contains eight services in the requested order and three tabs', () => {
  assert.deepEqual(services.map(offer => offer.id), ['ai-syntx', 'ai-higgsfield', 'ai-lumean', 'ai-polza', 'ai-omnirouter', 'ai-ghostmetal', 'ai-agentrouter', 'ai-a6api']);
  assert.deepEqual(services.filter(offer => offer.subCategory === 'AIGeneration').map(offer => offer.id), ['ai-syntx', 'ai-higgsfield']);
  assert.deepEqual(services.filter(offer => offer.subCategory === 'AIVoice').map(offer => offer.id), ['ai-lumean']);
  assert.equal(services.filter(offer => offer.subCategory === 'AICoding').length, 5);
  assert.deepEqual(recommendedOfferIds['/ai'], ['ai-syntx', 'ai-lumean', 'ai-polza']);
});

test('all AI referral formats are sponsored without marking ordinary homepages', () => {
  for (const offer of services) assert.equal(getExternalLinkRel(offer.url), 'sponsored noopener noreferrer', offer.id);
  for (const url of ['https://syntx.ai/', 'https://higgsfield.ai/', 'https://lumean.app/', 'https://omnirouter.ru/', 'https://agentrouter.org/']) assert.equal(getExternalLinkRel(url), 'noopener noreferrer', url);
});

test('AI optional editorial fields have RU/EN content and keep linked author text intact', () => {
  for (const offer of services) {
    for (const language of ['ru', 'en']) {
      const sections = getServiceEditorialSections(offer, language);
      for (const key of ['capabilities', 'pricing', 'gettingStarted']) assert.ok(sections.some(section => section.key === key), `${offer.id}: ${key}`);
      for (const text of [offer.description[language], offer.editorial.verdict[language]]) assert.equal(splitServiceText(text, offer, language).map(part => part.text).join(''), text);
    }
    for (const language of ['es', 'zh', 'ko']) assert.equal(offer.description[language], offer.description.en);
  }
  assert.equal(aiSection.title.ru, 'Нейросети из России: агрегаторы и API | Hopscup');
  assert.equal(aiSection.heading.ru, 'Нейросети из России: агрегаторы, видео, озвучка и API');
  assert.equal(aiSection.blocks.ru.find(block => block.type === 'table').rows.length, 8);
  assert.doesNotMatch(JSON.stringify(aiPages), /\(проверить\)|\(check(?: before paying)?\)|[—–]/);
});

test('AI preview hides introductions and keeps revised Lumean and OmniRouter facts', async () => {
  const app = await readFile('src/App.tsx', 'utf8');
  const tiles = app.slice(app.indexOf('const renderServiceCards'), app.indexOf('  if (isProxyGuideArticle)'));
  assert.equal((tiles.match(/\{offerDescription\(offer\)\}/g) || []).length, 1);
  assert.match(tiles, /\(offer.subCategory === 'AML' \|\| offer.subCategory === 'Wallet'\) && \(/);
  for (const id of ['ai-lumean', 'ai-omnirouter']) {
    const offer = services.find(item => item.id === id);
    assert.equal(offer.details.paymentMethods.ru, 'Рубли, крипта');
    for (const language of ['en', 'es', 'zh', 'ko']) assert.equal(offer.details.paymentMethods[language], 'Rubles, crypto');
    assert.ok(offer.editorial.description.ru.length > 0);
  }
  const lumean = services.find(item => item.id === 'ai-lumean');
  assert.equal(lumean.details.types.ru, 'Голоса ElevenLabs за копейки, 4200+ голосов, звуковые эффекты');
  for (const language of ['en', 'es', 'zh', 'ko']) assert.equal(lumean.details.types[language], 'ElevenLabs voices for pennies, 4,200+ voices, sound effects');
  const rows = aiSection.blocks.ru.find(block => block.type === 'table').rows;
  const rowFor = name => rows.find(row => row[0].map(part => part.text).join('') === name);
  assert.equal(rowFor('Lumean')[1][0].text, 'Речь и звуковые эффекты, чат, картинки');
  for (const name of ['Lumean', 'OmniRouter']) assert.equal(rowFor(name)[2][0].text, 'Рубли, крипта');
});

test('Syntx intro uses the author website-or-Telegram wording and retains the Higgsfield link', () => {
  const offer = services.find(item => item.id === 'ai-syntx');
  const text = 'Syntx, наверное, самая удобная замена Higgsfield для россиян. Сайт или Telegram-бот, оплата рублями, а внутри больше 100 нейросетей: от ChatGPT и Claude до Kling, Veo и Suno. VPN не нужен.';
  assert.equal(offer.editorial.description.ru, text);
  const parts = splitServiceText(text, offer, 'ru');
  assert.equal(parts.map(part => part.text).join(''), text);
  assert.ok(parts.some(part => part.text === 'Higgsfield' && part.href === '/ai/higgsfield'));
});

test('AI WebP logos remain light and each has its supplied PNG fallback', async () => {
  for (const offer of services) {
    assert.equal(offer.logoUrl, `/${offer.id}.webp`);
    assert.equal(offer.logoFallback, `/${offer.id}.png`);
    assert.ok((await stat(new URL(`../public${offer.logoUrl}`, import.meta.url))).size <= 20_000);
    assert.ok((await stat(new URL(`../public${offer.logoFallback}`, import.meta.url))).size > 0);
  }
});

test('AI RU routes are indexed while all translated copies remain noindex', () => {
  for (const route of ['/ai', ...aiPages.map(page => `/ai/${page.slug}`), '/guides/' + a6apiArticle.slug]) {
    assert.equal(isIndexablePath(route), true, route);
    for (const language of ['en', 'es', 'zh', 'ko']) assert.equal(isIndexablePath('/' + language + route), false);
  }
  assert.equal(getCanonicalPath('/en/guides/' + a6apiArticle.slug), '/guides/' + a6apiArticle.slug);
  assert.equal(getCanonicalPath('/en/ai'), '/en/ai');
  assert.equal(getCanonicalPath('/es/ai/syntx'), '/en/ai/syntx');
  assert.equal(getLanguageSwitchPath('/ai/syntx', 'en'), '/en/ai/syntx');
});

test('A6API guide uses live referrals, fixed draft dates, complete prompt and checklist', () => {
  const { article, checklist } = createA6apiContent(OFFERS);
  assert.equal(article.datePublished, '2026-11-13');
  assert.equal(article.dateModified, '2026-11-13');
  assert.equal(article.video.id, 'YWORLiJtg2c');
  assert.equal(article.video.caption, 'Видеоверсия этого гайда');
  assert.equal(article.blocks.filter(block => block.type === 'code').length, 1);
  const code = article.blocks.find(block => block.type === 'code').text;
  assert.equal(createHash('sha256').update(code).digest('hex'), '0798800d6d801a6a6c35e124e7124cc8a10abf6f6d09b6eef22e9e1cdd605c03');
  assert.equal(checklist.items.length, 5);
  assert.equal(checklist.sources[0].links[0].href, services.find(offer => offer.id === 'ai-a6api').url);
  assert.equal(checklist.sources[2].links[0].href, services.find(offer => offer.id === 'ai-syntx').url);
  assert.equal(checklist.action.href, '/ai');
  assert.ok(guidePages.some(page => page.id === article.id));
  assert.ok(guideCatalog.some(page => page.route === '/guides/' + article.slug));
  assert.equal(guideCatalog.find(page => page.id === article.id).cover.src, '/article/a6api/preview.webp');
  assert.equal(article.cover, undefined);
});

test('AI catalogue topic includes the new guide and three moved guides', async () => {
  const app = await readFile('src/App.tsx', 'utf8');
  const {guideCardMeta} = await import('../src/data/guideCatalog.js');
  for (const id of ['guide-a6api', 'guide-ai-subscriptions', 'guide-claude-recovery', 'guide-claude-russia']) assert.equal(guideCardMeta[id].topic, 'ai');
  assert.ok(app.includes("{ id: 'ai', label: l(GUIDE_TOPIC_LABELS.ai) }"));
  for (const [filter, icon] of [['AIGeneration', 'Sparkles'], ['AIVoice', 'AudioLines'], ['AICoding', 'Code']]) {
    assert.ok(app.includes(`filter === '${filter}' && <${icon} aria-hidden="true"`));
  }
  assert.ok(app.indexOf("id: 'AI', icon: Sparkles") > app.indexOf("id: 'Stores',"));
  assert.ok(app.indexOf("id: 'AI', icon: Sparkles") < app.indexOf("id: 'Cards', icon: CreditCard"));
});
