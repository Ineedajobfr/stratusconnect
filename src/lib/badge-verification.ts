// Badge Verification Service and Permissions Registry
// FCA Compliant Aviation Platform

export interface BadgeVerification {
  operatorId: string;
  operatorName: string;
  badgeType: 'ARGUS' | 'WYVERN';
  badgeLevel: string;
  status: 'verified' | 'pending' | 'self_reported' | 'expired';
  verifiedBy: string;
  verifiedAt: string;
  expiresAt: string;
  source: string;
  evidence: string;
  auditHash: string;
}

export interface CarbonMethodology {
  id: string;
  name: string;
  description: string;
  source: string;
  confidence: 'high' | 'medium' | 'low';
  lastUpdated: string;
}

export class BadgeVerificationService {
  private static badgeRegistry: Map<string, BadgeVerification> = new Map();
  private static carbonMethodologies: CarbonMethodology[] = [
    {
      id: 'icao_carbon_calculator',
      name: 'ICAO Carbon Calculator',
      description: 'International Civil Aviation Organization standard methodology',
      source: 'https://www.icao.int/environmental-protection/CarbonOffset/Pages/default.aspx',
      confidence: 'high',
      lastUpdated: '2024-01-01'
    },
    {
      id: 'easa_emissions_tool',
      name: 'EASA Emissions Tool',
      description: 'European Aviation Safety Agency emissions calculation',
      source: 'https://www.easa.europa.eu/environmental-protection/emissions',
      confidence: 'high',
      lastUpdated: '2024-01-01'
    },
    {
      id: 'internal_estimation',
      name: 'Internal Estimation',
      description: 'Platform estimation based on aircraft type and distance',
      source: 'Internal calculation',
      confidence: 'low',
      lastUpdated: '2024-01-01'
    }
  ];

  static verifyBadge(
    operatorId: string,
    operatorName: string,
    badgeType: 'ARGUS' | 'WYVERN',
    badgeLevel: string,
    evidence: string
  ): BadgeVerification {
    const verificationId = `${operatorId}_${badgeType}_${badgeLevel}`;
    
    // In production, this would call external APIs
    const isVerified = this.checkExternalVerification(badgeType, badgeLevel, evidence);
    
    const verification: BadgeVerification = {
      operatorId,
      operatorName,
      badgeType,
      badgeLevel,
      status: isVerified ? 'verified' : 'pending',
      verifiedBy: isVerified ? 'external_api' : 'manual_review',
      verifiedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      source: this.getBadgeSource(badgeType, badgeLevel),
      evidence,
      auditHash: `badge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    this.badgeRegistry.set(verificationId, verification);
    return verification;
  }

  static getBadgeStatus(operatorId: string, badgeType: 'ARGUS' | 'WYVERN'): BadgeVerification | null {
    const entries = Array.from(this.badgeRegistry.values())
      .filter(badge => badge.operatorId === operatorId && badge.badgeType === badgeType);
    
    if (entries.length === 0) return null;
    
    // Return the most recent verification
    return entries.sort((a, b) => new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime())[0];
  }

  static getAllBadges(operatorId: string): BadgeVerification[] {
    return Array.from(this.badgeRegistry.values())
      .filter(badge => badge.operatorId === operatorId);
  }

  static checkBadgeExpiry(): BadgeVerification[] {
    const now = new Date();
    const expiredBadges: BadgeVerification[] = [];

    this.badgeRegistry.forEach((badge, key) => {
      if (new Date(badge.expiresAt) < now) {
        badge.status = 'expired';
        expiredBadges.push(badge);
      }
    });

    return expiredBadges;
  }

  static getCarbonMethodology(methodologyId: string): CarbonMethodology | null {
    return this.carbonMethodologies.find(m => m.id === methodologyId) || null;
  }

  static getAllCarbonMethodologies(): CarbonMethodology[] {
    return this.carbonMethodologies;
  }

  static getDefaultCarbonMethodology(): CarbonMethodology {
    return this.carbonMethodologies[0]; // ICAO Carbon Calculator
  }

  private static checkExternalVerification(
    badgeType: 'ARGUS' | 'WYVERN',
    badgeLevel: string,
    evidence: string
  ): boolean {
    // In production, this would call external APIs
    // For demo purposes, simulate verification based on evidence quality
    if (badgeType === 'ARGUS') {
      return badgeLevel === 'Gold' || badgeLevel === 'Platinum';
    }
    if (badgeType === 'WYVERN') {
      return badgeLevel === 'Elite' || badgeLevel === 'Certified';
    }
    return false;
  }

  private static getBadgeSource(badgeType: 'ARGUS' | 'WYVERN', badgeLevel: string): string {
    if (badgeType === 'ARGUS') {
      return 'https://www.argus.aero/operator-registry';
    }
    if (badgeType === 'WYVERN') {
      return 'https://www.wyvernltd.com/wyvern-broker';
    }
    return 'Unknown source';
  }

  static generateBadgeAuditLog(verification: BadgeVerification): any {
    return {
      event: 'badge_verified',
      operatorId: verification.operatorId,
      operatorName: verification.operatorName,
      badgeType: verification.badgeType,
      badgeLevel: verification.badgeLevel,
      status: verification.status,
      verifiedBy: verification.verifiedBy,
      verifiedAt: verification.verifiedAt,
      expiresAt: verification.expiresAt,
      source: verification.source,
      auditHash: verification.auditHash,
      timestamp: new Date().toISOString()
    };
  }
}
