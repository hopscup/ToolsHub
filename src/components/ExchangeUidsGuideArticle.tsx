import exchangeUidsArticle from '../data/exchangeUidsArticle.json';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';

const HEADING_IDS = {
  Bitget: 'bitget',
  OKX: 'okx',
};

export const ExchangeUidsGuideArticle = () => (
  <ImportedGuideArticle
    data={exchangeUidsArticle as ArticleData}
    title="Как создать много UID и адресов на Bitget и OKX"
    description="Как создать субаккаунты с отдельными UID и депозитными адресами на Bitget и OKX."
    eyebrow="Практический гайд Hopscup"
    headingIds={HEADING_IDS}
    sourceAnchors={{}}
    related={[
      { href: '/guides/crypto-otc-kyc', label: 'Крипта', title: 'OTC-площадки и KYC-сервисы', description: 'Как устроены сделки, верификации и работа с WL.' },
      { href: '/crypto-exchange', label: 'Обмен', title: 'Криптообменники', description: 'Подборка сервисов для покупки, обмена и вывода криптовалюты.' },
      { href: '/guides/gmail-forwarding', label: 'Почта', title: 'Переадресация писем из Gmail', description: 'Как собрать уведомления нескольких аккаунтов в одном ящике.' },
    ]}
  />
);
