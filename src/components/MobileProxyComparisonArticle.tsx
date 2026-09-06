import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Globe,
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
import { RelatedGuides } from './RelatedGuides';

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

const providers: Provider[] = [
  {
    id: 'p6',
    name: 'MobileProxy',
    logo: '/mobileproxy.webp',
    url: 'https://mobileproxy.rent/user.html?free&p=105422',
    locations: '20+ стран',
    network: 'Реальные SIM, 4G/LTE',
    rotation: 'Кнопка, ссылка, API и таймер',
    billing: 'По сроку, безлимитный трафик',
    entryPrice: 'Зависит от страны и срока',
    promoCode: 'hopscup',
    promoDiscount: '−20%',
    label: 'Мой основной вариант',
    experience: 'Пользуюсь больше трёх лет',
    summary: 'Беру MobileProxy, когда нужен именно мобильный источник адресов и быстрая смена IP. Подключение настраивается один раз, после чего новый адрес можно получать через кабинет или отдельную ссылку.',
    strengths: [
      'Безлимитный трафик: не приходится считать каждый гигабайт.',
      'Удобная ручная и автоматическая смена IP.',
      'Можно скопировать готовую строку в формате HTTP или SOCKS5.',
    ],
    limitations: [
      'Цена заметно выше обычного IPv4.',
      'Если тариф выдаёт один активный адрес, профили с разными IP придётся запускать по очереди.',
    ],
  },
  {
    id: 'p3',
    name: 'ProxyWing',
    logo: '/proxywing.webp',
    url: 'https://dashboard.proxywing.com/billing/aff.php?aff=813',
    locations: '17+ стран',
    network: '4G и 5G',
    rotation: 'Таймер, ссылка или кнопка',
    billing: '1, 7, 15 или 30 дней',
    entryPrice: 'От $4/день, от $55/месяц',
    promoCode: 'hopscup',
    promoDiscount: '−10%',
    label: 'Гибкие короткие тарифы',
    experience: 'Характеристики мобильных тарифов проверены по сайту сервиса',
    summary: 'Подходит, когда мобильный прокси нужен на короткий тест или на конкретный проект. В одном кабинете есть и более дешёвые IPv4, ISP и Residential, поэтому тип можно менять без перехода к другому провайдеру.',
    strengths: [
      'Можно начать с тарифа на один день или неделю.',
      'Безлимитный трафик и несколько способов ротации.',
      'Поддерживаются HTTPS, SOCKS5, UDP и OpenVPN.',
    ],
    limitations: [
      'Месячный мобильный тариф дороже обычных серверных и ISP-прокси.',
      'Доступные операторы и итоговая цена зависят от страны.',
    ],
  },
  {
    id: 'p4',
    name: 'Proxy-Seller',
    logo: '/proxy-seller.webp',
    url: 'https://proxy-seller.com/?partner=RIPC5NDAEYRZPZ',
    locations: 'США, Европа, Азия и другие GEO',
    network: '4G, LTE и 5G',
    rotation: 'По ссылке или каждые 5/30 минут',
    billing: 'Dedicated или Shared, от недели',
    entryPrice: 'Рассчитывается в конфигураторе',
    promoCode: 'hopscup',
    promoDiscount: '−10%',
    label: 'Выбор формата и оператора',
    experience: 'Характеристики мобильных тарифов проверены по сайту сервиса',
    summary: 'Сильная сторона Proxy-Seller — выбор. Можно подобрать выделенный или общий мобильный канал, страну, оператора, период и способ ротации. Это удобно, когда параметры важнее минимальной цены входа.',
    strengths: [
      'Есть dedicated и shared мобильные тарифы.',
      'Можно выбрать оператора и период ротации.',
      'Безлимитный трафик и поддержка SOCKS5/HTTPS.',
    ],
    limitations: [
      'Shared подходит не для каждого рабочего профиля.',
      'Итоговую стоимость приходится считать под конкретную страну и срок.',
    ],
  },
];

const comparisonRows = [
  ['Источник IP', 'Мобильный оператор', 'Домашний интернет-провайдер', 'Дата-центр'],
  ['Доверие площадок', 'Обычно самое высокое', 'Высокое', 'Зависит от площадки'],
  ['Смена адреса', 'По кнопке, таймеру или API', 'Ротация или sticky-сессия', 'Чаще статичный IP'],
  ['Скорость', 'Зависит от сети и оператора', 'Средняя или высокая', 'Обычно самая высокая'],
  ['Цена', 'Самая высокая', 'Оплата за трафик или пул', 'Самая доступная'],
  ['Когда брать', 'Строгие площадки и мобильный GEO', 'Парсинг, GEO и сложные сайты', 'Большинство обычных задач'],
];

type ArticleTheme = 'dark' | 'light';

const ARTICLE_THEME_KEY = 'hopscup-article-theme';

const ArticleScreenshot = ({ src, alt, caption }: { src: string; alt: string; caption: string }) => (
  <figure className="my-8 min-w-0">
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Открыть изображение: ${alt}`}
      className="block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-colors hover:border-brand-purple/40"
    >
      <img src={src} alt={alt} loading="lazy" decoding="async" className="block h-auto w-full" />
    </a>
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
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-black leading-[1.08] tracking-tight text-white md:text-6xl">
            Лучшие мобильные прокси в 2026 году
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-relaxed text-white/55 md:text-lg">
            Сравниваю MobileProxy, ProxyWing и Proxy-Seller: где удобнее менять IP, когда нужен безлимитный трафик и в каких задачах обычный IPv4 будет разумнее.
          </p>
          <p className="mt-5 text-xs font-semibold text-white/30">Обновлено 31 августа 2026 года</p>
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
                ['#choice', 'Как выбрать'],
                ['#setup', 'Настройка'],
                ['#faq', 'Вопросы'],
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
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Не покупайте Mobile просто «на всякий случай»</h2>
              <p className="mt-4 text-sm font-medium leading-7 text-white/65 md:text-base">
                Для Gmail, Telegram, Discord, обычных аккаунтов, парсинга и автоматизации я сначала пробую отдельный IPv4. Мобильный прокси беру, когда площадка строго относится к серверным адресам, нужен IP мобильного оператора или приходится часто менять адрес.
              </p>
              <div className="mt-6 rounded-2xl border border-brand-purple/20 bg-brand-purple/[0.07] p-5">
                <div className="flex items-start gap-3">
                  <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                  <p className="text-sm font-semibold leading-6 text-white/65">
                    Мой основной вариант — MobileProxy. Пользуюсь сервисом больше трёх лет. Но это рекомендация именно для задач, где мобильный IP оправдывает цену, а не универсальный ответ для любого пользователя.
                  </p>
                </div>
              </div>
            </section>

            <section id="comparison" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Сравнение без рекламной арифметики</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Три сервиса в одной таблице</h2>
              <p className="mt-4 text-sm font-medium leading-7 text-white/55">
                Цены у мобильных прокси зависят от страны, оператора и срока. Поэтому важнее сравнивать не только цифру на витрине, но и модель оплаты, ротацию и ограничения тарифа.
              </p>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.08]">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead className="bg-white/[0.05] text-[10px] font-black uppercase tracking-wider text-white/35">
                    <tr>
                      <th className="px-4 py-4">Сервис</th>
                      <th className="px-4 py-4">GEO</th>
                      <th className="px-4 py-4">Смена IP</th>
                      <th className="px-4 py-4">Оплата</th>
                      <th className="px-4 py-4">Цена входа</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.07] text-xs font-semibold text-white/60">
                    {providers.map((provider) => (
                      <tr key={provider.id} className="transition-colors hover:bg-white/[0.025]">
                        <td className="px-4 py-4 font-bold text-white">
                          <a href={provider.url} target="_blank" rel="sponsored noopener noreferrer" onClick={() => trackProviderClick(provider, 'article_table')} className="inline-flex items-center gap-1.5 hover:text-brand-purple">
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
              <p className="mt-3 text-xs font-medium leading-5 text-white/35">Условия проверены 31 августа 2026 года. Перед оплатой перепроверьте выбранную страну в кабинете сервиса.</p>
            </section>

            <section className="mt-12 border-t border-white/[0.08] pt-10">
              <h2 className="font-display text-2xl font-black text-white md:text-3xl">Как я сравнивал варианты</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-brand-purple/20 bg-brand-purple/[0.06] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-purple">Личный опыт</p>
                  <h3 className="mt-2 font-display text-lg font-black text-white">MobileProxy</h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-white/55">Пользуюсь больше трёх лет, поэтому могу говорить о кабинете, смене IP и реальном рабочем сценарии.</p>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Проверка условий</p>
                  <h3 className="mt-2 font-display text-lg font-black text-white">ProxyWing и Proxy-Seller</h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-white/55">Сверил мобильные тарифы, GEO, протоколы и ротацию по официальным страницам. Не называю их лично протестированными.</p>
                </div>
              </div>
            </section>

            <section id="providers" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Без искусственного пьедестала</p>
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
                          <a href={provider.url} target="_blank" rel="sponsored noopener noreferrer" onClick={() => trackProviderClick(provider, 'article_provider')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-brand-purple">
                            Перейти <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              <ArticleScreenshot src="/article/proxy/mobileproxy-copy-formats.png" alt="Форматы копирования мобильных прокси в MobileProxy" caption="MobileProxy: готовую строку можно скопировать в формате HTTP или SOCKS5." />
              <ArticleScreenshot src="/article/proxy/mobileproxy-change-ip.png" alt="Смена мобильного IP в кабинете MobileProxy" caption="Новый IP получается по отдельной ссылке из кабинета." />
            </section>

            <section id="economy" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Считаем задачу, а не красивый тариф</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Когда мобильный прокси выгоден</h2>
              <p className="mt-4 text-sm font-medium leading-7 text-white/60">
                Один мобильный тариф может дать большой пул адресов через ротацию. Это выгодно, если профили можно обрабатывать по очереди. Но такой тариф не заменяет десятки одновременных уникальных подключений, если каждый профиль должен постоянно оставаться на своём IP.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-brand-purple/20 bg-brand-purple/[0.06] p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-white"><Zap className="h-4 w-4 text-brand-purple" /> Мобильный тариф имеет смысл</h3>
                  <ul className="mt-4 space-y-3 text-sm font-medium leading-6 text-white/55">
                    <li>Площадка принимает серверные IP заметно хуже.</li>
                    <li>Нужна частая смена адреса без покупки пачки IPv4.</li>
                    <li>Профили запускаются последовательно.</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-white"><Info className="h-4 w-4 text-brand-orange" /> Лучше остаться на IPv4</h3>
                  <ul className="mt-4 space-y-3 text-sm font-medium leading-6 text-white/55">
                    <li>Площадка нормально работает с серверными адресами.</li>
                    <li>Каждому профилю нужен постоянный отдельный IP.</li>
                    <li>Главные требования — скорость и низкая цена.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mt-12 border-t border-white/[0.08] pt-10">
              <h2 className="font-display text-2xl font-black text-white md:text-3xl">Mobile, Residential или IPv4</h2>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.08]">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead className="bg-white/[0.05] text-[10px] font-black uppercase tracking-wider text-white/35">
                    <tr><th className="px-4 py-4">Критерий</th><th className="px-4 py-4">Mobile</th><th className="px-4 py-4">Residential</th><th className="px-4 py-4">IPv4</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.07] text-xs font-semibold text-white/60">
                    {comparisonRows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell} className={`px-4 py-4 ${index === 0 ? 'font-bold text-white' : ''}`}>{cell}</td>)}</tr>)}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="choice" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Перед оплатой</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Что проверить в тарифе</h2>
              <div className="mt-6 space-y-3">
                {[
                  ['GEO и оператор', 'Страна должна совпадать с задачей. Выбор конкретного оператора нужен не всегда, но важен для локальных проверок.'],
                  ['Ротация', 'Уточните, меняется ли IP по кнопке, ссылке, таймеру или API и можно ли удерживать одну сессию.'],
                  ['Трафик', 'Безлимит удобен для постоянной работы. Оплата за гигабайты может быть выгоднее при редких запросах.'],
                  ['Одновременные подключения', 'Большой пул IP не означает, что тариф даст много разных адресов одновременно.'],
                  ['Протокол и авторизация', 'Для антидетекта чаще всего достаточно SOCKS5 и пары логин/пароль.'],
                  ['Тест', 'Не покупайте большой срок до проверки на своей реальной площадке и рабочем сценарии.'],
                ].map(([title, text], index) => (
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
                {[
                  'Скопируйте хост, порт, логин и пароль или готовую строку подключения.',
                  'В антидетекте выберите HTTP либо SOCKS5 и вставьте данные в соответствующие поля.',
                  'Проверьте соединение и убедитесь, что страна IP совпадает с выбранной.',
                  'Для нового адреса используйте ссылку смены IP, кнопку в кабинете или API.',
                  'После ротации обновите страницу или перезапустите профиль и ещё раз проверьте адрес.',
                ].map((item, index) => <li key={item} className="flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-sm font-medium leading-6 text-white/55"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-purple/12 text-xs font-black text-brand-purple">{index + 1}</span>{item}</li>)}
              </ol>
              <div className="mt-6 rounded-2xl border border-brand-orange/20 bg-brand-orange/[0.06] p-5">
                <div className="flex items-start gap-3"><Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" /><p className="text-sm font-semibold leading-6 text-white/60">Не меняйте IP посреди важной авторизации, оплаты или заполнения формы. Сначала завершите действие, затем ротируйте адрес.</p></div>
              </div>
            </section>

            <section id="faq" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Короткие ответы</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Частые вопросы</h2>
              <div className="mt-6 space-y-3">
                {[
                  ['Чем мобильный прокси отличается от VPN?', 'Прокси можно назначить отдельному профилю или программе. VPN обычно направляет через туннель трафик всего устройства или выбранных приложений.'],
                  ['4G хуже 5G?', 'Не обязательно. Для аккаунтов и обычной работы стабильный 4G часто важнее пиковой скорости 5G.'],
                  ['Один мобильный прокси даёт много IP?', 'Обычно да, за счёт ротации пула оператора. Но количество одновременных уникальных адресов зависит от конкретного тарифа.'],
                  ['Можно ли использовать мобильный прокси постоянно?', 'Можно, если тариф и скорость подходят. Для долгой стабильной сессии проверьте возможность удерживать IP без автоматической ротации.'],
                  ['Какой сервис выбрать первым?', 'Для мобильного IP я начинаю с MobileProxy. Для короткого тарифа смотрю ProxyWing, а для гибкого выбора оператора и формата — Proxy-Seller.'],
                  ['Нужен ли мобильный прокси каждому аккаунту?', 'Нет. Если площадка нормально принимает отдельный IPv4, мобильный тариф только увеличит расходы.'],
                ].map(([question, answer]) => (
                  <details key={question} className="group rounded-xl border border-white/[0.08] bg-white/[0.025]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold text-white/75 [&::-webkit-details-marker]:hidden">{question}<Check className="h-4 w-4 shrink-0 text-brand-purple/60 transition-transform group-open:rotate-[-45deg]" /></summary>
                    <p className="border-t border-white/[0.07] px-5 py-4 text-sm font-medium leading-6 text-white/50">{answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="mt-12 rounded-2xl border border-brand-purple/25 bg-brand-purple/[0.08] p-6 md:p-8">
              <Globe className="h-6 w-6 text-brand-purple" />
              <h2 className="mt-4 font-display text-2xl font-black text-white">Мой итоговый выбор</h2>
              <div className="mt-5 space-y-3 text-sm font-medium leading-6 text-white/60">
                <p><strong className="text-white">MobileProxy</strong> — основной вариант из моего опыта, когда нужен мобильный IP и удобная ротация.</p>
                <p><strong className="text-white">ProxyWing</strong> — когда хочется взять короткий тариф и проверить задачу без оплаты месяца.</p>
                <p><strong className="text-white">Proxy-Seller</strong> — когда нужен выбор dedicated/shared, оператора и интервала ротации.</p>
              </div>
              <a href="/proxy-vpn/mobileproxy" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-purple px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-brand-purple">Подробный обзор MobileProxy <ArrowRight className="h-4 w-4" /></a>
            </section>

            <RelatedGuides items={[
              { href: '/proxy-vpn/luchshie-proksi', label: 'Все типы', title: 'Какие прокси выбрать для аккаунтов', description: 'IPv4, ISP, Residential и Mobile: когда за какой тип стоит платить.' },
              { href: '/antidetect', label: 'Антидетекты', title: 'Выбрать антидетект-браузер', description: 'Сервисы для отдельных профилей, отпечатков и работы с прокси.' },
              { href: '/guides/mobile-ip-airplane-mode', label: 'Бесплатный вариант', title: 'Смена IP режимом самолёта', description: 'Когда аккаунтов немного и можно обойтись мобильным интернетом телефона.' },
              { href: '/proxy-vpn', label: 'Каталог', title: 'Все прокси и VPN', description: 'Сравнение сервисов, типов, способов оплаты и промокодов.' },
            ]} />
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
