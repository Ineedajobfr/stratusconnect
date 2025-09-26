import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Clock, 
  Server, 
  Database, 
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  threshold: number;
  current: number;
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  uptime: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
}

interface Alert {
  id: string;
  type: 'performance' | 'error' | 'capacity' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 'healthy',
    uptime: 99.9,
    responseTime: 150,
    errorRate: 0.1,
    throughput: 1250,
    memoryUsage: 65,
    cpuUsage: 45,
    diskUsage: 78
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock performance metrics
    const mockMetrics: PerformanceMetric[] = [
      {
        name: 'Response Time',
        value: 150,
        unit: 'ms',
        status: 'good',
        trend: 'down',
        threshold: 200,
        current: 150
      },
      {
        name: 'Throughput',
        value: 1250,
        unit: 'req/min',
        status: 'good',
        trend: 'up',
        threshold: 1000,
        current: 1250
      },
      {
        name: 'Error Rate',
        value: 0.1,
        unit: '%',
        status: 'good',
        trend: 'stable',
        threshold: 1.0,
        current: 0.1
      },
      {
        name: 'Memory Usage',
        value: 65,
        unit: '%',
        status: 'warning',
        trend: 'up',
        threshold: 80,
        current: 65
      },
      {
        name: 'CPU Usage',
        value: 45,
        unit: '%',
        status: 'good',
        trend: 'stable',
        threshold: 70,
        current: 45
      },
      {
        name: 'Disk Usage',
        value: 78,
        unit: '%',
        status: 'warning',
        trend: 'up',
        threshold: 85,
        current: 78
      }
    ];

    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'performance',
        severity: 'medium',
        message: 'High memory usage detected on server-02',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        resolved: false
      },
      {
        id: '2',
        type: 'capacity',
        severity: 'low',
        message: 'Disk usage approaching threshold',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        resolved: false
      },
      {
        id: '3',
        type: 'error',
        severity: 'high',
        message: 'Database connection timeout',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        resolved: true
      }
    ];

    setMetrics(mockMetrics);
    setAlerts(mockAlerts);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-terminal-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <XCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />;
      case 'down': return <TrendingDown className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default: return 'bg-terminal-muted text-terminal-fg';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      case 'capacity': return <Server className="h-4 w-4" />;
      case 'security': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(1)}%`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h1 className="text-3xl font-bold text-terminal-fg">Performance Monitor</h1>
          <p className="text-terminal-muted">Real-time system performance and health monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={systemHealth.overall === 'healthy' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
            <div className="flex items-center space-x-1">
              {systemHealth.overall === 'healthy' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              <span>{systemHealth.overall.toUpperCase()}</span>
            </div>
          </Badge>
          <Button className="bg-terminal-accent hover:bg-terminal-accent/90">
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-terminal-bg border-terminal-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-terminal-accent" />
              <div>
                <p className="text-sm text-terminal-muted">Uptime</p>
                <p className="text-2xl font-bold text-terminal-fg">{formatUptime(systemHealth.uptime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-bg border-terminal-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-terminal-accent" />
              <div>
                <p className="text-sm text-terminal-muted">Response Time</p>
                <p className="text-2xl font-bold text-terminal-fg">{systemHealth.responseTime}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-bg border-terminal-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Server className="h-8 w-8 text-terminal-accent" />
              <div>
                <p className="text-sm text-terminal-muted">Throughput</p>
                <p className="text-2xl font-bold text-terminal-fg">{systemHealth.throughput}/min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-bg border-terminal-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <XCircle className="h-8 w-8 text-terminal-accent" />
              <div>
                <p className="text-sm text-terminal-muted">Error Rate</p>
                <p className="text-2xl font-bold text-terminal-fg">{systemHealth.errorRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.name} className="bg-terminal-bg border-terminal-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-terminal-fg text-lg">{metric.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(metric.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(metric.status)}
                      <span>{metric.status}</span>
                    </div>
                  </Badge>
                  <div className={getStatusColor(metric.trend)}>
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-terminal-fg">
                    {metric.value}{metric.unit}
                  </span>
                  <span className="text-sm text-terminal-muted">
                    / {metric.threshold}{metric.unit}
                  </span>
                </div>
                <Progress 
                  value={(metric.current / metric.threshold) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-terminal-muted">
                  <span>0{metric.unit}</span>
                  <span>{metric.threshold}{metric.unit}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Resources */}
      <Card className="bg-terminal-bg border-terminal-border">
        <CardHeader>
          <CardTitle className="text-terminal-fg">System Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-terminal-muted">Memory Usage</span>
                <span className="text-terminal-fg">{systemHealth.memoryUsage}%</span>
              </div>
              <Progress value={systemHealth.memoryUsage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-terminal-muted">CPU Usage</span>
                <span className="text-terminal-fg">{systemHealth.cpuUsage}%</span>
              </div>
              <Progress value={systemHealth.cpuUsage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-terminal-muted">Disk Usage</span>
                <span className="text-terminal-fg">{systemHealth.diskUsage}%</span>
              </div>
              <Progress value={systemHealth.diskUsage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="bg-terminal-bg border-terminal-border">
        <CardHeader>
          <CardTitle className="text-terminal-fg">System Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-terminal-fg mb-2">No Active Alerts</h3>
                <p className="text-terminal-muted">All systems are running normally.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-4 p-4 border border-terminal-border rounded-lg">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-terminal-fg">{alert.message}</h3>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      {alert.resolved && (
                        <Badge variant="outline" className="border-green-500/30 text-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolved
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-terminal-muted">
                      <span>{formatTimestamp(alert.timestamp)}</span>
                      <span className="capitalize">{alert.type}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-terminal-border text-terminal-fg">
                      View
                    </Button>
                    {!alert.resolved && (
                      <Button size="sm" className="bg-terminal-accent hover:bg-terminal-accent/90">
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitor;
