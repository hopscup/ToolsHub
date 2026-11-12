import aiSubscriptionsArticle from './aiSubscriptionsArticle.json' with { type: 'json' };
import { createOfferGuideContent } from './offerGuideContent.js';

export { aiSubscriptionsArticle };
export const createAiSubscriptionsContent = offers => createOfferGuideContent(aiSubscriptionsArticle, offers, 'AI subscriptions article');
