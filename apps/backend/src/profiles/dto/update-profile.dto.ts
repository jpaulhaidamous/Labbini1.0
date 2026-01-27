import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  IsArray,
  IsIn,
} from 'class-validator';

const LEBANESE_GOVERNORATES = [
  'Beirut',
  'Mount Lebanon',
  'North Lebanon',
  'South Lebanon',
  'Bekaa',
  'Nabatieh',
  'Akkar',
  'Baalbek-Hermel',
];

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  displayNameEn?: string;

  @IsOptional()
  @IsString()
  displayNameAr?: string;

  @IsOptional()
  @IsString()
  bioEn?: string;

  @IsOptional()
  @IsString()
  bioAr?: string;

  @IsOptional()
  @IsString()
  @IsIn(LEBANESE_GOVERNORATES)
  governorate?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(500)
  hourlyRate?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsString()
  @IsIn(['public', 'private'])
  profileVisibility?: string;
}
