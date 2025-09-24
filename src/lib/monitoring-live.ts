// Live Monitoring Service - Production Ready
// Real-time telemetry and incident management

import { supabase } from '@/integrations/supabase/client';

export interface UptimeMetrics {
  uptime_24h: number;
  uptime_7d: number;
  uptime_30d: number;
  response_time_24h: number;
  response_time_7d: number;
  incidents_24h: number;
  incidents_7d: number;
  last_incident: string | null;
  current_status: 'up' | 'down' | 'paused';
}

export interface Incident {
  id: string;
  name: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  started_at: string;
  resolved_at?: string;
  description: string;
  affected_services: string[];
  impact: 'minor' | 'major' | 'critical';
  created_by: string;
}

export interface SystemStatus {
  uptime: UptimeMetrics;
  incidents: Incident[];
  timestamp: string;
  version: string;
}

class MonitoringLiveService {
  private uptimeRobotApiKey: string;
  private appBaseUrl: string;

  constructor() {
    this.uptimeRobotApiKey = process.env.UPTIMEROBOT_API_KEY || '';
    this.appBaseUrl = process.env.VITE_APP_BASE_URL || 'https://stratusconnect.com';
  }

  /**
   * Get real-time system status from UptimeRobot
   */
  async getSystemStatus(): Promise<SystemStatus> {
    try {
      const uptime = await this.getUptimeMetrics();
      const incidents = await this.getActiveIncidents();

      return {
        uptime,
        incidents,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
    } catch (error) {
      console.error('Failed to get system status:', error);
      throw new Error('Monitoring service unavailable');
    }
  }

  /**
   * Get uptime metrics from UptimeRobot
   */
  private async getUptimeMetrics(): Promise<UptimeMetrics> {
    if (!this.uptimeRobotApiKey) {
      // Return N/A values when no API key
      return {
        uptime_24h: 0,
        uptime_7d: 0,
        uptime_30d: 0,
        response_time_24h: 0,
        response_time_7d: 0,
        incidents_24h: 0,
        incidents_7d: 0,
        last_incident: null,
        current_status: 'paused'
      };
    }

    try {
      const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          api_key: this.uptimeRobotApiKey,
          format: 'json',
          logs: '1',
          response_times: '1',
          custom_uptime_ranges: '1-7-30',
        }),
      });

      if (!response.ok) {
        throw new Error(`UptimeRobot API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.stat !== 'ok') {
        throw new Error(`UptimeRobot API error: ${data.error?.message || 'Unknown error'}`);
      }

      const monitors = (data.monitors ?? []) as any[];
      const primaryMonitor = monitors.find((m: any) => 
        (m?.friendly_name === 'Stratus Connect') || 
        (typeof m?.url === 'string' && m.url.includes(this.appBaseUrl))
      ) || monitors[0];

      if (!primaryMonitor) {
        throw new Error('No monitors found');
      }

      return this.calculateUptimeMetrics(primaryMonitor);

    } catch (error) {
      console.error('UptimeRobot API error:', error);
      // Return N/A values on error
      return {
        uptime_24h: 0,
        uptime_7d: 0,
        uptime_30d: 0,
        response_time_24h: 0,
        response_time_7d: 0,
        incidents_24h: 0,
        incidents_7d: 0,
        last_incident: null,
        current_status: 'paused'
      };
    }
  }

  /**
   * Calculate uptime metrics from UptimeRobot data
   */
  private calculateUptimeMetrics(monitor: Record<string, unknown>): UptimeMetrics {
    const ranges = Array.isArray((monitor as any)?.custom_uptime_ranges)
      ? ((monitor as any).custom_uptime_ranges as Record<string, unknown>[])
      : [];
    const logs = Array.isArray((monitor as any)?.logs)
      ? ((monitor as any).logs as Record<string, unknown>[])
      : [];

    const uptime_24h = this.calculateUptime(ranges, 1);
    const uptime_7d = this.calculateUptime(ranges, 7);
    const uptime_30d = this.calculateUptime(ranges, 30);

    const response_time_24h = this.calculateResponseTime(logs, 24);
    const response_time_7d = this.calculateResponseTime(logs, 168);

    const incidents_24h = this.countIncidents(logs, 24);
    const incidents_7d = this.countIncidents(logs, 168);

    const last_incident = this.getLastIncident(logs);

    const statusNum = Number((monitor as any)?.status);
    return {
      uptime_24h,
      uptime_7d,
      uptime_30d,
      response_time_24h,
      response_time_7d,
      incidents_24h,
      incidents_7d,
      last_incident,
      current_status: statusNum === 2 ? 'up' : statusNum === 9 ? 'paused' : 'down'
    };
  }

  /**
   * Calculate uptime percentage for given period
   */
  private calculateUptime(ranges: Record<string, unknown>[], days: number): number {
    if (!ranges || ranges.length === 0) return 0;
    const range = ranges.find((r: Record<string, unknown>) => (r as any)?.range === days) as any;
    const ratio = range?.ratio;
    const num = typeof ratio === 'number' ? ratio : parseFloat(String(ratio ?? 0));
    return isNaN(num) ? 0 : num;
  }

  /**
   * Calculate average response time for given period
   */
  private calculateResponseTime(logs: Record<string, unknown>[], hours: number): number {
    if (!logs || logs.length === 0) return 0;
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);

    const recentLogs = logs.filter((log: Record<string, unknown>) => {
      const dt = Number((log as any)?.datetime);
      const type = Number((log as any)?.type);
      return !isNaN(dt) && new Date(dt * 1000) > cutoff && type === 1;
    });

    if (recentLogs.length === 0) return 0;

    const totalResponseTime = recentLogs.reduce((sum: number, log: Record<string, unknown>) => {
      const duration = Number((log as any)?.duration ?? 0);
      return sum + (isNaN(duration) ? 0 : duration);
    }, 0);

    return Math.round(totalResponseTime / recentLogs.length);
  }

  /**
   * Count incidents in given period
   */
  private countIncidents(logs: Record<string, unknown>[], hours: number): number {
    if (!logs || logs.length === 0) return 0;
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);

    return logs.filter((log: Record<string, unknown>) => {
      const dt = Number((log as any)?.datetime);
      const type = Number((log as any)?.type);
      return !isNaN(dt) && new Date(dt * 1000) > cutoff && type === 0;
    }).length;
  }

  /**
   * Get last incident timestamp
   */
  private getLastIncident(logs: Record<string, unknown>[]): string | null {
    if (!logs || logs.length === 0) return null;
    const incidentLogs = logs.filter((log: Record<string, unknown>) => Number((log as any)?.type) === 0);
    if (incidentLogs.length === 0) return null;
    const lastIncident = incidentLogs[incidentLogs.length - 1] as any;
    const dt = Number(lastIncident?.datetime);
    return isNaN(dt) ? null : new Date(dt * 1000).toISOString();
  }

  /**
   * Get active incidents from database
   */
  private async getActiveIncidents(): Promise<Incident[]> {
    try {
      const { data, error } = await supabase
        .from('incidents' as any)
        .select('*')
        .in('status', ['investigating', 'identified', 'monitoring'] as any)
        .order('started_at', { ascending: false } as any);

      if (error) {
        console.error('Failed to fetch incidents:', error);
        return [];
      }

      return (data as unknown as Incident[]) || [];
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
      return [];
    }
  }

  /**
   * Create incident
   */
  async createIncident(incident: Omit<Incident, 'id' | 'started_at'>): Promise<Incident> {
    const newIncident: Incident = {
      id: crypto.randomUUID(),
      ...incident,
      started_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from('incidents' as any)
        .insert(newIncident as any);

      if (error) {
        throw new Error(`Failed to create incident: ${error.message}`);
      }

      // Log audit event
      await this.logAuditEvent({
        action: 'incident_created',
        incident_id: newIncident.id,
        details: {
          name: newIncident.name,
          impact: newIncident.impact,
          affected_services: newIncident.affected_services
        }
      });

      return newIncident;
    } catch (error) {
      console.error('Failed to create incident:', error);
      throw error;
    }
  }

  /**
   * Resolve incident
   */
  async resolveIncident(incidentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('incidents' as any)
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString()
        } as any)
        .eq('id', incidentId as any);

      if (error) {
        throw new Error(`Failed to resolve incident: ${error.message}`);
      }

      // Log audit event
      await this.logAuditEvent({
        action: 'incident_resolved',
        incident_id: incidentId
      });

    } catch (error) {
      console.error('Failed to resolve incident:', error);
      throw error;
    }
  }

  /**
   * Log audit event
   */
  private async logAuditEvent(event: Record<string, unknown>): Promise<void> {
    try {
      await supabase
        .from('audit_log')
        .insert({
          action: event.action,
          details: event.details,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  /**
   * Get SLA compliance status
   */
  async getSLAStatus(): Promise<{
    uptime_target: number;
    current_uptime: number;
    compliant: boolean;
    service_credits: number;
  }> {
    const status = await this.getSystemStatus();
    const uptime_target = 99.9;
    const current_uptime = status.uptime.uptime_30d;
    const compliant = current_uptime >= uptime_target;
    
    // Calculate service credits (simplified)
    const service_credits = compliant ? 0 : Math.max(0, (uptime_target - current_uptime) * 10);

    return {
      uptime_target,
      current_uptime,
      compliant,
      service_credits
    };
  }
}

export const monitoringLiveService = new MonitoringLiveService();
export default monitoringLiveService;
