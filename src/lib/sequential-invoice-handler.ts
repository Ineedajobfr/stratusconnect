// Sequential Invoice Numbering with VAT and FX Compliance
// FCA Compliant Aviation Platform

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface SequentialInvoiceData {
  id: string;
  invoiceNumber: string;
  companyCountry: string;
  currency: string;
  year: number;
  month: number;
  sequenceNumber: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  exchangeRate?: number;
  baseCurrency: string;
  createdAt: string;
  auditHash: string;
}

export interface InvoiceCounter {
  id: string;
  companyCountry: string;
  year: number;
  month: number;
  lastSequenceNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: string;
  source: 'ECB' | 'Bank' | 'Manual';
}

class SequentialInvoiceHandler {
  private exchangeRates: Map<string, ExchangeRate> = new Map();
  private lastRateUpdate: Date | null = null;

  /**
   * Get next sequential invoice number for a company/country
   */
  async getNextInvoiceNumber(
    companyCountry: string, 
    currency: string,
    year: number = new Date().getFullYear(),
    month: number = new Date().getMonth() + 1
  ): Promise<string> {
    try {
      // Get or create counter for this country/year/month
      const counter = await this.getOrCreateCounter(companyCountry, year, month);
      
      // Increment sequence number
      const nextSequence = counter.lastSequenceNumber + 1;
      
      // Update counter in database
      const { error: updateError } = await supabase
        .from('invoice_counters')
        .update({ 
          lastSequenceNumber: nextSequence,
          updatedAt: new Date().toISOString()
        })
        .eq('id', counter.id);

      if (updateError) {
        throw new Error(`Failed to update invoice counter: ${updateError.message}`);
      }

      // Generate invoice number
      const prefix = this.getCountryPrefix(companyCountry);
      const yearMonth = `${year}${month.toString().padStart(2, '0')}`;
      const sequence = nextSequence.toString().padStart(6, '0'); // 6 digits for sequence
      
      return `${prefix}-${yearMonth}-${sequence}`;
    } catch (error) {
      console.error('Error generating invoice number:', error);
      throw error;
    }
  }

  /**
   * Get or create invoice counter
   */
  private async getOrCreateCounter(
    companyCountry: string, 
    year: number, 
    month: number
  ): Promise<InvoiceCounter> {
    // Try to get existing counter
    const { data: existingCounter, error: fetchError } = await supabase
      .from('invoice_counters')
      .select('*')
      .eq('companyCountry', companyCountry)
      .eq('year', year)
      .eq('month', month)
      .single();

    if (existingCounter && !fetchError) {
      return existingCounter;
    }

    // Create new counter
    const newCounter: Omit<InvoiceCounter, 'id'> = {
      companyCountry,
      year,
      month,
      lastSequenceNumber: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { data: createdCounter, error: createError } = await supabase
      .from('invoice_counters')
      .insert(newCounter)
      .select()
      .single();

    if (createError || !createdCounter) {
      throw new Error(`Failed to create invoice counter: ${createError?.message}`);
    }

    return createdCounter;
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
      'CH': 'SC-CH',
      'AU': 'SC-AU',
      'CA': 'SC-CA',
      'SG': 'SC-SG',
      'HK': 'SC-HK',
      'AE': 'SC-AE'
    };
    
    return prefixes[country] || 'SC';
  }

  /**
   * Get VAT rate for country and currency
   */
  getVATRate(country: string, currency: string, amount: number): number {
    // VAT rates by country (in percentage)
    const vatRates: { [key: string]: number } = {
      'GB': 20,   // UK
      'DE': 19,   // Germany
      'FR': 20,   // France
      'IT': 22,   // Italy
      'ES': 21,   // Spain
      'NL': 21,   // Netherlands
      'CH': 7.7,  // Switzerland
      'US': 0,    // No VAT in US
      'AU': 10,   // Australia GST
      'CA': 13,   // Canada (varies by province, using average)
      'SG': 7,    // Singapore
      'HK': 0,    // Hong Kong
      'AE': 5     // UAE
    };

    // Check for reverse charge scenarios (B2B cross-border)
    if (this.shouldApplyReverseCharge(country, amount)) {
      return 0; // Reverse charge - customer handles VAT
    }

    return vatRates[country] || 0;
  }

  /**
   * Check if reverse charge applies (B2B cross-border transactions)
   */
  private shouldApplyReverseCharge(country: string, amount: number): boolean {
    // Reverse charge typically applies for B2B transactions above certain thresholds
    const reverseChargeThresholds: { [key: string]: number } = {
      'GB': 0,      // Always apply reverse charge for EU B2B
      'DE': 100000, // €100k threshold
      'FR': 100000,
      'IT': 100000,
      'ES': 100000,
      'NL': 100000
    };

    const threshold = reverseChargeThresholds[country] || 0;
    return amount >= threshold;
  }

  /**
   * Calculate VAT amount
   */
  calculateVAT(amount: number, vatRate: number): number {
    return Math.round(amount * (vatRate / 100));
  }

  /**
   * Get exchange rate for currency conversion
   */
  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) return 1;

    const rateKey = `${fromCurrency}_${toCurrency}`;
    const now = new Date();

    // Check if we have a recent rate (less than 1 hour old)
    if (this.exchangeRates.has(rateKey)) {
      const rate = this.exchangeRates.get(rateKey)!;
      const rateAge = now.getTime() - new Date(rate.timestamp).getTime();
      
      if (rateAge < 3600000) { // 1 hour
        return rate.rate;
      }
    }

    // Fetch new exchange rate
    try {
      const rate = await this.fetchExchangeRate(fromCurrency, toCurrency);
      
      // Store rate
      this.exchangeRates.set(rateKey, {
        fromCurrency,
        toCurrency,
        rate,
        timestamp: now.toISOString(),
        source: 'ECB'
      });

      // Also store reverse rate
      this.exchangeRates.set(`${toCurrency}_${fromCurrency}`, {
        fromCurrency: toCurrency,
        toCurrency: fromCurrency,
        rate: 1 / rate,
        timestamp: now.toISOString(),
        source: 'ECB'
      });

      return rate;
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      // Fallback to 1:1 if we can't get rate
      return 1;
    }
  }

  /**
   * Fetch exchange rate from external API (mock implementation)
   */
  private async fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    // In production, this would call a real exchange rate API (e.g., ECB, Fixer.io)
    // For now, return mock rates
    const mockRates: { [key: string]: number } = {
      'USD_GBP': 0.79,
      'GBP_USD': 1.27,
      'EUR_GBP': 0.86,
      'GBP_EUR': 1.16,
      'USD_EUR': 0.92,
      'EUR_USD': 1.09,
      'CHF_GBP': 0.88,
      'GBP_CHF': 1.14
    };

    const rateKey = `${fromCurrency}_${toCurrency}`;
    return mockRates[rateKey] || 1;
  }

  /**
   * Convert amount between currencies
   */
  async convertCurrency(
    amount: number, 
    fromCurrency: string, 
    toCurrency: string
  ): Promise<{ convertedAmount: number; exchangeRate: number }> {
    const exchangeRate = await this.getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = Math.round(amount * exchangeRate);

    return {
      convertedAmount,
      exchangeRate
    };
  }

  /**
   * Create sequential invoice with proper numbering and VAT
   */
  async createSequentialInvoice(data: {
    companyCountry: string;
    currency: string;
    customerCountry?: string;
    lineItems: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      dealId?: string;
      transactionId?: string;
    }>;
    baseCurrency?: string;
    notes?: string;
  }): Promise<SequentialInvoiceData> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // Generate sequential invoice number
    const invoiceNumber = await this.getNextInvoiceNumber(
      data.companyCountry, 
      data.currency, 
      year, 
      month
    );

    // Calculate totals
    const subtotal = data.lineItems.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0
    );

    // Get VAT rate
    const vatRate = this.getVATRate(data.companyCountry, data.currency, subtotal);
    const vatAmount = this.calculateVAT(subtotal, vatRate);
    const totalAmount = subtotal + vatAmount;

    // Handle currency conversion if needed
    let exchangeRate: number | undefined;
    if (data.baseCurrency && data.baseCurrency !== data.currency) {
      const conversion = await this.convertCurrency(
        totalAmount, 
        data.currency, 
        data.baseCurrency
      );
      exchangeRate = conversion.exchangeRate;
    }

    // Generate audit hash
    const auditData = {
      invoiceNumber,
      companyCountry: data.companyCountry,
      currency: data.currency,
      subtotal,
      vatAmount,
      totalAmount,
      timestamp: now.toISOString(),
      lineItems: data.lineItems
    };

    const auditHash = await this.generateAuditHash(auditData);

    const invoiceData: SequentialInvoiceData = {
      id: `INV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      invoiceNumber,
      companyCountry: data.companyCountry,
      currency: data.currency,
      year,
      month,
      sequenceNumber: parseInt(invoiceNumber.split('-').pop() || '0'),
      vatRate,
      vatAmount,
      totalAmount,
      exchangeRate,
      baseCurrency: data.baseCurrency || data.currency,
      createdAt: now.toISOString(),
      auditHash
    };

    // Store invoice in database
    const { error } = await supabase
      .from('sequential_invoices')
      .insert(invoiceData);

    if (error) {
      throw new Error(`Failed to store invoice: ${error.message}`);
    }

    return invoiceData;
  }

  /**
   * Generate SHA256 audit hash
   */
  private async generateAuditHash(data: any): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get invoice by number
   */
  async getInvoiceByNumber(invoiceNumber: string): Promise<SequentialInvoiceData | null> {
    const { data, error } = await supabase
      .from('sequential_invoices')
      .select('*')
      .eq('invoiceNumber', invoiceNumber)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }

  /**
   * Get invoice summary for reconciliation
   */
  async getInvoiceSummary(
    companyCountry?: string,
    year?: number,
    month?: number
  ): Promise<{
    totalInvoices: number;
    totalAmount: number;
    totalVAT: number;
    currency: string;
    byMonth: { [key: string]: number };
    byCountry: { [key: string]: number };
  }> {
    let query = supabase.from('sequential_invoices').select('*');
    
    if (companyCountry) {
      query = query.eq('companyCountry', companyCountry);
    }
    if (year) {
      query = query.eq('year', year);
    }
    if (month) {
      query = query.eq('month', month);
    }

    const { data: invoices, error } = await query;

    if (error || !invoices) {
      throw new Error(`Failed to fetch invoices: ${error?.message}`);
    }

    const summary = {
      totalInvoices: invoices.length,
      totalAmount: 0,
      totalVAT: 0,
      currency: 'GBP',
      byMonth: {} as { [key: string]: number },
      byCountry: {} as { [key: string]: number }
    };

    invoices.forEach(invoice => {
      summary.totalAmount += invoice.totalAmount;
      summary.totalVAT += invoice.vatAmount;
      
      const monthKey = `${invoice.year}-${invoice.month}`;
      summary.byMonth[monthKey] = (summary.byMonth[monthKey] || 0) + invoice.totalAmount;
      summary.byCountry[invoice.companyCountry] = 
        (summary.byCountry[invoice.companyCountry] || 0) + invoice.totalAmount;
    });

    return summary;
  }
}

export const sequentialInvoiceHandler = new SequentialInvoiceHandler();
export default sequentialInvoiceHandler;
