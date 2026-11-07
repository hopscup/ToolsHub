import { Globe, Send, Youtube } from 'lucide-react';
import { articleSocialLinks, articleSocialBanner as banner } from '../data/articleSocialFooter.js';
import { getExternalLinkRel } from '../lib/externalLinks.js';
import { trackAnalyticsEvent } from '../analytics';

const icons = { telegram: Send, youtube: Youtube, website: Globe };

export const ArticleSocialFooter = ({ variant = 'default' }: { variant?: 'default' | 'compact' }) => (
  <footer data-article-social-footer data-article-footer-variant={variant} className="mt-10 border-t border-white/[0.08] pt-7">
    <p className="text-sm font-bold text-white/75">Больше полезного тут:</p>
    <nav aria-label="Ссылки Hopscup" className="mt-4 grid auto-rows-fr grid-cols-1 items-stretch gap-3 md:grid-cols-3">
      {articleSocialLinks.map(link => {
        const Icon = icons[link.icon];
        return (
          <a key={link.href} href={link.href}
            onClick={() => trackAnalyticsEvent('social_click', { platform: link.platform, placement: 'article_footer' })}
            {...(link.href.startsWith('https://') ? { target: '_blank', rel: getExternalLinkRel(link.href) } : {})}
            className="flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3 text-center text-sm font-bold leading-6 text-brand-purple transition-colors hover:border-brand-purple/40 hover:text-white">
            <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className={link.platform === 'site' ? 'min-w-0' : 'whitespace-nowrap'}>{link.label}</span>
          </a>
        );
      })}
    </nav>
    <a data-article-footer-banner href={banner.href} target="_blank" rel={getExternalLinkRel(banner.href)}
      onClick={() => trackAnalyticsEvent('social_click', { platform: 'youtube', placement: 'article_footer_banner' })}
      className="mt-6 block overflow-hidden rounded-2xl border border-white/[0.09] transition-colors hover:border-brand-purple/40">
      <img src={banner.src} alt={banner.alt} width={banner.width} height={banner.height} loading="lazy" decoding="async" className="block h-auto w-full" />
    </a>
  </footer>
);
