import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { realTimeMonitoring } from '@/lib/real-time-monitoring';
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    RefreshCw,
    Server,
    Shield,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CompliantStatus() {
  const [statusData, setStatusData] = useState<{
    overall: string;
    uptime: {
      current: number;
      p50: number;
      p90: number;
      p99: number;
    };
    monitors: Array<{
      id: string;
      name: string;
      status: string;
      responseTime: number;
      uptime24h: number;
      uptime7d: number;
      uptime30d: number;
    }>;
    lastUpdated: string;
    version: string;
    incidents: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const systemStatus = realTimeMonitoring.getSystemStatus();
      
      setStatusData(systemStatus);
      setLastUpdated(systemStatus.lastUpdated);
    } catch (error) {
      console.error('Error loading status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case 'outage':
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'degraded':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'outage':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getMonitorStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'down':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(2)}%`;
  };

  const formatResponseTime = (time: number) => {
    if (time === 0) return 'N/A';
    return `${time}ms`;
  };

  if (loading && !statusData) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Aviation background image - matching index page */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJhdmlhdGlvbi1ncmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmE1MDA7c3RvcC1vcGFjaXR5OjAuOCIvPgo8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I2ZmNzUwMDtzdG9wLW9wYWNpdHk6MC42Ii8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMDtzdG9wLW9wYWNpdHk6MC45Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTA4MCIgZmlsbD0idXJsKCNhdmlhdGlvbi1ncmFkaWVudCkiLz4KPC9zdmc+')`,
          }}
        />
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgTCAwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] opacity-20"></div>
        </div>

        {/* STRATUSCONNECT Logo - Top Left */}
        <div 
          className="absolute top-8 left-8 text-white text-lg font-bold bg-black px-6 py-3 rounded backdrop-blur-sm cursor-pointer hover:bg-gray-800 transition-colors z-20"
          onClick={() => window.history.back()}
        >
          STRATUSCONNECT
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white/80 mt-4">Loading system status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aviation background image - matching index page */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJhdmlhdGlvbi1ncmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmZmE1MDA7c3RvcC1vcGFjaXR5OjAuOCIvPgo8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I2ZmNzUwMDtzdG9wLW9wYWNpdHk6MC42Ii8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAwMDtzdG9wLW9wYWNpdHk6MC45Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTA4MCIgZmlsbD0idXJsKCNhdmlhdGlvbi1ncmFkaWVudCkiLz4KPC9zdmc+')`,
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgTCAwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] opacity-20"></div>
      </div>

      {/* STRATUSCONNECT Logo - Top Left */}
      <div 
        className="absolute top-8 left-8 text-white text-lg font-bold bg-black px-6 py-3 rounded backdrop-blur-sm cursor-pointer hover:bg-gray-800 transition-colors z-20"
        onClick={() => window.history.back()}
      >
        STRATUSCONNECT
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            System Status
          </h1>
          <p className="text-white/80 text-lg drop-shadow-lg">
            Real-time monitoring and performance metrics
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button
              onClick={loadStatus}
              variant="outline"
              size="sm"
              disabled={loading}
              className="bg-black/30 border-white/30 text-white hover:bg-black/50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <p className="text-sm text-white/80">
              Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>

        {/* Compliance Notice */}
        <Card className="mb-8 bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">Real-Time Monitoring</h3>
                <p className="text-white/80 text-sm mt-1">
                  All metrics shown are live from our monitoring system. This status page provides 
                  real-time system health data with 10-second update intervals.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Status */}
        {statusData && (
          <Card className="mb-8 bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                {getStatusIcon(statusData.overall)}
                <span>Overall Status</span>
                <Badge className={getStatusColor(statusData.overall)}>
                  {statusData.overall.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {formatUptime(statusData.uptime.current)}
                  </div>
                  <p className="text-white/80">Current Uptime</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {formatResponseTime(statusData.uptime.p50)}
                  </div>
                  <p className="text-white/80">P50 Response</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {formatResponseTime(statusData.uptime.p90)}
                  </div>
                  <p className="text-white/80">P90 Response</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {statusData.incidents}
                  </div>
                  <p className="text-white/80">Active Issues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service Monitors */}
        {statusData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {statusData.monitors.map((monitor) => (
              <Card key={monitor.id} className="bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      {getMonitorStatusIcon(monitor.status)}
                      <span>{monitor.name}</span>
                    </div>
                    <Badge className={getStatusColor(monitor.status)}>
                      {monitor.status.toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Response Time</span>
                      <span className="font-mono font-semibold text-white">
                        {formatResponseTime(monitor.responseTime)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Uptime (24h)</span>
                      <span className="font-mono font-semibold text-white">
                        {formatUptime(monitor.uptime24h)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Uptime (7d)</span>
                      <span className="font-mono font-semibold text-white">
                        {formatUptime(monitor.uptime7d)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Uptime (30d)</span>
                      <span className="font-mono font-semibold text-white">
                        {formatUptime(monitor.uptime30d)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* System Information */}
        <Card className="bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Server className="w-5 h-5" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {statusData?.version || '1.0.0'}
                </div>
                <p className="text-white/80 text-sm">Version</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  Real-Time
                </div>
                <p className="text-white/80 text-sm">Monitoring</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {statusData?.monitors.length || 0}
                </div>
                <p className="text-white/80 text-sm">Monitors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
