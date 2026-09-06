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
import { RelatedGuides } from './RelatedGuides';

type ArticleTheme = 'dark' | 'light';

const ARTICLE_THEME_KEY = 'hopscup-article-theme';
const VIDEO_GUIDE_URL = 'https://youtu.be/pBljqjuY2ls?si=Ft3UMgxjNUvaRT4d';

const GuideNote = ({ children, warning = false }: { children: ReactNode; warning?: boolean }) => (
  <div className={`my-6 rounded-r-2xl border-l-2 px-5 py-4 text-sm font-semibold leading-7 md:text-base ${warning ? 'border-brand-orange bg-brand-orange/[0.06] text-white/65' : 'border-brand-purple bg-brand-purple/[0.07] text-white/65'}`}>
    {children}
  </div>
);

const StepItem = ({ children }: { children: ReactNode }) => (
  <li className="flex items-start gap-3 text-sm font-medium leading-7 text-white/65 md:text-base">
    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-purple" />
    <span>{children}</span>
  </li>
);

const SettingRow = ({ name, value }: { name: string; value: ReactNode }) => (
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

export const AntidetectSetupGuideArticle = () => {
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
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-black leading-[1.08] text-white md:text-6xl">
            Как настроить антидетект-браузер, чтобы не спалиться
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-relaxed text-white/55 md:text-lg">
            Сначала разберём, что вообще нужно менять. Затем покажу готовые настройки на примере Dolphin Anty, AdsPower и ShardX.
          </p>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-5 md:px-8 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-center">
          <aside className="hidden lg:block">
            <nav className="article-toc sticky top-24 rounded-2xl border border-white/[0.08] bg-[#111111]/80 p-4 backdrop-blur-xl" aria-label="Содержание статьи">
              <p className="px-2 pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/25">Содержание</p>
              {[
                ['#how-it-works', 'Что меняет антидетект'],
                ['#common-settings', 'Что перепроверить'],
                ['#dolphin', 'Dolphin Anty'],
                ['#adspower', 'AdsPower'],
                ['#shardx', 'ShardX'],
                ['#check', 'Проверка профиля'],
                ['#mistakes', 'Частые ошибки'],
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
                Антидетект создаёт отдельный браузерный профиль: свои cookies, историю, локальное хранилище и отпечаток устройства. Но сам по себе он не меняет ваш IP. Для этого нужна прокси или{' '}
                <a href="/guides/mobile-ip-airplane-mode" className="font-bold text-brand-purple transition-colors hover:text-white hover:underline">
                  мобильный интернет + режим самолёта
                </a>.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Fingerprint, title: 'Антидетект', text: 'Подменяет и разделяет данные браузера и устройства.' },
                  { icon: Network, title: 'Прокси', text: 'Меняет IP и сетевое местоположение профиля.' },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-5">
                    <Icon className="h-5 w-5 text-brand-purple" />
                    <h3 className="mt-4 text-sm font-black text-white">{title}</h3>
                    <p className="mt-2 text-xs font-medium leading-5 text-white/50">{text}</p>
                  </div>
                ))}
              </div>

              <GuideNote>
                Главное правило: один профиль должен выглядеть как одно и то же нормальное устройство, похожее на реального пользователя при каждом запуске. Обычно все базовые настройки антика уже сделаны грамотно.
              </GuideNote>
            </section>

            <section id="common-settings" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <h2 className="font-display text-2xl font-black text-white md:text-3xl">Но что стоит перепроверить</h2>
              <dl className="mt-6">
                <SettingRow name="IP и прокси" value="Для профиля должен использоваться нужный IP. Если аккаунты не должны быть связаны между собой, не сажайте их на одну и ту же постоянную прокси." />
                <SettingRow name="ОС и User-Agent" value="ОС стараемся ставить на основе вашего реального устройства. То есть если у вас ПК на Windows, ставим ОС нового профиля Windows, а не macOS или Linux." />
                <SettingRow name="Часовой пояс" value="Ставим Auto или на основании вашего IP. Время профиля должно соответствовать стране и городу прокси." />
                <SettingRow name="Геолокация" value="Ставим Auto или на основании вашего IP." />
                <SettingRow name="Язык" value="Ставим Auto или на основании вашего IP. Русский язык с IP Казахстана или Узбекистана выглядит нормально, но случайная мешанина языков уже такое себе." />
                <SettingRow name="WebRTC" value="Не оставляйте Real. Используйте подмену, шум, режим на основе прокси или Auto." />
                <SettingRow name="Canvas и WebGL" value="Оставляйте автоматический стабильный отпечаток или штатный noise. Не меняйте видеокарту, Canvas и железо отдельными случайными значениями." />
                <SettingRow name="Do Not Track" value="Обычно Off. У большинства обычных пользователей этот параметр не включён." />
                <SettingRow name="Экран и железо" value="Ставим Auto. Разрешение, процессор, память и видеокарта должны сочетаться с выбранным устройством." />
              </dl>
            </section>

            <section id="dolphin" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <BrowserHeading logo="/dolphin.webp" name="Dolphin Anty">
                Нормальный вариант для обычной работы с аккаунтами. В большинстве случаев стандартные настройки уже подходят.
              </BrowserHeading>
              <ol className="mt-7 space-y-4">
                <StepItem>Откройте «Профили браузера» и нажмите «Создать профиль».</StepItem>
                <StepItem>Выберите Windows и актуальное ядро Chromium. Новый отпечаток генерируем один раз при создании.</StepItem>
                <StepItem>Добавьте прокси, дождитесь проверки соединения и посмотрите, правильно ли определились IP и страна.</StepItem>
                <StepItem>Часовой пояс, язык и геолокацию оставьте на Auto.</StepItem>
                <StepItem>Для WebRTC выберите «Подмена» или Altered. Real с прокси оставлять не надо.</StepItem>
                <StepItem>Canvas, WebGL, Audio, Client Rects, процессор, память и экран без причины не трогаем.</StepItem>
                <StepItem>Создайте профиль и дальше запускайте его с тем же сохранённым отпечатком.</StepItem>
              </ol>
              <ArticleScreenshot
                src="/article/antidetect-setup/dolphin-profile-settings-1.png"
                alt="Настройки профиля Dolphin Anty: Windows, User-Agent, WebRTC, Canvas и WebGL"
                caption="Dolphin Anty: ОС, User-Agent, WebRTC и основные параметры отпечатка."
              />
              <ArticleScreenshot
                src="/article/antidetect-setup/dolphin-profile-settings-2.png"
                alt="Настройки профиля Dolphin Anty: часовой пояс, язык, геолокация, процессор, память и шрифты"
                caption="Dolphin Anty: часовой пояс, язык, геолокация и параметры устройства."
              />
              <a href="/antidetect/dolphin-anty" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-purple hover:text-white">
                Открыть страницу Dolphin Anty <ExternalLink className="h-4 w-4" />
              </a>
            </section>

            <section id="adspower" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <BrowserHeading logo="/adspower.webp" name="AdsPower">
                Здесь параметров больше, но это не значит, что каждый из них нужно обязательно менять.
              </BrowserHeading>
              <ol className="mt-7 space-y-4">
                <StepItem>Нажмите New Profile. Для обычного профиля выбирайте SunBrowser, версию ядра Auto и нужную ОС.</StepItem>
                <StepItem>В разделе Proxy выберите Custom, вставьте прокси и нажмите Check Proxy.</StepItem>
                <StepItem>Timezone, Location и Language поставьте Based on IP.</StepItem>
                <StepItem>Для WebRTC выберите «Прокси UDP». Если ваша прокси не поддерживает UDP, используйте «Подмену». Реальный IP оставлять не надо.</StepItem>
                <StepItem>WebGPU оставьте Based on WebGL, остальные параметры отпечатка оставьте стандартными.</StepItem>
                <StepItem>Не включайте Random fingerprint on startup для постоянного аккаунта: при следующем входе он не должен внезапно стать другим устройством.</StepItem>
                <StepItem>Сохраните профиль, запустите его и проверьте IP и отпечаток.</StepItem>
              </ol>
              <ArticleScreenshot
                src="/article/antidetect-setup/adspower-profile-settings-1.png"
                alt="Настройки профиля AdsPower: SunBrowser, Windows и User-Agent"
                caption="AdsPower: выбор браузера, операционной системы и User-Agent."
              />
              <ArticleScreenshot
                src="/article/antidetect-setup/adspower-profile-settings-2.png"
                alt="Настройки профиля AdsPower: WebRTC через прокси UDP, часовой пояс, геолокация, язык и экран"
                caption="AdsPower: WebRTC через прокси UDP и остальные параметры на основе IP."
              />
              <a href="/antidetect/adspower" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-purple hover:text-white">
                Открыть страницу AdsPower <ExternalLink className="h-4 w-4" />
              </a>
            </section>

            <section id="shardx" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <BrowserHeading logo="/proxyshard.webp" name="ShardX">
                Бесплатный вариант с локальными профилями. Точные параметры здесь тоже лучше доверить готовому шаблону.
              </BrowserHeading>
              <ol className="mt-7 space-y-4">
                <StepItem>Нажмите Create Profile, задайте имя и выберите подходящий шаблон устройства.</StepItem>
                <StepItem>Отключите генерацию нового случайного отпечатка при каждом запуске профиля.</StepItem>
                <StepItem>Автоматическую настройку профиля оставьте включённой.</StepItem>
                <StepItem>Timezone, Language и Geo оставьте Auto: значения подтянутся по IP подключённой прокси.</StepItem>
                <StepItem>Для Canvas, WebGL и Audio используйте Auto noise. Вручную значения не собираем.</StepItem>
                <StepItem>WebRTC оставьте Auto. Если есть выбор прокси, используйте SOCKS5 с поддержкой UDP.</StepItem>
                <StepItem>Добавьте прокси, привяжите её к профилю, запустите браузер и переходите к проверке.</StepItem>
              </ol>
              <ArticleScreenshot
                src="/article/antidetect-setup/shardx-profile-settings.png"
                alt="Настройки профиля ShardX: Windows, прокси, часовой пояс, язык, WebRTC, геолокация и Noise"
                caption="Пример настроек профиля ShardX"
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/antidetect/shardx" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-brand-purple/35 bg-brand-purple/10 px-4 py-2 text-xs font-black text-brand-purple transition-colors hover:bg-brand-purple hover:text-white">
                  Страница ShardX <ExternalLink className="h-4 w-4" />
                </a>
                <a href={VIDEO_GUIDE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black text-white/65 transition-colors hover:border-brand-purple/40 hover:text-white">
                  Смотреть видеогайд <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </section>

            <section id="check" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Финальная проверка</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Что смотреть в чекерах</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { href: 'https://pixelscan.net/', title: 'Pixelscan', text: 'Общая проверка IP и отпечатка' },
                  { href: 'https://browserleaks.com/', title: 'BrowserLeaks', text: 'WebRTC, Canvas, WebGL и DNS' },
                  { href: 'https://2ip.io/', title: '2ip.io', text: 'IP, страна и провайдер' },
                ].map(({ href, title, text }) => (
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
                <StepItem>Сайт видит IP вашей прокси, а не настоящий IP компьютера.</StepItem>
                <StepItem>
                  Если у вас датацентровая прокси (IPv4) и чекер пишет <strong className="font-black text-white/80">Proxy/VPN detected</strong>, это нормально. Он распознал IP дата-центра по провайдеру и диапазону адресов, а не нашёл утечку вашего настоящего IP. Для большинства обычных задач такие прокси подходят. Но в сервисах с сильным антифродом (букмекеры, биржи и т. д.) лучше использовать только ISP, Residential или Mobile IP.
                </StepItem>
                <StepItem>Страна, часовой пояс, геолокация и язык совпадают под ваше гео.</StepItem>
                <StepItem>WebRTC не показывает ваш реальный адрес.</StepItem>
                <StepItem>WebGL Vendor и Renderer выглядят как обычная Intel, AMD или NVIDIA, а не случайный набор.</StepItem>
                <StepItem>После повторного запуска этот же профиль сохраняет тот же отпечаток и cookies.</StepItem>
              </ul>
              <GuideNote warning>
                Зелёный чекер не даёт гарантию, что аккаунт никогда не заблокируют. Площадки смотрят ещё на качество IP, историю аккаунта и ваши действия.
              </GuideNote>
            </section>

            <section id="mistakes" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-orange">Не делайте так</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Частые ошибки при настройке</h2>
              <div className="mt-6 space-y-3">
                {[
                  'Менять Canvas, WebGL, процессор, память и экран отдельными случайными значениями.',
                  'Генерировать новый отпечаток при каждом запуске постоянного профиля.',
                  'Ставить прокси США, часовой пояс Москвы и геолокацию другой страны.',
                  'Оставлять WebRTC в режиме Real после подключения прокси.',
                  'Постоянно менять страну прокси у аккаунта без реальной необходимости.',
                  'Сразу создавать сотню профилей, не проверив один готовый профиль.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 border-b border-white/[0.07] py-3 text-sm font-medium leading-6 text-white/60 last:border-b-0">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>

              <GuideNote>
                Если совсем коротко: создаём профиль, перепроверяем параметры (но обычно я даже не чекаю), добавляем отдельный IP, например с помощью прокси. Если что, у меня есть видео на 15 минут с объяснением всех нюансов.
              </GuideNote>

              <a href={VIDEO_GUIDE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white hover:text-brand-purple">
                Большой видеогайд по прокси и антидетектам <ExternalLink className="h-4 w-4" />
              </a>
            </section>

            <RelatedGuides items={[
              { href: '/antidetect/kakoy-vybrat', label: 'Сравнение', title: 'Какой антидетект выбрать', description: 'Бесплатные профили, тарифы и варианты под разные задачи.' },
              { href: '/proxy-vpn/luchshie-proksi', label: 'Прокси', title: 'Какие прокси выбрать', description: 'IPv4, ISP, Residential и Mobile без путаницы в названиях.' },
              { href: '/guides/mobile-ip-airplane-mode', label: 'Бесплатный IP', title: 'Смена IP мобильным интернетом', description: 'Как использовать телефон вместо отдельной мобильной прокси.' },
            ]} />
          </article>
        </div>
      </main>
    </div>
  );
};
