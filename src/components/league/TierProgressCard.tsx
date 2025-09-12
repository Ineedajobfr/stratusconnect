import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import LeagueBadge from './LeagueBadge';
import { LEAGUE_THRESHOLDS } from '@/lib/league-constants';

interface TierProgressCardProps {
  leagueCode: string;
  leagueName: string;
  points: number;
  nextTarget?: number;
  showProgress?: boolean;
}

export function TierProgressCard({ 
  leagueCode, 
  leagueName, 
  points, 
  nextTarget,
  showProgress = true 
}: TierProgressCardProps) {
  // Calculate next league threshold
  const leagueOrder = ['bronze', 'silver', 'gold', 'platinum', 'emerald', 'diamond'];
  const currentIndex = leagueOrder.indexOf(leagueCode);
  const nextLeagueCode = leagueOrder[currentIndex + 1];
  const targetPoints = nextTarget || (nextLeagueCode ? LEAGUE_THRESHOLDS[nextLeagueCode] : points);
  
  const pct = Math.min(100, Math.round((points / targetPoints) * 100));
  const pointsToNext = Math.max(0, targetPoints - points);

  return (
    <Card className="terminal-card border-glow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg title-glow">League Status</CardTitle>
          <LeagueBadge code={leagueCode} name={leagueName} size="md" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-accent accent-glow mb-1">
            {points}
          </div>
          <div className="text-sm text-muted-foreground subtitle-glow">
            Total Points
          </div>
        </div>
        
        {showProgress && nextLeagueCode && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to {nextLeagueCode.charAt(0).toUpperCase() + nextLeagueCode.slice(1)} League</span>
                <span className="text-accent font-semibold">{pointsToNext} points to go</span>
              </div>
              <Progress value={pct} className="h-2" />
            </div>
          </>
        )}

        <div className="pt-2 border-t border-terminal-border">
          <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
            <span>Keep performing to climb the leagues!</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
