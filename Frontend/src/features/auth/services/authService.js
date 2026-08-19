import { api } from '../../../lib/api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (companyName, name, email, password) => {
    const response = await api.post('/auth/register', { companyName, name, email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  checkAuth: async () => {
    // Assuming backend validates via refresh token if there's no dedicated profile endpoint
    const response = await api.post('/auth/refresh');
    return response.data;
  },
  
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  }
};
