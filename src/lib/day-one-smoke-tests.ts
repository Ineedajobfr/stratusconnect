// Day One Smoke Tests - Simplified for Type Safety
import { productionPaymentFlows } from './production-payment-flows';
import { receiptGenerator } from './receipt-generator';
import { evidencePackGenerator } from './evidence-pack-generator';
import { kycAMLLiveSystem } from './kyc-aml-live';
import { calcDealFees } from './fees';

export class DayOneSmokeTests {
  async runAllTests(): Promise<{
    passed: number;
    failed: number;
    results: Array<{ test: string; status: 'pass' | 'fail'; error?: string }>;
  }> {
    const results: Array<{ test: string; status: 'pass' | 'fail'; error?: string }> = [];
    
    // Test 1: Charter Deal Flow
    try {
      await this.testCharterDealFlow();
      results.push({ test: 'Charter Deal Flow', status: 'pass' });
    } catch (error) {
      results.push({ test: 'Charter Deal Flow', status: 'fail', error: String(error) });
    }

    // Test 2: Fee Calculation
    try {
      await this.testFeeCalculation();
      results.push({ test: 'Fee Calculation', status: 'pass' });
    } catch (error) {
      results.push({ test: 'Fee Calculation', status: 'fail', error: String(error) });
    }

    // Test 3: KYC Process
    try {
      await this.testKYCProcess();
      results.push({ test: 'KYC Process', status: 'pass' });
    } catch (error) {
      results.push({ test: 'KYC Process', status: 'fail', error: String(error) });
    }

    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;

    return { passed, failed, results };
  }

  private async testCharterDealFlow(): Promise<void> {
    const deal = {
      dealId: 'TEST_DEAL_001',
      type: 'charter' as const,
      route: 'KJFK-EGLL',
      aircraft: 'G650',
      departureDate: new Date().toISOString(),
      totalAmount: 1000000, // £10,000 in pennies
      currency: 'GBP',
      brokerId: 'test-broker',
      operatorId: 'test-operator'
    };

    const result = await productionPaymentFlows.processCharterDeal(deal);
    
    if (!result.receipt) {
      throw new Error('Receipt not generated');
    }

    if (!result.auditHash) {
      throw new Error('Audit hash missing');
    }
  }

  private async testFeeCalculation(): Promise<void> {
    const feeStructure = calcDealFees(1000000, 'GBP');
    
    if (!feeStructure.platform || feeStructure.platform <= 0) {
      throw new Error('Invalid fee calculation');
    }
  }

  private async testKYCProcess(): Promise<void> {
    const userId = 'test-user-id';
    
    const kycResult = await kycAMLLiveSystem.performKYC(userId, ['passport', 'utility_bill']);
    
    if (!kycResult.userId || !kycResult.status) {
      throw new Error('KYC process failed');
    }

    const sanctionsResult = await kycAMLLiveSystem.screenUser(userId, {
      fullName: 'Test User',
      nationality: 'US',
      email: 'test@example.com'
    });
    
    if (!sanctionsResult.result) {
      throw new Error('Sanctions screening failed');
    }
  }
}

export const dayOneSmokeTests = new DayOneSmokeTests();
export default dayOneSmokeTests;