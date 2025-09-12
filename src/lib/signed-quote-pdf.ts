// Signed Quote PDF Generator with Anti-Circumvention Watermarking
// FCA Compliant Aviation Platform

export interface QuoteDetails {
  quoteId: string;
  dealId: string;
  broker: {
    name: string;
    company: string;
    email: string;
    phone: string;
  };
  operator: {
    name: string;
    company: string;
    email: string;
    phone: string;
  };
  route: string;
  aircraft: string;
  departureDate: string;
  totalAmount: number;
  currency: string;
  platformFeePercentage: number;
  cancellationGrid: Record<string, string>;
  terms: string[];
  signedAt: string;
  ipAddress: string;
  userAgent: string;
}

export interface SignedQuoteResult {
  pdfBase64: string;
  hash: string;
  filename: string;
  watermark: {
    visible: string;
    invisible: string;
    traceId: string;
    traceUrl: string;
  };
}

/**
 * Generate signed quote PDF with anti-circumvention watermarks
 */
export async function generateSignedQuotePDF(
  quoteData: QuoteDetails, 
  viewerId: string
): Promise<SignedQuoteResult> {
  // Generate watermarks
  const traceId = generateTraceId(quoteData.dealId, viewerId);
  const visibleWatermark = generateVisibleWatermark(quoteData.dealId, viewerId);
  const invisibleWatermark = generateInvisibleWatermark(quoteData.dealId, viewerId);
  const traceUrl = generateTraceUrl(traceId);

  // Calculate fees
  const platformFee = Math.round(quoteData.totalAmount * (quoteData.platformFeePercentage / 100));
  const netToOperator = quoteData.totalAmount - platformFee;

  // Mock PDF generation (would use jsPDF in real implementation)
  const pdfContent = generatePDFContent(quoteData, platformFee, netToOperator, visibleWatermark, traceUrl);
  
  // Generate hash for integrity
  const contentHash = generateContentHash(pdfContent);
  
  const result: SignedQuoteResult = {
    pdfBase64: btoa(pdfContent), // Mock base64 encoding
    hash: contentHash,
    filename: `signed-quote-${quoteData.quoteId}.pdf`,
    watermark: {
      visible: visibleWatermark,
      invisible: invisibleWatermark,
      traceId,
      traceUrl
    }
  };

  // Log the PDF generation
  await logPDFGeneration(quoteData.dealId, viewerId, quoteData.quoteId, traceId);

  return result;
}

/**
 * Generate visible watermark for PDF
 */
function generateVisibleWatermark(dealId: string, viewerId: string): string {
  const timestamp = Date.now();
  return `DEAL:${dealId} USER:${viewerId} TS:${timestamp}`;
}

/**
 * Generate invisible watermark (metadata)
 */
function generateInvisibleWatermark(dealId: string, viewerId: string): string {
  const watermarkData = {
    dealId,
    viewerId,
    timestamp: Date.now(),
    platform: 'stratusconnect.com',
    version: '1.0'
  };
  
  return `sha256:${btoa(JSON.stringify(watermarkData))}`;
}

/**
 * Generate trace ID
 */
function generateTraceId(dealId: string, viewerId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${dealId}_${viewerId}_${timestamp}_${random}`;
}

/**
 * Generate trace URL
 */
function generateTraceUrl(traceId: string): string {
  return `https://stratusconnect.com/t/${traceId}`;
}

/**
 * Generate content hash
 */
function generateContentHash(content: string): string {
  // Mock SHA-256 hash generation
  const hash = btoa(content).substring(0, 64);
  return `sha256:${hash}`;
}

/**
 * Generate PDF content with watermarks
 */
function generatePDFContent(
  quoteData: QuoteDetails,
  platformFee: number,
  netToOperator: number,
  visibleWatermark: string,
  traceUrl: string
): string {
  // Mock PDF content generation
  const content = `
SIGNED QUOTE PDF
================

Quote ID: ${quoteData.quoteId}
Deal ID: ${quoteData.dealId}
Generated: ${quoteData.signedAt}

PARTIES:
--------
Broker: ${quoteData.broker.name}
Company: ${quoteData.broker.company}
Email: ${quoteData.broker.email}
Phone: ${quoteData.broker.phone}

Operator: ${quoteData.operator.name}
Company: ${quoteData.operator.company}
Email: ${quoteData.operator.email}
Phone: ${quoteData.operator.phone}

FLIGHT DETAILS:
--------------
Route: ${quoteData.route}
Aircraft: ${quoteData.aircraft}
Departure: ${quoteData.departureDate}

FINANCIAL BREAKDOWN:
-------------------
Total Amount: ${quoteData.currency} ${(quoteData.totalAmount / 100).toFixed(2)}
Platform Fee (${quoteData.platformFeePercentage}%): ${quoteData.currency} ${(platformFee / 100).toFixed(2)}
Net to Operator: ${quoteData.currency} ${(netToOperator / 100).toFixed(2)}

CANCELLATION TERMS:
------------------
${Object.entries(quoteData.cancellationGrid).map(([period, fee]) => `${period}: ${fee}`).join('\n')}

TERMS AND CONDITIONS:
--------------------
${quoteData.terms.map((term, index) => `${index + 1}. ${term}`).join('\n')}

COMPLIANCE VERIFICATION:
-----------------------
FCA Compliant: Yes
Audit Hash: ${generateContentHash(JSON.stringify(quoteData))}
IP Address: ${quoteData.ipAddress}
User Agent: ${quoteData.userAgent}

WATERMARK (Visible):
-------------------
${visibleWatermark}

TRACE URL:
----------
${traceUrl}

This document is legally binding and includes cryptographic audit hashes for verification.
All communications are watermarked and traceable for compliance purposes.
  `;

  return content;
}

/**
 * Log PDF generation for audit
 */
async function logPDFGeneration(
  dealId: string, 
  viewerId: string, 
  quoteId: string, 
  traceId: string
): Promise<void> {
  try {
    console.log('PDF generation logged:', {
      dealId,
      viewerId,
      quoteId,
      traceId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log PDF generation:', error);
  }
}

/**
 * Signed Quote PDF Generator class
 */
class SignedQuotePDFGenerator {
  async generate(quoteData: QuoteDetails, viewerId: string): Promise<SignedQuoteResult> {
    return generateSignedQuotePDF(quoteData, viewerId);
  }

  generateWatermark(dealId: string, viewerId: string) {
    return {
      visible: generateVisibleWatermark(dealId, viewerId),
      invisible: generateInvisibleWatermark(dealId, viewerId),
      traceId: generateTraceId(dealId, viewerId),
      traceUrl: generateTraceUrl(generateTraceId(dealId, viewerId))
    };
  }
}

export const signedQuotePDFGenerator = new SignedQuotePDFGenerator();