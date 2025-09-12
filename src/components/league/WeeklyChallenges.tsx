import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDemoChallenges } from '@/lib/demo-gamification-data';
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
  const challenges = getDemoChallenges();
  
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
          {challenges.map((challenge) => {
            const IconComponent = challengeIcons[challenge.id as keyof typeof challengeIcons] || Zap;
            
            return (
              <div 
                key={challenge.id} 
                className={`terminal-card p-4 transition-colors ${
                  challenge.completed 
                    ? 'bg-accent/10 border-accent/30' 
                    : 'hover:border-accent/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      challenge.completed ? 'bg-accent text-white' : 'bg-accent/20'
                    }`}>
                      {challenge.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <IconComponent className="w-5 h-5 text-accent icon-glow" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground mb-1">
                        {challenge.name}
                      </div>
                      <div className="text-sm text-muted-foreground subtitle-glow mb-2">
                        {challenge.description}
                      </div>
                      {!challenge.completed && challenge.progress !== undefined && (
                        <div className="w-full bg-terminal-border rounded-full h-1.5">
                          <div 
                            className="bg-accent h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${challenge.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant={challenge.completed ? "default" : "outline"}
                    className={challenge.completed ? "bg-accent" : "text-accent border-accent/30"}
                  >
                    {challenge.completed ? "✓" : `+${challenge.points}`}
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
