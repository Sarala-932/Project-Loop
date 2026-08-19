import { api } from '../../../lib/api';

export const askLoopService = {
  askQuestion: async (question) => {
    const response = await api.post('/analytics/ask', { question });
    return response.data;
  }
};
