import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, createJobDto: CreateJobDto) {
    // Verify user is a client
    const user = await this.prisma.user.findUnique({
      where: { id: clientId },
    });

    if (!user || user.role !== 'CLIENT') {
      throw new ForbiddenException('Only clients can post jobs');
    }

    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createJobDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    // Budget validation
    if (createJobDto.budgetType === 'RANGE') {
      if (!createJobDto.budgetMin || !createJobDto.budgetMax) {
        throw new BadRequestException('Budget range requires both min and max values');
      }
      if (createJobDto.budgetMin >= createJobDto.budgetMax) {
        throw new BadRequestException('Budget min must be less than max');
      }
    }

    const job = await this.prisma.job.create({
      data: {
        ...createJobDto,
        clientId,
        status: 'DRAFT', // Start as draft
      },
      include: {
        category: true,
        client: {
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
      },
    });

    return job;
  }

  async findAll(filters: {
    category?: string;
    jobType?: string;
    budgetMin?: number;
    budgetMax?: number;
    locationType?: string;
    governorate?: string;
    isUrgent?: boolean;
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      category,
      jobType,
      budgetMin,
      budgetMax,
      locationType,
      governorate,
      isUrgent,
      search,
      status = 'OPEN',
      page = 1,
      limit = 20,
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {
      status: status as any,
      visibility: 'PUBLIC',
    };

    if (category) {
      where.category = {
        OR: [{ id: category }, { slug: category }],
      };
    }

    if (jobType) {
      where.jobType = jobType;
    }

    if (locationType) {
      where.locationType = locationType;
    }

    if (governorate) {
      where.governorate = governorate;
    }

    if (isUrgent !== undefined) {
      where.isUrgent = isUrgent;
    }

    if (budgetMin || budgetMax) {
      where.budgetMin = {};
      if (budgetMin) where.budgetMin.gte = budgetMin;
      if (budgetMax) where.budgetMin.lte = budgetMax;
    }

    if (search) {
      where.OR = [
        { titleEn: { contains: search, mode: 'insensitive' } },
        { titleAr: { contains: search, mode: 'insensitive' } },
        { descriptionEn: { contains: search, mode: 'insensitive' } },
        { descriptionAr: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
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
          _count: {
            select: {
              proposals: true,
            },
          },
        },
        orderBy: [
          { isUrgent: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        category: {
          include: {
            parent: true,
          },
        },
        client: {
          select: {
            id: true,
            verificationLevel: true,
            createdAt: true,
            profile: {
              select: {
                displayNameEn: true,
                displayNameAr: true,
                governorate: true,
                city: true,
              },
            },
          },
        },
        _count: {
          select: {
            proposals: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Check visibility
    if (job.visibility === 'PRIVATE' && job.clientId !== userId) {
      throw new ForbiddenException('This job is private');
    }

    // Increment view count (async, don't wait)
    if (userId && userId !== job.clientId) {
      this.prisma.job.update({
        where: { id },
        data: {
          viewsCount: {
            increment: 1,
          },
        },
      }).catch(() => {}); // Ignore errors
    }

    return job;
  }

  async update(id: string, clientId: string, updateJobDto: UpdateJobDto) {
    const job = await this.prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.clientId !== clientId) {
      throw new ForbiddenException('You can only update your own jobs');
    }

    // Prevent updates if job has accepted proposals
    if (job.status === 'IN_PROGRESS' && updateJobDto.status !== 'CANCELLED') {
      throw new BadRequestException('Cannot update job while in progress');
    }

    const updated = await this.prisma.job.update({
      where: { id },
      data: updateJobDto,
      include: {
        category: true,
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
    });

    return updated;
  }

  async remove(id: string, clientId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        proposals: {
          where: {
            status: 'ACCEPTED',
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.clientId !== clientId) {
      throw new ForbiddenException('You can only delete your own jobs');
    }

    if (job.proposals.length > 0) {
      throw new BadRequestException('Cannot delete job with accepted proposals');
    }

    await this.prisma.job.delete({
      where: { id },
    });

    return { message: 'Job deleted successfully' };
  }

  async getMyJobs(clientId: string, status?: string) {
    const where: any = {
      clientId,
    };

    if (status) {
      where.status = status;
    }

    const jobs = await this.prisma.job.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: {
            proposals: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return jobs;
  }
}
