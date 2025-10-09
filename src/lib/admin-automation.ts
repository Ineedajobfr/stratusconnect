/**
 * ADMIN AUTOMATION ENGINE
 * Configurable automation rules for common admin tasks
 * Visual flow builder with drag-and-drop conditions
 */

import { supabase } from '@/integrations/supabase/client';

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  trigger: TriggerType;
  conditions: Condition[];
  actions: AutomationAction[];
  enabled: boolean;
  executionCount: number;
  lastExecuted?: string;
  createdBy: string;
  createdAt: string;
}

export type TriggerType =
  | 'new_verification_request'
  | 'payment_failed'
  | 'user_reported_spam'
  | 'inactive_operator'
  | 'document_uploaded'
  | 'transaction_completed'
  | 'support_ticket_created'
  | 'system_error';

export interface Condition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: any;
}

export interface AutomationAction {
  type: ActionType;
  params: Record<string, any>;
}

export type ActionType =
  | 'auto_approve'
  | 'auto_reject'
  | 'send_email'
  | 'send_notification'
  | 'update_status'
  | 'flag_for_review'
  | 'suspend_account'
  | 'retry_payment'
  | 'assign_to_admin'
  | 'webhook';

export interface AutomationExecutionResult {
  success: boolean;
  ruleId: string;
  executedAt: string;
  affectedRecords: number;
  error?: string;
}

export class AdminAutomation {
  private static instance: AdminAutomation;

  static getInstance(): AdminAutomation {
    if (!AdminAutomation.instance) {
      AdminAutomation.instance = new AdminAutomation();
    }
    return AdminAutomation.instance;
  }

  /**
   * Get all automation rules
   */
  async getRules(): Promise<AutomationRule[]> {
    const { data, error } = await supabase
      .from('admin_automation_rules')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Create new automation rule
   */
  async createRule(rule: Omit<AutomationRule, 'id' | 'executionCount' | 'createdAt'>): Promise<AutomationRule> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('admin_automation_rules')
      .insert({
        name: rule.name,
        description: rule.description,
        trigger: rule.trigger,
        condition: rule.conditions,
        action: rule.actions,
        enabled: rule.enabled,
        execution_count: 0,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update automation rule
   */
  async updateRule(id: string, updates: Partial<AutomationRule>): Promise<void> {
    const { error } = await supabase
      .from('admin_automation_rules')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Delete automation rule
   */
  async deleteRule(id: string): Promise<void> {
    const { error } = await supabase
      .from('admin_automation_rules')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Execute a specific rule manually (for testing)
   */
  async executeRule(ruleId: string, testData?: any): Promise<AutomationExecutionResult> {
    try {
      const { data: rule } = await supabase
        .from('admin_automation_rules')
        .select('*')
        .eq('id', ruleId)
        .single();

      if (!rule) throw new Error('Rule not found');
      if (!rule.enabled) throw new Error('Rule is disabled');

      // Execute actions
      let affectedRecords = 0;
      for (const action of rule.action) {
        affectedRecords += await this.executeAction(action, testData);
      }

      // Update execution count
      await supabase
        .from('admin_automation_rules')
        .update({
          execution_count: rule.execution_count + 1,
          last_executed: new Date().toISOString(),
        })
        .eq('id', ruleId);

      return {
        success: true,
        ruleId,
        executedAt: new Date().toISOString(),
        affectedRecords,
      };
    } catch (error: any) {
      return {
        success: false,
        ruleId,
        executedAt: new Date().toISOString(),
        affectedRecords: 0,
        error: error.message,
      };
    }
  }

  /**
   * Check if trigger conditions are met
   */
  private checkConditions(conditions: Condition[], data: any): boolean {
    return conditions.every((condition) => {
      const fieldValue = data[condition.field];
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'not_equals':
          return fieldValue !== condition.value;
        case 'greater_than':
          return Number(fieldValue) > Number(condition.value);
        case 'less_than':
          return Number(fieldValue) < Number(condition.value);
        case 'contains':
          return String(fieldValue).includes(String(condition.value));
        case 'not_contains':
          return !String(fieldValue).includes(String(condition.value));
        default:
          return false;
      }
    });
  }

  /**
   * Execute a specific action
   */
  private async executeAction(action: AutomationAction, data?: any): Promise<number> {
    switch (action.type) {
      case 'auto_approve':
        return await this.autoApproveAction(action.params);
      
      case 'auto_reject':
        return await this.autoRejectAction(action.params);
      
      case 'send_email':
        return await this.sendEmailAction(action.params);
      
      case 'send_notification':
        return await this.sendNotificationAction(action.params);
      
      case 'update_status':
        return await this.updateStatusAction(action.params);
      
      case 'suspend_account':
        return await this.suspendAccountAction(action.params);
      
      case 'retry_payment':
        return await this.retryPaymentAction(action.params);
      
      default:
        console.warn('Unknown action type:', action.type);
        return 0;
    }
  }

  // Action implementations
  
  private async autoApproveAction(params: Record<string, any>): Promise<number> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ verification_status: 'approved', verified_at: new Date().toISOString() })
      .eq('id', params.userId);

    if (error) throw error;
    return 1;
  }

  private async autoRejectAction(params: Record<string, any>): Promise<number> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        verification_status: 'rejected', 
        rejection_reason: params.reason || 'Automated rejection'
      })
      .eq('id', params.userId);

    if (error) throw error;
    return 1;
  }

  private async sendEmailAction(params: Record<string, any>): Promise<number> {
    // In production, integrate with email service (SendGrid, Resend, etc.)
    console.log('Sending email:', params);
    // For now, just log
    return 1;
  }

  private async sendNotificationAction(params: Record<string, any>): Promise<number> {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: params.userId,
        title: params.title,
        message: params.message,
        type: params.type || 'info',
      });

    if (error) throw error;
    return 1;
  }

  private async updateStatusAction(params: Record<string, any>): Promise<number> {
    const { error } = await supabase
      .from(params.table)
      .update({ status: params.status })
      .eq('id', params.recordId);

    if (error) throw error;
    return 1;
  }

  private async suspendAccountAction(params: Record<string, any>): Promise<number> {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        status: 'suspended', 
        suspended_reason: params.reason,
        suspended_at: new Date().toISOString(),
      })
      .eq('id', params.userId);

    if (error) throw error;
    return 1;
  }

  private async retryPaymentAction(params: Record<string, any>): Promise<number> {
    // In production, integrate with payment gateway
    console.log('Retrying payment:', params);
    return 1;
  }

  /**
   * Get automation analytics
   */
  async getAnalytics(ruleId?: string): Promise<{
    totalExecutions: number;
    successRate: number;
    averageAffectedRecords: number;
  }> {
    let query = supabase
      .from('admin_automation_rules')
      .select('execution_count');

    if (ruleId) {
      query = query.eq('id', ruleId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const totalExecutions = data?.reduce((sum, rule) => sum + (rule.execution_count || 0), 0) || 0;

    return {
      totalExecutions,
      successRate: 0.95, // Mock for now
      averageAffectedRecords: 2.3, // Mock for now
    };
  }
}

// Pre-defined automation rule templates
export const AUTOMATION_TEMPLATES: Omit<AutomationRule, 'id' | 'executionCount' | 'createdBy' | 'createdAt' | 'lastExecuted'>[] = [
  {
    name: 'Auto-Approve High Quality Verifications',
    description: 'Automatically approve verification requests with document quality > 90%',
    trigger: 'document_uploaded',
    conditions: [
      { field: 'document_quality_score', operator: 'greater_than', value: 90 },
    ],
    actions: [
      { type: 'auto_approve', params: {} },
      { type: 'send_notification', params: { title: 'Verification Approved', message: 'Your account has been verified!' } },
    ],
    enabled: true,
  },
  {
    name: 'Suspend Spam Accounts',
    description: 'Suspend accounts reported as spam by 3+ different users',
    trigger: 'user_reported_spam',
    conditions: [
      { field: 'report_count', operator: 'greater_than', value: 3 },
    ],
    actions: [
      { type: 'suspend_account', params: { reason: 'Multiple spam reports' } },
      { type: 'send_notification', params: { title: 'Account Suspended', message: 'Your account has been suspended due to spam reports' } },
    ],
    enabled: true,
  },
  {
    name: 'Retry Failed Payments',
    description: 'Automatically retry failed payments after 1 hour',
    trigger: 'payment_failed',
    conditions: [
      { field: 'retry_count', operator: 'less_than', value: 3 },
    ],
    actions: [
      { type: 'retry_payment', params: {} },
    ],
    enabled: true,
  },
  {
    name: 'Re-engage Inactive Operators',
    description: 'Send re-engagement email to operators inactive for 90 days',
    trigger: 'inactive_operator',
    conditions: [
      { field: 'days_inactive', operator: 'greater_than', value: 90 },
    ],
    actions: [
      { type: 'send_email', params: { 
        template: 'reengagement', 
        subject: 'We miss you on StratusConnect!' 
      } },
    ],
    enabled: false,
  },
];

// Export singleton
export const adminAutomation = AdminAutomation.getInstance();

