import { getLanguageSwitchPath } from '../data/indexPolicy.js';

export const ArticleLanguageLink = () => {
  const language = /^\/(en|es|zh|ko)(?:\/|$)/.test(window.location.pathname) ? 'ru' : 'en';
  return <a data-language-link href={getLanguageSwitchPath(window.location.pathname, language)} lang={language}
    aria-label={language === 'en' ? 'Switch to English' : 'Перейти на русскую версию'}
    className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-2 text-xs font-bold text-white/60 transition-colors hover:border-brand-purple/40 hover:text-white">
    {language.toUpperCase()}
  </a>;
};
