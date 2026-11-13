import { createA6apiContent } from '../data/a6apiContent.js';
import { trackArticleService } from '../lib/articleServiceTracking';
import type { ArticleServiceOffer } from '../lib/articleServiceTracking';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';

export const A6apiGuideArticle = ({ offers }: { offers: ArticleServiceOffer[] }) => {
  const { article, checklist } = createA6apiContent(offers);
  return <ImportedGuideArticle
    data={article as ArticleData} title={article.title} description={article.intro}
    eyebrow="Гайд Hopscup" headingIds={article.headingIds} sourceAnchors={{}} related={[]}
    checklist={checklist} onServiceClick={(href, placement) => trackArticleService(offers, href, placement)}
  />;
};
