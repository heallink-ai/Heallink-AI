import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
  Req,
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
} from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import {
  AdminLoginDto,
  AdminRegisterDto,
  AdminPasswordResetRequestDto,
  AdminPasswordResetDto,
  UpdateAdminRoleDto,
  ValidateTokenDto,
  InitialAdminSetupDto,
} from './dto/admin-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminRole } from '../users/entities/admin-user.entity';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { AllowedRoles } from './decorators/allowed-roles.decorator';
import { Request } from 'express';

// Import response DTOs
import {
  TokenResponse,
  MessageResponse,
  ValidateTokenResponse,
} from './dto/responses.dto';

// Define a type for the JWT authenticated request user
interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
    adminRole: AdminRole;
    permissions: string[];
  };
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
  async login(@Body() adminLoginDto: AdminLoginDto) {
    return this.adminAuthService.login(adminLoginDto);
  }

  @Post('initial-setup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Initial admin setup',
    description: 'Create the first super admin user when no admins exist',
  })
  @ApiBody({ type: InitialAdminSetupDto })
  @ApiCreatedResponse({
    description: 'Initial admin setup successful',
    type: TokenResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid setup key' })
  @ApiForbiddenResponse({ description: 'Initial setup already completed' })
  async initialSetup(@Body() setupDto: InitialAdminSetupDto) {
    return this.adminAuthService.registerInitialAdmin(setupDto);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AllowedRoles(AdminRole.SUPER_ADMIN, AdminRole.SYSTEM_ADMIN)
  @ApiOperation({
    summary: 'Register admin user',
    description: 'Create a new admin user with specified role',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: AdminRegisterDto })
  @ApiCreatedResponse({
    description: 'Admin user created',
    type: MessageResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  register(@Body() registerDto: AdminRegisterDto, @Req() req: RequestWithUser) {
    const creator = req.user;
    return this.adminAuthService.register(registerDto, creator.adminRole);
  }

  @Post('request-reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Send a password reset link to admin email',
  })
  @ApiBody({ type: AdminPasswordResetRequestDto })
  @ApiOkResponse({
    description: 'Reset link sent if email exists',
    type: MessageResponse,
  })
  requestReset(@Body() resetRequestDto: AdminPasswordResetRequestDto) {
    return this.adminAuthService.requestPasswordReset(resetRequestDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset admin password with valid token',
  })
  @ApiBody({ type: AdminPasswordResetDto })
  @ApiOkResponse({
    description: 'Password reset successful',
    type: MessageResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  resetPassword(@Body() resetDto: AdminPasswordResetDto) {
    return this.adminAuthService.resetPassword(resetDto);
  }

  @Post('verify-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify token',
    description: 'Verify if a token is valid',
  })
  @ApiBody({ type: ValidateTokenDto })
  @ApiOkResponse({
    description: 'Token validation result',
    type: ValidateTokenResponse,
  })
  verifyToken(@Body() validateTokenDto: ValidateTokenDto) {
    return this.adminAuthService.validateToken(validateTokenDto.token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout',
    description: 'Invalidate refresh token',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    description: 'Logout successful',
    type: MessageResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  logout(
    @Req() req: RequestWithUser,
    @Body('refreshToken') refreshToken: string,
  ) {
    const user = req.user;
    return this.adminAuthService.logout(user.sub, refreshToken);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh token',
    description: 'Get new access token using refresh token',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'New access token',
    type: TokenResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.adminAuthService.refreshTokens(refreshToken);
  }

  @Put('role')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AllowedRoles(AdminRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update admin role',
    description: 'Change role and permissions of an admin user',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: UpdateAdminRoleDto })
  @ApiOkResponse({
    description: 'Role updated successfully',
    type: MessageResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Admin user not found' })
  updateAdminRole(
    @Body() updateRoleDto: UpdateAdminRoleDto,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;
    return this.adminAuthService.updateAdminRole(updateRoleDto, user.adminRole);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @AllowedRoles(AdminRole.SUPER_ADMIN, AdminRole.SYSTEM_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all admin users',
    description: 'Retrieve a list of all admin users',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    description: 'List of admin users',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          name: { type: 'string' },
          adminRole: { type: 'string' },
          isActive: { type: 'boolean' },
          lastLogin: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  getAllAdmins() {
    return this.adminAuthService.getAllAdmins();
  }
}
