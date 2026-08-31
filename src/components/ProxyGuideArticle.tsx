import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Globe,
  Info,
  Layers,
  Moon,
  Search,
  ShieldCheck,
  Smartphone,
  Sun,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { BackgroundParticles } from './BackgroundParticles';
import { RelatedGuides } from './RelatedGuides';
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

const providers: Provider[] = [
  {
    id: 'p3',
    name: 'ProxyWing',
    logo: '/proxywing.webp',
    url: 'https://dashboard.proxywing.com/billing/aff.php?aff=813',
    types: 'IPv4, ISP, Residential, Mobile',
    choice: 'Универсальный вариант',
    note: 'Я бы начинал с их IPv4. Если площадка принимает их плохо, в том же сервисе можно перейти на ISP, Residential или Mobile.',
    promoCode: 'hopscup',
    promoDiscount: '−10%',
  },
  {
    id: 'p4',
    name: 'Proxy-Seller',
    logo: '/proxy-seller.webp',
    url: 'https://proxy-seller.com/?partner=RIPC5NDAEYRZPZ',
    types: 'IPv4, IPv6, ISP, Residential, Mobile',
    choice: 'Качество и большой выбор',
    note: 'Один из сервисов, куда я смотрю, когда важно качество. Особенно нравится выбор Residential и большое количество стран.',
    promoCode: 'hopscup',
    promoDiscount: '−10%',
  },
  {
    id: 'p2',
    name: 'Proxyline',
    logo: '/proxyline.webp',
    url: 'https://proxyline.net?line=152448',
    types: 'IPv4, IPv6',
    choice: 'Недорогие IPv4',
    note: 'Проверенный вариант для аккаунтов, парсинга и автоматизации, если под задачу хватает обычного отдельного IPv4.',
    promoCode: 'hopscup',
    promoDiscount: '−10%',
  },
  {
    id: 'p5',
    name: 'Proxy6',
    logo: '/proxy6.webp',
    url: 'https://px6.net/c/103460',
    types: 'IPv4, IPv6, Shared IPv4, MTProto',
    choice: 'Много IP без переплаты',
    note: 'Подходит для повседневных задач и автоматизации. Shared для серьезной работы я бы не брал, лучше отдельный IPv4.',
    promoCode: 'hopscup',
    promoDiscount: '−5%',
  },
  {
    id: 'p6',
    name: 'MobileProxy',
    logo: '/mobileproxy.webp',
    url: 'https://mobileproxy.rent/user.html?free&p=105422',
    types: 'Mobile',
    choice: 'Мобильные прокси',
    note: 'Пользуюсь больше трех лет. Трафик безлимитный, IP меняется по кнопке, но несколько профилей с разными IP придется отрабатывать по очереди.',
    promoCode: 'hopscup',
    promoDiscount: '−20%',
  },
  {
    id: 'p1',
    name: 'ProxyShard',
    logo: '/proxyshard.webp',
    url: 'https://proxyshard.com?ref=hopscup',
    types: 'IPv4, ISP, Residential, Mobile',
    choice: 'Баланс цены и качества',
    note: 'Универсальный сервис с основными типами прокси. Удобно, если для разных проектов нужны и обычные IPv4, и более трастовые варианты.',
    promoCode: 'hoscup',
  },
  {
    id: 'p7',
    name: 'Proxys.io',
    logo: '/proxys-io.webp',
    url: 'https://proxys.io/?refid=54507',
    types: 'IPv4, IPv6, Residential, Mobile, Dynamic',
    choice: 'Большой выбор форматов',
    note: 'Я тестировал здесь обычные IPv4 и Residential, оба варианта работали хорошо. Есть динамические прокси и много способов оплаты.',
  },
];

const proxyTypes = [
  {
    name: 'IPv4',
    price: 'Самый доступный вариант',
    text: 'Мой базовый выбор для Gmail, Twitter, Discord, Telegram, Яндекса, нейронок, антидетектов, парсинга и автоматизации. Не нужно сразу переплачивать за более дорогой тип.',
  },
  {
    name: 'ISP',
    price: 'Дороже обычных IPv4',
    text: 'Смотрю в их сторону для рекламных кабинетов, браузерных нод, мультиакков бирж и других задач, где обычные серверные IP уже принимаются хуже.',
  },
  {
    name: 'Residential',
    price: 'Обычно оплата за трафик',
    text: 'Выглядят как домашний интернет. Удобно, когда нужен высокий траст, а профиль не держится открытым постоянно и не расходует много гигабайт.',
  },
  {
    name: 'Mobile',
    price: 'Самый дорогой тип',
    text: 'Мобильный источник IP и частая смена адресов. Хороший вариант для капризных площадок, но профили чаще приходится запускать по очереди.',
  },
];

const ArticleScreenshot = ({ src, alt, caption, className = '' }: { src: string; alt: string; caption: string; className?: string }) => (
  <figure className={`my-8 min-w-0 ${className}`}>
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

const OutboundButton = ({ provider }: { provider: Provider }) => (
  <a
    href={provider.url}
    target="_blank"
    rel="sponsored noopener noreferrer"
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
          Лучшие прокси-сервисы для аккаунтов
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/55 md:text-lg">
          Семь сервисов, которыми я пользуюсь сам. Разбираемся, когда хватит обычного IPv4, а когда есть смысл брать ISP, Residential или Mobile.
        </p>
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3 text-xs font-bold text-white/45">
          <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">IPv4</span>
          <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">ISP</span>
          <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">Residential</span>
          <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">Mobile</span>
        </div>
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
              ['#check', 'Как проверить IP'],
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
            <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Сначала попробуйте обычный IPv4</h2>
            <p className="mt-4 text-sm font-medium leading-7 text-white/65 md:text-base">
              Для большинства обычных задач я начинаю с IPv4. Gmail, Twitter, Discord, Telegram, Яндекс, нейронки, антидетекты, парсинг и автоматизация обычно не требуют самого дорогого источника IP. Если конкретная площадка начинает принимать такие адреса хуже, тогда уже смотрю ISP, Residential или Mobile.
            </p>
            <div className="mt-6 rounded-2xl border border-brand-purple/20 bg-brand-purple/[0.07] p-5">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                <p className="text-sm font-semibold leading-6 text-white/65">
                  Количество аккаунтов само по себе не определяет тип прокси. Можно работать и с сотнями IPv4, если площадка их нормально принимает и у вас есть понятная схема распределения IP.
                </p>
              </div>
            </div>
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
                          rel="sponsored noopener noreferrer"
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
                  <p className="mt-4 text-sm font-medium leading-6 text-white/55">{type.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-white"><Layers className="h-4 w-4 text-brand-purple" /> SOCKS5 или HTTP</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">Если не знаете, что выбрать для антидетекта или рабочего профиля, начинайте с SOCKS5. Это более универсальный вариант.</p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-white"><Zap className="h-4 w-4 text-brand-purple" /> Что насчет IPv6</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">Они дешевые, но некоторые сайты и программы до сих пор работают с ними нестабильно. Если не уверены, берите IPv4.</p>
              </div>
            </div>
          </section>

          <section id="services" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Мои варианты</p>
            <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Семь сервисов, которыми я пользуюсь</h2>
            <p className="mt-4 text-sm font-medium leading-7 text-white/55">
              Здесь нет искусственного первого места. У каждого сервиса своя сильная сторона, поэтому я выбираю их под конкретную задачу.
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
          </section>

          <section id="setup" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">После покупки</p>
            <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Как подключить прокси</h2>
            <p className="mt-4 text-sm font-medium leading-7 text-white/60">
              Обычно сервис выдает IP, порт, логин и пароль. В антидетекте выбираете SOCKS5, вставляете данные в нужные поля и запускаете проверку. Если проверка прошла, сохраняете профиль и работаете.
            </p>
            <ArticleScreenshot
              src="/article/proxy/proxy6-issued-proxy.png"
              alt="Выдача купленного IPv4 в кабинете Proxy6"
              caption="Так выглядит выдача купленного IPv4 в Proxy6. Реальные данные скрыты."
            />
            <ArticleScreenshot
              src="/article/proxy/adspower-socks5-test.png"
              alt="Настройка SOCKS5 и успешная проверка соединения в AdsPower"
              caption="SOCKS5 добавлен в AdsPower, проверка соединения пройдена."
            />
            <p className="text-sm font-medium leading-7 text-white/60">
              С мобильными прокси логика отличается. Обычно вы подключаете прокси один раз, а новый IP получаете кнопкой в кабинете сервиса. После смены адреса обновляете или перезапускаете профиль.
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

          <section id="check" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Не обязательный ритуал для каждого IPv4</p>
            <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Как проверить IP</h2>
            <p className="mt-4 text-sm font-medium leading-7 text-white/60">
              После покупки IP можно проверить через IPQualityScore или Scamalytics. Fraud Score до 10-20 обычно выглядит нормально, 20-30 еще терпимо для базовых задач, а высокий показатель уже повод проверить другой адрес или попросить замену.
            </p>
            <div className="mt-5 rounded-2xl border border-brand-orange/20 bg-brand-orange/[0.06] p-5">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" />
                <p className="text-sm font-semibold leading-6 text-white/60">
                  IPv4 часто определяются как VPN или proxy просто потому, что они серверные. Это не делает их плохими. Обычные IPv4 я проверяю редко, если они нормально работают на нужной площадке.
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
                Если аккаунтов мало, иногда хватает обычной мобильной симки. Включаете режим самолета, выключаете его и получаете новый мобильный IP. Главное следить за гео и не пытаться одновременно держать много профилей на разных адресах.
              </p>
              <a href="/guides/mobile-ip-airplane-mode" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-purple transition-colors hover:text-white">
                Гайд по смене IP с телефона <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </section>

          <section id="faq" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Коротко по частым вопросам</p>
            <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Вопросы перед покупкой</h2>
            <div className="mt-6 space-y-3">
              {[
                ['Один профиль, один IP?', 'Для постоянных рабочих профилей это самая понятная схема. Но конкретная схема зависит от площадки и того, как вы используете аккаунты.'],
                ['Нужны ли сразу Residential или Mobile?', 'Нет. Начинайте с IPv4, если нет конкретной причины брать более дорогой источник IP.'],
                ['Можно ли брать shared-прокси?', 'Для серьезной работы я не советую. Один адрес могли продать нескольким людям, а его история вам неизвестна.'],
                ['Что выбрать: SOCKS5 или HTTP?', 'Если не уверены, выбирайте SOCKS5. Для антидетектов и рабочих профилей это более универсальный вариант.'],
                ['Какой сервис самый лучший?', 'Единственного победителя нет. Для недорогих IPv4 я смотрю Proxyline, Proxy6 и ProxyWing, для качества и большого выбора Proxy-Seller, для мобильных прокси MobileProxy.'],
              ].map(([question, answer]) => (
                <details key={question} className="group rounded-xl border border-white/[0.08] bg-white/[0.025]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold text-white/75 [&::-webkit-details-marker]:hidden">
                    {question}
                    <Check className="h-4 w-4 shrink-0 text-brand-purple/60 transition-transform group-open:rotate-[-45deg]" />
                  </summary>
                  <p className="border-t border-white/[0.07] px-5 py-4 text-sm font-medium leading-6 text-white/50">{answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-6 text-center md:p-8">
            <Globe className="mx-auto h-6 w-6 text-brand-purple" />
            <h2 className="mt-4 font-display text-2xl font-black text-white">Не знаете, с чего начать?</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm font-medium leading-6 text-white/50">
              Для обычных задач начните с IPv4 в ProxyWing, Proxyline или Proxy6. Если нужен более высокий траст, смотрите Proxy-Seller или MobileProxy под конкретную задачу.
            </p>
            <a href="/proxy-vpn" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-purple px-6 py-3 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-brand-purple">
              Сравнить все сервисы <Search className="h-4 w-4" />
            </a>
          </section>
          <RelatedGuides items={[
            { href: '/antidetect', label: 'Антидетекты', title: 'Выбрать антидетект-браузер', description: 'Сравнение базовых, усиленных и мобильных решений.' },
            { href: '/guides/account-farm', label: 'Аккаунты', title: 'Как собрать ферму аккаунтов', description: 'Аккаунты, номера, прокси, антидетекты и сервисы активности.' },
            { href: '/guides/mobile-ip-airplane-mode', label: 'Мобильный IP', title: 'Смена IP режимом самолета', description: 'Вариант для небольшого числа профилей без покупки отдельного прокси.' },
            { href: '/proxy-vpn', label: 'Каталог', title: 'Все прокси и VPN', description: 'Полная подборка сервисов с тарифами и условиями.' },
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
