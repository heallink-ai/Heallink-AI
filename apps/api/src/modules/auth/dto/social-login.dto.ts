import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthProvider } from '../../users/schemas/user.schema';

export class SocialLoginDto {
  @IsEnum(AuthProvider)
  @IsNotEmpty()
  provider: AuthProvider;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsOptional()
  redirectUrl?: string;
}