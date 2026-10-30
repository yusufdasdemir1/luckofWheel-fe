import HomePageContainer from '@/containers/HomePageContainer';
import { fetchPublicCompanies } from '@/services/publicService';
import React from 'react';

export const dynamic = 'force-dynamic';

export const generateMetadata = () => {
  return {
    title: 'Çevir Kazan 360 — Çarkı çevir, hediyeni kazan',
    description:
      'Favori salonunun çarkını çevir, indirim veya ücretsiz hizmet kazan, randevunu oluştur. Kuaförler için çark kampanya ve randevu platformu.',
  };
};

const Home = async () => {
  const [err, result] = await fetchPublicCompanies();

  return <HomePageContainer list={!err && Array.isArray(result) ? result : []} />;
};

export default Home;
