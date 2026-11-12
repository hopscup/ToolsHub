export const youtubeFarmGuideLink = {
  href: '/guides/youtube-ferma',
  label: { ru: 'Как собрать YouTube-ферму, разобрал отдельно', en: 'I explain how to set up a YouTube account farm in a separate guide' },
};

export const serviceContextualGuideLinks = Object.fromEntries(
  ['ant-shardx', 'ant-adspower', 'ant-dolphin'].map(id => [id, [youtubeFarmGuideLink]]),
);

export const sectionContextualGuideLinks = {
  '/crypto-exchange': [{
    href: '/guides/exchange-uids-addresses',
    label: { ru: 'Где найти UID и адрес на бирже', en: 'Where to find your exchange UID and deposit address' },
  }],
};
