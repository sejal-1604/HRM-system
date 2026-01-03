import API from './api';

export const getAllEmployees = () => API.get('/users/employees');
export const getProfile = (id) => API.get(`/users/profile/${id || ''}`);
export const updateProfile = (id, data) => API.put(`/users/profile/${id}`, data);
export const updatePrivateInfo = (id, data) => API.put(`/users/private-info/${id}`, data);
export const updateSalaryInfo = (id, data) => API.put(`/users/salary-info/${id}`, data);