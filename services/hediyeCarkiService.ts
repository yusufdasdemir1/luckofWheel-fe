import axios from './baseService';

export const fetchHediyeCarki = () => {
  return axios
    .get('/company/gifts/list')
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const createHediyeCarki = (data: any = {}) => {
  return axios
    .post('/company/gifts/create', data)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const updateHediyeCarki = (id: number, data: any = {}) => {
  return axios
    .patch(`/company/gift/update/${id}`, data)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const deleteHediyeCarki = (id: number) => {
  return axios
    .delete(`/company/gift/delete/${id}`)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const updateGiftStatus = (id: number, data = {}) => {
  return axios
    .patch(`/company/earned-wins/status/${id}`, data)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const fetchSpinHistory = () => {
  return axios
    .get('/spin_history')
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};
