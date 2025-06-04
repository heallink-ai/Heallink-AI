import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export enum ProviderStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  SUSPENDED = 'suspended',
  REJECTED = 'rejected',
}

export enum LicenseStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
  REVOKED = 'revoked',
}

@Schema({ timestamps: true })
export class Provider extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: User;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  title: string; // Dr., MD, DO, NP, PA, etc.

  @Prop({ required: true, unique: true })
  licenseNumber: string;

  @Prop({ required: true })
  licenseState: string;

  @Prop({ type: String, enum: LicenseStatus, default: LicenseStatus.ACTIVE })
  licenseStatus: LicenseStatus;

  @Prop({ type: Date, required: true })
  licenseExpiryDate: Date;

  @Prop({ type: [String], default: [] })
  boardCertifications: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Specialization' }] })
  specializations: MongooseSchema.Types.ObjectId[];

  @Prop({ type: String, enum: ProviderStatus, default: ProviderStatus.PENDING })
  status: ProviderStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Practice' })
  primaryPractice: MongooseSchema.Types.ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Practice' }] })
  affiliatedPractices: MongooseSchema.Types.ObjectId[];

  @Prop()
  bio: string;

  @Prop()
  profileImageUrl: string;

  @Prop({ type: [String], default: [] })
  languages: string[];

  @Prop({ type: Number, min: 0 })
  yearsOfExperience: number;

  @Prop({ type: [String], default: [] })
  education: string[];

  @Prop({ type: [String], default: [] })
  awards: string[];

  @Prop({ type: [String], default: [] })
  publications: string[];

  @Prop({ type: Object, default: {} })
  availability: Record<string, any>;

  @Prop({ type: Object, default: {} })
  consultationRates: Record<string, number>;

  @Prop({ default: true })
  acceptsNewPatients: boolean;

  @Prop({ default: false })
  teleheathEnabled: boolean;

  @Prop({ type: [String], default: [] })
  insuranceAccepted: string[];

  @Prop({ type: Date })
  verifiedAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  verifiedBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);

// Add indexes for better query performance
ProviderSchema.index({ userId: 1 });
ProviderSchema.index({ licenseNumber: 1 });
ProviderSchema.index({ status: 1 });
ProviderSchema.index({ specializations: 1 });
ProviderSchema.index({ primaryPractice: 1 });