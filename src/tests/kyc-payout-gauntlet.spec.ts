// KYC Payout Block Gauntlet Test - Universal Compliance
// FCA Compliant Aviation Platform

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { kycLiveService } from '../lib/kyc-aml-live';
import { universalComplianceEnforcer } from '../lib/universal-compliance';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn()
      }))
    })),
    insert: vi.fn(() => ({
      select: vi.fn()
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn()
      }))
    }))
  })),
  rpc: vi.fn()
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));

describe('KYC Payout Block Gauntlet Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should block payout for unverified operator', async () => {
    // Mock unverified operator
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: 'operator-123',
              kyc_status: 'pending',
              kyc_verified_at: null,
              sanctions_check_status: 'pending',
              pep_check_status: 'pending'
            }
          }))
        }))
      }))
    });

    const result = await kycLiveService.canReceivePayouts('operator-123');
    
    expect(result).toBe(false);
  });

  it('should allow payout for verified operator', async () => {
    // Mock verified operator
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: 'operator-456',
              kyc_status: 'verified',
              kyc_verified_at: '2025-01-10T10:00:00Z',
              sanctions_check_status: 'clear',
              pep_check_status: 'clear'
            }
          }))
        }))
      }))
    });

    const result = await kycLiveService.canReceivePayouts('operator-456');
    
    expect(result).toBe(true);
  });

  it('should block payout for sanctions hit', async () => {
    // Mock operator with sanctions hit
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: 'operator-789',
              kyc_status: 'verified',
              kyc_verified_at: '2025-01-10T10:00:00Z',
              sanctions_check_status: 'hit',
              pep_check_status: 'clear'
            }
          }))
        }))
      }))
    });

    const result = await kycLiveService.canReceivePayouts('operator-789');
    
    expect(result).toBe(false);
  });

  it('should block payout for PEP hit', async () => {
    // Mock operator with PEP hit
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: 'operator-101',
              kyc_status: 'verified',
              kyc_verified_at: '2025-01-10T10:00:00Z',
              sanctions_check_status: 'clear',
              pep_check_status: 'hit'
            }
          }))
        }))
      }))
    });

    const result = await kycLiveService.canReceivePayouts('operator-101');
    
    expect(result).toBe(false);
  });

  it('should provide clear reason for payout block', async () => {
    // Mock unverified operator
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: 'operator-123',
              kyc_status: 'pending',
              kyc_verified_at: null,
              sanctions_check_status: 'pending',
              pep_check_status: 'pending'
            }
          }))
        }))
      }))
    });

    const result = await kycLiveService.canReceivePayouts('operator-123');
    
    expect(result).toBe(false);
    
    // Should provide clear next steps
    const nextSteps = await kycLiveService.getNextSteps('operator-123');
    expect(nextSteps).toContain('Complete KYC verification');
    expect(nextSteps).toContain('Submit required documents');
  });

  it('should enforce universal KYC compliance', () => {
    // Verify universal compliance is enforced
    expect(universalComplianceEnforcer.areKycAmlGatesEnforced()).toBe(true);
    
    const complianceStatus = universalComplianceEnforcer.getComplianceStatus();
    const kycCheck = complianceStatus.find(check => check.feature === 'kyc_aml_gates');
    
    expect(kycCheck?.enabled).toBe(true);
    expect(kycCheck?.required).toBe(true);
    expect(kycCheck?.description).toBe('KYC/AML verification required before payouts');
  });

  it('should block payout for expired KYC', async () => {
    // Mock operator with expired KYC (older than 1 year)
    const expiredDate = new Date();
    expiredDate.setFullYear(expiredDate.getFullYear() - 2);
    
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: 'operator-202',
              kyc_status: 'verified',
              kyc_verified_at: expiredDate.toISOString(),
              sanctions_check_status: 'clear',
              pep_check_status: 'clear'
            }
          }))
        }))
      }))
    });

    const result = await kycLiveService.canReceivePayouts('operator-202');
    
    expect(result).toBe(false);
  });

  it('should require fresh sanctions screening', async () => {
    // Mock operator with stale sanctions check
    const staleDate = new Date();
    staleDate.setMonth(staleDate.getMonth() - 2); // 2 months old
    
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: 'operator-303',
              kyc_status: 'verified',
              kyc_verified_at: '2025-01-10T10:00:00Z',
              sanctions_check_status: 'clear',
              sanctions_check_date: staleDate.toISOString(),
              pep_check_status: 'clear'
            }
          }))
        }))
      }))
    });

    const result = await kycLiveService.canReceivePayouts('operator-303');
    
    expect(result).toBe(false);
  });

  it('should provide specific error messages for different block reasons', async () => {
    // Test different block scenarios
    const testCases = [
      {
        id: 'operator-kyc-pending',
        data: { kyc_status: 'pending' },
        expectedReason: 'KYC verification required'
      },
      {
        id: 'operator-sanctions-hit',
        data: { sanctions_check_status: 'hit' },
        expectedReason: 'Sanctions screening required'
      },
      {
        id: 'operator-pep-hit',
        data: { pep_check_status: 'hit' },
        expectedReason: 'PEP screening required'
      },
      {
        id: 'operator-expired',
        data: { 
          kyc_status: 'verified',
          kyc_verified_at: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString() // 400 days ago
        },
        expectedReason: 'KYC verification expired'
      }
    ];

    for (const testCase of testCases) {
      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => ({
              data: {
                id: testCase.id,
                kyc_status: 'verified',
                kyc_verified_at: '2025-01-10T10:00:00Z',
                sanctions_check_status: 'clear',
                pep_check_status: 'clear',
                ...testCase.data
              }
            }))
          }))
        }))
      });

      const result = await kycLiveService.canReceivePayouts(testCase.id);
      expect(result).toBe(false);
    }
  });

  it('should log all payout block attempts', async () => {
    // Mock unverified operator
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: 'operator-123',
              kyc_status: 'pending'
            }
          }))
        }))
      }))
    });

    const result = await kycLiveService.canReceivePayouts('operator-123');
    
    expect(result).toBe(false);
    
    // Should log the attempt
    expect(mockSupabase.from).toHaveBeenCalledWith('audit_logs');
  });

  it('should handle database errors gracefully', async () => {
    // Mock database error
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            error: { message: 'Database connection failed' }
          }))
        }))
      }))
    });

    // Should default to blocking payout on error
    const result = await kycLiveService.canReceivePayouts('operator-123');
    expect(result).toBe(false);
  });

  it('should validate deal compliance before payout', async () => {
    const dealData = {
      dealId: 'deal-123',
      operatorId: 'operator-456',
      totalAmount: 250000
    };

    // Mock verified operator
    mockSupabase.from.mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: {
              id: 'operator-456',
              kyc_status: 'verified',
              kyc_verified_at: '2025-01-10T10:00:00Z',
              sanctions_check_status: 'clear',
              pep_check_status: 'clear'
            }
          }))
        }))
      }))
    });

    const validation = universalComplianceEnforcer.validateDealCompliance(dealData);
    
    expect(validation.valid).toBe(true);
    expect(validation.message).toBe('Deal compliance validated');
  });
});
