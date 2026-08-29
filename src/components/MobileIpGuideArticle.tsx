import {
  ArrowLeft,
  ExternalLink,
  Info,
  Monitor,
  Moon,
  Plane,
  Smartphone,
  Sun,
  Usb,
  Wifi,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { BackgroundParticles } from './BackgroundParticles';
import { RelatedGuides } from './RelatedGuides';

type ArticleTheme = 'dark' | 'light';

const ARTICLE_THEME_KEY = 'hopscup-article-theme';

const ArticleImage = ({ src, alt, caption, compact = false }: { src: string; alt: string; caption: string; compact?: boolean }) => (
  <figure className={`my-8 ${compact ? 'mx-auto max-w-md' : ''}`}>
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Открыть изображение: ${alt}`}
      className="block overflow-hidden rounded-2xl border border-white/10 bg-white transition-colors hover:border-brand-purple/40"
    >
      <img src={src} alt={alt} loading="lazy" decoding="async" className="block h-auto w-full" />
    </a>
    <figcaption className="mt-3 text-xs font-semibold leading-5 text-white/40">{caption}</figcaption>
  </figure>
);

const GuideQuote = ({ children, warning = false }: { children: ReactNode; warning?: boolean }) => (
  <blockquote className={`my-6 rounded-r-2xl border-l-2 px-5 py-4 text-sm font-semibold leading-7 md:text-base ${warning ? 'border-brand-orange bg-brand-orange/[0.06] text-white/65' : 'border-brand-purple bg-brand-purple/[0.07] text-white/65'}`}>
    {children}
  </blockquote>
);

export const MobileIpGuideArticle = () => {
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
            Смена айпи мобильным интернетом и режимом самолёта
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/55 md:text-lg">
            Работает на Android и iPhone, по Wi-Fi и через USB-подключение к компьютеру.
          </p>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-5 md:px-8 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-center">
          <aside className="hidden lg:block">
            <nav className="article-toc sticky top-24 rounded-2xl border border-white/[0.08] bg-[#111111]/80 p-4 backdrop-blur-xl" aria-label="Содержание статьи">
              <p className="px-2 pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/25">Содержание</p>
              {[
                ['#phone', 'Смена IP на телефоне'],
                ['#check', 'Проверка IP'],
                ['#computer', 'Подключение к ПК'],
                ['#android', 'Android и USB'],
                ['#iphone', 'iPhone и iTunes'],
              ].map(([href, label]) => (
                <a key={href} href={href} className="block rounded-lg px-2 py-2 text-xs font-semibold text-white/45 transition-colors hover:bg-white/5 hover:text-brand-purple">
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          <article className="article-card min-w-0 rounded-[1.5rem] border border-white/[0.08] bg-[#0d0d0d]/90 px-5 py-7 shadow-2xl backdrop-blur-xl md:px-9 md:py-10">
            <section id="phone" className="scroll-mt-28">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Телефон и мобильный интернет</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Смена IP режимом самолёта</h2>
              <p className="mt-4 text-sm font-medium leading-7 text-white/65 md:text-base">
                Работает как по проводу, на случай если ПК не поддерживает Wi-Fi, так и в режиме раздачи интернета с вашего телефона.
              </p>

              <GuideQuote>
                На мой взгляд, это самый оптимальный и дешёвый вариант смены айпи. Работает и на iPhone, и на Android.
              </GuideQuote>

              <div className="my-6 flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                <p className="text-sm font-bold leading-6 text-white/65">
                  Нужен только телефон и мобильный интернет. Важно, чтобы тариф поддерживал раздачу модема. Обычно достаточно 5-10 ГБ трафика.
                </p>
              </div>

              <GuideQuote>Каждый раз, когда мы включаем режим самолёта, IP-адрес меняется.</GuideQuote>

              <div className="mt-7 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-purple/20 bg-brand-purple/10">
                  <Plane className="h-5 w-5 text-brand-purple" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">Включаем самолёт на 3-10 секунд</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-white/55">Затем выключаем режим самолёта и ждём восстановления мобильной сети.</p>
                </div>
              </div>

              <ArticleImage
                src="/article/mobile-ip/airplane-mode.jpg"
                alt="Кнопка режима полета в панели Android"
                caption="Включаем режим полёта на несколько секунд."
                compact
              />
            </section>

            <section id="check" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">После переподключения</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Проверяем новый IP</h2>
              <p className="mt-4 text-sm font-medium leading-7 text-white/65 md:text-base">
                Выключаем режим самолёта, после чего айпи должен смениться. Проверить адрес можно на одном из сервисов ниже.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a href="https://2ip.io/" target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm font-bold text-white/65 transition-colors hover:border-brand-purple/40 hover:text-white">
                  2ip.io <ExternalLink className="h-4 w-4" />
                </a>
                <a href="https://whoer.net/" target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm font-bold text-white/65 transition-colors hover:border-brand-purple/40 hover:text-white">
                  Whoer <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <GuideQuote>
                Если вы беспокоитесь, что в рамках одного аккаунта будет постоянно разный айпи, в этом нет ничего страшного. Мобильный интернет и так несколько раз в день меняет адрес.
              </GuideQuote>
            </section>

            <section id="computer" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Если работаете не только с телефона</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Смена айпи на ПК или ноутбуке</h2>
              <p className="mt-4 text-sm font-medium leading-7 text-white/65 md:text-base">
                Взяв USB-провод и подключив телефон к ПК, мы можем создать модем под рукой с постоянной сменой айпи по желанию.
              </p>
              <div className="mt-7 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-purple/20 bg-brand-purple/10">
                  <Usb className="h-5 w-5 text-brand-purple" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">Берём USB</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-white/55">Подключаем кабель к телефону и компьютеру.</p>
                </div>
              </div>
              <ArticleImage
                src="/article/mobile-ip/usb-cable.jpg"
                alt="USB-кабель для подключения телефона к компьютеру"
                caption="Подойдёт обычный кабель для передачи данных."
                compact
              />
            </section>

            <section id="android" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <div className="flex items-center gap-3">
                <Wifi className="h-5 w-5 text-brand-purple" />
                <h2 className="font-display text-2xl font-black text-white md:text-3xl">Подключение Android к ПК</h2>
              </div>
              <p className="mt-4 text-sm font-medium leading-7 text-white/65 md:text-base">
                Заходим в телефон. На Xiaomi это пункт «Точка доступа Wi-Fi», затем включаем USB-модем.
              </p>
              <ArticleImage
                src="/article/mobile-ip/android-usb-modem.png"
                alt="Включение USB-модема в настройках точки доступа Xiaomi"
                caption="На Xiaomi открываем «Точка доступа Wi-Fi» и включаем USB-модем."
                compact
              />

              <div className="mt-7 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-purple/20 bg-brand-purple/10">
                  <Monitor className="h-5 w-5 text-brand-purple" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">Подтверждаем сеть на ПК</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-white/55">Когда Windows покажет окно новой сети, нажимаем «Да».</p>
                </div>
              </div>
              <ArticleImage
                src="/article/mobile-ip/windows-network-confirmation.png"
                alt="Окно обнаружения новой сети в Windows с кнопкой Да"
                caption="Когда Windows обнаружит новую сеть, разрешаем другим устройствам находить компьютер."
                compact
              />

              <GuideQuote>
                И всё отлично работает. Меняем айпи режимом самолёта на телефоне, и на ПК он через 10-15 секунд тоже меняется.
              </GuideQuote>
              <GuideQuote warning>
                Главное, следите, чтобы компьютер случайно не переключился обратно на ваш Wi-Fi-роутер. Такое бывает.
              </GuideQuote>
              <GuideQuote>
                Не забывайте проверять через{' '}
                <a href="https://2ip.io/" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-purple underline underline-offset-4">2ip.io</a>
                {' '}или{' '}
                <a href="https://whoer.net/" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-purple underline underline-offset-4">Whoer</a>,
                {' '}действительно ли айпи меняется. Эта функция работает не на каждом тарифе и не в каждой стране.
              </GuideQuote>
              <ArticleImage
                src="/article/mobile-ip/new-ip-check-2ip.png"
                alt="Проверка нового IP-адреса на сайте 2ip.io после переподключения"
                caption="После переподключения открываем 2ip.io и убеждаемся, что IP-адрес изменился."
                compact
              />
            </section>

            <section id="iphone" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">iPhone и компьютер</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Подключение через iTunes</h2>
              <p className="mt-4 text-sm font-medium leading-7 text-white/65 md:text-base">
                Для iPhone тоже можно сделать раздачу по проводу, но на ПК понадобится iTunes. У меня не было подходящего кабеля для проверки, поэтому ниже оставляю пример с YouTube. Видео не моё.
              </p>
              <a href="https://youtu.be/CX72O91G5ek?si=U9cGjY0-PVULsYrG" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white hover:text-brand-purple">
                Смотреть пример на YouTube <ExternalLink className="h-4 w-4" />
              </a>

              <GuideQuote>
                Не забывай подписываться на канал <a href="https://t.me/hopscupcrpt" target="_blank" rel="noopener noreferrer" className="text-brand-purple underline underline-offset-4">Hopscup Crew</a>.
              </GuideQuote>
              <ArticleImage
                src="/article/mobile-ip/iphone-itunes-video.jpg"
                alt="Hopscup Crypto"
                caption="Канал Hopscup Crew с новыми гайдами и рабочими материалами."
              />
            </section>
            <RelatedGuides items={[
              { href: '/proxy-vpn/luchshie-proksi', label: 'Прокси', title: 'Какие прокси выбрать', description: 'Когда мобильного интернета уже мало и нужен отдельный IP на профиль.' },
              { href: '/guides/account-farm', label: 'Аккаунты', title: 'Ферма аккаунтов', description: 'Полная схема с аккаунтами, номерами, прокси и антидетектами.' },
              { href: '/antidetect', label: 'Антидетекты', title: 'Мобильные и ПК-антидетекты', description: 'Сервисы для управления профилями с телефона и компьютера.' },
            ]} />
          </article>
        </div>
      </main>
    </div>
  );
};
