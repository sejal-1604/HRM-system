import API from './api';

export const createLeaveRequest = (data) => API.post('/leaves', data);
export const getMyRequests = () => API.get('/leaves/my-requests');
export const getAllRequests = () => API.get('/leaves/all');
export const updateRequestStatus = (id, data) => API.put(`/leaves/${id}`, data);