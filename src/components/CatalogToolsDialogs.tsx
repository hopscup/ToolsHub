import {motion,AnimatePresence} from './CssTransitions';
import {Gamepad2,Globe,CreditCard,ShoppingBag,ExternalLink,Search,Laptop,ThumbsUp,Users,Video,FileText,Star,Info,Zap,X,Shield,Percent} from 'lucide-react';
type DialogName = 'ProxyGuide' | 'ProxyChecker' | 'AntidetectGuide' | 'ActivatorGuide' | 'StoresGuide' | 'CardsGuide' | 'SocialGuide' | 'SteamGuide';
type Props = Record<`is${DialogName}Open`,boolean> & Record<`setIs${DialogName}Open`,(open:boolean)=>void> & {
  PROXY_ANTIDETECT_VIDEO_URL:string; CARDS_VIDEO_URL:string; SOCIAL_VIDEO_URL:string;
  STORE_AI_VIDEO_URL:string; STORE_ACCOUNTS_VIDEO_URL:string; STEAM_PRICE_TABLE_URL:string;
  tx:<T,>(value:Partial<Record<'ru'|'en'|'es'|'zh'|'ko',T>>&{en:T})=>T;
  t:Record<string,string>;
};
export function CatalogToolsDialogs({PROXY_ANTIDETECT_VIDEO_URL,CARDS_VIDEO_URL,SOCIAL_VIDEO_URL,STORE_AI_VIDEO_URL,STORE_ACCOUNTS_VIDEO_URL,STEAM_PRICE_TABLE_URL,isProxyGuideOpen,setIsProxyGuideOpen,isProxyCheckerOpen,setIsProxyCheckerOpen,isAntidetectGuideOpen,setIsAntidetectGuideOpen,isActivatorGuideOpen,setIsActivatorGuideOpen,isStoresGuideOpen,setIsStoresGuideOpen,isCardsGuideOpen,setIsCardsGuideOpen,isSocialGuideOpen,setIsSocialGuideOpen,isSteamGuideOpen,setIsSteamGuideOpen,tx,t}:Props){return <>
      {/* Proxy Guide Modal */}
      <AnimatePresence>
        {isProxyGuideOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProxyGuideOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setIsProxyGuideOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl font-display font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {t.proxyGuideTitle}
                </h2>

                <div className="space-y-8 text-white/70 text-sm md:text-base leading-relaxed font-medium">
                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-brand-purple" />
                      {t.whatToKnow}
                    </h3>
                    <p>
                      {tx({
                        ru: 'Прокси - это отдельный IP для профиля. VPN подходит для обычного использования, но для мультиакков, фарма, рекламы, ретродропов и большого количества аккаунтов почти всегда удобнее именно прокси: один профиль - один IP или своя понятная схема.',
                        en: 'A proxy is a separate IP for a profile. VPN is fine for regular browsing, but for multi-accounting, farming, ads, retro drops, and many accounts, proxies are usually better: one profile gets one IP or another controlled setup.',
                        es: 'Un proxy es una IP separada para un perfil. Una VPN sirve para uso normal, pero para multiaccounting, farming, anuncios, retro drops y muchas cuentas casi siempre es más cómodo usar proxies: un perfil, una IP, o una lógica clara.',
                        zh: '代理就是给单个资料单独使用的 IP。VPN 适合日常浏览，但多账号、养号、广告、retrodrop 和大量账号场景通常更适合代理：一个资料一个 IP，或者一套清晰的分配规则。',
                        ko: '프록시는 프로필별로 쓰는 별도 IP입니다. VPN은 일반 사용에는 괜찮지만 멀티계정, 파밍, 광고, 레트로드롭, 대량 계정 작업에는 보통 프록시가 더 편합니다. 프로필 하나에 IP 하나, 또는 명확한 운영 방식이 필요합니다.'
                      })}
                    </p>
                  </section>

                  <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-brand-orange font-bold text-lg mb-4">
                      {t.protocolChoice}
                    </h3>
                    <p>
                      {tx({
                        ru: 'Чаще всего берите SOCKS5. Это более универсальный вариант для антидетектов и рабочих профилей. HTTP тоже может работать, но если не знаете, что выбрать, начинайте с SOCKS5.',
                        en: 'Usually choose SOCKS5. It is the more universal option for antidetect browsers and work profiles. HTTP can also work, but if you are unsure, start with SOCKS5.',
                        es: 'En la mayoría de casos elige SOCKS5. Es la opción más universal para antidetects y perfiles de trabajo. HTTP también puede funcionar, pero si dudas, empieza por SOCKS5.',
                        zh: '多数情况下选 SOCKS5。它对反检测浏览器和工作资料更通用。HTTP 也能用，但不确定时先从 SOCKS5 开始。',
                        ko: '대부분은 SOCKS5를 고르면 됩니다. 안티디텍트 브라우저와 작업용 프로필에 더 범용적입니다. HTTP도 가능하지만 잘 모르겠다면 SOCKS5부터 시작하세요.'
                      })}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {t.basicAccountsTasks}
                    </h3>
                    <p>
                      {tx({
                        ru: (
                        <>
                          Для Gmail, Twitter, Discord, Telegram, web3-проектов, Яндекса, базовых нейронок и небольшого количества аккаунтов до 20-30 штук чаще всего достаточно обычных <span className="text-brand-purple font-bold">IPv4</span>. Смотреть можно <span className="text-brand-purple font-bold">Proxyline</span>, <span className="text-brand-purple font-bold">Proxy6</span>, <span className="text-brand-purple font-bold">ProxyWing</span>, <span className="text-brand-purple font-bold">Proxys.io</span> и <span className="text-brand-purple font-bold">Proxy-Seller</span>.
                        </>
                        ),
                        en: (
                        <>
                          For Gmail, Twitter, Discord, Telegram, web3 projects, Yandex, basic AI tools, and up to 20-30 accounts, regular <span className="text-brand-purple font-bold">IPv4</span> is usually enough. Check <span className="text-brand-purple font-bold">Proxyline</span>, <span className="text-brand-purple font-bold">Proxy6</span>, <span className="text-brand-purple font-bold">ProxyWing</span>, <span className="text-brand-purple font-bold">Proxys.io</span>, and <span className="text-brand-purple font-bold">Proxy-Seller</span>.
                        </>
                        ),
                        es: (
                        <>
                          Para Gmail, Twitter, Discord, Telegram, proyectos web3, Yandex, herramientas básicas de IA y hasta 20-30 cuentas, normalmente basta con <span className="text-brand-purple font-bold">IPv4</span>. Puedes mirar <span className="text-brand-purple font-bold">Proxyline</span>, <span className="text-brand-purple font-bold">Proxy6</span>, <span className="text-brand-purple font-bold">ProxyWing</span>, <span className="text-brand-purple font-bold">Proxys.io</span> y <span className="text-brand-purple font-bold">Proxy-Seller</span>.
                        </>
                        ),
                        zh: (
                        <>
                          Gmail、Twitter、Discord、Telegram、web3 项目、Yandex、基础 AI 工具以及 20-30 个以内账号，通常普通 <span className="text-brand-purple font-bold">IPv4</span> 就够了。可以看 <span className="text-brand-purple font-bold">Proxyline</span>、<span className="text-brand-purple font-bold">Proxy6</span>、<span className="text-brand-purple font-bold">ProxyWing</span>、<span className="text-brand-purple font-bold">Proxys.io</span> 和 <span className="text-brand-purple font-bold">Proxy-Seller</span>。
                        </>
                        ),
                        ko: (
                        <>
                          Gmail, Twitter, Discord, Telegram, web3 프로젝트, Yandex, 기본 AI 도구, 20-30개 이하 계정에는 보통 일반 <span className="text-brand-purple font-bold">IPv4</span>로 충분합니다. <span className="text-brand-purple font-bold">Proxyline</span>, <span className="text-brand-purple font-bold">Proxy6</span>, <span className="text-brand-purple font-bold">ProxyWing</span>, <span className="text-brand-purple font-bold">Proxys.io</span>, <span className="text-brand-purple font-bold">Proxy-Seller</span>를 보면 됩니다.
                        </>
                        )
                      })}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {t.harderTasksAds}
                    </h3>
                    <p>
                      {tx({
                        ru: (
                        <>
                          Для браузерных нод, мультиакков бирж, части букмекерок, более сложного абуза, капризных сервисов и залива трафика лучше смотреть в сторону <span className="text-brand-purple font-bold">ISP</span>. Они дороже IPv4, но выглядят естественнее и часто проходят там, где обычные IPv4 уже детектятся.
                        </>
                        ),
                        en: (
                        <>
                          For browser nodes, exchange multi-accounting, some betting sites, more complex abuse, strict services, and ad traffic, look at <span className="text-brand-purple font-bold">ISP</span>. They cost more than IPv4 but look more natural and often work where regular IPv4 gets detected.
                        </>
                        ),
                        es: (
                        <>
                          Para nodos de navegador, multiaccounting en exchanges, algunas casas de apuestas, abuso más complejo, servicios exigentes y tráfico publicitario, mira hacia <span className="text-brand-purple font-bold">ISP</span>. Cuestan más que IPv4, pero parecen más naturales y suelen pasar donde las IPv4 normales ya se detectan.
                        </>
                        ),
                        zh: (
                        <>
                          浏览器节点、交易所多账号、部分博彩站、更复杂的操作、风控严格的服务和投放流量，建议看 <span className="text-brand-purple font-bold">ISP</span>。它们比 IPv4 贵，但看起来更自然，很多普通 IPv4 被识别的场景它们能过。
                        </>
                        ),
                        ko: (
                        <>
                          브라우저 노드, 거래소 멀티계정, 일부 베팅 사이트, 더 까다로운 작업, 민감한 서비스, 트래픽 작업은 <span className="text-brand-purple font-bold">ISP</span>를 보는 게 좋습니다. IPv4보다 비싸지만 더 자연스럽고, 일반 IPv4가 잡히는 곳에서도 통과하는 경우가 많습니다.
                        </>
                        )
                      })}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {t.maxTrustTraffic}
                    </h3>
                    <p>
                      {tx({
                        ru: (
                        <>
                          <span className="text-brand-purple font-bold">Residential</span> выглядят как домашний интернет и подходят почти под любые задачи, но обычно оплачиваются за гигабайты. Это удобно, если вы быстро настроили профиль, сделали действие и вышли. <span className="text-brand-purple font-bold">Mobile</span> - самый трастовый вариант с большим количеством сменяемых IP, но дороже и чаще требует работать с профилями по очереди.
                        </>
                        ),
                        en: (
                        <>
                          <span className="text-brand-purple font-bold">Residential</span> proxies look like home internet and fit almost any task, but are usually billed by traffic. They are convenient when you set up a profile, do the action, and leave. <span className="text-brand-purple font-bold">Mobile</span> is the most trusted option with many rotating IPs, but it is more expensive and often means working through profiles one by one.
                        </>
                        ),
                        es: (
                        <>
                          Los proxies <span className="text-brand-purple font-bold">Residential</span> parecen internet doméstico y sirven para casi cualquier tarea, pero normalmente se pagan por tráfico. Son cómodos cuando configuras un perfil, haces la acción y sales. <span className="text-brand-purple font-bold">Mobile</span> es la opción con más confianza y muchas IP rotativas, pero cuesta más y suele implicar trabajar con perfiles uno por uno.
                        </>
                        ),
                        zh: (
                        <>
                          <span className="text-brand-purple font-bold">Residential</span> 看起来像家庭宽带，几乎适合任何任务，但通常按流量收费。适合快速设置资料、完成操作然后退出。<span className="text-brand-purple font-bold">Mobile</span> 信任度最高，可轮换大量 IP，但更贵，通常需要按资料依次操作。
                        </>
                        ),
                        ko: (
                        <>
                          <span className="text-brand-purple font-bold">Residential</span>은 가정용 인터넷처럼 보여 거의 모든 작업에 맞지만 보통 트래픽 단위로 결제합니다. 프로필을 빠르게 설정하고 작업 후 종료하는 방식에 좋습니다. <span className="text-brand-purple font-bold">Mobile</span>은 신뢰도가 가장 높고 교체 가능한 IP가 많지만 더 비싸며, 프로필을 순서대로 다루는 경우가 많습니다.
                        </>
                        )
                      })}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-brand-orange" />
                      {t.practicalTips}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'IPv6 дешёвые, но многие сайты до сих пор работают с ними нестабильно. Если не уверены, лучше начинайте с IPv4.', en: 'IPv6 proxies are cheap, but many sites still handle them poorly. If unsure, start with IPv4.', es: 'Los IPv6 son baratos, pero muchos sitios todavía funcionan de forma inestable con ellos. Si dudas, empieza por IPv4.', zh: 'IPv6 很便宜，但很多网站对它支持仍不稳定。不确定时先从 IPv4 开始。', ko: 'IPv6는 저렴하지만 아직 많은 사이트에서 불안정합니다. 잘 모르겠다면 IPv4부터 시작하세요.' })}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'Не берите shared-прокси для серьёзной работы: один IP уже могли продать нескольким людям, и его история может быть грязной.', en: 'Avoid shared proxies for serious work: the same IP may be sold to several people, and its history can be dirty.', es: 'Evita proxies compartidos para trabajo serio: una misma IP puede venderse a varias personas y tener historial sucio.', zh: '严肃工作不要用共享代理：同一个 IP 可能卖给多人，历史可能很脏。', ko: '중요한 작업에는 shared 프록시를 피하세요. 같은 IP가 여러 사람에게 팔렸을 수 있고 이력이 지저분할 수 있습니다.' })}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'После покупки проверьте IP через IPQS или Scamalytics. Fraud Score до 10-20 обычно окей, 20-30 ещё терпимо для базовых задач, выше уже повод задуматься или просить замену.', en: 'After buying, check the IP with IPQS or Scamalytics. Fraud Score up to 10-20 is usually good, 20-30 can work for basic tasks, higher is a reason to reconsider or ask for replacement.', es: 'Después de comprar, revisa la IP en IPQS o Scamalytics. Fraud Score hasta 10-20 suele estar bien, 20-30 aún sirve para tareas básicas; más alto ya es motivo para pedir reemplazo.', zh: '购买后用 IPQS 或 Scamalytics 检查 IP。Fraud Score 10-20 通常可以，20-30 做基础任务还勉强，再高就该考虑更换。', ko: '구매 후 IPQS나 Scamalytics로 IP를 확인하세요. Fraud Score 10-20은 보통 괜찮고, 20-30은 기본 작업엔 가능하지만 그 이상이면 교체를 고려하세요.' })}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'Если аккаунтов мало, иногда можно сэкономить: обычная мобильная симка + режим самолёта даёт смену IP. Главное сохранять адекватное гео.', en: 'For a small number of accounts, you can sometimes save money: a regular mobile SIM plus airplane mode can rotate IPs. Just keep GEO reasonable.', es: 'Si tienes pocas cuentas, a veces puedes ahorrar: una SIM móvil normal + modo avión permite cambiar la IP. Lo importante es mantener una GEO lógica.', zh: '账号不多时可以省钱：普通手机 SIM 加飞行模式就能换 IP。关键是保持合理的地区。', ko: '계정 수가 적다면 일반 모바일 SIM과 비행기 모드로 IP를 바꿔 비용을 줄일 수 있습니다. GEO만 자연스럽게 맞추면 됩니다.' })}</p>
                      </li>
                    </ul>
                  </section>
                </div>

                <div className="mt-12 flex justify-center">
                  <a
                    href={PROXY_ANTIDETECT_VIDEO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-12 py-5 bg-brand-purple text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(129,28,254,0.4)] transition-all"
                  >
                    <Video className="w-5 h-5" />
                    {t.videoGuide}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Proxy Checker Modal */}
      <AnimatePresence>
        {isProxyCheckerOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProxyCheckerOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setIsProxyCheckerOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8 md:p-10">
                <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center mb-6">
                  <Search className="w-7 h-7 text-brand-purple" />
                </div>

                <h2 className="text-3xl font-display font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {t.proxyChecker}
                </h2>

                <p className="text-white/60 text-sm md:text-base leading-relaxed font-medium mb-8">
                  {tx({
                    ru: 'После покупки прокси можно быстро проверить IP на риск, fraud score, VPN/proxy-детект и общее качество. Если показатели слишком плохие, лучше заменить IP до работы с аккаунтами. При этом IPv4 часто детектятся как VPN или proxy и получают ниже score просто потому, что они серверные. Это не критично: я редко проверяю обычные IPv4, если задача базовая.',
                    en: 'After buying a proxy, you can quickly check IP risk, fraud score, VPN/proxy detection, and overall quality. If the score is too bad, replace the IP before using it with accounts. Regular IPv4 proxies are often detected as VPN or proxy and get a lower score simply because they come from server infrastructure. This is not critical: I rarely check regular IPv4 for basic tasks.',
                    es: 'Después de comprar un proxy puedes revisar rápido el riesgo de la IP, fraud score, detección VPN/proxy y calidad general. Si los indicadores son malos, es mejor cambiar la IP antes de trabajar con cuentas. Los IPv4 normales a menudo se detectan como VPN o proxy y reciben menos score solo por proceder de infraestructura de servidor. No es crítico: para tareas básicas rara vez reviso IPv4 normales.',
                    zh: '购买代理后，可以快速检查 IP 风险、fraud score、VPN/proxy 检测和整体质量。如果指标太差，最好在用于账号前更换 IP。普通 IPv4 经常会被识别成 VPN 或 proxy，仅仅因为它们来自服务器基础设施，所以分数更低。这不一定严重：基础任务里我很少检查普通 IPv4。',
                    ko: '프록시 구매 후 IP 위험도, fraud score, VPN/proxy 감지, 전체 품질을 빠르게 확인할 수 있습니다. 지표가 너무 나쁘면 계정 작업 전에 IP를 교체하는 것이 좋습니다. 일반 IPv4는 서버 인프라에서 나온다는 이유만으로 VPN 또는 proxy로 감지되어 점수가 낮게 나오는 경우가 많습니다. 기본 작업에서는 치명적이지 않아 저는 일반 IPv4를 자주 확인하지 않습니다.'
                  })}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="https://www.ipqualityscore.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-brand-purple hover:border-brand-purple px-5 py-5 transition-all"
                  >
                    <div>
                      <p className="text-white font-black text-base">IPQualityScore</p>
                      <p className="text-white/35 group-hover:text-white/70 text-[10px] uppercase tracking-widest font-black mt-1">
                        ipqualityscore.com
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-brand-purple group-hover:text-white shrink-0" />
                  </a>

                  <a
                    href="https://scamalytics.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-brand-purple hover:border-brand-purple px-5 py-5 transition-all"
                  >
                    <div>
                      <p className="text-white font-black text-base">Scamalytics</p>
                      <p className="text-white/35 group-hover:text-white/70 text-[10px] uppercase tracking-widest font-black mt-1">
                        scamalytics.com
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-brand-purple group-hover:text-white shrink-0" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Antidetect Guide Modal */}
      <AnimatePresence>
        {isAntidetectGuideOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAntidetectGuideOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setIsAntidetectGuideOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl font-display font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {t.antidetectGuideTitle}
                </h2>

                <div className="space-y-8 text-white/70 text-sm md:text-base leading-relaxed font-medium">
                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Laptop className="w-5 h-5 text-brand-purple" />
                      {t.whyNeedIt}
                    </h3>
                    <p>
                      {tx({
                        ru: 'Прокси меняет IP, но не делает вас новым пользователем полностью. Антидетект создаёт отдельные профили с разными отпечатками: для сайта каждый профиль выглядит как отдельный компьютер, браузер и пользователь.',
                        en: 'A proxy changes the IP, but it does not fully make you a new user. An antidetect browser creates separate profiles with different fingerprints: each profile looks like a separate computer, browser, and user to the site.',
                        es: 'Un proxy cambia la IP, pero no te convierte por completo en un usuario nuevo. Un antidetect crea perfiles separados con huellas diferentes: para el sitio, cada perfil parece otro ordenador, navegador y usuario.',
                        zh: '代理会改变 IP，但不会让你完全变成新用户。反检测浏览器会创建带有不同指纹的独立资料：网站会把每个资料看作不同的电脑、浏览器和用户。',
                        ko: '프록시는 IP를 바꾸지만 완전히 새로운 사용자로 만들어 주지는 않습니다. 안티디텍트는 서로 다른 fingerprint를 가진 별도 프로필을 만들며, 사이트 입장에서는 각 프로필이 다른 컴퓨터, 브라우저, 사용자처럼 보입니다.'
                      })}
                    </p>
                  </section>

                  <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-brand-orange font-bold text-lg mb-4">
                      {t.mainSetupRule}
                    </h3>
                    <p>
                      {tx({
                        ru: 'Не нужно менять все настройки подряд. В хорошем антидетекте база уже выставлена нормально. Проверяйте только ключевое: ОС под вашу реальную систему, WebRTC в режиме Proxy/Auto, язык/таймзона/гео по прокси, User-Agent на Auto или актуальный Chrome, разрешение экрана не выше вашего реального.',
                        en: 'Do not change every setting manually. A good antidetect browser already has sane defaults. Check only the essentials: OS matching your real system, WebRTC in Proxy/Auto mode, language/timezone/GEO based on proxy, User-Agent on Auto or current Chrome, and screen resolution not above your real one.',
                        es: 'No cambies todos los ajustes manualmente. Un buen antidetect ya trae una base correcta. Revisa solo lo clave: sistema operativo acorde al real, WebRTC en Proxy/Auto, idioma/zona horaria/GEO según el proxy, User-Agent en Auto o Chrome actual y resolución no mayor que tu pantalla real.',
                        zh: '不要手动乱改所有设置。好的反检测浏览器默认配置已经比较合理。只检查关键项：系统和真实设备匹配，WebRTC 用 Proxy/Auto，语言/时区/地区跟代理一致，User-Agent 用 Auto 或最新版 Chrome，屏幕分辨率不要高于真实屏幕。',
                        ko: '모든 설정을 직접 바꿀 필요는 없습니다. 좋은 안티디텍트는 기본값이 이미 괜찮습니다. 핵심만 확인하세요: 실제 시스템과 맞는 OS, WebRTC Proxy/Auto, 프록시에 맞는 언어/시간대/GEO, User-Agent Auto 또는 최신 Chrome, 실제 화면보다 높지 않은 해상도.'
                      })}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {t.forMostTasks}
                    </h3>
                    <p>
                      {tx({
                        ru: (
                        <>
                          Для Twitter, Gmail, Discord, Telegram, ретродропов, браузерных нод, web3 и обычных мультиакков чаще всего хватит <span className="text-brand-purple font-bold">Dolphin</span>, <span className="text-brand-purple font-bold">AdsPower</span>, <span className="text-brand-purple font-bold">Incogniton</span>, <span className="text-brand-purple font-bold">GoLogin</span> или похожих решений. У многих есть бесплатные профили, и для 10-20 аккаунтов этого часто достаточно.
                        </>
                        ),
                        en: (
                        <>
                          For Twitter, Gmail, Discord, Telegram, retro drops, browser nodes, web3, and normal multi-accounting, <span className="text-brand-purple font-bold">Dolphin</span>, <span className="text-brand-purple font-bold">AdsPower</span>, <span className="text-brand-purple font-bold">Incogniton</span>, <span className="text-brand-purple font-bold">GoLogin</span>, or similar tools are usually enough. Many have free profiles, which is often enough for 10-20 accounts.
                        </>
                        ),
                        es: (
                        <>
                          Para Twitter, Gmail, Discord, Telegram, retro drops, nodos de navegador, web3 y multiaccounting normal, normalmente basta con <span className="text-brand-purple font-bold">Dolphin</span>, <span className="text-brand-purple font-bold">AdsPower</span>, <span className="text-brand-purple font-bold">Incogniton</span>, <span className="text-brand-purple font-bold">GoLogin</span> o herramientas similares. Muchas tienen perfiles gratis, suficiente para 10-20 cuentas.
                        </>
                        ),
                        zh: (
                        <>
                          Twitter、Gmail、Discord、Telegram、retro drops、浏览器节点、web3 和普通多账号，通常 <span className="text-brand-purple font-bold">Dolphin</span>、<span className="text-brand-purple font-bold">AdsPower</span>、<span className="text-brand-purple font-bold">Incogniton</span>、<span className="text-brand-purple font-bold">GoLogin</span> 或类似工具就够了。很多都有免费资料，10-20 个账号通常够用。
                        </>
                        ),
                        ko: (
                        <>
                          Twitter, Gmail, Discord, Telegram, 레트로드롭, 브라우저 노드, web3, 일반 멀티계정에는 보통 <span className="text-brand-purple font-bold">Dolphin</span>, <span className="text-brand-purple font-bold">AdsPower</span>, <span className="text-brand-purple font-bold">Incogniton</span>, <span className="text-brand-purple font-bold">GoLogin</span> 또는 비슷한 툴이면 충분합니다. 무료 프로필이 있는 경우가 많아 10-20개 계정에는 충분한 편입니다.
                        </>
                        )
                      })}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {t.strongerAntifraud}
                    </h3>
                    <p>
                      {tx({
                        ru: (
                        <>
                          Для букмекерок, казино, абуза бирж и задач, где сервис защищает деньги напрямую, лучше смотреть на усиленные варианты: <span className="text-brand-purple font-bold">Vision</span>, <span className="text-brand-purple font-bold">Octo Browser</span>, <span className="text-brand-purple font-bold">Multilogin</span>. Они дороже и обычно без щедрых бесплатных профилей, но глубже работают с браузерным окружением.
                        </>
                        ),
                        en: (
                        <>
                          For betting, casinos, exchange abuse, and tasks where the service protects money directly, look at stronger options: <span className="text-brand-purple font-bold">Vision</span>, <span className="text-brand-purple font-bold">Octo Browser</span>, <span className="text-brand-purple font-bold">Multilogin</span>. They cost more and usually do not have generous free profiles, but they work deeper with the browser environment.
                        </>
                        ),
                        es: (
                        <>
                          Para apuestas, casinos, abuso en exchanges y tareas donde el servicio protege dinero directamente, mira opciones más fuertes: <span className="text-brand-purple font-bold">Vision</span>, <span className="text-brand-purple font-bold">Octo Browser</span>, <span className="text-brand-purple font-bold">Multilogin</span>. Cuestan más y suelen tener menos perfiles gratuitos, pero trabajan más profundo con el entorno del navegador.
                        </>
                        ),
                        zh: (
                        <>
                          博彩、赌场、交易所相关操作，以及服务直接保护资金的任务，建议看更强的方案：<span className="text-brand-purple font-bold">Vision</span>、<span className="text-brand-purple font-bold">Octo Browser</span>、<span className="text-brand-purple font-bold">Multilogin</span>。它们更贵，免费资料通常不多，但对浏览器环境处理更深。
                        </>
                        ),
                        ko: (
                        <>
                          베팅, 카지노, 거래소 관련 작업, 돈을 직접 보호하는 서비스에는 더 강한 옵션을 보세요: <span className="text-brand-purple font-bold">Vision</span>, <span className="text-brand-purple font-bold">Octo Browser</span>, <span className="text-brand-purple font-bold">Multilogin</span>. 더 비싸고 무료 프로필은 적은 편이지만 브라우저 환경을 더 깊게 다룹니다.
                        </>
                        )
                      })}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {t.saveProfiles}
                    </h3>
                    <p>
                      {tx({
                        ru: 'Если нужно 10-20 аккаунтов, можно начать с бесплатных профилей в нескольких антидетектах и обычных IPv4 или мобильной симки со сменой IP. Если нужно 50-100 аккаунтов на месяц, тогда уже удобнее покупать дополнительные профили: из простых вариантов AdsPower/Dolphin, из усиленных Vision/Octo.',
                        en: 'If you need 10-20 accounts, start with free profiles across several antidetect browsers plus regular IPv4 or a mobile SIM with IP rotation. If you need 50-100 accounts for a month, buying extra profiles becomes more convenient: AdsPower/Dolphin for simpler work, Vision/Octo for stronger setups.',
                        es: 'Si necesitas 10-20 cuentas, puedes empezar con perfiles gratuitos en varios antidetects y IPv4 normales o una SIM móvil con cambio de IP. Si necesitas 50-100 cuentas al mes, ya conviene comprar perfiles extra: AdsPower/Dolphin para tareas simples, Vision/Octo para setups más fuertes.',
                        zh: '如果只需要 10-20 个账号，可以先用几个反检测浏览器的免费资料，加普通 IPv4 或可换 IP 的手机卡。如果一个月需要 50-100 个账号，购买额外资料会更方便：简单任务用 AdsPower/Dolphin，更强配置用 Vision/Octo。',
                        ko: '10-20개 계정이면 여러 안티디텍트의 무료 프로필과 일반 IPv4 또는 IP 교체 가능한 모바일 SIM으로 시작할 수 있습니다. 한 달에 50-100개가 필요하면 추가 프로필 구매가 더 편합니다. 단순 작업은 AdsPower/Dolphin, 강한 세팅은 Vision/Octo가 좋습니다.'
                      })}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-brand-orange" />
                      {t.whatToCheckBefore}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'IP, страна и timezone должны совпадать с прокси и выглядеть логично.', en: 'IP, country, and timezone should match the proxy and look logical.', es: 'La IP, el país y la zona horaria deben coincidir con el proxy y verse lógicos.', zh: 'IP、国家和时区必须与代理一致，并且看起来合理。', ko: 'IP, 국가, 시간대가 프록시와 일치하고 자연스러워야 합니다.' })}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'WebRTC не должен показывать ваш реальный IP. В идеале виден только IP прокси.', en: 'WebRTC must not reveal your real IP. Ideally, only the proxy IP is visible.', es: 'WebRTC no debe mostrar tu IP real. Idealmente solo se ve la IP del proxy.', zh: 'WebRTC 不应该暴露真实 IP。理想情况下只显示代理 IP。', ko: 'WebRTC가 실제 IP를 노출하면 안 됩니다. 이상적으로는 프록시 IP만 보여야 합니다.' })}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'Language, timezone, screen resolution и WebGL должны выглядеть как обычный живой пользователь, а не как странный тестовый стенд.', en: 'Language, timezone, screen resolution, and WebGL should look like a normal real user, not a strange test setup.', es: 'Idioma, zona horaria, resolución de pantalla y WebGL deben parecer los de un usuario real, no un entorno de prueba raro.', zh: '语言、时区、屏幕分辨率和 WebGL 应该像普通真实用户，而不是奇怪的测试环境。', ko: 'Language, timezone, screen resolution, WebGL은 이상한 테스트 환경이 아니라 일반 실제 사용자처럼 보여야 합니다.' })}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'Куки-прогрев не обязателен всегда, но для сложных задач можно пару минут походить по сайту или использовать куки-робота.', en: 'Cookie warming is not always required, but for harder tasks you can browse for a few minutes or use a cookie robot.', es: 'El calentamiento de cookies no siempre es obligatorio, pero para tareas difíciles puedes navegar unos minutos o usar un robot de cookies.', zh: 'Cookie 预热不一定总是需要，但复杂任务可以先浏览几分钟，或使用 cookie 机器人。', ko: '쿠키 워밍은 항상 필수는 아니지만, 까다로운 작업에서는 몇 분간 사이트를 둘러보거나 쿠키 로봇을 사용할 수 있습니다.' })}</p>
                      </li>
                    </ul>
                  </section>
                </div>

                <div className="mt-12 flex justify-center">
                  <a
                    href={PROXY_ANTIDETECT_VIDEO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-12 py-5 bg-brand-purple text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(129,28,254,0.4)] transition-all"
                  >
                    <Video className="w-5 h-5" />
                    {t.videoGuide}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SMS Activator Guide Modal */}
      <AnimatePresence>
        {isActivatorGuideOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsActivatorGuideOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setIsActivatorGuideOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl font-display font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {t.activatorGuideTitle}
                </h2>

                <div className="space-y-8 text-white/70 text-sm md:text-base leading-relaxed font-medium">
                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-brand-purple" />
                      {t.whatToKnow}
                    </h3>
                    <p>
                      {tx({
                        ru: 'Сервисы виртуальных номеров работают примерно одинаково: вы арендуете номер, получаете на него код подтверждения и используете его для регистрации. Некоторые сервисы позволяют брать длительную аренду.',
                        en: 'Virtual number services work similarly: you rent a number, receive a confirmation code, and use it for registration. Some services offer long-term rentals.',
                        es: 'Los servicios de números virtuales funcionan de forma parecida: alquilas un número, recibes el código de confirmación y lo usas para registrarte. Algunos permiten alquileres largos.',
                        zh: '虚拟号码服务大体类似：租一个号码，接收验证码，然后用于注册。有些服务支持长期租用。',
                        ko: '가상 번호 서비스는 대체로 비슷합니다. 번호를 빌리고 인증 코드를 받아 회원가입에 사용합니다. 일부 서비스는 장기 대여도 지원합니다.'
                      })}
                    </p>
                  </section>

                  <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-brand-orange font-bold text-lg mb-4">
                      {t.mainProblem}
                    </h3>
                    <p>
                      {tx({
                        ru: 'В подборе подходящего номера и страны. Некоторые номера уже могли использоваться ранее, а отдельные площадки могут отклонять номера определённых операторов. Поэтому иногда приходится пробовать разные варианты. Если код так и не приходит, большинство сервисов автоматически возвращают средства за неудачную активацию, если код не был получен.',
                        en: 'Finding a suitable number and country. Some numbers might have been used before, and certain platforms may reject numbers from specific operators. Most services automatically refund if the code is not received.',
                        es: 'El problema principal es elegir el número y el país adecuados. Algunos números ya pudieron usarse antes, y ciertas plataformas rechazan operadores concretos. A veces hay que probar varias opciones. Si el código no llega, la mayoría de servicios devuelven el dinero automáticamente.',
                        zh: '主要问题是选择合适的号码和国家。有些号码可能以前被用过，部分平台会拒绝某些运营商的号码，所以有时要尝试不同选项。如果验证码没到，大多数服务会自动退款。',
                        ko: '핵심은 알맞은 번호와 국가를 고르는 것입니다. 일부 번호는 이미 사용됐을 수 있고, 플랫폼에 따라 특정 통신사 번호를 거절할 수 있습니다. 그래서 여러 옵션을 시도해야 할 때가 있습니다. 코드가 오지 않으면 대부분의 서비스는 자동 환불됩니다.'
                      })}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {t.russianCardsSbp}
                    </h3>
                    <p>
                      {tx({
                        ru: (
                        <>
                          Хорошо подходят <a href="https://smsfast.pro/?ref=1100157" target="_blank" className="text-brand-purple hover:underline">SMS Fast</a> и <a href="https://365sms.vip/?ref=37269" target="_blank" className="text-brand-purple hover:underline">365-SMS</a>. Оба сервиса поддерживают российские способы оплаты и в целом показывают стабильную работу. Для повседневных задач чаще всего используют <a href="https://smsfast.pro/?ref=1100157" target="_blank" className="text-brand-purple hover:underline">SMS Fast</a> как основной вариант.
                        </>
                        ),
                        en: (
                        <>
                          <a href="https://smsfast.pro/?ref=1100157" target="_blank" className="text-brand-purple hover:underline">SMS Fast</a> and <a href="https://365sms.vip/?ref=37269" target="_blank" className="text-brand-purple hover:underline">365-SMS</a> are good choices. Both support Russian payment methods and are generally stable.
                        </>
                        ),
                        es: (
                        <>
                          <a href="https://smsfast.pro/?ref=1100157" target="_blank" className="text-brand-purple hover:underline">SMS Fast</a> y <a href="https://365sms.vip/?ref=37269" target="_blank" className="text-brand-purple hover:underline">365-SMS</a> son buenas opciones. Ambos aceptan métodos de pago rusos y suelen funcionar de forma estable.
                        </>
                        ),
                        zh: (
                        <>
                          <a href="https://smsfast.pro/?ref=1100157" target="_blank" className="text-brand-purple hover:underline">SMS Fast</a> 和 <a href="https://365sms.vip/?ref=37269" target="_blank" className="text-brand-purple hover:underline">365-SMS</a> 是不错的选择。两者都支持俄罗斯支付方式，整体比较稳定。
                        </>
                        ),
                        ko: (
                        <>
                          <a href="https://smsfast.pro/?ref=1100157" target="_blank" className="text-brand-purple hover:underline">SMS Fast</a>와 <a href="https://365sms.vip/?ref=37269" target="_blank" className="text-brand-purple hover:underline">365-SMS</a>가 좋은 선택입니다. 둘 다 러시아 결제 수단을 지원하고 전반적으로 안정적입니다.
                        </>
                        )
                      })}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {t.cryptoNonCisCards}
                    </h3>
                    <p>
                      {tx({
                        ru: (
                        <>
                          Стоит обратить внимание на <a href="https://smspool.net/?r=AcN28TiKAr" target="_blank" className="text-brand-purple hover:underline">SMSPool</a> и <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">Hero SMS</a>. Сервис предлагает большой выбор номеров, показывает статистику успешности для каждого направления и имеет оперативную службу поддержки.
                        </>
                        ),
                        en: (
                        <>
                          Check <a href="https://smspool.net/?r=AcN28TiKAr" target="_blank" className="text-brand-purple hover:underline">SMSPool</a> and <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">Hero SMS</a>. Great selection, success stats, and quick support.
                        </>
                        ),
                        es: (
                        <>
                          Mira <a href="https://smspool.net/?r=AcN28TiKAr" target="_blank" className="text-brand-purple hover:underline">SMSPool</a> y <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">Hero SMS</a>. Tienen buena selección, estadísticas de éxito y soporte rápido.
                        </>
                        ),
                        zh: (
                        <>
                          可以看看 <a href="https://smspool.net/?r=AcN28TiKAr" target="_blank" className="text-brand-purple hover:underline">SMSPool</a> 和 <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">Hero SMS</a>。号码选择多，有成功率统计，支持也比较快。
                        </>
                        ),
                        ko: (
                        <>
                          <a href="https://smspool.net/?r=AcN28TiKAr" target="_blank" className="text-brand-purple hover:underline">SMSPool</a>와 <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">Hero SMS</a>를 확인해 보세요. 번호 선택지가 많고 성공률 통계와 빠른 지원이 있습니다.
                        </>
                        )
                      })}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4">
                      {t.bulkNumbersMinPrice}
                    </h3>
                    <p>
                      {tx({
                        ru: (
                        <>
                          Можно рассмотреть <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">HeroSMS</a> и <a href="https://tiger-sms.com/?ref=672048" target="_blank" className="text-brand-purple hover:underline">Tiger SMS</a>. Стоимость номеров там начинается примерно от $0.12–0.22. HeroSMS получил особую популярность после закрытия SMS-Activate в конце 2025 года.
                        </>
                        ),
                        en: (
                        <>
                          Consider <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">HeroSMS</a> and <a href="https://tiger-sms.com/?ref=672048" target="_blank" className="text-brand-purple hover:underline">Tiger SMS</a>. Prices start from $0.12–0.22.
                        </>
                        ),
                        es: (
                        <>
                          Puedes considerar <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">HeroSMS</a> y <a href="https://tiger-sms.com/?ref=672048" target="_blank" className="text-brand-purple hover:underline">Tiger SMS</a>. Los precios empiezan aprox. desde $0.12-0.22.
                        </>
                        ),
                        zh: (
                        <>
                          可以考虑 <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">HeroSMS</a> 和 <a href="https://tiger-sms.com/?ref=672048" target="_blank" className="text-brand-purple hover:underline">Tiger SMS</a>。价格大约从 $0.12-0.22 起。
                        </>
                        ),
                        ko: (
                        <>
                          <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">HeroSMS</a>와 <a href="https://tiger-sms.com/?ref=672048" target="_blank" className="text-brand-purple hover:underline">Tiger SMS</a>도 볼 만합니다. 가격은 대략 $0.12-0.22부터 시작합니다.
                        </>
                        )
                      })}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-brand-orange" />
                      {t.practicalTips}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'Лучше брать номер той же страны, что прокси/впн. Но не всегда так. Например, для Telegram это не важно, а вот для Google уже имеет бОльшее значение.', en: 'It is best to match the number country with your proxy/VPN, though requirements vary: it matters more for Google and less for Telegram.', es: 'Mejor usar un número del mismo país que el proxy/VPN, aunque depende del servicio: para Google importa más, para Telegram menos.', zh: '最好选择和代理/VPN 同国家的号码，但并非总是必须。Google 更在意，Telegram 通常没那么关键。', ko: '번호 국가는 프록시/VPN과 맞추는 것이 좋지만 항상 필수는 아닙니다. Google은 더 중요하고 Telegram은 덜 중요합니다.' })}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({
                          ru: (
                          <>
                            Проверяйте нужный сервис+гео на % доходимости сообщений. Эта функция есть в - <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">HeroSMS</a>, <a href="https://grizzlysms.com/ru/?r=1654440" target="_blank" className="text-brand-purple hover:underline">GrizzlySMS</a>, <a href="https://smsfast.pro/?ref=1100157" target="_blank" className="text-brand-purple hover:underline">SMS Fast</a>, <a href="https://smspool.net/?r=AcN28TiKAr" target="_blank" className="text-brand-purple hover:underline">SMSPool</a>.
                          </>
                          ),
                          en: (
                          <>
                            Check delivery success rates for your target service and GEO. This feature is available on <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">HeroSMS</a>, <a href="https://grizzlysms.com/ru/?r=1654440" target="_blank" className="text-brand-purple hover:underline">GrizzlySMS</a>, <a href="https://smsfast.pro/?ref=1100157" target="_blank" className="text-brand-purple hover:underline">SMS Fast</a>, and <a href="https://smspool.net/?r=AcN28TiKAr" target="_blank" className="text-brand-purple hover:underline">SMSPool</a>.
                          </>
                          ),
                          es: (
                          <>
                            Revisa el porcentaje de entrega para el servicio y GEO que necesitas. Esta función está en <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">HeroSMS</a>, <a href="https://grizzlysms.com/ru/?r=1654440" target="_blank" className="text-brand-purple hover:underline">GrizzlySMS</a>, <a href="https://smsfast.pro/?ref=1100157" target="_blank" className="text-brand-purple hover:underline">SMS Fast</a> y <a href="https://smspool.net/?r=AcN28TiKAr" target="_blank" className="text-brand-purple hover:underline">SMSPool</a>.
                          </>
                          ),
                          zh: (
                          <>
                            检查目标服务和地区的短信到达率。这个功能在 <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">HeroSMS</a>、<a href="https://grizzlysms.com/ru/?r=1654440" target="_blank" className="text-brand-purple hover:underline">GrizzlySMS</a>、<a href="https://smsfast.pro/?ref=1100157" target="_blank" className="text-brand-purple hover:underline">SMS Fast</a> 和 <a href="https://smspool.net/?r=AcN28TiKAr" target="_blank" className="text-brand-purple hover:underline">SMSPool</a> 上都有。
                          </>
                          ),
                          ko: (
                          <>
                            필요한 서비스와 GEO의 메시지 도달률을 확인하세요. 이 기능은 <a href="https://hero-sms.com/?ref=687296" target="_blank" className="text-brand-purple hover:underline">HeroSMS</a>, <a href="https://grizzlysms.com/ru/?r=1654440" target="_blank" className="text-brand-purple hover:underline">GrizzlySMS</a>, <a href="https://smsfast.pro/?ref=1100157" target="_blank" className="text-brand-purple hover:underline">SMS Fast</a>, <a href="https://smspool.net/?r=AcN28TiKAr" target="_blank" className="text-brand-purple hover:underline">SMSPool</a>에서 볼 수 있습니다.
                          </>
                          )
                        })}</p>
                      </li>
                    </ul>
                  </section>
                </div>

                <div className="mt-12 flex justify-center">
                  <a 
                    href="https://t.me/hopscupcrpt" 
                    target="_blank"
                    className="flex items-center gap-3 px-12 py-5 bg-brand-purple text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(129,28,254,0.4)] transition-all"
                  >
                    <FileText className="w-5 h-5" />
                    {t.guideArticle}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Account Shop Guide Modal */}
      <AnimatePresence>
        {isStoresGuideOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStoresGuideOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setIsStoresGuideOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl font-display font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {t.guideTitle}
                </h2>

                <div className="space-y-8 text-white/70 text-sm md:text-base leading-relaxed font-medium">
                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-brand-purple" />
                      {t.whereBuyAccounts}
                    </h3>
                    <p>
                      {tx({
                        ru: (
                        <>
                          В основном я пользуюсь <a href="https://dark.shopping/category/view/gmail?p=95083" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">DarkShopping</a> и <a href="https://funpay.com/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">FunPay</a> - вместе они закрывают примерно 95% моих потребностей. <span className="text-white font-bold">DarkShopping</span> чаще беру для рабочих аккаунтов, почт, соцсетей и расходников. По DarkShopping и покупке аккаунтов вроде Discord/Twitter есть отдельный <a href={STORE_ACCOUNTS_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">видео-гайд</a>. <span className="text-white font-bold">FunPay</span> удобен для подписок, ключей, игровых товаров, услуг и разных цифровых продуктов. Если нужно сравнить цены или найти редкую позицию, можно дополнительно смотреть <a href="https://gglead.org/go20580" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">GGsel</a>, <a href="https://plati.market/?ai=1422112" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Plati Market</a> и <a href="https://accsmarket.com/en/9vV7VOzI" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">AccsMarket</a>.
                        </>
                        ),
                        en: (
                        <>
                          I mainly use <a href="https://dark.shopping/category/view/gmail?p=95083" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">DarkShopping</a> and <a href="https://funpay.com/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">FunPay</a>; together they cover roughly 95% of my needs. <span className="text-white font-bold">DarkShopping</span> is mostly for work accounts, emails, social accounts, and consumables. There is a separate <a href={STORE_ACCOUNTS_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">video guide</a> for DarkShopping and buying Discord/Twitter-style accounts. <span className="text-white font-bold">FunPay</span> is useful for subscriptions, keys, gaming goods, services, and other digital products. For price comparison or rare items, also check <a href="https://gglead.org/go20580" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">GGsel</a>, <a href="https://plati.market/?ai=1422112" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Plati Market</a>, and <a href="https://accsmarket.com/en/9vV7VOzI" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">AccsMarket</a>.
                        </>
                        ),
                        es: (
                        <>
                          Yo uso sobre todo <a href="https://dark.shopping/category/view/gmail?p=95083" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">DarkShopping</a> y <a href="https://funpay.com/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">FunPay</a>; juntos cubren cerca del 95% de mis necesidades. <span className="text-white font-bold">DarkShopping</span> lo uso más para cuentas de trabajo, correos, redes sociales y consumibles. Hay una <a href={STORE_ACCOUNTS_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">videoguía</a> aparte sobre DarkShopping y cuentas tipo Discord/Twitter. <span className="text-white font-bold">FunPay</span> es cómodo para suscripciones, claves, productos de juegos, servicios y otros productos digitales. Para comparar precios o buscar algo raro, mira también <a href="https://gglead.org/go20580" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">GGsel</a>, <a href="https://plati.market/?ai=1422112" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Plati Market</a> y <a href="https://accsmarket.com/en/9vV7VOzI" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">AccsMarket</a>.
                        </>
                        ),
                        zh: (
                        <>
                          我主要使用 <a href="https://dark.shopping/category/view/gmail?p=95083" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">DarkShopping</a> 和 <a href="https://funpay.com/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">FunPay</a>，它们合起来能覆盖我约 95% 的需求。<span className="text-white font-bold">DarkShopping</span> 更适合工作账号、邮箱、社媒账号和消耗品。关于 DarkShopping 和 Discord/Twitter 类账号购买有单独的 <a href={STORE_ACCOUNTS_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">视频指南</a>。<span className="text-white font-bold">FunPay</span> 适合订阅、密钥、游戏商品、服务和其他数字产品。想比价或找稀有商品，也可以看 <a href="https://gglead.org/go20580" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">GGsel</a>、<a href="https://plati.market/?ai=1422112" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Plati Market</a> 和 <a href="https://accsmarket.com/en/9vV7VOzI" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">AccsMarket</a>。
                        </>
                        ),
                        ko: (
                        <>
                          저는 주로 <a href="https://dark.shopping/category/view/gmail?p=95083" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">DarkShopping</a>와 <a href="https://funpay.com/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">FunPay</a>를 사용합니다. 둘이 제 필요의 약 95%를 해결합니다. <span className="text-white font-bold">DarkShopping</span>는 작업용 계정, 이메일, 소셜 계정, 소모품에 자주 씁니다. DarkShopping와 Discord/Twitter 계정 구매는 별도 <a href={STORE_ACCOUNTS_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">비디오 가이드</a>가 있습니다. <span className="text-white font-bold">FunPay</span>는 구독, 키, 게임 상품, 서비스, 디지털 제품에 편합니다. 가격 비교나 희귀 상품은 <a href="https://gglead.org/go20580" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">GGsel</a>, <a href="https://plati.market/?ai=1422112" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Plati Market</a>, <a href="https://accsmarket.com/en/9vV7VOzI" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">AccsMarket</a>도 확인하세요.
                        </>
                        )
                      })}
                    </p>
                  </section>

                  <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-brand-purple font-bold text-lg mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      {t.botShops}
                    </h3>
                    <p>
                      {tx({
                        ru: (
                        <>
                          Telegram-боты - это удобные мини-магазины, где чаще всего продаются дешёвые аккаунты и подписки на популярные нейросети и сервисы: Gemini, GPT, Claude, CapCut, Canva и похожие продукты. Про покупку дешёвых ИИ-подписок есть отдельный <a href={STORE_AI_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">видео-гайд</a>. Такие боты удобно проверять, когда нужна подписка “здесь и сейчас” или хочется найти цену ниже официальной. Из вариантов можно смотреть <a href="https://t.me/LachugaSkamera_Bot?start=ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Лачугу</a>, <a href="https://t.me/bothegreategod_bot?start=ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">TheGod Shop</a>, <a href="https://t.me/crassus_market_bot?start=467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Crassus Market</a>, <a href="https://t.me/vibecodinzz_bot?start=contest_ultra_ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Apel0sin</a>, <a href="https://t.me/apel0sin_market_bot?start=ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">apel0sin | market 2.0</a> и <a href="https://t.me/ptrv4_bot?start=467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Petrovich</a>.
                        </>
                        ),
                        en: (
                        <>
                          Telegram bots are convenient mini-shops that usually sell low-cost accounts and subscriptions for popular AI tools and services: Gemini, GPT, Claude, CapCut, Canva, and similar products. There is a separate <a href={STORE_AI_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">video guide</a> about buying cheap AI subscriptions. They are useful when you need a subscription right now or want a lower-than-official price. Options include <a href="https://t.me/LachugaSkamera_Bot?start=ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Lachuga</a>, <a href="https://t.me/bothegreategod_bot?start=ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">TheGod Shop</a>, <a href="https://t.me/crassus_market_bot?start=467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Crassus Market</a>, <a href="https://t.me/vibecodinzz_bot?start=contest_ultra_ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Apel0sin</a>, <a href="https://t.me/apel0sin_market_bot?start=ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">apel0sin | market 2.0</a>, and <a href="https://t.me/ptrv4_bot?start=467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Petrovich</a>.
                        </>
                        ),
                        es: (
                        <>
                          Los bots de Telegram son mini-tiendas cómodas donde suelen vender cuentas y suscripciones baratas para herramientas de IA y servicios populares: Gemini, GPT, Claude, CapCut, Canva y similares. Hay una <a href={STORE_AI_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">videoguía</a> aparte sobre suscripciones de IA baratas. Son útiles cuando necesitas una suscripción aquí y ahora o un precio por debajo del oficial. Opciones: <a href="https://t.me/LachugaSkamera_Bot?start=ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Lachuga</a>, <a href="https://t.me/bothegreategod_bot?start=ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">TheGod Shop</a>, <a href="https://t.me/crassus_market_bot?start=467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Crassus Market</a>, <a href="https://t.me/vibecodinzz_bot?start=contest_ultra_ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Apel0sin</a>, <a href="https://t.me/apel0sin_market_bot?start=ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">apel0sin | market 2.0</a> y <a href="https://t.me/ptrv4_bot?start=467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Petrovich</a>.
                        </>
                        ),
                        zh: (
                        <>
                          Telegram 机器人是方便的小商店，通常售卖热门 AI 工具和服务的低价账号或订阅：Gemini、GPT、Claude、CapCut、Canva 等。关于购买便宜 AI 订阅有单独的 <a href={STORE_AI_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">视频指南</a>。当你需要立刻开通订阅，或想找低于官方价格的方案时很方便。可以看 <a href="https://t.me/LachugaSkamera_Bot?start=ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Lachuga</a>、<a href="https://t.me/bothegreategod_bot?start=ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">TheGod Shop</a>、<a href="https://t.me/crassus_market_bot?start=467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Crassus Market</a>、<a href="https://t.me/vibecodinzz_bot?start=contest_ultra_ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Apel0sin</a>、<a href="https://t.me/apel0sin_market_bot?start=ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">apel0sin | market 2.0</a> 和 <a href="https://t.me/ptrv4_bot?start=467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Petrovich</a>。
                        </>
                        ),
                        ko: (
                        <>
                          Telegram 봇은 Gemini, GPT, Claude, CapCut, Canva 같은 인기 AI 도구와 서비스의 저렴한 계정 및 구독을 파는 미니 상점입니다. 저렴한 AI 구독 구매는 별도 <a href={STORE_AI_VIDEO_URL} target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">비디오 가이드</a>가 있습니다. 지금 바로 구독이 필요하거나 공식가보다 낮은 가격을 찾을 때 유용합니다. <a href="https://t.me/LachugaSkamera_Bot?start=ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Lachuga</a>, <a href="https://t.me/bothegreategod_bot?start=ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">TheGod Shop</a>, <a href="https://t.me/crassus_market_bot?start=467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Crassus Market</a>, <a href="https://t.me/vibecodinzz_bot?start=contest_ultra_ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Apel0sin</a>, <a href="https://t.me/apel0sin_market_bot?start=ref_467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">apel0sin | market 2.0</a>, <a href="https://t.me/ptrv4_bot?start=467483565" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Petrovich</a>를 볼 수 있습니다.
                        </>
                        )
                      })}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-brand-orange" />
                      {t.purchaseRules}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'Внимательно читаем описание и отзывы/рейтинг, количество покупок.', en: 'Carefully read the description, reviews, rating, and number of purchases.', es: 'Lee con atención la descripción, reseñas, rating y número de compras.', zh: '仔细阅读描述、评价、评分和购买数量。', ko: '설명, 리뷰/평점, 구매 수를 꼼꼼히 확인하세요.' })}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'Покупайте 1-2 сначала на тест. Потом 5-10.', en: 'Buy 1-2 first for testing. Then 5-10.', es: 'Compra primero 1-2 para probar. Después 5-10.', zh: '先买 1-2 个测试，再买 5-10 个。', ko: '처음에는 1-2개만 테스트로 구매하고, 그다음 5-10개로 늘리세요.' })}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'Не покупайте сразу 50-100 аккаунтов. Даже у крутого поставщика бывает плохой товар.', en: 'Do not buy 50-100 accounts immediately. Even top suppliers can have bad stock.', es: 'No compres 50-100 cuentas de golpe. Incluso un buen proveedor puede tener stock malo.', zh: '不要一上来就买 50-100 个账号。即使好供应商也可能有质量差的货。', ko: '처음부터 50-100개를 사지 마세요. 좋은 판매자도 안 좋은 재고가 있을 수 있습니다.' })}</p>
                      </li>
                    </ul>
                  </section>

                  <section className="p-6 bg-brand-purple/5 rounded-2xl border border-brand-purple/20">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-brand-purple" />
                      {t.safetyGuarantees}
                    </h3>
                    <p>
                      {tx({
                        ru: 'Зачастую каждый сайт в этом разделе выступает гарантом. Поэтому деньги сразу не отпускайте. Сначала проверяйте выполнение условий.',
                        en: 'Most sites in this section act as a guarantor. Do not release the money immediately. Check if all conditions are met first.',
                        es: 'La mayoría de sitios de esta sección actúan como garante. No liberes el dinero de inmediato: primero comprueba que se cumplan las condiciones.',
                        zh: '本节大多数平台都会充当担保方。不要立刻放款，先确认条件都已满足。',
                        ko: '이 섹션의 대부분 사이트는 보증 역할을 합니다. 돈을 바로 풀지 말고 조건이 충족됐는지 먼저 확인하세요.'
                      })}
                    </p>
                  </section>
                </div>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={STORE_AI_VIDEO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[72px] items-center gap-4 rounded-2xl border border-brand-purple/60 bg-brand-purple px-5 py-4 text-white shadow-[0_12px_32px_rgba(129,28,254,0.25)] transition-all hover:-translate-y-0.5 hover:bg-white hover:text-brand-purple hover:shadow-[0_16px_42px_rgba(129,28,254,0.35)]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 transition-colors group-hover:bg-brand-purple/10 group-hover:ring-brand-purple/20">
                      <Video className="w-5 h-5" />
                    </span>
                    <span className="min-w-0 text-left text-[11px] font-black uppercase leading-snug tracking-[0.16em]">
                      {t.aiSubscriptions}
                    </span>
                  </a>
                  <a
                    href={STORE_ACCOUNTS_VIDEO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[72px] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white/70 transition-all hover:-translate-y-0.5 hover:border-brand-purple/50 hover:bg-brand-purple/10 hover:text-white"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/10 transition-colors group-hover:bg-brand-purple/15 group-hover:ring-brand-purple/30">
                      <Video className="w-5 h-5 text-brand-purple" />
                    </span>
                    <span className="min-w-0 text-left text-[11px] font-black uppercase leading-snug tracking-[0.16em]">
                      {t.darkStoreAccounts}
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Social Boost Guide Modal */}
      <AnimatePresence>
        {isSocialGuideOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSocialGuideOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setIsSocialGuideOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl font-display font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {t.referralGuideTitle}
                </h2>

                <div className="space-y-8 text-white/70 text-sm md:text-base leading-relaxed font-medium">
                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-brand-purple" />
                      {t.shortVersion}
                    </h3>
                    <p>
                      {tx({
                        ru: (
                        <>
                          Есть два основных способа: <span className="text-brand-purple font-bold">сайты накрутки</span> и <span className="text-brand-purple font-bold">буксы</span>. Про ферму социальных аккаунтов я уже отдельно писал в <a href="https://t.me/hopscupcrpt/108" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">большой статье</a>, а здесь оставил сервисы для рефералов, регистраций и других простых действий.
                        </>
                        ),
                        en: (
                        <>
                          There are two main ways: <span className="text-brand-purple font-bold">boost sites</span> and <span className="text-brand-purple font-bold">task exchanges</span>. I already wrote a bigger article about social account farms <a href="https://t.me/hopscupcrpt/108" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">here</a>; this section focuses on referrals, registrations, and other simple actions.
                        </>
                        ),
                        es: (
                        <>
                          Hay dos formas principales: <span className="text-brand-purple font-bold">sitios de boost</span> y <span className="text-brand-purple font-bold">bolsas de tareas</span>. Ya escribí una <a href="https://t.me/hopscupcrpt/108" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">guía grande</a> sobre granjas de cuentas sociales; aquí dejé servicios para referidos, registros y otras acciones simples.
                        </>
                        ),
                        zh: (
                        <>
                          主要有两种方式：<span className="text-brand-purple font-bold">增长网站</span> 和 <span className="text-brand-purple font-bold">任务平台</span>。我已经写过一篇关于社交账号农场的 <a href="https://t.me/hopscupcrpt/108" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">长文</a>；这里收集的是推荐、注册和其他简单操作服务。
                        </>
                        ),
                        ko: (
                        <>
                          방법은 크게 두 가지입니다: <span className="text-brand-purple font-bold">부스트 사이트</span>와 <span className="text-brand-purple font-bold">태스크 거래소</span>. 소셜 계정 팜에 대해서는 이미 <a href="https://t.me/hopscupcrpt/108" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">큰 글</a>을 썼고, 여기서는 추천, 가입과 다른 간단한 활동을 위한 서비스를 모았습니다.
                        </>
                        )
                      })}
                    </p>
                  </section>

                  <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-brand-purple font-bold text-lg mb-4 flex items-center gap-2">
                      <ThumbsUp className="w-5 h-5" />
                      {t.boostSites}
                    </h3>
                    <p>
                      {tx({
                        ru: 'Это самый быстрый и простой вариант: выбираете услугу, указываете ссылку или нужное действие, пополняете баланс и ждёте выполнение. Я пользовался такими сайтами активнее всего, потому что это удобно. Главный минус: ники и профили часто выглядят ботскими. Перед большим заказом лучше сначала проверить сервис на небольшой сумме.',
                        en: 'This is the fastest and simplest option: choose a service, add a link or required action, top up the balance, and wait for completion. I used these sites most often because they are convenient. The main downside is that names and profiles often look automated. Test a small order before buying a large volume.',
                        es: 'Es la opción más rápida y sencilla: eliges un servicio, añades el enlace o la acción necesaria, recargas saldo y esperas el resultado. Usé estos sitios más que otros porque son cómodos. El principal inconveniente es que los nombres y perfiles pueden parecer automatizados. Prueba primero con un pedido pequeño.',
                        zh: '这是最快也最简单的方式：选择服务，填写链接或所需操作，充值后等待完成。我最常使用这类网站，因为很方便。主要缺点是昵称和资料可能看起来像自动账号。大批量下单前先测试小订单。',
                        ko: '가장 빠르고 쉬운 방법입니다. 서비스를 고르고 링크나 필요한 활동을 입력한 뒤 잔액을 충전하고 완료를 기다리면 됩니다. 편해서 이런 사이트를 가장 자주 사용했습니다. 가장 큰 단점은 닉네임과 프로필이 자동 계정처럼 보일 수 있다는 점입니다. 대량 주문 전에 소량으로 테스트하세요.'
                      })}
                    </p>
                  </section>

                  <section className="p-6 bg-brand-purple/5 rounded-2xl border border-brand-purple/20">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-brand-purple" />
                      {t.taskExchanges}
                    </h3>
                    <p>
                      {tx({
                        ru: 'Буксы это биржи заданий, где реальные люди выполняют простые действия за деньги. Вы регистрируетесь как заказчик, пополняете баланс и подробно описываете, что нужно сделать. В качестве подтверждения можно попросить логин или скрин результата. Цена зависит от сложности задания, требований и количества доступных исполнителей.',
                        en: 'Task exchanges are platforms where real people complete simple paid actions. Register as a customer, top up the balance, and describe the required action in detail. You can request a username or screenshot as proof. Pricing depends on task complexity, requirements, and the number of available performers.',
                        es: 'Las bolsas de tareas son plataformas donde personas reales realizan acciones simples por dinero. Te registras como cliente, recargas saldo y describes con detalle lo que deben hacer. Puedes pedir un usuario o una captura como prueba. El precio depende de la dificultad, los requisitos y la cantidad de personas disponibles.',
                        zh: '任务平台由真人付费完成简单操作。你以客户身份注册、充值，并清楚说明需要完成的动作。可以要求用户名或截图作为证明。价格取决于任务难度、要求和可用执行者数量。',
                        ko: '태스크 거래소는 실제 사람들이 돈을 받고 간단한 활동을 수행하는 플랫폼입니다. 고객으로 가입해 잔액을 충전하고 필요한 작업을 자세히 설명합니다. 확인용으로 아이디나 스크린샷을 요청할 수 있습니다. 가격은 작업 난이도, 요구사항과 작업자 수에 따라 달라집니다.'
                      })}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-brand-orange" />
                      {t.whatToCheck}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'В буксах перед подтверждением проверяйте логин, скрин, уникальность выполнения и повторы.', en: 'On task exchanges, check the username, screenshot, uniqueness, and repeated submissions before approval.', es: 'En bolsas de tareas, antes de aprobar revisa el usuario, la captura, la unicidad y repeticiones.', zh: '在任务平台确认前，检查用户名、截图、唯一性和重复提交。', ko: '태스크 거래소에서는 승인 전에 아이디, 스크린샷, 중복 여부와 반복 제출을 확인하세요.' })}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'Не запускайте сразу большой объём. Сначала сделайте небольшой тест и посмотрите качество.', en: 'Do not start with high volume. Run a small test first and check the quality.', es: 'No empieces con mucho volumen. Haz primero una prueba pequeña y revisa la calidad.', zh: '不要一开始就放大量任务。先做小规模测试并检查质量。', ko: '처음부터 큰 물량을 넣지 마세요. 먼저 소량으로 테스트하고 품질을 확인하세요.' })}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'Если важен внешний вид аккаунтов, буксы обычно выглядят естественнее сайтов накрутки, но требуют больше ручной проверки.', en: 'If account appearance matters, task exchanges usually look more natural than boost sites, but require more manual checking.', es: 'Si importa el aspecto de las cuentas, las bolsas suelen verse más naturales que los sitios de boost, pero exigen más revisión manual.', zh: '如果账号外观看起来是否自然很重要，任务平台通常比增长网站更自然，但需要更多人工检查。', ko: '계정의 자연스러운 외형이 중요하다면 태스크 거래소가 부스트 사이트보다 자연스러운 편이지만 수동 검수가 더 필요합니다.' })}</p>
                      </li>
                    </ul>
                  </section>
                </div>

                <div className="mt-12 flex justify-center">
                  <a
                    href={SOCIAL_VIDEO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-12 py-5 bg-brand-purple text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(129,28,254,0.4)] transition-all"
                  >
                    <Video className="w-5 h-5" />
                    {t.videoGuide}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Steam Guide Modal */}
      <AnimatePresence>
        {isSteamGuideOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSteamGuideOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setIsSteamGuideOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl font-display font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {t.steamGuideTitle}
                </h2>

                <div className="space-y-8 text-white/70 text-sm md:text-base leading-relaxed font-medium">
                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Gamepad2 className="w-5 h-5 text-brand-purple" />
                      {t.twoScenarios}
                    </h3>
                    <p>
                      {tx({
                        ru: 'Если нужен результат сразу, проще пополнять Steam по логину: обычно это быстро, но с комиссией. Если готовы потратить время, можно купить предмет дешевле Steam Market, продать его в Steam и получить баланс в плюс. Второй способ выгоднее, но требует проверки цены и ликвидности.',
                        en: 'If you need the result right away, direct login top-up is simpler: usually fast, but with a fee. If you are ready to spend some time, you can buy an item cheaper than on Steam Market, sell it on Steam, and get more balance. The second method is more profitable, but requires checking price and liquidity.',
                        es: 'Si necesitas el resultado al instante, es más simple recargar Steam por login: suele ser rápido, pero con comisión. Si puedes esperar, compra un ítem más barato que en Steam Market, véndelo en Steam y recibe más saldo. El segundo método es más rentable, pero exige revisar precio y liquidez.',
                        zh: '如果需要立刻到账，按 Steam 登录名充值最简单：通常很快，但有手续费。如果愿意花时间，可以购买比 Steam 市场便宜的物品，在 Steam 出售后获得更多余额。第二种更划算，但必须检查价格和流动性。',
                        ko: '바로 결과가 필요하면 Steam 로그인 충전이 가장 쉽습니다. 보통 빠르지만 수수료가 있습니다. 시간을 쓸 수 있다면 Steam Market보다 싼 아이템을 사서 Steam에서 팔아 더 많은 잔액을 얻을 수 있습니다. 두 번째 방식이 더 유리하지만 가격과 유동성 확인이 필요합니다.'
                      })}
                    </p>
                  </section>

                  <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-brand-purple font-bold text-lg mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      {t.fastByLogin}
                    </h3>
                    <p>
                      {tx({
                        ru: 'Для РФ самый простой бытовой вариант: найти Steam в поиске Сбербанка или OZON Банка и пополнить по логину. Обычно комиссия около 10%, зато всё происходит быстро и без предметов. Из маркетплейсов можно смотреть GGsel и Playerok: у Playerok часто встречается пополнение около 5%.',
                        en: 'For Russia, the simplest everyday option is to search for Steam inside Sberbank or OZON Bank and top up by login. The fee is usually around 10%, but it is fast and does not involve items. Among marketplaces, check GGsel and Playerok: Playerok often has offers around 5%.',
                        es: 'Para Rusia, la opción más simple es buscar Steam dentro de Sberbank u OZON Bank y recargar por login. La comisión suele rondar el 10%, pero es rápido y sin ítems. En marketplaces mira GGsel y Playerok: en Playerok a veces hay ofertas cerca del 5%.',
                        zh: '在俄罗斯，最简单的日常方式是在 Sberbank 或 OZON Bank 里搜索 Steam，然后按登录名充值。手续费通常约 10%，但速度快且不需要物品。市场平台可以看 GGsel 和 Playerok：Playerok 经常有约 5% 的充值。',
                        ko: '러시아에서는 Sberbank 또는 OZON Bank에서 Steam을 검색해 로그인으로 충전하는 것이 가장 쉽습니다. 수수료는 보통 약 10%지만 빠르고 아이템이 필요 없습니다. 마켓플레이스는 GGsel과 Playerok을 볼 수 있으며 Playerok에는 5% 정도의 제안도 있습니다.'
                      })}
                    </p>
                  </section>

                  <section className="p-6 bg-brand-purple/5 rounded-2xl border border-brand-purple/20">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Percent className="w-5 h-5 text-brand-purple" />
                      {t.topupThroughItems}
                    </h3>
                    <p>
                      {tx({
                        ru: (
                        <>
                          Для пополнения в плюс удобнее смотреть <a href="https://lis-skins.com/?rf=3576023" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">LIS-SKINS</a>, <a href="https://cs.money/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">CS.MONEY</a>, <a href="https://aim.market/p/6da48855-6e2a-4d1f-9ecc-fa767d6235bd" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">AIM.market</a> и <a href="https://tf2lavka.ru/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">TF2Lavka</a>. Я чаще использую LIS-SKINS, потому что там сразу видно разницу цены со Steam. TF2Lavka полезна, когда нужны Rust/TF2 предметы без долгого ожидания перед продажей, но конкретный предмет всё равно нужно проверять.
                        </>
                        ),
                        en: (
                        <>
                          For profitable top-ups, check <a href="https://lis-skins.com/?rf=3576023" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">LIS-SKINS</a>, <a href="https://cs.money/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">CS.MONEY</a>, <a href="https://aim.market/p/6da48855-6e2a-4d1f-9ecc-fa767d6235bd" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">AIM.market</a>, and <a href="https://tf2lavka.ru/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">TF2Lavka</a>. I usually use LIS-SKINS because it shows the price difference versus Steam. TF2Lavka is useful when you need Rust/TF2 items without a long wait before selling, but each item still needs checking.
                        </>
                        ),
                        es: (
                        <>
                          Para recargar con beneficio, mira <a href="https://lis-skins.com/?rf=3576023" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">LIS-SKINS</a>, <a href="https://cs.money/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">CS.MONEY</a>, <a href="https://aim.market/p/6da48855-6e2a-4d1f-9ecc-fa767d6235bd" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">AIM.market</a> y <a href="https://tf2lavka.ru/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">TF2Lavka</a>. Yo suelo usar LIS-SKINS porque muestra enseguida la diferencia de precio frente a Steam. TF2Lavka sirve para ítems de Rust/TF2 sin larga espera antes de vender, pero cada ítem hay que revisarlo.
                        </>
                        ),
                        zh: (
                        <>
                          想用物品充值并获得更高余额，可以看 <a href="https://lis-skins.com/?rf=3576023" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">LIS-SKINS</a>、<a href="https://cs.money/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">CS.MONEY</a>、<a href="https://aim.market/p/6da48855-6e2a-4d1f-9ecc-fa767d6235bd" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">AIM.market</a> 和 <a href="https://tf2lavka.ru/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">TF2Lavka</a>。我更常用 LIS-SKINS，因为它直接显示和 Steam 的价格差。TF2Lavka 适合需要 Rust/TF2 物品且不想等很久再出售的情况，但具体物品仍要检查。
                        </>
                        ),
                        ko: (
                        <>
                          이득 충전은 <a href="https://lis-skins.com/?rf=3576023" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">LIS-SKINS</a>, <a href="https://cs.money/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">CS.MONEY</a>, <a href="https://aim.market/p/6da48855-6e2a-4d1f-9ecc-fa767d6235bd" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">AIM.market</a>, <a href="https://tf2lavka.ru/" target="_blank" rel="noopener noreferrer" className="text-brand-purple font-bold hover:underline">TF2Lavka</a>를 확인하세요. 저는 Steam과의 가격 차이를 바로 볼 수 있어 LIS-SKINS를 자주 씁니다. TF2Lavka는 Rust/TF2 아이템을 오래 기다리지 않고 팔고 싶을 때 유용하지만, 각 아이템은 확인해야 합니다.
                        </>
                        )
                      })}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-brand-orange" />
                      {t.whatToCheck}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'Сверяйте цену предмета со Steam Market, а не только с процентом на сайте.', en: 'Compare the item price with Steam Market, not only with the percentage shown on the site.', es: 'Compara el precio del ítem con Steam Market, no solo con el porcentaje del sitio.', zh: '对比物品在 Steam Market 的价格，不要只看网站上的百分比。', ko: '사이트의 퍼센트만 보지 말고 Steam Market의 아이템 가격과 비교하세요.' })}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'Проверяйте ликвидность: у предмета могут быть красивые проценты, но мало покупок и долгий срок продажи.', en: 'Check liquidity: an item may show a nice percentage but have few buyers and slow sale speed.', es: 'Revisa la liquidez: un ítem puede tener buen porcentaje, pero pocos compradores y venta lenta.', zh: '检查流动性：物品百分比可能很好看，但买家少、卖得慢。', ko: '유동성을 확인하세요. 퍼센트는 좋아 보여도 구매자가 적고 판매가 느릴 수 있습니다.' })}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'Учитывайте комиссию Steam и возможные ограничения на трейд/маркет для конкретной игры и предмета.', en: 'Account for Steam fees and possible trade/market restrictions for the specific game and item.', es: 'Ten en cuenta la comisión de Steam y posibles restricciones de trade/market para el juego e ítem concreto.', zh: '考虑 Steam 手续费，以及具体游戏和物品可能存在的交易/市场限制。', ko: 'Steam 수수료와 특정 게임/아이템의 거래 및 마켓 제한을 고려하세요.' })}</p>
                      </li>
                    </ul>
                  </section>
                </div>

                <div className="mt-12 flex justify-center">
                  <a
                    href={STEAM_PRICE_TABLE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-12 py-5 bg-brand-purple text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(129,28,254,0.4)] transition-all"
                  >
                    <FileText className="w-5 h-5" />
                    {t.openPriceTable}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cards Guide Modal */}
      <AnimatePresence>
        {isCardsGuideOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCardsGuideOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-bg-dark border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setIsCardsGuideOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors z-20"
              >
                <X className="w-6 h-6 text-white/40 hover:text-white" />
              </button>

              <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl font-display font-bold mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  {t.cardGuideTitle}
                </h2>

                <div className="space-y-8 text-white/70 text-sm md:text-base leading-relaxed font-medium">
                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-brand-purple" />
                      {t.whatIsItFor}
                    </h3>
                    <p>
                      {tx({
                        ru: 'Зарубежная виртуальная карта нужна, чтобы оплачивать иностранные сервисы, которые не принимают российские карты. Обычно её можно пополнить рублями через СБП или криптовалютой, а дальше платить как обычной Visa/Mastercard.',
                        en: 'A foreign virtual card is used to pay for international services that do not accept Russian cards. Usually you can top it up with RUB via SBP or with crypto, then pay as with a regular Visa/Mastercard.',
                        es: 'Una tarjeta virtual extranjera sirve para pagar servicios internacionales que no aceptan tarjetas rusas. Normalmente puedes recargarla en RUB vía SBP o con cripto y luego pagar como con una Visa/Mastercard normal.',
                        zh: '海外虚拟卡用于支付不接受俄罗斯银行卡的国际服务。通常可以通过 SBP 用卢布充值，或用加密货币充值，然后像普通 Visa/Mastercard 一样付款。',
                        ko: '해외 가상 카드는 러시아 카드를 받지 않는 해외 서비스 결제에 사용합니다. 보통 SBP로 RUB 충전하거나 암호화폐로 충전한 뒤 일반 Visa/Mastercard처럼 결제할 수 있습니다.'
                      })}
                    </p>
                  </section>

                  <section className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-brand-purple font-bold text-lg mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      {t.whatCanPayFor}
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {tx({
                        ru: ['Airbnb, Booking, Aviasales', 'Google Play и App Store', 'ChatGPT, Claude, Gemini', 'Netflix, Spotify, YouTube', 'Amazon, eBay, AliExpress Global', 'OZON и часть RU-мерчантов'],
                        en: ['Airbnb, Booking, Aviasales', 'Google Play and App Store', 'ChatGPT, Claude, Gemini', 'Netflix, Spotify, YouTube', 'Amazon, eBay, AliExpress Global', 'OZON and some RU merchants'],
                        es: ['Airbnb, Booking, Aviasales', 'Google Play y App Store', 'ChatGPT, Claude, Gemini', 'Netflix, Spotify, YouTube', 'Amazon, eBay, AliExpress Global', 'OZON y algunos comercios RU'],
                        zh: ['Airbnb、Booking、Aviasales', 'Google Play 和 App Store', 'ChatGPT、Claude、Gemini', 'Netflix、Spotify、YouTube', 'Amazon、eBay、AliExpress Global', 'OZON 和部分 RU 商户'],
                        ko: ['Airbnb, Booking, Aviasales', 'Google Play 및 App Store', 'ChatGPT, Claude, Gemini', 'Netflix, Spotify, YouTube', 'Amazon, eBay, AliExpress Global', 'OZON 및 일부 RU 가맹점']
                      }).map((item) => (
                        <span key={item} className="text-xs bg-brand-purple/10 px-4 py-2 rounded-xl text-brand-purple border border-brand-purple/20 font-bold">
                          {item}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-brand-orange" />
                      {t.whatIUse}
                    </h3>
                    <p>
                      {tx({
                        ru: (
                        <>
                          В основном я использую <a href="https://t.me/zarub_robot?start=ref_PqBrBs" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Zarub</a>, потому что карта выпускается без KYC, пополняется через СБП или USDT и нормально проходит в большинстве нужных мне сервисов. Отдельный плюс: иногда проходит не только зарубежка, но и российские мерчанты, например OZON.
                        </>
                        ),
                        en: (
                        <>
                          I mainly use <a href="https://t.me/zarub_robot?start=ref_PqBrBs" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Zarub</a> because it is issued without KYC, can be topped up via SBP or USDT, and works with most services I need. A separate plus: it can also work with some Russian merchants, for example OZON.
                        </>
                        ),
                        es: (
                        <>
                          Uso principalmente <a href="https://t.me/zarub_robot?start=ref_PqBrBs" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Zarub</a> porque se emite sin KYC, se recarga por SBP o USDT y funciona en la mayoría de servicios que necesito. Otro plus: a veces también pasa en comercios rusos, por ejemplo OZON.
                        </>
                        ),
                        zh: (
                        <>
                          我主要使用 <a href="https://t.me/zarub_robot?start=ref_PqBrBs" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Zarub</a>，因为它无需 KYC 即可开卡，可通过 SBP 或 USDT 充值，并且能在我需要的大多数服务中正常使用。额外优点：有时不只海外服务可用，俄罗斯商户如 OZON 也能通过。
                        </>
                        ),
                        ko: (
                        <>
                          저는 주로 <a href="https://t.me/zarub_robot?start=ref_PqBrBs" target="_blank" rel="sponsored noopener noreferrer" className="text-brand-purple font-bold hover:underline">Zarub</a>를 사용합니다. KYC 없이 발급되고 SBP 또는 USDT로 충전 가능하며 필요한 대부분 서비스에서 잘 작동하기 때문입니다. 추가 장점은 OZON 같은 일부 러시아 가맹점에서도 통과할 때가 있다는 점입니다.
                        </>
                        )
                      })}
                    </p>
                  </section>

                  <section className="p-6 bg-brand-purple/5 rounded-2xl border border-brand-purple/20">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-brand-purple" />
                      {t.practicalTips}
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'Не держите крупный баланс на карте: пополняйте под конкретную оплату.', en: 'Do not keep a large balance on the card: top up for a specific payment.', es: 'No mantengas mucho saldo en la tarjeta: recarga para un pago concreto.', zh: '不要在卡上保留大额余额：按具体付款需求充值。', ko: '카드에 큰 잔액을 두지 말고 필요한 결제 금액만 충전하세요.' })}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'Перед важной покупкой сначала проверьте карту на небольшой оплате или дешёвой подписке.', en: 'Before an important purchase, test the card with a small payment or cheap subscription.', es: 'Antes de una compra importante, prueba la tarjeta con un pago pequeño o una suscripción barata.', zh: '重要购买前，先用小额支付或便宜订阅测试这张卡。', ko: '중요한 결제 전에는 소액 결제나 저렴한 구독으로 카드를 먼저 테스트하세요.' })}</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 shrink-0" />
                        <p>{tx({ ru: 'Если один сервис отклонил платёж, это не всегда значит, что карта плохая: у разных мерчантов разные антифрод-правила.', en: 'If one service declines a payment, it does not always mean the card is bad: different merchants have different antifraud rules.', es: 'Si un servicio rechaza el pago, no siempre significa que la tarjeta sea mala: cada merchant tiene reglas antifraude distintas.', zh: '如果某个服务拒绝付款，并不一定说明卡不好：不同商户有不同的反欺诈规则。', ko: '한 서비스에서 결제가 거절됐다고 카드가 나쁜 것은 아닙니다. 가맹점마다 antifraud 규칙이 다릅니다.' })}</p>
                      </li>
                    </ul>
                  </section>
                </div>

                <div className="mt-12 flex justify-center">
                  <a
                    href={CARDS_VIDEO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-12 py-5 bg-brand-purple text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_40px_rgba(129,28,254,0.4)] transition-all"
                  >
                    <Video className="w-5 h-5" />
                    {t.videoGuide}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

</>;}
