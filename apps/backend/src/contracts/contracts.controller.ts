import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('contracts')
@UseGuards(JwtAuthGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  async create(
    @CurrentUser('userId') userId: string,
    @Body() createContractDto: CreateContractDto,
  ) {
    return this.contractsService.create(userId, createContractDto);
  }

  @Get('my-contracts')
  async findMyContracts(
    @CurrentUser('userId') userId: string,
    @CurrentUser('role') role: 'CLIENT' | 'FREELANCER',
    @Query('status') status?: string,
  ) {
    return this.contractsService.findMyContracts(userId, role, status);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.contractsService.findOne(id, userId);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body('status') status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED',
  ) {
    return this.contractsService.updateStatus(id, userId, status);
  }

  @Put('milestones/:id/submit')
  async submitMilestone(
    @Param('id') milestoneId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.contractsService.submitMilestone(milestoneId, userId);
  }

  @Put('milestones/:id/approve')
  async approveMilestone(
    @Param('id') milestoneId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.contractsService.approveMilestone(milestoneId, userId);
  }
}
