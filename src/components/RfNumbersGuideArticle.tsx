import { createRfNumbersContent } from '../data/rfNumbersContent.js';
import { trackArticleService } from '../lib/articleServiceTracking';
import type { ArticleServiceOffer } from '../lib/articleServiceTracking';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';

export const RfNumbersGuideArticle = ({ offers }: { offers: ArticleServiceOffer[] }) => {
  const { article, checklist } = createRfNumbersContent(offers);
  return <ImportedGuideArticle
    data={article as ArticleData} title={article.title} description={article.intro}
    eyebrow="Гайд Hopscup" headingIds={article.headingIds} sourceAnchors={{}} related={[]}
    checklist={checklist} onServiceClick={(href, placement) => trackArticleService(offers, href, placement)}
  />;
};
