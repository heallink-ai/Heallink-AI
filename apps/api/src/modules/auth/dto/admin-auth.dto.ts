import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

/**
 * DTO for admin login requests
 */
export class AdminLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

/**
 * DTO for admin registration requests
 */
export class AdminRegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  adminRole: string;
}

/**
 * DTO for admin password reset requests
 */
export class AdminPasswordResetRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

/**
 * DTO for admin password reset with token
 */
export class AdminPasswordResetDto {
  @IsString()
  @IsNotEmpty()
  token: string;

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
  @IsString()
  @IsNotEmpty()
  token: string;
}

/**
 * DTO for updating admin roles and permissions
 */
export class UpdateAdminRoleDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  adminRole: string;

  @IsOptional()
  @IsString({ each: true })
  customPermissions?: string[];
}
