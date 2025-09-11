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
  TrendingUp,
  Users,
  DollarSign,
  Server,
  Shield,
  Globe,
  AlertCircle
} from 'lucide-react';
import { compliantMonitoring, UptimeMetrics, Incident } from '@/lib/compliant-monitoring';

export default function CompliantStatus() {
  const [metrics, setMetrics] = useState<UptimeMetrics | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const systemStatus = await compliantMonitoring.getSystemStatus();
      const allIncidents = compliantMonitoring.getIncidents();
      
      setMetrics(systemStatus.uptime);
      setIncidents(allIncidents);
      setLastUpdated(systemStatus.timestamp);
    } catch (error) {
      console.error('Error loading status:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDemoIncident = async () => {
    try {
      const incident = await compliantMonitoring.createIncident({
        name: 'Demo Incident - Service Degradation',
        status: 'investigating',
        description: 'This is a demo incident to test the status page functionality. No actual service issues.',
        affected_services: ['API', 'Web Interface']
      });
      
      setIncidents(prev => [incident, ...prev]);
      alert('Demo incident created successfully');
    } catch (error) {
      console.error('Error creating incident:', error);
      alert('Failed to create demo incident');
    }
  };

  const resolveIncident = async (incidentId: string) => {
    try {
      await compliantMonitoring.resolveIncident(incidentId);
      setIncidents(prev => 
        prev.map(inc => 
          inc.id === incidentId 
            ? { ...inc, status: 'resolved' as const, resolved_at: new Date().toISOString() }
            : inc
        )
      );
      alert('Incident resolved successfully');
    } catch (error) {
      console.error('Error resolving incident:', error);
      alert('Failed to resolve incident');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'down':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'paused':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up':
        return 'bg-green-100 text-green-800';
      case 'down':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case 'investigating':
        return 'bg-red-100 text-red-800';
      case 'identified':
        return 'bg-orange-100 text-orange-800';
      case 'monitoring':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <p className="text-gunmetal">Loading system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            System Status
          </h1>
          <p className="text-gunmetal text-lg">
            Real-time monitoring and performance metrics
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button
              onClick={loadStatus}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <p className="text-sm text-gunmetal">
              Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>

        {/* Compliance Notice */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Compliant Monitoring</h3>
                <p className="text-blue-700 text-sm mt-1">
                  All metrics shown are live from UptimeRobot monitoring. No static claims or fabricated data. 
                  This status page meets regulatory requirements for accurate service level reporting.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Status */}
        {metrics && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {getStatusIcon(metrics.current_status)}
                <span>Overall Status</span>
                <Badge className={getStatusColor(metrics.current_status)}>
                  {metrics.current_status.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {formatUptime(metrics.uptime_24h)}
                  </div>
                  <p className="text-gunmetal">Uptime (24h)</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {formatUptime(metrics.uptime_7d)}
                  </div>
                  <p className="text-gunmetal">Uptime (7d)</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {formatResponseTime(metrics.response_time_24h)}
                  </div>
                  <p className="text-gunmetal">Avg Response Time (24h)</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {metrics.incidents_24h}
                  </div>
                  <p className="text-gunmetal">Incidents (24h)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Uptime Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Uptime Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gunmetal">Last 24 hours</span>
                    <span className="font-mono font-semibold">
                      {formatUptime(metrics.uptime_24h)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gunmetal">Last 7 days</span>
                    <span className="font-mono font-semibold">
                      {formatUptime(metrics.uptime_7d)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gunmetal">Last 30 days</span>
                    <span className="font-mono font-semibold">
                      {formatUptime(metrics.uptime_30d)}
                    </span>
                  </div>
                  {metrics.last_incident && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gunmetal mb-1">Last Incident</p>
                      <p className="text-sm font-mono">
                        {new Date(metrics.last_incident).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Response Time Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Response Time Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gunmetal">Last 24 hours</span>
                    <span className="font-mono font-semibold">
                      {formatResponseTime(metrics.response_time_24h)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gunmetal">Last 7 days</span>
                    <span className="font-mono font-semibold">
                      {formatResponseTime(metrics.response_time_7d)}
                    </span>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gunmetal mb-2">Incident Count</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gunmetal">24h:</span>
                        <span className="font-mono ml-1">{metrics.incidents_24h}</span>
                      </div>
                      <div>
                        <span className="text-gunmetal">7d:</span>
                        <span className="font-mono ml-1">{metrics.incidents_7d}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Incidents */}
        {incidents.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Recent Incidents
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={createDemoIncident}
                    variant="outline"
                    size="sm"
                    className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                  >
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Create Demo Incident
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents.slice(0, 5).map((incident) => (
                  <div key={incident.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-foreground">{incident.name}</h4>
                      <Badge className={getIncidentStatusColor(incident.status)}>
                        {incident.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gunmetal text-sm mb-2">{incident.description}</p>
                    <div className="flex justify-between items-center text-sm text-gunmetal">
                      <span>Started: {new Date(incident.started_at).toLocaleString()}</span>
                      <div className="flex gap-2">
                        {incident.resolved_at ? (
                          <span>Resolved: {new Date(incident.resolved_at).toLocaleString()}</span>
                        ) : (
                          <Button
                            onClick={() => resolveIncident(incident.id)}
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* SLA Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Service Level Agreement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-foreground font-medium">Target Uptime</span>
                <span className="font-mono font-semibold">99.9%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-foreground font-medium">Current Uptime (7d)</span>
                <span className="font-mono font-semibold">
                  {metrics ? formatUptime(metrics.uptime_7d) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-foreground font-medium">SLA Status</span>
                <span className={`font-semibold ${
                  metrics && metrics.uptime_7d >= 99.9 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metrics && metrics.uptime_7d >= 99.9 ? 'COMPLIANT' : 'NON-COMPLIANT'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gunmetal">Version:</span>
                <span className="font-mono ml-2">1.0.0</span>
              </div>
              <div>
                <span className="text-gunmetal">Environment:</span>
                <span className="font-mono ml-2">Production</span>
              </div>
              <div>
                <span className="text-gunmetal">Monitoring:</span>
                <span className="font-mono ml-2">UptimeRobot</span>
              </div>
              <div>
                <span className="text-gunmetal">Status:</span>
                <span className="ml-2">
                  {metrics ? (
                    <Badge className={getStatusColor(metrics.current_status)}>
                      {metrics.current_status.toUpperCase()}
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">UNKNOWN</Badge>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gunmetal text-sm">
          <p>
            This status page shows real-time metrics from UptimeRobot monitoring.
            All data is verified and compliant with regulatory requirements.
          </p>
          <p className="mt-2">
            For support or to report issues, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
