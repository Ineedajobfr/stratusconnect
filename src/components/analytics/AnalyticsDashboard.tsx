import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Plane, 
  DollarSign,
  Clock,
  Activity,
  Target,
  Zap,
  Globe,
  Calendar
} from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalJobs: number;
  activeJobs: number;
  totalRevenue: number;
  monthlyRevenue: number;
  conversionRate: number;
  averageResponseTime: number;
  userGrowth: number;
  jobGrowth: number;
  revenueGrowth: number;
}

interface TimeSeriesData {
  date: string;
  users: number;
  jobs: number;
  revenue: number;
  applications: number;
}

interface TopPerformer {
  id: string;
  name: string;
  type: 'user' | 'job' | 'company';
  metric: string;
  value: number;
  growth: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    averageResponseTime: 0,
    userGrowth: 0,
    jobGrowth: 0,
    revenueGrowth: 0
  });
  
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    // Mock analytics data
    const mockAnalytics: AnalyticsData = {
      totalUsers: 1250,
      activeUsers: 890,
      totalJobs: 340,
      activeJobs: 156,
      totalRevenue: 2500000,
      monthlyRevenue: 180000,
      conversionRate: 12.5,
      averageResponseTime: 2.3,
      userGrowth: 15.2,
      jobGrowth: 8.7,
      revenueGrowth: 22.1
    };

    const mockTimeSeries: TimeSeriesData[] = [
      { date: '2024-01-01', users: 1000, jobs: 200, revenue: 150000, applications: 450 },
      { date: '2024-01-08', users: 1050, jobs: 220, revenue: 165000, applications: 480 },
      { date: '2024-01-15', users: 1100, jobs: 240, revenue: 180000, applications: 520 },
      { date: '2024-01-22', users: 1150, jobs: 260, revenue: 195000, applications: 560 },
      { date: '2024-01-29', users: 1200, jobs: 280, revenue: 210000, applications: 600 },
      { date: '2024-02-05', users: 1250, jobs: 300, revenue: 225000, applications: 640 },
      { date: '2024-02-12', users: 1300, jobs: 320, revenue: 240000, applications: 680 },
      { date: '2024-02-19', users: 1350, jobs: 340, revenue: 255000, applications: 720 }
    ];

    const mockTopPerformers: TopPerformer[] = [
      { id: '1', name: 'Captain Sarah Johnson', type: 'user', metric: 'Jobs Completed', value: 45, growth: 12.5 },
      { id: '2', name: 'Elite Aviation Brokers', type: 'company', metric: 'Revenue Generated', value: 850000, growth: 18.3 },
      { id: '3', name: 'Gulfstream G650 Pilot', type: 'job', metric: 'Applications', value: 89, growth: 25.7 },
      { id: '4', name: 'SkyHigh Operations', type: 'company', metric: 'Active Jobs', value: 23, growth: 8.9 },
      { id: '5', name: 'First Officer Mike Chen', type: 'user', metric: 'Response Time', value: 1.2, growth: -15.2 }
    ];

    setAnalyticsData(mockAnalytics);
    setTimeSeriesData(mockTimeSeries);
    setTopPerformers(mockTopPerformers);
    setLoading(false);
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-500';
    if (growth < 0) return 'text-red-500';
    return 'text-terminal-muted';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4" />;
    if (growth < 0) return <TrendingDown className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terminal-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-terminal-fg">Analytics Dashboard</h1>
          <p className="text-terminal-muted">Comprehensive platform performance metrics</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={timeRange === '7d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('7d')}
            className={timeRange === '7d' ? 'bg-terminal-accent' : 'border-terminal-border text-terminal-fg'}
          >
            7D
          </Button>
          <Button 
            variant={timeRange === '30d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('30d')}
            className={timeRange === '30d' ? 'bg-terminal-accent' : 'border-terminal-border text-terminal-fg'}
          >
            30D
          </Button>
          <Button 
            variant={timeRange === '90d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('90d')}
            className={timeRange === '90d' ? 'bg-terminal-accent' : 'border-terminal-border text-terminal-fg'}
          >
            90D
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-terminal-bg border-terminal-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-terminal-accent" />
              <div>
                <p className="text-sm text-terminal-muted">Total Users</p>
                <p className="text-2xl font-bold text-terminal-fg">{formatNumber(analyticsData.totalUsers)}</p>
                <div className="flex items-center space-x-1">
                  {getGrowthIcon(analyticsData.userGrowth)}
                  <span className={`text-sm ${getGrowthColor(analyticsData.userGrowth)}`}>
                    {formatPercentage(analyticsData.userGrowth)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-bg border-terminal-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Plane className="h-8 w-8 text-terminal-accent" />
              <div>
                <p className="text-sm text-terminal-muted">Active Jobs</p>
                <p className="text-2xl font-bold text-terminal-fg">{formatNumber(analyticsData.activeJobs)}</p>
                <div className="flex items-center space-x-1">
                  {getGrowthIcon(analyticsData.jobGrowth)}
                  <span className={`text-sm ${getGrowthColor(analyticsData.jobGrowth)}`}>
                    {formatPercentage(analyticsData.jobGrowth)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-bg border-terminal-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-terminal-accent" />
              <div>
                <p className="text-sm text-terminal-muted">Monthly Revenue</p>
                <p className="text-2xl font-bold text-terminal-fg">{formatCurrency(analyticsData.monthlyRevenue)}</p>
                <div className="flex items-center space-x-1">
                  {getGrowthIcon(analyticsData.revenueGrowth)}
                  <span className={`text-sm ${getGrowthColor(analyticsData.revenueGrowth)}`}>
                    {formatPercentage(analyticsData.revenueGrowth)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-bg border-terminal-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-terminal-accent" />
              <div>
                <p className="text-sm text-terminal-muted">Conversion Rate</p>
                <p className="text-2xl font-bold text-terminal-fg">{analyticsData.conversionRate}%</p>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+2.1%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-terminal-bg border-terminal-border">
          <CardHeader>
            <CardTitle className="text-terminal-fg">User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-terminal-muted">Active Users</span>
                  <span className="text-terminal-fg">{formatNumber(analyticsData.activeUsers)}</span>
                </div>
                <Progress 
                  value={(analyticsData.activeUsers / analyticsData.totalUsers) * 100} 
                  className="h-2 mt-1"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-terminal-muted">Response Time</span>
                  <span className="text-terminal-fg">{analyticsData.averageResponseTime}s</span>
                </div>
                <Progress 
                  value={Math.max(0, 100 - (analyticsData.averageResponseTime * 20))} 
                  className="h-2 mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-bg border-terminal-border">
          <CardHeader>
            <CardTitle className="text-terminal-fg">Job Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-terminal-muted">Job Fill Rate</span>
                  <span className="text-terminal-fg">78%</span>
                </div>
                <Progress value={78} className="h-2 mt-1" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-terminal-muted">Average Applications</span>
                  <span className="text-terminal-fg">12.3</span>
                </div>
                <Progress value={75} className="h-2 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-bg border-terminal-border">
          <CardHeader>
            <CardTitle className="text-terminal-fg">Revenue Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-terminal-muted">Total Revenue</span>
                  <span className="text-terminal-fg">{formatCurrency(analyticsData.totalRevenue)}</span>
                </div>
                <Progress value={85} className="h-2 mt-1" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-terminal-muted">Growth Rate</span>
                  <span className="text-terminal-fg">{formatPercentage(analyticsData.revenueGrowth)}</span>
                </div>
                <Progress value={analyticsData.revenueGrowth} className="h-2 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="bg-terminal-bg border-terminal-border">
        <CardHeader>
          <CardTitle className="text-terminal-fg">Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={performer.id} className="flex items-center justify-between p-4 border border-terminal-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-terminal-accent/20 text-terminal-accent rounded-full">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-terminal-fg">{performer.name}</h3>
                    <p className="text-sm text-terminal-muted">{performer.metric}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-semibold text-terminal-fg">
                    {typeof performer.value === 'number' && performer.value > 1000 
                      ? formatCurrency(performer.value)
                      : formatNumber(performer.value)
                    }
                  </p>
                  <div className="flex items-center space-x-1">
                    {getGrowthIcon(performer.growth)}
                    <span className={`text-sm ${getGrowthColor(performer.growth)}`}>
                      {formatPercentage(performer.growth)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Series Chart Placeholder */}
      <Card className="bg-terminal-bg border-terminal-border">
        <CardHeader>
          <CardTitle className="text-terminal-fg">Growth Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border border-terminal-border rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-terminal-muted mx-auto mb-4" />
              <p className="text-terminal-muted">Chart visualization would be implemented here</p>
              <p className="text-sm text-terminal-muted">Data points: {timeSeriesData.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
