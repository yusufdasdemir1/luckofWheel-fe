import HomePageContainer from '@/containers/HomePageContainer';
import { fetchPublicCompanies } from '@/services/publicService';
import React from 'react';

export const dynamic = 'force-dynamic';

export const generateMetadata = () => {
  return {
    title: 'Kuafor - Ana Sayfa',
    description: 'Kuafor Ana Sayfa',
  };
};

const Home = async () => {
  const [err, result] = await fetchPublicCompanies();

  console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxx', { err, result });

  return <HomePageContainer list={!err ? result : []} />;
};

export default Home;
