import RandevularContainer from '@/containers/RandevularContainer';
import { fetchRandevular } from '@/services/randevuService';
import React from 'react';

const Page = async () => {
  const [err, data] = await fetchRandevular();

  const listArray = Array.isArray(data) ? data : [];

  return <RandevularContainer list={listArray} />;
};

export default Page;
