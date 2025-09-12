import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  CheckCircle, 
  Clock, 
  Zap, 
  RefreshCw,
  Trophy
} from 'lucide-react';
import { getUserDailyQuests, updateQuestProgress, awardBriefingBonus } from '@/lib/xp-engine';

interface DailyQuestsProps {
  userId: string;
  userRole: string;
  className?: string;
}

interface Briefing {
  id: string;
  quest_code: string;
  quest_type: string;
  target_count: number;
  current_count: number;
  completed: boolean;
  xp_bonus: number;
  assigned_date: string;
  completed_at?: string;
}

export default function DailyBriefing({ userId, userRole, className = "" }: DailyQuestsProps) {
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchBriefings = async () => {
      try {
        const data = await getUserDailyQuests(userId);
        setBriefings(data);
      } catch (error) {
        console.error('Failed to fetch daily briefings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBriefings();
  }, [userId]);

  const handleBriefingAction = async (briefing: Briefing) => {
    if (briefing.completed) return;

    setUpdating(briefing.id);
    try {
      // Update briefing progress
      await updateQuestProgress(userId, briefing.quest_code, 1);
      
      // Award bonus if completed
      if (briefing.current_count + 1 >= briefing.target_count) {
        await awardBriefingBonus(userId, briefing.quest_code, briefing.xp_bonus);
      }

      // Refresh briefings
      const updatedBriefings = await getUserDailyQuests(userId);
      setBriefings(updatedBriefings);
    } catch (error) {
      console.error('Failed to update briefing:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getQuestIcon = (questCode: string) => {
    switch (questCode) {
      case 'fast_quote': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'saved_alert': return <Target className="w-5 h-5 text-blue-500" />;
      case 'ontime_close': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rfq_quality': return <Trophy className="w-5 h-5 text-purple-500" />;
      case 'credentials_check': return <Clock className="w-5 h-5 text-orange-500" />;
      default: return <Target className="w-5 h-5 text-accent" />;
    }
  };

  const getBriefingLabel = (questCode: string) => {
    switch (questCode) {
      case 'fast_quote': return 'Submit a quote in ≤5 minutes';
      case 'saved_alert': return 'Act on a saved-search alert in ≤10 minutes';
      case 'ontime_close': return 'Complete a deal on time';
      case 'rfq_quality': return 'Post a quality RFQ';
      case 'credentials_check': return 'Keep credentials up to date';
      default: return 'Complete briefing';
    }
  };

  if (loading) {
    return (
      <Card className={`terminal-card ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 title-glow">
            <Target className="w-6 h-6 text-accent" />
            <span>Daily Briefing</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedBriefings = briefings.filter(b => b.completed).length;
  const totalBriefings = briefings.length;

  return (
    <Card className={`terminal-card ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between title-glow">
          <div className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-accent" />
            <span>Daily Briefing</span>
          </div>
          <Badge variant="outline" className="text-accent border-accent">
            {completedBriefings}/{totalBriefings}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Complete briefings to earn bonus Merit Points and maintain Continuity
        </p>
      </CardHeader>
      <CardContent>
        {briefings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No briefings assigned for today</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 button-glow"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {briefings.map((briefing) => {
              const progress = Math.min(100, (briefing.current_count / briefing.target_count) * 100);
              const isCompleted = briefing.completed;
              const isUpdating = updating === briefing.id;

              return (
                <div 
                  key={briefing.id} 
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    isCompleted 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-muted/50 border-terminal-border hover:border-accent/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getQuestIcon(briefing.quest_code)}
                      <div>
                        <div className="font-medium text-foreground">
                          {getBriefingLabel(briefing.quest_code)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {briefing.current_count}/{briefing.target_count} completed
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={isCompleted ? "default" : "outline"}
                        className={isCompleted ? "bg-green-500" : "text-accent border-accent"}
                      >
                        +{briefing.xp_bonus} MP
                      </Badge>
                      
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBriefingAction(briefing)}
                          disabled={isUpdating}
                          className="button-glow"
                        >
                          {isUpdating ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            'Track'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {!isCompleted && (
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {briefing.target_count - briefing.current_count} more to complete
                      </div>
                    </div>
                  )}
                  
                  {isCompleted && briefing.completed_at && (
                    <div className="text-xs text-green-500 flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Completed {new Date(briefing.completed_at).toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Briefing completion summary */}
            {completedBriefings > 0 && (
              <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
                <div className="flex items-center space-x-2 text-accent">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">
                    Great work! {completedBriefings} briefing{completedBriefings !== 1 ? 's' : ''} completed today
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  You've earned {briefings.filter(b => b.completed).reduce((sum, b) => sum + b.xp_bonus, 0)} bonus Merit Points
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
