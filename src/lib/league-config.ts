// Performance Programme Configuration - Tunable Levers for Structural Edge
// Adjust these without code changes to optimize performance

export const LeagueConfig = {
  // Speed thresholds that create the monopoly
  thresholds: {
    fastQuoteMinutes: 5,           // Quote must be submitted within 5 minutes
    savedSearchResponseMinutes: 10, // Saved search response within 10 minutes
    onTimeGraceMinutes: 15,        // Grace period for "on-time" completion
    qualityRfqChecks: true,        // RFQ must pass basic quality checks
    disputeFreeWindow: 48,         // Hours after completion to verify no disputes
  },
  
  // Merit Point values that drive behavior (role-specific)
  points: {
    broker: {
      rfq_posted_quality: 5,       // Quality RFQ that passes checks
      saved_search_hit_response: 10, // Quick response to saved search
      quote_accepted: 25,          // Quote gets accepted
      deal_completed_on_time: 40,  // Deal completed on time with no dispute
    },
    operator: {
      quote_submitted_fast: 15,    // Fast quote submission
      quote_accepted: 25,          // Quote gets accepted
      flight_completed_on_time: 40, // Flight completed on schedule
      fallthrough_recovered: 30,   // Recover fallthrough using re-market
    },
    talent: {
      assignment_completed_on_time: 25, // Complete assignments on time
      counterpart_positive_review: 10,  // Receive verified positive review
      credentials_up_to_date: 10,       // Keep credentials current
    },
    shared: {
      kyc_completed: 10,           // Complete KYC verification
      dispute_free_deal: 20,       // Deal closed without disputes
      community_helpful: 10,       // Admin-awarded for real help
    }
  },
  
  // Command Rating movement controls
  promotions: { 
    topPct: 0.20,                  // Top 20% promoted
    bottomPct: 0.20,               // Bottom 20% demoted
    minLeagueSize: 10,             // Minimum users per league for movement
  },
  
  // Perks that create lock-in
  perks: {
    earlyAccessMultiplier: 1.2,    // 20% more RFQs shown to top leagues
    rankingBias: 0.05,             // Max 5% ordering lift for performance
    supportPriority: true,         // Faster SLA for top leagues
    depositRequiredForPerks: true, // Perks only after deposit
    onPlatformSettlementOnly: true, // Perks only for on-platform deals
  },
  
  // Compliance gates that protect margins
  complianceGates: {
    depositRequiredForPerks: true,     // Must have deposit to access perks
    expiredCredentialsZeroScore: true, // No points if credentials expired
    kycRequiredForPoints: true,        // Must complete KYC to earn points
    complianceCleanRequired: true,     // Must have clean compliance status
    onPlatformOnly: true,             // Only on-platform deals count
  },
  
  // Caps (anti-farming)
  caps: {
    broker: { 
      rfq_posted_quality_weekly: 10, 
      saved_search_hit_response_daily: 10 
    },
    operator: { 
      quote_submitted_fast_weekly: 20 
    },
    adminAwardsPerSeason: 2,
  },
  
  // Streak multiplier logic
  multiplier(streakDays: number): number {
    if (streakDays >= 14) return 2.0;
    if (streakDays >= 7)  return 1.5;
    if (streakDays >= 3)  return 1.2;
    return 1.0;
  },
  
  // Performance targets (Week 4 goals)
  targets: {
    timeToFirstQuote: 10,          // ≤ 10 minutes median
    quoteResponseRate: 0.60,       // ≥ 60% per RFQ
    dealConversion: 0.18,          // ≥ 18%
    disputeRate: 0.01,             // ≤ 1% of closed deals
    onPlatformSettlement: 0.95,    // ≥ 95% of wins
    leakageBlocked: 0.90,          // > 90% caught pre-contact
  },
  
  // Command Rating thresholds (Merit Points needed to stay in rating)
  leagueThresholds: {
    bronze: 0,      // Starting rating
    silver: 100,    // 100 Merit Points to reach silver
    gold: 250,      // 250 Merit Points to reach gold
    platinum: 500,  // 500 Merit Points to reach platinum
    emerald: 750,   // 750 Merit Points to reach emerald
    diamond: 1000,  // 1000 Merit Points to reach diamond
  },
  
  // Weekly season settings
  season: {
    startDay: 1,                   // Monday (1) start
    timezone: 'UTC',              // UTC timezone
    resetPoints: true,             // Reset points each week
    maintainLeagues: true,         // Keep league assignments
    promotionDay: 0,               // Sunday (0) promotions
  }
};

// Helper functions for configuration
export function getThreshold(threshold: keyof typeof LeagueConfig.thresholds): number | boolean {
  return LeagueConfig.thresholds[threshold];
}

export function getPoints(role: keyof typeof LeagueConfig.points, eventType: string): number {
  const rolePoints = LeagueConfig.points[role] as any;
  return rolePoints?.[eventType] || LeagueConfig.points.shared[eventType as keyof typeof LeagueConfig.points.shared] || 0;
}

export function getTarget(target: keyof typeof LeagueConfig.targets): number {
  return LeagueConfig.targets[target];
}

export function isPerkEnabled(perk: keyof typeof LeagueConfig.perks): boolean {
  return LeagueConfig.perks[perk] as boolean;
}

export function isComplianceGateEnabled(gate: keyof typeof LeagueConfig.complianceGates): boolean {
  return LeagueConfig.complianceGates[gate] as boolean;
}

// Configuration update functions (for admin use)
export function updateThreshold(threshold: keyof typeof LeagueConfig.thresholds, value: number | boolean): void {
  (LeagueConfig.thresholds as any)[threshold] = value;
}

export function updatePoints(role: keyof typeof LeagueConfig.points, eventType: string, points: number): void {
  (LeagueConfig.points[role] as any)[eventType] = points;
}

export function updateTarget(target: keyof typeof LeagueConfig.targets, value: number): void {
  LeagueConfig.targets[target] = value;
}

export function togglePerk(perk: keyof typeof LeagueConfig.perks, enabled: boolean): void {
  (LeagueConfig.perks as any)[perk] = enabled;
}

export function toggleComplianceGate(gate: keyof typeof LeagueConfig.complianceGates, enabled: boolean): void {
  (LeagueConfig.complianceGates as any)[gate] = enabled;
}

// Performance monitoring
export interface PerformanceMetrics {
  timeToFirstQuote: number;        // Median minutes to first quote
  quoteResponseRate: number;       // Percentage of RFQs that get quotes
  dealConversion: number;          // Percentage of quotes that convert
  disputeRate: number;             // Percentage of deals with disputes
  onPlatformSettlement: number;    // Percentage of wins settled on-platform
  leakageBlocked: number;          // Percentage of leakage attempts blocked
  activeUsers: number;             // Number of active users this week
  totalPointsAwarded: number;      // Total points awarded this week
  leagueDistribution: Record<string, number>; // Users per league
}

export const LEAGUE_RULES = {
  thresholds: {
    fastQuoteMinutes: 5,
    savedSearchResponseMinutes: 2,
    onTimeGraceMinutes: 15,
    qualityRfqChecks: 3,
    disputeFreeWindow: 24
  },
  targets: {
    timeToFirstQuote: 10,
    quoteResponseRate: 0.6,
    dealConversion: 0.18,
    disputeRate: 0.01,
    onPlatformSettlement: 0.95,
    leakageBlocked: 0.9
  },
  perks: {
    earlyAccessMultiplier: 1.2,
    rankingBias: 0.1,
    supportPriority: 2,
    depositRequiredForPerks: true,
    onPlatformSettlementOnly: true
  },
  complianceGates: {
    depositRequiredForPerks: true,
    expiredCredentialsZeroScore: true,
    kycRequiredForPoints: true,
    complianceCleanRequired: true,
    onPlatformOnly: true
  },
  points: {
    broker: {
      rfq_posted_quality: 5,
      saved_search_hit_response: 10,
      quote_accepted: 25,
      deal_completed_on_time: 40,
    },
    operator: {
      quote_submitted_fast: 15,
      quote_accepted: 25,
      flight_completed_on_time: 40,
      fallthrough_recovered: 30,
    }
  }
};

export function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  const targets = LEAGUE_RULES.targets;
  
  const timeScore = Math.max(0, (targets.timeToFirstQuote - metrics.timeToFirstQuote) / targets.timeToFirstQuote);
  const responseScore = Math.min(1, metrics.quoteResponseRate / targets.quoteResponseRate);
  const conversionScore = Math.min(1, metrics.dealConversion / targets.dealConversion);
  const disputeScore = Math.max(0, (targets.disputeRate - metrics.disputeRate) / targets.disputeRate);
  const settlementScore = Math.min(1, metrics.onPlatformSettlement / targets.onPlatformSettlement);
  const leakageScore = Math.min(1, metrics.leakageBlocked / targets.leakageBlocked);
  
  return (timeScore + responseScore + conversionScore + disputeScore + settlementScore + leakageScore) / 6;
}

// League advantage calculations
export function calculateLeagueAdvantage(league: string, userPoints: number): {
  earlyAccessBonus: number;
  rankingBias: number;
  supportPriority: boolean;
} {
  const leagueOrder = ['bronze', 'silver', 'gold', 'platinum', 'emerald', 'diamond'];
  const leagueIndex = leagueOrder.indexOf(league);
  const maxIndex = leagueOrder.length - 1;
  
  // Early access multiplier based on league
  const earlyAccessBonus = Math.min(
    LeagueConfig.perks.earlyAccessMultiplier,
    1 + (leagueIndex / maxIndex) * (LeagueConfig.perks.earlyAccessMultiplier - 1)
  );
  
  // Ranking bias based on league
  const rankingBias = Math.min(
    LeagueConfig.perks.rankingBias,
    (leagueIndex / maxIndex) * LeagueConfig.perks.rankingBias
  );
  
  // Support priority for top leagues
  const supportPriority = leagueIndex >= 3 && LeagueConfig.perks.supportPriority;
  
  return {
    earlyAccessBonus,
    rankingBias,
    supportPriority
  };
}

// Daily Briefing definitions
export const DAILY_QUESTS = [
  { code: "fast_quote", label: "Submit a quote in ≤5 minutes", pts: 10, role: "operator" },
  { code: "saved_alert", label: "Act on a saved-search alert in ≤10 minutes", pts: 10, role: "broker" },
  { code: "ontime_close", label: "Complete a deal on time", pts: 10, role: "shared" },
  { code: "rfq_quality", label: "Post a quality RFQ", pts: 10, role: "broker" },
  { code: "credentials_check", label: "Keep credentials up to date", pts: 10, role: "talent" },
];

export const WEEKLY_MISSIONS = [
  { code: "fast_quotes_3", label: "Submit 3 fast quotes", target: 3, pts: 25, role: "operator" },
  { code: "ontime_completion_1", label: "Complete 1 deal on time", target: 1, pts: 25, role: "shared" },
  { code: "re_market_save_1", label: "Recover 1 fallthrough", target: 1, pts: 25, role: "operator" },
  { code: "quality_rfqs_5", label: "Post 5 quality RFQs", target: 5, pts: 25, role: "broker" },
  { code: "positive_reviews_2", label: "Get 2 positive reviews", target: 2, pts: 25, role: "talent" },
];
