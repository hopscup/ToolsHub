import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const siteUrl = 'https://hopscup.tools';
const distDir = path.resolve('dist');

const languages = [
  { code: 'ru', prefix: '', htmlLang: 'ru' },
  { code: 'en', prefix: '/en', htmlLang: 'en' },
  { code: 'es', prefix: '/es', htmlLang: 'es' },
  { code: 'zh', prefix: '/zh', htmlLang: 'zh-CN' },
  { code: 'ko', prefix: '/ko', htmlLang: 'ko' },
];

const sections = [
  {
    route: '/proxy-vpn',
    title: {
      ru: 'Прокси и VPN для аккаунтов, фарма и работы | Hopscup Tools',
      en: 'Proxy and VPN services for account work | Hopscup Tools',
      es: 'Proxies y VPN para cuentas y trabajo | Hopscup Tools',
      zh: '账号工作用代理和 VPN | Hopscup Tools',
      ko: '계정 작업용 프록시와 VPN | Hopscup Tools',
    },
    description: {
      ru: 'Подборка прокси и VPN: residential, mobile, ISP, IPv4/IPv6, сервисы с оплатой картой и криптой для аккаунтов, рекламы и автоматизации.',
      en: 'Curated proxy and VPN services: residential, mobile, ISP, IPv4/IPv6, cards and crypto payments for account work and automation.',
      es: 'Selección de servicios proxy y VPN: residential, mobile, ISP, IPv4/IPv6, pagos con tarjeta y cripto para cuentas y automatización.',
      zh: '精选代理和 VPN 服务：住宅、移动、ISP、IPv4/IPv6，支持银行卡和加密货币支付。',
      ko: '계정 작업과 자동화를 위한 residential, mobile, ISP, IPv4/IPv6 프록시 및 VPN 모음.',
    },
  },
  {
    route: '/antidetect',
    title: {
      ru: 'Антидетект браузеры для мультиаккаунтинга | Hopscup Tools',
      en: 'Antidetect browsers for multi-accounting | Hopscup Tools',
      es: 'Navegadores antidetect para multiaccounting | Hopscup Tools',
      zh: '多账号用反检测浏览器 | Hopscup Tools',
      ko: '멀티 계정용 안티디텍트 브라우저 | Hopscup Tools',
    },
    description: {
      ru: 'Сравнение антидетект браузеров: бесплатные профили, стартовые тарифы, цена за 100 профилей и варианты для базовых и усиленных задач.',
      en: 'Antidetect browser comparison: free profiles, starter plans, 100-profile pricing, and options for basic and advanced tasks.',
      es: 'Comparación de navegadores antidetect: perfiles gratis, planes iniciales, precio por 100 perfiles y opciones básicas o avanzadas.',
      zh: '反检测浏览器对比：免费配置文件、入门套餐、100 个配置文件价格以及基础/高级任务选择。',
      ko: '무료 프로필, 시작 요금제, 100개 프로필 가격, 기본/고급 작업용 안티디텍트 브라우저 비교.',
    },
  },
  {
    route: '/account-shop',
    title: {
      ru: 'Магазины аккаунтов и подписок | Hopscup Tools',
      en: 'Account and subscription shops | Hopscup Tools',
      es: 'Tiendas de cuentas y suscripciones | Hopscup Tools',
      zh: '账号和订阅商店 | Hopscup Tools',
      ko: '계정 및 구독 스토어 | Hopscup Tools',
    },
    description: {
      ru: 'Подборка сайтов и Telegram-магазинов для покупки аккаунтов, AI-подписок, Discord, Twitter, Google и других цифровых товаров.',
      en: 'Curated websites and Telegram shops for accounts, AI subscriptions, Discord, Twitter, Google, and other digital goods.',
      es: 'Sitios y tiendas de Telegram para comprar cuentas, suscripciones de IA, Discord, Twitter, Google y otros productos digitales.',
      zh: '用于购买账号、AI 订阅、Discord、Twitter、Google 和其他数字商品的网站与 Telegram 商店。',
      ko: '계정, AI 구독, Discord, Twitter, Google 및 기타 디지털 상품 구매용 웹사이트와 Telegram 상점 모음.',
    },
  },
  {
    route: '/foreign-cards',
    title: {
      ru: 'Зарубежные карты без KYC и с KYC | Hopscup Tools',
      en: 'Foreign virtual cards with and without KYC | Hopscup Tools',
      es: 'Tarjetas virtuales extranjeras con y sin KYC | Hopscup Tools',
      zh: '有 KYC 和无 KYC 的海外虚拟卡 | Hopscup Tools',
      ko: 'KYC 유무별 해외 가상 카드 | Hopscup Tools',
    },
    description: {
      ru: 'Сервисы зарубежных виртуальных карт для оплаты зарубежных подписок, App Store, Google Play, Airbnb, рекламы и других сервисов.',
      en: 'Foreign virtual card services for subscriptions, App Store, Google Play, Airbnb, ads, and other international services.',
      es: 'Servicios de tarjetas virtuales extranjeras para suscripciones, App Store, Google Play, Airbnb, publicidad y otros servicios.',
      zh: '用于支付订阅、App Store、Google Play、Airbnb、广告和其他海外服务的虚拟卡服务。',
      ko: '구독, App Store, Google Play, Airbnb, 광고 등 해외 서비스 결제를 위한 가상 카드 서비스.',
    },
  },
  {
    route: '/crypto-exchange',
    title: {
      ru: 'Купить и продать крипту онлайн и офлайн | Hopscup Tools',
      en: 'Buy and sell crypto online and offline | Hopscup Tools',
      es: 'Comprar y vender cripto online y offline | Hopscup Tools',
      zh: '线上和线下买卖加密货币 | Hopscup Tools',
      ko: '온라인/오프라인 암호화폐 매매 | Hopscup Tools',
    },
    description: {
      ru: 'Обменники для покупки и продажи криптовалюты: онлайн-обмен, офлайн-направления, наличные, карты, USDT и популярные сети.',
      en: 'Crypto exchange services for buying and selling: online exchange, offline directions, cash, cards, USDT, and popular networks.',
      es: 'Servicios para comprar y vender cripto: intercambio online, direcciones offline, efectivo, tarjetas, USDT y redes populares.',
      zh: '用于买卖加密货币的兑换服务：线上兑换、线下方向、现金、银行卡、USDT 和常用网络。',
      ko: '온라인 환전, 오프라인 거래, 현금, 카드, USDT 및 주요 네트워크를 지원하는 암호화폐 교환 서비스.',
    },
  },
  {
    route: '/sms-activators',
    title: {
      ru: 'SMS-активаторы для регистрации аккаунтов | Hopscup Tools',
      en: 'SMS activators for account registration | Hopscup Tools',
      es: 'Activadores SMS para registrar cuentas | Hopscup Tools',
      zh: '账号注册用短信接码服务 | Hopscup Tools',
      ko: '계정 등록용 SMS 인증 서비스 | Hopscup Tools',
    },
    description: {
      ru: 'SMS-активаторы и виртуальные номера для регистрации аккаунтов: гео, способы оплаты, крипта, карты и российские способы пополнения.',
      en: 'SMS activators and virtual numbers for account registration: geo, payments, crypto, cards, and Russian top-up methods.',
      es: 'Activadores SMS y números virtuales para registrar cuentas: países, pagos, cripto, tarjetas y métodos rusos.',
      zh: '账号注册用短信接码和虚拟号码：地区、支付方式、加密货币、银行卡和俄罗斯充值方式。',
      ko: '계정 등록용 SMS 인증 및 가상 번호: 지역, 결제, 암호화폐, 카드, 러시아 충전 방법.',
    },
  },
  {
    route: '/vps',
    title: {
      ru: 'VDS и VPS серверы для ботов и рабочих задач | Hopscup Tools',
      en: 'VDS and VPS servers for bots and work tasks | Hopscup Tools',
      es: 'Servidores VDS y VPS para bots y trabajo | Hopscup Tools',
      zh: '机器人和工作任务用 VDS/VPS 服务器 | Hopscup Tools',
      ko: '봇과 작업용 VDS/VPS 서버 | Hopscup Tools',
    },
    description: {
      ru: 'Подборка VDS/VPS хостингов для ботов, скриптов, парсинга, нод и удаленной работы: MaCloud, Xorek, VDSina, SpaceCore, AEZA.',
      en: 'VDS/VPS hosting for bots, scripts, scraping, nodes, and remote work: MaCloud, Xorek, VDSina, SpaceCore, AEZA.',
      es: 'Hosting VDS/VPS para bots, scripts, scraping, nodos y trabajo remoto: MaCloud, Xorek, VDSina, SpaceCore, AEZA.',
      zh: '用于机器人、脚本、采集、节点和远程工作的 VDS/VPS 主机：MaCloud、Xorek、VDSina、SpaceCore、AEZA。',
      ko: '봇, 스크립트, 스크래핑, 노드, 원격 작업용 VDS/VPS 호스팅: MaCloud, Xorek, VDSina, SpaceCore, AEZA.',
    },
  },
  {
    route: '/social-boost',
    title: {
      ru: 'Накрутка и буксы для рефералов и заданий | Hopscup Tools',
      en: 'Social boost and task exchanges for referrals | Hopscup Tools',
      es: 'Boost social y bolsas de tareas para referidos | Hopscup Tools',
      zh: '用于推荐和任务的平台 | Hopscup Tools',
      ko: '추천인과 작업용 소셜 부스트 및 태스크 플랫폼 | Hopscup Tools',
    },
    description: {
      ru: 'Сайты накрутки и буксы для рефералов, регистраций, социальных действий и Telegram-заданий с оплатой картой, СБП/Мир и криптой.',
      en: 'Social boost sites and task exchanges for referrals, registrations, social actions, and Telegram tasks with card and crypto payments.',
      es: 'Sitios de boost y bolsas de tareas para referidos, registros, acciones sociales y tareas de Telegram con pagos por tarjeta y cripto.',
      zh: '用于推荐、注册、社交行为和 Telegram 任务的增长网站与任务平台，支持银行卡和加密货币支付。',
      ko: '추천인, 가입, 소셜 액션, Telegram 작업을 위한 부스트 사이트와 태스크 거래소. 카드 및 암호화폐 결제 지원.',
    },
  },
  {
    route: '/steam-topup',
    title: {
      ru: 'Пополнение Steam из РФ и через предметы | Hopscup Tools',
      en: 'Steam top-up from Russia and through items | Hopscup Tools',
      es: 'Recarga de Steam desde Rusia y con ítems | Hopscup Tools',
      zh: '俄罗斯 Steam 充值与物品充值 | Hopscup Tools',
      ko: '러시아 Steam 충전 및 아이템 충전 | Hopscup Tools',
    },
    description: {
      ru: 'Способы пополнения Steam: по логину, через предметы CS/TF/Rust, пополнение из РФ, быстрые варианты и пополнение в плюс до 30%.',
      en: 'Steam top-up methods: by login, through CS/TF/Rust items, Russia-friendly options, fast top-ups, and up to +30% through items.',
      es: 'Métodos de recarga de Steam: por login, con ítems CS/TF/Rust, opciones para Rusia, recargas rápidas y hasta +30% con ítems.',
      zh: 'Steam 充值方式：通过登录名、CS/TF/Rust 物品、适合俄罗斯的快速充值，以及最高 +30% 的物品充值。',
      ko: 'Steam 충전 방법: 로그인 충전, CS/TF/Rust 아이템 충전, 러시아 친화 옵션, 빠른 충전, 아이템으로 최대 +30%.',
    },
  },
  {
    route: '/guides',
    title: {
      ru: 'Полезные гайды по аккаунтам, IP, Gmail и крипте | Hopscup Tools',
      en: 'Useful guides for accounts, IP, Gmail, and crypto | Hopscup Tools',
      es: 'Guías útiles sobre cuentas, IP, Gmail y cripto | Hopscup Tools',
      zh: '账号、IP、Gmail 和加密货币实用指南 | Hopscup Tools',
      ko: '계정, IP, Gmail, 암호화폐 유용한 가이드 | Hopscup Tools',
    },
    description: {
      ru: 'Гайды Hopscup по смене IP, Gmail-форвардингу, ферме аккаунтов, KYC/OTC площадкам, UID и адресам для бирж.',
      en: 'Hopscup guides on IP switching, Gmail forwarding, account farming, KYC/OTC platforms, UIDs, and exchange withdrawal addresses.',
      es: 'Guías de Hopscup sobre cambio de IP, reenvío de Gmail, granjas de cuentas, plataformas KYC/OTC, UID y direcciones para exchanges.',
      zh: 'Hopscup 关于换 IP、Gmail 转发、账号农场、KYC/OTC 平台、UID 和交易所地址的指南。',
      ko: 'IP 변경, Gmail 포워딩, 계정 파밍, KYC/OTC 플랫폼, UID, 거래소 출금 주소에 대한 Hopscup 가이드.',
    },
  },
];

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const localizedPath = (section, language) => `${language.prefix}${section.route}`;

const alternateLinks = (section) =>
  [
    ...languages.map((language) => `<link rel="alternate" hreflang="${language.code}" href="${siteUrl}${localizedPath(section, language)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${siteUrl}${section.route}" />`,
  ].join('\n    ');

const upsertAlternateLinks = (html, section) => {
  const withoutAlternates = html.replace(/\n\s*<link rel="alternate" hreflang=".*?" href=".*?" \/>/g, '');
  return withoutAlternates.replace(
    /<link rel="canonical" href=".*?" \/>/,
    (canonical) => `${canonical}\n    ${alternateLinks(section)}`,
  );
};

const replaceMeta = (html, section, language) => {
  const title = escapeHtml(section.title[language.code] || section.title.en);
  const description = escapeHtml(section.description[language.code] || section.description.en);
  const url = `${siteUrl}${localizedPath(section, language)}`;

  return upsertAlternateLinks(html, section)
    .replace(/<html lang=".*?">/, `<html lang="${language.htmlLang}">`)
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${description}" />`);
};

const indexHtml = await readFile(path.join(distDir, 'index.html'), 'utf8');

await Promise.all(
  languages.flatMap((language) =>
    sections.map(async (section) => {
      const routeDir = path.join(distDir, localizedPath(section, language));
      await mkdir(routeDir, { recursive: true });
      await writeFile(path.join(routeDir, 'index.html'), replaceMeta(indexHtml, section, language), 'utf8');
    }),
  ),
);

await Promise.all(
  languages
    .filter((language) => language.prefix)
    .map(async (language) => {
      const routeDir = path.join(distDir, language.prefix);
      await mkdir(routeDir, { recursive: true });
      await writeFile(path.join(routeDir, 'index.html'), replaceMeta(indexHtml, sections[0], language), 'utf8');
    }),
);

await writeFile(
  path.join(distDir, 'index.html'),
  replaceMeta(indexHtml, sections[0], languages[0]),
  'utf8',
);
