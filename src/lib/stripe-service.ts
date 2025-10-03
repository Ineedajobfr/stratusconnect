// Stripe Payment Service - Secure payment processing
// Handles deposits, final payments, and commission splits

import { supabase } from '@/integrations/supabase/client';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  bookingId: string;
  description: string;
  created: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: 'deposit' | 'final_payment' | 'commission' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  from: string; // user/company ID
  to: string; // user/company ID
  bookingId: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  completedAt?: string;
}

class StripeService {
  private publishableKey: string;

  constructor() {
    // In production, this would come from environment variables
    this.publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
  }

  // Create a payment intent for deposit (typically 30%)
  async createDepositPayment(bookingId: string, totalAmount: number): Promise<PaymentIntent> {
    try {
      const depositAmount = Math.round(totalAmount * 0.30);

      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: depositAmount,
          currency: 'usd',
          bookingId,
          type: 'deposit',
          description: `Deposit for booking ${bookingId}`
        }
      });

      if (error) throw error;

      return {
        id: data.paymentIntentId,
        amount: depositAmount,
        currency: 'usd',
        status: 'pending',
        bookingId,
        description: `Deposit for booking ${bookingId}`,
        created: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to create deposit payment:', error);
      throw new Error('Failed to create deposit payment');
    }
  }

  // Create final payment intent (remaining 70%)
  async createFinalPayment(bookingId: string, totalAmount: number): Promise<PaymentIntent> {
    try {
      const finalAmount = Math.round(totalAmount * 0.70);

      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: finalAmount,
          currency: 'usd',
          bookingId,
          type: 'final_payment',
          description: `Final payment for booking ${bookingId}`
        }
      });

      if (error) throw error;

      return {
        id: data.paymentIntentId,
        amount: finalAmount,
        currency: 'usd',
        status: 'pending',
        bookingId,
        description: `Final payment for booking ${bookingId}`,
        created: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to create final payment:', error);
      throw new Error('Failed to create final payment');
    }
  }

  // Process commission split
  async processCommission(bookingId: string, totalAmount: number): Promise<Transaction[]> {
    try {
      // Commission structure:
      // - Broker: 10% of total
      // - Platform: 7% of total
      // - Operator: 83% of total

      const brokerCommission = Math.round(totalAmount * 0.10);
      const platformFee = Math.round(totalAmount * 0.07);
      const operatorPayment = totalAmount - brokerCommission - platformFee;

      const { data, error } = await supabase.functions.invoke('process-commission', {
        body: {
          bookingId,
          totalAmount,
          brokerCommission,
          platformFee,
          operatorPayment
        }
      });

      if (error) throw error;

      return [
        {
          id: `txn_broker_${bookingId}`,
          amount: brokerCommission,
          currency: 'usd',
          type: 'commission',
          status: 'pending',
          from: 'platform',
          to: 'broker',
          bookingId,
          createdAt: new Date().toISOString()
        },
        {
          id: `txn_operator_${bookingId}`,
          amount: operatorPayment,
          currency: 'usd',
          type: 'final_payment',
          status: 'pending',
          from: 'client',
          to: 'operator',
          bookingId,
          createdAt: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Failed to process commission:', error);
      throw new Error('Failed to process commission split');
    }
  }

  // Get payment status
  async getPaymentStatus(paymentIntentId: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('get-payment-status', {
        body: { paymentIntentId }
      });

      if (error) throw error;

      return data.status;
    } catch (error) {
      console.error('Failed to get payment status:', error);
      return 'unknown';
    }
  }

  // Refund payment
  async refundPayment(paymentIntentId: string, amount?: number): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('refund-payment', {
        body: {
          paymentIntentId,
          amount // If not specified, refund full amount
        }
      });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Failed to refund payment:', error);
      return false;
    }
  }

  // Get transaction history
  async getTransactionHistory(userId: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .or(`from.eq.${userId},to.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(txn => ({
        id: txn.id,
        amount: txn.amount,
        currency: txn.currency,
        type: txn.type,
        status: txn.status,
        from: txn.from,
        to: txn.to,
        bookingId: txn.booking_id,
        stripePaymentIntentId: txn.stripe_payment_intent_id,
        createdAt: txn.created_at,
        completedAt: txn.completed_at
      }));
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return [];
    }
  }

  // Calculate platform fees
  calculateFees(subtotal: number): {
    subtotal: number;
    platformFee: number;
    brokerCommission: number;
    operatorPayout: number;
    total: number;
  } {
    const platformFee = Math.round(subtotal * 0.07); // 7% platform fee
    const brokerCommission = Math.round(subtotal * 0.10); // 10% broker commission
    const operatorPayout = subtotal - platformFee - brokerCommission;
    const total = subtotal;

    return {
      subtotal,
      platformFee,
      brokerCommission,
      operatorPayout,
      total
    };
  }
}

export const stripeService = new StripeService();





