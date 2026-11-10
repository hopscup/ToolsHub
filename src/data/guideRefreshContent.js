import { articleFallbackContent } from './articleFallbackContent.js';
import { discordTokenArticle } from './discordTokenArticle.js';
import { foreignCardArticle } from './foreignCardArticle.js';
import exchangeUidsArticle from './exchangeUidsArticle.json' with { type: 'json' };

export const guideRefreshMeta = {
  'guide-gmail-forwarding': { datePublished: '2026-08-30T01:39:58+03:00', dateModified: '2026-11-10' },
  'guide-discord-token': { datePublished: '2026-10-26T17:38:30+03:00', dateModified: '2026-11-10', title: 'Как войти в Discord по токену: расширение и F12 | Hopscup' },
  'guide-foreign-cards': { datePublished: '2026-10-14T16:08:38+03:00', dateModified: '2026-11-10' },
  'guide-uids-addresses': { datePublished: exchangeUidsArticle.datePublished, dateModified: exchangeUidsArticle.dateModified, title: exchangeUidsArticle.seoTitle, heading: exchangeUidsArticle.title, intro: exchangeUidsArticle.intro },
};

export const gmailScreenshots = [
  { src: '/article/gmail-forwarding/open-settings.jpg', alt: 'Переход из Gmail в раздел всех настроек', caption: 'Нажимаем на шестерёнку и открываем все настройки Gmail.' },
  { src: '/article/gmail-forwarding/forwarding-tab.jpg', alt: 'Вкладка Пересылка и POP IMAP в настройках Gmail', caption: 'Открываем вкладку «Пересылка и POP/IMAP».' },
  { src: '/article/gmail-forwarding/add-address.jpg', alt: 'Добавление нового адреса пересылки в Gmail', caption: 'Добавляем адрес, на который Gmail будет пересылать письма.' },
  { src: '/article/gmail-forwarding/enable-forwarding.jpg', alt: 'Включённая переадресация и выбор действия с оригиналом письма', caption: 'Включаем пересылку, выбираем действие с оригиналом и сохраняем изменения.' },
];
export const gmailResultNote = 'Теперь все новые письма будут автоматически пересылаться на выбранный адрес.';
export const discordHeadingIds = {
  'Что такое токен Discord и где он в файле': 'token',
  'Как сменить токен Discord': 'reset-token',
  'Как войти через Discord Token Login': 'extension',
  'Вход по токену через F12, если расширение не работает': 'f12',
  'Почему не получается войти по токену': 'troubleshooting',
  'Как достать токен из своего аккаунта Discord': 'network',
};
const paragraph = content => ({ type: 'paragraph', content });
const heading = text => ({ type: 'heading', level: 2, text });
const text = text => ({ text });
const link = (text, href) => ({ text, href });

export const createGuideRefreshContent = offers => {
  const service = (id, label) => {
    const offer = offers.find(offer => offer.id === id);
    if (!offer) throw new Error(`Missing guide service: ${id}`);
    return link(label, offer.url);
  };
  const gmailClosing = [text('Почты для фермы беру на '), service('st-dark', 'DarkShopping'), text(', есть ещё '), service('st1', 'AccsMarket'), text(' и '), service('st-funpay', 'FunPay'), text('. Как собрать всю ферму, разобрал в '), link('статье про ферму аккаунтов', '/guides/account-farm'), text('.')];
  const discordClosing = [text('Аккаунты Discord я беру на '), service('st-dark', 'DarkShopping'), text('. Что с ними сделать сразу после покупки, разобрал в '), link('статье про ферму аккаунтов', '/guides/account-farm'), text('.')];
  const gmail = articleFallbackContent.gmail;
  const list = items => ({ type: 'list', ordered: false, items: items.map(item => [text(item)]) });
  const image = index => ({ type: 'image', ...gmailScreenshots[index] });
  const gmailBlocks = [
    heading('Важные моменты перед началом'), list(gmail.before),
    heading(gmail.sections[0].heading), list(gmail.sections[0].steps.slice(0, 2)), image(0),
    list([gmail.sections[0].steps[2]]), image(1), list([gmail.sections[0].steps[3]]), image(2), list(gmail.sections[0].steps.slice(4)),
    heading(gmail.sections[1].heading), list(gmail.sections[1].steps), image(3),
    heading('Проверяем результат'), paragraph([text(gmailResultNote)]), paragraph([text(gmail.result)]), paragraph(gmailClosing),
  ];
  const pending = new Map([['PGON', 'pgon'], ['ВездеКарту', 'vezdekarta'], ['Zarub', 'zarub']]);
  const cardParagraph = value => {
    const parts = [];
    let rest = value;
    while (pending.size) {
      const next = [...pending.keys()].map(name => ({ name, at: rest.indexOf(name) })).filter(item => item.at >= 0).sort((a, b) => a.at - b.at)[0];
      if (!next) break;
      if (next.at) parts.push(text(rest.slice(0, next.at)));
      parts.push(service(pending.get(next.name), next.name));
      pending.delete(next.name);
      rest = rest.slice(next.at + next.name.length);
    }
    if (rest) parts.push(text(rest));
    return paragraph(parts);
  };
  const cardBlocks = foreignCardArticle.flatMap((section) => [heading(section.heading), ...section.paragraphs.map(cardParagraph), ...(section.links || []).map(item => paragraph([link(item.label, item.href)]))]);
  const cardsHeadingIds = Object.fromEntries(foreignCardArticle.map((section, index) => [section.heading, `cards-${index}`]));
  cardsHeadingIds['Ещё варианты'] = 'more-options';
  cardBlocks.push(heading('Ещё варианты'),
    paragraph([link('Antarctic Wallet', '/foreign-cards/antarctic-wallet'), text(': карта от 9,99$ с Apple Pay и Google Pay, пополнение рублями по СБП или USDT, но для выпуска нужна верификация.')]),
    paragraph([link('QR2Pay', '/foreign-cards/qr2pay'), text(': Visa USD без верификации за USDT, выпуск 2,5% + 5$, подходит только для оплаты онлайн.')]),
    paragraph([link('Все карты с условиями и комиссиями у меня на сайте', '/foreign-cards')]),
  );
  return {
    'guide-gmail-forwarding': { title: gmail.title, intro: gmail.intro, sourceUrl: '', blocks: gmailBlocks, headingIds: { 'Важные моменты перед началом': 'before', [gmail.sections[0].heading]: 'add-address', [gmail.sections[1].heading]: 'enable', 'Проверяем результат': 'result' }, closing: gmailClosing },
    'guide-discord-token': { ...discordTokenArticle, blocks: [...discordTokenArticle.blocks, paragraph(discordClosing)], headingIds: discordHeadingIds },
    'guide-foreign-cards': { title: 'Зарубежная карта с пополнением рублями: что выбрать', intro: 'PGON, ВездеКарта и Zarub: пополнение через СБП или USDT, документы, курс и реальные расходы.', sourceUrl: 'https://telegra.ph/51526126126216216-09-11', blocks: cardBlocks, headingIds: cardsHeadingIds },
    'guide-uids-addresses': { ...exchangeUidsArticle, headingIds: { OKX: 'okx', Bitget: 'bitget' } },
  };
};

// Keep the author's existing exchange registration links, which are not in OFFERS.
export const exchangeRegistrationServices = exchangeUidsArticle.blocks
  .filter(block => block.type === 'paragraph')
  .flatMap(block => block.content)
  .filter(part => part.href?.includes('okx.com/join/') || part.href?.includes('clacCode='))
  .map(part => ({ id: part.href.includes('okx.com') ? 'okx' : 'bitget', name: part.href.includes('okx.com') ? 'OKX' : 'Bitget', category: 'Crypto', url: part.href }));
