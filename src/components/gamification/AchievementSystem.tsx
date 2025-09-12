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
  Shield,
  Clock,
  DollarSign,
  Users,
  Plane,
  CheckCircle,
  Lock,
  Unlock
} from 'lucide-react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'performance' | 'streak' | 'volume' | 'quality' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirements: {
    metric: string;
    target: number;
    current: number;
  }[];
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActivity: Date;
  streakType: 'daily' | 'weekly' | 'monthly';
}

export const ACHIEVEMENTS: Achievement[] = [
  // Performance Achievements
  {
    id: 'first_quote',
    name: 'First Quote',
    description: 'Submit your first quote',
    icon: <Target className="w-6 h-6" />,
    category: 'performance',
    rarity: 'common',
    points: 10,
    requirements: [{ metric: 'quotes_submitted', target: 1, current: 0 }],
    unlocked: false,
    progress: 0
  },
  {
    id: 'quick_response',
    name: 'Lightning Fast',
    description: 'Respond to a quote in under 2 minutes',
    icon: <Zap className="w-6 h-6" />,
    category: 'performance',
    rarity: 'rare',
    points: 25,
    requirements: [{ metric: 'response_time_under_2min', target: 1, current: 0 }],
    unlocked: false,
    progress: 0
  },
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: '100% completion rate for a week',
    icon: <CheckCircle className="w-6 h-6" />,
    category: 'performance',
    rarity: 'epic',
    points: 50,
    requirements: [{ metric: 'weekly_completion_rate', target: 100, current: 0 }],
    unlocked: false,
    progress: 0
  },
  
  // Streak Achievements
  {
    id: 'week_streak',
    name: 'Week Warrior',
    description: 'Maintain a 7-day activity streak',
    icon: <Flame className="w-6 h-6" />,
    category: 'streak',
    rarity: 'common',
    points: 20,
    requirements: [{ metric: 'daily_streak', target: 7, current: 0 }],
    unlocked: false,
    progress: 0
  },
  {
    id: 'month_streak',
    name: 'Month Master',
    description: 'Maintain a 30-day activity streak',
    icon: <Crown className="w-6 h-6" />,
    category: 'streak',
    rarity: 'epic',
    points: 100,
    requirements: [{ metric: 'daily_streak', target: 30, current: 0 }],
    unlocked: false,
    progress: 0
  },
  
  // Volume Achievements
  {
    id: 'quote_master',
    name: 'Quote Master',
    description: 'Submit 100 quotes',
    icon: <Award className="w-6 h-6" />,
    category: 'volume',
    rarity: 'rare',
    points: 75,
    requirements: [{ metric: 'quotes_submitted', target: 100, current: 0 }],
    unlocked: false,
    progress: 0
  },
  {
    id: 'million_dollar',
    name: 'Million Dollar Club',
    description: 'Process $1M in transactions',
    icon: <DollarSign className="w-6 h-6" />,
    category: 'volume',
    rarity: 'legendary',
    points: 200,
    requirements: [{ metric: 'total_volume', target: 1000000, current: 0 }],
    unlocked: false,
    progress: 0
  },
  
  // Quality Achievements
  {
    id: 'zero_disputes',
    name: 'Dispute-Free',
    description: 'Complete 50 transactions without disputes',
    icon: <Shield className="w-6 h-6" />,
    category: 'quality',
    rarity: 'epic',
    points: 100,
    requirements: [{ metric: 'dispute_free_transactions', target: 50, current: 0 }],
    unlocked: false,
    progress: 0
  },
  {
    id: 'client_favorite',
    name: 'Client Favorite',
    description: 'Maintain 95%+ client satisfaction for 3 months',
    icon: <Star className="w-6 h-6" />,
    category: 'quality',
    rarity: 'legendary',
    points: 150,
    requirements: [{ metric: 'client_satisfaction_3months', target: 95, current: 0 }],
    unlocked: false,
    progress: 0
  },
  
  // Social Achievements
  {
    id: 'team_player',
    name: 'Team Player',
    description: 'Collaborate on 10 multi-party transactions',
    icon: <Users className="w-6 h-6" />,
    category: 'social',
    rarity: 'rare',
    points: 50,
    requirements: [{ metric: 'collaborative_transactions', target: 10, current: 0 }],
    unlocked: false,
    progress: 0
  },
  
  // Special Achievements
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Join StratusConnect in the first month',
    icon: <Plane className="w-6 h-6" />,
    category: 'special',
    rarity: 'legendary',
    points: 100,
    requirements: [{ metric: 'early_adopter', target: 1, current: 0 }],
    unlocked: false,
    progress: 0
  }
];

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className={`terminal-card ${achievement.unlocked ? 'border-accent' : 'border-glow opacity-60'}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg bg-accent/20 ${getRarityColor(achievement.rarity)}`}>
            {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6" />}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <h3 className={`font-semibold ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                {achievement.name}
              </h3>
              <Badge 
                className={`text-xs ${getRarityBadgeColor(achievement.rarity)}`}
              >
                {achievement.rarity}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {achievement.points} pts
              </Badge>
            </div>
            
            <p className={`text-sm ${achievement.unlocked ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
              {achievement.description}
            </p>
            
            {!achievement.unlocked && (
              <div className="space-y-2">
                {achievement.requirements.map((req, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{req.metric.replace(/_/g, ' ').toUpperCase()}</span>
                      <span>{req.current} / {req.target}</span>
                    </div>
                    <Progress 
                      value={(req.current / req.target) * 100} 
                      className="h-1.5"
                    />
                  </div>
                ))}
              </div>
            )}
            
            {achievement.unlocked && achievement.unlockedAt && (
              <div className="flex items-center space-x-1 text-xs text-accent">
                <CheckCircle className="w-3 h-3" />
                <span>Unlocked {achievement.unlockedAt.toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AchievementGrid({ achievements }: { achievements: Achievement[] }) {
  const categories = ['performance', 'streak', 'volume', 'quality', 'social', 'special'];
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground title-glow">Achievements</h2>
          <p className="text-muted-foreground subtitle-glow">
            {unlockedCount} of {achievements.length} unlocked • {totalPoints} points earned
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-accent accent-glow">{unlockedCount}</div>
          <div className="text-sm text-muted-foreground">Achievements</div>
        </div>
      </div>

      {categories.map((category) => {
        const categoryAchievements = achievements.filter(a => a.category === category);
        if (categoryAchievements.length === 0) return null;

        return (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground capitalize title-glow">
              {category} Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function StreakCard({ streak }: { streak: StreakData }) {
  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (streak >= 7) return <Trophy className="w-6 h-6 text-blue-500" />;
    return <Flame className="w-6 h-6 text-orange-500" />;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-yellow-500';
    if (streak >= 7) return 'text-blue-500';
    return 'text-orange-500';
  };

  return (
    <Card className="terminal-card border-glow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 title-glow">
          {getStreakIcon(streak.current)}
          <span>Activity Streak</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-4xl font-bold ${getStreakColor(streak.current)} accent-glow`}>
            {streak.current}
          </div>
          <div className="text-sm text-muted-foreground">days in a row</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">{streak.longest}</div>
            <div className="text-xs text-muted-foreground">Longest streak</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {Math.floor((Date.now() - streak.lastActivity.getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-xs text-muted-foreground">Days since last activity</div>
          </div>
        </div>
        
        <div className="pt-2 border-t border-terminal-border">
          <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Keep it up! Your streak is on fire!</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
