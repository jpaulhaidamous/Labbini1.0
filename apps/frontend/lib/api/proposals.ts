import { api } from './client';

export interface Proposal {
  id: string;
  jobId: string;
  freelancerId: string;
  coverLetterEn: string;
  coverLetterAr?: string;
  proposedRate: number;
  proposedDuration: number;
  durationUnit: 'HOURS' | 'DAYS' | 'WEEKS' | 'MONTHS';
  status: 'PENDING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  createdAt: string;
  updatedAt: string;
  job?: {
    id: string;
    titleEn: string;
    titleAr?: string;
    status: string;
  };
  freelancer?: {
    id: string;
    email: string;
    profile?: {
      displayNameEn?: string;
      displayNameAr?: string;
      avatarUrl?: string;
      hourlyRate?: number;
      jobSuccessScore: number;
      totalJobsCompleted: number;
    };
  };
}

export interface CreateProposalData {
  jobId: string;
  coverLetterEn: string;
  coverLetterAr?: string;
  proposedRate: number;
  proposedDuration: number;
  durationUnit: 'HOURS' | 'DAYS' | 'WEEKS' | 'MONTHS';
}

export interface UpdateProposalStatusData {
  status: 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';
}

export const proposalsApi = {
  // Submit proposal (freelancer)
  createProposal: async (data: CreateProposalData) => {
    return api.post<Proposal>('/proposals', data);
  },

  // Get my proposals (freelancer)
  getMyProposals: async (status?: string) => {
    const params = status ? `?status=${status}` : '';
    return api.get<Proposal[]>(`/proposals/my-proposals${params}`);
  },

  // Get job proposals (client)
  getJobProposals: async (jobId: string) => {
    return api.get<Proposal[]>(`/proposals/job/${jobId}`);
  },

  // Update proposal status (client)
  updateProposalStatus: async (id: string, data: UpdateProposalStatusData) => {
    return api.put<Proposal>(`/proposals/${id}/status`, data);
  },

  // Withdraw proposal (freelancer)
  withdrawProposal: async (id: string) => {
    return api.delete(`/proposals/${id}`);
  },
};
