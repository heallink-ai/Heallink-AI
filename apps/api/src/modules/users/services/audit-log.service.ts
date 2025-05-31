import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { 
  AuditLog, 
  AuditLogDocument, 
  AuditAction, 
  AuditLevel 
} from '../schemas/audit-log.schema';

export interface AuditContext {
  actorUserId?: string;
  actorUserEmail?: string;
  actorUserName?: string;
  actorType?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
  country?: string;
  region?: string;
  city?: string;
}

export interface AuditLogEntry {
  action: AuditAction;
  level?: AuditLevel;
  description: string;
  subjectUserId: string;
  subjectUserEmail?: string;
  subjectUserName?: string;
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
  reason?: string;
  tags?: string[];
  isPII?: boolean;
  isSensitive?: boolean;
  isRetentionProtected?: boolean;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectModel(AuditLog.name) 
    private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  /**
   * Log an audit event
   */
  async log(
    entry: AuditLogEntry,
    context: AuditContext = {},
  ): Promise<AuditLogDocument> {
    try {
      const auditLog = new this.auditLogModel({
        ...entry,
        ...context,
        level: entry.level || AuditLevel.MEDIUM,
        actorType: context.actorType || 'admin',
      });

      const savedLog = await auditLog.save();
      
      // Log critical actions to application logs as well
      if (entry.level === AuditLevel.CRITICAL) {
        this.logger.warn(`CRITICAL AUDIT: ${entry.action} by ${context.actorUserEmail} on ${entry.subjectUserEmail}`, {
          auditLogId: savedLog._id,
          action: entry.action,
          actor: context.actorUserEmail,
          subject: entry.subjectUserEmail,
        });
      }

      return savedLog;
    } catch (error) {
      this.logger.error('Failed to save audit log', {
        error: error.message,
        entry,
        context,
      });
      throw error;
    }
  }

  /**
   * Log user creation
   */
  async logUserCreated(
    subjectUserId: string,
    subjectUserEmail: string,
    subjectUserName: string,
    actorContext: AuditContext,
    userData?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      action: AuditAction.USER_CREATED,
      level: AuditLevel.MEDIUM,
      description: `Patient account created for ${subjectUserEmail}`,
      subjectUserId,
      subjectUserEmail,
      subjectUserName,
      newValues: this.sanitizeUserData(userData),
      tags: ['user_management', 'account_creation'],
      isPII: true,
    }, actorContext);
  }

  /**
   * Log user updates
   */
  async logUserUpdated(
    subjectUserId: string,
    subjectUserEmail: string,
    subjectUserName: string,
    actorContext: AuditContext,
    previousValues?: Record<string, any>,
    newValues?: Record<string, any>,
    reason?: string,
  ): Promise<void> {
    await this.log({
      action: AuditAction.USER_UPDATED,
      level: AuditLevel.MEDIUM,
      description: `Patient account updated for ${subjectUserEmail}`,
      subjectUserId,
      subjectUserEmail,
      subjectUserName,
      previousValues: this.sanitizeUserData(previousValues),
      newValues: this.sanitizeUserData(newValues),
      reason,
      tags: ['user_management', 'account_update'],
      isPII: true,
    }, actorContext);
  }

  /**
   * Log user suspension
   */
  async logUserSuspended(
    subjectUserId: string,
    subjectUserEmail: string,
    subjectUserName: string,
    actorContext: AuditContext,
    reason?: string,
  ): Promise<void> {
    await this.log({
      action: AuditAction.USER_SUSPENDED,
      level: AuditLevel.HIGH,
      description: `Patient account suspended for ${subjectUserEmail}`,
      subjectUserId,
      subjectUserEmail,
      subjectUserName,
      reason,
      tags: ['user_management', 'account_suspension'],
      isPII: true,
    }, actorContext);
  }

  /**
   * Log user reactivation
   */
  async logUserReactivated(
    subjectUserId: string,
    subjectUserEmail: string,
    subjectUserName: string,
    actorContext: AuditContext,
    reason?: string,
  ): Promise<void> {
    await this.log({
      action: AuditAction.USER_REACTIVATED,
      level: AuditLevel.MEDIUM,
      description: `Patient account reactivated for ${subjectUserEmail}`,
      subjectUserId,
      subjectUserEmail,
      subjectUserName,
      reason,
      tags: ['user_management', 'account_reactivation'],
      isPII: true,
    }, actorContext);
  }

  /**
   * Log user deletion
   */
  async logUserDeleted(
    subjectUserId: string,
    subjectUserEmail: string,
    subjectUserName: string,
    actorContext: AuditContext,
    reason?: string,
    deletionType: 'soft' | 'hard' | 'anonymized' = 'soft',
  ): Promise<void> {
    await this.log({
      action: AuditAction.USER_DELETED,
      level: AuditLevel.CRITICAL,
      description: `Patient account ${deletionType} deleted for ${subjectUserEmail}`,
      subjectUserId,
      subjectUserEmail,
      subjectUserName,
      reason,
      metadata: { deletionType },
      tags: ['user_management', 'account_deletion', 'critical'],
      isPII: true,
      isRetentionProtected: deletionType === 'hard', // Protect hard deletions
    }, actorContext);
  }

  /**
   * Log password reset
   */
  async logPasswordReset(
    subjectUserId: string,
    subjectUserEmail: string,
    subjectUserName: string,
    actorContext: AuditContext,
    resetMethod: 'admin_initiated' | 'user_requested' = 'admin_initiated',
  ): Promise<void> {
    await this.log({
      action: AuditAction.USER_PASSWORD_RESET,
      level: AuditLevel.MEDIUM,
      description: `Password reset ${resetMethod} for ${subjectUserEmail}`,
      subjectUserId,
      subjectUserEmail,
      subjectUserName,
      metadata: { resetMethod },
      tags: ['security', 'password_reset'],
      isPII: true,
    }, actorContext);
  }

  /**
   * Log admin impersonation
   */
  async logImpersonationStarted(
    subjectUserId: string,
    subjectUserEmail: string,
    subjectUserName: string,
    actorContext: AuditContext,
  ): Promise<void> {
    await this.log({
      action: AuditAction.ADMIN_IMPERSONATION_STARTED,
      level: AuditLevel.HIGH,
      description: `Admin impersonation started for ${subjectUserEmail}`,
      subjectUserId,
      subjectUserEmail,
      subjectUserName,
      tags: ['security', 'impersonation', 'admin_action'],
      isPII: true,
    }, actorContext);
  }

  /**
   * Log admin impersonation end
   */
  async logImpersonationEnded(
    subjectUserId: string,
    subjectUserEmail: string,
    subjectUserName: string,
    actorContext: AuditContext,
    duration?: number, // Duration in minutes
  ): Promise<void> {
    await this.log({
      action: AuditAction.ADMIN_IMPERSONATION_ENDED,
      level: AuditLevel.HIGH,
      description: `Admin impersonation ended for ${subjectUserEmail}`,
      subjectUserId,
      subjectUserEmail,
      subjectUserName,
      metadata: { durationMinutes: duration },
      tags: ['security', 'impersonation', 'admin_action'],
      isPII: true,
    }, actorContext);
  }

  /**
   * Log bulk actions
   */
  async logBulkAction(
    action: string,
    userIds: string[],
    actorContext: AuditContext,
    results: { successCount: number; failureCount: number },
    reason?: string,
  ): Promise<void> {
    await this.log({
      action: AuditAction.ADMIN_BULK_ACTION,
      level: AuditLevel.HIGH,
      description: `Bulk action: ${action} performed on ${userIds.length} patients`,
      subjectUserId: 'bulk_operation',
      subjectUserEmail: 'multiple_users',
      subjectUserName: 'multiple_users',
      reason,
      metadata: {
        bulkAction: action,
        affectedUserIds: userIds,
        successCount: results.successCount,
        failureCount: results.failureCount,
        totalCount: userIds.length,
      },
      tags: ['bulk_action', 'admin_action'],
      isPII: false,
    }, actorContext);
  }

  /**
   * Log data export
   */
  async logDataExport(
    exportType: string,
    userIds: string[],
    actorContext: AuditContext,
    exportFields?: string[],
    includePII: boolean = false,
  ): Promise<void> {
    await this.log({
      action: AuditAction.USER_DATA_EXPORTED,
      level: includePII ? AuditLevel.HIGH : AuditLevel.MEDIUM,
      description: `Data export: ${exportType} for ${userIds.length} patients`,
      subjectUserId: 'data_export',
      subjectUserEmail: 'multiple_users',
      subjectUserName: 'multiple_users',
      metadata: {
        exportType,
        affectedUserIds: userIds,
        exportFields,
        includePII,
        userCount: userIds.length,
      },
      tags: ['data_export', 'admin_action', includePII ? 'pii_export' : 'safe_export'],
      isPII: includePII,
      isSensitive: includePII,
    }, actorContext);
  }

  /**
   * Get audit logs for a specific user
   */
  async getUserAuditLogs(
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<AuditLogDocument[]> {
    return this.auditLogModel
      .find({ subjectUserId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .exec();
  }

  /**
   * Get audit logs by action type
   */
  async getAuditLogsByAction(
    action: AuditAction,
    limit: number = 100,
    offset: number = 0,
  ): Promise<AuditLogDocument[]> {
    return this.auditLogModel
      .find({ action })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .exec();
  }

  /**
   * Get recent critical audit logs
   */
  async getCriticalAuditLogs(
    hours: number = 24,
    limit: number = 100,
  ): Promise<AuditLogDocument[]> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return this.auditLogModel
      .find({
        level: AuditLevel.CRITICAL,
        createdAt: { $gte: since },
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Sanitize user data for logging (remove sensitive fields)
   */
  private sanitizeUserData(data: Record<string, any> | undefined): Record<string, any> | undefined {
    if (!data) return undefined;

    const sensitiveFields = [
      'password',
      'refreshTokens',
      'resetToken',
      'verificationToken',
      'otpCode',
      'twoFactorSecret',
      'twoFactorRecoveryCodes',
    ];

    const sanitized = { ...data };
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Archive old audit logs (for compliance)
   */
  async archiveOldLogs(daysOld: number = 365): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    
    const result = await this.auditLogModel.updateMany(
      { 
        createdAt: { $lt: cutoffDate },
        isArchived: { $ne: true },
        isRetentionProtected: { $ne: true },
      },
      { isArchived: true }
    );

    this.logger.log(`Archived ${result.modifiedCount} audit logs older than ${daysOld} days`);
    return result.modifiedCount;
  }
}