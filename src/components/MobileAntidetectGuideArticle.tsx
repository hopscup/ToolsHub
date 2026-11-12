import { createMobileAntidetectContent } from '../data/mobileAntidetectContent.js';
import { trackArticleService } from '../lib/articleServiceTracking';
import type { ArticleServiceOffer } from '../lib/articleServiceTracking';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';

export const MobileAntidetectGuideArticle = ({ offers }: { offers: ArticleServiceOffer[] }) => {
  const { article, checklist } = createMobileAntidetectContent(offers);
  return <ImportedGuideArticle
    data={article as ArticleData} title={article.title} description={article.intro}
    eyebrow="Гайд Hopscup" headingIds={article.headingIds} sourceAnchors={{}} related={[]}
    checklist={checklist} onServiceClick={(href, placement) => trackArticleService(offers, href, placement)}
  />;
};
