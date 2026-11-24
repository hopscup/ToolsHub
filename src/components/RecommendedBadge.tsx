import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from './CssTransitions';
import { Star } from 'lucide-react';

export const RecommendedBadge = ({ language, label: customLabel }: { language: 'ru' | 'en'; label?: string }) => {
  const [mode, setMode] = useState<'hover' | 'click' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();
  const label = customLabel || (language === 'ru' ? 'Выбираю чаще всего' : 'My go-to');

  useEffect(() => {
    if (!mode) return;
    const timer = window.setTimeout(() => setMode(null), 2500);
    const closeOutside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setMode(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMode(null);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [mode]);

  return (
    <div
      ref={containerRef}
      className="absolute right-4 top-4 z-20"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setMode((current) => current === 'click' ? current : 'hover');
      }}
      onPointerLeave={() => setMode((current) => current === 'hover' ? null : current)}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={Boolean(mode)}
        aria-describedby={mode ? popoverId : undefined}
        onFocus={() => setMode((current) => current || 'hover')}
        onBlur={() => setMode((current) => current === 'hover' ? null : current)}
        onClick={(event) => {
          event.stopPropagation();
          setMode((current) => current === 'click' ? null : 'click');
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
        }}
        className="site-recommend-button flex h-[26px] w-[26px] items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 overflow-visible" aria-hidden="true">
          <defs><linearGradient id={`${popoverId}-glass`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#F5A94A"/><stop offset=".5" stopColor="#DCA2D1"/><stop offset="1" stopColor="#7E1BFF"/></linearGradient></defs>
          <Star fill={`url(#${popoverId}-glass)`} stroke="white" strokeOpacity=".7" strokeWidth={1}/>
          <path d="M9 8.5 12 3l2.2 4.6" fill="none" stroke="white" strokeOpacity=".7" strokeWidth="1" strokeLinecap="round"/>
        </svg>
        <span className="site-recommend-glint" aria-hidden="true"><i/></span>
      </button>
      <AnimatePresence>
        {mode && (
          <span className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2">
            <motion.span
              id={popoverId}
              role="tooltip"
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="site-recommend-tooltip relative block whitespace-nowrap rounded-md border px-2 py-0.5 text-[11px] font-semibold leading-[14px] shadow-lg"
            >
              {label}
              <span aria-hidden="true" className="site-recommend-tooltip pointer-events-none absolute -right-[3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 border-r border-t" />
            </motion.span>
          </span>
        )}
      </AnimatePresence>
    </div>
  );
};
