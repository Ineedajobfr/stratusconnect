import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Lock, 
  Key,
  Activity,
  Users,
  Clock,
  Globe
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login' | 'failed_login' | 'suspicious_activity' | 'data_access' | 'permission_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
  resolved: boolean;
}

interface SecurityStats {
  totalEvents: number;
  criticalEvents: number;
  highEvents: number;
  mediumEvents: number;
  lowEvents: number;
  resolvedEvents: number;
  activeThreats: number;
}

const SecurityMonitor: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalEvents: 0,
    criticalEvents: 0,
    highEvents: 0,
    mediumEvents: 0,
    lowEvents: 0,
    resolvedEvents: 0,
    activeThreats: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock security events data
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        type: 'failed_login',
        severity: 'high',
        description: 'Multiple failed login attempts detected',
        user_id: 'user-123',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        resolved: false
      },
      {
        id: '2',
        type: 'suspicious_activity',
        severity: 'critical',
        description: 'Unusual data access pattern detected',
        user_id: 'user-456',
        ip_address: '10.0.0.50',
        user_agent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        resolved: false
      },
      {
        id: '3',
        type: 'login',
        severity: 'low',
        description: 'Successful login from new location',
        user_id: 'user-789',
        ip_address: '203.0.113.1',
        user_agent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        resolved: true
      },
      {
        id: '4',
        type: 'data_access',
        severity: 'medium',
        description: 'Bulk data export requested',
        user_id: 'user-321',
        ip_address: '192.168.1.200',
        user_agent: 'Mozilla/5.0...',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        resolved: true
      }
    ];

    setEvents(mockEvents);
    
    // Calculate stats
    const totalEvents = mockEvents.length;
    const criticalEvents = mockEvents.filter(e => e.severity === 'critical').length;
    const highEvents = mockEvents.filter(e => e.severity === 'high').length;
    const mediumEvents = mockEvents.filter(e => e.severity === 'medium').length;
    const lowEvents = mockEvents.filter(e => e.severity === 'low').length;
    const resolvedEvents = mockEvents.filter(e => e.resolved).length;
    const activeThreats = mockEvents.filter(e => !e.resolved && (e.severity === 'critical' || e.severity === 'high')).length;

    setStats({
      totalEvents,
      criticalEvents,
      highEvents,
      mediumEvents,
      lowEvents,
      resolvedEvents,
      activeThreats
    });
    
    setLoading(false);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-500 border-green-500/30';
      default: return 'bg-terminal-muted text-terminal-fg';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login': return <Key className="h-4 w-4" />;
      case 'failed_login': return <XCircle className="h-4 w-4" />;
      case 'suspicious_activity': return <AlertTriangle className="h-4 w-4" />;
      case 'data_access': return <Eye className="h-4 w-4" />;
      case 'permission_change': return <Lock className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
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
          <h1 className="text-3xl font-bold text-terminal-fg">Security Monitor</h1>
          <p className="text-terminal-muted">Real-time security event monitoring and threat detection</p>
        </div>
        <Button className="bg-terminal-accent hover:bg-terminal-accent/90">
          <Shield className="h-4 w-4 mr-2" />
          Security Settings
        </Button>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-terminal-bg border-terminal-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-terminal-accent" />
              <div>
                <p className="text-sm text-terminal-muted">Total Events</p>
                <p className="text-2xl font-bold text-terminal-fg">{stats.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-bg border-terminal-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-terminal-muted">Active Threats</p>
                <p className="text-2xl font-bold text-terminal-fg">{stats.activeThreats}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-bg border-terminal-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-terminal-muted">Resolved</p>
                <p className="text-2xl font-bold text-terminal-fg">{stats.resolvedEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-bg border-terminal-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-terminal-accent" />
              <div>
                <p className="text-sm text-terminal-muted">Security Score</p>
                <p className="text-2xl font-bold text-terminal-fg">
                  {Math.max(0, 100 - (stats.activeThreats * 20))}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      {stats.activeThreats > 0 && (
        <Alert className="bg-red-500/10 border-red-500/20">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-500">
            <strong>Security Alert:</strong> {stats.activeThreats} active threat{stats.activeThreats > 1 ? 's' : ''} detected. 
            Immediate attention required.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Events */}
      <Card className="bg-terminal-bg border-terminal-border">
        <CardHeader>
          <CardTitle className="text-terminal-fg">Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-terminal-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-terminal-fg mb-2">No Security Events</h3>
                <p className="text-terminal-muted">All systems are secure and running normally.</p>
              </div>
            ) : (
              events.map(event => (
                <div key={event.id} className="flex items-start space-x-4 p-4 border border-terminal-border rounded-lg">
                  <div className="flex-shrink-0">
                    {getEventIcon(event.type)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-terminal-fg">{event.description}</h3>
                      <Badge className={getSeverityColor(event.severity)}>
                        <div className="flex items-center space-x-1">
                          {getSeverityIcon(event.severity)}
                          <span>{event.severity}</span>
                        </div>
                      </Badge>
                      {event.resolved && (
                        <Badge variant="outline" className="border-green-500/30 text-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolved
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-terminal-muted">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTimestamp(event.timestamp)}</span>
                      </div>
                      {event.ip_address && (
                        <div className="flex items-center space-x-1">
                          <Globe className="h-4 w-4" />
                          <span>{event.ip_address}</span>
                        </div>
                      )}
                      {event.user_id && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>User {event.user_id}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-terminal-border text-terminal-fg">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {!event.resolved && (
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

export default SecurityMonitor;
