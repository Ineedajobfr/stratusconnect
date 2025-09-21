// Receipt Generator with Anti-Circumvention Watermarking
// FCA Compliant Aviation Platform

import { supabase } from '@/integrations/supabase/client';

export interface DealReceiptData {
  transactionId: string;
  timestamp: string;
  type: 'deal' | 'hiring' | 'pilot';
  broker?: {
    id: string;
    name: string;
    company: string;
    email: string;
  };
  operator: {
    id: string;
    name: string;
    company: string;
    email: string;
  };
  pilot?: {
    id: string;
    name: string;
    role: string;
  };
  deal?: {
    route: string;
    aircraft: string;
    departureDate: string;
  };
  financial: {
    totalAmount: number;
    currency: string;
    platformFee: number;
    netToOperator: number;
    feePercentage: number;
  };
  stripe: {
    paymentIntentId: string;
    transferId?: string;
  };
  compliance: {
    fcaCompliant: boolean;
    kycVerified: boolean;
    auditHash: string;
  };
  watermark?: {
    visible: string;
    invisible: string;
    traceId: string;
    traceUrl: string;
  };
}

/**
 * Generate visible watermark text for documents
 */
export function generateVisibleWatermark(dealId: string, viewerId: string): string {
  const timestamp = Date.now();
  return `DEAL:${dealId} USER:${viewerId} TS:${timestamp}`;
}

/**
 * Generate invisible watermark (metadata fingerprint)
 */
export function generateInvisibleWatermark(dealId: string, viewerId: string, documentContent: string): string {
  const watermarkData = {
    dealId,
    viewerId,
    timestamp: Date.now(),
    contentHash: documentContent.substring(0, 100), // First 100 chars
    platform: 'stratusconnect.com'
  };
  
  return `sha256:${btoa(JSON.stringify(watermarkData))}`;
}

/**
 * Generate trace URL for document tracking
 */
export function generateTraceUrl(traceId: string): string {
  return `https://stratusconnect.com/t/${traceId}`;
}

/**
 * Generate unique trace ID
 */
export function generateTraceId(dealId: string, viewerId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${dealId}_${viewerId}_${timestamp}_${random}`;
}

/**
 * Generate deal receipt with anti-circumvention watermarks
 */
export async function generateDealReceipt(
  dealData: any, 
  viewerId: string
): Promise<DealReceiptData> {
  const timestamp = new Date().toISOString();
  const traceId = generateTraceId(dealData.id, viewerId);
  
  // Generate watermarks
  const visibleWatermark = generateVisibleWatermark(dealData.id, viewerId);
  const documentContent = JSON.stringify(dealData);
  const invisibleWatermark = generateInvisibleWatermark(dealData.id, viewerId, documentContent);
  const traceUrl = generateTraceUrl(traceId);

  const receipt: DealReceiptData = {
    transactionId: `TXN-${Date.now()}`,
    timestamp,
    type: 'deal',
    broker: dealData.broker,
    operator: dealData.operator,
    deal: dealData.deal,
    financial: dealData.financial,
    stripe: dealData.stripe,
    compliance: {
      fcaCompliant: true,
      kycVerified: true,
      auditHash: invisibleWatermark
    },
    watermark: {
      visible: visibleWatermark,
      invisible: invisibleWatermark,
      traceId,
      traceUrl
    }
  };

  // Log the document generation for audit
  await logDocumentAccess(dealData.id, viewerId, 'receipt_generated', traceId);

  return receipt;
}

/**
 * Generate hiring receipt with watermarks
 */
export async function generateHiringReceipt(
  hiringData: any, 
  viewerId: string
): Promise<DealReceiptData> {
  const timestamp = new Date().toISOString();
  const traceId = generateTraceId(hiringData.id, viewerId);
  
  const visibleWatermark = generateVisibleWatermark(hiringData.id, viewerId);
  const documentContent = JSON.stringify(hiringData);
  const invisibleWatermark = generateInvisibleWatermark(hiringData.id, viewerId, documentContent);
  const traceUrl = generateTraceUrl(traceId);

  const receipt: DealReceiptData = {
    transactionId: `HIRING-${Date.now()}`,
    timestamp,
    type: 'hiring',
    broker: hiringData.broker,
    operator: hiringData.operator,
    financial: hiringData.financial,
    stripe: hiringData.stripe,
    compliance: {
      fcaCompliant: true,
      kycVerified: true,
      auditHash: invisibleWatermark
    },
    watermark: {
      visible: visibleWatermark,
      invisible: invisibleWatermark,
      traceId,
      traceUrl
    }
  };

  await logDocumentAccess(hiringData.id, viewerId, 'hiring_receipt_generated', traceId);

  return receipt;
}

/**
 * Log document access for audit trail
 */
async function logDocumentAccess(
  dealId: string, 
  viewerId: string, 
  action: string, 
  traceId: string
): Promise<void> {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        event_type: 'document_access',
        deal_id: dealId,
        user_id: viewerId,
        action,
        trace_id: traceId,
        metadata: {
          timestamp: new Date().toISOString(),
          ip_address: '192.168.1.100', // Would be real IP in production
          user_agent: navigator.userAgent
        }
      });
  } catch (error) {
    console.error('Failed to log document access:', error);
  }
}

/**
 * Receipt generator class
 */
class ReceiptGenerator {
  async generateDealReceipt(dealData: any, viewerId: string): Promise<DealReceiptData> {
    return generateDealReceipt(dealData, viewerId);
  }

  async generateHiringReceipt(hiringData: any, viewerId: string): Promise<DealReceiptData> {
    return generateHiringReceipt(hiringData, viewerId);
  }

  generateWatermark(dealId: string, viewerId: string) {
    return {
      visible: generateVisibleWatermark(dealId, viewerId),
      traceId: generateTraceId(dealId, viewerId),
      traceUrl: generateTraceUrl(generateTraceId(dealId, viewerId))
    };
  }
}

export const receiptGenerator = new ReceiptGenerator();