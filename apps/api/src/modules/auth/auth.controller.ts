import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiProperty,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';

// Response classes for Swagger documentation
class AuthTokenResponse {
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
      email: 'user@heallink.com',
      name: 'John Doe',
      role: 'user',
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

class OtpResponse {
  @ApiProperty({ description: 'One-time password sent status', example: true })
  sent: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'OTP sent successfully',
  })
  message: string;
}

class VerifyOtpResponse {
  @ApiProperty({ description: 'OTP verification status', example: true })
  verified: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'OTP verified successfully',
  })
  message: string;

  @ApiProperty({
    description: 'User tokens after successful verification',
    type: AuthTokenResponse,
    required: false,
  })
  tokens?: AuthTokenResponse;
}

@ApiTags('auth')
@ApiExtraModels(
  AuthTokenResponse,
  MessageResponse,
  OtpResponse,
  VerifyOtpResponse,
)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register new user',
    description: 'Create a new user account',
  })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: AuthTokenResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Registration failed' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Login successful',
    type: AuthTokenResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Refresh tokens',
    description:
      'Get new access and refresh tokens using a valid refresh token',
  })
  @ApiOkResponse({
    description: 'Tokens refreshed successfully',
    type: AuthTokenResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  async refreshToken(@Request() req) {
    const userId = req.user.id;
    const refreshToken = req.headers.authorization.replace('Bearer ', '');
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Logout user',
    description: 'Logout a user and invalidate their session',
  })
  @ApiOkResponse({
    description: 'Logout successful',
    type: MessageResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async logout(@Request() req) {
    await this.authService.logout(req.user.id);
    return { message: 'Logged out successfully' };
  }

  @Post('social-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Social login',
    description: 'Authenticate user with social provider credentials',
  })
  @ApiBody({ type: SocialLoginDto })
  @ApiOkResponse({
    description: 'Social login successful',
    type: AuthTokenResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid social credentials' })
  async socialLogin(@Body() socialLoginDto: SocialLoginDto) {
    const user = await this.authService.validateSocialLogin(socialLoginDto);
    return this.authService.login(user);
  }

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send OTP',
    description: "Send a one-time password to the user's phone or email",
  })
  @ApiBody({ type: SendOtpDto })
  @ApiOkResponse({
    description: 'OTP sent successfully',
    type: OtpResponse,
  })
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify OTP',
    description: 'Verify a one-time password and authenticate the user',
  })
  @ApiBody({ type: VerifyOtpDto })
  @ApiOkResponse({
    description: 'OTP verified successfully',
    type: VerifyOtpResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }
}
