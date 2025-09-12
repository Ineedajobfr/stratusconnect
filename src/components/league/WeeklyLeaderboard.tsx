import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LeagueBadge from './LeagueBadge';
import { getCurrentLeaderboard } from '@/lib/gamification';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  points: number;
  rank: number;
  league_code: string;
  league_name: string;
  sort_order: number;
  color_hsl: string;
}

export default function WeeklyLeaderboard() {
  const [rows, setRows] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getCurrentLeaderboard(30);
        setRows(data || []);
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
            rows.map((r, i) => (
              <div 
                key={r.user_id} 
                className={`py-3 px-4 rounded-lg transition-colors ${
                  i < 3 ? 'bg-accent/5 border border-accent/20' : 'hover:bg-terminal-card/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8">
                      {getPositionIcon(r.rank)}
                    </div>
                    <div className="flex items-center gap-3">
                      <LeagueBadge code={r.league_code} name={r.league_name} size="sm" />
                      <div>
                        <div className="font-semibold text-foreground">
                          User #{r.user_id.slice(-6)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {r.league_name}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-body font-bold text-accent accent-glow">
                      {r.points} pts
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
