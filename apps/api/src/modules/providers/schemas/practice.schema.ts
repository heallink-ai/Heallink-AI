import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum PracticeType {
  HOSPITAL = 'hospital',
  CLINIC = 'clinic',
  PRIVATE_PRACTICE = 'private_practice',
  URGENT_CARE = 'urgent_care',
  TELEHEALTH = 'telehealth',
  HOME_HEALTH = 'home_health',
}

@Schema({ timestamps: true })
export class Practice extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: PracticeType, required: true })
  type: PracticeType;

  @Prop({ required: true })
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Prop({ required: true })
  phone: string;

  @Prop()
  email: string;

  @Prop()
  website: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Provider' }] })
  providers: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  services: string[];

  @Prop({ type: [String], default: [] })
  insuranceAccepted: string[];

  @Prop({ type: Object, default: {} })
  operatingHours: Record<string, any>;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  description: string;

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({ type: Object, default: {} })
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' };
    coordinates: [number, number]; // [longitude, latitude]
  };

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const PracticeSchema = SchemaFactory.createForClass(Practice);

// Add geospatial index for location-based queries
PracticeSchema.index({ location: '2dsphere' });
PracticeSchema.index({ name: 1 });
PracticeSchema.index({ type: 1 });
PracticeSchema.index({ isActive: 1 });