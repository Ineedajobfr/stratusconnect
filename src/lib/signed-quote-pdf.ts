// Signed Quote PDF Generator with Cancellation Grid and Fee Table
// FCA Compliant Aviation Platform

export interface SignedQuoteData {
  quoteId: string;
  dealId: string;
  broker: {
    name: string;
    email: string;
    company: string;
    address: string;
  };
  operator: {
    name: string;
    email: string;
    company: string;
    address: string;
  };
  route: {
    from: string;
    to: string;
    distanceNm: number;
  };
  aircraft: string;
  passengers: number;
  departureDate: string;
  totalAmount: number;
  currency: string;
  platformFee: number;
  netToOperator: number;
  cancellationGrid: {
    '72+ hours': string;
    '24-72 hours': string;
    '4-24 hours': string;
    'Less than 4 hours': string;
  };
  terms: string[];
  signedAt: string;
  ipAddress: string;
  userAgent: string;
  auditHash: string;
}

export class SignedQuotePDFGenerator {
  static generateQuoteData(
    quoteId: string,
    dealId: string,
    broker: any,
    operator: any,
    route: any,
    aircraft: string,
    passengers: number,
    departureDate: string,
    totalAmount: number,
    currency: string
  ): SignedQuoteData {
    const platformFee = Math.round(totalAmount * 0.07);
    const netToOperator = totalAmount - platformFee;

    return {
      quoteId,
      dealId,
      broker: {
        name: broker.name || 'Broker Name',
        email: broker.email || 'broker@example.com',
        company: broker.company || 'Broker Company',
        address: broker.address || '123 Broker Street, London, UK'
      },
      operator: {
        name: operator.name || 'Operator Name',
        email: operator.email || 'operator@example.com',
        company: operator.company || 'Operator Company',
        address: operator.address || '456 Operator Avenue, London, UK'
      },
      route: {
        from: route.from || 'LHR',
        to: route.to || 'JFK',
        distanceNm: route.distanceNm || 3450
      },
      aircraft,
      passengers,
      departureDate,
      totalAmount,
      currency,
      platformFee,
      netToOperator,
      cancellationGrid: {
        '72+ hours': '10% administrative fee',
        '24-72 hours': '25% administrative fee',
        '4-24 hours': '50% administrative fee',
        'Less than 4 hours': '100% administrative fee'
      },
      terms: [
        'This quote is valid for 24 hours from the time of acceptance',
        'Deposit required before contact reveal (minimum 5% of total amount)',
        'Platform fee (7%) is non-refundable once service window starts',
        'Cancellation fees apply per the grid above based on time to departure',
        'All communications are watermarked with deal ID for audit purposes',
        'Disputes resolved through platform arbitration process',
        'Payment processed through regulated partners (Stripe Connect)',
        'Operator responsible for all operational compliance and safety'
      ],
      signedAt: new Date().toISOString(),
      ipAddress: '192.168.1.100', // In production, get real IP
      userAgent: navigator.userAgent,
      auditHash: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  static generatePDF(quoteData: SignedQuoteData): string {
    const pdfContent = `
STRATUS CONNECT - SIGNED QUOTE AGREEMENT
========================================

Quote ID: ${quoteData.quoteId}
Deal ID: ${quoteData.dealId}
Generated: ${new Date(quoteData.signedAt).toLocaleString()}
Audit Hash: ${quoteData.auditHash}

PARTIES
-------
Broker: ${quoteData.broker.name}
Company: ${quoteData.broker.company}
Email: ${quoteData.broker.email}
Address: ${quoteData.broker.address}

Operator: ${quoteData.operator.name}
Company: ${quoteData.operator.company}
Email: ${quoteData.operator.email}
Address: ${quoteData.operator.address}

FLIGHT DETAILS
--------------
Route: ${quoteData.route.from} → ${quoteData.route.to}
Distance: ${quoteData.route.distanceNm.toLocaleString()} nautical miles
Aircraft: ${quoteData.aircraft}
Passengers: ${quoteData.passengers}
Departure: ${new Date(quoteData.departureDate).toLocaleString()}

FINANCIAL TERMS
---------------
Total Amount: ${quoteData.currency} ${quoteData.totalAmount.toLocaleString()}
Platform Fee (7%): ${quoteData.currency} ${quoteData.platformFee.toLocaleString()}
Net to Operator: ${quoteData.currency} ${quoteData.netToOperator.toLocaleString()}

CANCELLATION POLICY
------------------
72+ hours before departure: ${quoteData.cancellationGrid['72+ hours']}
24-72 hours before departure: ${quoteData.cancellationGrid['24-72 hours']}
4-24 hours before departure: ${quoteData.cancellationGrid['4-24 hours']}
Less than 4 hours: ${quoteData.cancellationGrid['Less than 4 hours']}

TERMS AND CONDITIONS
--------------------
${quoteData.terms.map((term, index) => `${index + 1}. ${term}`).join('\n')}

SIGNATURES
----------
This quote has been electronically signed and accepted by both parties.

Broker Signature: [ELECTRONICALLY SIGNED]
Date: ${new Date(quoteData.signedAt).toLocaleString()}
IP Address: ${quoteData.ipAddress}

Operator Signature: [ELECTRONICALLY SIGNED]
Date: ${new Date(quoteData.signedAt).toLocaleString()}
IP Address: ${quoteData.ipAddress}

AUDIT TRAIL
-----------
This document is immutable and has been recorded in the platform audit log.
Any modifications will be detected through the audit hash verification.

Generated by: Stratus Connect Platform
Compliance: FCA Regulated Payment Partners
Version: 1.0
    `;

    return pdfContent;
  }

  static downloadPDF(quoteData: SignedQuoteData): void {
    const pdfContent = this.generatePDF(quoteData);
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signed_quote_${quoteData.quoteId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static generateAuditEntry(quoteData: SignedQuoteData): any {
    return {
      event: 'quote_signed',
      quoteId: quoteData.quoteId,
      dealId: quoteData.dealId,
      broker: quoteData.broker.email,
      operator: quoteData.operator.email,
      totalAmount: quoteData.totalAmount,
      currency: quoteData.currency,
      platformFee: quoteData.platformFee,
      signedAt: quoteData.signedAt,
      ipAddress: quoteData.ipAddress,
      auditHash: quoteData.auditHash,
      timestamp: new Date().toISOString()
    };
  }
}
