export const categoryFilterCount = (offers, category, filter = 'None') => offers.filter(offer => {
  if (offer.category !== category) return false;
  if (filter === 'None') return category !== 'Crypto' || !['AML','Wallet'].includes(offer.subCategory);
  return offer.subCategory === filter || offer.subCategories?.includes(filter);
}).length;

export const groupCatalogOffers = (offers, filters) => {
  const groups = new Map(filters.map(filter => [filter, []]));
  for (const offer of offers) {
    const filter = groups.has(offer.subCategory) ? offer.subCategory : filters.find(value => offer.subCategories?.includes(value)) || 'None';
    if (!groups.has(filter)) groups.set(filter, []);
    groups.get(filter).push(offer);
  }
  return [...groups].filter(([, items]) => items.length).map(([id, items]) => ({id, offers: items}));
};

export const shouldGroupCatalogOffers = (category, filter, query, isHome = false) => category === 'Proxy' && !isHome && filter === 'None' && !query.trim();
