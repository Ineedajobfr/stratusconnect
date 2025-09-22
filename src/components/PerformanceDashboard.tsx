import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Clock, 
  Users, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Download,
  BarChart3,
  Bot,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';
import { usePerformanceMonitoring } from '@/lib/performance-monitoring';

interface PerformanceDashboardProps {
  className?: string;
}

export default function PerformanceDashboard({ className = "" }: PerformanceDashboardProps) {
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [userAnalytics, setUserAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getPerformanceSummary, getUserAnalyticsSummary } = usePerformanceMonitoring();

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      try {
        const perfSummary = getPerformanceSummary();
        const userSummary = getUserAnalyticsSummary();
        
        setPerformanceData(perfSummary);
        setUserAnalytics(userSummary);
      } catch (error) {
        console.error('Error loading performance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [getPerformanceSummary, getUserAnalyticsSummary]);

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getPerformanceColor = (value: number, threshold: number) => {
    if (value <= threshold) return 'text-green-500';
    if (value <= threshold * 1.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin text-accent" />
          <span className="ml-2 text-muted-foreground">Loading performance data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Performance Dashboard</h2>
          <p className="text-muted-foreground">Real-time system performance and user analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Response Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {performanceData ? formatTime(performanceData.averageResponseTime) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average across all requests
            </p>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(
              performanceData?.errorRate * 100 || 0, 
              5
            )}`}>
              {performanceData ? `${(performanceData.errorRate * 100).toFixed(2)}%` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              System error rate
            </p>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {userAnalytics?.totalUsers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Current session
            </p>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Session Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {userAnalytics ? formatTime(userAnalytics.averageSessionTime) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average per user
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Analytics */}
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              User Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Most Active User Type</span>
                <Badge variant="outline">{userAnalytics?.mostActiveUserType || 'N/A'}</Badge>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">Top Actions</span>
                <div className="space-y-1">
                  {userAnalytics?.topActions?.slice(0, 5).map((action: string, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{action}</span>
                      <span className="text-foreground">#{index + 1}</span>
                    </div>
                  )) || <span className="text-sm text-muted-foreground">No data available</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Details */}
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Performance Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Metrics</span>
                <span className="text-foreground font-medium">{performanceData?.totalMetrics || 0}</span>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">Slowest Queries</span>
                <div className="space-y-1">
                  {performanceData?.topSlowQueries?.slice(0, 3).map((query: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground truncate">{query.name}</span>
                      <span className="text-foreground">{formatTime(query.value)}</span>
                    </div>
                  )) || <span className="text-sm text-muted-foreground">No data available</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Monitor className="w-8 h-8 text-green-500" />
              </div>
              <h4 className="font-medium text-foreground">Desktop</h4>
              <p className="text-sm text-muted-foreground">Optimal performance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Smartphone className="w-8 h-8 text-yellow-500" />
              </div>
              <h4 className="font-medium text-foreground">Mobile</h4>
              <p className="text-sm text-muted-foreground">Good performance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Bot className="w-8 h-8 text-blue-500" />
              </div>
              <h4 className="font-medium text-foreground">AI System</h4>
              <p className="text-sm text-muted-foreground">Ultra-fast responses</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
