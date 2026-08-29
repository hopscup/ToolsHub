import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Monitor,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { BackgroundParticles } from './BackgroundParticles';
import { RelatedGuides } from './RelatedGuides';

type ArticleTheme = 'dark' | 'light';

const ARTICLE_THEME_KEY = 'hopscup-article-theme';

const ArticleImage = ({ src, alt, caption }: { src: string; alt: string; caption: string }) => (
  <figure className="my-8">
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

const GuideNote = ({ children }: { children: ReactNode }) => (
  <div className="my-6 rounded-r-2xl border-l-2 border-brand-purple bg-brand-purple/[0.07] px-5 py-4 text-sm font-semibold leading-7 text-white/65 md:text-base">
    {children}
  </div>
);

const StepList = ({ children }: { children: ReactNode }) => (
  <ul className="mt-6 space-y-4">{children}</ul>
);

const StepItem = ({ children }: { children: ReactNode }) => (
  <li className="flex items-start gap-3 text-sm font-medium leading-7 text-white/65 md:text-base">
    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-purple" />
    <span>{children}</span>
  </li>
);

export const GmailForwardingGuideArticle = () => {
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
            <Mail className="h-4 w-4" />
            Практический гайд Hopscup
          </div>
          <h1 className="mx-auto max-w-4xl font-display text-4xl font-black leading-[1.08] text-white md:text-6xl">
            Переадресация писем из Gmail на другую почту
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/55 md:text-lg">
            Пошаговая настройка форвардинга, чтобы собирать нужные письма в одном почтовом ящике.
          </p>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-5 md:px-8 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-center">
          <aside className="hidden lg:block">
            <nav className="article-toc sticky top-24 rounded-2xl border border-white/[0.08] bg-[#111111]/80 p-4 backdrop-blur-xl" aria-label="Содержание статьи">
              <p className="px-2 pb-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/25">Содержание</p>
              {[
                ['#before', 'Перед началом'],
                ['#add-address', 'Добавление адреса'],
                ['#enable', 'Включение пересылки'],
                ['#result', 'Проверка результата'],
              ].map(([href, label]) => (
                <a key={href} href={href} className="block rounded-lg px-2 py-2 text-xs font-semibold text-white/45 transition-colors hover:bg-white/5 hover:text-brand-purple">
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          <article className="article-card min-w-0 rounded-[1.5rem] border border-white/[0.08] bg-[#0d0d0d]/90 px-5 py-7 shadow-2xl backdrop-blur-xl md:px-9 md:py-10">
            <section id="before" className="scroll-mt-28">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Перед настройкой</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Важные моменты перед началом</h2>
              <div className="mt-6 grid gap-3">
                {[
                  { icon: Monitor, text: 'Настройка делается только на компьютере в браузере. В мобильном приложении Gmail это невозможно.' },
                  { icon: ShieldCheck, text: 'Сначала нужно добавить и подтвердить адрес пересылки.' },
                  { icon: Settings, text: 'Можно пересылать все письма или только некоторые через фильтры.' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-purple/20 bg-brand-purple/10">
                      <Icon className="h-5 w-5 text-brand-purple" />
                    </div>
                    <p className="pt-1 text-sm font-bold leading-6 text-white/65">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="add-address" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Шаг 1</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Добавление адреса пересылки</h2>
              <StepList>
                <StepItem>Откройте Gmail на компьютере и войдите в аккаунт, из которого хотите пересылать письма.</StepItem>
                <StepItem>В правом верхнем углу нажмите на значок шестерёнки, затем выберите «Все настройки».</StepItem>
              </StepList>
              <ArticleImage
                src="/article/gmail-forwarding/open-settings.jpg"
                alt="Переход из Gmail в раздел всех настроек"
                caption="Нажимаем на шестерёнку и открываем все настройки Gmail."
              />

              <StepList>
                <StepItem>Перейдите во вкладку «Пересылка и POP/IMAP» или просто «Пересылка».</StepItem>
              </StepList>
              <ArticleImage
                src="/article/gmail-forwarding/forwarding-tab.jpg"
                alt="Вкладка Пересылка и POP IMAP в настройках Gmail"
                caption="Открываем вкладку «Пересылка и POP/IMAP»."
              />

              <StepList>
                <StepItem>В разделе «Пересылка» нажмите кнопку «Добавить адрес пересылки».</StepItem>
              </StepList>
              <ArticleImage
                src="/article/gmail-forwarding/add-address.jpg"
                alt="Добавление нового адреса пересылки в Gmail"
                caption="Добавляем адрес, на который Gmail будет пересылать письма."
              />

              <StepList>
                <StepItem>Введите email-адрес, на который хотите получать письма, и нажмите «Далее», затем «Продолжить».</StepItem>
                <StepItem>Google отправит на этот адрес письмо с кодом подтверждения. Перейдите в другую почту, откройте письмо от Google и нажмите ссылку подтверждения или введите код вручную.</StepItem>
              </StepList>
            </section>

            <section id="enable" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Шаг 2</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Включение переадресации</h2>
              <StepList>
                <StepItem>Вернитесь в настройки Gmail: шестерёнка → «Все настройки» → «Пересылка и POP/IMAP».</StepItem>
                <StepItem>В разделе «Пересылка» выберите «Пересылать копию входящих писем на», затем укажите добавленный адрес.</StepItem>
                <StepItem>
                  Выберите, что делать с оригиналом письма в Gmail: оставить копию во «Входящих», отметить как прочитанное, архивировать или удалить.
                </StepItem>
                <StepItem>Внизу страницы нажмите «Сохранить изменения».</StepItem>
              </StepList>
              <ArticleImage
                src="/article/gmail-forwarding/enable-forwarding.jpg"
                alt="Включённая переадресация и выбор действия с оригиналом письма"
                caption="Включаем пересылку, выбираем действие с оригиналом и сохраняем изменения."
              />
            </section>

            <section id="result" className="mt-12 scroll-mt-28 border-t border-white/[0.08] pt-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-purple">Готово</p>
              <h2 className="mt-3 font-display text-2xl font-black text-white md:text-3xl">Проверяем результат</h2>
              <GuideNote>Теперь все новые письма будут автоматически пересылаться на выбранный адрес.</GuideNote>
              <p className="text-sm font-medium leading-7 text-white/65 md:text-base">
                Отправьте тестовое письмо на исходный Gmail и убедитесь, что оно появилось в конечном ящике. Если письма нет, проверьте папки «Спам» и «Промоакции».
              </p>
              <GuideNote>
                Не забывай подписываться на канал{' '}
                <a href="https://t.me/hopscupcrpt" target="_blank" rel="noopener noreferrer" className="text-brand-purple underline underline-offset-4">
                  Hopscup Crew
                </a>.
              </GuideNote>
              <ArticleImage
                src="/article/gmail-forwarding/hopscup-crypto.jpg"
                alt="Hopscup Crypto"
                caption="Новые гайды и рабочие материалы в Hopscup Crew."
              />
            </section>
            <RelatedGuides items={[
              { href: '/guides/account-farm', label: 'Аккаунты', title: 'Ферма аккаунтов', description: 'Где брать почты, аккаунты, номера, прокси и антидетекты.' },
              { href: '/account-shop', label: 'Аккаунты', title: 'Магазины аккаунтов', description: 'Сравнение площадок для покупки готовых аккаунтов.' },
              { href: '/sms-activators', label: 'Номера', title: 'SMS-активаторы', description: 'Виртуальные номера для регистрации и подтверждения аккаунтов.' },
            ]} />
          </article>
        </div>
      </main>
    </div>
  );
};
