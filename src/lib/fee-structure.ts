// Fee Structure Management
// Enforces the locked-in fee structure for Stratus Connect

export interface FeeStructure {
  brokerOperatorCommission: number; // 7%
  operatorHiringFee: number; // 10%
  pilotCrewFee: number; // 0%
}

export interface TransactionFee {
  transactionId: string;
  transactionType: 'broker_operator' | 'operator_hiring' | 'pilot_crew';
  amount: number;
  currency: string;
  feeAmount: number;
  feePercentage: number;
  netAmount: number;
  calculatedAt: string;
}

// Locked-in fee structure - cannot be changed
export const FEE_STRUCTURE: FeeStructure = {
  brokerOperatorCommission: 0.07, // 7%
  operatorHiringFee: 0.10, // 10%
  pilotCrewFee: 0.00, // 0%
} as const;

// Fee calculation functions
export class FeeCalculator {
  /**
   * Calculate fees for broker-operator transactions
   */
  static calculateBrokerOperatorFee(amount: number, currency: string = 'GBP'): TransactionFee {
    const feeAmount = amount * FEE_STRUCTURE.brokerOperatorCommission;
    const netAmount = amount - feeAmount;
    
    return {
      transactionId: crypto.randomUUID(),
      transactionType: 'broker_operator',
      amount,
      currency,
      feeAmount,
      feePercentage: FEE_STRUCTURE.brokerOperatorCommission,
      netAmount,
      calculatedAt: new Date().toISOString(),
    };
  }

  /**
   * Calculate fees for operator hiring transactions
   */
  static calculateOperatorHiringFee(amount: number, currency: string = 'GBP'): TransactionFee {
    const feeAmount = amount * FEE_STRUCTURE.operatorHiringFee;
    const netAmount = amount - feeAmount;
    
    return {
      transactionId: crypto.randomUUID(),
      transactionType: 'operator_hiring',
      amount,
      currency,
      feeAmount,
      feePercentage: FEE_STRUCTURE.operatorHiringFee,
      netAmount,
      calculatedAt: new Date().toISOString(),
    };
  }

  /**
   * Calculate fees for pilot/crew transactions (always 0%)
   */
  static calculatePilotCrewFee(amount: number, currency: string = 'GBP'): TransactionFee {
    const feeAmount = 0; // Always 0% for pilots and crew
    const netAmount = amount; // No fees deducted
    
    return {
      transactionId: crypto.randomUUID(),
      transactionType: 'pilot_crew',
      amount,
      currency,
      feeAmount,
      feePercentage: FEE_STRUCTURE.pilotCrewFee,
      netAmount,
      calculatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get fee structure information
   */
  static getFeeStructure(): FeeStructure {
    return { ...FEE_STRUCTURE };
  }

  /**
   * Validate that fees are being calculated correctly
   */
  static validateFeeCalculation(
    transactionType: 'broker_operator' | 'operator_hiring' | 'pilot_crew',
    amount: number,
    expectedFeeAmount: number
  ): boolean {
    const expectedPercentage = this.getExpectedFeePercentage(transactionType);
    const calculatedFeeAmount = amount * expectedPercentage;
    
    // Allow for small floating point differences
    return Math.abs(calculatedFeeAmount - expectedFeeAmount) < 0.01;
  }

  /**
   * Get expected fee percentage for transaction type
   */
  private static getExpectedFeePercentage(
    transactionType: 'broker_operator' | 'operator_hiring' | 'pilot_crew'
  ): number {
    switch (transactionType) {
      case 'broker_operator':
        return FEE_STRUCTURE.brokerOperatorCommission;
      case 'operator_hiring':
        return FEE_STRUCTURE.operatorHiringFee;
      case 'pilot_crew':
        return FEE_STRUCTURE.pilotCrewFee;
      default:
        throw new Error(`Unknown transaction type: ${transactionType}`);
    }
  }
}

// Fee structure validation
export class FeeStructureValidator {
  /**
   * Validate that the fee structure has not been tampered with
   */
  static validateFeeStructure(): boolean {
    const currentFees = FeeCalculator.getFeeStructure();
    
    return (
      currentFees.brokerOperatorCommission === 0.07 &&
      currentFees.operatorHiringFee === 0.10 &&
      currentFees.pilotCrewFee === 0.00
    );
  }

  /**
   * Get fee structure display information
   */
  static getFeeStructureDisplay() {
    return {
      brokerOperator: {
        label: 'Broker-Operator Commission',
        percentage: '7%',
        description: 'Applied to all broker-operator transactions',
        nonNegotiable: true,
      },
      operatorHiring: {
        label: 'Operator Hiring Fee',
        percentage: '10%',
        description: 'Applied when operators hire pilots/crew through the platform',
        nonNegotiable: true,
      },
      pilotCrew: {
        label: 'Pilot/Crew Fees',
        percentage: '0%',
        description: 'No fees for pilots and crew - always free',
        nonNegotiable: true,
      },
    };
  }
}

// Fee audit logging
export class FeeAuditLogger {
  /**
   * Log fee calculation for audit purposes
   */
  static async logFeeCalculation(transactionFee: TransactionFee, userId: string): Promise<void> {
    try {
      // This would typically log to your audit system
      console.log('Fee calculation logged:', {
        transactionId: transactionFee.transactionId,
        transactionType: transactionFee.transactionType,
        amount: transactionFee.amount,
        feeAmount: transactionFee.feeAmount,
        feePercentage: transactionFee.feePercentage,
        userId,
        timestamp: transactionFee.calculatedAt,
      });
      
      // In a real implementation, this would write to your audit database
      // await auditDatabase.log('fee_calculation', transactionFee, userId);
    } catch (error) {
      console.error('Failed to log fee calculation:', error);
      throw new Error('Fee audit logging failed');
    }
  }
}

// Fee structure constants for UI display
export const FEE_STRUCTURE_CONSTANTS = {
  BROKER_OPERATOR_COMMISSION: 7,
  OPERATOR_HIRING_FEE: 10,
  PILOT_CREW_FEE: 0,
  CURRENCIES: ['GBP', 'EUR', 'USD'],
  MIN_TRANSACTION_AMOUNT: 100, // Minimum transaction amount in pence
  MAX_TRANSACTION_AMOUNT: 10000000, // Maximum transaction amount in pence
} as const;

// Fee structure validation rules
export const FEE_VALIDATION_RULES = {
  // Fee percentages must match exactly
  BROKER_OPERATOR_COMMISSION: 0.07,
  OPERATOR_HIRING_FEE: 0.10,
  PILOT_CREW_FEE: 0.00,
  
  // Fee structure cannot be modified
  IMMUTABLE: true,
  
  // All fees must be calculated using these exact percentages
  ENFORCED: true,
} as const;
