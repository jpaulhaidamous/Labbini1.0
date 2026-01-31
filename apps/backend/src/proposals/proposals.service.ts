import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProposalDto } from './dto/create-proposal.dto';

@Injectable()
export class ProposalsService {
  constructor(private prisma: PrismaService) {}

  async create(freelancerId: string, createProposalDto: CreateProposalDto) {
    const { jobId, coverLetter, proposedRate, proposedDuration, durationUnit } = createProposalDto;

    // Verify user is a freelancer
    const user = await this.prisma.user.findUnique({
      where: { id: freelancerId },
    });

    if (!user || user.role !== 'FREELANCER') {
      throw new ForbiddenException('Only freelancers can submit proposals');
    }

    // Check verification level (must be at least LEVEL_1 - phone verified)
    if (user.verificationLevel === 'LEVEL_0') {
      throw new ForbiddenException('You must verify your phone number before submitting proposals');
    }

    // Verify job exists and is open
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status !== 'OPEN') {
      throw new BadRequestException('Job is not accepting proposals');
    }

    // Check if freelancer is also the client (can't apply to own job)
    if (job.clientId === freelancerId) {
      throw new BadRequestException('You cannot submit a proposal to your own job');
    }

    // Check if already submitted proposal
    const existing = await this.prisma.proposal.findUnique({
      where: {
        jobId_freelancerId: {
          jobId,
          freelancerId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('You have already submitted a proposal for this job');
    }

    // Create proposal
    const proposal = await this.prisma.proposal.create({
      data: {
        jobId,
        freelancerId,
        coverLetter,
        proposedRate,
        proposedDuration,
        durationUnit,
      },
      include: {
        job: {
          select: {
            titleEn: true,
            titleAr: true,
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
                hourlyRate: true,
                jobSuccessScore: true,
              },
            },
          },
        },
      },
    });

    // Increment proposal count on job
    await this.prisma.job.update({
      where: { id: jobId },
      data: {
        proposalsCount: {
          increment: 1,
        },
      },
    });

    return proposal;
  }

  async findMyProposals(freelancerId: string, status?: string) {
    const where: any = {
      freelancerId,
    };

    if (status) {
      where.status = status;
    }

    const proposals = await this.prisma.proposal.findMany({
      where,
      include: {
        job: {
          include: {
            category: true,
            client: {
              select: {
                id: true,
                verificationLevel: true,
                profile: {
                  select: {
                    displayNameEn: true,
                    displayNameAr: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return proposals;
  }

  async findJobProposals(jobId: string, clientId: string) {
    // Verify job belongs to client
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.clientId !== clientId) {
      throw new ForbiddenException('You can only view proposals for your own jobs');
    }

    const proposals = await this.prisma.proposal.findMany({
      where: { jobId },
      include: {
        freelancer: {
          select: {
            id: true,
            verificationLevel: true,
            createdAt: true,
            profile: {
              select: {
                displayNameEn: true,
                displayNameAr: true,
                bioEn: true,
                bioAr: true,
                avatarUrl: true,
                governorate: true,
                city: true,
                hourlyRate: true,
                jobSuccessScore: true,
                totalJobsCompleted: true,
                totalEarned: true,
              },
              include: {
                skills: {
                  include: {
                    skill: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [
        { status: 'asc' }, // Show accepted/shortlisted first
        { createdAt: 'asc' },
      ],
    });

    return proposals;
  }

  async updateStatus(
    proposalId: string,
    clientId: string,
    status: 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED',
  ) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        job: true,
      },
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    if (proposal.job.clientId !== clientId) {
      throw new ForbiddenException('You can only update proposals for your own jobs');
    }

    if (proposal.status === 'ACCEPTED') {
      throw new BadRequestException('Proposal has already been accepted');
    }

    const updated = await this.prisma.proposal.update({
      where: { id: proposalId },
      data: { status },
      include: {
        freelancer: {
          select: {
            id: true,
            profile: {
              select: {
                displayNameEn: true,
                displayNameAr: true,
              },
            },
          },
        },
        job: {
          select: {
            id: true,
            titleEn: true,
            titleAr: true,
          },
        },
      },
    });

    // If accepted, update job status and potentially create contract
    if (status === 'ACCEPTED') {
      await this.prisma.job.update({
        where: { id: proposal.jobId },
        data: {
          status: 'IN_PROGRESS',
        },
      });
    }

    return updated;
  }

  async withdraw(proposalId: string, freelancerId: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found');
    }

    if (proposal.freelancerId !== freelancerId) {
      throw new ForbiddenException('You can only withdraw your own proposals');
    }

    if (proposal.status === 'ACCEPTED') {
      throw new BadRequestException('Cannot withdraw an accepted proposal');
    }

    await this.prisma.proposal.update({
      where: { id: proposalId },
      data: {
        status: 'WITHDRAWN',
      },
    });

    // Decrement proposal count on job
    await this.prisma.job.update({
      where: { id: proposal.jobId },
      data: {
        proposalsCount: {
          decrement: 1,
        },
      },
    });

    return { message: 'Proposal withdrawn successfully' };
  }
}
