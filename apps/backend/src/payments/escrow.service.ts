import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class EscrowService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calculate platform fee using sliding scale:
   * - First $500 with client: 20%
   * - $500.01 - $5,000: 15%
   * - $5,000.01+: 10%
   */
  calculatePlatformFee(amount: number, previousEarningsWithClient: number): number {
    let remainingAmount = amount;
    let totalFee = 0;
    let currentEarnings = previousEarningsWithClient;

    // Tier 1: First $500 at 20%
    if (currentEarnings < 500) {
      const tier1Remaining = 500 - currentEarnings;
      const tier1Amount = Math.min(remainingAmount, tier1Remaining);
      totalFee += tier1Amount * 0.20;
      remainingAmount -= tier1Amount;
      currentEarnings += tier1Amount;
    }

    // Tier 2: $500.01 - $5,000 at 15%
    if (remainingAmount > 0 && currentEarnings < 5000) {
      const tier2Remaining = 5000 - currentEarnings;
      const tier2Amount = Math.min(remainingAmount, tier2Remaining);
      totalFee += tier2Amount * 0.15;
      remainingAmount -= tier2Amount;
      currentEarnings += tier2Amount;
    }

    // Tier 3: $5,000.01+ at 10%
    if (remainingAmount > 0) {
      totalFee += remainingAmount * 0.10;
    }

    return Math.round(totalFee * 100) / 100; // Round to 2 decimals
  }

  async fundMilestone(milestoneId: string, clientId: string, paymentMethod: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        contract: {
          include: {
            client: true,
            freelancer: true,
          },
        },
      },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    if (milestone.contract.clientId !== clientId) {
      throw new BadRequestException('You can only fund your own milestones');
    }

    if (milestone.status !== 'PENDING') {
      throw new BadRequestException('Milestone has already been funded');
    }

    const amount = Number(milestone.amount);

    // Create escrow transaction (PENDING until payment confirmed)
    const transaction = await this.prisma.transaction.create({
      data: {
        userId: clientId,
        contractId: milestone.contractId,
        type: 'ESCROW_FUND',
        amount,
        currency: 'USD',
        paymentMethod: paymentMethod as any,
        status: 'PENDING',
        description: `Escrow funding for milestone: ${milestone.name}`,
        metadata: {
          milestoneId,
          milestoneName: milestone.name,
        },
      },
    });

    // Update milestone status
    await this.prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: 'FUNDED',
        fundedAt: new Date(),
      },
    });

    // For MVP: Simulate manual payment (in production, wait for webhook)
    // In real implementation, return payment instructions to client
    return {
      transaction,
      milestone,
      paymentInstructions: {
        method: paymentMethod,
        amount,
        reference: transaction.id,
        message: 'Please complete payment using your selected method. Once confirmed, funds will be held in escrow.',
      },
    };
  }

  async releaseMilestone(milestoneId: string, clientId: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        contract: {
          include: {
            client: true,
            freelancer: true,
          },
        },
      },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    if (milestone.contract.clientId !== clientId) {
      throw new BadRequestException('Only the client can release funds');
    }

    if (milestone.status !== 'SUBMITTED' && milestone.status !== 'APPROVED') {
      throw new BadRequestException('Milestone must be submitted before releasing funds');
    }

    const amount = Number(milestone.amount);
    const freelancerId = milestone.contract.freelancerId;

    // Calculate previous earnings with this client
    const previousContracts = await this.prisma.contract.findMany({
      where: {
        freelancerId,
        clientId,
        status: 'COMPLETED',
      },
      select: {
        totalAmount: true,
      },
    });

    const previousEarnings = previousContracts.reduce(
      (sum, c) => sum + Number(c.totalAmount || 0),
      0
    );

    // Calculate platform fee
    const platformFee = this.calculatePlatformFee(amount, previousEarnings);
    const freelancerAmount = amount - platformFee;

    // Create transactions in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Mark escrow as released
      await tx.transaction.create({
        data: {
          userId: freelancerId,
          contractId: milestone.contractId,
          type: 'ESCROW_RELEASE',
          amount: freelancerAmount,
          currency: 'USD',
          paymentMethod: 'WALLET',
          status: 'COMPLETED',
          description: `Payment for milestone: ${milestone.name}`,
          metadata: {
            milestoneId,
            milestoneName: milestone.name,
            grossAmount: amount,
            platformFee,
          },
          completedAt: new Date(),
        },
      });

      // 2. Record platform fee
      await tx.transaction.create({
        data: {
          userId: clientId,
          contractId: milestone.contractId,
          type: 'FEE',
          amount: platformFee,
          currency: 'USD',
          paymentMethod: 'WALLET',
          status: 'COMPLETED',
          description: `Platform fee for milestone: ${milestone.name}`,
          metadata: {
            milestoneId,
            feePercentage: (platformFee / amount) * 100,
            grossAmount: amount,
          },
          completedAt: new Date(),
        },
      });

      // 3. Update freelancer wallet
      await tx.wallet.upsert({
        where: { userId: freelancerId },
        create: {
          userId: freelancerId,
          availableBalance: freelancerAmount,
          totalEarned: freelancerAmount,
        },
        update: {
          availableBalance: {
            increment: freelancerAmount,
          },
          totalEarned: {
            increment: freelancerAmount,
          },
        },
      });

      // 4. Update milestone status
      await tx.milestone.update({
        where: { id: milestoneId },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
        },
      });

      // 5. Update profile earnings
      await tx.profile.update({
        where: { userId: freelancerId },
        data: {
          totalEarned: {
            increment: freelancerAmount,
          },
        },
      });

      return {
        grossAmount: amount,
        platformFee,
        freelancerAmount,
        feePercentage: Math.round((platformFee / amount) * 100 * 10) / 10,
      };
    });

    return {
      message: 'Funds released successfully',
      breakdown: result,
    };
  }

  async getWallet(userId: string) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: {
          userId,
          availableBalance: 0,
          pendingBalance: 0,
          totalEarned: 0,
          totalWithdrawn: 0,
        },
      });
    }

    return wallet;
  }

  async getTransactions(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          contract: {
            select: {
              id: true,
              job: {
                select: {
                  titleEn: true,
                  titleAr: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.transaction.count({
        where: { userId },
      }),
    ]);

    return {
      transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async requestWithdrawal(userId: string, amount: number, method: string) {
    const wallet = await this.getWallet(userId);
    const availableBalance = Number(wallet.availableBalance);

    if (amount > availableBalance) {
      throw new BadRequestException('Insufficient balance');
    }

    // Minimum withdrawal amounts
    const minimums: Record<string, number> = {
      OMT: 20,
      WHISH: 10,
      BANK_TRANSFER: 100,
    };

    const minAmount = minimums[method] || 20;
    if (amount < minAmount) {
      throw new BadRequestException(`Minimum withdrawal for ${method} is $${minAmount}`);
    }

    // Create withdrawal transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        type: 'WITHDRAWAL',
        amount,
        currency: 'USD',
        paymentMethod: method as any,
        status: 'PENDING',
        description: `Withdrawal request via ${method}`,
      },
    });

    // Update wallet
    await this.prisma.wallet.update({
      where: { userId },
      data: {
        availableBalance: {
          decrement: amount,
        },
        pendingBalance: {
          increment: amount,
        },
      },
    });

    return {
      transaction,
      message: 'Withdrawal request submitted. It will be processed within 24-48 hours.',
    };
  }
}
