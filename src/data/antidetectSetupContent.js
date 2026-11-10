export const antidetectSetupMeta = {
  datePublished: '2026-09-06T21:36:58+03:00',
  dateModified: '2026-11-10',
  cover: {
    src: '/article/antidetect-setup/cover.webp',
    previewSrc: '/article/antidetect-setup/cover-preview.webp',
    alt: 'Как настроить антидетект: Dolphin, AdsPower и ShardX, прокси, WebRTC и IP',
    width: 1280,
    height: 720,
  },
};

export const antidetectVideoUrl = 'https://youtu.be/pBljqjuY2ls?si=Ft3UMgxjNUvaRT4d';

// Existing approved copy, shared with the static article without rewriting it.
export const antidetectSetupCopy = {
  foundation: [
    { text: 'Антидетект создаёт отдельный браузерный профиль: свои cookies, историю, локальное хранилище и отпечаток устройства. Но сам по себе он не меняет ваш IP. Для этого нужна прокси или ' },
    { text: 'мобильный интернет + режим самолёта', href: '/guides/mobile-ip-airplane-mode' },
    { text: '.' },
  ],
  roles: [
    { title: 'Антидетект', text: 'Подменяет и разделяет данные браузера и устройства.' },
    { title: 'Прокси', text: 'Меняет IP и сетевое местоположение профиля.' },
  ],
  mainRule: 'Главное правило: один профиль должен выглядеть как одно и то же нормальное устройство, похожее на реального пользователя при каждом запуске. Обычно все базовые настройки антика уже сделаны грамотно.',
  settings: [
    { name: 'IP и прокси', value: 'Для профиля должен использоваться нужный IP. Если аккаунты не должны быть связаны между собой, не сажайте их на одну и ту же постоянную прокси.' },
    { name: 'ОС и User-Agent', value: 'ОС стараемся ставить на основе вашего реального устройства. То есть если у вас ПК на Windows, ставим ОС нового профиля Windows, а не macOS или Linux.' },
    { name: 'Часовой пояс', value: 'Ставим Auto или на основании вашего IP. Время профиля должно соответствовать стране и городу прокси.' },
    { name: 'Геолокация', value: 'Ставим Auto или на основании вашего IP.' },
    { name: 'Язык', value: 'Ставим Auto или на основании вашего IP. Русский язык с IP Казахстана или Узбекистана выглядит нормально, но случайная мешанина языков уже такое себе.' },
    { name: 'WebRTC', value: 'Не оставляйте Real. Используйте подмену, шум, режим на основе прокси или Auto.' },
    { name: 'Canvas и WebGL', value: 'Оставляйте автоматический стабильный отпечаток или штатный noise. Не меняйте видеокарту, Canvas и железо отдельными случайными значениями.' },
    { name: 'Do Not Track', value: 'Обычно Off. У большинства обычных пользователей этот параметр не включён.' },
    { name: 'Экран и железо', value: 'Ставим Auto. Разрешение, процессор, память и видеокарта должны сочетаться с выбранным устройством.' },
  ],
  browserIntros: [
    'Нормальный вариант для обычной работы с аккаунтами. В большинстве случаев стандартные настройки уже подходят.',
    'Здесь параметров больше, но это не значит, что каждый из них нужно обязательно менять.',
    'Бесплатный вариант с локальными профилями. Точные параметры здесь тоже лучше доверить готовому шаблону.',
  ],
  screenshots: [
    { src: '/article/antidetect-setup/dolphin-profile-settings-1.png', alt: 'Настройки профиля Dolphin Anty: Windows, User-Agent, WebRTC, Canvas и WebGL', caption: 'Dolphin Anty: ОС, User-Agent, WebRTC и основные параметры отпечатка.' },
    { src: '/article/antidetect-setup/dolphin-profile-settings-2.png', alt: 'Настройки профиля Dolphin Anty: часовой пояс, язык, геолокация, процессор, память и шрифты', caption: 'Dolphin Anty: часовой пояс, язык, геолокация и параметры устройства.' },
    { src: '/article/antidetect-setup/adspower-profile-settings-1.png', alt: 'Настройки профиля AdsPower: SunBrowser, Windows и User-Agent', caption: 'AdsPower: выбор браузера, операционной системы и User-Agent.' },
    { src: '/article/antidetect-setup/adspower-profile-settings-2.png', alt: 'Настройки профиля AdsPower: WebRTC через прокси UDP, часовой пояс, геолокация, язык и экран', caption: 'AdsPower: WebRTC через прокси UDP и остальные параметры на основе IP.' },
    { src: '/article/antidetect-setup/shardx-profile-settings.png', alt: 'Настройки профиля ShardX: Windows, прокси, часовой пояс, язык, WebRTC, геолокация и Noise', caption: 'Пример настроек профиля ShardX' },
  ],
  checkers: [
    { href: 'https://pixelscan.net/', title: 'Pixelscan', text: 'Общая проверка IP и отпечатка' },
    { href: 'https://browserleaks.com/', title: 'BrowserLeaks', text: 'WebRTC, Canvas, WebGL и DNS' },
    { href: 'https://2ip.io/', title: '2ip.io', text: 'IP, страна и провайдер' },
  ],
  checks: [
    [{ text: 'Сайт видит IP вашей прокси, а не настоящий IP компьютера.' }],
    [{ text: 'Если у вас датацентровая прокси (IPv4) и чекер пишет ' }, { text: 'Proxy/VPN detected', strong: true }, { text: ', это нормально. Он распознал IP дата-центра по провайдеру и диапазону адресов, а не нашёл утечку вашего настоящего IP. Для большинства обычных задач такие прокси подходят. Но в сервисах с сильным антифродом (букмекеры, биржи и т. д.) лучше использовать только ISP, Residential или Mobile IP.' }],
    [{ text: 'Страна, часовой пояс, геолокация и язык совпадают под ваше гео.' }],
    [{ text: 'WebRTC не показывает ваш реальный адрес.' }],
    [{ text: 'WebGL Vendor и Renderer выглядят как обычная Intel, AMD или NVIDIA, а не случайный набор.' }],
    [{ text: 'После повторного запуска этот же профиль сохраняет тот же отпечаток и cookies.' }],
  ],
  warning: 'Зелёный чекер не даёт гарантию, что аккаунт никогда не заблокируют. Площадки смотрят ещё на качество IP, историю аккаунта и ваши действия.',
  mistakes: [
    'Менять Canvas, WebGL, процессор, память и экран отдельными случайными значениями.',
    'Генерировать новый отпечаток при каждом запуске постоянного профиля.',
    'Ставить прокси США, часовой пояс Москвы и геолокацию другой страны.',
    'Оставлять WebRTC в режиме Real после подключения прокси.',
    'Постоянно менять страну прокси у аккаунта без реальной необходимости.',
    'Сразу создавать сотню профилей, не проверив один готовый профиль.',
  ],
  closing: 'Если совсем коротко: создаём профиль, перепроверяем параметры (но обычно я даже не чекаю), добавляем отдельный IP, например с помощью прокси. Если что, у меня есть видео на 15 минут с объяснением всех нюансов.',
};

export const antidetectSetupAdditions = {
  free: [
    { text: 'Для 2-5 аккаунтов платить за антидетект вообще не нужно. ' },
    { text: 'AdsPower', service: 'adspower' }, { text: ' даёт 2 профиля навсегда, ' },
    { text: 'Dolphin', service: 'dolphin' }, { text: ' 5, ' },
    { text: 'GoLogin', service: 'gologin' }, { text: ' 3. А ' },
    { text: 'ShardX', service: 'shardx' }, { text: ' и ' },
    { text: 'Donut Browser', service: 'donut' }, { text: ' бесплатные без лимита профилей, они хранятся у вас на ПК.' },
  ],
  freeMore: { text: 'Все антидетекты с тарифами у меня на сайте в разделе Антидетекты', href: '/antidetect' },
  proxy: [
    { text: 'Для обычных задач хватит IPv4 за 1-2$, для строгих площадок берите ISP. Я беру у ' },
    { text: 'ProxyWing', service: 'proxywing' }, { text: ' (оплата картой РФ) и ' },
    { text: 'ProxyShard', service: 'proxyshard' }, { text: ' (лучше всего работают с ShardX: SOCKS5 с UDP). Если аккаунтов много и сидите по очереди, удобнее мобильные от ' },
    { text: 'MobileProxy', service: 'mobileproxy' }, { text: '. Промокод ' }, { text: 'hopscup', strong: true }, { text: ' почти везде.' },
  ],
  airplane: [{ text: 'Аккаунтов пара штук - хватит ' }, { text: 'режима самолёта', href: '/guides/mobile-ip-airplane-mode' }, { text: '.' }],
  proxyMore: { text: 'Какой тип прокси выбрать, разобрал отдельно', href: '/proxy-vpn/luchshie-proksi' },
  connection: 'Прокси выдают строкой IP:порт:логин:пароль. В профиле выбираете SOCKS5, вставляете данные в поля и жмёте «Проверить». Прошло - сохраняете профиль и запускаете.',
};

const serviceIds = { proxywing: 'p3', proxyshard: 'p1', mobileproxy: 'p6', adspower: 'ant-adspower', dolphin: 'ant-dolphin', gologin: 'ant-gologin', shardx: 'ant-shardx', donut: 'ant-donut' };

export const getAntidetectGuideServices = offers => Object.fromEntries(Object.entries(serviceIds).map(([key, id]) => {
  const offer = offers.find(offer => offer.id === id);
  if (!offer?.slug || !offer.url) throw Error(`Missing antidetect guide service: ${id}`);
  return [key, { ...offer, route: `/${offer.category === 'Proxy' ? 'proxy-vpn' : 'antidetect'}/${offer.slug}` }];
}));

export const resolveAntidetectGuideSegments = (segments, services, internal = false) => segments.map(({ service, ...part }) => ({ ...part, ...(service ? { href: internal ? services[service].route : services[service].url } : {}) }));

export const createAntidetectGuideChecklist = offers => {
  const services = getAntidetectGuideServices(offers);
  const link = (service, text, internal = false) => ({ text, href: internal ? services[service].route : services[service].url });
  return {
    items: [
      'ОС ставим как у вашего ПК, остальное на Auto или на основе IP.',
      'На каждый профиль отдельный IP: прокси SOCKS5 или режим самолёта.',
      'WebRTC не оставляем в режиме Real.',
      'Canvas, WebGL и железо руками не крутим.',
      'Проверяем один профиль в чекере, и только потом создаём остальные.',
    ].map(text => [{ text }]),
    sources: [
      { label: 'Антидетекты бесплатно', links: [link('adspower', 'AdsPower'), link('dolphin', 'Dolphin'), link('shardx', 'ShardX', true)] },
      { label: 'Прокси', links: [link('proxywing', 'ProxyWing'), link('proxyshard', 'ProxyShard'), link('mobileproxy', 'MobileProxy')] },
    ],
    note: [{ text: 'Промокод ' }, { text: 'hopscup', strong: true }, { text: ' почти везде.' }],
    action: { href: '/antidetect', label: 'Все антидетекты на сайте' },
  };
};
