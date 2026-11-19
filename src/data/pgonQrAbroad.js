const l = (ru, en) => ({ ru, en, es: en, zh: en, ko: en });

export const pgonQrAbroad = {
  cardDescription: l('В кошельке PGON появилась оплата по местным QR-кодам за границей: сканируешь QR в кафе или магазине, подтверждаешь, а продавец получает деньги в местной валюте.', 'PGON now supports local QR payments abroad: scan a QR code in a cafe or shop, confirm, and the merchant receives money in the local currency.'),
  bestFor: l('Оплата за границей по местным QR-кодам прямо с баланса USDT, TON или SOL: в Таиланде, Вьетнаме, Индонезии и других странах. Без наличных и поиска обменников.', 'Pay abroad with local QR codes directly from your USDT, TON or SOL balance in Thailand, Vietnam, Indonesia and other countries. No cash or search for exchange services needed.'),
  consideration: l('Полный список стран для QR-оплаты смотрите внутри кошелька, он пополняется.', 'Check the wallet for the full list of countries supporting QR payments; more countries are being added.'),
  exchangeDescription: l('Теперь QR-оплата работает и за границей: Таиланд, Вьетнам, Индонезия и другие страны, напрямую с баланса USDT, TON или SOL.', 'QR payments now also work abroad in Thailand, Vietnam, Indonesia and other countries, directly from your USDT, TON or SOL balance.'),
  types: l('QR-оплата за границей', 'QR payments abroad'),
  articleSentence: 'Недавно в PGON добавили оплату по местным QR-кодам за границей: в Таиланде, Вьетнаме, Индонезии и других странах можно платить прямо с баланса USDT, TON или SOL.',
};

export const withPgonQrAbroad = page => {
  const languages = ['ru', 'en', 'es', 'zh', 'ko'];
  // The refreshed card already covers QR abroad; keep its legacy tile copy only.
  if (page.id === 'pgon') return {
    ...page,
    tileDescription: page.tileDescription || Object.fromEntries(languages.map(language => [language, `${page.editorial.description[language]} ${pgonQrAbroad.cardDescription[language]}`])),
  };
  return {
    ...page,
    editorial: {
      ...page.editorial,
      description: Object.fromEntries(languages.map(language => [language, `${page.editorial.description[language]} ${pgonQrAbroad.exchangeDescription[language]}`])),
    },
  };
};
