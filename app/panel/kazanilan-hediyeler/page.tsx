import KazanilanHediyelerContainer from '@/containers/KazanilanHediyelerContainer';
import { fetchSpinHistory } from '@/services/hediyeCarkiService';
import React from 'react';

const Page = async () => {
  const [err, data] = await fetchSpinHistory();

  const listArray = Array.isArray(data) ? data : [];

  return <KazanilanHediyelerContainer list={listArray} />;
};

export default Page;
