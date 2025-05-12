import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiProperty,
} from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import {
  AdminLoginDto,
  AdminRegisterDto,
  AdminPasswordResetRequestDto,
  AdminPasswordResetDto,
  UpdateAdminRoleDto,
  ValidateTokenDto,
} from './dto/admin-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminRole } from '../users/entities/admin-user.entity';

// Define request user type for better type safety
interface RequestWithUser extends Request {
  user: {
    id: string;
    adminRole?: AdminRole;
  };
}

// Response class for Swagger documentation
class TokenResponse {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: '5f8d0c12b9a7f64b3c8e1a82',
      email: 'admin@heallink.com',
      name: 'Admin User',
      role: 'admin',
      adminRole: 'system_admin',
      permissions: ['settings:read', 'settings:update'],
      emailVerified: true,
      isActive: true,
    },
  })
  user: Record<string, any>;
}

class MessageResponse {
  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message: string;
}

class ValidateTokenResponse {
  @ApiProperty({ description: 'Token validity status', example: true })
  valid: boolean;
}

@ApiTags('admin-auth')
@ApiExtraModels(TokenResponse, MessageResponse, ValidateTokenResponse)
@Controller('auth/admin')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Admin login',
    description: 'Authenticate admin user with email and password',
  })
  @ApiBody({ type: AdminLoginDto })
  @ApiOkResponse({
    description: 'Login successful',
    type: TokenResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() loginDto: AdminLoginDto) {
    return this.adminAuthService.login(loginDto);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Register new admin',
    description: 'Create a new admin user (requires admin privileges)',
  })
  @ApiBody({ type: AdminRegisterDto })
  @ApiCreatedResponse({
    description: 'Admin user created successfully',
    schema: {
      properties: {
        user: {
          type: 'object',
          example: {
            id: '5f8d0c12b9a7f64b3c8e1a82',
            email: 'newadmin@heallink.com',
            name: 'New Admin',
            role: 'admin',
            adminRole: 'content_admin',
            permissions: [
              'content:read',
              'content:create',
              'content:update',
              'content:delete',
            ],
            emailVerified: false,
            isActive: true,
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async register(
    @Body() registerDto: AdminRegisterDto,
    @Request() req: RequestWithUser,
  ) {
    // Get the creator's admin role from JWT payload
    const creatorAdminRole = req.user.adminRole;
    return this.adminAuthService.register(
      registerDto,
      creatorAdminRole as AdminRole,
    );
  }

  @Post('request-reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Request a password reset link for an admin user',
  })
  @ApiBody({ type: AdminPasswordResetRequestDto })
  @ApiOkResponse({
    description: 'Password reset requested',
    type: MessageResponse,
  })
  async requestPasswordReset(
    @Body() resetRequestDto: AdminPasswordResetRequestDto,
  ) {
    return this.adminAuthService.requestPasswordReset(resetRequestDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset password using token received via email',
  })
  @ApiBody({ type: AdminPasswordResetDto })
  @ApiOkResponse({
    description: 'Password reset successful',
    type: MessageResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  async resetPassword(@Body() resetDto: AdminPasswordResetDto) {
    return this.adminAuthService.resetPassword(resetDto);
  }

  @Post('verify-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify JWT token',
    description: 'Check if a JWT token is valid',
  })
  @ApiBody({ type: ValidateTokenDto })
  @ApiOkResponse({
    description: 'Token validation result',
    type: ValidateTokenResponse,
  })
  async validateToken(@Body() validateTokenDto: ValidateTokenDto) {
    return this.adminAuthService.validateToken(validateTokenDto.token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Logout admin',
    description: 'Logout an admin user and invalidate their refresh token',
  })
  @ApiBody({
    schema: {
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'Refresh token to invalidate',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Logout successful',
    type: MessageResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async logout(
    @Request() req: RequestWithUser,
    @Body('refreshToken') refreshToken: string,
  ) {
    const userId = req.user.id;
    return this.adminAuthService.logout(userId, refreshToken);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh tokens',
    description:
      'Get new access and refresh tokens using a valid refresh token',
  })
  @ApiBody({
    schema: {
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'Refresh token to use for generating new tokens',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Tokens refreshed successfully',
    schema: {
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    return this.adminAuthService.refreshTokens(refreshToken);
  }

  @Put('role')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update admin role',
    description: "Update an admin user's role and permissions",
  })
  @ApiBody({ type: UpdateAdminRoleDto })
  @ApiOkResponse({
    description: 'Role updated successfully',
    schema: {
      properties: {
        user: {
          type: 'object',
          example: {
            id: '5f8d0c12b9a7f64b3c8e1a82',
            email: 'admin@heallink.com',
            role: 'admin',
            adminRole: 'system_admin',
            permissions: [
              'settings:read',
              'settings:update',
              'logs:read',
              'system:manage',
            ],
          },
        },
        message: {
          type: 'string',
          example: 'Admin role and permissions updated successfully',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async updateAdminRole(
    @Body() updateDto: UpdateAdminRoleDto,
    @Request() req: RequestWithUser,
  ) {
    const currentUserRole = req.user.adminRole;
    return this.adminAuthService.updateAdminRole(
      updateDto,
      currentUserRole as AdminRole,
    );
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all admins',
    description: 'Retrieve a list of all admin users (super admin only)',
  })
  @ApiOkResponse({
    description: 'Admin list retrieved successfully',
    schema: {
      properties: {
        admins: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '5f8d0c12b9a7f64b3c8e1a82' },
              email: { type: 'string', example: 'admin@heallink.com' },
              name: { type: 'string', example: 'Admin User' },
              role: { type: 'string', example: 'admin' },
              adminRole: { type: 'string', example: 'super_admin' },
              permissions: {
                type: 'array',
                items: { type: 'string' },
                example: ['*'],
              },
              emailVerified: { type: 'boolean', example: true },
              isActive: { type: 'boolean', example: true },
              lastLogin: {
                type: 'string',
                example: '2023-06-15T10:30:45.123Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({
    description: 'Access denied. Super admin access only.',
  })
  async getAllAdmins(@Request() req: RequestWithUser) {
    // Only super admins can view all admins
    if (req.user.adminRole !== AdminRole.SUPER_ADMIN) {
      return { error: 'Access denied. Super admin access only.' };
    }
    return this.adminAuthService.getAllAdmins();
  }
}
