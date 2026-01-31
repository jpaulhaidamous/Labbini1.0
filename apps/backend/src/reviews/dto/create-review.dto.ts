import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  contractId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  overallRating: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  qualityRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  communicationRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  timelinessRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  professionalismRating?: number;

  @IsOptional()
  @IsBoolean()
  wouldRecommend?: boolean;

  @IsOptional()
  @IsString()
  publicReview?: string;

  @IsOptional()
  @IsString()
  privateFeedback?: string;
}
