import { InlineContent } from './ImportedGuideArticle';
import type { ArticleBlock } from './ImportedGuideArticle';

export const AiSectionContent = ({ blocks }: { blocks: ArticleBlock[] }) => <div data-ai-section-content className="space-y-6 text-sm font-medium leading-7 text-white/65 md:text-base">
  {blocks.map((block, index) => {
    if (block.type === 'heading') return <h2 key={index} className="pt-5 font-display text-xl font-black text-white md:text-2xl">{block.text}</h2>;
    if (block.type === 'paragraph') return <p key={index}><InlineContent content={block.content} sourceAnchors={{}} /></p>;
    if (block.type === 'list') return <ul key={index} className="list-disc space-y-3 pl-5 marker:text-brand-purple">{block.items.map((item, i) => <li key={i}><InlineContent content={item} sourceAnchors={{}} /></li>)}</ul>;
    if (block.type === 'table') return <div key={index} data-ai-comparison className="max-w-full overflow-x-auto rounded-lg border border-white/10" role="region" aria-label="Сравнение нейросетей" tabIndex={0}>
      <table className="w-full min-w-[780px] border-collapse text-left text-sm leading-6">
        <thead className="bg-white/[0.04] text-white"><tr>{block.headers.map((cell, i) => <th scope="col" key={i} className="border-b border-white/10 px-4 py-3"><InlineContent content={cell} sourceAnchors={{}} /></th>)}</tr></thead>
        <tbody>{block.rows.map((row, i) => <tr key={i} className="border-b border-white/[0.07] last:border-0">{row.map((cell, j) => <td key={j} className="px-4 py-3 align-top"><InlineContent content={cell} sourceAnchors={{}} /></td>)}</tr>)}</tbody>
      </table>
    </div>;
    return null;
  })}
</div>;
