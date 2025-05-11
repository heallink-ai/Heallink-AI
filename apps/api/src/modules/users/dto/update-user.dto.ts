import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { AuthProvider, UserRole } from '../schemas/user.schema';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsOptional()
  emailVerified?: boolean;

  @IsOptional()
  phoneVerified?: boolean;

  @IsEnum(AuthProvider, { each: true })
  @IsOptional()
  providers?: AuthProvider[];

  @IsOptional()
  accounts?: Array<{ provider: AuthProvider; providerId: string }>;
}