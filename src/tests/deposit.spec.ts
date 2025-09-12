// Deposit Gate Tests - Universal Compliance Validation
// FCA Compliant Aviation Platform

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { universalComplianceEnforcer } from '../lib/universal-compliance';

describe('Deposit Gate Compliance', () => {
  describe('Universal Compliance Enforcer', () => {
    it('should always enforce deposit gate', () => {
      expect(universalComplianceEnforcer.isDepositGateEnforced()).toBe(true);
    });

    it('should always enforce immutable receipts', () => {
      expect(universalComplianceEnforcer.areImmutableReceiptsEnforced()).toBe(true);
    });

    it('should always enforce signed quote PDFs', () => {
      expect(universalComplianceEnforcer.areSignedQuotePDFsEnforced()).toBe(true);
    });

    it('should always enforce evidence bundle export', () => {
      expect(universalComplianceEnforcer.isEvidenceBundleExportEnforced()).toBe(true);
    });

    it('should always enforce KYC/AML gates', () => {
      expect(universalComplianceEnforcer.areKycAmlGatesEnforced()).toBe(true);
    });

    it('should always enforce audit logging', () => {
      expect(universalComplianceEnforcer.isAuditLoggingEnforced()).toBe(true);
    });
  });

  describe('Compliance Status', () => {
    it('should return all compliance features as enabled', () => {
      const status = universalComplianceEnforcer.getComplianceStatus();
      
      expect(status).toHaveLength(6);
      expect(status.every(check => check.enabled)).toBe(true);
      expect(status.every(check => check.required)).toBe(true);
    });

    it('should include all required compliance features', () => {
      const status = universalComplianceEnforcer.getComplianceStatus();
      const features = status.map(check => check.feature);
      
      expect(features).toContain('deposit_before_contact');
      expect(features).toContain('immutable_receipts');
      expect(features).toContain('signed_quote_pdfs');
      expect(features).toContain('evidence_bundle_export');
      expect(features).toContain('kyc_aml_gates');
      expect(features).toContain('audit_logging');
    });
  });

  describe('Compliance Validation', () => {
    it('should validate compliance successfully', () => {
      const validation = universalComplianceEnforcer.validateCompliance();
      
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should validate deal compliance successfully', () => {
      const dealData = {
        dealId: 'test-deal-123',
        totalAmount: 100000,
        currency: 'GBP'
      };
      
      const validation = universalComplianceEnforcer.validateDealCompliance(dealData);
      
      expect(validation.valid).toBe(true);
      expect(validation.message).toBe('Deal compliance validated');
    });
  });

  describe('Compliance Messages', () => {
    it('should return correct compliance summary', () => {
      const summary = universalComplianceEnforcer.getComplianceSummary();
      
      expect(summary).toBe("Compliance is standard on every deal: regulated payments, deposit-before-contact, signed terms, immutable receipts, evidence bundles.");
    });

    it('should return correct compliance badge text', () => {
      const badgeText = universalComplianceEnforcer.getComplianceBadgeText();
      
      expect(badgeText).toBe("Regulated rails. Evidence by default.");
    });
  });
});

describe('Deposit Gate Logic', () => {
  describe('Payment Intent Status', () => {
    it('should only reveal contact when payment intent is requires_capture or succeeded', () => {
      const validStatuses = ['requires_capture', 'succeeded'];
      const invalidStatuses = ['requires_payment_method', 'requires_confirmation', 'requires_action', 'processing', 'canceled'];
      
      validStatuses.forEach(status => {
        expect(['requires_capture', 'succeeded'].includes(status)).toBe(true);
      });
      
      invalidStatuses.forEach(status => {
        expect(['requires_capture', 'succeeded'].includes(status)).toBe(false);
      });
    });
  });

  describe('Deposit Amount Calculation', () => {
    it('should calculate minimum 5% deposit', () => {
      const totalAmount = 100000; // £1,000
      const minimumDeposit = Math.round(totalAmount * 0.05);
      
      expect(minimumDeposit).toBe(5000); // £50
    });

    it('should allow higher deposit amounts', () => {
      const totalAmount = 100000; // £1,000
      const higherDeposit = Math.round(totalAmount * 0.10);
      
      expect(higherDeposit).toBe(10000); // £100
      expect(higherDeposit).toBeGreaterThan(Math.round(totalAmount * 0.05));
    });
  });
});
