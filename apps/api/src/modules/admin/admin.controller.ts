import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UnsupportedMediaTypeException,
  InternalServerErrorException,
  Request,
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto, UpdateAdminRoleDto } from './dto/update-admin.dto';
import { AdminQueryDto } from './dto/admin-query.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ProfileUpdateDto } from './dto/profile-update.dto';
import { 
  AdminResponseDto, 
  AdminListResponseDto, 
  AdminStatsResponseDto,
  BulkActionResponseDto
} from './dto/admin-response.dto';
import { AdminPermissions, AdminPermissionsGuard } from './guards/admin-permissions.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from '../aws/s3.service';
import { memoryStorage } from 'multer';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@ApiTags('admin')
@ApiBearerAuth('JWT-auth')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard, AdminPermissionsGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    private readonly adminService: AdminService,
    private readonly s3Service: S3Service,
  ) {
    this.logger.log('AdminController initialized');
  }

  // Debug endpoint to verify authentication
  @Get('auth-test')
  async testAuth(@Request() req: any) {
    this.logger.debug(
      `Auth test endpoint called. User: ${JSON.stringify(req.user)}`,
    );
    return {
      message: 'Authentication successful',
      user: req.user,
      headers: {
        authorization: req.headers.authorization ? 'Present' : 'Missing',
      },
    };
  }

  // Profile management endpoints
  @Get('profile')
  @ApiOperation({
    summary: 'Get current admin profile',
    description: 'Retrieve the authenticated admin user profile',
  })
  @ApiOkResponse({ 
    description: 'Profile retrieved successfully',
    type: AdminResponseDto
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getCurrentProfile(@Request() req: any): Promise<AdminResponseDto> {
    this.logger.debug(`Getting profile for admin: ${req.user.id}`);
    return this.adminService.findAdminById(req.user.id);
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Update current admin profile',
    description: 'Update the authenticated admin user profile',
  })
  @ApiOkResponse({ 
    description: 'Profile updated successfully',
    type: AdminResponseDto
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async updateCurrentProfile(
    @Request() req: any,
    @Body() profileUpdateDto: ProfileUpdateDto,
  ): Promise<AdminResponseDto> {
    this.logger.debug(`Updating profile for admin: ${req.user.id}`);
    return this.adminService.updateAdmin(req.user.id, profileUpdateDto);
  }

  @Post('change-password')
  @ApiOperation({
    summary: 'Change admin password',
    description: 'Change the authenticated admin password',
  })
  @ApiOkResponse({ 
    description: 'Password changed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Password changed successfully' }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid current password or weak new password' })
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    this.logger.debug(`Changing password for admin: ${req.user.id}`);
    await this.adminService.changeAdminPassword(
      req.user.id, 
      changePasswordDto.currentPassword, 
      changePasswordDto.newPassword
    );
    return { 
      success: true, 
      message: 'Password changed successfully' 
    };
  }

  @Post('profile/avatar')
  @ApiOperation({
    summary: 'Upload current admin avatar',
    description: 'Upload a profile image for the authenticated admin user',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image file (JPG, PNG, GIF only)',
        },
      },
    },
  })
  @ApiCreatedResponse({ 
    description: 'Avatar uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        avatarUrl: { type: 'string', example: 'avatars/user123/abc-123.jpg' },
        message: { type: 'string', example: 'Avatar uploaded successfully' }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid file' })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async uploadCurrentAdminAvatar(
    @Request() req: any,
    @UploadedFile() file: MulterFile,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      throw new UnsupportedMediaTypeException('Only image files are allowed');
    }

    try {
      const adminId = req.user.id;
      const fileExtension = extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const s3Key = `avatars/${adminId}/${fileName}`;

      await this.s3Service.uploadFile(s3Key, file.buffer, file.mimetype);
      
      const updateData = { avatarUrl: s3Key } as ProfileUpdateDto;
      await this.adminService.updateAdmin(adminId, updateData);

      return { 
        success: true,
        avatarUrl: s3Key,
        message: 'Avatar uploaded successfully' 
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload avatar';
      throw new InternalServerErrorException(
        `Failed to upload avatar: ${errorMessage}`,
      );
    }
  }

  @Get('avatar/*')
  @ApiOperation({
    summary: 'Get avatar signed URL',
    description: 'Get a signed URL for an avatar image stored in S3',
  })
  @ApiParam({ 
    name: 'key', 
    description: 'S3 key for the avatar image (path after /avatar/)',
    example: 'avatars/user123/abc-123.jpg'
  })
  @ApiOkResponse({ 
    description: 'Signed URL retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        url: { 
          type: 'string', 
          example: 'https://s3.amazonaws.com/bucket/avatars/user123/abc-123.jpg?signature=...' 
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Avatar not found' })
  async getAvatarSignedUrl(@Request() req: any) {
    try {
      // Extract the key from the path after /avatar/
      const key = req.path.replace('/api/v1/admin/avatar/', '');
      const signedUrl = await this.s3Service.getSignedUrl(key, 3600); // 1 hour expiry
      return { url: signedUrl };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to get avatar URL';
      throw new InternalServerErrorException(
        `Failed to get avatar URL: ${errorMessage}`,
      );
    }
  }

  @Post()
  @AdminPermissions({ 
    permissions: ['admin_management', 'user_management'],
    requireAll: false 
  })
  @ApiOperation({
    summary: 'Create new admin user',
    description: 'Creates a new admin user with specified details',
  })
  @ApiCreatedResponse({ 
    description: 'Admin user created successfully',
    type: AdminResponseDto
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @Request() req: any,
  ): Promise<AdminResponseDto> {
    this.logger.debug(`Creating admin user: ${JSON.stringify(createAdminDto)}`);
    this.logger.debug(`Request user: ${JSON.stringify(req.user)}`);
    return this.adminService.createAdmin(createAdminDto);
  }

  @Get()
  @AdminPermissions({ 
    permissions: ['admin_management', 'read_only_access'],
    requireAll: false 
  })
  @ApiOperation({
    summary: 'Get all admin users',
    description:
      'Retrieve a list of all admin users with pagination and filtering',
  })
  @ApiOkResponse({ 
    description: 'List of admin users retrieved successfully',
    type: AdminListResponseDto
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async findAllAdmins(@Query() query: AdminQueryDto, @Request() req: any): Promise<AdminListResponseDto> {
    this.logger.debug(
      `Finding all admins with query: ${JSON.stringify(query)}`,
    );
    this.logger.debug(`Request user: ${JSON.stringify(req.user)}`);
    this.logger.debug(
      `Auth header: ${req.headers.authorization ? 'Present' : 'Missing'}`,
    );

    // Log more details about the authorization header
    if (req.headers.authorization) {
      const [type, token] = req.headers.authorization.split(' ');
      this.logger.debug(
        `Auth type: ${type}, Token starts with: ${token ? token.substring(0, 10) + '...' : 'null'}`,
      );
    }

    return this.adminService.findAllAdmins(query);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get admin statistics',
    description: 'Retrieve stats and metrics about admin users',
  })
  @ApiOkResponse({ description: 'Admin statistics retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getAdminStats(@Request() req: any) {
    this.logger.debug(`Getting admin stats. User: ${JSON.stringify(req.user)}`);
    return this.adminService.getAdminStats();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get admin by ID',
    description: 'Retrieve a specific admin user by their ID',
  })
  @ApiParam({ name: 'id', description: 'Admin user ID' })
  @ApiOkResponse({ description: 'Admin user retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiBadRequestResponse({ description: 'Invalid ID' })
  async findAdminById(@Param('id') id: string, @Request() req: any) {
    this.logger.debug(
      `Finding admin by ID: ${id}. User: ${JSON.stringify(req.user)}`,
    );
    return this.adminService.findAdminById(id);
  }

  @Patch(':id')
  @AdminPermissions({ 
    permissions: ['admin_management'],
    requireAll: true 
  })
  @ApiOperation({
    summary: 'Update admin',
    description: 'Update an existing admin user details',
  })
  @ApiParam({ name: 'id', description: 'Admin user ID' })
  @ApiOkResponse({ 
    description: 'Admin user updated successfully',
    type: AdminResponseDto
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiBadRequestResponse({ description: 'Invalid input data or ID' })
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    return this.adminService.updateAdmin(id, updateAdminDto);
  }

  @Patch(':id/role')
  @AdminPermissions({ 
    permissions: ['admin_management'],
    requireAll: true 
  })
  @ApiOperation({
    summary: 'Update admin role',
    description: 'Update an admin user\'s role and permissions',
  })
  @ApiParam({ name: 'id', description: 'Admin user ID' })
  @ApiOkResponse({ 
    description: 'Admin role updated successfully',
    type: AdminResponseDto
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiBadRequestResponse({ description: 'Invalid input data or ID' })
  async updateAdminRole(
    @Param('id') id: string,
    @Body() updateAdminRoleDto: UpdateAdminRoleDto,
  ): Promise<AdminResponseDto> {
    return this.adminService.updateAdminRole(
      id, 
      updateAdminRoleDto.adminRole,
      updateAdminRoleDto.permissions
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete admin',
    description: 'Delete an admin user by ID',
  })
  @ApiParam({ name: 'id', description: 'Admin user ID' })
  @ApiOkResponse({ description: 'Admin user deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiBadRequestResponse({
    description: 'Invalid ID or cannot delete last admin',
  })
  async deleteAdmin(@Param('id') id: string) {
    await this.adminService.deleteAdmin(id);
    return { message: 'Admin deleted successfully' };
  }

  @Patch(':id/toggle-status')
  @ApiOperation({
    summary: 'Toggle admin status',
    description: 'Activate or deactivate an admin user',
  })
  @ApiParam({ name: 'id', description: 'Admin user ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'boolean',
          description: 'True to activate, false to deactivate',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Admin status toggled successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async toggleAdminStatus(
    @Param('id') id: string,
    @Body('status') status: boolean,
  ) {
    return this.adminService.toggleAdminStatus(id, status);
  }

  @Post(':id/avatar')
  @ApiOperation({
    summary: 'Upload admin avatar',
    description: 'Upload a profile image for an admin user',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'Admin user ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image file (JPG, PNG, GIF only)',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Avatar uploaded successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiBadRequestResponse({ description: 'Invalid file or ID' })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async uploadAdminAvatar(
    @Param('id') id: string,
    @UploadedFile() file: MulterFile,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      throw new UnsupportedMediaTypeException('Only image files are allowed');
    }

    try {
      const fileExtension = extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const s3Key = `avatars/${id}/${fileName}`;

      await this.s3Service.uploadFile(s3Key, file.buffer, file.mimetype);
      const avatarUrl = await this.s3Service.getSignedUrl(s3Key, 86400);

      const updateData = { avatarUrl: s3Key } as UpdateAdminDto;
      await this.adminService.updateAdmin(id, updateData);

      return { avatarUrl };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload avatar';
      throw new InternalServerErrorException(
        `Failed to upload avatar: ${errorMessage}`,
      );
    }
  }

  @Post('bulk-action')
  @ApiOperation({
    summary: 'Perform bulk admin actions',
    description: 'Perform actions on multiple admin users at once',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['delete', 'toggle-status'],
          description: 'The action to perform',
        },
        adminIds: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Array of admin IDs to operate on',
        },
        status: {
          type: 'boolean',
          description: 'Status to set (required for toggle-status action)',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Bulk action completed successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async bulkAction(
    @Body()
    body: {
      action: 'delete' | 'toggle-status';
      adminIds: string[];
      status?: boolean;
    },
  ) {
    const { action, adminIds, status } = body;

    if (action === 'delete') {
      const results = await Promise.allSettled(
        adminIds.map((id) => this.adminService.deleteAdmin(id)),
      );
      return {
        message: 'Bulk delete completed',
        success: results.filter((r) => r.status === 'fulfilled').length,
        failed: results.filter((r) => r.status === 'rejected').length,
      };
    }

    if (action === 'toggle-status' && status !== undefined) {
      const results = await Promise.allSettled(
        adminIds.map((id) => this.adminService.toggleAdminStatus(id, status)),
      );
      return {
        message: 'Bulk status update completed',
        success: results.filter((r) => r.status === 'fulfilled').length,
        failed: results.filter((r) => r.status === 'rejected').length,
      };
    }

    throw new BadRequestException('Invalid bulk action');
  }

  @Post(':id/reset-password')
  @ApiOperation({
    summary: 'Reset admin password',
    description: 'Generate a new temporary password for an admin user and send it via email',
  })
  @ApiParam({ name: 'id', description: 'Admin user ID' })
  @ApiOkResponse({ 
    description: 'Password reset email sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Password reset email sent successfully'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  async resetAdminPassword(@Param('id') id: string) {
    await this.adminService.resetAdminPassword(id);
    return { message: 'Password reset email sent successfully' };
  }
}
