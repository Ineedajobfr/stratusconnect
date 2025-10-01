// Payment Processing Service - Stripe integration with commission splits
// Secure payment processing for charter bookings

import { supabase } from '@/integrations/supabase/client';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  clientSecret: string;
  paymentMethod?: string;
  metadata: Record<string, string>;
}

export interface Payment {
  id: string;
  bookingId: string;
  payerId: string;
  payeeId: string;
  amount: number;
  currency: string;
  type: 'deposit' | 'final_payment' | 'commission' | 'refund';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  stripePaymentIntentId: string;
  transactionId: string;
  processedAt?: string;
  createdAt: string;
}

export interface CommissionSplit {
  bookingId: string;
  totalAmount: number;
  platformFee: number;
  platformFeePercent: number;
  operatorAmount: number;
  brokerCommission: number;
  brokerCommissionPercent: number;
  netToOperator: number;
}

export interface Invoice {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  stripeInvoiceId?: string;
}

export interface StripeCustomer {
  id: string;
  userId: string;
  stripeCustomerId: string;
  email: string;
  defaultPaymentMethod?: string;
}

class PaymentProcessingService {
  private platformFeePercent = 5; // 5% platform fee
  private brokerCommissionPercent = 10; // 10% broker commission

  // Create payment intent (for deposit or final payment)
  async createPaymentIntent(
    bookingId: string,
    payerId: string,
    amount: number,
    currency: string = 'USD',
    type: 'deposit' | 'final_payment' = 'deposit'
  ): Promise<PaymentIntent | null> {
    try {
      // Get or create Stripe customer
      const customer = await this.getOrCreateCustomer(payerId);
      if (!customer) throw new Error('Failed to create customer');

      // In production, this would call Stripe API
      // const stripeIntent = await stripe.paymentIntents.create({...})
      
      // Mock Stripe response
      const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substr(2, 16)}`;

      // Save to database
      const { data, error } = await supabase
        .from('payments')
        .insert({
          booking_id: bookingId,
          payer_id: payerId,
          amount,
          currency,
          type,
          status: 'pending',
          stripe_payment_intent_id: paymentIntentId,
          transaction_id: paymentIntentId,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        amount,
        currency,
        status: 'pending',
        clientSecret,
        metadata: {
          bookingId,
          payerId,
          type,
        },
      };
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      return null;
    }
  }

  // Process payment (confirm payment intent)
  async processPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<boolean> {
    try {
      // In production, this would confirm with Stripe
      // const result = await stripe.paymentIntents.confirm(paymentIntentId, {
      //   payment_method: paymentMethodId,
      // });

      // Update payment status
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          payment_method: paymentMethodId,
          processed_at: new Date().toISOString(),
        })
        .eq('stripe_payment_intent_id', paymentIntentId);

      if (error) throw error;

      // Get payment details for commission split
      const { data: payment } = await supabase
        .from('payments')
        .select('booking_id, amount, type')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .single();

      if (payment && payment.type === 'final_payment') {
        // Process commission split
        await this.processCommissionSplit(payment.booking_id, payment.amount);
      }

      return true;
    } catch (error) {
      console.error('Failed to process payment:', error);
      return false;
    }
  }

  // Calculate commission split
  calculateCommissionSplit(totalAmount: number): CommissionSplit {
    const platformFee = totalAmount * (this.platformFeePercent / 100);
    const brokerCommission = totalAmount * (this.brokerCommissionPercent / 100);
    const netToOperator = totalAmount - platformFee - brokerCommission;

    return {
      bookingId: '',
      totalAmount,
      platformFee,
      platformFeePercent: this.platformFeePercent,
      operatorAmount: totalAmount,
      brokerCommission,
      brokerCommissionPercent: this.brokerCommissionPercent,
      netToOperator,
    };
  }

  // Process commission split (after final payment)
  async processCommissionSplit(
    bookingId: string,
    totalAmount: number
  ): Promise<boolean> {
    try {
      const split = this.calculateCommissionSplit(totalAmount);

      // Get booking details
      const { data: booking } = await supabase
        .from('bookings')
        .select(`
          operator_id,
          quotes (broker_id)
        `)
        .eq('id', bookingId)
        .single();

      if (!booking) throw new Error('Booking not found');

      const operatorId = booking.operator_id;
      const brokerId = booking.quotes?.broker_id;

      // Transfer to operator (minus platform fee)
      await this.createTransfer(
        operatorId,
        split.netToOperator,
        'Booking payment (net of fees)',
        bookingId
      );

      // Transfer broker commission
      if (brokerId) {
        await this.createTransfer(
          brokerId,
          split.brokerCommission,
          'Broker commission',
          bookingId
        );
      }

      // Record commission split
      await supabase
        .from('commission_splits')
        .insert({
          booking_id: bookingId,
          total_amount: split.totalAmount,
          platform_fee: split.platformFee,
          broker_commission: split.brokerCommission,
          operator_amount: split.netToOperator,
          processed_at: new Date().toISOString(),
        });

      return true;
    } catch (error) {
      console.error('Failed to process commission split:', error);
      return false;
    }
  }

  // Create transfer to user's account
  private async createTransfer(
    userId: string,
    amount: number,
    description: string,
    bookingId: string
  ): Promise<boolean> {
    try {
      // In production, would use Stripe Connect for transfers
      // const transfer = await stripe.transfers.create({
      //   amount: Math.round(amount * 100), // Convert to cents
      //   currency: 'usd',
      //   destination: stripeAccountId,
      //   description,
      // });

      const transferId = `tr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Record transfer
      await supabase
        .from('payments')
        .insert({
          booking_id: bookingId,
          payee_id: userId,
          amount,
          currency: 'USD',
          type: 'commission',
          status: 'completed',
          payment_method: 'stripe_transfer',
          transaction_id: transferId,
          processed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });

      return true;
    } catch (error) {
      console.error('Failed to create transfer:', error);
      return false;
    }
  }

  // Get or create Stripe customer
  private async getOrCreateCustomer(userId: string): Promise<StripeCustomer | null> {
    try {
      // Check if customer exists
      const { data: existing } = await supabase
        .from('stripe_customers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existing) {
        return {
          id: existing.id,
          userId: existing.user_id,
          stripeCustomerId: existing.stripe_customer_id,
          email: existing.email,
          defaultPaymentMethod: existing.default_payment_method,
        };
      }

      // Get user email
      const { data: user } = await supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single();

      if (!user) throw new Error('User not found');

      // Create Stripe customer
      // const stripeCustomer = await stripe.customers.create({
      //   email: user.email,
      //   metadata: { userId },
      // });

      const stripeCustomerId = `cus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Save to database
      const { data: newCustomer, error } = await supabase
        .from('stripe_customers')
        .insert({
          user_id: userId,
          stripe_customer_id: stripeCustomerId,
          email: user.email,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: newCustomer.id,
        userId: newCustomer.user_id,
        stripeCustomerId: newCustomer.stripe_customer_id,
        email: newCustomer.email,
      };
    } catch (error) {
      console.error('Failed to get or create customer:', error);
      return null;
    }
  }

  // Create invoice
  async createInvoice(
    bookingId: string,
    amount: number,
    dueDate: string
  ): Promise<Invoice | null> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          booking_id: bookingId,
          amount,
          currency: 'USD',
          due_date: dueDate,
          status: 'sent',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        bookingId: data.booking_id,
        amount: data.amount,
        currency: data.currency,
        dueDate: data.due_date,
        status: data.status as any,
      };
    } catch (error) {
      console.error('Failed to create invoice:', error);
      return null;
    }
  }

  // Set up recurring billing
  async setupRecurringBilling(
    customerId: string,
    priceId: string,
    interval: 'monthly' | 'yearly'
  ): Promise<string | null> {
    try {
      // In production, would create Stripe subscription
      // const subscription = await stripe.subscriptions.create({
      //   customer: customerId,
      //   items: [{ price: priceId }],
      //   payment_behavior: 'default_incomplete',
      //   expand: ['latest_invoice.payment_intent'],
      // });

      const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Save subscription
      await supabase
        .from('subscriptions')
        .insert({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          price_id: priceId,
          interval,
          status: 'active',
          created_at: new Date().toISOString(),
        });

      return subscriptionId;
    } catch (error) {
      console.error('Failed to setup recurring billing:', error);
      return null;
    }
  }

  // Process refund
  async processRefund(
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<boolean> {
    try {
      const { data: payment } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (!payment) throw new Error('Payment not found');

      const refundAmount = amount || payment.amount;

      // In production, would process with Stripe
      // const refund = await stripe.refunds.create({
      //   payment_intent: payment.stripe_payment_intent_id,
      //   amount: Math.round(refundAmount * 100),
      //   reason: reason || 'requested_by_customer',
      // });

      const refundId = `re_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Record refund
      await supabase
        .from('payments')
        .insert({
          booking_id: payment.booking_id,
          payer_id: payment.payee_id, // Reverse
          payee_id: payment.payer_id, // Reverse
          amount: refundAmount,
          currency: payment.currency,
          type: 'refund',
          status: 'completed',
          transaction_id: refundId,
          processed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });

      // Update original payment
      await supabase
        .from('payments')
        .update({ status: 'refunded' })
        .eq('id', paymentId);

      return true;
    } catch (error) {
      console.error('Failed to process refund:', error);
      return false;
    }
  }

  // Get payment history
  async getPaymentHistory(userId: string): Promise<Payment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .or(`payer_id.eq.${userId},payee_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(payment => ({
        id: payment.id,
        bookingId: payment.booking_id,
        payerId: payment.payer_id,
        payeeId: payment.payee_id,
        amount: payment.amount,
        currency: payment.currency,
        type: payment.type as any,
        status: payment.status as any,
        paymentMethod: payment.payment_method || 'card',
        stripePaymentIntentId: payment.stripe_payment_intent_id,
        transactionId: payment.transaction_id,
        processedAt: payment.processed_at,
        createdAt: payment.created_at,
      }));
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      return [];
    }
  }
}

export const paymentProcessingService = new PaymentProcessingService();

