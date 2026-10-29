import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, m as motion } from 'motion/react';
import { Star } from 'lucide-react';

export const RecommendedBadge = ({ language }: { language: 'ru' | 'en' }) => {
  const [mode, setMode] = useState<'hover' | 'click' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();
  const label = language === 'ru' ? 'Выбираю чаще всего' : 'My go-to';

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
        className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#FACC15]/25 bg-[#FACC15]/[0.045] text-[#FACC15]/90 shadow-[0_0_12px_rgba(250,204,21,0.10)] hover:border-[#FACC15]/45 hover:bg-[#FACC15]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
      >
        <Star className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
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
              className="relative block whitespace-nowrap rounded-md border border-[#FACC15]/20 bg-[#111014] px-2 py-0.5 text-[11px] font-semibold leading-[14px] text-[#FACC15]/90 shadow-lg"
            >
              {label}
              <span aria-hidden="true" className="pointer-events-none absolute -right-[3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 border-r border-t border-[#FACC15]/20 bg-[#111014]" />
            </motion.span>
          </span>
        )}
      </AnimatePresence>
    </div>
  );
};
