export const youtubeFarmGuideLink = {
  href: '/guides/youtube-ferma',
  label: { ru: 'Как собрать YouTube-ферму, разобрал отдельно', en: 'I explain how to set up a YouTube account farm in a separate guide' },
};

export const serviceContextualGuideLinks = Object.fromEntries(
  ['ant-shardx', 'ant-adspower', 'ant-dolphin'].map(id => [id, [youtubeFarmGuideLink]]),
);

export const happRoutingGuideLink = {
  href: '/guides/happ-marshrutizaciya',
  label: { ru: 'Как настроить Happ, чтобы банки и Озон работали с включённым VPN', en: 'How to set up Happ so banks and Ozon work with VPN enabled' },
};
export const vpn4gGuideLink = {
  href: '/guides/vpn-ne-rabotaet-na-4g',
  label: { ru: 'Почему VPN не работает на 4G и что делать', en: 'Why VPN does not work on 4G and what to do' },
};

export const getServiceContextualGuideLinks = offer => [
  ...(serviceContextualGuideLinks[offer.id] || []),
  ...(offer.subCategory === 'VPN' && /\b(?:happ|incy)\b/i.test(JSON.stringify([offer.description, offer.editorial, offer.details])) ? [happRoutingGuideLink] : []),
];

export const sectionContextualGuideLinks = {
  '/account-shop/podpiski-neyrosetey': [{
    href: '/ai',
    label: { ru: 'Если не хочется покупать подписку, есть агрегаторы нейросетей с оплатой рублями', en: 'Instead of a subscription, try AI aggregators with RUB payments' },
  }],
  '/crypto-exchange': [{
    href: '/guides/exchange-uids-addresses',
    label: { ru: 'Где найти UID и адрес на бирже', en: 'Where to find your exchange UID and deposit address' },
  }],
};

export const getSectionContextualGuideLinks = (route, subFilter) => [
  ...(sectionContextualGuideLinks[route] || []),
  ...(route === '/proxy-vpn' && (subFilter === undefined || subFilter === 'VPN') ? [happRoutingGuideLink, vpn4gGuideLink] : []),
];
