import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(reviewerId: string, createReviewDto: CreateReviewDto) {
    const { contractId, ...reviewData } = createReviewDto;

    // Get contract
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        client: true,
        freelancer: true,
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    // Verify contract is completed
    if (contract.status !== 'COMPLETED') {
      throw new BadRequestException('Can only review completed contracts');
    }

    // Determine who is being reviewed
    let revieweeId: string;
    if (contract.clientId === reviewerId) {
      revieweeId = contract.freelancerId; // Client reviewing freelancer
    } else if (contract.freelancerId === reviewerId) {
      revieweeId = contract.clientId; // Freelancer reviewing client
    } else {
      throw new ForbiddenException('You are not part of this contract');
    }

    // Check if already reviewed
    const existing = await this.prisma.review.findUnique({
      where: {
        contractId_reviewerId: {
          contractId,
          reviewerId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('You have already reviewed this contract');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        contractId,
        reviewerId,
        revieweeId,
        ...reviewData,
      },
      include: {
        reviewer: {
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
        contract: {
          select: {
            job: {
              select: {
                titleEn: true,
                titleAr: true,
              },
            },
          },
        },
      },
    });

    // Update reviewee's job success score
    await this.updateJobSuccessScore(revieweeId);

    return review;
  }

  async getReviewsForUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total, averageRating] = await Promise.all([
      this.prisma.review.findMany({
        where: { revieweeId: userId },
        skip,
        take: limit,
        include: {
          reviewer: {
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
          contract: {
            select: {
              job: {
                select: {
                  titleEn: true,
                  titleAr: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.review.count({
        where: { revieweeId: userId },
      }),
      this.prisma.review.aggregate({
        where: { revieweeId: userId },
        _avg: {
          overallRating: true,
        },
      }),
    ]);

    return {
      reviews,
      averageRating: averageRating._avg.overallRating || 0,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getContractReviews(contractId: string, userId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.clientId !== userId && contract.freelancerId !== userId) {
      throw new ForbiddenException('You do not have access to this contract');
    }

    const reviews = await this.prisma.review.findMany({
      where: { contractId },
      include: {
        reviewer: {
          select: {
            id: true,
            role: true,
            profile: {
              select: {
                displayNameEn: true,
                displayNameAr: true,
              },
            },
          },
        },
      },
    });

    return reviews;
  }

  private async updateJobSuccessScore(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { revieweeId: userId },
      select: {
        overallRating: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Last 100 reviews
    });

    if (reviews.length === 0) return;

    // Calculate weighted average (recent reviews count more)
    let totalWeight = 0;
    let weightedSum = 0;

    reviews.forEach((review, index) => {
      const weight = 1 / (index + 1); // Decreasing weight for older reviews
      weightedSum += review.overallRating * weight;
      totalWeight += weight;
    });

    const jobSuccessScore = Math.round((weightedSum / totalWeight) * 20); // Convert to 0-100 scale

    await this.prisma.profile.update({
      where: { userId },
      data: {
        jobSuccessScore,
      },
    });
  }
}
