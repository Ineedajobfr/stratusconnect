// Audit Trail Widget - Industry Standard
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Activity,
  FileText,
  Calendar,
  X
} from 'lucide-react';
import { auditService, type AuditEvent, type AuditQuery, type AuditSummary } from '@/lib/audit-service';
import { toast } from '@/hooks/use-toast';

interface AuditTrailWidgetProps {
  userId?: string;
  userRole?: string;
  showFilters?: boolean;
  showSummary?: boolean;
  className?: string;
}

export function AuditTrailWidget({ 
  userId, 
  userRole,
  showFilters = true,
  showSummary = true,
  className = ''
}: AuditTrailWidgetProps) {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AuditQuery>({
    userId,
    userRole,
    limit: 50
  });
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  useEffect(() => {
    loadAuditData();
  }, [filters]);

  const loadAuditData = async () => {
    try {
      setLoading(true);
      
      const [eventsData, summaryData] = await Promise.all([
        auditService.queryEvents(filters),
        showSummary ? auditService.getAuditSummary() : null
      ]);
      
      setEvents(eventsData);
      if (summaryData) {
        setSummary(summaryData);
      }
    } catch (error) {
      console.error('Error loading audit data:', error);
      toast({
        title: "Audit Error",
        description: "Failed to load audit data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const data = await auditService.exportAuditData(filters, format);
      const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-trail-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: `Audit data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Error exporting audit data:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export audit data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'critical': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <User className="w-4 h-4" />;
      case 'authorization': return <Shield className="w-4 h-4" />;
      case 'data_access': return <Eye className="w-4 h-4" />;
      case 'data_modification': return <Activity className="w-4 h-4" />;
      case 'system': return <Activity className="w-4 h-4" />;
      case 'compliance': return <FileText className="w-4 h-4" />;
      case 'security': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failure': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading && events.length === 0) {
    return (
      <Card className={`terminal-card ${className}`}>
        <CardContent className="text-center py-12">
          <Activity className="w-8 h-8 mx-auto mb-4 animate-spin text-accent" />
          <p className="text-gunmetal">Loading audit data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Audit Trail
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport('json')}
              >
                <Download className="w-4 h-4 mr-1" />
                JSON
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport('csv')}
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-sm text-gunmetal mb-1 block">Action</label>
                <Input
                  placeholder="Search actions..."
                  value={filters.action || ''}
                  onChange={(e) => handleFilterChange('action', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gunmetal mb-1 block">Severity</label>
                <Select
                  value={filters.severity || ''}
                  onValueChange={(value) => handleFilterChange('severity', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All severities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All severities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gunmetal mb-1 block">Category</label>
                <Select
                  value={filters.category || ''}
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    <SelectItem value="authentication">Authentication</SelectItem>
                    <SelectItem value="authorization">Authorization</SelectItem>
                    <SelectItem value="data_access">Data Access</SelectItem>
                    <SelectItem value="data_modification">Data Modification</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gunmetal mb-1 block">Outcome</label>
                <Select
                  value={filters.outcome || ''}
                  onValueChange={(value) => handleFilterChange('outcome', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All outcomes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All outcomes</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failure">Failure</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Summary */}
          {showSummary && summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-terminal-card/30 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{summary.totalEvents}</div>
                <div className="text-sm text-gunmetal">Total Events</div>
              </div>
              <div className="text-center p-3 bg-terminal-card/30 rounded-lg">
                <div className="text-2xl font-bold text-orange-400">{summary.complianceIssues}</div>
                <div className="text-sm text-gunmetal">Compliance Issues</div>
              </div>
              <div className="text-center p-3 bg-terminal-card/30 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{summary.securityIncidents}</div>
                <div className="text-sm text-gunmetal">Security Incidents</div>
              </div>
              <div className="text-center p-3 bg-terminal-card/30 rounded-lg">
                <div className="text-2xl font-bold text-accent">{summary.eventsBySeverity.critical || 0}</div>
                <div className="text-sm text-gunmetal">Critical Events</div>
              </div>
            </div>
          )}

          {/* Events List */}
          <div className="space-y-2">
            {events.length === 0 ? (
              <div className="text-center py-8 text-gunmetal">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No audit events found</p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="p-3 border border-terminal-border rounded-lg hover:border-accent/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowDetails(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(event.category)}
                      <div>
                        <div className="font-medium text-foreground">{event.action}</div>
                        <div className="text-sm text-gunmetal">
                          {event.resource} • {event.userRole} • {formatTimestamp(event.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                      {getOutcomeIcon(event.outcome)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      {showDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-terminal-card border-terminal-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Event Details</CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowDetails(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gunmetal">Event ID</label>
                  <p className="text-foreground font-mono text-sm">{selectedEvent.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gunmetal">Timestamp</label>
                  <p className="text-foreground">{formatTimestamp(selectedEvent.timestamp)}</p>
                </div>
                <div>
                  <label className="text-sm text-gunmetal">User</label>
                  <p className="text-foreground">{selectedEvent.userId} ({selectedEvent.userRole})</p>
                </div>
                <div>
                  <label className="text-sm text-gunmetal">Action</label>
                  <p className="text-foreground">{selectedEvent.action}</p>
                </div>
                <div>
                  <label className="text-sm text-gunmetal">Resource</label>
                  <p className="text-foreground">{selectedEvent.resource} ({selectedEvent.resourceId})</p>
                </div>
                <div>
                  <label className="text-sm text-gunmetal">Severity</label>
                  <Badge className={getSeverityColor(selectedEvent.severity)}>
                    {selectedEvent.severity}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gunmetal">Details</label>
                <pre className="text-xs text-foreground bg-terminal-card/30 p-3 rounded border border-terminal-border overflow-auto">
                  {JSON.stringify(selectedEvent.details, null, 2)}
                </pre>
              </div>
              
              {selectedEvent.complianceFlags.length > 0 && (
                <div>
                  <label className="text-sm text-gunmetal">Compliance Flags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedEvent.complianceFlags.map((flag, index) => (
                      <Badge key={index} className="bg-orange-500/20 text-orange-400">
                        {flag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
