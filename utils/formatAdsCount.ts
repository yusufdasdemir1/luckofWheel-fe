export const formatAdsCount = (count: number) => {
  return Intl.NumberFormat('en', { notation: 'compact' }).format(count);
};
