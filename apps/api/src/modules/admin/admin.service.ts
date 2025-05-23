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
import { S3Service } from '../aws/s3.service';

export interface AdminListResponse {
  admins: UserDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminStatsResponse {
  totalAdmins: number;
  activeAdmins: number;
  recentlyCreated: number;
  roleDistribution: Record<string, number>;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly s3Service: S3Service,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<UserDocument> {
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

    const adminUser = new this.userModel({
      ...createAdminDto,
      emailVerified: true, // Admin users are pre-verified
    });

    return adminUser.save();
  }

  async findAllAdmins(query: AdminQueryDto): Promise<AdminListResponse> {
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
            return adminWithSignedUrl as UserDocument;
          } catch (error) {
            console.error('Error generating presigned URL for avatar:', error);
          }
        }
        return admin;
      }),
    );

    return {
      admins: processedAdmins,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAdminById(id: string): Promise<UserDocument> {
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
        return adminWithSignedUrl as UserDocument;
      } catch (error) {
        console.error('Error generating presigned URL for avatar:', error);
      }
    }

    return admin;
  }

  async updateAdmin(
    id: string,
    updateAdminDto: UpdateAdminDto,
  ): Promise<UserDocument> {
    const admin = await this.findAdminById(id);

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
        return adminWithSignedUrl as UserDocument;
      } catch (error) {
        console.error('Error generating presigned URL for avatar:', error);
      }
    }

    return updatedAdmin;
  }

  async deleteAdmin(id: string): Promise<void> {
    const admin = await this.findAdminById(id);

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

  async getAdminStats(): Promise<AdminStatsResponse> {
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

  async toggleAdminStatus(id: string, status: boolean): Promise<UserDocument> {
    const admin = await this.findAdminById(id);

    // This could update a status field if we had one, for now we'll just return the admin
    // In the future, we might add an "active" or "suspended" field to the schema
    return admin;
  }
}
