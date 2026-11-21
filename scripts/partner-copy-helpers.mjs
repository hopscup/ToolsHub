import {normalizeServiceText} from '../src/data/servicePresentation.js';

export const normalizeCopy = value => Array.isArray(value) ? value.map(normalizeCopy) : normalizeServiceText(value);

export const withoutEditorialParagraphBreaks = offer => {
  if (!offer.editorial) return offer;
  const editorial = {...offer.editorial};
  for (const key of ['description', 'verdict']) if (editorial[key]) {
    editorial[key] = Object.fromEntries(Object.entries(editorial[key]).map(([language, text]) => [language, text.replace(/\r?\n\s*\r?\n/g, ' ')]));
  }
  return {...offer, editorial};
};

export const staticServiceText = html => normalizeServiceText(html
  .replace(/<\/(?:p|li|h[1-6]|div|section|dd|dt)>/gi, ' ')
  .replace(/<[^>]*>/g, ''));
