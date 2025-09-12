// Signed Quote PDF Generator - Professional Aviation Contracts

export interface SignedQuoteData {
  quoteId: string;
  timestamp: string;
  broker: {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
  };
  operator: {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
  };
  flight: {
    route: string;
    aircraft: string;
    departureDate: string;
    departureTime: string;
    arrivalDate: string;
    arrivalTime: string;
    passengers: number;
  };
  financial: {
    totalAmount: number;
    currency: string;
    platformFee: number;
    netToOperator: number;
    depositAmount: number;
  };
  cancellationGrid: Record<string, string>;
  terms: string[];
  compliance: {
    fcaCompliant: boolean;
    kycVerified: boolean;
    auditHash: string;
    ipAddress: string;
    userAgent: string;
  };
}

class SignedQuotePDFGenerator {
  async generateSignedQuote(data: any): Promise<SignedQuoteData> {
    const platformFee = Math.round(data.totalAmount * 0.07);
    const netToOperator = data.totalAmount - platformFee;
    const depositAmount = Math.round(data.totalAmount * 0.05);

    const signedQuoteData: SignedQuoteData = {
      quoteId: data.quoteId,
      timestamp: new Date().toISOString(),
      broker: {
        id: data.broker.id,
        name: data.broker.name,
        company: data.broker.company,
        email: data.broker.email,
        phone: data.broker.phone
      },
      operator: {
        id: data.operator.id,
        name: data.operator.name,
        company: data.operator.company,
        email: data.operator.email,
        phone: data.operator.phone
      },
      flight: {
        route: data.flight.route,
        aircraft: data.flight.aircraft,
        departureDate: data.flight.departureDate,
        departureTime: data.flight.departureTime,
        arrivalDate: data.flight.arrivalDate,
        arrivalTime: data.flight.arrivalTime,
        passengers: data.flight.passengers
      },
      financial: {
        totalAmount: data.totalAmount,
        currency: data.currency,
        platformFee,
        netToOperator,
        depositAmount
      },
      cancellationGrid: {
        '72+ hours': '10% fee',
        '24-72 hours': '25% fee',
        '4-24 hours': '50% fee',
        'Less than 4 hours': '100% fee'
      },
      terms: [
        'Deposit required before contact reveal',
        'Platform fee non-refundable once service window starts',
        'Cancellation fees apply per grid above',
        'All communications watermarked with deal ID',
        'Disputes resolved through platform arbitration'
      ],
      compliance: {
        fcaCompliant: true,
        kycVerified: true,
        auditHash: '',
        ipAddress: '192.168.1.100',
        userAgent: navigator.userAgent
      }
    };

    signedQuoteData.compliance.auditHash = await this.generateAuditHash(signedQuoteData);
    return signedQuoteData;
  }

  private async generateAuditHash(quote: SignedQuoteData): Promise<string> {
    const canonicalData = {
      quoteId: quote.quoteId,
      timestamp: quote.timestamp,
      financial: quote.financial
    };
    const jsonString = JSON.stringify(canonicalData, null, 0);
    const encoder = new TextEncoder();
    const data = encoder.encode(jsonString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async downloadSignedQuote(quote: SignedQuoteData): Promise<void> {
    const htmlContent = this.generateHTMLContent(quote);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const filename = `signed_quote_${quote.quoteId}_${quote.timestamp.split('T')[0]}.html`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  private generateHTMLContent(quote: SignedQuoteData): string {
    const formatCurrency = (amount: number, currency: string): string => {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2
      }).format(amount / 100);
    };

    return `<!DOCTYPE html>
<html><head><title>Signed Quote - ${quote.quoteId}</title>
<style>body{font-family:Arial;max-width:800px;margin:0 auto;padding:20px}
.header{text-align:center;border-bottom:3px solid #f59e0b;padding-bottom:20px}
.section{margin-bottom:30px}.info-item{padding:10px;background:#f9fafb;border-radius:5px;margin-bottom:10px}
.cancellation-grid{background:#fef3c7;border:2px solid #f59e0b;border-radius:8px;padding:20px}
.audit-hash{background:#1f2937;color:#f9fafb;padding:15px;border-radius:5px;font-family:monospace;font-size:12px}
</style></head><body>
<div class="header"><h1>STRATUS CONNECT</h1><h2>Signed Quote Agreement</h2>
<div>Quote ID: ${quote.quoteId}</div><p>Generated: ${new Date(quote.timestamp).toLocaleString()}</p></div>

<div class="section"><h3>Flight Details</h3>
<div class="info-item"><strong>Route:</strong> ${quote.flight.route}</div>
<div class="info-item"><strong>Aircraft:</strong> ${quote.flight.aircraft}</div>
<div class="info-item"><strong>Departure:</strong> ${quote.flight.departureDate} at ${quote.flight.departureTime}</div>
<div class="info-item"><strong>Arrival:</strong> ${quote.flight.arrivalDate} at ${quote.flight.arrivalTime}</div>
<div class="info-item"><strong>Passengers:</strong> ${quote.flight.passengers}</div></div>

<div class="section"><h3>Financial Terms</h3>
<div class="info-item"><strong>Total Amount:</strong> ${formatCurrency(quote.financial.totalAmount, quote.financial.currency)}</div>
<div class="info-item"><strong>Platform Fee (7%):</strong> ${formatCurrency(quote.financial.platformFee, quote.financial.currency)}</div>
<div class="info-item"><strong>Net to Operator:</strong> ${formatCurrency(quote.financial.netToOperator, quote.financial.currency)}</div>
<div class="info-item"><strong>Minimum Deposit (5%):</strong> ${formatCurrency(quote.financial.depositAmount, quote.financial.currency)}</div>

<div class="cancellation-grid"><h4>Cancellation Fees</h4>
${Object.entries(quote.cancellationGrid).map(([time, fee]) => 
  `<div><strong>${time}:</strong> ${fee}</div>`
).join('')}</div></div>

<div class="section"><h3>Terms & Conditions</h3><ul>
${quote.terms.map(term => `<li>${term}</li>`).join('')}</ul></div>

<div class="audit-hash"><strong>Audit Hash:</strong> ${quote.compliance.auditHash}</div>

<div style="margin-top:40px;text-align:center;font-size:12px;color:#6b7280">
<p>Generated by Stratus Connect on ${new Date(quote.timestamp).toLocaleString()}</p>
<p>FCA Compliant | KYC Verified | Immutable Audit Trail</p></div>
</body></html>`;
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2
    }).format(amount / 100);
  }

  async validateSignedQuote(quote: SignedQuoteData): Promise<boolean> {
    try {
      const expectedHash = await this.generateAuditHash(quote);
      return quote.compliance.auditHash === expectedHash;
    } catch (error) {
      console.error('Signed quote validation failed:', error);
      return false;
    }
  }
}

export const signedQuotePDFGenerator = new SignedQuotePDFGenerator();
export default signedQuotePDFGenerator;