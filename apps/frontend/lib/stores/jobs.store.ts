import { create } from 'zustand';
import { jobsApi, Job, CreateJobData, UpdateJobData, JobFilters } from '../api/jobs';

interface JobsState {
  jobs: Job[];
  currentJob: Job | null;
  myJobs: Job[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchJobs: (filters?: JobFilters) => Promise<void>;
  fetchMyJobs: () => Promise<void>;
  fetchJob: (id: string) => Promise<void>;
  createJob: (data: CreateJobData) => Promise<Job>;
  updateJob: (id: string, data: UpdateJobData) => Promise<Job>;
  deleteJob: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentJob: () => void;
}

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  currentJob: null,
  myJobs: [],
  isLoading: false,
  error: null,

  fetchJobs: async (filters?: JobFilters) => {
    set({ isLoading: true, error: null });
    try {
      const jobs = await jobsApi.getJobs(filters);
      set({ jobs, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch jobs',
        isLoading: false,
      });
    }
  },

  fetchMyJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const myJobs = await jobsApi.getMyJobs();
      set({ myJobs, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch your jobs',
        isLoading: false,
      });
    }
  },

  fetchJob: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const job = await jobsApi.getJob(id);
      set({ currentJob: job, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch job',
        isLoading: false,
      });
    }
  },

  createJob: async (data: CreateJobData) => {
    set({ isLoading: true, error: null });
    try {
      const job = await jobsApi.createJob(data);
      set((state) => ({
        myJobs: [job, ...state.myJobs],
        currentJob: job,
        isLoading: false,
      }));
      return job;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create job',
        isLoading: false,
      });
      throw error;
    }
  },

  updateJob: async (id: string, data: UpdateJobData) => {
    set({ isLoading: true, error: null });
    try {
      const job = await jobsApi.updateJob(id, data);
      set((state) => ({
        myJobs: state.myJobs.map((j) => (j.id === id ? job : j)),
        currentJob: state.currentJob?.id === id ? job : state.currentJob,
        isLoading: false,
      }));
      return job;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update job',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteJob: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await jobsApi.deleteJob(id);
      set((state) => ({
        myJobs: state.myJobs.filter((j) => j.id !== id),
        currentJob: state.currentJob?.id === id ? null : state.currentJob,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete job',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentJob: () => set({ currentJob: null }),
}));
