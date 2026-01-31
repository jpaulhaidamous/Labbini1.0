import { api } from './client';

export interface Milestone {
  id: string;
  contractId: string;
  name: string;
  description?: string;
  amount: number;
  dueDate?: string;
  status: 'PENDING' | 'FUNDED' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'DISPUTED';
  fundedAt?: string;
  submittedAt?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  jobId: string;
  proposalId: string;
  clientId: string;
  freelancerId: string;
  contractType: 'FIXED' | 'HOURLY';
  agreedRate: number;
  totalValue: number;
  startDate: string;
  endDate?: string;
  status: 'PENDING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  createdAt: string;
  updatedAt: string;
  job?: {
    id: string;
    titleEn: string;
    titleAr?: string;
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
  freelancer?: {
    id: string;
    email: string;
    profile?: {
      displayNameEn?: string;
      displayNameAr?: string;
      avatarUrl?: string;
    };
  };
  milestones?: Milestone[];
}

export interface CreateContractData {
  proposalId: string;
  milestones?: Array<{
    name: string;
    description?: string;
    amount: number;
    dueDate?: string;
  }>;
}

export interface UpdateContractStatusData {
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
}

export const contractsApi = {
  // Create contract
  createContract: async (data: CreateContractData) => {
    return api.post<Contract>('/contracts', data);
  },

  // Get my contracts
  getMyContracts: async () => {
    return api.get<Contract[]>('/contracts/my-contracts');
  },

  // Get contract by ID
  getContract: async (id: string) => {
    return api.get<Contract>(`/contracts/${id}`);
  },

  // Update contract status
  updateContractStatus: async (id: string, data: UpdateContractStatusData) => {
    return api.put<Contract>(`/contracts/${id}/status`, data);
  },

  // Submit milestone (freelancer)
  submitMilestone: async (milestoneId: string) => {
    return api.put<Milestone>(`/contracts/milestones/${milestoneId}/submit`, {});
  },

  // Approve milestone (client)
  approveMilestone: async (milestoneId: string) => {
    return api.put<Milestone>(`/contracts/milestones/${milestoneId}/approve`, {});
  },
};
