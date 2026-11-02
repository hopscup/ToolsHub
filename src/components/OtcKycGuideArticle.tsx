import otcKycArticle from '../data/otcKycArticle.json';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';

const HEADING_IDS = otcKycArticle.headingIds;

const SOURCE_ANCHORS = {
  '#UTzQ': HEADING_IDS['OTC площадки и KYC сервисы'],
  '#hGdu': HEADING_IDS['Как проходит сделка'],
  '#oSwi': HEADING_IDS['Подводные камни'],
  '#nDPT': HEADING_IDS['Ссылки на KYC и OTC'],
  '#hPmh': HEADING_IDS.Вывод,
};

export const OtcKycGuideArticle = () => (
  <ImportedGuideArticle
    data={otcKycArticle as ArticleData}
    title="OTC-площадки и KYC-сервисы в крипте"
    description="Как устроены OTC-сделки, где искать площадки и сервисы, какие риски учитывать при работе с верификациями и WL."
    eyebrow="Гайд Hopscup по крипте"
    headingIds={HEADING_IDS}
    sourceAnchors={SOURCE_ANCHORS}
    related={[]}
    footerVariant="compact"
  />
);
