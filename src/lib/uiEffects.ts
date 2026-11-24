import { useLayoutEffect, useRef } from 'react';

export function useCatalogReveal(resetKey: string) {
  const seen = useRef(new Set<string>());
  const firstPaint = useRef(true);
  useLayoutEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-catalog-card]'));
    const show = (card: HTMLElement) => {
      seen.current.add(card.dataset.catalogCard || '');
      card.dataset.revealState = 'shown';
      card.addEventListener('animationend', () => { card.dataset.revealState = 'done'; }, { once: true });
    };
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        show(entry.target as HTMLElement);
        observer?.unobserve(entry.target);
      });
    }, { threshold: 0.06 }) : null;
    cards.forEach((card, index) => {
      const rect=card.getBoundingClientRect();
      if ((firstPaint.current && rect.top < window.innerHeight && rect.bottom > 0) || seen.current.has(card.dataset.catalogCard || '') || !observer) {
        seen.current.add(card.dataset.catalogCard || '');
        card.dataset.revealState = 'done';
        return;
      }
      card.style.setProperty('--reveal-delay', `${(index % 3) * 55}ms`);
      card.dataset.revealState = 'pending';
      observer.observe(card);
    });
    firstPaint.current=false;
    return () => observer?.disconnect();
  }, [resetKey]);
}

export function burstPromoStars(sourceId: string) {
  if (document.hidden) return;
  const button = Array.from(document.querySelectorAll<HTMLElement>('[data-promo-source]'))
    .find(element => element.dataset.promoSource === sourceId);
  if (!button) return;
  const rect = button.getBoundingClientRect();
  const burst = document.createElement('span');
  burst.className = 'site-copy-burst';
  burst.setAttribute('aria-hidden', 'true');
  burst.style.left = `${rect.x + rect.width / 2}px`;
  burst.style.top = `${rect.y + rect.height / 2}px`;
  for (let index = 0; index < 6; index++) {
    const star = document.createElement('i');
    const angle = -Math.PI + index * Math.PI / 3;
    const radius = 28 + index % 3 * 5;
    const size = 8 + index % 3;
    star.style.setProperty('--burst-x', `${Math.cos(angle) * radius}px`);
    star.style.setProperty('--burst-y', `${Math.sin(angle) * radius}px`);
    star.style.setProperty('--burst-delay', `${index * 8}ms`);
    star.style.width = star.style.height = `${size}px`;
    star.style.marginLeft = star.style.marginTop = `${-size / 2}px`;
    star.addEventListener('animationend', () => {
      star.remove();
      if (!burst.childElementCount) burst.remove();
    }, { once: true });
    burst.appendChild(star);
  }
  document.body.appendChild(burst);
  window.setTimeout(() => burst.remove(), 1500);
}
