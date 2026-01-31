import { create } from 'zustand';
import { paymentsApi, Wallet, Transaction, WithdrawData, FundMilestoneData } from '../api/payments';

interface PaymentsState {
  wallet: Wallet | null;
  transactions: Transaction[];
  totalTransactions: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWallet: () => Promise<void>;
  fetchTransactions: (page?: number, limit?: number) => Promise<void>;
  withdraw: (data: WithdrawData) => Promise<Transaction>;
  fundMilestone: (milestoneId: string, data: FundMilestoneData) => Promise<void>;
  releaseMilestone: (milestoneId: string) => Promise<void>;
  clearError: () => void;
}

export const usePaymentsStore = create<PaymentsState>((set, get) => ({
  wallet: null,
  transactions: [],
  totalTransactions: 0,
  isLoading: false,
  error: null,

  fetchWallet: async () => {
    set({ isLoading: true, error: null });
    try {
      const wallet = await paymentsApi.getWallet();
      set({ wallet, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch wallet',
        isLoading: false,
      });
    }
  },

  fetchTransactions: async (page?: number, limit?: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await paymentsApi.getTransactions(page, limit);
      set({
        transactions: data.transactions,
        totalTransactions: data.total,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch transactions',
        isLoading: false,
      });
    }
  },

  withdraw: async (data: WithdrawData) => {
    set({ isLoading: true, error: null });
    try {
      const transaction = await paymentsApi.withdraw(data);
      set((state) => ({
        transactions: [transaction, ...state.transactions],
        isLoading: false,
      }));
      // Refetch wallet to update balance
      await get().fetchWallet();
      return transaction;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to process withdrawal',
        isLoading: false,
      });
      throw error;
    }
  },

  fundMilestone: async (milestoneId: string, data: FundMilestoneData) => {
    set({ isLoading: true, error: null });
    try {
      await paymentsApi.fundMilestone(milestoneId, data);
      // Refetch wallet and transactions
      await get().fetchWallet();
      await get().fetchTransactions();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fund milestone',
        isLoading: false,
      });
      throw error;
    }
  },

  releaseMilestone: async (milestoneId: string) => {
    set({ isLoading: true, error: null });
    try {
      await paymentsApi.releaseMilestone(milestoneId);
      // Refetch wallet and transactions
      await get().fetchWallet();
      await get().fetchTransactions();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to release milestone',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
