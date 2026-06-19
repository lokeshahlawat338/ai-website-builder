import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// User API
export const getUserProfile = () => api.get('/api/v1/user/profile');
export const getUserCredits = () => api.get('/api/v1/user/credits');
export const updateUserProfile = (data) => api.patch('/api/v1/user/profile', data);

// Generate API
export const generateWebsite = (prompt) => api.post('/api/v1/generate', { prompt });

// Projects API
export const getProjects = () => api.get('/api/v1/projects');
export const getProject = (id) => api.get(`/api/v1/projects/${id}`);
export const updateProject = (id, data) => api.patch(`/api/v1/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/api/v1/projects/${id}`);
export const regenerateProject = (id, newPrompt) => api.post(`/api/v1/projects/${id}/regenerate`, { newPrompt });
export const refineProject = (id, instruction) => api.post(`/api/v1/projects/${id}/refine`, { instruction });

export default api;