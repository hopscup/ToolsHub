import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Info,
  Monitor,
  Moon,
  Smartphone,
  Sun,
  Usb,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { BackgroundParticles } from './BackgroundParticles';
import { ArticleChecklist } from './ArticleChecklist';
import { ArticleSocialFooter } from './ArticleSocialFooter';
import { ArticleImageLink } from './ArticleImageLink';
import { getExternalLinkRel } from '../lib/externalLinks.js';
import { trackAnalyticsEvent } from '../analytics';
import { proxyProviders } from '../data/proxyGuideContent.js';
import { mobileIpGuideMeta, mobileIpGuideBlocks, mobileIpGuideToc, mobileIpChecklist, mobileIpProvider } from '../data/mobileIpGuideContent.js';

type ArticleTheme = 'dark' | 'light';

const ARTICLE_THEME_KEY = 'hopscup-article-theme';

type Segment = { text: string; href?: string };
type MobileIpBlock =
  | { type: 'heading'; id: string; text: string; level: number }
  | { type: 'paragraph'; content: Segment[] }
  | { type: 'image'; src: string; alt: string; caption: string; compact: boolean }
  | { type: 'quote'; text: string; warning?: boolean }
  | { type: 'info'; heading: string; text: string }
  | { type: 'step'; icon: string; heading: string; text: string }
  | { type: 'links'; links: { label: string; href: string }[]; primary?: boolean }
  | { type: 'list'; items: Segment[][] }
  | { type: 'mobile-cta' | 'checklist' };
const articleBlocks = mobileIpGuideBlocks as MobileIpBlock[];

const trackService = (href: string, placement: string) => {
  const provider = proxyProviders.find(provider => provider.url === href);
  if (!provider) return;
  trackAnalyticsEvent('service_click', {
    service_name: provider.name, service_id: provider.id, category: 'Proxy',
    destination: 'website', link_url: href, placement, language: 'ru',
    promo_code: provider.promoCode, promo_discount: provider.promoDiscount,
  });
};

const InlineContent = ({ content }: { content: Segment[] }) => <>{content.map((part, index) => part.href
  ? <a key={index} href={part.href} {...(part.href.startsWith('https://') ? {
    target: '_blank', rel: getExternalLinkRel(part.href), onClick: () => trackService(part.href!, 'article_cta'),
  } : {})} className="font-bold text-brand-purple underline underline-offset-4">{part.text}</a>
  : <span key={index}>{part.text}</span>)}</>;

const ArticleImage = ({ src, alt, caption, compact = false }: { key?: number; src: string; alt: string; caption: string; compact?: boolean }) => (
  <figure className={`my-8 ${compact ? 'mx-auto max-w-md' : ''}`}>
    <ArticleImageLink
      src={src} alt={alt} caption={caption}
      className="block overflow-hidden rounded-2xl border border-white/10 bg-white transition-colors hover:border-brand-purple/40"
    >
      <img src={src} alt={alt} loading="lazy" decoding="async" className="block h-auto w-full" />
    </ArticleImageLink>
    <figcaption className="mt-3 text-xs font-semibold leading-5 text-white/40">{caption}</figcaption>
  </figure>
);

const GuideQuote = ({ children, warning = false }: { key?: number; children: ReactNode; warning?: boolean }) => (
  <blockquote className={`my-6 rounded-r-2xl border-l-2 px-5 py-4 text-sm font-semibold leading-7 md:text-base ${warning ? 'border-brand-orange bg-brand-orange/[0.06] text-white/65' : 'border-brand-purple bg-brand-purple/[0.07] text-white/65'}`}>
    {children}
  </blockquote>
);

export const MobileIpGuideArticle = () => {
  const [copied, setCopied] = useState(false);
  const copyPromo = async () => {
    try {
      await navigator.clipboard.writeText(mobileIpProvider.promoCode);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = mobileIpProvider.promoCode;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopied(true);
    trackAnalyticsEvent('promo_copy', {
      service_name: mobileIpProvider.name, service_id: mobileIpProvider.id, category: 'Proxy',
      placement: 'article_cta', language: 'ru', promo_code: mobileIpProvider.promoCode,
      promo_discount: mobileIpProvider.promoDiscount,
    });
    window.setTimeout(() => setCopied(false), 1800);
  };
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

  const isLight = theme === 'light';

  return (
    <div
      data-article-theme={theme}
      className="proxy-guide-article relative min-h-screen overflow-x-hidden bg-bg-dark text-white selection:bg-brand-purple selection:text-white"
    >
      <div className="article-particles"><BackgroundParticles /></div>
      <div className="mesh-gradient" />

      <header className="article-header sticky top-0 z-40 border-b border-white/[0.07] bg-bg-dark/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <a href="/" aria-label="Hopscup's Tools Hub" className="flex items-center gap-3">
            <img src="/logo.webp" alt="Hopscup" className="h-10 w-10 rounded-xl border border-white/10 object-cover" />
            <span className="hidden font-display text-sm font-bold text-white/80 sm:block">Hopscup's Tools Hub</span>
          </a>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(isLight ? 'dark' : 'light')}
              aria-label={isLight ? 'Включить темную тему' : 'Включить светлую тему'}
              title={isLight ? 'Темная тема' : 'Светлая тема'}
              className="article-theme-toggle inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:border-brand-purple/40 hover:text-brand-purple"
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <a href="/guides" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white/60 transition-colors hover:border-brand-purple/40 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              К гайдам
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 pb-20">
        <section className="mx-auto max-w-5xl px-5 pb-12 pt-14 text-center md:px-8 md:pb-16 md:pt-20">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-brand-purple/25 bg-brand-purple/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">
            <Smartphone className="h-4 w-4" />
            Практический гайд Hopscup
          </div>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-black leading-[1.08] text-white md:text-6xl">
            {mobileIpGuideMeta.heading}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/55 md:text-lg">
            {mobileIpGuideMeta.subtitle}
          </p>
          <ArticleImageLink src={mobileIpGuideMeta.cover.src} alt={mobileIpGuideMeta.cover.alt}
            className="mx-auto mt-8 block max-w-3xl overflow-hidden rounded-2xl border border-white/10">
            <img src={mobileIpGuideMeta.cover.src} alt={mobileIpGuideMeta.cover.alt} width={mobileIpGuideMeta.cover.width} height={mobileIpGuideMeta.cover.height}
              fetchPriority="high" decoding="async" className="block h-auto w-full" />
          </ArticleImageLink>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-5 md:px-8 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-center">
          <aside className="hidden lg:block">
            <nav className="article-toc sticky top-24 rounded-2xl border border-white/[0.08] bg-[#111111]/80 p-4 backdrop-blur-xl" aria-label="Содержание статьи">
              <p className="px-2 pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/25">Содержание</p>
              {mobileIpGuideToc.map(({ id, label }) => (
                <a key={id} href={`#${id}`} className="block rounded-lg px-2 py-2 text-xs font-semibold text-white/45 transition-colors hover:bg-white/5 hover:text-brand-purple">
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          <article className="article-card min-w-0 rounded-[1.5rem] border border-white/[0.08] bg-[#0d0d0d]/90 px-5 py-7 shadow-2xl backdrop-blur-xl md:px-9 md:py-10">
            {articleBlocks.map((block, index) => {
              if (block.type === 'heading') {
                const Heading = block.level === 3 ? 'h3' : 'h2';
                return <Heading key={index} id={block.id}
                  className={['scroll-mt-28 font-display font-black text-white',
                    block.level === 3 ? 'mt-7 text-xl' : 'text-2xl md:text-3xl',
                    block.level === 2 && index > 0 ? 'mt-12 border-t border-white/[0.08] pt-10' : '',
                  ].join(' ')}>{block.text}</Heading>;
              }
              if (block.type === 'paragraph') return <p key={index} className="mt-4 text-sm font-medium leading-7 text-white/65 md:text-base"><InlineContent content={block.content} /></p>;
              if (block.type === 'image') return <ArticleImage key={index} {...block} />;
              if (block.type === 'quote') return <GuideQuote key={index} warning={block.warning}>{block.text}</GuideQuote>;
              if (block.type === 'info') return (
                <div key={index} className="my-6 flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                  <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                  <div><h3 className="text-sm font-bold text-white">{block.heading}</h3><p className="mt-2 text-sm font-bold leading-6 text-white/65">{block.text}</p></div>
                </div>
              );
              if (block.type === 'step') {
                const Icon = block.icon === 'usb' ? Usb : Monitor;
                return <div key={index} className="mt-7 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-purple/20 bg-brand-purple/10">
                    <Icon aria-hidden="true" className="h-5 w-5 text-brand-purple" />
                  </div>
                  <div><h3 className="font-display text-lg font-bold text-white">{block.heading}</h3><p className="mt-2 text-sm font-medium leading-6 text-white/55">{block.text}</p></div>
                </div>;
              }
              if (block.type === 'links') return <div key={index} className={block.primary ? 'mt-6' : 'mt-6 grid gap-3 sm:grid-cols-2'}>
                {block.links.map(link => <a key={link.href} href={link.href} target="_blank" rel={getExternalLinkRel(link.href)}
                  className={block.primary
                    ? 'inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white hover:text-brand-purple'
                    : 'flex min-h-14 items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm font-bold text-white/65 transition-colors hover:border-brand-purple/40 hover:text-white'}>
                  {link.label}<ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
                </a>)}
              </div>;
              if (block.type === 'list') return <ul key={index} className="mt-6 list-disc space-y-3 pl-6 text-sm font-medium leading-7 text-white/65 marker:text-brand-purple md:text-base">
                {block.items.map((item, itemIndex) => <li key={itemIndex}><InlineContent content={item} /></li>)}
              </ul>;
              if (block.type === 'mobile-cta') return <div key={index} className="mt-6 flex flex-wrap items-center gap-3">
                <a href={mobileIpProvider.url} target="_blank" rel={getExternalLinkRel(mobileIpProvider.url)}
                  onClick={() => trackService(mobileIpProvider.url, 'article_cta')}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white hover:text-brand-purple">
                  Перейти в MobileProxy<ExternalLink aria-hidden="true" className="h-4 w-4" />
                </a>
                <button type="button" onClick={() => void copyPromo()} aria-label="Скопировать промокод MobileProxy"
                  className="inline-flex min-h-11 items-center gap-3 rounded-xl border border-brand-purple/30 bg-brand-purple/10 px-4 py-3 text-sm font-bold text-brand-purple transition-colors hover:bg-brand-purple/20">
                  {copied ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
                  <span>{mobileIpProvider.promoCode}</span><span>{mobileIpProvider.promoDiscount}</span>
                  <span className="sr-only" aria-live="polite">{copied ? 'Скопировано' : ''}</span>
                </button>
              </div>;
              if (block.type === 'checklist') return <ArticleChecklist key={index} {...mobileIpChecklist} onExternalClick={href => trackService(href, 'article_summary')} />;
              return null;
            })}
            <ArticleSocialFooter variant="compact" />
          </article>
        </div>
      </main>
    </div>
  );
};
