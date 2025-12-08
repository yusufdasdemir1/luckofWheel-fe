import axios from './baseService';

export const fetchServices = () => {
  return axios
    .get('/company/services/list')
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const createService = (data: any = {}) => {
  return axios
    .post('/company/services/create', data)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const updateService = (id: number, data: any = {}) => {
  return axios
    .patch(`/company/services/update/${id}`, data)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const deleteService = (id: number) => {
  return axios
    .delete(`/company/services/delete/${id}`)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};
