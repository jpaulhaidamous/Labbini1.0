import { create } from 'zustand';
import { contractsApi, Contract, CreateContractData, UpdateContractStatusData } from '../api/contracts';

interface ContractsState {
  contracts: Contract[];
  currentContract: Contract | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMyContracts: () => Promise<void>;
  fetchContract: (id: string) => Promise<void>;
  createContract: (data: CreateContractData) => Promise<Contract>;
  updateContractStatus: (id: string, data: UpdateContractStatusData) => Promise<Contract>;
  submitMilestone: (milestoneId: string) => Promise<void>;
  approveMilestone: (milestoneId: string) => Promise<void>;
  clearError: () => void;
  clearCurrentContract: () => void;
}

export const useContractsStore = create<ContractsState>((set, get) => ({
  contracts: [],
  currentContract: null,
  isLoading: false,
  error: null,

  fetchMyContracts: async () => {
    set({ isLoading: true, error: null });
    try {
      const contracts = await contractsApi.getMyContracts();
      set({ contracts, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch contracts',
        isLoading: false,
      });
    }
  },

  fetchContract: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const contract = await contractsApi.getContract(id);
      set({ currentContract: contract, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch contract',
        isLoading: false,
      });
    }
  },

  createContract: async (data: CreateContractData) => {
    set({ isLoading: true, error: null });
    try {
      const contract = await contractsApi.createContract(data);
      set((state) => ({
        contracts: [contract, ...state.contracts],
        currentContract: contract,
        isLoading: false,
      }));
      return contract;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create contract',
        isLoading: false,
      });
      throw error;
    }
  },

  updateContractStatus: async (id: string, data: UpdateContractStatusData) => {
    set({ isLoading: true, error: null });
    try {
      const contract = await contractsApi.updateContractStatus(id, data);
      set((state) => ({
        contracts: state.contracts.map((c) => (c.id === id ? contract : c)),
        currentContract: state.currentContract?.id === id ? contract : state.currentContract,
        isLoading: false,
      }));
      return contract;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update contract status',
        isLoading: false,
      });
      throw error;
    }
  },

  submitMilestone: async (milestoneId: string) => {
    set({ isLoading: true, error: null });
    try {
      await contractsApi.submitMilestone(milestoneId);
      // Refetch current contract to update milestone status
      const currentId = get().currentContract?.id;
      if (currentId) {
        await get().fetchContract(currentId);
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to submit milestone',
        isLoading: false,
      });
      throw error;
    }
  },

  approveMilestone: async (milestoneId: string) => {
    set({ isLoading: true, error: null });
    try {
      await contractsApi.approveMilestone(milestoneId);
      // Refetch current contract to update milestone status
      const currentId = get().currentContract?.id;
      if (currentId) {
        await get().fetchContract(currentId);
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to approve milestone',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentContract: () => set({ currentContract: null }),
}));
