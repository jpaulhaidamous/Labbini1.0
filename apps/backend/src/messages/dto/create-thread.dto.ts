import { IsOptional, IsString, IsArray, IsUUID } from 'class-validator';

export class CreateThreadDto {
  @IsArray()
  @IsUUID('4', { each: true })
  participantIds: string[];

  @IsOptional()
  @IsUUID()
  jobId?: string;

  @IsOptional()
  @IsUUID()
  contractId?: string;
}
