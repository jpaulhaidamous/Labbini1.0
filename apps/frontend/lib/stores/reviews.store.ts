import { create } from 'zustand';
import { reviewsApi, Review, CreateReviewData } from '../api/reviews';

interface ReviewsState {
  userReviews: Review[];
  contractReviews: Review[];
  isLoading: boolean;
  error: string | null;

  createReview: (data: CreateReviewData) => Promise<Review>;
  getUserReviews: (userId: string, page?: number, limit?: number) => Promise<void>;
  getContractReviews: (contractId: string) => Promise<void>;
  clearError: () => void;
}

export const useReviewsStore = create<ReviewsState>((set) => ({
  userReviews: [],
  contractReviews: [],
  isLoading: false,
  error: null,

  createReview: async (data: CreateReviewData) => {
    set({ isLoading: true, error: null });
    try {
      const review = await reviewsApi.createReview(data);
      set({ isLoading: false });
      return review;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to submit review',
        isLoading: false,
      });
      throw error;
    }
  },

  getUserReviews: async (userId: string, page?: number, limit?: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await reviewsApi.getUserReviews(userId, page, limit);
      set({ userReviews: data.reviews, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch reviews',
        isLoading: false,
      });
    }
  },

  getContractReviews: async (contractId: string) => {
    set({ isLoading: true, error: null });
    try {
      const reviews = await reviewsApi.getContractReviews(contractId);
      set({ contractReviews: reviews, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch reviews',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
