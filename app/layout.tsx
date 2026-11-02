import type { Metadata, Viewport } from 'next';
import '../assets/globals.css';
import { ReactNode } from 'react';
import { fetchMe } from '@/services/authService';
import AuthProvider from '@/components/AuthProvider';
import AlertProvider from '@/components/AlertProvider';
import { GoogleAnalytics } from '@next/third-parties/google';
import { SITE_NAME, SITE_URL } from '@/utils/siteUrl';

export const generateMetadata = (): Metadata => {
  return {
    // canonical ve Open Graph adreslerini mutlak yapar
    metadataBase: new URL(SITE_URL),
    title: 'Kuafor Randevu ve Hizmet Platformu',
    description:
      'Kuafor, güzellik salonları ve hizmet sağlayıcıları için randevu ve hizmet yönetim platformu.',
    openGraph: {
      siteName: SITE_NAME,
      locale: 'tr_TR',
      type: 'website',
    },
  };
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function ({ children }: { children: ReactNode }) {
  const [meErr, me] = await fetchMe();

  return (
    <html lang="tr">
      <body className={`antialiased`}>
        <AuthProvider user={meErr ? undefined : me} />
        {children}
        <AlertProvider />
        <GoogleAnalytics gaId="G-5YEP36RP00" />
      </body>
    </html>
  );
}
