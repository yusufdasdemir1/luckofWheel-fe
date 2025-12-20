import axios from './baseService';

export const fetchRandevular = () => {
  return axios
    .get('/company/meeting/list')
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const updateRandevu = (id: number, data = {}) => {
  return axios
    .patch(`/company/meetings/cancel/${id}`, data)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const deleteRandevu = (id: number) => {
  return axios
    .delete(`/company/meetings/delete/${id}`)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};
