import axios from './baseService';

export const login = (email: string, password: string) => {
  return axios
    .post('/company/login', { email, password })
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const register = (data = {}) => {
  return axios
    .post('/company/register', data)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const fetchMe = () => {
  return axios
    .get('/company/me')
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};
