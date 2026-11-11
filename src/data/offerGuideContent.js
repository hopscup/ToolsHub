import { serviceCategoryRoutes } from './servicePresentation.js';

export const createOfferGuideContent = (source, offers, context = 'guide') => {
  const resolve = value => {
    if (Array.isArray(value)) return value.map(resolve);
    if (!value || typeof value !== 'object') return value;
    const { serviceId, internal, ...rest } = value;
    const result = Object.fromEntries(Object.entries(rest).map(([key, item]) => [key, resolve(item)]));
    if (!serviceId) return result;
    const offer = offers.find(item => item.id === serviceId);
    if (!offer || (internal && !offer.slug)) throw new Error(`Missing ${context} service: ${serviceId}`);
    return { ...result, href: internal ? `${serviceCategoryRoutes[offer.category]}/${offer.slug}` : offer.url };
  };
  const { checklist, ...article } = resolve(source);
  return { article, checklist };
};
