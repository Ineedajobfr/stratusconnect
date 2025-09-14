// Live Status Widget - Real-time system monitoring with N/A fallbacks
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Clock,
  Server,
  Globe,
  Database,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { liveStatusHandler, LiveStatusData } from '@/lib/live-status-handler';

export interface LiveStatusWidgetProps {
  compact?: boolean;
  showDetails?: boolean;
  refreshInterval?: number;
  className?: string;
}

export function LiveStatusWidget({ 
  compact = false, 
  showDetails = true, 
  refreshInterval = 30000,
  className = ""
}: LiveStatusWidgetProps) {
  const [statusData, setStatusData] = useState<LiveStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>('');

  useEffect(() => {
    loadStatus();
    
    const interval = setInterval(loadStatus, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const data = await liveStatusHandler.getLiveStatus();
      setStatusData(data);
      setLastRefresh(new Date().toISOString());
    } catch (error) {
      console.error('Error loading status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'unknown':
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDataSourceIcon = (source: string) => {
    switch (source) {
      case 'live':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'cached':
        return <Wifi className="w-4 h-4 text-yellow-500" />;
      case 'fallback':
        return <WifiOff className="w-4 h-4 text-orange-500" />;
      case 'unavailable':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDataSourceText = (source: string) => {
    switch (source) {
      case 'live':
        return 'Live Data';
      case 'cached':
        return 'Cached Data';
      case 'fallback':
        return 'Fallback Data';
      case 'unavailable':
        return 'Data Unavailable';
      default:
        return 'Unknown';
    }
  };

  const getDataSourceColor = (source: string) => {
    switch (source) {
      case 'live':
        return 'text-green-500';
      case 'cached':
        return 'text-yellow-500';
      case 'fallback':
        return 'text-orange-500';
      case 'unavailable':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (!statusData) {
    return (
      <Card className={`terminal-card bg-slate-800 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {getStatusIcon(statusData.status)}
        <Badge 
          variant={liveStatusHandler.getStatusBadgeVariant(statusData.status) as "default" | "secondary" | "destructive" | "outline"}
          className="text-xs"
        >
          {statusData.status.toUpperCase()}
        </Badge>
        {statusData.uptime.last24h !== null ? (
          <span className="text-sm text-gray-400">
            {liveStatusHandler.formatUptime(statusData.uptime.last24h)}
          </span>
        ) : (
          <span className="text-sm text-gray-400">N/A</span>
        )}
      </div>
    );
  }

  return (
    <Card className={`terminal-card bg-slate-800 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 title-glow">
            <Activity className="w-5 h-5 text-accent" />
            <span>System Status</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {getDataSourceIcon(statusData.dataSource)}
              <span className={`text-xs ${getDataSourceColor(statusData.dataSource)}`}>
                {getDataSourceText(statusData.dataSource)}
              </span>
            </div>
            <Button
              onClick={loadStatus}
              disabled={loading}
              variant="ghost"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(statusData.status)}
            <div>
              <div className="font-medium text-white">
                {statusData.status === 'operational' && 'All Systems Operational'}
                {statusData.status === 'degraded' && 'Performance Issues Detected'}
                {statusData.status === 'outage' && 'Service Outage'}
                {statusData.status === 'unknown' && 'Status Unknown'}
              </div>
              {statusData.error && (
                <div className="text-sm text-red-400">{statusData.error}</div>
              )}
            </div>
          </div>
          <Badge 
            variant={liveStatusHandler.getStatusBadgeVariant(statusData.status) as "default" | "secondary" | "destructive" | "outline"}
          >
            {statusData.status.toUpperCase()}
          </Badge>
        </div>

        {showDetails && (
          <>
            {/* Uptime Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {statusData.uptime.last24h !== null 
                    ? liveStatusHandler.formatUptime(statusData.uptime.last24h)
                    : 'N/A'
                  }
                </div>
                <div className="text-xs text-gray-400">24h Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {statusData.uptime.last7d !== null 
                    ? liveStatusHandler.formatUptime(statusData.uptime.last7d)
                    : 'N/A'
                  }
                </div>
                <div className="text-xs text-gray-400">7d Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {statusData.uptime.last30d !== null 
                    ? liveStatusHandler.formatUptime(statusData.uptime.last30d)
                    : 'N/A'
                  }
                </div>
                <div className="text-xs text-gray-400">30d Uptime</div>
              </div>
            </div>

            {/* Response Time Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Avg Response</span>
                </div>
                <span className="font-mono font-medium text-white">
                  {liveStatusHandler.formatResponseTime(statusData.responseTime.average)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">P95 Response</span>
                </div>
                <span className="font-mono font-medium text-white">
                  {liveStatusHandler.formatResponseTime(statusData.responseTime.p90)}
                </span>
              </div>
            </div>

            {/* Incident Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-700 rounded-lg">
                <div className="text-lg font-bold text-white">
                  {statusData.incidents.active}
                </div>
                <div className="text-xs text-gray-400">Active Issues</div>
              </div>
              <div className="text-center p-3 bg-slate-700 rounded-lg">
                <div className="text-lg font-bold text-white">
                  {statusData.incidents.last24h}
                </div>
                <div className="text-xs text-gray-400">24h Incidents</div>
              </div>
              <div className="text-center p-3 bg-slate-700 rounded-lg">
                <div className="text-lg font-bold text-white">
                  {statusData.incidents.last7d}
                </div>
                <div className="text-xs text-gray-400">7d Incidents</div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Last Updated</span>
              <span className="text-gray-300">
                {lastRefresh ? new Date(lastRefresh).toLocaleTimeString() : 'N/A'}
              </span>
            </div>

            {/* Data Source Warning */}
            {statusData.dataSource !== 'live' && (
              <div className="p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-300">
                    {statusData.dataSource === 'unavailable' 
                      ? 'Live status data is currently unavailable. Displaying fallback information.'
                      : `Displaying ${getDataSourceText(statusData.dataSource).toLowerCase()}.`
                    }
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default LiveStatusWidget;
