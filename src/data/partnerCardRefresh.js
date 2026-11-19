const l = (ru, en) => ({ ru, en });

export const darkShoppingMetadata = {
  title: l('DarkShopping: отзыв, аккаунты и почты, как покупать | Hopscup', 'DarkShopping review: accounts, email and buying | Hopscup'),
  description: l('Мой отзыв о DarkShopping: Gmail, Outlook, Telegram, Discord, Facebook и другие аккаунты для работы. Как выбрать продавца, сколько стоит и что делать сразу после покупки.', 'My DarkShopping review: Gmail, Outlook, Telegram, Discord and Facebook accounts for work. How to compare sellers, test a purchase and secure your account.'),
};

export const partnerEditorialById = {
  'st-dark': {
    description: l('DarkShopping это магазин аккаунтов, которым я пользуюсь уже давно. Вместе с FunPay он закрывает примерно 95% моих потребностей. Сюда я иду за рабочими аккаунтами, почтами и расходниками: Gmail, Outlook, Telegram, Discord, Facebook, Instagram и другие позиции под регистрацию, фарм и обычную работу.', 'DarkShopping is one of my regular sources for work accounts and email inboxes. Together with FunPay, it covers about 95% of what I buy. I use it for Gmail, Outlook, Telegram, Discord, Facebook and Instagram accounts for registrations and day-to-day work.'),
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
    description: l('Пользуюсь MobileProxy больше трёх лет, отлично подходят для любых задач, и не только для крипты. Это мобильные прокси: айпи настоящих сотовых операторов, к которым у сайтов больше всего доверия. Трафик безлимитный, айпи меняется по кнопке, а гео можно выбрать вплоть до города.', 'I have used MobileProxy for over three years for account work and crypto-related tasks. It provides real mobile-carrier IPs, unlimited traffic, one-click IP rotation and locations down to the city.'),
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
    description: l('С начала 2025 года сижу на прокси от ProxyWing. Перешёл к ним по совету ребят из чата: ISP Германия и Франция работают стабильно, а выходит дешевле, чем у прошлого провайдера. Для YouTube и большинства задач мы с ребятами в 95% случаев берём самые простые датацентровые IPv4, и ProxyWing один из сервисов, где я их покупаю.', 'I have used ProxyWing since early 2025 after a recommendation from our chat. Its German and French ISP proxies have been stable and cheaper than my previous provider. For about 95% of our YouTube and routine account tasks, my friends and I use basic datacenter IPv4, and this is one of my sources.'),
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
  const { links, ...fields } = update;
  return {
    ...editorial,
    // Keep proxy metadata independent of the new author introduction.
    ...(['p3', 'p6'].includes(id) ? { seoDescription: editorial.seoDescription || editorial.description } : {}),
    ...Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, { ...editorial[key], ...value }])),
    links: [...(editorial.links || []).filter(link => !links.some(item => item.href === link.href)), ...links],
  };
};

export const getPartnerIntroduction = (offer, language) => ['ru', 'en'].includes(language) && partnerEditorialById[offer.id]
  ? offer.editorial?.description?.[language]
  : undefined;
