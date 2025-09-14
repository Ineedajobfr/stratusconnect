// Pricing Tests - Single Source of Truth Validation
// FCA Compliant Aviation Platform

import { describe, it, expect } from 'vitest';
import { 
  calcDealFees, 
  calcHiringFees, 
  calcPilotCrewFees, 
  getFeePercentage, 
  validateFeeCalculation,
  getFeeBreakdown,
  FEES 
} from '../lib/fees';

describe('Pricing Module', () => {
  describe('Fee Calculations', () => {
    it('should calculate 7% platform fee for charter deals', () => {
      const result = calcDealFees(100000); // £1,000 in pennies
      
      expect(result.gross).toBe(100000);
      expect(result.platform).toBe(7000); // 7% of £1,000
      expect(result.net).toBe(93000); // £930 net to operator
      expect(result.currency).toBe('GBP');
    });

    it('should calculate 10% hiring fee for operator hiring', () => {
      const result = calcHiringFees(100000); // £1,000 in pennies
      
      expect(result.gross).toBe(100000);
      expect(result.hiring).toBe(10000); // 10% of £1,000
      expect(result.net).toBe(90000); // £900 net to operator
      expect(result.currency).toBe('GBP');
    });

    it('should calculate 0% fee for pilot/crew', () => {
      const result = calcPilotCrewFees(100000); // £1,000 in pennies
      
      expect(result.gross).toBe(100000);
      expect(result.platform).toBe(0); // 0% fee
      expect(result.net).toBe(100000); // Full amount to pilot/crew
      expect(result.currency).toBe('GBP');
    });

    it('should handle different currencies', () => {
      const result = calcDealFees(100000, 'USD');
      
      expect(result.currency).toBe('USD');
      expect(result.platform).toBe(7000); // Same percentage
    });
  });

  describe('Fee Percentages', () => {
    it('should return correct fee percentages', () => {
      expect(getFeePercentage('charter')).toBe(7);
      expect(getFeePercentage('hiring')).toBe(10);
      expect(getFeePercentage('pilot-crew')).toBe(0);
    });
  });

  describe('Fee Validation', () => {
    it('should validate correct fee calculations', () => {
      const gross = 100000;
      const platform = 7000; // 7% of £1,000
      
      expect(validateFeeCalculation(gross, platform, 'charter')).toBe(true);
      expect(validateFeeCalculation(gross, platform, 'hiring')).toBe(false); // Wrong type
      expect(validateFeeCalculation(gross, platform, 'pilot-crew')).toBe(false); // Should be 0
    });

    it('should allow 1 cent rounding difference', () => {
      const gross = 100001; // £1,000.01
      const platform = 7000; // 7% rounded down
      
      expect(validateFeeCalculation(gross, platform, 'charter')).toBe(true);
    });
  });

  describe('Fee Breakdown', () => {
    it('should return correct breakdown for charter deals', () => {
      const breakdown = getFeeBreakdown(100000, 'charter');
      
      expect(breakdown.label).toBe('Platform Fee');
      expect(breakdown.percentage).toBe('7%');
      expect(breakdown.amount).toBe(7000);
      expect(breakdown.net).toBe(93000);
    });

    it('should return correct breakdown for hiring deals', () => {
      const breakdown = getFeeBreakdown(100000, 'hiring');
      
      expect(breakdown.label).toBe('Hiring Fee');
      expect(breakdown.percentage).toBe('10%');
      expect(breakdown.amount).toBe(10000);
      expect(breakdown.net).toBe(90000);
    });

    it('should return correct breakdown for pilot/crew deals', () => {
      const breakdown = getFeeBreakdown(100000, 'pilot-crew');
      
      expect(breakdown.label).toBe('Platform Fee');
      expect(breakdown.percentage).toBe('0%');
      expect(breakdown.amount).toBe(0);
      expect(breakdown.net).toBe(100000);
    });
  });

  describe('Fee Constants', () => {
    it('should have correct fee percentages', () => {
      expect(FEES.charterPlatformPct).toBe(0.07);
      expect(FEES.hiringPct).toBe(0.10);
      expect(FEES.pilotCrewPct).toBe(0.00);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero amounts', () => {
      const result = calcDealFees(0);
      
      expect(result.gross).toBe(0);
      expect(result.platform).toBe(0);
      expect(result.net).toBe(0);
    });

    it('should handle very large amounts', () => {
      const result = calcDealFees(1000000000); // £10,000,000
      
      expect(result.platform).toBe(70000000); // £700,000
      expect(result.net).toBe(930000000); // £9,300,000
    });

    it('should throw error for unknown transaction type', () => {
      expect(() => getFeeBreakdown(100000, 'unknown' as never)).toThrow();
    });
  });
});
