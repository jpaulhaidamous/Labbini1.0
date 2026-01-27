import { Injectable } from '@nestjs/common';
import { EscrowService } from './escrow.service';

@Injectable()
export class PaymentsService {
  constructor(private escrowService: EscrowService) {}

  async getWallet(userId: string) {
    return this.escrowService.getWallet(userId);
  }

  async getTransactions(userId: string, page?: number, limit?: number) {
    return this.escrowService.getTransactions(userId, page, limit);
  }

  async requestWithdrawal(userId: string, amount: number, method: string) {
    return this.escrowService.requestWithdrawal(userId, amount, method);
  }

  async fundMilestone(milestoneId: string, clientId: string, paymentMethod: string) {
    return this.escrowService.fundMilestone(milestoneId, clientId, paymentMethod);
  }

  async releaseMilestone(milestoneId: string, clientId: string) {
    return this.escrowService.releaseMilestone(milestoneId, clientId);
  }
}
