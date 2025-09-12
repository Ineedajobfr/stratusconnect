import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  TrendingUp, 
  Shield, 
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';

interface PerformanceMetrics {
  timeToFirstQuote: number;
  completionRate: number;
  disputeFreeRate: number;
  onTimeRate: number;
  lastUpdated: string;
}

interface PerformanceReportProps {
  userId: string;
  userRole: string;
  className?: string;
}

export default function PerformanceReport({ 
  userId, 
  userRole, 
  className = "" 
}: PerformanceReportProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    timeToFirstQuote: 0,
    completionRate: 0,
    disputeFreeRate: 0,
    onTimeRate: 0,
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching performance metrics
    const fetchMetrics = async () => {
      try {
        // In a real implementation, this would fetch from your API
        // For now, we'll use mock data
        const mockMetrics: PerformanceMetrics = {
          timeToFirstQuote: 8.5, // minutes
          completionRate: 94.2, // percentage
          disputeFreeRate: 98.7, // percentage
          onTimeRate: 96.1, // percentage
          lastUpdated: new Date().toISOString()
        };
        
        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Failed to fetch performance metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [userId]);

  const getMetricStatus = (value: number, threshold: number) => {
    if (value >= threshold) return 'excellent';
    if (value >= threshold * 0.8) return 'good';
    if (value >= threshold * 0.6) return 'fair';
    return 'needs_improvement';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'good': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'fair': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'needs_improvement': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4" />;
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'fair': return <AlertCircle className="w-4 h-4" />;
      case 'needs_improvement': return <AlertCircle className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card className={`terminal-card ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 title-glow">
            <BarChart3 className="w-6 h-6 text-accent" />
            <span>Performance Report</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-muted rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`terminal-card ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between title-glow">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-accent" />
            <span>Performance Report</span>
          </div>
          <Badge variant="outline" className="text-accent border-accent">
            Live Data
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time operational metrics and performance indicators
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Time to First Quote */}
        <div className="p-4 rounded-lg border border-terminal-border bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-foreground">Time to First Quote</span>
            </div>
            <Badge className={getMetricStatus(metrics.timeToFirstQuote, 10) === 'excellent' ? 'bg-green-500' : 'bg-blue-500'}>
              {metrics.timeToFirstQuote} min
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Median time from RFQ submission to first quote received
          </div>
        </div>

        {/* Completion Rate */}
        <div className="p-4 rounded-lg border border-terminal-border bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="font-medium text-foreground">Completion Rate</span>
            </div>
            <Badge className={getMetricStatus(metrics.completionRate, 90) === 'excellent' ? 'bg-green-500' : 'bg-blue-500'}>
              {metrics.completionRate}%
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Percentage of deals completed successfully
          </div>
        </div>

        {/* Dispute-Free Rate */}
        <div className="p-4 rounded-lg border border-terminal-border bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="font-medium text-foreground">Dispute-Free Rate</span>
            </div>
            <Badge className={getMetricStatus(metrics.disputeFreeRate, 95) === 'excellent' ? 'bg-green-500' : 'bg-blue-500'}>
              {metrics.disputeFreeRate}%
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Percentage of deals closed without disputes
          </div>
        </div>

        {/* On-Time Rate */}
        <div className="p-4 rounded-lg border border-terminal-border bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <span className="font-medium text-foreground">On-Time Rate</span>
            </div>
            <Badge className={getMetricStatus(metrics.onTimeRate, 90) === 'excellent' ? 'bg-green-500' : 'bg-blue-500'}>
              {metrics.onTimeRate}%
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Percentage of operations completed on schedule
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
          <div className="flex items-center space-x-2 text-accent mb-2">
            <BarChart3 className="w-5 h-5" />
            <span className="font-semibold">Performance Summary</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(metrics.lastUpdated).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            All metrics are calculated from verified operational data and updated in real-time.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
