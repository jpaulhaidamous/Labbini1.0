import { create } from 'zustand';
import { profilesApi, Profile, UpdateProfileData, SearchProfilesFilters } from '../api/profiles';

interface ProfilesState {
  myProfile: Profile | null;
  publicProfile: Profile | null;
  currentProfile: Profile | null;
  profiles: Profile[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMyProfile: () => Promise<void>;
  updateMyProfile: (data: UpdateProfileData) => Promise<Profile>;
  fetchProfile: (userId: string) => Promise<void>;
  searchProfiles: (filters?: SearchProfilesFilters) => Promise<void>;
  addSkills: (skillIds: string[]) => Promise<void>;
  removeSkill: (skillId: string) => Promise<void>;
  clearError: () => void;
  clearPublicProfile: () => void;
}

export const useProfilesStore = create<ProfilesState>((set, get) => ({
  myProfile: null,
  publicProfile: null,
  currentProfile: null,
  profiles: [],
  isLoading: false,
  error: null,

  fetchMyProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profilesApi.getMyProfile();
      set({ myProfile: profile, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch profile',
        isLoading: false,
      });
    }
  },

  updateMyProfile: async (data: UpdateProfileData) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profilesApi.updateMyProfile(data);
      set({ myProfile: profile, isLoading: false });
      return profile;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update profile',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchProfile: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profilesApi.getProfile(userId);
      set({ publicProfile: profile, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch profile',
        isLoading: false,
      });
    }
  },

  searchProfiles: async (filters?: SearchProfilesFilters) => {
    set({ isLoading: true, error: null });
    try {
      const profiles = await profilesApi.searchProfiles(filters);
      set({ profiles, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to search profiles',
        isLoading: false,
      });
    }
  },

  addSkills: async (skillIds: string[]) => {
    set({ isLoading: true, error: null });
    try {
      await profilesApi.addSkills(skillIds);
      // Refetch profile to get updated skills
      await get().fetchMyProfile();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add skills',
        isLoading: false,
      });
      throw error;
    }
  },

  removeSkill: async (skillId: string) => {
    set({ isLoading: true, error: null });
    try {
      await profilesApi.removeSkill(skillId);
      // Refetch profile to get updated skills
      await get().fetchMyProfile();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to remove skill',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  clearPublicProfile: () => set({ publicProfile: null }),
}));
