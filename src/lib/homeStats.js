// Цифры для полосы на главной. Считаются из данных, без хардкода.
const RUB_PAYMENT = /СБП|SBP|Мир|Mir|RU кар|карт[аы]? РФ|Russian (bank )?card|рубл|RUB/i;

const ruText = value => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(' ');
  return value.ru ?? value.en ?? '';
};

export const homeStats = (offers, publishedGuidesCount) => {
  const services = offers.filter(offer => offer.category !== 'Guides');
  const rub = services.filter(offer => RUB_PAYMENT.test([
    ruText(offer.details?.paymentMethods),
    ruText(offer.cardStats?.topup),
  ].join(' '))).length;
  return { services: services.length, rub, guides: publishedGuidesCount };
};
