import test from 'node:test';
import assert from 'node:assert/strict';
import { fieldExpectations, linkExpectations, checkServiceSnapshot, checkExternalLinkParity, containsValue, extractNoscript, normalizeUrl, selectAuthorIntroduction } from './content-regression-inventory.mjs';

const offer = {
  url: 'https://example.com/?ref=hopscup', webUrl: 'https://example.org/?partner_id=1', promoCode: 'SAVE20',
  description: { ru: 'Первый авторский абзац.\n\nВторой абзац.', en: 'First author paragraph.\n\nSecond.' },
  details: { geo: { ru: '20+ стран', en: '20+ countries' }, supports: { ru: ['IPv4', 'UDP'], en: ['IPv4', 'UDP'] }, futureField: { ru: 'Неизвестное рендеру поле', en: 'New field' } },
  cardStats: { commission: { ru: '3-5%', en: '3-5%' }, futureStat: { ru: 'Новая характеристика', en: 'New stat' } },
  editorial: { description: { ru: 'Первый авторский абзац.\n\nВторой абзац.', en: 'First author paragraph.\n\nSecond.' } },
};
const expected = { fields: fieldExpectations(offer, 'ru'), links: linkExpectations(offer) };
const valid = () => ({ text: expected.fields.map(item => item.value).join(' | '), facts: expected.fields.filter(item => item.rowKey).map(item => ({ key: item.rowKey, value: item.value })), paragraphs: ['Первый авторский абзац.'], links: expected.links.map(item => ({ href: item.href, rel: 'sponsored noopener noreferrer' })) });

test('inventory includes every details/cardStats leaf, unknown future fields and first paragraph', () => {
  assert.deepEqual(expected.fields.map(item => item.field), ['details.geo', 'details.supports[0]', 'details.supports[1]', 'details.futureField', 'cardStats.commission', 'cardStats.futureStat', 'promoCode', 'author.firstParagraph']);
  assert.deepEqual(checkServiceSnapshot(expected, valid()), []);
});

test('removing ANY expected value fails, without renderer-dependent field exclusions', () => {
  for (const item of expected.fields) {
    const snapshot = valid();
    snapshot.text = snapshot.text.replace(item.value, 'REMOVED');
    snapshot.facts = snapshot.facts.filter(row => row.key !== item.rowKey);
    if (item.paragraph) snapshot.paragraphs = [];
    assert.ok(checkServiceSnapshot(expected, snapshot).some(defect => defect.field === item.field), item.field);
  }
});

test('main URL, webUrl and sponsored on every matching affiliate anchor are mandatory', () => {
  for (const item of expected.links) {
    const snapshot = valid();
    snapshot.links = snapshot.links.filter(link => link.href !== item.href);
    assert.ok(checkServiceSnapshot(expected, snapshot).some(defect => defect.kind === 'missing-link' && defect.field === item.field));
  }
  const snapshot = valid();
  snapshot.links.push({ href: offer.url, rel: 'noopener' });
  assert.ok(checkServiceSnapshot(expected, snapshot).some(defect => defect.kind === 'missing-sponsored'));
});

test('GitHub and FunPay remain ordinary links; real referrals require sponsored', () => {
  for (const url of ['https://github.com/ProxyShard/ShardBrowser', 'https://funpay.com/']) {
    const links = linkExpectations({ url });
    assert.equal(links[0].sponsored, false);
    assert.deepEqual(checkServiceSnapshot({ fields: [], links }, { text: '', paragraphs: [], links: [{ href: url, rel: 'noopener noreferrer' }] }), []);
    assert.equal(checkServiceSnapshot({ fields: [], links }, { text: '', paragraphs: [], links: [] })[0].kind, 'missing-link');
    assert.equal(checkServiceSnapshot({ fields: [], links }, { text: '', paragraphs: [], links: [{ href: url, rel: 'sponsored' }] })[0].kind, 'unexpected-sponsored');
  }
  for (const url of ['https://t.me/AhlisShop_bot?start=467483565', 'https://ls.app/?promo=hopscup', 'https://shardx.com/?ref=hopscup']) assert.equal(linkExpectations({ url })[0].sponsored, true, url);
});

test('external parity preserves referral query and hash, including links with no sponsored', () => {
  const links = [{ href: 'https://github.com/a/b#readme' }, { href: 'https://example.com/?ref=one&x=2' }, { href: '/guides' }];
  assert.deepEqual(checkExternalLinkParity({ links }, { links }), []);
  assert.equal(checkExternalLinkParity({ links }, { links: [{ href: 'https://github.com/a/b' }, { href: 'https://example.com/?ref=two&x=2' }] }).length, 2);
  assert.equal(normalizeUrl('https://EXAMPLE.com'), 'https://example.com/');
});

test('whitespace normalization does not turn 20% into 0%, or accept rewritten copy', () => {
  assert.equal(containsValue('20%', '0%'), false);
  assert.equal(containsValue('Цена: 199 ₽', '99 ₽'), false);
  assert.equal(containsValue('3.5%', '5%'), false);
  assert.equal(containsValue('Две\u00a0строки\nтекста', 'Две строки текста'), true);
  assert.equal(containsValue('3 - 5%', '3-5%'), false);
  assert.equal(containsValue('Карта РФ и крипта', 'Карта, крипта'), false);
});

test('a duplicate value elsewhere cannot hide a missing cardStats row', () => {
  const snapshot = valid();
  snapshot.facts = snapshot.facts.filter(row => row.key !== 'commission');
  assert.ok(snapshot.text.includes('3-5%'));
  assert.ok(checkServiceSnapshot(expected, snapshot).some(item => item.field === 'cardStats.commission'));
});

test('copy in another paragraph cannot hide a missing author-introduction block', () => {
  const snapshot = { ...valid(), authorParagraphs: [] };
  assert.ok(snapshot.paragraphs.length);
  assert.ok(checkServiceSnapshot(expected, snapshot).some(item => item.field === 'author.firstParagraph'));
});

test('author source follows partner introduction or service description, not unused editorial metadata', () => {
  const sample = { ...offer, id: 'future-service', editorial: { description: { ru: 'SEO description only' } } };
  assert.equal(selectAuthorIntroduction(sample, 'ru').source, 'offer.description');
  assert.equal(fieldExpectations(sample, 'ru').find(item => item.field === 'author.firstParagraph').value, 'Первый авторский абзац.');
  const partner = { ...offer, id: 'p3' };
  assert.equal(selectAuthorIntroduction(partner, 'ru').source, 'getPartnerIntroduction');
});

test('UI own description wins for adapted shops, but other categories can select manual translations', () => {
  const adapted = { ...offer, id: 'adapted-shop', category: 'Stores', description: { es: 'Uso esta tienda cada semana.' } };
  const translations = { 'adapted-shop': { es: 'Old generic store caption' } };
  assert.equal(selectAuthorIntroduction(adapted, 'es', { translations }).text, 'Uso esta tienda cada semana.');
  assert.equal(selectAuthorIntroduction({ ...adapted, category: 'Proxy' }, 'es', { translations }).text, 'Old generic store caption');
});

test('static-only dash normalization is explicit and does not discard details or stats', () => {
  const sample = { ...offer, details: { price: { ru: '2\u20135%', en: '2\u20135%' } } };
  const stat = fieldExpectations(sample, 'ru', undefined, { staticCopy: true }).find(item => item.field === 'details.price');
  assert.equal(stat.value, '2-5%');
  assert.equal(stat.sourceValue, '2\u20135%');
  assert.equal(stat.transformation, 'plainSeoText');
  assert.equal(fieldExpectations(sample, 'ru').find(item => item.field === 'details.price').value, '2\u20135%');
  assert.ok(checkServiceSnapshot({ fields: [stat], links: [] }, { text: '', paragraphs: [], facts: [], links: [] }).length);
});

test('noscript extraction is isolated from React scripts and handles multiple blocks', () => {
  assert.equal(extractNoscript('<script>fake</script><noscript><p>A</p></noscript><noscript><p>B</p></noscript>'), '<p>A</p>\n<p>B</p>');
});
