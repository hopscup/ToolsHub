export const recommendedOfferIds = {
  '/proxy-vpn': ['p6', 'p3', 'p4', 'p1'],
  '/account-shop': ['st-dark', 'bot-lachuga', 'st-funpay', 'st-ggsel'],
  '/antidetect': ['ant-dolphin', 'ant-adspower', 'ant-shardx', 'ant-vision'],
  '/ai': ['ai-syntx', 'ai-lumean', 'ai-polza'],
  '/foreign-cards': ['pgon', 'zarub', 'antarctic-card'],
  '/crypto-exchange': ['prosto-exchange', 'keine-exchange', 'antarctic-exchange'],
  '/steam-topup': ['steam-antarctic'],
};

const topLabel = { ru: 'Топ', en: 'Top' };
const frequentChoiceLabel = { ru: 'Частый выбор', en: 'Frequent pick' };
const frequentlyUsedLabel = { ru: 'Часто пользуюсь', en: 'I use it often' };
export const recommendedOfferLabels = {
  'bot-lachuga': frequentlyUsedLabel,
  'st-funpay': frequentlyUsedLabel,
  'st-ggsel': frequentlyUsedLabel,
  'ant-dolphin': frequentChoiceLabel,
  'ant-adspower': frequentChoiceLabel,
  'ant-shardx': frequentChoiceLabel,
  'ant-vision': frequentChoiceLabel,
  'prosto-exchange': { ru: 'Топ онлайн', en: 'Top online' },
  'keine-exchange': { ru: 'Топ офлайн', en: 'Top offline' },
  'antarctic-card': topLabel,
  'antarctic-exchange': topLabel,
  'steam-antarctic': topLabel,
};
