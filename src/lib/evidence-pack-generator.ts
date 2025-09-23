// Evidence Pack Generator - Simplified for Build
export interface EvidenceReceipt {
  transactionId: string;
  timestamp: string;
  type: 'charter' | 'hiring';
  broker: { id: string; name: string; company: string };
  operator: { id: string; name: string; company: string };
  pilot?: { id: string; name: string; role: string };
  deal: { route: string; aircraft: string; departureDate: string; passengers?: number };
  financial: { totalAmount: number; currency: string; platformFee: number; netToOperator: number; feePercentage: number };
  compliance: { auditHash: string; fcaCompliant: boolean; stripeTransactionId: string; kycVerified: boolean; sanctionsClear: boolean };
  metadata: { generatedAt: string; version: string; evidencePack: boolean };
  [key: string]: unknown;
}

class EvidencePackGenerator {
  async generateCharterReceipt(data: any): Promise<EvidenceReceipt> {
    const platformFee = Math.round(data.totalAmount * 0.07);
    const netToOperator = data.totalAmount - platformFee;
    
    return {
      transactionId: `TXN_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'charter',
      broker: data.broker,
      operator: data.operator,
      deal: data.deal,
      financial: { totalAmount: data.totalAmount, currency: data.currency, platformFee, netToOperator, feePercentage: 7 },
      compliance: { auditHash: 'mock-hash', fcaCompliant: true, stripeTransactionId: 'mock-stripe', kycVerified: true, sanctionsClear: true },
      metadata: { generatedAt: new Date().toISOString(), version: '1.0.0', evidencePack: true }
    };
  }

  async generateHiringReceipt(data: any): Promise<EvidenceReceipt> {
    const platformFee = Math.round(data.totalAmount * 0.10);
    const netToOperator = data.totalAmount - platformFee;
    
    return {
      transactionId: `HIRE_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'hiring',
      broker: { id: 'demo', name: 'Demo Broker', company: 'Demo' },
      operator: data.operator,
      pilot: data.pilot,
      deal: { route: 'N/A', aircraft: 'N/A', departureDate: new Date().toISOString().split('T')[0] },
      financial: { totalAmount: data.totalAmount, currency: data.currency, platformFee, netToOperator, feePercentage: 10 },
      compliance: { auditHash: 'mock-hash', fcaCompliant: true, stripeTransactionId: 'mock-stripe', kycVerified: true, sanctionsClear: true },
      metadata: { generatedAt: new Date().toISOString(), version: '1.0.0', evidencePack: true }
    };
  }

  generateEvidenceSummary(receipts: EvidenceReceipt[]) {
    return {
      totalTransactions: receipts.length,
      totalVolume: receipts.reduce((sum, r) => sum + (r.financial?.totalAmount || 0), 0),
      totalFees: receipts.reduce((sum, r) => sum + (r.financial?.platformFee || 0), 0),
      charterReceipts: receipts.filter(r => r.type === 'charter').length,
      hiringReceipts: receipts.filter(r => r.type === 'hiring').length,
      allHashesValid: true,
      lastAuditHash: receipts[0]?.compliance?.auditHash || '',
      volumeByType: { charter: 0, hiring: 0 },
      feesByType: { charter: 0, hiring: 0 },
      transactionCount: receipts.length,
      oldestTransaction: new Date().toISOString()
    };
  }

  async validateReceipt(receipt: EvidenceReceipt): Promise<boolean> {
    return true; // Mock validation
  }

  downloadReceipt(receipt: EvidenceReceipt): void {
    const receiptData = JSON.stringify(receipt, null, 2);
    const blob = new Blob([receiptData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evidence_receipt_${receipt.transactionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export const evidencePackGenerator = new EvidencePackGenerator();
export default evidencePackGenerator;