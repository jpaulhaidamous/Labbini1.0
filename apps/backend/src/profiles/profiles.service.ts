import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AddSkillsDto } from './dto/manage-skills.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        skills: {
          include: {
            skill: {
              include: {
                category: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            verificationLevel: true,
            emailVerified: true,
            phoneVerified: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async getPublicProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        skills: {
          include: {
            skill: {
              include: {
                category: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            role: true,
            verificationLevel: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Check visibility
    if (profile.profileVisibility === 'private') {
      throw new ForbiddenException('This profile is private');
    }

    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    // Check if profile exists
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new NotFoundException('Profile not found');
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { userId },
      data: updateProfileDto,
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    return updatedProfile;
  }

  async addSkills(userId: string, addSkillsDto: AddSkillsDto) {
    const { skillIds } = addSkillsDto;

    // Check if profile exists
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Verify all skills exist
    const skills = await this.prisma.skill.findMany({
      where: {
        id: { in: skillIds },
      },
    });

    if (skills.length !== skillIds.length) {
      throw new BadRequestException('One or more skills not found');
    }

    // Add skills (ignore if already exists)
    await Promise.all(
      skillIds.map((skillId) =>
        this.prisma.profileSkill.upsert({
          where: {
            profileId_skillId: {
              profileId: profile.id,
              skillId,
            },
          },
          create: {
            profileId: profile.id,
            skillId,
          },
          update: {}, // No update needed if exists
        }),
      ),
    );

    return this.getProfile(userId);
  }

  async removeSkill(userId: string, skillId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    await this.prisma.profileSkill.delete({
      where: {
        profileId_skillId: {
          profileId: profile.id,
          skillId,
        },
      },
    });

    return this.getProfile(userId);
  }

  async searchProfiles(filters: {
    category?: string;
    governorate?: string;
    minRate?: number;
    maxRate?: number;
    skills?: string[];
    availability?: boolean;
    minJobSuccess?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      category,
      governorate,
      minRate,
      maxRate,
      skills,
      availability,
      minJobSuccess,
      search,
      page = 1,
      limit = 20,
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {
      profileVisibility: 'public',
      user: {
        role: 'FREELANCER',
        status: 'ACTIVE',
      },
    };

    if (governorate) {
      where.governorate = governorate;
    }

    if (minRate || maxRate) {
      where.hourlyRate = {};
      if (minRate) where.hourlyRate.gte = minRate;
      if (maxRate) where.hourlyRate.lte = maxRate;
    }

    if (availability !== undefined) {
      where.isAvailable = availability;
    }

    if (minJobSuccess) {
      where.jobSuccessScore = { gte: minJobSuccess };
    }

    if (search) {
      where.OR = [
        { displayNameEn: { contains: search, mode: 'insensitive' } },
        { displayNameAr: { contains: search, mode: 'insensitive' } },
        { bioEn: { contains: search, mode: 'insensitive' } },
        { bioAr: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (skills && skills.length > 0) {
      where.skills = {
        some: {
          skillId: {
            in: skills,
          },
        },
      };
    }

    if (category) {
      where.skills = {
        some: {
          skill: {
            category: {
              OR: [{ id: category }, { slug: category }],
            },
          },
        },
      };
    }

    const [profiles, total] = await Promise.all([
      this.prisma.profile.findMany({
        where,
        skip,
        take: limit,
        include: {
          skills: {
            include: {
              skill: {
                include: {
                  category: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              role: true,
              verificationLevel: true,
              createdAt: true,
            },
          },
        },
        orderBy: [
          { jobSuccessScore: 'desc' },
          { totalJobsCompleted: 'desc' },
        ],
      }),
      this.prisma.profile.count({ where }),
    ]);

    return {
      profiles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProfileReviews(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
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
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.review.count({
        where: { revieweeId: userId },
      }),
    ]);

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
