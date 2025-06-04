import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum KnowledgeBaseType {
  ARTICLE = 'article',
  PROTOCOL = 'protocol',
  GUIDELINE = 'guideline',
  RESEARCH = 'research',
  CASE_STUDY = 'case_study',
}

export enum KnowledgeBaseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Schema({ timestamps: true })
export class KnowledgeBase extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: String, enum: KnowledgeBaseType, required: true })
  type: KnowledgeBaseType;

  @Prop({ type: String, enum: KnowledgeBaseStatus, default: KnowledgeBaseStatus.DRAFT })
  status: KnowledgeBaseStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Provider', required: true })
  author: MongooseSchema.Types.ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Specialization' }] })
  specializations: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  keywords: string[];

  @Prop()
  summary: string;

  @Prop({ type: [String], default: [] })
  references: string[];

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop({ type: Date })
  publishedAt: Date;

  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop({ type: Number, default: 0 })
  likes: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Provider' }] })
  collaborators: MongooseSchema.Types.ObjectId[];

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const KnowledgeBaseSchema = SchemaFactory.createForClass(KnowledgeBase);

KnowledgeBaseSchema.index({ title: 'text', content: 'text', summary: 'text' });
KnowledgeBaseSchema.index({ author: 1 });
KnowledgeBaseSchema.index({ type: 1 });
KnowledgeBaseSchema.index({ status: 1 });
KnowledgeBaseSchema.index({ specializations: 1 });
KnowledgeBaseSchema.index({ tags: 1 });
KnowledgeBaseSchema.index({ publishedAt: -1 });