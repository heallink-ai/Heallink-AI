import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Query,
  BadRequestException,
  UnsupportedMediaTypeException,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuditLogService } from './services/audit-log.service';
import { AuditAction, AuditLevel } from './schemas/audit-log.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import {
  UpdatePatientDto,
  ChangePatientPasswordDto,
  PatientStatusChangeDto,
  PatientSubscriptionChangeDto,
  AddAdminNoteDto,
} from './dto/update-patient.dto';
import { PatientQueryDto } from './dto/patient-query.dto';
import {
  BulkPatientActionDto,
  BulkPatientImportDto,
  BulkActionResultDto,
} from './dto/bulk-patient.dto';
import {
  PatientResponseDto,
  PatientListResponseDto,
  PatientStatsResponseDto,
  PatientDetailResponseDto,
  PatientActivityLogResponseDto,
} from './dto/patient-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from './schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { S3Service } from '../aws/s3.service';
import { memoryStorage } from 'multer';

// Define a type for the Multer file
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// Define a type for the authenticated request
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
    name?: string;
    role: UserRole;
    permissions?: string[];
  };
  ip: string;
}

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly auditLogService: AuditLogService,
    private readonly s3Service: S3Service,
  ) {}

  // ==================== PATIENT MANAGEMENT ENDPOINTS ====================

  @Post('patients')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create new patient',
    description: 'Create a new patient account with full profile information',
  })
  @ApiResponse({
    status: 201,
    description: 'Patient created successfully',
    type: PatientResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({
    status: 409,
    description: 'Patient with email already exists',
  })
  async createPatient(
    @Body() createPatientDto: CreatePatientDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<PatientResponseDto> {
    this.logger.log(
      `Admin ${req.user.email} creating patient: ${createPatientDto.email}`,
    );

    const patient = await this.usersService.createPatient(
      createPatientDto,
      req.user.id,
    );

    // Log audit trail
    await this.auditLogService.logUserCreated(
      patient.id,
      patient.email,
      patient.name,
      {
        actorUserId: req.user.id,
        actorUserEmail: req.user.email,
        actorUserName: req.user.name,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      createPatientDto,
    );

    return patient;
  }

  @Get('patients')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get all patients with filtering and search',
    description:
      'Retrieve paginated list of patients with advanced filtering, search, and sorting',
  })
  @ApiResponse({
    status: 200,
    description: 'Patients retrieved successfully',
    type: PatientListResponseDto,
  })
  async getPatients(
    @Query() query: PatientQueryDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<PatientListResponseDto> {
    this.logger.log(
      `Admin ${req.user.email} querying patients with filters:`,
      query,
    );
    return this.usersService.getPatients(query);
  }

  @Get('patients/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get patient statistics',
    description:
      'Retrieve comprehensive statistics about patients for dashboard',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    type: PatientStatsResponseDto,
  })
  async getPatientStats(
    @Request() req: AuthenticatedRequest,
  ): Promise<PatientStatsResponseDto> {
    this.logger.log(`Admin ${req.user.email} requesting patient statistics`);
    return this.usersService.getPatientStats();
  }

  @Get('patients/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get patient detail',
    description:
      'Retrieve detailed patient information including activity logs and metrics',
  })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({
    status: 200,
    description: 'Patient details retrieved successfully',
    type: PatientDetailResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async getPatientDetail(
    @Param('id') patientId: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<PatientDetailResponseDto> {
    this.logger.log(
      `Admin ${req.user.email} viewing patient detail: ${patientId}`,
    );
    return this.usersService.getPatientDetail(patientId);
  }

  @Patch('patients/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Update patient information',
    description: 'Update patient profile, status, and administrative settings',
  })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({
    status: 200,
    description: 'Patient updated successfully',
    type: PatientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async updatePatient(
    @Param('id') patientId: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<PatientResponseDto> {
    this.logger.log(`Admin ${req.user.email} updating patient: ${patientId}`);

    const previousData = await this.usersService.findOne(patientId);
    const updatedPatient = await this.usersService.updatePatient(
      patientId,
      updatePatientDto,
      req.user.id,
    );

    // Log audit trail
    await this.auditLogService.logUserUpdated(
      patientId,
      updatedPatient.email,
      updatedPatient.name,
      {
        actorUserId: req.user.id,
        actorUserEmail: req.user.email,
        actorUserName: req.user.name,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      previousData,
      updatePatientDto,
    );

    return updatedPatient;
  }

  @Patch('patients/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Change patient account status',
    description:
      'Suspend, reactivate, deactivate, or change patient account status',
  })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({
    status: 200,
    description: 'Patient status updated successfully',
    type: PatientResponseDto,
  })
  async changePatientStatus(
    @Param('id') patientId: string,
    @Body() statusChangeDto: PatientStatusChangeDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<PatientResponseDto> {
    this.logger.log(
      `Admin ${req.user.email} changing patient status: ${patientId} to ${statusChangeDto.accountStatus}`,
    );

    const updatedPatient = await this.usersService.changePatientStatus(
      patientId,
      statusChangeDto,
      req.user.id,
    );

    // Log appropriate audit event
    if (statusChangeDto.accountStatus === 'suspended') {
      await this.auditLogService.logUserSuspended(
        patientId,
        updatedPatient.email,
        updatedPatient.name,
        {
          actorUserId: req.user.id,
          actorUserEmail: req.user.email,
          actorUserName: req.user.name,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        },
        statusChangeDto.reason,
      );
    } else if (statusChangeDto.accountStatus === 'active') {
      await this.auditLogService.logUserReactivated(
        patientId,
        updatedPatient.email,
        updatedPatient.name,
        {
          actorUserId: req.user.id,
          actorUserEmail: req.user.email,
          actorUserName: req.user.name,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        },
        statusChangeDto.reason,
      );
    }

    return updatedPatient;
  }

  @Post('patients/:id/password-reset')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Reset patient password',
    description:
      'Generate new password or send password reset email to patient',
  })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({
    status: 200,
    description: 'Password reset initiated successfully',
  })
  async resetPatientPassword(
    @Param('id') patientId: string,
    @Body() passwordResetDto: ChangePatientPasswordDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<{ success: boolean; message: string }> {
    this.logger.log(
      `Admin ${req.user.email} resetting password for patient: ${patientId}`,
    );

    const patient = await this.usersService.findOne(patientId);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    await this.usersService.resetPatientPassword(patientId, passwordResetDto);

    // Log audit trail
    await this.auditLogService.logPasswordReset(
      patientId,
      patient.email || 'unknown@email.com',
      patient.name || 'Unknown User',
      {
        actorUserId: req.user.id,
        actorUserEmail: req.user.email,
        actorUserName: req.user.name,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      'admin_initiated',
    );

    return {
      success: true,
      message: passwordResetDto.sendResetEmail
        ? 'Password reset email sent successfully'
        : 'Password updated successfully',
    };
  }

  @Post('patients/:id/impersonate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Impersonate patient',
    description:
      'Start admin impersonation session for patient (high security action)',
  })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Impersonation session started' })
  async impersonatePatient(
    @Param('id') patientId: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<{ impersonationToken: string; expiresAt: Date }> {
    this.logger.warn(
      `Admin ${req.user.email} starting impersonation of patient: ${patientId}`,
    );

    // Check if admin has impersonation permission
    if (
      !req.user.permissions?.includes('user_impersonation') &&
      req.user.role !== 'admin'
    ) {
      throw new ForbiddenException(
        'Insufficient permissions for user impersonation',
      );
    }

    const patient = await this.usersService.findOne(patientId);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const impersonationData = await this.usersService.startImpersonation(
      patientId,
      req.user.id,
    );

    // Log audit trail
    await this.auditLogService.logImpersonationStarted(
      patientId,
      patient.email || 'unknown@email.com',
      patient.name || 'Unknown User',
      {
        actorUserId: req.user.id,
        actorUserEmail: req.user.email,
        actorUserName: req.user.name,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    );

    return impersonationData;
  }

  @Post('patients/:id/sessions/terminate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Terminate patient sessions',
    description: 'Force logout patient from all devices',
  })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Sessions terminated successfully' })
  async terminatePatientSessions(
    @Param('id') patientId: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<{ success: boolean; terminatedSessions: number }> {
    this.logger.log(
      `Admin ${req.user.email} terminating sessions for patient: ${patientId}`,
    );

    const result = await this.usersService.terminatePatientSessions(patientId);

    const patient = await this.usersService.findOne(patientId);

    // Log audit trail
    await this.auditLogService.log(
      {
        action: AuditAction.USER_ALL_SESSIONS_TERMINATED,
        level: AuditLevel.HIGH,
        description: `All sessions terminated for patient ${patient.email}`,
        subjectUserId: patientId,
        subjectUserEmail: patient.email,
        subjectUserName: patient.name,
        metadata: { terminatedSessions: result.terminatedSessions },
        tags: ['security', 'session_management'],
      },
      {
        actorUserId: req.user.id,
        actorUserEmail: req.user.email,
        actorUserName: req.user.name,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    );

    return result;
  }

  @Post('patients/:id/notes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Add admin note to patient',
    description: 'Add internal administrative note to patient record',
  })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({ status: 201, description: 'Note added successfully' })
  async addAdminNote(
    @Param('id') patientId: string,
    @Body() noteDto: AddAdminNoteDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<{ success: boolean; noteId: string }> {
    this.logger.log(
      `Admin ${req.user.email} adding note to patient: ${patientId}`,
    );

    const result = await this.usersService.addAdminNote(
      patientId,
      noteDto,
      req.user.id,
    );

    const patient = await this.usersService.findOne(patientId);

    // Log audit trail
    await this.auditLogService.log(
      {
        action: AuditAction.ADMIN_NOTE_ADDED,
        level: AuditLevel.LOW,
        description: `Admin note added to patient ${patient.email}`,
        subjectUserId: patientId,
        subjectUserEmail: patient.email,
        subjectUserName: patient.name,
        metadata: {
          noteCategory: noteDto.category,
          isPrivate: noteDto.isPrivate,
        },
        tags: ['admin_note', 'patient_management'],
      },
      {
        actorUserId: req.user.id,
        actorUserEmail: req.user.email,
        actorUserName: req.user.name,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    );

    return result;
  }

  @Get('patients/:id/activity-log')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get patient activity log',
    description: 'Retrieve audit trail and activity history for patient',
  })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of log entries to return',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Number of log entries to skip',
  })
  @ApiResponse({
    status: 200,
    description: 'Activity log retrieved successfully',
    type: [PatientActivityLogResponseDto],
  })
  async getPatientActivityLog(
    @Param('id') patientId: string,
    @Query('limit') limit: number = 50,
    @Query('offset') offset: number = 0,
    @Request() req: AuthenticatedRequest,
  ): Promise<PatientActivityLogResponseDto[]> {
    this.logger.log(
      `Admin ${req.user.email} viewing activity log for patient: ${patientId}`,
    );

    const auditLogs = await this.auditLogService.getUserAuditLogs(
      patientId,
      limit,
      offset,
    );

    // Map audit logs to patient activity log response format
    return auditLogs.map((log) => ({
      id: log._id,
      action: log.action,
      description: log.description,
      timestamp: new Date(), // Use current date for now, will be fixed later
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      location: log.country
        ? `${log.city}, ${log.region}, ${log.country}`
        : undefined,
      outcome: 'success', // Default to success, could be enhanced later
      metadata: log.metadata,
    }));
  }

  // ==================== BULK OPERATIONS ====================

  @Post('patients/bulk-action')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Perform bulk action on patients',
    description:
      'Execute bulk operations like suspend, activate, delete, export on multiple patients',
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk action completed',
    type: BulkActionResultDto,
  })
  async bulkPatientAction(
    @Body() bulkActionDto: BulkPatientActionDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<BulkActionResultDto> {
    this.logger.log(
      `Admin ${req.user.email} performing bulk action: ${bulkActionDto.action} on ${bulkActionDto.patientIds.length} patients`,
    );

    const result = await this.usersService.performBulkAction(
      bulkActionDto,
      req.user.id,
    );

    // Log bulk audit trail
    await this.auditLogService.logBulkAction(
      bulkActionDto.action,
      bulkActionDto.patientIds,
      {
        actorUserId: req.user.id,
        actorUserEmail: req.user.email,
        actorUserName: req.user.name,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
      { successCount: result.successCount, failureCount: result.failureCount },
      bulkActionDto.reason,
    );

    return result;
  }

  @Post('patients/import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Import patients from CSV/JSON data',
    description:
      'Bulk import patient data with validation and duplicate handling',
  })
  @ApiResponse({
    status: 201,
    description: 'Import completed',
    type: BulkActionResultDto,
  })
  async importPatients(
    @Body() importDto: BulkPatientImportDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<BulkActionResultDto> {
    this.logger.log(
      `Admin ${req.user.email} importing ${importDto.patients.length} patients`,
    );

    const result = await this.usersService.importPatients(
      importDto,
      req.user.id,
    );

    // Log import audit trail
    await this.auditLogService.log(
      {
        action: AuditAction.USER_DATA_IMPORTED,
        level: AuditLevel.MEDIUM,
        description: `Bulk patient import: ${importDto.patients.length} records processed`,
        subjectUserId: 'bulk_import',
        subjectUserEmail: 'multiple_users',
        subjectUserName: 'multiple_users',
        metadata: {
          totalRecords: importDto.patients.length,
          imported: result.importSummary?.imported || 0,
          skipped: result.importSummary?.skipped || 0,
          errors: result.importSummary?.errors || 0,
        },
        tags: ['bulk_import', 'patient_management'],
      },
      {
        actorUserId: req.user.id,
        actorUserEmail: req.user.email,
        actorUserName: req.user.name,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    );

    return result;
  }

  // ==================== LEGACY ENDPOINTS (for backward compatibility) ====================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create user (legacy)', deprecated: true })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (legacy)', deprecated: true })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID (legacy)', deprecated: true })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user (legacy)', deprecated: true })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user (legacy)', deprecated: true })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // ==================== AVATAR UPLOAD ENDPOINTS ====================

  @Post('profile/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload current user avatar' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadProfileAvatar(
    @Request() req: AuthenticatedRequest,
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
      const s3Key = `avatars/${req.user.id}/${fileName}`;

      await this.s3Service.uploadFile(s3Key, file.buffer, file.mimetype);
      const avatarUrl = await this.s3Service.getSignedUrl(s3Key, 86400);
      await this.usersService.update(req.user.id, { avatarUrl: s3Key });

      return { avatarUrl };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload avatar';
      throw new InternalServerErrorException(
        `Failed to upload avatar: ${errorMessage}`,
      );
    }
  }

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Upload avatar for specific user' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'User ID' })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: MulterFile,
    @Request() req: AuthenticatedRequest,
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
      await this.usersService.update(id, { avatarUrl: s3Key });

      return { avatarUrl };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload avatar';
      throw new InternalServerErrorException(
        `Failed to upload avatar: ${errorMessage}`,
      );
    }
  }
}
