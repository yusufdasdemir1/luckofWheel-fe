// Sitenin herkese açık adresi: canonical, Open Graph, sitemap ve JSON-LD için.
// NEXT_PUBLIC_SITE_URL build sırasında gömülür (prod: https://cevirkazan360.com).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
).replace(/\/+$/, '');

export const SITE_NAME = 'Çevir Kazan 360';

export const absoluteUrl = (path = '/') =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

// Arama sonuçlarında ~160 karakterden sonrası kesilir
export const truncate = (text: string, max = 160) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
};
