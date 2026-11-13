import { getServiceEditorialSections, splitServiceText } from '../data/servicePresentation.js';
import { getExternalLinkRel } from '../lib/externalLinks.js';

type EditorialOffer = { editorial?: { inlineLinks?: object; capabilities?: object; pricing?: object; payment?: object; gettingStarted?: object } };

export const ServiceRichText = ({ text, offer, language }: { text: string; offer: EditorialOffer; language: string }) => <span>{splitServiceText(text, offer, language).map((part, index) => part.href
  ? <a key={index} href={`${part.href.startsWith('/') && language !== 'ru' ? '/' + language : ''}${part.href}`} {...(part.href.startsWith('http') ? { target: '_blank', rel: getExternalLinkRel(part.href) } : {})} className="font-bold text-brand-purple underline underline-offset-4 hover:text-white">{part.text}</a>
  : <span key={index}>{part.text}</span>)}</span>;

export const ServiceEditorialSections = ({ offer, language }: { offer: EditorialOffer; language: string }) => <>
  {getServiceEditorialSections(offer, language).map(section => {
    const List = section.ordered ? 'ol' : 'ul';
    return <section key={section.key} data-editorial-section={section.key} className="space-y-3">
      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-purple">{section.heading}</h3>
      <List className={`space-y-3 pl-5 text-sm leading-7 text-white/70 marker:text-brand-purple ${section.ordered ? 'list-decimal' : 'list-disc'}`}>
        {section.items.map((text, i) => <li key={i}><ServiceRichText text={text} offer={offer} language={language} /></li>)}
      </List>
    </section>;
  })}
</>;
