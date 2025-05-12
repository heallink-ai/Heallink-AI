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

@Controller('auth/admin')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AdminLoginDto) {
    return this.adminAuthService.login(loginDto);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
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
  async requestPasswordReset(
    @Body() resetRequestDto: AdminPasswordResetRequestDto,
  ) {
    return this.adminAuthService.requestPasswordReset(resetRequestDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetDto: AdminPasswordResetDto) {
    return this.adminAuthService.resetPassword(resetDto);
  }

  @Post('verify-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() validateTokenDto: ValidateTokenDto) {
    return this.adminAuthService.validateToken(validateTokenDto.token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Request() req: RequestWithUser,
    @Body('refreshToken') refreshToken: string,
  ) {
    const userId = req.user.id;
    return this.adminAuthService.logout(userId, refreshToken);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    return this.adminAuthService.refreshTokens(refreshToken);
  }

  @Put('role')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
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
  async getAllAdmins(@Request() req: RequestWithUser) {
    // Only super admins can view all admins
    if (req.user.adminRole !== AdminRole.SUPER_ADMIN) {
      return { error: 'Access denied. Super admin access only.' };
    }
    return this.adminAuthService.getAllAdmins();
  }
}
