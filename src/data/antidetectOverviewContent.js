import freeAntidetectArticle from './freeAntidetectArticle.json' with { type: 'json' };
import shardxReviewArticle from './shardxReviewArticle.json' with { type: 'json' };
import { createOfferGuideContent } from './offerGuideContent.js';

export { freeAntidetectArticle, shardxReviewArticle };
export const antidetectOverviewArticles = [freeAntidetectArticle, shardxReviewArticle];

export const createAntidetectOverviewContent = (source, offers) => createOfferGuideContent(source, offers, 'antidetect overview article');
