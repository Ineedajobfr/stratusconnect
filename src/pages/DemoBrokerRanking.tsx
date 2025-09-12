import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Crown, 
  Target, 
  TrendingUp, 
  RefreshCw,
  Calendar,
  BarChart3,
  Award,
  Zap,
  Clock
} from 'lucide-react';
import LeagueBadge from '@/components/league/LeagueBadge';
import { TierProgressCard } from '@/components/league/TierProgressCard';
import WeeklyLeaderboard from '@/components/league/WeeklyLeaderboard';
import WeeklyChallenges from '@/components/league/WeeklyChallenges';
import { getUserLeagueStats, getCurrentLeaderboard, getUserXpEvents } from '@/lib/gamification';

interface UserStats {
  user_id: string;
  points: number;
  rank: number;
  league_code: string;
  league_name: string;
  sort_order: number;
  color_hsl: string;
}

interface XpEvent {
  id: string;
  event_type: string;
  points: number;
  meta: Record<string, any>;
  created_at: string;
}

export default function DemoBrokerRanking() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [xpEvents, setXpEvents] = useState<XpEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user ID - in real app, get from auth context
  const userId = 'demo-user-123';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be actual API calls
        // For demo, we'll use mock data
        setUserStats({
          user_id: userId,
          points: 220,
          rank: 12,
          league_code: 'gold',
          league_name: 'Gold League',
          sort_order: 3,
          color_hsl: '38 92% 50%'
        });

        setLeaderboard([
          { user_id: 'user-1', points: 450, rank: 1, league_code: 'diamond', league_name: 'Diamond League' },
          { user_id: 'user-2', points: 420, rank: 2, league_code: 'diamond', league_name: 'Diamond League' },
          { user_id: 'user-3', points: 380, rank: 3, league_code: 'emerald', league_name: 'Emerald League' },
          // ... more mock data
        ]);

        setXpEvents([
          { id: '1', event_type: 'quote_submitted_fast', points: 15, meta: {}, created_at: new Date().toISOString() },
          { id: '2', event_type: 'deal_completed_on_time', points: 40, meta: {}, created_at: new Date().toISOString() },
          { id: '3', event_type: 'rfq_posted', points: 5, meta: {}, created_at: new Date().toISOString() },
        ]);
      } catch (error) {
        console.error('Failed to fetch ranking data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    // Refresh logic here
    setTimeout(() => setLoading(false), 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-app text-body">
        <main className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading ranking data...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app text-body">
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground title-glow">Ranking & Tier</h1>
            <p className="text-muted-foreground subtitle-glow">
              Compete with other brokers and climb the leaderboard
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="button-glow"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Current User Status */}
        {userStats && (
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
                        {userStats.points}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-foreground">
                        #{userStats.rank}
                      </div>
                      <div className="text-sm text-muted-foreground">Global Rank</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <LeagueBadge code={userStats.league_code} name={userStats.league_name} size="lg" />
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span>+15 this week</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <TierProgressCard 
                leagueCode={userStats.league_code}
                leagueName={userStats.league_name}
                points={userStats.points}
              />
            </div>
          </div>
        )}

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
            <TabsTrigger value="challenges" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Activity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeeklyLeaderboard />
              <WeeklyChallenges />
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <WeeklyLeaderboard />
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <WeeklyChallenges />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 title-glow">
                  <Zap className="w-6 h-6 text-accent" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {xpEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-terminal-card/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-accent/20 rounded-lg">
                          <Zap className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">
                            {event.event_type.replace(/_/g, ' ').toUpperCase()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(event.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-accent">
                        +{event.points}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
