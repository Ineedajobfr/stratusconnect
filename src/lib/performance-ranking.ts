// Performance-Weighted Ranking System
// FCA Compliant Aviation Platform

export interface PerformanceMetrics {
  userId: string;
  userType: 'broker' | 'operator' | 'pilot' | 'crew';
  p50ResponseTime: number; // minutes
  acceptanceRate: number; // percentage
  completionRate: number; // percentage
  disputeRate: number; // percentage
  onPlatformSettlement: number; // percentage
  kycStatus: 'verified' | 'pending' | 'rejected';
  lastUpdated: string;
}

export interface RankingScore {
  userId: string;
  userType: string;
  totalScore: number;
  rank: number;
  tier: 'pro' | 'standard' | 'restricted';
  metrics: PerformanceMetrics;
  benefits: string[];
  penalties: string[];
}

export interface RankingConfig {
  weights: {
    p50ResponseTime: number;
    acceptanceRate: number;
    completionRate: number;
    disputeRate: number;
    onPlatformSettlement: number;
    kycStatus: number;
  };
  thresholds: {
    pro: number;
    standard: number;
    restricted: number;
  };
  benefits: {
    pro: string[];
    standard: string[];
    restricted: string[];
  };
  penalties: {
    pro: string[];
    standard: string[];
    restricted: string[];
  };
}

class PerformanceRanking {
  private config: RankingConfig = {
    weights: {
      p50ResponseTime: 0.25, // 25% - response speed matters
      acceptanceRate: 0.20,   // 20% - reliability matters
      completionRate: 0.20,   // 20% - follow-through matters
      disputeRate: 0.15,      // 15% - quality matters
      onPlatformSettlement: 0.15, // 15% - platform loyalty matters
      kycStatus: 0.05         // 5% - compliance matters
    },
    thresholds: {
      pro: 85,        // 85+ = Pro tier
      standard: 60,   // 60-84 = Standard tier
      restricted: 0   // 0-59 = Restricted tier
    },
    benefits: {
      pro: [
        'Early access to high-value RFQs',
        'Priority support response',
        'Reduced platform fees (5% instead of 7%)',
        'Advanced analytics dashboard',
        'Direct line to account manager'
      ],
      standard: [
        'Standard RFQ access',
        'Normal support response',
        'Standard platform fees (7%)',
        'Basic analytics'
      ],
      restricted: [
        'Limited RFQ access',
        'Delayed support response',
        'Standard platform fees (7%)',
        'Basic analytics only'
      ]
    },
    penalties: {
      pro: [],
      standard: [],
      restricted: [
        'Late response warnings',
        'Quality improvement plan required',
        'Monthly performance review'
      ]
    }
  };

  /**
   * Calculate ranking score for a user
   */
  calculateScore(metrics: PerformanceMetrics): RankingScore {
    const scores = {
      p50ResponseTime: this.calculateResponseTimeScore(metrics.p50ResponseTime),
      acceptanceRate: this.calculateAcceptanceRateScore(metrics.acceptanceRate),
      completionRate: this.calculateCompletionRateScore(metrics.completionRate),
      disputeRate: this.calculateDisputeRateScore(metrics.disputeRate),
      onPlatformSettlement: this.calculateOnPlatformScore(metrics.onPlatformSettlement),
      kycStatus: this.calculateKYCScore(metrics.kycStatus)
    };

    const totalScore = Object.entries(scores).reduce((sum, [key, score]) => {
      return sum + (score * this.config.weights[key as keyof typeof this.config.weights]);
    }, 0);

    const tier = this.determineTier(totalScore);
    const rank = this.calculateRank(totalScore);

    return {
      userId: metrics.userId,
      userType: metrics.userType,
      totalScore: Math.round(totalScore),
      rank,
      tier,
      metrics,
      benefits: this.config.benefits[tier],
      penalties: this.config.penalties[tier]
    };
  }

  /**
   * Calculate response time score (0-100)
   * Lower response time = higher score
   */
  private calculateResponseTimeScore(responseTime: number): number {
    if (responseTime <= 5) return 100;      // 5 min or less = perfect
    if (responseTime <= 15) return 90;      // 15 min or less = excellent
    if (responseTime <= 30) return 75;      // 30 min or less = good
    if (responseTime <= 60) return 50;      // 1 hour or less = fair
    if (responseTime <= 120) return 25;     // 2 hours or less = poor
    return 0;                               // More than 2 hours = terrible
  }

  /**
   * Calculate acceptance rate score (0-100)
   * Higher acceptance rate = higher score
   */
  private calculateAcceptanceRateScore(acceptanceRate: number): number {
    if (acceptanceRate >= 90) return 100;   // 90%+ = perfect
    if (acceptanceRate >= 80) return 90;    // 80%+ = excellent
    if (acceptanceRate >= 70) return 75;    // 70%+ = good
    if (acceptanceRate >= 60) return 50;    // 60%+ = fair
    if (acceptanceRate >= 50) return 25;    // 50%+ = poor
    return 0;                               // Less than 50% = terrible
  }

  /**
   * Calculate completion rate score (0-100)
   * Higher completion rate = higher score
   */
  private calculateCompletionRateScore(completionRate: number): number {
    if (completionRate >= 95) return 100;   // 95%+ = perfect
    if (completionRate >= 90) return 90;    // 90%+ = excellent
    if (completionRate >= 85) return 75;    // 85%+ = good
    if (completionRate >= 80) return 50;    // 80%+ = fair
    if (completionRate >= 70) return 25;    // 70%+ = poor
    return 0;                               // Less than 70% = terrible
  }

  /**
   * Calculate dispute rate score (0-100)
   * Lower dispute rate = higher score
   */
  private calculateDisputeRateScore(disputeRate: number): number {
    if (disputeRate <= 1) return 100;       // 1% or less = perfect
    if (disputeRate <= 2) return 90;        // 2% or less = excellent
    if (disputeRate <= 5) return 75;        // 5% or less = good
    if (disputeRate <= 10) return 50;       // 10% or less = fair
    if (disputeRate <= 20) return 25;       // 20% or less = poor
    return 0;                               // More than 20% = terrible
  }

  /**
   * Calculate on-platform settlement score (0-100)
   * Higher on-platform settlement = higher score
   */
  private calculateOnPlatformScore(onPlatformSettlement: number): number {
    if (onPlatformSettlement >= 95) return 100; // 95%+ = perfect
    if (onPlatformSettlement >= 90) return 90;  // 90%+ = excellent
    if (onPlatformSettlement >= 80) return 75;  // 80%+ = good
    if (onPlatformSettlement >= 70) return 50;  // 70%+ = fair
    if (onPlatformSettlement >= 60) return 25;  // 60%+ = poor
    return 0;                                   // Less than 60% = terrible
  }

  /**
   * Calculate KYC status score (0-100)
   */
  private calculateKYCScore(kycStatus: string): number {
    switch (kycStatus) {
      case 'verified': return 100;
      case 'pending': return 50;
      case 'rejected': return 0;
      default: return 0;
    }
  }

  /**
   * Determine tier based on total score
   */
  private determineTier(totalScore: number): 'pro' | 'standard' | 'restricted' {
    if (totalScore >= this.config.thresholds.pro) return 'pro';
    if (totalScore >= this.config.thresholds.standard) return 'standard';
    return 'restricted';
  }

  /**
   * Calculate rank (1-1000, lower is better)
   */
  private calculateRank(totalScore: number): number {
    // Simple ranking based on score
    // In production, this would be calculated against all users
    if (totalScore >= 95) return Math.floor(Math.random() * 10) + 1;      // Top 10
    if (totalScore >= 90) return Math.floor(Math.random() * 20) + 11;     // Top 30
    if (totalScore >= 80) return Math.floor(Math.random() * 50) + 31;     // Top 80
    if (totalScore >= 70) return Math.floor(Math.random() * 100) + 81;    // Top 180
    if (totalScore >= 60) return Math.floor(Math.random() * 200) + 181;   // Top 380
    return Math.floor(Math.random() * 620) + 381;                         // Rest
  }

  /**
   * Get ranking for multiple users
   */
  getRankings(metricsList: PerformanceMetrics[]): RankingScore[] {
    const rankings = metricsList.map(metrics => this.calculateScore(metrics));
    
    // Sort by total score (descending)
    rankings.sort((a, b) => b.totalScore - a.totalScore);
    
    // Update ranks based on sorted order
    rankings.forEach((ranking, index) => {
      ranking.rank = index + 1;
    });
    
    return rankings;
  }

  /**
   * Get Pro tier users (for early access)
   */
  getProTierUsers(rankings: RankingScore[]): RankingScore[] {
    return rankings.filter(ranking => ranking.tier === 'pro');
  }

  /**
   * Get users requiring improvement
   */
  getUsersRequiringImprovement(rankings: RankingScore[]): RankingScore[] {
    return rankings.filter(ranking => ranking.tier === 'restricted');
  }

  /**
   * Calculate platform impact score
   */
  calculatePlatformImpact(rankings: RankingScore[]): {
    totalUsers: number;
    proUsers: number;
    standardUsers: number;
    restrictedUsers: number;
    averageScore: number;
    platformLoyalty: number;
  } {
    const totalUsers = rankings.length;
    const proUsers = rankings.filter(r => r.tier === 'pro').length;
    const standardUsers = rankings.filter(r => r.tier === 'standard').length;
    const restrictedUsers = rankings.filter(r => r.tier === 'restricted').length;
    const averageScore = rankings.reduce((sum, r) => sum + r.totalScore, 0) / totalUsers;
    const platformLoyalty = rankings.reduce((sum, r) => sum + r.metrics.onPlatformSettlement, 0) / totalUsers;

    return {
      totalUsers,
      proUsers,
      standardUsers,
      restrictedUsers,
      averageScore: Math.round(averageScore),
      platformLoyalty: Math.round(platformLoyalty)
    };
  }

  /**
   * Generate performance report
   */
  generatePerformanceReport(rankings: RankingScore[]): string {
    const impact = this.calculatePlatformImpact(rankings);
    
    let report = 'PERFORMANCE RANKING REPORT\n';
    report += '==========================\n\n';
    
    report += `Total Users: ${impact.totalUsers}\n`;
    report += `Pro Tier: ${impact.proUsers} (${Math.round((impact.proUsers / impact.totalUsers) * 100)}%)\n`;
    report += `Standard Tier: ${impact.standardUsers} (${Math.round((impact.standardUsers / impact.totalUsers) * 100)}%)\n`;
    report += `Restricted Tier: ${impact.restrictedUsers} (${Math.round((impact.restrictedUsers / impact.totalUsers) * 100)}%)\n\n`;
    
    report += `Average Score: ${impact.averageScore}/100\n`;
    report += `Platform Loyalty: ${impact.platformLoyalty}%\n\n`;
    
    report += 'TOP PERFORMERS:\n';
    rankings.slice(0, 5).forEach((ranking, index) => {
      report += `${index + 1}. ${ranking.userId} (${ranking.userType}) - Score: ${ranking.totalScore}\n`;
    });
    
    report += '\nUSERS REQUIRING IMPROVEMENT:\n';
    const restrictedUsers = rankings.filter(r => r.tier === 'restricted');
    restrictedUsers.slice(0, 5).forEach((ranking, index) => {
      report += `${index + 1}. ${ranking.userId} (${ranking.userType}) - Score: ${ranking.totalScore}\n`;
    });
    
    return report;
  }
}

export const performanceRanking = new PerformanceRanking();
export default performanceRanking;
