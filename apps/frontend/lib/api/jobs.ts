import { api } from './client';

export interface Job {
  id: string;
  titleEn: string;
  titleAr?: string;
  descriptionEn: string;
  descriptionAr?: string;
  categoryId: string;
  clientId: string;
  jobType: 'FIXED' | 'HOURLY' | 'QUICK';
  budgetType: 'FIXED' | 'RANGE' | 'HOURLY';
  budgetFixed?: number;
  budgetMin?: number;
  budgetMax?: number;
  budgetHourly?: number;
  locationType: 'REMOTE' | 'ONSITE' | 'HYBRID';
  governorate?: string;
  city?: string;
  status: 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  visibility: 'PUBLIC' | 'PRIVATE' | 'INVITE';
  isUrgent: boolean;
  proposalCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    nameEn: string;
    nameAr?: string;
  };
  client?: {
    id: string;
    email: string;
    profile?: {
      displayNameEn?: string;
      displayNameAr?: string;
      avatarUrl?: string;
    };
  };
}

export interface CreateJobData {
  titleEn: string;
  titleAr?: string;
  descriptionEn: string;
  descriptionAr?: string;
  categoryId: string;
  jobType: 'FIXED' | 'HOURLY' | 'QUICK';
  budgetType: 'FIXED' | 'RANGE' | 'HOURLY';
  budgetFixed?: number;
  budgetMin?: number;
  budgetMax?: number;
  budgetHourly?: number;
  locationType: 'REMOTE' | 'ONSITE' | 'HYBRID';
  governorate?: string;
  city?: string;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'INVITE';
  isUrgent?: boolean;
}

export interface UpdateJobData extends Partial<CreateJobData> {
  status?: 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface JobFilters {
  categoryId?: string;
  jobType?: string;
  budgetMin?: number;
  budgetMax?: number;
  locationType?: string;
  governorate?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const jobsApi = {
  // Get all jobs with filters
  getJobs: async (filters?: JobFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return api.get<Job[]>(`/jobs?${params.toString()}`);
  },

  // Get user's jobs
  getMyJobs: async () => {
    return api.get<Job[]>('/jobs/my-jobs');
  },

  // Get single job
  getJob: async (id: string) => {
    return api.get<Job>(`/jobs/${id}`);
  },

  // Create job
  createJob: async (data: CreateJobData) => {
    return api.post<Job>('/jobs', data);
  },

  // Update job
  updateJob: async (id: string, data: UpdateJobData) => {
    return api.put<Job>(`/jobs/${id}`, data);
  },

  // Delete job
  deleteJob: async (id: string) => {
    return api.delete(`/jobs/${id}`);
  },
};
