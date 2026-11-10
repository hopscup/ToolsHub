import accountFarmArticle from './accountFarmArticle.json' with { type: 'json' };
import { serviceCategoryRoutes } from './servicePresentation.js';

export { accountFarmArticle };

export const createAccountFarmContent = (offers) => {
  const resolve = ({ serviceId, internal, ...segment }) => {
    if (!serviceId) return segment;
    const offer = offers.find(item => item.id === serviceId);
    if (!offer || (internal && !offer.slug)) throw new Error(`Missing account farm service: ${serviceId}`);
    return { ...segment, href: internal ? `${serviceCategoryRoutes[offer.category]}/${offer.slug}` : offer.url };
  };
  return {
    article: {
      ...accountFarmArticle,
      blocks: accountFarmArticle.blocks.map(block => block.type === 'paragraph'
        ? { ...block, content: block.content.map(resolve) }
        : block),
    },
    checklist: {
      ...accountFarmArticle.checklist,
      sources: accountFarmArticle.checklist.sources.map(source => ({ ...source, links: source.links.map(resolve) })),
    },
  };
};
