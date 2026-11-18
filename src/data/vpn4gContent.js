import vpn4gArticle from './vpn4gArticle.json' with { type: 'json' };
import { createOfferGuideContent } from './offerGuideContent.js';
import { vpnTerms } from './vpnDetails.js';

export { vpn4gArticle };
export const createVpn4gContent = offers => createOfferGuideContent({
  ...vpn4gArticle,
  blocks: vpn4gArticle.blocks.map(block => block.type === 'table' && block.id === 'vpn-allowlist' ? {
    ...block,
    rows: vpn4gArticle.vpnComparisonIds.map(id => {
      const offer = offers.find(item => item.id === id);
      const allowlist = offer && vpnTerms[offer.slug]?.allowlist.ru;
      if (!offer || !allowlist) throw new Error(`Missing VPN 4G comparison service: ${id}`);
      return [[{ text: offer.name, serviceId: id, internal: true }], [{ text: allowlist }]];
    }),
  } : block),
}, offers, 'VPN 4G article');
