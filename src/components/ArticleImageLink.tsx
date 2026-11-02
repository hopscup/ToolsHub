import { X } from 'lucide-react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ImageViewerProps = {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
  trigger: HTMLAnchorElement | null;
};

const ImageViewer = ({ src, alt, caption, onClose, trigger }: ImageViewerProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const body = document.body;
    const scrollStyles = [body, document.documentElement].map(element => ({
      element, overflowX: element.style.overflowX, overflowY: element.style.overflowY,
    }));
    const previousPadding = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbarWidth}px`;
    }
    scrollStyles.forEach(({ element }) => { element.style.overflow = 'hidden'; });
    dialog.showModal();

    return () => {
      dialog.close();
      scrollStyles.forEach(({ element, overflowX, overflowY }) => {
        element.style.overflowX = overflowX;
        element.style.overflowY = overflowY;
      });
      body.style.paddingRight = previousPadding;
      trigger?.focus({ preventScroll: true });
    };
  }, [trigger]);

  return createPortal(
    <dialog ref={dialogRef} aria-label={alt || 'Просмотр изображения'} data-article-image-viewer
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClose={event => { if (!event.currentTarget.open) onClose(); }}
      onKeyDown={event => { if (event.key === 'Escape') event.stopPropagation(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none flex-col items-center justify-center gap-3 border-0 bg-black/90 px-4 pb-5 pt-20 text-white backdrop:bg-transparent open:flex md:px-12 md:pb-8">
      <button type="button" onClick={onClose} aria-label="Закрыть изображение" autoFocus
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#17131e] text-white shadow-lg transition-colors hover:border-brand-purple hover:text-brand-purple focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-purple md:right-6 md:top-5">
        <X aria-hidden="true" className="h-5 w-5" />
      </button>
      <img src={src} alt={alt} decoding="async" className="block min-h-0 max-h-full max-w-full shrink object-contain" />
      {caption && <p className="m-0 max-w-3xl shrink-0 text-center text-xs leading-5 text-white/70">{caption}</p>}
    </dialog>,
    document.body,
  );
};

export const ArticleImageLink = ({ src, alt, caption, className, children }: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <a ref={triggerRef} href={src} target="_blank" rel="noopener noreferrer" data-article-image-link
        aria-label={`Открыть изображение: ${alt}`} aria-haspopup="dialog"
        className={`${className || ''} cursor-zoom-in`}
        onClick={event => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          setOpen(true);
        }}>
        {children}
      </a>
      {open && <ImageViewer src={src} alt={alt} caption={caption} onClose={close} trigger={triggerRef.current} />}
    </>
  );
};
