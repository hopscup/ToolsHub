import {catalogues, services, guides, loadSearch} from 'virtual:client-loaders';
import {createServiceContentCache} from './serviceContentCache.js';

let content: any;
export const clientLanguage = () => location.pathname.match(/^\/(en|es|zh|ko)(?:\/|$)/)?.[1] || 'ru';
export async function prepareClientContent() {
  content = (await catalogues[clientLanguage()]()).default;
  const slug = location.pathname.match(/\/guides\/([^/]+)\/?$/)?.[1];
  if (slug && guides[slug]) {
    const metadata = (await guides[slug]()).default;
    Object.assign(content.modules.guidePages.guidePages.find(page => page.slug === slug),metadata);
  }
}
export function getClientContent() {
  if (!content) throw new Error('Client catalogue was not prepared');
  return content;
}
const serviceContent = createServiceContentCache(async (key: string) => {
  const load = services[key];
  if (!load) throw new Error(`Unknown service: ${key}`);
  const offer = (await load()).default;
  if (offer.__seo) content.constants.SERVICE_PAGE_SEO_BY_ID[offer.id] = offer.__seo;
  return offer;
});
export const getCachedServiceContent = (id: string, language: string) => serviceContent.get(`${language}/${id}`);
export function loadServiceContent(id: string, language: string) {
  return serviceContent.load(`${language}/${id}`);
}
export async function loadSearchContent(): Promise<Record<string, string>> {
  return (await loadSearch()).default;
}
