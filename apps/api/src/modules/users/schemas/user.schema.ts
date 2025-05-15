import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  USER = 'user',
  PROVIDER = 'provider',
  ADMIN = 'admin',
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

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: false })
  phoneVerified: boolean;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

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

  @Prop({
    type: MongooseSchema.Types.Mixed,
    default: {},
  })
  meta: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);

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
