// FX Handler for Multi-Currency Support
// FCA Compliant Aviation Platform

export interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
  timestamp: string;
  source: string;
}

export interface FXTransaction {
  id: string;
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  convertedCurrency: string;
  exchangeRate: number;
  fee: number;
  netAmount: number;
  timestamp: string;
  dealId: string;
}

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
  minorUnit: number;
  active: boolean;
}

class FXHandler {
  private supportedCurrencies: CurrencyConfig[] = [
    { code: 'GBP', name: 'British Pound', symbol: '£', decimalPlaces: 2, minorUnit: 100, active: true },
    { code: 'EUR', name: 'Euro', symbol: '€', decimalPlaces: 2, minorUnit: 100, active: true },
    { code: 'USD', name: 'US Dollar', symbol: '$', decimalPlaces: 2, minorUnit: 100, active: true },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimalPlaces: 2, minorUnit: 100, active: true },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimalPlaces: 0, minorUnit: 1, active: true },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimalPlaces: 2, minorUnit: 100, active: true },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimalPlaces: 2, minorUnit: 100, active: true }
  ];

  private exchangeRates: CurrencyRate[] = [
    { from: 'GBP', to: 'USD', rate: 1.27, timestamp: '2024-01-16T10:00:00Z', source: 'ECB' },
    { from: 'GBP', to: 'EUR', rate: 1.17, timestamp: '2024-01-16T10:00:00Z', source: 'ECB' },
    { from: 'USD', to: 'GBP', rate: 0.79, timestamp: '2024-01-16T10:00:00Z', source: 'ECB' },
    { from: 'EUR', to: 'GBP', rate: 0.85, timestamp: '2024-01-16T10:00:00Z', source: 'ECB' },
    { from: 'USD', to: 'EUR', rate: 0.92, timestamp: '2024-01-16T10:00:00Z', source: 'ECB' },
    { from: 'EUR', to: 'USD', rate: 1.09, timestamp: '2024-01-16T10:00:00Z', source: 'ECB' }
  ];

  /**
   * Get supported currencies
   */
  getSupportedCurrencies(): CurrencyConfig[] {
    return this.supportedCurrencies.filter(currency => currency.active);
  }

  /**
   * Get exchange rate between two currencies
   */
  getExchangeRate(from: string, to: string): number {
    if (from === to) return 1.0;

    // Direct rate
    const directRate = this.exchangeRates.find(rate => 
      rate.from === from && rate.to === to
    );

    if (directRate) {
      return directRate.rate;
    }

    // Reverse rate
    const reverseRate = this.exchangeRates.find(rate => 
      rate.from === to && rate.to === from
    );

    if (reverseRate) {
      return 1 / reverseRate.rate;
    }

    // Cross rate through GBP
    const fromToGBP = this.getExchangeRate(from, 'GBP');
    const gbpToTo = this.getExchangeRate('GBP', to);
    
    if (fromToGBP && gbpToTo) {
      return fromToGBP * gbpToTo;
    }

    // Default to 1 if no rate found
    return 1.0;
  }

  /**
   * Convert amount between currencies
   */
  convertAmount(amount: number, fromCurrency: string, toCurrency: string): {
    convertedAmount: number;
    exchangeRate: number;
    fee: number;
    netAmount: number;
  } {
    const exchangeRate = this.getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = Math.round(amount * exchangeRate);
    
    // FX fee: 0.5% of converted amount
    const fee = Math.round(convertedAmount * 0.005);
    const netAmount = convertedAmount - fee;

    return {
      convertedAmount,
      exchangeRate,
      fee,
      netAmount
    };
  }

  /**
   * Calculate platform fee in the same currency as the transaction
   */
  calculatePlatformFee(amount: number, currency: string, feePercentage: number): {
    feeAmount: number;
    netAmount: number;
    currency: string;
  } {
    const feeAmount = Math.round(amount * (feePercentage / 100));
    const netAmount = amount - feeAmount;

    return {
      feeAmount,
      netAmount,
      currency
    };
  }

  /**
   * Format currency amount for display
   */
  formatCurrency(amount: number, currency: string): string {
    const config = this.supportedCurrencies.find(c => c.code === currency);
    if (!config) return `${currency} ${amount}`;

    const majorAmount = amount / config.minorUnit;
    const formatted = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: config.decimalPlaces,
      maximumFractionDigits: config.decimalPlaces
    }).format(majorAmount);

    return formatted;
  }

  /**
   * Create FX transaction record
   */
  createFXTransaction(
    originalAmount: number,
    originalCurrency: string,
    convertedCurrency: string,
    dealId: string
  ): FXTransaction {
    const conversion = this.convertAmount(originalAmount, originalCurrency, convertedCurrency);
    
    return {
      id: `FX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalAmount,
      originalCurrency,
      convertedAmount: conversion.convertedAmount,
      convertedCurrency,
      exchangeRate: conversion.exchangeRate,
      fee: conversion.fee,
      netAmount: conversion.netAmount,
      timestamp: new Date().toISOString(),
      dealId
    };
  }

  /**
   * Get currency symbol
   */
  getCurrencySymbol(currency: string): string {
    const config = this.supportedCurrencies.find(c => c.code === currency);
    return config?.symbol || currency;
  }

  /**
   * Validate currency code
   */
  isValidCurrency(currency: string): boolean {
    return this.supportedCurrencies.some(c => c.code === currency && c.active);
  }

  /**
   * Get minor unit for currency
   */
  getMinorUnit(currency: string): number {
    const config = this.supportedCurrencies.find(c => c.code === currency);
    return config?.minorUnit || 100;
  }

  /**
   * Convert to minor units (pennies/cents)
   */
  toMinorUnits(amount: number, currency: string): number {
    const minorUnit = this.getMinorUnit(currency);
    return Math.round(amount * minorUnit);
  }

  /**
   * Convert from minor units (pennies/cents)
   */
  fromMinorUnits(amount: number, currency: string): number {
    const minorUnit = this.getMinorUnit(currency);
    return amount / minorUnit;
  }

  /**
   * Calculate total fees across multiple currencies
   */
  calculateTotalFees(transactions: Array<{ amount: number; currency: string; feePercentage: number }>): {
    totalFees: Array<{ currency: string; amount: number; formatted: string }>;
    grandTotal: { currency: string; amount: number; formatted: string };
  } {
    const feeTotals: { [currency: string]: number } = {};

    transactions.forEach(tx => {
      const fee = this.calculatePlatformFee(tx.amount, tx.currency, tx.feePercentage);
      feeTotals[tx.currency] = (feeTotals[tx.currency] || 0) + fee.feeAmount;
    });

    const totalFees = Object.entries(feeTotals).map(([currency, amount]) => ({
      currency,
      amount,
      formatted: this.formatCurrency(amount, currency)
    }));

    // Convert all to GBP for grand total
    const grandTotalAmount = totalFees.reduce((sum, fee) => {
      const conversion = this.convertAmount(fee.amount, fee.currency, 'GBP');
      return sum + conversion.convertedAmount;
    }, 0);

    return {
      totalFees,
      grandTotal: {
        currency: 'GBP',
        amount: grandTotalAmount,
        formatted: this.formatCurrency(grandTotalAmount, 'GBP')
      }
    };
  }

  /**
   * Get FX rates for display
   */
  getFXRates(): Array<{
    from: string;
    to: string;
    rate: number;
    formatted: string;
    timestamp: string;
  }> {
    return this.exchangeRates.map(rate => ({
      from: rate.from,
      to: rate.to,
      rate: rate.rate,
      formatted: `1 ${rate.from} = ${rate.rate.toFixed(4)} ${rate.to}`,
      timestamp: rate.timestamp
    }));
  }
}

export const fxHandler = new FXHandler();
export default fxHandler;
