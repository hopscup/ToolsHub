import { createAccountFarmContent } from '../data/accountFarmContent.js';
import { trackAnalyticsEvent } from '../analytics';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';

type GuideOffer = { id: string; name: string; url: string; category: string; slug?: string };

export const AccountFarmGuideArticle = ({ offers }: { offers: GuideOffer[] }) => {
  const { article, checklist } = createAccountFarmContent(offers);
  return (
    <ImportedGuideArticle
      data={article as ArticleData}
      title={article.title}
      description={article.intro}
      eyebrow="Большой гайд Hopscup"
      headingIds={article.headingIds}
      sourceAnchors={{}}
      related={[]}
      checklist={checklist}
      onServiceClick={(href, placement) => {
        const offer = offers.find(item => item.url === href);
        if (!offer || !href.startsWith('https://')) return;
        trackAnalyticsEvent('service_click', { service_id: offer.id, service_name: offer.name, category: offer.category, destination: 'website', link_url: href, placement, language: 'ru' });
      }}
    />
  );
};
