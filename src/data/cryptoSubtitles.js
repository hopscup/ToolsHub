export const cryptoSubtitles = {
  None: {
    ru: 'Обменивайте крипту на рубли и обратно без P2P и блокировок',
    en: 'Exchange crypto for rubles and back without P2P or bank account freezes',
  },
  USDTQR: {
    ru: 'Оплачивайте криптой прямо на кассе по QR в России и других странах',
    en: 'Pay with crypto at the checkout by QR code in Russia and abroad',
  },
  AML: {
    ru: 'Проверьте «чистоту» своего кошелька перед обменом или выводом',
    en: 'Check your wallet’s transaction risk before exchanging or withdrawing crypto',
  },
  Wallet: {
    ru: 'Проверенные криптокошельки в разных сетях',
    en: 'Trusted crypto wallets across different networks',
  },
};

export const getCryptoSubtitle = (filter, language) =>
  (cryptoSubtitles[filter] || cryptoSubtitles.None)[language === 'ru' ? 'ru' : 'en'];
