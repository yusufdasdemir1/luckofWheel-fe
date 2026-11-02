import axios from './baseService';

export const fetchRandevular = (params: Record<string, string> = {}) => {
  return axios
    .get('/company/meeting/list', { params })
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

export const fetchMeetingStatistics = () => {
  return axios
    .get('/meetings/statistics')
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const bulkDeleteRandevu = (ids: number[]) => {
  return axios
    .post('/company/meetings/bulk-delete', { ids })
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};
