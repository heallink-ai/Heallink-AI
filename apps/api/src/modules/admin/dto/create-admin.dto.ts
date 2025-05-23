import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  Matches,
  Length,
} from 'class-validator';
import { UserRole } from '../../users/schemas/user.schema';

export class CreateAdminDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid E.164 format',
  })
  phone?: string;

  @IsString()
  @Length(2, 100)
  name: string;

  @IsOptional()
  @IsString()
  @Length(6, 30)
  password?: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
