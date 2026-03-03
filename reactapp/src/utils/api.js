import axios from 'axios';

// const API_BASE_URL = 'https://bakend-folder-college-event.onrender.com/api';
const API_BASE_URL = 'https://bakend-folder-college-event.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchEvents = (page = 0, size = 10, category = '') => {
  const params = { page, size };
  if (category) params.category = category;
  return api.get('/events', { params });
};

export const fetchEventById = (eventId) => {
  return api.get(`/events/${eventId}`);
};

export const createEvent = (eventData) => {
  return api.post('/events', eventData);
};

export const updateEvent = (eventId, eventData) => {
  return api.put(`/events/${eventId}`, eventData);
};

export const deleteEvent = (eventId) => {
  return api.delete(`/events/${eventId}`);
};

export const getEventRegistrations = (eventId) => {
  return api.get(`/events/${eventId}/registrations`);
};

export const registerForEvent = (eventId, username) => {
  return api.post(`/events/${eventId}/register?username=${username}`);
};

export const getStudentRegistrations = (username) => {
  return api.get(`/registrations/student/${username}`);
};

export const getDashboardStats = () => {
  return api.get('/dashboard/stats');
};

export const getRecentActivity = () => {
  return api.get('/dashboard/recent-activity');
};

export const getRegistrationTrends = () => {
  return api.get('/dashboard/registration-trends');
};

export const registerUser = (userData) => {
  return api.post('/auth/register', userData);
};

export const loginUser = (credentials) => {
  return api.post('/auth/login', credentials);
};

export default api;