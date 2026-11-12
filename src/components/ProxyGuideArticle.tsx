import { getExternalLinkRel } from '../lib/externalLinks.js';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Info,
  Layers,
  Moon,
  ShieldCheck,
  Smartphone,
  Sun,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { BackgroundParticles } from './BackgroundParticles';
import { ArticleLanguageLink } from './ArticleLanguageLink';
import { youtubeFarmGuideLink } from '../data/contextualGuideLinks.js';
import { ArticleSocialFooter } from './ArticleSocialFooter';
import { ArticleChecklist } from './ArticleChecklist';
import { ArticleImageLink } from './ArticleImageLink';
import { proxyProviders, proxyTypes, proxyCopy, proxyGuideMeta, proxyComparison, proxyCatalogueCta, proxyChecklist, proxySetupContent } from '../data/proxyGuideContent.js';
import { trackAnalyticsEvent } from '../analytics';

type Provider = {
  id: string;
  name: string;
  logo: string;
  url: string;
  types: string;
  choice: string;
  note: string;
  promoCode?: string;
  promoDiscount?: string;
};

const providers: Provider[] = proxyProviders;


const ArticleScreenshot = ({ src, alt, caption, width, height, className = '' }: { src: string; alt: string; caption: string; width?: number; height?: number; className?: string }) => (
  <figure className={`my-8 min-w-0 ${className}`}>
    <ArticleImageLink
      src={src} alt={alt} caption={caption}
      className="block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-colors hover:border-brand-purple/40"
    >
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" className="block h-auto w-full" />
    </ArticleImageLink>
    <figcaption className="mt-3 text-xs font-semibold leading-5 text-white/40">{caption}</figcaption>
  </figure>
);

const OutboundButton = ({ provider }: { provider: Provider }) => (
  <a
    href={provider.url}
    target="_blank"
    rel={getExternalLinkRel(provider.url)}
    onClick={() => trackAnalyticsEvent('service_click', {
      service_name: provider.name,
      service_id: provider.id,
      category: 'Proxy',
      destination: 'website',
      link_url: provider.url,
      placement: 'article_cta',
      language: 'ru',
      promo_code: provider.promoCode,
      promo_discount: provider.promoDiscount,
    })}
    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-brand-purple"
  >
    Перейти
    <ExternalLink className="h-4 w-4" />
  </a>
);

type ArticleTheme = 'dark' | 'light';

const ARTICLE_THEME_KEY = 'hopscup-article-theme';

export const ProxyGuideArticle = () => {
  const [copiedProvider, setCopiedProvider] = useState<string | null>(null);
  const copyPromo = async (provider: Provider, placement = 'article_card') => {
    if (!provider.promoCode) return;
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
      service_name: provider.name, service_id: provider.id, category: 'Proxy',
      placement, language: 'ru', promo_code: provider.promoCode,
      promo_discount: provider.promoDiscount,
    });
    window.setTimeout(() => setCopiedProvider(current => current === provider.id ? null : current), 1800);
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
            aria-label={isLight ? 'Включить темную тему' : 'Включить светлую тему'}
            title={isLight ? 'Темная тема' : 'Светлая тема'}
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
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-black leading-[1.08] tracking-tight text-white md:text-6xl">
          {proxyGuideMeta.heading}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/55 md:text-lg">
          {proxyCopy.intro}
        </p>
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3 text-xs font-bold text-white/45">
          <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">IPv4</span>
          <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">ISP</span>
          <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">Residential</span>
          <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">Mobile</span>
        </div>
        <ArticleImageLink src={proxyGuideMeta.cover.src} alt={proxyGuideMeta.cover.alt} className="mx-auto mt-8 block max-w-3xl overflow-hidden rounded-2xl border border-white/10">
          <img src={proxyGuideMeta.cover.src} alt={proxyGuideMeta.cover.alt} width={proxyGuideMeta.cover.width} height={proxyGuideMeta.cover.height} fetchPriority="high" decoding="async" className="block h-auto w-full" />
        </ArticleImageLink>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 md:px-8 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-center">
        <aside className="hidden lg:block">
          <nav className="article-toc sticky top-24 rounded-2xl border border-white/[0.08] bg-[#111111]/80 p-4 backdrop-blur-xl" aria-label="Содержание статьи">
            <p className="px-2 pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/25">Содержание</p>
            {[
              ['#korotko', 'Короткий ответ'],
              ['#types', 'Типы прокси'],
              ['#services', 'Сервисы'],
              ['#setup', 'Как подключить'],
              ['#cost', 'Что выгоднее'],
              ['#check', 'Как проверить IP'],
              ['#start', 'Коротко: что делать'],
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
            <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">{proxyCopy.shortHeading}</h2>
            <p className="mt-4 text-sm font-medium leading-7 text-white/65 md:text-base">
              {proxyCopy.short}
            </p>
          </section>

          <section className="mt-12 border-t border-white/[0.08] pt-10">
            <h2 className="font-display text-2xl font-black text-white md:text-3xl">Быстрое сравнение</h2>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.08]">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <thead className="bg-white/[0.05] text-[10px] font-black uppercase tracking-wider text-white/35">
                  <tr>
                    <th className="px-4 py-4">Сервис</th>
                    <th className="px-4 py-4">Типы</th>
                    <th className="px-4 py-4">Когда смотреть</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.07] text-xs font-semibold text-white/60">
                  {providers.map((provider) => (
                    <tr key={provider.name} className="transition-colors hover:bg-white/[0.025]">
                      <td className="px-4 py-4 font-bold text-white">
                        <a
                          href={provider.url}
                          target="_blank"
                          rel={getExternalLinkRel(provider.url)}
                          onClick={() => trackAnalyticsEvent('service_click', {
                            service_name: provider.name,
                            service_id: provider.id,
                            category: 'Proxy',
                            destination: 'website',
                            link_url: provider.url,
                            placement: 'article_table',
                            language: 'ru',
                            promo_code: provider.promoCode,
                            promo_discount: provider.promoDiscount,
                          })}
                          className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-purple"
                        >
                          {provider.name}
                          <ExternalLink className="h-3 w-3 opacity-50" />
                        </a>
                      </td>
                      <td className="px-4 py-4">{provider.types}</td>
                      <td className="px-4 py-4">{provider.choice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="types" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Не переплачиваем просто так</p>
            <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Какой тип прокси выбрать</h2>
            <div className="mt-6 space-y-3">
              {proxyTypes.map((type, index) => (
                <div key={type.name} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-purple/12 text-xs font-black text-brand-purple">{index + 1}</span>
                      <h3 className="font-display text-lg font-bold text-white">{type.name}</h3>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-white/30">{type.price}</span>
                  </div>
                  <p className="mt-4 text-sm font-medium leading-6 text-white/55">
                    {type.href ? <>{type.text.split(type.linkText)[0]}<a href={type.href} className="font-bold text-brand-purple underline underline-offset-4">{type.linkText}</a>{type.text.split(type.linkText)[1]}</> : type.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-white"><Layers className="h-4 w-4 text-brand-purple" /> SOCKS5 или HTTP</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">{proxyCopy.socks}</p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-white"><Zap className="h-4 w-4 text-brand-purple" /> Что насчет IPv6</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">{proxyCopy.ipv6}</p>
              </div>
            </div>
          </section>

          <section id="services" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Мои варианты</p>
            <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Семь сервисов, которыми я пользуюсь</h2>
            <p className="mt-4 text-sm font-medium leading-7 text-white/55">
              {proxyCopy.services}
            </p>
            <div className="mt-7 space-y-4">
              {providers.map((provider, index) => (
                <section key={provider.name} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 md:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <img src={provider.logo} alt={provider.name} loading="lazy" decoding="async" className="h-14 w-14 shrink-0 rounded-xl border border-white/10 object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">{index + 1} из {providers.length}</p>
                          <h3 className="mt-1 font-display text-xl font-black text-white">{provider.name}</h3>
                        </div>
                        <span className="rounded-lg border border-brand-purple/20 bg-brand-purple/[0.08] px-3 py-2 text-[10px] font-black uppercase tracking-wider text-brand-purple">{provider.choice}</span>
                      </div>
                      <p className="mt-4 text-sm font-medium leading-6 text-white/57">{provider.note}</p>
                      {provider.promoCode && (
                        <button type="button" onClick={() => void copyPromo(provider)} aria-label={`Скопировать промокод ${provider.name}`}
                          className="mt-4 inline-flex min-h-11 max-w-full items-center gap-3 rounded-xl border border-brand-purple/30 bg-brand-purple/10 px-4 py-3 text-sm font-bold text-brand-purple transition-colors hover:bg-brand-purple/20">
                          {copiedProvider === provider.id ? <Check className="h-4 w-4 shrink-0" /> : <Copy className="h-4 w-4 shrink-0" />}
                          <span>{provider.promoCode}</span>
                          {provider.promoDiscount && <span>{provider.promoDiscount}</span>}
                          <span className="sr-only" aria-live="polite">{copiedProvider === provider.id ? 'Скопировано' : ''}</span>
                        </button>
                      )}
                      <div className="mt-5 flex flex-col gap-4 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-xs font-semibold text-white/35">{provider.types}</span>
                        <OutboundButton provider={provider} />
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>
            <div className="mt-8 grid items-start gap-5 md:grid-cols-2">
              <ArticleScreenshot
                src="/article/proxy/proxywing-dashboard.png"
                alt="Выбор типа и страны прокси в кабинете ProxyWing"
                caption="ProxyWing: выбор типа прокси, страны и тарифа."
                className="my-0"
              />
              <ArticleScreenshot
                src="/article/proxy/proxy-seller-dashboard.png"
                alt="Расчет IPv4 в кабинете Proxy-Seller"
                caption="Proxy-Seller: быстрый расчет IPv4 по стране, сроку и количеству."
                className="my-0"
              />
            </div>
            <ArticleScreenshot
              src="/article/proxy/proxyline-calculator.png"
              alt="Калькулятор стоимости выделенных IPv4 в Proxyline"
              caption="Proxyline: расчет 50 выделенных IPv4 на 30 дней."
            />
            <p className="mt-4 text-sm font-medium leading-7 text-white/60">
              {proxyCatalogueCta.map((part, index) => part.href
                ? <a key={index} href={part.href} className="font-bold text-brand-purple underline underline-offset-4">{part.text}</a>
                : <span key={index}>{part.text}</span>)}
            </p>
          </section>

          <section id="setup" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">После покупки</p>
            <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Как подключить прокси</h2>
            <p className="mt-4 text-sm font-medium leading-7 text-white/60">
              {proxySetupContent.map((part, index) => part.href
                ? <a key={index} href={part.href} className="font-bold text-brand-purple underline underline-offset-4">{part.text}</a>
                : <span key={index}>{part.text}</span>)}
            </p>
            <ArticleScreenshot
              src="/article/proxy/proxyshard-issued-proxy.webp"
              width={574}
              height={220}
              alt="Выдача купленного IPv4 в кабинете ProxyShard"
              caption="ProxyShard: формат IP:порт:логин:пароль. Чувствительные значения частично скрыты."
            />
            <p className="text-sm font-medium leading-7 text-white/60">
              {proxyCopy.example}
            </p>
            <ArticleScreenshot
              src="/article/proxy/adspower-socks5-test-cropped.webp"
              width={710}
              height={402}
              alt="Настройка SOCKS5 и успешная проверка соединения в AdsPower"
              caption="SOCKS5 добавлен в AdsPower, проверка соединения пройдена."
            />
            <p className="text-sm font-medium leading-7 text-white/60">
              {proxyCopy.mobileSetup}
            </p>
            <a href="/proxy-vpn/luchshie-mobilnye-proksi" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-purple transition-colors hover:text-white">
              Сравнить мобильные прокси <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-4 text-sm font-medium leading-7 text-white/60">
              <a href={youtubeFarmGuideLink.href} className="font-bold text-brand-purple underline underline-offset-4">{youtubeFarmGuideLink.label.ru}</a>
            </p>
            <div className="mt-8 grid items-start gap-5 md:grid-cols-2">
              <ArticleScreenshot
                src="/article/proxy/mobileproxy-copy-formats.png"
                alt="Форматы копирования HTTP и SOCKS5 в MobileProxy"
                caption="Готовую строку можно скопировать в нужном формате HTTP или SOCKS5."
                className="my-0"
              />
              <ArticleScreenshot
                src="/article/proxy/mobileproxy-change-ip.png"
                alt="Кнопка смены IP в кабинете MobileProxy"
                caption="IP меняется по отдельной ссылке в кабинете MobileProxy."
                className="my-0"
              />
            </div>
          </section>

          <section id="cost" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
            <h2 className="font-display text-2xl font-black text-white md:text-3xl">{proxyComparison.heading}</h2>
            <ArticleScreenshot {...proxyComparison.image} />
            {proxyComparison.paragraphs.map((content, index) => (
              <p key={index} className="mt-4 text-sm font-medium leading-7 text-white/65 md:text-base">
                {content.map((part, partIndex) => {
                  if (part.promoCode) return (
                    <button key={partIndex} type="button" onClick={() => void copyPromo(proxyComparison.provider, 'article_compare')}
                      aria-label="Скопировать промокод MobileProxy (сравнение)"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-brand-purple/30 bg-brand-purple/10 px-2 py-1 align-middle font-bold text-brand-purple transition-colors hover:bg-brand-purple/20">
                      {copiedProvider === proxyComparison.provider.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {part.text}
                    </button>
                  );
                  if (part.href) {
                    const external = part.href.startsWith('https://');
                    return <a key={partIndex} href={part.href}
                      {...(external ? { target: '_blank', rel: getExternalLinkRel(part.href), onClick: () => trackAnalyticsEvent('service_click', {
                        service_name: proxyComparison.provider.name, service_id: proxyComparison.provider.id,
                        category: 'Proxy', destination: 'website', link_url: part.href, placement: 'article_compare',
                        language: 'ru', promo_code: proxyComparison.provider.promoCode, promo_discount: proxyComparison.provider.promoDiscount,
                      }) } : {})}
                      className="font-bold text-brand-purple underline underline-offset-4">{part.text}</a>;
                  }
                  return part.strong ? <strong key={partIndex} className="font-bold text-white">{part.text}</strong> : <span key={partIndex}>{part.text}</span>;
                })}
              </p>
            ))}
          </section>

          <section id="check" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Если сомневаетесь в адресе</p>
            <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Как проверить IP</h2>
            <p className="mt-4 text-sm font-medium leading-7 text-white/60">
              {proxyCopy.check}
            </p>
            <div className="mt-5 rounded-2xl border border-brand-orange/20 bg-brand-orange/[0.06] p-5">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                <p className="text-sm font-semibold leading-6 text-white/60">
                  {proxyCopy.checkNote}
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a href="https://www.ipqualityscore.com/" target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm font-bold text-white/65 transition-colors hover:border-brand-purple/40 hover:text-white">
                IPQualityScore <ExternalLink className="h-4 w-4" />
              </a>
              <a href="https://scamalytics.com/" target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm font-bold text-white/65 transition-colors hover:border-brand-purple/40 hover:text-white">
                Scamalytics <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-8 grid items-start gap-5 md:grid-cols-2">
              <ArticleScreenshot
                src="/article/proxy/scamalytics-low-risk.png"
                alt="Низкий Fraud Score в Scamalytics"
                caption="Scamalytics: Fraud Score 0, низкий риск."
                className="my-0"
              />
              <ArticleScreenshot
                src="/article/proxy/ipqs-high-risk.png"
                alt="Высокий Fraud Score в IPQualityScore"
                caption="IPQualityScore: Fraud Score 68, IP определяется как VPN и proxy."
                className="my-0"
              />
            </div>
          </section>

          <section className="mt-12 border-t border-white/[0.08] pt-10">
            <div className="rounded-2xl border border-brand-purple/25 bg-brand-purple/[0.08] p-6 md:p-7">
              <Smartphone className="h-6 w-6 text-brand-purple" />
              <h2 className="mt-4 font-display text-xl font-black text-white md:text-2xl">Когда можно вообще обойтись без прокси</h2>
              <p className="mt-4 text-sm font-medium leading-7 text-white/60">
                {proxyCopy.phone}
              </p>
              <a href="/guides/mobile-ip-airplane-mode" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-purple transition-colors hover:text-white">
                Гайд по смене IP с телефона <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </section>

          <ArticleChecklist {...proxyChecklist} onExternalClick={href => {
            const provider = proxyProviders.find(provider => provider.url === href);
            if (!provider) return;
            trackAnalyticsEvent('service_click', {
              service_name: provider.name, service_id: provider.id,
              category: 'Proxy', destination: 'website', link_url: href, placement: 'article_summary',
              language: 'ru', promo_code: provider.promoCode, promo_discount: provider.promoDiscount,
            });
          }} />
          <ArticleSocialFooter variant="compact" />
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
