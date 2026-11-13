import aiContent from './aiContent.json' with { type: 'json' };

export const aiSection = {
  ...aiContent.section,
  intro: { ru: aiContent.section.blocks.ru[0].content.map(part => part.text).join(''), en: aiContent.section.blocks.en[0].content[0].text },
  points: { ru: [], en: [] },
};
const order = ['ai-syntx', 'ai-higgsfield', 'ai-lumean', 'ai-polza', 'ai-omnirouter', 'ai-ghostmetal', 'ai-agentrouter', 'ai-a6api'];
export const aiPages = [...aiContent.services].map(page => ({ ...page, logoFallback: `/${page.id}.png` })).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
export const aiOffers = aiPages.map(page => ({ ...page, logoUrl: page.logo, description: page.editorial.description }));
