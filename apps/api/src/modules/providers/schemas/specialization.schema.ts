import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Specialization extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  code: string; // Medical specialty code

  @Prop()
  description: string;

  @Prop({ type: [String], default: [] })
  subSpecialties: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const SpecializationSchema = SchemaFactory.createForClass(Specialization);

SpecializationSchema.index({ name: 1 });
SpecializationSchema.index({ code: 1 });
SpecializationSchema.index({ isActive: 1 });