import { createGuideRefreshContent } from '../data/guideRefreshContent.js';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';
import { trackArticleService } from '../lib/articleServiceTracking';
import type { ArticleServiceOffer } from '../lib/articleServiceTracking';

export const ForeignCardGuideArticle = ({ offers }: { offers: ArticleServiceOffer[] }) => {
  const article = createGuideRefreshContent(offers)['guide-foreign-cards'];
  return <ImportedGuideArticle
    data={article as ArticleData}
    title={article.title}
    description={article.intro}
    eyebrow="Зарубежные карты"
    headingIds={article.headingIds}
    sourceAnchors={{}}
    related={[]}
    onServiceClick={(href, placement) => trackArticleService(offers, href, placement)}
  />;
};
