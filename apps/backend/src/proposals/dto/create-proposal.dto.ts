import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export class CreateProposalDto {
  @IsString()
  @IsNotEmpty()
  jobId: string;

  @IsString()
  @IsNotEmpty()
  coverLetter: string;

  @IsNumber()
  @Min(1)
  proposedRate: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  proposedDuration?: number;

  @IsOptional()
  @IsEnum(['hours', 'days', 'weeks', 'months'])
  durationUnit?: 'hours' | 'days' | 'weeks' | 'months';
}
