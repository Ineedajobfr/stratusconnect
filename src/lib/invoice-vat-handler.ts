// Invoice Numbering and VAT Logic for Cross-Border
// FCA Compliant Aviation Platform

export interface CompanyDetails {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
  vatNumber?: string;
  taxId?: string;
  registrationNumber?: string;
  country: string;
  vatRate: number; // percentage
  currency: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number; // in minor units
  currency: string;
  vatRate: number; // percentage
  vatAmount: number; // in minor units
  totalAmount: number; // in minor units
  dealId?: string;
  transactionId?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  company: CompanyDetails;
  customer: CompanyDetails;
  issueDate: string;
  dueDate: string;
  currency: string;
  lineItems: InvoiceLineItem[];
  subtotal: number; // in minor units
  vatAmount: number; // in minor units
  totalAmount: number; // in minor units
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentTerms: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VATConfiguration {
  country: string;
  vatRate: number;
  vatNumberFormat: string;
  reverseCharge: boolean;
  threshold: number; // in minor units
}

class InvoiceVATHandler {
  private invoiceCounter: { [key: string]: number } = {};
  private vatConfigurations: VATConfiguration[] = [
    { country: 'GB', vatRate: 20, vatNumberFormat: 'GB123456789', reverseCharge: false, threshold: 0 },
    { country: 'DE', vatRate: 19, vatNumberFormat: 'DE123456789', reverseCharge: true, threshold: 100000 },
    { country: 'FR', vatRate: 20, vatNumberFormat: 'FR12345678901', reverseCharge: true, threshold: 100000 },
    { country: 'IT', vatRate: 22, vatNumberFormat: 'IT12345678901', reverseCharge: true, threshold: 100000 },
    { country: 'ES', vatRate: 21, vatNumberFormat: 'ES12345678901', reverseCharge: true, threshold: 100000 },
    { country: 'NL', vatRate: 21, vatNumberFormat: 'NL123456789B01', reverseCharge: true, threshold: 100000 },
    { country: 'US', vatRate: 0, vatNumberFormat: 'N/A', reverseCharge: false, threshold: 0 },
    { country: 'CH', vatRate: 7.7, vatNumberFormat: 'CHE-123.456.789', reverseCharge: false, threshold: 0 }
  ];

  /**
   * Generate invoice number
   */
  generateInvoiceNumber(companyCountry: string, year: number, month: number): string {
    const prefix = this.getCountryPrefix(companyCountry);
    const yearMonth = `${year}${month.toString().padStart(2, '0')}`;
    
    if (!this.invoiceCounter[yearMonth]) {
      this.invoiceCounter[yearMonth] = 0;
    }
    
    this.invoiceCounter[yearMonth]++;
    const sequence = this.invoiceCounter[yearMonth].toString().padStart(4, '0');
    
    return `${prefix}-${yearMonth}-${sequence}`;
  }

  /**
   * Get country prefix for invoice numbering
   */
  private getCountryPrefix(country: string): string {
    const prefixes: { [key: string]: string } = {
      'GB': 'SC',
      'DE': 'SC-DE',
      'FR': 'SC-FR',
      'IT': 'SC-IT',
      'ES': 'SC-ES',
      'NL': 'SC-NL',
      'US': 'SC-US',
      'CH': 'SC-CH'
    };
    
    return prefixes[country] || 'SC';
  }

  /**
   * Get VAT configuration for country
   */
  getVATConfiguration(country: string): VATConfiguration | null {
    return this.vatConfigurations.find(config => config.country === country) || null;
  }

  /**
   * Calculate VAT for line item
   */
  calculateVAT(amount: number, vatRate: number): number {
    return Math.round(amount * (vatRate / 100));
  }

  /**
   * Determine if reverse charge applies
   */
  shouldApplyReverseCharge(sellerCountry: string, buyerCountry: string, amount: number): boolean {
    if (sellerCountry === buyerCountry) return false;
    
    const sellerConfig = this.getVATConfiguration(sellerCountry);
    const buyerConfig = this.getVATConfiguration(buyerCountry);
    
    if (!sellerConfig || !buyerConfig) return false;
    
    return sellerConfig.reverseCharge && amount >= sellerConfig.threshold;
  }

  /**
   * Create invoice line item
   */
  createLineItem(
    description: string,
    quantity: number,
    unitPrice: number,
    currency: string,
    vatRate: number,
    dealId?: string,
    transactionId?: string
  ): InvoiceLineItem {
    const totalAmount = Math.round(quantity * unitPrice);
    const vatAmount = this.calculateVAT(totalAmount, vatRate);
    
    return {
      id: `ITEM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      description,
      quantity,
      unitPrice,
      currency,
      vatRate,
      vatAmount,
      totalAmount,
      dealId,
      transactionId
    };
  }

  /**
   * Create invoice
   */
  createInvoice(
    company: CompanyDetails,
    customer: CompanyDetails,
    lineItems: InvoiceLineItem[],
    paymentTerms: string = '30 days',
    notes?: string
  ): Invoice {
    const subtotal = lineItems.reduce((sum, item) => sum + item.totalAmount, 0);
    const vatAmount = lineItems.reduce((sum, item) => sum + item.vatAmount, 0);
    const totalAmount = subtotal + vatAmount;
    
    const now = new Date();
    const dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    const invoice: Invoice = {
      id: `INV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      invoiceNumber: this.generateInvoiceNumber(company.country, now.getFullYear(), now.getMonth() + 1),
      company,
      customer,
      issueDate: now.toISOString(),
      dueDate: dueDate.toISOString(),
      currency: company.currency,
      lineItems,
      subtotal,
      vatAmount,
      totalAmount,
      status: 'draft',
      paymentTerms,
      notes,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    
    return invoice;
  }

  /**
   * Format currency amount
   */
  formatCurrency(amount: number, currency: string): string {
    const majorAmount = amount / 100; // Convert from minor units
    
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(majorAmount);
  }

  /**
   * Generate PDF content for invoice
   */
  generatePDFContent(invoice: Invoice): string {
    const content = `
INVOICE
Invoice Number: ${invoice.invoiceNumber}
Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

FROM:
${invoice.company.name}
${invoice.company.address.street}
${invoice.company.address.city} ${invoice.company.address.postcode}
${invoice.company.address.country}
${invoice.company.vatNumber ? `VAT: ${invoice.company.vatNumber}` : ''}

TO:
${invoice.customer.name}
${invoice.customer.address.street}
${invoice.customer.address.city} ${invoice.customer.address.postcode}
${invoice.customer.address.country}
${invoice.customer.vatNumber ? `VAT: ${invoice.customer.vatNumber}` : ''}

LINE ITEMS:
${invoice.lineItems.map(item => `
${item.description}
Quantity: ${item.quantity}
Unit Price: ${this.formatCurrency(item.unitPrice, item.currency)}
VAT Rate: ${item.vatRate}%
VAT Amount: ${this.formatCurrency(item.vatAmount, item.currency)}
Total: ${this.formatCurrency(item.totalAmount, item.currency)}
`).join('')}

SUBTOTAL: ${this.formatCurrency(invoice.subtotal, invoice.currency)}
VAT TOTAL: ${this.formatCurrency(invoice.vatAmount, invoice.currency)}
TOTAL: ${this.formatCurrency(invoice.totalAmount, invoice.currency)}

Payment Terms: ${invoice.paymentTerms}
${invoice.notes ? `Notes: ${invoice.notes}` : ''}
    `;
    
    return content.trim();
  }

  /**
   * Generate CSV content for invoice
   */
  generateCSVContent(invoice: Invoice): string {
    const headers = [
      'Invoice Number',
      'Issue Date',
      'Due Date',
      'Company',
      'Customer',
      'Description',
      'Quantity',
      'Unit Price',
      'VAT Rate',
      'VAT Amount',
      'Total Amount',
      'Currency',
      'Status'
    ];
    
    const rows = invoice.lineItems.map(item => [
      invoice.invoiceNumber,
      new Date(invoice.issueDate).toLocaleDateString(),
      new Date(invoice.dueDate).toLocaleDateString(),
      invoice.company.name,
      invoice.customer.name,
      item.description,
      item.quantity.toString(),
      (item.unitPrice / 100).toString(),
      `${item.vatRate}%`,
      (item.vatAmount / 100).toString(),
      (item.totalAmount / 100).toString(),
      item.currency,
      invoice.status
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Validate VAT number format
   */
  validateVATNumber(vatNumber: string, country: string): boolean {
    const config = this.getVATConfiguration(country);
    if (!config) return false;
    
    // Basic format validation (in production, use proper VAT validation service)
    const patterns: { [key: string]: RegExp } = {
      'GB': /^GB[0-9]{9}$/,
      'DE': /^DE[0-9]{9}$/,
      'FR': /^FR[0-9]{11}$/,
      'IT': /^IT[0-9]{11}$/,
      'ES': /^ES[0-9]{11}$/,
      'NL': /^NL[0-9]{9}B[0-9]{2}$/,
      'CH': /^CHE-[0-9]{3}\.[0-9]{3}\.[0-9]{3}$/
    };
    
    const pattern = patterns[country];
    return pattern ? pattern.test(vatNumber) : false;
  }

  /**
   * Get invoice summary for reconciliation
   */
  getInvoiceSummary(invoices: Invoice[]): {
    totalInvoices: number;
    totalAmount: number;
    currency: string;
    vatTotal: number;
    byStatus: { [status: string]: number };
    byCurrency: { [currency: string]: number };
  } {
    const summary = {
      totalInvoices: invoices.length,
      totalAmount: 0,
      currency: 'GBP',
      vatTotal: 0,
      byStatus: {} as { [status: string]: number },
      byCurrency: {} as { [currency: string]: number }
    };
    
    invoices.forEach(invoice => {
      summary.totalAmount += invoice.totalAmount;
      summary.vatTotal += invoice.vatAmount;
      
      summary.byStatus[invoice.status] = (summary.byStatus[invoice.status] || 0) + 1;
      summary.byCurrency[invoice.currency] = (summary.byCurrency[invoice.currency] || 0) + invoice.totalAmount;
    });
    
    return summary;
  }
}

export const invoiceVATHandler = new InvoiceVATHandler();
export default invoiceVATHandler;
