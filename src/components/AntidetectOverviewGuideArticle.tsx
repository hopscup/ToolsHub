import { antidetectOverviewArticles, createAntidetectOverviewContent } from '../data/antidetectOverviewContent.js';
import { trackArticleService } from '../lib/articleServiceTracking';
import type { ArticleServiceOffer } from '../lib/articleServiceTracking';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';

export const AntidetectOverviewGuideArticle = ({ id, offers }: { id: string; offers: ArticleServiceOffer[] }) => {
  const source = antidetectOverviewArticles.find(item => item.id === id);
  if (!source) throw new Error(`Unknown antidetect overview article: ${id}`);
  const { article, checklist } = createAntidetectOverviewContent(source, offers);
  return <ImportedGuideArticle
    data={article as ArticleData} title={article.title} description={article.intro}
    eyebrow="Гайд Hopscup" headingIds={article.headingIds} sourceAnchors={{}} related={[]}
    checklist={checklist} onServiceClick={(href, placement) => trackArticleService(offers, href, placement)}
  />;
};
