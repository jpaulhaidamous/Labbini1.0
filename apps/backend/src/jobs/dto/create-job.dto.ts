import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsIn,
  Min,
} from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  titleEn: string;

  @IsOptional()
  @IsString()
  titleAr?: string;

  @IsString()
  @IsNotEmpty()
  descriptionEn: string;

  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsEnum(['FIXED', 'HOURLY', 'QUICK'])
  jobType: 'FIXED' | 'HOURLY' | 'QUICK';

  @IsEnum(['FIXED', 'RANGE', 'HOURLY'])
  budgetType: 'FIXED' | 'RANGE' | 'HOURLY';

  @IsOptional()
  @IsNumber()
  @Min(1)
  budgetMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  budgetMax?: number;

  @IsEnum(['REMOTE', 'ONSITE', 'HYBRID'])
  @IsOptional()
  locationType?: 'REMOTE' | 'ONSITE' | 'HYBRID';

  @IsOptional()
  @IsString()
  @IsIn([
    'Beirut',
    'Mount Lebanon',
    'North Lebanon',
    'South Lebanon',
    'Bekaa',
    'Nabatieh',
    'Akkar',
    'Baalbek-Hermel',
  ])
  governorate?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @IsOptional()
  @IsEnum(['PUBLIC', 'PRIVATE', 'INVITE'])
  visibility?: 'PUBLIC' | 'PRIVATE' | 'INVITE';
}
