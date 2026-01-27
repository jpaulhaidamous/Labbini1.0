import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';

@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, createContractDto: CreateContractDto) {
    const {
      proposalId,
      contractType,
      totalAmount,
      hourlyRate,
      weeklyLimit,
      milestones,
    } = createContractDto;

    // Get proposal with job and freelancer
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        job: true,
        freelancer: true,
      },
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    if (proposal.job.clientId !== clientId) {
      throw new ForbiddenException('You can only create contracts for your own jobs');
    }

    if (proposal.status !== 'ACCEPTED') {
      throw new BadRequestException('Proposal must be accepted before creating a contract');
    }

    // Check if contract already exists for this proposal
    const existingContract = await this.prisma.contract.findFirst({
      where: { proposalId },
    });

    if (existingContract) {
      throw new BadRequestException('Contract already exists for this proposal');
    }

    // Validate contract type requirements
    if (contractType === 'FIXED') {
      if (!totalAmount) {
        throw new BadRequestException('Fixed-price contracts require totalAmount');
      }
      if (!milestones || milestones.length === 0) {
        throw new BadRequestException('Fixed-price contracts require at least one milestone');
      }

      // Validate milestone amounts sum to total
      const milestonesTotal = milestones.reduce((sum, m) => sum + m.amount, 0);
      if (Math.abs(milestonesTotal - totalAmount) > 0.01) {
        throw new BadRequestException('Milestone amounts must sum to total contract amount');
      }
    } else if (contractType === 'HOURLY') {
      if (!hourlyRate) {
        throw new BadRequestException('Hourly contracts require hourlyRate');
      }
    }

    // Create contract with milestones
    const contract = await this.prisma.contract.create({
      data: {
        jobId: proposal.jobId,
        proposalId,
        clientId,
        freelancerId: proposal.freelancerId,
        contractType,
        totalAmount,
        hourlyRate,
        weeklyLimit,
        status: 'PENDING',
        milestones: milestones
          ? {
              create: milestones.map((m) => ({
                name: m.name,
                description: m.description,
                amount: m.amount,
                dueDate: m.dueDate ? new Date(m.dueDate) : null,
                status: 'PENDING',
              })),
            }
          : undefined,
      },
      include: {
        job: {
          select: {
            titleEn: true,
            titleAr: true,
          },
        },
        client: {
          select: {
            id: true,
            profile: {
              select: {
                displayNameEn: true,
              },
            },
          },
        },
        freelancer: {
          select: {
            id: true,
            profile: {
              select: {
                displayNameEn: true,
              },
            },
          },
        },
        milestones: true,
      },
    });

    return contract;
  }

  async findMyContracts(
    userId: string,
    role: 'CLIENT' | 'FREELANCER',
    status?: string,
  ) {
    const where: any = role === 'CLIENT' ? { clientId: userId } : { freelancerId: userId };

    if (status) {
      where.status = status;
    }

    const contracts = await this.prisma.contract.findMany({
      where,
      include: {
        job: {
          select: {
            titleEn: true,
            titleAr: true,
            category: true,
          },
        },
        client: {
          select: {
            id: true,
            profile: {
              select: {
                displayNameEn: true,
                displayNameAr: true,
                avatarUrl: true,
              },
            },
          },
        },
        freelancer: {
          select: {
            id: true,
            profile: {
              select: {
                displayNameEn: true,
                displayNameAr: true,
                avatarUrl: true,
              },
            },
          },
        },
        milestones: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return contracts;
  }

  async findOne(id: string, userId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            category: true,
          },
        },
        proposal: true,
        client: {
          select: {
            id: true,
            email: true,
            phone: true,
            verificationLevel: true,
            profile: {
              select: {
                displayNameEn: true,
                displayNameAr: true,
                avatarUrl: true,
                governorate: true,
                city: true,
              },
            },
          },
        },
        freelancer: {
          select: {
            id: true,
            email: true,
            phone: true,
            verificationLevel: true,
            profile: {
              select: {
                displayNameEn: true,
                displayNameAr: true,
                avatarUrl: true,
                governorate: true,
                city: true,
                jobSuccessScore: true,
              },
            },
          },
        },
        milestones: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.clientId !== userId && contract.freelancerId !== userId) {
      throw new ForbiddenException('You do not have access to this contract');
    }

    return contract;
  }

  async updateStatus(
    id: string,
    userId: string,
    status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED',
  ) {
    const contract = await this.findOne(id, userId);

    // Only client can activate or cancel
    if ((status === 'ACTIVE' || status === 'CANCELLED') && contract.clientId !== userId) {
      throw new ForbiddenException('Only the client can activate or cancel the contract');
    }

    // Both can pause or complete
    if (status === 'COMPLETED') {
      // Check all milestones are approved
      const pendingMilestones = contract.milestones.filter((m) => m.status !== 'APPROVED');

      if (pendingMilestones.length > 0) {
        throw new BadRequestException('All milestones must be approved before completing contract');
      }
    }

    const updated = await this.prisma.contract.update({
      where: { id },
      data: {
        status,
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
      },
    });

    // Update freelancer stats if completed
    if (status === 'COMPLETED') {
      await this.updateFreelancerStats(contract.freelancerId, contract.id);
    }

    return updated;
  }

  async submitMilestone(milestoneId: string, freelancerId: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        contract: true,
      },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    if (milestone.contract.freelancerId !== freelancerId) {
      throw new ForbiddenException('Only the freelancer can submit work');
    }

    if (milestone.status !== 'FUNDED' && milestone.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Milestone must be funded before submitting work');
    }

    const updated = await this.prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });

    return updated;
  }

  async approveMilestone(milestoneId: string, clientId: string) {
    const milestone = await this.prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        contract: true,
      },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    if (milestone.contract.clientId !== clientId) {
      throw new ForbiddenException('Only the client can approve milestones');
    }

    if (milestone.status !== 'SUBMITTED') {
      throw new BadRequestException('Milestone must be submitted before approval');
    }

    // This will be handled by the payment service to release escrow
    // For now, just update status
    const updated = await this.prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
      },
    });

    return updated;
  }

  private async updateFreelancerStats(freelancerId: string, contractId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        milestones: true,
      },
    });

    // ✅ FIX: contract can be null
    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    const totalEarned = contract.totalAmount ?? 0;

    await this.prisma.profile.update({
      where: { userId: freelancerId },
      data: {
        totalJobsCompleted: {
          increment: 1,
        },
        totalEarned: {
          increment: totalEarned,
        },
      },
    });
  }
}
