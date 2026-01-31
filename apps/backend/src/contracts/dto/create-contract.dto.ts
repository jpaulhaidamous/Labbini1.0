import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

class MilestoneDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  dueDate?: string;
}

export class CreateContractDto {
  @IsString()
  @IsNotEmpty()
  proposalId: string;

  @IsEnum(['FIXED', 'HOURLY'])
  contractType: 'FIXED' | 'HOURLY';

  @IsOptional()
  @IsNumber()
  @Min(1)
  totalAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(5)
  hourlyRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  weeklyLimit?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MilestoneDto)
  milestones?: MilestoneDto[];
}
