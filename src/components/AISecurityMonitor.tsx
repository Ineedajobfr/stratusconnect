import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { AlertTriangle, Shield, Eye, Clock } from 'lucide-react';

interface SecurityEventMetadata {
  user_agent?: string;
  ip_address?: string;
  location?: string;
  device_info?: Record<string, unknown>;
  additional_data?: Record<string, unknown>;
}

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  description: string;
  created_at: string;
  metadata: SecurityEventMetadata;
}

interface AIWarning {
  id: string;
  warning_type: string;
  message: string;
  severity: string;
  acknowledged: boolean;
  created_at: string;
  expires_at: string | null;
}

const AISecurityMonitor: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [warnings, setWarnings] = useState<AIWarning[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSecurityData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch recent security events
      const { data: eventsData, error: eventsError } = await supabase
        .from('security_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (eventsError) throw eventsError;

      // Fetch active warnings
      const { data: warningsData, error: warningsError } = await supabase
        .from('ai_warnings')
        .select('*')
        .eq('user_id', user.id)
        .eq('acknowledged', false)
        .order('created_at', { ascending: false });

      if (warningsError) throw warningsError;

      setEvents(eventsData || []);
      setWarnings(warningsData || []);
    } catch (error) {
      console.error('Error fetching security data:', error);
      toast({
        title: "Error",
        description: "Failed to load security monitoring data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const acknowledgeWarning = async (warningId: string) => {
    try {
      const { error } = await supabase
        .from('ai_warnings')
        .update({ acknowledged: true })
        .eq('id', warningId);

      if (error) throw error;

      setWarnings(warnings.filter(w => w.id !== warningId));
      toast({
        title: "Warning acknowledged",
        description: "Warning has been marked as read",
      });
    } catch (error) {
      console.error('Error acknowledging warning:', error);
      toast({
        title: "Error",
        description: "Failed to acknowledge warning",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
      case 'danger':
        return 'destructive';
      case 'medium':
      case 'warning':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
      case 'danger':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
      case 'warning':
        return <Eye className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, [fetchSecurityData]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted animate-pulse rounded"></div>
                <div className="h-3 bg-muted animate-pulse rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* AI Warnings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active AI Warnings ({warnings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {warnings.length === 0 ? (
            <p className="text-muted-foreground">No active warnings</p>
          ) : (
            <div className="space-y-3">
              {warnings.map((warning) => (
                <div key={warning.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getSeverityIcon(warning.severity)}
                        <Badge variant={getSeverityColor(warning.severity)}>
                          {warning.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {warning.warning_type}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{warning.message}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(warning.created_at).toLocaleString()}
                        {warning.expires_at && (
                          <span>• Expires {new Date(warning.expires_at).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => acknowledgeWarning(warning.id)}
                    >
                      Acknowledge
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recent Security Events ({events.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-muted-foreground">No recent security events</p>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {getSeverityIcon(event.severity)}
                    <Badge variant={getSeverityColor(event.severity)}>
                      {event.severity.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {event.event_type}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{event.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(event.created_at).toLocaleString()}
                  </div>
                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer">
                        View Details
                      </summary>
                      <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AISecurityMonitor;