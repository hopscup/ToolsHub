const affiliateParameters = new Set([
  'ref', 'refid', 'ref_id', 'referral', 'referral_id', 'refcode', 'ref_code',
  'partner', 'partner_id', 'aff', 'aff_id', 'affiliate', 'affiliate_id',
  'p', 'ai', 'r', 'rf', 'rid', 'line', 'invite_code', 'claccode',
]);

// These existing referrals encode the partner in a path or a generic parameter.
const affiliatePaths = {
  'accsmarket.com': /^\/(?:en\/)?9vV7VOzI\/?$/i,
  'aim.market': /^\/p\/[^/]+/,
  'browser.vision': /^\/r\/[^/]+/,
  'dolphin-anty.net': /^\/a\/[^/]+/,
  'gologin.com': /^\/join\/[^/]+/,
  'incogniton.com': /^\/aff\/[^/]+/,
  'okx.com': /^\/join\/[^/]+/,
  'px6.net': /^\/c\/\d+/,
  'unu.im': /^\/re\/\d+/,
  'adspower-ru.com': /^\/share\/[^/]+/,
  'vmoscloud.com': /^\/invite\/[^/]+/,
};
const fromReferralHosts = new Set(['billing.spacecore.pro', 'morelogin.com', 'xorek.cloud']);
const telegramReferralBots = new Set([
  'cashinout_bot', 'gigadollarvpn_bot', 'vpnpplbot', 'crassus_market_bot',
  'imp_vpn_bot', 'prostoexbot', 'prostovpnrubot', 'ptrv4_bot', 'tochka_gi_bot',
]);
const nonAffiliateHosts = new Set(['chromewebstore.google.com', 'github.com', 'amlbot.com']);

export const isAffiliateUrl = (href) => {
  if (typeof href !== 'string' || !/^https?:\/\//i.test(href)) return false;
  try {
    const url = new URL(href);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (host === 'hopscup.tools' || nonAffiliateHosts.has(host)) return false;
    for (const [key, value] of url.searchParams) {
      if (value && affiliateParameters.has(key.toLowerCase())) return true;
    }
    if (fromReferralHosts.has(host) && url.searchParams.get('from')) return true;
    if (host === 'socpublic.com' && url.searchParams.get('i')) return true;
    if (host === 't.me' && /^ref/i.test(url.searchParams.get('startapp') || '')) return true;
    if (host === 't.me' && url.searchParams.get('start')) {
      const start = url.searchParams.get('start');
      if (/ref/i.test(start) || telegramReferralBots.has(url.pathname.slice(1).toLowerCase())) return true;
    }
    return host === 'partner.soc-proof.su'
      || /^\/ref(?:erral)?(?:\/|\d)/i.test(url.pathname)
      || Boolean(affiliatePaths[host]?.test(url.pathname));
  } catch {
    return false;
  }
};

export const getExternalLinkRel = (href) => {
  if (typeof href !== 'string' || !/^https?:\/\//i.test(href)) return undefined;
  return isAffiliateUrl(href) ? 'sponsored noopener noreferrer' : 'noopener noreferrer';
};
