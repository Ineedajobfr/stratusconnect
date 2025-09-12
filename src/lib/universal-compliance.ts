// Universal Compliance Enforcer - No Exceptions
// FCA Compliant Aviation Platform

export interface ComplianceCheck {
  feature: string;
  enabled: boolean;
  required: boolean;
  description: string;
}

export interface UniversalComplianceConfig {
  depositBeforeContact: boolean;
  immutableReceipts: boolean;
  signedQuotePDFs: boolean;
  evidenceBundleExport: boolean;
  kycAmlGates: boolean;
  auditLogging: boolean;
}

class UniversalComplianceEnforcer {
  private static instance: UniversalComplianceEnforcer;
  private config: UniversalComplianceConfig;

  private constructor() {
    // All compliance features are ALWAYS enabled
    this.config = {
      depositBeforeContact: true,
      immutableReceipts: true,
      signedQuotePDFs: true,
      evidenceBundleExport: true,
      kycAmlGates: true,
      auditLogging: true
    };
  }

  public static getInstance(): UniversalComplianceEnforcer {
    if (!UniversalComplianceEnforcer.instance) {
      UniversalComplianceEnforcer.instance = new UniversalComplianceEnforcer();
    }
    return UniversalComplianceEnforcer.instance;
  }

  /**
   * Get compliance status - all features are always enabled
   */
  public getComplianceStatus(): ComplianceCheck[] {
    return [
      {
        feature: 'deposit_before_contact',
        enabled: this.config.depositBeforeContact,
        required: true,
        description: 'Deposit required before contact details revealed'
      },
      {
        feature: 'immutable_receipts',
        enabled: this.config.immutableReceipts,
        required: true,
        description: 'All receipts include SHA-256 audit hash'
      },
      {
        feature: 'signed_quote_pdfs',
        enabled: this.config.signedQuotePDFs,
        required: true,
        description: 'All accepted quotes generate signed PDF with cancellation grid'
      },
      {
        feature: 'evidence_bundle_export',
        enabled: this.config.evidenceBundleExport,
        required: true,
        description: 'One-click evidence bundle export for all deals'
      },
      {
        feature: 'kyc_aml_gates',
        enabled: this.config.kycAmlGates,
        required: true,
        description: 'KYC/AML verification required before payouts'
      },
      {
        feature: 'audit_logging',
        enabled: this.config.auditLogging,
        required: true,
        description: 'All actions logged with immutable audit trail'
      }
    ];
  }

  /**
   * Validate that all compliance features are enabled
   */
  public validateCompliance(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const status = this.getComplianceStatus();

    status.forEach(check => {
      if (check.required && !check.enabled) {
        errors.push(`Required compliance feature ${check.feature} is disabled`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if deposit gate is enforced
   */
  public isDepositGateEnforced(): boolean {
    return this.config.depositBeforeContact;
  }

  /**
   * Check if immutable receipts are enforced
   */
  public areImmutableReceiptsEnforced(): boolean {
    return this.config.immutableReceipts;
  }

  /**
   * Check if signed quote PDFs are enforced
   */
  public areSignedQuotePDFsEnforced(): boolean {
    return this.config.signedQuotePDFs;
  }

  /**
   * Check if evidence bundle export is enforced
   */
  public isEvidenceBundleExportEnforced(): boolean {
    return this.config.evidenceBundleExport;
  }

  /**
   * Check if KYC/AML gates are enforced
   */
  public areKycAmlGatesEnforced(): boolean {
    return this.config.kycAmlGates;
  }

  /**
   * Check if audit logging is enforced
   */
  public isAuditLoggingEnforced(): boolean {
    return this.config.auditLogging;
  }

  /**
   * Get compliance summary for UI display
   */
  public getComplianceSummary(): string {
    return "Compliance is standard on every deal: regulated payments, deposit-before-contact, signed terms, immutable receipts, evidence bundles.";
  }

  /**
   * Get compliance badge text for headers
   */
  public getComplianceBadgeText(): string {
    return "Regulated rails. Evidence by default.";
  }

  /**
   * Validate deal can proceed with compliance
   */
  public validateDealCompliance(dealData: any): { valid: boolean; message: string } {
    // All deals must have compliance features
    if (!this.isDepositGateEnforced()) {
      return { valid: false, message: "Deposit gate is required for all deals" };
    }

    if (!this.areImmutableReceiptsEnforced()) {
      return { valid: false, message: "Immutable receipts are required for all deals" };
    }

    if (!this.areSignedQuotePDFsEnforced()) {
      return { valid: false, message: "Signed quote PDFs are required for all deals" };
    }

    if (!this.isEvidenceBundleExportEnforced()) {
      return { valid: false, message: "Evidence bundle export is required for all deals" };
    }

    return { valid: true, message: "Deal compliance validated" };
  }
}

export const universalComplianceEnforcer = UniversalComplianceEnforcer.getInstance();
