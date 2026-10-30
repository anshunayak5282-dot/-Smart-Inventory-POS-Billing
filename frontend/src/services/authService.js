import { apiClient } from './api';

export const authService = {
  login: async (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },
  register: async (name, email, password, role) => {
    return apiClient.post('/auth/register', { name, email, password, role });
  },
  getProfile: async () => {
    return apiClient.get('/auth/me');
  }
};
