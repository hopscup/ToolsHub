import otcKycArticle from '../data/otcKycArticle.json';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';

const HEADING_IDS = {
  'Оглавление': 'contents',
  'OTC площадки и KYC сервисы': 'otc-ploschadki-i-kyc-servisy',
  'Как проходит сделка': 'kak-prohodit-sdelka',
  'KYC сервисы еще проще': 'kyc-servisy-esche-prosche',
  'Подводные камни': 'podvodnye-kamni',
  'Ссылки на KYC и OTC': 'ssylki-na-kyc-i-otc',
  'Вывод': 'vyvod',
};

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
    related={[
      { href: '/guides/exchange-uids-addresses', label: 'Биржи', title: 'Субаккаунты, UID и адреса Bitget и OKX', description: 'Как получить отдельные UID и депозитные адреса.' },
      { href: '/crypto-exchange', label: 'Обмен', title: 'Криптообменники', description: 'Сервисы для обмена и вывода криптовалюты.' },
      { href: '/foreign-cards', label: 'Оплата', title: 'Зарубежные карты', description: 'Карты и сервисы для оплаты зарубежных площадок.' },
    ]}
  />
);
