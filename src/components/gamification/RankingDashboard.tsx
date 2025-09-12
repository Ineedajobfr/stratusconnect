import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Users,
  Calendar,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { TierBadge, Leaderboard, ScoreBreakdown, UserRanking, UserTier, TIER_SYSTEM } from './TierSystem';
import { AchievementGrid, StreakCard, Achievement, StreakData } from './AchievementSystem';

interface RankingDashboardProps {
  currentUser: UserRanking;
  rankings: UserRanking[];
  achievements: Achievement[];
  streak: StreakData;
  onRefresh?: () => void;
}

export function RankingDashboard({ 
  currentUser, 
  rankings, 
  achievements, 
  streak, 
  onRefresh 
}: RankingDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'all'>('weekly');

  const getCurrentTier = (score: number): UserTier => {
    return TIER_SYSTEM.find(tier => score >= tier.minScore && score <= tier.maxScore) || TIER_SYSTEM[0];
  };

  const getRoleRankings = (role: string) => {
    return rankings
      .filter(r => r.role === role)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  const getTimeFilteredRankings = (rankings: UserRanking[]) => {
    // In a real app, this would filter based on the timeFilter
    return rankings;
  };

  const recentAchievements = achievements
    .filter(a => a.unlocked)
    .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground title-glow">Ranking & Tier</h1>
          <p className="text-muted-foreground subtitle-glow">
            Compete with other professionals and climb the leaderboard
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            className="button-glow"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Current User Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="terminal-card border-accent border-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 title-glow">
                <Crown className="w-6 h-6 text-accent" />
                <span>Your Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent accent-glow">
                    {currentUser.score}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground">
                    #{currentUser.position}
                  </div>
                  <div className="text-sm text-muted-foreground">Global Rank</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {currentUser.role}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getCurrentTier(currentUser.score).name} Tier
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>{currentUser.streak} day streak</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>+{currentUser.weeklyChange} this week</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <StreakCard streak={streak} />
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center space-x-2">
            <Award className="w-4 h-4" />
            <span>Achievements</span>
          </TabsTrigger>
          <TabsTrigger value="tiers" className="flex items-center space-x-2">
            <Crown className="w-4 h-4" />
            <span>Tiers</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScoreBreakdown ranking={currentUser} />
            <TierBadge tier={getCurrentTier(currentUser.score)} score={currentUser.score} />
          </div>
          
          {recentAchievements.length > 0 && (
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 title-glow">
                  <Star className="w-6 h-6 text-accent" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
                      <div className="p-2 bg-accent/20 rounded-lg">
                        {achievement.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{achievement.name}</div>
                        <div className="text-sm text-muted-foreground">{achievement.points} points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground title-glow">Global Leaderboard</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant={timeFilter === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeFilter('weekly')}
              >
                Weekly
              </Button>
              <Button
                variant={timeFilter === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeFilter('monthly')}
              >
                Monthly
              </Button>
              <Button
                variant={timeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeFilter('all')}
              >
                All Time
              </Button>
            </div>
          </div>
          
          <Leaderboard 
            rankings={getTimeFilteredRankings(rankings)} 
            currentUserId={currentUser.userId}
          />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <AchievementGrid achievements={achievements} />
        </TabsContent>

        <TabsContent value="tiers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TIER_SYSTEM.map((tier) => (
              <TierBadge 
                key={tier.id} 
                tier={tier} 
                score={tier.maxScore} 
                showProgress={false}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Role-Specific Rankings */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground title-glow">Role Rankings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['broker', 'operator', 'pilot', 'crew'].map((role) => {
            const roleRankings = getRoleRankings(role);
            if (roleRankings.length === 0) return null;

            return (
              <Card key={role} className="terminal-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 title-glow">
                    <Users className="w-6 h-6 text-accent" />
                    <span className="capitalize">{role} Rankings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {roleRankings.slice(0, 5).map((ranking, index) => (
                    <div key={ranking.userId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{ranking.username}</div>
                          <div className="text-sm text-muted-foreground">{ranking.score} points</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getCurrentTier(ranking.score).name}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
