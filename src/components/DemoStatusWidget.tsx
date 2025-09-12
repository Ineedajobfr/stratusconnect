import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock,
  RefreshCw
} from 'lucide-react';
import { liveStatusHandler } from '@/lib/live-status-handler';

export default function DemoStatusWidget() {
  const [metrics, setMetrics] = useState({
    uptime: null as number | null,
    responseTime: null as number | null,
    status: 'unknown' as string,
    lastUpdated: new Date().toISOString(),
    dataSource: 'unavailable' as string
  });

  const [loading, setLoading] = useState(false);

  const isDemoMode = import.meta.env.VITE_SC_DEMO_MODE === 'true';

  const refreshMetrics = async () => {
    setLoading(true);
    
    try {
      if (isDemoMode) {
        // In demo mode, show realistic but static data
        setMetrics({
          uptime: 99.9,
          responseTime: 150,
          status: 'operational',
          lastUpdated: new Date().toISOString(),
          dataSource: 'demo'
        });
      } else {
        // Use live status handler for real data
        const liveMetrics = await liveStatusHandler.getSystemMetrics();
        setMetrics({
          uptime: liveMetrics.uptime,
          responseTime: liveMetrics.responseTime,
          status: liveMetrics.status,
          lastUpdated: liveMetrics.lastUpdated,
          dataSource: liveMetrics.dataSource
        });
      }
    } catch (error) {
      console.error('Error refreshing metrics:', error);
      setMetrics(prev => ({
        ...prev,
        status: 'unknown',
        dataSource: 'unavailable'
      }));
    }
    
    setLoading(false);
  };

  useEffect(() => {
    refreshMetrics();
    const interval = setInterval(refreshMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'outage':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'unknown':
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-900/20 text-green-400 border-green-500/30';
      case 'degraded':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30';
      case 'outage':
        return 'bg-red-900/20 text-red-400 border-red-500/30';
      case 'unknown':
        return 'bg-gray-900/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-slate-900/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Status
          </CardTitle>
          <button
            onClick={refreshMetrics}
            disabled={loading}
            className="p-1 hover:bg-orange-500/20 rounded"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Status */}
          <div className="flex justify-between items-center">
            <span className="text-gunmetal">Status</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(metrics.status)}
              <Badge className={getStatusColor(metrics.status)}>
                {metrics.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Uptime */}
          <div className="flex justify-between items-center">
            <span className="text-gunmetal">Uptime (24h)</span>
            <span className="font-mono font-semibold">
              {metrics.uptime !== null ? `${metrics.uptime.toFixed(2)}%` : 'N/A'}
            </span>
          </div>

          {/* Response Time */}
          <div className="flex justify-between items-center">
            <span className="text-gunmetal">Response Time</span>
            <span className="font-mono font-semibold">
              {metrics.responseTime !== null ? `${metrics.responseTime}ms` : 'N/A'}
            </span>
          </div>

          {/* Last Updated */}
          <div className="flex justify-between items-center">
            <span className="text-gunmetal">Last Updated</span>
            <span className="text-sm font-mono">
              {new Date(metrics.lastUpdated).toLocaleTimeString()}
            </span>
          </div>

          {/* Data Source Notice */}
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">
              {isDemoMode 
                ? 'Demo Mode: Showing sample data. In production, this displays live metrics.'
                : metrics.dataSource === 'unavailable'
                  ? 'Live data unavailable. Contact support if this persists.'
                  : `Data source: ${metrics.dataSource}`
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
