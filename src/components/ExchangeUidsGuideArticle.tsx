import { createGuideRefreshContent, exchangeRegistrationServices } from '../data/guideRefreshContent.js';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';
import { trackArticleService } from '../lib/articleServiceTracking';
import type { ArticleServiceOffer } from '../lib/articleServiceTracking';

export const ExchangeUidsGuideArticle = ({ offers }: { offers: ArticleServiceOffer[] }) => {
  const article = createGuideRefreshContent(offers)['guide-uids-addresses'];
  return <ImportedGuideArticle
    data={article as ArticleData}
    title={article.title}
    description={article.intro}
    eyebrow="Практический гайд Hopscup"
    headingIds={article.headingIds}
    sourceAnchors={{}}
    related={[]}
    onServiceClick={(href, placement) => trackArticleService([...offers, ...exchangeRegistrationServices], href, placement)}
  />;
};
