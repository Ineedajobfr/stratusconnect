// Reputation Metrics on Profiles and Ranking Rules
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Plane,
  Award,
  Target,
  Zap
} from 'lucide-react';

export interface ReputationMetrics {
  userId: string;
  userType: 'broker' | 'operator' | 'pilot' | 'crew';
  overallRating: number;
  totalRatings: number;
  responseTime: number; // minutes
  acceptanceRate: number; // percentage
  completionRate: number; // percentage
  disputeRate: number; // percentage
  onTimeRate: number; // percentage
  last90Days: {
    deals: number;
    quotes: number;
    responseTime: number;
    acceptanceRate: number;
    completionRate: number;
    disputeRate: number;
    onTimeRate: number;
  };
  ranking: {
    score: number;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    position: number;
    totalUsers: number;
  };
  badges: string[];
  verified: boolean;
  joinedDate: string;
  lastActive: string;
}

export interface RankingRule {
  id: string;
  name: string;
  description: string;
  weight: number;
  threshold: number;
  bonus: number;
  active: boolean;
}

export interface ReputationMetricsProps {
  userId: string;
  userType: 'broker' | 'operator' | 'pilot' | 'crew';
  showRanking?: boolean;
  showBadges?: boolean;
}

export function ReputationMetrics({ userId, userType, showRanking = true, showBadges = true }: ReputationMetricsProps) {
  const [metrics, setMetrics] = useState<ReputationMetrics | null>(null);
  const [rankingRules, setRankingRules] = useState<RankingRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    loadRankingRules();
  }, [userId, userType]);

  const loadMetrics = async () => {
    // Free tier: Use mock data instead of API calls
    const mockMetrics: ReputationMetrics = {
      userId,
      userType,
      overallRating: 4.7,
      totalRatings: 127,
      responseTime: 8.5, // minutes
      acceptanceRate: 94.2, // percentage
      completionRate: 98.1, // percentage
      disputeRate: 1.2, // percentage
      onTimeRate: 96.8, // percentage
      last90Days: {
        deals: 23,
        quotes: 45,
        responseTime: 7.2,
        acceptanceRate: 95.6,
        completionRate: 98.7,
        disputeRate: 0.8,
        onTimeRate: 97.3
      },
      ranking: {
        score: 89.2,
        tier: 'Gold',
        position: 12,
        totalUsers: 156
      },
      badges: ['Fast Responder', 'High Completion', 'Verified Operator', 'Top Performer'],
      verified: true,
      joinedDate: '2023-06-15T10:00:00Z',
      lastActive: '2024-01-16T14:30:00Z'
    };
    
    setMetrics(mockMetrics);
    setLoading(false);
  };

  const loadRankingRules = async () => {
    // Mock ranking rules - in production would load from API
    const mockRules: RankingRule[] = [
      {
        id: 'RR_001',
        name: 'Fast Response',
        description: 'Response time under 5 minutes',
        weight: 25,
        threshold: 5,
        bonus: 10,
        active: true
      },
      {
        id: 'RR_002',
        name: 'High Acceptance',
        description: 'Acceptance rate over 90%',
        weight: 20,
        threshold: 90,
        bonus: 8,
        active: true
      },
      {
        id: 'RR_003',
        name: 'Perfect Completion',
        description: 'Completion rate over 95%',
        weight: 20,
        threshold: 95,
        bonus: 8,
        active: true
      },
      {
        id: 'RR_004',
        name: 'Low Disputes',
        description: 'Dispute rate under 2%',
        weight: 15,
        threshold: 2,
        bonus: 5,
        active: true
      },
      {
        id: 'RR_005',
        name: 'On Time',
        description: 'On-time rate over 95%',
        weight: 20,
        threshold: 95,
        bonus: 8,
        active: true
      }
    ];
    
    setRankingRules(mockRules);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return 'text-amber-600 bg-amber-100';
      case 'Silver':
        return 'text-gray-600 bg-gray-100';
      case 'Gold':
        return 'text-yellow-600 bg-yellow-100';
      case 'Platinum':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getMetricColor = (value: number, threshold: number, reverse = false) => {
    const isGood = reverse ? value < threshold : value > threshold;
    return isGood ? 'text-green-600' : 'text-red-600';
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'responseTime':
        return <Clock className="w-4 h-4" />;
      case 'acceptanceRate':
        return <CheckCircle className="w-4 h-4" />;
      case 'completionRate':
        return <Target className="w-4 h-4" />;
      case 'disputeRate':
        return <AlertTriangle className="w-4 h-4" />;
      case 'onTimeRate':
        return <Zap className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  if (loading || !metrics) {
    return <div>Loading reputation metrics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Overall Rating */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Overall Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold">{metrics.overallRating}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(metrics.overallRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({metrics.totalRatings} ratings)
                </span>
              </div>
              <Progress value={metrics.overallRating * 20} className="w-full" />
            </div>
            {metrics.verified && (
              <Badge className="bg-blue-100 text-blue-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Key Metrics (Last 90 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Response Time</span>
              </div>
              <div className={`text-2xl font-bold ${getMetricColor(metrics.last90Days.responseTime, 5, true)}`}>
                {metrics.last90Days.responseTime}m
              </div>
              <div className="text-xs text-gray-500">
                Target: &lt;5m
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Acceptance Rate</span>
              </div>
              <div className={`text-2xl font-bold ${getMetricColor(metrics.last90Days.acceptanceRate, 90)}`}>
                {metrics.last90Days.acceptanceRate}%
              </div>
              <div className="text-xs text-gray-500">
                Target: &gt;90%
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Completion Rate</span>
              </div>
              <div className={`text-2xl font-bold ${getMetricColor(metrics.last90Days.completionRate, 95)}`}>
                {metrics.last90Days.completionRate}%
              </div>
              <div className="text-xs text-gray-500">
                Target: &gt;95%
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Dispute Rate</span>
              </div>
              <div className={`text-2xl font-bold ${getMetricColor(metrics.last90Days.disputeRate, 2, true)}`}>
                {metrics.last90Days.disputeRate}%
              </div>
              <div className="text-xs text-gray-500">
                Target: &lt;2%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.last90Days.deals}</div>
              <div className="text-sm text-gray-600">Deals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.last90Days.quotes}</div>
              <div className="text-sm text-gray-600">Quotes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.last90Days.onTimeRate}%</div>
              <div className="text-sm text-gray-600">On Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {new Date(metrics.lastActive).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">Last Active</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ranking */}
      {showRanking && (
        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-body">
              <Award className="w-5 h-5" />
              Ranking & Tier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getTierColor(metrics.ranking.tier)}>
                    {metrics.ranking.tier}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Score: {metrics.ranking.score}/100
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Position {metrics.ranking.position} of {metrics.ranking.totalUsers} {userType}s
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{metrics.ranking.score}</div>
                <div className="text-sm text-gray-600">Ranking Score</div>
              </div>
            </div>
            
            <Progress value={metrics.ranking.score} className="w-full mb-4" />
            
            <div className="text-sm text-gray-600">
              Ranking is calculated based on response time, acceptance rate, completion rate, 
              dispute rate, and on-time performance over the last 90 days.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badges */}
      {showBadges && metrics.badges.length > 0 && (
        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-body">
              <Award className="w-5 h-5" />
              Badges & Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {metrics.badges.map((badge, index) => (
                <Badge key={index} variant="outline" className="text-blue-600">
                  <Award className="w-3 h-3 mr-1" />
                  {badge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ranking Rules */}
      {showRanking && rankingRules.length > 0 && (
        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-body">
              <Target className="w-5 h-5" />
              Ranking Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rankingRules.map(rule => (
                <div key={rule.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-body">{rule.name}</div>
                    <div className="text-sm text-muted">{rule.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-body">Weight: {rule.weight}%</div>
                    <div className="text-xs text-muted">Threshold: {rule.threshold}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
