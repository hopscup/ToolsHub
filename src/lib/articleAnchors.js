export const ARTICLE_SCROLL_DURATION = 500;
export const ARTICLE_HEADER_GAP = 20;

export const samePageHash = (href, currentHref) => {
  try {
    const target = new URL(href, currentHref);
    const current = new URL(currentHref);
    return target.origin === current.origin && target.pathname === current.pathname
      && target.search === current.search && target.hash ? target.hash : null;
  } catch {
    return null;
  }
};

export const decodeAnchorId = hash => {
  try { return decodeURIComponent(hash.slice(1)); } catch { return hash.slice(1); }
};

export const anchorScrollTop = (headingTop, scrollY, offset, maxScroll) =>
  Math.max(0, Math.min(maxScroll, headingTop + scrollY - offset));

export const scrollProgress = progress => 1 - Math.pow(1 - progress, 3);

export const mountArticleAnchors = root => {
  const header = root.querySelector('.article-header');
  const links = [...root.querySelectorAll('.article-toc a[href]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const resolve = hash => {
    const target = document.getElementById(decodeAnchorId(hash));
    if (!target || !root.contains(target)) return null;
    const heading = target.matches('h2, h3') ? target : target.querySelector('h2, h3');
    return heading ? { target, heading } : null;
  };
  const entries = links.map(link => ({ link, ...resolve(samePageHash(link.href, location.href) || '') }))
    .filter(entry => entry.heading);
  let offset = 84;
  let animation = 0;
  let scrollFrame = 0;
  let highlightTimer = 0;
  let highlighted = null;
  let navigating = false;
  let disposed = false;
  let interacted = false;
  let observer;
  const focusAttributes = new Map();
  const headingTop = heading => heading.getBoundingClientRect().top + (parseFloat(getComputedStyle(heading).paddingTop) || 0);

  const select = heading => {
    let selected = entries[0]?.heading;
    for (const entry of entries) {
      if (entry.heading === heading || entry.heading.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING) selected = entry.heading;
    }
    for (const entry of entries) {
      if (entry.heading === selected) entry.link.setAttribute('aria-current', 'location');
      else entry.link.removeAttribute('aria-current');
    }
  };
  const updateActive = () => {
    if (navigating || !entries.length) return;
    let current = entries[0].heading;
    for (const entry of entries) {
      if (headingTop(entry.heading) <= offset + 4) current = entry.heading;
    }
    select(current);
  };
  const scheduleActive = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; updateActive(); });
  };
  const measureHeader = () => {
    offset = Math.ceil(header?.getBoundingClientRect().height || 0) + ARTICLE_HEADER_GAP;
    root.style.setProperty('--article-anchor-offset', `${offset}px`);
    observer?.disconnect();
    observer = new IntersectionObserver(scheduleActive, { rootMargin: `-${offset}px 0px -50% 0px`, threshold: [0, 1] });
    for (const { heading } of entries) observer.observe(heading);
    scheduleActive();
  };
  const clearHighlight = () => {
    clearTimeout(highlightTimer);
    highlighted?.removeAttribute('data-anchor-highlight');
    highlighted = null;
  };
  const cancel = () => {
    interacted = true;
    cancelAnimationFrame(animation);
    navigating = false;
    scheduleActive();
  };
  const navigate = (hash, replace = true) => {
    const match = resolve(hash);
    if (!match) return false;
    cancelAnimationFrame(animation);
    clearHighlight();
    root.querySelectorAll('details[data-article-toc][open]').forEach(details => { details.open = false; });
    measureHeader();
    const { heading } = match;
    navigating = true;
    select(heading);
    if (replace) history.replaceState(history.state, '', hash);
    const destination = () => anchorScrollTop(headingTop(heading), window.scrollY, offset,
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight));
    const finish = () => {
      navigating = false;
      if (!focusAttributes.has(heading)) focusAttributes.set(heading, heading.getAttribute('tabindex'));
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
      if (!reducedMotion.matches) {
        highlighted = heading;
        heading.setAttribute('data-anchor-highlight', '');
        highlightTimer = window.setTimeout(clearHighlight, 1400);
      }
    };
    if (reducedMotion.matches) {
      window.scrollTo({ top: destination(), behavior: 'instant' });
      finish();
    } else {
      const startY = window.scrollY;
      const startTime = performance.now();
      const frame = now => {
        const progress = Math.min(1, (now - startTime) / ARTICLE_SCROLL_DURATION);
        window.scrollTo({ top: startY + (destination() - startY) * scrollProgress(progress), behavior: 'instant' });
        if (progress < 1) animation = requestAnimationFrame(frame);
        else finish();
      };
      animation = requestAnimationFrame(frame);
    }
    return true;
  };
  const click = event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || link.hasAttribute('download') || link.target && link.target !== '_self') return;
    const hash = samePageHash(link.href, location.href);
    if (!hash || !resolve(hash)) return;
    interacted = true;
    event.preventDefault();
    navigate(hash);
  };
  const hashChange = () => { interacted = true; navigate(location.hash, false); };
  const keydown = event => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Escape'].includes(event.key)) cancel();
  };
  const motionChange = () => {
    clearHighlight();
    if (navigating && reducedMotion.matches) navigate(location.hash, false);
  };
  measureHeader();
  const headerObserver = new ResizeObserver(measureHeader);
  if (header) headerObserver.observe(header);
  root.addEventListener('click', click);
  window.addEventListener('hashchange', hashChange);
  window.addEventListener('scroll', scheduleActive, { passive: true });
  window.addEventListener('resize', measureHeader);
  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });
  window.addEventListener('keydown', keydown);
  reducedMotion.addEventListener('change', motionChange);

  // Wait for fonts and images above a deep link before measuring its final position.
  const initial = resolve(location.hash);
  if (initial) {
    const images = [...root.querySelectorAll('img')].filter(img => !img.complete
      && img.compareDocumentPosition(initial.heading) & Node.DOCUMENT_POSITION_FOLLOWING);
    const assets = images.map(img => { img.loading = 'eager'; return img.decode().catch(() => {}); });
    let assetTimer;
    Promise.race([
      Promise.all([document.fonts.ready, ...assets]),
      new Promise(resolve => { assetTimer = window.setTimeout(resolve, 3000); }),
    ]).then(() => {
      clearTimeout(assetTimer);
      if (!disposed && !interacted) navigate(location.hash, false);
    });
  }
  return () => {
    disposed = true;
    cancelAnimationFrame(animation);
    cancelAnimationFrame(scrollFrame);
    clearHighlight();
    observer.disconnect();
    headerObserver.disconnect();
    root.removeEventListener('click', click);
    window.removeEventListener('hashchange', hashChange);
    window.removeEventListener('scroll', scheduleActive);
    window.removeEventListener('resize', measureHeader);
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
    window.removeEventListener('keydown', keydown);
    reducedMotion.removeEventListener('change', motionChange);
    root.style.removeProperty('--article-anchor-offset');
    links.forEach(link => link.removeAttribute('aria-current'));
    for (const [heading, previous] of focusAttributes) {
      if (previous === null) heading.removeAttribute('tabindex');
      else heading.setAttribute('tabindex', previous);
    }
  };
};
