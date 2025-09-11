// FREE Payment System - No fees, no external processors
// Uses crypto wallets and P2P transfers for zero-cost transactions

export interface FreePaymentIntent {
  id: string;
  dealId: string;
  amount: number;
  currency: string;
  buyerWallet: string;
  sellerWallet: string;
  description: string;
  status: 'pending' | 'funded' | 'released' | 'refunded' | 'disputed';
  createdAt: string;
  expiresAt?: string;
  escrowType: 'crypto' | 'p2p' | 'manual';
}

export interface FreePaymentRelease {
  intentId: string;
  amount: number;
  reason: string;
  releasedBy: string;
  releasedAt: string;
  transactionHash?: string;
}

export interface FreePaymentReceipt {
  transactionId: string;
  intentId: string;
  amount: number;
  currency: string;
  status: string;
  receiptUrl: string;
  auditHash: string;
  createdAt: string;
}

// Free payment system using crypto wallets
export class FreePaymentSystem {
  private static instance: FreePaymentSystem;
  private intents: Map<string, FreePaymentIntent> = new Map();

  static getInstance(): FreePaymentSystem {
    if (!FreePaymentSystem.instance) {
      FreePaymentSystem.instance = new FreePaymentSystem();
    }
    return FreePaymentSystem.instance;
  }

  /**
   * Create a free payment intent using crypto wallets
   */
  async createPaymentIntent(params: {
    dealId: string;
    amount: number;
    currency: string;
    buyerWallet: string;
    sellerWallet: string;
    description: string;
    expiresInDays?: number;
  }): Promise<FreePaymentIntent> {
    const intent: FreePaymentIntent = {
      id: crypto.randomUUID(),
      dealId: params.dealId,
      amount: params.amount,
      currency: params.currency,
      buyerWallet: params.buyerWallet,
      sellerWallet: params.sellerWallet,
      description: params.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: params.expiresInDays 
        ? new Date(Date.now() + params.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
      escrowType: 'crypto',
    };

    this.intents.set(intent.id, intent);
    await this.persistIntent(intent);
    
    return intent;
  }

  /**
   * Fund payment using crypto wallet
   */
  async fundPayment(intentId: string, transactionHash: string): Promise<FreePaymentIntent> {
    const intent = this.intents.get(intentId);
    if (!intent) {
      throw new Error('Payment intent not found');
    }

    // In a real implementation, this would verify the crypto transaction
    // For now, we'll simulate verification
    const isValid = await this.verifyCryptoTransaction(transactionHash, intent.amount, intent.currency);
    
    if (!isValid) {
      throw new Error('Invalid crypto transaction');
    }

    intent.status = 'funded';
    this.intents.set(intentId, intent);
    await this.persistIntent(intent);
    
    return intent;
  }

  /**
   * Release payment to seller
   */
  async releasePayment(intentId: string, release: FreePaymentRelease): Promise<FreePaymentIntent> {
    const intent = this.intents.get(intentId);
    if (!intent) {
      throw new Error('Payment intent not found');
    }

    if (intent.status !== 'funded') {
      throw new Error('Payment must be funded before release');
    }

    // In a real implementation, this would execute the crypto transfer
    const releaseHash = await this.executeCryptoTransfer(
      intent.buyerWallet,
      intent.sellerWallet,
      release.amount,
      intent.currency
    );

    intent.status = 'released';
    this.intents.set(intentId, intent);
    await this.persistIntent(intent);
    
    return intent;
  }

  /**
   * Refund payment to buyer
   */
  async refundPayment(intentId: string, reason: string): Promise<FreePaymentIntent> {
    const intent = this.intents.get(intentId);
    if (!intent) {
      throw new Error('Payment intent not found');
    }

    // In a real implementation, this would execute the refund
    const refundHash = await this.executeCryptoTransfer(
      intent.sellerWallet,
      intent.buyerWallet,
      intent.amount,
      intent.currency
    );

    intent.status = 'refunded';
    this.intents.set(intentId, intent);
    await this.persistIntent(intent);
    
    return intent;
  }

  /**
   * Generate free receipt (no external service needed)
   */
  async generateReceipt(intentId: string): Promise<FreePaymentReceipt> {
    const intent = this.intents.get(intentId);
    if (!intent) {
      throw new Error('Payment intent not found');
    }

    const receiptId = crypto.randomUUID();
    const receiptData = {
      transactionId: receiptId,
      intentId: intent.id,
      amount: intent.amount,
      currency: intent.currency,
      status: intent.status,
      receiptUrl: `/receipts/${receiptId}.pdf`,
      auditHash: await this.calculateHash(intent),
      createdAt: new Date().toISOString(),
    };

    // Generate PDF receipt locally (no external service)
    await this.generatePDFReceipt(receiptData);
    
    return receiptData;
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(intentId: string): Promise<FreePaymentIntent | null> {
    return this.intents.get(intentId) || null;
  }

  /**
   * Verify crypto transaction (simplified for demo)
   */
  private async verifyCryptoTransaction(
    transactionHash: string, 
    amount: number, 
    currency: string
  ): Promise<boolean> {
    // In a real implementation, this would verify against blockchain
    // For now, we'll accept any valid-looking hash
    return transactionHash.length >= 32 && /^[a-fA-F0-9]+$/.test(transactionHash);
  }

  /**
   * Execute crypto transfer (simplified for demo)
   */
  private async executeCryptoTransfer(
    fromWallet: string,
    toWallet: string,
    amount: number,
    currency: string
  ): Promise<string> {
    // In a real implementation, this would execute actual crypto transfer
    // For now, we'll generate a mock transaction hash
    return crypto.randomUUID().replace(/-/g, '');
  }

  /**
   * Calculate hash for audit purposes
   */
  private async calculateHash(intent: FreePaymentIntent): Promise<string> {
    const data = JSON.stringify({
      id: intent.id,
      dealId: intent.dealId,
      amount: intent.amount,
      currency: intent.currency,
      buyerWallet: intent.buyerWallet,
      sellerWallet: intent.sellerWallet,
      status: intent.status,
      createdAt: intent.createdAt,
    });
    
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate PDF receipt locally
   */
  private async generatePDFReceipt(receipt: FreePaymentReceipt): Promise<void> {
    // In a real implementation, this would generate a PDF using a library like jsPDF
    // For now, we'll create a simple HTML receipt
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt - ${receipt.transactionId}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .details { margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .footer { margin-top: 30px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Stratus Connect</h1>
          <h2>Payment Receipt</h2>
        </div>
        <div class="details">
          <div class="detail-row">
            <span>Transaction ID:</span>
            <span>${receipt.transactionId}</span>
          </div>
          <div class="detail-row">
            <span>Amount:</span>
            <span>${receipt.currency} ${receipt.amount}</span>
          </div>
          <div class="detail-row">
            <span>Status:</span>
            <span>${receipt.status}</span>
          </div>
          <div class="detail-row">
            <span>Date:</span>
            <span>${new Date(receipt.createdAt).toLocaleString()}</span>
          </div>
          <div class="detail-row">
            <span>Audit Hash:</span>
            <span>${receipt.auditHash}</span>
          </div>
        </div>
        <div class="footer">
          <p>This receipt is generated by Stratus Connect</p>
          <p>No external payment processor fees applied</p>
        </div>
      </body>
      </html>
    `;

    // Store receipt in localStorage (in production, this would be stored in database)
    localStorage.setItem(`receipt_${receipt.transactionId}`, receiptHTML);
  }

  /**
   * Persist intent to localStorage (free storage)
   */
  private async persistIntent(intent: FreePaymentIntent): Promise<void> {
    try {
      const existingIntents = JSON.parse(localStorage.getItem('free_payment_intents') || '[]');
      const updatedIntents = existingIntents.filter((i: FreePaymentIntent) => i.id !== intent.id);
      updatedIntents.push(intent);
      localStorage.setItem('free_payment_intents', JSON.stringify(updatedIntents.slice(-1000))); // Keep last 1000
    } catch (error) {
      console.error('Failed to persist payment intent:', error);
    }
  }

  /**
   * Load intents from localStorage
   */
  async loadIntents(): Promise<FreePaymentIntent[]> {
    try {
      const intents = JSON.parse(localStorage.getItem('free_payment_intents') || '[]');
      intents.forEach((intent: FreePaymentIntent) => {
        this.intents.set(intent.id, intent);
      });
      return intents;
    } catch (error) {
      console.error('Failed to load payment intents:', error);
      return [];
    }
  }
}

// Free P2P payment system for direct transfers
export class FreeP2PPaymentSystem {
  private static instance: FreeP2PPaymentSystem;

  static getInstance(): FreeP2PPaymentSystem {
    if (!FreeP2PPaymentSystem.instance) {
      FreeP2PPaymentSystem.instance = new FreeP2PPaymentSystem();
    }
    return FreeP2PPaymentSystem.instance;
  }

  /**
   * Create P2P payment intent (no fees)
   */
  async createP2PPayment(params: {
    dealId: string;
    amount: number;
    currency: string;
    buyerEmail: string;
    sellerEmail: string;
    description: string;
  }): Promise<FreePaymentIntent> {
    const intent: FreePaymentIntent = {
      id: crypto.randomUUID(),
      dealId: params.dealId,
      amount: params.amount,
      currency: params.currency,
      buyerWallet: params.buyerEmail, // Using email as wallet for P2P
      sellerWallet: params.sellerEmail,
      description: params.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
      escrowType: 'p2p',
    };

    // Store in localStorage (free)
    const existingIntents = JSON.parse(localStorage.getItem('p2p_payment_intents') || '[]');
    existingIntents.push(intent);
    localStorage.setItem('p2p_payment_intents', JSON.stringify(existingIntents.slice(-1000)));

    return intent;
  }

  /**
   * Process P2P payment (direct transfer)
   */
  async processP2PPayment(intentId: string): Promise<FreePaymentIntent> {
    const intents = JSON.parse(localStorage.getItem('p2p_payment_intents') || '[]');
    const intent = intents.find((i: FreePaymentIntent) => i.id === intentId);
    
    if (!intent) {
      throw new Error('P2P payment intent not found');
    }

    // In a real implementation, this would integrate with free P2P services
    // like Venmo, Zelle, or direct bank transfers
    intent.status = 'funded';
    
    const updatedIntents = intents.map((i: FreePaymentIntent) => 
      i.id === intentId ? intent : i
    );
    localStorage.setItem('p2p_payment_intents', JSON.stringify(updatedIntents));

    return intent;
  }
}

// Free manual escrow system (no external services)
export class FreeManualEscrowSystem {
  private static instance: FreeManualEscrowSystem;

  static getInstance(): FreeManualEscrowSystem {
    if (!FreeManualEscrowSystem.instance) {
      FreeManualEscrowSystem.instance = new FreeManualEscrowSystem();
    }
    return FreeManualEscrowSystem.instance;
  }

  /**
   * Create manual escrow (no fees, no external services)
   */
  async createManualEscrow(params: {
    dealId: string;
    amount: number;
    currency: string;
    buyerEmail: string;
    sellerEmail: string;
    description: string;
  }): Promise<FreePaymentIntent> {
    const intent: FreePaymentIntent = {
      id: crypto.randomUUID(),
      dealId: params.dealId,
      amount: params.amount,
      currency: params.currency,
      buyerWallet: params.buyerEmail,
      sellerWallet: params.sellerEmail,
      description: params.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
      escrowType: 'manual',
    };

    // Store in localStorage (free)
    const existingIntents = JSON.parse(localStorage.getItem('manual_escrow_intents') || '[]');
    existingIntents.push(intent);
    localStorage.setItem('manual_escrow_intents', JSON.stringify(existingIntents.slice(-1000)));

    return intent;
  }

  /**
   * Mark manual escrow as funded
   */
  async markAsFunded(intentId: string, proofOfPayment: string): Promise<FreePaymentIntent> {
    const intents = JSON.parse(localStorage.getItem('manual_escrow_intents') || '[]');
    const intent = intents.find((i: FreePaymentIntent) => i.id === intentId);
    
    if (!intent) {
      throw new Error('Manual escrow intent not found');
    }

    intent.status = 'funded';
    
    const updatedIntents = intents.map((i: FreePaymentIntent) => 
      i.id === intentId ? intent : i
    );
    localStorage.setItem('manual_escrow_intents', JSON.stringify(updatedIntents));

    return intent;
  }

  /**
   * Release manual escrow
   */
  async releaseManualEscrow(intentId: string, reason: string): Promise<FreePaymentIntent> {
    const intents = JSON.parse(localStorage.getItem('manual_escrow_intents') || '[]');
    const intent = intents.find((i: FreePaymentIntent) => i.id === intentId);
    
    if (!intent) {
      throw new Error('Manual escrow intent not found');
    }

    intent.status = 'released';
    
    const updatedIntents = intents.map((i: FreePaymentIntent) => 
      i.id === intentId ? intent : i
    );
    localStorage.setItem('manual_escrow_intents', JSON.stringify(updatedIntents));

    return intent;
  }
}

// Factory function to get free payment system
export function getFreePaymentSystem(type: 'crypto' | 'p2p' | 'manual' = 'crypto') {
  switch (type) {
    case 'crypto':
      return FreePaymentSystem.getInstance();
    case 'p2p':
      return FreeP2PPaymentSystem.getInstance();
    case 'manual':
      return FreeManualEscrowSystem.getInstance();
    default:
      return FreePaymentSystem.getInstance();
  }
}
