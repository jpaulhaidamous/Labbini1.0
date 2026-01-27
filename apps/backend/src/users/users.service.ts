import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
          },
        },
        wallet: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        wallet: true,
      },
    });
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const { password, email, phone } = updateUserDto;

    // Check if email is already taken
    if (email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('Email is already taken');
      }
    }

    // Check if phone is already taken
    if (phone) {
      const existingUser = await this.prisma.user.findUnique({
        where: { phone },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('Phone number is already taken');
      }
    }

    // Hash password if provided
    let passwordHash: string | undefined;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(email && { email }),
        ...(phone && { phone }),
        ...(passwordHash && { passwordHash }),
      },
      include: {
        profile: true,
        wallet: true,
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(userId: string) {
    // Check if user exists
    await this.findById(userId);

    // Soft delete by setting status to BANNED
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        status: 'BANNED',
      },
    });

    return { message: 'User account has been deactivated' };
  }

  async getUserStats(userId: string) {
    const user = await this.findById(userId);

    if (user.role === 'FREELANCER') {
      const [completedJobs, totalEarned, activeContracts, reviewsReceived] = await Promise.all([
        this.prisma.contract.count({
          where: {
            freelancerId: userId,
            status: 'COMPLETED',
          },
        }),
        this.prisma.wallet.findUnique({
          where: { userId },
          select: { totalEarned: true },
        }),
        this.prisma.contract.count({
          where: {
            freelancerId: userId,
            status: 'ACTIVE',
          },
        }),
        this.prisma.review.findMany({
          where: { revieweeId: userId },
          select: { overallRating: true },
        }),
      ]);

      const averageRating =
        reviewsReceived.length > 0
          ? reviewsReceived.reduce((sum, r) => sum + r.overallRating, 0) / reviewsReceived.length
          : 0;

      return {
        completedJobs,
        totalEarned: totalEarned?.totalEarned || 0,
        activeContracts,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: reviewsReceived.length,
      };
    } else if (user.role === 'CLIENT') {
      const [jobsPosted, totalSpent, activeContracts] = await Promise.all([
        this.prisma.job.count({
          where: { clientId: userId },
        }),
        this.prisma.transaction.aggregate({
          where: {
            userId,
            type: 'ESCROW_FUND',
            status: 'COMPLETED',
          },
          _sum: {
            amount: true,
          },
        }),
        this.prisma.contract.count({
          where: {
            clientId: userId,
            status: 'ACTIVE',
          },
        }),
      ]);

      return {
        jobsPosted,
        totalSpent: totalSpent._sum.amount || 0,
        activeContracts,
      };
    }

    return {};
  }
}
