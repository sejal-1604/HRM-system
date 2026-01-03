import API from './api';

export const checkIn = () => API.post('/attendance/checkin');
export const checkOut = () => API.post('/attendance/checkout');
export const getUserAttendance = (id, startDate, endDate) => 
  API.get(`/attendance/user/${id || ''}`, { params: { startDate, endDate } });
export const getAllAttendance = (date) => API.get('/attendance/all', { params: { date } });