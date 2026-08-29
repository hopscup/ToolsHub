import accountFarmArticle from '../data/accountFarmArticle.json';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';

const HEADING_IDS = {
  'Навигация': 'navigation',
  'Где покупать соц. акки': 'gde-pokupat-soc-akki',
  'Twitter': 'twitter',
  'Discord': 'discord',
  'Gmail': 'gmail',
  'СМС активаторы / виртуальные номера': 'sms-aktivatory-virtualnye-nomera',
  'Где накручивать активности': 'gde-nakruchivat-aktivnosti',
  'Прокси/модем': 'proksi-modem',
  'Антики': 'antiki',
};

const SOURCE_ANCHORS = {
  '#kj0f': HEADING_IDS['Где покупать соц. акки'],
  '#bPWB': HEADING_IDS.Twitter,
  '#X9kD': HEADING_IDS.Discord,
  '#NSGW': HEADING_IDS.Gmail,
  '#AjTu': HEADING_IDS['СМС активаторы / виртуальные номера'],
  '#8C3h': HEADING_IDS['Где накручивать активности'],
  '#DVDz': HEADING_IDS['Прокси/модем'],
  '#tw7f': HEADING_IDS.Антики,
};

export const AccountFarmGuideArticle = () => (
  <ImportedGuideArticle
    data={accountFarmArticle as ArticleData}
    title="Ферма аккаунтов: Discord, Twitter и Google"
    description="Где брать аккаунты, почты и виртуальные номера, как выбирать прокси, антидетекты и сервисы для активности."
    eyebrow="Большой гайд Hopscup"
    headingIds={HEADING_IDS}
    sourceAnchors={SOURCE_ANCHORS}
    related={[
      { href: '/proxy-vpn/luchshie-proksi', label: 'Прокси', title: 'Какие прокси выбрать для аккаунтов', description: 'Сравнение типов прокси и семи сервисов на практических сценариях.' },
      { href: '/antidetect', label: 'Антидетекты', title: 'Браузеры для управления профилями', description: 'ПК, усиленные и мобильные решения в одной подборке.' },
      { href: '/guides/mobile-ip-airplane-mode', label: 'Мобильный IP', title: 'Смена IP режимом самолета', description: 'Раздача мобильного интернета на компьютер через USB.' },
      { href: '/guides/gmail-forwarding', label: 'Почта', title: 'Переадресация писем из Gmail', description: 'Настройка автоматической пересылки на другой ящик.' },
    ]}
  />
);
