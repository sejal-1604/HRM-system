import API from './api';

export const signup = (data) => API.post('/auth/signup', data);
export const signin = (data) => API.post('/auth/signin', data);
export const logout = () => localStorage.removeItem('token');
export const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');
export const isAuthenticated = () => !!localStorage.getItem('token');