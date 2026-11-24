import {useEffect, useRef} from 'react';
import { getCryptoSubtitle } from '../data/cryptoSubtitles.js';

export function CryptoSubtitle({ filter, language }: { filter: string; language: string }) {
  const text = getCryptoSubtitle(filter, language);
  const element = useRef<HTMLParagraphElement>(null);
  const previous = useRef(text);
  useEffect(() => {
    if (previous.current !== text && !matchMedia('(prefers-reduced-motion: reduce)').matches) element.current?.animate([{opacity:0},{opacity:1}], {duration:200});
    previous.current = text;
  }, [text]);
  return <p ref={element} data-crypto-subtitle
      className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-light">
      {text}
    </p>;
}
