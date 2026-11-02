import axios from './baseService';

export const fetchPublicCompanies = (
  params: Record<string, string | number> = {}
) => {
  return axios
    .get('/public/companies', { params })
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

// wheel_mode=after: çark, randevu oluştuktan sonra o randevuya bağlı çevrilir
export const spinByCompanySlug = (slug: string, data = {}) => {
  return axios
    .post(`/public/spin/${slug}`, data)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const fetchOccupiedSlotsByCompanySlug = (
  slug: string,
  staffId?: number | null
) => {
  return axios
    .get(`/public/occupied-meetings/${slug}`, {
      params: staffId ? { staff_id: staffId } : {},
    })
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const createSalonApplication = (data = {}) => {
  return axios
    .post('/public/salon-application', data)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const fetchStaffByCompanySlug = (slug: string) => {
  return axios
    .get(`/public/staff/${slug}`)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const fetchWorkingHoursByCompanySlug = (slug: string) => {
  return axios
    .get(`/public/working-hours/${slug}`)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

// maildeki "randevuyu değerlendir" linki: token randevuya özeldir
export const fetchReviewByToken = (token: string) => {
  return axios
    .get(`/public/review/${token}`)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data ?? { error: 'not_found' }, null]);
};

export const createReviewByToken = (token: string, data = {}) => {
  return axios
    .post(`/public/review/${token}`, data)
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const fetchReviewsByCompanySlug = (
  slug: string,
  params: Record<string, string | number> = {}
) => {
  return axios
    .get(`/public/reviews/${slug}`, { params })
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};
