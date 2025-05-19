import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, AuthProvider, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { randomBytes } from 'crypto';

// Interface defined outside the class to avoid scoping issues
export interface UserWithFlags extends UserDocument {
  isNewUser?: boolean;
}

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
    console.log({ id });
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid user ID: ${id}`);
    }
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
      }

      const updatedUser = await this.findOne(user._id);
      return updatedUser as UserWithFlags;
    } else {
      // If user doesn't exist, we'll create a new one
      isNewUser = true;
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
      // Mark email as verified for social logins since they are pre-verified by the provider
      emailVerified: providerData.email ? true : false,
    };

    const newUser = await this.create(createUserDto);

    // Add the isNewUser flag to the returned user
    const userWithFlag = newUser as UserWithFlags;
    userWithFlag.isNewUser = isNewUser;

    return userWithFlag;
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
}
