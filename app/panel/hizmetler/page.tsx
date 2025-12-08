import ServicesContainer from '@/containers/ServicesContainer';
import { fetchServices } from '@/services/serviceService';
import React from 'react';

const Services = async () => {
  const [err, data] = await fetchServices();
  const listArray = Array.isArray(data) ? data : [];

  return <ServicesContainer list={listArray} />;
};

export default Services;
