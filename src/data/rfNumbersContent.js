import rfNumbersArticle from './rfNumbersArticle.json' with { type: 'json' };
import { createOfferGuideContent } from './offerGuideContent.js';

export { rfNumbersArticle };
export const createRfNumbersContent = offers => createOfferGuideContent(rfNumbersArticle, offers, 'RF numbers article');
