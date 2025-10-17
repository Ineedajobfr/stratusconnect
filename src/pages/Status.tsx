import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SystemMetrics, telemetry } from '@/lib/telemetry';
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    RefreshCw,
    Server,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Status() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const systemMetrics = telemetry.getSystemMetrics();
      setMetrics(systemMetrics);
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error('Error loading metrics:', error);
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
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
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
      default:
        return 'bg-slate-900/20 text-slate-400 border-slate-500/30';
    }
  };

  const formatUptime = (uptime: number) => {
    if (uptime >= 99.9) {
      return `${uptime.toFixed(3)}%`;
    } else if (uptime >= 99.0) {
      return `${uptime.toFixed(2)}%`;
    } else {
      return `${uptime.toFixed(1)}%`;
    }
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) {
      return `${Math.round(ms)}ms`;
    } else {
      return `${(ms / 1000).toFixed(1)}s`;
    }
  };

  if (loading && !metrics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-white/80">Loading system status...</p>
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
        onClick={() => navigate('/home')}
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
              onClick={loadMetrics}
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

        {/* Overall Status */}
        {metrics && (
          <Card className="mb-8 bg-black/80 backdrop-blur-sm border border-slate-700/30 hover:bg-black/90 hover:border-slate-600/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                {getStatusIcon(metrics.uptime.current_status)}
                <span>Overall Status</span>
                <Badge className={getStatusColor(metrics.uptime.current_status)}>
                  {metrics.uptime.current_status.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {formatUptime(metrics.uptime.uptime_24h)}
                  </div>
                  <p className="text-white/80">Uptime (24h)</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {formatResponseTime(metrics.response_time.avg_24h)}
                  </div>
                  <p className="text-white/80">Avg Response Time (24h)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Component Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-black/80 backdrop-blur-sm border border-slate-700/30">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Application</h3>
              <Badge className="bg-green-900/20 text-green-400 border-green-500/30">
                Operational
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-sm border border-slate-700/30">
            <CardContent className="p-6 text-center">
              <Server className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Database</h3>
              <Badge className="bg-green-900/20 text-green-400 border-green-500/30">
                Operational
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-sm border border-slate-700/30">
            <CardContent className="p-6 text-center">
              <Activity className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">API</h3>
              <Badge className="bg-green-900/20 text-green-400 border-green-500/30">
                Operational
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-black/80 backdrop-blur-sm border border-slate-700/30">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Authentication</h3>
              <Badge className="bg-green-900/20 text-green-400 border-green-500/30">
                Operational
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card className="mt-8 bg-black/80 backdrop-blur-sm border border-slate-700/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Server className="w-5 h-5" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-white/80">Last Updated:</span>
                <span className="font-mono ml-2 text-white">
                  {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
                </span>
              </div>
              <div>
                <span className="text-white/80">Status:</span>
                <span className="ml-2">
                  {metrics ? (
                    <Badge className={getStatusColor(metrics.uptime.current_status)}>
                      {metrics.uptime.current_status.toUpperCase()}
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-900/20 text-slate-400 border-slate-500/30">UNKNOWN</Badge>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80 text-sm">
          <p>
            This status page shows the current operational status of our platform.
            For support or to report issues, please contact our support team.
          </p>
          <p className="mt-2">
            <a href="mailto:support@stratusconnect.org" className="text-orange-400 hover:text-orange-300 underline">
              support@stratusconnect.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
