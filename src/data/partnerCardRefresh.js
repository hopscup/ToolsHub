const l = (ru, en) => ({ ru, en });
const enFallback = (ru, en) => ({ ru, en, es: en, zh: en, ko: en });

export const partnerMetadataById = {
  'vpn-ppl': {
    route: "/proxy-vpn/ppl-vpn",
    title: enFallback("PPL VPN: отзыв, 3 дня бесплатно, сайт без Telegram | Hopscup", "PPL VPN: 3 free days, pay without Telegram | Hopscup"),
    description: enFallback("Мой отзыв о PPL VPN: пользуюсь около 8 месяцев на ПК и телефоне. 3 дня бесплатно, от 124 ₽ в месяц, сайт для оплаты без Telegram и VPN, приложения для всех систем.", "My PPL VPN review after around eight months on desktop and phone. Three free days, plans from RUB 124 a month, payment on a website without Telegram, and clients for all major systems."),
    dateModified: '2026-11-22',
  },
  'vpn-imp': {
    route: "/proxy-vpn/imp-vpn",
    title: enFallback("iMP VPN: отзыв, 3 дня бесплатно и белые списки | Hopscup", "iMP VPN review: 3 free days and mobile allowlists | Hopscup"),
    description: enFallback("Мой отзыв о iMP VPN: пользуюсь как запасным на ПК и телефоне. 3 дня бесплатно, до 5 устройств, безлимитный трафик и 50 ГБ на белые списки, российские сайты работают без отключения VPN.", "My iMP VPN review: a backup on desktop and phone, with three free days, up to five devices, unlimited regular traffic and 50 GB for allowlist networks. Russian sites work without disconnecting."),
    dateModified: '2026-11-22',
  },
  'vpn-all': {
    route: "/proxy-vpn/all-vpn",
    title: enFallback("ALL VPN: обзор, 50+ VPN в одной подписке | Hopscup", "ALL VPN: 50+ VPNs in one subscription | Hopscup"),
    description: enFallback("Обзор ALL VPN: больше 50 разных VPN в одной подписке, переключение прямо в Happ, 50 ГБ на белые списки. 3 часа бесплатно, от 199 ₽ в месяц, оплата по СБП, картой, звёздами или криптой.", "ALL VPN combines more than 50 VPN services in one subscription, with switching inside Happ and 50 GB for allowlist networks. Three free hours, from RUB 199 a month, and SBP, card, Stars or crypto payments."),
    dateModified: '2026-11-22',
  },
  'vpn-tochka-g': {
    route: "/proxy-vpn/tochka-g",
    title: enFallback("Точка G VPN: обзор, белые списки и Telegram | Hopscup", "Tochka G VPN: allowlists and Telegram access | Hopscup"),
    description: enFallback("Обзор Точки G: VPN в Telegram с подпиской G, тарифом G Premium под белые списки и бесплатной ссылкой на 40 минут, чтобы зайти в Telegram и оплатить VPN. 2 дня бесплатно, от 179 ₽.", "Tochka G review: a Telegram VPN with the G subscription, G Premium for allowlist networks, and a free 40-minute link to reach Telegram and pay. Two free days, plans from RUB 179."),
    dateModified: '2026-11-22',
  },
  'bot-lachuga': {
    route: '/account-shop/lachuga-skamera',
    title: enFallback('Лачуга: отзыв, дешёвые Gemini, ChatGPT и Claude | Hopscup', 'Lachuga review: affordable Gemini, ChatGPT and Claude | Hopscup'),
    description: enFallback('Мой отзыв о Лачуге: Telegram-магазин с дешёвыми подписками Gemini, ChatGPT, Claude, CapCut и Canva. Что брал сам, сколько стоит, гарантия и как покупать.', 'My Lachuga review: a Telegram shop for discounted Gemini, ChatGPT, Claude, CapCut and Canva subscriptions. What I bought, prices, warranties and how to order.'),
    dateModified: '2026-11-19',
  },
  'ant-shardx': {
    route: '/antidetect/shardx',
    title: enFallback('ShardX: отзыв, бесплатный антидетект без лимита | Hopscup', 'ShardX: free antidetect, unlimited profiles | Hopscup'),
    description: enFallback('Мой отзыв о ShardX: полностью бесплатный антидетект от одноимённого прокси-сервиса, профили без лимита, без регистрации. Проверка на утечки, API и MCP, минусы и как начать.', 'My ShardX review: a free antidetect browser from the proxy service of the same name, with unlimited profiles and no registration. Leak tests, API and MCP, limitations and setup.'),
    dateModified: '2026-11-19',
  },
  'p4': {
    route: '/proxy-vpn/proxy-seller',
    title: enFallback('Proxy-Seller: отзыв, цены и какие прокси брать | Hopscup', 'Proxy-Seller review: prices and proxy types | Hopscup'),
    description: enFallback('Мой отзыв о Proxy-Seller: IPv4, ISP, резидентские и мобильные прокси в 220+ странах. Что брать под YouTube, Claude и фермы аккаунтов, цены и промокод hopscup.', 'My Proxy-Seller review: IPv4, ISP, residential and mobile proxies in 220+ countries. Prices, the hopscup code and choices for YouTube, Claude and account work.'),
    dateModified: '2026-11-19',
  },
  'p1': {
    route: '/proxy-vpn/proxyshard',
    title: enFallback('ShardX (ProxyShard): отзыв, прокси с UDP | Hopscup', 'ShardX (ProxyShard) review: UDP proxies | Hopscup'),
    description: enFallback('Мой отзыв о ShardX, бывшем ProxyShard: IPv4, ISP, резидентские и мобильные прокси от команды одноимённого бесплатного антидетекта. SOCKS5 с UDP, пополнение от 5$, оплата криптой или зарубежной картой.', 'My review of ShardX, formerly ProxyShard: IPv4, ISP, residential and mobile proxies from the team behind the free antidetect browser of the same name. SOCKS5 with UDP, a $5 minimum deposit, crypto or foreign-card payments.'),
    dateModified: '2026-11-19',
  },
  'zarub': {
    route: '/foreign-cards/zarub',
    title: enFallback('Zarub: отзыв о карте без KYC и комиссии | Hopscup', 'Zarub review: no-KYC Visa card and fees | Hopscup'),
    description: enFallback('Мой отзыв о Zarub: зарубежная Visa без KYC, пополнение через СБП или USDT. Оплачиваю ей ChatGPT, Claude, Higgsfield и другие подписки. Выпуск, комиссии и промокод HOPS.', 'My Zarub review: a no-KYC Visa funded by SBP or USDT. I use it for ChatGPT, Claude, Higgsfield and other subscriptions. Issuance, fees and the HOPS code.'),
    dateModified: '2026-11-19',
  },
  'pgon': {
    route: '/foreign-cards/pgon',
    title: enFallback('PGON: отзыв, карта Visa и оплата криптой по QR | Hopscup', 'PGON review: Visa card and crypto QR payments | Hopscup'),
    description: enFallback('Мой отзыв о PGON: кошелёк в Telegram с виртуальной Visa и оплатой криптой по QR в России и за границей. Выпуск около 8$, лимит без паспорта, комиссии.', 'My PGON review: a Telegram wallet with a virtual Visa and crypto QR payments in Russia and abroad. Issuance around $8, no-passport limits and fees.'),
    dateModified: '2026-11-19',
  },
};

export const darkShoppingMetadata = {
  title: l('DarkShopping: отзыв, аккаунты и почты, как покупать | Hopscup', 'DarkShopping review: accounts, email and buying | Hopscup'),
  description: l('Мой отзыв о DarkShopping: Gmail, Outlook, Telegram, Discord, Facebook и другие аккаунты для работы. Как выбрать продавца, сколько стоит и что делать сразу после покупки.', 'My DarkShopping review: Gmail, Outlook, Telegram, Discord and Facebook accounts for work. How to compare sellers, test a purchase and secure your account.'),
};

export const partnerEditorialById = {
  'vpn-ppl': {
    description: l('PPL VPN мой основной VPN, сижу на нём уже около 8 месяцев, и с компьютера, и с телефона. Нейросети, Spotify, Telegram, YouTube и всё остальное.\n\nПеребои за это время бывали, но максимум часа на два, и всего раза два.\n\nШустрый, YouTube идёт без рекламы, а купить подписку можно даже тогда, когда не открывается вообще ничего.', 'PPL VPN is my main VPN. I have used it on both my computer and phone for around eight months: AI tools, Spotify, Telegram, YouTube and everything else.\n\nThere have been outages, but only a couple, each lasting no more than about two hours.\n\nIt is fast, YouTube plays without ads, and you can buy a subscription even when nothing else will open.'),
    capabilities: l([
      'Приложения и инструкции для Windows, macOS, Android, iOS и Linux, ключ можно вставить в Happ или INCY.',
      '10+ стран.',
      'Сайт, который открывается без VPN: зашли с браузера, оплатили и получили ключ. Telegram для этого не нужен.',
      'Бесплатный прокси для Telegram, чтобы зайти в бота, если телега не грузит.',
      'Оплата картой, по СБП или криптой.',
    ], [
      'Apps and setup guides for Windows, macOS, Android, iOS and Linux. You can import the key into Happ or INCY.',
      'More than 10 countries.',
      'A website that opens without a VPN: pay in your browser and receive a key without using Telegram.',
      'A free Telegram proxy to reach the bot when Telegram will not connect.',
      'Bank-card, SBP and crypto payments.',
    ]),
    pricing: l([
      '3 дня бесплатно на тест.',
      'Подписка от 124 ₽ в месяц.',
    ], [
      'A three-day free trial.',
      'Subscriptions from RUB 124 a month.',
    ]),
    bestFor: l([
      'Как основной VPN на каждый день: нейросети, YouTube, Spotify, Telegram и зарубежные сайты.',
      'Тем, у кого VPN закончился и Telegram не грузит: подписку можно купить на сайте прямо из браузера.',
      'Одной подпиской на компьютер и телефон.',
    ], [
      'An everyday VPN for AI tools, YouTube, Spotify, Telegram and international websites.',
      'Renewing an expired subscription when Telegram will not load: buy directly in your browser.',
      'Using one subscription on your computer and phone.',
    ]),
    considerations: l([
      'Обхода белых списков нет. Если у вас на мобильном интернете режут всё, кроме разрешённых сайтов, держите вторым iMP или ALL VPN.',
      'Скорость зависит от страны и вашего провайдера. Если какой-то сервис не открывается, попробуйте другое гео.',
      'Перед использованием обновляйте подписку в приложении стрелками: серверы иногда меняются.',
    ], [
      'It does not bypass mobile allowlists. If your mobile connection blocks everything except approved sites, keep iMP or ALL VPN as a backup.',
      'Speeds depend on the country and your internet provider. Try another location if a service will not open.',
      'Refresh the subscription in your client using the arrow button before connecting; servers sometimes change.',
    ]),
    gettingStarted: l([
      'Заходите в бота или на сайт по ссылке и берёте 3 дня бесплатно.',
      'Копируете ключ и вставляете его в Happ или INCY.',
      'Проверяете на вайфае и на мобильном интернете и, если всё ок, оплачиваете.',
    ], [
      'Open the bot or website through the link and claim the three-day trial.',
      'Copy the key and import it into Happ or INCY.',
      'Test on both Wi-Fi and mobile data, then pay if it works for you.',
    ]),
    verdict: l('Мой основной VPN уже больше полугода: быстро, стабильно и недорого. Белых списков не пробивает, поэтому на мобильном интернете в регионах с глушилками держите рядом второй VPN.', 'My main VPN for over half a year: fast, reliable and inexpensive. It does not bypass allowlists, so keep a second VPN for mobile data in regions with restrictive filtering.'),
    links: [
      { href: '/guides/vpn-ne-rabotaet-na-4g', label: l('Почему VPN не работает на 4G и что делать', 'Why VPN does not work on 4G and what to do') },
      { href: '/guides/happ-marshrutizaciya', label: l('Как настроить маршрутизацию в Happ, чтобы банки работали с VPN', 'Happ routing: keep banking apps working with VPN enabled') },
      { href: '/proxy-vpn/imp-vpn', label: l('Запасной VPN с белыми списками', 'A backup VPN for allowlist networks') },
    ],
  },
  'vpn-imp': {
    description: l('iMP VPN пользуюсь как запасным уже пару месяцев, тоже на компе и на телефоне, пока без нареканий.\n\nБольше всего понравилось, что тут даже маршрутизацию настраивать не пришлось: все российские сервисы работают без выключения VPN. Плюс есть отдельные LTE-серверы под белые списки на мобильном интернете.', 'I have used iMP VPN as a backup on both my computer and phone for a couple of months, with no complaints so far.\n\nMy favourite part is that I did not have to configure routing: Russian services work without switching the VPN off. There are also dedicated LTE servers for mobile allowlist restrictions.'),
    capabilities: l([
      'До 5 устройств на одну подписку.',
      'Обычный трафик без лимита.',
      'LTE-серверы под белые списки: 50 ГБ в месяц, можно докупить.',
      'Российские сайты и банки открываются с включённым VPN прямо из коробки.',
      'Выбор страны вручную или автоподключение, 10+ стран.',
      'Оплата по СБП, картой или криптой.',
    ], [
      'Up to five devices on one subscription.',
      'Unlimited regular traffic.',
      'LTE servers for allowlist networks: 50 GB a month, with extra data available to buy.',
      'Russian websites and banking apps work with the VPN enabled, without extra setup.',
      'Manual country selection or automatic connection, with more than 10 countries.',
      'SBP, bank-card and crypto payments.',
    ]),
    pricing: l([
      '3 дня бесплатно на тест.',
      'Подписка от 158 ₽ в месяц.',
    ], [
      'A three-day free trial.',
      'Subscriptions from RUB 158 a month.',
    ]),
    bestFor: l([
      'Тем, у кого на мобильном интернете белые списки.',
      'Тем, кто не хочет возиться с настройкой маршрутизации: банки и маркетплейсы работают сразу.',
      'Как запасной VPN к основному, чтобы доступ оставался всегда.',
      'Семье или нескольким своим устройствам: до 5 на одну подписку.',
    ], [
      'Mobile connections restricted to allowlisted sites.',
      'Users who do not want to configure routing: banking apps and marketplaces work out of the box.',
      'A backup to your main VPN so you retain access.',
      'Families or several personal devices: up to five on one subscription.',
    ]),
    considerations: l([
      'На белые списки отдельный лимит 50 ГБ, обычный трафик он не трогает. Если гигов не хватает, их можно докупить.',
      'Работа LTE-серверов зависит от оператора, поэтому пробуйте несколько вариантов из списка.',
      'Серверы с пометкой HY2 / Hysteria2 пока тестовые.',
    ], [
      'The 50 GB allowlist allowance is separate from regular traffic. You can buy more if needed.',
      'LTE compatibility depends on your mobile carrier, so try several options in the list.',
      'Servers marked HY2 / Hysteria2 are still experimental.',
    ]),
    gettingStarted: l([
      'Заходите в бота по ссылке и берёте 3 дня бесплатно.',
      'Вставляете ключ в Happ или INCY.',
      'Проверяете обычные серверы на вайфае, а LTE на мобильном интернете, и только потом оплачиваете.',
    ], [
      'Open the bot through the link and claim the three-day trial.',
      'Import the key into Happ or INCY.',
      'Test regular servers on Wi-Fi and LTE servers on mobile data before paying.',
    ]),
    verdict: l('Отличный запасной VPN, а для многих и основной: белые списки, 5 устройств и российские сервисы без отключения VPN. Если у вас на улице не грузит ничего, начните тест именно с него.', 'An excellent backup, and a potential main VPN: allowlist support, five devices and Russian services without disconnecting. If nothing loads on mobile data outside, start by testing this one.'),
    links: [
      { href: '/guides/vpn-ne-rabotaet-na-4g', label: l('Почему VPN не работает на 4G и у каких VPN есть белые списки', 'Why VPN fails on 4G and which VPNs support allowlists') },
      { href: '/proxy-vpn/ppl-vpn', label: l('Мой основной VPN', 'My main VPN') },
      { href: '/proxy-vpn', label: l('Все VPN с ценами и пробниками', 'All VPNs with prices and trials') },
    ],
  },
  'vpn-all': {
    description: l('ALL VPN прикольная штука: больше 50 разных VPN-сервисов в одной подписке. Один отвалился, переключились на другой прямо внутри Happ, и всё.\n\nНе нужно каждый раз искать, тестить и оплачивать новый VPN, когда старый перестал подключаться.', 'ALL VPN is an interesting setup: more than 50 different VPN services in one subscription. If one stops connecting, switch to another inside Happ and carry on.\n\nYou do not need to find, test and pay for a new VPN every time the previous one goes down.'),
    capabilities: l([
      '50+ VPN и 20+ стран в одной подписке.',
      'Переключение между VPN прямо в Happ или другом совместимом приложении.',
      'Обход белых списков: 50 ГБ в месяц.',
      'От 5 до 50 устройств и от 500 ГБ до безлимита трафика в зависимости от тарифа.',
      'Оплата по СБП, картой, звёздами Telegram или через CryptoBot.',
    ], [
      'More than 50 VPN services and 20 countries in one subscription.',
      'Switch between VPNs inside Happ or another compatible client.',
      'Allowlist bypass with 50 GB a month.',
      'Five to 50 devices and 500 GB to unlimited traffic, depending on the plan.',
      'Pay by SBP, bank card, Telegram Stars or CryptoBot.',
    ]),
    pricing: l([
      '3 часа бесплатно, чтобы проверить на своём интернете.',
      'Подписка от 199 ₽ в месяц.',
      'Есть тариф «Навсегда». Акции и его цена меняются, итог смотрите в боте.',
    ], [
      'Three free hours to test on your own connection.',
      'Subscriptions from RUB 199 a month.',
      'A lifetime plan is available. Promotions and its price change, so check the bot before paying.',
    ]),
    bestFor: l([
      'Тем, кто устал покупать новый VPN каждый раз, когда старый перестаёт работать.',
      'Одной подпиской на телефон, компьютер и устройства близких.',
      'Мобильному интернету с белыми списками.',
    ], [
      'Users tired of buying a new VPN whenever the previous one stops working.',
      'One subscription for your phone, computer and family devices.',
      'Mobile connections restricted by allowlists.',
    ]),
    considerations: l([
      'Это набор разных VPN внутри одной подписки, а не своё отдельное приложение. Подключаетесь через Happ или похожее приложение.',
      '3 часа на тест мало, поэтому проверяйте сразу и на вайфае, и на мобильном интернете.',
      'Количество устройств и лимит трафика зависят от тарифа, смотрите их до оплаты.',
    ], [
      'This is a bundle of VPN services, not a standalone app. Connect through Happ or a similar client.',
      'Three hours is a short trial, so test both Wi-Fi and mobile data immediately.',
      'Device and traffic limits depend on the plan; check them before paying.',
    ]),
    gettingStarted: l([
      'Заходите в бота по ссылке и берёте 3 часа бесплатно.',
      'Вставляете подписку в Happ и видите список разных VPN.',
      'Пробуете несколько на вайфае и на 4G и, если всё ок, оплачиваете.',
    ], [
      'Open the bot through the link and claim three free hours.',
      'Import the subscription into Happ to see the different VPN options.',
      'Try several on Wi-Fi and 4G, then pay if they work for you.',
    ]),
    verdict: l('Хороший вариант, если не хотите зависеть от одного VPN: отвалился один, переключились на другой внутри той же подписки. Особенно удобно, когда подключаете сразу несколько устройств.', 'A useful choice if you do not want to depend on one VPN: when one fails, switch to another within the same subscription. Especially convenient for connecting several devices.'),
    links: [
      { href: '/guides/vpn-ne-rabotaet-na-4g', label: l('Почему VPN не работает на 4G и что делать', 'Why VPN does not work on 4G and what to do') },
      { href: '/guides/happ-marshrutizaciya', label: l('Фишки Happ: маршрутизация, чтобы банки работали с VPN', 'Happ routing tips: keep banking apps working with VPN enabled') },
      { href: '/proxy-vpn', label: l('Все VPN с ценами и пробниками', 'All VPNs with prices and trials') },
    ],
  },
  'vpn-tochka-g': {
    description: l('Точка G это VPN в Telegram-боте, и у них есть фишка, которая выручает в самой тупой ситуации.\n\nVPN закончился, Telegram не грузит, а купить новый можно только в боте в том же Telegram. У Точки G есть ссылка, которая бесплатно оживляет Telegram минут на 40: зашли в бота, оплатили конфиг, и всё.\n\nПлюс новая подписка G, где страну можно переключать самому, без возни с новыми конфигами.', 'Tochka G is a VPN sold through a Telegram bot, with a feature that helps in a particularly frustrating situation.\n\nYour VPN has expired, Telegram will not load, and the only place to buy another is a bot inside Telegram. Tochka G has a link that restores Telegram access for around 40 minutes, giving you time to open the bot and pay for a config.\n\nThere is also the new G subscription, which lets you change countries without repeatedly importing new configs.'),
    capabilities: l([
      'Подписка G: работает с Telegram и нейросетями, страну переключаете сами.',
      'Тариф G Premium под белые списки на мобильном интернете.',
      'Бесплатный временный прокси для Telegram на 40 минут, чтобы зайти в бота и оплатить.',
      'Сайт, который выдаёт временную ссылку для Happ.',
      'Если конфиг перестал работать, его меняют через бота или поддержку. За серьёзные сбои компенсируют днями.',
      'Оплата по СБП или криптой.',
    ], [
      'The G subscription works with Telegram and AI tools and lets you select the country yourself.',
      'G Premium for allowlist restrictions on mobile data.',
      'A free temporary Telegram proxy for 40 minutes, so you can reach the bot and pay.',
      'A website that supplies a temporary Happ link.',
      'Replace failed configs through the bot or support. Serious outages are compensated with extra subscription days.',
      'SBP or crypto payments.',
    ]),
    pricing: l([
      '2 дня бесплатно на тест.',
      'Подписка от 179 ₽ в месяц.',
      'Стандарт для обычного использования и Telegram, G Premium для белых списков.',
    ], [
      'A two-day free trial.',
      'Subscriptions from RUB 179 a month.',
      'Standard for everyday use and Telegram; G Premium for allowlist networks.',
    ]),
    bestFor: l([
      'Тем, у кого не грузит Telegram, а VPN нужно купить прямо сейчас.',
      'Мобильному интернету с белыми списками: берите G Premium.',
      'Тем, кому проще написать в поддержку, чем самому разбираться с конфигами.',
    ], [
      'Buying a VPN immediately when Telegram will not load.',
      'Mobile connections with allowlists: choose G Premium.',
      'Users who would rather contact support than troubleshoot configs themselves.',
    ]),
    considerations: l([
      'После того как поставили нормальный конфиг, временный прокси из Telegram лучше удалить: Настройки, Данные и память, Прокси. Он временный, и потом Telegram просто перестанет работать.',
      'Белые списки есть только на тарифе G Premium, на стандартном их нет.',
      'Если всё работает, конфиг без причины не меняйте.',
    ], [
      'After installing a working VPN config, remove the temporary Telegram proxy under Settings, Data and Storage, Proxy. It is temporary, and Telegram will stop connecting through it later.',
      'Allowlist support is only included in G Premium, not Standard.',
      'Do not replace a working config without a reason.',
    ]),
    gettingStarted: l([
      'Если Telegram не грузит, переходите по бесплатной ссылке на 40 минут: она есть на этой странице в блоке «Если не работает Telegram».',
      'Заходите в бота, берёте 2 дня бесплатно и вставляете подписку в Happ.',
      'Проверяете на вайфае и на 4G, выбираете Стандарт или G Premium и оплачиваете.',
    ], [
      'If Telegram will not load, use the free 40-minute link in the "If Telegram does not work" block on this page.',
      'Open the bot, claim the two-day trial and import the subscription into Happ.',
      'Test on Wi-Fi and 4G, choose Standard or G Premium, and pay.',
    ]),
    verdict: l('Полезен уже из-за одной ссылки на 40 минут: это способ купить VPN, когда не работает вообще ничего. А если у вас на улице белые списки, смотрите тариф G Premium.', 'The 40-minute link alone makes this useful: it gives you a way to buy a VPN when nothing else works. If your mobile connection uses allowlists, look at G Premium.'),
    links: [
      { href: '/guides/vpn-ne-rabotaet-na-4g', label: l('Что делать, если не работает вообще ничего', 'What to do when nothing will connect') },
      { href: '/proxy-vpn/ppl-vpn', label: l('VPN, который можно купить на сайте без Telegram', 'A VPN you can buy on a website without Telegram') },
      { href: '/proxy-vpn', label: l('Все VPN с ценами и пробниками', 'All VPNs with prices and trials') },
    ],
  },
  'bot-lachuga': {
    description: l('Несмотря на нейминг автора, Лачуга оказалась очень даже рабочей лошадкой.\n\nЭто Telegram-магазин с дешёвыми подписками и аккаунтами: Gemini, ChatGPT, Claude, CapCut, Canva и другие сервисы. Покупка идёт прямо через бота, а на часть товаров дают гарантию.\n\nЯ брал тут и Gemini, и Claude, всё работает.', 'Despite the creator\'s naming choice, Lachuga has proved useful for me.\n\nIt is a Telegram shop for discounted Gemini, ChatGPT, Claude, CapCut, Canva and other subscriptions and accounts. You buy inside the bot, and some products include a warranty.\n\nI have bought both Gemini and Claude here, and they work.'),
    capabilities: l([
      'Подписки на нейросети: Gemini, ChatGPT, Claude и другие.',
      'CapCut, Canva и похожие сервисы для контента.',
      'Часть подписок встаёт на ваш собственный аккаунт по коду активации.',
      'Оплата криптой, по СБП или российской картой прямо в боте.',
      'Часто бывают акции.',
    ], [
      'Gemini, ChatGPT, Claude and other AI subscriptions.',
      'CapCut, Canva and similar content tools.',
      'Some subscriptions activate on your own account with a code.',
      'Crypto, SBP and Russian-card payments inside the bot.',
      'Frequent promotions.',
    ]),
    pricing: l([
      'Я взял себе и друзьям 4 аккаунта Gemini на 18 месяцев примерно за 5$, а официально один месяц стоит 20$. Внутри чат, Nano Banana Pro, Veo 3 и все другие ИИ-продукты Google.',
      'Claude Pro на месяц брал примерно за 2500 ₽, когда надоело биться с верификацией при оплате.',
      'Цены часто меняются, актуальные смотрите в боте.',
    ], [
      'I bought four 18-month Gemini accounts for myself and friends for about $5, compared with an official price of $20 for one month. That included chat, Nano Banana Pro, Veo 3 and Google\'s other AI tools.',
      'I paid roughly RUB 2,500 for a month of Claude Pro after getting tired of verification problems at checkout.',
      'Prices change often; check the bot for current offers.',
    ]),
    bestFor: l([
      'Тем, кому нужны Gemini, ChatGPT или Claude дешевле официальной цены.',
      'Тем, у кого не проходит оплата российской картой, а заводить зарубежную ради одной подписки не хочется.',
      'Монтажу и дизайну: CapCut и Canva.',
    ], [
      'Gemini, ChatGPT or Claude below the official subscription price.',
      'Users whose Russian card is rejected and who do not want a foreign card just for one subscription.',
      'Editing and design work with CapCut and Canva.',
    ]),
    considerations: l([
      'Гарантия зависит от товара. На Gemini мне дали гарантию на месяц.',
      'Основной аккаунт с важными файлами и перепиской я бы туда не привязывал.',
      'Перед покупкой читайте правила замены и сроки гарантии в описании.',
    ], [
      'Warranty terms depend on the product. My Gemini purchase had one month of coverage.',
      'I would not link a main account containing important files or conversations.',
      'Read the replacement rules and warranty period in the listing before buying.',
    ]),
    gettingStarted: l([
      'Заходите в бота по ссылке и пополняете баланс.',
      'Выбираете подписку в каталоге и читаете описание: срок, гарантию и как её активировать.',
      'Оплачиваете и получаете аккаунт или код с ссылкой, куда его ввести.',
    ], [
      'Open the bot through the link and fund your balance.',
      'Choose a subscription and read the duration, warranty and activation instructions.',
      'Pay and receive an account, or a code with a link explaining where to redeem it.',
    ]),
    verdict: l('Один из моих основных ботов для подписок на нейросети. Gemini на полтора года за копейки и Claude Pro без возни с оплатой. Главное читать описание товара и не ставить подписку на аккаунт, который жалко потерять.', 'One of my main bots for AI subscriptions: inexpensive 18-month Gemini accounts and Claude Pro without payment hassles. Read the listing carefully, and avoid using an account you cannot afford to lose.'),
    links: [
      { href: '/guides/deshevye-podpiski-chatgpt-claude-gemini', label: l('Сравнил Лачугу, Crassus, Апельсин и Петровича по ценам', 'Comparing Lachuga, Crassus, Apel0sin and Petrovich prices') },
      { href: '/guides/claude-iz-rossii-bez-bana', label: l('Как зарегистрироваться в Claude из России и не словить бан', 'Registering for Claude from Russia and avoiding a ban') },
      { href: '/foreign-cards/zarub', label: l('Если нужна своя зарубежная карта для подписок', 'If you need your own foreign card for subscriptions') },
    ],
  },
  'ant-shardx': {
    description: l('ShardX это полностью бесплатный антидетект от одноимённого прокси-сервиса ShardX, раньше он назывался ProxyShard.\n\nБез лимита профилей, без подписок и даже без регистрации: скачали с GitHub и работаете. Профили хранятся локально на вашем компьютере, можно создавать хоть сотню и настраивать каждый отдельно.\n\nСразу скажу: с разработчиками я лично не знаком, и денег за рекламу мне никто не платил.', 'ShardX is a completely free antidetect browser from the proxy service of the same name, formerly ProxyShard.\n\nThere are no profile limits, subscriptions or even registration: download it from GitHub and get started. Profiles stay on your computer, and you can create hundreds with individual settings.\n\nTo be clear, I do not know the developers personally and nobody paid me to promote it.'),
    capabilities: l([
      'Любое количество локальных профилей бесплатно, на Windows, Mac и Linux.',
      'Около 170 готовых отпечатков, Auto noise, язык и часовой пояс подстраиваются под прокси автоматически.',
      'HTTP и SOCKS5 прокси. С UDP-прокси умеет пускать через прокси WebRTC и QUIC, а не просто отключать их.',
      'Локальный API и MCP: можно управлять профилями через нейросеть или скрипты, работает с Playwright и Puppeteer.',
      'Проверял на Pixelscan, BrowserLeaks и Fingerprint: утечек нет.',
    ], [
      'Unlimited free local profiles on Windows, Mac and Linux.',
      'Around 170 prepared fingerprints, Auto noise, and automatic language and time-zone settings based on the proxy.',
      'HTTP and SOCKS5 proxies. With a UDP-capable proxy, it can route WebRTC and QUIC through the proxy rather than simply disable them.',
      'A local API and MCP for controlling profiles through AI or scripts, with Playwright and Puppeteer support.',
      'I tested it on Pixelscan, BrowserLeaks and Fingerprint and found no leaks.',
    ]),
    pricing: l([
      'Полностью бесплатно, платных тарифов нет вообще.',
      'Платить придётся только за прокси, если они нужны.',
    ], [
      'Completely free, with no paid plans.',
      'You only pay for proxies if you need them.',
    ]),
    bestFor: l([
      'Соло-работе, когда профилей нужно больше, чем дают бесплатные тарифы Dolphin, AdsPower или GoLogin.',
      'YouTube-фермам, Gmail, Discord, X и обычному мультиаккаунтингу.',
      'Автоматизации: я через Codex от ChatGPT и MCP прошу нейронку создать профили, подключить прокси и открыть Pixelscan, и она делает всё сама.',
      'Тем, кому нужен браузер со своим айпи на компе вместо VPN.',
    ], [
      'Solo work needing more profiles than the free Dolphin, AdsPower or GoLogin plans allow.',
      'YouTube accounts, Gmail, Discord, X and routine multi-account work.',
      'Automation: I use ChatGPT\'s Codex with MCP to create profiles, attach proxies and open Pixelscan for me.',
      'A desktop browser with its own IP instead of a VPN.',
    ]),
    considerations: l([
      'Профили занимают место на диске: 100 профилей спокойно съедают 20-50 ГБ.',
      'Программа без подписи Windows, поэтому при запуске выскакивает SmartScreen, а на VirusTotal был один детект от ноунейм-антивируса. Качайте только с официального GitHub.',
      'Профили лежат на одном компьютере. Для команды и синхронизации между устройствами удобнее платные антики с облаком.',
      'Свои основные аккаунты через MCP не автоматизируйте: тот же Discord не любит автоматизацию и банит даже аккаунты с хорошей историей.',
    ], [
      'Profiles use disk space: 100 profiles can easily take 20-50 GB.',
      'The Windows app is unsigned and triggers SmartScreen. VirusTotal showed one detection from a little-known antivirus. Download only from the official GitHub.',
      'Profiles stay on one computer. Paid browsers with cloud storage are more convenient for teams and syncing across devices.',
      'Do not automate important personal accounts through MCP. Discord, for example, can ban even established accounts for automation.',
    ]),
    gettingStarted: l([
      'Скачиваете ShardX по ссылке с GitHub под свою систему.',
      'Создаёте профиль и вставляете прокси, лучше SOCKS5 с UDP.',
      'Проверяете профиль на Pixelscan и только потом создаёте остальные.',
    ], [
      'Download ShardX for your operating system from GitHub using the link.',
      'Create a profile and add a proxy, preferably SOCKS5 with UDP.',
      'Test the profile on Pixelscan before creating the rest.',
    ]),
    verdict: l('Лучший бесплатный антидетект, который я пробовал: профили без лимита, нормальные отпечатки и даже MCP. Если вы работаете один и вам мало 2-5 бесплатных профилей у других, начните с него, а платить за антик есть смысл уже под команду и облако.', 'The best free antidetect browser I have tried: unlimited profiles, usable fingerprints and even MCP. If you work alone and need more than the 2-5 free profiles offered elsewhere, start here. Paying makes more sense when you need team features and cloud storage.'),
    setupGuide: { href: '/guides/shardx-obzor', label: l('Подробный обзор ShardX с проверкой на утечки', 'Detailed ShardX review with leak checks') },
    links: [
      { href: '/proxy-vpn/proxyshard', label: l('Прокси от этой же команды, SOCKS5 с UDP', 'Proxies from the same team: SOCKS5 with UDP') },
      { href: '/guides/besplatnye-antidetekt-brauzery', label: l('Все бесплатные антидетекты и сколько профилей дают', 'Free antidetect browsers and their profile limits') },
      { href: '/guides/youtube-ferma', label: l('Как собрать YouTube-ферму на антидетекте и прокси', 'Setting up YouTube accounts with an antidetect browser and proxies') },
    ],
  },
  p4: {
    description: l('Proxy-Seller один из сервисов, где я беру прокси уже не первый год. Здесь есть всё: от простых датацентровых IPv4 до резидентских и мобильных, и больше 220 стран.\n\nПоэтому, когда нужна редкая страна или прокси посерьёзнее, я обычно иду сюда. Особенно понравились их резидентские.', 'Proxy-Seller has been one of my proxy providers for years. It covers everything from basic datacenter IPv4 to residential and mobile proxies in over 220 countries.\n\nI usually go here for a less common location or a more demanding task. I have particularly liked its residential proxies.'),
    capabilities: l([
      'IPv4, IPv6, ISP, Residential и Mobile в одном кабинете.',
      '220+ стран, можно найти почти любое гео.',
      'HTTP и SOCKS5.',
      'Оплата картой Visa/Mastercard, криптой или PayPal.',
    ], [
      'IPv4, IPv6, ISP, Residential and Mobile in one dashboard.',
      '220+ countries, including less common locations.',
      'HTTP and SOCKS5.',
      'Visa/Mastercard, crypto and PayPal payments.',
    ]),
    pricing: l([
      'IPv4 примерно от 1$ за штуку в месяц, ISP от 2$, резидентские от 3$ за гигабайт.',
      'Промокод hopscup на скидку 10%.',
    ], [
      'IPv4 starts at roughly $1 per IP per month, ISP at $2 and residential traffic at $3 per GB.',
      'Use hopscup for a 10% discount.',
    ]),
    bestFor: l([
      'YouTube-фермам и обычной работе с аккаунтами: Discord, X, Google на простых IPv4.',
      'Claude и другим сервисам, где нужен «домашний» айпи: тут берите ISP.',
      'Задачам, где обычный серверный айпи уже не проходит: соцсети, реклама, крипта. Тогда смотрите резидентские или мобильные.',
    ], [
      'YouTube accounts and routine Discord, X and Google work with basic IPv4.',
      'Claude and services that need a home-style IP: choose ISP.',
      'Social media, advertising and crypto tasks that reject server IPs: consider residential or mobile proxies.',
    ]),
    considerations: l([
      'Каталог большой, поэтому смотрите внимательно, что покупаете: отдельный айпи на месяц или резидентские с оплатой за трафик.',
      'IPv6 берите, только если точно знаете, что нужный сайт или программа его поддерживает. Иначе просто не заработает.',
      'Для простых задач не нужно сразу брать резидентские или мобильные. Хорошего IPv4 или ISP часто хватает.',
    ], [
      'Check whether you are buying a dedicated IP for a month or residential traffic billed by usage.',
      'Only buy IPv6 if your target website or application supports it.',
      'Basic tasks rarely need residential or mobile proxies from the start. A good IPv4 or ISP proxy is often enough.',
    ]),
    gettingStarted: l([
      'Регистрируетесь по ссылке и выбираете тип прокси и страну.',
      'Берёте пару штук на тест с промокодом hopscup.',
      'Вставляете прокси в профиль антидетекта, ставите порт SOCKS5 и проверяете айпи на чекере.',
    ], [
      'Register through the link and choose a proxy type and country.',
      'Buy a couple of proxies to test with the hopscup code.',
      'Add them to your antidetect profile, select the SOCKS5 port and check the IP.',
    ]),
    verdict: l('Один из самых качественных прокси-сервисов, которые я знаю. Беру его, когда важна стабильная работа и качество айпи, а огромный выбор стран и типов тут идёт приятным бонусом.', 'One of the better proxy services I have used. I choose it when stable connections and IP quality matter, with a large range of locations and types as a bonus.'),
    links: [
      { href: '/proxy-vpn/luchshie-proksi', label: l('Какие прокси выбрать под задачу, разобрал отдельно', 'Choosing the right proxy type for your task') },
      { href: '/proxy-vpn/luchshie-mobilnye-proksi', label: l('Чем мобильные прокси отличаются от других', 'How mobile proxies differ from other types') },
      { href: '/guides/claude-iz-rossii-bez-bana', label: l('Прокси для Claude', 'Proxies for Claude') },
    ],
  },
  p1: {
    description: l('ShardX, бывший ProxyShard: сервис недавно переименовали, и теперь прокси называются так же, как их бесплатный антидетект.\n\nБеру у них датацентровые IPv4 под YouTube наравне с ProxyWing и Proxy-Seller, а ISP под Claude. Главная фишка: SOCKS5 с поддержкой UDP на всех типах прокси, а не только на дорогих.', 'ShardX, formerly ProxyShard, was recently renamed: its proxies now share a name with the team\'s free antidetect browser.\n\nI buy its datacenter IPv4 for YouTube alongside ProxyWing and Proxy-Seller, and ISP proxies for Claude. Its standout feature is SOCKS5 with UDP on every proxy type, not just the expensive ones.'),
    capabilities: l([
      'IPv4, ISP, Residential и Mobile в одном кабинете.',
      '100+ стран.',
      'SOCKS5 с UDP на всех типах. Это нужно, например, для звонков, игр и приложений, которые ходят не только через браузер.',
      'Оплата криптой или зарубежной картой.',
    ], [
      'IPv4, ISP, Residential and Mobile in one dashboard.',
      '100+ countries.',
      'SOCKS5 with UDP on every type, useful for calls, games and applications beyond the browser.',
      'Crypto or foreign-card payments.',
    ]),
    pricing: l([
      'Пополнение от 5$, так что потестить можно почти бесплатно.',
      'Датацентровые IPv4 в районе 1-2$ за штуку в месяц, ISP немного дороже.',
      'Промокод hopscup.',
    ], [
      'A $5 minimum deposit makes it inexpensive to test.',
      'Datacenter IPv4 costs around $1-2 per IP per month; ISP is a little more.',
      'The hopscup promo code is available.',
    ]),
    bestFor: l([
      'YouTube-фермам и аккаунтам по схеме 1 аккаунт = 1 прокси = 1 профиль антидетекта.',
      'Claude и другим нейросетям, где нужен чистый айпи: берите ISP.',
      'Тем, кто уже сидит на антидетекте ShardX и хочет прокси от той же команды.',
      'Задачам, где нужен UDP: с обычными HTTP-прокси такое не заработает.',
    ], [
      'YouTube and account work using one account, one proxy and one antidetect profile.',
      'Claude and other AI services that need a clean IP: start with ISP.',
      'ShardX antidetect users who want proxies from the same team.',
      'Tasks that need UDP, which regular HTTP proxies cannot handle.',
    ]),
    considerations: l([
      'Российской картой тут не оплатить. Нужна крипта или зарубежная карта, я для таких сервисов использую Zarub.',
      'Начинайте с IPv4 или ISP: они дешевле и для большинства задач подходят без проблем. Резидентские и мобильные берите, если площадка плохо принимает серверный айпи.',
      'Перед оплатой проверьте страну и тип прокси, чтобы случайно не взять не тот тариф.',
    ], [
      'Russian cards are not accepted. You need crypto or a foreign card; I use Zarub for services like this.',
      'Start with IPv4 or ISP. They cost less and suit most tasks. Consider residential or mobile if the platform rejects server IPs.',
      'Double-check the country and proxy type before paying.',
    ]),
    gettingStarted: l([
      'Регистрируетесь по ссылке и пополняете баланс от 5$ криптой или зарубежной картой.',
      'Берёте пару IPv4 или ISP нужной страны с промокодом hopscup.',
      'Вставляете прокси в профиль антидетекта, ставите порт SOCKS5 и проверяете айпи на чекере.',
    ], [
      'Register through the link and deposit at least $5 using crypto or a foreign card.',
      'Buy a couple of IPv4 or ISP proxies in your chosen country with hopscup.',
      'Add them to your antidetect profile, select the SOCKS5 port and check the IP.',
    ]),
    verdict: l('Хороший баланс цены, скорости и качества, плюс UDP на всех типах. Если у вас есть крипта или зарубежная карта, это один из лучших вариантов для старта: закинули 5$ и проверили сами.', 'A good balance of price, speed and IP quality, with UDP on every type. If you have crypto or a foreign card, a $5 test makes it an accessible starting point.'),
    links: [
      { href: '/antidetect/shardx', label: l('Бесплатный антидетект ShardX от этой же команды', 'Free ShardX antidetect browser from the same team') },
      { href: '/foreign-cards/zarub', label: l('Zarub: карта, которой я плачу за такие сервисы', 'Zarub: the card I use to pay for services like this') },
      { href: '/guides/claude-iz-rossii-bez-bana', label: l('Прокси для Claude', 'Proxies for Claude') },
      { href: '/proxy-vpn/luchshie-proksi', label: l('Какие прокси выбрать под задачу', 'Choosing proxies for your task') },
    ],
  },
  zarub: {
    description: l('Сам сейчас пользуюсь картой Zarub, она прекрасно оплачивает все мои подписки.\n\nЭто зарубежная Visa (США), которая выпускается прямо в Telegram без KYC: без паспорта и селфи. Пополняете через СБП рублями или в USDT и сразу платите там, где российские карты не принимают.', 'Zarub is the card I currently use for my subscriptions.\n\nIt is a US Visa issued inside Telegram without a passport or selfie. Fund it with rubles through SBP or with USDT, then pay at services that do not accept Russian cards.'),
    capabilities: l([
      'Виртуальная Visa без верификации.',
      'Пополнение через СБП или USDT. Крипту лишний раз не надо выводить на свои основные карты.',
      'Проходит в ChatGPT, Claude, Gemini, Higgsfield, Netflix, Spotify, Google Play и App Store.',
      'Booking, Airbnb, Amazon и обычные покупки за границей.',
      'Иногда проходит даже в российских магазинах, например на OZON.',
    ], [
      'A virtual Visa without identity verification.',
      'SBP or USDT funding, without first cashing crypto out to your main bank card.',
      'Works with ChatGPT, Claude, Gemini, Higgsfield, Netflix, Spotify, Google Play and the App Store.',
      'Booking, Airbnb, Amazon and everyday purchases abroad.',
      'It sometimes even works at Russian stores such as OZON.',
    ]),
    pricing: l([
      'Выпуск 14$ по промокоду HOPS, без промокода 19$.',
      'Обслуживание бесплатное.',
      'Комиссии за пополнение и операции смотрите в плитке выше, перед пополнением считайте итоговую сумму.',
    ], [
      'Issuance is $14 with HOPS, or $19 without the code.',
      'No maintenance fee.',
      'See the facts above for top-up and transaction fees, and calculate the total before funding.',
    ]),
    bestFor: l([
      'Подписки на нейросети: ChatGPT, Claude, Gemini. Higgsfield, который не берёт российские карты, я оплачиваю именно Zarub.',
      'Прокси и сервисы, где оплата только зарубежной картой или криптой.',
      'Тем, кто не хочет проходить KYC и отправлять документы.',
    ], [
      'AI subscriptions such as ChatGPT, Claude and Gemini. I also use it for Higgsfield, which does not accept Russian cards.',
      'Proxy providers and services that accept only foreign cards or crypto.',
      'Users who do not want to send identity documents for KYC.',
    ]),
    considerations: l([
      'Выпуск занимает от нескольких минут до суток.',
      'Первую оплату лучше сделать небольшой, чтобы проверить, что сервис карту принимает.',
      'Я не держу на таких картах крупный баланс и пополняю их под конкретные покупки.',
    ], [
      'Issuance can take a few minutes or up to a day.',
      'Start with a small payment to check merchant acceptance.',
      'I keep no large balance on cards like this and fund them for specific purchases.',
    ]),
    gettingStarted: l([
      'Заходите в бота по ссылке и выпускаете карту с промокодом HOPS.',
      'Пополняете через СБП или USDT, минимум от 10$.',
      'Привязываете карту к подписке и проверяете на небольшой сумме.',
    ], [
      'Open the bot through the link and issue a card with HOPS.',
      'Top up at least $10 through SBP or USDT.',
      'Link it to your subscription and test with a small payment.',
    ]),
    verdict: l('Моя основная карта для зарубежных подписок. Без KYC, пополнение рублями или USDT, и проходит почти везде, где мне нужно.', 'My main card for foreign subscriptions. No KYC, RUB or USDT funding, and it works with almost every service I need.'),
    links: [
      { href: '/guides/zarubezhnaya-karta-s-popolneniem-rublyami', label: l('Сравнил Zarub, PGON и ВездеКарту по комиссиям и пополнению', 'Comparing Zarub, PGON and Vezdekarta fees and funding') },
      { href: '/ai/higgsfield', label: l('Higgsfield: оплачиваю его этой картой', 'Higgsfield: I pay for it with this card') },
      { href: '/guides/deshevye-podpiski-chatgpt-claude-gemini', label: l('Если карта нужна ради одной подписки, есть вариант дешевле', 'A cheaper option if you only need one subscription') },
    ],
  },
  pgon: {
    description: l('PGON, или пижон, как я его называю, это кошелёк прямо в Telegram. В нём есть криптобаланс, рубли, оплата по QR и зарубежная Visa.\n\nТо есть это не просто карта под одну подписку, а несколько полезных функций в одном месте.\n\nМне он удобен тем, что я пользуюсь криптой: не нужно сначала выводить USDT в рубли, а потом снова менять рубли на доллары ради подписки.', 'PGON is a wallet inside Telegram with crypto, rubles, QR payments and a foreign Visa.\n\nRather than just a card for one subscription, it combines several payment tools.\n\nSince I use crypto, I can pay without cashing USDT out to rubles and converting it back to dollars for a subscription.'),
    capabilities: l([
      'Виртуальная Visa: номер, срок и CVV, поддерживает Apple Pay и Google Pay.',
      'Оплата криптой по QR СБП в России: сканируете QR на кассе, сервис сам меняет крипту на рубли.',
      'Оплата по местным QR за границей: Таиланд, Вьетнам, Индонезия и другие страны, прямо с баланса USDT, TON или SOL.',
      'Пополнение криптой или рублями через СБП.',
    ], [
      'A virtual Visa with a number, expiry date and CVV, plus Apple Pay and Google Pay support.',
      'Crypto payments through SBP QR codes in Russia, with conversion to rubles handled by the service.',
      'Local QR payments in Thailand, Vietnam, Indonesia and other countries directly from USDT, TON or SOL.',
      'Crypto funding or RUB top-ups through SBP.',
    ]),
    pricing: l([
      'Выпуск Visa около 8$, обслуживание бесплатное.',
      'Пополнение криптой без комиссии сервиса, платите только комиссию сети. Перевод с кошелька на карту у меня стоил 1,6%.',
      'Рубли через СБП: 5% без полного KYC, с KYC дешевле.',
      'Оплата по QR в России: 5% с KYC и 15% без KYC.',
    ], [
      'Visa issuance costs around $8, with no maintenance fee.',
      'Crypto deposits have no service fee, only the network fee. Moving funds from the wallet to my card cost 1.6%.',
      'RUB top-ups through SBP cost 5% without full KYC and less with KYC.',
      'QR payments in Russia cost 5% with KYC or 15% without.',
    ]),
    bestFor: l([
      'Тем, у кого уже есть крипта или доход в USDT.',
      'Подпискам: я для теста выпустил карту и сразу оплатил месяц ChatGPT.',
      'Поездкам за границу: платите по QR без наличных и поиска обменников.',
    ], [
      'Users who already hold crypto or receive USDT.',
      'Subscriptions: I issued a card and immediately tested it with a month of ChatGPT.',
      'Travel abroad: pay by QR without cash or looking for an exchange service.',
    ]),
    considerations: l([
      'Начать можно без паспорта и селфи, но при моём оформлении лимит был около 500$ в месяц. Для пары подписок этого с головой, для большего нужен KYC.',
      'Для рублей по СБП нужны только ФИО и номер телефона, привязанные к банку, с которого пополняете. Фото документов не нужно.',
      'Без KYC оплата по QR в России дорогая, поэтому сначала сравните итоговую сумму в боте.',
      'Курс, комиссии и лимиты меняются, смотрите итог перед подтверждением.',
    ], [
      'You can start without a passport or selfie. My initial limit was about $500 per month, enough for a couple of subscriptions; higher usage needs KYC.',
      'SBP funding requires only the name and phone number linked to the bank account you pay from, not document photos.',
      'QR payments in Russia are expensive without KYC, so compare the final amount in the bot first.',
      'Rates, fees and limits change. Check the total before confirming.',
    ]),
    gettingStarted: l([
      'Заходите в бота по ссылке и пополняете баланс криптой или через СБП.',
      'Выпускаете виртуальную Visa.',
      'Оплачиваете подписку или платите по QR прямо с баланса.',
    ], [
      'Open the bot through the link and fund the wallet with crypto or SBP.',
      'Issue a virtual Visa.',
      'Pay a subscription or scan a QR code to pay from the wallet.',
    ]),
    verdict: l('Если у вас уже есть крипта, PGON удобнее обычной зарубежной карты: в одном кошельке и Visa для подписок, и оплата по QR в России и за границей. Если нужна просто карта под подписки с пополнением рублями, посмотрите ещё Zarub.', 'If you already use crypto, PGON offers more than a regular foreign card: Visa subscriptions and QR payments in Russia and abroad in one wallet. For a card mainly funded in rubles for subscriptions, also consider Zarub.'),
    links: [
      { href: '/guides/zarubezhnaya-karta-s-popolneniem-rublyami', label: l('Сравнил PGON, Zarub и ВездеКарту по комиссиям', 'Comparing PGON, Zarub and Vezdekarta fees') },
      { href: '/crypto-exchange/qr-sbp', label: l('Где ещё можно платить криптой по QR', 'Other ways to pay with crypto by QR') },
      { href: '/foreign-cards/zarub', label: l('Zarub: если нужна просто карта под подписки', 'Zarub: if you just need a card for subscriptions') },
    ],
  },
  'st-dark': {
    description: l('DarkShopping это магазин аккаунтов, которым я пользуюсь уже давно. Вместе с FunPay он закрывает примерно 95% моих потребностей.\n\nСюда я иду за рабочими аккаунтами, почтами и расходниками: Gmail, Outlook, Telegram, Discord, Facebook, Instagram и другие позиции под регистрацию, фарм и обычную работу.', 'DarkShopping is one of my regular sources for work accounts and email inboxes. Together with FunPay, it covers about 95% of what I buy.\n\nI use it for Gmail, Outlook, Telegram, Discord, Facebook and Instagram accounts for registrations and day-to-day work.'),
    capabilities: l([
      'Почты: Gmail, Outlook, iCloud, firstmail и другие, в том числе пачками.',
      'Аккаунты соцсетей и мессенджеров: Telegram, Discord, Facebook, Instagram, X и другие.',
      'Свежереги, аккаунты с возрастом и фарм-аккаунты.',
      'У каждого товара видно продавца, отзывы и количество продаж.',
    ], [
      'Gmail, Outlook, iCloud, firstmail and other email accounts, including bulk orders.',
      'Telegram, Discord, Facebook, Instagram, X and other social accounts.',
      'New, aged and pre-established accounts.',
      'Seller details, reviews and sales counts on each listing.',
    ]),
    pricing: l([
      'Цены ставят продавцы, разброс большой. Например, Discord-аккаунт я брал за 35 ₽, и он оказался старше года.',
      'Самые дешёвые позиции чаще живут меньше: Discord дешевле 15-20 ₽ у меня банили заметно чаще.',
    ], [
      'Prices vary by seller. One Discord account I bought for RUB 35 was over a year old.',
      'The cheapest listings have been less reliable in my experience, especially Discord accounts below RUB 15-20.',
    ]),
    bestFor: l([
      'Почты под регистрацию сервисов и ферм.',
      'Аккаунты Discord, Telegram и соцсетей для работы и фарма.',
      'Расходники, когда нужно много аккаунтов недорого.',
    ], [
      'Email accounts for service registrations and account workflows.',
      'Discord, Telegram and social accounts for work.',
      'Affordable bulk purchases after testing a seller.',
    ]),
    considerations: l([
      'Смотрите отзывы и количество покупок у продавца, а не только цену.',
      'Берите по 3-5-10 штук у разных продавцов: так сразу видно, чьи аккаунты живут дольше.',
      'Сразу после покупки меняйте пароль почты и аккаунта, перепривязывайте почту и включайте 2FA.',
      'Купленный Discord не надо в первый же день добавлять в 2-3 и больше серверов: так его быстро побреют.',
    ], [
      'Compare seller reviews and completed sales, not just the price.',
      'Test batches of 3, 5 or 10 from different sellers before placing a larger order.',
      'Change the account and email passwords, update the linked email and enable 2FA immediately.',
      'Avoid joining several Discord servers on the first day with a purchased account; it can trigger a quick ban.',
    ]),
    gettingStarted: l([
      'Регистрируетесь по ссылке и пополняете баланс.',
      'Выбираете категорию и сортируете продавцов по отзывам.',
      'Берёте пару штук на тест, проверяете вход и только потом покупаете больше.',
    ], [
      'Register through the link and fund your balance.',
      'Choose a category and compare sellers by their reviews.',
      'Buy a small test batch and check access before ordering more.',
    ]),
    verdict: l('Мой основной магазин под рабочие аккаунты и почты. Главное не гнаться за самой низкой ценой и сразу после покупки забирать аккаунт под себя: пароль, почта, 2FA.', 'My main shop for work accounts and email inboxes. Prioritize seller quality over the lowest price, and take control of the password, linked email and 2FA as soon as you buy.'),
    links: [
      { href: '/guides/account-farm', label: l('Что делать с аккаунтами после покупки и как собрать ферму, разобрал отдельно', 'What to do after buying accounts and how to organize them') },
      { href: '/account-shop', label: l('Где ещё покупаю аккаунты', 'Other account shops I use') },
    ],
  },
  p6: {
    description: l('Пользуюсь MobileProxy больше трёх лет, отлично подходят для любых задач, и не только для крипты.\n\nЭто мобильные прокси: айпи настоящих сотовых операторов, к которым у сайтов больше всего доверия. Трафик безлимитный, айпи меняется по кнопке, а гео можно выбрать вплоть до города.', 'I have used MobileProxy for over three years for account work and crypto-related tasks.\n\nIt provides real mobile-carrier IPs, unlimited traffic, one-click IP rotation and locations down to the city.'),
    capabilities: l([
      'Смена айпи по кнопке раз в 10 секунд, смена гео раз в 10 минут, выбор области и города.',
      'Безлимитный трафик на тарифах.',
      '20+ стран, самое дешёвое гео Россия. Из Европы под крипту я обычно беру Польшу.',
      'HTTP и SOCKS5, управление подключением и сменой айпи в личном кабинете.',
      'Бесплатный тест на 3 часа без привязки карты.',
      'Возврат денег за неиспользованное время.',
      'Для бизнеса договор, ЭДО и счета.',
    ], [
      'Rotate the IP every 10 seconds and change location every 10 minutes, with region and city selection.',
      'Unlimited traffic on the plans.',
      '20+ countries. Russia is the cheapest location; Poland is my usual European choice for crypto work.',
      'HTTP and SOCKS5, with connection and rotation controls in the dashboard.',
      'A free three-hour trial with no card required.',
      'Refunds for unused time.',
      'Contracts, electronic document exchange and invoices for business customers.',
    ]),
    pricing: l([
      'Безлимит от 30-50$ в месяц, есть аренда на день, неделю, 3 месяца и год.',
      'Промокод hopscup на скидку 20%.',
      'Пример выгоды: 30 аккаунтов на статике по 1.5$ это 45$ в месяц, а один мобильный за 40-45$ хватит хоть на 1000 аккаунтов, если работать с ними по очереди.',
    ], [
      'Unlimited plans start at $30-50 per month, with daily, weekly, three-month and annual options.',
      'Use hopscup for a 20% discount.',
      'For comparison, 30 static IPs at $1.50 each cost $45 a month. A $40-45 mobile plan can serve even 1,000 profiles if they run one at a time.',
    ]),
    bestFor: l([
      'Фермам аккаунтов, где важно доверие площадки: соцсети, Google, маркетплейсы, крипта.',
      'Тем, кому нужно часто менять айпи и гео.',
      'Задачам, где датацентровые прокси уже не проходят антифрод.',
    ], [
      'Account workflows on social platforms, Google, marketplaces and crypto services where IP reputation matters.',
      'Frequent IP and location changes.',
      'Platforms that reject datacenter proxies.',
    ]),
    considerations: l([
      'Один прокси это один айпи в моменте. Профили работают по очереди, а не все сразу. Главный вопрос при выборе не сколько у вас аккаунтов, а сколько профилей нужно одновременно.',
      'По скорости иногда бывают просадки.',
      'Мобильные прокси не значит только для телефона: это прокси от мобильных операторов, работают где угодно, в том числе в антидетекте на ПК.',
    ], [
      'One proxy provides one IP at a time. Run profiles sequentially; the key sizing question is concurrent profiles, not total accounts.',
      'Speeds can occasionally drop.',
      'Mobile describes the carrier network, not the device. These proxies also work in desktop antidetect browsers.',
    ]),
    gettingStarted: l([
      'Регистрируетесь по ссылке и берёте бесплатный тест на 3 часа.',
      'Выбираете страну и оператора, вставляете прокси в профиль антидетекта и проверяете айпи.',
      'Если всё устраивает, берёте тариф с промокодом hopscup.',
    ], [
      'Register through the link and claim the free three-hour trial.',
      'Choose a country and carrier, add the proxy to your browser profile and check the IP.',
      'If it works for you, choose a plan and apply hopscup.',
    ]),
    verdict: l('Если нужны мобильные прокси надолго, это мой выбор номер один: безлимит, смена айпи по кнопке и честный бесплатный тест. Для пары аккаунтов дешевле статика, а для фермы мобильные выходят выгоднее.', 'My first choice for long-term mobile proxies: unlimited traffic, easy IP rotation and a genuine free trial. Static IPs are cheaper for a couple of accounts; mobile can be better value for a larger pool used sequentially.'),
    links: [
      { href: '/proxy-vpn/luchshie-mobilnye-proksi', label: l('Чем мобильные прокси отличаются от других и какие выбрать', 'How mobile proxies differ and which service to choose') },
      { href: '/guides/mobile-ip-airplane-mode', label: l('Бесплатная альтернатива: смена айпи режимом самолёта', 'Free alternative: change your IP with airplane mode') },
    ],
  },
  p3: {
    description: l('С начала 2025 года сижу на прокси от ProxyWing. Перешёл к ним по совету ребят из чата: ISP Германия и Франция работают стабильно, а выходит дешевле, чем у прошлого провайдера.\n\nДля YouTube и большинства задач мы с ребятами в 95% случаев берём самые простые датацентровые IPv4, и ProxyWing один из сервисов, где я их покупаю.', 'I have used ProxyWing since early 2025 after a recommendation from our chat. Its German and French ISP proxies have been stable and cheaper than my previous provider.\n\nFor about 95% of our YouTube and routine account tasks, my friends and I use basic datacenter IPv4, and this is one of my sources.'),
    capabilities: l([
      'Все типы в одном кабинете: IPv4, ISP, Residential и Mobile.',
      '200+ стран.',
      'HTTP и SOCKS5, причём SOCKS5 с поддержкой UDP.',
      'Оплата обычной картой РФ, СБП, Мир или криптой.',
    ], [
      'IPv4, ISP, Residential and Mobile in one dashboard.',
      '200+ countries.',
      'HTTP and SOCKS5, including UDP support over SOCKS5.',
      'Russian bank cards, SBP, Mir and crypto payments.',
    ]),
    pricing: l([
      'Датацентровые IPv4 примерно 1-2$ за штуку в месяц, ISP немного дороже. Некоторые типы здесь дешевле, чем у других провайдеров.',
      'Промокод hopscup на скидку 10%.',
    ], [
      'Datacenter IPv4 is roughly $1-2 per IP per month; ISP costs a little more. Some types are cheaper here than with other providers.',
      'Use hopscup for a 10% discount.',
    ]),
    bestFor: l([
      'YouTube-фермам и обычной работе с аккаунтами: схема 1 аккаунт = 1 прокси = 1 профиль антидетекта.',
      'Claude и другим сервисам, где нужен «домашний» айпи: тут лучше брать ISP.',
      'Тем, кто хочет платить российской картой без возни с криптой.',
    ], [
      'YouTube and routine account work: one account, one proxy and one browser profile.',
      'Claude and other services that need a residential-looking IP; ISP is the better starting point here.',
      'Paying with a Russian card instead of using crypto.',
    ]),
    considerations: l([
      'Начинайте с IPv4: это самый дешёвый вариант. Если площадка принимает их плохо, переходите на ISP или Residential в том же кабинете.',
      'Если чекер пишет, что видит прокси или VPN на датацентровом IPv4, это нормально: для YouTube и большинства задач их хватает.',
      'В профиле антидетекта всегда ставьте порт SOCKS5.',
    ], [
      'Start with the cheapest IPv4 option. Move to ISP or Residential in the same dashboard if the platform rejects it.',
      'A checker may flag datacenter IPv4 as proxy or VPN. That is expected and is not necessarily a problem for YouTube or routine tasks.',
      'Use the SOCKS5 port in your antidetect browser profile.',
    ]),
    gettingStarted: l([
      'Регистрируетесь по ссылке и пополняете баланс картой или СБП.',
      'Берёте пару IPv4 нужной страны с промокодом hopscup.',
      'Вставляете строку прокси в профиль антидетекта и проверяете айпи на чекере.',
    ], [
      'Register through the link and fund your balance by card or SBP.',
      'Buy a couple of IPv4 proxies in the country you need and apply hopscup.',
      'Add the proxy string to your browser profile and verify the IP with a checker.',
    ]),
    verdict: l('Мой основной сервис под датацентровые и ISP прокси: стабильно, недорого и с оплатой российской картой. Для старта лучше варианта я пока не нашёл.', 'My main provider for datacenter and ISP proxies: stable service, low prices and Russian-card payments. It is still my preferred starting point.'),
    links: [
      { href: '/proxy-vpn/luchshie-proksi', label: l('Какие прокси выбрать под задачу, разобрал отдельно', 'Choosing the right proxy type for your task') },
      { href: '/guides/youtube-ferma', label: l('Как собрать YouTube-ферму на прокси и антидетекте', 'Setting up YouTube accounts with proxies and antidetect profiles') },
      { href: '/guides/claude-iz-rossii-bez-bana', label: l('Прокси для Claude', 'Proxies for Claude') },
    ],
  },
};

export const withPartnerEditorial = (editorial, id) => {
  const update = partnerEditorialById[id];
  if (!update) return editorial;
  const { links, setupGuide, ...fields } = update;
  const localizedLinks = partnerMetadataById[id]
    ? links.map(link => ({ ...link, label: enFallback(link.label.ru, link.label.en) }))
    : links;
  return {
    ...editorial,
    ...(partnerMetadataById[id] ? {
      title: partnerMetadataById[id].title,
      seoDescription: partnerMetadataById[id].description,
      dateModified: partnerMetadataById[id].dateModified,
    } : {}),
    // Keep proxy metadata independent of the new author introduction.
    ...(['p3', 'p6'].includes(id) ? { seoDescription: editorial.seoDescription || editorial.description } : {}),
    ...Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, partnerMetadataById[id]
      ? enFallback(value.ru, value.en)
      : { ...editorial[key], ...value }])),
    ...(setupGuide ? { setupGuide: { ...setupGuide, label: enFallback(setupGuide.label.ru, setupGuide.label.en) } } : {}),
    links: [...(editorial.links || []).filter(link => !links.some(item => item.href === link.href)), ...localizedLinks],
  };
};

export const getPartnerIntroduction = (offer, language) => partnerMetadataById[offer.id]
  ? offer.editorial?.description?.[language] || offer.editorial?.description?.en
  : ['ru', 'en'].includes(language) && partnerEditorialById[offer.id]
  ? offer.editorial?.description?.[language]
  : undefined;
