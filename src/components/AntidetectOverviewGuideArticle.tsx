import { createOfferGuideContent } from '../data/offerGuideContent.js';
import { trackArticleService } from '../lib/articleServiceTracking';
import type { ArticleServiceOffer } from '../lib/articleServiceTracking';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';

export const AntidetectOverviewGuideArticle = ({ source, offers }: { source: object; offers: ArticleServiceOffer[] }) => {
  const { article, checklist } = createOfferGuideContent(source, offers, 'antidetect overview article');
  return <ImportedGuideArticle
    data={article as ArticleData} title={article.title} description={article.intro}
    eyebrow="Гайд Hopscup" headingIds={article.headingIds} sourceAnchors={{}} related={[]}
    checklist={checklist} onServiceClick={(href, placement) => trackArticleService(offers, href, placement)}
  />;
};
