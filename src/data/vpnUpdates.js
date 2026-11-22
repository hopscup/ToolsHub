import { withPartnerEditorial } from './partnerCardRefresh.js';

const l = (ru, en) => ({ ru, en, es: en, zh: en, ko: en });

export const newVpnPages = [
  {
    id: 'vpn-quattro', slug: 'quattro-vpn', name: 'Quattro VPN', logo: '/quattro-vpn.webp',
    url: 'https://telegram.me/QuattroVPN_BOT?start=r_QTvaoAABoVcA2Pbb',
    webUrl: 'https://quattro.app/register?ref=QTvaoAABoVcA2Pbb',
    webLabel: l('Через сайт', 'Via website'),
    title: l('Quattro VPN: серверы, белые списки и тарифы | Hopscup', 'Quattro VPN: servers, allowlist traffic and plans | Hopscup'),
    heading: l('Quattro VPN: 500 ГБ для белых списков', 'Quattro VPN: 500 GB for allowlist networks'),
    platforms: ['TV', 'iOS', 'Android', 'Windows', 'macOS', 'Linux'],
    details: {
      geo: l('560 серверов', '560 servers'),
      paymentMethods: l('Карта, СБП, криптовалюта, звёзды Telegram', 'Bank card, SBP, crypto, Telegram Stars'),
      devices: l('До 5 устройств', 'Up to 5 devices'),
    },
    editorial: {
      title: l('Quattro VPN: серверы, белые списки и тарифы | Hopscup', 'Quattro VPN: servers, allowlist traffic and plans | Hopscup'),
      description: l('Один из самых популярных VPN этой осени: его советуют почти все обзоры и мои знакомые. Много серверов, LTE-серверы под белые списки, свой чат с командой. Сам ещё не пользовался, бесплатного теста у них нет.', 'One of the most popular VPNs this autumn, recommended in many reviews and by people I know. It has many servers, LTE servers for allowlist networks and a chat with the team. I have not used it myself yet, and there is no free trial.'),
      bestFor: l([
        'Тем, у кого часто включают белые списки: 500 ГБ LTE-трафика в месяц и есть безлимитные LTE-серверы.',
        'Нейросетям: Gemini и другие модели Google работают на серверах со звёздочкой.',
        'Несколько устройств: до 5 на одну подписку.',
      ], [
        'Users who often face allowlist restrictions: 500 GB of LTE traffic per month, with unlimited LTE servers also available.',
        'AI tools: Gemini and other Google models work on servers marked with a star.',
        'Multiple devices: up to 5 per subscription.',
      ]),
      considerations: l([
        'Бесплатного теста нет, сразу платная подписка.',
        'Сервис прямо пишет, что работа с мобильными операторами не гарантируется и деньги за это не возвращают.',
        'Торренты только на серверах с пометкой Torrent, за нарушение и превышение лимита устройств блок без возврата.',
      ], [
        'There is no free trial; a paid subscription is required from the start.',
        'The service explicitly says mobile carrier compatibility is not guaranteed and does not qualify for a refund.',
        'Torrents are allowed only on servers marked Torrent. Breaking this rule or exceeding the device limit can lead to a block without a refund.',
      ]),
      pricing: l(['От 300 ₽ на 30 дней, до 5 устройств.'], ['From RUB 300 per 30 days for up to 5 devices.']),
      capabilities: l(['Приложения: Happ, Quattro, Clash, Throne.'], ['Apps: Happ, Quattro, Clash, Throne.']),
      verdict: l('Если готовы заплатить без теста, это сейчас один из самых сильных вариантов под белые списки.', 'If you are ready to pay without a trial, this is currently one of the strongest options for allowlist networks.'),
    },
  },
  {
    id: 'vpn-taynik', slug: 'taynik-vpn', name: 'Тайник VPN', logo: '/taynik-vpn.webp',
    url: 'https://t.me/vpntaynik_bot?start=ref467483565',
    title: l('Тайник VPN: 14 дней бесплатно и белые списки | Hopscup', 'Taynik VPN: 14 free days and allowlist access | Hopscup'),
    heading: l('Тайник VPN: 14 дней бесплатно', 'Taynik VPN: 14 days free'),
    details: {
      geo: l('4+, остальные восстанавливаются', '4+, more being restored'),
      devices: l('3 устройства', '3 devices'),
      paymentMethods: l('Карта РФ, СБП, USDT, Bybit Pay, Telegram Stars', 'Russian card, SBP, USDT, Bybit Pay, Telegram Stars'),
    },
    editorial: {
      title: l('Тайник VPN: 14 дней бесплатно и белые списки | Hopscup', 'Taynik VPN: 14 free days and allowlist access | Hopscup'),
      description: l('VPN от магазина Тайник, запустился в октябре 2026. Заточен под нейросети: Gemini, Antigravity, ChatGPT, Claude. С 16 ноября добавили отдельный сервер под белые списки.', 'A VPN from the Taynik store, launched in October 2026. It focuses on AI tools: Gemini, Antigravity, ChatGPT and Claude. A dedicated server for allowlist networks was added on November 16.'),
      bestFor: l(['Протестировать без денег: 14 дней бесплатно.', 'Нейросетям, особенно Gemini.', 'Тем, кто уже покупает подписки в Тайнике.'], ['Try it without paying: 14 days free.', 'AI tools, especially Gemini.', 'Users who already buy subscriptions from Taynik.']),
      considerations: l(['Сервис молодой: в начале ноября были перебои, после чего его переделали. Пока часть ГЕО восстанавливается.', 'По умолчанию 3 устройства, остальные докупаются.'], ['It is a new service. There were outages in early November, followed by a rework, and some locations are still being restored.', 'The default limit is 3 devices; additional devices cost extra.']),
      pricing: l(['199 ₽ в месяц; 3 месяца: 499 ₽; 6 месяцев: 899 ₽; 12 месяцев: 1590 ₽.', 'По умолчанию 3 устройства, можно докупить.'], ['RUB 199 per month; 3 months: RUB 499; 6 months: RUB 899; 12 months: RUB 1,590.', '3 devices by default; additional devices are available.']),
      capabilities: l(['Подключается на смартфоне, компьютере и планшете.', 'Приложение: Тайник VPN.'], ['Works on smartphones, computers and tablets.', 'App: Taynik VPN.']),
      verdict: l('Хороший вариант на попробовать: две недели бесплатно хватит, чтобы понять, работает ли он у вас.', 'A good option to try: two free weeks should be enough to see whether it works for you.'),
    },
  },
].map(page => ({ ...page, description: page.editorial.description }));

export const newVpnOffers = newVpnPages.map(page => ({
  ...page, category: 'Proxy', subCategory: 'VPN', logoUrl: page.logo,
  editorial: withPartnerEditorial(page.editorial, page.id),
}));

export const vpnEditorialAdditions = {
  'tochka-g': {
    pricing: l(['Стандарт для обычного использования и Telegram, G Premium для белых списков и Telegram.'], ['Standard is for everyday use and Telegram; G Premium is for allowlist networks and Telegram.']),
    telegramFallback: l(['Чтобы зайти в бота и оплатить конфиг, когда Telegram не открывается: ссылка https://access.gotam.pro ставит временный прокси в Telegram. После установки конфига этот прокси лучше удалить: Настройки, Данные и память, Прокси. Ещё вариант: сайт https://tochkag.online выдаёт временную ссылку для Happ.'], ['To open the bot and pay for a config when Telegram is unavailable, https://access.gotam.pro installs a temporary Telegram proxy. After installing the VPN config, remove the proxy in Settings, Data and Storage, Proxy. Alternatively, https://tochkag.online provides a temporary Happ link.']),
    inlineLinks: l([{ text: 'https://access.gotam.pro', href: 'https://access.gotam.pro' }, { text: 'https://tochkag.online', href: 'https://tochkag.online' }], [{ text: 'https://access.gotam.pro', href: 'https://access.gotam.pro' }, { text: 'https://tochkag.online', href: 'https://tochkag.online' }]),
  },
  'ppl-vpn': {
    telegramFallback: l(['Купить или продлить подписку без Telegram можно на сайте https://app.privatepeople.top. Бесплатный прокси для Telegram: https://proxytg.top.'], ['Buy or renew a subscription without Telegram at https://app.privatepeople.top. Free Telegram proxy: https://proxytg.top.']),
    inlineLinks: l([{ text: 'https://app.privatepeople.top', href: 'https://app.privatepeople.top?partner_id=443083' }, { text: 'https://proxytg.top', href: 'https://proxytg.top' }], [{ text: 'https://app.privatepeople.top', href: 'https://app.privatepeople.top?partner_id=443083' }, { text: 'https://proxytg.top', href: 'https://proxytg.top' }]),
  },
  'giga-dollar-vpn': {
    capabilities: l(['Сайт без Telegram: https://dollarvpn.shop, полностью дублирует бота, вход по почте.', 'Расширение для Chrome, Яндекс Браузера и Edge: можно пускать через VPN только нейросети или только то, что не открывается, а банки и маркетплейсы оставлять напрямую. Есть бесплатный пробный период.'], ['Website without Telegram: https://dollarvpn.shop mirrors the bot and supports email sign-in.', 'Extension for Chrome, Yandex Browser and Edge: route only AI tools or blocked sites through the VPN, while banks and marketplaces connect directly. A free trial is available.']),
    pricing: l(['От 169 ₽ в месяц за 5 устройств, есть посуточный тариф, скидки до 30% при оплате на год.'], ['From RUB 169 per month for 5 devices, with a daily plan and discounts of up to 30% for annual payment.']),
    inlineLinks: l([{ text: 'https://dollarvpn.shop', href: 'https://dollarvpn.shop' }], [{ text: 'https://dollarvpn.shop', href: 'https://dollarvpn.shop' }]),
  },
};
