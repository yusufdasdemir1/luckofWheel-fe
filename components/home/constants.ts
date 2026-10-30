export const SALON_APPLY_HREF = '/kayit-ol';
export const HERO_VIDEO_SRC = '/videos/hero.mp4';

export const PRIZES = [
  '%10 İndirim',
  'Ücretsiz Fön',
  'Bakım Hediyesi',
  'Kaş Tasarımı',
  '%20 İndirim',
  'Sakal Düzenleme',
  'Sürpriz Hediye',
  '%15 İndirim',
];

const heroColors = [
  '#E2492F',
  '#F2B33D',
  '#16131A',
  '#FFFFFF',
  '#E2492F',
  '#F2B33D',
  '#16131A',
  '#FFFFFF',
];

const demoColors = [
  '#F2B33D',
  '#FFFFFF',
  '#16131A',
  '#FFF3D6',
  '#F2B33D',
  '#FFFFFF',
  '#16131A',
  '#FFF3D6',
];

const buildSlices = (colors: string[]) =>
  PRIZES.map((title, i) => ({
    title,
    chance: 100 / PRIZES.length,
    description: '',
    is_active: true,
    gift_color: colors[i],
  }));

export const HERO_SLICES = buildSlices(heroColors);
export const DEMO_SLICES = buildSlices(demoColors);
