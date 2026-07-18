/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundParticles } from './components/BackgroundParticles';
import { 
  Gamepad2,
  Globe, 
  CreditCard, 
  Coins, 
  ShoppingBag, 
  MessageSquare, 
  ExternalLink, 
  Languages,
  Github,
  Youtube,
  Send,
  Search,
  Laptop,
  Server,
  ThumbsUp,
  Users,
  Video,
  FileText,
  Star,
  Info,
  Copy,
  Zap,
  X,
  Mail,
  MessageCircle,
  Monitor,
  Smartphone,
  Facebook,
  Instagram,
  Linkedin,
  Twitch,
  Music2,
  Chrome,
  Store,
  Layers,
  Lock,
  Shield,
  Cloud,
  Database,
  Code,
  Terminal,
  Tv,
  Palette,
  Percent
} from 'lucide-react';

// --- Types ---
type Language = 'ru' | 'en';

type CategoryType = 'Proxy' | 'Antidetect' | 'Stores' | 'Cards' | 'Crypto' | 'SMS' | 'VPS' | 'Social' | 'Steam' | 'Guides';

type SubCategory = 'Proxy' | 'VPN' | 'PCBasic' | 'PCAdvanced' | 'Mobile' | 'NoKYC' | 'WithKYC' | 'CardCrypto' | 'USDTQR' | 'Web' | 'Bot' | 'BoostSites' | 'Bux' | 'SteamFast' | 'SteamItems' | 'None';

const SITE_URL = 'https://hopscup.tools';
const PROXY_ANTIDETECT_VIDEO_URL = 'https://youtu.be/pBljqjuY2ls?si=Ft3UMgxjNUvaRT4d';
const CARDS_VIDEO_URL = 'https://youtu.be/l15QzKojPsk?si=G7t9EW_ug9frLuWj';
const SOCIAL_VIDEO_URL = 'https://youtu.be/MdvO9gVcym4?si=lBsgOITQokrj-zO3';
const STORE_AI_VIDEO_URL = 'https://youtu.be/3wjIQRrOdd0?si=04kDWjWwLatAVipc';
const STORE_ACCOUNTS_VIDEO_URL = 'https://youtu.be/DkJjFX7oRUc?si=444gvvOtNxjLF1ti';
const STEAM_PRICE_TABLE_URL = 'https://pulse.tradeon.space?ref=4484789789';

interface Offer {
  id: string;
  category: CategoryType;
  subCategory?: SubCategory;
  name: string;
  description: Record<Language, string>;
  url: string;
  webUrl?: string;
  logoUrl?: string;
  promoCode?: string;
  badge?: Record<Language, string>;
  isPopular?: boolean;
  isBestChoice?: boolean;
  since?: string;
  platforms?: string[];
  payments?: string[];
  freeProfiles?: Record<Language, string>;
  tariffStartPrice?: Record<Language, string>;
  profiles100Price?: Record<Language, string>;
  priceInfo?: {
    main?: Record<Language, string>;
    secondary?: Record<Language, string>;
  };
  cardStats?: {
    issuance: Record<Language, string>;
    maintenance: Record<Language, string>;
    verification: Record<Language, string>;
    cashback: Record<Language, string>;
    topup: Record<Language, string>;
    commission: Record<Language, string>;
    paySystems: Record<Language, string>;
    type: Record<Language, string>;
  };
  details?: {
    geo?: Record<Language, string>;
    types?: Record<Language, string>;
    fees?: string;
    kyc?: string;
    minTopup?: string;
    paymentMethods?: Record<Language, string>;
    rate?: Record<Language, string>;
    supports?: Record<Language, string[]>;
    nuances?: Record<Language, string[]>;
    pros?: Record<Language, string[]>;
    targetAudience?: Record<Language, string>;
    descriptionDetailed?: Record<Language, string>;
  };
}

// --- Data ---
const CATEGORIES: { id: CategoryType; icon: any; title: Record<Language, string>; subFilters?: SubCategory[]; guides?: { text: string | boolean; video: string } }[] = [
  { 
    id: 'Proxy', 
    icon: Globe, 
    title: { ru: 'Proxy / VPN', en: 'Proxy / VPN' },
    subFilters: ['Proxy', 'VPN'],
    guides: { text: '#', video: '#' }
  },
  { 
    id: 'Antidetect', 
    icon: Laptop, 
    title: { ru: 'Антидетект', en: 'Antidetect' },
    subFilters: ['PCBasic', 'PCAdvanced', 'Mobile'],
    guides: { text: '#', video: '#' }
  },
  { 
    id: 'Stores', 
    icon: ShoppingBag, 
    title: { ru: 'Аккаунт Shop', en: 'Account Shop' }, 
    subFilters: ['Web', 'Bot'],
    guides: { 
      text: true, 
      video: 'https://youtu.be/3wjIQRrOdd0?si=04kDWjWwLatAVipc' 
    } 
  },
  { id: 'Cards', icon: CreditCard, title: { ru: 'Зарубежные Карты', en: 'Virtual Cards' }, subFilters: ['NoKYC', 'WithKYC'], guides: { text: '#', video: '#' } },
  { 
    id: 'Crypto', 
    icon: Coins, 
    title: { ru: 'Купить/продать крипту', en: 'Buy/Sell Crypto' },
    guides: { text: '#', video: '#' }
  },
  { id: 'SMS', icon: MessageSquare, title: { ru: 'SMS Активаторы', en: 'SMS Activators' } },
  { id: 'VPS', icon: Server, title: { ru: 'VDS/VPS серверы', en: 'VDS/VPS Servers' }, guides: { text: '#', video: '#' } },
  { id: 'Social', icon: ThumbsUp, title: { ru: 'Накрутка', en: 'Social Boost' }, subFilters: ['BoostSites', 'Bux'], guides: { text: '#', video: '#' } },
  { id: 'Steam', icon: Gamepad2, title: { ru: 'Пополнение Steam', en: 'Steam Top-up' }, subFilters: ['SteamFast', 'SteamItems'], guides: { text: '#', video: '#' } },
  { id: 'Guides', icon: FileText, title: { ru: 'Полезные гайды', en: 'Useful Guides' } },
];

const CATEGORY_ROUTES: Record<CategoryType, string> = {
  Proxy: '/proxy-vpn',
  Antidetect: '/antidetect',
  Stores: '/account-shop',
  Cards: '/foreign-cards',
  Crypto: '/crypto-exchange',
  SMS: '/sms-activators',
  VPS: '/vps',
  Social: '/social-boost',
  Steam: '/steam-topup',
  Guides: '/guides',
};

const getDefaultSubFilter = (): SubCategory => 'None';

const getCategoryFromPath = (path = typeof window !== 'undefined' ? window.location.pathname : '/'): CategoryType => {
  const normalizedPath = path.replace(/\/+$/, '') || '/';
  const match = Object.entries(CATEGORY_ROUTES).find(([, route]) => route === normalizedPath);
  return (match?.[0] as CategoryType | undefined) || 'Proxy';
};

const SECTION_SEO: Record<CategoryType, {
  route: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  heading: Record<Language, string>;
  intro: Record<Language, string>;
  points: Record<Language, string[]>;
}> = {
  Proxy: {
    route: CATEGORY_ROUTES.Proxy,
    title: {
      ru: 'Прокси и VPN для аккаунтов, фарма и работы | Hopscup Tools',
      en: 'Proxy and VPN services for account work | Hopscup Tools',
    },
    description: {
      ru: 'Подборка прокси и VPN: residential, mobile, ISP, IPv4/IPv6, сервисы с оплатой картой и криптой для аккаунтов, рекламы и автоматизации.',
      en: 'Curated proxy and VPN services: residential, mobile, ISP, IPv4/IPv6, cards and crypto payments for account work and automation.',
    },
    heading: {
      ru: 'Прокси и VPN для рабочих задач',
      en: 'Proxy and VPN services for work',
    },
    intro: {
      ru: 'В этом разделе собраны прокси и VPN, которые можно использовать для аккаунтов, рекламных кабинетов, автоматизации, парсинга и повседневной работы с зарубежными сервисами.',
      en: 'This section collects proxy and VPN services for accounts, ad cabinets, automation, scraping, and everyday work with international services.',
    },
    points: {
      ru: ['Для высокого траста чаще смотрят mobile, residential и ISP.', 'Для парсинга и простых задач часто хватает IPv4/IPv6.', 'Перед покупкой лучше сверять гео, тип прокси и способ оплаты.'],
      en: ['Mobile, residential, and ISP proxies are usually better for trust-sensitive tasks.', 'IPv4/IPv6 is often enough for scraping and simpler automation.', 'Check geo, proxy type, and payment method before buying.'],
    },
  },
  Antidetect: {
    route: CATEGORY_ROUTES.Antidetect,
    title: {
      ru: 'Антидетект браузеры для мультиаккаунтинга | Hopscup Tools',
      en: 'Antidetect browsers for multi-accounting | Hopscup Tools',
    },
    description: {
      ru: 'Сравнение антидетект браузеров: бесплатные профили, стартовые тарифы, цена за 100 профилей и варианты для базовых и усиленных задач.',
      en: 'Antidetect browser comparison: free profiles, starter plans, 100-profile pricing, and options for basic and advanced tasks.',
    },
    heading: {
      ru: 'Антидетект браузеры под разные уровни задач',
      en: 'Antidetect browsers for different task levels',
    },
    intro: {
      ru: 'Антидетект нужен, когда приходится вести несколько профилей и важно разделять отпечатки браузера, прокси, cookie и окружение аккаунтов.',
      en: 'Antidetect browsers help manage multiple profiles while separating browser fingerprints, proxies, cookies, and account environments.',
    },
    points: {
      ru: ['Базовые решения подходят для обычного мультиаккаунтинга.', 'Усиленные варианты чаще берут под строгий антифрод.', 'Смотри не только цену, но и бесплатные профили, командную работу и стабильность.'],
      en: ['Basic tools are suitable for regular multi-accounting.', 'Advanced options are usually used for stricter antifraud.', 'Check pricing, free profiles, team features, and stability.'],
    },
  },
  Stores: {
    route: CATEGORY_ROUTES.Stores,
    title: {
      ru: 'Магазины аккаунтов и подписок | Hopscup Tools',
      en: 'Account and subscription shops | Hopscup Tools',
    },
    description: {
      ru: 'Подборка сайтов и Telegram-магазинов для покупки аккаунтов, AI-подписок, Discord, Twitter, Google и других цифровых товаров.',
      en: 'A curated list of websites and Telegram stores for buying accounts, AI subscriptions, Discord, Twitter, Google, and other digital goods.',
    },
    heading: {
      ru: 'Магазины аккаунтов, подписок и цифровых товаров',
      en: 'Account, subscription, and digital goods stores',
    },
    intro: {
      ru: 'Здесь собраны площадки, где можно купить аккаунты, подписки на нейросети и другие цифровые товары. Основной фокус — удобство, отзывы, способы оплаты и понятные правила покупки.',
      en: 'This section lists marketplaces for accounts, AI subscriptions, and digital goods with a focus on convenience, reviews, payment methods, and clear purchase rules.',
    },
    points: {
      ru: ['Для большинства задач удобно начинать с DarkStore и FunPay.', 'В Telegram-магазинах часто бывают дешевые подписки на AI-сервисы.', 'Перед покупкой всегда проверяй отзывы, условия замены и описание товара.'],
      en: ['DarkStore and FunPay are convenient starting points for many tasks.', 'Telegram shops often have discounted AI subscriptions.', 'Always check reviews, replacement rules, and product descriptions before buying.'],
    },
  },
  Cards: {
    route: CATEGORY_ROUTES.Cards,
    title: {
      ru: 'Зарубежные карты без KYC и с KYC | Hopscup Tools',
      en: 'Foreign virtual cards with and without KYC | Hopscup Tools',
    },
    description: {
      ru: 'Сервисы зарубежных виртуальных карт для оплаты зарубежных подписок, App Store, Google Play, Airbnb, рекламы и других сервисов.',
      en: 'Foreign virtual card services for paying subscriptions, App Store, Google Play, Airbnb, ads, and other international services.',
    },
    heading: {
      ru: 'Зарубежные карты для оплаты сервисов',
      en: 'Foreign cards for service payments',
    },
    intro: {
      ru: 'Зарубежные карты помогают оплачивать сервисы, где российские карты не проходят: подписки, магазины приложений, бронирования, рекламу и зарубежные платформы.',
      en: 'Foreign cards help pay for services where local cards may fail: subscriptions, app stores, bookings, ads, and international platforms.',
    },
    points: {
      ru: ['Без KYC обычно быстрее старт, но могут быть ограничения.', 'С KYC чаще больше лимиты и стабильность.', 'Перед выпуском карты проверь комиссии, пополнение и поддержку нужного сервиса.'],
      en: ['No-KYC options are usually faster to start but may have limits.', 'KYC options often provide higher limits and more stability.', 'Check fees, top-up methods, and supported services before issuing a card.'],
    },
  },
  Crypto: {
    route: CATEGORY_ROUTES.Crypto,
    title: {
      ru: 'Купить и продать крипту онлайн и офлайн | Hopscup Tools',
      en: 'Buy and sell crypto online and offline | Hopscup Tools',
    },
    description: {
      ru: 'Обменники для покупки и продажи криптовалюты: онлайн-обмен, офлайн-направления, наличные, карты, USDT и популярные сети.',
      en: 'Crypto exchange services for buying and selling crypto: online exchange, offline directions, cash, cards, USDT, and popular networks.',
    },
    heading: {
      ru: 'Обмен крипты под разные форматы',
      en: 'Crypto exchange for different formats',
    },
    intro: {
      ru: 'Раздел для покупки и продажи крипты через обменники: онлайн, офлайн, с картами, наличными и популярными сетями.',
      en: 'This section covers crypto exchange services for online and offline deals, cards, cash, and popular networks.',
    },
    points: {
      ru: ['Для крупных сумм лучше заранее согласовывать детали с менеджером.', 'Всегда сверяй сеть, адрес, курс и минимальную сумму.', 'Первый перевод на новый адрес разумнее делать тестовой суммой.'],
      en: ['For larger amounts, confirm details with a manager in advance.', 'Always check network, address, rate, and minimum amount.', 'Use a small test transfer for a new address.'],
    },
  },
  SMS: {
    route: CATEGORY_ROUTES.SMS,
    title: {
      ru: 'SMS-активаторы для регистрации аккаунтов | Hopscup Tools',
      en: 'SMS activators for account registration | Hopscup Tools',
    },
    description: {
      ru: 'SMS-активаторы и виртуальные номера для регистрации аккаунтов: гео, способы оплаты, крипта, карты и российские способы пополнения.',
      en: 'SMS activators and virtual numbers for account registration: geo, payment methods, crypto, cards, and local top-up options.',
    },
    heading: {
      ru: 'SMS-активаторы и виртуальные номера',
      en: 'SMS activators and virtual numbers',
    },
    intro: {
      ru: 'SMS-активаторы помогают быстро получить номер под регистрацию, но качество зависит от страны, оператора, сервиса и конкретной площадки.',
      en: 'SMS activators help quickly rent a number for registration, but quality depends on country, operator, service, and target platform.',
    },
    points: {
      ru: ['Если код не пришел, сервисы часто возвращают средства за неудачную активацию.', 'Для сложных регистраций полезно смотреть статистику доходимости.', 'Гео номера иногда стоит подбирать под прокси или VPN.'],
      en: ['If the code does not arrive, many services refund failed activations.', 'For tougher registrations, delivery statistics are useful.', 'Number geo sometimes should match the proxy or VPN geo.'],
    },
  },
  VPS: {
    route: CATEGORY_ROUTES.VPS,
    title: {
      ru: 'VDS и VPS серверы для ботов и рабочих задач | Hopscup Tools',
      en: 'VDS and VPS servers for bots and work tasks | Hopscup Tools',
    },
    description: {
      ru: 'Подборка VDS/VPS хостингов для ботов, скриптов, парсинга, нод и удаленной работы: MaCloud, Xorek, VDSina, SpaceCore, AEZA.',
      en: 'VDS/VPS hosting list for bots, scripts, scraping, nodes, and remote work: MaCloud, Xorek, VDSina, SpaceCore, AEZA.',
    },
    heading: {
      ru: 'VDS/VPS серверы для постоянной работы',
      en: 'VDS/VPS servers for continuous work',
    },
    intro: {
      ru: 'VDS/VPS нужен, когда скрипт, бот, парсер или рабочее окружение должны работать стабильно и не зависеть от домашнего ПК.',
      en: 'VDS/VPS hosting is useful when a script, bot, scraper, or work environment must run reliably without depending on a home PC.',
    },
    points: {
      ru: ['MaCloud дороже, но обычно спокойнее по стабильности.', 'Xorek дешевле и подходит для простых задач.', 'Перед оплатой смотри локацию, ресурсы, бэкапы и способы оплаты.'],
      en: ['MaCloud is pricier but usually calmer for stability.', 'Xorek is cheaper and suitable for simpler tasks.', 'Check location, resources, backups, and payment methods before paying.'],
    },
  },
  Social: {
    route: CATEGORY_ROUTES.Social,
    title: {
      ru: 'Накрутка и буксы для рефералов и заданий | Hopscup Tools',
      en: 'Social boost and task exchanges for referrals | Hopscup Tools',
    },
    description: {
      ru: 'Сайты накрутки и буксы для рефералов, регистраций, социальных действий и Telegram-заданий с оплатой картой, СБП/Мир и криптой.',
      en: 'Social boost sites and task exchanges for referrals, registrations, social actions, and Telegram tasks with card, local, and crypto payments.',
    },
    heading: {
      ru: 'Накрутка и буксы для рефералов',
      en: 'Social boost and task exchanges for referrals',
    },
    intro: {
      ru: 'Раздел для задач, где нужны регистрации, рефералы или простые действия от исполнителей: сайты накрутки дают скорость, буксы дают более ручной формат.',
      en: 'This section is for registrations, referrals, and simple user actions: boost sites provide speed, while task exchanges offer a more manual format.',
    },
    points: {
      ru: ['Сайты накрутки удобнее, когда важна скорость.', 'Буксы полезны, когда нужно подтверждение вроде скрина или Telegram-логина.', 'Перед подтверждением задания лучше проверять исполнителей и повторы.'],
      en: ['Boost sites are convenient when speed matters.', 'Task exchanges are useful when proof like screenshots or Telegram logins is needed.', 'Check performers and duplicate submissions before approval.'],
    },
  },
  Steam: {
    route: CATEGORY_ROUTES.Steam,
    title: {
      ru: 'Пополнение Steam из РФ и через предметы | Hopscup Tools',
      en: 'Steam top-up via login and items | Hopscup Tools',
    },
    description: {
      ru: 'Способы пополнения Steam: по логину, через предметы CS/TF/Rust, пополнение из РФ, быстрые варианты и пополнение в плюс до 30%.',
      en: 'Steam top-up methods: by login, CS/TF/Rust items, local top-ups, fast options, and item-based top-ups with potential upside.',
    },
    heading: {
      ru: 'Пополнение Steam быстро или через предметы',
      en: 'Steam top-up by login or through items',
    },
    intro: {
      ru: 'Можно пополнять Steam быстро по логину с комиссией или через предметы, если готов сверять цены и ждать продажи на маркете.',
      en: 'Steam can be topped up quickly by login with a fee or through items if you are ready to compare prices and wait for market sales.',
    },
    points: {
      ru: ['Через логин проще и быстрее, но обычно с комиссией.', 'Через предметы можно выйти в плюс, но нужно сверять ликвидность и цену в Steam.', 'Для РФ также встречается пополнение через банки вроде Сбера и Ozon с комиссией.'],
      en: ['Login top-up is simpler and faster but usually has a fee.', 'Item-based top-ups can be profitable, but liquidity and Steam prices must be checked.', 'Local bank top-ups may also be available with a commission.'],
    },
  },
  Guides: {
    route: CATEGORY_ROUTES.Guides,
    title: {
      ru: 'Полезные гайды по аккаунтам, IP, Gmail и крипте | Hopscup Tools',
      en: 'Useful guides for accounts, IP, Gmail, and crypto | Hopscup Tools',
    },
    description: {
      ru: 'Гайды Hopscup по смене IP, Gmail-форвардингу, ферме аккаунтов, KYC/OTC площадкам, UID и адресам для бирж.',
      en: 'Hopscup guides on IP changes, Gmail forwarding, account farms, KYC/OTC platforms, UIDs, and exchange addresses.',
    },
    heading: {
      ru: 'Полезные гайды Hopscup',
      en: 'Useful Hopscup guides',
    },
    intro: {
      ru: 'Здесь собраны отдельные материалы, которые помогают настроить базовую инфраструктуру: почты, IP, аккаунты, адреса и KYC/OTC-процессы.',
      en: 'This section collects practical materials for basic infrastructure: emails, IPs, accounts, addresses, and KYC/OTC processes.',
    },
    points: {
      ru: ['Начать можно с гайда по смене IP и форвардингу Gmail.', 'Для фермы аккаунтов полезен большой материал по почтам, прокси и антидетектам.', 'Крипто-гайды помогают с UID, адресами и верификациями.'],
      en: ['Start with the IP change and Gmail forwarding guides.', 'The account farm guide covers emails, proxies, and antidetect browsers.', 'Crypto guides help with UIDs, addresses, and verifications.'],
    },
  },
};

const OFFERS: Offer[] = [
  // GUIDES
  {
    id: 'guide-mobile-ip',
    category: 'Guides',
    name: 'Смена айпи мобильным интернетом и режимом "самолета". Android и iPhone',
    description: {
      ru: 'Основной гайд по смене IP через мобильный интернет и режим самолёта на Android и iPhone. Полезен для работы с аккаунтами, прокси-логикой и быстрым обновлением мобильного IP без лишних сервисов.',
      en: 'A core guide on changing IP via mobile internet and airplane mode on Android and iPhone. Useful for account work, proxy logic, and quickly refreshing mobile IP without extra services.'
    },
    url: 'https://telegra.ph/Smena-ajpi-mobilnym-internetom-i-rezhimom-samoleta-Android-i-Iphone-06-10',
    details: {
      types: { ru: 'Мобильный IP, Android, iPhone', en: 'Mobile IP, Android, iPhone' },
      supports: {
        ru: ['Смена IP', 'Мобильный интернет', 'Режим самолёта'],
        en: ['IP change', 'Mobile internet', 'Airplane mode']
      }
    }
  },
  {
    id: 'guide-gmail-forwarding',
    category: 'Guides',
    name: 'Пошаговый гайд по настройке переадресации писем из Gmail на другую почту',
    description: {
      ru: 'Пошаговый гайд по настройке переадресации писем из Gmail на другую почту. Удобно, когда нужно собирать коды, письма и уведомления с нескольких аккаунтов в одном месте.',
      en: 'A step-by-step guide on forwarding Gmail emails to another inbox. Useful when you need to collect codes, messages, and notifications from multiple accounts in one place.'
    },
    url: 'https://telegra.ph/Poshagovyj-gajd-po-nastrojke-pereadresacii-forvardinga-pisem-iz-Gmail-na-druguyu-pochtu-06-10',
    details: {
      types: { ru: 'Gmail, почты, форвардинг', en: 'Gmail, emails, forwarding' },
      supports: {
        ru: ['Переадресация Gmail', 'Работа с почтами', 'Сбор писем'],
        en: ['Gmail forwarding', 'Email work', 'Message collection']
      }
    }
  },
  {
    id: 'guide-account-farm',
    category: 'Guides',
    name: 'Ферма аккаунтов. Где брать аккаунты Discord, Twitter, Google. Прокси, накрутка, антидетекты?',
    description: {
      ru: 'Большой материал про то, где брать аккаунты Discord, Twitter, Google, как думать про прокси, накрутку и антидетекты. Хорошая база для тех, кто собирает рабочую инфраструктуру под мультиаккаунтинг.',
      en: 'A large material about where to get Discord, Twitter, and Google accounts, plus how to think about proxies, boosting, and antidetect browsers. A good base for building multi-accounting infrastructure.'
    },
    url: 'https://teletype.in/@hopscupcrpt/GIuM0McUUie',
    details: {
      types: { ru: 'Аккаунты, прокси, антидетекты', en: 'Accounts, proxies, antidetects' },
      supports: {
        ru: ['Discord, Twitter, Google', 'Прокси и антидетекты', 'Накрутка и рефералы'],
        en: ['Discord, Twitter, Google', 'Proxies and antidetects', 'Boosting and referrals']
      }
    }
  },
  {
    id: 'guide-otc-kyc',
    category: 'Guides',
    name: 'OTC площадки и KYC сервисы в крипте. Где брать верификации и продавать WL?',
    description: {
      ru: 'Гайд по OTC-площадкам и KYC-сервисам в крипте: где брать верификации, как смотреть площадки и где продавать WL. Подойдёт тем, кто работает с крипто-активностями и вайтлистами.',
      en: 'A guide about OTC platforms and KYC services in crypto: where to get verifications, how to look at platforms, and where to sell WL. Useful for crypto activities and whitelists.'
    },
    url: 'https://teletype.in/@hopscupcrpt/gM3FcGi4Wn1',
    details: {
      types: { ru: 'OTC, KYC, WL', en: 'OTC, KYC, WL' },
      supports: {
        ru: ['KYC-сервисы', 'OTC-площадки', 'Продажа WL'],
        en: ['KYC services', 'OTC platforms', 'WL selling']
      }
    }
  },
  {
    id: 'guide-uids-addresses',
    category: 'Guides',
    name: 'Много UID и адресов для вывода на криптобиржи',
    description: {
      ru: 'Подборка UID и адресов для вывода на криптобиржи. Полезно, когда нужно быстро свериться с направлениями вывода и рабочими реквизитами.',
      en: 'A collection of UIDs and addresses for withdrawals to crypto exchanges. Useful when you need to quickly check withdrawal directions and working details.'
    },
    url: 'https://teletype.in/@hopscupcrpt/iic_Q3_E19h',
    details: {
      types: { ru: 'UID, адреса, биржи', en: 'UIDs, addresses, exchanges' },
      supports: {
        ru: ['UID для бирж', 'Адреса вывода', 'Криптобиржи'],
        en: ['Exchange UIDs', 'Withdrawal addresses', 'Crypto exchanges']
      }
    }
  },
  // PROXY
  {
    id: 'p1',
    category: 'Proxy',
    subCategory: 'Proxy',
    name: 'ProxyShard',
    description: { 
      ru: 'Современный сервис с Residential, Datacenter, Mobile и ISP-прокси. Хороший баланс между стоимостью, скоростью и стабильностью работы.', 
      en: 'Modern service with Residential, Datacenter, Mobile, and ISP proxies. A good balance of price, speed, and stability.' 
    },
    url: 'https://proxyshard.com?ref=hopscup',
    logoUrl: '/proxyshard.png',
    isBestChoice: true,
    details: {
      geo: { ru: '100+ стран', en: '100+ countries' },
      types: { ru: 'Residential, Datacenter, Mobile, ISP', en: 'Residential, Datacenter, Mobile, ISP' },
      paymentMethods: { ru: 'Visa/Mastercard, Криптовалюта', en: 'Visa/Mastercard, Crypto' }
    }
  },
  {
    id: 'p2',
    category: 'Proxy',
    subCategory: 'Proxy',
    name: 'Proxyline',
    description: {
      ru: 'Проверенный сервис с недорогими серверными прокси. Хороший вариант для парсинга, автоматизации и задач, где не требуется максимальный уровень траста.',
      en: 'A proven service with affordable server proxies. Good for parsing, automation, and tasks that do not require maximum IP trust.'
    },
    url: 'https://proxyline.net?line=152448',
    logoUrl: '/proxyline.png',
    details: {
      geo: { ru: '100+ стран', en: '100+ countries' },
      types: { ru: 'IPv4, IPv6', en: 'IPv4, IPv6' },
      paymentMethods: { ru: 'Visa/Mastercard, СБП, Мир, Криптовалюта', en: 'Visa/Mastercard, SBP, Mir, Crypto' }
    }
  },
  {
    id: 'p3',
    category: 'Proxy',
    subCategory: 'Proxy',
    name: 'ProxyWing',
    description: {
      ru: 'Универсальный прокси-сервис с Residential, Datacenter, ISP и Mobile-прокси. Хороший вариант для аккаунтов, рекламных кабинетов, парсинга и задач, где важен высокий траст IP.',
      en: 'A universal proxy service with Residential, Datacenter, ISP, and Mobile proxies. A strong option for accounts, ad cabinets, scraping, and tasks where high IP trust matters.'
    },
    url: 'https://dashboard.proxywing.com/billing/aff.php?aff=813',
    logoUrl: '/proxywing.png',
    details: {
      geo: { ru: '200+ стран', en: '200+ countries' },
      types: { ru: 'Residential, Datacenter, ISP, Mobile', en: 'Residential, Datacenter, ISP, Mobile' },
      paymentMethods: { ru: 'Visa/Mastercard, СБП/Мир, Криптовалюта', en: 'Visa/Mastercard, SBP/Mir, Crypto' }
    }
  },
  {
    id: 'p4',
    category: 'Proxy',
    subCategory: 'Proxy',
    name: 'Proxy-Seller',
    description: {
      ru: 'Один из самых крупных сервисов с огромным выбором стран и типов прокси. Практически всегда можно подобрать подходящий вариант под любую задачу.',
      en: 'One of the largest services with a huge selection of countries and proxy types. You can usually find a suitable option for almost any task.'
    },
    url: 'https://proxy-seller.com/?partner=RIPC5NDAEYRZPZ',
    logoUrl: '/proxy-seller.png',
    isPopular: true,
    details: {
      geo: { ru: '220+ стран', en: '220+ countries' },
      types: { ru: 'IPv4, IPv6, ISP, Residential, Mobile, Shared', en: 'IPv4, IPv6, ISP, Residential, Mobile, Shared' },
      paymentMethods: { ru: 'Visa/Mastercard, Криптовалюта, PayPal', en: 'Visa/Mastercard, Crypto, PayPal' }
    }
  },
  {
    id: 'p5',
    category: 'Proxy',
    subCategory: 'Proxy',
    name: 'Proxy6',
    description: {
      ru: 'Один из самых известных сервисов с доступными IPv4/IPv6, shared IPv4 и MTProto-прокси. Подходит для повседневных задач, автоматизации и работы с большим количеством IP.',
      en: 'One of the best-known services with affordable IPv4/IPv6, shared IPv4, and MTProto proxies. Suitable for daily tasks, automation, and working with many IPs.'
    },
    url: 'https://px6.net/c/103460',
    logoUrl: '/proxy6.png',
    details: {
      geo: { ru: '70+ стран', en: '70+ countries' },
      types: { ru: 'IPv4, IPv6, Shared IPv4, MTProto', en: 'IPv4, IPv6, Shared IPv4, MTProto' },
      paymentMethods: { ru: 'Visa/Mastercard, СБП/Мир, Криптовалюта', en: 'Visa/Mastercard, SBP/Mir, Crypto' }
    }
  },
  {
    id: 'p6',
    category: 'Proxy',
    subCategory: 'Proxy',
    name: 'MobileProxy',
    description: {
      ru: 'Сервис мобильных прокси с возможностью смены IP. Отличный выбор для задач, где важен максимально высокий уровень доверия со стороны площадок.',
      en: 'Mobile proxy service with IP rotation. A great choice for tasks where the highest possible platform trust is important.'
    },
    url: 'https://mobileproxy.space/?p=105422',
    logoUrl: '/mobileproxy.png',
    details: {
      geo: { ru: '20+ стран', en: '20+ countries' },
      types: { ru: 'Mobile', en: 'Mobile' },
      paymentMethods: { ru: 'Visa/Mastercard, СБП/Мир, Криптовалюта', en: 'Visa/Mastercard, SBP/Mir, Crypto' }
    }
  },
  {
    id: 'p7',
    category: 'Proxy',
    subCategory: 'Proxy',
    name: 'Proxys.io',
    description: {
      ru: 'Универсальный сервис с большим выбором прокси под разные задачи: IPv4/IPv6, shared, residential, mobile и dynamic. Подойдет как для работы с аккаунтами, так и для автоматизации.',
      en: 'A universal service with a wide proxy selection for different tasks: IPv4/IPv6, shared, residential, mobile, and dynamic proxies. Good for both account work and automation.'
    },
    url: 'https://proxys.io/?refid=54507',
    logoUrl: '/proxys-io.png',
    details: {
      geo: { ru: '240+ стран', en: '240+ countries' },
      types: { ru: 'IPv4, IPv6, Shared IPv4, Residential, Mobile, Dynamic', en: 'IPv4, IPv6, Shared IPv4, Residential, Mobile, Dynamic' },
      paymentMethods: { ru: 'Visa/Mastercard, СБП/Мир, Криптовалюта, Alipay', en: 'Visa/Mastercard, SBP/Mir, Crypto, Alipay' }
    }
  },
  // VPN
  {
    id: 'vpn-ppl',
    category: 'Proxy',
    subCategory: 'VPN',
    name: 'PPL VPN',
    description: {
      ru: 'Быстрый VPN для повседневного использования. Подходит для обхода блокировок, просмотра YouTube без рекламы и работы с зарубежными сервисами. Есть удобный Telegram-бот и реферальная программа.',
      en: 'Fast VPN for daily use. Suitable for bypassing blocks, watching YouTube without ads, and working with foreign services. It has a convenient Telegram bot and a referral program.'
    },
    url: 'https://t.me/VPNPPLBot?start=dXNlcl9pZD00NDMwODM',
    webUrl: 'https://app.privatepeople.top/?partner_id=443083',
    logoUrl: '/ppl-vpn.png',
    isBestChoice: true,
    platforms: ['Windows', 'macOS', 'Android', 'iOS', 'Linux'],
    details: {
      geo: { ru: 'Более 10 стран', en: '10+ countries' },
      paymentMethods: { ru: 'Банковские карты, СБП, Криптовалюта', en: 'Bank cards, SBP, Crypto' }
    }
  },
  {
    id: 'vpn-prosto',
    category: 'Proxy',
    subCategory: 'VPN',
    name: 'ProstoVPN',
    description: {
      ru: 'VPN с собствеными технологиями обхода блокировок, который продолжает работать даже при усилении ограничений. Поддерживает неограниченное количество устройств и несколько режимов скорости под разные задачи.',
      en: 'VPN with proprietary block-bypass technologies that keeps working even when restrictions get stronger. Supports unlimited devices and multiple speed modes for different tasks.'
    },
    url: 'https://t.me/prostovpnrubot?start=tg_467483565',
    logoUrl: '/prostovpn.png',
    platforms: ['Windows', 'macOS', 'Android', 'iOS', 'Linux', 'Smart TV'],
    details: {
      geo: { ru: 'Более 10 стран', en: '10+ countries' },
      paymentMethods: { ru: 'Банковские карты, СБП', en: 'Bank cards, SBP' }
    }
  },
  {
    id: 'vpn-tochka-g',
    category: 'Proxy',
    subCategory: 'VPN',
    name: 'Точка G',
    description: {
      ru: 'VPN-сервис в Telegram-боте с акцентом на стабильную связь и оперативную замену конфигов. Если конкретный конфиг перестаёт работать, его можно заменить через бота или поддержку. Есть отдельные решения для Telegram, включая персональный прокси и новые VPN-конфиги для работы TG, AI-сервисов и других приложений.',
      en: 'A Telegram-bot VPN service focused on staying connected and quickly replacing configs. If a config stops working, it can be replaced through the bot or support. There are separate Telegram solutions, including a personal proxy and newer VPN configs for Telegram, AI services, and other apps.'
    },
    url: 'https://t.me/tochka_GI_bot?start=811308241',
    logoUrl: '/tochka-g.png',
    platforms: ['Windows', 'macOS', 'Android', 'iOS', 'Linux'],
    details: {
      geo: { ru: 'Несколько стран, есть переключение в новых конфигах', en: 'Multiple countries, switching available in newer configs' },
      types: { ru: 'VPN-конфиги, персональный прокси для Telegram', en: 'VPN configs, personal Telegram proxy' },
      paymentMethods: { ru: 'СБП или крипта', en: 'SBP or crypto' },
      pros: {
        ru: ['Замена конфига через бота', 'Поддержка помогает подобрать рабочий вариант', 'Есть решение для Telegram-прокси', 'Компенсации днями при серьёзных сбоях'],
        en: ['Config replacement via bot', 'Support helps find a working option', 'Telegram proxy solution available', 'Day compensation during serious outages']
      },
      nuances: {
        ru: [
          'Иногда приходится менять конфиг, если провайдер или блокировки ломают соединение.',
          'Если всё работает, лучше не менять конфиг без необходимости.',
          'Для проблем с Telegram может понадобиться связка VPN + персональный прокси.'
        ],
        en: [
          'Sometimes a config must be replaced when a provider or blocking rules break the connection.',
          'If everything works, it is better not to change the config unnecessarily.',
          'For Telegram issues, a VPN + personal proxy combo may be needed.'
        ]
      }
    }
  },
  // ANTIDETECT
  {
    id: 'ant-dolphin',
    category: 'Antidetect',
    subCategory: 'PCBasic',
    name: 'Dolphin{anty}',
    description: { ru: 'Один из основных антидетектов для мультиакков, фарма, ретродропов и повседневной работы с профилями.', en: 'One of the core antidetect browsers for multi-accounting, farming, retro drops, and daily profile work.' },
    url: 'https://dolphin-anty.net/a/1384647/nvjWq92',
    logoUrl: '/dolphin.png',
    isBestChoice: true,
    freeProfiles: { ru: '5', en: '5' },
    tariffStartPrice: { ru: 'от ≈ $10/мес', en: 'from ≈ $10/mo' },
    profiles100Price: { ru: '≈ $49/мес', en: '≈ $49/mo' },
    platforms: ['Windows', 'macOS', 'Linux'],
    details: { paymentMethods: { ru: 'Visa/MC, Мир/СБП, Крипта', en: 'Visa/MC, Mir/SBP, Crypto' } }
  },
  {
    id: 'ant-adspower',
    category: 'Antidetect',
    subCategory: 'PCBasic',
    name: 'AdsPower',
    description: { ru: 'Популярный антидетект для мультиаккаунтинга, командной работы и массового ведения профилей.', en: 'A popular antidetect browser for multi-accounting, team work, and managing many profiles.' },
    url: 'https://www.adspower-ru.com/share/e1UrIy',
    logoUrl: '/adspower.png',
    isPopular: true,
    freeProfiles: { ru: '2', en: '2' },
    tariffStartPrice: { ru: 'от ≈ $9.9/мес', en: 'from ≈ $9.9/mo' },
    profiles100Price: { ru: '≈ $36-45/мес', en: '≈ $36-45/mo' },
    platforms: ['Windows', 'macOS', 'Linux'],
    details: { paymentMethods: { ru: 'Visa/MC, Мир/СБП, Крипта', en: 'Visa/MC, Mir/SBP, Crypto' } }
  },
  {
    id: 'ant-octo',
    category: 'Antidetect',
    subCategory: 'PCAdvanced',
    name: 'Octo Browser',
    description: { ru: 'Антидетект для более требовательных задач и сильного антифрода. Часто рассматривается, когда обычных решений уже недостаточно.', en: 'An antidetect browser for more demanding tasks and stronger antifraud. Often considered when simpler solutions are no longer enough.' },
    url: 'https://octobrowser.org/signup/?p=10441198',
    logoUrl: '/octo-browser.png',
    freeProfiles: { ru: '0', en: '0' },
    tariffStartPrice: { ru: 'от ≈ €29/мес', en: 'from ≈ €29/mo' },
    profiles100Price: { ru: '≈ €79/мес', en: '≈ €79/mo' },
    platforms: ['Windows', 'macOS', 'Linux'],
    details: { paymentMethods: { ru: 'Visa/MC, Мир/СБП, Крипта', en: 'Visa/MC, Mir/SBP, Crypto' } }
  },
  {
    id: 'ant-incogniton',
    category: 'Antidetect',
    subCategory: 'PCBasic',
    name: 'Incogniton',
    description: { ru: 'Антидетект для обычной работы с профилями и мультиакками. Можно рассматривать для базовых и средних задач.', en: 'An antidetect browser for regular profile work and multi-accounting. A viable option for basic and medium tasks.' },
    url: 'https://incogniton.com/aff/1873747/',
    logoUrl: '/incogniton.png',
    freeProfiles: { ru: '3 (10 первые 2 месяца)', en: '3 (10 for first 2 months)' },
    tariffStartPrice: { ru: 'от ≈ $13/мес', en: 'from ≈ $13/mo' },
    profiles100Price: { ru: '≈ $40-50/мес', en: '≈ $40-50/mo' },
    platforms: ['Windows', 'macOS'],
    details: { paymentMethods: { ru: 'Visa/MC, Крипта', en: 'Visa/MC, Crypto' } }
  },
  {
    id: 'ant-vision',
    category: 'Antidetect',
    subCategory: 'PCAdvanced',
    name: 'Vision',
    description: { ru: 'Усиленный антидетект для задач со строгим антифродом: букмекерки, казино, биржи и другие сервисы с глубокой защитой.', en: 'A stronger antidetect browser for strict antifraud tasks: betting, casinos, exchanges, and other services with deeper protection.' },
    url: 'https://browser.vision/r/5b695838-2bf1-4da8-9b56-2997cdd5b612',
    logoUrl: '/vision.png',
    isBestChoice: true,
    freeProfiles: { ru: '0', en: '0' },
    tariffStartPrice: { ru: '$29 за 50 профилей', en: '$29 for 50 profiles' },
    profiles100Price: { ru: '$79 за 150 профилей', en: '$79 for 150 profiles' },
    platforms: ['Windows', 'macOS', 'Linux'],
    details: { paymentMethods: { ru: 'Visa/MC, Мир/СБП, Крипта', en: 'Visa/MC, Mir/SBP, Crypto' } }
  },
  {
    id: 'ant-afina',
    category: 'Antidetect',
    subCategory: 'PCBasic',
    name: 'Afina',
    description: { ru: 'Антидетект для мультиаккаунтинга и работы с большим количеством профилей. По тарифам выглядит интересным вариантом для 100 профилей.', en: 'An antidetect browser for multi-accounting and working with many profiles. Pricing makes it an interesting option for 100 profiles.' },
    url: 'https://afina.io/en/plan?aff=3UQNPJEN',
    logoUrl: '/afina.png',
    freeProfiles: { ru: '0', en: '0' },
    tariffStartPrice: { ru: 'от ≈ $30/мес', en: 'from ≈ $30/mo' },
    profiles100Price: { ru: '≈ $30/мес', en: '≈ $30/mo' },
    platforms: ['Windows', 'macOS', 'Linux'],
    details: { paymentMethods: { ru: 'Visa/MC, Мир/СБП, Крипта', en: 'Visa/MC, Mir/SBP, Crypto' } }
  },
  {
    id: 'ant-gologin',
    category: 'Antidetect',
    subCategory: 'PCBasic',
    name: 'GoLogin',
    description: { ru: 'Антидетект для мультиаккаунтинга и работы с профилями. Подходит для обычных задач и простой организации аккаунтов.', en: 'An antidetect browser for multi-accounting and profile work. Good for common tasks and simple account organization.' },
    url: 'https://gologin.com/join/gologin-IKNNLII',
    logoUrl: '/gologin.png',
    freeProfiles: { ru: '3', en: '3' },
    tariffStartPrice: { ru: 'от ≈ $24/мес', en: 'from ≈ $24/mo' },
    profiles100Price: { ru: '≈ $49/мес', en: '≈ $49/mo' },
    platforms: ['Windows', 'macOS', 'Linux'],
    details: { paymentMethods: { ru: 'Visa/MC, Мир/СБП, Крипта', en: 'Visa/MC, Mir/SBP, Crypto' } }
  },
  {
    id: 'ant-morelogin',
    category: 'Antidetect',
    subCategory: 'PCBasic',
    name: 'MoreLogin',
    description: { ru: 'Антидетект для мультиаккаунтинга, командной работы и профилей под разные задачи.', en: 'An antidetect browser for multi-accounting, team work, and profiles for different tasks.' },
    url: 'https://www.morelogin.com/?from=AA8n0exLQF5U',
    logoUrl: '/morelogin.png',
    freeProfiles: { ru: '2', en: '2' },
    tariffStartPrice: { ru: 'от ≈ $9/мес', en: 'from ≈ $9/mo' },
    profiles100Price: { ru: '≈ $39-49/мес', en: '≈ $39-49/mo' },
    platforms: ['Windows', 'macOS'],
    details: { paymentMethods: { ru: 'Visa/MC, Мир/СБП, Крипта', en: 'Visa/MC, Mir/SBP, Crypto' } }
  },
  {
    id: 'ant-multilogin',
    category: 'Antidetect',
    subCategory: 'PCAdvanced',
    name: 'Multilogin',
    description: { ru: 'Один из усиленных антидетектов для задач, где важны качество профилей и работа со сложным антифродом.', en: 'One of the stronger antidetect browsers for tasks where profile quality and complex antifraud matter.' },
    url: 'https://app.multilogin.com/',
    logoUrl: '/multilogin.png',
    freeProfiles: { ru: '0', en: '0' },
    tariffStartPrice: { ru: 'от ≈ €29/мес', en: 'from ≈ €29/mo' },
    profiles100Price: { ru: '≈ €79-99/мес', en: '≈ €79-99/mo' },
    platforms: ['Windows', 'macOS', 'Linux'],
    details: { paymentMethods: { ru: 'Visa/MC, Мир/СБП, Крипта', en: 'Visa/MC, Mir/SBP, Crypto' } }
  },
  // STORES
  {
    id: 'st-dark',
    category: 'Stores',
    subCategory: 'Web',
    name: 'DarkStore',
    description: { 
      ru: 'Основной магазин для рабочих аккаунтов: Gmail, Telegram, Facebook, Instagram и другие соцсети. Хорошо подходит, когда нужны почты, свежереги, фарм-аккаунты и расходники под регистрацию, тесты или повседневную работу.', 
      en: 'A main store for work accounts: Gmail, Telegram, Facebook, Instagram, and other social platforms. Good when you need emails, fresh accounts, aged accounts, and consumables for registrations, testing, or daily work.' 
    },
    url: 'https://dark.shopping/category/view/gmail?p=95083',
    logoUrl: '/darkstore.png',
    isBestChoice: true,
    details: {
      paymentMethods: { ru: 'Visa/Mastercard, Крипта, СБП/RU карты', en: 'Visa/Mastercard, Crypto, SBP/RU cards' }
    }
  },
  {
    id: 'st1',
    category: 'Stores',
    subCategory: 'Web',
    name: 'ACCSMarket',
    description: { 
      ru: 'Крупный магазин аккаунтов с почтами, соцсетями и разными расходниками. Можно использовать как дополнительный источник, если нужного товара нет в основных магазинах или хочется сравнить цены.', 
      en: 'A large account store with emails, social accounts, and different consumables. Useful as an extra source when the main stores do not have the needed stock or when you want to compare prices.' 
    },
    url: 'https://accsmarket.com/en/9vV7VOzI',
    logoUrl: '/accsmarket.png',
    isPopular: true,
    details: {
      paymentMethods: { ru: 'Крипта', en: 'Crypto' }
    }
  },
  {
    id: 'st-ggsel',
    category: 'Stores',
    subCategory: 'Web',
    name: 'GGSel',
    description: { 
      ru: 'Маркетплейс цифровых товаров: игры, аккаунты, ключи, подписки и софт. Удобен для покупки игровых товаров, лицензий, подписок и редких цифровых позиций у разных продавцов.', 
      en: 'A digital goods marketplace: games, accounts, keys, subscriptions, and software. Useful for gaming goods, licenses, subscriptions, and niche digital items from different sellers.' 
    },
    url: 'https://ggsel.net/catalog/grand-theft-auto-vi?ai=1422112',
    logoUrl: '/ggsel.png',
    details: {
      paymentMethods: { ru: 'Visa/Mastercard, СБП/RU карты', en: 'Visa/Mastercard, SBP/RU cards' }
    }
  },
  {
    id: 'st-funpay',
    category: 'Stores',
    subCategory: 'Web',
    name: 'FunPay',
    description: { 
      ru: 'Один из самых полезных маркетплейсов для повседневных покупок: аккаунты, подписки, игровые товары, услуги, ключи и цифровые продукты. Часто закрывает задачу быстрее остальных за счёт большого выбора продавцов и отзывов.', 
      en: 'One of the most useful marketplaces for daily purchases: accounts, subscriptions, gaming goods, services, keys, and digital products. Often solves the task faster thanks to many sellers and reviews.' 
    },
    url: 'https://funpay.com/',
    logoUrl: '/funpay.png',
    details: {
      paymentMethods: { ru: 'Visa/Mastercard, Крипта, СБП/RU карты', en: 'Visa/Mastercard, Crypto, SBP/RU cards' }
    }
  },
  {
    id: 'st-plati',
    category: 'Stores',
    subCategory: 'Web',
    name: 'Plati Market',
    description: { 
      ru: 'Классический маркетплейс цифровых товаров: игры, ключи, софт, подписки и разные цифровые позиции. Полезен как запасной вариант для сравнения цен и поиска товаров, которых нет на FunPay или GGsel.', 
      en: 'A classic digital goods marketplace: games, keys, software, subscriptions, and other digital items. Useful as a backup option for price comparison and goods that are not available on FunPay or GGsel.' 
    },
    url: 'https://plati.market/games/grand-theft-auto-vi/2027/?ai=1422112',
    logoUrl: '/plati.png',
    details: {
      paymentMethods: { ru: 'Visa/Mastercard, Крипта, СБП/RU карты', en: 'Visa/Mastercard, Crypto, SBP/RU cards' }
    }
  },
  {
    id: 'st-lzt',
    category: 'Stores',
    subCategory: 'Web',
    name: 'LZT Market',
    description: {
      ru: 'Один из крупнейших игровых маркетов в СНГ с гарантией на аккаунты.',
      en: 'One of the largest gaming markets in the CIS with a guarantee on accounts.'
    },
    url: 'https://lzt.market/',
    logoUrl: '/lzt.png',
    details: {
      paymentMethods: { ru: 'Visa/Mastercard, Крипта', en: 'Visa/Mastercard, Crypto' }
    }
  },
  // BOT SHOPS
  {
    id: 'bot-lachuga',
    category: 'Stores',
    subCategory: 'Bot',
    name: 'Лачуга скамера',
    description: { 
      ru: 'Telegram-магазин с дешёвыми аккаунтами и подписками на популярные нейросети и сервисы. Чаще всего сюда заходят за Gemini, GPT, Claude, CapCut, Canva и похожими цифровыми товарами по сниженной цене.', 
      en: 'A Telegram shop with low-cost accounts and subscriptions for popular AI tools and services. Commonly used for Gemini, GPT, Claude, CapCut, Canva, and similar discounted digital goods.' 
    },
    url: 'https://t.me/LachugaSkamera_Bot?start=ref_467483565',
    logoUrl: '/lachuga.png',
    isBestChoice: true,
    details: {
      paymentMethods: { ru: 'Крипта, СБП/RU карты', en: 'Crypto, SBP/RU cards' }
    }
  },
  {
    id: 'bot-crassus',
    category: 'Stores',
    subCategory: 'Bot',
    name: 'Crassus Market',
    description: { 
      ru: 'Удобный Telegram-бот с аккаунтами, подписками и цифровыми товарами. Можно использовать как альтернативу, когда нужны нейросети, софт или подписки дешевле официальной цены.', 
      en: 'A convenient Telegram bot with accounts, subscriptions, and digital goods. Useful as an alternative when you need AI tools, software, or subscriptions below official prices.' 
    },
    url: 'https://t.me/crassus_market_bot?start=467483565',
    logoUrl: '/crassus.png',
    details: {
      paymentMethods: { ru: 'Крипта, СБП/RU карты', en: 'Crypto, SBP/RU cards' }
    }
  },
  {
    id: 'bot-apel0sin',
    category: 'Stores',
    subCategory: 'Bot',
    name: 'Apel0sin',
    description: { 
      ru: 'Telegram-магазин для покупки цифровых товаров, аккаунтов и подписок. Подходит для быстрых покупок через бота, когда не хочется искать продавца на маркетплейсе вручную.', 
      en: 'A Telegram shop for digital goods, accounts, and subscriptions. Good for quick bot-based purchases when you do not want to search for a seller manually on a marketplace.' 
    },
    url: 'https://t.me/vibecodinzz_bot?start=contest_ultra_ref_467483565',
    logoUrl: '/apel0sin.png',
    details: {
      paymentMethods: { ru: 'Visa, Крипта, СБП/RU карты', en: 'Visa, Crypto, SBP/RU cards' }
    }
  },
  {
    id: 'bot-petrovich',
    category: 'Stores',
    subCategory: 'Bot',
    name: 'Petrovich',
    description: { 
      ru: 'Telegram-бот с аккаунтами, ключами, подписками и товарами для популярных сервисов. Хороший вариант для быстрой покупки нейросетей, софта и других цифровых продуктов.', 
      en: 'A Telegram bot with accounts, keys, subscriptions, and goods for popular services. A good option for quick purchases of AI tools, software, and other digital products.' 
    },
    url: 'https://t.me/ptrv4_bot?start=467483565',
    logoUrl: '/petrovich.png',
    details: {
      paymentMethods: { ru: 'Крипта, СБП/RU карты', en: 'Crypto, SBP/RU cards' }
    }
  },
  // CRYPTO
  {
    id: 'prosto-exchange',
    category: 'Crypto',
    name: 'Prosto Exchange',
    description: {
      ru: 'Обменник для покупки и продажи криптовалюты через Telegram. Удобен, когда нужно быстро пополнить рабочий баланс, вывести крипту в рубли или провести обмен через менеджера. Подходит и для небольших онлайн-операций, и для более крупных сделок, где лучше заранее уточнить курс, лимиты и формат обмена.',
      en: 'A Telegram-based exchange service for buying and selling crypto. Useful for topping up work balances, cashing out crypto to RUB, or arranging an exchange with a manager. Works for quick online operations and larger deals where rate, limits, and format should be confirmed first.'
    },
    url: 'https://t.me/prostoexbot?start=467483565',
    logoUrl: '/prosto-exchange.png',
    isBestChoice: true,
    details: {
      geo: {
        ru: 'Онлайн: РФ/СНГ; офлайн: по доступным городам через бота',
        en: 'Online: RU/CIS; offline: available cities via bot'
      },
      types: {
        ru: 'Покупка/продажа крипты, онлайн обмен, офлайн обмен',
        en: 'Crypto buy/sell, online exchange, offline exchange'
      },
      paymentMethods: {
        ru: 'Банковские карты, СБП, USDT/криптовалюта',
        en: 'Bank cards, SBP, USDT/crypto'
      },
      supports: {
        ru: ['Покупка USDT и другой крипты', 'Продажа крипты на карту/СБП', 'Обмен крипта-крипта', 'Офлайн обмен через менеджера'],
        en: ['Buying USDT and other crypto', 'Selling crypto to card/SBP', 'Crypto-to-crypto exchange', 'Offline exchange via manager']
      },
      nuances: {
        ru: [
          'Перед обменом всегда проверяй актуальный курс и минимальную сумму в боте.',
          'Для крупных сумм лучше заранее согласовать формат с менеджером.',
          'Перед отправкой крипты перепроверяй сеть, адрес кошелька и сумму.',
          'Первый обмен лучше делать небольшой тестовой суммой.'
        ],
        en: [
          'Always check the current rate and minimum amount in the bot before exchanging.',
          'For larger amounts, agree on the format with a manager first.',
          'Before sending crypto, double-check the network, wallet address, and amount.',
          'For the first exchange, start with a small test amount.'
        ]
      },
      pros: {
        ru: ['Работает прямо в Telegram', 'Есть онлайн и офлайн формат', 'Удобно для пополнения и вывода рабочих бюджетов'],
        en: ['Works directly in Telegram', 'Online and offline formats', 'Convenient for topping up and cashing out work budgets']
      }
    }
  },
  {
    id: 'keine-exchange',
    category: 'Crypto',
    name: 'Keine Exchange',
    description: {
      ru: 'Обменник с веб-заявками и офлайн-направлениями для покупки, продажи и обмена криптовалюты. Хорошо подходит, когда нужно работать с наличными, USDT или крупными суммами через понятную заявку на сайте. Перед сделкой важно проверять актуальный курс, лимиты, город и условия AML/KYC.',
      en: 'An exchange service with web orders and offline directions for buying, selling, and swapping crypto. Useful for cash deals, USDT operations, and larger amounts through a structured website request. Before a deal, check the current rate, limits, city, and AML/KYC terms.'
    },
    url: 'https://keine-exchange.com/?rid=63626',
    logoUrl: '/keine-exchange.png',
    details: {
      geo: {
        ru: 'Онлайн + офлайн офисы: Москва, СПб, Екатеринбург, Краснодар, Сочи, Самара и др.',
        en: 'Online + offline offices: Moscow, Saint Petersburg, Yekaterinburg, Krasnodar, Sochi, Samara, and more'
      },
      types: {
        ru: 'Наличные, USDT, BTC, ETH, LTC, XMR, крипта-крипта',
        en: 'Cash, USDT, BTC, ETH, LTC, XMR, crypto-to-crypto'
      },
      paymentMethods: {
        ru: 'Наличные RUB/USD/EUR, банковские направления, криптовалюта',
        en: 'Cash RUB/USD/EUR, bank directions, crypto'
      },
      supports: {
        ru: ['Покупка и продажа USDT', 'Обмен наличных на крипту', 'Вывод крипты в наличные', 'Крипта-крипта обмен', 'Заявки через сайт'],
        en: ['Buying and selling USDT', 'Cash-to-crypto exchange', 'Crypto-to-cash withdrawal', 'Crypto-to-crypto exchange', 'Website requests']
      },
      nuances: {
        ru: [
          'Сервис указывает AML-проверку криптовалютных транзакций, поэтому грязные средства могут не принять.',
          'По офлайн-сделкам заранее проверяй город, лимиты и актуальный курс на момент заявки.',
          'Для прохода в бизнес-центр в большинстве городов может понадобиться документ.',
          'Для крупных сумм лучше заранее согласовать условия и формат фиксации курса.'
        ],
        en: [
          'The service states that crypto transactions are checked with AML tools, so high-risk funds may be rejected.',
          'For offline deals, check the city, limits, and current rate before creating a request.',
          'A document may be needed to enter the business center in many cities.',
          'For larger amounts, agree on the terms and rate-fixing format in advance.'
        ]
      },
      pros: {
        ru: ['Есть сайт с заявками', 'Поддерживаются наличные направления', 'Подходит для крупных обменов при согласовании условий'],
        en: ['Website-based requests', 'Cash directions supported', 'Works for larger exchanges when terms are agreed in advance']
      }
    }
  },
  // SMS
  {
    id: 'sms-hero',
    category: 'SMS',
    name: 'HeroSMS',
    description: { 
      ru: 'Получил особую популярность после закрытия SMS-Activate в конце 2025 года: часть инфраструктуры и сети поставщиков, после 10 лет работы, была передана именно сюда. Одни из самых дешёвых номеров на рынке.', 
      en: 'Gained particular popularity after the closure of SMS-Activate in late 2025. Some of the cheapest numbers on the market.' 
    },
    url: 'https://hero-sms.com/?ref=687296',
    logoUrl: '/hero-sms.png',
    isBestChoice: true,
    details: { 
      geo: { ru: '40+ стран', en: '40+ countries' }, 
      paymentMethods: { ru: 'Visa/Mastercard, Крипта, СБП/RU карты', en: 'Visa/Mastercard, Crypto, SBP/RU cards' }
    }
  },
  {
    id: 'sms-fast',
    category: 'SMS',
    name: 'SMS Fast',
    description: { 
      ru: 'Номера из 190+ стран на реальных симках. У каждого номера есть "процент доставки", что дает понимание какое ГЕО сейчас лучше всего работает. Аренда от 1 дня до месяца.', 
      en: 'Numbers from 190+ countries on real SIM cards. Delivery percentage shown. Rent from 1 day to a month.' 
    },
    url: 'https://smsfast.pro/?ref=1100157',
    logoUrl: '/sms-fast.png',
    details: { 
      geo: { ru: '190+ стран', en: '190+ countries' }, 
      paymentMethods: { ru: 'Visa/Mastercard, Крипта, СБП/RU карты', en: 'Visa/Mastercard, Crypto, SBP/RU cards' }
    }
  },
  {
    id: 'sms-pool',
    category: 'SMS',
    name: 'SMSPool',
    description: { 
      ru: 'Процент успеха пишется прямо у номера, функционала много. Аренда - от 1 дня до 28 дней.', 
      en: 'Success rate is written right by the number, lots of functionality. Rental from 1 to 28 days.' 
    },
    url: 'https://smspool.net/?r=AcN28TiKAr',
    logoUrl: '/sms-pool.png',
    details: { 
      geo: { ru: '50+ стран', en: '50+ countries' }, 
      paymentMethods: { ru: 'Visa/Mastercard, Крипта', en: 'Visa/Mastercard, Crypto' }
    }
  },
  {
    id: 'sms-grizzly',
    category: 'SMS',
    name: 'GrizzlySMS',
    description: { 
      ru: 'Старичок рынка, зарекомендовал себя с положительной стороны. Сразу видно процент успешных активаций, что есть не во всех сервисах', 
      en: 'Market veteran, well-established. Success percentage visible immediately.' 
    },
    url: 'https://grizzlysms.com/ru/?r=1654440',
    logoUrl: '/grizzly-sms.png',
    details: { 
      geo: { ru: '30+ стран', en: '30+ countries' }, 
      paymentMethods: { ru: 'Крипта, Visa/Mastercard', en: 'Crypto, Visa/Mastercard' }
    }
  },
  {
    id: 'sms-tiger',
    category: 'SMS',
    name: 'Tiger SMS',
    description: { 
      ru: 'Бюджетный вариант, соответственно качество такое же. Сервисов много, стран тоже. Есть бесплатные номера, на которых можно уже что-то порегать.', 
      en: 'Budget option with corresponding quality. Many services and countries. Free numbers available.' 
    },
    url: 'https://tiger-sms.com/?ref=672048',
    logoUrl: '/tiger-sms.png',
    details: { 
      geo: { ru: '35+ стран', en: '35+ countries' }, 
      paymentMethods: { ru: 'Visa/Mastercard, Крипта, СБП/RU карты', en: 'Visa/Mastercard, Crypto, SBP/RU cards' }
    }
  },
  {
    id: 'sms-365',
    category: 'SMS',
    name: '365-SMS',
    description: { 
      ru: 'Пользовался им еще лет 5 назад, когда абузил БК. Работает до сих пор. Если брать не дешевые номера, СМС почти всегда доходит.', 
      en: 'Been using it for 5 years. Still works. SMS almost always arrives if choosing premium numbers.' 
    },
    url: 'https://365sms.vip/?ref=37269',
    logoUrl: '/365-sms.png',
    details: { 
      geo: { ru: '25+ стран', en: '25+ countries' }, 
      paymentMethods: { ru: 'Visa/Mastercard, Крипта, СБП/RU карты', en: 'Visa/Mastercard, Crypto, SBP/RU cards' }
    }
  },
  // STEAM
  {
    id: 'steam-lis-skins',
    category: 'Steam',
    subCategory: 'SteamItems',
    name: 'LIS-SKINS',
    description: {
      ru: 'Один из самых удобных вариантов для пополнения Steam через предметы: на витрине сразу видно разницу цены относительно Steam, поэтому проще искать предметы, которые можно продать в плюс или хотя бы дешевле прямого пополнения.',
      en: 'One of the most convenient options for topping up Steam through items: the marketplace shows the price difference versus Steam, which makes it easier to find items that can be sold with profit or at least cheaper than direct top-up.'
    },
    url: 'https://lis-skins.com/?rf=3576023',
    logoUrl: '/lis-skins.png',
    isBestChoice: true,
    details: {
      rate: { ru: 'до +30%', en: 'up to +30%' },
      types: { ru: 'Предметами CS/TF/Rust', en: 'CS/TF/Rust items' },
      paymentMethods: { ru: 'Мир/СБП, карты, крипта', en: 'Mir/SBP, cards, crypto' },
      nuances: {
        ru: ['Обязательно сверяйте цену с Steam Market', 'Проверяйте ликвидность и историю продаж предмета', 'Фактический плюс зависит от комиссии Steam и скорости продажи'],
        en: ['Always compare the price with Steam Market', 'Check item liquidity and sales history', 'Real profit depends on Steam fees and sale speed']
      }
    }
  },
  {
    id: 'steam-tf2lavka',
    category: 'Steam',
    subCategory: 'SteamItems',
    name: 'TF2Lavka',
    description: {
      ru: 'Площадка с ключами и предметами TF2/Rust. Главный плюс — Rust/TF2 предметы часто используют для быстрого пополнения без ожидания трейдбана, поэтому их можно сразу выставлять и продавать на Steam Market. Перед покупкой всё равно проверяйте конкретный предмет.',
      en: 'A marketplace with TF2/Rust keys and items. The main advantage is that Rust/TF2 items are often used for faster top-ups without waiting for a trade ban, so they can be listed and sold on Steam Market right away. Still, check the exact item before buying.'
    },
    url: 'https://tf2lavka.ru/',
    logoUrl: '/tf2lavka.png',
    details: {
      rate: { ru: 'до +10%', en: 'up to +10%' },
      types: { ru: 'Предметами CS/TF/Rust', en: 'CS/TF/Rust items' },
      paymentMethods: { ru: 'Мир/СБП, карты, крипта', en: 'Mir/SBP, cards, crypto' },
      nuances: {
        ru: ['Хороший вариант, если не хочется ждать 7 дней', 'Проверяйте цену продажи в Steam до покупки', 'Плюс зависит от выбранного предмета'],
        en: ['Good option if you do not want to wait 7 days', 'Check the Steam sale price before buying', 'Profit depends on the selected item']
      }
    }
  },
  {
    id: 'steam-aim-market',
    category: 'Steam',
    subCategory: 'SteamItems',
    name: 'AIM.market',
    description: {
      ru: 'Есть прямое пополнение Steam примерно с 10% комиссией, но главная польза — предметы через таблицу сравнения цен. При удачном выборе можно пополнить баланс заметно выгоднее прямого способа.',
      en: 'Has direct Steam top-up at around 10% fee, but the main value is item top-up through price comparison. With a good item choice, you can top up noticeably cheaper than direct methods.'
    },
    url: 'https://aim.market/p/6da48855-6e2a-4d1f-9ecc-fa767d6235bd',
    logoUrl: '/aim-market.png',
    details: {
      rate: { ru: 'до +30%', en: 'up to +30%' },
      types: { ru: 'Предметами CS/TF/Rust', en: 'CS/TF/Rust items' },
      paymentMethods: { ru: 'Мир/СБП, карты, крипта', en: 'Mir/SBP, cards, crypto' },
      nuances: {
        ru: ['Для быстрого пополнения проще выбрать прямой способ', 'Для плюса сверяйтесь с таблицей и Steam Market', 'Не берите неликвидные предметы ради красивого процента'],
        en: ['For fast top-up, direct method is simpler', 'For profit, compare table data with Steam Market', 'Do not buy illiquid items just because the percentage looks good']
      }
    }
  },
  {
    id: 'steam-csmoney',
    category: 'Steam',
    subCategory: 'SteamItems',
    name: 'CS.MONEY',
    description: {
      ru: 'Крупная площадка для покупки и обмена CS2-скинов. Удобна для пополнения Steam через предметы, если вы умеете выбирать ликвидные скины и сверять цену с торговой площадкой Steam.',
      en: 'A large CS2 skin marketplace and trading platform. Useful for Steam top-ups through items if you know how to choose liquid skins and compare prices with Steam Market.'
    },
    url: 'https://cs.money/',
    logoUrl: '/cs-money.png',
    details: {
      rate: { ru: 'до +30%', en: 'up to +30%' },
      types: { ru: 'Предметами CS/TF/Rust', en: 'CS/TF/Rust items' },
      paymentMethods: { ru: 'Карты, PayPal, крипта и локальные методы', en: 'Cards, PayPal, crypto, local methods' },
      nuances: {
        ru: ['CS2-предметы могут иметь ограничения и ожидание', 'Смотрите ликвидность, цену и комиссию Steam', 'Подходит тем, кто понимает рынок скинов'],
        en: ['CS2 items may have restrictions and waiting time', 'Check liquidity, price, and Steam fee', 'Best for people who understand the skin market']
      }
    }
  },
  {
    id: 'steam-ggsel',
    category: 'Steam',
    subCategory: 'SteamFast',
    name: 'GGsel',
    description: {
      ru: 'Быстрое пополнение Steam по логину. Подходит, когда нужно пополнить баланс без возни с предметами и ожиданием продажи, но комиссия обычно около 10%.',
      en: 'Fast Steam top-up by login. Good when you need balance without item trading and waiting for a sale, but the fee is usually around 10%.'
    },
    url: 'https://ggsel.net/',
    logoUrl: '/ggsel.png',
    details: {
      rate: { ru: '-10%', en: '-10%' },
      types: { ru: 'По логину Steam', en: 'By Steam login' },
      paymentMethods: { ru: 'Мир/СБП, карты, крипта', en: 'Mir/SBP, cards, crypto' }
    }
  },
  {
    id: 'steam-playerok',
    category: 'Steam',
    subCategory: 'SteamFast',
    name: 'Playerok',
    description: {
      ru: 'Быстрое пополнение Steam по логину через продавцов на маркетплейсе. Удобно, когда нужен моментальный результат; комиссия обычно ниже, чем у многих прямых способов, примерно около 5%.',
      en: 'Fast Steam top-up by login through marketplace sellers. Convenient when you need an instant result; the fee is usually lower than many direct methods, around 5%.'
    },
    url: 'https://playerok.com/',
    logoUrl: '/playerok.png',
    details: {
      rate: { ru: '-5%', en: '-5%' },
      types: { ru: 'По логину Steam', en: 'By Steam login' },
      paymentMethods: { ru: 'Мир/СБП, карты, крипта', en: 'Mir/SBP, cards, crypto' },
      nuances: {
        ru: ['Проверяйте рейтинг продавца и отзывы', 'Лучше начинать с небольшой суммы', 'Условия зависят от конкретного продавца'],
        en: ['Check seller rating and reviews', 'Start with a small amount', 'Terms depend on the specific seller']
      }
    }
  },
  // CARDS
  {
    id: 'zarub',
    category: 'Cards',
    subCategory: 'NoKYC',
    name: 'Zarub',
    description: { 
      ru: 'Мой основной вариант зарубежной карты: без KYC, пополнение через СБП/USDT, проходит большинство зарубежных сервисов и часть российских мерчантов вроде OZON. Минус — комиссия при пополнении.', 
      en: 'My main foreign card option: no KYC, SBP/USDT top-up, works with most foreign services and some Russian merchants like OZON. The downside is the top-up fee.' 
    },
    url: 'https://t.me/zarub_robot?start=ref_PqBrBs',
    logoUrl: '/zarub.png',
    isBestChoice: true,
    cardStats: {
      issuance: { ru: '8$', en: '8$' },
      maintenance: { ru: '0 $/мес', en: '0 $/mo' },
      paySystems: { ru: 'Да', en: 'Yes' },
      verification: { ru: 'Ненужно', en: 'Not needed' },
      cashback: { ru: 'Нет', en: 'No' },
      topup: { ru: 'СБП/USDT', en: 'SBP/USDT' },
      commission: { ru: '3-5%', en: '3-5%' },
      type: { ru: 'Visa (USA)', en: 'Visa (USA)' }
    },
    details: {
      supports: {
        ru: ['ChatGPT, Netflix, Spotify', 'YouTube, Apple, Google', 'Booking, Airbnb, Aviasales', 'Amazon, eBay, Ali Global', 'Игры и приложения'],
        en: ['ChatGPT, Netflix, Spotify', 'YouTube, Apple, Google', 'Booking, Airbnb', 'Amazon, eBay, Ali Global', 'Games & Apps']
      },
      nuances: {
        ru: [
          'Выпуск карты — 8$ (разовая оплата)',
          'Обслуживание — 0$',
          'Комиссия за операцию — 0.35$',
          'Комиссия за пополнение — 1.5%',
          'Минимальное пополнение — от 10$',
          'Конвертация (не USD) — курс + 0.3$',
          'Лимиты — до $50 000 в сутки',
          'Срок доставки — от минут до 24ч'
        ],
        en: [
          'Issuance — 8$ (one-time)',
          'Maintenance — 0$',
          'Transaction fee — 0.35$',
          'Top-up fee — 1.5%',
          'Min. top-up — from 10$',
          'Conversion (non-USD) — rate + 0.3$',
          'Limits — up to $50,000 / day',
          'Issuance time — mins up to 24h'
        ]
      },
      pros: {
        ru: ['Моментальный выпуск', 'Apple/Google Pay', 'Высокие лимиты (до $1M/мес)'],
        en: ['Instant issuance', 'Apple/Google Pay', 'High limits (up to $1M/mo)']
      }
    }
  },
  {
    id: 'cashinout',
    category: 'Cards',
    subCategory: 'WithKYC',
    name: 'Cashin Out',
    description: { 
      ru: 'Сервис неплох тем, что есть разнообразные функции. От виртуальных карт под любые цели, до пополнения Steam', 
      en: 'Convenient service for top-up and card issuance via Telegram bot.' 
    },
    url: 'https://t.me/Cashinout_bot?start=197391',
    logoUrl: '/cashinout.png',
    cardStats: {
      issuance: { ru: '$7.5 ($5 на балик)', en: '$7.5 ($5 to bal)' },
      maintenance: { ru: '$3/мес', en: '$3/mo' },
      paySystems: { ru: 'Нет', en: 'No' },
      verification: { ru: 'Нужно', en: 'Needed' },
      cashback: { ru: 'Нет', en: 'No' },
      topup: { ru: 'СБП/USDT', en: 'SBP/USDT' },
      commission: { ru: '2.5%', en: '2.5%' },
      type: { ru: 'Visa', en: 'Visa' }
    },
    details: {
      nuances: {
        ru: [
          'Online Card — Для подписок и интернет-покупок',
          'Выпуск — 7.5$ ($5 зачисляется на баланс)',
          'Обслуживание — 3$/мес',
          'Комиссия за пополнение — 2.5%',
          'Минимальное пополнение — от 5$',
          'Комиссия за успешный платеж — 0.25$',
          'Комиссия за отклонённый платёж — до 0.5$',
          'Срок действия карты — 3 года',
          'Лимит — до 3 карт на пользователя'
        ],
        en: [
          'Online Card — For subscriptions & shopping',
          'Issuance — 7.5$ ($5 to balance)',
          'Maintenance — 3$/mo',
          'Top-up fee — 2.5%',
          'Min. top-up — from 5$',
          'Success transaction fee — 0.25$',
          'Decline fee — up to 0.5$',
          'Card validity — 3 years',
          'Limit — up to 3 cards per user'
        ]
      }
    }
  },
  {
    id: 'vezdekarta',
    category: 'Cards',
    subCategory: 'NoKYC',
    name: 'Vezdekarta',
    description: { 
      ru: 'Базовая виртуалка, есть 2 тарифа. Ненудобно, что некоторые сервисы не оплачивает. Выгоднее всех для пополнения рублями', 
      en: 'Personal foreign bank card in Telegram in 5-10 minutes.' 
    },
    url: 'https://app.vezdekarta.ru/',
    logoUrl: '/vezdekarta.png',
    isBestChoice: true,
    cardStats: {
      issuance: { ru: '10-12$', en: '10-12$' },
      maintenance: { ru: '0 ₽ / мес', en: '0 RUB / mo' },
      paySystems: { ru: 'Да', en: 'Yes' },
      verification: { ru: 'Ненужно', en: 'No needed' },
      cashback: { ru: 'Нет', en: 'No' },
      topup: { ru: 'Рубли(СБП)', en: 'RUB(SBP)' },
      commission: { ru: '3.5%', en: '3.5%' },
      type: { ru: 'MC / Visa', en: 'MC / Visa' }
    },
    details: {
      pros: {
        ru: ['Пополнение рублями (СБП)', 'Внутренний курс близок к ЦБ', 'Apple/Google Pay'],
        en: ['Top-up with RUB (SBP)', 'Rate close to Central Bank', 'Apple/Google Pay']
      },
      nuances: {
        ru: [
          'Тариф "Любо" (UK): $0.3 успех, $0.25 отказ',
          'Тариф "Ярко" (USA): $0.5+1% успех, $1 отказ',
          'Нельзя: 18+, Крипта, Казино, РФ/РБ/УА',
          'Поддержка в чате кабинета'
        ],
        en: [
          'Lyubo (UK): $0.3 success, $0.25 decline',
          'Yarko (USA): $0.5+1% success, $1 decline',
          'No: 18+, Crypto, Casino, RU/BY/UA',
          'In-app chat support'
        ]
      }
    }
  },
  {
    id: 'pionex',
    category: 'Cards',
    subCategory: 'WithKYC',
    name: 'Pionex',
    description: { 
      ru: 'Лучший вариант для РУ региона — криптокарта с легким KYC за 2 минуты.', 
      en: 'Best option for RU region — crypto card with easy KYC in 2 mins.' 
    },
    url: 'https://accounts.pionex.com/ru/signUp?r=0KQQCKp8q42',
    logoUrl: '/pionex.png',
    cardStats: {
      issuance: { ru: '0$', en: '0$' },
      maintenance: { ru: '0$', en: '0$' },
      paySystems: { ru: 'Да', en: 'Yes' },
      verification: { ru: 'Нужно', en: 'Needed' },
      cashback: { ru: '1%', en: '1%' },
      topup: { ru: 'USDT', en: 'USDT' },
      commission: { ru: '0%', en: '0%' },
      type: { ru: 'Visa / MC', en: 'Visa / MC' }
    },
    details: {
      pros: {
        ru: ['Кешбек 1%', '5% годовых на остаток', 'Без платы за выпуск и содержание', 'Подходит для ChatGPT'],
        en: ['1% Cashback', '5% APY on balance', 'No issuance/maintenance fee', 'Works for ChatGPT']
      },
      nuances: {
        ru: ['Доступна для СНГ', 'Нужно $10+ для активации (можно вывести)', 'Добавляется в WeChat Pay'],
        en: ['Available for CIS', '$10+ needed for activation (withdrawable)', 'Supports WeChat Pay']
      }
    }
  },
  // VPS / VDS
  {
    id: 'vps-macloud',
    category: 'VPS',
    name: 'MaCloud',
    description: {
      ru: 'Мой основной вариант для VDS/VPS. Не самый дешёвый провайдер, но по личному опыту всё работало стабильно и без лишней возни. Хороший выбор, когда сервер нужен не “на попробовать”, а для нормальной постоянной работы.',
      en: 'My main option for VDS/VPS. Not the cheapest provider, but in my experience it worked reliably without extra hassle. A good choice when you need a server for stable daily work, not just testing.'
    },
    url: 'https://macloud.ru/?partner=54jxg21a99',
    logoUrl: '/macloud.png',
    isBestChoice: true,
    details: {
      geo: { ru: 'РФ и зарубежные локации', en: 'RU and foreign locations' },
      types: { ru: 'VDS/VPS, Linux, Windows, выделенные ресурсы', en: 'VDS/VPS, Linux, Windows, dedicated resources' },
      paymentMethods: { ru: 'СБП/Мир, Visa/MC, Крипта', en: 'SBP/Mir, Visa/MC, Crypto' },
      pros: {
        ru: ['Стабильная работа по личному опыту', 'Подходит для постоянных рабочих серверов', 'Есть выбор конфигураций под разные задачи'],
        en: ['Stable in personal use', 'Good for permanent work servers', 'Configuration options for different tasks']
      },
      nuances: {
        ru: ['Дороже бюджетных вариантов', 'Для тестов можно начать с минимальной конфигурации', 'Перед покупкой лучше выбрать ОС и локацию под конкретную задачу'],
        en: ['More expensive than budget options', 'For testing, start with a minimal config', 'Choose OS and location for the exact task before buying']
      }
    }
  },
  {
    id: 'vps-xorek',
    category: 'VPS',
    name: 'Xorek',
    description: {
      ru: 'Дешёвый вариант для VDS/VPS. По личному опыту цена приятная, но иногда сервер мог слетать, после чего приходилось поднимать его заново. Подходит для тестов, временных задач и проектов, где не критичен редкий простой.',
      en: 'A cheap VDS/VPS option. In my experience, pricing is attractive, but the server could occasionally fail and need to be recreated. Good for tests, temporary tasks, and projects where rare downtime is not critical.'
    },
    url: 'https://xorek.cloud/?from=20798',
    logoUrl: '/xorek.png',
    isPopular: true,
    details: {
      geo: { ru: 'Несколько локаций', en: 'Multiple locations' },
      types: { ru: 'VDS/VPS, Linux, бюджетные конфигурации', en: 'VDS/VPS, Linux, budget configs' },
      paymentMethods: { ru: 'СБП/Мир, Visa/MC, Крипта', en: 'SBP/Mir, Visa/MC, Crypto' },
      pros: {
        ru: ['Низкая цена', 'Подходит для тестов и временных серверов', 'Можно быстро поднять новый сервер'],
        en: ['Low price', 'Good for tests and temporary servers', 'Easy to spin up a new server']
      },
      nuances: {
        ru: ['Иногда сервер может слетать', 'Не лучший выбор для критичных проектов', 'Важные данные лучше бэкапить отдельно'],
        en: ['Server may occasionally fail', 'Not the best choice for critical projects', 'Back up important data separately']
      }
    }
  },
  {
    id: 'vps-vdsina',
    category: 'VPS',
    name: 'VDSina',
    description: {
      ru: 'Популярный провайдер VDS/VPS с понятной панелью и быстрым запуском серверов. Хороший универсальный вариант для ботов, парсеров, небольших веб-проектов и рабочих окружений.',
      en: 'A popular VDS/VPS provider with a clear control panel and quick server deployment. A good universal option for bots, parsers, small web projects, and work environments.'
    },
    url: 'https://vdsina.ru/?partner=fd6mvbusbj46',
    logoUrl: '/vdsina.png',
    details: {
      geo: { ru: 'РФ и зарубежные локации', en: 'RU and foreign locations' },
      types: { ru: 'VDS/VPS, Linux, Windows, быстрый запуск', en: 'VDS/VPS, Linux, Windows, quick launch' },
      paymentMethods: { ru: 'СБП/Мир, Visa/MC, Крипта', en: 'SBP/Mir, Visa/MC, Crypto' },
      pros: {
        ru: ['Понятная панель', 'Быстрое создание серверов', 'Подходит для большинства типовых задач'],
        en: ['Clear panel', 'Fast server creation', 'Works for most common tasks']
      }
    }
  },
  {
    id: 'vps-spacecore',
    category: 'VPS',
    name: 'SpaceCore',
    description: {
      ru: 'Хостинг для VPS/VDS и серверной инфраструктуры. Можно рассматривать как альтернативу, если нужны другие локации, конфигурации или цены под конкретную задачу.',
      en: 'A hosting provider for VPS/VDS and server infrastructure. Consider it as an alternative when you need different locations, configurations, or pricing for a specific task.'
    },
    url: 'https://billing.spacecore.pro/billmgr?from=59744',
    logoUrl: '/spacecore.png',
    details: {
      geo: { ru: 'Разные локации', en: 'Different locations' },
      types: { ru: 'VPS/VDS, серверная инфраструктура', en: 'VPS/VDS, server infrastructure' },
      paymentMethods: { ru: 'СБП/Мир, Visa/MC, Крипта', en: 'SBP/Mir, Visa/MC, Crypto' },
      pros: {
        ru: ['Альтернатива под нестандартные задачи', 'Есть разные конфигурации', 'Подходит для теста локаций и цен'],
        en: ['Alternative for non-standard tasks', 'Different configurations available', 'Good for testing locations and pricing']
      }
    }
  },
  {
    id: 'vps-aeza',
    category: 'VPS',
    name: 'AEZA',
    description: {
      ru: 'Известный провайдер серверов и VPS/VDS с большим выбором инфраструктурных решений. Можно смотреть, когда нужны мощные конфигурации, разные локации или отдельные серверные продукты.',
      en: 'A well-known server and VPS/VDS provider with a wide range of infrastructure products. Worth checking when you need stronger configurations, different locations, or separate server products.'
    },
    url: 'https://aeza.net/?ref=887153',
    logoUrl: '/aeza.png',
    details: {
      geo: { ru: 'Разные страны и дата-центры', en: 'Different countries and data centers' },
      types: { ru: 'VPS/VDS, выделенные серверы, инфраструктура', en: 'VPS/VDS, dedicated servers, infrastructure' },
      paymentMethods: { ru: 'СБП/Мир, Visa/MC, Крипта', en: 'SBP/Mir, Visa/MC, Crypto' },
      pros: {
        ru: ['Широкий выбор серверных решений', 'Подходит для более серьёзных задач', 'Есть разные локации и конфигурации'],
        en: ['Wide range of server products', 'Works for more serious tasks', 'Different locations and configurations']
      }
    }
  },
  // SOCIAL BOOST
  {
    id: 'boost-twiboost',
    category: 'Social',
    subCategory: 'BoostSites',
    name: 'TwiBoost',
    description: {
      ru: 'Сайт накрутки для рефералов и социальных действий. Удобный вариант, когда нужно быстро набрать регистрации или активность без ручного поиска исполнителей.',
      en: 'A boost service for referrals and social actions. Convenient when you need to quickly get registrations or activity without manually searching for performers.'
    },
    url: 'https://twiboost.com/ref2287193',
    logoUrl: '/twiboost.png',
    isBestChoice: true,
    details: {
      types: { ru: 'Рефералы, регистрации, социальные действия', en: 'Referrals, registrations, social actions' },
      paymentMethods: { ru: 'СБП/Мир, Visa/MC, Крипта', en: 'SBP/Mir, Visa/MC, Crypto' },
      nuances: {
        ru: ['Быстро и удобно для массовых задач', 'Ники и профили могут выглядеть ботскими', 'Перед крупным объёмом лучше тестировать небольшой заказ'],
        en: ['Fast and convenient for volume tasks', 'Names and profiles may look bot-like', 'Test a small order before buying volume']
      }
    }
  },
  {
    id: 'boost-socproof',
    category: 'Social',
    subCategory: 'BoostSites',
    name: 'Soc-proof',
    description: {
      ru: 'Партнёрская площадка для накрутки рефералов и активности. Подходит для задач, где важны скорость, понятный заказ и прогнозируемая цена за действие.',
      en: 'A partner platform for referral and activity boosting. Good for tasks where speed, clear order setup, and predictable action price matter.'
    },
    url: 'https://partner.soc-proof.su/ref/slgw3',
    logoUrl: '/soc-proof.png',
    details: {
      types: { ru: 'Рефералы, регистрации, активность', en: 'Referrals, registrations, activity' },
      paymentMethods: { ru: 'СБП/Мир, Visa/MC, Крипта', en: 'SBP/Mir, Visa/MC, Crypto' }
    }
  },
  {
    id: 'boost-boostgram',
    category: 'Social',
    subCategory: 'BoostSites',
    name: 'Boost-gram',
    description: {
      ru: 'Сервис накрутки для социальных действий и реферальных задач. Можно использовать как альтернативу, если нужны другие цены или доступность по конкретному направлению.',
      en: 'A boost service for social actions and referral tasks. Useful as an alternative when you need different pricing or availability for a specific direction.'
    },
    url: 'https://boost-gram.online/ref1860138',
    logoUrl: '/boost-gram.png',
    details: {
      types: { ru: 'Соцсети, рефералы, регистрации', en: 'Social networks, referrals, registrations' },
      paymentMethods: { ru: 'СБП/Мир, Visa/MC, Крипта', en: 'SBP/Mir, Visa/MC, Crypto' }
    }
  },
  {
    id: 'boost-easyliker',
    category: 'Social',
    subCategory: 'BoostSites',
    name: 'EasyLiker',
    description: {
      ru: 'Сайт накрутки для социальных действий, активности и реферальных задач. Можно использовать как ещё один источник для сравнения цен, скорости выполнения и доступности нужных услуг.',
      en: 'A boost site for social actions, activity, and referral tasks. Useful as another source for comparing prices, completion speed, and available services.'
    },
    url: 'https://easyliker.ru/register?ref=XMFXYSMN',
    logoUrl: '/easyliker.png',
    details: {
      types: { ru: 'Соцсети, активность, рефералы', en: 'Social networks, activity, referrals' },
      paymentMethods: { ru: 'СБП/Мир, Visa/MC, Крипта', en: 'SBP/Mir, Visa/MC, Crypto' }
    }
  },
  {
    id: 'boost-smmlaba',
    category: 'Social',
    subCategory: 'BoostSites',
    name: 'SMMlaba',
    description: {
      ru: 'SMM-панель для накрутки и социальных метрик. Полезна как запасной вариант для лайков, подписок, просмотров и похожих задач.',
      en: 'An SMM panel for boosting and social metrics. Useful as a backup option for likes, follows, views, and similar tasks.'
    },
    url: 'https://smmlaba.com/',
    logoUrl: '/smmlaba.png',
    details: {
      types: { ru: 'SMM-метрики, соцсети, активность', en: 'SMM metrics, social networks, activity' },
      paymentMethods: { ru: 'СБП/Мир, Visa/MC, Крипта', en: 'SBP/Mir, Visa/MC, Crypto' }
    }
  },
  {
    id: 'boost-smmprime',
    category: 'Social',
    subCategory: 'BoostSites',
    name: 'SMMPrime',
    description: {
      ru: 'SMM-панель для накрутки активности в соцсетях. Можно использовать для сравнения цен и теста разных поставщиков под одну задачу.',
      en: 'An SMM panel for boosting social activity. Useful for comparing prices and testing different providers for the same task.'
    },
    url: 'https://smmprime.com/ref/wvevp',
    logoUrl: '/smmprime.png',
    details: {
      types: { ru: 'SMM-метрики, соцсети, активность', en: 'SMM metrics, social networks, activity' },
      paymentMethods: { ru: 'СБП/Мир, Visa/MC, Крипта', en: 'SBP/Mir, Visa/MC, Crypto' }
    }
  },
  {
    id: 'bux-socpublic',
    category: 'Social',
    subCategory: 'Bux',
    name: 'Socpublic',
    description: {
      ru: 'Проверенный букс: биржа заданий, где реальные исполнители делают простые действия за оплату. Хорошо подходит для регистраций в Telegram-ботах и реферальных заданий.',
      en: 'A proven task marketplace where real performers complete simple paid actions. Good for Telegram bot registrations and referral tasks.'
    },
    url: 'https://socpublic.com/?i=9368855',
    logoUrl: '/socpublic.png',
    isPopular: true,
    details: {
      types: { ru: 'Биржа заданий, регистрации, подтверждение скрином/логином', en: 'Task marketplace, registrations, screenshot/login proof' },
      paymentMethods: { ru: 'СБП/Мир, Visa/MC, Крипта', en: 'SBP/Mir, Visa/MC, Crypto' },
      nuances: {
        ru: ['Задание на регистрацию часто стоит от 7-10 рублей', 'Перед подтверждением проверяйте логин, скрин и повторные выполнения', 'Встречаются исполнители, которые пытаются обмануть'],
        en: ['Registration tasks often start around 7-10 RUB', 'Before approval, check login, screenshot, and repeated submissions', 'Some performers may try to cheat']
      }
    }
  },
  {
    id: 'bux-unu',
    category: 'Social',
    subCategory: 'Bux',
    name: 'UNU',
    description: {
      ru: 'Более современный букс для заданий и реферальных регистраций. Удобен, когда нужны действия от реальных людей, но вы готовы вручную проверять результаты.',
      en: 'A more modern task marketplace for assignments and referral registrations. Useful when you need actions from real people and are ready to manually check results.'
    },
    url: 'https://unu.im/re/3105327',
    logoUrl: '/unu.png',
    details: {
      types: { ru: 'Биржа заданий, регистрации, простые действия', en: 'Task marketplace, registrations, simple actions' },
      paymentMethods: { ru: 'СБП/Мир, Visa/MC, Крипта', en: 'SBP/Mir, Visa/MC, Crypto' },
      nuances: {
        ru: ['Подходит для заданий с подтверждением через скрин или Telegram-логин', 'Цена зависит от популярности задания и требований', 'Чем точнее ТЗ, тем меньше мусорных выполнений'],
        en: ['Good for tasks with screenshot or Telegram login proof', 'Price depends on task popularity and requirements', 'A clearer task description reduces low-quality submissions']
      }
    }
  }
];

// --- Components ---
const PlatformIcon = ({ name, className = "w-3.5 h-3.5" }: { name: string; className?: string }) => {
  const icons: Record<string, any> = {
    gmail: Mail,
    email: Mail,
    telegram: Send,
    discord: MessageCircle,
    facebook: Facebook,
    instagram: Instagram,
    tiktok: Music2,
    steam: Gamepad2,
    x: X,
    twitter: X,
    linkedin: Linkedin,
    reddit: MessageSquare,
    google: Chrome,
    apple: Smartphone,
    windows: Monitor,
    epic: Gamepad2,
    psn: Gamepad2,
    xbox: Gamepad2,
    card: CreditCard,
    crypto: Coins,
    sbp: Zap,
    gemini: Star,
    capcut: Video,
    canva: Palette,
    netflix: Tv,
    streaming: Video,
    software: Laptop,
    vpn: Shield,
    itunes: Music2,
    roblox: Gamepad2,
    genshin: Gamepad2,
    valorant: Gamepad2,
    wow: Gamepad2,
  };

  const Icon = icons[name?.toLowerCase() || ''] || Globe;
  return <Icon className={className} />;
};

const LanguageToggle = ({ lang, setLang }: { lang: Language; setLang: (l: Language) => void }) => (
  <button 
    onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
    className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 hover:border-brand-purple transition-all duration-300 group"
  >
    <Languages className="w-4 h-4 text-brand-purple group-hover:scale-110 transition-transform" />
    <span className="text-xs font-medium uppercase tracking-wider">{lang === 'ru' ? 'RU' : 'EN'}</span>
  </button>
);

export default function App() {
  const initialCategory = getCategoryFromPath();
  const [lang, setLang] = useState<Language>('ru');
  const [activeCategory, setActiveCategory] = useState<CategoryType>(initialCategory);
  const [subFilter, setSubFilter] = useState<SubCategory>(getDefaultSubFilter());
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isProxyGuideOpen, setIsProxyGuideOpen] = useState(false);
  const [isProxyCheckerOpen, setIsProxyCheckerOpen] = useState(false);
  const [isAntidetectGuideOpen, setIsAntidetectGuideOpen] = useState(false);
  const [isActivatorGuideOpen, setIsActivatorGuideOpen] = useState(false);
  const [isStoresGuideOpen, setIsStoresGuideOpen] = useState(false);
  const [isCardsGuideOpen, setIsCardsGuideOpen] = useState(false);
  const [isSocialGuideOpen, setIsSocialGuideOpen] = useState(false);
  const [isSteamGuideOpen, setIsSteamGuideOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const words = ['Dolphin Anty', 'Proxy6', 'Zarub'];
  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseTime = 2000;

  useEffect(() => {
    const currentWord = words[wordIndex];
    
    const handleTyping = () => {
      if (!isDeleting) {
        setPlaceholderText(currentWord.substring(0, placeholderText.length + 1));
        if (placeholderText.length === currentWord.length) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        setPlaceholderText(currentWord.substring(0, placeholderText.length - 1));
        if (placeholderText.length === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    const timeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, wordIndex]);

  useEffect(() => {
    const handleRouteChange = () => {
      const nextCategory = getCategoryFromPath();
      setActiveCategory(nextCategory);
      setSubFilter(getDefaultSubFilter());
      setSearchQuery('');
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    const sectionSeo = SECTION_SEO[activeCategory];
    const canonicalUrl = `${SITE_URL}${sectionSeo.route}`;
    const title = sectionSeo.title[lang];
    const description = sectionSeo.description[lang];

    const setMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    document.documentElement.lang = lang;
    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[property="og:image"]', 'property', 'og:image', `${SITE_URL}/logo.png`);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', `${SITE_URL}/logo.png`);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    let structuredData = document.head.querySelector<HTMLScriptElement>('#structured-data');
    if (!structuredData) {
      structuredData = document.createElement('script');
      structuredData.id = 'structured-data';
      structuredData.type = 'application/ld+json';
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url: canonicalUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: "Hopscup's Tools Hub",
        url: SITE_URL,
      },
      inLanguage: lang === 'ru' ? 'ru-RU' : 'en',
    });
  }, [activeCategory, lang]);

  const normalizeSearchText = (value: string) =>
    value
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/https?:\/\//g, '')
      .replace(/www\./g, '')
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .trim();

  const compactSearchText = (value: string) => normalizeSearchText(value).replace(/\s+/g, '');

  const collectSearchText = (value: unknown): string[] => {
    if (value === null || value === undefined) return [];
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return [String(value)];
    if (Array.isArray(value)) return value.flatMap(collectSearchText);
    if (typeof value === 'object') return Object.values(value as Record<string, unknown>).flatMap(collectSearchText);
    return [];
  };

  const filteredOffers = useMemo(() => {
    const query = normalizeSearchText(searchQuery);
    const compactQuery = compactSearchText(searchQuery);
    const hasQuery = query.length > 0;

    return OFFERS.filter(o => {
      if (!hasQuery) {
        const matchesCategory = o.category === activeCategory;
        const matchesSub = subFilter === 'None' || o.subCategory === subFilter;
        return matchesCategory && matchesSub;
      }

      const categoryData = CATEGORIES.find(c => c.id === o.category);
      const searchableText = collectSearchText([
        o,
        categoryData?.title,
        o.subCategory,
      ]).join(' ');
      const normalizedText = normalizeSearchText(searchableText);
      const compactText = compactSearchText(searchableText);

      return normalizedText.includes(query) || (compactQuery.length > 1 && compactText.includes(compactQuery));
    });
  }, [activeCategory, subFilter, searchQuery]);

  const renderGuideIcon = (id: string, className: string) => {
    const guideIcons: Record<string, any> = {
      'guide-mobile-ip': Smartphone,
      'guide-gmail-forwarding': Mail,
      'guide-account-farm': Users,
      'guide-otc-kyc': Shield,
      'guide-uids-addresses': Database,
    };
    const Icon = guideIcons[id] || FileText;
    return <Icon className={className} />;
  };

  const t = {
    heroTitle: lang === 'ru' ? "Hopscup's Tools Hub" : "Hopscup's Tools Hub",
    heroSub: lang === 'ru' ? 'Здесь собраны все полезные сервисы, которые я использую для работы' : 'Here are all the useful services that I use for my work',
    visitSite: lang === 'ru' ? 'Перейти' : 'Visit',
    promo: lang === 'ru' ? 'Промокод' : 'Promo',
    popular: lang === 'ru' ? 'Популярное' : 'Popular',
    bestChoice: lang === 'ru' ? 'Лучший выбор' : 'Best Choice',
    footer: lang === 'ru' ? 'Сделано с душой для Hopscup Crew' : 'Made with soul for Hopscup Crew',
    textGuide: lang === 'ru' ? 'Текстовый гайд' : 'Text Guide',
    videoGuide: lang === 'ru' ? 'Видео гайд' : 'Video Guide',
    all: lang === 'ru' ? 'Все' : 'All',
    issuance: lang === 'ru' ? 'Выпуск' : 'Issuance',
    maintenance: lang === 'ru' ? 'Обслуживание' : 'Monthly Fee',
    verification: lang === 'ru' ? 'Верификация (KYC)' : 'Verification (KYC)',
    cashback: lang === 'ru' ? 'Кешбек' : 'Cashback',
    topup: lang === 'ru' ? 'Пополнение' : 'Top-up',
    type: lang === 'ru' ? 'Тип' : 'Type',
    geo: lang === 'ru' ? 'ГЕО' : 'GEO',
    accounts: lang === 'ru' ? 'Аккаунты:' : 'Accounts:',
    payment: lang === 'ru' ? 'Оплата:' : 'Payment:',
    yearLabel: lang === 'ru' ? 'года' : 'year',
    guideTitle: lang === 'ru' ? 'Как выбрать аккаунт правильно?' : 'How to choose an account correctly?',
    paymentMethods: lang === 'ru' ? 'Способы оплаты' : 'Payment Methods',
    platforms: lang === 'ru' ? 'Платформы' : 'Platforms',
    freeProfiles: lang === 'ru' ? 'Бесплатные профили' : 'Free Profiles',
    tariffStart: lang === 'ru' ? 'Стартовый тариф' : 'Starter Plan',
    profiles100: lang === 'ru' ? '100 профилей' : '100 Profiles',
    whatToPay: lang === 'ru' ? 'Что можно оплачивать:' : 'Supported Services:',
    nuances: lang === 'ru' ? 'Нюансы и ограничения:' : 'Nuances & Limitations:',
    pros: lang === 'ru' ? 'Плюсы:' : 'Pros:',
    rate: lang === 'ru' ? 'Процент пополнения' : 'Top-up Rate',
    description: lang === 'ru' ? 'Описание' : 'Description',
    emptyCategory: lang === 'ru' ? 'В этой категории пока пусто' : 'Empty Category',
    visit: lang === 'ru' ? 'Перейти' : 'Visit Site',
    open: lang === 'ru' ? 'Открыть' : 'View Details',
    types: lang === 'ru' ? 'Типы' : 'Types',
    subFilters: {
      Proxy: lang === 'ru' ? 'Прокси' : 'Proxy',
      VPN: lang === 'ru' ? 'VPN' : 'VPN',
      PCBasic: lang === 'ru' ? 'ПК базовые' : 'PC Basic',
      PCAdvanced: lang === 'ru' ? 'ПК усиленные' : 'PC Advanced',
      Mobile: lang === 'ru' ? 'Мобильные' : 'Mobile',
      NoKYC: lang === 'ru' ? 'Без KYC' : 'No KYC',
      WithKYC: lang === 'ru' ? 'С KYC' : 'With KYC',
      CardCrypto: lang === 'ru' ? 'Карты/Крипта' : 'Cards/Crypto',
      USDTQR: lang === 'ru' ? 'USDT QR' : 'USDT QR',
      Web: lang === 'ru' ? 'Сайты' : 'Websites',
      Bot: lang === 'ru' ? 'Боты в Telegram' : 'Telegram Bots',
      BoostSites: lang === 'ru' ? 'Сайты накрутки' : 'Boost Sites',
      Bux: lang === 'ru' ? 'Буксы' : 'Task Exchanges',
      SteamFast: lang === 'ru' ? 'Быстро по логину' : 'Fast by login',
      SteamItems: lang === 'ru' ? 'Через предметы' : 'Through items',
    },
    proxyTypes: {
      static: lang === 'ru' ? 'Статические' : 'Static Proxy',
      residential: lang === 'ru' ? 'Резидентские' : 'Residential',
    },
    tipsHeader: lang === 'ru' ? 'Общие советы по обмену крипты:' : 'General crypto exchange tips:',
    tips: lang === 'ru' ? [
      'Перед обменом сверяй курс, комиссию, сеть и минимальную сумму.',
      'Первый перевод делай тестовой суммой, особенно если используешь новый адрес.',
      'Для крупных сумм заранее согласовывай формат сделки и реквизиты с менеджером.'
    ] : [
      'Before exchanging, check the rate, fee, network, and minimum amount.',
      'Make the first transfer with a small test amount, especially with a new address.',
      'For larger amounts, agree on the deal format and payment details with a manager first.'
    ],
    social: lang === 'ru' ? [
      { id: 'yt', icon: Youtube, url: 'https://www.youtube.com/@hopscup' },
      { id: 'tg', icon: Send, url: 'https://t.me/hopscupcrpt' }
    ] : [
      { id: 'yt', icon: Youtube, url: 'https://www.youtube.com/@Hopscup_eng' },
      { id: 'tw', icon: X, url: 'https://x.com/hopscup' }
    ]
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(err => {
        console.error('Clipboard write failed', err);
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const scrollToPageTop = () => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleCategoryChange = (cat: CategoryType) => {
    const nextRoute = CATEGORY_ROUTES[cat];
    if (window.location.pathname !== nextRoute) {
      window.history.pushState(null, '', nextRoute);
    }
    setActiveCategory(cat);
    setSubFilter(getDefaultSubFilter());
    setSearchQuery('');
    scrollToPageTop();
  };

  const activeCategoryData = CATEGORIES.find(c => c.id === activeCategory);
  const currentSectionSeo = SECTION_SEO[activeCategory];
  const hasSectionControls = Boolean(activeCategoryData?.subFilters || activeCategoryData?.guides || activeCategory === 'SMS');

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) => {
    if (!value) return null;

    return (
      <div className="flex items-start gap-4 rounded-2xl bg-white/[0.035] border border-white/[0.07] p-[18px] min-h-[82px]">
        <div className="w-9 h-9 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-brand-purple" />
        </div>
        <div className="min-w-0 pt-0.5 pr-1">
          <span className="block text-white/25 uppercase tracking-[0.18em] font-black text-[9px] mb-1.5">
            {label}
          </span>
          <span className="block text-xs md:text-sm text-white/70 font-bold leading-relaxed">
            {value}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-brand-purple selection:text-white relative">
      <BackgroundParticles />
      <div className="mesh-gradient" />
      
      {/* Unified Header & Navigation */}
      <div className="sticky top-0 z-[90] bg-bg-dark/70 backdrop-blur-2xl border-b border-white/5 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
        {/* Top Row: Logo & Language Toggle */}
        <div className="py-2 px-6 md:px-12 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-4">
            <a href="/" aria-label="Hopscup's Tools Hub" className="w-10 h-10 rounded-xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5 transition-transform hover:scale-105">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </a>
            
            <div className="hidden sm:flex items-center gap-2">
              {t.social?.map((social) => {
                const Icon = social.icon;
                if (!Icon) return null;
                return (
                  <motion.a 
                    key={social.id}
                    whileHover={{ scale: 1.1 }}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 rounded-lg hover:bg-brand-purple/20 transition-all border border-white/5 hover:border-brand-purple/30"
                  >
                    <Icon className="w-4 h-4 text-white/40 hover:text-brand-purple transition-colors" />
                  </motion.a>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageToggle lang={lang} setLang={setLang} />
          </div>
        </div>

        {/* Bottom Row: Categories */}
        <div className="py-3 px-4 overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon || Globe;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold transition-all duration-300 border whitespace-nowrap group ${
                    isActive 
                      ? 'bg-brand-purple border-brand-purple shadow-[0_0_25px_rgba(129,28,254,0.3)] scale-105 text-white' 
                      : 'bg-white/[0.04] hover:bg-white/[0.1] border-white/10 text-white/60 hover:text-white hover:border-brand-purple/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="tracking-widest uppercase text-[9px]">{cat.title[lang]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 md:pt-20 pb-12 px-6 max-w-6xl mx-auto text-center relative z-10 font-display">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 id="hero-title" className="text-5xl md:text-8xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            {t.heroTitle}
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            {t.heroSub}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-purple transition-colors" />
              <input 
                type="text"
                placeholder={placeholderText}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-4 px-10 focus:outline-none transition-all font-light text-white text-sm"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Sub-Filters & Section Guides */}
      {hasSectionControls && (
        <div className="max-w-6xl mx-auto px-6 mb-16 relative z-30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap justify-center gap-3">
              {activeCategoryData?.subFilters && (
                <>
                  <button
                    onClick={() => {
                      setSubFilter('None');
                      scrollToPageTop();
                    }}
                    className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                      subFilter === 'None' 
                        ? 'bg-brand-purple border-brand-purple text-white shadow-[0_0_20px_rgba(129,28,254,0.3)]' 
                        : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {t.all}
                  </button>
                  {activeCategoryData.subFilters.map(filter => (
                    <button
                      key={filter}
                      onClick={() => {
                        setSubFilter(filter);
                        scrollToPageTop();
                      }}
                      className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                        subFilter === filter 
                          ? 'bg-brand-purple border-brand-purple text-white shadow-[0_0_20px_rgba(129,28,254,0.3)]' 
                          : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      {t.subFilters[filter] || filter}
                    </button>
                  ))}
                </>
              )}
            </div>

            {activeCategoryData?.guides && (
              <div className="flex flex-wrap justify-center md:justify-end gap-3">
                {activeCategory === 'Proxy' ? (
                  <>
                    <button
                      onClick={() => setIsProxyCheckerOpen(true)}
                      className="flex items-center gap-2.5 px-8 py-4 bg-white/[0.04] hover:bg-brand-purple text-brand-purple hover:text-white rounded-2xl border-2 border-brand-purple/30 shadow-[0_0_20px_rgba(129,28,254,0.1)] hover:shadow-[0_0_30px_rgba(129,28,254,0.3)] transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      <Search className="w-5 h-5" />
                      {lang === 'ru' ? 'Прокси чекер' : 'Proxy checker'}
                    </button>
                    <button
                      onClick={() => setIsProxyGuideOpen(true)}
                      className="flex items-center gap-2.5 px-8 py-4 bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white rounded-2xl border-2 border-brand-purple/30 shadow-[0_0_20px_rgba(129,28,254,0.1)] hover:shadow-[0_0_30px_rgba(129,28,254,0.3)] transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      <Zap className="w-5 h-5" />
                      {lang === 'ru' ? 'Какие прокси мне выбрать?' : 'Which proxies should I choose?'}
                    </button>
                  </>
                ) : activeCategory === 'Antidetect' ? (
                  <button
                    onClick={() => setIsAntidetectGuideOpen(true)}
                    className="flex items-center gap-2.5 px-8 py-4 bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white rounded-2xl border-2 border-brand-purple/30 shadow-[0_0_20px_rgba(129,28,254,0.1)] hover:shadow-[0_0_30px_rgba(129,28,254,0.3)] transition-all text-[10px] font-black uppercase tracking-widest"
                  >
                    <Zap className="w-5 h-5" />
                    {lang === 'ru' ? 'Какой антидетект выбрать?' : 'Which antidetect should I choose?'}
                  </button>
                ) : activeCategory === 'Stores' ? (
                  <>
                    <button 
                      onClick={() => setIsStoresGuideOpen(true)}
                      className="flex items-center gap-2.5 px-8 py-4 bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white rounded-2xl border-2 border-brand-purple/30 shadow-[0_0_20px_rgba(129,28,254,0.1)] hover:shadow-[0_0_30px_rgba(129,28,254,0.3)] transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      <Zap className="w-5 h-5" />
                      {t.guideTitle}
                    </button>
                  </>
                ) : activeCategory === 'Social' ? (
                  <>
                    <button
                      onClick={() => setIsSocialGuideOpen(true)}
                      className="flex items-center gap-2.5 px-8 py-4 bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white rounded-2xl border-2 border-brand-purple/30 shadow-[0_0_20px_rgba(129,28,254,0.1)] hover:shadow-[0_0_30px_rgba(129,28,254,0.3)] transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      <Users className="w-5 h-5" />
                      {lang === 'ru' ? 'Где брать рефералов?' : 'Where to get referrals?'}
                    </button>
                    <a
                      href={SOCIAL_VIDEO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-8 py-4 bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white rounded-2xl border-2 border-brand-purple/30 shadow-[0_0_20px_rgba(129,28,254,0.1)] hover:shadow-[0_0_30px_rgba(129,28,254,0.3)] transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      <Video className="w-5 h-5" />
                      {t.videoGuide}
                    </a>
                  </>
                ) : activeCategory === 'Steam' ? (
                  <>
                    <button
                      onClick={() => setIsSteamGuideOpen(true)}
                      className="flex items-center gap-2.5 px-8 py-4 bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white rounded-2xl border-2 border-brand-purple/30 shadow-[0_0_20px_rgba(129,28,254,0.1)] hover:shadow-[0_0_30px_rgba(129,28,254,0.3)] transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      <Zap className="w-5 h-5" />
                      {lang === 'ru' ? 'Как выгодно пополнять Steam?' : 'How to top up Steam profitably?'}
                    </button>
                    <a
                      href={STEAM_PRICE_TABLE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-8 py-4 bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white rounded-2xl border-2 border-brand-purple/30 shadow-[0_0_20px_rgba(129,28,254,0.1)] hover:shadow-[0_0_30px_rgba(129,28,254,0.3)] transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      <FileText className="w-5 h-5" />
                      {lang === 'ru' ? 'Таблица цен' : 'Price table'}
                    </a>
                  </>
                ) : activeCategory === 'Cards' ? (
                  <>
                    <button
                      onClick={() => setIsCardsGuideOpen(true)}
                      className="flex items-center gap-2.5 px-8 py-4 bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white rounded-2xl border-2 border-brand-purple/30 shadow-[0_0_20px_rgba(129,28,254,0.1)] hover:shadow-[0_0_30px_rgba(129,28,254,0.3)] transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      <CreditCard className="w-5 h-5" />
                      {lang === 'ru' ? 'Зачем нужна зарубежная карта?' : 'Why use a foreign card?'}
                    </button>
                    <a
                      href={CARDS_VIDEO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-8 py-4 bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white rounded-2xl border-2 border-brand-purple/30 shadow-[0_0_20px_rgba(129,28,254,0.1)] hover:shadow-[0_0_30px_rgba(129,28,254,0.3)] transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      <Video className="w-5 h-5" />
                      {t.videoGuide}
                    </a>
                  </>
                ) : (
                  <>
                    {typeof activeCategoryData.guides.text === 'string' && activeCategoryData.guides.text !== '#' && (
                      <a 
                        href={activeCategoryData.guides.text} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-8 py-4 bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white rounded-2xl border-2 border-brand-purple/30 shadow-[0_0_20px_rgba(129,28,254,0.1)] hover:shadow-[0_0_30px_rgba(129,28,254,0.3)] transition-all text-[10px] font-black uppercase tracking-widest"
                      >
                        <FileText className="w-5 h-5" />
                        {t.textGuide}
                      </a>
                    )}
                    {activeCategoryData.guides.video && activeCategoryData.guides.video !== '#' && (
                      <a 
                        href={activeCategoryData.guides.video} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-8 py-4 bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white rounded-2xl border-2 border-brand-purple/30 shadow-[0_0_20px_rgba(129,28,254,0.1)] hover:shadow-[0_0_30px_rgba(129,28,254,0.3)] transition-all text-[10px] font-black uppercase tracking-widest"
                      >
                        <Video className="w-5 h-5" />
                        {t.videoGuide}
                      </a>
                    )}
                  </>
                )}
              </div>
            )}

            {activeCategory === 'SMS' && (
              <div className="flex justify-center w-full md:w-auto">
                <button
                  onClick={() => setIsActivatorGuideOpen(true)}
                  className="flex items-center gap-2.5 px-10 py-5 bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white rounded-2xl border-2 border-brand-purple/30 shadow-[0_0_20px_rgba(129,28,254,0.1)] hover:shadow-[0_0_30px_rgba(129,28,254,0.3)] transition-all text-[12px] font-black uppercase tracking-widest"
                >
                  <Zap className="w-5 h-5" />
                  {lang === 'ru' ? 'Как правильно выбрать активатор?' : 'How to choose an activator?'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-6 pt-2 min-h-[400px] relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredOffers.length > 0 ? (
            activeCategory === 'Guides' ? (
              <div className="max-w-4xl mx-auto w-full space-y-4">
                {filteredOffers.map((offer, index) => (
                  <motion.a
                    layout
                    key={offer.id}
                    href={offer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className="group flex items-center gap-5 w-full min-h-[88px] rounded-[1.5rem] border border-white/10 bg-[#111111]/80 px-5 md:px-7 py-5 backdrop-blur-xl shadow-2xl hover:border-brand-purple/50 hover:bg-brand-purple/10 hover:shadow-[0_0_45px_rgba(129,28,254,0.18)] transition-all duration-300"
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 shrink-0 flex items-center justify-center group-hover:bg-brand-purple group-hover:border-brand-purple transition-all duration-300">
                      {renderGuideIcon(offer.id, 'w-6 h-6 md:w-7 md:h-7 text-brand-purple group-hover:text-white transition-colors')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-display font-bold text-base md:text-xl leading-snug group-hover:text-white transition-colors">
                        {offer.name}
                      </h3>
                    </div>
                    <ExternalLink className="w-5 h-5 text-white/25 group-hover:text-brand-purple shrink-0 transition-colors" />
                  </motion.a>
                ))}
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
              {filteredOffers.map((offer, index) => (
                <motion.div
                  layout
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#111111]/80 backdrop-blur-xl p-7 rounded-[1.5rem] group flex flex-col justify-between gap-8 relative overflow-hidden h-full border border-white/5 shadow-2xl hover:border-brand-purple/30 hover:shadow-[0_0_60px_rgba(129,28,254,0.15)] transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="relative z-10">
                    {offer.category === 'Stores' || offer.category === 'SMS' || offer.category === 'Cards' ? (
                      // --- Special Layout (Reference Image Style) ---
                      <div className="space-y-8">
                        <div className="flex gap-4 items-center min-h-[64px]">
                          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shrink-0">
                            <img
                              src={offer.logoUrl}
                              alt={offer.name}
                              onError={(event) => {
                                event.currentTarget.src = '/logo.png';
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h3 className="font-display font-bold text-xl text-white group-hover:text-brand-purple transition-colors tracking-tight leading-tight">
                              {offer.name}
                            </h3>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          <InfoRow icon={Coins} label={t.paymentMethods} value={offer.details?.paymentMethods?.[lang]} />
                          <InfoRow icon={Globe} label={t.geo} value={offer.details?.geo?.[lang]} />
                          <InfoRow icon={Layers} label={t.types} value={offer.details?.types?.[lang]} />
                          <InfoRow icon={Monitor} label={t.platforms} value={offer.platforms?.join(', ')} />
                        </div>
                      </div>
                    ) : (
                      // --- Standard Layout for other categories ---
                      <>
                        <div className="flex gap-5 mb-8 items-center min-h-[64px]">
                          {offer.category === 'Guides' ? (
                            <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 shrink-0 group-hover:border-brand-purple/60 group-hover:bg-brand-purple/15 transition-colors flex items-center justify-center shadow-[0_0_30px_rgba(129,28,254,0.12)]">
                              <FileText className="w-7 h-7 text-brand-purple" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shrink-0 group-hover:border-brand-purple/50 transition-colors">
                              <img
                                src={offer.logoUrl}
                                alt={offer.name}
                                onError={(event) => {
                                  event.currentTarget.src = '/logo.png';
                                }}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="space-y-1">
                            <h3 className="font-display font-bold text-2xl text-white group-hover:text-brand-purple transition-colors tracking-tight">
                              {offer.name}
                            </h3>
                          </div>
                        </div>

                        {offer.category !== 'Cards' && offer.category !== 'Stores' && offer.category !== 'Proxy' && offer.category !== 'Antidetect' && offer.category !== 'Crypto' && offer.category !== 'Social' && offer.category !== 'VPS' && offer.category !== 'Steam' && offer.category !== 'Guides' && (
                          <p className="text-white/60 text-base mb-6 leading-relaxed font-medium min-h-[3.5rem] group-hover:text-white transition-colors">
                            {offer.description[lang]}
                          </p>
                        )}

                        {offer.category === 'SMS_Standard_Legacy' && (
                          <div className="space-y-4 mb-6 min-h-[3.5rem]">
                            {offer.details?.geo && (
                              <div className="flex items-center gap-2 text-white/40 font-black uppercase text-[10px] tracking-widest">
                                <Globe className="w-3.5 h-3.5 text-brand-purple" />
                                <span>{t.geo}:</span>
                                <span className="text-white/80">{offer.details.geo[lang]}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-white/40 font-black uppercase text-[10px] tracking-widest">
                              <Coins className="w-3.5 h-3.5 text-brand-purple" />
                              <span>{t.paymentMethods}:</span>
                            </div>
                            <p className="text-[11px] text-white/60 font-medium leading-tight">
                              {offer.details?.paymentMethods?.[lang]}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {offer.cardStats && (
                      <div className="flex flex-col gap-4 mb-8 py-6 border-y border-white/10">
                        <div className="flex justify-between items-center px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                            <span className="text-[12px] text-white/30 uppercase font-black tracking-[0.2em]">{t.issuance}</span>
                          </div>
                          <span className="text-base text-brand-purple font-black">{offer.cardStats.issuance[lang]}</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                            <span className="text-[12px] text-white/30 uppercase font-black tracking-[0.2em]">{t.maintenance}</span>
                          </div>
                          <span className="text-base text-brand-purple font-black">{offer.cardStats.maintenance[lang]}</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                            <span className="text-[12px] text-white/30 uppercase font-black tracking-[0.2em]">Apple/Google Pay</span>
                          </div>
                          <span className="text-base text-white/80 font-bold whitespace-nowrap">{offer.cardStats.paySystems[lang]}</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                            <span className="text-[12px] text-white/30 uppercase font-black tracking-[0.2em]">{t.verification}</span>
                          </div>
                          <span className="text-base text-white/80 font-bold">{offer.cardStats.verification[lang]}</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                            <span className="text-[12px] text-white/30 uppercase font-black tracking-[0.2em]">{t.cashback}</span>
                          </div>
                          <span className="text-base text-white/80 font-bold">{offer.cardStats.cashback[lang]}</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                            <span className="text-[12px] text-white/30 uppercase font-black tracking-[0.2em]">{t.topup}</span>
                          </div>
                          <span className="text-base text-white/80 font-bold whitespace-nowrap overflow-hidden text-ellipsis ml-2 max-w-[120px] text-right">{offer.cardStats.topup[lang]}</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                            <span className="text-[12px] text-white/30 uppercase font-black tracking-[0.2em]">{t.type}</span>
                          </div>
                          <span className="text-base text-white/80 font-bold whitespace-nowrap overflow-hidden text-ellipsis ml-2 max-w-[120px] text-right">{offer.cardStats.type[lang]}</span>
                        </div>
                      </div>
                    )}

                    {(offer.details || offer.platforms?.length) && offer.category !== 'Stores' && offer.category !== 'SMS' && offer.category !== 'Cards' && (
                      <div className="flex flex-col gap-4 mb-8">
                        <InfoRow icon={Users} label={t.freeProfiles} value={offer.freeProfiles?.[lang]} />
                        <InfoRow icon={CreditCard} label={t.tariffStart} value={offer.tariffStartPrice?.[lang]} />
                        <InfoRow icon={Percent} label={t.rate} value={offer.details?.rate?.[lang]} />
                        <InfoRow icon={Globe} label={t.geo} value={offer.details?.geo?.[lang]} />
                        <InfoRow icon={Layers} label={t.types} value={offer.details?.types?.[lang]} />
                        <InfoRow icon={Monitor} label={t.platforms} value={offer.platforms?.join(', ')} />
                        <InfoRow icon={Coins} label={t.paymentMethods} value={offer.details?.paymentMethods?.[lang]} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 relative z-10 pt-1">
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => setSelectedOffer(offer)}
                        className="w-full flex items-center justify-center gap-3 py-5 bg-brand-purple hover:bg-white text-white hover:text-brand-purple border-2 border-brand-purple transition-all duration-300 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(157,88,255,0.2)] hover:shadow-[0_15px_40px_rgba(157,88,255,0.4)]"
                      >
                        {t.open}
                      </button>
                      {offer.promoCode && (
                        <button 
                          onClick={() => copyToClipboard(offer.promoCode || '')}
                          className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 rounded-[1.5rem] hover:bg-white/10 transition-all group/copy relative text-[10px] font-black uppercase tracking-widest text-brand-orange"
                        >
                          <Copy className="w-4 h-4" />
                          {t.promo}
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-brand-orange text-white text-[8px] rounded opacity-0 group-active/copy:opacity-100 transition-opacity">
                            Copied!
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            )
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/5 border-dashed"
            >
              <p className="text-white/40 uppercase tracking-[0.2em] font-black text-sm">
                {activeCategory === 'Antidetect' && subFilter === 'Mobile'
                  ? (lang === 'ru' ? 'Мобильные антидетекты скоро добавятся' : 'Mobile antidetects coming soon')
                  : t.emptyCategory}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* SEO Section Intro */}
      <section className="max-w-6xl mx-auto px-6 mt-16 relative z-10">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6 md:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.24em] text-brand-purple font-black mb-3">
                {activeCategoryData?.title[lang]}
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
                {currentSectionSeo.heading[lang]}
              </h2>
              <p className="text-sm md:text-base text-white/60 leading-relaxed">
                {currentSectionSeo.intro[lang]}
              </p>
            </div>
            <div className="grid gap-3 w-full lg:max-w-md">
              {currentSectionSeo.points[lang].map((point) => (
                <div key={point} className="flex gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                  <Star className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                  <span className="text-xs md:text-sm text-white/62 font-semibold leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Global Tips for Crypto */}
      {activeCategory === 'Crypto' && (
        <section className="max-w-6xl mx-auto px-6 mt-16">
          <div className="glass p-8 rounded-[2rem] border border-brand-purple/20 bg-brand-purple/5">
            <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-brand-purple" />
              {t.tipsHeader}
            </h3>
            <ul className="space-y-3">
              {(t.tips as string[]).map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-white/60 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <footer className="mt-20 py-12 text-center border-t border-white/5 relative z-10">
        <div className="flex justify-center gap-4 mb-8">
          {t.social.map((social) => {
            const Icon = social.icon;
            return (
              <motion.a 
                key={social.id}
                whileHover={{ scale: 1.1, y: -2 }}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/5 rounded-xl hover:bg-brand-purple/20 transition-all border border-white/5 hover:border-brand-purple/30"
              >
                <Icon className="w-5 h-5 text-white/50 hover:text-brand-purple transition-colors" />
              </motion.a>
            );
          })}
        </div>
        <p className="text-white/20 text-xs font-light tracking-widest uppercase">
          &copy; 2026 HopsCup Crew
        </p>
        <div className="mt-6 flex justify-center">
          <img
            src="/logo.png"
            alt="HopsCup"
            className="w-12 h-12 object-contain opacity-70 hover:opacity-100 transition-opacity"
          />
        </div>
      </footer>

      {/* Proxy Guide Modal */}
      <AnimatePresence>
        {isProxyGuideOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProxyGuideOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setIsProxyGuideOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl font-display font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {lang === 'ru' ? 'Какие прокси мне выбрать?' : 'Which proxies should I choose?'}
                </h2>

                <div className="space-y-8 text-white/70 text-sm md:text-base leading-relaxed font-medium">
                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-brand-purple" />
                      {lang === 'ru' ? 'Что стоит знать?' : 'What should you know?'}
                    </h3>
                    <p>
                      {lang === 'ru'
                        ? 'Прокси - это отдельный IP для профиля. VPN подходит для обычного использования, но для мультиакков, фарма, рекламы, ретродропов и большого количества аккаунтов почти всегда удобнее именно прокси: один профиль - один IP или своя понятная схема.'
                        : 'A proxy is a separate IP for a profile. VPN is fine for regular browsing, but for multi-accounting, farming, ads, retro drops, and many accounts, proxies are usually better: one profile gets one IP or another controlled setup.'}
                    </p>
                  </section>

                  <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-brand-orange font-bold text-lg mb-4">
                      {lang === 'ru' ? 'Если есть выбор протокола' : 'If there is a protocol choice'}
                    </h3>
                    <p>
                      {lang === 'ru'
                        ? 'Чаще всего берите SOCKS5. Это более универсальный вариант для антидетектов и рабочих профилей. HTTP тоже может работать, но если не знаете, что выбрать, начинайте с SOCKS5.'
                        : 'Usually choose SOCKS5. It is the more universal option for antidetect browsers and work profiles. HTTP can also work, but if you are unsure, start with SOCKS5.'}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {lang === 'ru' ? 'Базовые аккаунты и простые задачи' : 'Basic accounts and simple tasks'}
                    </h3>
                    <p>
                      {lang === 'ru' ? (
                        <>
                          Для Gmail, Twitter, Discord, Telegram, web3-проектов, Яндекса, базовых нейронок и небольшого количества аккаунтов до 20-30 штук чаще всего достаточно обычных <span className="text-brand-purple font-bold">IPv4</span>. Смотреть можно <span className="text-brand-purple font-bold">Proxyline</span>, <span className="text-brand-purple font-bold">Proxy6</span>, <span className="text-brand-purple font-bold">ProxyWing</span>, <span className="text-brand-purple font-bold">Proxys.io</span> и <span className="text-brand-purple font-bold">Proxy-Seller</span>.
                        </>
                      ) : (
                        <>
                          For Gmail, Twitter, Discord, Telegram, web3 projects, Yandex, basic AI tools, and up to 20-30 accounts, regular <span className="text-brand-purple font-bold">IPv4</span> is usually enough. Check <span className="text-brand-purple font-bold">Proxyline</span>, <span className="text-brand-purple font-bold">Proxy6</span>, <span className="text-brand-purple font-bold">ProxyWing</span>, <span className="text-brand-purple font-bold">Proxys.io</span>, and <span className="text-brand-purple font-bold">Proxy-Seller</span>.
                        </>
                      )}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {lang === 'ru' ? 'Сложнее задачи и рекламные кабинеты' : 'Harder tasks and ad cabinets'}
                    </h3>
                    <p>
                      {lang === 'ru' ? (
                        <>
                          Для браузерных нод, мультиакков бирж, части букмекерок, более сложного абуза, капризных сервисов и залива трафика лучше смотреть в сторону <span className="text-brand-purple font-bold">ISP</span>. Они дороже IPv4, но выглядят естественнее и часто проходят там, где обычные датацентровые IP уже детектятся.
                        </>
                      ) : (
                        <>
                          For browser nodes, exchange multi-accounting, some betting sites, more complex abuse, strict services, and ad traffic, look at <span className="text-brand-purple font-bold">ISP</span>. They cost more than IPv4 but look more natural and often work where datacenter IPs get detected.
                        </>
                      )}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {lang === 'ru' ? 'Максимальный траст и экономия трафика' : 'Maximum trust and traffic savings'}
                    </h3>
                    <p>
                      {lang === 'ru' ? (
                        <>
                          <span className="text-brand-purple font-bold">Residential</span> выглядят как домашний интернет и подходят почти под любые задачи, но обычно оплачиваются за гигабайты. Это удобно, если вы быстро настроили профиль, сделали действие и вышли. <span className="text-brand-purple font-bold">Mobile</span> - самый трастовый вариант с большим количеством сменяемых IP, но дороже и чаще требует работать с профилями по очереди.
                        </>
                      ) : (
                        <>
                          <span className="text-brand-purple font-bold">Residential</span> proxies look like home internet and fit almost any task, but are usually billed by traffic. They are convenient when you set up a profile, do the action, and leave. <span className="text-brand-purple font-bold">Mobile</span> is the most trusted option with many rotating IPs, but it is more expensive and often means working through profiles one by one.
                        </>
                      )}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-brand-orange" />
                      {lang === 'ru' ? 'Практические советы:' : 'Practical tips:'}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'IPv6 дешёвые, но многие сайты до сих пор работают с ними нестабильно. Если не уверены, лучше начинайте с IPv4.' : 'IPv6 proxies are cheap, but many sites still handle them poorly. If unsure, start with IPv4.'}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'Не берите shared-прокси для серьёзной работы: один IP уже могли продать нескольким людям, и его история может быть грязной.' : 'Avoid shared proxies for serious work: the same IP may be sold to several people, and its history can be dirty.'}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'После покупки проверьте IP через IPQS или Scamalytics. Fraud Score до 10-20 обычно окей, 20-30 ещё терпимо для базовых задач, выше уже повод задуматься или просить замену.' : 'After buying, check the IP with IPQS or Scamalytics. Fraud Score up to 10-20 is usually good, 20-30 can work for basic tasks, higher is a reason to reconsider or ask for replacement.'}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'Если аккаунтов мало, иногда можно сэкономить: обычная мобильная симка + режим самолёта даёт смену IP. Главное сохранять адекватное гео.' : 'For a small number of accounts, you can sometimes save money: a regular mobile SIM plus airplane mode can rotate IPs. Just keep GEO reasonable.'}</p>
                      </li>
                    </ul>
                  </section>
                </div>

                <div className="mt-12 flex justify-center">
                  <a
                    href={PROXY_ANTIDETECT_VIDEO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-12 py-5 bg-brand-purple text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(129,28,254,0.4)] transition-all"
                  >
                    <Video className="w-5 h-5" />
                    {lang === 'ru' ? 'Видео-гайд' : 'Video Guide'}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Proxy Checker Modal */}
      <AnimatePresence>
        {isProxyCheckerOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProxyCheckerOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setIsProxyCheckerOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8 md:p-10">
                <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center mb-6">
                  <Search className="w-7 h-7 text-brand-purple" />
                </div>

                <h2 className="text-3xl font-display font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {lang === 'ru' ? 'Прокси чекер' : 'Proxy checker'}
                </h2>

                <p className="text-white/60 text-sm md:text-base leading-relaxed font-medium mb-8">
                  {lang === 'ru'
                    ? 'После покупки прокси можно быстро проверить IP на риск, fraud score, VPN/proxy-детект и общее качество. Если показатели слишком плохие, лучше заменить IP до работы с аккаунтами. При этом IPv4 часто детектятся как VPN или proxy и получают ниже score просто потому, что они серверные. Это не критично: я редко проверяю обычные IPv4, если задача базовая.'
                    : 'After buying a proxy, you can quickly check IP risk, fraud score, VPN/proxy detection, and overall quality. If the score is too bad, replace the IP before using it with accounts. Server IPv4 proxies are often detected as VPN or proxy and get a lower score simply because they are datacenter IPs. This is not critical: I rarely check regular IPv4 for basic tasks.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="https://www.ipqualityscore.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-brand-purple hover:border-brand-purple px-5 py-5 transition-all"
                  >
                    <div>
                      <p className="text-white font-black text-base">IPQualityScore</p>
                      <p className="text-white/35 group-hover:text-white/70 text-[10px] uppercase tracking-widest font-black mt-1">
                        ipqualityscore.com
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-brand-purple group-hover:text-white shrink-0" />
                  </a>

                  <a
                    href="https://scamalytics.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-brand-purple hover:border-brand-purple px-5 py-5 transition-all"
                  >
                    <div>
                      <p className="text-white font-black text-base">Scamalytics</p>
                      <p className="text-white/35 group-hover:text-white/70 text-[10px] uppercase tracking-widest font-black mt-1">
                        scamalytics.com
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-brand-purple group-hover:text-white shrink-0" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Antidetect Guide Modal */}
      <AnimatePresence>
        {isAntidetectGuideOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAntidetectGuideOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setIsAntidetectGuideOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl font-display font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {lang === 'ru' ? 'Какой антидетект выбрать?' : 'Which antidetect should I choose?'}
                </h2>

                <div className="space-y-8 text-white/70 text-sm md:text-base leading-relaxed font-medium">
                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Laptop className="w-5 h-5 text-brand-purple" />
                      {lang === 'ru' ? 'Зачем он нужен?' : 'Why do you need it?'}
                    </h3>
                    <p>
                      {lang === 'ru'
                        ? 'Прокси меняет IP, но не делает вас новым пользователем полностью. Антидетект создаёт отдельные профили с разными отпечатками: для сайта каждый профиль выглядит как отдельный компьютер, браузер и пользователь.'
                        : 'A proxy changes the IP, but it does not fully make you a new user. An antidetect browser creates separate profiles with different fingerprints: each profile looks like a separate computer, browser, and user to the site.'}
                    </p>
                  </section>

                  <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-brand-orange font-bold text-lg mb-4">
                      {lang === 'ru' ? 'Главное правило настройки' : 'Main setup rule'}
                    </h3>
                    <p>
                      {lang === 'ru'
                        ? 'Не нужно менять все настройки подряд. В хорошем антидетекте база уже выставлена нормально. Проверяйте только ключевое: ОС под вашу реальную систему, WebRTC в режиме Proxy/Auto, язык/таймзона/гео по прокси, User-Agent на Auto или актуальный Chrome, разрешение экрана не выше вашего реального.'
                        : 'Do not change every setting manually. A good antidetect browser already has sane defaults. Check only the essentials: OS matching your real system, WebRTC in Proxy/Auto mode, language/timezone/GEO based on proxy, User-Agent on Auto or current Chrome, and screen resolution not above your real one.'}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {lang === 'ru' ? 'Для большинства задач' : 'For most tasks'}
                    </h3>
                    <p>
                      {lang === 'ru' ? (
                        <>
                          Для Twitter, Gmail, Discord, Telegram, ретродропов, браузерных нод, web3 и обычных мультиакков чаще всего хватит <span className="text-brand-purple font-bold">Dolphin</span>, <span className="text-brand-purple font-bold">AdsPower</span>, <span className="text-brand-purple font-bold">Incogniton</span>, <span className="text-brand-purple font-bold">GoLogin</span> или похожих решений. У многих есть бесплатные профили, и для 10-20 аккаунтов этого часто достаточно.
                        </>
                      ) : (
                        <>
                          For Twitter, Gmail, Discord, Telegram, retro drops, browser nodes, web3, and normal multi-accounting, <span className="text-brand-purple font-bold">Dolphin</span>, <span className="text-brand-purple font-bold">AdsPower</span>, <span className="text-brand-purple font-bold">Incogniton</span>, <span className="text-brand-purple font-bold">GoLogin</span>, or similar tools are usually enough. Many have free profiles, which is often enough for 10-20 accounts.
                        </>
                      )}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {lang === 'ru' ? 'Для сильного антифрода' : 'For stronger antifraud'}
                    </h3>
                    <p>
                      {lang === 'ru' ? (
                        <>
                          Для букмекерок, казино, абуза бирж и задач, где сервис защищает деньги напрямую, лучше смотреть на усиленные варианты: <span className="text-brand-purple font-bold">Vision</span>, <span className="text-brand-purple font-bold">Octo Browser</span>, <span className="text-brand-purple font-bold">Multilogin</span>. Они дороже и обычно без щедрых бесплатных профилей, но глубже работают с браузерным окружением.
                        </>
                      ) : (
                        <>
                          For betting, casinos, exchange abuse, and tasks where the service protects money directly, look at stronger options: <span className="text-brand-purple font-bold">Vision</span>, <span className="text-brand-purple font-bold">Octo Browser</span>, <span className="text-brand-purple font-bold">Multilogin</span>. They cost more and usually do not have generous free profiles, but they work deeper with the browser environment.
                        </>
                      )}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {lang === 'ru' ? 'Как экономить на профилях' : 'How to save on profiles'}
                    </h3>
                    <p>
                      {lang === 'ru'
                        ? 'Если нужно 10-20 аккаунтов, можно начать с бесплатных профилей в нескольких антидетектах и обычных IPv4 или мобильной симки со сменой IP. Если нужно 50-100 аккаунтов на месяц, тогда уже удобнее покупать дополнительные профили: из простых вариантов AdsPower/Dolphin, из усиленных Vision/Octo.'
                        : 'If you need 10-20 accounts, start with free profiles across several antidetect browsers plus regular IPv4 or a mobile SIM with IP rotation. If you need 50-100 accounts for a month, buying extra profiles becomes more convenient: AdsPower/Dolphin for simpler work, Vision/Octo for stronger setups.'}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-brand-orange" />
                      {lang === 'ru' ? 'Что проверять перед работой:' : 'What to check before working:'}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'IP, страна и timezone должны совпадать с прокси и выглядеть логично.' : 'IP, country, and timezone should match the proxy and look logical.'}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'WebRTC не должен показывать ваш реальный IP. В идеале виден только IP прокси.' : 'WebRTC must not reveal your real IP. Ideally, only the proxy IP is visible.'}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'Language, timezone, screen resolution и WebGL должны выглядеть как обычный живой пользователь, а не как странный тестовый стенд.' : 'Language, timezone, screen resolution, and WebGL should look like a normal real user, not a strange test setup.'}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'Куки-прогрев не обязателен всегда, но для сложных задач можно пару минут походить по сайту или использовать куки-робота.' : 'Cookie warming is not always required, but for harder tasks you can browse for a few minutes or use a cookie robot.'}</p>
                      </li>
                    </ul>
                  </section>
                </div>

                <div className="mt-12 flex justify-center">
                  <a
                    href={PROXY_ANTIDETECT_VIDEO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-12 py-5 bg-brand-purple text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(129,28,254,0.4)] transition-all"
                  >
                    <Video className="w-5 h-5" />
                    {lang === 'ru' ? 'Видео-гайд' : 'Video Guide'}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SMS Activator Guide Modal */}
      <AnimatePresence>
        {isActivatorGuideOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsActivatorGuideOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setIsActivatorGuideOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl font-display font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {lang === 'ru' ? 'Как правильно выбрать активатор?' : 'How to choose an activator?'}
                </h2>

                <div className="space-y-8 text-white/70 text-sm md:text-base leading-relaxed font-medium">
                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-brand-purple" />
                      {lang === 'ru' ? 'Что стоит знать?' : 'What should you know?'}
                    </h3>
                    <p>
                      {lang === 'ru' 
                        ? 'Сервисы виртуальных номеров работают примерно одинаково: вы арендуете номер, получаете на него код подтверждения и используете его для регистрации. Некоторые сервисы позволяют брать длительную аренду.' 
                        : 'Virtual number services work similarly: you rent a number, receive a confirmation code, and use it for registration. Some services offer long-term rentals.'}
                    </p>
                  </section>

                  <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-brand-orange font-bold text-lg mb-4">
                      {lang === 'ru' ? 'Основная проблема:' : 'Main problem:'}
                    </h3>
                    <p>
                      {lang === 'ru' 
                        ? 'В подборе подходящего номера и страны. Некоторые номера уже могли использоваться ранее, а отдельные площадки могут отклонять номера определённых операторов. Поэтому иногда приходится пробовать разные варианты. Если код так и не приходит, большинство сервисов автоматически возвращают средства за неудачную активацию, если код не был получен.' 
                        : 'Finding a suitable number and country. Some numbers might have been used before, and certain platforms may reject numbers from specific operators. Most services automatically refund if the code isn\'t received.'}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {lang === 'ru' ? 'Для оплаты российскими картами или через СБП' : 'For payment via Russian cards or SBP'}
                    </h3>
                    <p>
                      {lang === 'ru' ? (
                        <>
                          Хорошо подходят <a href="https://smsfast.pro/?ref=1100157" target="_blank" className="text-brand-purple hover:underline">SMS Fast</a> и <a href="https://365sms.vip/?ref=37269" target="_blank" className="text-brand-purple hover:underline">365-SMS</a>. Оба сервиса поддерживают российские способы оплаты и в целом показывают стабильную работу. Для повседневных задач чаще всего используют <a href="https://smsfast.pro/?ref=1100157" target="_blank" className="text-brand-purple hover:underline">SMS Fast</a> как основной вариант.
                        </>
                      ) : (
                        <>
                          <a href="https://smsfast.pro/?ref=1100157" target="_blank" className="text-brand-purple hover:underline">SMS Fast</a> and <a href="https://365sms.vip/?ref=37269" target="_blank" className="text-brand-purple hover:underline">365-SMS</a> are good choices. Both support Russian payment methods and are generally stable.
                        </>
                      )}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {lang === 'ru' ? 'Если оплачиваете криптовалютой или не СНГ банковской картой' : 'If paying with crypto or non-CIS cards'}
                    </h3>
                    <p>
                      {lang === 'ru' ? (
                        <>
                          Стоит обратить внимание на <a href="https://smspool.net/?r=AcN28TiKAr" target="_blank" className="text-brand-purple hover:underline">SMSPool</a> и <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">Hero SMS</a>. Сервис предлагает большой выбор номеров, показывает статистику успешности для каждого направления и имеет оперативную службу поддержки.
                        </>
                      ) : (
                        <>
                          Check <a href="https://smspool.net/?r=AcN28TiKAr" target="_blank" className="text-brand-purple hover:underline">SMSPool</a> and <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">Hero SMS</a>. Great selection, success stats, and quick support.
                        </>
                      )}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {lang === 'ru' ? 'Когда нужен большой объём номеров по минимальной цене' : 'When you need bulk numbers at min price'}
                    </h3>
                    <p>
                      {lang === 'ru' ? (
                        <>
                          Можно рассмотреть <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">HeroSMS</a> и <a href="https://tiger-sms.com/?ref=672048" target="_blank" className="text-brand-purple hover:underline">Tiger SMS</a>. Стоимость номеров там начинается примерно от $0.12–0.22. HeroSMS получил особую популярность после закрытия SMS-Activate в конце 2025 года.
                        </>
                      ) : (
                        <>
                          Consider <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">HeroSMS</a> and <a href="https://tiger-sms.com/?ref=672048" target="_blank" className="text-brand-purple hover:underline">Tiger SMS</a>. Prices start from $0.12–0.22.
                        </>
                      )}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-brand-orange" />
                      {lang === 'ru' ? 'Практические советы:' : 'Practical tips:'}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'Лучше брать номер той же страны, что прокси/впн. Но не всегда так. Например, для Telegram это не важно, а вот для Google уже имеет бОльшее значение.' : 'It is best to match the number\'s country with your proxy/VPN, though requirements vary (critical for Google, less so for Telegram).'}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? (
                          <>
                            Проверяйте нужный сервис+гео на % доходимости сообщений. Эта функция есть в - <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">HeroSMS</a>, <a href="https://grizzlysms.com/ru/?r=1654440" target="_blank" className="text-brand-purple hover:underline">GrizzlySMS</a>, <a href="https://smsfast.pro/?ref=1100157" target="_blank" className="text-brand-purple hover:underline">SMS Fast</a>, <a href="https://smspool.net/?r=AcN28TiKAr" target="_blank" className="text-brand-purple hover:underline">SMSPool</a>.
                          </>
                        ) : (
                          <>
                            Check delivery success rates for your target service and GEO. This feature is available on <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">HeroSMS</a>, <a href="https://grizzlysms.com/ru/?r=1654440" target="_blank" className="text-brand-purple hover:underline">GrizzlySMS</a>, <a href="https://smsfast.pro/?ref=1100157" target="_blank" className="text-brand-purple hover:underline">SMS Fast</a>, and <a href="https://smspool.net/?r=AcN28TiKAr" target="_blank" className="text-brand-purple hover:underline">SMSPool</a>.
                          </>
                        )}</p>
                      </li>
                    </ul>
                  </section>
                </div>

                <div className="mt-12 flex justify-center">
                  <a 
                    href="https://t.me/hopscupcrpt" 
                    target="_blank"
                    className="flex items-center gap-3 px-12 py-5 bg-brand-purple text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(129,28,254,0.4)] transition-all"
                  >
                    <FileText className="w-5 h-5" />
                    {lang === 'ru' ? 'Гайд-статья' : 'Guide Article'}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Account Shop Guide Modal */}
      <AnimatePresence>
        {isStoresGuideOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStoresGuideOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setIsStoresGuideOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl font-display font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {t.guideTitle}
                </h2>

                <div className="space-y-8 text-white/70 text-sm md:text-base leading-relaxed font-medium">
                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-brand-purple" />
                      {lang === 'ru' ? 'Где покупать аккаунты?' : 'Where to buy accounts?'}
                    </h3>
                    <p>
                      {lang === 'ru' ? (
                        <>
                          В основном я пользуюсь <a href="https://dark.shopping/category/view/gmail?p=95083" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">DarkStore</a> и <a href="https://funpay.com/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">FunPay</a> - вместе они закрывают примерно 95% моих потребностей. <span className="text-white font-bold">DarkStore</span> чаще беру для рабочих аккаунтов, почт, соцсетей и расходников. По DarkStore и покупке аккаунтов вроде Discord/Twitter есть отдельный <a href={STORE_ACCOUNTS_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">видео-гайд</a>. <span className="text-white font-bold">FunPay</span> удобен для подписок, ключей, игровых товаров, услуг и разных цифровых продуктов. Если нужно сравнить цены или найти редкую позицию, можно дополнительно смотреть <a href="https://ggsel.net/catalog/grand-theft-auto-vi?ai=1422112" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">GGsel</a>, <a href="https://plati.market/games/grand-theft-auto-vi/2027/?ai=1422112" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">Plati Market</a> и <a href="https://accsmarket.com/en/9vV7VOzI" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">AccsMarket</a>.
                        </>
                      ) : (
                        <>
                          I mainly use <a href="https://dark.shopping/category/view/gmail?p=95083" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">DarkStore</a> and <a href="https://funpay.com/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">FunPay</a>; together they cover roughly 95% of my needs. <span className="text-white font-bold">DarkStore</span> is mostly for work accounts, emails, social accounts, and consumables. There is a separate <a href={STORE_ACCOUNTS_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">video guide</a> for DarkStore and buying Discord/Twitter-style accounts. <span className="text-white font-bold">FunPay</span> is useful for subscriptions, keys, gaming goods, services, and other digital products. For price comparison or rare items, also check <a href="https://ggsel.net/catalog/grand-theft-auto-vi?ai=1422112" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">GGsel</a>, <a href="https://plati.market/games/grand-theft-auto-vi/2027/?ai=1422112" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">Plati Market</a>, and <a href="https://accsmarket.com/en/9vV7VOzI" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">AccsMarket</a>.
                        </>
                      )}
                    </p>
                  </section>

                  <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-brand-purple font-bold text-lg mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      {lang === 'ru' ? 'Бот-магазины' : 'Bot Shops'}
                    </h3>
                    <p>
                      {lang === 'ru' ? (
                        <>
                          Telegram-боты - это удобные мини-магазины, где чаще всего продаются дешёвые аккаунты и подписки на популярные нейросети и сервисы: Gemini, GPT, Claude, CapCut, Canva и похожие продукты. Про покупку дешёвых ИИ-подписок есть отдельный <a href={STORE_AI_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">видео-гайд</a>. Такие боты удобно проверять, когда нужна подписка “здесь и сейчас” или хочется найти цену ниже официальной. Из вариантов можно смотреть <a href="https://t.me/LachugaSkamera_Bot?start=ref_467483565" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">Лачугу скамера</a>, <a href="https://t.me/crassus_market_bot?start=467483565" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">Crassus Market</a>, <a href="https://t.me/vibecodinzz_bot?start=contest_ultra_ref_467483565" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">Apel0sin</a> и <a href="https://t.me/ptrv4_bot?start=467483565" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">Petrovich</a>.
                        </>
                      ) : (
                        <>
                          Telegram bots are convenient mini-shops that usually sell low-cost accounts and subscriptions for popular AI tools and services: Gemini, GPT, Claude, CapCut, Canva, and similar products. There is a separate <a href={STORE_AI_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">video guide</a> about buying cheap AI subscriptions. They are useful when you need a subscription right now or want a lower-than-official price. Options include <a href="https://t.me/LachugaSkamera_Bot?start=ref_467483565" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">Lachuga</a>, <a href="https://t.me/crassus_market_bot?start=467483565" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">Crassus Market</a>, <a href="https://t.me/vibecodinzz_bot?start=contest_ultra_ref_467483565" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">Apel0sin</a>, and <a href="https://t.me/ptrv4_bot?start=467483565" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">Petrovich</a>.
                        </>
                      )}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-brand-orange" />
                      {lang === 'ru' ? 'Правила покупки' : 'Purchase Rules'}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'Внимательно читаем описание и отзывы/рейтинг, количество покупок.' : 'Carefully read the description, reviews, rating, and number of purchases.'}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'Покупайте 1-2 сначала на тест. Потом 5-10.' : 'Buy 1-2 first for testing. Then 5-10.'}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'Не покупайте сразу 50-100 аккаунтов. Даже у крутого поставщика бывает плохой товар.' : 'Don\'t buy 50-100 accounts immediately. Even top suppliers can have bad stock.'}</p>
                      </li>
                    </ul>
                  </section>

                  <section className="p-6 bg-brand-purple/5 rounded-2xl border border-brand-purple/20">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-brand-purple" />
                      {lang === 'ru' ? 'Безопасность и гарантии' : 'Safety and Guarantees'}
                    </h3>
                    <p>
                      {lang === 'ru' 
                        ? 'Зачастую каждый сайт в этом разделе выступает гарантом. Поэтому деньги сразу не отпускайте. Сначала проверяйте выполнение условий.' 
                        : 'Most sites in this section act as a guarantor. Don\'t release the money immediately. Check if all conditions are met first.'}
                    </p>
                  </section>
                </div>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={STORE_AI_VIDEO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[72px] items-center gap-4 rounded-2xl border border-brand-purple/60 bg-brand-purple px-5 py-4 text-white shadow-[0_12px_32px_rgba(129,28,254,0.25)] transition-all hover:-translate-y-0.5 hover:bg-white hover:text-brand-purple hover:shadow-[0_16px_42px_rgba(129,28,254,0.35)]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 transition-colors group-hover:bg-brand-purple/10 group-hover:ring-brand-purple/20">
                      <Video className="w-5 h-5" />
                    </span>
                    <span className="min-w-0 text-left text-[11px] font-black uppercase leading-snug tracking-[0.16em]">
                      {lang === 'ru' ? 'ИИ подписки' : 'AI subscriptions'}
                    </span>
                  </a>
                  <a
                    href={STORE_ACCOUNTS_VIDEO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[72px] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white/70 transition-all hover:-translate-y-0.5 hover:border-brand-purple/50 hover:bg-brand-purple/10 hover:text-white"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/10 transition-colors group-hover:bg-brand-purple/15 group-hover:ring-brand-purple/30">
                      <Video className="w-5 h-5 text-brand-purple" />
                    </span>
                    <span className="min-w-0 text-left text-[11px] font-black uppercase leading-snug tracking-[0.16em]">
                      {lang === 'ru' ? 'Аккаунты DarkStore' : 'DarkStore accounts'}
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Social Boost Guide Modal */}
      <AnimatePresence>
        {isSocialGuideOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSocialGuideOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setIsSocialGuideOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl font-display font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {lang === 'ru' ? 'Где брать рефералов?' : 'Where to get referrals?'}
                </h2>

                <div className="space-y-8 text-white/70 text-sm md:text-base leading-relaxed font-medium">
                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-brand-purple" />
                      {lang === 'ru' ? 'Коротко' : 'Short version'}
                    </h3>
                    <p>
                      {lang === 'ru' ? (
                        <>
                          Есть два основных способа: <span className="text-brand-purple font-bold">сайты накрутки</span> и <span className="text-brand-purple font-bold">буксы</span>. Про ферму социальных аккаунтов я уже отдельно писал в <a href="https://t.me/hopscupcrpt/108" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">большой статье</a>, а здесь оставил именно сервисы, где можно брать рефералов под Telegram-ботов, активности и похожие задачи.
                        </>
                      ) : (
                        <>
                          There are two main ways: <span className="text-brand-purple font-bold">boost sites</span> and <span className="text-brand-purple font-bold">task exchanges</span>. I already wrote a bigger article about social account farms <a href="https://t.me/hopscupcrpt/108" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">here</a>; this section focuses on services where you can get referrals for Telegram bots, activity, and similar tasks.
                        </>
                      )}
                    </p>
                  </section>

                  <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-brand-purple font-bold text-lg mb-4 flex items-center gap-2">
                      <ThumbsUp className="w-5 h-5" />
                      {lang === 'ru' ? 'Сайты накрутки' : 'Boost sites'}
                    </h3>
                    <p>
                      {lang === 'ru'
                        ? 'Это самый быстрый и простой вариант: выбираете услугу, указываете ссылку или задачу, пополняете баланс и ждёте выполнение. Я пользовался ими активнее всего, потому что это удобно. Минус — ники и профили часто выглядят ботскими. Зато конкуренция среди сервисов выросла, и цены заметно снизились: например, реф в NotPixel мог стоить около 14 рублей.'
                        : 'This is the fastest and simplest option: choose a service, add a link or task, top up the balance, and wait for completion. I used these most actively because they are convenient. The downside is that names and profiles often look bot-like. Competition between services has grown, so prices became much lower.'
                      }
                    </p>
                  </section>

                  <section className="p-6 bg-brand-purple/5 rounded-2xl border border-brand-purple/20">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-brand-purple" />
                      {lang === 'ru' ? 'Буксы' : 'Task exchanges'}
                    </h3>
                    <p>
                      {lang === 'ru'
                        ? 'Буксы — это биржи заданий, где реальные люди выполняют простые действия за деньги. Вы регистрируетесь как заказчик, пополняете баланс и создаёте задание вроде “Регистрация в Telegram-боте”. В подтверждение можно просить Telegram-логин или скрин выполненного задания. Обычно регистрация в боте стоит от 7-10 рублей, но цена зависит от популярности задания и требований.'
                        : 'Task exchanges are platforms where real people complete simple actions for money. You register as a customer, top up your balance, and create a task like “Register in a Telegram bot”. For proof, you can ask for a Telegram username or a screenshot. A bot registration task often starts around 7-10 RUB, but the price depends on task popularity and requirements.'
                      }
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-brand-orange" />
                      {lang === 'ru' ? 'Что проверять' : 'What to check'}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'В буксах перед подтверждением проверяйте Telegram-логин, скрин, уникальность выполнения и повторы.' : 'On task exchanges, check the Telegram username, screenshot, uniqueness, and repeated submissions before approval.'}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'Не запускайте сразу большой объём: сначала сделайте тест на 10-20 выполнений и посмотрите качество.' : 'Do not start with high volume: test 10-20 completions first and check quality.'}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'Если важен внешний вид аккаунтов, буксы обычно выглядят естественнее сайтов накрутки, но требуют больше ручной проверки.' : 'If account appearance matters, task exchanges usually look more natural than boost sites, but require more manual checking.'}</p>
                      </li>
                    </ul>
                  </section>
                </div>

                <div className="mt-12 flex justify-center">
                  <a
                    href={SOCIAL_VIDEO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-12 py-5 bg-brand-purple text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(129,28,254,0.4)] transition-all"
                  >
                    <Video className="w-5 h-5" />
                    {t.videoGuide}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Steam Guide Modal */}
      <AnimatePresence>
        {isSteamGuideOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSteamGuideOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setIsSteamGuideOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl font-display font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {lang === 'ru' ? 'Как выгодно пополнять Steam?' : 'How to top up Steam profitably?'}
                </h2>

                <div className="space-y-8 text-white/70 text-sm md:text-base leading-relaxed font-medium">
                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Gamepad2 className="w-5 h-5 text-brand-purple" />
                      {lang === 'ru' ? 'Два сценария' : 'Two scenarios'}
                    </h3>
                    <p>
                      {lang === 'ru'
                        ? 'Если нужен результат сразу, проще пополнять Steam по логину: обычно это быстро, но с комиссией. Если готовы потратить время, можно купить предмет дешевле Steam Market, продать его в Steam и получить баланс в плюс. Второй способ выгоднее, но требует проверки цены и ликвидности.'
                        : 'If you need the result right away, direct login top-up is simpler: usually fast, but with a fee. If you are ready to spend some time, you can buy an item cheaper than on Steam Market, sell it on Steam, and get more balance. The second method is more profitable, but requires checking price and liquidity.'}
                    </p>
                  </section>

                  <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-brand-purple font-bold text-lg mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      {lang === 'ru' ? 'Быстро по логину' : 'Fast by login'}
                    </h3>
                    <p>
                      {lang === 'ru'
                        ? 'Для РФ самый простой бытовой вариант — найти Steam в поиске Сбербанка или OZON Банка и пополнить по логину. Обычно комиссия около 10%, зато всё происходит быстро и без предметов. Из маркетплейсов можно смотреть GGsel и Playerok: у Playerok часто встречается пополнение около 5%, но всегда проверяйте продавца, рейтинг и условия.'
                        : 'For Russia, the simplest everyday option is to search for Steam inside Sberbank or OZON Bank and top up by login. The fee is usually around 10%, but it is fast and does not involve items. Among marketplaces, check GGsel and Playerok: Playerok often has offers around 5%, but always check seller rating and terms.'}
                    </p>
                  </section>

                  <section className="p-6 bg-brand-purple/5 rounded-2xl border border-brand-purple/20">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Percent className="w-5 h-5 text-brand-purple" />
                      {lang === 'ru' ? 'Пополнение через предметы' : 'Top-up through items'}
                    </h3>
                    <p>
                      {lang === 'ru' ? (
                        <>
                          Для пополнения в плюс удобнее смотреть <a href="https://lis-skins.com/?rf=3576023" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">LIS-SKINS</a>, <a href="https://cs.money/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">CS.MONEY</a>, <a href="https://aim.market/p/6da48855-6e2a-4d1f-9ecc-fa767d6235bd" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">AIM.market</a> и <a href="https://tf2lavka.ru/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">TF2Lavka</a>. Я чаще использую LIS-SKINS, потому что там сразу видно разницу цены со Steam. TF2Lavka полезна, когда нужны Rust/TF2 предметы без долгого ожидания перед продажей, но конкретный предмет всё равно нужно проверять.
                        </>
                      ) : (
                        <>
                          For profitable top-ups, check <a href="https://lis-skins.com/?rf=3576023" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">LIS-SKINS</a>, <a href="https://cs.money/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">CS.MONEY</a>, <a href="https://aim.market/p/6da48855-6e2a-4d1f-9ecc-fa767d6235bd" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">AIM.market</a>, and <a href="https://tf2lavka.ru/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">TF2Lavka</a>. I usually use LIS-SKINS because it shows the price difference versus Steam. TF2Lavka is useful when you need Rust/TF2 items without a long wait before selling, but each item still needs checking.
                        </>
                      )}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-brand-orange" />
                      {lang === 'ru' ? 'Что проверять' : 'What to check'}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'Сверяйте цену предмета со Steam Market, а не только с процентом на сайте.' : 'Compare the item price with Steam Market, not only with the percentage shown on the site.'}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'Проверяйте ликвидность: у предмета могут быть красивые проценты, но мало покупок и долгий срок продажи.' : 'Check liquidity: an item may show a nice percentage but have few buyers and slow sale speed.'}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'Учитывайте комиссию Steam и возможные ограничения на трейд/маркет для конкретной игры и предмета.' : 'Account for Steam fees and possible trade/market restrictions for the specific game and item.'}</p>
                      </li>
                    </ul>
                  </section>
                </div>

                <div className="mt-12 flex justify-center">
                  <a
                    href={STEAM_PRICE_TABLE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-12 py-5 bg-brand-purple text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(129,28,254,0.4)] transition-all"
                  >
                    <FileText className="w-5 h-5" />
                    {lang === 'ru' ? 'Открыть таблицу цен' : 'Open price table'}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cards Guide Modal */}
      <AnimatePresence>
        {isCardsGuideOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCardsGuideOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setIsCardsGuideOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl font-display font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {lang === 'ru' ? 'Зачем нужна зарубежная карта?' : 'Why use a foreign card?'}
                </h2>

                <div className="space-y-8 text-white/70 text-sm md:text-base leading-relaxed font-medium">
                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-brand-purple" />
                      {lang === 'ru' ? 'В чём смысл?' : 'What is it for?'}
                    </h3>
                    <p>
                      {lang === 'ru'
                        ? 'Зарубежная виртуальная карта нужна, чтобы оплачивать иностранные сервисы, которые не принимают российские карты. Обычно её можно пополнить рублями через СБП или криптовалютой, а дальше платить как обычной Visa/Mastercard.'
                        : 'A foreign virtual card is used to pay for international services that do not accept Russian cards. Usually you can top it up with RUB via SBP or with crypto, then pay as with a regular Visa/Mastercard.'}
                    </p>
                  </section>

                  <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-brand-purple font-bold text-lg mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      {lang === 'ru' ? 'Что можно оплачивать?' : 'What can you pay for?'}
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {(lang === 'ru'
                        ? ['Airbnb, Booking, Aviasales', 'Google Play и App Store', 'ChatGPT, Claude, Gemini', 'Netflix, Spotify, YouTube', 'Amazon, eBay, AliExpress Global', 'OZON и часть RU-мерчантов']
                        : ['Airbnb, Booking, Aviasales', 'Google Play and App Store', 'ChatGPT, Claude, Gemini', 'Netflix, Spotify, YouTube', 'Amazon, eBay, AliExpress Global', 'OZON and some RU merchants']
                      ).map((item) => (
                        <span key={item} className="text-xs bg-brand-purple/10 px-4 py-2 rounded-xl text-brand-purple border border-brand-purple/20 font-bold">
                          {item}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-brand-orange" />
                      {lang === 'ru' ? 'Что использую я?' : 'What do I use?'}
                    </h3>
                    <p>
                      {lang === 'ru' ? (
                        <>
                          В основном я использую <a href="https://t.me/zarub_robot?start=ref_PqBrBs" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">Zarub</a>, потому что карта выпускается без KYC, пополняется через СБП или USDT и нормально проходит в большинстве нужных мне сервисов. Отдельный плюс: иногда проходит не только зарубежка, но и российские мерчанты, например OZON.
                        </>
                      ) : (
                        <>
                          I mainly use <a href="https://t.me/zarub_robot?start=ref_PqBrBs" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">Zarub</a> because it is issued without KYC, can be topped up via SBP or USDT, and works with most services I need. A separate plus: it can also work with some Russian merchants, for example OZON.
                        </>
                      )}
                    </p>
                  </section>

                  <section className="p-6 bg-brand-purple/5 rounded-2xl border border-brand-purple/20">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-brand-purple" />
                      {lang === 'ru' ? 'Практические советы' : 'Practical tips'}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'Не держите крупный баланс на карте: пополняйте под конкретную оплату.' : 'Do not keep a large balance on the card: top up for a specific payment.'}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'Перед важной покупкой сначала проверьте карту на небольшой оплате или дешёвой подписке.' : 'Before an important purchase, test the card with a small payment or cheap subscription.'}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{lang === 'ru' ? 'Если один сервис отклонил платёж, это не всегда значит, что карта плохая: у разных мерчантов разные антифрод-правила.' : 'If one service declines a payment, it does not always mean the card is bad: different merchants have different antifraud rules.'}</p>
                      </li>
                    </ul>
                  </section>
                </div>

                <div className="mt-12 flex justify-center">
                  <a
                    href={CARDS_VIDEO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-12 py-5 bg-brand-purple text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(129,28,254,0.4)] transition-all"
                  >
                    <Video className="w-5 h-5" />
                    {t.videoGuide}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Offer Detail Modal */}
      <AnimatePresence>
        {selectedOffer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOffer(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setSelectedOffer(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8">
                <div className="flex gap-6 mb-8">
                  {selectedOffer.category === 'Guides' ? (
                    <div className="w-20 h-20 rounded-3xl bg-brand-purple/10 border border-brand-purple/30 shrink-0 flex items-center justify-center shadow-[0_0_35px_rgba(129,28,254,0.14)]">
                      <FileText className="w-9 h-9 text-brand-purple" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 overflow-hidden shrink-0">
                      <img
                        src={selectedOffer.logoUrl || '/logo.png'}
                        alt={selectedOffer.name}
                        onError={(event) => {
                          event.currentTarget.src = '/logo.png';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-display font-bold tracking-tight">{selectedOffer.name}</h2>

                    </div>
                  </div>
                </div>

                <div className="space-y-8 overflow-y-auto max-h-[60vh] pr-2 scrollbar-thin">
                  <div>
                    <h4 className="text-[11px] uppercase font-black text-brand-purple tracking-[0.2em] mb-3">
                      {t.description}
                    </h4>
                    <p className="text-white/80 leading-relaxed text-base font-medium">
                      {selectedOffer.description[lang]}
                    </p>
                  </div>

                  {selectedOffer.cardStats && (
                    <div className="flex flex-col gap-4 py-6 border-y border-white/5">
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.issuance}
                          </h4>
                        </div>
                        <p className="text-brand-purple font-black text-lg">{selectedOffer.cardStats.issuance[lang]}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.maintenance}
                          </h4>
                        </div>
                        <p className="text-brand-purple font-black text-lg">{selectedOffer.cardStats.maintenance[lang]}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">Apple/Google Pay</h4>
                        </div>
                        <p className="text-white font-bold text-base">{selectedOffer.cardStats.paySystems[lang]}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.verification}
                          </h4>
                        </div>
                        <p className="text-white font-bold text-base">{selectedOffer.cardStats.verification[lang]}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.cashback}
                          </h4>
                        </div>
                        <p className="text-white font-bold text-base">{selectedOffer.cardStats.cashback[lang]}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.topup}
                          </h4>
                        </div>
                        <p className="text-white font-bold text-base">{selectedOffer.cardStats.topup[lang]}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.type}
                          </h4>
                        </div>
                        <p className="text-white font-bold text-base">{selectedOffer.cardStats.type[lang]}</p>
                      </div>
                    </div>
                  )}

                  {selectedOffer.details?.supports && (
                    <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10">
                      <h4 className="text-[11px] uppercase font-black text-white/40 tracking-[0.2em] mb-4">
                        {selectedOffer.category === 'Guides'
                          ? (lang === 'ru' ? 'Темы гайда:' : 'Guide Topics:')
                          : selectedOffer.category === 'Crypto'
                            ? (lang === 'ru' ? 'Что поддерживает:' : 'Supported Exchange Options:')
                            : t.whatToPay}
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {selectedOffer.details.supports[lang]?.map((item, i) => (
                          <span key={i} className="text-xs bg-brand-purple/10 px-4 py-2 rounded-xl text-brand-purple border border-brand-purple/20 font-bold">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedOffer.details?.nuances && (
                    <div className="space-y-4">
                      <h4 className="text-[11px] uppercase font-black text-brand-orange tracking-[0.2em]">
                        {t.nuances}
                      </h4>
                      <ul className="space-y-3">
                        {selectedOffer.details.nuances[lang]?.map((item, i) => (
                          <li key={i} className="text-sm text-white/50 flex gap-3 leading-relaxed">
                            <span className="text-brand-orange mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedOffer.details?.pros && (
                    <div className="space-y-4">
                      <h4 className="text-[11px] uppercase font-black text-green-400 tracking-[0.2em]">
                        {t.pros}
                      </h4>
                      <ul className="space-y-3">
                        {selectedOffer.details.pros[lang]?.map((item, i) => (
                          <li key={i} className="text-sm text-white/70 flex gap-3 leading-relaxed font-medium">
                            <span className="text-green-400 font-bold">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedOffer.details?.targetAudience && (
                    <div className="pt-4 border-t border-white/5 font-display italic text-white/30 text-xs text-center">
                      "{selectedOffer.details.targetAudience[lang]}"
                    </div>
                  )}

                  {!selectedOffer.cardStats && selectedOffer.priceInfo && (
                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
                      {selectedOffer.priceInfo?.main && (
                        <div>
                          <h4 className="text-[9px] uppercase font-black text-white/30 tracking-widest mb-1">{t.proxyTypes.static}</h4>
                          <p className="text-brand-purple font-bold">{selectedOffer.priceInfo.main[lang]}</p>
                        </div>
                      )}
                       {selectedOffer.priceInfo?.secondary && (
                        <div>
                          <h4 className="text-[9px] uppercase font-black text-white/30 tracking-widest mb-1">{t.proxyTypes.residential}</h4>
                          <p className="text-brand-purple font-bold">{selectedOffer.priceInfo.secondary[lang]}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {(selectedOffer.freeProfiles || selectedOffer.tariffStartPrice || selectedOffer.profiles100Price || selectedOffer.details?.rate || selectedOffer.details?.geo || selectedOffer.details?.types || selectedOffer.platforms?.length || selectedOffer.details?.paymentMethods) && (
                    <div className="space-y-6 py-6 border-y border-white/5">
                      {selectedOffer.freeProfiles && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                              {t.freeProfiles}
                            </h4>
                            <p className="text-white font-bold text-lg">{selectedOffer.freeProfiles[lang]}</p>
                          </div>
                        </div>
                      )}
                      {selectedOffer.tariffStartPrice && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <CreditCard className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                              {t.tariffStart}
                            </h4>
                            <p className="text-white font-bold text-lg">{selectedOffer.tariffStartPrice[lang]}</p>
                          </div>
                        </div>
                      )}
                      {selectedOffer.profiles100Price && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Layers className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                              {t.profiles100}
                            </h4>
                            <p className="text-white font-bold text-lg">{selectedOffer.profiles100Price[lang]}</p>
                          </div>
                        </div>
                      )}
                      {selectedOffer.details?.rate && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Percent className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                              {t.rate}
                            </h4>
                            <p className="text-white font-bold text-lg">{selectedOffer.details.rate[lang]}</p>
                          </div>
                        </div>
                      )}
                      {selectedOffer.details?.geo && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Globe className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                              {t.geo}
                            </h4>
                            <p className="text-white font-bold text-lg">{selectedOffer.details.geo[lang]}</p>
                          </div>
                        </div>
                      )}
                      {selectedOffer.details?.types && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Layers className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                              {t.types}
                            </h4>
                            <p className="text-white font-bold text-lg">{selectedOffer.details.types[lang]}</p>
                          </div>
                        </div>
                      )}
                      {!!selectedOffer.platforms?.length && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Monitor className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                              {t.platforms}
                            </h4>
                            <p className="text-white font-bold text-lg">{selectedOffer.platforms.join(', ')}</p>
                          </div>
                        </div>
                      )}
                      {selectedOffer.details?.paymentMethods && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Coins className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                              {t.paymentMethods}
                            </h4>
                            <p className="text-white font-bold text-lg">{selectedOffer.details.paymentMethods[lang]}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-10 flex flex-col gap-4">
                  <a
                    href={selectedOffer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 py-6 bg-brand-purple hover:bg-white text-white hover:text-brand-purple border-2 border-brand-purple transition-all duration-500 rounded-[1.5rem] font-black text-base uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(157,88,255,0.3)]"
                  >
                    {t.visit}
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  {selectedOffer.webUrl && (
                    <a
                      href={selectedOffer.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-3 py-5 bg-white/5 border-2 border-white/10 rounded-[1.5rem] hover:bg-white/10 hover:border-brand-purple/40 text-white/60 hover:text-white transition-all font-black text-xs uppercase tracking-[0.2em]"
                    >
                      Web
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  {selectedOffer.promoCode && (
                    <button 
                      onClick={() => copyToClipboard(selectedOffer.promoCode || '')}
                      className="w-full flex items-center justify-center gap-3 py-5 bg-white/5 border-2 border-white/10 rounded-[1.5rem] hover:bg-brand-orange/10 hover:border-brand-orange/50 text-white/40 hover:text-brand-orange transition-all font-black text-xs uppercase tracking-[0.2em]"
                    >
                      <Copy className="w-5 h-5" />
                      {t.promo}: {selectedOffer.promoCode}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
