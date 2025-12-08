import axios from './baseService';

export const fetchPublicCompanies = () => {
  return axios
    .get('/public/companies')
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const fetchGiftsByCompanySlug = (slug: string) => {
  return axios
    .get(`/public/gifts/${slug}`)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const registerByCompanySlug = (slug: string, data = {}) => {
  return axios
    .post(`/public/register/${slug}`, data)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const fetchServicesByCompanySlug = (slug: string) => {
  return axios
    .get(`/public/services/${slug}`)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const createMeeting = (slug: string, data = {}) => {
  return axios
    .post(`/public/meeting/create/${slug}`, data)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};
