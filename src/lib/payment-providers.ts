// Payment Provider Adapters for Regulated Escrow
// Supports Shieldpay, Mangopay, and Lemonway

export interface EscrowIntent {
  id: string;
  dealId: string;
  amount: number;
  currency: string;
  buyerId: string;
  sellerId: string;
  description: string;
  status: 'pending' | 'funded' | 'released' | 'refunded' | 'disputed';
  createdAt: string;
  expiresAt?: string;
}

export interface EscrowRelease {
  intentId: string;
  amount: number;
  reason: string;
  releasedBy: string;
  releasedAt: string;
}

export interface PaymentReceipt {
  transactionId: string;
  intentId: string;
  amount: number;
  currency: string;
  status: string;
  pdfUrl: string;
  auditHash: string;
  createdAt: string;
}

export interface PaymentProvider {
  name: string;
  createEscrowIntent(params: CreateEscrowParams): Promise<EscrowIntent>;
  fundEscrowIntent(intentId: string): Promise<EscrowIntent>;
  releaseEscrow(intentId: string, release: EscrowRelease): Promise<EscrowIntent>;
  refundEscrow(intentId: string, reason: string): Promise<EscrowIntent>;
  getEscrowStatus(intentId: string): Promise<EscrowIntent>;
  generateReceipt(intentId: string): Promise<PaymentReceipt>;
  handleWebhook(payload: Record<string, unknown>, signature: string): Promise<WebhookEvent>;
}

export interface CreateEscrowParams {
  dealId: string;
  amount: number;
  currency: string;
  buyerId: string;
  sellerId: string;
  description: string;
  expiresInDays?: number;
}

export interface WebhookEvent {
  type: string;
  intentId: string;
  status: string;
  timestamp: string;
  data: Record<string, unknown>;
}

// Shieldpay Implementation
export class ShieldpayProvider implements PaymentProvider {
  name = 'Shieldpay';
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, isSandbox: boolean = false) {
    this.apiKey = apiKey;
    this.baseUrl = isSandbox 
      ? 'https://api-sandbox.shieldpay.com/v1'
      : 'https://api.shieldpay.com/v1';
  }

  async createEscrowIntent(params: CreateEscrowParams): Promise<EscrowIntent> {
    const response = await fetch(`${this.baseUrl}/escrow/intents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_reference: params.dealId,
        amount: Math.round(params.amount * 100), // Convert to pence
        currency: params.currency,
        buyer_id: params.buyerId,
        seller_id: params.sellerId,
        description: params.description,
        expires_in_days: params.expiresInDays || 30,
      }),
    });

    if (!response.ok) {
      throw new Error(`Shieldpay API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      id: data.id,
      dealId: data.external_reference,
      amount: data.amount / 100,
      currency: data.currency,
      buyerId: data.buyer_id,
      sellerId: data.seller_id,
      description: data.description,
      status: data.status,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
    };
  }

  async fundEscrowIntent(intentId: string): Promise<EscrowIntent> {
    const response = await fetch(`${this.baseUrl}/escrow/intents/${intentId}/fund`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Shieldpay funding error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.mapToEscrowIntent(data);
  }

  async releaseEscrow(intentId: string, release: EscrowRelease): Promise<EscrowIntent> {
    const response = await fetch(`${this.baseUrl}/escrow/intents/${intentId}/release`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(release.amount * 100),
        reason: release.reason,
        released_by: release.releasedBy,
      }),
    });

    if (!response.ok) {
      throw new Error(`Shieldpay release error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.mapToEscrowIntent(data);
  }

  async refundEscrow(intentId: string, reason: string): Promise<EscrowIntent> {
    const response = await fetch(`${this.baseUrl}/escrow/intents/${intentId}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      throw new Error(`Shieldpay refund error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.mapToEscrowIntent(data);
  }

  async getEscrowStatus(intentId: string): Promise<EscrowIntent> {
    const response = await fetch(`${this.baseUrl}/escrow/intents/${intentId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Shieldpay status error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.mapToEscrowIntent(data);
  }

  async generateReceipt(intentId: string): Promise<PaymentReceipt> {
    const response = await fetch(`${this.baseUrl}/escrow/intents/${intentId}/receipt`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Shieldpay receipt error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      transactionId: data.transaction_id,
      intentId: data.intent_id,
      amount: data.amount / 100,
      currency: data.currency,
      status: data.status,
      pdfUrl: data.pdf_url,
      auditHash: data.audit_hash,
      createdAt: data.created_at,
    };
  }

  async handleWebhook(payload: Record<string, unknown>, signature: string): Promise<WebhookEvent> {
    // Verify webhook signature
    const isValid = await this.verifyWebhookSignature(payload, signature);
    if (!isValid) {
      throw new Error('Invalid webhook signature');
    }

    return {
      type: payload.event_type as string,
      intentId: payload.intent_id as string,
      status: payload.status as string,
      timestamp: payload.timestamp as string,
      data: payload.data as Record<string, unknown>,
    };
  }

  private async verifyWebhookSignature(payload: Record<string, unknown>, signature: string): Promise<boolean> {
    // Implement webhook signature verification
    // This would use the webhook secret to verify the signature
    return true; // Placeholder
  }

  private mapToEscrowIntent(data: Record<string, unknown>): EscrowIntent {
    return {
      id: data.id as string,
      dealId: data.external_reference as string,
      amount: (data.amount as number) / 100,
      currency: data.currency as string,
      buyerId: data.buyer_id as string,
      sellerId: data.seller_id as string,
      description: data.description as string,
      status: data.status as 'pending' | 'funded' | 'released' | 'refunded' | 'disputed',
      createdAt: data.created_at as string,
      expiresAt: data.expires_at as string | undefined,
    };
  }
}

// Mangopay Implementation
export class MangopayProvider implements PaymentProvider {
  name = 'Mangopay';
  private clientId: string;
  private apiKey: string;
  private baseUrl: string;

  constructor(clientId: string, apiKey: string, isSandbox: boolean = false) {
    this.clientId = clientId;
    this.apiKey = apiKey;
    this.baseUrl = isSandbox 
      ? 'https://api.sandbox.mangopay.com/v2.01'
      : 'https://api.mangopay.com/v2.01';
  }

  async createEscrowIntent(params: CreateEscrowParams): Promise<EscrowIntent> {
    // Mangopay uses different API structure
    // This is a simplified implementation
    throw new Error('Mangopay implementation not yet complete');
  }

  async fundEscrowIntent(intentId: string): Promise<EscrowIntent> {
    throw new Error('Mangopay implementation not yet complete');
  }

  async releaseEscrow(intentId: string, release: EscrowRelease): Promise<EscrowIntent> {
    throw new Error('Mangopay implementation not yet complete');
  }

  async refundEscrow(intentId: string, reason: string): Promise<EscrowIntent> {
    throw new Error('Mangopay implementation not yet complete');
  }

  async getEscrowStatus(intentId: string): Promise<EscrowIntent> {
    throw new Error('Mangopay implementation not yet complete');
  }

  async generateReceipt(intentId: string): Promise<PaymentReceipt> {
    throw new Error('Mangopay implementation not yet complete');
  }

  async handleWebhook(payload: Record<string, unknown>, signature: string): Promise<WebhookEvent> {
    throw new Error('Mangopay implementation not yet complete');
  }
}

// Lemonway Implementation
export class LemonwayProvider implements PaymentProvider {
  name = 'Lemonway';
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, isSandbox: boolean = false) {
    this.apiKey = apiKey;
    this.baseUrl = isSandbox 
      ? 'https://sandbox-api.lemonway.com'
      : 'https://api.lemonway.com';
  }

  async createEscrowIntent(params: CreateEscrowParams): Promise<EscrowIntent> {
    // Lemonway uses different API structure
    // This is a simplified implementation
    throw new Error('Lemonway implementation not yet complete');
  }

  async fundEscrowIntent(intentId: string): Promise<EscrowIntent> {
    throw new Error('Lemonway implementation not yet complete');
  }

  async releaseEscrow(intentId: string, release: EscrowRelease): Promise<EscrowIntent> {
    throw new Error('Lemonway implementation not yet complete');
  }

  async refundEscrow(intentId: string, reason: string): Promise<EscrowIntent> {
    throw new Error('Lemonway implementation not yet complete');
  }

  async getEscrowStatus(intentId: string): Promise<EscrowIntent> {
    throw new Error('Lemonway implementation not yet complete');
  }

  async generateReceipt(intentId: string): Promise<PaymentReceipt> {
    throw new Error('Lemonway implementation not yet complete');
  }

  async handleWebhook(payload: Record<string, unknown>, signature: string): Promise<WebhookEvent> {
    throw new Error('Lemonway implementation not yet complete');
  }
}

// Factory function to create provider based on environment
export function createPaymentProvider(): PaymentProvider {
  const provider = import.meta.env.VITE_PAYMENT_PROVIDER || 'shieldpay';
  const isSandbox = import.meta.env.VITE_PAYMENT_SANDBOX === 'true';

  switch (provider.toLowerCase()) {
    case 'shieldpay': {
      const shieldpayKey = import.meta.env.VITE_SHIELDPAY_API_KEY;
      if (!shieldpayKey) {
        throw new Error('VITE_SHIELDPAY_API_KEY environment variable is required');
      }
      return new ShieldpayProvider(shieldpayKey, isSandbox);
    }
    
    case 'mangopay': {
      const mangopayClientId = import.meta.env.VITE_MANGOPAY_CLIENT_ID;
      const mangopayApiKey = import.meta.env.VITE_MANGOPAY_API_KEY;
      if (!mangopayClientId || !mangopayApiKey) {
        throw new Error('VITE_MANGOPAY_CLIENT_ID and VITE_MANGOPAY_API_KEY environment variables are required');
      }
      return new MangopayProvider(mangopayClientId, mangopayApiKey, isSandbox);
    }
    
    case 'lemonway': {
      const lemonwayKey = import.meta.env.VITE_LEMONWAY_API_KEY;
      if (!lemonwayKey) {
        throw new Error('VITE_LEMONWAY_API_KEY environment variable is required');
      }
      return new LemonwayProvider(lemonwayKey, isSandbox);
    }
    
    default:
      throw new Error(`Unsupported payment provider: ${provider}`);
  }
}
