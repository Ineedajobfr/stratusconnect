/**
 * AUDIT LOGGER
 * Complete admin action tracking for compliance and accountability
 * Every admin action is logged with full context
 */

import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  affectedTable?: string;
  affectedRecordId?: string;
  createdAt: string;
}

export interface AuditSearchFilters {
  adminId?: string;
  action?: string;
  affectedTable?: string;
  startDate?: string;
  endDate?: string;
}

export class AuditLogger {
  private static instance: AuditLogger;

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  /**
   * Log an admin action
   */
  async logAction(
    action: string,
    details: Record<string, any> = {},
    affectedTable?: string,
    affectedRecordId?: string
  ): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('Cannot log action: No user authenticated');
        return null;
      }

      // Get IP address and user agent from browser
      const ipAddress = await this.getClientIP();
      const userAgent = navigator.userAgent;

      const { data, error } = await supabase
        .from('admin_audit_log')
        .insert({
          admin_id: user.id,
          action,
          details,
          ip_address: ipAddress,
          user_agent: userAgent,
          affected_table: affectedTable,
          affected_record_id: affectedRecordId,
        })
        .select('id')
        .single();

      if (error) throw error;

      return data?.id || null;
    } catch (error) {
      console.error('Failed to log admin action:', error);
      return null;
    }
  }

  /**
   * Log user approval
   */
  async logUserApproval(userId: string, reason?: string): Promise<void> {
    await this.logAction(
      'user_approved',
      { userId, reason },
      'profiles',
      userId
    );
  }

  /**
   * Log user rejection
   */
  async logUserRejection(userId: string, reason: string): Promise<void> {
    await this.logAction(
      'user_rejected',
      { userId, reason },
      'profiles',
      userId
    );
  }

  /**
   * Log transaction refund
   */
  async logTransactionRefund(transactionId: string, amount: number, reason: string): Promise<void> {
    await this.logAction(
      'transaction_refunded',
      { transactionId, amount, reason },
      'transactions',
      transactionId
    );
  }

  /**
   * Log commission rate change
   */
  async logCommissionRateChange(
    oldRate: number,
    newRate: number,
    effectiveDate: string,
    reason: string
  ): Promise<void> {
    await this.logAction(
      'commission_rate_changed',
      { oldRate, newRate, effectiveDate, reason },
      'settings',
      'commission_rate'
    );
  }

  /**
   * Log feature flag change
   */
  async logFeatureFlagChange(flagName: string, enabled: boolean): Promise<void> {
    await this.logAction(
      'feature_flag_changed',
      { flagName, enabled },
      'feature_flags',
      flagName
    );
  }

  /**
   * Log user data export (GDPR)
   */
  async logDataExport(userId: string, format: string): Promise<void> {
    await this.logAction(
      'user_data_exported',
      { userId, format },
      'profiles',
      userId
    );
  }

  /**
   * Log user impersonation
   */
  async logUserImpersonation(targetUserId: string, reason: string): Promise<void> {
    await this.logAction(
      'user_impersonated',
      { targetUserId, reason },
      'profiles',
      targetUserId
    );
  }

  /**
   * Log bulk action
   */
  async logBulkAction(
    action: string,
    affectedCount: number,
    criteria: Record<string, any>
  ): Promise<void> {
    await this.logAction(
      `bulk_${action}`,
      { affectedCount, criteria }
    );
  }

  /**
   * Search audit logs
   */
  async searchLogs(filters: AuditSearchFilters, limit: number = 100): Promise<AuditLog[]> {
    try {
      let query = supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (filters.adminId) {
        query = query.eq('admin_id', filters.adminId);
      }

      if (filters.action) {
        query = query.ilike('action', `%${filters.action}%`);
      }

      if (filters.affectedTable) {
        query = query.eq('affected_table', filters.affectedTable);
      }

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Failed to search audit logs:', error);
      return [];
    }
  }

  /**
   * Get logs for a specific record
   */
  async getRecordHistory(table: string, recordId: string): Promise<AuditLog[]> {
    try {
      const { data, error } = await supabase
        .from('admin_audit_log')
        .select('*')
        .eq('affected_table', table)
        .eq('affected_record_id', recordId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get record history:', error);
      return [];
    }
  }

  /**
   * Generate audit report for compliance
   */
  async generateAuditReport(
    startDate: string,
    endDate: string
  ): Promise<{
    totalActions: number;
    actionsByType: Record<string, number>;
    actionsByAdmin: Record<string, number>;
    criticalActions: AuditLog[];
  }> {
    try {
      const { data: logs, error } = await supabase
        .from('admin_audit_log')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;

      const totalActions = logs?.length || 0;

      // Group by action type
      const actionsByType: Record<string, number> = {};
      logs?.forEach((log) => {
        actionsByType[log.action] = (actionsByType[log.action] || 0) + 1;
      });

      // Group by admin
      const actionsByAdmin: Record<string, number> = {};
      logs?.forEach((log) => {
        actionsByAdmin[log.admin_id] = (actionsByAdmin[log.admin_id] || 0) + 1;
      });

      // Filter critical actions
      const criticalActions = logs?.filter((log) =>
        log.action.includes('delete') ||
        log.action.includes('suspend') ||
        log.action.includes('reject') ||
        log.action.includes('refund')
      ) || [];

      return {
        totalActions,
        actionsByType,
        actionsByAdmin,
        criticalActions,
      };
    } catch (error) {
      console.error('Failed to generate audit report:', error);
      return {
        totalActions: 0,
        actionsByType: {},
        actionsByAdmin: {},
        criticalActions: [],
      };
    }
  }

  /**
   * Rollback action (if possible)
   */
  async rollbackAction(logId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Get the audit log
      const { data: log, error } = await supabase
        .from('admin_audit_log')
        .select('*')
        .eq('id', logId)
        .single();

      if (error || !log) {
        return { success: false, message: 'Audit log not found' };
      }

      // Implement rollback logic based on action type
      switch (log.action) {
        case 'user_suspended':
          // Unsuspend the user
          await supabase
            .from('profiles')
            .update({ status: 'active', suspended_at: null, suspended_reason: null })
            .eq('id', log.affected_record_id);
          
          await this.logAction(
            'user_unsuspended',
            { reason: `Rollback of action ${logId}`, originalAction: log.action },
            'profiles',
            log.affected_record_id
          );
          
          return { success: true, message: 'User unsuspended successfully' };

        case 'transaction_refunded':
          return { success: false, message: 'Transaction refunds cannot be automatically rolled back. Contact payment processor.' };

        case 'user_rejected':
          // Change status back to pending
          await supabase
            .from('profiles')
            .update({ verification_status: 'pending', rejection_reason: null })
            .eq('id', log.affected_record_id);
          
          await this.logAction(
            'rejection_rolled_back',
            { reason: `Rollback of action ${logId}` },
            'profiles',
            log.affected_record_id
          );
          
          return { success: true, message: 'Rejection rolled back successfully' };

        default:
          return { success: false, message: `Rollback not implemented for action type: ${log.action}` };
      }
    } catch (error: any) {
      console.error('Rollback error:', error);
      return { success: false, message: error.message || 'Rollback failed' };
    }
  }

  /**
   * Get admin activity summary
   */
  async getAdminActivitySummary(adminId: string, days: number = 30): Promise<{
    totalActions: number;
    recentActions: AuditLog[];
    mostCommonAction: string;
    actionsPerDay: number;
  }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: logs, error } = await supabase
        .from('admin_audit_log')
        .select('*')
        .eq('admin_id', adminId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalActions = logs?.length || 0;
      const recentActions = logs?.slice(0, 10) || [];

      // Find most common action
      const actionCounts: Record<string, number> = {};
      logs?.forEach((log) => {
        actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
      });
      
      const mostCommonAction = Object.entries(actionCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';

      const actionsPerDay = totalActions / days;

      return {
        totalActions,
        recentActions,
        mostCommonAction,
        actionsPerDay,
      };
    } catch (error) {
      console.error('Failed to get admin activity summary:', error);
      return {
        totalActions: 0,
        recentActions: [],
        mostCommonAction: 'None',
        actionsPerDay: 0,
      };
    }
  }

  /**
   * Get client IP address (best effort)
   */
  private async getClientIP(): Promise<string | undefined> {
    try {
      // In production, this would be set by edge functions or server
      // For now, return undefined (will be populated server-side)
      return undefined;
    } catch (error) {
      return undefined;
    }
  }
}

// Pre-defined action types for type safety
export const AUDIT_ACTIONS = {
  // User management
  USER_APPROVED: 'user_approved',
  USER_REJECTED: 'user_rejected',
  USER_SUSPENDED: 'user_suspended',
  USER_UNSUSPENDED: 'user_unsuspended',
  USER_DELETED: 'user_deleted',
  USER_IMPERSONATED: 'user_impersonated',
  USER_DATA_EXPORTED: 'user_data_exported',
  
  // Transaction management
  TRANSACTION_REFUNDED: 'transaction_refunded',
  TRANSACTION_DISPUTED: 'transaction_disputed',
  TRANSACTION_MANUALLY_COMPLETED: 'transaction_manually_completed',
  
  // System configuration
  COMMISSION_RATE_CHANGED: 'commission_rate_changed',
  FEATURE_FLAG_CHANGED: 'feature_flag_changed',
  AUTOMATION_RULE_CREATED: 'automation_rule_created',
  AUTOMATION_RULE_UPDATED: 'automation_rule_updated',
  AUTOMATION_RULE_DELETED: 'automation_rule_deleted',
  
  // Security
  FRAUD_ALERT_REVIEWED: 'fraud_alert_reviewed',
  BLOCKLIST_ITEM_ADDED: 'blocklist_item_added',
  BLOCKLIST_ITEM_REMOVED: 'blocklist_item_removed',
  
  // Bulk operations
  BULK_USER_APPROVAL: 'bulk_user_approval',
  BULK_USER_REJECTION: 'bulk_user_rejection',
  BULK_DATA_EXPORT: 'bulk_data_export',
} as const;

// Export singleton
export const auditLogger = AuditLogger.getInstance();

