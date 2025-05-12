import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdminRole } from '../../users/entities/admin-user.entity';

/**
 * DTO for admin login requests
 */
export class AdminLoginDto {
  @ApiProperty({
    description: 'Admin user email address',
    example: 'admin@heallink.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Admin user password',
    example: 'StrongP@ssw0rd',
    minLength: 8,
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  // Internal property - not sent from client
  @IsOptional()
  @IsString()
  ip?: string;
}

/**
 * DTO for admin registration requests
 */
export class AdminRegisterDto {
  @ApiProperty({
    description: 'Admin user email address',
    example: 'newadmin@heallink.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'Admin user password - must be at least 8 characters long and contain uppercase, lowercase, and special characters',
    example: 'StrongP@ssw0rd',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @ApiProperty({
    description: 'Admin user full name',
    example: 'John Smith',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Admin role type - determines permissions',
    example: 'user_admin',
    enum: AdminRole,
    enumName: 'AdminRole',
  })
  @IsString()
  @IsNotEmpty()
  adminRole: string;
}

/**
 * DTO for admin password reset requests
 */
export class AdminPasswordResetRequestDto {
  @ApiProperty({
    description: 'Admin user email address to send the password reset link',
    example: 'admin@heallink.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

/**
 * DTO for admin password reset with token
 */
export class AdminPasswordResetDto {
  @ApiProperty({
    description: 'Password reset token received via email',
    example: '7f58868e7b8a4c0fb54f4e10a5f3d3f9',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description:
      'New password - must be at least 8 characters long and contain uppercase, lowercase, and special characters',
    example: 'NewStrongP@ssw0rd',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  newPassword: string;
}

/**
 * DTO for admin token validation
 */
export class ValidateTokenDto {
  @ApiProperty({
    description: 'JWT token to validate',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

/**
 * DTO for updating admin roles and permissions
 */
export class UpdateAdminRoleDto {
  @ApiProperty({
    description: 'ID of the admin user to update',
    example: '5f8d0c12b9a7f64b3c8e1a82',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'New admin role to assign',
    example: 'system_admin',
    enum: AdminRole,
    enumName: 'AdminRole',
  })
  @IsString()
  @IsNotEmpty()
  adminRole: string;

  @ApiPropertyOptional({
    description:
      'Custom permission strings if not using default role permissions',
    example: ['settings:read', 'users:manage', 'system:update'],
    isArray: true,
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  customPermissions?: string[];
}

/**
 * DTO for initial admin setup
 */
export class InitialAdminSetupDto {
  @ApiProperty({
    description: 'Admin user email address',
    example: 'superadmin@heallink.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'Admin user password - must be at least 8 characters long and contain uppercase, lowercase, and special characters',
    example: 'StrongP@ssw0rd',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @ApiProperty({
    description: 'Admin user full name',
    example: 'Super Admin',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Setup secret key for added security',
    example: 'YOUR_SECRET_SETUP_KEY',
  })
  @IsString()
  @IsNotEmpty()
  setupKey: string;

  // Internal property - not sent from client
  @IsOptional()
  @IsString()
  ip?: string;
}
