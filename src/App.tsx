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
type Language = 'ru' | 'en' | 'es' | 'zh' | 'ko';
type Localized<T = string> = Partial<Record<Language, T>> & { ru: T; en: T };

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
  description: Localized;
  url: string;
  webUrl?: string;
  logoUrl?: string;
  promoCode?: string;
  badge?: Localized;
  isPopular?: boolean;
  isBestChoice?: boolean;
  since?: string;
  platforms?: string[];
  payments?: string[];
  freeProfiles?: Localized;
  tariffStartPrice?: Localized;
  profiles100Price?: Localized;
  priceInfo?: {
    main?: Localized;
    secondary?: Localized;
  };
  cardStats?: {
    issuance: Localized;
    maintenance: Localized;
    verification: Localized;
    cashback: Localized;
    topup: Localized;
    commission: Localized;
    paySystems: Localized;
    type: Localized;
  };
  details?: {
    geo?: Localized;
    types?: Localized;
    fees?: string;
    kyc?: string;
    minTopup?: string;
    paymentMethods?: Localized;
    rate?: Localized;
    supports?: Localized<string[]>;
    nuances?: Localized<string[]>;
    pros?: Localized<string[]>;
    targetAudience?: Localized;
    descriptionDetailed?: Localized;
  };
}

// --- Data ---
const CATEGORIES: { id: CategoryType; icon: any; title: Localized; subFilters?: SubCategory[]; guides?: { text: string | boolean; video: string } }[] = [
  { 
    id: 'Proxy', 
    icon: Globe, 
    title: { ru: 'Proxy / VPN', en: 'Proxy / VPN', es: 'Proxy / VPN', zh: '代理 / VPN', ko: '프록시 / VPN' },
    subFilters: ['Proxy', 'VPN'],
    guides: { text: '#', video: '#' }
  },
  { 
    id: 'Antidetect', 
    icon: Laptop, 
    title: { ru: 'Антидетект', en: 'Antidetect', es: 'Antidetect', zh: '反检测', ko: '안티디텍트' },
    subFilters: ['PCBasic', 'PCAdvanced', 'Mobile'],
    guides: { text: '#', video: '#' }
  },
  { 
    id: 'Stores', 
    icon: ShoppingBag, 
    title: { ru: 'Аккаунт Shop', en: 'Account Shop', es: 'Tienda de cuentas', zh: '账号商店', ko: '계정 스토어' }, 
    subFilters: ['Web', 'Bot'],
    guides: { 
      text: true, 
      video: 'https://youtu.be/3wjIQRrOdd0?si=04kDWjWwLatAVipc' 
    } 
  },
  { id: 'Cards', icon: CreditCard, title: { ru: 'Зарубежные Карты', en: 'Virtual Cards', es: 'Tarjetas virtuales', zh: '虚拟卡', ko: '가상 카드' }, subFilters: ['NoKYC', 'WithKYC'], guides: { text: '#', video: '#' } },
  { 
    id: 'Crypto', 
    icon: Coins, 
    title: { ru: 'Купить/продать крипту', en: 'Buy/Sell Crypto', es: 'Comprar/vender cripto', zh: '买卖加密货币', ko: '암호화폐 매매' },
    guides: { text: '#', video: '#' }
  },
  { id: 'SMS', icon: MessageSquare, title: { ru: 'SMS Активаторы', en: 'SMS Activators', es: 'SMS Activadores', zh: '短信接码', ko: 'SMS 인증' } },
  { id: 'VPS', icon: Server, title: { ru: 'VDS/VPS серверы', en: 'VDS/VPS Servers', es: 'Servidores VPS', zh: 'VPS 服务器', ko: 'VPS 서버' }, guides: { text: '#', video: '#' } },
  { id: 'Social', icon: ThumbsUp, title: { ru: 'Накрутка', en: 'Social Boost', es: 'Boost social', zh: '社交增长', ko: '소셜 부스트' }, subFilters: ['BoostSites', 'Bux'], guides: { text: '#', video: '#' } },
  { id: 'Steam', icon: Gamepad2, title: { ru: 'Пополнение Steam', en: 'Steam Top-up', es: 'Recarga Steam', zh: 'Steam 充值', ko: 'Steam 충전' }, subFilters: ['SteamFast', 'SteamItems'], guides: { text: '#', video: '#' } },
  { id: 'Guides', icon: FileText, title: { ru: 'Полезные гайды', en: 'Useful Guides', es: 'Guías útiles', zh: '实用指南', ko: '유용한 가이드' } },
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

const LANGUAGE_PREFIXES: Record<Language, string> = {
  ru: '',
  en: '/en',
  es: '/es',
  zh: '/zh',
  ko: '/ko',
};

const LANGUAGE_OPTIONS: { value: Language; label: string; inLanguage: string }[] = [
  { value: 'ru', label: 'RU', inLanguage: 'ru-RU' },
  { value: 'en', label: 'EN', inLanguage: 'en' },
  { value: 'es', label: 'ES', inLanguage: 'es' },
  { value: 'zh', label: '中文', inLanguage: 'zh-CN' },
  { value: 'ko', label: 'KO', inLanguage: 'ko-KR' },
];

const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/';

const getLanguageFromPath = (path = typeof window !== 'undefined' ? window.location.pathname : '/'): Language => {
  const normalizedPath = normalizePath(path);
  return LANGUAGE_OPTIONS.find(({ value }) => {
    const prefix = LANGUAGE_PREFIXES[value];
    return prefix && (normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`));
  })?.value || 'ru';
};

const stripLanguagePrefix = (path: string) => {
  const normalizedPath = normalizePath(path);
  const prefix = LANGUAGE_PREFIXES[getLanguageFromPath(path)];
  if (!prefix) return normalizedPath;
  if (normalizedPath === prefix) return '/';
  return normalizedPath.startsWith(`${prefix}/`) ? normalizedPath.slice(prefix.length) || '/' : normalizedPath;
};

const getLocalizedRoute = (category: CategoryType, language: Language) =>
  `${LANGUAGE_PREFIXES[language]}${CATEGORY_ROUTES[category]}`;

const getLocalizedHomeRoute = (language: Language) => LANGUAGE_PREFIXES[language] || '/';

const translateMissingString = (value: string, language: Language) => {
  if (language === 'ru' || language === 'en') return value;

  const exact: Record<Exclude<Language, 'ru' | 'en'>, Record<string, string>> = {
    es: {
      'Crypto': 'Cripto',
      'Bank cards, SBP, Crypto': 'Tarjetas bancarias, SBP, cripto',
      'Visa/Mastercard, Crypto': 'Visa/Mastercard, cripto',
      'Visa/Mastercard, SBP/Mir, Crypto': 'Visa/Mastercard, SBP/Mir, cripto',
      'Visa/Mastercard, SBP, Mir, Crypto': 'Visa/Mastercard, SBP, Mir, cripto',
      'Visa/Mastercard, Crypto, PayPal': 'Visa/Mastercard, cripto, PayPal',
      'Visa/Mastercard, SBP/RU cards': 'Visa/Mastercard, SBP/tarjetas RU',
      'Visa/Mastercard, Crypto, SBP/RU cards': 'Visa/Mastercard, cripto, SBP/tarjetas RU',
      'Crypto, SBP/RU cards': 'Cripto, SBP/tarjetas RU',
      'Visa, Crypto, SBP/RU cards': 'Visa, cripto, SBP/tarjetas RU',
      'SBP/Mir, Visa/MC, Crypto': 'SBP/Mir, Visa/MC, cripto',
      'Mir/SBP, cards, crypto': 'Mir/SBP, tarjetas, cripto',
      'Cards, PayPal, crypto, local methods': 'Tarjetas, PayPal, cripto y métodos locales',
      'By Steam login': 'Por login de Steam',
      'CS/TF/Rust items': 'Ítems CS/TF/Rust',
      'Mobile IP, Android, iPhone': 'IP móvil, Android, iPhone',
      'Gmail, emails, forwarding': 'Gmail, correos, reenvío',
      'Accounts, proxies, antidetects': 'Cuentas, proxies, antidetects',
      'UIDs, addresses, exchanges': 'UID, direcciones, exchanges',
      'Task marketplace, registrations, simple actions': 'Bolsa de tareas, registros, acciones simples',
    },
    zh: {
      'Crypto': '加密货币',
      'Bank cards, SBP, Crypto': '银行卡、SBP、加密货币',
      'Visa/Mastercard, Crypto': 'Visa/Mastercard、加密货币',
      'Visa/Mastercard, SBP/Mir, Crypto': 'Visa/Mastercard、SBP/Mir、加密货币',
      'Visa/Mastercard, SBP, Mir, Crypto': 'Visa/Mastercard、SBP、Mir、加密货币',
      'Visa/Mastercard, Crypto, PayPal': 'Visa/Mastercard、加密货币、PayPal',
      'Visa/Mastercard, SBP/RU cards': 'Visa/Mastercard、SBP/俄罗斯银行卡',
      'Visa/Mastercard, Crypto, SBP/RU cards': 'Visa/Mastercard、加密货币、SBP/俄罗斯银行卡',
      'Crypto, SBP/RU cards': '加密货币、SBP/俄罗斯银行卡',
      'Visa, Crypto, SBP/RU cards': 'Visa、加密货币、SBP/俄罗斯银行卡',
      'SBP/Mir, Visa/MC, Crypto': 'SBP/Mir、Visa/MC、加密货币',
      'Mir/SBP, cards, crypto': 'Mir/SBP、银行卡、加密货币',
      'Cards, PayPal, crypto, local methods': '银行卡、PayPal、加密货币和本地方式',
      'By Steam login': '通过 Steam 登录名',
      'CS/TF/Rust items': 'CS/TF/Rust 物品',
      'Mobile IP, Android, iPhone': '移动 IP、Android、iPhone',
      'Gmail, emails, forwarding': 'Gmail、邮箱、转发',
      'Accounts, proxies, antidetects': '账号、代理、反检测',
      'UIDs, addresses, exchanges': 'UID、地址、交易所',
      'Task marketplace, registrations, simple actions': '任务平台、注册、简单操作',
    },
    ko: {
      'Crypto': '암호화폐',
      'Bank cards, SBP, Crypto': '은행 카드, SBP, 암호화폐',
      'Visa/Mastercard, Crypto': 'Visa/Mastercard, 암호화폐',
      'Visa/Mastercard, SBP/Mir, Crypto': 'Visa/Mastercard, SBP/Mir, 암호화폐',
      'Visa/Mastercard, SBP, Mir, Crypto': 'Visa/Mastercard, SBP, Mir, 암호화폐',
      'Visa/Mastercard, Crypto, PayPal': 'Visa/Mastercard, 암호화폐, PayPal',
      'Visa/Mastercard, SBP/RU cards': 'Visa/Mastercard, SBP/RU 카드',
      'Visa/Mastercard, Crypto, SBP/RU cards': 'Visa/Mastercard, 암호화폐, SBP/RU 카드',
      'Crypto, SBP/RU cards': '암호화폐, SBP/RU 카드',
      'Visa, Crypto, SBP/RU cards': 'Visa, 암호화폐, SBP/RU 카드',
      'SBP/Mir, Visa/MC, Crypto': 'SBP/Mir, Visa/MC, 암호화폐',
      'Mir/SBP, cards, crypto': 'Mir/SBP, 카드, 암호화폐',
      'Cards, PayPal, crypto, local methods': '카드, PayPal, 암호화폐, 현지 결제',
      'By Steam login': 'Steam 로그인으로',
      'CS/TF/Rust items': 'CS/TF/Rust 아이템',
      'Mobile IP, Android, iPhone': '모바일 IP, Android, iPhone',
      'Gmail, emails, forwarding': 'Gmail, 이메일, 포워딩',
      'Accounts, proxies, antidetects': '계정, 프록시, 안티디텍트',
      'UIDs, addresses, exchanges': 'UID, 주소, 거래소',
      'Task marketplace, registrations, simple actions': '태스크 마켓, 가입, 간단한 작업',
    },
  };

  const direct = exact[language]?.[value];
  if (direct) return direct;

  const countryMatch = value.match(/^(\d+)\+ countries$/);
  if (countryMatch) {
    if (language === 'es') return `${countryMatch[1]}+ países`;
    if (language === 'zh') return `${countryMatch[1]}+ 个国家`;
    return `${countryMatch[1]}+개 국가`;
  }

  const replacements: Record<Exclude<Language, 'ru' | 'en'>, Array<[RegExp, string]>> = {
    es: [
      [/countries/g, 'países'],
      [/Bank cards/g, 'tarjetas bancarias'],
      [/cards/g, 'tarjetas'],
      [/Crypto/g, 'cripto'],
      [/crypto/g, 'cripto'],
      [/Payment/g, 'Pago'],
      [/Residential/g, 'Residential'],
      [/Datacenter/g, 'Datacenter'],
      [/Mobile/g, 'Mobile'],
      [/Shared/g, 'Shared'],
      [/Dynamic/g, 'Dynamic'],
      [/dedicated resources/g, 'recursos dedicados'],
      [/server infrastructure/g, 'infraestructura de servidor'],
      [/Multiple locations/g, 'Varias ubicaciones'],
      [/Different locations/g, 'Diferentes ubicaciones'],
      [/Different countries and data centers/g, 'Diferentes países y centros de datos'],
      [/from/g, 'desde'],
      [/up to/g, 'hasta'],
      [/\/mo/g, '/mes'],
    ],
    zh: [
      [/countries/g, '国家'],
      [/Bank cards/g, '银行卡'],
      [/cards/g, '银行卡'],
      [/Crypto/g, '加密货币'],
      [/crypto/g, '加密货币'],
      [/Payment/g, '支付'],
      [/Residential/g, '住宅'],
      [/Datacenter/g, '数据中心'],
      [/Mobile/g, '移动'],
      [/Shared/g, '共享'],
      [/Dynamic/g, '动态'],
      [/dedicated resources/g, '独享资源'],
      [/server infrastructure/g, '服务器基础设施'],
      [/Multiple locations/g, '多个地区'],
      [/Different locations/g, '不同地区'],
      [/Different countries and data centers/g, '不同国家和数据中心'],
      [/from/g, '起'],
      [/up to/g, '最高'],
      [/\/mo/g, '/月'],
    ],
    ko: [
      [/countries/g, '국가'],
      [/Bank cards/g, '은행 카드'],
      [/cards/g, '카드'],
      [/Crypto/g, '암호화폐'],
      [/crypto/g, '암호화폐'],
      [/Payment/g, '결제'],
      [/Residential/g, 'Residential'],
      [/Datacenter/g, 'Datacenter'],
      [/Mobile/g, 'Mobile'],
      [/Shared/g, 'Shared'],
      [/Dynamic/g, 'Dynamic'],
      [/dedicated resources/g, '전용 리소스'],
      [/server infrastructure/g, '서버 인프라'],
      [/Multiple locations/g, '여러 위치'],
      [/Different locations/g, '다양한 위치'],
      [/Different countries and data centers/g, '다양한 국가와 데이터센터'],
      [/from/g, '부터'],
      [/up to/g, '최대'],
      [/\/mo/g, '/월'],
    ],
  };

  return replacements[language].reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
};

const translateMissingValue = <T,>(value: T, language: Language): T => {
  if (typeof value === 'string') return translateMissingString(value, language) as T;
  if (Array.isArray(value)) return value.map((item) => translateMissingValue(item, language)) as T;
  return value;
};

const getLocalizedValue = <T,>(value: Localized<T> | undefined, language: Language): T | undefined =>
  value?.[language] ?? (value?.en !== undefined ? translateMissingValue(value.en, language) : value?.ru);

const getDefaultSubFilter = (): SubCategory => 'None';

const getCategoryFromPath = (path = typeof window !== 'undefined' ? window.location.pathname : '/'): CategoryType => {
  const normalizedPath = stripLanguagePrefix(path);
  const match = Object.entries(CATEGORY_ROUTES).find(([, route]) => route === normalizedPath);
  return (match?.[0] as CategoryType | undefined) || 'Proxy';
};

const SECTION_SEO: Record<CategoryType, {
  route: string;
  title: Localized;
  description: Localized;
  heading: Localized;
  intro: Localized;
  points: Localized<string[]>;
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

const RUNTIME_SEO_TRANSLATIONS: Partial<Record<CategoryType, Partial<Record<Language, { title: string; description: string }>>>> = {
  Proxy: {
    es: {
      title: 'Proxies y VPN para cuentas y trabajo | Hopscup Tools',
      description: 'Selección de servicios proxy y VPN: residential, mobile, ISP, IPv4/IPv6, pagos con tarjeta y cripto para cuentas y automatización.',
    },
    zh: {
      title: '账号工作用代理和 VPN | Hopscup Tools',
      description: '精选代理和 VPN 服务：住宅、移动、ISP、IPv4/IPv6，支持银行卡和加密货币支付。',
    },
    ko: {
      title: '계정 작업용 프록시와 VPN | Hopscup Tools',
      description: '계정 작업과 자동화를 위한 residential, mobile, ISP, IPv4/IPv6 프록시 및 VPN 모음.',
    },
  },
  Antidetect: {
    es: {
      title: 'Navegadores antidetect para multiaccounting | Hopscup Tools',
      description: 'Comparación de navegadores antidetect: perfiles gratis, planes iniciales, precio por 100 perfiles y opciones básicas o avanzadas.',
    },
    zh: {
      title: '多账号用反检测浏览器 | Hopscup Tools',
      description: '反检测浏览器对比：免费配置文件、入门套餐、100 个配置文件价格以及基础/高级任务选择。',
    },
    ko: {
      title: '멀티 계정용 안티디텍트 브라우저 | Hopscup Tools',
      description: '무료 프로필, 시작 요금제, 100개 프로필 가격, 기본/고급 작업용 안티디텍트 브라우저 비교.',
    },
  },
  Stores: {
    es: {
      title: 'Tiendas de cuentas y suscripciones | Hopscup Tools',
      description: 'Sitios y tiendas de Telegram para comprar cuentas, suscripciones de IA, Discord, Twitter, Google y otros productos digitales.',
    },
    zh: {
      title: '账号和订阅商店 | Hopscup Tools',
      description: '用于购买账号、AI 订阅、Discord、Twitter、Google 和其他数字商品的网站与 Telegram 商店。',
    },
    ko: {
      title: '계정 및 구독 스토어 | Hopscup Tools',
      description: '계정, AI 구독, Discord, Twitter, Google 및 기타 디지털 상품 구매용 웹사이트와 Telegram 상점 모음.',
    },
  },
  Cards: {
    es: {
      title: 'Tarjetas virtuales extranjeras con y sin KYC | Hopscup Tools',
      description: 'Servicios de tarjetas virtuales extranjeras para suscripciones, App Store, Google Play, Airbnb, publicidad y otros servicios.',
    },
    zh: {
      title: '有 KYC 和无 KYC 的海外虚拟卡 | Hopscup Tools',
      description: '用于支付订阅、App Store、Google Play、Airbnb、广告和其他海外服务的虚拟卡服务。',
    },
    ko: {
      title: 'KYC 유무별 해외 가상 카드 | Hopscup Tools',
      description: '구독, App Store, Google Play, Airbnb, 광고 등 해외 서비스 결제를 위한 가상 카드 서비스.',
    },
  },
  Crypto: {
    es: {
      title: 'Comprar y vender cripto online y offline | Hopscup Tools',
      description: 'Servicios para comprar y vender cripto: intercambio online, direcciones offline, efectivo, tarjetas, USDT y redes populares.',
    },
    zh: {
      title: '线上和线下买卖加密货币 | Hopscup Tools',
      description: '用于买卖加密货币的兑换服务：线上兑换、线下方向、现金、银行卡、USDT 和常用网络。',
    },
    ko: {
      title: '온라인/오프라인 암호화폐 매매 | Hopscup Tools',
      description: '온라인 환전, 오프라인 거래, 현금, 카드, USDT 및 주요 네트워크를 지원하는 암호화폐 교환 서비스.',
    },
  },
  SMS: {
    es: {
      title: 'Activadores SMS para registrar cuentas | Hopscup Tools',
      description: 'Activadores SMS y números virtuales para registrar cuentas: países, pagos, cripto, tarjetas y métodos rusos.',
    },
    zh: {
      title: '账号注册用短信接码服务 | Hopscup Tools',
      description: '账号注册用短信接码和虚拟号码：地区、支付方式、加密货币、银行卡和俄罗斯充值方式。',
    },
    ko: {
      title: '계정 등록용 SMS 인증 서비스 | Hopscup Tools',
      description: '계정 등록용 SMS 인증 및 가상 번호: 지역, 결제, 암호화폐, 카드, 러시아 충전 방법.',
    },
  },
  VPS: {
    es: {
      title: 'Servidores VDS y VPS para bots y trabajo | Hopscup Tools',
      description: 'Hosting VDS/VPS para bots, scripts, scraping, nodos y trabajo remoto: MaCloud, Xorek, VDSina, SpaceCore, AEZA.',
    },
    zh: {
      title: '机器人和工作任务用 VDS/VPS 服务器 | Hopscup Tools',
      description: '用于机器人、脚本、采集、节点和远程工作的 VDS/VPS 主机：MaCloud、Xorek、VDSina、SpaceCore、AEZA。',
    },
    ko: {
      title: '봇과 작업용 VDS/VPS 서버 | Hopscup Tools',
      description: '봇, 스크립트, 스크래핑, 노드, 원격 작업용 VDS/VPS 호스팅: MaCloud, Xorek, VDSina, SpaceCore, AEZA.',
    },
  },
  Social: {
    es: {
      title: 'Boost social y bolsas de tareas para referidos | Hopscup Tools',
      description: 'Sitios de boost y bolsas de tareas para referidos, registros, acciones sociales y tareas de Telegram con pagos por tarjeta y cripto.',
    },
    zh: {
      title: '用于推荐和任务的平台 | Hopscup Tools',
      description: '用于推荐、注册、社交行为和 Telegram 任务的增长网站与任务平台，支持银行卡和加密货币支付。',
    },
    ko: {
      title: '추천인과 작업용 소셜 부스트 및 태스크 플랫폼 | Hopscup Tools',
      description: '추천인, 가입, 소셜 액션, Telegram 작업을 위한 부스트 사이트와 태스크 거래소. 카드 및 암호화폐 결제 지원.',
    },
  },
  Steam: {
    es: {
      title: 'Recarga de Steam desde Rusia y con ítems | Hopscup Tools',
      description: 'Métodos de recarga de Steam: por login, con ítems CS/TF/Rust, opciones para Rusia, recargas rápidas y hasta +30% con ítems.',
    },
    zh: {
      title: '俄罗斯 Steam 充值与物品充值 | Hopscup Tools',
      description: 'Steam 充值方式：通过登录名、CS/TF/Rust 物品、适合俄罗斯的快速充值，以及最高 +30% 的物品充值。',
    },
    ko: {
      title: '러시아 Steam 충전 및 아이템 충전 | Hopscup Tools',
      description: 'Steam 충전 방법: 로그인 충전, CS/TF/Rust 아이템 충전, 러시아 친화 옵션, 빠른 충전, 아이템으로 최대 +30%.',
    },
  },
  Guides: {
    es: {
      title: 'Guías útiles sobre cuentas, IP, Gmail y cripto | Hopscup Tools',
      description: 'Guías de Hopscup sobre cambio de IP, reenvío de Gmail, granjas de cuentas, plataformas KYC/OTC, UID y direcciones para exchanges.',
    },
    zh: {
      title: '账号、IP、Gmail 和加密货币实用指南 | Hopscup Tools',
      description: 'Hopscup 关于换 IP、Gmail 转发、账号农场、KYC/OTC 平台、UID 和交易所地址的指南。',
    },
    ko: {
      title: '계정, IP, Gmail, 암호화폐 유용한 가이드 | Hopscup Tools',
      description: 'IP 변경, Gmail 포워딩, 계정 파밍, KYC/OTC 플랫폼, UID, 거래소 출금 주소에 대한 Hopscup 가이드.',
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

const OFFER_TITLE_TRANSLATIONS: Partial<Record<string, Partial<Record<Language, string>>>> = {
  'guide-mobile-ip': {
    en: 'Changing IP with mobile internet and airplane mode on Android and iPhone',
    es: 'Cambiar la IP con internet móvil y modo avión en Android y iPhone',
    zh: '通过移动网络和飞行模式更换 Android 与 iPhone 的 IP',
    ko: 'Android와 iPhone에서 모바일 인터넷과 비행기 모드로 IP 변경하기',
  },
  'guide-gmail-forwarding': {
    en: 'Step-by-step guide to forwarding Gmail emails to another inbox',
    es: 'Guía paso a paso para reenviar correos de Gmail a otro buzón',
    zh: '将 Gmail 邮件转发到另一个邮箱的分步指南',
    ko: 'Gmail 메일을 다른 메일함으로 전달하는 단계별 가이드',
  },
  'guide-account-farm': {
    en: 'Account farm: Discord, Twitter, Google accounts, proxies, boosting, antidetects',
    es: 'Granja de cuentas: Discord, Twitter, Google, proxies, boosting y antidetects',
    zh: '账号农场：Discord、Twitter、Google 账号、代理、增长与反检测',
    ko: '계정 팜: Discord, Twitter, Google 계정, 프록시, 부스트, 안티디텍트',
  },
  'guide-otc-kyc': {
    en: 'OTC platforms and KYC services in crypto',
    es: 'Plataformas OTC y servicios KYC en cripto',
    zh: '加密领域的 OTC 平台与 KYC 服务',
    ko: '암호화폐 OTC 플랫폼과 KYC 서비스',
  },
  'guide-uids-addresses': {
    en: 'UIDs and withdrawal addresses for crypto exchanges',
    es: 'UID y direcciones de retiro para exchanges cripto',
    zh: '加密交易所 UID 与提现地址',
    ko: '암호화폐 거래소용 UID와 출금 주소',
  },
};

const OFFER_DESCRIPTION_TRANSLATIONS: Partial<Record<string, Partial<Record<Language, string>>>> = {
  'guide-mobile-ip': {
    es: 'Guía básica para cambiar rápido la IP móvil usando internet móvil y modo avión. Útil cuando trabajas con cuentas y necesitas renovar la IP sin servicios extra.',
    zh: '这是一篇基础指南，讲解如何通过移动网络和飞行模式快速更换移动 IP。适合账号工作、代理逻辑和不借助额外服务刷新 IP 的场景。',
    ko: '모바일 인터넷과 비행기 모드로 모바일 IP를 빠르게 바꾸는 기본 가이드입니다. 계정 작업이나 별도 서비스 없이 IP를 새로고침해야 할 때 유용합니다.',
  },
  'guide-gmail-forwarding': {
    es: 'Guía clara para reenviar correos de Gmail a otro buzón. Sirve para reunir códigos, notificaciones y mensajes de varias cuentas en un solo lugar.',
    zh: '清晰讲解如何把 Gmail 邮件转发到另一个邮箱。适合把多个账号的验证码、通知和邮件集中到一个地方管理。',
    ko: 'Gmail 메일을 다른 메일함으로 전달하는 방법을 정리한 가이드입니다. 여러 계정의 코드, 알림, 메일을 한곳에 모을 때 좋습니다.',
  },
  'guide-account-farm': {
    es: 'Material grande sobre dónde conseguir cuentas Discord, Twitter y Google, cómo elegir proxies, cuándo usar antidetects y cómo pensar el boosting de referidos.',
    zh: '一篇较完整的资料，讲解从哪里获取 Discord、Twitter、Google 账号，如何选择代理，何时使用反检测，以及如何理解推荐增长。',
    ko: 'Discord, Twitter, Google 계정을 어디서 구할지, 프록시를 어떻게 고를지, 안티디텍트를 언제 쓸지, 추천인 부스트를 어떻게 볼지 정리한 큰 자료입니다.',
  },
  'guide-otc-kyc': {
    es: 'Guía sobre plataformas OTC y servicios KYC: dónde buscar verificaciones, cómo mirar las plataformas y dónde vender WL en actividades cripto.',
    zh: '关于 OTC 平台和 KYC 服务的指南：在哪里找验证、如何筛选平台，以及在加密活动中如何出售 WL。',
    ko: 'OTC 플랫폼과 KYC 서비스에 대한 가이드입니다. 인증을 어디서 구할지, 플랫폼을 어떻게 볼지, WL을 어디서 판매할지 다룹니다.',
  },
  'guide-uids-addresses': {
    es: 'Lista práctica de UID y direcciones para retiros a exchanges cripto. Útil cuando necesitas revisar rápidamente rutas y datos de retiro.',
    zh: '用于加密交易所提现的 UID 和地址清单。适合需要快速核对提现方向和可用信息时使用。',
    ko: '암호화폐 거래소 출금에 쓰는 UID와 주소 모음입니다. 출금 방향과 정보를 빠르게 확인해야 할 때 유용합니다.',
  },

  p1: {
    es: 'Servicio moderno con proxies residential, datacenter, mobile e ISP. Buena opción si buscas equilibrio entre precio, velocidad y estabilidad.',
    zh: '现代化代理服务，提供住宅、数据中心、移动和 ISP 代理。适合需要在价格、速度和稳定性之间取得平衡的任务。',
    ko: 'Residential, datacenter, mobile, ISP 프록시를 제공하는 현대적인 서비스입니다. 가격, 속도, 안정성의 균형이 필요한 작업에 좋습니다.',
  },
  p2: {
    es: 'Servicio probado con proxies de servidor económicos. Encaja bien para scraping, automatización y tareas donde no necesitas el máximo nivel de confianza de IP.',
    zh: '经过验证的低价服务器代理服务。适合采集、自动化以及不需要最高 IP 信任度的任务。',
    ko: '저렴한 서버 프록시를 제공하는 검증된 서비스입니다. 스크래핑, 자동화, 최고 수준의 IP 신뢰도가 필요하지 않은 작업에 적합합니다.',
  },
  p3: {
    es: 'Servicio universal con residential, datacenter, ISP y mobile proxies. Buen candidato para cuentas, anuncios, scraping y tareas donde importa el trust del IP.',
    zh: '通用代理服务，提供住宅、数据中心、ISP 和移动代理。适合账号、广告账户、采集以及重视 IP 信任度的任务。',
    ko: 'Residential, datacenter, ISP, mobile 프록시를 갖춘 범용 서비스입니다. 계정, 광고 계정, 스크래핑, IP 신뢰도가 중요한 작업에 좋습니다.',
  },
  p4: {
    es: 'Uno de los servicios más grandes por variedad de países y tipos de proxy. Normalmente permite encontrar una opción para casi cualquier tarea.',
    zh: '代理类型和国家选择都很丰富的大型服务之一。大多数任务都能在这里找到合适的选项。',
    ko: '국가와 프록시 유형 선택지가 매우 많은 대형 서비스 중 하나입니다. 거의 어떤 작업에도 맞는 옵션을 찾기 쉽습니다.',
  },
  p5: {
    es: 'Servicio conocido con IPv4, IPv6, shared IPv4 y MTProto a precios accesibles. Útil para tareas diarias, automatización y trabajo con muchas IP.',
    zh: '知名代理服务，提供价格较低的 IPv4、IPv6、共享 IPv4 和 MTProto。适合日常任务、自动化和大量 IP 使用。',
    ko: '합리적인 가격의 IPv4, IPv6, shared IPv4, MTProto를 제공하는 잘 알려진 서비스입니다. 일상 작업, 자동화, 많은 IP 작업에 적합합니다.',
  },
  p6: {
    es: 'Servicio de proxies móviles con rotación de IP. Buena opción para tareas donde las plataformas son sensibles al trust del usuario.',
    zh: '提供 IP 轮换的移动代理服务。适合平台对用户信任度非常敏感的任务。',
    ko: 'IP 변경이 가능한 모바일 프록시 서비스입니다. 플랫폼 신뢰도가 매우 중요한 작업에 좋은 선택입니다.',
  },
  p7: {
    es: 'Servicio amplio con IPv4/IPv6, shared, residential, mobile y dynamic proxies. Puede servir tanto para cuentas como para automatización.',
    zh: '代理类型很全，包含 IPv4/IPv6、共享、住宅、移动和动态代理。账号工作和自动化任务都能使用。',
    ko: 'IPv4/IPv6, shared, residential, mobile, dynamic 프록시를 제공하는 범용 서비스입니다. 계정 작업과 자동화 모두에 사용할 수 있습니다.',
  },

  'vpn-ppl': {
    es: 'VPN rápido para uso diario: desbloqueos, YouTube sin anuncios y servicios internacionales. Tiene bot de Telegram cómodo y programa de referidos.',
    zh: '适合日常使用的快速 VPN，可用于绕过限制、观看无广告 YouTube 和访问海外服务。带有方便的 Telegram 机器人和推荐计划。',
    ko: '일상 사용에 적합한 빠른 VPN입니다. 차단 우회, 광고 없는 YouTube 시청, 해외 서비스 이용에 좋고 Telegram 봇과 추천 프로그램이 있습니다.',
  },
  'vpn-prosto': {
    es: 'VPN con tecnologías propias de bypass que sigue funcionando incluso cuando aumentan las restricciones. Soporta dispositivos ilimitados y varios modos de velocidad.',
    zh: '带有自有绕过技术的 VPN，在限制加强时也能继续工作。支持无限设备，并提供多种速度模式。',
    ko: '자체 우회 기술을 사용하는 VPN으로 제한이 강화되어도 계속 작동하도록 설계되었습니다. 무제한 기기와 여러 속도 모드를 지원합니다.',
  },
  'vpn-tochka-g': {
    es: 'VPN en formato bot de Telegram, centrado en estabilidad y reemplazo rápido de configuraciones. También tiene soluciones separadas para Telegram.',
    zh: 'Telegram 机器人形式的 VPN 服务，重点是连接稳定和快速更换配置。也提供 Telegram 专用方案。',
    ko: 'Telegram 봇 기반 VPN 서비스로 안정적인 연결과 빠른 설정 교체에 초점을 둡니다. Telegram 전용 솔루션도 제공합니다.',
  },

  'ant-dolphin': {
    es: 'Uno de los antidetects principales para multiaccounting, farming, retro drops y trabajo diario con perfiles.',
    zh: '主要反检测浏览器之一，适合多账号、账号农场、retro drops 和日常配置文件工作。',
    ko: '멀티 계정, 파밍, 레트로 드롭, 일상적인 프로필 작업에 자주 쓰이는 주요 안티디텍트 중 하나입니다.',
  },
  'ant-adspower': {
    es: 'Antidetect popular para multiaccounting, trabajo en equipo y gestión masiva de perfiles.',
    zh: '流行的反检测浏览器，适合多账号、团队协作和大量配置文件管理。',
    ko: '멀티 계정, 팀 작업, 대량 프로필 관리를 위한 인기 안티디텍트입니다.',
  },
  'ant-octo': {
    es: 'Antidetect para tareas más exigentes y antifraude fuerte. Suele considerarse cuando las soluciones simples ya no alcanzan.',
    zh: '面向更高要求和更强风控场景的反检测浏览器。常用于普通方案已经不够的情况。',
    ko: '더 까다로운 작업과 강한 안티프로드 환경을 위한 안티디텍트입니다. 일반 솔루션으로 부족할 때 고려됩니다.',
  },
  'ant-incogniton': {
    es: 'Antidetect para trabajo normal con perfiles y multiaccounting. Buena opción para tareas básicas y medias.',
    zh: '适合常规配置文件工作和多账号使用的反检测浏览器。基础到中等强度任务都可以考虑。',
    ko: '일반적인 프로필 작업과 멀티 계정에 적합한 안티디텍트입니다. 기본 및 중간 수준 작업에 사용할 수 있습니다.',
  },
  'ant-vision': {
    es: 'Antidetect más fuerte para servicios con antifraude serio: betting, casinos, exchanges y plataformas con protección profunda.',
    zh: '更强的反检测方案，适合博彩、 казино、交易所等强风控平台。',
    ko: '강한 안티프로드가 있는 베팅, 카지노, 거래소 같은 서비스에 쓰기 좋은 강화형 안티디텍트입니다.',
  },
  'ant-afina': {
    es: 'Antidetect orientado a muchos perfiles y multiaccounting. Por precio puede ser interesante cuando necesitas alrededor de 100 perfiles.',
    zh: '面向多账号和大量配置文件的反检测浏览器。需要约 100 个配置文件时，价格上有一定吸引力。',
    ko: '멀티 계정과 많은 프로필 작업에 맞춘 안티디텍트입니다. 100개 정도의 프로필이 필요할 때 가격 면에서 흥미로운 선택입니다.',
  },
  'ant-gologin': {
    es: 'Antidetect para multiaccounting y organización sencilla de perfiles. Encaja para tareas comunes y trabajo diario.',
    zh: '用于多账号和简单配置文件管理的反检测浏览器。适合常规任务和日常工作。',
    ko: '멀티 계정과 간단한 프로필 정리에 적합한 안티디텍트입니다. 일반적인 작업과 일상 업무에 좋습니다.',
  },
  'ant-morelogin': {
    es: 'Antidetect para multiaccounting, equipos y perfiles bajo diferentes tareas.',
    zh: '适合多账号、团队协作和不同任务配置文件管理的反检测浏览器。',
    ko: '멀티 계정, 팀 작업, 다양한 작업용 프로필 관리에 쓰기 좋은 안티디텍트입니다.',
  },
  'ant-multilogin': {
    es: 'Solución fuerte para tareas donde importan la calidad del perfil y el trabajo con antifraude complejo.',
    zh: '较强的反检测方案，适合重视配置文件质量并需要应对复杂风控的任务。',
    ko: '프로필 품질과 복잡한 안티프로드 대응이 중요한 작업에 쓰는 강한 안티디텍트입니다.',
  },

  'st-dark': {
    es: 'Mi tienda principal para cuentas de trabajo: Gmail, Telegram, Facebook, Instagram y otras redes. Buena para correos, fresh regs, cuentas farmeadas y consumibles.',
    zh: '我常用的工作账号商店：Gmail、Telegram、Facebook、Instagram 等。适合购买邮箱、新注册账号、养号账号和注册耗材。',
    ko: 'Gmail, Telegram, Facebook, Instagram 등 작업용 계정을 사는 주요 상점입니다. 메일, 신규 계정, 육성 계정, 등록용 소모품에 좋습니다.',
  },
  st1: {
    es: 'Tienda grande de cuentas, correos, redes sociales y consumibles. Útil como fuente adicional cuando falta stock o quieres comparar precios.',
    zh: '大型账号商店，提供邮箱、社交账号和各种耗材。当主要商店缺货或需要比价时很有用。',
    ko: '메일, 소셜 계정, 다양한 소모품을 제공하는 큰 계정 상점입니다. 재고가 없거나 가격 비교가 필요할 때 보조 소스로 좋습니다.',
  },
  'st-ggsel': {
    es: 'Marketplace de productos digitales: juegos, cuentas, claves, suscripciones y software. Útil para comprar productos de distintos vendedores.',
    zh: '数字商品市场：游戏、账号、密钥、订阅和软件。适合从不同卖家购买游戏商品、许可证和小众数字商品。',
    ko: '게임, 계정, 키, 구독, 소프트웨어를 다루는 디지털 상품 마켓플레이스입니다. 여러 판매자의 상품을 비교하며 구매하기 좋습니다.',
  },
  'st-funpay': {
    es: 'Marketplace muy útil para compras diarias: cuentas, suscripciones, juegos, servicios, claves y productos digitales. Suele resolver rápido por la cantidad de vendedores y reseñas.',
    zh: '非常实用的日常数字商品市场：账号、订阅、游戏商品、服务、密钥等。卖家和评价多，通常能更快解决需求。',
    ko: '계정, 구독, 게임 상품, 서비스, 키 등 일상 구매에 유용한 마켓플레이스입니다. 판매자와 리뷰가 많아 빠르게 해결되는 경우가 많습니다.',
  },
  'st-plati': {
    es: 'Marketplace clásico de juegos, claves, software, suscripciones y otros productos digitales. Buen respaldo para comparar precios y encontrar rarezas.',
    zh: '经典数字商品市场，包含游戏、密钥、软件、订阅和其他商品。适合作为比价和寻找稀缺商品的备用选择。',
    ko: '게임, 키, 소프트웨어, 구독 등 디지털 상품을 다루는 클래식 마켓플레이스입니다. 가격 비교와 희귀 상품 검색용으로 좋습니다.',
  },
  'st-lzt': {
    es: 'Uno de los mercados de cuentas de juego más grandes de la región CIS, con garantía para cuentas.',
    zh: '独联体地区较大的游戏账号市场之一，提供账号担保。',
    ko: 'CIS 지역에서 큰 게임 계정 마켓 중 하나이며 계정 보증을 제공합니다.',
  },
  'bot-lachuga': {
    es: 'Tienda de Telegram con cuentas y suscripciones baratas para IA y servicios populares: Gemini, GPT, Claude, CapCut, Canva y similares.',
    zh: 'Telegram 商店，提供热门 AI 工具和服务的低价账号与订阅，例如 Gemini、GPT、Claude、CapCut、Canva 等。',
    ko: 'Gemini, GPT, Claude, CapCut, Canva 같은 인기 AI 도구와 서비스의 저렴한 계정 및 구독을 판매하는 Telegram 상점입니다.',
  },
  'bot-crassus': {
    es: 'Bot de Telegram con cuentas, suscripciones y productos digitales. Útil para comprar IA, software o suscripciones por debajo del precio oficial.',
    zh: 'Telegram 机器人商店，提供账号、订阅和数字商品。适合以低于官方价格购买 AI 工具、软件和订阅。',
    ko: '계정, 구독, 디지털 상품을 판매하는 Telegram 봇입니다. AI 도구, 소프트웨어, 구독을 공식가보다 저렴하게 살 때 유용합니다.',
  },
  'bot-apel0sin': {
    es: 'Tienda de Telegram para productos digitales, cuentas y suscripciones. Cómoda para comprar rápido sin buscar vendedor manualmente.',
    zh: '用于购买数字商品、账号和订阅的 Telegram 商店。适合不想手动找卖家、希望快速购买的场景。',
    ko: '디지털 상품, 계정, 구독을 구매하는 Telegram 상점입니다. 판매자를 직접 찾지 않고 빠르게 구매할 때 편합니다.',
  },
  'bot-petrovich': {
    es: 'Bot de Telegram con cuentas, claves, suscripciones y productos para servicios populares. Buena opción para compras rápidas de IA y software.',
    zh: 'Telegram 机器人，提供热门服务的账号、密钥、订阅和商品。适合快速购买 AI 工具、软件和其他数字产品。',
    ko: '인기 서비스의 계정, 키, 구독, 상품을 판매하는 Telegram 봇입니다. AI 도구와 소프트웨어를 빠르게 구매하기 좋습니다.',
  },

  'prosto-exchange': {
    es: 'Exchange en Telegram para comprar y vender cripto. Cómodo para recargar presupuestos de trabajo, retirar a RUB o coordinar operaciones grandes con un manager.',
    zh: '基于 Telegram 的加密货币买卖服务。适合补充工作余额、将加密货币换成卢布，或通过经理安排较大金额交易。',
    ko: 'Telegram 기반 암호화폐 매매 서비스입니다. 작업 예산 충전, RUB 현금화, 매니저를 통한 큰 거래 조율에 편합니다.',
  },
  'keine-exchange': {
    es: 'Exchange con solicitudes web y direcciones offline para comprar, vender e intercambiar cripto. Útil para efectivo, USDT y operaciones grandes.',
    zh: '支持网页申请和线下方向的加密货币兑换服务。适合现金、USDT 和较大金额交易。',
    ko: '웹 신청과 오프라인 거래 방향을 제공하는 암호화폐 교환 서비스입니다. 현금, USDT, 큰 금액 거래에 유용합니다.',
  },

  'sms-hero': {
    es: 'Servicio de números virtuales que ganó popularidad tras el cierre de SMS-Activate. Tiene precios bajos y sirve para registros masivos.',
    zh: '虚拟号码服务，在 SMS-Activate 关闭后变得更受欢迎。价格较低，适合批量注册。',
    ko: 'SMS-Activate 종료 이후 인기가 높아진 가상 번호 서비스입니다. 가격이 낮고 대량 가입에 적합합니다.',
  },
  'sms-fast': {
    es: 'Servicio cómodo para números virtuales con muchas direcciones y métodos de pago aptos para usuarios RU/CIS.',
    zh: '方便的虚拟号码服务，方向较多，并支持适合 RU/CIS 用户的支付方式。',
    ko: '여러 방향과 RU/CIS 사용자에게 편한 결제 방식을 제공하는 가상 번호 서비스입니다.',
  },
  'sms-pool': {
    es: 'Servicio internacional de números virtuales con buena selección de países. Útil si pagas con cripto o tarjeta no CIS.',
    zh: '国际虚拟号码服务，国家选择较多。适合使用加密货币或非 CIS 银行卡支付的用户。',
    ko: '국가 선택지가 좋은 국제 가상 번호 서비스입니다. 암호화폐나 비CIS 카드로 결제할 때 유용합니다.',
  },
  'sms-grizzly': {
    es: 'Servicio de SMS para registros con selección de países y servicios populares. Buen respaldo para probar otras rutas.',
    zh: '用于账号注册的短信接码服务，支持常见国家和平台。适合作为测试其他方向的备用选择。',
    ko: '인기 국가와 서비스를 지원하는 SMS 인증 서비스입니다. 다른 방향을 테스트할 때 보조 옵션으로 좋습니다.',
  },
  'sms-tiger': {
    es: 'Servicio de números virtuales con precios bajos. Útil para volumen y para comparar disponibilidad por país o plataforma.',
    zh: '价格较低的虚拟号码服务。适合批量使用，也适合按国家或平台比较可用性。',
    ko: '저렴한 가상 번호 서비스입니다. 대량 작업이나 국가/플랫폼별 가용성 비교에 좋습니다.',
  },
  'sms-365': {
    es: 'Servicio de números virtuales con pagos cómodos para usuarios RU. Sirve como opción estable para tareas diarias.',
    zh: '虚拟号码服务，支付方式对 RU 用户较方便。适合作为日常任务的稳定选择。',
    ko: 'RU 사용자에게 편한 결제 방식을 갖춘 가상 번호 서비스입니다. 일상 작업용 안정적인 선택지로 좋습니다.',
  },

  'steam-lis-skins': {
    es: 'Marketplace de skins cómodo para recargar Steam mediante ítems. Muestra la diferencia con Steam, lo que ayuda a buscar recargas en plus.',
    zh: '用于通过物品充值 Steam 的皮肤市场。会显示与 Steam 的价格差，便于寻找“正收益”充值机会。',
    ko: '아이템으로 Steam을 충전할 때 편한 스킨 마켓입니다. Steam과의 가격 차이를 보여줘 플러스 충전 기회를 찾기 쉽습니다.',
  },
  'steam-tf2lavka': {
    es: 'Opción práctica para recargar mediante llaves y objetos TF/Rust. Algunos ítems pueden venderse sin trade ban, por eso es cómoda cuando no quieres esperar.',
    zh: '通过 TF/Rust 钥匙和物品充值的实用选项。部分物品没有交易冷却，因此不想等待时很方便。',
    ko: 'TF/Rust 키와 아이템으로 충전하는 실용적인 옵션입니다. 일부 아이템은 거래 제한 없이 팔 수 있어 기다리기 싫을 때 편합니다.',
  },
  'steam-aim-market': {
    es: 'Tiene recarga directa por login y opción de recarga mediante ítems. Para plus conviene comparar precios con la tabla y Steam Market.',
    zh: '支持通过登录名直接充值，也支持通过物品充值。想获得正收益时，需要结合表格和 Steam 市场价格比较。',
    ko: '로그인 직접 충전과 아이템 충전을 모두 지원합니다. 플러스 충전을 노릴 때는 표와 Steam Market 가격 비교가 필요합니다.',
  },
  'steam-csmoney': {
    es: 'Marketplace grande de skins CS2. Puede servir para recargar Steam mediante ítems si sabes elegir skins líquidos y revisar comisiones.',
    zh: '大型 CS2 皮肤市场。如果会选择流动性好的皮肤并核对手续费，可用于通过物品充值 Steam。',
    ko: '큰 CS2 스킨 마켓입니다. 유동성 있는 스킨을 고르고 수수료를 확인할 수 있다면 아이템으로 Steam 충전에 활용할 수 있습니다.',
  },
  'steam-ggsel': {
    es: 'Recarga rápida de Steam por login. Buena cuando quieres saldo sin comerciar ítems, pero normalmente con comisión cercana al 10%.',
    zh: '通过 Steam 登录名快速充值。适合不想处理物品交易、只想快速到账的情况，但通常有约 10% 手续费。',
    ko: 'Steam 로그인으로 빠르게 충전하는 옵션입니다. 아이템 거래 없이 잔액이 필요할 때 좋지만 보통 약 10% 수수료가 있습니다.',
  },
  'steam-playerok': {
    es: 'Recarga rápida por login a través de vendedores del marketplace. Cómoda para resultado inmediato; revisa siempre rating y reseñas.',
    zh: '通过市场卖家按登录名快速充值。适合需要立即到账的情况，但务必查看卖家评分和评价。',
    ko: '마켓플레이스 판매자를 통한 로그인 빠른 충전입니다. 즉시 결과가 필요할 때 편하며, 판매자 평점과 리뷰를 꼭 확인하세요.',
  },

  zarub: {
    es: 'Mi opción principal de tarjeta extranjera: sin KYC, recarga por SBP/USDT y funciona en muchos servicios internacionales y algunos comercios RU como OZON.',
    zh: '我主要使用的海外卡选项：无需 KYC，支持 SBP/USDT 充值，可用于许多海外服务，也能在 OZON 等部分俄罗斯商户使用。',
    ko: '제가 주로 쓰는 해외 카드 옵션입니다. KYC 없이 SBP/USDT 충전이 가능하고 많은 해외 서비스와 OZON 같은 일부 러시아 가맹점에서 작동합니다.',
  },
  cashinout: {
    es: 'Servicio con varias funciones: tarjetas virtuales para pagos online y herramientas adicionales como recarga de Steam.',
    zh: '功能较多的服务：可发行用于线上支付的虚拟卡，也提供 Steam 充值等额外工具。',
    ko: '온라인 결제용 가상 카드부터 Steam 충전 같은 추가 기능까지 제공하는 서비스입니다.',
  },
  vezdekarta: {
    es: 'Tarjeta virtual básica con dos tarifas. Conveniente para recargar en rublos, aunque no todos los servicios aceptan la tarjeta.',
    zh: '基础虚拟卡，有两个 тариф。用卢布充值比较划算，但并非所有服务都能成功付款。',
    ko: '두 가지 요금제가 있는 기본 가상 카드입니다. 루블 충전에 유리하지만 모든 서비스에서 결제가 되는 것은 아닙니다.',
  },
  pionex: {
    es: 'Buena opción para la región RU/CIS: tarjeta cripto con KYC sencillo y rápido. Puede servir para pagos internacionales y cashback.',
    zh: '适合 RU/CIS 地区的选择：加密卡，KYC 简单快速。可用于国际支付并提供返现。',
    ko: 'RU/CIS 지역에 좋은 옵션입니다. 간단하고 빠른 KYC를 갖춘 암호화폐 카드로 해외 결제와 캐시백에 사용할 수 있습니다.',
  },

  'vps-macloud': {
    es: 'Mi opción principal para VDS/VPS. No es la más barata, pero en mi experiencia funciona estable y sin problemas innecesarios.',
    zh: '我主要使用的 VDS/VPS 选项。不是最便宜，但从个人经验看运行稳定，不需要额外折腾。',
    ko: '제가 주로 쓰는 VDS/VPS 옵션입니다. 가장 저렴하진 않지만 경험상 안정적이고 불필요한 문제가 적었습니다.',
  },
  'vps-xorek': {
    es: 'Opción barata para VDS/VPS. Sirve para pruebas y tareas temporales, pero no la usaría para proyectos críticos sin backups.',
    zh: '低价 VDS/VPS 选项。适合测试和临时任务，但重要项目需要备份，不建议无备份使用。',
    ko: '저렴한 VDS/VPS 옵션입니다. 테스트와 임시 작업에 좋지만 중요한 프로젝트에는 백업 없이 쓰기 어렵습니다.',
  },
  'vps-vdsina': {
    es: 'Proveedor popular con panel claro y despliegue rápido. Buena opción universal para bots, parsers y pequeños proyectos.',
    zh: '流行的 VDS/VPS 提供商，面板清晰，开服快速。适合机器人、采集器和小型项目。',
    ko: '명확한 패널과 빠른 서버 생성이 장점인 인기 제공업체입니다. 봇, 파서, 작은 프로젝트에 무난합니다.',
  },
  'vps-spacecore': {
    es: 'Hosting para VPS/VDS e infraestructura. Puede ser alternativa si necesitas otras ubicaciones, configuraciones o precios.',
    zh: 'VPS/VDS 和服务器基础设施服务商。如果需要其他地区、配置或价格，可以作为备选。',
    ko: 'VPS/VDS와 서버 인프라용 호스팅입니다. 다른 위치, 구성, 가격이 필요할 때 대안으로 볼 수 있습니다.',
  },
  'vps-aeza': {
    es: 'Proveedor conocido con muchas soluciones de infraestructura. Interesante cuando necesitas configuraciones potentes o ubicaciones distintas.',
    zh: '知名服务器和 VPS/VDS 提供商，基础设施产品较多。适合需要更强配置或不同地区的情况。',
    ko: '다양한 인프라 제품을 제공하는 잘 알려진 서버/VPS 제공업체입니다. 강한 구성이나 다양한 위치가 필요할 때 볼 만합니다.',
  },

  'boost-twiboost': {
    es: 'Servicio para referidos y acciones sociales. Cómodo cuando necesitas registros o actividad rápida sin buscar ejecutores manualmente.',
    zh: '用于推荐和社交行为增长的服务。适合不想手动找执行者、需要快速获得注册或活跃度的情况。',
    ko: '추천인과 소셜 액션을 위한 서비스입니다. 실행자를 직접 찾지 않고 빠르게 가입이나 활동이 필요할 때 편합니다.',
  },
  'boost-socproof': {
    es: 'Plataforma para boosting de referidos y actividad. Encaja cuando importan velocidad, pedido claro y precio predecible por acción.',
    zh: '用于推荐和活跃度增长的平台。适合重视速度、下单清晰和单次行为价格可预期的任务。',
    ko: '추천인과 활동 부스트를 위한 플랫폼입니다. 속도, 명확한 주문, 예측 가능한 행동 단가가 중요할 때 좋습니다.',
  },
  'boost-boostgram': {
    es: 'Servicio para acciones sociales y tareas de referidos. Útil como alternativa si buscas otros precios o disponibilidad.',
    zh: '用于社交行为和推荐任务的服务。如果需要其他价格或方向可用性，可以作为替代选择。',
    ko: '소셜 액션과 추천인 작업용 서비스입니다. 다른 가격이나 가용성이 필요할 때 대안으로 좋습니다.',
  },
  'boost-easyliker': {
    es: 'Sitio para acciones sociales, actividad y referidos. Sirve para comparar precios, velocidad y disponibilidad de servicios.',
    zh: '用于社交行为、活跃度和推荐任务的网站。适合比较价格、执行速度和服务可用性。',
    ko: '소셜 액션, 활동, 추천인 작업용 사이트입니다. 가격, 처리 속도, 서비스 가용성을 비교할 때 좋습니다.',
  },
  'boost-smmlaba': {
    es: 'Panel SMM para métricas sociales: likes, follows, views y tareas similares. Bueno como opción de respaldo.',
    zh: 'SMM 面板，用于点赞、关注、观看等社交指标。适合作为备用选择。',
    ko: '좋아요, 팔로우, 조회수 같은 소셜 지표용 SMM 패널입니다. 백업 옵션으로 좋습니다.',
  },
  'boost-smmprime': {
    es: 'Panel SMM para actividad en redes sociales. Útil para comparar precios y probar proveedores distintos bajo la misma tarea.',
    zh: '用于社交平台活跃度的 SMM 面板。适合在同一任务下比较价格并测试不同供应商。',
    ko: '소셜 활동 부스트용 SMM 패널입니다. 같은 작업에서 가격 비교와 공급자 테스트에 유용합니다.',
  },
  'bux-socpublic': {
    es: 'Bolsa de tareas probada donde personas reales hacen acciones simples por pago. Buena para registros en bots de Telegram y referidos.',
    zh: '经过验证的任务平台，真实执行者完成简单付费操作。适合 Telegram 机器人注册和推荐任务。',
    ko: '실제 작업자가 간단한 유료 작업을 수행하는 검증된 태스크 마켓입니다. Telegram 봇 가입과 추천인 작업에 좋습니다.',
  },
  'bux-unu': {
    es: 'Bolsa de tareas más moderna para registros y referidos. Útil si necesitas acciones de personas reales y puedes revisar resultados manualmente.',
    zh: '更现代的任务平台，适合注册和推荐任务。需要真实用户操作且愿意手动检查结果时很有用。',
    ko: '가입과 추천인 작업을 위한 좀 더 현대적인 태스크 마켓입니다. 실제 사람의 행동이 필요하고 결과를 직접 검수할 수 있을 때 유용합니다.',
  },
};

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

const LanguageToggle = ({ lang, onChange }: { lang: Language; onChange: (language: Language) => void }) => (
  <label className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 hover:border-brand-purple transition-all duration-300 group cursor-pointer">
    <Languages className="w-4 h-4 text-brand-purple group-hover:scale-110 transition-transform" />
    <select
      value={lang}
      onChange={(event) => onChange(event.target.value as Language)}
      className="bg-transparent text-xs font-medium uppercase tracking-wider text-white focus:outline-none cursor-pointer"
      aria-label="Language"
    >
      {LANGUAGE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value} className="bg-bg-dark text-white">
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

export default function App() {
  const initialCategory = getCategoryFromPath();
  const [lang, setLang] = useState<Language>(getLanguageFromPath());
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
  const l = <T,>(value?: Localized<T>) => getLocalizedValue(value, lang);
  const lList = <T,>(value?: Localized<T[]>) => getLocalizedValue(value, lang) || [];
  const tx = <T,>(value: Partial<Record<Language, T>> & { en: T }) => value[lang] ?? value.en;
  const offerTitle = (offer: Offer) => OFFER_TITLE_TRANSLATIONS[offer.id]?.[lang] || offer.name;
  const offerDescription = (offer: Offer) => {
    const manualDescription = OFFER_DESCRIPTION_TRANSLATIONS[offer.id]?.[lang];
    if (manualDescription) return manualDescription;

    const ownDescription = offer.description[lang];
    if (ownDescription) return ownDescription;
    if (lang === 'ru' || lang === 'en') return l(offer.description);

    const title = offerTitle(offer);
    const types = l(offer.details?.types);
    const geo = l(offer.details?.geo);
    const paymentMethods = l(offer.details?.paymentMethods);
    const extra = [geo, types, paymentMethods].filter(Boolean).join(' · ');

    const templates: Record<Exclude<Language, 'ru' | 'en'>, Record<CategoryType, string>> = {
      es: {
        Proxy: `${title} es un servicio para trabajar con proxies o VPN. Encaja para cuentas, automatización, registros y tareas donde importan el tipo de IP, el GEO y la forma de pago.${extra ? ` Datos clave: ${extra}.` : ''}`,
        Antidetect: `${title} es una solución antidetect para multiaccounting y gestión de perfiles. Sirve para separar entornos, trabajar con proxies y reducir señales sospechosas para plataformas con antifraude.${extra ? ` Datos clave: ${extra}.` : ''}`,
        Stores: `${title} es una tienda o marketplace para comprar cuentas, suscripciones, claves y otros productos digitales. Útil cuando necesitas cerrar una compra rápido y comparar opciones.${extra ? ` Datos clave: ${extra}.` : ''}`,
        Cards: `${title} es un servicio de tarjetas virtuales extranjeras para pagar suscripciones, apps, anuncios, viajes y otros servicios internacionales.${extra ? ` Datos clave: ${extra}.` : ''}`,
        Crypto: `${title} es un servicio para comprar, vender o intercambiar criptomonedas online u offline. Antes de operar conviene revisar tasa, límites, red y condiciones.${extra ? ` Datos clave: ${extra}.` : ''}`,
        SMS: `${title} es un servicio de números virtuales para recibir códigos SMS y registrar cuentas. Conviene revisar el país, el servicio necesario y el porcentaje de entrega antes de comprar.${extra ? ` Datos clave: ${extra}.` : ''}`,
        VPS: `${title} es un proveedor VDS/VPS para bots, scripts, parsing, nodos y entornos de trabajo. Elige configuración, sistema operativo y ubicación según la tarea.${extra ? ` Datos clave: ${extra}.` : ''}`,
        Social: `${title} ayuda con referidos, registros, acciones sociales o tareas pagadas. Úsalo cuando necesitas volumen, pero revisa la calidad de ejecución y las pruebas antes de aprobar.${extra ? ` Datos clave: ${extra}.` : ''}`,
        Steam: `${title} es una opción para recargar Steam por login o mediante ítems. Si usas ítems, compara siempre precio, liquidez y comisión en Steam Market.${extra ? ` Datos clave: ${extra}.` : ''}`,
        Guides: `${title} es una guía práctica de Hopscup sobre herramientas, cuentas, IP, cripto o flujos de trabajo relacionados.${extra ? ` Temas: ${extra}.` : ''}`,
      },
      zh: {
        Proxy: `${title} 是用于代理或 VPN 工作的服务，适合账号、自动化、注册以及需要关注 IP 类型、地区和支付方式的任务。${extra ? ` 关键信息：${extra}。` : ''}`,
        Antidetect: `${title} 是用于多账号和配置文件管理的反检测方案，可帮助隔离环境、配合代理使用，并减少平台风控信号。${extra ? ` 关键信息：${extra}。` : ''}`,
        Stores: `${title} 是购买账号、订阅、密钥和其他数字商品的商店或市场，适合快速购买并对比不同卖家的选择。${extra ? ` 关键信息：${extra}。` : ''}`,
        Cards: `${title} 是海外虚拟卡服务，可用于支付订阅、应用、广告、旅行和其他国际服务。${extra ? ` 关键信息：${extra}。` : ''}`,
        Crypto: `${title} 是线上或线下买卖、兑换加密货币的服务。操作前建议确认汇率、限额、网络和交易条件。${extra ? ` 关键信息：${extra}。` : ''}`,
        SMS: `${title} 是用于接收短信验证码和注册账号的虚拟号码服务。购买前建议检查国家、目标平台和到达率。${extra ? ` 关键信息：${extra}。` : ''}`,
        VPS: `${title} 是用于机器人、脚本、采集、节点和工作环境的 VDS/VPS 服务商。配置、系统和地区要按具体任务选择。${extra ? ` 关键信息：${extra}。` : ''}`,
        Social: `${title} 可用于推荐、注册、社交动作或付费任务。适合需要数量时使用，但确认前要检查执行质量和证明。${extra ? ` 关键信息：${extra}。` : ''}`,
        Steam: `${title} 是通过 Steam 登录名或物品充值的选项。使用物品充值时，务必对比价格、流动性和 Steam 市场手续费。${extra ? ` 关键信息：${extra}。` : ''}`,
        Guides: `${title} 是 Hopscup 关于工具、账号、IP、加密货币或工作流程的实用指南。${extra ? ` 主题：${extra}。` : ''}`,
      },
      ko: {
        Proxy: `${title}는 프록시 또는 VPN 작업용 서비스입니다. 계정, 자동화, 가입, IP 유형과 지역, 결제 방식이 중요한 작업에 적합합니다.${extra ? ` 핵심 정보: ${extra}.` : ''}`,
        Antidetect: `${title}는 멀티 계정과 프로필 관리를 위한 안티디텍트 솔루션입니다. 환경을 분리하고 프록시와 함께 사용하며 플랫폼의 의심 신호를 줄이는 데 도움이 됩니다.${extra ? ` 핵심 정보: ${extra}.` : ''}`,
        Stores: `${title}는 계정, 구독, 키 및 기타 디지털 상품을 구매할 수 있는 상점 또는 마켓플레이스입니다. 빠르게 구매하고 여러 옵션을 비교할 때 유용합니다.${extra ? ` 핵심 정보: ${extra}.` : ''}`,
        Cards: `${title}는 구독, 앱, 광고, 여행 및 해외 서비스 결제를 위한 해외 가상 카드 서비스입니다.${extra ? ` 핵심 정보: ${extra}.` : ''}`,
        Crypto: `${title}는 온라인 또는 오프라인으로 암호화폐를 사고팔거나 교환하는 서비스입니다. 거래 전 환율, 한도, 네트워크, 조건을 확인하는 것이 좋습니다.${extra ? ` 핵심 정보: ${extra}.` : ''}`,
        SMS: `${title}는 SMS 인증 코드를 받고 계정을 등록하기 위한 가상 번호 서비스입니다. 구매 전 국가, 필요한 플랫폼, 수신율을 확인하는 것이 좋습니다.${extra ? ` 핵심 정보: ${extra}.` : ''}`,
        VPS: `${title}는 봇, 스크립트, 파싱, 노드, 작업 환경을 위한 VDS/VPS 제공업체입니다. 작업에 맞춰 사양, OS, 위치를 선택하세요.${extra ? ` 핵심 정보: ${extra}.` : ''}`,
        Social: `${title}는 추천인, 가입, 소셜 액션 또는 유료 작업에 사용할 수 있습니다. 수량이 필요할 때 좋지만 승인 전 품질과 증빙을 확인해야 합니다.${extra ? ` 핵심 정보: ${extra}.` : ''}`,
        Steam: `${title}는 Steam 로그인 충전 또는 아이템을 통한 충전 옵션입니다. 아이템을 사용할 때는 Steam Market 가격, 유동성, 수수료를 꼭 비교하세요.${extra ? ` 핵심 정보: ${extra}.` : ''}`,
        Guides: `${title}는 도구, 계정, IP, 암호화폐 또는 관련 워크플로에 대한 Hopscup의 실용 가이드입니다.${extra ? ` 주제: ${extra}.` : ''}`,
      },
    };

    return templates[lang][offer.category];
  };

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
      const nextLanguage = getLanguageFromPath();
      setActiveCategory(nextCategory);
      setLang(nextLanguage);
      setSubFilter(getDefaultSubFilter());
      setSearchQuery('');
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    const sectionSeo = SECTION_SEO[activeCategory];
    const canonicalUrl = `${SITE_URL}${getLocalizedRoute(activeCategory, lang)}`;
    const runtimeSeo = RUNTIME_SEO_TRANSLATIONS[activeCategory]?.[lang];
    const title = runtimeSeo?.title || getLocalizedValue(sectionSeo.title, lang) || sectionSeo.title.en;
    const description = runtimeSeo?.description || getLocalizedValue(sectionSeo.description, lang) || sectionSeo.description.en;

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

    const setAlternate = (hreflang: string, href: string) => {
      let alternate = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
      if (!alternate) {
        alternate = document.createElement('link');
        alternate.setAttribute('rel', 'alternate');
        alternate.setAttribute('hreflang', hreflang);
        document.head.appendChild(alternate);
      }
      alternate.setAttribute('href', href);
    };

    LANGUAGE_OPTIONS.forEach(({ value }) => {
      setAlternate(value, `${SITE_URL}${getLocalizedRoute(activeCategory, value)}`);
    });
    setAlternate('x-default', `${SITE_URL}${CATEGORY_ROUTES[activeCategory]}`);

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
      inLanguage: LANGUAGE_OPTIONS.find((option) => option.value === lang)?.inLanguage || 'en',
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
    heroTitle: "Hopscup's Tools Hub",
    heroSub: tx({
      ru: 'Здесь собраны все полезные сервисы, которые я использую для работы',
      en: 'Here are all the useful services that I use for my work',
      es: 'Aquí están todos los servicios útiles que uso para trabajar',
      zh: '这里收集了我工作中常用的实用服务',
      ko: '업무에 사용하는 유용한 서비스들을 모아두었습니다',
    }),
    visitSite: tx({ ru: 'Перейти', en: 'Visit', es: 'Abrir', zh: '访问', ko: '열기' }),
    promo: tx({ ru: 'Промокод', en: 'Promo', es: 'Promo', zh: '优惠码', ko: '프로모 코드' }),
    popular: tx({ ru: 'Популярное', en: 'Popular', es: 'Popular', zh: '热门', ko: '인기' }),
    bestChoice: tx({ ru: 'Лучший выбор', en: 'Best Choice', es: 'Mejor opción', zh: '最佳选择', ko: '추천 선택' }),
    footer: tx({ ru: 'Сделано с душой для Hopscup Crew', en: 'Made with soul for Hopscup Crew', es: 'Hecho con cariño para Hopscup Crew', zh: '为 Hopscup Crew 用心制作', ko: 'Hopscup Crew를 위해 정성껏 제작' }),
    textGuide: tx({ ru: 'Текстовый гайд', en: 'Text Guide', es: 'Guía escrita', zh: '文字指南', ko: '텍스트 가이드' }),
    videoGuide: tx({ ru: 'Видео гайд', en: 'Video Guide', es: 'Videoguía', zh: '视频指南', ko: '비디오 가이드' }),
    all: tx({ ru: 'Все', en: 'All', es: 'Todo', zh: '全部', ko: '전체' }),
    issuance: tx({ ru: 'Выпуск', en: 'Issuance', es: 'Emisión', zh: '开卡', ko: '발급' }),
    maintenance: tx({ ru: 'Обслуживание', en: 'Monthly Fee', es: 'Cuota mensual', zh: '月费', ko: '월 사용료' }),
    verification: tx({ ru: 'Верификация (KYC)', en: 'Verification (KYC)', es: 'Verificación (KYC)', zh: '身份验证 (KYC)', ko: '인증 (KYC)' }),
    cashback: tx({ ru: 'Кешбек', en: 'Cashback', es: 'Cashback', zh: '返现', ko: '캐시백' }),
    topup: tx({ ru: 'Пополнение', en: 'Top-up', es: 'Recarga', zh: '充值', ko: '충전' }),
    type: tx({ ru: 'Тип', en: 'Type', es: 'Tipo', zh: '类型', ko: '유형' }),
    geo: tx({ ru: 'ГЕО', en: 'GEO', es: 'GEO', zh: '地区', ko: '지역' }),
    accounts: tx({ ru: 'Аккаунты:', en: 'Accounts:', es: 'Cuentas:', zh: '账号：', ko: '계정:' }),
    payment: tx({ ru: 'Оплата:', en: 'Payment:', es: 'Pago:', zh: '支付：', ko: '결제:' }),
    yearLabel: tx({ ru: 'года', en: 'year', es: 'año', zh: '年', ko: '년' }),
    guideTitle: tx({ ru: 'Как выбрать аккаунт правильно?', en: 'How to choose an account correctly?', es: '¿Cómo elegir una cuenta?', zh: '如何选择账号？', ko: '계정을 어떻게 고를까?' }),
    paymentMethods: tx({ ru: 'Способы оплаты', en: 'Payment Methods', es: 'Métodos de pago', zh: '支付方式', ko: '결제 방법' }),
    platforms: tx({ ru: 'Платформы', en: 'Platforms', es: 'Plataformas', zh: '平台', ko: '플랫폼' }),
    freeProfiles: tx({ ru: 'Бесплатные профили', en: 'Free Profiles', es: 'Perfiles gratis', zh: '免费配置文件', ko: '무료 프로필' }),
    tariffStart: tx({ ru: 'Стартовый тариф', en: 'Starter Plan', es: 'Plan inicial', zh: '入门套餐', ko: '시작 요금제' }),
    profiles100: tx({ ru: '100 профилей', en: '100 Profiles', es: '100 perfiles', zh: '100 个配置文件', ko: '프로필 100개' }),
    whatToPay: tx({ ru: 'Что можно оплачивать:', en: 'Supported Services:', es: 'Servicios compatibles:', zh: '支持的服务：', ko: '지원 서비스:' }),
    nuances: tx({ ru: 'Нюансы и ограничения:', en: 'Nuances & Limitations:', es: 'Matices y limitaciones:', zh: '注意事项与限制：', ko: '주의점 및 제한:' }),
    pros: tx({ ru: 'Плюсы:', en: 'Pros:', es: 'Ventajas:', zh: '优点：', ko: '장점:' }),
    rate: tx({ ru: 'Процент пополнения', en: 'Top-up Rate', es: 'Tasa de recarga', zh: '充值比例', ko: '충전 비율' }),
    description: tx({ ru: 'Описание', en: 'Description', es: 'Descripción', zh: '描述', ko: '설명' }),
    emptyCategory: tx({ ru: 'В этой категории пока пусто', en: 'Empty Category', es: 'Categoría vacía', zh: '该分类暂无内容', ko: '비어 있는 카테고리' }),
    visit: tx({ ru: 'Перейти', en: 'Visit Site', es: 'Visitar sitio', zh: '访问网站', ko: '사이트 방문' }),
    open: tx({ ru: 'Открыть', en: 'View Details', es: 'Ver detalles', zh: '查看详情', ko: '자세히 보기' }),
    types: tx({ ru: 'Типы', en: 'Types', es: 'Tipos', zh: '类型', ko: '유형' }),
    subFilters: {
      Proxy: tx({ ru: 'Прокси', en: 'Proxy', es: 'Proxy', zh: '代理', ko: '프록시' }),
      VPN: 'VPN',
      PCBasic: tx({ ru: 'ПК базовые', en: 'PC Basic', es: 'PC básico', zh: '基础 PC', ko: 'PC 기본' }),
      PCAdvanced: tx({ ru: 'ПК усиленные', en: 'PC Advanced', es: 'PC avanzado', zh: '高级 PC', ko: 'PC 고급' }),
      Mobile: tx({ ru: 'Мобильные', en: 'Mobile', es: 'Móvil', zh: '移动端', ko: '모바일' }),
      NoKYC: tx({ ru: 'Без KYC', en: 'No KYC', es: 'Sin KYC', zh: '无 KYC', ko: 'KYC 없음' }),
      WithKYC: tx({ ru: 'С KYC', en: 'With KYC', es: 'Con KYC', zh: '有 KYC', ko: 'KYC 있음' }),
      CardCrypto: tx({ ru: 'Карты/Крипта', en: 'Cards/Crypto', es: 'Tarjetas/Cripto', zh: '银行卡/加密货币', ko: '카드/암호화폐' }),
      USDTQR: 'USDT QR',
      Web: tx({ ru: 'Сайты', en: 'Websites', es: 'Sitios web', zh: '网站', ko: '웹사이트' }),
      Bot: tx({ ru: 'Боты в Telegram', en: 'Telegram Bots', es: 'Bots de Telegram', zh: 'Telegram 机器人', ko: 'Telegram 봇' }),
      BoostSites: tx({ ru: 'Сайты накрутки', en: 'Boost Sites', es: 'Sitios de boost', zh: '增长网站', ko: '부스트 사이트' }),
      Bux: tx({ ru: 'Буксы', en: 'Task Exchanges', es: 'Bolsas de tareas', zh: '任务平台', ko: '태스크 거래소' }),
      SteamFast: tx({ ru: 'Быстро по логину', en: 'Fast by login', es: 'Rápido por login', zh: '登录名快速充值', ko: '로그인 빠른 충전' }),
      SteamItems: tx({ ru: 'Через предметы', en: 'Through items', es: 'Con ítems', zh: '通过物品', ko: '아이템으로' }),
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
    const nextRoute = getLocalizedRoute(cat, lang);
    if (window.location.pathname !== nextRoute) {
      window.history.pushState(null, '', nextRoute);
    }
    setActiveCategory(cat);
    setSubFilter(getDefaultSubFilter());
    setSearchQuery('');
    scrollToPageTop();
  };

  const handleLanguageChange = (nextLanguage: Language) => {
    const nextRoute = getLocalizedRoute(activeCategory, nextLanguage);
    if (window.location.pathname !== nextRoute) {
      window.history.pushState(null, '', nextRoute);
    }
    setLang(nextLanguage);
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
            <a href={getLocalizedHomeRoute(lang)} aria-label="Hopscup's Tools Hub" className="w-10 h-10 rounded-xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5 transition-transform hover:scale-105">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </a>
            
            <div className="flex items-center gap-2">
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
            <LanguageToggle lang={lang} onChange={handleLanguageChange} />
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
                  <span className="tracking-widest uppercase text-[9px]">{l(cat.title)}</span>
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
                        {offerTitle(offer)}
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
                              {offerTitle(offer)}
                            </h3>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          <InfoRow icon={Coins} label={t.paymentMethods} value={l(offer.details?.paymentMethods)} />
                          <InfoRow icon={Globe} label={t.geo} value={l(offer.details?.geo)} />
                          <InfoRow icon={Layers} label={t.types} value={l(offer.details?.types)} />
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
                              {offerTitle(offer)}
                            </h3>
                          </div>
                        </div>

                        {offer.category !== 'Cards' && offer.category !== 'Stores' && offer.category !== 'Proxy' && offer.category !== 'Antidetect' && offer.category !== 'Crypto' && offer.category !== 'Social' && offer.category !== 'VPS' && offer.category !== 'Steam' && offer.category !== 'Guides' && (
                          <p className="text-white/60 text-base mb-6 leading-relaxed font-medium min-h-[3.5rem] group-hover:text-white transition-colors">
                            {offerDescription(offer)}
                          </p>
                        )}

                        {offer.category === 'SMS_Standard_Legacy' && (
                          <div className="space-y-4 mb-6 min-h-[3.5rem]">
                            {offer.details?.geo && (
                              <div className="flex items-center gap-2 text-white/40 font-black uppercase text-[10px] tracking-widest">
                                <Globe className="w-3.5 h-3.5 text-brand-purple" />
                                <span>{t.geo}:</span>
                                <span className="text-white/80">{l(offer.details.geo)}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-white/40 font-black uppercase text-[10px] tracking-widest">
                              <Coins className="w-3.5 h-3.5 text-brand-purple" />
                              <span>{t.paymentMethods}:</span>
                            </div>
                            <p className="text-[11px] text-white/60 font-medium leading-tight">
                              {l(offer.details?.paymentMethods)}
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
                          <span className="text-base text-brand-purple font-black">{l(offer.cardStats.issuance)}</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                            <span className="text-[12px] text-white/30 uppercase font-black tracking-[0.2em]">{t.maintenance}</span>
                          </div>
                          <span className="text-base text-brand-purple font-black">{l(offer.cardStats.maintenance)}</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                            <span className="text-[12px] text-white/30 uppercase font-black tracking-[0.2em]">Apple/Google Pay</span>
                          </div>
                          <span className="text-base text-white/80 font-bold whitespace-nowrap">{l(offer.cardStats.paySystems)}</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                            <span className="text-[12px] text-white/30 uppercase font-black tracking-[0.2em]">{t.verification}</span>
                          </div>
                          <span className="text-base text-white/80 font-bold">{l(offer.cardStats.verification)}</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                            <span className="text-[12px] text-white/30 uppercase font-black tracking-[0.2em]">{t.cashback}</span>
                          </div>
                          <span className="text-base text-white/80 font-bold">{l(offer.cardStats.cashback)}</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                            <span className="text-[12px] text-white/30 uppercase font-black tracking-[0.2em]">{t.topup}</span>
                          </div>
                          <span className="text-base text-white/80 font-bold whitespace-nowrap overflow-hidden text-ellipsis ml-2 max-w-[120px] text-right">{l(offer.cardStats.topup)}</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                            <span className="text-[12px] text-white/30 uppercase font-black tracking-[0.2em]">{t.type}</span>
                          </div>
                          <span className="text-base text-white/80 font-bold whitespace-nowrap overflow-hidden text-ellipsis ml-2 max-w-[120px] text-right">{l(offer.cardStats.type)}</span>
                        </div>
                      </div>
                    )}

                    {(offer.details || offer.platforms?.length) && offer.category !== 'Stores' && offer.category !== 'SMS' && offer.category !== 'Cards' && (
                      <div className="flex flex-col gap-4 mb-8">
                        <InfoRow icon={Users} label={t.freeProfiles} value={l(offer.freeProfiles)} />
                        <InfoRow icon={CreditCard} label={t.tariffStart} value={l(offer.tariffStartPrice)} />
                        <InfoRow icon={Percent} label={t.rate} value={l(offer.details?.rate)} />
                        <InfoRow icon={Globe} label={t.geo} value={l(offer.details?.geo)} />
                        <InfoRow icon={Layers} label={t.types} value={l(offer.details?.types)} />
                        <InfoRow icon={Monitor} label={t.platforms} value={offer.platforms?.join(', ')} />
                        <InfoRow icon={Coins} label={t.paymentMethods} value={l(offer.details?.paymentMethods)} />
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
                {l(activeCategoryData?.title)}
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
                {l(currentSectionSeo.heading)}
              </h2>
              <p className="text-sm md:text-base text-white/60 leading-relaxed">
                {l(currentSectionSeo.intro)}
              </p>
            </div>
            <div className="grid gap-3 w-full lg:max-w-md">
              {lList(currentSectionSeo.points).map((point) => (
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
                      <h2 className="text-3xl font-display font-bold tracking-tight">{offerTitle(selectedOffer)}</h2>

                    </div>
                  </div>
                </div>

                <div className="space-y-8 overflow-y-auto max-h-[60vh] pr-2 scrollbar-thin">
                  <div>
                    <h4 className="text-[11px] uppercase font-black text-brand-purple tracking-[0.2em] mb-3">
                      {t.description}
                    </h4>
                    <p className="text-white/80 leading-relaxed text-base font-medium">
                      {offerDescription(selectedOffer)}
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
                        <p className="text-brand-purple font-black text-lg">{l(selectedOffer.cardStats.issuance)}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.maintenance}
                          </h4>
                        </div>
                        <p className="text-brand-purple font-black text-lg">{l(selectedOffer.cardStats.maintenance)}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">Apple/Google Pay</h4>
                        </div>
                        <p className="text-white font-bold text-base">{l(selectedOffer.cardStats.paySystems)}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.verification}
                          </h4>
                        </div>
                        <p className="text-white font-bold text-base">{l(selectedOffer.cardStats.verification)}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.cashback}
                          </h4>
                        </div>
                        <p className="text-white font-bold text-base">{l(selectedOffer.cardStats.cashback)}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.topup}
                          </h4>
                        </div>
                        <p className="text-white font-bold text-base">{l(selectedOffer.cardStats.topup)}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.type}
                          </h4>
                        </div>
                        <p className="text-white font-bold text-base">{l(selectedOffer.cardStats.type)}</p>
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
                        {lList(selectedOffer.details.supports).map((item, i) => (
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
                        {lList(selectedOffer.details.nuances).map((item, i) => (
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
                        {lList(selectedOffer.details.pros).map((item, i) => (
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
                      "{l(selectedOffer.details.targetAudience)}"
                    </div>
                  )}

                  {!selectedOffer.cardStats && selectedOffer.priceInfo && (
                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
                      {selectedOffer.priceInfo?.main && (
                        <div>
                          <h4 className="text-[9px] uppercase font-black text-white/30 tracking-widest mb-1">{t.proxyTypes.static}</h4>
                          <p className="text-brand-purple font-bold">{l(selectedOffer.priceInfo.main)}</p>
                        </div>
                      )}
                       {selectedOffer.priceInfo?.secondary && (
                        <div>
                          <h4 className="text-[9px] uppercase font-black text-white/30 tracking-widest mb-1">{t.proxyTypes.residential}</h4>
                          <p className="text-brand-purple font-bold">{l(selectedOffer.priceInfo.secondary)}</p>
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
                            <p className="text-white font-bold text-lg">{l(selectedOffer.freeProfiles)}</p>
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
                            <p className="text-white font-bold text-lg">{l(selectedOffer.tariffStartPrice)}</p>
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
                            <p className="text-white font-bold text-lg">{l(selectedOffer.profiles100Price)}</p>
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
                            <p className="text-white font-bold text-lg">{l(selectedOffer.details.rate)}</p>
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
                            <p className="text-white font-bold text-lg">{l(selectedOffer.details.geo)}</p>
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
                            <p className="text-white font-bold text-lg">{l(selectedOffer.details.types)}</p>
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
                            <p className="text-white font-bold text-lg">{l(selectedOffer.details.paymentMethods)}</p>
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
