import { api } from './client';

export interface Profile {
  id: string;
  userId: string;
  displayNameEn?: string;
  displayNameAr?: string;
  bioEn?: string;
  bioAr?: string;
  avatarUrl?: string;
  governorate?: string;
  city?: string;
  hourlyRate?: number;
  jobSuccessScore: number;
  totalEarned: number;
  totalJobsCompleted: number;
  isAvailable: boolean;
  profileVisibility: 'PUBLIC' | 'PRIVATE';
  languages?: string[];
  responseTime?: number;
  skills?: Array<{
    id: string;
    skill: {
      id: string;
      nameEn: string;
      nameAr?: string;
    };
  }>;
}

export interface UpdateProfileData {
  displayNameEn?: string;
  displayNameAr?: string;
  bioEn?: string;
  bioAr?: string;
  avatarUrl?: string;
  governorate?: string;
  city?: string;
  hourlyRate?: number;
  isAvailable?: boolean;
  profileVisibility?: 'PUBLIC' | 'PRIVATE';
  languages?: string[];
}

export interface SearchProfilesFilters {
  categoryId?: string;
  governorate?: string;
  minRate?: number;
  maxRate?: number;
  minSuccessScore?: number;
  isAvailable?: boolean;
  skills?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

export const profilesApi = {
  // Get own profile
  getMyProfile: async () => {
    return api.get<Profile>('/profiles/me');
  },

  // Update own profile
  updateMyProfile: async (data: UpdateProfileData) => {
    return api.put<Profile>('/profiles/me', data);
  },

  // Get public profile
  getProfile: async (userId: string) => {
    return api.get<Profile>(`/profiles/${userId}`);
  },

  // Search profiles
  searchProfiles: async (filters?: SearchProfilesFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    return api.get<Profile[]>(`/profiles/search?${params.toString()}`);
  },

  // Add skills
  addSkills: async (skillIds: string[]) => {
    return api.post('/profiles/me/skills', { skillIds });
  },

  // Remove skill
  removeSkill: async (skillId: string) => {
    return api.delete(`/profiles/me/skills/${skillId}`);
  },

  // Get profile reviews
  getProfileReviews: async (userId: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return api.get(`/profiles/${userId}/reviews?${params.toString()}`);
  },
};
