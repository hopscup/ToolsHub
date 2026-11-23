export const categoryFilterCount = (offers, category, filter = 'None') => offers.filter(offer => {
  if (offer.category !== category) return false;
  if (filter === 'None') return category !== 'Crypto' || !['AML','Wallet'].includes(offer.subCategory);
  return offer.subCategory === filter || offer.subCategories?.includes(filter);
}).length;
