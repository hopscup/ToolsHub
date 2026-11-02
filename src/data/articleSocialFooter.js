export const articleSocialLinks = [
  { label: 'Telegram', href: 'https://t.me/hopscupcrpt', icon: 'telegram', platform: 'telegram' },
  { label: 'YouTube', href: 'https://www.youtube.com/@hopscup', icon: 'youtube', platform: 'youtube' },
  { label: 'Мой сайт с полезными сервисами hopscup.tools', href: '/', icon: 'website', platform: 'site' },
];

export const articleSocialBanner = {
  src: '/hopscup-crew-banner.webp',
  href: 'https://www.youtube.com/@hopscup',
  alt: 'Hopscup Crew - YouTube-канал про крипту, аккаунты и полезные сервисы',
  width: 1280,
  height: 720,
};

export const articleSocialCompact = {
  eyebrow: 'Больше полезного тут',
  title: 'Hopscup Crew',
  description: 'Разбираю прокси, антидетекты, аккаунты и крипту на YouTube и в Telegram',
  links: ['youtube', 'telegram', 'site'].map(platform => {
    const link = articleSocialLinks.find(item => item.platform === platform);
    return { ...link, label: platform === 'site' ? 'Все сервисы' : link.label };
  }),
};

// Replace only legacy closing social paragraphs; keep article text and images intact.
export const withoutArticleSocialFooter = (blocks) => {
  const text = block => block.type === 'paragraph' ? block.content.map(part => part.text).join('').trim() : '';
  const start = blocks.findIndex(block => /^(?:📌)?Больше полезного/.test(text(block)));
  if (start < 0) return blocks;
  const labels = new Set(['Telegram', 'Youtube', 'YouTube', 'Мой сайт с полезными сервисами', 'Мой сайт с полезными сервисами hopscup.tools']);
  return blocks.filter((block, index) => index < start || (!labels.has(text(block)) && !/^(?:📌)?Больше полезного/.test(text(block))));
};
