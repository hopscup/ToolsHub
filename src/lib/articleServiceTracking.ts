import { trackAnalyticsEvent } from '../analytics';

export type ArticleServiceOffer = { id: string; name: string; url: string; category: string; slug?: string };

export const trackArticleService = (offers: ArticleServiceOffer[], href: string, placement: string) => {
  const offer = offers.find(offer => offer.url === href);
  if (!offer || !href.startsWith('https://')) return;
  trackAnalyticsEvent('service_click', { service_id: offer.id, service_name: offer.name, category: offer.category, destination: 'website', link_url: href, placement, language: 'ru' });
};
