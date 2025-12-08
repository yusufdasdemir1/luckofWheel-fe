import HediyeCarkiContainer from '@/containers/HediyeCarkiContainer';
import { fetchHediyeCarki } from '@/services/hediyeCarkiService';
import React from 'react';

const Page = async () => {
  const [err, data] = await fetchHediyeCarki();

  const listArray = Array.isArray(data) ? data : [];

  return <HediyeCarkiContainer list={listArray} />;
};

export default Page;
