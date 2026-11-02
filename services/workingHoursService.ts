import IWorkingHour from '@/types/IWorkingHour';
import axios from './baseService';

export const fetchWorkingHours = () => {
  return axios
    .get('/company/working-hours')
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};

export const saveWorkingHours = (hours: IWorkingHour[]) => {
  return axios
    .put('/company/working-hours', { hours })
    .then((res) => [null, res.data])
    .catch((error) => [error?.response?.data, null]);
};
