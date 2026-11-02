import CalisanlarContainer from '@/containers/CalisanlarContainer';
import { fetchStaff } from '@/services/staffService';
import React from 'react';

const Page = async () => {
  const [, data] = await fetchStaff();
  const list = Array.isArray(data) ? data : [];

  return <CalisanlarContainer list={list} />;
};

export default Page;
