import freeAntidetectArticle from './freeAntidetectArticle.json' with { type: 'json' };
import shardxReviewArticle from './shardxReviewArticle.json' with { type: 'json' };
import { serviceCategoryRoutes } from './servicePresentation.js';

export { freeAntidetectArticle, shardxReviewArticle };
export const antidetectOverviewArticles = [freeAntidetectArticle, shardxReviewArticle];

export const createAntidetectOverviewContent = (source, offers) => {
  const resolve = value => {
    if (Array.isArray(value)) return value.map(resolve);
    if (!value || typeof value !== 'object') return value;
    const { serviceId, internal, ...rest } = value;
    const result = Object.fromEntries(Object.entries(rest).map(([key, item]) => [key, resolve(item)]));
    if (!serviceId) return result;
    const offer = offers.find(item => item.id === serviceId);
    if (!offer || (internal && !offer.slug)) throw new Error(`Missing antidetect overview article service: ${serviceId}`);
    return { ...result, href: internal ? `${serviceCategoryRoutes[offer.category]}/${offer.slug}` : offer.url };
  };
  const { checklist, ...article } = resolve(source);
  return { article, checklist };
};
