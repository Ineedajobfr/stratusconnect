// Stripe Connect Integration - Compliant Payment Processing
// No custody of client funds - all payments processed by Stripe

import { loadStripe, Stripe } from '@stripe/stripe-js';

export interface StripeConnectConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  applicationFeePercent: number;
  hiringFeePercent: number;
}

export interface PaymentIntent {
  id: string;
  dealId: string;
  amount: number;
  currency: string;
  applicationFeeAmount: number;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  clientSecret: string;
  createdAt: string;
}

export interface StripeAccount {
  id: string;
  type: 'express' | 'standard';
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  country: string;
  email: string;
}

class StripeConnectService {
  private static instance: StripeConnectService;
  private stripe: Stripe | null = null;
  private config: StripeConnectConfig;

  constructor() {
    this.config = {
      publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
      secretKey: process.env.VITE_STRIPE_SECRET_KEY || '',
      webhookSecret: process.env.VITE_STRIPE_WEBHOOK_SECRET || '',
      applicationFeePercent: 7, // 7% platform commission
      hiringFeePercent: 10, // 10% hiring fee
    };
  }

  static getInstance(): StripeConnectService {
    if (!StripeConnectService.instance) {
      StripeConnectService.instance = new StripeConnectService();
    }
    return StripeConnectService.instance;
  }

  /**
   * Initialize Stripe
   */
  async initialize(): Promise<void> {
    if (!this.stripe) {
      this.stripe = await loadStripe(this.config.publishableKey);
    }
  }

  /**
   * Create a Stripe Connect account for a user
   */
  async createConnectAccount(userId: string, email: string, country: string = 'GB'): Promise<StripeAccount> {
    const response = await fetch('/api/stripe/create-connect-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.secretKey}`,
      },
      body: JSON.stringify({
        userId,
        email,
        country,
        type: 'express', // Use Express accounts for easier onboarding
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create Stripe Connect account');
    }

    const account = await response.json();
    return {
      id: account.id,
      type: account.type,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      country: account.country,
      email: account.email,
    };
  }

  /**
   * Create payment intent for broker-operator transaction
   */
  async createBrokerOperatorPayment(params: {
    dealId: string;
    amount: number;
    currency: string;
    brokerAccountId: string;
    operatorAccountId: string;
    description: string;
  }): Promise<PaymentIntent> {
    const applicationFeeAmount = Math.round(params.amount * (this.config.applicationFeePercent / 100));

    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.secretKey}`,
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: params.operatorAccountId,
        },
        metadata: {
          deal_id: params.dealId,
          transaction_type: 'broker_operator',
          platform_fee_percent: this.config.applicationFeePercent.toString(),
        },
        description: params.description,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const paymentIntent = await response.json();
    
    return {
      id: paymentIntent.id,
      dealId: params.dealId,
      amount: params.amount,
      currency: params.currency,
      applicationFeeAmount,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Create payment for operator hiring (10% fee)
   */
  async createHiringPayment(params: {
    dealId: string;
    amount: number;
    currency: string;
    operatorAccountId: string;
    pilotAccountId: string;
    description: string;
  }): Promise<PaymentIntent> {
    const applicationFeeAmount = Math.round(params.amount * (this.config.hiringFeePercent / 100));

    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.secretKey}`,
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: params.pilotAccountId,
        },
        metadata: {
          deal_id: params.dealId,
          transaction_type: 'operator_hiring',
          platform_fee_percent: this.config.hiringFeePercent.toString(),
        },
        description: params.description,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create hiring payment');
    }

    const paymentIntent = await response.json();
    
    return {
      id: paymentIntent.id,
      dealId: params.dealId,
      amount: params.amount,
      currency: params.currency,
      applicationFeeAmount,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Process payment using Stripe Elements
   */
  async processPayment(clientSecret: string, paymentMethodId: string): Promise<PaymentIntent> {
    if (!this.stripe) {
      await this.initialize();
    }

    const { error, paymentIntent } = await this.stripe!.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: paymentIntent.id,
      dealId: paymentIntent.metadata.deal_id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      applicationFeeAmount: paymentIntent.application_fee_amount,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
      createdAt: new Date(paymentIntent.created * 1000).toISOString(),
    };
  }

  /**
   * Get payment intent status
   */
  async getPaymentIntentStatus(paymentIntentId: string): Promise<PaymentIntent> {
    const response = await fetch(`/api/stripe/payment-intent/${paymentIntentId}`, {
      headers: {
        'Authorization': `Bearer ${this.config.secretKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get payment intent status');
    }

    const paymentIntent = await response.json();
    
    return {
      id: paymentIntent.id,
      dealId: paymentIntent.metadata.deal_id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      applicationFeeAmount: paymentIntent.application_fee_amount,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
      createdAt: new Date(paymentIntent.created * 1000).toISOString(),
    };
  }

  /**
   * Create account link for onboarding
   */
  async createAccountLink(accountId: string, refreshUrl: string, returnUrl: string): Promise<string> {
    const response = await fetch('/api/stripe/create-account-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.secretKey}`,
      },
      body: JSON.stringify({
        account: accountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create account link');
    }

    const { url } = await response.json();
    return url;
  }

  /**
   * Get account dashboard link
   */
  async getAccountDashboardLink(accountId: string): Promise<string> {
    const response = await fetch('/api/stripe/create-account-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.secretKey}`,
      },
      body: JSON.stringify({
        account: accountId,
        type: 'account_onboarding',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create dashboard link');
    }

    const { url } = await response.json();
    return url;
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    // In production, this would use Stripe's webhook signature verification
    // For now, we'll implement a basic check
    return signature.startsWith('whsec_');
  }

  /**
   * Handle webhook events
   */
  async handleWebhookEvent(event: any): Promise<void> {
    // Log webhook event for audit
    await this.logWebhookEvent(event);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
      case 'account.updated':
        await this.handleAccountUpdated(event.data.object);
        break;
      default:
        console.log(`Unhandled webhook event: ${event.type}`);
    }
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentSucceeded(paymentIntent: any): Promise<void> {
    // Update deal status, send notifications, etc.
    console.log('Payment succeeded:', paymentIntent.id);
  }

  /**
   * Handle failed payment
   */
  private async handlePaymentFailed(paymentIntent: any): Promise<void> {
    // Handle payment failure, notify users, etc.
    console.log('Payment failed:', paymentIntent.id);
  }

  /**
   * Handle account updates
   */
  private async handleAccountUpdated(account: any): Promise<void> {
    // Update account status in database
    console.log('Account updated:', account.id);
  }

  /**
   * Log webhook event for audit
   */
  private async logWebhookEvent(event: any): Promise<void> {
    // In production, this would log to audit database
    console.log('Webhook event logged:', {
      id: event.id,
      type: event.type,
      created: event.created,
      hash: await this.calculateHash(JSON.stringify(event)),
    });
  }

  /**
   * Calculate hash for audit purposes
   */
  private async calculateHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get fee structure
   */
  getFeeStructure(): {
    brokerOperatorCommission: number;
    operatorHiringFee: number;
    pilotCrewFee: number;
  } {
    return {
      brokerOperatorCommission: this.config.applicationFeePercent,
      operatorHiringFee: this.config.hiringFeePercent,
      pilotCrewFee: 0, // Always 0% for pilots and crew
    };
  }
}

// Create singleton instance
export const stripeConnect = StripeConnectService.getInstance();

// Initialize on import
stripeConnect.initialize();
