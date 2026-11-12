import { getExternalLinkRel } from '../lib/externalLinks.js';
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Info,
  Moon,
  ShieldCheck,
  Smartphone,
  Sun,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { trackAnalyticsEvent } from '../analytics';
import { BackgroundParticles } from './BackgroundParticles';
import { ArticleLanguageLink } from './ArticleLanguageLink';
import { ArticleChecklist } from './ArticleChecklist';
import { ArticleSocialFooter } from './ArticleSocialFooter';
import { ArticleImageLink } from './ArticleImageLink';
import { articleFallbackContent, mobileProxyChecklist, mobileProxyCopy as copy, mobileProxyMeta, mobileProxyProviders } from '../data/articleFallbackContent.js';

type Provider = {
  id: string;
  name: string;
  logo: string;
  url: string;
  locations: string;
  network: string;
  rotation: string;
  billing: string;
  entryPrice: string;
  promoCode: string;
  promoDiscount: string;
  label: string;
  experience: string;
  summary: string;
  strengths: string[];
  limitations: string[];
};

const providers: Provider[] = mobileProxyProviders;

type ArticleTheme = 'dark' | 'light';

const ARTICLE_THEME_KEY = 'hopscup-article-theme';

const ArticleScreenshot = ({ src, alt, caption }: { key?: string; src: string; alt: string; caption: string }) => (
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

export const MobileProxyComparisonArticle = () => {
  const [theme, setTheme] = useState<ArticleTheme>(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem(ARTICLE_THEME_KEY) === 'light' ? 'light' : 'dark';
  });
  const [copiedProvider, setCopiedProvider] = useState<string | null>(null);

  useEffect(() => {
    window.localStorage.setItem(ARTICLE_THEME_KEY, theme);
    document.documentElement.dataset.articleTheme = theme;

    return () => {
      delete document.documentElement.dataset.articleTheme;
    };
  }, [theme]);

  const isLight = theme === 'light';

  const trackProviderClick = (provider: Provider, placement: string) => {
    trackAnalyticsEvent('service_click', {
      service_name: provider.name,
      service_id: provider.id,
      category: 'Proxy',
      destination: 'website',
      link_url: provider.url,
      placement,
      language: 'ru',
      promo_code: provider.promoCode,
      promo_discount: provider.promoDiscount,
    });
  };

  const copyPromo = async (provider: Provider) => {
    try {
      await navigator.clipboard.writeText(provider.promoCode);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = provider.promoCode;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopiedProvider(provider.id);
    trackAnalyticsEvent('promo_copy', {
      service_name: provider.name,
      service_id: provider.id,
      category: 'Proxy',
      placement: 'mobile_proxy_article',
      language: 'ru',
      promo_code: provider.promoCode,
      promo_discount: provider.promoDiscount,
    });
    window.setTimeout(() => setCopiedProvider((current) => current === provider.id ? null : current), 1800);
  };

  return (
    <div
      data-article-theme={theme}
      className="proxy-guide-article relative min-h-screen overflow-hidden bg-bg-dark text-white selection:bg-brand-purple selection:text-white"
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
            <ArticleLanguageLink />
            <button
              type="button"
              onClick={() => setTheme(isLight ? 'dark' : 'light')}
              aria-label={isLight ? 'Включить тёмную тему' : 'Включить светлую тему'}
              title={isLight ? 'Тёмная тема' : 'Светлая тема'}
              className="article-theme-toggle inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:border-brand-purple/40 hover:text-brand-purple"
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <a href="/proxy-vpn" className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white/60 transition-colors hover:border-brand-purple/40 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              К сервисам
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 pb-20">
        <section className="mx-auto max-w-5xl px-5 pb-12 pt-14 text-center md:px-8 md:pb-16 md:pt-20">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-brand-purple/25 bg-brand-purple/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">
            <ShieldCheck className="h-4 w-4" />
            Личный опыт Hopscup
          </div>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-black leading-[1.08] tracking-tight text-white md:text-6xl">{articleFallbackContent.mobile.title}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-relaxed text-white/55 md:text-lg">{articleFallbackContent.mobile.intro}</p>
          <ArticleImageLink src={mobileProxyMeta.cover.src} alt={mobileProxyMeta.cover.alt} className="mx-auto mt-8 block max-w-3xl overflow-hidden rounded-2xl border border-white/10">
            <img {...mobileProxyMeta.cover} fetchPriority="high" decoding="async" className="block h-auto w-full" />
          </ArticleImageLink>
          <p className="mt-5 text-xs font-semibold text-white/30">{articleFallbackContent.mobile.updated}</p>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-5 md:px-8 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-center">
          <aside className="hidden lg:block">
            <nav className="article-toc sticky top-24 rounded-2xl border border-white/[0.08] bg-[#111111]/80 p-4 backdrop-blur-xl" aria-label="Содержание статьи">
              <p className="px-2 pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/25">Содержание</p>
              {[
                ['#korotko', 'Короткий ответ'],
                ['#comparison', 'Сравнение'],
                ['#providers', 'Три сервиса'],
                ['#economy', 'Когда выгодно'],
                ['#geo', 'Какое гео брать'],
                ['#choice', 'Как выбрать'],
                ['#setup', 'Настройка'],
                ['#start', 'Коротко: что брать'],
              ].map(([href, label]) => (
                <a key={href} href={href} className="block rounded-lg px-2 py-2 text-xs font-semibold text-white/45 transition-colors hover:bg-white/5 hover:text-brand-purple">
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          <article className="article-card min-w-0 rounded-[1.5rem] border border-white/[0.08] bg-[#0d0d0d]/90 px-5 py-7 shadow-2xl backdrop-blur-xl md:px-9 md:py-10">
            <section id="korotko" className="scroll-mt-28">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Если совсем коротко</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">{copy.shortHeading}</h2>
              <p className="mt-4 text-sm font-medium leading-7 text-white/65 md:text-base">
                {copy.short}
              </p>
              <div className="mt-6 rounded-2xl border border-brand-purple/20 bg-brand-purple/[0.07] p-5">
                <div className="flex items-start gap-3">
                  <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                  <p className="text-sm font-semibold leading-6 text-white/65">
                    {copy.shortNote}
                  </p>
                </div>
              </div>
            </section>

            <section id="comparison" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Цены и условия</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Три сервиса в одной таблице</h2>
              <p className="mt-4 text-sm font-medium leading-7 text-white/55">
                {copy.comparison}
              </p>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.08]">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead className="bg-white/[0.05] text-[10px] font-black uppercase tracking-wider text-white/35">
                    <tr>
                      {copy.providerColumns.map(column => <th key={column} className="px-4 py-4">{column}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.07] text-xs font-semibold text-white/60">
                    {providers.map((provider) => (
                      <tr key={provider.id} className="transition-colors hover:bg-white/[0.025]">
                        <td className="px-4 py-4 font-bold text-white">
                          <a href={provider.url} target="_blank" rel={getExternalLinkRel(provider.url)} onClick={() => trackProviderClick(provider, 'article_table')} className="inline-flex items-center gap-1.5 hover:text-brand-purple">
                            {provider.name}<ExternalLink className="h-3 w-3 opacity-50" />
                          </a>
                        </td>
                        <td className="px-4 py-4">{provider.locations}</td>
                        <td className="px-4 py-4">{provider.rotation}</td>
                        <td className="px-4 py-4">{provider.billing}</td>
                        <td className="px-4 py-4">{provider.entryPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs font-medium leading-5 text-white/35">{copy.comparisonNote}</p>
            </section>

            <section className="mt-12 border-t border-white/[0.08] pt-10">
              <h2 className="font-display text-2xl font-black text-white md:text-3xl">Как я сравнивал варианты</h2>
              <p className="mt-4 text-sm font-medium leading-7 text-white/60">{copy.methodology}</p>
            </section>

            <section id="providers" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Мой выбор</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Какой сервис выбрать</h2>
              <div className="mt-7 space-y-5">
                {providers.map((provider, index) => (
                  <section key={provider.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 md:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <img src={provider.logo} alt={provider.name} loading="lazy" decoding="async" className="h-14 w-14 shrink-0 rounded-xl border border-white/10 object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">{index + 1} из {providers.length}</p>
                            <h3 className="mt-1 font-display text-xl font-black text-white">{provider.name}</h3>
                          </div>
                          <span className="rounded-lg border border-brand-purple/20 bg-brand-purple/[0.08] px-3 py-2 text-[10px] font-black uppercase tracking-wider text-brand-purple">{provider.label}</span>
                        </div>
                        <p className="mt-3 text-xs font-bold text-brand-purple/75">{provider.experience}</p>
                        <p className="mt-4 text-sm font-medium leading-6 text-white/57">{provider.summary}</p>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">Сильные стороны</p>
                            <ul className="mt-3 space-y-2">
                              {provider.strengths.map((item) => <li key={item} className="flex gap-2 text-xs font-semibold leading-5 text-white/55"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-purple" />{item}</li>)}
                            </ul>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">Что учитывать</p>
                            <ul className="mt-3 space-y-2">
                              {provider.limitations.map((item) => <li key={item} className="flex gap-2 text-xs font-semibold leading-5 text-white/55"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-orange" />{item}</li>)}
                            </ul>
                          </div>
                        </div>
                        <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
                          <button
                            type="button"
                            onClick={() => copyPromo(provider)}
                            aria-label={`Скопировать промокод ${provider.promoCode} для ${provider.name}`}
                            title="Скопировать промокод"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-xs font-bold text-white/65 transition-colors hover:border-brand-purple/40 hover:text-white"
                          >
                            {copiedProvider === provider.id ? <Check className="h-4 w-4 text-brand-purple" /> : <Copy className="h-4 w-4 text-brand-purple" />}
                            {copiedProvider === provider.id ? 'Скопировано' : provider.promoCode}
                            <span className="text-brand-purple">{provider.promoDiscount}</span>
                          </button>
                          <a href={provider.url} target="_blank" rel={getExternalLinkRel(provider.url)} onClick={() => trackProviderClick(provider, 'article_provider')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-brand-purple">
                            Перейти <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              {copy.screenshots.map(screenshot => <ArticleScreenshot key={screenshot.src} {...screenshot} />)}
              <p className="mt-4 text-sm font-medium leading-7 text-white/60">Больше про тарифы и оплату в <a href={copy.providerLink.href} className="font-bold text-brand-purple hover:underline">{copy.providerLink.label}</a>.</p>
            </section>

            <section id="economy" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Сколько выйдет</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Когда мобильный прокси выгоден</h2>
              <p className="mt-4 text-sm font-medium leading-7 text-white/60">
                {copy.economy.map((part, index) => part.href ? <a key={index} href={part.href} className="font-bold text-brand-purple hover:underline">{part.text}</a> : part.text)}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-brand-purple/20 bg-brand-purple/[0.06] p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-white"><Zap className="h-4 w-4 text-brand-purple" /> Мобильный тариф имеет смысл</h3>
                  <ul className="mt-4 space-y-3 text-sm font-medium leading-6 text-white/55">
                    {copy.mobileReasons.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-white"><Info className="h-4 w-4 text-brand-orange" /> Лучше остаться на IPv4</h3>
                  <ul className="mt-4 space-y-3 text-sm font-medium leading-6 text-white/55">
                    {copy.ipv4Reasons.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            <section id="geo" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <h2 className="font-display text-2xl font-black text-white md:text-3xl">Какое гео брать</h2>
              <p className="mt-4 text-sm font-medium leading-7 text-white/60">{copy.geo}</p>
            </section>

            <section className="mt-12 border-t border-white/[0.08] pt-10">
              <h2 className="font-display text-2xl font-black text-white md:text-3xl">Mobile, Residential или IPv4</h2>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.08]">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead className="bg-white/[0.05] text-[10px] font-black uppercase tracking-wider text-white/35">
                    <tr>{copy.typeColumns.map(column => <th key={column} className="px-4 py-4">{column}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.07] text-xs font-semibold text-white/60">
                    {copy.typeRows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell} className={`px-4 py-4 ${index === 0 ? 'font-bold text-white' : ''}`}>{cell}</td>)}</tr>)}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="choice" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Перед оплатой</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Что проверить в тарифе</h2>
              <div className="mt-6 space-y-3">
                {copy.tariffChecks.map(([title, text], index) => (
                  <div key={title} className="flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-purple/12 text-xs font-black text-brand-purple">{index + 1}</span>
                    <div><h3 className="text-sm font-bold text-white">{title}</h3><p className="mt-2 text-sm font-medium leading-6 text-white/50">{text}</p></div>
                  </div>
                ))}
              </div>
            </section>

            <section id="setup" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">После покупки</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Как подключить и сменить IP</h2>
              <ol className="mt-6 space-y-3">
                {copy.setupSteps.map((item, index) => <li key={item} className="flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-sm font-medium leading-6 text-white/55"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-purple/12 text-xs font-black text-brand-purple">{index + 1}</span>{item}</li>)}
              </ol>
              <div className="mt-6 rounded-2xl border border-brand-orange/20 bg-brand-orange/[0.06] p-5">
                <div className="flex items-start gap-3"><Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" /><p className="text-sm font-semibold leading-6 text-white/60">{copy.setupWarning}</p></div>
              </div>
              <p className="mt-4 text-sm font-medium leading-7 text-white/60">Для пары аккаунтов вместо покупки можно попробовать <a href={copy.airplaneLink.href} className="font-bold text-brand-purple hover:underline">{copy.airplaneLink.label}</a>.</p>
            </section>

            <ArticleChecklist {...mobileProxyChecklist} onExternalClick={href => {
              const provider = providers.find(item => item.url === href);
              if (provider) trackProviderClick(provider, 'article_summary');
            }} />
            <ArticleSocialFooter />
          </article>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] py-10 text-center">
        <a href="/" className="inline-flex flex-col items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/25 transition-colors hover:text-brand-purple">
          <img src="/logo.webp" alt="Hopscup" className="h-11 w-11 object-contain opacity-70" />
          © 2026 Hopscup Crew
        </a>
      </footer>
    </div>
  );
};
