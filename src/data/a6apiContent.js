import a6apiArticle from './a6apiArticle.json' with { type: 'json' };
import { createOfferGuideContent } from './offerGuideContent.js';

export { a6apiArticle };
export const createA6apiContent = offers => createOfferGuideContent(a6apiArticle, offers, 'A6API article');
