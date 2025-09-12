import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LeagueBadge from './LeagueBadge';
import { getDemoLeaderboard, DemoUser } from '@/lib/demo-gamification-data';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

export default function WeeklyLeaderboard() {
  const [rows, setRows] = useState<DemoUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = getDemoLeaderboard(30);
        setRows(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (position === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (position === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 text-center text-sm font-bold text-muted-foreground">#{position}</span>;
  };

  if (loading) {
    return (
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 title-glow">
            <Trophy className="w-6 h-6 text-accent" />
            <span>Weekly Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading leaderboard...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="terminal-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 title-glow">
            <Trophy className="w-6 h-6 text-accent" />
            <span>Weekly Leaderboard</span>
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Top 30
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rows.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No rankings available yet. Start earning points to appear on the leaderboard!
            </div>
          ) : (
            rows.map((user, i) => (
              <div 
                key={user.id} 
                className={`py-3 px-4 rounded-lg transition-colors ${
                  i < 3 ? 'bg-accent/5 border border-accent/20' : 'hover:bg-terminal-card/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8">
                      {getPositionIcon(user.rank)}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{user.avatar}</div>
                      <div className="flex items-center gap-2">
                        <LeagueBadge code={user.league} name={`${user.league.charAt(0).toUpperCase() + user.league.slice(1)} League`} size="sm" />
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {user.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.streak} day streak • +{user.weeklyChange} this week
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-body font-bold text-accent accent-glow">
                      {user.points} pts
                    </div>
                    {i < 3 && (
                      <div className="text-xs text-muted-foreground">
                        {i === 0 ? 'Champion' : i === 1 ? 'Runner-up' : 'Third Place'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
