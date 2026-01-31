import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+961[0-9]{8}$/, { message: 'Phone must be in Lebanese format: +961XXXXXXXX' })
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
