import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Crown, 
  Medal, 
  Target, 
  Zap, 
  TrendingUp,
  Award,
  Flame,
  Shield
} from 'lucide-react';

export interface UserTier {
  id: string;
  name: string;
  level: number;
  minScore: number;
  maxScore: number;
  color: string;
  icon: React.ReactNode;
  description: string;
  benefits: string[];
}

export interface UserRanking {
  userId: string;
  username: string;
  role: 'broker' | 'operator' | 'pilot' | 'crew';
  score: number;
  tier: UserTier;
  position: number;
  weeklyChange: number;
  monthlyChange: number;
  streak: number;
  achievements: string[];
  responseTime: number;
  acceptanceRate: number;
  completionRate: number;
  disputeRate: number;
  onTimePerformance: number;
}

export const TIER_SYSTEM: UserTier[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    level: 1,
    minScore: 0,
    maxScore: 299,
    color: 'text-amber-600',
    icon: <Medal className="w-6 h-6" />,
    description: 'Getting started in the aviation marketplace',
    benefits: ['Basic marketplace access', 'Standard support', 'Monthly reports']
  },
  {
    id: 'silver',
    name: 'Silver',
    level: 2,
    minScore: 300,
    maxScore: 599,
    color: 'text-gray-400',
    icon: <Star className="w-6 h-6" />,
    description: 'Proven reliability and performance',
    benefits: ['Priority support', 'Advanced analytics', 'Weekly reports', 'Badge verification']
  },
  {
    id: 'gold',
    name: 'Gold',
    level: 3,
    minScore: 600,
    maxScore: 899,
    color: 'text-yellow-500',
    icon: <Trophy className="w-6 h-6" />,
    description: 'Elite performer with exceptional metrics',
    benefits: ['VIP support', 'Real-time analytics', 'Daily reports', 'Premium features', 'Priority matching']
  },
  {
    id: 'platinum',
    name: 'Platinum',
    level: 4,
    minScore: 900,
    maxScore: 1199,
    color: 'text-blue-500',
    icon: <Crown className="w-6 h-6" />,
    description: 'Top-tier professional with outstanding reputation',
    benefits: ['Dedicated account manager', 'Custom analytics', 'Instant reports', 'Exclusive features', 'First access to opportunities']
  },
  {
    id: 'diamond',
    name: 'Diamond',
    level: 5,
    minScore: 1200,
    maxScore: 9999,
    color: 'text-purple-500',
    icon: <Shield className="w-6 h-6" />,
    description: 'Legendary status in the aviation industry',
    benefits: ['White-glove service', 'Custom integrations', 'Real-time reports', 'All features', 'Industry recognition', 'Mentorship opportunities']
  }
];

export function TierBadge({ tier, score, showProgress = true }: { 
  tier: UserTier; 
  score: number; 
  showProgress?: boolean;
}) {
  const progress = Math.min(100, ((score - tier.minScore) / (tier.maxScore - tier.minScore)) * 100);
  const nextTier = TIER_SYSTEM.find(t => t.level === tier.level + 1);
  const pointsToNext = nextTier ? nextTier.minScore - score : 0;

  return (
    <Card className="terminal-card border-glow">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-accent/20 ${tier.color}`}>
            {tier.icon}
          </div>
          <div>
            <CardTitle className={`text-lg ${tier.color} title-glow`}>
              {tier.name} Tier
            </CardTitle>
            <p className="text-sm text-muted-foreground subtitle-glow">
              {tier.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Score</span>
          <span className={`font-bold ${tier.color} accent-glow`}>{score}</span>
        </div>
        
        {showProgress && nextTier && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to {nextTier.name}</span>
                <span className="text-accent">{pointsToNext} points to go</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Tier Benefits:</h4>
          <div className="space-y-1">
            {tier.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RankingCard({ ranking, isCurrentUser = false }: { 
  ranking: UserRanking; 
  isCurrentUser?: boolean;
}) {
  const getPositionIcon = (position: number) => {
    if (position === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (position === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (position === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{position}</span>;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingUp className="w-4 h-4 rotate-180" />;
    return null;
  };

  return (
    <Card className={`terminal-card ${isCurrentUser ? 'border-accent border-2' : 'border-glow'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getPositionIcon(ranking.position)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className={`font-semibold ${isCurrentUser ? 'text-accent' : 'text-foreground'}`}>
                  {ranking.username}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {ranking.role}
                </Badge>
                {isCurrentUser && (
                  <Badge variant="default" className="text-xs bg-accent">
                    You
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <Target className="w-3 h-3" />
                  <span>{ranking.score} pts</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Flame className="w-3 h-3" />
                  <span>{ranking.streak} day streak</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right space-y-1">
            <div className={`flex items-center space-x-1 ${getChangeColor(ranking.weeklyChange)}`}>
              {getChangeIcon(ranking.weeklyChange)}
              <span className="text-sm font-medium">
                {ranking.weeklyChange > 0 ? '+' : ''}{ranking.weeklyChange}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              This week
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Leaderboard({ rankings, currentUserId }: { 
  rankings: UserRanking[]; 
  currentUserId: string;
}) {
  const currentUser = rankings.find(r => r.userId === currentUserId);
  const topRankings = rankings.slice(0, 10);
  const currentUserRanking = currentUser && currentUser.position > 10 ? currentUser : null;

  return (
    <Card className="terminal-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 title-glow">
          <Trophy className="w-6 h-6 text-accent" />
          <span>Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topRankings.map((ranking) => (
          <RankingCard 
            key={ranking.userId} 
            ranking={ranking} 
            isCurrentUser={ranking.userId === currentUserId}
          />
        ))}
        
        {currentUserRanking && (
          <>
            <div className="border-t border-terminal-border my-4" />
            <div className="text-center text-sm text-muted-foreground mb-2">
              Your position
            </div>
            <RankingCard 
              ranking={currentUserRanking} 
              isCurrentUser={true}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function ScoreBreakdown({ ranking }: { ranking: UserRanking }) {
  const metrics = [
    { label: 'Response Time', value: `${ranking.responseTime}ms`, weight: 25 },
    { label: 'Acceptance Rate', value: `${ranking.acceptanceRate}%`, weight: 20 },
    { label: 'Completion Rate', value: `${ranking.completionRate}%`, weight: 25 },
    { label: 'Dispute Rate', value: `${ranking.disputeRate}%`, weight: 15 },
    { label: 'On-Time Performance', value: `${ranking.onTimePerformance}%`, weight: 15 }
  ];

  return (
    <Card className="terminal-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 title-glow">
          <Target className="w-6 h-6 text-accent" />
          <span>Score Breakdown</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground subtitle-glow">
          Ranking is calculated based on performance over the last 90 days
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">{metric.label}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-accent font-bold">{metric.value}</span>
                <Badge variant="outline" className="text-xs">
                  {metric.weight}%
                </Badge>
              </div>
            </div>
            <Progress 
              value={parseFloat(metric.value.replace(/[^\d.]/g, ''))} 
              className="h-2"
            />
          </div>
        ))}
        
        <div className="pt-4 border-t border-terminal-border">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-foreground">Total Score</span>
            <span className="text-2xl font-bold text-accent accent-glow">
              {ranking.score}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
