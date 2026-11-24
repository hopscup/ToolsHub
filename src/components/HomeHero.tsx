import { useEffect, useRef, type CSSProperties } from 'react';
import { Zap, Youtube, Globe, Monitor, ShoppingBag, Smartphone, CreditCard, ChevronRight, Copy, Check } from 'lucide-react';
import './home-hero.css';

/**
 * Первый экран главной (/ и /en) по согласованному макету glavnaya-hero.html.
 * Шапку и меню НЕ рендерит: они остаются общими компонентами сайта.
 * Превью «Что нужно сделать?» наклоняется за мышкой (только ПК, только transform),
 * на тач-устройствах наклона нет.
 */

type Localized = { ru: string; en: string };
type HeroOffer = { id: string; name: string; logoUrl?: string; promoDiscount?: Partial<Record<string, string>> };

export type HomeHeroProps = {
  lang: 'ru' | 'en' | string;
  offers: HeroOffer[];                       // все OFFERS
  stats: { services: number; rub: number; guides: number };
  youtubeUrl: string;
  onOpenOffer: (offer: any) => void;         // handleOfferOpen из App.tsx
  onCopyPromo: (text: string, sourceId: string) => void; // copyToClipboard из App.tsx
  copiedPromoId: string | null;
  onPickTask: () => void;                    // плавный скролл к блоку «Под какую задачу»
};

const t = (lang: string, v: Localized) => (lang === 'ru' ? v.ru : v.en);

const TASKS: { offerId: string; icon: typeof Globe; title: Localized }[] = [
  { offerId: 'p6', icon: Globe, title: { ru: 'Прокси для аккаунтов и фермы', en: 'Proxies for accounts and farms' } },
  { offerId: 'ant-shardx', icon: Monitor, title: { ru: 'Бесплатный антидетект', en: 'Free antidetect browser' } },
  { offerId: 'st-dark', icon: ShoppingBag, title: { ru: 'Аккаунты и почты для работы', en: 'Accounts and email for work' } },
  { offerId: 'sms-hero', icon: Smartphone, title: { ru: 'Номер для регистрации', en: 'Number for sign-ups' } },
  { offerId: 'zarub', icon: CreditCard, title: { ru: 'Оплатить ChatGPT, Claude и подписки', en: 'Pay for ChatGPT, Claude and subscriptions' } },
];

const PROMO_SOURCE = 'home-hero';

function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;
    const zone = el.closest<HTMLElement>('[data-home-hero]') || el;
    let frame = 0, tx = 0, ty = 0, cx = 0, cy = 0, gx = 50, gy = 30;
    const MAX = 7; // градусов
    const tick = () => {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      el.style.setProperty('--tilt-x', `${cy.toFixed(2)}deg`);
      el.style.setProperty('--tilt-y', `${cx.toFixed(2)}deg`);
      el.style.setProperty('--glare-x', `${gx}%`);
      el.style.setProperty('--glare-y', `${gy}%`);
      if (Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01) frame = requestAnimationFrame(tick);
      else frame = 0;
    };
    const kick = () => { if (!frame) frame = requestAnimationFrame(tick); };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;   // -0.5..0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      tx = Math.max(-1, Math.min(1, px * 1.4)) * MAX;
      ty = Math.max(-1, Math.min(1, -py * 1.4)) * MAX;
      gx = Math.round((px + 0.5) * 100); gy = Math.round((py + 0.5) * 100);
      el.dataset.tiltActive = 'true';
      kick();
    };
    const leave = () => { tx = 0; ty = 0; el.dataset.tiltActive = 'false'; kick(); };
    zone.addEventListener('pointermove', move);
    zone.addEventListener('pointerleave', leave);
    return () => { zone.removeEventListener('pointermove', move); zone.removeEventListener('pointerleave', leave); cancelAnimationFrame(frame); };
  }, []);
  return ref;
}

export function HomeHero({ lang, offers, stats, youtubeUrl, onOpenOffer, onCopyPromo, copiedPromoId, onPickTask }: HomeHeroProps) {
  const tiltRef = useTilt<HTMLDivElement>();
  const ru = lang === 'ru';
  const copied = copiedPromoId === PROMO_SOURCE;

  return (
    <section className="home-hero" data-home-hero aria-labelledby="hero-title">
      <div className="home-hero-panel">
        <div className="home-hero-copy">
          <p className="home-hero-eyebrow"><span aria-hidden="true" />{ru ? 'Проверено лично' : 'Personally tested'}</p>
          <h1 id="hero-title" className="home-hero-title">
            <span className="home-hero-wordmark">Hopscup’s<br />Tools Hub</span>
            <span className="home-hero-sub">{ru ? 'Прокси, антидетекты и сервисы для работы с аккаунтами' : 'Proxies, antidetect browsers and tools for account work'}</span>
          </h1>
          <p className="home-hero-lead">
            {ru
              ? 'Всё, чем пользуюсь сам: прокси, антидетекты, аккаунты, номера и зарубежные карты. В каждой карточке собрал всё, что нужно знать до покупки: цены, оплату, промокоды и все нюансы.'
              : 'Everything I use myself: proxies, antidetect browsers, accounts, numbers and foreign cards. Each card covers what you need to know before buying: prices, payment, promo codes and every caveat.'}
          </p>
          <div className="home-hero-ctas">
            <button type="button" className="home-hero-btn home-hero-btn--primary" onClick={onPickTask}>
              <Zap size={17} aria-hidden="true" />{ru ? 'Подобрать под задачу' : 'Find by task'}
            </button>
            <a className="home-hero-btn home-hero-btn--secondary" href={youtubeUrl} target="_blank" rel="noopener noreferrer">
              <Youtube size={17} aria-hidden="true" />{ru ? 'Смотреть на YouTube' : 'Watch on YouTube'}
            </a>
          </div>
        </div>

        <div className="home-hero-preview-wrap">
          <div ref={tiltRef} className="home-hero-preview" style={{ '--tilt-x': '4deg', '--tilt-y': '-9deg' } as CSSProperties}>
            <div className="home-hero-glare" aria-hidden="true" />
            <div className="home-hero-preview-head">
              <h2>{ru ? 'Что нужно сделать?' : 'What do you need?'}</h2>
              <span>{ru ? `${TASKS.length} задач` : `${TASKS.length} tasks`}</span>
            </div>
            <ul className="home-hero-tasks">
              {TASKS.map(({ offerId, icon: Icon, title }) => {
                const offer = offers.find(o => o.id === offerId);
                if (!offer) return null;
                const discount = offer.promoDiscount?.[lang] || offer.promoDiscount?.ru;
                return (
                  <li key={offerId}>
                    <button type="button" className="home-hero-task" onClick={() => onOpenOffer(offer)}>
                      <span className="home-hero-task-icon"><Icon size={17} aria-hidden="true" /></span>
                      <span className="home-hero-task-title">{t(lang, title)}</span>
                      <span className="home-hero-task-service">
                        {offer.logoUrl && <img src={offer.logoUrl} alt="" width={22} height={22} loading="lazy" />}
                        <span className="home-hero-task-name">{offer.name}</span>
                        {discount && <em>{discount}</em>}
                      </span>
                      <ChevronRight size={15} className="home-hero-task-arrow" aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
            <button type="button" className="home-hero-promo" data-promo-source={PROMO_SOURCE} onClick={() => onCopyPromo('hopscup', PROMO_SOURCE)}>
              <span>{ru ? (copied ? 'Скопировано' : 'Промокод') : (copied ? 'Copied' : 'Promo code')} <code>hopscup</code></span>
              <span className="home-hero-promo-end">{ru ? 'до −20%' : 'up to −20%'}{copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}</span>
            </button>
          </div>
        </div>
      </div>

      <dl className="home-hero-stats">
        <div><dt>{ru ? 'сервисов на сайте' : 'services listed'}</dt><dd>{stats.services}</dd></div>
        <div><dt>{ru ? 'принимают рубли или СБП' : 'accept rubles or SBP'}</dt><dd>{stats.rub}</dd></div>
        <div><dt>{ru ? 'пошаговых гайдов' : 'step-by-step guides'}</dt><dd>{stats.guides}</dd></div>
        <div><dt>{ru ? 'проверено лично мной' : 'personally tested'}</dt><dd>100%</dd></div>
      </dl>
    </section>
  );
}
