import { create } from 'zustand';
import { analyticsService } from '../services/analyticsService';

export const useAnalyticsStore = create((set, get) => ({
  data: null,
  isLoading: false,
  error: null,
  days: 30,
  lastFetchedDays: null, // track which 'days' was last fetched

  setDays: (days) => {
    set({ days });
    // auto-refetch when days changes
    get().fetchAnalytics(days);
  },

  fetchAnalytics: async (days) => {
    const daysToFetch = days ?? get().days;
    const { lastFetchedDays, isLoading } = get();

    // Skip if already loading or same data is already cached
    if (isLoading || lastFetchedDays === daysToFetch) return;

    set({ isLoading: true, error: null });
    try {
      const dashboardData = await analyticsService.getDashboardStats(daysToFetch);
      set({ data: dashboardData, isLoading: false, lastFetchedDays: daysToFetch });
    } catch (err) {
      console.error('Failed to load analytics data:', err);
      set({ error: 'Failed to load dashboard metrics. Please try again later.', isLoading: false });
    }
  },

  refreshAnalytics: async () => {
    // Force refetch (ignore cache)
    const { days } = get();
    set({ lastFetchedDays: null });
    get().fetchAnalytics(days);
  },
}));
