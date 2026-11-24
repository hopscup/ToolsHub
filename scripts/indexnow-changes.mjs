import {execFileSync} from 'node:child_process';
import {createGitDataSnapshot} from './git-data-snapshot.mjs';
import {loadOffers} from './load-offers.mjs';

const dataEntry = `
export {guidePages} from './src/data/guidePages.js';
export {guideCatalog} from './src/data/guideCatalog.js';
export {seoLandingPages} from './src/data/seoLandingPages.js';
export {pageHeadings} from './src/data/pageHeadings.js';
export {indexablePaths} from './src/data/indexPolicy.js';
export * as presentation from './src/data/servicePresentation.js';
export * as partner from './src/data/partnerCardRefresh.js';
export * as contextual from './src/data/contextualGuideLinks.js';
export * as fallback from './src/data/articleFallbackContent.js';
export * as proxyGuide from './src/data/proxyGuideContent.js';
export * as mobileIp from './src/data/mobileIpGuideContent.js';
export {vpnTerms} from './src/data/vpnDetails.js';
export {aiPages} from './src/data/aiPages.js';
export {antidetectPages} from './src/data/antidetectPages.js';
export {accountShopPages} from './src/data/accountShopPages.js';
export {foreignCardPages} from './src/data/foreignCardPages.js';
export {cryptoExchangePages} from './src/data/cryptoExchangePages.js';
export {smsPages} from './src/data/smsPages.js';
export {steamPages} from './src/data/steamPages.js';
export {vpsPages} from './src/data/vpsPages.js';
export {socialPages} from './src/data/socialPages.js';
export {newVpnPages} from './src/data/vpnUpdates.js';
`;

export const siteModelsAt = async (revision, root = process.cwd()) => {
  const snapshot = createGitDataSnapshot(revision, root);
  const offers = await loadOffers({snapshot, extraNames: ['HOME_SEO', 'SECTION_SEO', 'RUNTIME_SEO_TRANSLATIONS'], shellSignature: true});
  const data = await snapshot.bundle(dataEntry);
  const models = new Map();
  const {OFFERS, CATEGORY_ROUTES} = offers;
  const pages = ['aiPages', 'antidetectPages', 'accountShopPages', 'foreignCardPages', 'cryptoExchangePages', 'smsPages', 'steamPages', 'vpsPages', 'socialPages', 'newVpnPages'].flatMap(key => data[key]);
  const plainOffer = ({editorial, ...facts}) => facts;
  for (const pathname of data.indexablePaths) {
    const language = /^\/en(?:\/|$)/.test(pathname) ? 'en' : 'ru';
    const route = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
    const offer = OFFERS.find(item => item.slug && CATEGORY_ROUTES[item.category] + '/' + item.slug === route);
    const guide = data.guidePages.find(item => '/guides/' + item.slug === route);
    let content;
    if (guide) {
      const serialized = JSON.stringify(guide);
      const references = OFFERS.filter(item => item.category !== 'Guides' && serialized.includes(JSON.stringify(item.id))).map(item => ({id: item.id, url: item.url, name: item.name, details: item.details, terms: data.vpnTerms[item.slug]}));
      content = {guide, references, fallback: data.fallback.articleFallbackByRoute?.[route], mobileIp: guide.id === 'guide-mobile-ip' ? data.mobileIp : undefined};
    } else if (offer) {
      const sections = data.presentation.getServiceEditorialSections(offer, language).map(section => ({...section, items: section.items.map(text => data.presentation.splitServiceText(text, offer, language))}));
      content = {
        offer, sections, metadata: data.partner.partnerMetadataById[offer.id], page: pages.find(item => item.id === offer.id),
        terms: data.vpnTerms[offer.slug], links: data.contextual.getServiceContextualGuideLinks(offer),
        facts: data.presentation.getServiceFacts(offer, language),
        alternatives: data.presentation.getServiceAlternatives(offer, OFFERS).map(plainOffer),
      };
    } else {
      const category = Object.entries(CATEGORY_ROUTES).find(([, value]) => value === route)?.[0];
      content = {
        home: route === '/' ? offers.HOME_SEO : undefined,
        section: offers.SECTION_SEO[category], translations: offers.RUNTIME_SEO_TRANSLATIONS[category],
        catalogue: OFFERS.filter(item => item.category === category).map(plainOffer),
        guides: route === '/guides' ? data.guideCatalog : undefined,
        landing: data.seoLandingPages.find(page => page.route === route),
        proxyGuide: route === '/proxy-vpn/luchshie-proksi' ? data.proxyGuide : undefined,
        fallback: data.fallback.articleFallbackByRoute?.[route],
        links: data.contextual.getSectionContextualGuideLinks(route),
      };
    }
    models.set(pathname, JSON.stringify({content, heading: data.pageHeadings[route]}));
  }
  return {commit: snapshot.commit, models, shell: offers.appShellSignature};
};

export const changedPathsBetween = (before, after, files = []) => {
  const shared = before.shell !== after.shell || files.some(file =>
    /^src\/components\//.test(file) || /^src\/lib\//.test(file)
    || /\.(?:css|html)$/.test(file) || ['scripts/postbuild-seo.mjs', 'vite.config.ts', 'src/main.tsx'].includes(file));
  const assets = files.filter(file => file.startsWith('public/')).map(file => file.slice('public'.length));
  const paths = [...after.models].filter(([route, content]) => shared
    || (['/', '/en'].includes(route) && files.includes('src/data/homePage.js'))
    || before.models.get(route) !== content
    || assets.some(asset => content.includes(asset))).map(([route]) => route);
  return {paths, sharedRenderChange: shared};
};

export const lastCommitChanges = async ({root = process.cwd(), revision = 'HEAD'} = {}) => {
  const git = args => execFileSync('git', args, {cwd: root, encoding: 'utf8'}).trim();
  const commit = git(['rev-parse', '--verify', revision + '^{commit}']);
  let parent;
  try { parent = git(['rev-parse', '--verify', commit + '^']); }
  catch { throw Error('Cannot read the parent commit. Fetch full Git history or use --all.'); }
  const files = git(['diff', '--name-only', parent, commit]).split('\n').filter(Boolean);
  const before = await siteModelsAt(parent, root);
  const after = await siteModelsAt(commit, root);
  return {commit, parent, files, ...changedPathsBetween(before, after, files)};
};
