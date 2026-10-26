import { discordTokenArticle } from '../data/discordTokenArticle.js';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';

const headingIds = {
  'Что такое токен Discord и где он в файле': 'token',
  'Как сменить токен Discord': 'reset-token',
  'Как войти через Discord Token Login': 'extension',
  'Вход по токену через F12, если расширение не работает': 'f12',
  'Почему не получается войти по токену': 'troubleshooting',
  'Как достать токен из своего аккаунта Discord': 'network',
};

export const DiscordTokenGuideArticle = () => (
  <ImportedGuideArticle
    data={discordTokenArticle as ArticleData}
    title={discordTokenArticle.title}
    description={discordTokenArticle.description}
    eyebrow="Discord"
    headingIds={headingIds}
    sourceAnchors={{}}
    related={[]}
  />
);
