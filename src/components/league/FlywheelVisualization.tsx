import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Zap, 
  Target, 
  DollarSign, 
  BarChart3, 
  Users,
  Shield,
  TrendingUp
} from 'lucide-react';

export function FlywheelVisualization() {
  const flywheelSteps = [
    {
      id: 'behavior',
      title: 'Better Behaviour',
      description: 'Fast quotes, on-time completion, dispute-free deals',
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'speed',
      title: 'Faster Quotes',
      description: 'Early RFQ access + ranking bias = quicker responses',
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30'
    },
    {
      id: 'wins',
      title: 'More Wins',
      description: 'Better performance = higher conversion rates',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      id: 'deposits',
      title: 'More Deposits',
      description: 'Winning users deposit more, stay longer',
      icon: DollarSign,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      id: 'settlement',
      title: 'On-Platform Settlement',
      description: '95%+ of wins settled on-platform',
      icon: Shield,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    },
    {
      id: 'data',
      title: 'Richer Data',
      description: 'Every action timestamped, auditable, attributable',
      icon: BarChart3,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/30'
    },
    {
      id: 'matching',
      title: 'Sharper Matching',
      description: 'Better algorithms from performance data',
      icon: Users,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/30'
    }
  ];

  return (
    <Card className="terminal-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 title-glow">
          <TrendingUp className="w-6 h-6 text-accent" />
          <span>The Flywheel</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Better behaviour → faster quotes → more wins → more deposits → more on-platform settlement → richer data → sharper matching → better behaviour.
        </p>
        <p className="text-sm text-accent font-semibold">
          You own every step.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Flywheel Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {flywheelSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isLast = index === flywheelSteps.length - 1;
              
              return (
                <div key={step.id} className="relative">
                  <Card className={`terminal-card ${step.bgColor} ${step.borderColor} border-2`}>
                    <CardContent className="p-4 text-center space-y-3">
                      <div className={`mx-auto p-3 rounded-full ${step.bgColor}`}>
                        <IconComponent className={`w-6 h-6 ${step.color}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${step.color}`}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Arrow to next step */}
                  {!isLast && (
                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 z-10">
                      <div className={`p-1 rounded-full ${step.bgColor} border-2 ${step.borderColor}`}>
                        <ArrowRight className={`w-4 h-4 ${step.color}`} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-terminal-border">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-accent accent-glow">
                ≤10m
              </div>
              <div className="text-sm text-muted-foreground">
                Time to First Quote
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-accent accent-glow">
                ≥60%
              </div>
              <div className="text-sm text-muted-foreground">
                Quote Response Rate
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-accent accent-glow">
                ≥95%
              </div>
              <div className="text-sm text-muted-foreground">
                On-Platform Settlement
              </div>
            </div>
          </div>

          {/* Structural Advantages */}
          <div className="space-y-4 pt-6 border-t border-terminal-border">
            <h3 className="text-lg font-semibold text-foreground title-glow">
              Structural Advantages Created
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Zap className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Speed Monopoly</h4>
                    <p className="text-sm text-muted-foreground">
                      Fast actors rise. Early RFQ access and ranking bias mean the quickest, most reliable operators win more.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <DollarSign className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Margin Protection</h4>
                    <p className="text-sm text-muted-foreground">
                      Deposit gate + leagues = fewer leaks. High-tier perks only trigger after deposit or on-platform settlement.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Quality Filters</h4>
                    <p className="text-sm text-muted-foreground">
                      Points come from verifiable events. Bad actors cannot farm points. Disputes and refunds drop.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Data Moat</h4>
                    <p className="text-sm text-muted-foreground">
                      Every scored action is timestamped, auditable, and attributable. That feeds better matching and smarter pricing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Message */}
          <div className="text-center pt-6 border-t border-terminal-border">
            <p className="text-lg text-foreground font-semibold">
              You built a scoreboard that pays in speed, trust, and captured fees.
            </p>
            <p className="text-accent font-bold text-xl mt-2">
              That is advantage. Hold the line, watch the metrics, and keep tuning the levers.
            </p>
            <p className="text-foreground font-semibold text-lg mt-4">
              There can be no doubt. When the lion's hungry, he eats.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
