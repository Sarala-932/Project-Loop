import { api } from '../../../lib/api';

export const feedbackService = {
  getAllFeedbacks: async (params = {}) => {
    const response = await api.get('/feedbacks', { params });
    return response.data;
  },

  getFeedbackById: async (id) => {
    const response = await api.get(`/feedbacks/${id}`);
    return response.data;
  },

  createFeedback: async (feedbackData) => {
    const response = await api.post('/feedbacks', feedbackData);
    return response.data;
  },

  updateFeedback: async (id, updateData) => {
    const response = await api.put(`/feedbacks/${id}`, updateData);
    return response.data;
  },

  deleteFeedback: async (id) => {
    const response = await api.delete(`/feedbacks/${id}`);
    return response.data;
  },

  reclassifyFeedback: async (id) => {
    const response = await api.post(`/feedbacks/${id}/reclassify`);
    return response.data;
  },

  uploadFeedbacks: async (formData) => {
    // Override the default application/json header for file uploads
    const response = await api.post('/feedbacks/upload', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
  }
};
