import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum AuditAction {
  // User Management Actions
  USER_CREATED = 'user_created',
  USER_UPDATED = 'user_updated',
  USER_DELETED = 'user_deleted',
  USER_SUSPENDED = 'user_suspended',
  USER_REACTIVATED = 'user_reactivated',
  USER_DEACTIVATED = 'user_deactivated',

  // Authentication Actions
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  USER_PASSWORD_RESET = 'user_password_reset',
  USER_PASSWORD_CHANGED = 'user_password_changed',
  USER_EMAIL_VERIFIED = 'user_email_verified',
  USER_PHONE_VERIFIED = 'user_phone_verified',

  // Two-Factor Authentication
  USER_2FA_ENABLED = 'user_2fa_enabled',
  USER_2FA_DISABLED = 'user_2fa_disabled',
  USER_2FA_RESET = 'user_2fa_reset',

  // Session Management
  USER_SESSION_CREATED = 'user_session_created',
  USER_SESSION_TERMINATED = 'user_session_terminated',
  USER_ALL_SESSIONS_TERMINATED = 'user_all_sessions_terminated',

  // Profile Changes
  USER_PROFILE_UPDATED = 'user_profile_updated',
  USER_INSURANCE_UPDATED = 'user_insurance_updated',
  USER_INSURANCE_VERIFIED = 'user_insurance_verified',
  USER_EMERGENCY_CONTACT_ADDED = 'user_emergency_contact_added',
  USER_EMERGENCY_CONTACT_REMOVED = 'user_emergency_contact_removed',

  // Admin Actions
  ADMIN_IMPERSONATION_STARTED = 'admin_impersonation_started',
  ADMIN_IMPERSONATION_ENDED = 'admin_impersonation_ended',
  ADMIN_NOTE_ADDED = 'admin_note_added',
  ADMIN_BULK_ACTION = 'admin_bulk_action',

  // Data Export/Import
  USER_DATA_EXPORTED = 'user_data_exported',
  USER_DATA_IMPORTED = 'user_data_imported',

  // Subscription Changes
  USER_SUBSCRIPTION_CHANGED = 'user_subscription_changed',
  USER_SUBSCRIPTION_CANCELLED = 'user_subscription_cancelled',
}

export enum AuditLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export type AuditLogDocument = AuditLog & Document;

@Schema({
  timestamps: true,
  collection: 'audit_logs',
  // Auto-delete audit logs after 7 years for compliance
  expireAfterSeconds: 7 * 365 * 24 * 60 * 60, // 7 years in seconds
})
export class AuditLog {
  _id: string;

  // Core Audit Information
  @Prop({ required: true, enum: Object.values(AuditAction), index: true })
  action: AuditAction;

  @Prop({
    required: true,
    enum: Object.values(AuditLevel),
    default: AuditLevel.MEDIUM,
  })
  level: AuditLevel;

  @Prop({ required: true })
  description: string;

  // Subject (User being acted upon)
  @Prop({ required: true, index: true })
  subjectUserId: string;

  @Prop()
  subjectUserEmail?: string;

  @Prop()
  subjectUserName?: string;

  // Actor (Admin performing the action, or system)
  @Prop({ index: true })
  actorUserId?: string; // null for system actions

  @Prop()
  actorUserEmail?: string;

  @Prop()
  actorUserName?: string;

  @Prop({ default: 'system' })
  actorType: string; // admin, system, user

  // Context Information
  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop()
  sessionId?: string;

  @Prop()
  requestId?: string;

  // Change Details
  @Prop({ type: Object })
  previousValues?: Record<string, any>;

  @Prop({ type: Object })
  newValues?: Record<string, any>;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  // Compliance and Legal
  @Prop()
  reason?: string; // For suspensions, deletions, etc.

  @Prop({ type: [String], default: [] })
  tags?: string[]; // For categorization and filtering

  @Prop({ default: false })
  isPII?: boolean; // Contains personally identifiable information

  @Prop({ default: false })
  isSensitive?: boolean; // Contains sensitive medical/financial data

  // Geolocation
  @Prop()
  country?: string;

  @Prop()
  region?: string;

  @Prop()
  city?: string;

  // Status
  @Prop({ default: false })
  isArchived?: boolean;

  @Prop({ default: false })
  isRetentionProtected?: boolean; // Cannot be deleted due to legal hold

  @Prop({ type: Date })
  retentionUntil?: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

// Indexes for performance
AuditLogSchema.index({ subjectUserId: 1, createdAt: -1 });
AuditLogSchema.index({ actorUserId: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ level: 1, createdAt: -1 });
AuditLogSchema.index({ tags: 1 });
AuditLogSchema.index({ createdAt: -1 }); // For general time-based queries
