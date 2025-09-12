import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Building2,
  Plane,
  UserCheck,
  Award,
  Lock,
  Eye,
  FileText
} from 'lucide-react';
import { XP_RULES, WEEKLY_CHALLENGES, PROMOTE_TOP_PCT, DEMOTE_BOTTOM_PCT } from '@/lib/league-constants';

export default function RankingRules() {
  const brokerEvents = Object.entries(XP_RULES).filter(([key]) => 
    key.includes('rfq') || key.includes('saved_search') || key.includes('quote_accepted') || key.includes('deal_closed')
  );

  const operatorEvents = Object.entries(XP_RULES).filter(([key]) => 
    key.includes('quote_submitted') || key.includes('flight_completed') || key.includes('fallthrough')
  );

  const pilotCrewEvents = Object.entries(XP_RULES).filter(([key]) => 
    key.includes('credentials') || key.includes('assignment') || key.includes('review')
  );

  const everyoneEvents = Object.entries(XP_RULES).filter(([key]) => 
    key.includes('kyc') || key.includes('compliance') || key.includes('community')
  );

  return (
    <div className="min-h-screen bg-app text-body">
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground title-glow">
            Ranking Rules
          </h1>
          <p className="text-xl text-muted-foreground subtitle-glow max-w-3xl mx-auto">
            A weekly league that rewards verified users for the behavior that makes Stratus win. 
            Fast. Reliable. Compliant. No paywalls. No gimmicks. You perform, you rise.
          </p>
        </div>

        {/* Key Principles */}
        <Card className="terminal-card border-accent border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 title-glow">
              <Shield className="w-6 h-6 text-accent" />
              <span>Core Principles</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Merit-Based Scoring</h3>
                <p className="text-sm text-muted-foreground">
                  Every point is tied to a real event in the product. The system logs it with time, deal, and user. 
                  If an event cannot be proven, it does not score.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Verification Required</h3>
                <p className="text-sm text-muted-foreground">
                  Unverified users cannot earn points. Verification flips you into Bronze and starts your first season.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Weekly Seasons</h3>
                <p className="text-sm text-muted-foreground">
                  Runs Monday to Sunday in UTC. Points reset each week. League placement can change at the end.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Transparent Movement</h3>
                <p className="text-sm text-muted-foreground">
                  Top {Math.round(PROMOTE_TOP_PCT * 100)}% move up one league. Bottom {Math.round(DEMOTE_BOTTOM_PCT * 100)}% move down. The rest hold.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How You Earn Points */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground title-glow">How You Earn Points</h2>
          
          {/* Brokers */}
          <Card className="terminal-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 title-glow">
                <Building2 className="w-6 h-6 text-accent" />
                <span>Brokers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {brokerEvents.map(([event, points]) => (
                  <div key={event} className="flex items-center justify-between p-4 bg-terminal-card/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-accent/20 rounded-lg">
                        <Target className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getEventDescription(event)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-accent">
                      +{points}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Operators */}
          <Card className="terminal-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 title-glow">
                <Plane className="w-6 h-6 text-accent" />
                <span>Operators</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operatorEvents.map(([event, points]) => (
                  <div key={event} className="flex items-center justify-between p-4 bg-terminal-card/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-accent/20 rounded-lg">
                        <Plane className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getEventDescription(event)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-accent">
                      +{points}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pilots & Crew */}
          <Card className="terminal-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 title-glow">
                <UserCheck className="w-6 h-6 text-accent" />
                <span>Pilots & Crew</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pilotCrewEvents.map(([event, points]) => (
                  <div key={event} className="flex items-center justify-between p-4 bg-terminal-card/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-accent/20 rounded-lg">
                        <UserCheck className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getEventDescription(event)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-accent">
                      +{points}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Everyone */}
          <Card className="terminal-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 title-glow">
                <Users className="w-6 h-6 text-accent" />
                <span>Everyone</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {everyoneEvents.map(([event, points]) => (
                  <div key={event} className="flex items-center justify-between p-4 bg-terminal-card/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-accent/20 rounded-lg">
                        <Users className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getEventDescription(event)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-accent">
                      +{points}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Challenges */}
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 title-glow">
              <Award className="w-6 h-6 text-accent" />
              <span>Weekly Merit Targets</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {WEEKLY_CHALLENGES.map((challenge, index) => (
                <div key={challenge.code} className="flex items-center justify-between p-4 bg-terminal-card/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <Award className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{challenge.label}</div>
                      <div className="text-sm text-muted-foreground">{challenge.description}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-accent">
                    +{challenge.points}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Anti-Gaming Measures */}
        <Card className="terminal-card border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 title-glow">
              <Lock className="w-6 h-6 text-red-500" />
              <span>Anti-Gaming Measures</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Server Validation</h3>
                <p className="text-sm text-muted-foreground">
                  Server checks on every event. Time windows are enforced from audit logs.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Throttling</h3>
                <p className="text-sm text-muted-foreground">
                  Throttles on actions that could be spammed. One score per deal per rule.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Verification Gates</h3>
                <p className="text-sm text-muted-foreground">
                  No points if credentials are expired or KYC is not complete.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Fraud Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Manual clawback if fraud is detected. Logged and visible.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What You Earn */}
        <Card className="terminal-card border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 title-glow">
              <Award className="w-6 h-6 text-green-500" />
              <span>What You Earn</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              This is merit, not money. All perks sit inside compliance.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Early Access</h3>
                <p className="text-sm text-muted-foreground">
                  Earlier access to high value RFQs as you rise.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Ranking Bias</h3>
                <p className="text-sm text-muted-foreground">
                  Small ranking bias on marketplace results when your recent metrics are strong.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Priority Support</h3>
                <p className="text-sm text-muted-foreground">
                  Faster support response for top leagues.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Profile Badges</h3>
                <p className="text-sm text-muted-foreground">
                  Profile badges that signal reliability.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fairness & Transparency */}
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 title-glow">
              <Eye className="w-6 h-6 text-accent" />
              <span>Fairness & Transparency</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Public Scoring</h3>
                <p className="text-sm text-muted-foreground">
                  Points are public. Evidence is stored. Your season log shows each scored event.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Dispute Resolution</h3>
                <p className="text-sm text-muted-foreground">
                  Disputes about points go through the standard dispute lane.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Privacy Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Only performance data inside Stratus is used. GDPR rights remain.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Leaderboard Privacy</h3>
                <p className="text-sm text-muted-foreground">
                  Leaderboard shows display names and league only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Message */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-2xl font-bold text-foreground title-glow">
            This is not a game.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            It is a scoreboard that turns discipline into advantage. It makes good actors faster and more visible. 
            It keeps everyone inside the rails.
          </p>
          <p className="text-accent font-semibold text-xl">
            There can be no doubt. When the lion is hungry, he eats.
          </p>
        </div>
      </main>
    </div>
  );
}

// Helper function to get event descriptions
function getEventDescription(event: string): string {
  const descriptions: Record<string, string> = {
    'rfq_posted_quality': 'Post RFQ that passes basic quality checks',
    'saved_search_response': 'Act on saved search alert within target time',
    'quote_accepted': 'Get a quote accepted',
    'deal_closed_on_time': 'Close deal on time with no dispute',
    'quote_submitted_fast': 'Submit quote within target time window',
    'flight_completed_on_time': 'Complete flight on time',
    'deal_closed_no_dispute': 'Close with no dispute',
    'fallthrough_recovered': 'Recover fallthrough using re-market',
    'credentials_valid': 'Keep credentials valid',
    'assignment_completed_on_time': 'Accept and complete assignments on time',
    'positive_review_received': 'Receive verified positive counterpart review',
    'kyc_completed': 'Complete KYC',
    'compliance_status_clean': 'Maintain clean compliance status',
    'community_helpful': 'Admin-awarded for real help in dispute/rescue'
  };
  
  return descriptions[event] || 'Earn points for this activity';
}
