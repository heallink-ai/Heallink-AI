import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  USER = 'user',
  PROVIDER = 'provider',
  ADMIN = 'admin',
}

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  SYSTEM_ADMIN = 'system_admin',
  USER_ADMIN = 'user_admin',
  PROVIDER_ADMIN = 'provider_admin',
  CONTENT_ADMIN = 'content_admin',
  BILLING_ADMIN = 'billing_admin',
  SUPPORT_ADMIN = 'support_admin',
  READONLY_ADMIN = 'readonly_admin',
}

@Schema({
  timestamps: true,
  collection: 'admin_users',
})
export class AdminUser extends Document {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.ADMIN,
    index: true,
  })
  role: UserRole;

  @Prop({
    type: String,
    enum: Object.values(AdminRole),
    required: true,
    index: true,
  })
  adminRole: AdminRole;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  lastLogin: Date;

  @Prop({ type: Date, default: null })
  passwordResetRequestedAt: Date;

  @Prop({ type: String, default: null })
  passwordResetToken: string;

  @Prop({ type: [String], default: [] })
  refreshTokens: string[];

  // Method to compare password
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Method to hash password before saving
  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Method to add a refresh token
  addRefreshToken(token: string): void {
    // Keep only the most recent 5 tokens
    if (this.refreshTokens.length >= 5) {
      this.refreshTokens = this.refreshTokens.slice(-4);
    }
    this.refreshTokens.push(token);
  }

  // Method to remove a refresh token
  removeRefreshToken(token: string): void {
    this.refreshTokens = this.refreshTokens.filter((t) => t !== token);
  }

  // Method to check if a user has a specific permission
  hasPermission(permission: string): boolean {
    // Super admins have all permissions
    if (
      this.adminRole === AdminRole.SUPER_ADMIN ||
      this.permissions.includes('*')
    ) {
      return true;
    }

    return this.permissions.includes(permission);
  }
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);

// Attach instance methods to the schema
AdminUserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

AdminUserSchema.methods.hashPassword = async function (): Promise<void> {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};

AdminUserSchema.methods.addRefreshToken = function (token: string): void {
  // Keep only the most recent 5 tokens
  if (this.refreshTokens.length >= 5) {
    this.refreshTokens = this.refreshTokens.slice(-4);
  }
  this.refreshTokens.push(token);
};

AdminUserSchema.methods.removeRefreshToken = function (token: string): void {
  this.refreshTokens = this.refreshTokens.filter((t: string) => t !== token);
};

AdminUserSchema.methods.hasPermission = function (permission: string): boolean {
  // Super admins have all permissions
  if (
    this.adminRole === AdminRole.SUPER_ADMIN ||
    this.permissions.includes('*')
  ) {
    return true;
  }

  return this.permissions.includes(permission);
};

// Middleware to hash password before saving
AdminUserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    await this.hashPassword();
    next();
  } catch (error) {
    next(error as Error);
  }
});
