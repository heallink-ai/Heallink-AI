import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  USER = 'user',
  PROVIDER = 'provider',
  ADMIN = 'admin',
}

export enum AccountStatus {
  ACTIVE = 'active',
  PENDING_VERIFICATION = 'pending_verification',
  SUSPENDED = 'suspended',
  DEACTIVATED = 'deactivated',
  PENDING_SIGNUP = 'pending_signup',
}

export enum InsuranceStatus {
  VERIFIED = 'verified',
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  EXPIRED = 'expired',
}

export enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
  FAMILY = 'family',
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

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}

export type UserDocument = User &
  Document & {
    comparePassword(candidatePassword: string): Promise<boolean>;
    addRefreshToken?(token: string): void;
    removeRefreshToken?(token: string): void;
    hasPermission?(permission: string): boolean;
  };

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.resetToken;
      delete ret.resetTokenExpiry;
      delete ret.passwordResetToken;
      delete ret.passwordResetRequestedAt;
      delete ret.verificationToken;
      delete ret.verificationTokenExpiry;
      delete ret.otpCode;
      delete ret.otpExpiry;
      delete ret.refreshTokens;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  _id: string;

  @Prop({ required: true, unique: true, sparse: true })
  email?: string;

  @Prop({ unique: true, sparse: true })
  phone?: string;

  @Prop()
  name?: string;

  @Prop()
  password?: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: false })
  phoneVerified: boolean;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  // Admin-specific fields
  @Prop({
    type: String,
    enum: Object.values(AdminRole),
    sparse: true,
  })
  adminRole?: AdminRole;

  @Prop({ type: [String], default: [] })
  permissions?: string[];

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({
    type: String,
    enum: Object.values(AccountStatus),
    default: AccountStatus.PENDING_VERIFICATION,
  })
  accountStatus?: AccountStatus;

  @Prop({ type: Date })
  lastLogin?: Date;

  @Prop()
  suspensionReason?: string;

  @Prop({ type: Date })
  suspendedAt?: Date;

  @Prop()
  suspendedBy?: string; // Admin ID who suspended

  @Prop({ type: Date })
  deactivatedAt?: Date;

  @Prop()
  deactivatedBy?: string; // Admin ID who deactivated

  @Prop({ type: [String], default: [] })
  refreshTokens?: string[];

  @Prop([{ type: String, enum: AuthProvider }])
  providers: AuthProvider[];

  @Prop({
    type: [
      {
        provider: { type: String, enum: AuthProvider },
        providerId: String,
      },
    ],
  })
  accounts: Array<{ provider: AuthProvider; providerId: string }>;

  @Prop()
  refreshToken?: string;

  @Prop()
  resetToken?: string;

  @Prop({ type: Date })
  resetTokenExpiry?: Date;

  @Prop()
  passwordResetToken?: string;

  @Prop({ type: Date })
  passwordResetRequestedAt?: Date;

  @Prop()
  verificationToken?: string;

  @Prop({ type: Date })
  verificationTokenExpiry?: Date;

  @Prop()
  otpCode?: string;

  @Prop({ type: Date })
  otpExpiry?: Date;

  // Two-Factor Authentication
  @Prop({ default: false })
  twoFactorEnabled?: boolean;

  @Prop()
  twoFactorSecret?: string;

  @Prop({ type: [String], default: [] })
  twoFactorRecoveryCodes?: string[];

  @Prop({ type: Date })
  twoFactorEnabledAt?: Date;

  // Invitation and Signup Tracking
  @Prop()
  invitedBy?: string; // Admin ID who sent invitation

  @Prop({ type: Date })
  invitedAt?: Date;

  @Prop()
  invitationToken?: string;

  @Prop({ type: Date })
  invitationExpiry?: Date;

  @Prop({ type: Date })
  signupCompletedAt?: Date;

  // Subscription and Plans
  @Prop({
    type: String,
    enum: Object.values(SubscriptionPlan),
    default: SubscriptionPlan.FREE,
  })
  subscriptionPlan?: SubscriptionPlan;

  @Prop({ type: Date })
  subscriptionStartDate?: Date;

  @Prop({ type: Date })
  subscriptionEndDate?: Date;

  @Prop()
  subscriptionStatus?: string; // active, canceled, expired, past_due

  @Prop()
  dateOfBirth?: string;

  @Prop({ enum: ['male', 'female', 'other', 'prefer-not-to-say'] })
  gender?: string;

  @Prop({
    type: {
      streetAddress: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
  })
  address?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };

  @Prop({
    type: {
      name: String,
      relationship: String,
      phone: String,
    },
  })
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };

  @Prop({
    type: {
      bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
      },
      allergies: [String],
      medications: [String],
      chronicConditions: [String],
      insuranceProvider: String,
      insurancePolicyNumber: String,
      primaryCarePhysician: String,
    },
  })
  medicalInformation?: {
    bloodType?: string;
    allergies?: string[];
    medications?: string[];
    chronicConditions?: string[];
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    primaryCarePhysician?: string;
  };

  @Prop({
    type: {
      provider: String,
      policyNumber: String,
      groupNumber: String,
      primaryInsured: String,
      relationship: String,
      status: {
        type: String,
        enum: Object.values(InsuranceStatus),
        default: InsuranceStatus.UNVERIFIED,
      },
      verifiedAt: Date,
      verifiedBy: String, // Admin ID who verified
      lastVerificationCheck: Date,
    },
  })
  insurance?: {
    provider?: string;
    policyNumber?: string;
    groupNumber?: string;
    primaryInsured?: string;
    relationship?: string;
    status?: InsuranceStatus;
    verifiedAt?: Date;
    verifiedBy?: string;
    lastVerificationCheck?: Date;
  };

  @Prop({
    type: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
  })
  communicationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };

  // Emergency Access
  @Prop({
    type: [
      {
        name: String,
        relationship: String,
        phone: String,
        email: String,
        permissions: [String], // What they can access
        isActive: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  emergencyContacts?: Array<{
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    permissions: string[];
    isActive: boolean;
    createdAt: Date;
  }>;

  @Prop({
    type: [
      {
        token: String,
        purpose: String, // emergency_access, one_time_login, etc.
        expiresAt: Date,
        isActive: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
        usedAt: Date,
        createdBy: String, // Admin ID
      },
    ],
    default: [],
  })
  emergencyTokens?: Array<{
    token: string;
    purpose: string;
    expiresAt: Date;
    isActive: boolean;
    createdAt: Date;
    usedAt?: Date;
    createdBy: string;
  }>;

  // Session Management
  @Prop({
    type: [
      {
        sessionId: String,
        deviceInfo: String,
        ipAddress: String,
        userAgent: String,
        lastActivity: { type: Date, default: Date.now },
        createdAt: { type: Date, default: Date.now },
        isActive: { type: Boolean, default: true },
      },
    ],
    default: [],
  })
  activeSessions?: Array<{
    sessionId: string;
    deviceInfo: string;
    ipAddress: string;
    userAgent: string;
    lastActivity: Date;
    createdAt: Date;
    isActive: boolean;
  }>;

  // Activity and Usage Tracking
  @Prop({
    type: {
      appointmentsBooked: { type: Number, default: 0 },
      lastAppointmentDate: Date,
      messagesSent: { type: Number, default: 0 },
      lastMessageDate: Date,
      vitalsLogged: { type: Number, default: 0 },
      lastVitalsDate: Date,
      aiInteractions: { type: Number, default: 0 },
      lastAiInteractionDate: Date,
      lastAppAccess: Date,
      totalLoginCount: { type: Number, default: 0 },
    },
    default: {},
  })
  usageMetrics?: {
    appointmentsBooked: number;
    lastAppointmentDate?: Date;
    messagesSent: number;
    lastMessageDate?: Date;
    vitalsLogged: number;
    lastVitalsDate?: Date;
    aiInteractions: number;
    lastAiInteractionDate?: Date;
    lastAppAccess?: Date;
    totalLoginCount: number;
  };

  // Admin Notes (Internal Use Only)
  @Prop({
    type: [
      {
        note: String,
        createdBy: String, // Admin ID
        createdAt: { type: Date, default: Date.now },
        isPrivate: { type: Boolean, default: true },
        category: String, // general, medical, billing, support
      },
    ],
    default: [],
  })
  adminNotes?: Array<{
    note: string;
    createdBy: string;
    createdAt: Date;
    isPrivate: boolean;
    category: string;
  }>;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    default: {},
  })
  meta: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Enable timestamps
UserSchema.set('timestamps', true);

// Pre-save hook to hash password
UserSchema.pre('save', function (next) {
  // Using type assertion with Document & User to access properties with proper typing
  const user = this as Document & User;

  // Check if password is modified and exists
  if (user.isModified && user.isModified('password') && user.password) {
    bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(user.password as string, salt))
      .then((hash) => {
        user.password = hash;
        next();
      })
      .catch((err) => next(err));
  } else {
    next(undefined);
  }
});

// Add comparePassword method to the schema with proper typing
UserSchema.methods.comparePassword = function (
  candidatePassword: string,
): Promise<boolean> {
  const user = this as Document & User;
  return user.password
    ? bcrypt.compare(candidatePassword, user.password)
    : Promise.resolve(false);
};

// Method to add a refresh token
UserSchema.methods.addRefreshToken = function (token: string): void {
  const user = this as Document & User;
  if (!user.refreshTokens) {
    user.refreshTokens = [];
  }
  // Keep only the most recent 5 tokens
  if (user.refreshTokens.length >= 5) {
    user.refreshTokens = user.refreshTokens.slice(-4);
  }
  user.refreshTokens.push(token);
};

// Method to remove a refresh token
UserSchema.methods.removeRefreshToken = function (token: string): void {
  const user = this as Document & User;
  if (user.refreshTokens) {
    user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
  }
};

// Method to check if a user has a specific permission
UserSchema.methods.hasPermission = function (permission: string): boolean {
  const user = this as Document & User;
  // Super admins have all permissions
  if (
    user.adminRole === AdminRole.SUPER_ADMIN ||
    (user.permissions && user.permissions.includes('*'))
  ) {
    return true;
  }

  return user.permissions ? user.permissions.includes(permission) : false;
};
