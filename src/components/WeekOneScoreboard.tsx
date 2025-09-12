// Week One Live Scoreboard
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Users,
  DollarSign,
  Activity,
  Zap
} from 'lucide-react';

export interface WeekOneMetrics {
  timeToFirstQuote: number; // minutes
  quoteResponseRate: number; // percentage
  dealConversionRate: number; // percentage
  uptime: number; // percentage
  p50Response: number; // milliseconds
  kycPassRate: number; // percentage
  timeToPayout: number; // hours
  disputesPer100Deals: number; // count
  totalDeals: number;
  totalRevenue: number;
  currency: string;
  lastUpdated: string;
}

export interface WeekOneScoreboardProps {
  onMetricsUpdate?: (metrics: WeekOneMetrics) => void;
}

export function WeekOneScoreboard({ onMetricsUpdate }: WeekOneScoreboardProps) {
  const [metrics, setMetrics] = useState<WeekOneMetrics>({
    timeToFirstQuote: 0,
    quoteResponseRate: 0,
    dealConversionRate: 0,
    uptime: 0,
    p50Response: 0,
    kycPassRate: 0,
    timeToPayout: 0,
    disputesPer100Deals: 0,
    totalDeals: 0,
    totalRevenue: 0,
    currency: 'GBP',
    lastUpdated: new Date().toISOString()
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate real-time metrics updates
    const fetchMetrics = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock metrics data
        const mockMetrics: WeekOneMetrics = {
          timeToFirstQuote: 12, // 12 minutes
          quoteResponseRate: 78, // 78%
          dealConversionRate: 34, // 34%
          uptime: 99.95, // 99.95%
          p50Response: 180, // 180ms
          kycPassRate: 92, // 92%
          timeToPayout: 2.5, // 2.5 hours
          disputesPer100Deals: 1.2, // 1.2 per 100 deals
          totalDeals: 47,
          totalRevenue: 125000, // £1,250 in minor units
          currency: 'GBP',
          lastUpdated: new Date().toISOString()
        };

        setMetrics(mockMetrics);
        onMetricsUpdate?.(mockMetrics);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
    
    // Update every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [onMetricsUpdate]);

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-white';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'bg-green-900/20 text-green-400 border-green-500/30';
    if (value >= thresholds.warning) return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-900/20 text-red-400 border-red-500/30';
  };

  const getPerformanceLabel = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'Excellent';
    if (value >= thresholds.warning) return 'Good';
    return 'Needs Attention';
  };

  if (isLoading) {
    return (
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Week One Live Scoreboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading metrics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Week One Live Scoreboard
            </CardTitle>
            <Badge className="bg-blue-900/20 text-blue-400 border-blue-500/30">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            Last updated: {new Date(metrics.lastUpdated).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Time to First Quote */}
        <Card className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Time to First Quote</h3>
              </div>
              <Badge className={getPerformanceBadge(metrics.timeToFirstQuote, { good: 15, warning: 30 })}>
                {getPerformanceLabel(metrics.timeToFirstQuote, { good: 15, warning: 30 })}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {metrics.timeToFirstQuote}m
            </div>
            <div className="text-sm text-gray-600">
              Average time for first quote response
            </div>
          </CardContent>
        </Card>

        {/* Quote Response Rate */}
        <Card className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-white" />
                <h3 className="font-semibold">Quote Response Rate</h3>
              </div>
              <Badge className={getPerformanceBadge(metrics.quoteResponseRate, { good: 80, warning: 60 })}>
                {getPerformanceLabel(metrics.quoteResponseRate, { good: 80, warning: 60 })}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {metrics.quoteResponseRate}%
            </div>
            <div className="text-sm text-gray-600">
              Percentage of RFQs that receive quotes
            </div>
          </CardContent>
        </Card>

        {/* Deal Conversion Rate */}
        <Card className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Deal Conversion Rate</h3>
              </div>
              <Badge className={getPerformanceBadge(metrics.dealConversionRate, { good: 40, warning: 25 })}>
                {getPerformanceLabel(metrics.dealConversionRate, { good: 40, warning: 25 })}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {metrics.dealConversionRate}%
            </div>
            <div className="text-sm text-gray-600">
              Percentage of quotes that convert to deals
            </div>
          </CardContent>
        </Card>

        {/* Uptime */}
        <Card className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold">Uptime</h3>
              </div>
              <Badge className={getPerformanceBadge(metrics.uptime, { good: 99.9, warning: 99.5 })}>
                {getPerformanceLabel(metrics.uptime, { good: 99.9, warning: 99.5 })}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-2">
              {metrics.uptime}%
            </div>
            <div className="text-sm text-gray-600">
              Platform availability
            </div>
          </CardContent>
        </Card>

        {/* P50 Response Time */}
        <Card className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold">P50 Response Time</h3>
              </div>
              <Badge className={getPerformanceBadge(metrics.p50Response, { good: 200, warning: 500 })}>
                {getPerformanceLabel(metrics.p50Response, { good: 200, warning: 500 })}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {metrics.p50Response}ms
            </div>
            <div className="text-sm text-gray-600">
              Median response time
            </div>
          </CardContent>
        </Card>

        {/* KYC Pass Rate */}
        <Card className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold">KYC Pass Rate</h3>
              </div>
              <Badge className={getPerformanceBadge(metrics.kycPassRate, { good: 90, warning: 80 })}>
                {getPerformanceLabel(metrics.kycPassRate, { good: 90, warning: 80 })}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {metrics.kycPassRate}%
            </div>
            <div className="text-sm text-gray-600">
              Percentage of KYC verifications that pass
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time to Payout */}
        <Card className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-white" />
                <h3 className="font-semibold">Time to Payout</h3>
              </div>
              <Badge className={getPerformanceBadge(metrics.timeToPayout, { good: 4, warning: 8 })}>
                {getPerformanceLabel(metrics.timeToPayout, { good: 4, warning: 8 })}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {metrics.timeToPayout}h
            </div>
            <div className="text-sm text-gray-600">
              Average time from deal completion to payout
            </div>
          </CardContent>
        </Card>

        {/* Disputes per 100 Deals */}
        <Card className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold">Disputes per 100 Deals</h3>
              </div>
              <Badge className={getPerformanceBadge(metrics.disputesPer100Deals, { good: 2, warning: 5 })}>
                {getPerformanceLabel(metrics.disputesPer100Deals, { good: 2, warning: 5 })}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-red-600 mb-2">
              {metrics.disputesPer100Deals}
            </div>
            <div className="text-sm text-gray-600">
              Dispute rate per 100 completed deals
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Week One Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {metrics.totalDeals}
              </div>
              <div className="text-sm text-gray-600">Total Deals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: metrics.currency
                }).format(metrics.totalRevenue / 100)}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {Math.round(metrics.totalRevenue * 0.07 / 100)}
              </div>
              <div className="text-sm text-gray-600">Platform Fees ({metrics.currency})</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
