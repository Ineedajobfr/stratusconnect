import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, AlertTriangle, Search, Activity, Clock, User, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { safeObjectCast } from '@/utils/errorHandler';

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  description: string;
  user_id?: string;
  ip_hash?: string;
  user_agent_hash?: string;
  metadata?: Record<string, unknown>;
  blocked: boolean;
  resolved: boolean;
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

export const SecurityMonitor = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchSecurityEvents();
    
    // Set up real-time monitoring
    const interval = setInterval(fetchSecurityEvents, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSecurityEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setEvents((data || []).map(item => ({
        ...item,
        metadata: safeObjectCast(item.metadata || {})
      })) as SecurityEvent[]);
    } catch (error) {
      console.error('Error fetching security events:', error);
      toast.error('Failed to load security events');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'resolved' && event.resolved) ||
                         (statusFilter === 'unresolved' && !event.resolved) ||
                         (statusFilter === 'blocked' && event.blocked);
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'login_attempt':
      case 'failed_login':
        return <User className="w-4 h-4" />;
      case 'ip_anomaly':
      case 'geo_anomaly':
        return <Globe className="w-4 h-4" />;
      case 'rate_limit':
      case 'suspicious_activity':
        return <Activity className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // Real-time system stats
  const stats = {
    totalEvents: events.length,
    criticalEvents: events.filter(e => e.severity === 'critical').length,
    unresolvedEvents: events.filter(e => !e.resolved).length,
    blockedThreats: events.filter(e => e.blocked).length,
  };

  if (loading) {
    return (
      <Card className="terminal-card">
        <CardContent className="p-12">
          <div className="text-center text-slate-400">
            <Shield className="w-16 h-16 mx-auto mb-6 opacity-30 animate-pulse" />
            <p>Loading security monitor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-mono">Total Events</p>
                <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-mono">Critical Events</p>
                <p className="text-2xl font-bold text-red-400">{stats.criticalEvents}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-mono">Unresolved</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.unresolvedEvents}</p>
              </div>
              <Activity className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-mono">Blocked Threats</p>
                <p className="text-2xl font-bold text-green-400">{stats.blockedThreats}</p>
              </div>
              <Shield className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Events */}
      <Card className="terminal-card">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="terminal-subheader flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Events ({events.length} recent events)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search security events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="terminal-input pl-10"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="terminal-input w-48">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="terminal-input w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="unresolved">Unresolved</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-300">Event</TableHead>
                  <TableHead className="text-slate-300">Severity</TableHead>
                  <TableHead className="text-slate-300">Description</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id} className="border-slate-800">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getEventIcon(event.event_type)}
                        <span className="font-mono text-sm text-white">
                          {event.event_type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSeverityBadgeVariant(event.severity)} className="font-mono">
                        {event.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-300 text-sm">{event.description}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {event.blocked && (
                          <Badge variant="destructive" className="font-mono text-xs">
                            BLOCKED
                          </Badge>
                        )}
                        {event.resolved ? (
                          <Badge variant="default" className="font-mono text-xs">
                            RESOLVED
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="font-mono text-xs">
                            ACTIVE
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-slate-400 font-mono text-sm">
                        <Clock className="w-3 h-3" />
                        {new Date(event.created_at).toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No security events found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
