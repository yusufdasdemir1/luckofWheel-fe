import axios from './baseService';

export const fetchReviews = (params: Record<string, string> = {}) => {
  return axios
    .get('/company/reviews', { params })
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const updateReview = (id: number, data = {}) => {
  return axios
    .patch(`/company/reviews/${id}`, data)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};
