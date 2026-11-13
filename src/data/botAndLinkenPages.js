import content from './botAndLinkenContent.json' with { type: 'json' };

const localized = (ru, en) => ({ ru, en, es: en, zh: en, ko: en });
const english = {
  'bot-boloto': {
    title: 'Boloto: ChatGPT, Claude and Grok subscriptions | Hopscup',
    heading: 'Boloto: AI subscriptions through a Telegram bot',
    description: 'Boloto review: subscriptions on your own account, ready-made ChatGPT accounts and Codex numbers. SBP, cards and crypto.',
    payment: 'SBP, cards, crypto',
    editorial: {
      description: 'A Telegram store focused on official ChatGPT Plus and Pro, Claude Pro and Max, Grok and Cursor subscriptions on your own account. Ready-made accounts, promotions and purchase gifts are also available.',
      bestFor: ['Official ChatGPT, Claude, Grok and Cursor subscriptions on your own account.', 'Ready-made ChatGPT Plus accounts with a short or full warranty.', 'Codex activation numbers and Claude accounts over a month old.', 'Help with Claude verification.'],
      considerations: ['The store warns against buying Claude subscriptions for accounts less than a month old.', 'Read the warranty period for each product; cheaper options have shorter cover.', 'Availability changes frequently, especially for Gemini.'],
      verdict: 'An option for official subscriptions on your own account with SBP or card payment, especially ChatGPT Pro and Claude Max.',
    },
  },
  'bot-taynik': {
    title: 'Taynik: AI accounts and subscriptions | Hopscup',
    heading: 'Taynik: ChatGPT, Claude and Gemini accounts in Telegram',
    description: 'Taynik review: AI accounts and renewals, OpenAI API tokens and a VPN for AI tools. SBP, crypto and Telegram Stars.',
    payment: 'SBP, crypto, Telegram Stars',
    editorial: {
      description: 'An AI account and subscription store with a bot and website. Alongside ChatGPT, Claude, Gemini and Grok, it offers OpenAI API tokens, Suno, Adobe and its own VPN for AI services.',
      bestFor: ['Gemini Pro for 3, 6, 12 or 24 months from a few dollars.', 'ChatGPT Plus, Claude Pro and SuperGrok renewals or ready-made accounts.', 'OpenAI API for coding and bots at lower prices.'],
      considerations: ['Warranty varies; some products have none. Read the listing before buying.', 'Gemini needs a VPN in Russia; the store offers its own with two free weeks.', 'Telegram Stars are accepted, but SBP is usually cheaper.'],
      verdict: 'The broadest range of the three new bots, from subscriptions to API and VPN, for buying in one place.',
    },
  },
  'bot-ahlis': {
    title: 'Ahlis Shop: inexpensive ChatGPT and Gemini accounts | Hopscup',
    heading: 'Ahlis Shop: AI accounts and subscription activation codes',
    description: 'Ahlis Shop review: ChatGPT accounts from RUB 359, subscription codes, Gemini links and bulk orders. SBP, cards and crypto.',
    payment: 'SBP, cards, crypto',
    editorial: {
      description: 'An inexpensive Telegram AI store offering ready-made ChatGPT accounts and subscription activation codes for your account. Automated payments run around the clock, with top-ups from RUB 20.',
      bestFor: ['Low-cost ChatGPT Plus accounts for short-term use.', 'ChatGPT Pro, Grok and Claude activation codes for your own account.', 'Bulk orders from 10 items through support.', 'Help with Claude verification.'],
      considerations: ['The cheapest accounts have only 12-24 hours of warranty.', 'Claude codes require an account registered before September 15, 2026; do not use a fresh account.', 'Prices and stock change almost daily; follow the channel.'],
      verdict: 'A starting point when price is the priority. Choose a full warranty for an important long-term account.',
    },
  },
  'ant-linken-sphere': {
    title: 'Linken Sphere: antidetect browser review and plans | Hopscup',
    heading: 'Linken Sphere: antidetect browser with a free plan and built-in proxies',
    description: 'Linken Sphere review: 5 free sessions, paid plans from $30/month, built-in proxies, mobile emulation, Canvas 3.0 and API.',
    payment: 'Cards, crypto',
    editorial: {
      description: 'Linken Sphere has been available since 2017 and focuses on browser fingerprint substitution. Its team regularly releases major antidetect updates.',
      capabilities: ['Windows and macOS fingerprints with Android device emulation.', 'Canvas 3.0 substitution without changing the image itself.', 'Built-in proxies across dozens of countries, with automatic replacement in the same location.', 'Passkey storage and a built-in 2FA authenticator.', 'Session notes and automatic window arrangement for bulk launches.', 'API automation and teamwork on higher plans.'],
      pricing: ['Free: $0, 5 sessions, no time limit.', 'Pure: $30/month, 30 sessions.', 'Light: $90/month, 150 sessions and 100 free proxies.', 'Pro: $160/month, 500 sessions, 300 proxies and up to 10 team members.', 'Premium: $300/month, 1,000 sessions, 1,000 proxies and unlimited team members.', 'Around 10% off for six months and 20% for a year.'],
      bestFor: ['Advertising accounts and traffic work where fingerprint quality matters.', 'Teams using roles and shared session access on Pro or Premium.', 'Trying five sessions for free without a time limit.'],
      considerations: ['Paid plans cost more than many alternatives; free antidetect browsers may suit simple high-volume work.', 'Built-in proxies suit testing; use your own proxies for important accounts.', 'Five free sessions are enough to learn the product, not to run an account farm.'],
      gettingStarted: ['Register through the link with promo code hopscup.', 'Download the Windows or macOS application.', 'Create a session, add your own proxy or a built-in one, and check its fingerprint.'],
      verdict: 'For users who prioritize fingerprint substitution over price per profile. The five-session free plan lets you test your workflow.',
    },
  },
};

const pages = content.map(source => {
  const [id, slug] = source.metadata.id.split(', slug: ');
  const en = english[id];
  const isSphere = id === 'ant-linken-sphere';
  const title = localized(source.metadata.Title, en.title);
  return {
    id, slug, name: source.name,
    category: isSphere ? 'Antidetect' : 'Stores',
    subCategory: isSphere ? 'PCAdvanced' : 'Bot',
    url: source.metadata['Реф-ссылка'],
    logo: `/${isSphere ? 'linken-sphere' : id}.webp`,
    title,
    heading: localized(source.metadata.H1, en.heading),
    description: localized(source.metadata.Description, en.description),
    keywords: localized(source.name, source.name),
    editorial: {
      title,
      description: localized(source.editorial.description, en.editorial.description),
      bestFor: localized(source.editorial.bestFor, en.editorial.bestFor),
      considerations: localized(source.editorial.considerations, en.editorial.considerations),
      verdict: localized(source.editorial.verdict, en.editorial.verdict),
      ...Object.fromEntries(['capabilities', 'pricing', 'gettingStarted'].filter(key => source.editorial[key]).map(key => [key, localized(source.editorial[key], en.editorial[key])])),
      ...(isSphere ? {
        inlineLinks: localized([{ text: 'свои', href: '/proxy-vpn/luchshie-proksi', wholeWord: true }], [{ text: 'your own proxies', href: '/proxy-vpn/luchshie-proksi' }]),
        links: [{ href: '/guides/besplatnye-antidetekt-brauzery', label: localized('Все бесплатные антидетекты сравнивал отдельно', 'See my comparison of free antidetect browsers') }],
      } : {}),
    },
    details: {
      paymentMethods: localized(source.metadata['Оплата'], en.payment),
      ...(source.metadata['Типы'] ? { types: localized(source.metadata['Типы'], source.metadata['Типы']) } : {}),
    },
    ...(isSphere ? {
      platforms: source.metadata['Платформы'].split(', '),
      freeProfiles: localized(source.metadata['Бесплатный тариф'], '5 sessions, no time limit'),
      tariffStartPrice: localized('от $30/мес', 'from $30/mo'),
      promoCode: 'hopscup',
    } : {}),
  };
});

export const botShopPages = pages.filter(page => page.category === 'Stores');
export const linkenSpherePages = pages.filter(page => page.category === 'Antidetect');
export const botShopOffers = botShopPages.map(page => ({ ...page, logoUrl: page.logo, description: page.editorial.description }));
export const linkenSphereOffers = linkenSpherePages.map(page => ({ ...page, logoUrl: page.logo, description: page.editorial.description }));

export const orderAntidetectAllOffers = offers => {
  const followingIds = ['ant-linken-sphere', 'ant-shardx'];
  const following = followingIds.map(id => offers.find(offer => offer.id === id)).filter(Boolean);
  if (!offers.some(offer => offer.id === 'ant-vision') || following.length !== followingIds.length) return offers;
  const ordered = offers.filter(offer => !followingIds.includes(offer.id));
  ordered.splice(ordered.findIndex(offer => offer.id === 'ant-vision') + 1, 0, ...following);
  return ordered;
};
