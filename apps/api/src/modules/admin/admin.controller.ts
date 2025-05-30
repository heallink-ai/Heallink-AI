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
  ApiConsumes,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto, UpdateAdminRoleDto } from './dto/update-admin.dto';
import { AdminQueryDto } from './dto/admin-query.dto';
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
}
