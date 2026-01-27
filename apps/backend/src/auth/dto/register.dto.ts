import { IsEmail, IsString, MinLength, IsEnum, IsOptional, Matches } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @Matches(/^\+961[0-9]{8}$/, {
    message: 'Phone number must be a valid Lebanese number (+961XXXXXXXX)',
  })
  phone: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsOptional()
  displayNameEn?: string;

  @IsString()
  @IsOptional()
  displayNameAr?: string;
}
