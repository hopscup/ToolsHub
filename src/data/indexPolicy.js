import { guidePages } from './guidePages.js';
import { pageHeadings } from './pageHeadings.js';
import { seoLandingPages } from './seoLandingPages.js';
import { accountShopPages } from './accountShopPages.js';
import { aiPages } from './aiPages.js';
import { antidetectPages } from './antidetectPages.js';
import { foreignCardPages } from './foreignCardPages.js';
import { cryptoExchangePages } from './cryptoExchangePages.js';
import { smsPages } from './smsPages.js';
import { socialPages } from './socialPages.js';
import { steamPages } from './steamPages.js';
import { vpsPages } from './vpsPages.js';
import { vpnTerms } from './vpnDetails.js';

export const indexableUrlWhitelist = {
  ru: [
    '/', '/proxy-vpn', '/antidetect', '/account-shop', '/sms-activators', '/foreign-cards',
    '/ai', '/ai/syntx', '/ai/higgsfield', '/ai/lumean', '/ai/polza-ai',
    '/ai/omnirouter', '/ai/ghostmetal', '/ai/agentrouter', '/ai/a6api',
    '/crypto-exchange', '/guides', '/steam-topup', '/vps',
    '/proxy-vpn/luchshie-proksi', '/proxy-vpn/luchshie-mobilnye-proksi', '/antidetect/kakoy-vybrat',
    '/proxy-vpn/dlya-akkauntov', '/sms-activators/virtualnye-nomera', '/foreign-cards/oplatit-zarubezhnye-servisy',
    '/account-shop/podpiski-neyrosetey', '/crypto-exchange/obmen-kripty', '/crypto-exchange/qr-sbp',
    '/crypto-exchange/koshelki', '/steam-topup/kak-vygodno-popolnit-steam', '/vps/kakoy-vps-vybrat',
    '/proxy-vpn/mobileproxy', '/proxy-vpn/proxywing', '/proxy-vpn/proxy-seller', '/proxy-vpn/proxyshard',
    '/proxy-vpn/prostovpn', '/proxy-vpn/ppl-vpn', '/proxy-vpn/imp-vpn', '/proxy-vpn/all-vpn',
    '/proxy-vpn/giga-vpn', '/proxy-vpn/giga-dollar-vpn', '/proxy-vpn/tochka-g',
    '/account-shop/darkstore', '/foreign-cards/pgon', '/foreign-cards/zarub', '/foreign-cards/antarctic-wallet',
    '/crypto-exchange/prosto-exchange', '/crypto-exchange/keine-exchange', '/antidetect/shardx',
    '/antidetect/dolphin-anty', '/antidetect/adspower', '/antidetect/octo-browser',
    '/antidetect/linken-sphere',
    '/antidetect/gologin-mobile', '/antidetect/octo-browser-mobile', '/antidetect/vmos-cloud',
    '/sms-activators/sms-fast', '/sms-activators/herosms', '/account-shop/lachuga-skamera', '/account-shop/apel0sin',
  ],
  en: [
    '/en', '/en/proxy-vpn', '/en/antidetect', '/en/account-shop', '/en/sms-activators', '/en/foreign-cards',
    '/en/proxy-vpn/mobileproxy', '/en/proxy-vpn/proxywing', '/en/proxy-vpn/proxy-seller',
    '/en/proxy-vpn/proxyshard', '/en/account-shop/darkstore', '/en/foreign-cards/pgon', '/en/foreign-cards/zarub',
  ],
};

export const normalizeIndexPath = path => {
  const pathname = String(path || '/').split(/[?#]/)[0];
  return pathname.replace(/\/+$/, '') || '/';
};
const splitLanguage = path => {
  const normalized = normalizeIndexPath(path);
  const match = normalized.match(/^\/(en|es|zh|ko)(?=\/|$)/);
  return { language: match?.[1] || 'ru', route: match ? normalized.slice(match[0].length) || '/' : normalized };
};
const localizedPath = (route, language) => normalizeIndexPath(`${language === 'ru' ? '' : '/' + language}${route === '/' ? '' : route}`);
const guideByRoute = new Map(guidePages.map(page => [`/guides/${page.slug}`, page]));
const russianOnlyRoutes = new Set(['/proxy-vpn/luchshie-proksi', '/proxy-vpn/luchshie-mobilnye-proksi', ...guideByRoute.keys()]);
const existingRoutes = new Set([
  ...Object.keys(pageHeadings), ...seoLandingPages.map(page => page.route), ...guideByRoute.keys(),
  ...Object.keys(vpnTerms).map(slug => '/proxy-vpn/' + slug),
  ...[
    ['/account-shop', accountShopPages], ['/antidetect', antidetectPages], ['/foreign-cards', foreignCardPages],
    ['/ai', aiPages],
    ['/crypto-exchange', cryptoExchangePages], ['/sms-activators', smsPages], ['/social-boost', socialPages],
    ['/steam-topup', steamPages], ['/vps', vpsPages],
  ].flatMap(([category, pages]) => pages.map(page => `${category}/${page.slug}`)),
]);
const allowed = new Set(Object.values(indexableUrlWhitelist).flat());

export const isIndexablePath = path => {
  const normalized = normalizeIndexPath(path);
  const { language, route } = splitLanguage(normalized);
  const guide = guideByRoute.get(route);
  return guide ? language === 'ru' && guide.indexable !== false : allowed.has(normalized);
};

export const indexablePaths = [...new Set([...allowed, ...guidePages.filter(page => page.indexable !== false).map(page => `/guides/${page.slug}`)])].filter(isIndexablePath);

// Noindex pages keep their existing canonical; translated articles always use RU.
export const getCanonicalPath = path => {
  const { language, route } = splitLanguage(path);
  return russianOnlyRoutes.has(route) ? route : localizedPath(route, ['ru', 'en'].includes(language) ? language : 'en');
};

export const getIndexAlternates = path => {
  if (!isIndexablePath(path)) return [];
  const { route } = splitLanguage(path);
  const variants = ['ru', 'en'].map(language => ({ language, path: localizedPath(route, language) })).filter(item => isIndexablePath(item.path));
  return [...variants, { language: 'x-default', path: variants.find(item => item.language === 'ru')?.path || variants[0].path }];
};

export const getLanguageSwitchPath = (path, language) => {
  const { route } = splitLanguage(path);
  const exists = existingRoutes.has(route) && (language === 'ru' || !russianOnlyRoutes.has(route));
  return exists ? localizedPath(route, language) : language === 'ru' ? '/' : '/en';
};

export const absoluteIndexUrl = (path, origin = 'https://hopscup.tools') => `${origin}${normalizeIndexPath(path) === '/' ? '' : normalizeIndexPath(path)}`;
