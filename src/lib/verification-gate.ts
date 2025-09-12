// Verification Gate System
// Unverified users cannot earn points - verification flips you into Bronze League

export interface VerificationStatus {
  isVerified: boolean;
  verificationLevel: 'unverified' | 'basic' | 'enhanced' | 'premium';
  kycStatus: 'pending' | 'completed' | 'expired' | 'failed';
  credentialsStatus: 'valid' | 'expired' | 'missing' | 'pending';
  complianceStatus: 'clean' | 'warning' | 'suspended' | 'flagged';
  lastVerified: Date | null;
  nextReview: Date | null;
}

export interface VerificationRequirements {
  kycCompleted: boolean;
  credentialsCurrent: boolean;
  complianceClean: boolean;
  identityVerified: boolean;
  backgroundCheckPassed: boolean;
}

// Check if user can earn points (must be verified)
export function canEarnPoints(verificationStatus: VerificationStatus): boolean {
  return (
    verificationStatus.isVerified &&
    verificationStatus.kycStatus === 'completed' &&
    verificationStatus.credentialsStatus === 'valid' &&
    verificationStatus.complianceStatus === 'clean'
  );
}

// Check if user can participate in leagues
export function canParticipateInLeagues(verificationStatus: VerificationStatus): boolean {
  return canEarnPoints(verificationStatus);
}

// Get verification requirements for user
export function getVerificationRequirements(verificationStatus: VerificationStatus): VerificationRequirements {
  return {
    kycCompleted: verificationStatus.kycStatus === 'completed',
    credentialsCurrent: verificationStatus.credentialsStatus === 'valid',
    complianceClean: verificationStatus.complianceStatus === 'clean',
    identityVerified: verificationStatus.verificationLevel !== 'unverified',
    backgroundCheckPassed: verificationStatus.verificationLevel === 'enhanced' || verificationStatus.verificationLevel === 'premium'
  };
}

// Get missing requirements for verification
export function getMissingRequirements(verificationStatus: VerificationStatus): string[] {
  const requirements = getVerificationRequirements(verificationStatus);
  const missing: string[] = [];

  if (!requirements.kycCompleted) {
    missing.push('Complete KYC verification');
  }
  if (!requirements.credentialsCurrent) {
    missing.push('Update expired credentials');
  }
  if (!requirements.complianceClean) {
    missing.push('Resolve compliance issues');
  }
  if (!requirements.identityVerified) {
    missing.push('Complete identity verification');
  }
  if (!requirements.backgroundCheckPassed) {
    missing.push('Complete background check');
  }

  return missing;
}

// Verification gate for XP events
export function verifyEligibilityForXpEvent(
  verificationStatus: VerificationStatus,
  eventType: string
): { eligible: boolean; reason?: string } {
  if (!canEarnPoints(verificationStatus)) {
    return {
      eligible: false,
      reason: 'User must be verified with clean compliance status to earn points'
    };
  }

  // Additional checks for specific event types
  switch (eventType) {
    case 'credentials_valid':
      if (verificationStatus.credentialsStatus !== 'valid') {
        return { eligible: false, reason: 'Credentials must be valid' };
      }
      break;
    
    case 'compliance_status_clean':
      if (verificationStatus.complianceStatus !== 'clean') {
        return { eligible: false, reason: 'Compliance status must be clean' };
      }
      break;
    
    case 'kyc_completed':
      if (verificationStatus.kycStatus !== 'completed') {
        return { eligible: false, reason: 'KYC must be completed' };
      }
      break;
  }

  return { eligible: true };
}

// Demo verification status for testing
export const DEMO_VERIFICATION_STATUS: VerificationStatus = {
  isVerified: true,
  verificationLevel: 'enhanced',
  kycStatus: 'completed',
  credentialsStatus: 'valid',
  complianceStatus: 'clean',
  lastVerified: new Date('2024-11-15'),
  nextReview: new Date('2025-02-15')
};

export const DEMO_UNVERIFIED_STATUS: VerificationStatus = {
  isVerified: false,
  verificationLevel: 'unverified',
  kycStatus: 'pending',
  credentialsStatus: 'missing',
  complianceStatus: 'warning',
  lastVerified: null,
  nextReview: null
};
