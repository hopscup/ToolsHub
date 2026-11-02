import { Globe, Send, Youtube } from 'lucide-react';
import { articleSocialLinks, articleSocialBanner as banner, articleSocialCompact as compact } from '../data/articleSocialFooter.js';
import { getExternalLinkRel } from '../lib/externalLinks.js';
import { trackAnalyticsEvent } from '../analytics';

const icons = { telegram: Send, youtube: Youtube, website: Globe };

export const ArticleSocialFooter = ({ variant = 'default' }: { variant?: 'default' | 'compact' }) => variant === 'compact' ? (
  <footer data-article-social-footer data-article-footer-variant="compact" className="mt-8 grid gap-4 rounded-lg border border-white/[0.09] bg-white/[0.025] p-4 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-center">
    <a data-article-footer-banner href={banner.href} target="_blank" rel={getExternalLinkRel(banner.href)}
      onClick={() => trackAnalyticsEvent('social_click', { platform: 'youtube', placement: 'article_footer_banner' })}
      className="block overflow-hidden rounded-lg">
      <img src={banner.src} alt={banner.alt} width={banner.width} height={banner.height} loading="lazy" decoding="async" className="block aspect-video max-h-[170px] w-full object-cover" />
    </a>
    <div className="min-w-0">
      <p className="text-[10px] font-bold leading-4 text-brand-purple">{compact.eyebrow}</p>
      <h2 className="mt-1 font-display text-xl font-bold leading-6 text-white">{compact.title}</h2>
      <p className="mt-1.5 text-xs font-medium leading-5 text-white/55">{compact.description}</p>
      <nav aria-label="Ссылки Hopscup" className="mt-3 grid gap-2 lg:grid-cols-3">
        {compact.links.map(link => {
          const Icon = icons[link.icon];
          return <a key={link.href} href={link.href} title={link.platform === 'site' ? 'hopscup.tools' : undefined}
            onClick={() => trackAnalyticsEvent('social_click', { platform: link.platform, placement: 'article_footer' })}
            {...(link.href.startsWith('https://') ? { target: '_blank', rel: getExternalLinkRel(link.href) } : {})}
            className="flex min-h-11 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-white/10 bg-white/[0.035] px-2 py-2 text-center text-xs font-bold leading-5 text-brand-purple transition-colors hover:border-brand-purple/40 hover:text-white">
            <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /><span>{link.label}</span>
          </a>;
        })}
      </nav>
    </div>
  </footer>
) : (
  <footer data-article-social-footer className="mt-10 border-t border-white/[0.08] pt-7">
    <a data-article-footer-banner href={banner.href} target="_blank" rel={getExternalLinkRel(banner.href)}
      onClick={() => trackAnalyticsEvent('social_click', { platform: 'youtube', placement: 'article_footer_banner' })}
      className="block overflow-hidden rounded-2xl border border-white/[0.09] transition-colors hover:border-brand-purple/40">
      <img src={banner.src} alt={banner.alt} width={banner.width} height={banner.height} loading="lazy" decoding="async" className="block h-auto w-full" />
    </a>
    <p className="mt-6 text-sm font-bold text-white/75">Больше полезного тут:</p>
    <nav aria-label="Ссылки Hopscup" className="mt-4 grid gap-3 md:grid-cols-[auto_auto_minmax(0,1fr)]">
      {articleSocialLinks.map(link => {
        const Icon = icons[link.icon];
        return (
          <a key={link.href} href={link.href}
            onClick={() => trackAnalyticsEvent('social_click', { platform: link.platform, placement: 'article_footer' })}
            {...(link.href.startsWith('https://') ? { target: '_blank', rel: getExternalLinkRel(link.href) } : {})}
            className="flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-center text-sm font-bold leading-6 text-brand-purple transition-colors hover:border-brand-purple/40 hover:text-white">
            <Icon aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" />
            <span>{link.label}</span>
          </a>
        );
      })}
    </nav>
  </footer>
);
