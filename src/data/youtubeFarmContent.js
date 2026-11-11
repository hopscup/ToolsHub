import youtubeFarmArticle from './youtubeFarmArticle.json' with { type: 'json' };
import { createOfferGuideContent } from './offerGuideContent.js';

export { youtubeFarmArticle };
export const createYoutubeFarmContent = offers => createOfferGuideContent(youtubeFarmArticle, offers, 'YouTube farm article');
