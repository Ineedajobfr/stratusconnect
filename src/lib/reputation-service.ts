// Reputation Service
// Handles ratings, reviews, trust scores, and badges for the platform

import { supabase } from '@/integrations/supabase/client';

export interface UserRating {
  id: string;
  user_id: string;
  rated_by: string;
  rating: number; // 1-5 stars
  review_text?: string;
  transaction_id?: string;
  created_at: string;
  rater_name?: string;
  rater_company?: string;
}

export interface ReputationMetrics {
  userId: string;
  overallRating: number;
  totalRatings: number;
  recentRatings: UserRating[];
  trustScore: number;
  badges: string[];
  performanceMetrics: {
    responseTime: number; // minutes
    completionRate: number; // percentage
    onTimeRate: number; // percentage
    disputeRate: number; // percentage
  };
  ranking: {
    score: number;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    position: number;
    totalUsers: number;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: {
    minRating?: number;
    minTransactions?: number;
    maxResponseTime?: number;
    minCompletionRate?: number;
  };
}

class ReputationService {
  /**
   * Submit a rating and review
   */
  async submitRating(rating: Omit<UserRating, 'id' | 'created_at'>): Promise<UserRating> {
    try {
      const { data, error } = await supabase
        .from('user_reputation')
        .insert([rating])
        .select()
        .single();

      if (error) {
        console.error('Error submitting rating:', error);
        throw new Error('Failed to submit rating');
      }

      // Update user's reputation score
      await this.updateReputationScore(rating.user_id);

      return data as UserRating;
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  }

  /**
   * Get reputation metrics for a user
   */
  async getReputationMetrics(userId: string): Promise<ReputationMetrics> {
    try {
      // Get user's ratings
      const { data: ratings, error: ratingsError } = await supabase
        .from('user_reputation')
        .select(`
          *,
          rater:profiles!user_reputation_rated_by_fkey (
            full_name,
            company_name
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (ratingsError) {
        console.error('Error fetching ratings:', ratingsError);
        throw new Error('Failed to fetch ratings');
      }

      // Get user's trust score
      const { data: trustData, error: trustError } = await supabase
        .from('user_trust')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (trustError) {
        console.error('Error fetching trust score:', trustError);
      }

      // Calculate metrics
      const totalRatings = ratings?.length || 0;
      const overallRating = totalRatings > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
        : 0;

      // Get performance metrics (mock data for now)
      const performanceMetrics = await this.getPerformanceMetrics(userId);

      // Get badges
      const badges = await this.getUserBadges(userId, overallRating, totalRatings, performanceMetrics);

      // Get ranking
      const ranking = await this.getUserRanking(userId);

      return {
        userId,
        overallRating: Math.round(overallRating * 10) / 10, // Round to 1 decimal
        totalRatings,
        recentRatings: ratings?.slice(0, 10) || [],
        trustScore: trustData?.trust_score || 0,
        badges,
        performanceMetrics,
        ranking
      };
    } catch (error) {
      console.error('Error getting reputation metrics:', error);
      throw error;
    }
  }

  /**
   * Get performance metrics for a user
   */
  private async getPerformanceMetrics(userId: string) {
    // In a real implementation, this would calculate from actual transaction data
    // For now, return mock data
    return {
      responseTime: 45, // minutes
      completionRate: 98.5, // percentage
      onTimeRate: 95.2, // percentage
      disputeRate: 1.2 // percentage
    };
  }

  /**
   * Get user badges based on performance
   */
  private async getUserBadges(
    userId: string, 
    overallRating: number, 
    totalRatings: number, 
    performanceMetrics: any
  ): Promise<string[]> {
    const badges: string[] = [];

    // Rating-based badges
    if (overallRating >= 4.8) badges.push('excellent');
    else if (overallRating >= 4.5) badges.push('very-good');
    else if (overallRating >= 4.0) badges.push('good');

    // Volume-based badges
    if (totalRatings >= 100) badges.push('veteran');
    else if (totalRatings >= 50) badges.push('experienced');
    else if (totalRatings >= 10) badges.push('established');

    // Performance-based badges
    if (performanceMetrics.responseTime <= 30) badges.push('fast-responder');
    if (performanceMetrics.completionRate >= 99) badges.push('reliable');
    if (performanceMetrics.onTimeRate >= 98) badges.push('punctual');
    if (performanceMetrics.disputeRate <= 1) badges.push('trustworthy');

    // Special badges
    if (totalRatings >= 20 && overallRating >= 4.5) badges.push('top-rated');
    if (performanceMetrics.completionRate >= 99 && performanceMetrics.onTimeRate >= 98) badges.push('perfectionist');

    return badges;
  }

  /**
   * Get user ranking
   */
  private async getUserRanking(userId: string) {
    // In a real implementation, this would calculate from user_trust table
    // For now, return mock data
    return {
      score: 85.5,
      tier: 'Gold' as const,
      position: 12,
      totalUsers: 150
    };
  }

  /**
   * Update user's reputation score
   */
  private async updateReputationScore(userId: string): Promise<void> {
    try {
      // Get all ratings for the user
      const { data: ratings, error } = await supabase
        .from('user_reputation')
        .select('rating')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching ratings for score update:', error);
        return;
      }

      // Calculate average rating
      const averageRating = ratings && ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      // Update reputation score in profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ reputation_score: averageRating })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating reputation score:', updateError);
      }
    } catch (error) {
      console.error('Error updating reputation score:', error);
    }
  }

  /**
   * Get available badges
   */
  async getAvailableBadges(): Promise<Badge[]> {
    return [
      {
        id: 'excellent',
        name: 'Excellent',
        description: 'Maintains 4.8+ star rating',
        icon: '⭐',
        color: 'text-yellow-400',
        criteria: { minRating: 4.8 }
      },
      {
        id: 'very-good',
        name: 'Very Good',
        description: 'Maintains 4.5+ star rating',
        icon: '⭐',
        color: 'text-yellow-300',
        criteria: { minRating: 4.5 }
      },
      {
        id: 'good',
        name: 'Good',
        description: 'Maintains 4.0+ star rating',
        icon: '⭐',
        color: 'text-yellow-200',
        criteria: { minRating: 4.0 }
      },
      {
        id: 'veteran',
        name: 'Veteran',
        description: '100+ completed transactions',
        icon: '🏆',
        color: 'text-purple-400',
        criteria: { minTransactions: 100 }
      },
      {
        id: 'experienced',
        name: 'Experienced',
        description: '50+ completed transactions',
        icon: '🥇',
        color: 'text-blue-400',
        criteria: { minTransactions: 50 }
      },
      {
        id: 'established',
        name: 'Established',
        description: '10+ completed transactions',
        icon: '🥈',
        color: 'text-green-400',
        criteria: { minTransactions: 10 }
      },
      {
        id: 'fast-responder',
        name: 'Fast Responder',
        description: 'Responds within 30 minutes',
        icon: '⚡',
        color: 'text-orange-400',
        criteria: { maxResponseTime: 30 }
      },
      {
        id: 'reliable',
        name: 'Reliable',
        description: '99%+ completion rate',
        icon: '✅',
        color: 'text-green-400',
        criteria: { minCompletionRate: 99 }
      },
      {
        id: 'punctual',
        name: 'Punctual',
        description: '98%+ on-time delivery',
        icon: '⏰',
        color: 'text-blue-400',
        criteria: { minCompletionRate: 98 }
      },
      {
        id: 'trustworthy',
        name: 'Trustworthy',
        description: 'Less than 1% dispute rate',
        icon: '🛡️',
        color: 'text-green-400',
        criteria: { minCompletionRate: 99 }
      },
      {
        id: 'top-rated',
        name: 'Top Rated',
        description: 'High volume with excellent ratings',
        icon: '👑',
        color: 'text-yellow-400',
        criteria: { minTransactions: 20, minRating: 4.5 }
      },
      {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Perfect completion and punctuality',
        icon: '💎',
        color: 'text-purple-400',
        criteria: { minCompletionRate: 99, minRating: 4.8 }
      }
    ];
  }

  /**
   * Get user's rating history
   */
  async getRatingHistory(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ ratings: UserRating[]; total: number }> {
    try {
      const { data: ratings, error, count } = await supabase
        .from('user_reputation')
        .select(`
          *,
          rater:profiles!user_reputation_rated_by_fkey (
            full_name,
            company_name
          )
        `, { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching rating history:', error);
        throw new Error('Failed to fetch rating history');
      }

      return {
        ratings: ratings || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error getting rating history:', error);
      throw error;
    }
  }

  /**
   * Check if user can rate another user
   */
  async canRateUser(raterId: string, targetUserId: string): Promise<boolean> {
    try {
      // Check if they've already rated this user recently
      const { data: existingRating, error } = await supabase
        .from('user_reputation')
        .select('id')
        .eq('rated_by', raterId)
        .eq('user_id', targetUserId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking existing rating:', error);
        return false;
      }

      return !existingRating; // Can rate if no recent rating exists
    } catch (error) {
      console.error('Error checking if user can rate:', error);
      return false;
    }
  }
}

// Export singleton instance
export const reputationService = new ReputationService();
