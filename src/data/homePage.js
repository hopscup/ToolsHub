import { guidePages } from './guidePages.js';
import { guideCatalog } from './guideCatalog.js';
import { proxyGuideMeta } from './proxyGuideContent.js';
import { mobileProxyMeta } from './articleFallbackContent.js';

export const homeSeo = {
  title: {
    ru: 'Hopscup Tools: VPN, прокси, антидетекты и нейросети',
    en: 'Hopscup Tools: VPNs, proxies, antidetect browsers and AI',
  },
  description: {
    ru: 'Сервисы, которыми я пользуюсь сам: VPN, который работает на 4G, прокси, антидетекты, номера для регистрации, зарубежные карты и нейросети из России. Промокоды и гайды.',
    en: 'Services I use myself: VPNs for mobile data, proxies, antidetect browsers, verification numbers, international cards and AI tools accessible from Russia. Promo codes and guides.',
  },
};

const tasks = [
  {
    id: 'vpn', icon: 'shield',
    title: { ru: 'VPN, который не отваливается', en: 'A VPN that stays connected' },
    text: { ru: 'Белые списки на 4G, Happ на айфоне и что делать, если не открывается вообще ничего.', en: 'Mobile-data allowlists, Happ on iPhone, and what to try when nothing will load.' },
    links: [
      { href: '/proxy-vpn', label: { ru: 'Все VPN', en: 'All VPNs' } },
      { href: '/guides/vpn-ne-rabotaet-na-4g', label: { ru: 'VPN не работает на 4G', en: 'VPN not working on 4G' } },
    ],
  },
  {
    id: 'proxy', icon: 'globe',
    title: { ru: 'Прокси под аккаунты', en: 'Proxies for your accounts' },
    text: { ru: 'Какие брать под YouTube, Claude и фермы, и когда переплачивать за мобильные.', en: 'What I use for YouTube, Claude and account farms, and when mobile proxies are worth the extra cost.' },
    links: [
      { href: '/proxy-vpn/luchshie-proksi', label: { ru: 'Какие прокси выбрать', en: 'Choosing proxies' } },
      { href: '/proxy-vpn/luchshie-mobilnye-proksi', label: { ru: 'Мобильные прокси', en: 'Mobile proxies' } },
    ],
  },
  {
    id: 'antidetect', icon: 'laptop',
    title: { ru: 'Антидетект бесплатно', en: 'Free antidetect browsers' },
    text: { ru: 'Свой айпи и «железо» на каждый профиль, без подписки.', en: 'A separate IP and device fingerprint for each profile, without a subscription.' },
    links: [
      { href: '/antidetect', label: { ru: 'Все антидетекты', en: 'All antidetect browsers' } },
      { href: '/guides/besplatnye-antidetekt-brauzery', label: { ru: 'Бесплатные антидетекты', en: 'Free browser comparison' } },
    ],
  },
  {
    id: 'ai', icon: 'sparkles',
    title: { ru: 'Нейросети из России', en: 'AI tools from Russia' },
    text: { ru: 'ChatGPT, Claude, Gemini, генерация картинок и видео с оплатой рублями.', en: 'ChatGPT, Claude, Gemini, image and video generation, with ways to pay in rubles.' },
    links: [
      { href: '/ai', label: { ru: 'Нейросети', en: 'AI tools' } },
      { href: '/guides/deshevye-podpiski-chatgpt-claude-gemini', label: { ru: 'Дешёвые подписки', en: 'Lower-cost subscriptions' } },
    ],
  },
  {
    id: 'cards', icon: 'card',
    title: { ru: 'Оплатить зарубежный сервис', en: 'Pay for an international service' },
    text: { ru: 'Карты без KYC с пополнением через СБП или USDT.', en: 'Cards without KYC, with top-ups through Russia\'s SBP payment system or USDT.' },
    links: [
      { href: '/foreign-cards', label: { ru: 'Зарубежные карты', en: 'International cards' } },
      { href: '/guides/zarubezhnaya-karta-s-popolneniem-rublyami', label: { ru: 'Какую карту выбрать', en: 'Choosing a card' } },
    ],
  },
  {
    id: 'sms', icon: 'message',
    title: { ru: 'Номер для регистрации', en: 'A number for verification' },
    text: { ru: 'Виртуальные номера для ChatGPT, Claude, Discord и Telegram.', en: 'Virtual numbers for ChatGPT, Claude, Discord and Telegram sign-ups.' },
    links: [
      { href: '/sms-activators', label: { ru: 'SMS-активаторы', en: 'SMS verification services' } },
      { href: '/guides/virtualnyj-nomer-dlya-registracii', label: { ru: 'Какой номер брать', en: 'Choosing a number' } },
    ],
  },
  {
    id: 'accounts', icon: 'users',
    title: { ru: 'Ферма аккаунтов', en: 'An account farm' },
    text: { ru: 'Где брать аккаунты и почты и как их не потерять в первую неделю.', en: 'Where to get accounts and email inboxes, and how to keep them through the first week.' },
    links: [
      { href: '/account-shop', label: { ru: 'Магазины аккаунтов', en: 'Account shops' } },
      { href: '/guides/account-farm', label: { ru: 'Как собрать ферму', en: 'Setting up a farm' } },
    ],
  },
  {
    id: 'crypto', icon: 'coins',
    title: { ru: 'Крипта и оплата по QR', en: 'Crypto and QR payments' },
    text: { ru: 'Обменники, кошельки и оплата криптой по QR в России и за границей.', en: 'Exchanges, wallets and crypto-funded QR payments in Russia and abroad.' },
    links: [
      { href: '/crypto-exchange', label: { ru: 'Крипта', en: 'Crypto services' } },
      { href: '/crypto-exchange/qr-sbp', label: { ru: 'Оплата по QR', en: 'QR payments' } },
    ],
  },
  {
    id: 'steam', icon: 'gamepad',
    title: { ru: 'Пополнить Steam', en: 'Top up Steam' },
    text: { ru: 'Где пополнить из России без лишних комиссий.', en: 'Ways to top up from Russia without unnecessary fees.' },
    links: [
      { href: '/steam-topup', label: { ru: 'Пополнение Steam', en: 'Steam top-ups' } },
      { href: '/steam-topup/kak-vygodno-popolnit-steam', label: { ru: 'Как выгодно пополнить', en: 'Finding a better rate' } },
    ],
  },
];

export const homeCopy = {
  tasksTitle: { ru: 'Под какую задачу ищете сервис?', en: 'What do you need a service for?' },
  tasksSubtitle: { ru: 'Выберите задачу, и я покажу, что использую сам и где об этом подробно рассказал.', en: 'Pick a task to see what I use and where I have covered it in detail.' },
  featuredTitle: { ru: 'Чем пользуюсь сам', en: 'What I use myself' },
  featuredSubtitle: { ru: 'Сервисы, на которых сижу каждый день. Подробный отзыв в карточке каждого.', en: 'My everyday services. Each card opens a detailed review.' },
  guidesTitle: { ru: 'Свежие гайды', en: 'Latest guides' },
  allGuides: { ru: 'Все гайды', en: 'All guides' },
  selectionTitle: { ru: 'Как я отбираю сервисы', en: 'How I choose services' },
  selectionText: { ru: 'Все сервисы на сайте я тестировал сам и оставляю только те, что реально работают.', en: 'I have tested the services on this site myself and keep only the ones that actually work.' },
  selectionPoints: {
    ru: ['Большинство принимают рубли или крипту и работают из России.', 'В каждой карточке расписаны все нюансы: цены, оплата, ограничения.', 'Ссылки ведут только на официальные сайты и ботов.', 'Цены и условия обновляю, когда они меняются.'],
    en: ['Most accept rubles or crypto and can be used from Russia.', 'Every card explains pricing, payment options and limitations.', 'Links go only to official websites and bots.', 'I update prices and terms when they change.'],
  },
  tasks,
};

// Static copy mirrors the supplied HomeHero without changing that component.
export const homeHeroCopy = {
  wordmark: 'Hopscup’s Tools Hub',
  eyebrow: {ru:'Проверено лично',en:'Personally tested'},
  subtitle: {ru:'Прокси, антидетекты и сервисы для работы с аккаунтами',en:'Proxies, antidetect browsers and tools for account work'},
  lead: {
    ru:'Всё, чем пользуюсь сам: прокси, антидетекты, аккаунты, номера и зарубежные карты. В каждой карточке собрал всё, что нужно знать до покупки: цены, оплату, промокоды и все нюансы.',
    en:'Everything I use myself: proxies, antidetect browsers, accounts, numbers and foreign cards. Each card covers what you need to know before buying: prices, payment, promo codes and every caveat.',
  },
  choose: {ru:'Подобрать под задачу',en:'Find by task'},
  youtube: {ru:'Смотреть на YouTube',en:'Watch on YouTube'},
  previewTitle: {ru:'Что нужно сделать?',en:'What do you need?'},
  taskLabel: {ru:'задач',en:'tasks'},
  promo: {ru:'Промокод',en:'Promo code'},
  discount: {ru:'до −20%',en:'up to −20%'},
  statsLabels: {
    ru:['сервисов на сайте','принимают рубли или СБП','пошаговых гайдов','проверено лично мной'],
    en:['services listed','accept rubles or SBP','step-by-step guides','personally tested'],
  },
  tasks: [
    {offerId:'p6',title:{ru:'Прокси для аккаунтов и фермы',en:'Proxies for accounts and farms'}},
    {offerId:'ant-shardx',title:{ru:'Бесплатный антидетект',en:'Free antidetect browser'}},
    {offerId:'st-dark',title:{ru:'Аккаунты и почты для работы',en:'Accounts and email for work'}},
    {offerId:'sms-hero',title:{ru:'Номер для регистрации',en:'Number for sign-ups'}},
    {offerId:'zarub',title:{ru:'Оплатить ChatGPT, Claude и подписки',en:'Pay for ChatGPT, Claude and subscriptions'}},
  ],
};

export const homeFeaturedIds = ['p6', 'p3', 'vpn-ppl', 'zarub', 'st-dark', 'ant-shardx'];
export const homeGuideEnglish = {
  'guide-vpn-4g': { title: 'VPN not working on 4G: what to do when nothing loads', description: 'Mobile-data allowlists, older protocols, Happ on iPhone and ways to buy a VPN when Telegram will not open.' },
  'guide-happ-routing': { title: 'Set up Happ routing so Russian sites work with your VPN on', description: 'Split tunneling in Happ: send Russian banking and shopping traffic directly while international services use the VPN.' },
  'guide-a6api': { title: 'Generate 200+ images with GPT Image 2, Grok and Gemini for a couple of dollars', description: 'Getting started with A6API: registration, USDT payments and image generation through a low-cost API.' },
  'guide-mobile-antidetect': { title: 'Antidetect on your phone: what to choose', description: 'Mobile browsers, cloud Android phones, app cloning and physical devices: what works for managing separate accounts.' },
};

export function homeLink(href, language) {
  if (language === 'ru' || href.startsWith('/guides/') || href.startsWith('/proxy-vpn/luchshie-')) return href;
  return `/en${href}`;
}

export function getHomeSelections(offers) {
  const dates = Object.fromEntries(guidePages.map(page => [page.id, page.datePublished]));
  dates['guide-best-proxies'] = proxyGuideMeta.datePublished;
  dates['guide-best-mobile-proxies'] = mobileProxyMeta.datePublished;
  return {
    serviceCount: offers.filter(offer => offer.category !== 'Guides').length,
    guideCount: guideCatalog.filter(guide => guide.indexable !== false && dates[guide.id]).length,
    featured: homeFeaturedIds.map(id => offers.find(offer => offer.id === id)).filter(Boolean),
    guides: guideCatalog.filter(guide => guide.indexable !== false && dates[guide.id])
      .sort((a, b) => Date.parse(dates[b.id]) - Date.parse(dates[a.id]))
      .slice(0, 4),
  };
}
