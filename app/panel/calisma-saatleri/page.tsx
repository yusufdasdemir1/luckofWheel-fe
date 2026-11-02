import CalismaSaatleriContainer from '@/containers/CalismaSaatleriContainer';
import { fetchWorkingHours } from '@/services/workingHoursService';
import React from 'react';

const Page = async () => {
  const [, data] = await fetchWorkingHours();
  const list = Array.isArray(data) ? data : [];

  return <CalismaSaatleriContainer list={list} />;
};

export default Page;
