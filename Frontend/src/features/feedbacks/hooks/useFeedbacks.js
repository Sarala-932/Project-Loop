import { useEffect } from 'react';
import { useFeedbackStore } from '../store/feedbackStore';

export const useFeedbacks = () => {
  const {
    feedbacks,
    isLoading,
    error,
    page,
    setPage,
    totalPages,
    totalFeedbacks,
    fetchFeedbacks,
    refreshFeedbacks,
    updateFeedbackInList
  } = useFeedbackStore();

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  return {
    feedbacks,
    isLoading,
    error,
    page,
    setPage,
    totalPages,
    totalFeedbacks,
    refreshFeedbacks,
    updateFeedbackInList
  };
};
