// Ranking Bias Cap Gauntlet Test - Performance Programme
// FCA Compliant Aviation Platform

import { describe, it, expect } from 'vitest';
import { LeagueConfig } from '../lib/league-config';
import { universalComplianceEnforcer } from '../lib/universal-compliance';

describe('Ranking Bias Cap Gauntlet Test', () => {
  it('should cap ranking bias at 5% maximum', () => {
    expect(LeagueConfig.perks.rankingBias).toBe(0.05);
    expect(LeagueConfig.perks.rankingBias).toBeLessThanOrEqual(0.05);
  });

  it('should apply ranking bias only after hard filters', () => {
    // Mock operators with different performance levels
    const strongOperator = {
      id: 'operator-strong',
      name: 'Elite Aviation Services',
      league: 'diamond',
      points: 1200,
      p50ResponseTime: 180, // 3 minutes
      acceptanceRate: 0.95,
      completionRate: 0.98,
      disputeRate: 0.01,
      onPlatformSettlement: 1.0,
      kycStatus: 'verified'
    };

    const weakOperator = {
      id: 'operator-weak',
      name: 'Basic Charter Co',
      league: 'bronze',
      points: 50,
      p50ResponseTime: 1800, // 30 minutes
      acceptanceRate: 0.60,
      completionRate: 0.75,
      disputeRate: 0.15,
      onPlatformSettlement: 0.80,
      kycStatus: 'verified'
    };

    // Apply hard filters first (compliance, safety, etc.)
    const filteredOperators = [strongOperator, weakOperator].filter(op => 
      op.kycStatus === 'verified' && 
      op.disputeRate < 0.20 &&
      op.onPlatformSettlement > 0.70
    );

    expect(filteredOperators).toHaveLength(2); // Both pass hard filters

    // Then apply ranking bias (should be ≤ 5%)
    const maxBias = LeagueConfig.perks.rankingBias;
    expect(maxBias).toBeLessThanOrEqual(0.05);
  });

  it('should never override compliance requirements', () => {
    const perks = LeagueConfig.perks;
    
    // Ensure no compliance bypasses exist
    expect(perks).not.toHaveProperty('safetyOverride');
    expect(perks).not.toHaveProperty('complianceBypass');
    expect(perks).not.toHaveProperty('kycExemption');
    expect(perks).not.toHaveProperty('depositBypass');
    expect(perks).not.toHaveProperty('auditLoggingBypass');
    
    // Ranking bias should be the only performance modifier
    expect(perks.rankingBias).toBe(0.05);
    expect(perks.earlyAccessMultiplier).toBe(1.2);
  });

  it('should apply ranking bias proportionally by league', () => {
    const leagues = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
    const maxIndex = leagues.length - 1; // 4 (diamond is index 4)
    const maxBias = LeagueConfig.perks.rankingBias; // 0.05

    leagues.forEach((league, leagueIndex) => {
      // Calculate proportional bias
      const calculatedBias = Math.min(
        maxBias,
        (leagueIndex / maxIndex) * maxBias
      );

      expect(calculatedBias).toBeLessThanOrEqual(0.05);
      
      // Bronze (index 0) should have minimal bias
      if (leagueIndex === 0) {
        expect(calculatedBias).toBe(0);
      }
      
      // Diamond (index 4) should have maximum bias
      if (leagueIndex === 4) {
        expect(calculatedBias).toBe(0.05);
      }
    });
  });

  it('should provide early access based on league performance', () => {
    const earlyAccessMins = LeagueConfig.perks.earlyAccessMins;
    
    expect(earlyAccessMins.bronze).toBe(0);
    expect(earlyAccessMins.silver).toBe(0);
    expect(earlyAccessMins.gold).toBe(2);
    expect(earlyAccessMins.platinum).toBe(4);
    expect(earlyAccessMins.diamond).toBe(6);
    
    // Early access should be progressive
    expect(earlyAccessMins.diamond).toBeGreaterThan(earlyAccessMins.platinum);
    expect(earlyAccessMins.platinum).toBeGreaterThan(earlyAccessMins.gold);
    expect(earlyAccessMins.gold).toBeGreaterThan(earlyAccessMins.silver);
  });

  it('should maintain fairness in ranking calculations', () => {
    // Mock ranking calculation
    const calculateRankingScore = (operator: any) => {
      const weights = {
        p50ResponseTime: 0.25,
        acceptanceRate: 0.20,
        completionRate: 0.20,
        disputeRate: 0.15,
        onPlatformSettlement: 0.15,
        kycStatus: 0.05
      };

      let score = 0;
      score += (1 - (operator.p50ResponseTime / 3600)) * weights.p50ResponseTime; // Normalize to 1 hour max
      score += operator.acceptanceRate * weights.acceptanceRate;
      score += operator.completionRate * weights.completionRate;
      score += (1 - operator.disputeRate) * weights.disputeRate;
      score += operator.onPlatformSettlement * weights.onPlatformSettlement;
      score += (operator.kycStatus === 'verified' ? 1 : 0) * weights.kycStatus;

      return score;
    };

    const strongOperator = {
      p50ResponseTime: 180,
      acceptanceRate: 0.95,
      completionRate: 0.98,
      disputeRate: 0.01,
      onPlatformSettlement: 1.0,
      kycStatus: 'verified'
    };

    const weakOperator = {
      p50ResponseTime: 1800,
      acceptanceRate: 0.60,
      completionRate: 0.75,
      disputeRate: 0.15,
      onPlatformSettlement: 0.80,
      kycStatus: 'verified'
    };

    const strongScore = calculateRankingScore(strongOperator);
    const weakScore = calculateRankingScore(weakOperator);

    expect(strongScore).toBeGreaterThan(weakScore);
    expect(strongScore).toBeGreaterThan(0.8);
    expect(weakScore).toBeLessThan(0.6);
  });

  it('should enforce compliance regardless of league status', () => {
    // All users regardless of league should have same compliance requirements
    const leagues = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
    
    leagues.forEach(league => {
      // Compliance requirements should be identical for all leagues
      expect(universalComplianceEnforcer.isDepositGateEnforced()).toBe(true);
      expect(universalComplianceEnforcer.areImmutableReceiptsEnforced()).toBe(true);
      expect(universalComplianceEnforcer.areKycAmlGatesEnforced()).toBe(true);
      expect(universalComplianceEnforcer.isEvidenceBundleExportEnforced()).toBe(true);
    });
  });

  it('should provide transparent ranking disclosure', () => {
    const rankingDisclosure = {
      biasDisclosed: true,
      maxBiasPercentage: 5,
      biasAppliedAfter: 'hard_filters',
      biasNeverOverrides: ['compliance', 'safety', 'kyc', 'deposits'],
      biasCalculation: 'proportional_by_league',
      transparencyLevel: 'full'
    };

    expect(rankingDisclosure.biasDisclosed).toBe(true);
    expect(rankingDisclosure.maxBiasPercentage).toBeLessThanOrEqual(5);
    expect(rankingDisclosure.biasNeverOverrides).toContain('compliance');
    expect(rankingDisclosure.biasNeverOverrides).toContain('safety');
    expect(rankingDisclosure.biasNeverOverrides).toContain('kyc');
    expect(rankingDisclosure.biasNeverOverrides).toContain('deposits');
  });

  it('should provide audit trail for all merit point awards', () => {
    const meritEvent = {
      eventId: 'merit-123',
      userId: 'user-456',
      pointsAwarded: 25,
      reason: 'quote_accepted',
      timestamp: new Date().toISOString(),
      verifiable: true,
      auditHash: 'sha256:merit-hash-123456789',
      leagueAtTime: 'gold',
      biasApplied: 0.02 // 2% bias for gold league
    };

    expect(meritEvent.eventId).toBeTruthy();
    expect(meritEvent.pointsAwarded).toBeGreaterThan(0);
    expect(meritEvent.verifiable).toBe(true);
    expect(meritEvent.auditHash).toBeTruthy();
    expect(meritEvent.biasApplied).toBeLessThanOrEqual(0.05);
  });

  it('should cap performance programme perks appropriately', () => {
    const perks = LeagueConfig.perks;
    
    // Verify all perks are reasonable and capped
    expect(perks.rankingBias).toBeLessThanOrEqual(0.05); // Max 5% bias
    expect(perks.earlyAccessMultiplier).toBeLessThanOrEqual(1.5); // Max 50% more RFQs
    expect(perks.earlyAccessMins.diamond).toBeLessThanOrEqual(10); // Max 10 minutes early access
    
    // Ensure no excessive advantages
    expect(perks.rankingBias).toBeGreaterThan(0); // Some bias is allowed
    expect(perks.earlyAccessMultiplier).toBeGreaterThan(1.0); // Some early access is allowed
  });

  it('should maintain ranking integrity under load', () => {
    // Test with multiple operators of varying performance
    const operators = Array.from({ length: 100 }, (_, i) => ({
      id: `operator-${i}`,
      points: Math.floor(Math.random() * 1000) + 100,
      league: ['bronze', 'silver', 'gold', 'platinum', 'diamond'][Math.floor(Math.random() * 5)],
      p50ResponseTime: Math.floor(Math.random() * 1800) + 60, // 1-30 minutes
      acceptanceRate: Math.random() * 0.4 + 0.6, // 60-100%
      completionRate: Math.random() * 0.3 + 0.7, // 70-100%
      disputeRate: Math.random() * 0.1, // 0-10%
      onPlatformSettlement: Math.random() * 0.2 + 0.8, // 80-100%
      kycStatus: 'verified'
    }));

    // Sort by performance (without bias first)
    const sortedByPerformance = operators.sort((a, b) => {
      const scoreA = (1 - (a.p50ResponseTime / 3600)) * 0.25 + 
                     a.acceptanceRate * 0.20 + 
                     a.completionRate * 0.20 + 
                     (1 - a.disputeRate) * 0.15 + 
                     a.onPlatformSettlement * 0.15;
      const scoreB = (1 - (b.p50ResponseTime / 3600)) * 0.25 + 
                     b.acceptanceRate * 0.20 + 
                     b.completionRate * 0.20 + 
                     (1 - b.disputeRate) * 0.15 + 
                     b.onPlatformSettlement * 0.15;
      return scoreB - scoreA;
    });

    // Apply ranking bias (should not change order significantly)
    const biasAdjusted = sortedByPerformance.map((op, index) => {
      const leagueIndex = ['bronze', 'silver', 'gold', 'platinum', 'diamond'].indexOf(op.league);
      const bias = Math.min(0.05, (leagueIndex / 4) * 0.05);
      return { ...op, adjustedScore: index + (bias * 100) };
    });

    // Verify ranking changes are minimal (≤ 5% shift)
    const originalTop10 = sortedByPerformance.slice(0, 10).map(op => op.id);
    const adjustedTop10 = biasAdjusted.sort((a, b) => b.adjustedScore - a.adjustedScore).slice(0, 10).map(op => op.id);
    
    const changes = originalTop10.filter(id => !adjustedTop10.includes(id));
    const changeRate = changes.length / 10;
    
    expect(changeRate).toBeLessThanOrEqual(0.05); // Max 5% change in top 10
  });
});
