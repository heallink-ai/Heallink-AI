import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
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

export class MessageResponse {
  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message: string;
}

export class ValidateTokenResponse {
  @ApiProperty({ description: 'Token validity status', example: true })
  valid: boolean;
}
