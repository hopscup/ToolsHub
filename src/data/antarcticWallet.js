const localized = (ru, en) => ({ ru, en, es: en, zh: en, ko: en });

export const antarcticWallet = {
  name: 'Antarctic Wallet',
  url: 'https://t.me/antarctic_wallet_bot/app?startapp=ref_d5c6b79c1d',
  logo: '/antarctic-wallet.webp',
};

export const antarcticCardStats = {
  issuance: localized('от 9,99$', 'from $9.99'),
  maintenance: localized('0 $/мес', '$0/mo'),
  paySystems: localized('Да', 'Yes'),
  verification: localized('Да', 'Yes'),
  cashback: localized('до 5% (QR/РФ)', 'up to 5% (QR/RU)'),
  topup: localized('СБП/USDT', 'SBP/USDT'),
  commission: localized('3% + 0,5$', '3% + $0.50'),
  type: localized('Виртуальная', 'Virtual'),
};

export const antarcticCardPage = {
  ...antarcticWallet,
  id: 'antarctic-card',
  slug: 'antarctic-wallet',
  title: localized('Antarctic Wallet: зарубежная карта за 9,99$ с Apple Pay | Hopscup Tools', 'Antarctic Wallet: a $9.99 foreign card with Apple Pay | Hopscup Tools'),
  heading: localized('Antarctic Wallet: зарубежная карта и оплата криптой по QR', 'Antarctic Wallet: a foreign card and crypto QR payments'),
  description: localized('Обзор Antarctic Wallet: зарубежная карта от 9,99$ с Apple Pay и Google Pay, пополнение рублями по СБП или USDT, оплата по QR в России, KYC и комиссии.', 'Antarctic Wallet review: a foreign card from $9.99 with Apple Pay and Google Pay, RUB funding via SBP or USDT, QR payments in Russia, KYC, and fees.'),
  keywords: localized('Antarctic Wallet, зарубежная карта, Apple Pay, Google Pay, карта за USDT, оплата по QR СБП', 'Antarctic Wallet, foreign virtual card, Apple Pay, Google Pay, USDT card, SBP QR payments'),
  editorial: {
    description: localized('Antarctic Wallet — кошелёк в Telegram и приложении, где можно выпустить зарубежную виртуальную карту, пополнять её рублями по СБП или USDT и платить по QR в России с крипто-баланса.', 'Antarctic Wallet is a wallet available in Telegram and an app. You can issue a foreign virtual card, fund it with RUB via SBP or USDT, and pay by QR in Russia from your crypto balance.'),
    bestFor: localized([
      'Оплата ChatGPT, Claude, Netflix и других зарубежных подписок.',
      'Покупки за границей через Apple Pay и Google Pay.',
      'Тем, кто хранит деньги в USDT и хочет тратить их без P2P.',
    ], [
      'Paying for ChatGPT, Claude, Netflix, and other foreign subscriptions.',
      'Shopping abroad with Apple Pay and Google Pay.',
      'Users who hold USDT and want to spend it without P2P.',
    ]),
    considerations: localized([
      'Для выпуска зарубежных карт нужен KYC уровня «Расширенный» через Sumsub.',
      'Карта для всего: выпуск 9,99$, пополнение 3% + 0,5 USDT за платёж, лимит до 15 000 USDT за платёж.',
      'Премиальная карта «Платина»: 0$ за оплату, 1,7% за пополнение, до 200 000$ в сутки.',
      'Баланс карты в SGD, при оплате в другой валюте есть комиссия за конвертацию.',
      'Условия часто меняются, проверяйте в приложении перед выпуском.',
    ], [
      'Issuing foreign cards requires Advanced KYC through Sumsub.',
      'Card for Everything: $9.99 issuance, 3% funding fee + 0.5 USDT per payment, up to 15,000 USDT per payment.',
      'Platinum premium card: $0 per payment, 1.7% funding fee, up to $200,000 per day.',
      'The card balance is in SGD; payments in another currency incur a conversion fee.',
      'Terms change frequently; check them in the app before issuing a card.',
    ]),
  },
};

export const antarcticExchangeDetails = {
  geo: localized('РФ, Казахстан и ещё 6 стран', 'Russia, Kazakhstan and 6 more countries'),
  types: localized('Покупка USDT за рубли по СБП, вывод USDT на карту РФ, оплата по QR', 'Buy USDT with RUB via SBP, withdraw USDT to a Russian card, QR payments'),
  paymentMethods: localized('СБП, криптовалюта; вывод на карту РФ, по номеру телефона, на карты Кыргызстана и Alipay', 'SBP, crypto; withdrawals to Russian cards, by phone number, to Kyrgyzstan cards and Alipay'),
  supports: localized([
    'Пополнение рублями по СБП, в том числе нерезидентам с российским счётом',
    'Вывод USDT на карту любого банка РФ',
    'Оплата по QR в РФ с USDT-баланса',
    'AML-проверка кошельков',
    'Сети: TRC20, BEP20, TON, Polygon, Arbitrum, Base и др.',
  ], [
    'RUB funding via SBP, including non-residents with a Russian bank account',
    'Withdraw USDT to a card from any Russian bank',
    'QR payments in Russia from a USDT balance',
    'Wallet AML checks',
    'Networks: TRC20, BEP20, TON, Polygon, Arbitrum, Base, and more',
  ]),
  nuances: localized([
    'QR-оплаты в РФ и выпуск карт доступны после KYC «Расширенный».',
    'Лимит одного пополнения 100 000 ₽, со статусом VIP до 250 000 ₽.',
    'Курс и итоговая сумма показываются перед подтверждением.',
    'Отдельной комиссии за оплату по QR нет, стоимость заложена в курс USDT: ориентировочно 2–5% от суммы',
    'Пополнение: USDT TRC-20 — 2,75 USDT (сеть + AML), USDT в сети TON обычно без комиссии, минимальный депозит 5 USDT',
    'Кешбэк баллами 1–5% за оплату по QR и картой РФ',
    'Точная сумма списания видна до подтверждения оплаты',
  ], [
    'QR payments in Russia and card issuance require Advanced KYC.',
    'One top-up is limited to RUB 100,000, or up to RUB 250,000 with VIP status.',
    'The exchange rate and final amount are shown before confirmation.',
    'There is no separate QR payment fee; the cost is included in the USDT rate, approximately 2–5% of the amount',
    'Deposits: USDT TRC-20 costs 2.75 USDT (network + AML); USDT on TON usually has no fee; minimum deposit: 5 USDT',
    'Cashback in points: 1–5% for QR payments and payments with a Russian card',
    'The exact amount to be debited is shown before payment confirmation',
  ]),
};

export const antarcticExchangePage = {
  ...antarcticWallet,
  id: 'antarctic-exchange',
  slug: 'antarctic-wallet',
  title: localized('Antarctic Wallet: покупка USDT, вывод на карту и QR СБП | Hopscup Tools', 'Antarctic Wallet: buy USDT, card withdrawals and SBP QR | Hopscup Tools'),
  heading: localized('Antarctic Wallet: покупка USDT, вывод на карту и оплата по QR', 'Antarctic Wallet: buy USDT, withdraw to a card and pay by QR'),
  description: localized('Antarctic Wallet: покупка USDT за рубли по СБП, вывод на карту РФ, оплата по QR с USDT-баланса, поддерживаемые сети, KYC и лимиты.', 'Antarctic Wallet: buy USDT with RUB via SBP, withdraw to a Russian card, pay by QR from a USDT balance, supported networks, KYC, and limits.'),
  keywords: localized('Antarctic Wallet, купить USDT по СБП, вывести USDT на карту, оплата криптой по QR', 'Antarctic Wallet, buy USDT via SBP, withdraw USDT to card, crypto QR payments'),
  editorial: {
    description: localized('В Antarctic Wallet можно купить USDT за рубли по СБП, вывести USDT на карту РФ и платить по QR в России с USDT-баланса. Курс и итоговая сумма показываются перед подтверждением.', 'Antarctic Wallet lets you buy USDT with RUB via SBP, withdraw USDT to a Russian bank card, and pay by QR in Russia from a USDT balance. The rate and final amount are shown before confirmation.'),
    bestFor: antarcticExchangeDetails.supports,
    considerations: antarcticExchangeDetails.nuances,
  },
};

export const antarcticSteamDetails = {
  rate: localized('комиссия 0,5$', '$0.50 fee'),
  types: localized('По логину Steam', 'By Steam login'),
  paymentMethods: localized('USDT или рубли по СБП через баланс кошелька', 'USDT or RUB via SBP through the wallet balance'),
  nuances: localized([
    'Курс 1 USD = 1$, комиссия 0,5$ за пополнение (по данным приложения на 30.10.2026).',
    'Деньги зачисляются по внутреннему курсу вашего региона Steam.',
    'Проверьте логин аккаунта перед подтверждением.',
  ], [
    'Rate: 1 USD = $1, with a $0.50 fee per top-up (app data as of 30 October 2026).',
    'Funds are credited at the internal exchange rate for your Steam region.',
    'Check the account login before confirming.',
  ]),
};

export const antarcticSteamPage = {
  ...antarcticWallet,
  id: 'steam-antarctic',
  slug: 'antarctic-wallet',
  title: localized('Antarctic Wallet: пополнение Steam по логину с USDT | Hopscup Tools', 'Antarctic Wallet: Steam top-up by login with USDT | Hopscup Tools'),
  heading: localized('Пополнение Steam через Antarctic Wallet', 'Steam top-up through Antarctic Wallet'),
  description: localized('Пополнение Steam по логину аккаунта прямо в кошельке Antarctic Wallet: с баланса USD по курсу 1 к 1 и фиксированной комиссией 0,5$. Баланс кошелька пополняется USDT или рублями по СБП.', 'Top up Steam by account login inside Antarctic Wallet from a USD balance at a 1:1 rate with a fixed $0.50 fee. Fund the wallet with USDT or RUB via SBP.'),
  keywords: localized('Antarctic Wallet Steam, пополнение Steam по логину, Steam за USDT, Steam по СБП', 'Antarctic Wallet Steam, Steam top-up by login, Steam with USDT, Steam SBP'),
  editorial: {
    description: localized('Пополнение Steam по логину аккаунта прямо в кошельке Antarctic Wallet: с баланса USD по курсу 1 к 1 и фиксированной комиссией 0,5$. Баланс кошелька пополняется USDT или рублями по СБП.', 'Top up Steam by account login inside Antarctic Wallet from a USD balance at a 1:1 rate with a fixed $0.50 fee. Fund the wallet with USDT or RUB via SBP.'),
    bestFor: localized(['Пополнение Steam по логину без покупки и продажи предметов.', 'Оплата с баланса кошелька, пополненного USDT или рублями по СБП.'], ['Top up Steam by login without buying or selling items.', 'Pay from a wallet balance funded with USDT or RUB via SBP.']),
    considerations: antarcticSteamDetails.nuances,
  },
};

export const cryptoQrLanding = {
  id: 'crypto-sbp-qr',
  route: '/crypto-exchange/qr-sbp',
  category: 'Crypto',
  subFilter: 'USDTQR',
  eyebrow: localized('QR СБП', 'SBP QR'),
  title: localized('Оплата криптой по QR СБП: PGON, Antarctic, QR2Pay, Prosto | Hopscup Tools', 'Crypto SBP QR payments: PGON, Antarctic, QR2Pay, Prosto | Hopscup Tools'),
  heading: localized('Оплата криптой по QR СБП в России', 'Crypto payments via SBP QR in Russia'),
  heroHeading: localized('Оплата криптой по QR СБП в России', 'Crypto payments via SBP QR in Russia'),
  description: localized('Оплата криптой по QR-коду СБП в магазинах России: USDT конвертируется в рубли внутри сервиса', 'Pay with crypto via SBP QR codes in Russian stores: USDT is converted to RUB inside the service'),
  heroIntro: localized('Оплата криптой по QR-коду СБП в магазинах России: USDT конвертируется в рубли внутри сервиса', 'Pay with crypto via SBP QR codes in Russian stores: USDT is converted to RUB inside the service'),
  intro: localized('Оплата криптой по QR-коду СБП в магазинах России: USDT конвертируется в рубли внутри сервиса', 'Pay with crypto via SBP QR codes in Russian stores: USDT is converted to RUB inside the service'),
  points: localized([
    'PGON: оплата по QR СБП/НСПК в России.',
    'Antarctic Wallet: оплата по QR в РФ с USDT-баланса после KYC «Расширенный».',
    'QR2Pay: оплата по QR без KYC, комиссия 3%, до 150 000 ₽ за операцию.',
    'Prosto Exchange: QR-оплата без KYC, стоимость заложена в курс USDT (по заявлению сервиса, октябрь 2026).',
  ], [
    'PGON: SBP/NSPK QR payments in Russia.',
    'Antarctic Wallet: QR payments in Russia from a USDT balance after Advanced KYC.',
    'QR2Pay: QR payments without KYC, a 3% fee, up to RUB 150,000 per transaction.',
    'Prosto Exchange: QR payments without KYC, with the cost included in the USDT rate (according to the service, October 2026).',
  ]),
  keywords: localized('оплата криптой по QR, QR СБП, USDT в магазинах России, PGON, Antarctic Wallet, QR2Pay, Prosto Exchange', 'crypto QR payments, SBP QR, USDT in Russian stores, PGON, Antarctic Wallet, QR2Pay, Prosto Exchange'),
  linkLabel: localized('Выбрать сервис для оплаты по QR', 'Choose a QR payment service'),
  items: ['Prosto Exchange', 'Antarctic Wallet', 'QR2Pay', 'PGON'],
  serviceLinks: {
    PGON: '/crypto-exchange/pgon',
    'Antarctic Wallet': '/crypto-exchange/antarctic-wallet',
    QR2Pay: '/crypto-exchange/qr2pay',
    'Prosto Exchange': '/crypto-exchange/prosto-exchange',
  },
};
