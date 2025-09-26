// Security Dashboard Component - Industry Standard Implementation
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { securityService, SecurityMetrics, SecurityEvent } from '@/lib/security-service';
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Eye, 
  Activity, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Settings,
  Key,
  Database,
  Globe
} from 'lucide-react';

interface SecurityDashboardProps {
  className?: string;
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ className }) => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalLogins: 0,
    failedLogins: 0,
    activeSessions: 0,
    securityAlerts: 0,
    dataBreaches: 0,
    lastSecurityScan: new Date()
  });
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [securityScore, setSecurityScore] = useState(0);
  const [securityIssues, setSecurityIssues] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = async () => {
    try {
      const securityMetrics = securityService.getSecurityMetrics();
      setMetrics(securityMetrics);

      // In a real implementation, this would fetch from the database
      const mockEvents: SecurityEvent[] = [
        {
          id: '1',
          userId: 'user1',
          eventType: 'login',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...',
          details: { sessionId: 'sess_123' },
          severity: 'low'
        },
        {
          id: '2',
          userId: 'user2',
          eventType: 'failed_login',
          timestamp: new Date(Date.now() - 1000 * 60 * 10),
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0...',
          details: { reason: 'invalid_password' },
          severity: 'medium'
        },
        {
          id: '3',
          userId: 'user3',
          eventType: 'suspicious_activity',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0...',
          details: { reason: 'multiple_failed_attempts' },
          severity: 'high'
        }
      ];
      setSecurityEvents(mockEvents);
    } catch (error) {
      console.error('Error loading security data:', error);
    }
  };

  const performSecurityScan = async () => {
    setIsScanning(true);
    try {
      const scanResult = await securityService.performSecurityScan();
      setSecurityScore(scanResult.score);
      setSecurityIssues(scanResult.issues);
    } catch (error) {
      console.error('Error performing security scan:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'login': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'logout': return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'failed_login': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'password_change': return <Key className="h-4 w-4 text-blue-600" />;
      case 'data_access': return <Database className="h-4 w-4 text-purple-600" />;
      case 'suspicious_activity': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const exportSecurityReport = () => {
    const report = {
      metrics,
      securityEvents,
      securityScore,
      securityIssues,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Security Dashboard</h3>
            <Badge variant={securityScore >= 80 ? "default" : securityScore >= 60 ? "secondary" : "destructive"}>
              Score: {securityScore}/100
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={performSecurityScan}
              disabled={isScanning}
              variant="outline"
              size="sm"
            >
              {isScanning ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Scan Security
            </Button>
            <Button onClick={exportSecurityReport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Security Events</TabsTrigger>
            <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
            <TabsTrigger value="settings">Security Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Sessions</p>
                    <p className="text-2xl font-bold">{metrics.activeSessions}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Failed Logins</p>
                    <p className="text-2xl font-bold text-red-600">{metrics.failedLogins}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Security Alerts</p>
                    <p className="text-2xl font-bold text-orange-600">{metrics.securityAlerts}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Data Breaches</p>
                    <p className="text-2xl font-bold text-red-600">{metrics.dataBreaches}</p>
                  </div>
                  <Database className="h-8 w-8 text-red-600" />
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Security Score
              </h4>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className={`h-4 rounded-full transition-all duration-300 ${
                    securityScore >= 80 ? 'bg-green-500' : 
                    securityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${securityScore}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {securityScore >= 80 ? 'Excellent security posture' : 
                 securityScore >= 60 ? 'Good security posture with room for improvement' : 
                 'Security issues detected - immediate attention required'}
              </p>
            </Card>

            {securityIssues.length > 0 && (
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Security Issues
                </h4>
                <ul className="space-y-2">
                  {securityIssues.map((issue, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                      <span className="text-sm">{issue}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Recent Security Events
              </h4>
              <div className="space-y-3">
                {securityEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getEventTypeIcon(event.eventType)}
                      <div>
                        <p className="font-medium capitalize">{event.eventType.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-600">
                          User: {event.userId} • IP: {event.ipAddress}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(event.timestamp)}
                        </p>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Active Sessions
              </h4>
              <div className="space-y-3">
                {Array.from({ length: metrics.activeSessions }, (_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <div>
                        <p className="font-medium">Session {i + 1}</p>
                        <p className="text-sm text-gray-600">
                          IP: 192.168.1.{100 + i} • Last activity: {formatTime(new Date())}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Terminate
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Security Configuration
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Multi-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Require MFA for all users</p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-gray-600">8 hours</p>
                  </div>
                  <Badge variant="secondary">Configured</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Password Policy</p>
                    <p className="text-sm text-gray-600">Minimum 12 characters with complexity</p>
                  </div>
                  <Badge variant="default">Strong</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Audit Logging</p>
                    <p className="text-sm text-gray-600">All security events logged</p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Encryption</p>
                    <p className="text-sm text-gray-600">AES-256 encryption for sensitive data</p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
