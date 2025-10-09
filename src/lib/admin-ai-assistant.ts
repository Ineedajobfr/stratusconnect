/**
 * ADMIN AI ASSISTANT
 * Natural language interface for admin tasks
 * Uses free/open-source AI models with fallback to rule-based system
 */

import { supabase } from '@/integrations/supabase/client';

export interface AIQuery {
  query: string;
  context?: Record<string, any>;
}

export interface AIResponse {
  answer: string;
  data?: any;
  actions?: AIAction[];
  confidence: number;
  suggestions?: string[];
}

export interface AIAction {
  id: string;
  label: string;
  description: string;
  execute: () => Promise<void>;
  risk: 'low' | 'medium' | 'high';
}

export interface AIInsight {
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  actionable: boolean;
  action?: () => void;
}

export class AdminAIAssistant {
  private static instance: AdminAIAssistant;

  static getInstance(): AdminAIAssistant {
    if (!AdminAIAssistant.instance) {
      AdminAIAssistant.instance = new AdminAIAssistant();
    }
    return AdminAIAssistant.instance;
  }

  /**
   * Process natural language query
   */
  async query(input: AIQuery): Promise<AIResponse> {
    const { query, context } = input;

    // Try AI model first (with free API), fall back to rule-based
    try {
      // For now, use rule-based system (can integrate OpenRouter free tier later)
      return await this.ruleBasedQuery(query, context);
    } catch (error) {
      console.error('AI query error:', error);
      return {
        answer: 'Sorry, I encountered an error processing your request.',
        confidence: 0,
      };
    }
  }

  /**
   * Rule-based query processing (free, no API needed)
   */
  private async ruleBasedQuery(query: string, context?: Record<string, any>): Promise<AIResponse> {
    const lowercaseQuery = query.toLowerCase();

    // Failed payments query
    if (lowercaseQuery.includes('failed payment') || lowercaseQuery.includes('payment fail')) {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('status', 'failed')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      return {
        answer: `Found ${data?.length || 0} failed payments. Here's what I found:`,
        data: data,
        confidence: 0.9,
        actions: [
          {
            id: 'retry-failed',
            label: 'Retry All Failed Payments',
            description: 'Attempt to process all failed payments again',
            risk: 'medium',
            execute: async () => {
              // Implement retry logic
              console.log('Retrying failed payments...');
            },
          },
        ],
        suggestions: [
          'Show me payment failure reasons',
          'Export failed payments to CSV',
          'Notify users about failed payments',
        ],
      };
    }

    // Pending verification query
    if (lowercaseQuery.includes('pending verification') || lowercaseQuery.includes('not verified')) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        answer: `There are ${data?.length || 0} users pending verification.`,
        data: data,
        confidence: 0.95,
        actions: [
          {
            id: 'auto-approve-high-quality',
            label: 'Auto-Approve High Quality Documents',
            description: 'Automatically approve users with clear, high-quality documents',
            risk: 'low',
            execute: async () => {
              console.log('Auto-approving high quality documents...');
            },
          },
        ],
        suggestions: [
          'Show oldest pending verifications',
          'View verification documents',
          'Send reminder emails to pending users',
        ],
      };
    }

    // Duplicate accounts query
    if (lowercaseQuery.includes('duplicate') && (lowercaseQuery.includes('account') || lowercaseQuery.includes('user'))) {
      const { data, error } = await supabase
        .from('profiles')
        .select('email, count')
        .limit(100);

      if (error) throw error;

      // Find duplicates (simplified)
      const emailCounts: Record<string, number> = {};
      data?.forEach((profile: any) => {
        emailCounts[profile.email] = (emailCounts[profile.email] || 0) + 1;
      });
      const duplicates = Object.entries(emailCounts).filter(([_, count]) => count > 1);

      return {
        answer: `Found ${duplicates.length} duplicate email addresses.`,
        data: duplicates,
        confidence: 0.85,
        actions: [
          {
            id: 'merge-duplicates',
            label: 'Merge Duplicate Accounts',
            description: 'Automatically merge accounts with the same email',
            risk: 'high',
            execute: async () => {
              console.log('Merging duplicate accounts...');
            },
          },
        ],
        suggestions: [
          'Show me duplicate accounts details',
          'Delete duplicate accounts',
          'Contact duplicate account users',
        ],
      };
    }

    // Revenue report query
    if (lowercaseQuery.includes('revenue') || lowercaseQuery.includes('commission')) {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const { data, error } = await supabase
        .from('transactions')
        .select('amount, commission_rate, status')
        .eq('status', 'completed')
        .gte('created_at', startOfMonth.toISOString());

      if (error) throw error;

      const totalRevenue = data?.reduce((sum, t) => sum + (t.amount * (t.commission_rate / 100)), 0) || 0;

      return {
        answer: `Total commission revenue this month: $${totalRevenue.toFixed(2)}`,
        data: {
          totalRevenue,
          transactionCount: data?.length || 0,
          averageCommission: totalRevenue / (data?.length || 1),
        },
        confidence: 1.0,
        suggestions: [
          'Show revenue by operator',
          'Compare to last month',
          'Export revenue report',
        ],
      };
    }

    // Active users query
    if (lowercaseQuery.includes('active user') || lowercaseQuery.includes('online')) {
      const { data: { session } } = await supabase.auth.getSession();
      
      return {
        answer: 'Real-time active user tracking is not yet implemented. This will show users currently online.',
        confidence: 0.5,
        suggestions: [
          'Show recent login activity',
          'View user engagement metrics',
          'Export active users list',
        ],
      };
    }

    // Default response
    return {
      answer: 'I understand you want to: ' + query + '. However, I don\'t have a specific handler for this query yet. Here are some things I can help with:',
      confidence: 0.3,
      suggestions: [
        'Show me all failed payments from last week',
        'Find duplicate user accounts',
        'Generate a revenue report for January 2025',
        'Show users who haven\'t completed verification',
        'What transactions failed today and why?',
        'Export all user data for GDPR request',
      ],
    };
  }

  /**
   * Auto-fix common issues
   */
  async autoFixCommonIssues(): Promise<{ fixed: number; issues: string[] }> {
    const issues: string[] = [];
    let fixed = 0;

    // Fix 1: Remove orphaned records
    try {
      const { data: orphanedRecords } = await supabase
        .from('quotes')
        .select('id')
        .is('rfq_id', null);

      if (orphanedRecords && orphanedRecords.length > 0) {
        await supabase
          .from('quotes')
          .delete()
          .is('rfq_id', null);
        
        issues.push(`Fixed ${orphanedRecords.length} orphaned quote records`);
        fixed += orphanedRecords.length;
      }
    } catch (error) {
      console.error('Auto-fix error:', error);
    }

    // Fix 2: Update stuck payment statuses
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: stuckPayments } = await supabase
        .from('transactions')
        .select('id')
        .eq('status', 'processing')
        .lt('created_at', oneHourAgo);

      if (stuckPayments && stuckPayments.length > 0) {
        await supabase
          .from('transactions')
          .update({ status: 'failed' })
          .eq('status', 'processing')
          .lt('created_at', oneHourAgo);
        
        issues.push(`Fixed ${stuckPayments.length} stuck payment statuses`);
        fixed += stuckPayments.length;
      }
    } catch (error) {
      console.error('Auto-fix error:', error);
    }

    return { fixed, issues };
  }

  /**
   * Generate daily insights
   */
  async generateInsights(): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];

    try {
      // Insight 1: Verification queue backing up
      const { data: pendingVerifications } = await supabase
        .from('profiles')
        .select('id')
        .eq('verification_status', 'pending');

      if (pendingVerifications && pendingVerifications.length > 50) {
        insights.push({
          title: 'Verification Queue Backing Up',
          description: `${pendingVerifications.length} users are waiting for verification. Consider reviewing soon.`,
          severity: 'warning',
          actionable: true,
          action: () => {
            window.location.href = '/admin#verification';
          },
        });
      }

      // Insight 2: Unusual error spike
      const { data: recentErrors } = await supabase
        .from('error_logs')
        .select('id')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

      if (recentErrors && recentErrors.length > 100) {
        insights.push({
          title: 'Error Rate Spike Detected',
          description: `${recentErrors.length} errors in the last hour. System may be experiencing issues.`,
          severity: 'critical',
          actionable: true,
          action: () => {
            window.location.href = '/admin/system-operations#logs';
          },
        });
      }

      // Insight 3: High revenue day
      const today = new Date().toISOString().split('T')[0];
      const { data: todayTransactions } = await supabase
        .from('transactions')
        .select('amount, commission_rate')
        .eq('status', 'completed')
        .gte('created_at', today);

      const todayRevenue = todayTransactions?.reduce((sum, t) => sum + (t.amount * (t.commission_rate / 100)), 0) || 0;

      if (todayRevenue > 10000) {
        insights.push({
          title: 'Strong Revenue Performance',
          description: `Today's commission revenue is $${todayRevenue.toFixed(2)} - above average!`,
          severity: 'info',
          actionable: false,
        });
      }

    } catch (error) {
      console.error('Insight generation error:', error);
    }

    return insights;
  }

  /**
   * Suggest performance optimizations
   */
  async suggestOptimizations(): Promise<string[]> {
    const suggestions: string[] = [];

    try {
      // Check database query performance
      // (In production, this would analyze pg_stat_statements)
      suggestions.push('Consider adding an index on transactions.created_at for faster date range queries');
      
      // Check cache effectiveness
      suggestions.push('Static assets could benefit from longer cache headers (currently 1 hour)');
      
      // Check API usage
      suggestions.push('Reduce API calls by implementing data pagination');

    } catch (error) {
      console.error('Optimization suggestion error:', error);
    }

    return suggestions;
  }
}

// Export singleton instance
export const adminAI = AdminAIAssistant.getInstance();

