import { SITE_URL, absoluteUrl } from '@/utils/siteUrl';
import type { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: '/',
    // panel, giriş sayfaları ve kişiye özel değerlendirme linkleri aranmasın
    disallow: ['/panel', '/giris-yap', '/kayit-ol', '/*/degerlendir/'],
  },
  sitemap: absoluteUrl('/sitemap.xml'),
  host: SITE_URL,
});

export default robots;
