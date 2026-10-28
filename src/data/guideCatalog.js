import { guidePages } from './guidePages.js';
import { articleFallbackByRoute } from './articleFallbackContent.js';

// Existing React card titles, shared with the no-JavaScript catalogue.
const cardTitles = {
  'guide-mobile-ip': {
    ru: 'Смена айпи мобильным интернетом и режимом "самолета". Android и iPhone',
    en: 'Changing IP with mobile internet and airplane mode on Android and iPhone',
    es: 'Cambiar la IP con internet móvil y modo avión en Android y iPhone',
    zh: '通过移动网络和飞行模式更换 Android 与 iPhone 的 IP',
    ko: 'Android와 iPhone에서 모바일 인터넷과 비행기 모드로 IP 변경하기',
  },
  'guide-gmail-forwarding': {
    ru: 'Пошаговый гайд по настройке переадресации писем из Gmail на другую почту',
    en: 'Step-by-step guide to forwarding Gmail emails to another inbox',
    es: 'Guía paso a paso para reenviar correos de Gmail a otro buzón',
    zh: '将 Gmail 邮件转发到另一个邮箱的分步指南',
    ko: 'Gmail 메일을 다른 메일함으로 전달하는 단계별 가이드',
  },
  'guide-account-farm': {
    ru: 'Ферма аккаунтов. Где брать аккаунты Discord, Twitter, Google. Прокси, накрутка, антидетекты?',
    en: 'Account farm: Discord, Twitter, Google accounts, proxies, boosting, antidetects',
    es: 'Granja de cuentas: Discord, Twitter, Google, proxies, boosting y antidetects',
    zh: '账号农场：Discord、Twitter、Google 账号、代理、增长与反检测',
    ko: '계정 팜: Discord, Twitter, Google 계정, 프록시, 부스트, 안티디텍트',
  },
  'guide-otc-kyc': {
    ru: 'OTC площадки и KYC сервисы в крипте. Где брать верификации и продавать WL?',
    en: 'OTC platforms and KYC services in crypto',
    es: 'Plataformas OTC y servicios KYC en cripto',
    zh: '加密领域的 OTC 平台与 KYC 服务',
    ko: '암호화폐 OTC 플랫폼과 KYC 서비스',
  },
  'guide-uids-addresses': {
    ru: 'Много UID и адресов для вывода на криптобиржи',
    en: 'UIDs and withdrawal addresses for crypto exchanges',
    es: 'UID y direcciones de retiro para exchanges cripto',
    zh: '加密交易所 UID 与提现地址',
    ko: '암호화폐 거래소용 UID와 출금 주소',
  },
  'guide-antidetect-setup': {
    ru: 'Как настроить антидетект-браузер: Dolphin, AdsPower и ShardX',
    en: 'How to configure an antidetect browser: Dolphin, AdsPower, and ShardX',
  },
};

export const proxyGuideCatalogEntries = [
  {
    id: 'guide-best-proxies',
    route: '/proxy-vpn/luchshie-proksi',
    title: { ru: 'Лучшие прокси-сервисы для аккаунтов: что выбрать' },
    description: { ru: 'Разбираем IPv4, ISP, Residential и Mobile-прокси: чем отличаются и какой тип брать под свою задачу.' },
  },
  {
    id: 'guide-best-mobile-proxies',
    route: '/proxy-vpn/luchshie-mobilnye-proksi',
    title: { ru: articleFallbackByRoute['/proxy-vpn/luchshie-mobilnye-proksi'].title },
    description: { ru: articleFallbackByRoute['/proxy-vpn/luchshie-mobilnye-proksi'].intro },
  },
];

export const guideCatalog = [
  ...proxyGuideCatalogEntries,
  ...guidePages.map((page) => ({
    id: page.id,
    route: `/guides/${page.slug}`,
    title: cardTitles[page.id] || { ru: page.name.ru },
    description: page.editorial.description,
  })),
];

export const guideCatalogById = Object.fromEntries(guideCatalog.map((guide) => [guide.id, guide]));
