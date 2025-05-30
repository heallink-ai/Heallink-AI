import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, UserRole } from '../users/schemas/user.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminQueryDto } from './dto/admin-query.dto';
import { AdminResponseDto, AdminListResponseDto, AdminStatsResponseDto } from './dto/admin-response.dto';
import { S3Service } from '../aws/s3.service';


@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly s3Service: S3Service,
  ) {}

  private transformToAdminResponse(user: UserDocument | any): AdminResponseDto {
    const userObj = user.toObject ? user.toObject() : user;
    return {
      id: userObj._id?.toString() || userObj.id,
      email: userObj.email,
      phone: userObj.phone,
      name: userObj.name,
      role: userObj.role,
      adminRole: userObj.adminRole,
      permissions: userObj.permissions,
      avatarUrl: userObj.avatarUrl,
      emailVerified: userObj.emailVerified,
      phoneVerified: userObj.phoneVerified,
      isActive: userObj.isActive,
      lastLogin: userObj.lastLogin,
      createdAt: userObj.createdAt || new Date(),
      updatedAt: userObj.updatedAt || new Date(),
    };
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    if (createAdminDto.role === UserRole.USER) {
      throw new BadRequestException(
        'Cannot create regular users through admin endpoint',
      );
    }

    if (createAdminDto.email) {
      const existingUser = await this.userModel
        .findOne({ email: createAdminDto.email })
        .exec();
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    if (createAdminDto.phone) {
      const existingUser = await this.userModel
        .findOne({ phone: createAdminDto.phone })
        .exec();
      if (existingUser) {
        throw new ConflictException('User with this phone already exists');
      }
    }

    // Set default permissions based on admin role if not provided
    let permissions = createAdminDto.permissions || [];
    if (permissions.length === 0) {
      permissions = this.getDefaultPermissionsForRole(createAdminDto.adminRole);
    }

    const adminUser = new this.userModel({
      ...createAdminDto,
      emailVerified: true, // Admin users are pre-verified
      isActive: true,
      permissions,
    });

    const savedAdmin = await adminUser.save();
    return this.transformToAdminResponse(savedAdmin);
  }

  private getDefaultPermissionsForRole(adminRole: string): string[] {
    const permissionMap: Record<string, string[]> = {
      'super_admin': ['*'], // All permissions
      'system_admin': [
        'user_management',
        'admin_management',
        'provider_management',
        'system_configuration',
        'audit_logs'
      ],
      'user_admin': ['user_management', 'user_support'],
      'provider_admin': ['provider_management', 'provider_support'],
      'content_admin': ['content_management', 'content_moderation'],
      'billing_admin': ['billing_management', 'financial_reports'],
      'support_admin': ['user_support', 'provider_support'],
      'readonly_admin': ['read_only_access']
    };

    return permissionMap[adminRole] || ['read_only_access'];
  }

  async findAllAdmins(query: AdminQueryDto): Promise<AdminListResponseDto> {
    const {
      page = 1,
      limit = 10,
      role,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    const skip = (page - 1) * limit;

    // Build filter for admin roles only
    const filter: any = {
      role: { $in: [UserRole.ADMIN, UserRole.PROVIDER] },
    };

    if (role && role !== UserRole.USER) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [admins, total] = await Promise.all([
      this.userModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    // Process avatar URLs for presigned URLs
    const processedAdmins = await Promise.all(
      admins.map(async (admin) => {
        if (admin.avatarUrl && admin.avatarUrl.startsWith('avatars/')) {
          try {
            const signedUrl = await this.s3Service.getSignedUrl(
              admin.avatarUrl,
              86400,
            );
            const adminWithSignedUrl = admin.toObject();
            adminWithSignedUrl.avatarUrl = signedUrl;
            return this.transformToAdminResponse(adminWithSignedUrl as UserDocument);
          } catch (error) {
            console.error('Error generating presigned URL for avatar:', error);
          }
        }
        return admin;
      }),
    );

    const adminDtos = processedAdmins.map(admin => this.transformToAdminResponse(admin));

    return {
      admins: adminDtos,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private async findAdminByIdRaw(id: string): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid admin ID');
    }

    const admin = await this.userModel.findById(id).exec();
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (admin.role === UserRole.USER) {
      throw new ForbiddenException('Access denied: Not an admin user');
    }

    return admin;
  }

  async findAdminById(id: string): Promise<AdminResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid admin ID');
    }

    const admin = await this.userModel.findById(id).exec();
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (admin.role === UserRole.USER) {
      throw new ForbiddenException('Access denied: Not an admin user');
    }

    // Process avatar URL if needed
    if (admin.avatarUrl && admin.avatarUrl.startsWith('avatars/')) {
      try {
        const signedUrl = await this.s3Service.getSignedUrl(
          admin.avatarUrl,
          86400,
        );
        const adminWithSignedUrl = admin.toObject();
        adminWithSignedUrl.avatarUrl = signedUrl;
        return this.transformToAdminResponse(adminWithSignedUrl as UserDocument);
      } catch (error) {
        console.error('Error generating presigned URL for avatar:', error);
      }
    }

    return this.transformToAdminResponse(admin);
  }

  async updateAdmin(
    id: string,
    updateAdminDto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    const admin = await this.findAdminByIdRaw(id);

    // Prevent role downgrade to USER through this endpoint, but only if role is provided
    if (updateAdminDto.role === UserRole.USER) {
      throw new BadRequestException(
        'Cannot downgrade admin to regular user through this endpoint',
      );
    }

    // Check for email/phone conflicts if being updated
    if (updateAdminDto.email && updateAdminDto.email !== admin.email) {
      const existingUser = await this.userModel
        .findOne({ email: updateAdminDto.email, _id: { $ne: id } })
        .exec();
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    if (updateAdminDto.phone && updateAdminDto.phone !== admin.phone) {
      const existingUser = await this.userModel
        .findOne({ phone: updateAdminDto.phone, _id: { $ne: id } })
        .exec();
      if (existingUser) {
        throw new ConflictException('User with this phone already exists');
      }
    }

    // Update the admin user
    const updatedAdmin = await this.userModel
      .findByIdAndUpdate(id, updateAdminDto, { new: true })
      .exec();

    if (!updatedAdmin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    // Process avatar URL if needed
    if (
      updatedAdmin.avatarUrl &&
      updatedAdmin.avatarUrl.startsWith('avatars/')
    ) {
      try {
        const signedUrl = await this.s3Service.getSignedUrl(
          updatedAdmin.avatarUrl,
          86400,
        );
        const adminWithSignedUrl = updatedAdmin.toObject();
        adminWithSignedUrl.avatarUrl = signedUrl;
        return this.transformToAdminResponse(adminWithSignedUrl as UserDocument);
      } catch (error) {
        console.error('Error generating presigned URL for avatar:', error);
      }
    }

    return this.transformToAdminResponse(updatedAdmin);
  }

  async deleteAdmin(id: string): Promise<void> {
    const admin = await this.findAdminByIdRaw(id);

    // Prevent deletion of the last admin
    const adminCount = await this.userModel
      .countDocuments({ role: UserRole.ADMIN })
      .exec();
    if (admin.role === UserRole.ADMIN && adminCount <= 1) {
      throw new BadRequestException('Cannot delete the last admin user');
    }

    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Admin not found');
    }
  }

  async getAdminStats(): Promise<AdminStatsResponseDto> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalAdmins, activeAdmins, recentlyCreated, roleDistribution] =
      await Promise.all([
        this.userModel
          .countDocuments({
            role: { $in: [UserRole.ADMIN, UserRole.PROVIDER] },
          })
          .exec(),
        this.userModel
          .countDocuments({
            role: { $in: [UserRole.ADMIN, UserRole.PROVIDER] },
            updatedAt: { $gte: thirtyDaysAgo },
          })
          .exec(),
        this.userModel
          .countDocuments({
            role: { $in: [UserRole.ADMIN, UserRole.PROVIDER] },
            createdAt: { $gte: thirtyDaysAgo },
          })
          .exec(),
        this.userModel
          .aggregate([
            { $match: { role: { $in: [UserRole.ADMIN, UserRole.PROVIDER] } } },
            { $group: { _id: '$role', count: { $sum: 1 } } },
          ])
          .exec(),
      ]);

    const roleDistributionMap: Record<string, number> = {};
    roleDistribution.forEach((item: any) => {
      roleDistributionMap[item._id] = item.count;
    });

    return {
      totalAdmins,
      activeAdmins,
      recentlyCreated,
      roleDistribution: roleDistributionMap,
    };
  }

  async toggleAdminStatus(id: string, status: boolean): Promise<AdminResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid admin ID');
    }

    // Prevent disabling the last active super admin
    if (!status) {
      const activeSuperAdmins = await this.userModel
        .countDocuments({
          role: UserRole.ADMIN,
          adminRole: 'super_admin',
          isActive: true,
        })
        .exec();
      
      const currentAdmin = await this.userModel.findById(id).exec();
      if (
        currentAdmin?.adminRole === 'super_admin' &&
        activeSuperAdmins <= 1
      ) {
        throw new BadRequestException(
          'Cannot deactivate the last active super admin',
        );
      }
    }

    const updatedAdmin = await this.userModel
      .findByIdAndUpdate(
        id,
        { isActive: status },
        { new: true }
      )
      .exec();

    if (!updatedAdmin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    // Process avatar URL if needed
    if (
      updatedAdmin.avatarUrl &&
      updatedAdmin.avatarUrl.startsWith('avatars/')
    ) {
      try {
        const signedUrl = await this.s3Service.getSignedUrl(
          updatedAdmin.avatarUrl,
          86400,
        );
        const adminWithSignedUrl = updatedAdmin.toObject();
        adminWithSignedUrl.avatarUrl = signedUrl;
        return this.transformToAdminResponse(adminWithSignedUrl as UserDocument);
      } catch (error) {
        console.error('Error generating presigned URL for avatar:', error);
      }
    }

    return this.transformToAdminResponse(updatedAdmin);
  }

  async updateAdminRole(id: string, adminRole: string, permissions?: string[]): Promise<AdminResponseDto> {
    const admin = await this.findAdminByIdRaw(id);

    // Prevent downgrading the last super admin
    if (admin.adminRole === 'super_admin' && adminRole !== 'super_admin') {
      const superAdminCount = await this.userModel
        .countDocuments({
          role: UserRole.ADMIN,
          adminRole: 'super_admin',
        })
        .exec();
      
      if (superAdminCount <= 1) {
        throw new BadRequestException(
          'Cannot downgrade the last super admin',
        );
      }
    }

    // Set permissions based on role if not provided
    const finalPermissions = permissions || this.getDefaultPermissionsForRole(adminRole);

    const updatedAdmin = await this.userModel
      .findByIdAndUpdate(
        id,
        { 
          adminRole,
          permissions: finalPermissions,
        },
        { new: true }
      )
      .exec();

    if (!updatedAdmin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    return this.transformToAdminResponse(updatedAdmin);
  }
}
