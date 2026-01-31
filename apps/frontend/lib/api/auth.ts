import { api } from './client';

export interface RegisterData {
  email: string;
  password: string;
  phone: string;
  role: 'CLIENT' | 'FREELANCER';
  displayNameEn: string;
  displayNameAr?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  phone: string | null;
  role: 'CLIENT' | 'FREELANCER' | 'ADMIN';
  verificationLevel: 'LEVEL_0' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3';
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  profile?: Profile;
}

export interface Profile {
  id: string;
  displayNameEn: string | null;
  displayNameAr: string | null;
  bioEn: string | null;
  bioAr: string | null;
  avatarUrl: string | null;
  governorate: string | null;
  city: string | null;
  hourlyRate: string | null;
  jobSuccessScore: number;
  totalEarned: string;
  totalJobsCompleted: number;
  isAvailable: boolean;
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/register', data);
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/login', data);
  },

  logout: async (): Promise<void> => {
    return api.post<void>('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/auth/me');
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/refresh', { refreshToken });
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>(`/auth/verify-email/${token}`);
  },

  sendVerificationCode: async (): Promise<{ success: boolean; message: string; code?: string }> => {
    return api.post<{ success: boolean; message: string; code?: string }>('/auth/send-verification-code');
  },

  verifyPhone: async (code: string): Promise<{ message: string; user: User }> => {
    return api.post<{ message: string; user: User }>('/auth/verify-phone', { code });
  },
};
