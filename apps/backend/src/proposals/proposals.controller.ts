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
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('proposals')
@UseGuards(JwtAuthGuard)
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  @Roles('FREELANCER')
  async create(
    @CurrentUser('userId') userId: string,
    @Body() createProposalDto: CreateProposalDto,
  ) {
    return this.proposalsService.create(userId, createProposalDto);
  }

  @Get('my-proposals')
  @Roles('FREELANCER')
  async findMyProposals(
    @CurrentUser('userId') userId: string,
    @Query('status') status?: string,
  ) {
    return this.proposalsService.findMyProposals(userId, status);
  }

  @Get('job/:jobId')
  @Roles('CLIENT')
  async findJobProposals(
    @Param('jobId') jobId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.proposalsService.findJobProposals(jobId, userId);
  }

  @Put(':id/status')
  @Roles('CLIENT')
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body('status') status: 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED',
  ) {
    return this.proposalsService.updateStatus(id, userId, status);
  }

  @Delete(':id')
  @Roles('FREELANCER')
  async withdraw(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.proposalsService.withdraw(id, userId);
  }
}
