import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Fingerprint,
  Globe2,
  Moon,
  Network,
  Sun,
  TriangleAlert,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { BackgroundParticles } from './BackgroundParticles';
import { ArticleChecklist } from './ArticleChecklist';
import { ArticleSocialFooter } from './ArticleSocialFooter';
import { ArticleImageLink } from './ArticleImageLink';
import { articleFallbackContent } from '../data/articleFallbackContent.js';
import { antidetectSetupMeta, antidetectSetupCopy as copy, antidetectSetupAdditions as additions, antidetectVideoUrl as VIDEO_GUIDE_URL, getAntidetectGuideServices, resolveAntidetectGuideSegments, createAntidetectGuideChecklist } from '../data/antidetectSetupContent.js';
import { getExternalLinkRel } from '../lib/externalLinks.js';
import { trackAnalyticsEvent } from '../analytics';

type ArticleTheme = 'dark' | 'light';

const ARTICLE_THEME_KEY = 'hopscup-article-theme';

const GuideNote = ({ children, warning = false }: { children: ReactNode; warning?: boolean }) => (
  <div className={`my-6 rounded-r-2xl border-l-2 px-5 py-4 text-sm font-semibold leading-7 md:text-base ${warning ? 'border-brand-orange bg-brand-orange/[0.06] text-white/65' : 'border-brand-purple bg-brand-purple/[0.07] text-white/65'}`}>
    {children}
  </div>
);

const StepItem = ({ children }: { key?: string; children: ReactNode }) => (
  <li className="flex items-start gap-3 text-sm font-medium leading-7 text-white/65 md:text-base">
    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-purple" />
    <span>{children}</span>
  </li>
);

const SettingRow = ({ name, value }: { key?: string; name: string; value: ReactNode }) => (
  <div className="grid gap-2 border-b border-white/[0.07] py-4 last:border-b-0 sm:grid-cols-[160px_1fr] sm:gap-6">
    <dt className="text-xs font-black uppercase text-white/35">{name}</dt>
    <dd className="text-sm font-semibold leading-6 text-white/70">{value}</dd>
  </div>
);

const BrowserHeading = ({ logo, name, children }: { logo: string; name: string; children: ReactNode }) => (
  <div className="flex items-start gap-4">
    <img src={logo} alt={name} className="h-12 w-12 shrink-0 rounded-xl border border-white/10 object-cover" />
    <div>
      <h2 className="font-display text-2xl font-black text-white md:text-3xl">{name}</h2>
      <p className="mt-2 text-sm font-medium leading-6 text-white/50">{children}</p>
    </div>
  </div>
);

const ArticleScreenshot = ({ src, alt, caption }: { src: string; alt: string; caption: string }) => (
  <figure className="my-8 min-w-0">
    <ArticleImageLink
      src={src} alt={alt} caption={caption}
      className="block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-colors hover:border-brand-purple/40"
    >
      <img src={src} alt={alt} loading="lazy" decoding="async" className="block h-auto w-full" />
    </ArticleImageLink>
    <figcaption className="mt-3 text-xs font-semibold leading-5 text-white/40">{caption}</figcaption>
  </figure>
);

type GuideOffer = { id: string; name: string; url: string; category: string; slug?: string };

export const AntidetectSetupGuideArticle = ({ offers }: { offers: GuideOffer[] }) => {
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
  const services = getAntidetectGuideServices(offers);
  const checklist = createAntidetectGuideChecklist(offers);
  const trackService = (href: string, placement: string) => {
    const offer = offers.find(offer => offer.url === href);
    if (!offer || href.startsWith('/')) return;
    trackAnalyticsEvent('service_click', { service_id: offer.id, service_name: offer.name, category: offer.category, destination: 'website', link_url: href, placement, language: 'ru' });
  };
  const inline = (parts: { text: string; href?: string; strong?: boolean }[], placement?: string) => parts.map((part, index) => {
    const text = part.strong ? <strong className="font-black text-white/80">{part.text}</strong> : part.text;
    return part.href ? <a key={index} href={part.href}
      {...(part.href.startsWith('https://') ? { target: '_blank', rel: getExternalLinkRel(part.href), onClick: () => placement && trackService(part.href, placement) } : {})}
      className="font-bold text-brand-purple transition-colors hover:text-white hover:underline">{text}</a> : <span key={index}>{text}</span>;
  });

  return (
    <div
      data-antidetect-setup
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
              aria-label={isLight ? 'Включить тёмную тему' : 'Включить светлую тему'}
              title={isLight ? 'Тёмная тема' : 'Светлая тема'}
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
            <Fingerprint className="h-4 w-4" />
            Практический гайд Hopscup
          </div>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-black leading-[1.08] text-white md:text-6xl">{articleFallbackContent.antidetect.title}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-relaxed text-white/55 md:text-lg">{articleFallbackContent.antidetect.intro}</p>
          <ArticleImageLink src={antidetectSetupMeta.cover.src} alt={antidetectSetupMeta.cover.alt} className="mx-auto mt-8 block max-w-3xl overflow-hidden rounded-2xl border border-white/10">
            <img src={antidetectSetupMeta.cover.src} alt={antidetectSetupMeta.cover.alt} width={antidetectSetupMeta.cover.width} height={antidetectSetupMeta.cover.height} fetchPriority="high" decoding="async" className="block h-auto w-full" />
          </ArticleImageLink>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-5 md:px-8 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-center">
          <aside className="hidden lg:block">
            <nav className="article-toc sticky top-24 rounded-2xl border border-white/[0.08] bg-[#111111]/80 p-4 backdrop-blur-xl" aria-label="Содержание статьи">
              <p className="px-2 pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/25">Содержание</p>
              {[
                ['#how-it-works', 'Что меняет антидетект'],
                ['#where-proxy', 'Где взять прокси'],
                ['#common-settings', 'Что перепроверить'],
                ['#free-antidetect', 'Бесплатные антидетекты'],
                ['#dolphin', 'Dolphin Anty'],
                ['#adspower', 'AdsPower'],
                ['#shardx', 'ShardX'],
                ['#connect-proxy', 'Подключаем прокси'],
                ['#check', 'Проверка профиля'],
                ['#mistakes', 'Частые ошибки'],
                ['#start', 'Коротко: что делать'],
              ].map(([href, label]) => (
                <a key={href} href={href} className="block rounded-lg px-2 py-2 text-xs font-semibold text-white/45 transition-colors hover:bg-white/5 hover:text-brand-purple">
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          <article className="article-card min-w-0 rounded-[1.5rem] border border-white/[0.08] bg-[#0d0d0d]/90 px-5 py-7 shadow-2xl backdrop-blur-xl md:px-9 md:py-10">
            <section id="how-it-works" className="scroll-mt-28">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Сначала база</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Антидетект и прокси делают разную работу</h2>
              <p className="mt-5 text-sm font-medium leading-7 text-white/65 md:text-base">
                {inline(copy.foundation)}
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Fingerprint, ...copy.roles[0] },
                  { icon: Network, ...copy.roles[1] },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-5">
                    <Icon className="h-5 w-5 text-brand-purple" />
                    <h3 className="mt-4 text-sm font-black text-white">{title}</h3>
                    <p className="mt-2 text-xs font-medium leading-5 text-white/50">{text}</p>
                  </div>
                ))}
              </div>

              <GuideNote>
                {copy.mainRule}
              </GuideNote>
            </section>

            <section id="where-proxy" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <h2 className="font-display text-2xl font-black text-white md:text-3xl">Где взять прокси</h2>
              <p className="mt-5 text-sm font-medium leading-7 text-white/65 md:text-base">{inline(resolveAntidetectGuideSegments(additions.proxy, services), 'article_cta')}</p>
              <p className="mt-5 text-sm font-medium leading-7 text-white/65 md:text-base">{inline(additions.airplane)}</p>
              <p className="mt-5 text-sm font-medium leading-7 text-white/65 md:text-base">{inline([additions.proxyMore])}</p>
            </section>

            <section id="common-settings" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <h2 className="font-display text-2xl font-black text-white md:text-3xl">Но что стоит перепроверить</h2>
              <dl className="mt-6">
                {copy.settings.map(row => <SettingRow key={row.name} {...row} />)}
              </dl>
            </section>

            <section id="free-antidetect" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <h2 className="font-display text-2xl font-black text-white md:text-3xl">Какой антидетект взять бесплатно</h2>
              <p className="mt-5 text-sm font-medium leading-7 text-white/65 md:text-base">{inline(resolveAntidetectGuideSegments(additions.free, services, true))}</p>
              <p className="mt-5 text-sm font-medium leading-7 text-white/65 md:text-base">{inline([additions.freeMore])}</p>
            </section>

            <section id="dolphin" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <BrowserHeading logo="/dolphin.webp" name="Dolphin Anty">
                {copy.browserIntros[0]}
              </BrowserHeading>
              <ol className="mt-7 space-y-4">
                <StepItem>{articleFallbackContent.antidetect.sections[0].steps[0]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[0].steps[1]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[0].steps[2]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[0].steps[3]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[0].steps[4]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[0].steps[5]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[0].steps[6]}</StepItem>
              </ol>
              <ArticleScreenshot {...copy.screenshots[0]} />
              <ArticleScreenshot {...copy.screenshots[1]} />
              <a href="/antidetect/dolphin-anty" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-purple hover:text-white">
                Открыть страницу Dolphin Anty <ExternalLink className="h-4 w-4" />
              </a>
            </section>

            <section id="adspower" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <BrowserHeading logo="/adspower.webp" name="AdsPower">
                {copy.browserIntros[1]}
              </BrowserHeading>
              <ol className="mt-7 space-y-4">
                <StepItem>{articleFallbackContent.antidetect.sections[1].steps[0]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[1].steps[1]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[1].steps[2]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[1].steps[3]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[1].steps[4]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[1].steps[5]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[1].steps[6]}</StepItem>
              </ol>
              <ArticleScreenshot {...copy.screenshots[2]} />
              <ArticleScreenshot {...copy.screenshots[3]} />
              <a href="/antidetect/adspower" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-purple hover:text-white">
                Открыть страницу AdsPower <ExternalLink className="h-4 w-4" />
              </a>
            </section>

            <section id="shardx" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <BrowserHeading logo="/proxyshard.webp" name="ShardX">
                {copy.browserIntros[2]}
              </BrowserHeading>
              <ol className="mt-7 space-y-4">
                <StepItem>{articleFallbackContent.antidetect.sections[2].steps[0]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[2].steps[1]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[2].steps[2]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[2].steps[3]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[2].steps[4]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[2].steps[5]}</StepItem>
                <StepItem>{articleFallbackContent.antidetect.sections[2].steps[6]}</StepItem>
              </ol>
              <ArticleScreenshot {...copy.screenshots[4]} />
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/antidetect/shardx" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-brand-purple/35 bg-brand-purple/10 px-4 py-2 text-xs font-black text-brand-purple transition-colors hover:bg-brand-purple hover:text-white">
                  Страница ShardX <ExternalLink className="h-4 w-4" />
                </a>
                <a href={VIDEO_GUIDE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black text-white/65 transition-colors hover:border-brand-purple/40 hover:text-white">
                  Смотреть видеогайд <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </section>

            <section id="connect-proxy" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <h2 className="font-display text-2xl font-black text-white md:text-3xl">Подключаем прокси</h2>
              <p className="mt-5 text-sm font-medium leading-7 text-white/65 md:text-base">{additions.connection}</p>
            </section>

            <section id="check" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Финальная проверка</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Что смотреть в чекерах</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {copy.checkers.map(({ href, title, text }) => (
                  <a key={title} href={href} target="_blank" rel="noopener noreferrer" className="group relative rounded-lg border border-white/[0.08] bg-white/[0.025] p-4 pr-12 transition-colors hover:border-brand-purple/40 hover:bg-brand-purple/[0.06]">
                    <Globe2 className="h-5 w-5 text-brand-purple" />
                    <h3 className="mt-3 text-sm font-black text-white">{title}</h3>
                    <p className="mt-2 text-xs font-medium leading-5 text-white/45">{text}</p>
                    <span className="absolute bottom-4 right-4 flex h-7 w-7 items-center justify-center rounded-md border border-brand-purple/35 bg-brand-purple/10 text-brand-purple transition-colors group-hover:border-brand-purple/70 group-hover:bg-brand-purple/20 group-hover:text-white" aria-hidden="true">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </a>
                ))}
              </div>
              <ul className="mt-7 space-y-4">
                {copy.checks.map((parts, index) => <StepItem key={String(index)}>{inline(parts)}</StepItem>)}
              </ul>
              <GuideNote warning>
                {copy.warning}
              </GuideNote>
            </section>

            <section id="mistakes" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-orange">Не делайте так</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Частые ошибки при настройке</h2>
              <div className="mt-6 space-y-3">
                {copy.mistakes.map((item) => (
                  <div key={item} className="flex items-start gap-3 border-b border-white/[0.07] py-3 text-sm font-medium leading-6 text-white/60 last:border-b-0">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>

              <GuideNote>
                {copy.closing}
              </GuideNote>

              <a href={VIDEO_GUIDE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white hover:text-brand-purple">
                Большой видеогайд по прокси и антидетектам <ExternalLink className="h-4 w-4" />
              </a>
            </section>

            <ArticleChecklist {...checklist} onExternalClick={href => trackService(href, 'article_summary')} />
            <ArticleSocialFooter />
          </article>
        </div>
      </main>
    </div>
  );
};
