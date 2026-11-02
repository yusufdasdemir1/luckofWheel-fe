export const SALON_APPLY_HREF = '/salon-basvuru';
// backend'in public/images altındaki dosya yolu (imageUrl ile çözülür)
export const HERO_VIDEO_WEBM = 'videos/hero.webm';
export const HERO_VIDEO_FILE = 'videos/hero.mp4'; // webm oynatılamazsa yedek

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
  '#8E1330',
  '#C9A35B',
  '#560E22',
  '#FFFFFF',
  '#8E1330',
  '#C9A35B',
  '#560E22',
  '#FFFFFF',
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
// canlı deneme çarkı hero ile aynı paleti kullanır
export const DEMO_SLICES = buildSlices(heroColors);
