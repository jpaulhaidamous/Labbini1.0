import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser('userId') userId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(userId, createReviewDto);
  }

  @Get('user/:userId')
  @Public()
  async getReviewsForUser(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.getReviewsForUser(
      userId,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get('contract/:contractId')
  @UseGuards(JwtAuthGuard)
  async getContractReviews(
    @Param('contractId') contractId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.reviewsService.getContractReviews(contractId, userId);
  }
}
