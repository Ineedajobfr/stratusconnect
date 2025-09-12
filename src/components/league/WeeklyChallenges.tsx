import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WEEKLY_CHALLENGES } from '@/lib/league-constants';
import { Zap, Target, Clock, Shield, CheckCircle } from 'lucide-react';

interface WeeklyChallengesProps {
  onLearn?: () => void;
}

const challengeIcons = {
  quote_submitted_fast: Clock,
  deal_completed_on_time: CheckCircle,
  dispute_free_deal: Shield,
  saved_search_hit_response: Target,
  credentials_up_to_date: Zap,
};

export default function WeeklyChallenges({ onLearn }: WeeklyChallengesProps) {
  return (
    <Card className="terminal-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 title-glow">
            <Zap className="w-6 h-6 text-accent" />
            <span>Weekly Challenges</span>
          </CardTitle>
          {onLearn && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLearn}
              className="button-glow"
            >
              Rules
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {WEEKLY_CHALLENGES.map((challenge) => {
            const IconComponent = challengeIcons[challenge.code as keyof typeof challengeIcons] || Zap;
            
            return (
              <div 
                key={challenge.code} 
                className="terminal-card p-4 hover:border-accent/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <IconComponent className="w-5 h-5 text-accent icon-glow" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground mb-1">
                        {challenge.label}
                      </div>
                      <div className="text-sm text-muted-foreground subtitle-glow">
                        {challenge.description}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-accent border-accent/30"
                  >
                    +{challenge.points}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
          <div className="flex items-center space-x-2 text-sm text-accent">
            <Zap className="w-4 h-4" />
            <span className="font-semibold">Pro Tip:</span>
            <span>Complete multiple challenges to maximize your weekly points and climb the leaderboard!</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
