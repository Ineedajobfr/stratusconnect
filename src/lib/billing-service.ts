// Billing Service for Operators
// Handles Stripe Connect payouts, transaction history, and commission tracking

import { supabase } from '@/integrations/supabase/client';

export interface OperatorBillingData {
  totalEarned: number;
  pendingPayouts: number;
  commissionPaid: number;
  recentTransactions: Transaction[];
  payoutSchedule: PayoutSchedule;
  stripeConnectStatus: StripeConnectStatus;
}

export interface Transaction {
  id: string;
  type: 'payment' | 'payout' | 'refund' | 'chargeback';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  dealId?: string;
  bookingId?: string;
  createdAt: string;
  completedAt?: string;
  metadata?: Record<string, any>;
}

export interface PayoutSchedule {
  nextPayoutDate: string;
  nextPayoutAmount: number;
  payoutFrequency: 'daily' | 'weekly' | 'monthly';
  minimumPayoutAmount: number;
}

export interface StripeConnectStatus {
  accountId: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  requirements: {
    currentlyDue: string[];
    eventuallyDue: string[];
    pastDue: string[];
  };
  capabilities: {
    card_payments: string;
    transfers: string;
  };
}

export interface CommissionBreakdown {
  totalRevenue: number;
  platformCommission: number;
  operatorPayout: number;
  commissionRate: number;
  transactionCount: number;
}

class BillingService {
  /**
   * Get operator billing dashboard data
   */
  async getOperatorBillingData(operatorId: string): Promise<OperatorBillingData> {
    try {
      // Get transactions from database
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('operator_id', operatorId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
        throw new Error('Failed to fetch transactions');
      }

      // Calculate totals
      const totalEarned = transactions
        ?.filter(t => t.type === 'payout' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      const pendingPayouts = transactions
        ?.filter(t => t.type === 'payout' && t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      const commissionPaid = transactions
        ?.filter(t => t.type === 'commission' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      // Get Stripe Connect status
      const stripeConnectStatus = await this.getStripeConnectStatus(operatorId);

      // Get payout schedule
      const payoutSchedule = await this.getPayoutSchedule(operatorId);

      return {
        totalEarned,
        pendingPayouts,
        commissionPaid,
        recentTransactions: transactions || [],
        payoutSchedule,
        stripeConnectStatus
      };
    } catch (error) {
      console.error('Error getting operator billing data:', error);
      throw error;
    }
  }

  /**
   * Get Stripe Connect account status
   */
  async getStripeConnectStatus(operatorId: string): Promise<StripeConnectStatus> {
    try {
      // Get Stripe account ID from user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('stripe_account_id')
        .eq('id', operatorId)
        .single();

      if (profileError || !profile?.stripe_account_id) {
        return {
          accountId: '',
          chargesEnabled: false,
          payoutsEnabled: false,
          detailsSubmitted: false,
          requirements: {
            currentlyDue: ['Create Stripe Connect account'],
            eventuallyDue: [],
            pastDue: []
          },
          capabilities: {
            card_payments: 'inactive',
            transfers: 'inactive'
          }
        };
      }

      // In a real implementation, you would call Stripe API here
      // For now, return mock data
      return {
        accountId: profile.stripe_account_id,
        chargesEnabled: true,
        payoutsEnabled: true,
        detailsSubmitted: true,
        requirements: {
          currentlyDue: [],
          eventuallyDue: [],
          pastDue: []
        },
        capabilities: {
          card_payments: 'active',
          transfers: 'active'
        }
      };
    } catch (error) {
      console.error('Error getting Stripe Connect status:', error);
      throw error;
    }
  }

  /**
   * Get payout schedule information
   */
  async getPayoutSchedule(operatorId: string): Promise<PayoutSchedule> {
    // In a real implementation, this would come from Stripe API
    return {
      nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      nextPayoutAmount: 0, // Would be calculated from pending transactions
      payoutFrequency: 'weekly',
      minimumPayoutAmount: 10000 // $100.00 in cents
    };
  }

  /**
   * Get commission breakdown for a period
   */
  async getCommissionBreakdown(
    operatorId: string, 
    startDate: string, 
    endDate: string
  ): Promise<CommissionBreakdown> {
    try {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('operator_id', operatorId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .in('type', ['payment', 'commission']);

      if (error) {
        console.error('Error fetching commission data:', error);
        throw new Error('Failed to fetch commission data');
      }

      const totalRevenue = transactions
        ?.filter(t => t.type === 'payment')
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      const platformCommission = transactions
        ?.filter(t => t.type === 'commission')
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      const operatorPayout = totalRevenue - platformCommission;
      const commissionRate = totalRevenue > 0 ? (platformCommission / totalRevenue) * 100 : 0;

      return {
        totalRevenue,
        platformCommission,
        operatorPayout,
        commissionRate,
        transactionCount: transactions?.length || 0
      };
    } catch (error) {
      console.error('Error getting commission breakdown:', error);
      throw error;
    }
  }

  /**
   * Create Stripe Connect account for operator
   */
  async createStripeConnectAccount(operatorId: string, email: string): Promise<string> {
    try {
      // In a real implementation, this would call Stripe API
      // For now, return a mock account ID
      const mockAccountId = `acct_${Date.now()}`;

      // Update user profile with Stripe account ID
      const { error } = await supabase
        .from('profiles')
        .update({ stripe_account_id: mockAccountId })
        .eq('id', operatorId);

      if (error) {
        console.error('Error updating profile with Stripe account ID:', error);
        throw new Error('Failed to update profile');
      }

      return mockAccountId;
    } catch (error) {
      console.error('Error creating Stripe Connect account:', error);
      throw error;
    }
  }

  /**
   * Get transaction history with filters
   */
  async getTransactionHistory(
    operatorId: string,
    filters: {
      type?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ transactions: Transaction[]; total: number }> {
    try {
      let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('operator_id', operatorId);

      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      query = query
        .order('created_at', { ascending: false })
        .range(
          filters.offset || 0,
          (filters.offset || 0) + (filters.limit || 50) - 1
        );

      const { data: transactions, error, count } = await query;

      if (error) {
        console.error('Error fetching transaction history:', error);
        throw new Error('Failed to fetch transaction history');
      }

      return {
        transactions: transactions || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw error;
    }
  }

  /**
   * Generate invoice for a transaction
   */
  async generateInvoice(transactionId: string): Promise<{ invoiceUrl: string; invoiceId: string }> {
    try {
      // In a real implementation, this would generate a PDF invoice
      // For now, return mock data
      return {
        invoiceUrl: `/invoices/${transactionId}.pdf`,
        invoiceId: `inv_${transactionId}`
      };
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  }

  /**
   * Get payment methods for operator
   */
  async getPaymentMethods(operatorId: string): Promise<any[]> {
    try {
      // In a real implementation, this would call Stripe API
      // For now, return mock data
      return [
        {
          id: 'pm_1234567890',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2025
          }
        }
      ];
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  /**
   * Update payout settings
   */
  async updatePayoutSettings(
    operatorId: string,
    settings: {
      frequency: 'daily' | 'weekly' | 'monthly';
      minimumAmount: number;
    }
  ): Promise<void> {
    try {
      // In a real implementation, this would update Stripe Connect settings
      // For now, just log the update
      console.log('Updating payout settings for operator:', operatorId, settings);
    } catch (error) {
      console.error('Error updating payout settings:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const billingService = new BillingService();
