import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
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
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard";

// DTO imports
class PasswordResetRequestDto {
  @ApiProperty({
    description: "Email address of the user requesting password reset",
    example: "user@example.com",
  })
  email: string;
}

class PasswordResetDto {
  @ApiProperty({
    description: "Reset token from the email link",
    example: "1234567890abcdef",
  })
  token: string;

  @ApiProperty({
    description: "New password",
    example: "newSecurePassword123",
  })
  password: string;
}

class ResetResponseDto {
  @ApiProperty({
    description: "Operation success status",
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: "Response message",
    example: "Password reset email sent successfully",
  })
  message?: string;
}

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Add new password reset request endpoint
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Request password reset",
    description: "Request a password reset link to be sent to the user email",
  })
  @ApiBody({ type: PasswordResetRequestDto })
  @ApiOkResponse({
    description: "Password reset email sent",
    type: ResetResponseDto,
  })
  async requestPasswordReset(
    @Body() resetRequestDto: PasswordResetRequestDto
  ): Promise<ResetResponseDto> {
    await this.authService.requestPasswordReset(resetRequestDto.email);
    return {
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    };
  }

  // Add new password reset endpoint
  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Reset password",
    description: "Reset password using token received via email",
  })
  @ApiBody({ type: PasswordResetDto })
  @ApiOkResponse({
    description: "Password reset successful",
    type: ResetResponseDto,
  })
  @ApiUnauthorizedResponse({ description: "Invalid or expired token" })
  async resetPassword(
    @Body() resetDto: PasswordResetDto
  ): Promise<ResetResponseDto> {
    await this.authService.resetPassword(resetDto.token, resetDto.password);
    return {
      success: true,
      message: "Password has been reset successfully",
    };
  }
}
