import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  Clock, 
  Shield, 
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { PerformanceMetrics, calculatePerformanceScore, LEAGUE_RULES } from '@/lib/league-config';

interface PerformanceDashboardProps {
  metrics: PerformanceMetrics;
  showTargets?: boolean;
}

export function PerformanceDashboard({ metrics, showTargets = true }: PerformanceDashboardProps) {
  const performanceScore = calculatePerformanceScore(metrics);
  const scoreColor = performanceScore >= 0.8 ? 'text-green-500' : 
                    performanceScore >= 0.6 ? 'text-yellow-500' : 'text-red-500';

  const getTargetStatus = (current: number, target: number, higherIsBetter: boolean = true) => {
    const ratio = higherIsBetter ? current / target : target / current;
    if (ratio >= 1) return { status: 'achieved', color: 'text-green-500' };
    if (ratio >= 0.8) return { status: 'close', color: 'text-yellow-500' };
    return { status: 'needs-work', color: 'text-red-500' };
  };

  const metricsData = [
    {
      key: 'timeToFirstQuote',
      label: 'Time to First Quote',
      value: `${metrics.timeToFirstQuote.toFixed(1)}m`,
      target: `≤ ${LEAGUE_RULES.targets.timeToFirstQuote}m`,
      icon: Clock,
      higherIsBetter: false,
      description: 'Median time to first quote submission'
    },
    {
      key: 'quoteResponseRate',
      label: 'Quote Response Rate',
      value: `${(metrics.quoteResponseRate * 100).toFixed(1)}%`,
      target: `≥ ${(LEAGUE_RULES.targets.quoteResponseRate * 100)}%`,
      icon: Target,
      higherIsBetter: true,
      description: 'Percentage of RFQs that receive quotes'
    },
    {
      key: 'dealConversion',
      label: 'Deal Conversion',
      value: `${(metrics.dealConversion * 100).toFixed(1)}%`,
      target: `≥ ${(LEAGUE_RULES.targets.dealConversion * 100)}%`,
      icon: TrendingUp,
      higherIsBetter: true,
      description: 'Percentage of quotes that convert to deals'
    },
    {
      key: 'disputeRate',
      label: 'Dispute Rate',
      value: `${(metrics.disputeRate * 100).toFixed(2)}%`,
      target: `≤ ${(LEAGUE_RULES.targets.disputeRate * 100)}%`,
      icon: AlertTriangle,
      higherIsBetter: false,
      description: 'Percentage of deals with disputes'
    },
    {
      key: 'onPlatformSettlement',
      label: 'On-Platform Settlement',
      value: `${(metrics.onPlatformSettlement * 100).toFixed(1)}%`,
      target: `≥ ${(LEAGUE_RULES.targets.onPlatformSettlement * 100)}%`,
      icon: DollarSign,
      higherIsBetter: true,
      description: 'Percentage of wins settled on-platform'
    },
    {
      key: 'leakageBlocked',
      label: 'Leakage Blocked',
      value: `${(metrics.leakageBlocked * 100).toFixed(1)}%`,
      target: `≥ ${(LEAGUE_RULES.targets.leakageBlocked * 100)}%`,
      icon: Shield,
      higherIsBetter: true,
      description: 'Percentage of leakage attempts caught'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Performance Score */}
      <Card className="terminal-card border-accent border-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 title-glow">
            <BarChart3 className="w-6 h-6 text-accent" />
            <span>League Performance Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className={`text-4xl font-bold ${scoreColor} accent-glow`}>
              {(performanceScore * 100).toFixed(1)}%
            </div>
            <div className="text-muted-foreground">
              {performanceScore >= 0.8 ? 'Excellent - All targets met' :
               performanceScore >= 0.6 ? 'Good - Most targets met' :
               'Needs improvement - Several targets below threshold'}
            </div>
            <Progress value={performanceScore * 100} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricsData.map((metric) => {
          const status = getTargetStatus(
            metric.key === 'timeToFirstQuote' ? metrics.timeToFirstQuote :
            metric.key === 'quoteResponseRate' ? metrics.quoteResponseRate :
            metric.key === 'dealConversion' ? metrics.dealConversion :
            metric.key === 'disputeRate' ? metrics.disputeRate :
            metric.key === 'onPlatformSettlement' ? metrics.onPlatformSettlement :
            metrics.leakageBlocked,
            LEAGUE_RULES.targets[metric.key as keyof typeof LEAGUE_RULES.targets],
            metric.higherIsBetter
          );

          const IconComponent = metric.icon;

          return (
            <Card key={metric.key} className="terminal-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-5 h-5 text-accent" />
                    <span className="text-lg">{metric.label}</span>
                  </div>
                  <Badge 
                    variant={status.status === 'achieved' ? 'default' : 'outline'}
                    className={status.color}
                  >
                    {status.status === 'achieved' ? '✓' : 
                     status.status === 'close' ? '~' : '!'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold text-foreground">
                  {metric.value}
                </div>
                {showTargets && (
                  <div className="text-sm text-muted-foreground">
                    Target: {metric.target}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {metric.description}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* League Distribution */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 title-glow">
            <Users className="w-6 h-6 text-accent" />
            <span>League Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(metrics.leagueDistribution).map(([league, count]) => {
              const percentage = (count / metrics.activeUsers) * 100;
              return (
                <div key={league} className="text-center space-y-2">
                  <div className="text-2xl font-bold text-accent accent-glow">
                    {count}
                  </div>
                  <div className="text-sm font-semibold text-foreground capitalize">
                    {league} League
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {percentage.toFixed(1)}%
                  </div>
                  <Progress value={percentage} className="h-1" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 title-glow">
            <CheckCircle className="w-6 h-6 text-accent" />
            <span>Weekly Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent accent-glow">
                {metrics.activeUsers.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                {metrics.totalPointsAwarded.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Points Awarded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                {Math.round(metrics.totalPointsAwarded / metrics.activeUsers)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Points/User</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Demo performance metrics
export const DEMO_PERFORMANCE_METRICS: PerformanceMetrics = {
  timeToFirstQuote: 8.5,           // 8.5 minutes (target: ≤10m) ✓
  quoteResponseRate: 0.65,         // 65% (target: ≥60%) ✓
  dealConversion: 0.19,            // 19% (target: ≥18%) ✓
  disputeRate: 0.008,              // 0.8% (target: ≤1%) ✓
  onPlatformSettlement: 0.96,      // 96% (target: ≥95%) ✓
  leakageBlocked: 0.92,            // 92% (target: ≥90%) ✓
  activeUsers: 1247,
  totalPointsAwarded: 45678,
  leagueDistribution: {
    bronze: 156,
    silver: 234,
    gold: 345,
    platinum: 298,
    emerald: 156,
    diamond: 58
  }
};
