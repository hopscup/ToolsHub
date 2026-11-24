export const orderAntidetectAllOffers = offers => {
  const followingIds = ['ant-linken-sphere', 'ant-shardx'];
  const following = followingIds.map(id => offers.find(offer => offer.id === id)).filter(Boolean);
  if (!offers.some(offer => offer.id === 'ant-vision') || following.length !== followingIds.length) return offers;
  const ordered = offers.filter(offer => !followingIds.includes(offer.id));
  ordered.splice(ordered.findIndex(offer => offer.id === 'ant-vision') + 1, 0, ...following);
  return ordered;
};
