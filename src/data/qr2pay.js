const localized = (ru, en) => ({ ru, en, es: en, zh: en, ko: en });

export const qr2pay = {
  name: 'QR2Pay',
  url: 'https://t.me/QR2Pay_bot?start=dobr9kcoo_ref_HgOnjPB',
  logo: '/qr2pay.webp',
};

export const qr2payExchangeDetails = {
  geo: localized('Россия онлайн', 'Russia, online'),
  types: localized('Оплата по QR СБП с баланса USDT, вывод рублей на карту, оплата по ссылке', 'SBP QR payments from a USDT balance, RUB withdrawals to a card, payment by link'),
  paymentMethods: localized('USDT в сетях BEP20, TON, TRC20', 'USDT on BEP20, TON, TRC20'),
  supports: localized([
    'Оплата по QR-коду в магазинах РФ, в том числе QR из файла',
    'Вывод рублей на карту',
    'Оплата по ссылке',
    'Покупка Telegram Stars',
  ], [
    'QR payments at Russian stores, including QR codes from a file',
    'RUB withdrawals to a card',
    'Payment by link',
    'Buying Telegram Stars',
  ]),
  nuances: localized([
    'Без KYC',
    'Пополнение без комиссии, сетевая комиссия отдельно',
    'Комиссия за оплату по QR 3%',
    'До 150 000 ₽ за одну операцию, без месячного лимита',
    'Пополнение Steam и мобильной связи пока в статусе «скоро»',
    'Курс и итоговая сумма видны перед подтверждением',
  ], [
    'No KYC',
    'No deposit fee; network fees are separate',
    'QR payment fee: 3%',
    'Up to RUB 150,000 per transaction, with no monthly limit',
    'Steam and mobile top-ups are currently marked as coming soon',
    'The rate and final amount are shown before confirmation',
  ]),
};

export const qr2payExchangePage = {
  ...qr2pay,
  id: 'qr2pay-exchange',
  slug: 'qr2pay',
  title: localized('QR2Pay: оплата криптой по QR в России без KYC | Hopscup Tools', 'QR2Pay: crypto QR payments in Russia without KYC | Hopscup Tools'),
  heading: localized('QR2Pay: оплата USDT по QR-коду в магазинах', 'QR2Pay: pay with USDT by QR code in stores'),
  description: localized('Обзор QR2Pay: Telegram-кошелёк для оплаты покупок в России по QR с баланса USDT без KYC. Комиссия 3%, до 150 000 ₽ за операцию, сети BEP20, TON, TRC20.', 'QR2Pay review: a Telegram wallet for QR payments in Russia from a USDT balance without KYC. A 3% fee, up to RUB 150,000 per transaction, BEP20, TON, and TRC20 networks.'),
  keywords: localized('QR2Pay, оплата USDT по QR, QR СБП без KYC, криптокошелёк Telegram', 'QR2Pay, USDT QR payments, SBP QR without KYC, Telegram crypto wallet'),
  editorial: {
    description: localized('QR2Pay — криптокошелёк в Telegram: пополняете USDT и платите в обычных магазинах по QR-коду, на кассе это выглядит как оплата в рублях. Без P2P и без KYC.', 'QR2Pay is a Telegram crypto wallet: deposit USDT and pay by QR code at regular stores, where the checkout receives a RUB payment. No P2P and no KYC.'),
    bestFor: qr2payExchangeDetails.supports,
    considerations: qr2payExchangeDetails.nuances,
  },
};

export const qr2payCardStats = {
  issuance: localized('2,5% + 5$', '2.5% + $5'),
  maintenance: localized('0 ₽/мес', '0 RUB/mo'),
  paySystems: localized('Да', 'Yes'),
  verification: localized('Нет', 'No'),
  cashback: localized('Нет', 'No'),
  topup: localized('USDT', 'USDT'),
  commission: localized('2,5%', '2.5%'),
  type: localized('Visa', 'Visa'),
};

export const qr2payCardPage = {
  ...qr2pay,
  id: 'qr2pay-card',
  slug: 'qr2pay',
  title: localized('QR2Pay: виртуальная карта Visa без KYC за USDT | Hopscup Tools', 'QR2Pay: a virtual Visa card without KYC funded with USDT | Hopscup Tools'),
  heading: localized('QR2Pay: зарубежная карта Visa без верификации', 'QR2Pay: a foreign Visa card without verification'),
  description: localized('Виртуальная карта Visa USD от QR2Pay без KYC: пополнение USDT, выпуск 2,5% + 5$, комиссия пополнения 2,5%, для оплаты зарубежных сервисов онлайн.', 'QR2Pay virtual Visa USD card without KYC: USDT funding, issuance at 2.5% + $5, a 2.5% top-up fee, and online payments for foreign services.'),
  keywords: localized('QR2Pay карта, Visa без KYC, виртуальная карта USDT, зарубежная карта', 'QR2Pay card, Visa without KYC, USDT virtual card, foreign card'),
  editorial: {
    description: localized('В QR2Pay можно выпустить виртуальную Visa без KYC и пополнять её USDT. Карта предназначена для оплаты зарубежных сервисов онлайн, поддерживает Apple Pay и Google Pay.', 'QR2Pay offers a virtual Visa without KYC, funded with USDT. The card is intended for online payments for foreign services and supports Apple Pay and Google Pay.'),
    bestFor: localized(['Оплата зарубежных сервисов онлайн.', 'Виртуальная Visa с пополнением USDT без KYC.'], ['Online payments for foreign services.', 'A virtual Visa funded with USDT without KYC.']),
    considerations: localized([
      'Карта Visa USD (Эстония), есть вариант в EUR',
      'Выпуск мгновенный',
      'Выпуск 2,5% + 5$, пополнение 2,5%',
      'Минимальная сумма 30$, максимальная 25 000$',
      'Для оплаты в интернете, Apple Pay и Google Pay поддерживаются',
    ], [
      'Visa USD card (Estonia), with an EUR option available',
      'Instant issuance',
      'Issuance: 2.5% + $5; top-up fee: 2.5%',
      'Minimum amount: $30; maximum: $25,000',
      'For online payments; Apple Pay and Google Pay are supported',
    ]),
  },
};
