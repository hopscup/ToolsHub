import type {ReactNode} from 'react';
import './service-modal.css';
import {EditorialSkeleton} from './EditorialSkeleton';
import {motion,AnimatePresence} from './CssTransitions';
import type {Offer} from '../App';
import {Globe,CreditCard,Coins,ExternalLink,Users,FileText,Star,Info,Copy,Check,Zap,X,Monitor,Smartphone,Layers,ShieldCheck,ArrowLeftRight,Percent,Clock} from 'lucide-react';
export type ServiceModalProps = {
  PROXY_ANTIDETECT_VIDEO_URL:string; LANGUAGE_PREFIXES:Record<string,string>;
  getLocalizedOfferRoute:(offer:Offer,language:any)=>string;
  OfferModalHeading:any; ServiceEditorialSections:any; ServiceRichText:any; ServiceParagraphs:any; ArticleVideo:any;
  getServiceContextualGuideLinks:any; getPartnerIntroduction:any; getExternalLinkRel:any; isTelegramUrl:any; getServiceGuide:any; trackAnalyticsEvent:any;
  lang:any; selectedOffer:Offer|null; copiedPromoId:string|null;
  l:(value?:any)=>any; lList:<T=string>(value?:any)=>T[]; tx:<T>(value:any)=>T;
  offerTitle:(offer:Offer)=>string; offerDescription:(offer:Offer)=>string; t:Record<string,any>;
  copyToClipboard:(text:string,source:string)=>void; handleOfferOpen:(offer:Offer)=>void; handleOfferClose:()=>void;
  selectedOfferHeading:any; isSelectedOfferMobileAntidetect:boolean; selectedVpnTerms:any; selectedEditorialNotes:string[]; selectedAlternatives:Offer[]; InfoRow:any;
};
export function ServiceModalFrame({PROXY_ANTIDETECT_VIDEO_URL,LANGUAGE_PREFIXES,getLocalizedOfferRoute,OfferModalHeading,ServiceEditorialSections,ServiceRichText,ServiceParagraphs,ArticleVideo,getServiceContextualGuideLinks,getPartnerIntroduction,getExternalLinkRel,isTelegramUrl,getServiceGuide,trackAnalyticsEvent,lang,selectedOffer,copiedPromoId,l,lList,tx,offerTitle,offerDescription,t,copyToClipboard,handleOfferOpen,handleOfferClose,selectedOfferHeading,isSelectedOfferMobileAntidetect,selectedVpnTerms,selectedEditorialNotes,selectedAlternatives,InfoRow,description,editorialContent,isCatalogModal,offerLoadError,onRetry}:ServiceModalProps & {description:ReactNode;editorialContent:ReactNode;isCatalogModal:boolean;offerLoadError:boolean;onRetry:()=>void}){const loaded=Boolean((selectedOffer as Offer & {__editorialLoaded?: boolean})?.__editorialLoaded);return <>
      {/* Offer Detail Modal */}
      <AnimatePresence>
        {selectedOffer && (loaded || isCatalogModal) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleOfferClose}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              data-service-modal-frame
              data-catalog-modal={isCatalogModal || undefined}
              role="dialog"
              aria-modal="true"
              aria-labelledby="offer-modal-title"
              className={`service-modal-frame relative flex max-h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-bg-dark shadow-2xl ${
                selectedOffer.category === 'Proxy' ? 'max-w-2xl' : 'max-w-lg'
              }`}
            >
              <button 
                onClick={handleOfferClose}
                aria-label={tx({ ru: 'Закрыть', en: 'Close', es: 'Cerrar', zh: '关闭', ko: '닫기' })}
                className="absolute right-5 top-5 z-20 rounded-full p-2 transition-colors hover:bg-white/5"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="flex min-h-0 flex-1 flex-col">
                <div className="flex shrink-0 gap-5 border-b border-white/5 p-6 pr-16 md:p-8 md:pr-20">
                  {selectedOffer.category === 'Guides' ? (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-brand-purple/30 bg-brand-purple/10 shadow-[0_0_35px_rgba(129,28,254,0.14)] md:h-20 md:w-20 md:rounded-3xl">
                      <FileText className="h-8 w-8 text-brand-purple md:h-9 md:w-9" />
                    </div>
                  ) : (
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:h-20 md:w-20 md:rounded-3xl flex items-center justify-center">
                      <img
                        src={selectedOffer.logoUrl || '/logo.webp'}
                        alt={selectedOffer.name}
                        decoding="async"
                        onError={(event) => {
                          event.currentTarget.src = event.currentTarget.getAttribute('src') === selectedOffer.logoFallback ? '/logo.webp' : selectedOffer.logoFallback || '/logo.webp';
                        }}
                        className={selectedOffer.id === 'ant-donut' ? 'w-full h-full object-cover invert' : 'w-full h-full object-cover'}
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-3">
                      <OfferModalHeading className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                        {selectedOfferHeading ? l(selectedOfferHeading) : offerTitle(selectedOffer)}
                      </OfferModalHeading>
                    </div>
                  </div>
                </div>

                <div key={selectedOffer.id} data-offer-scroll className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5 custom-scrollbar md:px-8 md:py-6">
                  <div data-offer-description aria-busy={!loaded}>
                    <h4 className="text-[11px] uppercase font-black text-brand-purple tracking-[0.2em] mb-3">
                      {t.description}
                    </h4>
                    {loaded ? description : offerLoadError ? <div role="alert" className="text-sm text-white/70">
                      <p>{tx({ru:'Не удалось загрузить текст карточки.',en:'Unable to load the service text.'})}</p>
                      <button type="button" className="mt-3 underline text-brand-purple" onClick={onRetry}>{tx({ru:'Повторить',en:'Retry'})}</button>
                    </div> : <EditorialSkeleton />}
                  </div>

                  {selectedOffer.cardStats && (
                    <div data-offer-facts className="flex flex-col gap-4 py-6 border-y border-white/5">
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.issuance}
                          </h4>
                        </div>
                        <p className="text-brand-purple font-black text-lg">{l(selectedOffer.cardStats.issuance)}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.maintenance}
                          </h4>
                        </div>
                        <p className="text-brand-purple font-black text-lg">{l(selectedOffer.cardStats.maintenance)}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">Apple/Google Pay</h4>
                        </div>
                        <p className="text-white font-bold text-base">{l(selectedOffer.cardStats.paySystems)}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.verification}
                          </h4>
                        </div>
                        <p className="text-white font-bold text-base">{l(selectedOffer.cardStats.verification)}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.cashback}
                          </h4>
                        </div>
                        <p className="text-white font-bold text-base">{l(selectedOffer.cardStats.cashback)}</p>
                      </div>
                      {[
                        { key: 'commission', label: tx({ ru: 'Комиссия', en: 'Commission' }), value: l(selectedOffer.cardStats.commission) },
                        { key: 'qrPayments', label: tx({ ru: 'QR-оплата', en: 'QR payments' }), value: l(selectedOffer.cardStats.qrPayments) },
                      ].filter(row => row.value).map(({ key, label, value }) => (
                        <div key={key} data-card-stat={key} className="flex justify-between items-center gap-3 group/stat">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                            <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">{label}</h4>
                          </div>
                          <p className="min-w-0 text-right text-white font-bold text-base">{value}</p>
                        </div>
                      ))}
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.topup}
                          </h4>
                        </div>
                        <p className="text-white font-bold text-base">{l(selectedOffer.cardStats.topup)}</p>
                      </div>
                      <div className="flex justify-between items-center group/stat">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BD7BFF] shadow-[0_0_10px_#BD7BFF]" />
                          <h4 className="text-[11px] uppercase font-black text-white/30 tracking-[0.2em] group-hover/stat:text-white/60 transition-colors">
                            {t.type}
                          </h4>
                        </div>
                        <p className="text-white font-bold text-base">{l(selectedOffer.cardStats.type)}</p>
                      </div>
                    </div>
                  )}

                  {selectedOffer.editorial?.video && <ArticleVideo video={{ ...selectedOffer.editorial.video, caption: l(selectedOffer.editorial.video.caption) }} />}
                  {selectedOffer.details?.supports && (
                    <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/10">
                      <h4 className="text-[11px] uppercase font-black text-white/40 tracking-[0.2em] mb-4">
                        {selectedOffer.category === 'Guides'
                          ? t.guideTopics
                          : selectedOffer.category === 'Crypto'
                            ? t.supportedExchangeOptions
                            : t.whatToPay}
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {lList(selectedOffer.details.supports).map((item, i) => (
                          <span key={i} className="text-xs bg-brand-purple/10 px-4 py-2 rounded-xl text-brand-purple border border-brand-purple/20 font-bold">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedOffer.details?.nuances && (
                    <div className="space-y-4">
                      <h4 className="text-[11px] uppercase font-black text-brand-orange tracking-[0.2em]">
                        {t.nuances}
                      </h4>
                      <ul className="space-y-3">
                        {lList(selectedOffer.details.nuances).map((item, i) => (
                          <li key={i} className="text-sm text-white/50 flex gap-3 leading-relaxed">
                            <span className="text-brand-orange mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedOffer.details?.pros && (
                    <div className="space-y-4">
                      <h4 className="text-[11px] uppercase font-black text-green-400 tracking-[0.2em]">
                        {t.pros}
                      </h4>
                      <ul className="space-y-3">
                        {lList(selectedOffer.details.pros).map((item, i) => (
                          <li key={i} className="text-sm text-white/70 flex gap-3 leading-relaxed font-medium">
                            <span className="text-green-400 font-bold">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedOffer.details?.targetAudience && (
                    <div className="pt-4 border-t border-white/5 font-display italic text-white/30 text-xs text-center">
                      "{l(selectedOffer.details.targetAudience)}"
                    </div>
                  )}

                  {!selectedOffer.cardStats && selectedOffer.priceInfo && (
                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5">
                      {selectedOffer.priceInfo?.main && (
                        <div>
                          <h4 className="text-[9px] uppercase font-black text-white/30 tracking-widest mb-1">{t.proxyTypes.static}</h4>
                          <p className="text-brand-purple font-bold">{l(selectedOffer.priceInfo.main)}</p>
                        </div>
                      )}
                       {selectedOffer.priceInfo?.secondary && (
                        <div>
                          <h4 className="text-[9px] uppercase font-black text-white/30 tracking-widest mb-1">{t.proxyTypes.residential}</h4>
                          <p className="text-brand-purple font-bold">{l(selectedOffer.priceInfo.secondary)}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {(selectedOffer.mobileDetails || selectedOffer.freeProfiles || selectedOffer.tariffStartPrice || selectedOffer.profiles100Price || selectedOffer.details?.price || selectedOffer.details?.freeTrial || selectedOffer.details?.ipRotation || selectedOffer.details?.rate || selectedOffer.details?.geo || selectedOffer.details?.types || selectedOffer.platforms?.length || selectedOffer.details?.paymentMethods) && (
                    <div
                      data-offer-facts
                      className={
                        selectedOffer.category === 'Proxy'
                          ? 'grid grid-cols-1 gap-3 border-y border-white/5 py-5'
                          : 'space-y-6 border-y border-white/5 py-6'
                      }
                    >
                      {isSelectedOfferMobileAntidetect && selectedOffer.mobileDetails && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Smartphone className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">{t.control}</h4>
                            <p className="text-white font-bold text-lg">{l(selectedOffer.mobileDetails.control)}</p>
                          </div>
                        </div>
                      )}
                      {selectedVpnTerms && (
                        <>
                          <InfoRow icon={Clock} label={t.vpnFree} value={l(selectedVpnTerms.free)} />
                          <InfoRow icon={CreditCard} label={t.vpnPrice} value={l(selectedVpnTerms.price)} />
                          <InfoRow icon={ShieldCheck} label={t.vpnAllowlist} value={l(selectedVpnTerms.allowlist)} />
                          <InfoRow icon={Users} label={tx({ ru: 'Устройства', en: 'Devices' })} value={l(selectedOffer.details?.devices)} />
                        </>
                      )}
                      {isSelectedOfferMobileAntidetect && selectedOffer.mobileDetails && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Layers className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">{t.format}</h4>
                            <p className="text-white font-bold text-lg">{l(selectedOffer.mobileDetails.format)}</p>
                          </div>
                        </div>
                      )}
                      {isSelectedOfferMobileAntidetect && selectedOffer.mobileDetails?.trial && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">{t.trial}</h4>
                            <p className="text-white font-bold text-lg">{l(selectedOffer.mobileDetails.trial)}</p>
                          </div>
                        </div>
                      )}
                      {!isSelectedOfferMobileAntidetect && selectedOffer.freeProfiles && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                              {t.freeProfiles}
                            </h4>
                            <p className="text-white font-bold text-lg">{l(selectedOffer.freeProfiles)}</p>
                          </div>
                        </div>
                      )}
                      {(!isSelectedOfferMobileAntidetect || selectedOffer.subCategory === 'Mobile') && selectedOffer.tariffStartPrice && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <CreditCard className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                              {t.tariffStart}
                            </h4>
                            <p className="text-white font-bold text-lg">{l(selectedOffer.tariffStartPrice)}</p>
                          </div>
                        </div>
                      )}
                      {!isSelectedOfferMobileAntidetect && selectedOffer.profiles100Price && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Layers className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                              {l(selectedOffer.profilesPriceLabel) || t.profiles100}
                            </h4>
                            <p className="text-white font-bold text-lg">{l(selectedOffer.profiles100Price)}</p>
                          </div>
                        </div>
                      )}
                      {[
                        { key: 'price', Icon: CreditCard, label: lang === 'ru' ? 'Цена' : 'Price', value: l(selectedOffer.details?.price) },
                        { key: 'freeTrial', Icon: Clock, label: lang === 'ru' ? 'Бесплатный тест' : 'Free test', value: l(selectedOffer.details?.freeTrial) },
                        { key: 'ipRotation', Icon: ArrowLeftRight, label: lang === 'ru' ? 'Смена IP' : 'IP rotation', value: l(selectedOffer.details?.ipRotation) },
                      ].filter(row => row.value).map(({ key, Icon, label, value }) => (
                        <div key={key} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
                          <div className="rounded-lg bg-brand-purple/10 p-2 text-brand-purple"><Icon className="h-4 w-4" /></div>
                          <div className="min-w-0">
                            <h4 className="mb-1 text-[9px] font-black uppercase tracking-widest text-white/30">{label}</h4>
                            <p className="text-lg font-bold text-white">{value}</p>
                          </div>
                        </div>
                      ))}
                      {selectedOffer.details?.rate && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Percent className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                              {t.rate}
                            </h4>
                            <p className="text-white font-bold text-lg">{l(selectedOffer.details.rate)}</p>
                          </div>
                        </div>
                      )}
                      {selectedOffer.details?.geo && (
                        <div className={selectedOffer.category === 'Proxy' ? 'flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4' : 'flex items-center gap-4'}>
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Globe className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                              {t.geo}
                            </h4>
                            <p className="text-white font-bold text-lg">{l(selectedOffer.details.geo)}</p>
                          </div>
                        </div>
                      )}
                      {selectedOffer.details?.types && (
                        <div className={selectedOffer.category === 'Proxy' ? 'flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4' : 'flex items-center gap-4'}>
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Layers className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                              {t.types}
                            </h4>
                            <p className="text-white font-bold text-lg">{l(selectedOffer.details.types)}</p>
                          </div>
                        </div>
                      )}
                      {!isSelectedOfferMobileAntidetect && !!selectedOffer.platforms?.length && (
                        <div className={selectedOffer.category === 'Proxy' ? 'flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4' : 'flex items-center gap-4'}>
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Monitor className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                              {t.platforms}
                            </h4>
                            <p className="text-white font-bold text-lg">{selectedOffer.platforms.join(', ')}</p>
                          </div>
                        </div>
                      )}
                      {selectedOffer.details?.paymentMethods && (
                        <div className={selectedOffer.category === 'Proxy' ? 'flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4' : 'flex items-center gap-4'}>
                          <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center shrink-0">
                            <Coins className="w-5 h-5 text-brand-purple" />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-black text-white/30 tracking-widest mb-1">
                              {t.paymentMethods}
                            </h4>
                            <p className="text-white font-bold text-lg">{l(selectedOffer.details.paymentMethods)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div data-offer-editorial aria-busy={!loaded}>
                    {loaded ? editorialContent : <EditorialSkeleton />}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-3 border-t border-white/10 bg-bg-dark/95 p-4 md:px-8 md:py-5">
                  <a
                    href={selectedOffer.url}
                    target="_blank"
                    rel={getExternalLinkRel(selectedOffer.url)}
                    onClick={() => trackAnalyticsEvent('service_click', {
                      service_id: selectedOffer.id,
                      service_name: selectedOffer.name,
                      category: selectedOffer.category,
                      destination: isTelegramUrl(selectedOffer.url) ? 'telegram' : 'website',
                      language: lang,
                      placement: 'modal_primary',
                      link_url: selectedOffer.url,
                      promo_code: selectedOffer.promoCode,
                      promo_discount: selectedOffer.promoDiscount ? l(selectedOffer.promoDiscount) : undefined,
                    })}
                    className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border-2 border-brand-purple bg-brand-purple px-5 py-4 text-center text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_15px_40px_rgba(157,88,255,0.3)] transition-all duration-500 hover:bg-white hover:text-brand-purple md:tracking-[0.14em]"
                  >
                    {selectedOffer.category === 'Guides'
                      ? t.readGuide
                      : selectedOffer.id === 'hermes-exchange'
                        ? tx({
                            ru: 'Открыть Hermes в Telegram',
                            en: 'Open Hermes in Telegram',
                            es: 'Abrir Hermes en Telegram',
                            zh: '在 Telegram 打开 Hermes',
                            ko: 'Telegram에서 Hermes 열기',
                          })
                      : isTelegramUrl(selectedOffer.url)
                        ? t.openTelegramBot
                        : tx({
                            ru: `Перейти в ${offerTitle(selectedOffer)}`,
                            en: `Visit ${offerTitle(selectedOffer)}`,
                            es: `Ir a ${offerTitle(selectedOffer)}`,
                            zh: `访问 ${offerTitle(selectedOffer)}`,
                            ko: `${offerTitle(selectedOffer)} 방문`,
                          })}
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  {selectedOffer.webUrl && (
                    <a
                      href={selectedOffer.webUrl}
                      target="_blank"
                      rel={getExternalLinkRel(selectedOffer.webUrl)}
                      onClick={() => trackAnalyticsEvent('service_click', {
                        service_id: selectedOffer.id,
                        service_name: selectedOffer.name,
                        category: selectedOffer.category,
                        destination: 'website_secondary',
                        language: lang,
                        placement: 'modal_secondary',
                        link_url: selectedOffer.webUrl,
                      })}
                      className="flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border-2 border-white/10 bg-white/5 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-white/60 transition-all hover:border-brand-purple/40 hover:bg-white/10 hover:text-white"
                    >
                      {selectedOffer.webLabel ? l(selectedOffer.webLabel) : t.openWebsite}
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  {selectedOffer.promoCode && (
                    <button
                      onClick={() => copyToClipboard(selectedOffer.promoCode || '', `modal-${selectedOffer.id}`)}
                      data-promo-source={`modal-${selectedOffer.id}`}
                      aria-label={`${copiedPromoId === `modal-${selectedOffer.id}` ? t.copied : t.promo} ${selectedOffer.promoCode}`}
                      title={`${t.promo}: ${selectedOffer.promoCode}`}
                      aria-live="polite"
                      className="group/copy flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-brand-purple/5 px-4 py-2 text-left transition-all hover:border-white/15 hover:bg-brand-purple/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BD7BFF]/60"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Percent className="h-4 w-4 shrink-0 text-[#BD7BFF]" />
                        <div className="flex min-w-0 items-baseline gap-2">
                          <span className="shrink-0 text-[9px] font-black uppercase tracking-[0.14em] text-[#BD7BFF]/75">
                            {copiedPromoId === `modal-${selectedOffer.id}` ? t.copied : t.promo}
                          </span>
                          <span className="truncate font-mono text-sm font-black tracking-normal text-white">{selectedOffer.promoCode}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {selectedOffer.promoDiscount && (
                          <span className="text-[11px] font-black text-[#BD7BFF]">
                            {l(selectedOffer.promoDiscount)}
                          </span>
                        )}
                        {copiedPromoId === `modal-${selectedOffer.id}` ? (
                          <Check className="h-4 w-4 text-[#BD7BFF]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-white/35 transition-colors group-hover/copy:text-[#BD7BFF]" />
                        )}
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
</>;}
