import { foreignCardArticle } from '../data/foreignCardArticle.js';
import { ImportedGuideArticle } from './ImportedGuideArticle';
import type { ArticleData } from './ImportedGuideArticle';

const title = 'Зарубежная карта с пополнением рублями: что выбрать';
const data: ArticleData = {
  title,
  sourceUrl: 'https://telegra.ph/51526126126216216-09-11',
  blocks: [
    ...foreignCardArticle.flatMap((section): ArticleData['blocks'] => [
      { type: 'heading', level: 2, text: section.heading },
      ...section.paragraphs.map(text => ({ type: 'paragraph' as const, content: [{ text }] })),
      ...(section.links || []).map(link => ({ type: 'paragraph' as const, content: [{ text: link.label, href: link.href }] })),
    ]),
  ],
};

export const ForeignCardGuideArticle = () => (
  <ImportedGuideArticle
    data={data}
    title={title}
    description="PGON, ВездеКарта и Zarub: пополнение через СБП или USDT, документы, курс и реальные расходы."
    eyebrow="Зарубежные карты"
    headingIds={Object.fromEntries(foreignCardArticle.map((section, index) => [section.heading, `cards-${index}`]))}
    sourceAnchors={{}}
    related={[
      { href: '/foreign-cards', label: 'Карты', title: 'Каталог зарубежных карт', description: 'Условия выпуска, пополнения и верификации.' },
      { href: '/crypto-exchange', label: 'Крипта', title: 'Покупка и продажа криптовалюты', description: 'Варианты обмена рублей и USDT.' },
    ]}
  />
);
