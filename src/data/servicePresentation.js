export const serviceCategoryRoutes = {
  Proxy: '/proxy-vpn', Antidetect: '/antidetect', Stores: '/account-shop', Cards: '/foreign-cards',
  Crypto: '/crypto-exchange', SMS: '/sms-activators', VPS: '/vps', Social: '/social-boost', Steam: '/steam-topup', Guides: '/guides',
};
export const serviceCategoryNames = {
  Proxy: ['Прокси и VPN', 'Proxy / VPN'], Antidetect: ['Антидетекты', 'Antidetect'], Stores: ['Магазины аккаунтов', 'Account shops'],
  Cards: ['Зарубежные карты', 'Foreign cards'], Crypto: ['Криптообменники', 'Crypto exchange'], SMS: ['SMS-активаторы', 'SMS activators'],
  VPS: ['VDS/VPS', 'VDS/VPS'], Social: ['Накрутка и буксы', 'Social boost'], Steam: ['Пополнение Steam', 'Steam top-up'], Guides: ['Гайды', 'Guides'],
};

const priorities = { Proxy: ['p6', 'p3', 'p4', 'p1'], Cards: ['pgon', 'zarub', 'antarctic-card'], Stores: ['st-dark'] };
export const getServiceAlternatives = (offer, offers) => {
  const candidates = offers.filter(item => item.category === offer.category && item.id !== offer.id && item.slug);
  const preferred = priorities[offer.category] || [];
  return [...preferred.map(id => candidates.find(item => item.id === id)).filter(Boolean), ...candidates.filter(item => !preferred.includes(item.id))].slice(0, 3);
};

export const serviceGuideRoutes = {
  Proxy: '/proxy-vpn/luchshie-proksi', Antidetect: '/guides/kak-nastroit-antidetect-brauzer',
  Cards: '/guides/zarubezhnaya-karta-s-popolneniem-rublyami',
};
export const serviceGuideLabels = {
  Proxy: { ru: 'Как выбрать прокси', en: 'How to choose proxies' },
  Antidetect: { ru: 'Как настроить антидетект', en: 'How to configure an antidetect browser' },
  Cards: { ru: 'Зарубежная карта с пополнением рублями', en: 'Foreign cards with RUB top-ups' },
};

const mobileGuideOfferIds = new Set(['ant-gologin-mobile', 'ant-octo-mobile', 'ant-vmos-cloud', 'ant-duoplus', 'ant-geelark', 'ant-morelogin-mobile']);
export const getServiceGuide = offer => offer.category === 'Antidetect' && mobileGuideOfferIds.has(offer.id) ? {
  href: '/guides/antidetekt-na-telefone',
  label: { ru: 'Антидетект на телефоне: что выбрать', en: 'Antidetect on your phone: what to choose' },
} : {
  href: serviceGuideRoutes[offer.category] || '/guides',
  label: serviceGuideLabels[offer.category] || { ru: 'Полезные гайды', en: 'Useful guides' },
};

export const plainSeoText = value => String(value).replace(/[—–]/g, '-');
const shortServiceTitles = {
  '/proxy-vpn/luchshie-proksi': ['Какие прокси выбрать для аккаунтов в 2026', 'Which proxies to choose for accounts in 2026'],
  '/antidetect/kakoy-vybrat': ['Какой антидетект выбрать: сравнение сервисов', 'Which antidetect browser to choose: comparison'],
  '/proxy-vpn/proxyshard': ['ProxyShard: IPv4, ISP, Residential и Mobile', 'ProxyShard: IPv4, ISP, Residential and Mobile'],
  '/proxy-vpn/proxywing': ['ProxyWing: IPv4, ISP, Residential и Mobile', 'ProxyWing: IPv4, ISP, Residential and Mobile'],
  '/proxy-vpn/proxy-seller': ['Proxy-Seller: IPv4, ISP, Residential и Mobile', 'Proxy-Seller: IPv4, ISP, Residential and Mobile'],
  '/proxy-vpn/mobileproxy': ['MobileProxy: мобильные прокси со сменой IP', 'MobileProxy: mobile proxies with IP rotation'],
  '/proxy-vpn/proxys-io': ['Proxys.io: IPv4, Residential, Mobile и Dynamic', 'Proxys.io: IPv4, Residential, Mobile and Dynamic'],
  '/proxy-vpn/giga-dollar-vpn': ['Giga Dollar VPN: тарифы, HAPP и Ускоритель', 'Giga Dollar VPN: plans, HAPP and Accelerator'],
  '/antidetect/dolphin-anty': ['Dolphin{anty}: обзор антидетекта и тарифов', 'Dolphin{anty}: antidetect review and pricing'],
  '/antidetect/geelark': ['GeeLark: облачные Android для мультиаккаунтинга', 'GeeLark: cloud Android for multiple accounts'],
  '/antidetect/vmos-cloud': ['VMOS Cloud: облачный Android с ПК и телефона', 'VMOS Cloud: cloud Android from computer or phone'],
  '/antidetect/duoplus': ['DuoPlus: облачный Android с телефона и ПК', 'DuoPlus: cloud Android from phone and desktop'],
  '/antidetect/donut-browser': ['Donut Browser: антидетект без лимита профилей', 'Donut Browser: free antidetect, unlimited profiles'],
  '/antidetect/shardx': ['ShardX: бесплатный антидетект без лимита профилей', 'ShardX: free antidetect, unlimited profiles'],
};
export const compactSeoTitle = (title, route, language) => {
  const text = plainSeoText(title);
  if (language && !['ru', 'en'].includes(language)) return text;
  if (!/^\/(proxy-vpn|antidetect)(?:\/|$)/.test(route) || text.length <= 60) return text;
  const shorter = text.replace(/ \| Hopscup Tools$/, ' | Hopscup');
  if (shorter.length <= 60 || !shortServiceTitles[route]) return shorter;
  return shortServiceTitles[route][/[А-Яа-яЁё]/.test(text) ? 0 : 1] + ' | Hopscup';
};
export const sectionSeoTitles = {
  '/proxy-vpn': { ru: 'Прокси для аккаунтов и антидетекта: купить в 2026', en: 'Proxies for accounts and antidetect browsers, 2026' },
  '/antidetect': { ru: 'Антидетект браузеры: бесплатные и платные', en: 'Antidetect browsers: free and paid compared' },
};

export const localizedServiceValue = (value, language) => {
  if (value == null) return '';
  return typeof value === 'object' && !Array.isArray(value) ? value[language] ?? value.en ?? value.ru ?? '' : value;
};

export const isServiceMetaDescription = (text, description) => Boolean(text && description)
  && plainSeoText(text).replace(/\s+/g, ' ').trim() === plainSeoText(description).replace(/\s+/g, ' ').trim();

export const getServiceParagraphs = (offer, language, metaDescription) => {
  const value = data => localizedServiceValue(data, language);
  return [...new Set([value(offer.details?.descriptionDetailed), value(offer.editorial?.description)])]
    .filter(text => text && text !== value(offer.description) && !isServiceMetaDescription(text, metaDescription));
};

export const serviceFactLabels = {
  geo: ['Гео', 'GEO'], types: ['Типы', 'Types'], paymentMethods: ['Способы оплаты', 'Payment methods'],
  price: ['Цена', 'Price'], freeTrial: ['Бесплатный тест', 'Free test'], ipRotation: ['Смена IP', 'IP rotation'],
  rate: ['Курс / комиссия', 'Rate / fee'], fees: ['Комиссии', 'Fees'], kyc: ['KYC', 'KYC'], minTopup: ['Минимальное пополнение', 'Minimum top-up'],
  freeProfiles: ['Бесплатные профили', 'Free profiles'], tariffStartPrice: ['Стартовая цена', 'Starting price'],
  profiles100Price: ['Цена за 100 профилей', 'Price for 100 profiles'], platforms: ['Платформы', 'Platforms'], payments: ['Оплата', 'Payments'],
  main: ['Основная цена', 'Main price'], secondary: ['Дополнительная цена', 'Additional price'],
  control: ['Управление', 'Control'], format: ['Формат', 'Format'], trial: ['Пробный период', 'Trial'],
  issuance: ['Выпуск', 'Issuance'], maintenance: ['Обслуживание', 'Maintenance'], paySystems: ['Apple/Google Pay', 'Apple/Google Pay'],
  verification: ['Верификация', 'Verification'], cashback: ['Кешбэк', 'Cashback'], topup: ['Пополнение', 'Top-up'],
  commission: ['Комиссия', 'Fee'], type: ['Тип карты', 'Card type'],
  countries: ['Страны оплаты', 'Countries'], fee: ['Комиссия QR', 'QR fee'], limit: ['Лимит', 'Limit'],
};

export const getServiceFacts = (offer, language) => {
  const facts = [];
  const add = (key, value, label) => {
    const text = localizedServiceValue(value, language);
    if (text !== '' && text != null && (!Array.isArray(text) || text.length)) facts.push({ key, label: label || serviceFactLabels[key]?.[language === 'ru' ? 0 : 1] || key, value: Array.isArray(text) ? text.join(', ') : text });
  };
  for (const key of ['geo', 'types', 'price', 'freeTrial', 'ipRotation', 'paymentMethods', 'rate', 'fees', 'kyc', 'minTopup']) add(key, offer.details?.[key]);
  for (const key of ['freeProfiles', 'tariffStartPrice', 'profiles100Price', 'platforms', 'payments']) add(key, offer[key], key === 'profiles100Price' ? localizedServiceValue(offer.profilesPriceLabel, language) : undefined);
  for (const key of ['main', 'secondary']) add(key, offer.priceInfo?.[key]);
  for (const key of ['control', 'format', 'trial']) add(key, offer.mobileDetails?.[key]);
  for (const key of Object.keys(offer.cardStats || {})) add(key, offer.cardStats[key]);
  for (const key of Object.keys(offer.qrDetails || {})) add(key, offer.qrDetails[key], key === 'kyc' ? 'QR KYC' : undefined);
  return facts;
};

export const getServiceSummaryFacts = (offer, language, { vpnPrice, qr = false } = {}) => {
  const facts = getServiceFacts(offer, language);
  if (vpnPrice) facts.push({ key: 'price', label: serviceFactLabels.price[language === 'ru' ? 0 : 1], value: vpnPrice });
  const keys = qr ? ['countries', 'fee', 'kyc'] : offer.cardStats ? ['issuance', 'topup', 'maintenance']
    : offer.category === 'Antidetect' ? ['freeProfiles', 'tariffStartPrice', 'profiles100Price', 'control', 'format', 'trial']
    : ['geo', 'types', 'price', 'tariffStartPrice', 'main', 'rate', 'paymentMethods', 'platforms'];
  return keys.map(key => facts.find(fact => fact.key === key)).filter(Boolean).slice(0, 3);
};

export const getServiceTextGroups = (offer, language) => {
  const seen = new Set();
  return [
    ['supports', language === 'ru' ? 'Возможности' : 'Features', offer.details?.supports],
    ['bestFor', language === 'ru' ? 'Для чего подойдёт' : 'Best for', offer.editorial?.bestFor],
    ['pros', language === 'ru' ? 'Плюсы' : 'Pros', offer.details?.pros],
    ['nuances', language === 'ru' ? 'Что стоит учитывать' : 'What to consider', offer.details?.nuances],
    ['considerations', language === 'ru' ? 'Что стоит учитывать' : 'What to consider', offer.editorial?.considerations],
  ].map(([key, heading, value]) => ({ key, heading, items: (localizedServiceValue(value, language) || []).filter(text => {
    if (seen.has(text)) return false;
    seen.add(text);
    return true;
  }) })).filter(group => group.items.length);
};
