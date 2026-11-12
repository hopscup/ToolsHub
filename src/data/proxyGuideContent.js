import { youtubeFarmGuideLink } from './contextualGuideLinks.js';

export const proxyGuideMeta = {
  cover: {
    src: '/article/proxy/cover.webp', previewSrc: '/article/proxy/cover-preview.webp',
    alt: 'Какие прокси выбрать: IPv4, ISP, Residential и Mobile', width: 1280, height: 720,
  },
  "title": "Лучшие прокси-сервисы для аккаунтов: что выбрать в 2026 году | Hopscup Tools",
  "heading": "Лучшие прокси-сервисы для аккаунтов в 2026 году",
  "description": "Какие прокси выбрать для аккаунтов в 2026 году: IPv4 от 1$, ISP, Residential и мобильные. 7 сервисов с промокодами, цены и личный опыт.",
  "datePublished": "2026-08-30T01:39:58+03:00",
  "dateModified": "2026-11-02"
};

export const proxyProviders = [
  {
    "id": "p3",
    "name": "ProxyWing",
    "logo": "/proxywing.webp",
    "url": "https://dashboard.proxywing.com/billing/aff.php?aff=813",
    "types": "IPv4, ISP, Residential, Mobile",
    "choice": "Универсальный вариант",
    "note": "С начала 2025 сижу на их ISP: перешёл с Proxyma по совету из чата, Германия и Франция работают стабильно. Начинать советую с IPv4, а если площадка принимает их плохо, в том же кабинете берёте ISP, Residential или Mobile. Оплатить можно картой РФ.",
    "promoCode": "hopscup",
    "promoDiscount": "−10%"
  },
  {
    "id": "p4",
    "name": "Proxy-Seller",
    "logo": "/proxy-seller.webp",
    "url": "https://proxy-seller.com/?partner=RIPC5NDAEYRZPZ",
    "types": "IPv4, IPv6, ISP, Residential, Mobile",
    "choice": "Качество и большой выбор",
    "note": "Беру, когда нужен большой выбор: больше 220 стран и все основные типы, от IPv4 до Mobile. Особенно нравятся их Residential. Для YouTube и Gmail нам с ребятами хватает обычных IPv4 отсюда.",
    "promoCode": "hopscup",
    "promoDiscount": "−10%"
  },
  {
    "id": "p6",
    "name": "MobileProxy",
    "logo": "/mobileproxy.webp",
    "url": "https://mobileproxy.rent/user.html?free&p=105422",
    "types": "Mobile",
    "choice": "Мобильные прокси",
    "note": "Пользуюсь больше трёх лет. Трафик безлимитный, IP меняется по кнопке раз в 10 секунд, гео можно выбрать вплоть до города. Минус: профили сидят на одном IP, поэтому работают по очереди. Есть бесплатный тест на 3 часа.",
    "promoCode": "hopscup",
    "promoDiscount": "−20%"
  },
  {
    "id": "p1",
    "name": "ProxyShard",
    "logo": "/proxyshard.webp",
    "url": "https://proxyshard.com?ref=hopscup",
    "types": "IPv4, ISP, Residential, Mobile",
    "choice": "Баланс цены и качества",
    "note": "Сервис от команды, которая сделала бесплатный антидетект ShardX. SOCKS5 с UDP на всех типах прокси, поэтому с ShardX они работают лучше всего. Пополнение от 5$, оплата криптой или зарубежной картой.",
    "promoCode": "hopscup"
  },
  {
    "id": "p2",
    "name": "Proxyline",
    "logo": "/proxyline.webp",
    "url": "https://proxyline.net?line=152448",
    "types": "IPv4, IPv6",
    "choice": "Недорогие IPv4",
    "note": "Классика для IPv4, раньше брал здесь в 90% случаев. Иногда европейский IP определяется как США, но поддержка быстро делает замену.",
    "promoCode": "hopscup",
    "promoDiscount": "−10%"
  },
  {
    "id": "p5",
    "name": "Proxy6",
    "logo": "/proxy6.webp",
    "url": "https://px6.net/c/103460",
    "types": "IPv4, IPv6, Shared IPv4, MTProto",
    "choice": "Много IP без переплаты",
    "note": "Много дешёвых IPv4 для повседневных задач и автоматизации. Shared для серьёзной работы не берите: один адрес могли продать нескольким людям.",
    "promoCode": "hopscup",
    "promoDiscount": "−5%"
  },
  {
    "id": "p7",
    "name": "Proxys.io",
    "logo": "/proxys-io.webp",
    "url": "https://proxys.io/?refid=54507",
    "types": "IPv4, IPv6, Residential, Mobile, Dynamic",
    "choice": "Большой выбор форматов",
    "note": "Я тестировал здесь обычные IPv4 и Residential, оба варианта работали хорошо. Есть динамические прокси и много способов оплаты."
  }
];

export const proxyTypes = [
  {
    "name": "IPv4",
    "price": "от 1–2$ за IP в месяц",
    "text": "Мой базовый выбор для Gmail, Twitter, Discord, Telegram, YouTube, нейронок и антидетектов. Если чекер пишет, что это прокси или VPN, это нормально: серверные IP так и определяются."
  },
  {
    "name": "ISP",
    "price": "1,5–2,5$ за IP в месяц",
    "text": "Беру для рекламных кабинетов, браузерных нод, бирж и Claude: там обычные IPv4 принимают хуже.",
    "linkText": "Claude",
    "href": "/guides/claude-iz-rossii-bez-bana"
  },
  {
    "name": "Residential",
    "price": "обычно от 3$ за ГБ",
    "text": "Выглядят как домашний интернет. Удобно, когда нужен высокий траст, а профиль не держится открытым постоянно и не расходует много гигабайт."
  },
  {
    "name": "Mobile",
    "price": "от 30–50$ в месяц, безлимит",
    "text": "Самые трастовые: IP от сотовых операторов, меняется по кнопке. Хороши для капризных площадок и больших ферм, но профили запускаются по очереди."
  }
];

export const proxyCopy = {
  "intro": "Семь сервисов, которыми я пользуюсь сам. Разбираемся, когда хватит обычного IPv4, а когда есть смысл брать ISP, Residential или Mobile.",
  "shortHeading": "Сначала попробуйте обычный Data Center",
  "short": "Начинайте с обычных IPv4 Data Center за 1–2$. Для Gmail, Twitter, Discord, Telegram, YouTube, нейронок и антидетектов их хватает в 95% случаев. Я обычно использую только DT, ISP и иногда Mobile. Если IPv4 Data Center стоит около 2$ за IP в месяц, можно сразу брать ISP: они качественнее. Если площадка начинает принимать их плохо, тогда уже смотрите ISP, Residential или Mobile.",
  "socks": "Я всегда ставлю SOCKS5. Для антидетектов это самый универсальный вариант.",
  "ipv6": "Они дешевые, но некоторые сайты и программы до сих пор работают с ними нестабильно. Если не уверены, берите IPv4.",
  "services": "Все семь пробовал сам. У каждого своя задача: где-то дешёвые IPv4, где-то мобильные или Residential. Промокод hopscup работает почти везде.",
  "setup": "Обычно сервис выдает IP, порт, логин и пароль. В антидетекте выбираете SOCKS5, вставляете данные в нужные поля и запускаете проверку. Если проверка прошла, сохраняете профиль и работаете.",
  "example": "Обычно прокси выглядит так: IP:порт:логин:пароль, например 185.12.34.47:8000:user12:Kx7p9q (данные выдуманы). В антидетекте эти четыре значения вставляются в отдельные поля или одной строкой.",
  "mobileSetup": "С мобильными прокси логика отличается. Обычно вы подключаете прокси один раз, а новый IP получаете кнопкой в кабинете сервиса. После смены адреса обновляете или перезапускаете профиль.",
  "check": "После покупки IP можно проверить через IPQualityScore или Scamalytics. Fraud Score до 10-20 обычно выглядит нормально, 20-30 еще терпимо для базовых задач, а высокий показатель уже повод проверить другой адрес или попросить замену.",
  "checkNote": "IPv4 часто определяются как VPN или proxy просто потому, что они серверные. Это не делает их плохими. Обычные IPv4 я проверяю редко, если они нормально работают на нужной площадке.",
  "phone": "Если аккаунтов мало, иногда хватает обычной мобильной симки. Включаете режим самолета, выключаете его и получаете новый мобильный IP. Главное следить за гео и не пытаться одновременно держать много профилей на разных адресах."
};



export const proxyCatalogueCta = [
  { text: '👉 Больше прокси с ценами и типами у меня на сайте в разделе ' },
  { text: 'Прокси и VPN', href: '/proxy-vpn' }, { text: '.' },
];

export const proxyComparison = {
  heading: 'Что выгоднее: мобильные прокси или ISP / Data Center',
  provider: proxyProviders.find(provider => provider.id === 'p6'),
  image: {
    src: '/article/proxy/mobile-vs-isp.webp',
    alt: 'Сравнение мобильных прокси и ISP / Data Center: цена, количество аккаунтов, плюсы и минусы',
    caption: 'До 20 аккаунтов выгоднее ISP или датацентровые, от 30 аккаунтов мобильные.',
    width: 1280,
    height: 720,
  },
  paragraphs: [
    [{ text: 'Тут всё упирается в два вопроса: сколько у вас аккаунтов и сколько профилей нужно держать открытыми одновременно.' }],
    [
      { text: 'Если аккаунтов до 20,', strong: true },
      { text: ' проще и дешевле взять обычные датацентровые (IPv4) или ISP-прокси. Цена 1,5–2,5$ за штуку в месяц, схема простая: одна прокси на один аккаунт. Плюс в том, что все профили можно запускать одновременно, у каждого свой айпи.' },
    ],
    [
      { text: 'Если аккаунтов больше,', strong: true },
      { text: ' начинаем считать. 30 аккаунтов на прокси по 1,5$ - это уже 45$ в месяц, и с каждым новым аккаунтом счёт растёт. А мобильные прокси, например с гео Кыргызстана или Сингапура, обойдутся примерно в те же 40–45$. Только на них можно держать хоть 100, хоть 1000 аккаунтов, а айпи меняется по кнопке сколько угодно раз.' },
    ],
    [{ text: 'Минус у мобильных один, зато важный: одна мобильная прокси даёт один айпи в моменте. Поэтому профили работаете по очереди: открыли профиль, поработали, сменили айпи, открыли следующий. Сидеть на них одновременно не получится, айпи у всех будет одинаковый. Нужно три профиля параллельно - берёте три мобильные прокси.' }],
    [
      { text: 'Если у вас 20–30 аккаунтов,', strong: true },
      { text: ' это серая зона, и решает уже не количество, а режим работы. Нужно, чтобы много профилей было открыто одновременно (автоматизация, ноды, фарм в фоне) - берите ISP или датацентровые. Заходите в аккаунты по очереди - мобильные выйдут дешевле и надёжнее.' },
    ],
    [
      { text: 'Сам я уже несколько лет сижу на мобильных прокси от ' },
      { text: 'MobileProxy', href: proxyProviders.find(provider => provider.id === 'p6').url },
      { text: '. Есть бесплатный тест на 3 часа, промокод ' },
      { text: 'hopscup', promoCode: true },
      { text: ' даёт −20%.' },
    ],
    [
      { text: 'Для ISP и датацентровых смотрите ' },
      { text: 'ProxyWing', href: '#services' }, { text: ', ' },
      { text: 'Proxy-Seller', href: '#services' }, { text: ' и ' },
      { text: 'ProxyShard', href: '#services' }, { text: ' в списке ниже.' },
    ],
    proxyCatalogueCta,
  ],
};

export const proxyChecklist = {
  items: [
    [{ text: 'Пара аккаунтов: вообще не платите, хватит ' }, { text: 'режима самолёта', href: '/guides/mobile-ip-airplane-mode' }, { text: '.' }],
    [{ text: 'До 20 аккаунтов: IPv4 за 1-2$, на каждый аккаунт свой.' }],
    [{ text: 'Площадка плохо принимает IPv4: берите ISP.' }],
    [{ text: '30+ аккаунтов и сидите по очереди: мобильные, они дешевле и трастовее.' }],
    [{ text: 'Shared и прокси за 15 ₽: мимо, если аккаунты важные' }],
  ],
  sources: [
    { label: 'IPv4 и ISP', ids: ['p3', 'p4', 'p1'] },
    { label: 'Мобильные', ids: ['p6', 'p3', 'p4'] },
    { label: 'Residential', ids: ['p4', 'p3', 'p7'] },
  ].map(({ label, ids }) => ({
    label,
    links: ids.map(id => {
      const provider = proxyProviders.find(provider => provider.id === id);
      return { text: provider.name, href: provider.url };
    }),
  })),
  action: { label: 'Все прокси на сайте', href: '/proxy-vpn' },
  note: [{ text: 'Промокод ' }, { text: 'hopscup', strong: true }, { text: ' почти везде.' }],
};

export const proxySetupContent = [
  { text: 'Обычно сервис выдает IP, порт, логин и пароль. ' },
  { text: 'В антидетекте', href: '/guides/kak-nastroit-antidetect-brauzer' },
  { text: ' выбираете SOCKS5, вставляете данные в нужные поля и запускаете проверку. Если проверка прошла, сохраняете профиль и работаете.' },
];


const h = (id, text, level = 2) => ({ type: 'heading', id, text, level });
const p = text => ({ type: 'paragraph', content: [{ text }] });
const a = (text, href) => ({ type: 'paragraph', content: [{ text, href }] });
const screenshot = (file, alt, caption) => ({
  type: 'image', src: `/article/proxy/${file}`, alt, caption,
  ...(file === 'proxyshard-issued-proxy.webp' ? { width: 574, height: 220 } : {}),
  ...(file === 'adspower-socks5-test-cropped.webp' ? { width: 710, height: 402 } : {}),
});

export const proxyGuideBlocks = [
  h('korotko', proxyCopy.shortHeading), p(proxyCopy.short),
  h('comparison', 'Быстрое сравнение'), { type: 'provider-table' },
  h('types', 'Какой тип прокси выбрать'), { type: 'proxy-types' },
  h('socks', 'SOCKS5 или HTTP', 3), p(proxyCopy.socks),
  h('ipv6', 'Что насчет IPv6', 3), p(proxyCopy.ipv6),
  h('services', 'Семь сервисов, которыми я пользуюсь'), p(proxyCopy.services), { type: 'providers' },
  screenshot('proxywing-dashboard.png', 'Выбор типа и страны прокси в кабинете ProxyWing', 'ProxyWing: выбор типа прокси, страны и тарифа.'),
  screenshot('proxy-seller-dashboard.png', 'Расчет IPv4 в кабинете Proxy-Seller', 'Proxy-Seller: быстрый расчет IPv4 по стране, сроку и количеству.'),
  screenshot('proxyline-calculator.png', 'Калькулятор стоимости выделенных IPv4 в Proxyline', 'Proxyline: расчет 50 выделенных IPv4 на 30 дней.'),
  { type: 'paragraph', content: proxyCatalogueCta },
  h('setup', 'Как подключить прокси'), { type: 'paragraph', content: proxySetupContent },
  screenshot('proxyshard-issued-proxy.webp', 'Выдача купленного IPv4 в кабинете ProxyShard', 'ProxyShard: формат IP:порт:логин:пароль. Чувствительные значения частично скрыты.'),
  p(proxyCopy.example),
  screenshot('adspower-socks5-test-cropped.webp', 'Настройка SOCKS5 и успешная проверка соединения в AdsPower', 'SOCKS5 добавлен в AdsPower, проверка соединения пройдена.'),
  p(proxyCopy.mobileSetup), a('Сравнить мобильные прокси', '/proxy-vpn/luchshie-mobilnye-proksi'),
  a(youtubeFarmGuideLink.label.ru, youtubeFarmGuideLink.href),
  screenshot('mobileproxy-copy-formats.png', 'Форматы копирования HTTP и SOCKS5 в MobileProxy', 'Готовую строку можно скопировать в нужном формате HTTP или SOCKS5.'),
  screenshot('mobileproxy-change-ip.png', 'Кнопка смены IP в кабинете MobileProxy', 'IP меняется по отдельной ссылке в кабинете MobileProxy.'),
  h('cost', proxyComparison.heading), { type: 'image', ...proxyComparison.image },
  ...proxyComparison.paragraphs.map(content => ({ type: 'paragraph', content })),
  h('check', 'Как проверить IP'), p(proxyCopy.check), p(proxyCopy.checkNote),
  a('IPQualityScore', 'https://www.ipqualityscore.com/'), a('Scamalytics', 'https://scamalytics.com/'),
  screenshot('scamalytics-low-risk.png', 'Низкий Fraud Score в Scamalytics', 'Scamalytics: Fraud Score 0, низкий риск.'),
  screenshot('ipqs-high-risk.png', 'Высокий Fraud Score в IPQualityScore', 'IPQualityScore: Fraud Score 68, IP определяется как VPN и proxy.'),
  h('phone', 'Когда можно вообще обойтись без прокси'), p(proxyCopy.phone),
  a('Гайд по смене IP с телефона', '/guides/mobile-ip-airplane-mode'),
  { type: 'checklist' },
];
