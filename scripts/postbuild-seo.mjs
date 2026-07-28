import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const siteUrl = 'https://hopscup.tools';
const distDir = path.resolve('dist');

const languages = [
  { code: 'ru', prefix: '', htmlLang: 'ru-RU', hrefLang: 'ru', ogLocale: 'ru_RU', label: 'Русский' },
  { code: 'en', prefix: '/en', htmlLang: 'en', hrefLang: 'en', ogLocale: 'en_US', label: 'English' },
  { code: 'es', prefix: '/es', htmlLang: 'es', hrefLang: 'es', ogLocale: 'es_ES', label: 'Español' },
  { code: 'zh', prefix: '/zh', htmlLang: 'zh-CN', hrefLang: 'zh-CN', ogLocale: 'zh_CN', label: '中文' },
  { code: 'ko', prefix: '/ko', htmlLang: 'ko-KR', hrefLang: 'ko-KR', ogLocale: 'ko_KR', label: '한국어' },
];

const sections = [
  {
    id: 'home',
    route: '/',
    priority: '1.0',
    changefreq: 'weekly',
    title: {
      ru: "Hopscup's Tools Hub — полезные сервисы для аккаунтов, прокси и крипты",
      en: "Hopscup's Tools Hub — useful services for accounts, proxies, and crypto",
      es: "Hopscup's Tools Hub — servicios útiles para cuentas, proxies y cripto",
      zh: "Hopscup's Tools Hub — 账号、代理和加密货币工具",
      ko: "Hopscup's Tools Hub — 계정, 프록시, 암호화폐 도구",
    },
    description: {
      ru: 'Подборка сервисов Hopscup: прокси и VPN, антидетекты, магазины аккаунтов, зарубежные карты, SMS-активаторы, VDS/VPS, криптообменники, Steam и полезные гайды.',
      en: 'A curated Hopscup directory of proxy and VPN services, antidetect browsers, account shops, virtual cards, SMS activators, VDS/VPS hosting, crypto exchanges, Steam top-ups, and practical guides.',
      es: 'Directorio de Hopscup con proxies y VPN, navegadores antidetect, tiendas de cuentas, tarjetas virtuales, activadores SMS, VDS/VPS, exchanges cripto, recargas Steam y guías.',
      zh: 'Hopscup 精选目录：代理和 VPN、反检测浏览器、账号商店、虚拟卡、短信接码、VDS/VPS、加密货币兑换、Steam 充值和实用指南。',
      ko: 'Hopscup 큐레이션 디렉터리: 프록시와 VPN, 안티디텍트 브라우저, 계정 상점, 가상 카드, SMS 인증, VDS/VPS, 암호화폐 환전, Steam 충전, 실용 가이드.',
    },
    heading: {
      ru: 'Полезные сервисы для работы с аккаунтами и цифровыми задачами',
      en: 'Useful services for accounts and digital workflows',
      es: 'Servicios útiles para cuentas y tareas digitales',
      zh: '账号和数字工作流实用服务',
      ko: '계정과 디지털 작업을 위한 유용한 서비스',
    },
    intro: {
      ru: 'На сайте собраны сервисы, которыми Hopscup пользуется для прокси, антидетектов, покупки аккаунтов, оплаты зарубежных сервисов, SMS-регистраций, серверов, крипты, Steam и реферальных задач.',
      en: 'This site collects services Hopscup uses for proxies, antidetect browsers, account purchases, international payments, SMS registrations, servers, crypto, Steam, and referral tasks.',
      es: 'El sitio reúne servicios que Hopscup usa para proxies, antidetects, compra de cuentas, pagos internacionales, registros SMS, servidores, cripto, Steam y tareas de referidos.',
      zh: '本站收集 Hopscup 用于代理、反检测浏览器、账号购买、国际支付、短信注册、服务器、加密货币、Steam 和推荐任务的服务。',
      ko: '이 사이트는 Hopscup이 프록시, 안티디텍트, 계정 구매, 해외 결제, SMS 가입, 서버, 암호화폐, Steam, 추천 작업에 사용하는 서비스를 모았습니다.',
    },
    keywords: {
      ru: 'прокси, vpn, антидетект, sms активаторы, зарубежные карты, купить аккаунты, купить крипту, vps серверы, пополнение steam, полезные гайды',
      en: 'proxy services, vpn, antidetect browser, sms activators, virtual cards, account shops, buy crypto, vps hosting, steam top up, useful guides',
      es: 'proxies, vpn, antidetect, activadores sms, tarjetas virtuales, tiendas de cuentas, comprar cripto, vps, recarga steam',
      zh: '代理, VPN, 反检测浏览器, 短信接码, 虚拟卡, 账号商店, 加密货币兑换, VPS, Steam 充值',
      ko: '프록시, VPN, 안티디텍트, SMS 인증, 가상 카드, 계정 상점, 암호화폐 환전, VPS, Steam 충전',
    },
    points: {
      ru: ['Все разделы открываются отдельными URL для индексации.', 'Карточки ведут на сервисы с реферальными ссылками и кратким описанием.', 'Есть русская, английская, испанская, китайская и корейская версии.'],
      en: ['Every section has a separate indexable URL.', 'Cards link to services with referral URLs and concise descriptions.', 'Russian, English, Spanish, Chinese, and Korean versions are available.'],
      es: ['Cada sección tiene una URL indexable separada.', 'Las tarjetas llevan a servicios con enlaces de referido y descripciones breves.', 'Hay versiones en ruso, inglés, español, chino y coreano.'],
      zh: ['每个分区都有独立可索引 URL。', '卡片包含服务链接、推荐链接和简短说明。', '提供俄语、英语、西班牙语、中文和韩语版本。'],
      ko: ['각 섹션은 별도의 색인 가능한 URL을 가집니다.', '카드는 추천 링크와 짧은 설명을 포함합니다.', '러시아어, 영어, 스페인어, 중국어, 한국어 버전을 제공합니다.'],
    },
    items: ['Proxy / VPN', 'Antidetect', 'Account Shop', 'Virtual Cards', 'Crypto Exchange', 'SMS Activators', 'VDS/VPS', 'Social Boost', 'Steam Top-up', 'Useful Guides'],
  },
  {
    id: 'proxy',
    route: '/proxy-vpn',
    priority: '1.0',
    changefreq: 'weekly',
    title: {
      ru: 'Прокси и VPN для аккаунтов, фарма и работы | Hopscup Tools',
      en: 'Proxy and VPN services for account work | Hopscup Tools',
      es: 'Proxies y VPN para cuentas y trabajo | Hopscup Tools',
      zh: '账号工作用代理和 VPN | Hopscup Tools',
      ko: '계정 작업용 프록시와 VPN | Hopscup Tools',
    },
    description: {
      ru: 'Подборка прокси и VPN: residential, mobile, ISP, IPv4/IPv6, сервисы с оплатой картой, СБП/Мир и криптой для аккаунтов, рекламы и автоматизации.',
      en: 'Curated proxy and VPN services: residential, mobile, ISP, IPv4/IPv6, cards and crypto payments for account work and automation.',
      es: 'Selección de servicios proxy y VPN: residential, mobile, ISP, IPv4/IPv6, pagos con tarjeta y cripto para cuentas y automatización.',
      zh: '精选代理和 VPN 服务：住宅、移动、ISP、IPv4/IPv6，支持银行卡和加密货币支付。',
      ko: '계정 작업과 자동화를 위한 residential, mobile, ISP, IPv4/IPv6 프록시 및 VPN 모음.',
    },
    heading: {
      ru: 'Прокси и VPN для рабочих задач',
      en: 'Proxy and VPN services for work',
      es: 'Proxies y VPN para trabajo',
      zh: '工作任务用代理和 VPN',
      ko: '작업용 프록시와 VPN',
    },
    intro: {
      ru: 'Раздел помогает подобрать прокси или VPN для аккаунтов, рекламных кабинетов, автоматизации, парсинга, ретродропов и повседневной работы с зарубежными сервисами.',
      en: 'This section helps choose proxy or VPN services for accounts, ad cabinets, automation, scraping, retro drops, and everyday work with international services.',
      es: 'Esta sección ayuda a elegir proxies o VPN para cuentas, anuncios, automatización, scraping, retro drops y trabajo diario con servicios internacionales.',
      zh: '本节帮助为账号、广告账户、自动化、采集、retrodrop 和日常海外服务工作选择代理或 VPN。',
      ko: '이 섹션은 계정, 광고 계정, 자동화, 스크래핑, 레트로드롭, 해외 서비스 작업에 맞는 프록시 또는 VPN 선택을 돕습니다.',
    },
    keywords: {
      ru: 'купить прокси, прокси для аккаунтов, мобильные прокси, residential proxy, ipv4 прокси, vpn для работы, прокси чекер',
      en: 'buy proxies, proxies for accounts, mobile proxies, residential proxy, ipv4 proxy, vpn for work, proxy checker',
      es: 'comprar proxies, proxies para cuentas, proxies móviles, residential proxy, ipv4 proxy, vpn para trabajo',
      zh: '购买代理, 账号代理, 移动代理, 住宅代理, IPv4 代理, 工作 VPN',
      ko: '프록시 구매, 계정 프록시, 모바일 프록시, residential proxy, IPv4 프록시, 작업용 VPN',
    },
    points: {
      ru: ['Для высокого траста чаще смотрят mobile, residential и ISP.', 'Для парсинга и простых задач часто хватает IPv4/IPv6.', 'Перед покупкой лучше сверять гео, тип прокси, способ оплаты и fraud score.'],
      en: ['Mobile, residential, and ISP proxies are usually better for trust-sensitive tasks.', 'IPv4/IPv6 is often enough for scraping and simpler automation.', 'Check geo, proxy type, payment method, and fraud score before buying.'],
      es: ['Mobile, residential e ISP suelen ser mejores para tareas sensibles al trust.', 'IPv4/IPv6 suele bastar para scraping y automatización simple.', 'Revisa GEO, tipo de proxy, pago y fraud score antes de comprar.'],
      zh: ['移动、住宅和 ISP 代理更适合高信任度任务。', 'IPv4/IPv6 通常足够用于采集和简单自动化。', '购买前检查地区、代理类型、支付方式和 fraud score。'],
      ko: ['신뢰가 중요한 작업에는 mobile, residential, ISP 프록시가 더 적합합니다.', '스크래핑과 단순 자동화에는 IPv4/IPv6로 충분한 경우가 많습니다.', '구매 전 GEO, 프록시 유형, 결제 방식, fraud score를 확인하세요.'],
    },
    items: ['ProxyShard', 'Proxyline', 'ProxyWing', 'Proxy-Seller', 'Proxy6', 'MobileProxy', 'Proxys.io', 'PPL VPN', 'ProstoVPN', 'Точка G'],
    serviceLinks: {
      Proxyline: '/proxy-vpn/proxyline',
      ProxyWing: '/proxy-vpn/proxywing',
      Proxy6: '/proxy-vpn/proxy6',
      MobileProxy: '/proxy-vpn/mobileproxy',
    },
  },
  {
    id: 'antidetect',
    route: '/antidetect',
    priority: '0.9',
    changefreq: 'weekly',
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
    heading: {
      ru: 'Антидетект браузеры под разные уровни задач',
      en: 'Antidetect browsers for different task levels',
      es: 'Antidetects para distintos niveles de trabajo',
      zh: '不同任务级别的反检测浏览器',
      ko: '작업 난이도별 안티디텍트 브라우저',
    },
    intro: {
      ru: 'Антидетект нужен, когда приходится вести несколько профилей и важно разделять отпечатки браузера, прокси, cookie и окружение аккаунтов.',
      en: 'Antidetect browsers help manage multiple profiles while separating browser fingerprints, proxies, cookies, and account environments.',
      es: 'Los antidetects ayudan a gestionar muchos perfiles separando huellas del navegador, proxies, cookies y entornos de cuentas.',
      zh: '反检测浏览器用于管理多个资料，并隔离浏览器指纹、代理、cookie 和账号环境。',
      ko: '안티디텍트 브라우저는 여러 프로필을 관리하고 브라우저 fingerprint, 프록시, 쿠키, 계정 환경을 분리하는 데 사용됩니다.',
    },
    keywords: {
      ru: 'антидетект браузер, купить антидетект, dolphin anty, adspower, octo browser, gologin, multilogin, мультиаккаунтинг',
      en: 'antidetect browser, multi-accounting browser, Dolphin Anty, AdsPower, Octo Browser, GoLogin, Multilogin',
      es: 'navegador antidetect, multiaccounting, Dolphin Anty, AdsPower, Octo Browser, GoLogin, Multilogin',
      zh: '反检测浏览器, 多账号, Dolphin Anty, AdsPower, Octo Browser, GoLogin, Multilogin',
      ko: '안티디텍트 브라우저, 멀티 계정, Dolphin Anty, AdsPower, Octo Browser, GoLogin, Multilogin',
    },
    points: {
      ru: ['Базовые решения подходят для обычного мультиаккаунтинга.', 'Усиленные варианты чаще берут под строгий антифрод.', 'Смотри не только цену, но и бесплатные профили, командную работу и стабильность.'],
      en: ['Basic tools are suitable for regular multi-accounting.', 'Advanced options are usually used for stricter antifraud.', 'Check pricing, free profiles, team features, and stability.'],
      es: ['Las opciones básicas sirven para multiaccounting normal.', 'Las avanzadas se usan para antifraude más estricto.', 'Revisa precio, perfiles gratis, funciones de equipo y estabilidad.'],
      zh: ['基础工具适合普通多账号。', '高级方案更适合严格风控。', '要看价格、免费资料、团队功能和稳定性。'],
      ko: ['기본 도구는 일반 멀티 계정 작업에 적합합니다.', '고급 옵션은 더 강한 antifraud 작업에 사용됩니다.', '가격, 무료 프로필, 팀 기능, 안정성을 함께 확인하세요.'],
    },
    items: ['Dolphin Anty', 'AdsPower', 'Octo Browser', 'Incogniton', 'Vision', 'GoLogin', 'MoreLogin', 'Multilogin', 'Afina'],
  },
  {
    id: 'stores',
    route: '/account-shop',
    priority: '0.95',
    changefreq: 'weekly',
    title: {
      ru: 'Магазины аккаунтов и дешевых AI-подписок | Hopscup Tools',
      en: 'Account shops and cheap AI subscriptions | Hopscup Tools',
      es: 'Tiendas de cuentas y suscripciones IA baratas | Hopscup Tools',
      zh: '账号商店和低价 AI 订阅 | Hopscup Tools',
      ko: '계정 상점과 저렴한 AI 구독 | Hopscup Tools',
    },
    description: {
      ru: 'Подборка сайтов и Telegram-магазинов для покупки аккаунтов, дешевых подписок ChatGPT Plus, Gemini Pro, Claude, Discord, Twitter, Google и других цифровых товаров.',
      en: 'Curated websites and Telegram shops for accounts, cheap ChatGPT Plus, Gemini Pro, Claude subscriptions, Discord, Twitter, Google, and other digital goods.',
      es: 'Sitios y tiendas de Telegram para comprar cuentas, suscripciones baratas de ChatGPT Plus, Gemini Pro, Claude, Discord, Twitter, Google y otros productos digitales.',
      zh: '用于购买账号、低价 ChatGPT Plus、Gemini Pro、Claude 订阅、Discord、Twitter、Google 和其他数字商品的网站与 Telegram 商店。',
      ko: '계정, 저렴한 ChatGPT Plus, Gemini Pro, Claude 구독, Discord, Twitter, Google 및 기타 디지털 상품 구매용 웹사이트와 Telegram 상점 모음.',
    },
    heading: {
      ru: 'Магазины аккаунтов, подписок и цифровых товаров',
      en: 'Account, subscription, and digital goods stores',
      es: 'Tiendas de cuentas, suscripciones y productos digitales',
      zh: '账号、订阅和数字商品商店',
      ko: '계정, 구독, 디지털 상품 상점',
    },
    intro: {
      ru: 'Раздел для поиска аккаунтов, AI-подписок и цифровых товаров. Включает сайты вроде DarkStore/FunPay и Telegram-боты, где часто бывают дешевые подписки на ChatGPT, Gemini, Claude и другие сервисы.',
      en: 'This section covers accounts, AI subscriptions, and digital goods. It includes marketplaces like DarkStore/FunPay and Telegram bots with discounted ChatGPT, Gemini, Claude, and other subscriptions.',
      es: 'Esta sección reúne cuentas, suscripciones IA y productos digitales. Incluye marketplaces como DarkStore/FunPay y bots de Telegram con suscripciones baratas de ChatGPT, Gemini, Claude y otros servicios.',
      zh: '本节涵盖账号、AI 订阅和数字商品，包括 DarkStore/FunPay 等市场，以及常见低价 ChatGPT、Gemini、Claude 订阅的 Telegram 机器人。',
      ko: '이 섹션은 계정, AI 구독, 디지털 상품을 다룹니다. DarkStore/FunPay 같은 마켓과 ChatGPT, Gemini, Claude 등을 저렴하게 파는 Telegram 봇이 포함됩니다.',
    },
    keywords: {
      ru: 'дешевые подписки на нейросети, chatgpt plus дешево, купить chatgpt plus, gemini pro дешево, купить claude, магазины аккаунтов, боты с подписками',
      en: 'cheap AI subscriptions, cheap ChatGPT Plus, buy ChatGPT Plus, cheap Gemini Pro, buy Claude, account shops, Telegram subscription bots',
      es: 'suscripciones IA baratas, ChatGPT Plus barato, comprar ChatGPT Plus, Gemini Pro barato, comprar Claude, tiendas de cuentas',
      zh: '低价 AI 订阅, ChatGPT Plus, Gemini Pro, Claude, 账号商店, Telegram 订阅机器人',
      ko: '저렴한 AI 구독, ChatGPT Plus, Gemini Pro, Claude, 계정 상점, Telegram 구독 봇',
    },
    points: {
      ru: ['Для большинства задач удобно начинать с DarkStore и FunPay.', 'В Telegram-магазинах часто бывают дешевые подписки на AI-сервисы.', 'Перед покупкой всегда проверяй отзывы, условия замены и описание товара.'],
      en: ['DarkStore and FunPay are convenient starting points for many tasks.', 'Telegram shops often have discounted AI subscriptions.', 'Always check reviews, replacement rules, and product descriptions before buying.'],
      es: ['DarkStore y FunPay son buenos puntos de partida.', 'Los bots de Telegram suelen tener suscripciones IA con descuento.', 'Revisa reseñas, garantía y descripción antes de comprar.'],
      zh: ['DarkStore 和 FunPay 是很多任务的良好起点。', 'Telegram 商店常有折扣 AI 订阅。', '购买前务必检查评价、替换规则和商品描述。'],
      ko: ['DarkStore와 FunPay는 많은 작업의 좋은 시작점입니다.', 'Telegram 상점에는 할인된 AI 구독이 자주 있습니다.', '구매 전 리뷰, 교체 규칙, 상품 설명을 확인하세요.'],
    },
    items: ['DarkStore', 'ACCSMarket', 'GGSel', 'FunPay', 'Plati Market', 'LZT Market', 'Лачуга скамера', 'TheGod Shop', 'Crassus Market', 'Apel0sin', 'apel0sin | market 2.0', 'Petrovich'],
  },
  {
    id: 'cards',
    route: '/foreign-cards',
    priority: '0.9',
    changefreq: 'weekly',
    title: {
      ru: 'Зарубежные виртуальные карты без KYC и с KYC | Hopscup Tools',
      en: 'Foreign virtual cards with and without KYC | Hopscup Tools',
      es: 'Tarjetas virtuales extranjeras con y sin KYC | Hopscup Tools',
      zh: '有 KYC 和无 KYC 的海外虚拟卡 | Hopscup Tools',
      ko: 'KYC 유무별 해외 가상 카드 | Hopscup Tools',
    },
    description: {
      ru: 'Сервисы зарубежных виртуальных карт для оплаты ChatGPT, Gemini, Claude, App Store, Google Play, Airbnb, рекламы, подписок и других зарубежных сервисов.',
      en: 'Foreign virtual card services for paying ChatGPT, Gemini, Claude, App Store, Google Play, Airbnb, ads, subscriptions, and other international services.',
      es: 'Servicios de tarjetas virtuales extranjeras para pagar ChatGPT, Gemini, Claude, App Store, Google Play, Airbnb, publicidad y suscripciones.',
      zh: '用于支付 ChatGPT、Gemini、Claude、App Store、Google Play、Airbnb、广告、订阅和其他海外服务的虚拟卡服务。',
      ko: 'ChatGPT, Gemini, Claude, App Store, Google Play, Airbnb, 광고, 구독 등 해외 서비스 결제를 위한 가상 카드 서비스.',
    },
    heading: {
      ru: 'Зарубежные карты для оплаты сервисов',
      en: 'Foreign cards for service payments',
      es: 'Tarjetas extranjeras para pagar servicios',
      zh: '用于服务支付的海外卡',
      ko: '서비스 결제를 위한 해외 카드',
    },
    intro: {
      ru: 'Зарубежные карты помогают оплачивать сервисы, где российские карты не проходят: подписки на нейросети, магазины приложений, бронирования, рекламу и зарубежные платформы.',
      en: 'Foreign cards help pay for services where local cards may fail: AI subscriptions, app stores, bookings, ads, and international platforms.',
      es: 'Las tarjetas extranjeras ayudan a pagar servicios donde las tarjetas locales no pasan: IA, apps, reservas, anuncios y plataformas internacionales.',
      zh: '海外卡可用于支付本地卡无法通过的服务：AI 订阅、应用商店、预订、广告和国际平台。',
      ko: '해외 카드는 현지 카드가 거절되는 AI 구독, 앱 스토어, 예약, 광고, 해외 플랫폼 결제에 도움이 됩니다.',
    },
    keywords: {
      ru: 'зарубежная карта, виртуальная карта без kyc, карта для chatgpt, оплата зарубежных сервисов, карта для app store, карта для google play',
      en: 'foreign virtual card, no kyc card, card for ChatGPT, pay international services, App Store card, Google Play card',
      es: 'tarjeta virtual extranjera, tarjeta sin kyc, tarjeta para ChatGPT, pagar servicios internacionales',
      zh: '海外虚拟卡, 无 KYC 卡, ChatGPT 支付, 国际服务支付',
      ko: '해외 가상 카드, KYC 없는 카드, ChatGPT 결제, 해외 서비스 결제',
    },
    points: {
      ru: ['Без KYC обычно быстрее старт, но могут быть ограничения.', 'С KYC чаще больше лимиты и стабильность.', 'Перед выпуском карты проверь комиссии, пополнение и поддержку нужного сервиса.'],
      en: ['No-KYC options are usually faster to start but may have limits.', 'KYC options often provide higher limits and more stability.', 'Check fees, top-up methods, and supported services before issuing a card.'],
      es: ['Sin KYC suele ser más rápido, pero puede tener límites.', 'Con KYC suele haber más límites y estabilidad.', 'Revisa comisiones, recarga y soporte antes de emitir la tarjeta.'],
      zh: ['无 KYC 启动更快，但可能有限制。', '有 KYC 通常额度更高、更稳定。', '开卡前检查手续费、充值方式和服务支持。'],
      ko: ['No-KYC 옵션은 시작이 빠르지만 제한이 있을 수 있습니다.', 'KYC 옵션은 한도와 안정성이 더 높은 경우가 많습니다.', '발급 전 수수료, 충전 방법, 지원 서비스를 확인하세요.'],
    },
    items: ['Zarub', 'Vezdekarta', 'Cashinout'],
  },
  {
    id: 'crypto',
    route: '/crypto-exchange',
    priority: '0.85',
    changefreq: 'weekly',
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
    heading: {
      ru: 'Обмен крипты онлайн и офлайн',
      en: 'Online and offline crypto exchange',
      es: 'Cambio cripto online y offline',
      zh: '线上与线下加密货币兑换',
      ko: '온라인 및 오프라인 암호화폐 환전',
    },
    intro: {
      ru: 'Раздел для покупки, продажи и обмена криптовалюты через Telegram-боты, сайты и офлайн-направления. Перед сделкой важно сверять курс, сеть, лимиты и условия.',
      en: 'This section covers buying, selling, and exchanging crypto through Telegram bots, websites, and offline directions. Always check rates, networks, limits, and terms.',
      es: 'Esta sección cubre compra, venta e intercambio de cripto mediante bots, sitios y direcciones offline. Revisa tasa, red, límites y condiciones.',
      zh: '本节涵盖通过 Telegram 机器人、网站和线下渠道买卖兑换加密货币。交易前要检查汇率、网络、限额和条件。',
      ko: '이 섹션은 Telegram 봇, 웹사이트, 오프라인 방향을 통한 암호화폐 매매와 환전을 다룹니다. 환율, 네트워크, 한도, 조건을 확인하세요.',
    },
    keywords: {
      ru: 'купить крипту, продать крипту, обменник криптовалют, usdt обменник, крипта за рубли, обмен usdt',
      en: 'buy crypto, sell crypto, crypto exchange, USDT exchange, crypto to cash',
      es: 'comprar cripto, vender cripto, exchange cripto, cambio USDT',
      zh: '购买加密货币, 出售加密货币, USDT 兑换, 加密货币兑换',
      ko: '암호화폐 구매, 암호화폐 판매, USDT 환전, 암호화폐 교환',
    },
    points: {
      ru: ['Перед обменом сверяй курс, комиссию, сеть и минимальную сумму.', 'Первый перевод лучше делать тестовой суммой.', 'Для крупных сумм заранее согласовывай формат сделки и реквизиты.'],
      en: ['Check the rate, fee, network, and minimum amount before exchanging.', 'Use a small test amount for the first transfer.', 'For larger amounts, agree on deal format and details first.'],
      es: ['Revisa tasa, comisión, red e importe mínimo.', 'Haz primero una transferencia pequeña de prueba.', 'Para importes grandes, acuerda condiciones y datos antes.'],
      zh: ['兑换前检查汇率、手续费、网络和最低金额。', '第一次先用小额测试。', '大额交易前先确认交易方式和收款信息。'],
      ko: ['환전 전 환율, 수수료, 네트워크, 최소 금액을 확인하세요.', '첫 전송은 소액 테스트로 하세요.', '큰 금액은 거래 방식과 정보를 미리 확인하세요.'],
    },
    items: ['Prosto Exchange', 'Keine Exchange'],
  },
  {
    id: 'sms',
    route: '/sms-activators',
    priority: '0.9',
    changefreq: 'weekly',
    title: {
      ru: 'SMS-активаторы и виртуальные номера для регистрации | Hopscup Tools',
      en: 'SMS activators and virtual numbers for registrations | Hopscup Tools',
      es: 'Activadores SMS y números virtuales para registros | Hopscup Tools',
      zh: '注册用短信接码和虚拟号码 | Hopscup Tools',
      ko: '가입용 SMS 인증 및 가상 번호 | Hopscup Tools',
    },
    description: {
      ru: 'SMS-активаторы и виртуальные номера для регистрации аккаунтов: гео, способы оплаты, крипта, карты и российские способы пополнения.',
      en: 'SMS activators and virtual numbers for account registration: geo, payments, crypto, cards, and local top-up methods.',
      es: 'Activadores SMS y números virtuales para registrar cuentas: países, pagos, cripto, tarjetas y métodos locales.',
      zh: '账号注册用短信接码和虚拟号码：地区、支付方式、加密货币、银行卡和本地充值方式。',
      ko: '계정 등록용 SMS 인증 및 가상 번호: 지역, 결제, 암호화폐, 카드, 현지 충전 방법.',
    },
    heading: {
      ru: 'SMS-активаторы для регистрации аккаунтов',
      en: 'SMS activators for account registration',
      es: 'Activadores SMS para registrar cuentas',
      zh: '账号注册用 SMS 接码',
      ko: '계정 등록용 SMS 인증',
    },
    intro: {
      ru: 'Виртуальные номера помогают получать SMS-коды для регистрации. Важно подбирать страну, сервис, процент доходимости и способ оплаты.',
      en: 'Virtual numbers help receive SMS codes for registrations. Pick country, target service, delivery rate, and payment method carefully.',
      es: 'Los números virtuales ayudan a recibir códigos SMS para registros. Elige país, servicio, tasa de entrega y pago con cuidado.',
      zh: '虚拟号码用于接收注册短信验证码。要仔细选择国家、目标服务、到达率和支付方式。',
      ko: '가상 번호는 가입용 SMS 코드를 받는 데 사용됩니다. 국가, 대상 서비스, 도달률, 결제 방식을 확인하세요.',
    },
    keywords: {
      ru: 'sms активатор, виртуальный номер, купить номер для регистрации, смс активация, sms fast, smspool, hero sms',
      en: 'sms activator, virtual number, buy number for registration, sms verification, SMS Fast, SMSPool, Hero SMS',
      es: 'activador sms, número virtual, comprar número para registro, verificación sms',
      zh: '短信接码, 虚拟号码, 注册号码, SMS 验证',
      ko: 'SMS 인증, 가상 번호, 가입 번호 구매, SMS verification',
    },
    points: {
      ru: ['Лучше брать номер той же страны, что прокси или VPN.', 'Смотри процент доходимости для нужного сервиса и гео.', 'Если код не пришел, многие сервисы возвращают средства за неудачную активацию.'],
      en: ['Match the number country with your proxy or VPN when possible.', 'Check delivery rate for the target service and geo.', 'Many services refund failed activations if the code is not received.'],
      es: ['Si es posible, usa número del mismo país que el proxy/VPN.', 'Revisa tasa de entrega para el servicio y GEO.', 'Muchos servicios reembolsan si no llega el código.'],
      zh: ['尽量让号码国家与代理或 VPN 一致。', '检查目标服务和地区的到达率。', '验证码未收到时，很多服务会退还失败激活费用。'],
      ko: ['가능하면 번호 국가를 프록시/VPN과 맞추세요.', '대상 서비스와 GEO의 도달률을 확인하세요.', '코드가 오지 않으면 실패한 인증 비용을 환불하는 서비스가 많습니다.'],
    },
    items: ['HeroSMS', 'SMS Fast', 'SMSPool', 'GrizzlySMS', 'Tiger SMS', '365-SMS'],
  },
  {
    id: 'vps',
    route: '/vps',
    priority: '0.85',
    changefreq: 'weekly',
    title: {
      ru: 'VDS и VPS серверы для ботов, скриптов и работы | Hopscup Tools',
      en: 'VDS and VPS servers for bots, scripts, and work | Hopscup Tools',
      es: 'Servidores VDS/VPS para bots, scripts y trabajo | Hopscup Tools',
      zh: '机器人、脚本和工作用 VDS/VPS 服务器 | Hopscup Tools',
      ko: '봇, 스크립트, 작업용 VDS/VPS 서버 | Hopscup Tools',
    },
    description: {
      ru: 'Подборка VDS/VPS хостингов для ботов, скриптов, парсинга, нод и удаленной работы: MaCloud, Xorek, VDSina, SpaceCore, AEZA.',
      en: 'VDS/VPS hosting for bots, scripts, scraping, nodes, and remote work: MaCloud, Xorek, VDSina, SpaceCore, AEZA.',
      es: 'Hosting VDS/VPS para bots, scripts, scraping, nodos y trabajo remoto: MaCloud, Xorek, VDSina, SpaceCore, AEZA.',
      zh: '用于机器人、脚本、采集、节点和远程工作的 VDS/VPS 主机：MaCloud、Xorek、VDSina、SpaceCore、AEZA。',
      ko: '봇, 스크립트, 스크래핑, 노드, 원격 작업용 VDS/VPS 호스팅: MaCloud, Xorek, VDSina, SpaceCore, AEZA.',
    },
    heading: {
      ru: 'VDS/VPS серверы для рабочих задач',
      en: 'VDS/VPS servers for work tasks',
      es: 'Servidores VDS/VPS para tareas de trabajo',
      zh: '工作任务用 VDS/VPS 服务器',
      ko: '작업용 VDS/VPS 서버',
    },
    intro: {
      ru: 'Серверы пригодятся, когда бот, скрипт, парсер, нода или рабочая среда должны стабильно работать независимо от домашнего ПК.',
      en: 'Servers are useful when a bot, script, scraper, node, or work environment must run reliably without depending on a home PC.',
      es: 'Los servidores sirven cuando un bot, script, scraper, nodo o entorno de trabajo debe funcionar sin depender del PC de casa.',
      zh: '当机器人、脚本、采集器、节点或工作环境需要独立于家用电脑稳定运行时，服务器很有用。',
      ko: '봇, 스크립트, 스크래퍼, 노드, 작업 환경이 집 PC와 무관하게 안정적으로 실행되어야 할 때 서버가 필요합니다.',
    },
    keywords: {
      ru: 'vps сервер, vds сервер, сервер для бота, хостинг для парсинга, сервер для ноды, macloud, xorek, vdsina',
      en: 'vps server, vds server, server for bot, scraping hosting, node server, MaCloud, Xorek, VDSina',
      es: 'servidor vps, servidor vds, servidor para bot, hosting scraping',
      zh: 'VPS 服务器, VDS 服务器, 机器人服务器, 采集主机',
      ko: 'VPS 서버, VDS 서버, 봇 서버, 스크래핑 호스팅',
    },
    points: {
      ru: ['Для стабильности лучше смотреть аптайм, поддержку и панель управления.', 'Для простых ботов часто хватает недорогого тарифа.', 'Для нод и парсинга важны ресурсы, локация и сетевые лимиты.'],
      en: ['Check uptime, support, and the control panel for stability.', 'Simple bots often work on cheaper plans.', 'Nodes and scraping depend on resources, location, and network limits.'],
      es: ['Revisa uptime, soporte y panel para estabilidad.', 'Bots simples suelen funcionar en planes baratos.', 'Nodos y scraping dependen de recursos, ubicación y límites de red.'],
      zh: ['稳定性要看 uptime、支持和控制面板。', '简单机器人通常便宜套餐就够。', '节点和采集更依赖资源、位置和网络限制。'],
      ko: ['안정성은 uptime, 지원, 관리 패널을 확인하세요.', '간단한 봇은 저렴한 요금제로 충분한 경우가 많습니다.', '노드와 스크래핑은 리소스, 위치, 네트워크 제한이 중요합니다.'],
    },
    items: ['MaCloud', 'Xorek', 'VDSina', 'SpaceCore', 'AEZA'],
  },
  {
    id: 'social',
    route: '/social-boost',
    priority: '0.85',
    changefreq: 'weekly',
    title: {
      ru: 'Накрутка, буксы и рефералы для Telegram-задач | Hopscup Tools',
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
    heading: {
      ru: 'Накрутка и буксы для рефералов',
      en: 'Social boost and task exchanges for referrals',
      es: 'Boost social y bolsas de tareas para referidos',
      zh: '推荐和任务平台',
      ko: '추천인용 소셜 부스트와 태스크 플랫폼',
    },
    intro: {
      ru: 'Раздел для задач, где нужны регистрации, рефералы или простые действия от исполнителей: сайты накрутки дают скорость, буксы дают более ручной формат.',
      en: 'This section is for registrations, referrals, and simple user actions: boost sites provide speed, while task exchanges offer a more manual format.',
      es: 'Sección para registros, referidos y acciones simples: los sitios de boost dan velocidad, las bolsas de tareas dan un formato más manual.',
      zh: '本节适合需要注册、推荐用户或执行者完成简单操作的任务：增长网站速度快，任务平台更偏人工。',
      ko: '가입, 추천인, 간단한 사용자 작업이 필요할 때 쓰는 섹션입니다. 부스트 사이트는 빠르고, 태스크 거래소는 더 수동적인 방식입니다.',
    },
    keywords: {
      ru: 'накрутка рефералов, где брать рефералов, буксы, задания за деньги, регистрация в telegram боте, socpublic, unu, twiboost',
      en: 'referral boost, task exchanges, paid tasks, Telegram bot registrations, Socpublic, UNU, Twiboost',
      es: 'referidos, bolsas de tareas, tareas pagadas, registros Telegram',
      zh: '推荐增长, 任务平台, 付费任务, Telegram 注册',
      ko: '추천인 부스트, 태스크 거래소, 유료 작업, Telegram 가입',
    },
    points: {
      ru: ['Сайты накрутки удобнее, когда важна скорость.', 'Буксы полезны, когда нужно подтверждение вроде скрина или Telegram-логина.', 'Перед подтверждением задания лучше проверять исполнителей и повторы.'],
      en: ['Boost sites are convenient when speed matters.', 'Task exchanges are useful when proof like screenshots or Telegram logins is needed.', 'Check performers and duplicate submissions before approval.'],
      es: ['Los sitios de boost sirven cuando importa la velocidad.', 'Las bolsas sirven cuando necesitas prueba como captura o usuario de Telegram.', 'Revisa ejecutores y duplicados antes de aprobar.'],
      zh: ['需要速度时增长网站更方便。', '需要截图或 Telegram 用户名等证明时，任务平台更有用。', '确认前检查执行者和重复提交。'],
      ko: ['속도가 중요하면 부스트 사이트가 편합니다.', '스크린샷이나 Telegram 아이디 증명이 필요하면 태스크 거래소가 유용합니다.', '승인 전 수행자와 중복 제출을 확인하세요.'],
    },
    items: ['TwiBoost', 'Soc-proof', 'Boost-gram', 'EasyLiker', 'SMMLaba', 'SMMPrime', 'Socpublic', 'UNU'],
  },
  {
    id: 'steam',
    route: '/steam-topup',
    priority: '0.85',
    changefreq: 'weekly',
    title: {
      ru: 'Пополнение Steam из РФ по логину и через предметы | Hopscup Tools',
      en: 'Steam top-up by login and through items | Hopscup Tools',
      es: 'Recarga de Steam por login y con ítems | Hopscup Tools',
      zh: 'Steam 登录名充值与物品充值 | Hopscup Tools',
      ko: 'Steam 로그인 충전 및 아이템 충전 | Hopscup Tools',
    },
    description: {
      ru: 'Способы пополнения Steam: по логину, через предметы CS/TF/Rust, пополнение из РФ, быстрые варианты и пополнение в плюс до 30%.',
      en: 'Steam top-up methods: by login, CS/TF/Rust items, local top-ups, fast options, and item-based top-ups with potential upside.',
      es: 'Métodos de recarga de Steam: por login, con ítems CS/TF/Rust, opciones rápidas y recarga con ítems.',
      zh: 'Steam 充值方式：通过登录名、CS/TF/Rust 物品、本地快速充值和物品充值。',
      ko: 'Steam 충전 방법: 로그인 충전, CS/TF/Rust 아이템 충전, 현지 빠른 충전, 아이템 충전.',
    },
    heading: {
      ru: 'Пополнение Steam быстро или через предметы',
      en: 'Steam top-up by login or through items',
      es: 'Recarga Steam por login o con ítems',
      zh: '通过登录名或物品充值 Steam',
      ko: '로그인 또는 아이템으로 Steam 충전',
    },
    intro: {
      ru: 'Можно пополнять Steam быстро по логину с комиссией или через предметы, если готов сверять цены и ждать продажи на маркете.',
      en: 'Steam can be topped up quickly by login with a fee or through items if you are ready to compare prices and wait for market sales.',
      es: 'Puedes recargar Steam por login con comisión o mediante ítems si estás listo para comparar precios y esperar la venta.',
      zh: 'Steam 可以通过登录名快速充值并支付手续费，也可以通过物品充值，但需要比价并等待市场出售。',
      ko: 'Steam은 수수료를 내고 로그인으로 빠르게 충전하거나, 가격 비교와 판매 대기를 감수하고 아이템으로 충전할 수 있습니다.',
    },
    keywords: {
      ru: 'пополнение steam, пополнить steam из россии, steam по логину, пополнение steam предметами, lis skins, tf2lavka, cs money',
      en: 'Steam top up, Steam login top up, Steam items top up, LIS-SKINS, TF2Lavka, CS.MONEY',
      es: 'recarga Steam, recarga por login Steam, ítems Steam',
      zh: 'Steam 充值, Steam 登录名充值, Steam 物品充值',
      ko: 'Steam 충전, Steam 로그인 충전, Steam 아이템 충전',
    },
    points: {
      ru: ['Через логин проще и быстрее, но обычно с комиссией.', 'Через предметы можно выйти в плюс, но нужно сверять ликвидность и цену в Steam.', 'Для РФ также встречается пополнение через банки вроде Сбера и Ozon с комиссией.'],
      en: ['Login top-up is simpler and faster but usually has a fee.', 'Item-based top-ups can be profitable, but liquidity and Steam prices must be checked.', 'Local bank top-ups may also be available with a commission.'],
      es: ['Por login es más fácil y rápido, pero suele tener comisión.', 'Con ítems puede ser rentable, pero revisa liquidez y precio.', 'También puede haber opciones bancarias locales con comisión.'],
      zh: ['登录名充值更简单更快，但通常有手续费。', '物品充值可能更划算，但必须检查流动性和 Steam 价格。', '本地银行充值也可能可用，但会有手续费。'],
      ko: ['로그인 충전은 쉽고 빠르지만 보통 수수료가 있습니다.', '아이템 충전은 이득일 수 있지만 유동성과 Steam 가격을 확인해야 합니다.', '현지 은행 충전도 수수료와 함께 가능할 수 있습니다.'],
    },
    items: ['LIS-SKINS', 'TF2Lavka', 'AIM.market', 'CS.MONEY', 'GGSel', 'Playerok'],
  },
  {
    id: 'guides',
    route: '/guides',
    priority: '0.75',
    changefreq: 'monthly',
    title: {
      ru: 'Полезные гайды по аккаунтам, IP, Gmail и крипте | Hopscup Tools',
      en: 'Useful guides for accounts, IP, Gmail, and crypto | Hopscup Tools',
      es: 'Guías útiles sobre cuentas, IP, Gmail y cripto | Hopscup Tools',
      zh: '账号、IP、Gmail 和加密货币实用指南 | Hopscup Tools',
      ko: '계정, IP, Gmail, 암호화폐 유용한 가이드 | Hopscup Tools',
    },
    description: {
      ru: 'Гайды Hopscup по смене IP, Gmail-форвардингу, ферме аккаунтов, KYC/OTC площадкам, UID и адресам для бирж.',
      en: 'Hopscup guides on IP changes, Gmail forwarding, account farms, KYC/OTC platforms, UIDs, and exchange addresses.',
      es: 'Guías de Hopscup sobre cambio de IP, reenvío de Gmail, granjas de cuentas, plataformas KYC/OTC, UID y direcciones para exchanges.',
      zh: 'Hopscup 关于换 IP、Gmail 转发、账号农场、KYC/OTC 平台、UID 和交易所地址的指南。',
      ko: 'IP 변경, Gmail 포워딩, 계정 파밍, KYC/OTC 플랫폼, UID, 거래소 출금 주소에 대한 Hopscup 가이드.',
    },
    heading: {
      ru: 'Полезные гайды Hopscup',
      en: 'Useful Hopscup guides',
      es: 'Guías útiles de Hopscup',
      zh: 'Hopscup 实用指南',
      ko: 'Hopscup 유용한 가이드',
    },
    intro: {
      ru: 'Здесь собраны отдельные материалы, которые помогают настроить базовую инфраструктуру: почты, IP, аккаунты, адреса и KYC/OTC-процессы.',
      en: 'This section collects practical materials for basic infrastructure: emails, IPs, accounts, addresses, and KYC/OTC processes.',
      es: 'Aquí hay materiales prácticos para infraestructura básica: correos, IP, cuentas, direcciones y procesos KYC/OTC.',
      zh: '这里收集用于基础基础设施的实用材料：邮箱、IP、账号、地址和 KYC/OTC 流程。',
      ko: '이 섹션은 이메일, IP, 계정, 주소, KYC/OTC 프로세스 등 기본 인프라에 대한 실용 자료를 모았습니다.',
    },
    keywords: {
      ru: 'гайды hopscup, смена ip, gmail форвардинг, ферма аккаунтов, kyc otc, uid биржи, крипто адреса',
      en: 'Hopscup guides, IP change, Gmail forwarding, account farm, KYC OTC, exchange UID, crypto addresses',
      es: 'guías Hopscup, cambio IP, Gmail forwarding, granja de cuentas, KYC OTC',
      zh: 'Hopscup 指南, 换 IP, Gmail 转发, 账号农场, KYC OTC',
      ko: 'Hopscup 가이드, IP 변경, Gmail 포워딩, 계정 팜, KYC OTC',
    },
    points: {
      ru: ['Начать можно с гайда по смене IP и форвардингу Gmail.', 'Для фермы аккаунтов полезен большой материал по почтам, прокси и антидетектам.', 'Крипто-гайды помогают с UID, адресами и верификациями.'],
      en: ['Start with the IP change and Gmail forwarding guides.', 'The account farm guide covers emails, proxies, and antidetect browsers.', 'Crypto guides help with UIDs, addresses, and verifications.'],
      es: ['Empieza con cambio de IP y reenvío Gmail.', 'La guía de granja cubre correos, proxies y antidetects.', 'Las guías cripto ayudan con UID, direcciones y verificaciones.'],
      zh: ['可以从换 IP 和 Gmail 转发指南开始。', '账号农场指南涵盖邮箱、代理和反检测。', '加密货币指南帮助处理 UID、地址和验证。'],
      ko: ['IP 변경과 Gmail 포워딩 가이드부터 시작할 수 있습니다.', '계정 팜 가이드는 이메일, 프록시, 안티디텍트를 다룹니다.', '암호화폐 가이드는 UID, 주소, 인증에 도움이 됩니다.'],
    },
    items: ['Смена IP мобильным интернетом', 'Gmail forwarding', 'Ферма аккаунтов', 'OTC и KYC сервисы', 'UID и адреса для бирж'],
  },
];

const servicePages = [
  {
    id: 'proxywing',
    type: 'service',
    route: '/proxy-vpn/proxywing',
    priority: '0.85',
    changefreq: 'monthly',
    name: 'ProxyWing',
    logo: '/proxywing.png',
    title: {
      ru: 'ProxyWing: обзор прокси, типы, гео и оплата | Hopscup Tools',
      en: 'ProxyWing review: proxy types, locations, and payments | Hopscup Tools',
      es: 'ProxyWing: análisis, tipos de proxy, GEO y pagos | Hopscup Tools',
      zh: 'ProxyWing 评测：代理类型、地区与支付方式 | Hopscup Tools',
      ko: 'ProxyWing 리뷰: 프록시 유형, 지역 및 결제 | Hopscup Tools',
    },
    description: {
      ru: 'Обзор ProxyWing: Residential, Datacenter, ISP и Mobile-прокси, 200+ локаций, HTTP/SOCKS5 и оплата картой, СБП/Мир или криптовалютой.',
      en: 'ProxyWing review covering Residential, Datacenter, ISP, and Mobile proxies, 200+ locations, HTTP/SOCKS5, and card, SBP/Mir, or crypto payments.',
      es: 'Análisis de ProxyWing: proxies Residential, Datacenter, ISP y Mobile, más de 200 ubicaciones, HTTP/SOCKS5 y pagos con tarjeta, SBP/Mir o cripto.',
      zh: 'ProxyWing 评测：Residential、Datacenter、ISP 和 Mobile 代理，覆盖 200 多个地区，支持 HTTP/SOCKS5，以及银行卡、SBP/Mir 或加密货币付款。',
      ko: 'ProxyWing 리뷰: Residential, Datacenter, ISP, Mobile 프록시, 200개 이상의 지역, HTTP/SOCKS5, 카드, SBP/Mir 및 암호화폐 결제.',
    },
    heading: {
      ru: 'ProxyWing: Residential, ISP, Mobile и Datacenter-прокси',
      en: 'ProxyWing: Residential, ISP, Mobile, and Datacenter proxies',
      es: 'ProxyWing: proxies Residential, ISP, Mobile y Datacenter',
      zh: 'ProxyWing：Residential、ISP、Mobile 与 Datacenter 代理',
      ko: 'ProxyWing: Residential, ISP, Mobile 및 Datacenter 프록시',
    },
    intro: {
      ru: 'ProxyWing удобен тем, что в одном кабинете можно взять обычные IPv4, ISP, Residential и Mobile-прокси. IPv4 подходят для большинства повседневных задач с аккаунтами, антидетектами, автоматизацией и парсингом. Если площадка строже проверяет источник IP, можно перейти на ISP, Residential или Mobile, не меняя сервис.',
      en: 'ProxyWing is convenient because regular IPv4, ISP, Residential, and Mobile proxies are available in one dashboard. IPv4 covers most everyday account, antidetect, automation, and scraping tasks. If a platform checks the IP source more strictly, you can switch types without changing providers.',
      es: 'ProxyWing reúne IPv4 normal, ISP, Residential y Mobile en un solo panel. IPv4 cubre la mayoría de tareas cotidianas con cuentas, antidetects, automatización y scraping. Para plataformas más estrictas puedes cambiar de tipo sin cambiar de proveedor.',
      zh: 'ProxyWing 在同一控制面板提供普通 IPv4、ISP、Residential 和 Mobile。IPv4 可满足大多数账号、反检测浏览器、自动化和采集任务；遇到检查更严格的平台时，无需更换服务商即可切换类型。',
      ko: 'ProxyWing은 일반 IPv4, ISP, Residential, Mobile을 하나의 대시보드에서 제공합니다. IPv4는 대부분의 계정, 안티디텍트, 자동화, 스크래핑 작업에 충분하며 더 엄격한 플랫폼에서는 공급업체를 바꾸지 않고 유형을 전환할 수 있습니다.',
    },
    keywords: {
      ru: 'ProxyWing обзор, ProxyWing прокси, residential прокси, mobile прокси, ISP прокси, datacenter прокси, купить прокси',
      en: 'ProxyWing review, ProxyWing proxies, residential proxy, mobile proxy, ISP proxy, datacenter proxy',
      es: 'ProxyWing análisis, proxies ProxyWing, proxy residential, proxy móvil, proxy ISP, proxy datacenter',
      zh: 'ProxyWing 评测, ProxyWing 代理, 住宅代理, 移动代理, ISP 代理, 数据中心代理',
      ko: 'ProxyWing 리뷰, ProxyWing 프록시, residential 프록시, mobile 프록시, ISP 프록시, datacenter 프록시',
    },
    pointsHeading: {
      ru: 'Кому подходит',
      en: 'Best for',
      es: 'Para quién sirve',
      zh: '适合谁',
      ko: '추천 대상',
    },
    itemsHeading: {
      ru: 'Что учитывать',
      en: 'What to consider',
      es: 'Qué tener en cuenta',
      zh: '需要注意',
      ko: '확인할 점',
    },
    points: {
      ru: [
        'Обычные IPv4 для аккаунтов, антидетектов, Gmail, Twitter, Discord, Telegram, web3, Яндекса и нейросетей.',
        'Парсинг, автоматизация и другие задачи, где важны скорость, стабильность и отдельный IP.',
        'ISP, Residential и Mobile для площадок, которые строже проверяют источник и траст IP.',
      ],
      en: [
        'Regular IPv4 for accounts, antidetect browsers, Gmail, Twitter, Discord, Telegram, web3, Yandex, and AI tools.',
        'Scraping, automation, and other tasks where speed, stability, and a separate IP matter.',
        'ISP, Residential, and Mobile for platforms that check the IP source and trust more strictly.',
      ],
      es: [
        'IPv4 normal para cuentas, antidetects, Gmail, Twitter, Discord, Telegram, web3, Yandex y herramientas de IA.',
        'Scraping, automatización y otras tareas donde importan la velocidad, la estabilidad y una IP separada.',
        'ISP, Residential y Mobile para plataformas que revisan con más rigor el origen y la confianza de la IP.',
      ],
      zh: [
        '普通 IPv4 适合账号、反检测浏览器、Gmail、Twitter、Discord、Telegram、web3、Yandex 和 AI 工具。',
        '适合重视速度、稳定性和独立 IP 的采集、自动化及其他任务。',
        '对 IP 来源和信任度检查更严格的平台可选择 ISP、Residential 或 Mobile。',
      ],
      ko: [
        '계정, 안티디텍트 브라우저, Gmail, Twitter, Discord, Telegram, web3, Yandex, AI 도구용 일반 IPv4.',
        '속도, 안정성, 개별 IP가 중요한 스크래핑, 자동화 및 기타 작업.',
        'IP 출처와 신뢰도를 더 엄격하게 확인하는 플랫폼용 ISP, Residential, Mobile.',
      ],
    },
    items: {
      ru: [
        'Если не знаете, какой протокол выбрать для антидетекта или рабочего профиля, начинайте с SOCKS5.',
        'Residential обычно оплачиваются за использованный трафик, а Mobile обходятся дороже обычных IPv4.',
        'Datacenter IPv4 могут определяться как proxy/VPN из-за серверного происхождения; для базовых задач это обычно не критично.',
      ],
      en: [
        'If you are unsure which protocol to use for an antidetect browser or work profile, start with SOCKS5.',
        'Residential is usually billed by used traffic, while Mobile costs more than regular IPv4.',
        'Datacenter IPv4 may be labeled as proxy/VPN because of its server origin; this is usually not critical for basic tasks.',
      ],
      es: [
        'Si no sabes qué protocolo usar con un antidetect o perfil de trabajo, empieza con SOCKS5.',
        'Residential normalmente se cobra por tráfico utilizado, mientras Mobile cuesta más que un IPv4 normal.',
        'Datacenter IPv4 puede marcarse como proxy/VPN por su origen de servidor; normalmente no es crítico para tareas básicas.',
      ],
      zh: [
        '如果不确定反检测浏览器或工作资料该用哪种协议，可先选择 SOCKS5。',
        'Residential 通常按使用流量计费，Mobile 的价格则高于普通 IPv4。',
        'Datacenter IPv4 可能因服务器来源而被标记为 proxy/VPN；对基础任务通常并不重要。',
      ],
      ko: [
        '안티디텍트 브라우저나 작업 프로필에서 어떤 프로토콜을 써야 할지 모르겠다면 SOCKS5부터 시작하세요.',
        'Residential은 보통 사용한 트래픽 기준으로 과금되고 Mobile은 일반 IPv4보다 비쌉니다.',
        'Datacenter IPv4는 서버 출처로 인해 proxy/VPN으로 표시될 수 있지만 기본 작업에는 대개 중요하지 않습니다.',
      ],
    },
  },
  {
    id: 'proxyline',
    type: 'service',
    route: '/proxy-vpn/proxyline',
    priority: '0.8',
    changefreq: 'monthly',
    name: 'Proxyline',
    logo: '/proxyline.png',
    title: {
      ru: 'Proxyline: обзор IPv4 и IPv6 прокси | Hopscup Tools',
      en: 'Proxyline review: IPv4 and IPv6 proxies | Hopscup Tools',
      es: 'Proxyline: análisis de proxies IPv4 e IPv6 | Hopscup Tools',
      zh: 'Proxyline 评测：IPv4 与 IPv6 代理 | Hopscup Tools',
      ko: 'Proxyline 리뷰: IPv4 및 IPv6 프록시 | Hopscup Tools',
    },
    description: {
      ru: 'Обзор Proxyline: недорогие IPv4 и IPv6 прокси, более 100 стран, варианты оплаты и задачи, для которых подходят серверные IP.',
      en: 'Proxyline review covering affordable IPv4 and IPv6 proxies, 100+ countries, payment options, and suitable server IP use cases.',
      es: 'Análisis de Proxyline: proxies IPv4 e IPv6 económicos, más de 100 países, métodos de pago y usos adecuados para IP de servidor.',
      zh: 'Proxyline 评测：价格实惠的 IPv4 与 IPv6 代理、覆盖 100 多个国家、付款方式以及服务器 IP 的适用场景。',
      ko: 'Proxyline 리뷰: 합리적인 IPv4 및 IPv6 프록시, 100개 이상의 국가, 결제 수단과 서버 IP 활용 사례.',
    },
    heading: {
      ru: 'Proxyline: недорогие IPv4 и IPv6 прокси',
      en: 'Proxyline: affordable IPv4 and IPv6 proxies',
      es: 'Proxyline: proxies IPv4 e IPv6 económicos',
      zh: 'Proxyline：价格实惠的 IPv4 与 IPv6 代理',
      ko: 'Proxyline: 합리적인 IPv4 및 IPv6 프록시',
    },
    intro: {
      ru: 'Proxyline предлагает обычные серверные IPv4 и IPv6. Это понятный вариант для парсинга, автоматизации, антидетектов и аккаунтных задач, где не требуется мобильный или резидентский источник IP.',
      en: 'Proxyline offers regular server IPv4 and IPv6 proxies. It is a straightforward option for scraping, automation, antidetect browsers, and account tasks that do not require a mobile or residential IP source.',
      es: 'Proxyline ofrece proxies IPv4 e IPv6 de servidor. Es una opción sencilla para scraping, automatización, antidetects y cuentas que no necesitan una IP móvil o residencial.',
      zh: 'Proxyline 提供普通服务器 IPv4 和 IPv6。适合不需要移动或住宅 IP 来源的采集、自动化、反检测浏览器和账号任务。',
      ko: 'Proxyline은 일반 서버 IPv4 및 IPv6 프록시를 제공합니다. 모바일 또는 주거용 IP가 필요 없는 스크래핑, 자동화, 안티디텍트와 계정 작업에 적합합니다.',
    },
    keywords: {
      ru: 'Proxyline обзор, Proxyline прокси, IPv4 прокси, IPv6 прокси, серверные прокси, купить прокси',
      en: 'Proxyline review, Proxyline proxies, IPv4 proxy, IPv6 proxy, server proxies',
      es: 'Proxyline análisis, proxies Proxyline, proxy IPv4, proxy IPv6, proxies de servidor',
      zh: 'Proxyline 评测, Proxyline 代理, IPv4 代理, IPv6 代理, 服务器代理',
      ko: 'Proxyline 리뷰, Proxyline 프록시, IPv4 프록시, IPv6 프록시, 서버 프록시',
    },
    pointsHeading: {
      ru: 'Кому подходит',
      en: 'Best for',
      es: 'Para quién sirve',
      zh: '适合谁',
      ko: '추천 대상',
    },
    itemsHeading: {
      ru: 'Что учитывать',
      en: 'What to consider',
      es: 'Qué tener en cuenta',
      zh: '需要注意',
      ko: '확인할 점',
    },
    points: {
      ru: [
        'Парсинг, автоматизация и другие задачи, где важны стабильный IP и понятная стоимость.',
        'Работа с аккаунтами и антидетектами, когда площадке подходит обычный серверный IPv4.',
        'Покупка нескольких отдельных IP нужной страны без оплаты за трафик.',
      ],
      en: [
        'Scraping, automation, and other tasks where a stable IP and predictable price matter.',
        'Accounts and antidetect browsers when a regular server IPv4 is suitable for the target platform.',
        'Buying several separate IPs in the required country without traffic-based billing.',
      ],
      es: [
        'Scraping, automatización y tareas donde importan una IP estable y un precio predecible.',
        'Cuentas y navegadores antidetect cuando la plataforma admite un IPv4 de servidor normal.',
        'Comprar varias IP separadas del país necesario sin pagar por tráfico.',
      ],
      zh: [
        '适合需要稳定 IP 和明确价格的采集、自动化及其他任务。',
        '目标平台可以使用普通服务器 IPv4 时，适合账号和反检测浏览器。',
        '无需按流量计费即可购买所需国家的多个独立 IP。',
      ],
      ko: [
        '안정적인 IP와 예측 가능한 비용이 중요한 스크래핑, 자동화 및 기타 작업.',
        '대상 플랫폼에서 일반 서버 IPv4를 사용할 수 있는 계정 및 안티디텍트 브라우저 작업.',
        '트래픽 과금 없이 필요한 국가의 개별 IP 여러 개를 구매하는 경우.',
      ],
    },
    items: {
      ru: [
        'Это серверные IPv4 и IPv6, поэтому некоторые проверки могут отмечать их как proxy или VPN.',
        'IPv6 стоит брать только для сервисов и программ, которые его поддерживают.',
        'Для площадок со строгой проверкой источника IP может понадобиться ISP, Residential или Mobile у другого сервиса.',
      ],
      en: [
        'These are server IPv4 and IPv6 addresses, so some checks may label them as proxy or VPN.',
        'Choose IPv6 only for services and software that support it.',
        'Platforms with stricter IP source checks may require ISP, Residential, or Mobile proxies from another provider.',
      ],
      es: [
        'Son direcciones IPv4 e IPv6 de servidor, por lo que algunas verificaciones pueden marcarlas como proxy o VPN.',
        'Elige IPv6 solo para servicios y programas compatibles.',
        'Las plataformas con controles más estrictos pueden requerir ISP, Residential o Mobile de otro proveedor.',
      ],
      zh: [
        '这些是服务器 IPv4 和 IPv6，因此部分检测可能会将其标记为代理或 VPN。',
        '只有目标服务和软件支持时才选择 IPv6。',
        '对 IP 来源检查更严格的平台可能需要其他服务商的 ISP、Residential 或 Mobile 代理。',
      ],
      ko: [
        '서버 IPv4 및 IPv6이므로 일부 검사에서 프록시 또는 VPN으로 표시될 수 있습니다.',
        'IPv6는 해당 서비스와 프로그램이 지원할 때만 선택하세요.',
        'IP 출처를 엄격하게 확인하는 플랫폼은 다른 공급업체의 ISP, Residential 또는 Mobile이 필요할 수 있습니다.',
      ],
    },
  },
  {
    id: 'proxy6',
    type: 'service',
    route: '/proxy-vpn/proxy6',
    priority: '0.8',
    changefreq: 'monthly',
    name: 'Proxy6',
    logo: '/proxy6.png',
    title: {
      ru: 'Proxy6: обзор IPv4, IPv6 и MTProto прокси | Hopscup Tools',
      en: 'Proxy6 review: IPv4, IPv6, and MTProto proxies | Hopscup Tools',
      es: 'Proxy6: análisis de proxies IPv4, IPv6 y MTProto | Hopscup Tools',
      zh: 'Proxy6 评测：IPv4、IPv6 与 MTProto 代理 | Hopscup Tools',
      ko: 'Proxy6 리뷰: IPv4, IPv6 및 MTProto 프록시 | Hopscup Tools',
    },
    description: {
      ru: 'Обзор Proxy6: IPv4, IPv6, Shared IPv4 и MTProto прокси, более 70 стран, способы оплаты и подходящие сценарии использования.',
      en: 'Proxy6 review covering IPv4, IPv6, Shared IPv4, and MTProto proxies, 70+ countries, payment methods, and suitable use cases.',
      es: 'Análisis de Proxy6: proxies IPv4, IPv6, Shared IPv4 y MTProto, más de 70 países, pagos y usos recomendados.',
      zh: 'Proxy6 评测：IPv4、IPv6、Shared IPv4 和 MTProto 代理，覆盖 70 多个国家、付款方式及适用场景。',
      ko: 'Proxy6 리뷰: IPv4, IPv6, Shared IPv4, MTProto 프록시, 70개 이상의 국가, 결제 수단과 활용 사례.',
    },
    heading: {
      ru: 'Proxy6: IPv4, IPv6, Shared IPv4 и MTProto',
      en: 'Proxy6: IPv4, IPv6, Shared IPv4, and MTProto',
      es: 'Proxy6: IPv4, IPv6, Shared IPv4 y MTProto',
      zh: 'Proxy6：IPv4、IPv6、Shared IPv4 与 MTProto',
      ko: 'Proxy6: IPv4, IPv6, Shared IPv4 및 MTProto',
    },
    intro: {
      ru: 'Proxy6 подойдет тем, кому нужны доступные серверные прокси и разные форматы покупки. В сервисе есть отдельные IPv4, IPv6, Shared IPv4 и MTProto для Telegram.',
      en: 'Proxy6 suits users who need affordable server proxies and several purchase formats. The service offers dedicated IPv4, IPv6, Shared IPv4, and MTProto for Telegram.',
      es: 'Proxy6 sirve para quienes necesitan proxies de servidor económicos y varios formatos de compra. Ofrece IPv4 individual, IPv6, Shared IPv4 y MTProto para Telegram.',
      zh: 'Proxy6 适合需要价格实惠的服务器代理和多种购买方式的用户。服务提供独立 IPv4、IPv6、Shared IPv4 以及 Telegram 使用的 MTProto。',
      ko: 'Proxy6는 저렴한 서버 프록시와 다양한 구매 방식을 원하는 사용자에게 적합합니다. 개별 IPv4, IPv6, Shared IPv4와 Telegram용 MTProto를 제공합니다.',
    },
    keywords: {
      ru: 'Proxy6 обзор, Proxy6 прокси, IPv4 прокси, IPv6 прокси, Shared IPv4, MTProto прокси',
      en: 'Proxy6 review, Proxy6 proxies, IPv4 proxy, IPv6 proxy, Shared IPv4, MTProto proxy',
      es: 'Proxy6 análisis, proxies Proxy6, proxy IPv4, proxy IPv6, Shared IPv4, proxy MTProto',
      zh: 'Proxy6 评测, Proxy6 代理, IPv4 代理, IPv6 代理, Shared IPv4, MTProto 代理',
      ko: 'Proxy6 리뷰, Proxy6 프록시, IPv4 프록시, IPv6 프록시, Shared IPv4, MTProto 프록시',
    },
    pointsHeading: {
      ru: 'Кому подходит',
      en: 'Best for',
      es: 'Para quién sirve',
      zh: '适合谁',
      ko: '추천 대상',
    },
    itemsHeading: {
      ru: 'Что учитывать',
      en: 'What to consider',
      es: 'Qué tener en cuenta',
      zh: '需要注意',
      ko: '확인할 점',
    },
    points: {
      ru: [
        'Повседневные задачи с аккаунтами, антидетектами, автоматизацией и отдельными IP.',
        'Работа с большим количеством прокси, когда важна доступная цена.',
        'MTProto для Telegram и Shared IPv4 для задач, где выделенный адрес не обязателен.',
      ],
      en: [
        'Daily account, antidetect, automation, and separate IP tasks.',
        'Working with many proxies when an affordable price matters.',
        'MTProto for Telegram and Shared IPv4 when a dedicated address is not required.',
      ],
      es: [
        'Tareas cotidianas con cuentas, antidetects, automatización e IP separadas.',
        'Trabajo con muchos proxies cuando importa un precio accesible.',
        'MTProto para Telegram y Shared IPv4 cuando no necesitas una dirección dedicada.',
      ],
      zh: [
        '适合账号、反检测浏览器、自动化和独立 IP 等日常任务。',
        '需要大量代理并重视价格时使用。',
        'MTProto 适合 Telegram，Shared IPv4 适合不要求独享地址的任务。',
      ],
      ko: [
        '계정, 안티디텍트, 자동화와 개별 IP가 필요한 일상 작업.',
        '합리적인 가격으로 많은 프록시를 사용해야 하는 경우.',
        'Telegram용 MTProto와 전용 주소가 필요 없는 작업용 Shared IPv4.',
      ],
    },
    items: {
      ru: [
        'Shared IPv4 используется несколькими клиентами и подходит не для каждой площадки.',
        'IPv6 нужно выбирать только при подтвержденной поддержке со стороны нужного сервиса.',
        'Обычные IPv4 могут определяться как proxy или VPN из-за серверного происхождения, для базовых задач это обычно не критично.',
      ],
      en: [
        'Shared IPv4 is used by multiple customers and is not suitable for every platform.',
        'Choose IPv6 only when the target service is confirmed to support it.',
        'Regular IPv4 may be labeled as proxy or VPN because of its server origin, which is usually not critical for basic tasks.',
      ],
      es: [
        'Shared IPv4 se comparte entre varios clientes y no sirve para todas las plataformas.',
        'Elige IPv6 solo cuando el servicio de destino confirme que es compatible.',
        'Un IPv4 normal puede marcarse como proxy o VPN por su origen de servidor, algo que normalmente no es crítico para tareas básicas.',
      ],
      zh: [
        'Shared IPv4 由多个客户共同使用，并不适合所有平台。',
        '只有确认目标服务支持时才选择 IPv6。',
        '普通 IPv4 可能因服务器来源被标记为代理或 VPN，对基础任务通常并不重要。',
      ],
      ko: [
        'Shared IPv4는 여러 고객이 함께 사용하므로 모든 플랫폼에 적합하지는 않습니다.',
        '대상 서비스의 지원이 확인된 경우에만 IPv6를 선택하세요.',
        '일반 IPv4는 서버 출처로 인해 프록시 또는 VPN으로 표시될 수 있지만 기본 작업에는 대개 중요하지 않습니다.',
      ],
    },
  },
  {
    id: 'mobileproxy',
    type: 'service',
    route: '/proxy-vpn/mobileproxy',
    priority: '0.8',
    changefreq: 'monthly',
    name: 'MobileProxy',
    logo: '/mobileproxy.png',
    title: {
      ru: 'MobileProxy: обзор мобильных прокси со сменой IP | Hopscup Tools',
      en: 'MobileProxy review: mobile proxies with IP rotation | Hopscup Tools',
      es: 'MobileProxy: análisis de proxies móviles con cambio de IP | Hopscup Tools',
      zh: 'MobileProxy 评测：支持更换 IP 的移动代理 | Hopscup Tools',
      ko: 'MobileProxy 리뷰: IP 변경이 가능한 모바일 프록시 | Hopscup Tools',
    },
    description: {
      ru: 'Обзор MobileProxy: мобильные прокси со сменой IP, более 20 стран, способы оплаты и задачи, где нужен мобильный источник адреса.',
      en: 'MobileProxy review covering rotating mobile proxies, 20+ countries, payment methods, and tasks that need a mobile IP source.',
      es: 'Análisis de MobileProxy: proxies móviles con cambio de IP, más de 20 países, métodos de pago y usos que necesitan una IP móvil.',
      zh: 'MobileProxy 评测：支持更换 IP 的移动代理、覆盖 20 多个国家、付款方式以及需要移动网络 IP 的场景。',
      ko: 'MobileProxy 리뷰: IP 변경이 가능한 모바일 프록시, 20개 이상의 국가, 결제 수단과 모바일 IP가 필요한 활용 사례.',
    },
    heading: {
      ru: 'MobileProxy: мобильные прокси со сменой IP',
      en: 'MobileProxy: mobile proxies with IP rotation',
      es: 'MobileProxy: proxies móviles con cambio de IP',
      zh: 'MobileProxy：支持更换 IP 的移动代理',
      ko: 'MobileProxy: IP 변경이 가능한 모바일 프록시',
    },
    intro: {
      ru: 'MobileProxy предлагает мобильные адреса с возможностью смены IP. Такой тип нужен, когда площадка строже относится к серверным прокси или рабочей схеме важен мобильный оператор.',
      en: 'MobileProxy provides mobile addresses with IP rotation. This type is useful when a platform treats server proxies more strictly or the workflow requires a mobile carrier.',
      es: 'MobileProxy ofrece direcciones móviles con cambio de IP. Este tipo resulta útil cuando una plataforma controla con más rigor los proxies de servidor o el flujo necesita un operador móvil.',
      zh: 'MobileProxy 提供支持更换 IP 的移动地址。目标平台严格限制服务器代理，或工作流程需要移动运营商时，这类代理更合适。',
      ko: 'MobileProxy는 IP 변경이 가능한 모바일 주소를 제공합니다. 플랫폼이 서버 프록시를 엄격하게 확인하거나 작업에 모바일 통신사가 필요할 때 유용합니다.',
    },
    keywords: {
      ru: 'MobileProxy обзор, мобильные прокси, прокси со сменой IP, mobile proxy, прокси для аккаунтов',
      en: 'MobileProxy review, mobile proxies, rotating mobile proxy, mobile IP, proxies for accounts',
      es: 'MobileProxy análisis, proxies móviles, proxy con cambio IP, IP móvil, proxies para cuentas',
      zh: 'MobileProxy 评测, 移动代理, 更换 IP, 移动 IP, 账号代理',
      ko: 'MobileProxy 리뷰, 모바일 프록시, IP 변경 프록시, 모바일 IP, 계정 프록시',
    },
    pointsHeading: {
      ru: 'Кому подходит',
      en: 'Best for',
      es: 'Para quién sirve',
      zh: '适合谁',
      ko: '추천 대상',
    },
    itemsHeading: {
      ru: 'Что учитывать',
      en: 'What to consider',
      es: 'Qué tener en cuenta',
      zh: '需要注意',
      ko: '확인할 점',
    },
    points: {
      ru: [
        'Площадки, которые строже относятся к серверным IP и лучше принимают мобильные адреса.',
        'Социальные сети, приложения и аккаунтные задачи, где полезна смена IP по кнопке.',
        'Рабочие схемы, которым нужен мобильный оператор и конкретная страна.',
      ],
      en: [
        'Platforms that treat server IPs more strictly and accept mobile addresses more readily.',
        'Social networks, apps, and account tasks where one-click IP rotation is useful.',
        'Workflows that require a mobile carrier and a specific country.',
      ],
      es: [
        'Plataformas más estrictas con IP de servidor que aceptan mejor direcciones móviles.',
        'Redes sociales, aplicaciones y tareas con cuentas donde conviene cambiar la IP con un botón.',
        'Flujos de trabajo que necesitan un operador móvil y un país concreto.',
      ],
      zh: [
        '适合严格限制服务器 IP、对移动地址接受度更高的平台。',
        '适合需要一键更换 IP 的社交网络、应用和账号任务。',
        '适合需要特定国家和移动运营商的工作流程。',
      ],
      ko: [
        '서버 IP를 엄격하게 확인하고 모바일 주소를 더 잘 받아들이는 플랫폼.',
        '버튼 한 번으로 IP를 변경하면 유용한 소셜 네트워크, 앱과 계정 작업.',
        '특정 국가와 모바일 통신사가 필요한 작업 방식.',
      ],
    },
    items: {
      ru: [
        'Мобильные прокси обычно стоят дороже обычных IPv4, поэтому брать их для каждой задачи необязательно.',
        'Заранее проверьте доступные страны, оператора и способ смены IP.',
        'Если площадке подходит обычный IPv4, он может оказаться проще и выгоднее.',
      ],
      en: [
        'Mobile proxies usually cost more than regular IPv4, so they are not necessary for every task.',
        'Check the available countries, carrier, and IP rotation method before buying.',
        'If a regular IPv4 works for the platform, it may be simpler and more affordable.',
      ],
      es: [
        'Los proxies móviles suelen costar más que un IPv4 normal, por lo que no son necesarios para todas las tareas.',
        'Comprueba los países, el operador y el método de cambio de IP antes de comprar.',
        'Si la plataforma acepta un IPv4 normal, puede ser una opción más sencilla y económica.',
      ],
      zh: [
        '移动代理通常比普通 IPv4 更贵，因此并非所有任务都需要使用。',
        '购买前请确认可用国家、运营商和更换 IP 的方式。',
        '如果平台可以使用普通 IPv4，它可能更简单也更划算。',
      ],
      ko: [
        '모바일 프록시는 일반 IPv4보다 비싼 편이므로 모든 작업에 필요한 것은 아닙니다.',
        '구매 전에 지원 국가, 통신사와 IP 변경 방식을 확인하세요.',
        '플랫폼에서 일반 IPv4가 통한다면 더 간단하고 저렴할 수 있습니다.',
      ],
    },
  },
];

const sectionPages = sections.filter((section) => section.route !== '/');
const indexablePages = [...sectionPages, ...servicePages];
const fallbackLabels = {
  ru: { includes: 'Что есть в разделе', services: 'Сервисы', nav: 'Разделы сайта' },
  en: { includes: 'What this page includes', services: 'Services', nav: 'Site sections' },
  es: { includes: 'Qué hay en esta sección', services: 'Servicios', nav: 'Secciones del sitio' },
  zh: { includes: '本页包含什么', services: '服务', nav: '网站栏目' },
  ko: { includes: '이 섹션에 포함된 내용', services: '서비스', nav: '사이트 섹션' },
};

const getLanguage = (value, language) => value[language.code] || value.en || value.ru;
const localizedPath = (section, language) =>
  section.route === '/' ? language.prefix || '/' : `${language.prefix}${section.route}`;
const absoluteUrl = (section, language) => `${siteUrl}${localizedPath(section, language) === '/' ? '' : localizedPath(section, language)}`;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const escapeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const alternateLinks = (section) =>
  [
    ...languages.map((language) => `<link rel="alternate" hreflang="${language.hrefLang}" href="${absoluteUrl(section, language)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${absoluteUrl(section, languages[0])}" />`,
  ].join('\n    ');

const internalLinks = (language) =>
  sectionPages
    .map((section) => `<a href="${localizedPath(section, language)}">${escapeHtml(getLanguage(section.heading, language))}</a>`)
    .join('\n        ');

const renderStaticContent = (section, language) => {
  const title = getLanguage(section.heading, language);
  const intro = getLanguage(section.intro, language);
  const points = getLanguage(section.points, language);
  const items = Array.isArray(section.items) ? section.items : getLanguage(section.items, language);
  const labels = fallbackLabels[language.code] || fallbackLabels.en;
  const pointsHeading = section.pointsHeading ? getLanguage(section.pointsHeading, language) : labels.includes;
  const itemsHeading = section.itemsHeading ? getLanguage(section.itemsHeading, language) : labels.services;
  const renderItem = (item) => {
    const serviceRoute = section.serviceLinks?.[item];
    if (!serviceRoute) return escapeHtml(item);
    return `<a href="${language.prefix}${serviceRoute}">${escapeHtml(item)}</a>`;
  };

  return `
      <article class="seo-fallback" aria-label="${escapeHtml(title)}">
        <header>
          <p>Hopscup's Tools Hub</p>
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(intro)}</p>
        </header>
        <section>
          <h2>${escapeHtml(pointsHeading)}</h2>
          <ul>
            ${points.map((point) => `<li>${escapeHtml(point)}</li>`).join('\n            ')}
          </ul>
        </section>
        <section>
          <h2>${escapeHtml(itemsHeading)}</h2>
          <ul>
            ${items.map((item) => `<li>${renderItem(item)}</li>`).join('\n            ')}
          </ul>
        </section>
        <nav aria-label="${escapeHtml(labels.nav)}">
          ${internalLinks(language)}
        </nav>
      </article>`;
};

const collectionSchema = (section, language) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: getLanguage(section.title, language),
  description: getLanguage(section.description, language),
  url: absoluteUrl(section, language),
  inLanguage: language.htmlLang,
  isPartOf: {
    '@type': 'WebSite',
    name: "Hopscup's Tools Hub",
    url: siteUrl,
  },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: section.items.map((name, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
    })),
  },
});

const serviceSchema = (section, language) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: getLanguage(section.title, language),
  description: getLanguage(section.description, language),
  url: absoluteUrl(section, language),
  inLanguage: language.htmlLang,
  isPartOf: {
    '@type': 'WebSite',
    name: "Hopscup's Tools Hub",
    url: siteUrl,
  },
  mainEntity: {
    '@type': 'Service',
    name: section.name,
    description: getLanguage(section.description, language),
    url: absoluteUrl(section, language),
    image: `${siteUrl}${section.logo}`,
  },
});

const websiteSchema = (language) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: "Hopscup's Tools Hub",
  url: siteUrl,
  inLanguage: language.htmlLang,
});

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Hopscup',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: [
    'https://www.youtube.com/@hopscup',
    'https://www.youtube.com/@Hopscup_eng',
    'https://t.me/hopscupcrpt',
  ],
};

const stripSeoFallback = (html) =>
  html.replace(/\s*<article class="seo-fallback"[\s\S]*?<\/article>\s*/g, '');

const replaceHead = (html, section, language) => {
  const title = escapeHtml(getLanguage(section.title, language));
  const description = escapeHtml(getLanguage(section.description, language));
  const keywords = escapeHtml(getLanguage(section.keywords, language));
  const url = absoluteUrl(section, language);
  const pageSchema = section.type === 'service'
    ? serviceSchema(section, language)
    : collectionSchema(section, language);
  const structuredData = [websiteSchema(language), organizationSchema, pageSchema];

  return html
    .replace(/<html lang=".*?">/, `<html lang="${language.htmlLang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${keywords}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/\n\s*<link rel="alternate" hreflang=".*?" href=".*?" \/>/g, '')
    .replace(/<link rel="canonical" href=".*?" \/>/, (canonical) => `${canonical}\n    ${alternateLinks(section)}`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:locale" content=".*?" \/>/, `<meta property="og:locale" content="${language.ogLocale}" />`)
    .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${description}" />`)
    .replace(/<script id="structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/, `<script id="structured-data" type="application/ld+json">${escapeJson(structuredData)}</script>`);
};

const replaceRootContent = (html, section, language) =>
  html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${renderStaticContent(section, language)}\n    </div>`);

const renderPage = (baseHtml, section, language) => replaceRootContent(replaceHead(stripSeoFallback(baseHtml), section, language), section, language);

const renderSitemap = () => {
  const sitemapAlternates = (section) =>
    [
      ...languages.map(
        (language) =>
          `    <xhtml:link rel="alternate" hreflang="${language.hrefLang}" href="${escapeHtml(absoluteUrl(section, language))}" />`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeHtml(absoluteUrl(section, languages[0]))}" />`,
    ].join('\n');

  const urls = languages.flatMap((language) =>
    indexablePages.map((section) => `  <url>
    <loc>${escapeHtml(absoluteUrl(section, language))}</loc>
${sitemapAlternates(section)}
    <changefreq>${section.changefreq}</changefreq>
    <priority>${section.priority}</priority>
  </url>`),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
};

const indexHtml = await readFile(path.join(distDir, 'index.html'), 'utf8');
const defaultSection = sections.find((section) => section.id === 'proxy');
const defaultLanguage = languages.find((language) => language.code === 'ru');

await Promise.all(
  languages.flatMap((language) =>
    indexablePages.map(async (section) => {
      const pagePath = localizedPath(section, language);
      const routeDir = path.join(distDir, pagePath);
      await mkdir(routeDir, { recursive: true });
      await writeFile(path.join(routeDir, 'index.html'), renderPage(indexHtml, section, language), 'utf8');
    }),
  ),
);

if (defaultSection && defaultLanguage) {
  await writeFile(path.join(distDir, 'index.html'), renderPage(indexHtml, defaultSection, defaultLanguage), 'utf8');
}

await writeFile(
  path.join(distDir, '404.html'),
  `<!doctype html>
<html lang="ru-RU">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, follow" />
    <meta name="theme-color" content="#08050d" />
    <title>Страница не найдена | Hopscup Tools</title>
    <style>
      :root { color-scheme: dark; font-family: Inter, Arial, sans-serif; }
      body { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #08050d; color: #fff; }
      main { width: min(560px, calc(100% - 48px)); text-align: center; }
      img { width: 72px; height: 72px; border-radius: 16px; }
      h1 { margin: 24px 0 12px; font-size: clamp(32px, 8vw, 56px); }
      p { color: #a9a3b2; line-height: 1.6; }
      a { display: inline-block; margin-top: 20px; padding: 14px 22px; border-radius: 12px; background: #9d58ff; color: #fff; text-decoration: none; font-weight: 700; }
    </style>
  </head>
  <body>
    <main>
      <img src="/logo.png" alt="Hopscup's Tools Hub" />
      <h1>Страница не найдена</h1>
      <p>Такого адреса нет. Вернитесь к подборке сервисов Hopscup.</p>
      <a href="/proxy-vpn">Перейти на главную</a>
    </main>
  </body>
</html>
`,
  'utf8',
);

await writeFile(path.join(distDir, 'sitemap.xml'), renderSitemap(), 'utf8');
await writeFile(path.join(distDir, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`, 'utf8');
