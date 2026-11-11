import virtualNumberArticle from './virtualNumberArticle.json' with { type: 'json' };
import { createOfferGuideContent } from './offerGuideContent.js';

export { virtualNumberArticle };
export const createVirtualNumberContent = offers => createOfferGuideContent(virtualNumberArticle, offers, 'virtual number article');
