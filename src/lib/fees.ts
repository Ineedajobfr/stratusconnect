// Single Source of Truth for Platform Fees
// FCA Compliant Aviation Platform

export const FEES = {
  charterPlatformPct: 0.07,   // 7% broker–operator deals
  hiringPct: 0.10,            // 10% operator hiring
  pilotCrewPct: 0.00          // 0% for talent
} as const;

export interface FeeCalculation {
  gross: number;
  platform: number;
  net: number;
  currency: string;
}

export interface HiringFeeCalculation {
  gross: number;
  hiring: number;
  net: number;
  currency: string;
}

/**
 * Calculate platform fees for charter deals (broker-operator)
 */
export function calcDealFees(gross: number, currency: string = 'GBP'): FeeCalculation {
  const platform = Math.round(gross * FEES.charterPlatformPct);
  const net = gross - platform;
  
  return {
    gross,
    platform,
    net,
    currency
  };
}

/**
 * Calculate hiring fees for operator hiring deals
 */
export function calcHiringFees(gross: number, currency: string = 'GBP'): HiringFeeCalculation {
  const hiring = Math.round(gross * FEES.hiringPct);
  const net = gross - hiring;
  
  return {
    gross,
    hiring,
    net,
    currency
  };
}

/**
 * Calculate pilot/crew fees (always 0%)
 */
export function calcPilotCrewFees(gross: number, currency: string = 'GBP'): FeeCalculation {
  return {
    gross,
    platform: 0,
    net: gross,
    currency
  };
}

/**
 * Format fee amount for display
 */
export function formatFee(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount / 100); // Convert from minor units
}

/**
 * Get fee percentage for display
 */
export function getFeePercentage(transactionType: 'charter' | 'hiring' | 'pilot-crew'): number {
  switch (transactionType) {
    case 'charter':
      return FEES.charterPlatformPct * 100;
    case 'hiring':
      return FEES.hiringPct * 100;
    case 'pilot-crew':
      return FEES.pilotCrewPct * 100;
    default:
      return 0;
  }
}

/**
 * Validate fee calculation
 */
export function validateFeeCalculation(
  gross: number, 
  platform: number, 
  transactionType: 'charter' | 'hiring' | 'pilot-crew'
): boolean {
  const expectedFee = Math.round(gross * getFeePercentage(transactionType) / 100);
  return Math.abs(platform - expectedFee) <= 1; // Allow 1 cent rounding difference
}

/**
 * Get fee breakdown for UI display
 */
export function getFeeBreakdown(
  gross: number, 
  transactionType: 'charter' | 'hiring' | 'pilot-crew',
  currency: string = 'GBP'
) {
  const feePercentage = getFeePercentage(transactionType);
  
  switch (transactionType) {
    case 'charter':
      const charterFees = calcDealFees(gross, currency);
      return {
        label: 'Platform Fee',
        percentage: `${feePercentage}%`,
        amount: charterFees.platform,
        net: charterFees.net
      };
    case 'hiring':
      const hiringFees = calcHiringFees(gross, currency);
      return {
        label: 'Hiring Fee',
        percentage: `${feePercentage}%`,
        amount: hiringFees.hiring,
        net: hiringFees.net
      };
    case 'pilot-crew':
      return {
        label: 'Platform Fee',
        percentage: '0%',
        amount: 0,
        net: gross
      };
    default:
      throw new Error(`Unknown transaction type: ${transactionType}`);
  }
}
