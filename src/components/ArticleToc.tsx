import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { mountArticleAnchors } from '../lib/articleAnchors.js';

export const ArticleToc = ({ items }: { items: { id: string; label: string }[] }) => {
  const container = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = container.current?.closest<HTMLElement>('.proxy-guide-article');
    if (root) return mountArticleAnchors(root);
  }, []);
  const links = items.map(({ id, label }) => (
    <a key={id} href={`#${id}`} className="block rounded-lg px-2 py-2 text-xs font-semibold leading-5 text-white/45 transition-colors hover:bg-white/5 hover:text-brand-purple">{label}</a>
  ));
  return <aside ref={container}>
    <nav className="article-toc sticky top-24 hidden rounded-2xl border border-white/[0.08] bg-[#111111]/80 p-4 backdrop-blur-xl lg:block" aria-label="Содержание статьи">
      <p className="px-2 pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/25">Содержание</p>
      {links}
    </nav>
    <details data-article-toc className="article-toc rounded-2xl border border-white/[0.08] bg-[#111111]/80 p-4 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold text-white/65">Содержание<ChevronDown aria-hidden="true" className="h-4 w-4" /></summary>
      <nav className="pt-3" aria-label="Содержание статьи">{links}</nav>
    </details>
  </aside>;
};
