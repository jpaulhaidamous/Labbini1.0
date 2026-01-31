import { create } from 'zustand';
import { proposalsApi, Proposal, CreateProposalData, UpdateProposalStatusData } from '../api/proposals';

interface ProposalsState {
  myProposals: Proposal[];
  jobProposals: Proposal[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMyProposals: (status?: string) => Promise<void>;
  fetchJobProposals: (jobId: string) => Promise<void>;
  createProposal: (data: CreateProposalData) => Promise<Proposal>;
  updateProposalStatus: (id: string, data: UpdateProposalStatusData) => Promise<Proposal>;
  withdrawProposal: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useProposalsStore = create<ProposalsState>((set, get) => ({
  myProposals: [],
  jobProposals: [],
  isLoading: false,
  error: null,

  fetchMyProposals: async (status?: string) => {
    set({ isLoading: true, error: null });
    try {
      const proposals = await proposalsApi.getMyProposals(status);
      set({ myProposals: proposals, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch proposals',
        isLoading: false,
      });
    }
  },

  fetchJobProposals: async (jobId: string) => {
    set({ isLoading: true, error: null });
    try {
      const proposals = await proposalsApi.getJobProposals(jobId);
      set({ jobProposals: proposals, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch job proposals',
        isLoading: false,
      });
    }
  },

  createProposal: async (data: CreateProposalData) => {
    set({ isLoading: true, error: null });
    try {
      const proposal = await proposalsApi.createProposal(data);
      set((state) => ({
        myProposals: [proposal, ...state.myProposals],
        isLoading: false,
      }));
      return proposal;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create proposal',
        isLoading: false,
      });
      throw error;
    }
  },

  updateProposalStatus: async (id: string, data: UpdateProposalStatusData) => {
    set({ isLoading: true, error: null });
    try {
      const proposal = await proposalsApi.updateProposalStatus(id, data);
      set((state) => ({
        jobProposals: state.jobProposals.map((p) => (p.id === id ? proposal : p)),
        isLoading: false,
      }));
      return proposal;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update proposal status',
        isLoading: false,
      });
      throw error;
    }
  },

  withdrawProposal: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await proposalsApi.withdrawProposal(id);
      set((state) => ({
        myProposals: state.myProposals.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to withdraw proposal',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
