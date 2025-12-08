import axios from './baseService';

export const updateCompanyInfos = (slug: string, data = {}) => {
  return axios
    .patch(`/companies/${slug}`, data)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const fetchCompanyBySlug = (slug: string) => {
  return axios
    .get(`/public/companies/${slug}`)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};
