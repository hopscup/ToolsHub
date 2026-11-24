import {ExternalLink,Info,Star,Zap} from 'lucide-react';
import type {ServiceModalProps} from './ServiceModalFrame';

export function ServiceModal({PROXY_ANTIDETECT_VIDEO_URL,LANGUAGE_PREFIXES,getLocalizedOfferRoute,ServiceEditorialSections,ServiceRichText,ServiceParagraphs,getServiceContextualGuideLinks,getPartnerIntroduction,getServiceGuide,lang,selectedOffer,l,lList,offerTitle,offerDescription,t,handleOfferOpen,selectedEditorialNotes,selectedAlternatives,part}:ServiceModalProps & {part:'description'|'editorial'}) {
  if (!selectedOffer) return null;
  if (part === 'description') return <div className="service-editorial-reveal"><ServiceParagraphs text={getPartnerIntroduction(selectedOffer, lang) || offerDescription(selectedOffer)} offer={selectedOffer} language={lang} className="text-white/80 leading-relaxed text-base font-medium" /></div>;
  return <div className="service-editorial-reveal space-y-6">{selectedOffer.editorial && (
                    <div className="space-y-6">
                      <ServiceEditorialSections offer={selectedOffer} language={lang} />
                      <section className="space-y-4">
                        <h3 className="flex items-center gap-2 text-[11px] uppercase font-black text-brand-purple tracking-[0.2em]">
                          <Zap className="w-4 h-4" />
                          {t.bestFor}
                        </h3>
                        <ul className="space-y-3">
                          {lList<string>(selectedOffer.editorial.bestFor).map((item, index) => (
                            <li
                              key={index}
                              className="flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm font-medium leading-relaxed text-white/70"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-purple shadow-[0_0_9px_rgba(189,123,255,0.8)]" />
                              <ServiceRichText text={item} offer={selectedOffer} language={lang} />
                            </li>
                          ))}
                        </ul>
                      </section>

                      {selectedOffer.id !== 'pgon-exchange' && selectedEditorialNotes.length > 0 && <section className="space-y-4">
                        <h3 className="flex items-center gap-2 text-[11px] uppercase font-black text-brand-orange tracking-[0.2em]">
                          <Info className="w-4 h-4" />
                          {t.nuances}
                        </h3>
                        <ul className="space-y-3">
                          {selectedEditorialNotes.map((item, index) => (
                            <li key={index} className="flex gap-3 text-sm leading-relaxed text-white/55">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                              <ServiceRichText text={item} offer={selectedOffer} language={lang} />
                            </li>
                          ))}
                        </ul>
                      </section>}

                      {selectedOffer.editorial.setupGuide && <p className="text-sm leading-relaxed text-white/70">
                        <a href={`${LANGUAGE_PREFIXES[lang]}${selectedOffer.editorial.setupGuide.href}`} className="text-brand-purple hover:underline">{l(selectedOffer.editorial.setupGuide.label)}</a>
                      </p>}

                      {selectedOffer.id === 'ant-shardx' && (
                        <a
                          href={PROXY_ANTIDETECT_VIDEO_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-purple/35 bg-brand-purple/10 px-4 py-2 text-xs font-black text-brand-purple transition-colors hover:bg-brand-purple hover:text-white"
                        >
                          Смотреть видеогайд по настройке
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}

                      {l(selectedOffer.editorial.verdict) && <section className="rounded-2xl border border-brand-purple/20 bg-brand-purple/[0.07] p-5">
                        <h3 className="mb-3 flex items-center gap-2 text-[11px] uppercase font-black text-brand-purple tracking-[0.2em]">
                          <Star className="w-4 h-4" />
                          {t.editorialVerdict}
                        </h3>
                        <ServiceParagraphs text={l(selectedOffer.editorial.verdict)} offer={selectedOffer} language={lang} className="text-sm font-medium leading-relaxed text-white/75" />
                      </section>}
                      {selectedOffer.editorial.links?.map(item => <p key={item.href} className="text-sm leading-7">
                        <a href={`${LANGUAGE_PREFIXES[lang]}${item.href}`} className="font-bold text-brand-purple underline underline-offset-4 hover:text-white">{l(item.label)}</a>
                      </p>)}
                    </div>
                  )}
                  {getServiceContextualGuideLinks(selectedOffer).map(item => <p key={item.href} className="text-sm leading-relaxed text-white/70">
                    <a href={`${LANGUAGE_PREFIXES[lang]}${item.href}`} className="text-brand-purple hover:underline">{l(item.label)}</a>
                  </p>)}
                  {selectedAlternatives.length > 0 && <section data-service-alternatives className="min-w-0 space-y-4">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-purple">{lang === 'ru' ? 'Альтернативы' : 'Alternatives'}</h3>
                    <div className="grid min-w-0 grid-cols-1 gap-3">
                      {selectedAlternatives.map(offer => <a key={offer.id} href={getLocalizedOfferRoute(offer, lang)} onClick={event => {
                        if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                          event.preventDefault();
                          handleOfferOpen(offer);
                          event.currentTarget.closest('.overflow-y-auto')?.scrollTo({ top: 0 });
                        }
                      }} className="min-w-0 rounded-lg border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                        <span className="block text-sm font-bold text-white">{offerTitle(offer)}</span>
                        <span className="mt-1 block truncate text-xs text-white/55">{offerDescription(offer)}</span>
                      </a>)}
                    </div>
                    <a className="inline-block text-sm font-bold text-brand-purple hover:underline" href={`${LANGUAGE_PREFIXES[lang]}${getServiceGuide(selectedOffer).href}`}>
                      {l(getServiceGuide(selectedOffer).label)}
                    </a>
                  </section>}</div>;
}
