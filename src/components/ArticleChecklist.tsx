import { Search } from 'lucide-react';
import { getExternalLinkRel } from '../lib/externalLinks.js';

type Segment = { text: string; href?: string; strong?: boolean };

export const ArticleChecklist = ({ items, sources, heading = 'Коротко: что делать', sourcesHeading = 'Где брать:', action, note, onExternalClick }: {
  key?: number;
  items: Segment[][];
  sources: { label: string; links: { text: string; href: string }[] }[];
  sourcesHeading?: string;
  heading?: string;
  action: { href: string; label: string };
  note: Segment[];
  onExternalClick?: (href: string) => void;
}) => (
  <section id="start" data-article-checklist className="mt-10 scroll-mt-28 rounded-lg border border-white/[0.09] bg-white/[0.025] p-5 md:p-6">
    <h2 className="font-display text-2xl font-black text-white">{heading}</h2>
    <ol className="mt-5 list-decimal space-y-4 pl-5 marker:font-bold marker:text-white/80">
      {items.map((item, index) => (
        <li key={index} className="pl-1 text-sm font-medium leading-6 text-white/65">
          <p>
            {item.map((part, partIndex) => part.href ? (
              <a key={partIndex} href={part.href}
                {...(part.href.startsWith('https://') ? { target: '_blank', rel: getExternalLinkRel(part.href), onClick: () => onExternalClick?.(part.href) } : {})}
                className="font-bold text-brand-purple underline underline-offset-4">{part.text}</a>
            ) : part.strong ? <strong key={partIndex} className="font-bold text-white">{part.text}</strong> : <span key={partIndex}>{part.text}</span>)}
          </p>
        </li>
      ))}
    </ol>
    <div data-checklist-sources className="mt-6 border-t border-white/[0.07] pt-5">
      {sources.length > 0 && <><h3 className="text-sm font-bold text-white/80">{sourcesHeading}</h3>
      <div className="mt-3 space-y-2 text-sm font-medium leading-6 text-white/65">
        {sources.map(source => (
          <p key={source.label}>
            {source.label && <span>{source.label}: </span>}
            {source.links.map((link, index) => (
              <span key={link.href}>
                {index > 0 && ' · '}
                <a href={link.href} target="_blank" rel={getExternalLinkRel(link.href)} onClick={() => onExternalClick?.(link.href)}
                  className="font-bold text-brand-purple underline underline-offset-4">{link.text}</a>
              </span>
            ))}
          </p>
        ))}
      </div></>}
      <p className="mt-3 text-xs font-medium leading-5 text-white/40">{note.map((part, index) => part.strong
        ? <strong key={index} className="font-bold text-brand-purple">{part.text}</strong>
        : <span key={index}>{part.text}</span>)}</p>
      <a href={action.href} className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-xs font-black uppercase text-white transition-colors hover:bg-white hover:text-brand-purple">
        {action.label}<Search aria-hidden="true" className="h-4 w-4" />
      </a>
    </div>
  </section>
);
