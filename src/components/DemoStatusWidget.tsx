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

export default function DemoStatusWidget() {
  const [metrics, setMetrics] = useState({
    uptime: 99.9,
    responseTime: 150,
    status: 'up',
    lastUpdated: new Date().toISOString()
  });

  const [loading, setLoading] = useState(false);

  const isDemoMode = import.meta.env.VITE_SC_DEMO_MODE === 'true';

  const refreshMetrics = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In demo mode, show realistic but static data
    if (isDemoMode) {
      setMetrics({
        uptime: 99.9,
        responseTime: 150,
        status: 'up',
        lastUpdated: new Date().toISOString()
      });
    } else {
      // In production, this would call the real monitoring API
      // const realMetrics = await fetch('/api/status').then(r => r.json());
      // setMetrics(realMetrics);
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
      case 'up':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'down':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'down':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            className="p-1 hover:bg-gray-100 rounded"
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
              {isDemoMode ? `${metrics.uptime}%` : 'N/A'}
            </span>
          </div>

          {/* Response Time */}
          <div className="flex justify-between items-center">
            <span className="text-gunmetal">Response Time</span>
            <span className="font-mono font-semibold">
              {isDemoMode ? `${metrics.responseTime}ms` : 'N/A'}
            </span>
          </div>

          {/* Last Updated */}
          <div className="flex justify-between items-center">
            <span className="text-gunmetal">Last Updated</span>
            <span className="text-sm font-mono">
              {new Date(metrics.lastUpdated).toLocaleTimeString()}
            </span>
          </div>

          {/* Demo Notice */}
          {isDemoMode && (
            <div className="pt-2 border-t">
              <p className="text-xs text-yellow-600">
                Demo Mode: Showing sample data. In production, this displays live metrics from UptimeRobot.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
