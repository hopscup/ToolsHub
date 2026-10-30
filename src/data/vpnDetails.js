// Terms supplied by the site owner on 2026-10-28, shared by React and static HTML.
export const vpnTerms = {
  'all-vpn': {
    free: { ru: '3 часа', en: '3 hours' },
    price: { ru: 'от 199 ₽/мес', en: 'from 199 RUB/mo' },
    geo: { ru: '20+', en: '20+' },
  },
  'ppl-vpn': {
    free: { ru: '3 дня', en: '3 days' },
    price: { ru: 'от 124 ₽/мес', en: 'from 124 RUB/mo' },
    geo: { ru: '10+', en: '10+' },
  },
  prostovpn: {
    free: { ru: '3 дня', en: '3 days' },
    price: { ru: 'от 249 ₽/мес', en: 'from 249 RUB/mo' },
    geo: { ru: '10+', en: '10+' },
  },
  'giga-vpn': {
    free: { ru: '3 дня', en: '3 days' },
    price: { ru: 'от 149,92 ₽/мес', en: 'from 149.92 RUB/mo' },
    geo: { ru: '10+', en: '10+' },
  },
  'tochka-g': {
    free: { ru: '2 дня', en: '2 days' },
    price: { ru: 'от 179 ₽/мес', en: 'from 179 RUB/mo' },
    geo: { ru: '10+', en: '10+' },
  },
  'giga-dollar-vpn': {
    free: { ru: '3 дня', en: '3 days' },
    price: { ru: 'от 90 ₽/мес', en: 'from 90 RUB/mo' },
    geo: { ru: '6+', en: '6+' },
  },
  'imp-vpn': {
    free: { ru: '3 дня', en: '3 days' },
    price: { ru: 'от 158 ₽/мес', en: 'from 158 RUB/mo' },
    geo: { ru: '10+', en: '10+' },
  },
};

export const allVpnSummary = {
  ru: 'Более 50 VPN в одной подписке с переключением между подключениями. От 5 до 50 устройств и от 500 ГБ до безлимитного трафика в зависимости от тарифа.',
  en: 'More than 50 VPN options in one subscription. From 5 to 50 devices and from 500 GB to unlimited traffic, depending on the plan.',
  es: 'Más de 50 VPN en una suscripción. Entre 5 y 50 dispositivos y desde 500 GB hasta tráfico ilimitado, según el plan.',
  zh: '一份订阅包含 50 多种 VPN。根据套餐，支持 5 至 50 台设备，流量从 500 GB 到无限。',
  ko: '하나의 구독에 50개 이상의 VPN을 제공합니다. 요금제에 따라 5~50대 기기와 500GB부터 무제한 트래픽을 지원합니다.',
};

export const allVpnPros = {
  ru: ['Более 50 VPN в одной подписке', 'От 5 до 50 устройств в зависимости от тарифа', 'Трафик от 500 ГБ до безлимита по тарифу'],
  en: ['More than 50 VPN options in one subscription', '5 to 50 devices depending on the plan', '500 GB to unlimited traffic depending on the plan'],
  es: ['Más de 50 VPN en una suscripción', 'Entre 5 y 50 dispositivos según el plan', 'Desde 500 GB hasta tráfico ilimitado según el plan'],
  zh: ['一份订阅包含 50 多种 VPN', '按套餐支持 5 至 50 台设备', '按套餐提供 500 GB 至无限流量'],
  ko: ['하나의 구독에 50개 이상의 VPN', '요금제에 따라 5~50대 기기', '요금제에 따라 500GB부터 무제한 트래픽'],
};

export const allVpnConsiderations = {
  ru: ['Для подключения используется Happ или другое совместимое приложение.', 'Количество устройств и лимит трафика зависят от тарифа.'],
  en: ['Happ or another compatible client is required.', 'Device and traffic limits depend on the plan.'],
  es: ['Se necesita Happ u otro cliente compatible.', 'Los límites de dispositivos y tráfico dependen del plan.'],
  zh: ['需要 Happ 或其他兼容客户端。', '设备和流量限制取决于套餐。'],
  ko: ['Happ 또는 다른 호환 앱이 필요합니다.', '기기 및 트래픽 한도는 요금제에 따라 달라집니다.'],
};

export const impVpnPage = {
  id: 'vpn-imp',
  slug: 'imp-vpn',
  name: 'iMP VPN',
  logo: '/imp-vpn.webp',
  url: 'https://t.me/iMP_VPN_bot?start=460705268',
  title: {
    ru: 'iMP VPN: 3 дня бесплатно, цена и подключение | Hopscup Tools',
    en: 'iMP VPN: 3 free days, pricing, and setup | Hopscup Tools',
  },
  heading: {
    ru: 'iMP VPN: VPN через Telegram на 5 устройств',
    en: 'iMP VPN: Telegram VPN for 5 devices',
  },
  description: {
    ru: 'iMP VPN в Telegram: 3 дня бесплатно, до 5 устройств, безлимитный обычный трафик и 50 ГБ для LTE / белых списков. СБП, карта и криптовалюта.',
    en: 'iMP VPN on Telegram: 3 free days, up to 5 devices, unlimited regular traffic, and 50 GB for LTE / allowlist networks. SBP, bank cards, and crypto.',
  },
  keywords: {
    ru: 'iMP VPN, IMP VPN бот, iMP VPN цена, VPN 3 дня бесплатно, VPN 5 устройств, VPN LTE',
    en: 'iMP VPN, IMP VPN bot, iMP VPN pricing, 3 free days VPN, 5 device VPN, LTE VPN',
  },
  geo: vpnTerms['imp-vpn'].geo,
  paymentMethods: {
    ru: 'СБП, банковская карта, криптовалюта',
    en: 'SBP, bank card, crypto',
  },
  editorial: {
    title: {
      ru: 'iMP VPN: 3 дня бесплатно, цена и подключение | Hopscup Tools',
      en: 'iMP VPN: 3 free days, pricing, and setup | Hopscup Tools',
    },
    description: {
      ru: 'iMP VPN выдаёт подписку и инструкции через Telegram-бота. Новым пользователям доступны 3 дня бесплатно. Подписка поддерживает до 5 устройств: обычный трафик безлимитный, для LTE / белых списков включено 50 ГБ.',
      en: 'iMP VPN provides a subscription and setup instructions through a Telegram bot. New users get 3 free days. A subscription supports up to 5 devices with unlimited regular traffic and 50 GB for LTE / allowlist networks.',
    },
    bestFor: {
      ru: ['Одна подписка для нескольких устройств, до 5 одновременно.', 'Выбор страны или автоматическое подключение.', 'Проверка работы VPN на своём интернете до оплаты.'],
      en: ['One subscription for up to 5 devices.', 'Manual country selection or an automatic connection.', 'Testing the VPN on your connection before paying.'],
    },
    considerations: {
      ru: ['Для LTE / белых списков действует отдельный лимит 50 ГБ.', 'В списке серверов варианты HY2 / Hysteria2 отмечены как тестовые.', 'Работа LTE-серверов зависит от оператора: в списке есть варианты с разной совместимостью.'],
      en: ['LTE / allowlist connections have a separate 50 GB allowance.', 'HY2 / Hysteria2 options are marked as experimental in the server list.', 'LTE compatibility depends on your mobile provider and the selected server.'],
    },
    verdict: {
      ru: 'VPN через Telegram с тестом на 3 дня и подпиской на 5 устройств. Обычное подключение и LTE / белые списки разделены по трафику, поэтому при выборе сервера смотрите его тип.',
      en: 'A Telegram VPN with a 3-day trial and support for 5 devices. Regular and LTE / allowlist connections have separate traffic allowances, so check the server type.',
    },
  },
};
