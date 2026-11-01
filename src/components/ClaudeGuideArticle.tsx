import { claudeGuideArticle, claudeGuideHeadingIds } from '../data/claudeGuideArticle.js';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';

export const ClaudeGuideArticle = () => (
  <ImportedGuideArticle
    data={claudeGuideArticle as ArticleData}
    title={claudeGuideArticle.title}
    description={claudeGuideArticle.previewDescription}
    eyebrow="Claude"
    headingIds={claudeGuideHeadingIds}
    sourceAnchors={{}}
    related={[]}
  />
);
