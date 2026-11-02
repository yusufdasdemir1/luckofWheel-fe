import HomePageContainer from '@/containers/HomePageContainer';
import { fetchPublicCompanies } from '@/services/publicService';
import {
  normalizeCompanyPage,
  SALON_PAGE_SIZE,
} from '@/utils/normalizeCompanyPage';
import { SITE_LOGO_URL } from '@/utils/siteLogo';
import { SITE_NAME } from '@/utils/siteUrl';
import React from 'react';

export const dynamic = 'force-dynamic';

const TITLE = 'Çevir Kazan 360 — Çarkı çevir, hediyeni kazan';
const DESCRIPTION =
  'Favori salonunun çarkını çevir, indirim veya ücretsiz hizmet kazan, randevunu oluştur. Güzellik ve bakım salonları için çark kampanya ve randevu platformu.';

export const generateMetadata = () => {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: '/' },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: '/',
      siteName: SITE_NAME,
      locale: 'tr_TR',
      type: 'website' as const,
      images: [SITE_LOGO_URL],
    },
  };
};

const Home = async () => {
  // ilk sayfa sunucuda gelir; sonraki sayfalar ve filtreler tarayıcıdan istenir
  const [err, result] = await fetchPublicCompanies({
    page: 1,
    page_size: SALON_PAGE_SIZE,
  });

  return <HomePageContainer initial={normalizeCompanyPage(err ? null : result)} />;
};

export default Home;
