import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// We export a function to set the token
// This gets called from components after Clerk loads
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// API functions
export const getUserProfile = () => api.get('/api/v1/user/profile');
export const getUserCredits = () => api.get('/api/v1/user/credits');
export const updateUserProfile = (data) => api.patch('/api/v1/user/profile', data);

export default api;