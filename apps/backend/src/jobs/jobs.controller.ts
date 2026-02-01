import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('CLIENT')
  async create(
    @CurrentUser('userId') userId: string,
    @Body() createJobDto: CreateJobDto,
  ) {
    return this.jobsService.create(userId, createJobDto);
  }

  @Get()
  @Public()
  async findAll(
    @Query('category') category?: string,
    @Query('jobType') jobType?: string,
    @Query('budgetMin') budgetMin?: string,
    @Query('budgetMax') budgetMax?: string,
    @Query('locationType') locationType?: string,
    @Query('governorate') governorate?: string,
    @Query('isUrgent') isUrgent?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.jobsService.findAll({
      category,
      jobType,
      budgetMin: budgetMin ? parseInt(budgetMin, 10) : undefined,
      budgetMax: budgetMax ? parseInt(budgetMax, 10) : undefined,
      locationType,
      governorate,
      isUrgent: isUrgent === 'true' ? true : isUrgent === 'false' ? false : undefined,
      search,
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('my-jobs')
  @UseGuards(JwtAuthGuard)
  async getMyJobs(
    @CurrentUser('userId') userId: string,
    @Query('status') status?: string,
  ) {
    return this.jobsService.getMyJobs(userId, status);
  }

  @Get(':id')
  @Public()
  async findOne(
    @Param('id') id: string,
    @CurrentUser('userId') userId?: string,
  ) {
    return this.jobsService.findOne(id, userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.update(id, userId, updateJobDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.jobsService.remove(id, userId);
  }
}
