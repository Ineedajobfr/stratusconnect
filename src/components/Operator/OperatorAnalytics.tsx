import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Users, 
  Plane, 
  MapPin,
  Star,
  Calendar,
  Target,
  Award,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  target?: number;
}

interface TopCrew {
  id: string;
  name: string;
  type: 'pilot' | 'crew';
  rating: number;
  flights: number;
  earnings: number;
  lastFlight: string;
}

interface RegionPerformance {
  region: string;
  flights: number;
  earnings: number;
  utilization: number;
  avgResponseTime: number;
}

interface MonthlyTrend {
  month: string;
  flights: number;
  earnings: number;
  utilization: number;
  responseTime: number;
}

export default function OperatorAnalytics({ terminalType }: { terminalType: string }) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const [performanceMetrics] = useState<PerformanceMetric[]>([
    {
      id: 'metric-001',
      name: 'Average Response Time',
      value: 2.3,
      previousValue: 3.1,
      unit: 'hours',
      trend: 'up',
      target: 2.0
    },
    {
      id: 'metric-002',
      name: 'Fleet Utilization',
      value: 78,
      previousValue: 72,
      unit: '%',
      trend: 'up',
      target: 85
    },
    {
      id: 'metric-003',
      name: 'Cost Per Flight Hour',
      value: 1250,
      previousValue: 1180,
      unit: '£',
      trend: 'down',
      target: 1200
    },
    {
      id: 'metric-004',
      name: 'Client Satisfaction',
      value: 4.8,
      previousValue: 4.6,
      unit: '/5',
      trend: 'up',
      target: 4.9
    },
    {
      id: 'metric-005',
      name: 'Crew Retention Rate',
      value: 92,
      previousValue: 88,
      unit: '%',
      trend: 'up',
      target: 90
    },
    {
      id: 'metric-006',
      name: 'On-Time Performance',
      value: 96,
      previousValue: 94,
      unit: '%',
      trend: 'up',
      target: 95
    }
  ]);

  const [topCrew] = useState<TopCrew[]>([
    {
      id: 'crew-001',
      name: 'Captain James Mitchell',
      type: 'pilot',
      rating: 4.9,
      flights: 45,
      earnings: 54000,
      lastFlight: '2025-09-19'
    },
    {
      id: 'crew-002',
      name: 'Sophie Chen',
      type: 'crew',
      rating: 4.8,
      flights: 38,
      earnings: 19000,
      lastFlight: '2025-09-18'
    },
    {
      id: 'crew-003',
      name: 'Captain Sarah Johnson',
      type: 'pilot',
      rating: 4.7,
      flights: 42,
      earnings: 50400,
      lastFlight: '2025-09-17'
    },
    {
      id: 'crew-004',
      name: 'Maria Rodriguez',
      type: 'crew',
      rating: 4.6,
      flights: 35,
      earnings: 17500,
      lastFlight: '2025-09-16'
    }
  ]);

  const [regionPerformance] = useState<RegionPerformance[]>([
    {
      region: 'Europe',
      flights: 45,
      earnings: 125000,
      utilization: 82,
      avgResponseTime: 1.8
    },
    {
      region: 'North America',
      flights: 32,
      earnings: 98000,
      utilization: 75,
      avgResponseTime: 2.1
    },
    {
      region: 'Middle East',
      flights: 18,
      earnings: 67000,
      utilization: 88,
      avgResponseTime: 1.5
    },
    {
      region: 'Asia',
      flights: 12,
      earnings: 45000,
      utilization: 70,
      avgResponseTime: 2.8
    }
  ]);

  const [monthlyTrends] = useState<MonthlyTrend[]>([
    { month: 'Sep 2025', flights: 107, earnings: 335000, utilization: 78, responseTime: 2.3 },
    { month: 'Aug 2025', flights: 98, earnings: 298000, utilization: 72, responseTime: 3.1 },
    { month: 'Jul 2025', flights: 112, earnings: 342000, utilization: 81, responseTime: 2.8 },
    { month: 'Jun 2025', flights: 89, earnings: 267000, utilization: 68, responseTime: 3.5 }
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPerformanceColor = (value: number, target?: number) => {
    if (!target) return 'text-foreground';
    if (value >= target) return 'text-green-400';
    if (value >= target * 0.9) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              Analytics & Insights
            </CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="h-9 px-3 py-1 bg-terminal-card border border-terminal-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {performanceMetrics.map(metric => (
          <Card key={metric.id} className="terminal-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{metric.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${getPerformanceColor(metric.value, metric.target)}`}>
                      {metric.value}{metric.unit}
                    </span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                      {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                      {Math.abs(metric.value - metric.previousValue).toFixed(1)}{metric.unit}
                    </span>
                    <span className="text-xs text-muted-foreground">vs last period</span>
                  </div>
                </div>
                {metric.target && (
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Target</div>
                    <div className="text-sm font-medium">{metric.target}{metric.unit}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Performing Crew */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            Top Performing Crew
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCrew.map((crew, index) => (
              <div key={crew.id} className="p-4 border rounded-lg hover:bg-terminal-card/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-accent/20 text-accent rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-foreground">{crew.name}</h3>
                        <Badge variant="outline">
                          {crew.type.toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{crew.rating}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Flights</p>
                          <p className="font-medium">{crew.flights}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Earnings</p>
                          <p className="font-medium">£{crew.earnings.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Flight</p>
                          <p className="font-medium">{new Date(crew.lastFlight).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regional Performance */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            Regional Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regionPerformance.map(region => (
              <div key={region.region} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{region.region}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={region.utilization >= 80 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}>
                      {region.utilization}% utilization
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Flights</p>
                    <p className="text-lg font-bold text-accent">{region.flights}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Earnings</p>
                    <p className="text-lg font-bold text-accent">£{region.earnings.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Utilization</p>
                    <p className="text-lg font-bold text-accent">{region.utilization}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                    <p className="text-lg font-bold text-accent">{region.avgResponseTime}h</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Monthly Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyTrends.map((trend, index) => (
              <div key={trend.month} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{trend.month}</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Earnings</p>
                      <p className="text-lg font-bold text-accent">£{trend.earnings.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Flights</p>
                      <p className="text-lg font-bold text-accent">{trend.flights}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Utilization</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-accent h-2 rounded-full" 
                          style={{ width: `${trend.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{trend.utilization}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Response Time</p>
                    <p className="text-sm font-medium">{trend.responseTime}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg per Flight</p>
                    <p className="text-sm font-medium">£{Math.round(trend.earnings / trend.flights).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-400 mb-1">Performance Improvement</h4>
                  <p className="text-sm text-foreground">
                    Your response time has improved by 26% this month. Consider expanding to the Middle East region where response times are fastest (1.5h average).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-1">Optimization Opportunity</h4>
                  <p className="text-sm text-foreground">
                    Asia region shows lower utilization (70%) but higher response times (2.8h). Consider adding more crew members or adjusting pricing strategy.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-400 mb-1">Crew Excellence</h4>
                  <p className="text-sm text-foreground">
                    Captain James Mitchell and Sophie Chen are your top performers. Consider offering them priority assignments and higher rates to retain them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
