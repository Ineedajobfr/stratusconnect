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
import { 
  getDemoUserStats, 
  getDemoLeaderboard, 
  getDemoXpEvents, 
  getDemoChallenges,
  getDemoAchievements,
  getDemoPerformanceMetrics,
  getDemoSeasonInfo,
  DEMO_CURRENT_USER
} from '@/lib/demo-gamification-data';

interface DemoUser {
  id: string;
  name: string;
  role: 'broker' | 'operator' | 'pilot' | 'crew';
  league: string;
  points: number;
  rank: number;
  weeklyChange: number;
  streak: number;
  avatar?: string;
}

interface DemoXpEvent {
  id: string;
  type: string;
  points: number;
  description: string;
  timestamp: string;
  meta?: Record<string, any>;
}

export default function DemoBrokerRanking() {
  const [userStats, setUserStats] = useState<DemoUser | null>(null);
  const [leaderboard, setLeaderboard] = useState<DemoUser[]>([]);
  const [xpEvents, setXpEvents] = useState<DemoXpEvent[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [seasonInfo, setSeasonInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Demo user ID
  const userId = 'demo-user';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Load demo data
        setUserStats(DEMO_CURRENT_USER);
        setLeaderboard(getDemoLeaderboard(30));
        setXpEvents(getDemoXpEvents(userId, 10));
        setChallenges(getDemoChallenges());
        setAchievements(getDemoAchievements());
        setPerformanceMetrics(getDemoPerformanceMetrics());
        setSeasonInfo(getDemoSeasonInfo());
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
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{userStats.avatar}</div>
                      <LeagueBadge code={userStats.league} name={`${userStats.league.charAt(0).toUpperCase() + userStats.league.slice(1)} League`} size="lg" />
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span>+{userStats.weeklyChange} this week</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>{userStats.streak} day streak</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <TierProgressCard 
                leagueCode={userStats.league}
                leagueName={`${userStats.league.charAt(0).toUpperCase() + userStats.league.slice(1)} League`}
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
                    <div key={event.id} className="flex items-center justify-between p-3 bg-terminal-card/50 rounded-lg hover:bg-terminal-card/70 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-accent/20 rounded-lg">
                          <Zap className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">
                            {event.description}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(event.timestamp).toLocaleDateString()} at {new Date(event.timestamp).toLocaleTimeString()}
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
