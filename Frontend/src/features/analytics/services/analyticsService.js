import { api } from '../../../lib/api';

export const analyticsService = {
  getDashboardStats: async (days = 30) => {
    const response = await api.get('/analytics/dashboard', { params: { days } });
    return response.data;
  },

  getThemeTrends: async (days = 7) => {
    const response = await api.get('/analytics/trends', { params: { days } });
    return response.data;
  }
};
