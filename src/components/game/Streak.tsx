import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Shield, Trophy, Zap } from 'lucide-react';
import { getUserStreak } from '@/lib/xp-engine';

interface StreakProps {
  userId: string;
  className?: string;
}

export function Continuity({ userId, className = "" }: StreakProps) {
  const [streak, setStreak] = useState({
    currentStreak: 0,
    bestStreak: 0,
    sheltersAvailable: 0,
    lastScoredDate: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const data = await getUserStreak(userId);
        setStreak(data);
      } catch (error) {
        console.error('Failed to fetch streak:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, [userId]);

  if (loading) {
    return (
      <Card className={`terminal-card ${className}`}>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { currentStreak, bestStreak, sheltersAvailable } = streak;
  
  // Calculate multiplier
  const multiplier = currentStreak >= 14 ? 2.0 : 
                    currentStreak >= 7 ? 1.5 : 
                    currentStreak >= 3 ? 1.2 : 1.0;

  const multiplierText = `×${multiplier}`;
  const multiplierColor = multiplier >= 2.0 ? "text-yellow-500" : 
                         multiplier >= 1.5 ? "text-orange-500" : 
                         multiplier >= 1.2 ? "text-green-500" : "text-muted-foreground";

  return (
    <Card className={`terminal-card border-accent/30 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Flame className={`w-5 h-5 ${currentStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
              <span className="text-sm text-muted-foreground">Daily Continuity</span>
            </div>
            
            <div className="flex items-center space-x-3 mb-2">
              <div className="text-3xl font-bold text-foreground accent-glow">
                {currentStreak}
              </div>
              <Badge 
                variant="outline" 
                className={`${multiplierColor} border-current`}
              >
                {multiplierText}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4" />
                <span>Best {bestStreak}</span>
              </div>
              {sheltersAvailable > 0 && (
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>{sheltersAvailable} shelter{sheltersAvailable !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-1">Keep flying</div>
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">
                {currentStreak > 0 ? 'Active!' : 'Start Continuity'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Continuity progress bar */}
        {currentStreak > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Continuity Progress</span>
              <span>{currentStreak} days</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, (currentStreak / 14) * 100)}%` 
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {currentStreak < 14 ? `${14 - currentStreak} days to max multiplier` : 'Max multiplier reached!'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
