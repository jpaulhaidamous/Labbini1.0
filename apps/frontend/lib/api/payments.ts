import { api } from './client';

export interface Wallet {
  id: string;
  userId: string;
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
}

export interface Transaction {
  id: string;
  userId: string;
  contractId?: string;
  type: 'DEPOSIT' | 'ESCROW_FUND' | 'ESCROW_RELEASE' | 'WITHDRAWAL' | 'REFUND' | 'FEE';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  amount: number;
  currency: string;
  paymentMethod?: 'OMT' | 'WHISH' | 'BANK_TRANSFER' | 'CARD' | 'CASH' | 'WALLET';
  externalReference?: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawData {
  amount: number;
  paymentMethod: 'OMT' | 'WHISH' | 'BANK_TRANSFER';
  accountDetails: Record<string, string>;
}

export interface FundMilestoneData {
  paymentMethod: 'OMT' | 'WHISH' | 'WALLET';
  externalReference?: string;
}

export const paymentsApi = {
  // Get wallet
  getWallet: async () => {
    return api.get<Wallet>('/payments/wallet');
  },

  // Get transactions
  getTransactions: async (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return api.get<{
      transactions: Transaction[];
      total: number;
      page: number;
      limit: number;
    }>(`/payments/transactions?${params.toString()}`);
  },

  // Request withdrawal
  withdraw: async (data: WithdrawData) => {
    return api.post<Transaction>('/payments/withdraw', data);
  },

  // Fund milestone
  fundMilestone: async (milestoneId: string, data: FundMilestoneData) => {
    return api.post(`/payments/milestones/${milestoneId}/fund`, data);
  },

  // Release milestone funds
  releaseMilestone: async (milestoneId: string) => {
    return api.post(`/payments/milestones/${milestoneId}/release`, {});
  },
};
