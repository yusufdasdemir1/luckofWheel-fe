import axios from './baseService';

export const fetchStaff = () => {
  return axios
    .get('/company/staff')
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const createStaff = (data: Record<string, unknown> = {}) => {
  return axios
    .post('/company/staff', data)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const updateStaff = (id: number, data: Record<string, unknown> = {}) => {
  return axios
    .patch(`/company/staff/${id}`, data)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const deleteStaff = (id: number) => {
  return axios
    .delete(`/company/staff/${id}`)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

// fotoğraf multipart olarak gider; tarayıcı Content-Type'ı kendisi ayarlar
export const uploadStaffPhoto = (id: number, file: File) => {
  const form = new FormData();
  form.append('photo', file);

  return axios
    .post(`/company/staff/${id}/photo`, form)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const deleteStaffPhoto = (id: number) => {
  return axios
    .delete(`/company/staff/${id}/photo`)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};
