import { claudeRecoveryArticle } from '../data/claudeRecoveryArticle.js';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';

export const ClaudeRecoveryGuideArticle = () => (
  <ImportedGuideArticle
    data={claudeRecoveryArticle as ArticleData}
    title={claudeRecoveryArticle.title}
    description={claudeRecoveryArticle.intro}
    eyebrow="Claude"
    headingIds={claudeRecoveryArticle.headingIds}
    sourceAnchors={{}}
    related={[]}
  />
);
