import { api } from './client';

export interface Review {
  id: string;
  contractId: string;
  reviewerId: string;
  revieweeId: string;
  overallRating: number;
  qualityRating?: number;
  communicationRating?: number;
  timelinessRating?: number;
  professionalismRating?: number;
  wouldRecommend: boolean;
  publicReview?: string;
  privateFeedback?: string;
  createdAt: string;
  reviewer?: {
    id: string;
    email: string;
    profile?: {
      displayNameEn?: string;
      displayNameAr?: string;
      avatarUrl?: string;
    };
  };
  contract?: {
    id: string;
    job?: {
      titleEn: string;
      titleAr?: string;
    };
  };
}

export interface CreateReviewData {
  contractId: string;
  overallRating: number;
  qualityRating?: number;
  communicationRating?: number;
  timelinessRating?: number;
  professionalismRating?: number;
  wouldRecommend: boolean;
  publicReview?: string;
  privateFeedback?: string;
}

export const reviewsApi = {
  // Create review
  createReview: async (data: CreateReviewData) => {
    return api.post<Review>('/reviews', data);
  },

  // Get user reviews
  getUserReviews: async (userId: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return api.get<{
      reviews: Review[];
      total: number;
      page: number;
      limit: number;
    }>(`/reviews/user/${userId}?${params.toString()}`);
  },

  // Get contract reviews
  getContractReviews: async (contractId: string) => {
    return api.get<Review[]>(`/reviews/contract/${contractId}`);
  },
};
