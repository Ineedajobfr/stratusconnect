import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import {
    Activity,
    AlertTriangle,
    Lock,
    Shield,
    TrendingUp,
    Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip_address: string;
  user_agent: string;
  user_id?: string;
  details: any;
  timestamp: string;
  resolved: boolean;
}

interface UserRiskProfile {
  id: string;
  user_id: string;
  overall_risk_score: number;
  behavioral_risk_score: number;
  activity_risk_score: number;
  suspicious_activity_count: number;
  last_activity: string;
  last_suspicious_activity?: string;
}

interface SecurityAlert {
  id: string;
  user_id?: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  created_at: string;
}

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  highRiskUsers: number;
  blockedIPs: number;
  avgRiskScore: number;
  eventsLast24h: number;
  suspiciousActivities: number;
  resolvedAlerts: number;
}

export const SecurityMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [riskProfiles, setRiskProfiles] = useState<UserRiskProfile[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      
      // Load security events
      const { data: events, error: eventsError } = await supabase
        .from('security_events')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (eventsError) throw eventsError;

      // Load user risk profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('user_risk_profiles')
        .select('*')
        .order('overall_risk_score', { ascending: false })
        .limit(20);

      if (profilesError) throw profilesError;

      // Load security alerts
      const { data: alerts, error: alertsError } = await supabase
        .from('security_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (alertsError) throw alertsError;

      // Calculate metrics
      const metrics: SecurityMetrics = {
        totalEvents: events?.length || 0,
        criticalEvents: events?.filter(e => e.severity === 'critical').length || 0,
        highRiskUsers: profiles?.filter(p => p.overall_risk_score > 0.7).length || 0,
        blockedIPs: events?.filter(e => e.event_type === 'rate_limit_exceeded').length || 0,
        avgRiskScore: profiles?.length ? 
          profiles.reduce((sum, p) => sum + p.overall_risk_score, 0) / profiles.length : 0,
        eventsLast24h: events?.filter(e => 
          new Date(e.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length || 0,
        suspiciousActivities: events?.filter(e => 
          e.event_type === 'suspicious_behavior_detected'
        ).length || 0,
        resolvedAlerts: alerts?.filter(a => a.status === 'resolved').length || 0
      };

      setSecurityEvents(events || []);
      setRiskProfiles(profiles || []);
      setSecurityAlerts(alerts || []);
      setMetrics(metrics);
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600';
    if (score >= 0.6) return 'text-orange-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('security_alerts')
        .update({ 
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;
      loadSecurityData();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading security data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Security Monitoring</h2>
          <p className="text-muted-foreground">Real-time security events and risk analysis</p>
        </div>
        <Button onClick={loadSecurityData} variant="outline">
          <Activity className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Events</p>
                  <p className="text-2xl font-bold">{metrics.totalEvents}</p>
                </div>
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Events</p>
                  <p className="text-2xl font-bold text-red-600">{metrics.criticalEvents}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Risk Users</p>
                  <p className="text-2xl font-bold text-orange-600">{metrics.highRiskUsers}</p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Risk Score</p>
                  <p className="text-2xl font-bold">{metrics.avgRiskScore.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="risks">Risk Profiles</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Critical Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Recent Critical Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityEvents
                    .filter(event => event.severity === 'critical')
                    .slice(0, 5)
                    .map(event => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div>
                          <p className="font-medium">{event.event_type.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.ip_address} • {formatTimestamp(event.timestamp)}
                          </p>
                        </div>
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* High Risk Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  High Risk Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {riskProfiles
                    .filter(profile => profile.overall_risk_score > 0.7)
                    .slice(0, 5)
                    .map(profile => (
                      <div key={profile.id} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div>
                          <p className="font-medium">User {profile.user_id.slice(0, 8)}...</p>
                          <p className="text-sm text-muted-foreground">
                            {profile.suspicious_activity_count} suspicious activities
                          </p>
                        </div>
                        <div className={`font-bold ${getRiskScoreColor(profile.overall_risk_score)}`}>
                          {(profile.overall_risk_score * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                        <span className="font-medium">{event.event_type.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>IP: {event.ip_address}</p>
                        <p>User Agent: {event.user_agent.substring(0, 50)}...</p>
                        <p>Time: {formatTimestamp(event.timestamp)}</p>
                        {event.details && (
                          <details className="mt-2">
                            <summary className="cursor-pointer">Details</summary>
                            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                              {JSON.stringify(event.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Risk Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskProfiles.map(profile => (
                  <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium">User {profile.user_id.slice(0, 8)}...</span>
                        <div className={`font-bold ${getRiskScoreColor(profile.overall_risk_score)}`}>
                          {(profile.overall_risk_score * 100).toFixed(0)}% Risk
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Behavioral Risk: {(profile.behavioral_risk_score * 100).toFixed(0)}%</p>
                        <p>Activity Risk: {(profile.activity_risk_score * 100).toFixed(0)}%</p>
                        <p>Suspicious Activities: {profile.suspicious_activity_count}</p>
                        <p>Last Activity: {formatTimestamp(profile.last_activity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Security Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts
                  .filter(alert => alert.status === 'active')
                  .map(alert => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <span className="font-medium">{alert.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimestamp(alert.created_at)}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Resolve
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

