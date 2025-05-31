import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  User,
  AuthProvider,
  UserDocument,
  AccountStatus,
} from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import {
  UpdatePatientDto,
  PatientStatusChangeDto,
  ChangePatientPasswordDto,
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
} from './dto/patient-response.dto';
import { randomBytes } from 'crypto';
import { S3Service } from '../aws/s3.service';
import { UserRole } from './schemas/user.schema';

// Interface defined outside the class to avoid scoping issues
export interface UserWithFlags extends UserDocument {
  isNewUser?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly s3Service: S3Service,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // Either email or phone must be provided
    if (!createUserDto.email && !createUserDto.phone) {
      throw new ConflictException('Either email or phone must be provided');
    }

    // Check if user with email or phone already exists
    if (createUserDto.email) {
      const existingUserWithEmail = await this.userModel
        .findOne({ email: createUserDto.email })
        .exec();
      if (existingUserWithEmail) {
        throw new ConflictException('User with this email already exists');
      }
    }

    if (createUserDto.phone) {
      const existingUserWithPhone = await this.userModel
        .findOne({ phone: createUserDto.phone })
        .exec();
      if (existingUserWithPhone) {
        throw new ConflictException('User with this phone already exists');
      }
    }

    // Set default providers array if not provided
    if (!createUserDto.providers) {
      createUserDto.providers = [AuthProvider.LOCAL];
    }

    // Create and return the user
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    console.log({ id });
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid user ID: ${id}`);
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // If user has an avatarUrl that points to S3, generate a presigned URL
    if (user.avatarUrl && user.avatarUrl.startsWith('avatars/')) {
      try {
        // Generate presigned URL valid for 24 hours
        const signedUrl = await this.s3Service.getSignedUrl(
          user.avatarUrl,
          86400,
        );
        // We don't want to modify the actual document, so we create a new object
        const userWithSignedUrl = user.toObject();
        userWithSignedUrl.avatarUrl = signedUrl;
        return userWithSignedUrl as UserDocument;
      } catch (error) {
        console.error('Error generating presigned URL for avatar:', error);
        // If there's an error, continue with the original URL
      }
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByPhone(phone: string): Promise<UserDocument | null> {
    if (!phone) {
      return null; // Return null if phone is undefined or empty
    }
    return this.userModel.findOne({ phone }).exec();
  }

  async findByProvider(
    provider: AuthProvider,
    providerId: string,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        accounts: {
          $elemMatch: {
            provider,
            providerId,
          },
        },
      })
      .exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // If user has an avatarUrl that points to S3, generate a presigned URL
    if (updatedUser.avatarUrl && updatedUser.avatarUrl.startsWith('avatars/')) {
      try {
        // Generate presigned URL valid for 24 hours
        const signedUrl = await this.s3Service.getSignedUrl(
          updatedUser.avatarUrl,
          86400,
        );
        // We don't want to modify the actual document, so we create a new object
        const userWithSignedUrl = updatedUser.toObject();
        userWithSignedUrl.avatarUrl = signedUrl;
        return userWithSignedUrl as UserDocument;
      } catch (error) {
        console.error('Error generating presigned URL for avatar:', error);
        // If there's an error, continue with the original URL
      }
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { refreshToken }).exec();
  }

  /**
   * Create a verification token for a user and set expiry date
   * @param userId The ID of the user to create a token for
   * @returns The generated verification token
   */
  async createEmailVerificationToken(userId: string): Promise<string> {
    // Generate a random verification token
    const token = randomBytes(32).toString('hex');

    // Set expiry to 24 hours from now
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);

    // Update the user with the verification token
    await this.userModel
      .updateOne(
        { _id: userId },
        {
          verificationToken: token,
          verificationTokenExpiry: expiryDate,
        },
      )
      .exec();

    return token;
  }

  /**
   * Verify a user's email using the verification token
   * @param token The verification token to validate
   * @returns The verified user document or null if token is invalid
   */
  async verifyEmail(token: string): Promise<UserDocument | null> {
    // Find the user with this token and make sure it's not expired
    const user = await this.userModel
      .findOne({
        verificationToken: token,
        verificationTokenExpiry: { $gt: new Date() },
      })
      .exec();

    if (!user) {
      return null;
    }

    // Update user as verified and clear the token
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;

    // Save the updated user
    await user.save();

    return user;
  }

  async validateUserExistenceByEmailOrPhone(
    email?: string,
    phone?: string,
  ): Promise<UserDocument | null> {
    const query: Record<string, string> = {};

    if (email) {
      query.email = email;
    }

    if (phone) {
      query.phone = phone;
    }

    if (Object.keys(query).length === 0) {
      return null;
    }

    // Define the correct type for the filters array
    const filters: Array<{ email?: string; phone?: string }> = [];
    if (email) filters.push({ email });
    if (phone) filters.push({ phone });

    return this.userModel.findOne({ $or: filters }).exec();
  }

  async findByIdOrCreate(providerData: {
    provider: AuthProvider;
    providerId: string;
    email?: string;
    name?: string;
    phone?: string;
  }): Promise<UserWithFlags> {
    let isNewUser = false;

    // First try to find user by provider and providerId
    let user = await this.findByProvider(
      providerData.provider,
      providerData.providerId,
    );

    // If not found and email is provided, try to find by email
    if (!user && providerData.email) {
      user = await this.findByEmail(providerData.email);
    }

    // If not found and phone is provided, try to find by phone
    if (!user && providerData.phone) {
      user = await this.findByPhone(providerData.phone);
    }

    // If user exists, update with provider info
    if (user) {
      // Check if this provider is already in the accounts array
      const hasProvider = user.accounts?.some(
        (account) =>
          account.provider === providerData.provider &&
          account.providerId === providerData.providerId,
      );

      if (!hasProvider) {
        // If not, add the provider to the accounts array
        await this.userModel
          .updateOne(
            { _id: user._id },
            {
              $push: {
                accounts: {
                  provider: providerData.provider,
                  providerId: providerData.providerId,
                },
              },
              $addToSet: { providers: providerData.provider },
            },
          )
          .exec();

        // Refresh the user object
        user = await this.userModel.findById(user._id).exec();
      }
    } else {
      // Create new user with provider info
      isNewUser = true;

      const newUser: CreateUserDto = {
        name: providerData.name,
        email: providerData.email,
        phone: providerData.phone,
        emailVerified: !!providerData.email, // Emails from OAuth providers are assumed to be verified
        phoneVerified: false,
        role: UserRole.USER,
        providers: [providerData.provider],
        accounts: [
          {
            provider: providerData.provider,
            providerId: providerData.providerId,
          },
        ],
      };

      user = await this.create(newUser);
    }

    // Add isNewUser flag before returning
    (user as UserWithFlags).isNewUser = isNewUser;
    return user as UserWithFlags;
  }

  async findByResetToken(resetToken: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        resetToken,
        resetTokenExpiry: { $gt: new Date() },
      })
      .exec();
  }

  /**
   * Find users with reset tokens
   */
  async findUsersWithResetToken(): Promise<UserDocument[]> {
    return this.userModel
      .find({
        resetToken: { $ne: null },
        resetTokenExpiry: { $ne: null },
      })
      .exec();
  }

  /**
   * Find a user by verification token
   */
  async findByVerificationToken(token: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        verificationToken: token,
        verificationTokenExpiry: { $gt: new Date() },
      })
      .exec();
  }

  // ==================== PATIENT MANAGEMENT METHODS ====================

  /**
   * Create a new patient
   */
  async createPatient(
    createPatientDto: CreatePatientDto,
    adminId: string,
  ): Promise<PatientResponseDto> {
    // Check if email already exists
    if (createPatientDto.email) {
      const existingUser = await this.userModel
        .findOne({ email: createPatientDto.email })
        .exec();
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Create patient user data
    const userData = {
      ...createPatientDto,
      role: UserRole.USER,
      providers: [AuthProvider.LOCAL],
      accountStatus: AccountStatus.PENDING_VERIFICATION,
      invitedBy: adminId,
      invitedAt: new Date(),
    };

    const patient = new this.userModel(userData);
    const savedPatient = await patient.save();
    return this.mapUserToPatientResponse(savedPatient);
  }

  /**
   * Get patients with filtering and pagination
   */
  async getPatients(query: PatientQueryDto): Promise<PatientListResponseDto> {
    const {
      page = 1,
      limit = 25,
      search,
      searchFields = ['name', 'email', 'phone'],
      sortBy = 'createdAt',
      sortOrder = 'desc',
      // Client-side parameters (not database fields) - exclude from DB query
      exportFields,
      includePII,
      ...filters
    } = query;

    // Note: exportFields and includePII are extracted but not used in DB query
    // They are client-side parameters for response formatting only
    
    // Build MongoDB query
    const mongoQuery: any = { role: UserRole.USER };

    // Add search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const searchConditions = searchFields.map((field) => ({
        [field]: searchRegex,
      }));
      mongoQuery.$or = searchConditions;
    }

    // Add database filters only (exclude client-side parameters)
    const databaseFields = [
      'accountStatus',
      'insuranceStatus', 
      'subscriptionPlan',
      'emailVerified',
      'phoneVerified',
      'twoFactorEnabled',
      'createdAfter',
      'createdBefore',
      'lastLoginAfter', 
      'lastLoginBefore',
      'inactiveDays',
      'country',
      'state',
      'city',
      'minAge',
      'maxAge',
      'insuranceProvider',
      'hasAppointments',
      'hasMessages',
      'invitationStatus'
    ];

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && databaseFields.includes(key)) {
        mongoQuery[key] = value;
      }
    });

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute queries
    const [patients, total] = await Promise.all([
      this.userModel
        .find(mongoQuery)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(mongoQuery).exec(),
    ]);

    console.log({ patients, total });

    return {
      patients: patients.map((patient) =>
        this.mapUserToPatientResponse(patient),
      ),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get patient statistics
   */
  async getPatientStats(): Promise<PatientStatsResponseDto> {
    const totalPatients = await this.userModel
      .countDocuments({ role: UserRole.USER })
      .exec();
    const activePatients = await this.userModel
      .countDocuments({
        role: UserRole.USER,
        accountStatus: AccountStatus.ACTIVE,
      })
      .exec();
    const suspendedPatients = await this.userModel
      .countDocuments({
        role: UserRole.USER,
        accountStatus: AccountStatus.SUSPENDED,
      })
      .exec();
    const deactivatedPatients = await this.userModel
      .countDocuments({
        role: UserRole.USER,
        accountStatus: AccountStatus.DEACTIVATED,
      })
      .exec();
    const pendingVerificationPatients = await this.userModel
      .countDocuments({
        role: UserRole.USER,
        accountStatus: AccountStatus.PENDING_VERIFICATION,
      })
      .exec();

    // Calculate recently created (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentlyCreated = await this.userModel
      .countDocuments({
        role: UserRole.USER,
        createdAt: { $gte: thirtyDaysAgo },
      })
      .exec();

    const recentlyActive = await this.userModel
      .countDocuments({
        role: UserRole.USER,
        lastLogin: { $gte: thirtyDaysAgo },
      })
      .exec();

    return {
      totalPatients,
      activePatients,
      suspendedPatients,
      deactivatedPatients,
      pendingVerificationPatients,
      recentlyCreated,
      recentlyActive,
    };
  }

  /**
   * Get detailed patient information
   */
  async getPatientDetail(patientId: string): Promise<PatientDetailResponseDto> {
    const patient = await this.findOne(patientId);
    if (patient.role !== UserRole.USER) {
      throw new BadRequestException('User is not a patient');
    }
    return this.mapUserToPatientResponse(patient) as PatientDetailResponseDto;
  }

  /**
   * Update patient information
   */
  async updatePatient(
    patientId: string,
    updatePatientDto: UpdatePatientDto,
    adminId: string,
  ): Promise<PatientResponseDto> {
    const updatedPatient = await this.update(patientId, updatePatientDto);
    return this.mapUserToPatientResponse(updatedPatient);
  }

  /**
   * Change patient account status
   */
  async changePatientStatus(
    patientId: string,
    statusChangeDto: PatientStatusChangeDto,
    adminId: string,
  ): Promise<PatientResponseDto> {
    const updateData: any = {
      accountStatus: statusChangeDto.accountStatus,
    };

    if (statusChangeDto.accountStatus === AccountStatus.SUSPENDED) {
      updateData.suspensionReason = statusChangeDto.reason;
      updateData.suspendedAt = new Date();
      updateData.suspendedBy = adminId;
    } else if (statusChangeDto.accountStatus === AccountStatus.DEACTIVATED) {
      updateData.deactivatedAt = new Date();
      updateData.deactivatedBy = adminId;
    }

    const updatedPatient = await this.update(patientId, updateData);
    return this.mapUserToPatientResponse(updatedPatient);
  }

  /**
   * Reset patient password
   */
  async resetPatientPassword(
    patientId: string,
    passwordResetDto: ChangePatientPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    // For now, just return success - password reset logic would be implemented here
    return {
      success: true,
      message: passwordResetDto.sendResetEmail
        ? 'Password reset email sent successfully'
        : 'Password updated successfully',
    };
  }

  /**
   * Start admin impersonation session
   */
  async startImpersonation(
    patientId: string,
    adminId: string,
  ): Promise<{ impersonationToken: string; expiresAt: Date }> {
    const impersonationToken = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    return {
      impersonationToken,
      expiresAt,
    };
  }

  /**
   * Terminate all patient sessions
   */
  async terminatePatientSessions(
    patientId: string,
  ): Promise<{ success: boolean; terminatedSessions: number }> {
    // For now, return mock data - actual session termination would be implemented here
    return {
      success: true,
      terminatedSessions: 2,
    };
  }

  /**
   * Add admin note to patient
   */
  async addAdminNote(
    patientId: string,
    noteDto: AddAdminNoteDto,
    adminId: string,
  ): Promise<{ success: boolean; noteId: string }> {
    const noteId = new Types.ObjectId().toString();

    const adminNote = {
      _id: noteId,
      note: noteDto.note,
      category: noteDto.category,
      isPrivate: noteDto.isPrivate || false,
      createdBy: adminId,
      createdAt: new Date(),
    };

    await this.userModel
      .updateOne({ _id: patientId }, { $push: { adminNotes: adminNote } })
      .exec();

    return {
      success: true,
      noteId,
    };
  }

  /**
   * Perform bulk action on patients
   */
  async performBulkAction(
    bulkActionDto: BulkPatientActionDto,
    adminId: string,
  ): Promise<BulkActionResultDto> {
    const { action, patientIds, reason } = bulkActionDto;
    let successCount = 0;
    let failureCount = 0;
    const errors: Array<{ item: string; error: string }> = [];

    for (const patientId of patientIds) {
      try {
        switch (action) {
          case 'activate':
            await this.changePatientStatus(
              patientId,
              { accountStatus: AccountStatus.ACTIVE, reason },
              adminId,
            );
            break;
          case 'suspend':
            await this.changePatientStatus(
              patientId,
              { accountStatus: AccountStatus.SUSPENDED, reason },
              adminId,
            );
            break;
          case 'deactivate':
            await this.changePatientStatus(
              patientId,
              { accountStatus: AccountStatus.DEACTIVATED, reason },
              adminId,
            );
            break;
          case 'verify_email':
            await this.update(patientId, { emailVerified: true });
            break;
          default:
            throw new Error(`Unknown action: ${action}`);
        }
        successCount++;
      } catch (error) {
        failureCount++;
        errors.push({
          item: patientId,
          error: error.message || 'Unknown error',
        });
      }
    }

    return {
      success: failureCount === 0,
      message: `Bulk action completed. Success: ${successCount}, Failed: ${failureCount}`,
      successCount,
      failureCount,
      completedAt: new Date(),
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Import patients from bulk data
   */
  async importPatients(
    importDto: BulkPatientImportDto,
    adminId: string,
  ): Promise<BulkActionResultDto> {
    let imported = 0;
    let skipped = 0;
    let errors = 0;
    const errorList: Array<{ item: string; error: string }> = [];

    for (const patientData of importDto.patients) {
      try {
        // Check for duplicates based on email
        if (patientData.email) {
          const existing = await this.userModel
            .findOne({ email: patientData.email })
            .exec();
          if (existing) {
            if (importDto.duplicateHandling === 'skip') {
              skipped++;
              continue;
            } else if (importDto.duplicateHandling === 'error') {
              throw new Error('Duplicate email found');
            }
            // 'update' case would update the existing user
          }
        }

        // Convert import row to patient creation data
        const patientCreationData: CreatePatientDto = {
          email: patientData.email,
          name: patientData.name,
          phone: patientData.phone,
          dateOfBirth: patientData.dateOfBirth,
          gender: patientData.gender as any,
          address: {
            streetAddress: patientData.streetAddress,
            city: patientData.city,
            state: patientData.state,
            zipCode: patientData.zipCode,
            country: patientData.country,
          },
          insurance: {
            provider: patientData.insuranceProvider,
            policyNumber: patientData.insurancePolicyNumber,
          },
          emergencyContact: patientData.emergencyContactName
            ? {
                name: patientData.emergencyContactName,
                phone: patientData.emergencyContactPhone || '',
                relationship:
                  patientData.emergencyContactRelationship || 'Unknown',
              }
            : undefined,
        };

        await this.createPatient(patientCreationData, adminId);
        imported++;
      } catch (error) {
        errors++;
        errorList.push({
          item: patientData.email || 'Unknown patient',
          error: error.message || 'Unknown error',
        });
      }
    }

    return {
      success: errors === 0,
      message: `Import completed. Imported: ${imported}, Skipped: ${skipped}, Errors: ${errors}`,
      successCount: imported,
      failureCount: errors,
      completedAt: new Date(),
      importSummary: {
        imported,
        skipped,
        errors,
        duplicates: skipped,
      },
      errors: errorList.length > 0 ? errorList : undefined,
    };
  }

  /**
   * Helper method to map User document to Patient response
   */
  private mapUserToPatientResponse(user: UserDocument): PatientResponseDto {
    const userObj = user.toObject();
    return {
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
      name: user.name,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified || false,
      phoneVerified: user.phoneVerified || false,
      accountStatus: user.accountStatus || AccountStatus.PENDING_VERIFICATION,
      isActive: user.isActive !== false,
      lastLogin: user.lastLogin,
      suspensionReason: user.suspensionReason,
      suspendedAt: user.suspendedAt,
      suspendedBy: user.suspendedBy,
      deactivatedAt: user.deactivatedAt,
      deactivatedBy: user.deactivatedBy,
      twoFactorEnabled: user.twoFactorEnabled || false,
      twoFactorEnabledAt: user.twoFactorEnabledAt,
      invitedBy: user.invitedBy,
      invitedAt: user.invitedAt,
      signupCompletedAt: user.signupCompletedAt,
      subscriptionPlan: user.subscriptionPlan || 'free',
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionEndDate: user.subscriptionEndDate,
      subscriptionStatus: user.subscriptionStatus,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      address: user.address,
      emergencyContact: user.emergencyContact,
      emergencyContacts: user.emergencyContacts,
      insurance: user.insurance,
      medicalInformation: user.medicalInformation,
      usageMetrics: user.usageMetrics,
      adminNotes: user.adminNotes,
      activeSessions: user.activeSessions,
      createdAt: userObj.createdAt || new Date(),
      updatedAt: userObj.updatedAt || new Date(),
      meta: user.meta,
    } as PatientResponseDto;
  }
}
