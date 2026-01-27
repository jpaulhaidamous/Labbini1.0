import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    // Delete in correct order to respect foreign key constraints
    await this.$transaction([
      this.review.deleteMany(),
      this.message.deleteMany(),
      this.messageThread.deleteMany(),
      this.transaction.deleteMany(),
      this.wallet.deleteMany(),
      this.milestone.deleteMany(),
      this.contract.deleteMany(),
      this.proposal.deleteMany(),
      this.job.deleteMany(),
      this.profileSkill.deleteMany(),
      this.profile.deleteMany(),
      this.user.deleteMany(),
      this.skill.deleteMany(),
      this.category.deleteMany(),
    ]);
  }
}
