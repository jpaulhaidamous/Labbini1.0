import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('wallet')
  async getWallet(@CurrentUser('userId') userId: string) {
    return this.paymentsService.getWallet(userId);
  }

  @Get('transactions')
  async getTransactions(
    @CurrentUser('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.paymentsService.getTransactions(
      userId,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Post('withdraw')
  async requestWithdrawal(
    @CurrentUser('userId') userId: string,
    @Body('amount') amount: number,
    @Body('method') method: string,
  ) {
    return this.paymentsService.requestWithdrawal(userId, amount, method);
  }

  @Post('milestones/:id/fund')
  async fundMilestone(
    @Param('id') milestoneId: string,
    @CurrentUser('userId') userId: string,
    @Body('paymentMethod') paymentMethod: string,
  ) {
    return this.paymentsService.fundMilestone(milestoneId, userId, paymentMethod);
  }

  @Post('milestones/:id/release')
  async releaseMilestone(
    @Param('id') milestoneId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.paymentsService.releaseMilestone(milestoneId, userId);
  }
}
