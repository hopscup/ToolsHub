import mobileAntidetectArticle from './mobileAntidetectArticle.json' with { type: 'json' };
import { createOfferGuideContent } from './offerGuideContent.js';

export { mobileAntidetectArticle };
export const createMobileAntidetectContent = offers => createOfferGuideContent(mobileAntidetectArticle, offers, 'mobile antidetect article');
