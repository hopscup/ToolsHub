import { ArrowLeft, BookOpen, Moon, Sun } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { BackgroundParticles } from './BackgroundParticles';
import { RelatedGuides } from './RelatedGuides';
import type { RelatedGuide } from './RelatedGuides';

type ArticleTheme = 'dark' | 'light';

type InlineSegment = {
  text: string;
  href?: string;
  strong?: boolean;
  em?: boolean;
};

type ArticleBlock =
  | { type: 'paragraph'; content: InlineSegment[] }
  | { type: 'heading'; level: number; text: string }
  | { type: 'callout'; level: number; text: string }
  | { type: 'list'; ordered: boolean; items: InlineSegment[][] }
  | { type: 'image'; src: string; alt: string; caption: string };

export type ArticleData = {
  title: string;
  sourceUrl: string;
  blocks: ArticleBlock[];
};

type ImportedGuideArticleProps = {
  data: ArticleData;
  title: string;
  description: string;
  eyebrow: string;
  headingIds: Record<string, string>;
  sourceAnchors: Record<string, string>;
  related: RelatedGuide[];
};

const ARTICLE_THEME_KEY = 'hopscup-article-theme';

const normalizeHref = (href: string | undefined, sourceAnchors: Record<string, string>) => {
  if (!href) return undefined;

  const hashIndex = href.indexOf('#');
  if (hashIndex >= 0) {
    const sourceHash = href.slice(hashIndex);
    if (sourceAnchors[sourceHash]) return `#${sourceAnchors[sourceHash]}`;
  }

  if (href.startsWith('https://') || href.startsWith('http://') || href.startsWith('mailto:')) {
    return href;
  }

  return undefined;
};

const InlineContent = ({
  content,
  sourceAnchors,
}: {
  content: InlineSegment[];
  sourceAnchors: Record<string, string>;
}) => (
  <>
    {content.map((segment, index) => {
      const safeHref = normalizeHref(segment.href, sourceAnchors);
      let node = <>{segment.text}</>;

      if (segment.strong) node = <strong>{node}</strong>;
      if (segment.em) node = <em>{node}</em>;

      if (safeHref) {
        const isLocalAnchor = safeHref.startsWith('#');
        node = (
          <a
            href={safeHref}
            {...(!isLocalAnchor ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="font-bold text-brand-purple underline decoration-brand-purple/35 underline-offset-4 transition-colors hover:text-white"
          >
            {node}
          </a>
        );
      }

      return <span key={`${index}-${segment.text.slice(0, 16)}`}>{node}</span>;
    })}
  </>
);

const ImportedImage = ({ src, alt, caption, index }: { key?: string; src: string; alt: string; caption: string; index: number }) => {
  const usefulAlt = alt || `Скриншот ${index + 1} из статьи`;
  return (
    <figure className="my-8">
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Открыть изображение: ${usefulAlt}`}
        className="block overflow-hidden rounded-2xl border border-white/10 bg-white transition-colors hover:border-brand-purple/45"
      >
        <img src={src} alt={usefulAlt} loading="lazy" decoding="async" className="block h-auto w-full" />
      </a>
      {caption && <figcaption className="mt-3 text-xs font-semibold leading-5 text-white/40">{caption}</figcaption>}
    </figure>
  );
};

export const ImportedGuideArticle = ({
  data,
  title,
  description,
  eyebrow,
  headingIds,
  sourceAnchors,
  related,
}: ImportedGuideArticleProps) => {
  const [theme, setTheme] = useState<ArticleTheme>(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem(ARTICLE_THEME_KEY) === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    window.localStorage.setItem(ARTICLE_THEME_KEY, theme);
    document.documentElement.dataset.articleTheme = theme;
    return () => {
      delete document.documentElement.dataset.articleTheme;
    };
  }, [theme]);

  const toc = useMemo(
    () => data.blocks
      .filter((block): block is Extract<ArticleBlock, { type: 'heading' }> => block.type === 'heading' && block.level === 2)
      .filter((block) => block.text !== 'Оглавление')
      .map((block) => ({ id: headingIds[block.text], label: block.text }))
      .filter((item) => Boolean(item.id)),
    [data.blocks, headingIds],
  );

  const isLight = theme === 'light';
  let imageIndex = 0;

  return (
    <div data-article-theme={theme} className="proxy-guide-article relative min-h-screen overflow-x-hidden bg-bg-dark text-white selection:bg-brand-purple selection:text-white">
      <div className="article-particles"><BackgroundParticles /></div>
      <div className="mesh-gradient" />

      <header className="article-header sticky top-0 z-40 border-b border-white/[0.07] bg-bg-dark/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
          <a href="/" aria-label="Hopscup's Tools Hub" className="flex min-w-0 items-center gap-3">
            <img src="/logo.webp" alt="Hopscup" className="h-10 w-10 shrink-0 rounded-xl border border-white/10 object-cover" />
            <span className="hidden truncate font-display text-sm font-bold text-white/80 sm:block">Hopscup's Tools Hub</span>
          </a>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(isLight ? 'dark' : 'light')}
              aria-label={isLight ? 'Включить темную тему' : 'Включить светлую тему'}
              title={isLight ? 'Темная тема' : 'Светлая тема'}
              className="article-theme-toggle inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:border-brand-purple/40 hover:text-brand-purple"
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <a href="/guides" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white/60 transition-colors hover:border-brand-purple/40 hover:text-white md:px-4">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">К гайдам</span>
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 pb-20">
        <section className="mx-auto max-w-5xl px-5 pb-12 pt-14 text-center md:px-8 md:pb-16 md:pt-20">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-brand-purple/25 bg-brand-purple/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">
            <BookOpen className="h-4 w-4" />
            {eyebrow}
          </div>
          <h1 className="mx-auto max-w-5xl font-display text-3xl font-black leading-[1.1] text-white md:text-5xl">{title}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-relaxed text-white/55 md:text-lg">{description}</p>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-5 md:px-8 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-center">
          <aside className="hidden lg:block">
            <nav className="article-toc sticky top-24 rounded-2xl border border-white/[0.08] bg-[#111111]/80 p-4 backdrop-blur-xl" aria-label="Содержание статьи">
              <p className="px-2 pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/25">Содержание</p>
              {toc.map(({ id, label }) => (
                <a key={id} href={`#${id}`} className="block rounded-lg px-2 py-2 text-xs font-semibold leading-5 text-white/45 transition-colors hover:bg-white/5 hover:text-brand-purple">{label}</a>
              ))}
            </nav>
          </aside>

          <article className="article-card min-w-0 rounded-[1.5rem] border border-white/[0.08] bg-[#0d0d0d]/90 px-5 py-7 shadow-2xl backdrop-blur-xl md:px-9 md:py-10">
            {data.blocks.map((block, blockIndex) => {
              if (block.type === 'image') {
                const currentImageIndex = imageIndex;
                imageIndex += 1;
                return (
                  <ImportedImage
                    key={`image-${blockIndex}`}
                    src={block.src}
                    alt={block.alt}
                    caption={block.caption}
                    index={currentImageIndex}
                  />
                );
              }

              if (block.type === 'heading') {
                const id = headingIds[block.text];
                const sharedClass = `${blockIndex > 0 ? 'mt-12 border-t border-white/[0.08] pt-10' : ''} scroll-mt-28 font-display font-black text-white`;
                if (block.level === 2) return <h2 key={`heading-${blockIndex}`} id={id} className={`${sharedClass} text-2xl md:text-3xl`}>{block.text}</h2>;
                return <h3 key={`heading-${blockIndex}`} id={id} className={`${sharedClass} text-xl md:text-2xl`}>{block.text}</h3>;
              }

              if (block.type === 'callout') {
                return <div key={`callout-${blockIndex}`} className="my-7 rounded-r-2xl border-l-2 border-brand-purple bg-brand-purple/[0.08] px-5 py-4 text-sm font-bold leading-7 text-white/70 md:text-base">{block.text}</div>;
              }

              if (block.type === 'list') {
                const List = block.ordered ? 'ol' : 'ul';
                return (
                  <List key={`list-${blockIndex}`} className={`my-6 space-y-3 pl-6 text-sm font-medium leading-7 text-white/65 marker:font-black marker:text-brand-purple md:text-base ${block.ordered ? 'list-decimal' : 'list-disc'}`}>
                    {block.items.map((item, itemIndex) => <li key={`item-${itemIndex}`}><InlineContent content={item} sourceAnchors={sourceAnchors} /></li>)}
                  </List>
                );
              }

              return (
                <p key={`paragraph-${blockIndex}`} className="my-5 text-sm font-medium leading-7 text-white/65 md:text-base">
                  <InlineContent content={block.content} sourceAnchors={sourceAnchors} />
                </p>
              );
            })}
            <RelatedGuides items={related} />
          </article>
        </div>
      </main>
    </div>
  );
};
