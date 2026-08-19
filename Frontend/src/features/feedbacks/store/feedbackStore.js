  import { create } from 'zustand';
import { feedbackService } from '../services/feedbackService';

export const useFeedbackStore = create((set, get) => ({
  feedbacks: [],
  isLoading: false,
  error: null,
  page: 1,
  totalPages: 1,
  totalFeedbacks: 0,
  lastFetchedPage: null,

  setPage: (page) => {
    set({ page });
    get().fetchFeedbacks(page);
  },

  fetchFeedbacks: async (pageParam) => {
    const pageToFetch = pageParam ?? get().page;
    const { lastFetchedPage, isLoading } = get();

    if (isLoading || lastFetchedPage === pageToFetch) return;

    set({ isLoading: true, error: null });
    try {
      const data = await feedbackService.getAllFeedbacks({ page: pageToFetch, limit: 10 });
      
      let extractedFeedbacks = [];
      if (Array.isArray(data)) extractedFeedbacks = data;
      else if (data && Array.isArray(data.data)) extractedFeedbacks = data.data;
      else if (data && Array.isArray(data.feedbacks)) extractedFeedbacks = data.feedbacks;
      else if (data && data.success && Array.isArray(data.data?.feedbacks)) extractedFeedbacks = data.data.feedbacks;

      let totalPages = 1;
      let totalFeedbacks = 0;
      if (data?.pagination) {
        totalPages = data.pagination.pages || 1;
        totalFeedbacks = data.pagination.total || 0;
      }

      set({
        feedbacks: extractedFeedbacks,
        totalPages,
        totalFeedbacks,
        isLoading: false,
        lastFetchedPage: pageToFetch
      });
    } catch (err) {
      console.error("Failed to fetch feedbacks:", err);
      set({ error: "Failed to load feedbacks. Please try again later.", isLoading: false });
    }
  },

  refreshFeedbacks: async () => {
    const { page } = get();
    set({ lastFetchedPage: null });
    get().fetchFeedbacks(page);
  },

  updateFeedbackInList: (id, updatedData) => {
    set((state) => ({
      feedbacks: state.feedbacks.map((fb) => 
        (fb.id === id || fb._id === id) ? { ...fb, ...updatedData } : fb
      )
    }));
  }
}));
