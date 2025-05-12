import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, AuthProvider, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByPhone(phone: string): Promise<UserDocument | null> {
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
  }): Promise<UserDocument> {
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
      }

      return this.findOne(user._id);
    }

    // If user doesn't exist, create a new one
    const createUserDto: CreateUserDto = {
      email: providerData.email,
      phone: providerData.phone,
      name: providerData.name,
      providers: [providerData.provider],
      accounts: [
        {
          provider: providerData.provider,
          providerId: providerData.providerId,
        },
      ],
    };

    return this.create(createUserDto);
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
        passwordResetToken: { $exists: true, $ne: null },
        passwordResetRequestedAt: { $exists: true, $ne: null },
      })
      .exec();
  }
}
