const localized = (ru, en) => ({ ru, en, es: en, zh: en, ko: en });

export const qrCardLabels = {
  countries: localized('Страны оплаты', 'Countries'),
  fee: localized('Комиссия QR', 'QR fee'),
  kyc: localized('KYC', 'KYC'),
  limit: localized('Лимит', 'Limit'),
};

export const qrPaymentDetailsById = {
  'pgon-exchange': {
    countries: localized('Россия', 'Russia'),
    fee: localized('5% с KYC / 15% без', '5% with KYC / 15% without'),
    kyc: localized('Не обязателен', 'Not required'),
    limit: localized('~500$/мес без KYC', '~$500/mo without KYC'),
  },
  'antarctic-exchange': {
    countries: localized('РФ, Казахстан, Таиланд, Вьетнам, Филиппины, Камбоджа, Лаос, Монголия', 'Russia, Kazakhstan, Thailand, Vietnam, Philippines, Cambodia, Laos, Mongolia'),
    fee: localized('В курсе, ~2–5%', 'Built into the rate, ~2–5%'),
    kyc: localized('Нужен', 'Required'),
    limit: localized('До 100 000 ₽ за операцию', 'Up to RUB 100,000 per payment'),
  },
  'qr2pay-exchange': {
    countries: localized('Россия', 'Russia'),
    fee: localized('3%', '3%'),
    kyc: localized('Не нужен', 'Not required'),
    limit: localized('До 150 000 ₽, без месячного лимита', 'Up to RUB 150,000, no monthly limit'),
  },
  'prosto-exchange': {
    countries: localized('Россия', 'Russia'),
    fee: localized('В курсе, ~0,5–2%', 'Built into the rate, ~0.5–2%'),
    kyc: localized('Не нужен', 'Not required'),
    limit: localized('Нет данных', 'No data'),
  },
};

export const appendLocalizedItems = (existing, additions) => {
  const append = language => [
    ...(existing[language] || existing.en),
    ...additions[language],
  ];
  return { ru: append('ru'), en: append('en'), es: append('es'), zh: append('zh'), ko: append('ko') };
};

export const pgonQrNotes = localized([
  'Пополнение криптой без комиссии, сетевая комиссия оплачивается отдельно',
  'Без KYC базовый лимит около 500$ в месяц, для больших сумм нужна верификация',
], [
  'Crypto deposits have no service fee; the network fee is paid separately',
  'Without KYC, the basic limit is about $500 per month; verification is required for larger amounts',
]);

export const prostoQrNotes = localized([
  'Оплата по любому QR-коду СБП без KYC, включая терминалы Сбера и Альфы и Яндекс Лавку (по заявлению сервиса, октябрь 2026)',
  'Отдельной комиссии за QR-оплату нет, стоимость заложена в курс USDT: ориентировочно 0,5–2%. Сравнивайте курс перед оплатой',
  'Пополнение без комиссии в сетях BSC, Solana и Mantle; в TRON, TON и ETH за пополнение берётся комиссия',
], [
  'Payments via any SBP QR code without KYC, including Sber and Alfa terminals and Yandex Lavka (according to the service, October 2026)',
  'There is no separate QR payment fee; the cost is included in the USDT rate, approximately 0.5–2%. Compare the rate before paying',
  'No deposit fee on BSC, Solana, and Mantle; deposits on TRON, TON, and ETH incur a fee',
]);
