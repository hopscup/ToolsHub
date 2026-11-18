import happRoutingArticle from './happRoutingArticle.json' with { type: 'json' };
import { createOfferGuideContent } from './offerGuideContent.js';

export { happRoutingArticle };
export const createHappRoutingContent = offers => createOfferGuideContent(happRoutingArticle, offers, 'Happ routing article');
