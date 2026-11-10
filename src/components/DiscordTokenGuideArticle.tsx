import { createGuideRefreshContent } from '../data/guideRefreshContent.js';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';
import { trackArticleService } from '../lib/articleServiceTracking';
import type { ArticleServiceOffer } from '../lib/articleServiceTracking';

export const DiscordTokenGuideArticle = ({ offers }: { offers: ArticleServiceOffer[] }) => {
  const article = createGuideRefreshContent(offers)['guide-discord-token'];
  return <ImportedGuideArticle
    data={article as ArticleData}
    title={article.title}
    description={article.description}
    eyebrow="Discord"
    headingIds={article.headingIds}
    sourceAnchors={{}}
    related={[]}
    onServiceClick={(href, placement) => trackArticleService(offers, href, placement)}
  />;
};
