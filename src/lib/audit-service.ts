// Audit Trail Service - Industry Standard Implementation
// FCA Compliant Aviation Platform

import { supabase } from "@/integrations/supabase/client";

export interface AuditEvent {
  id: string;
  userId: string;
  userRole: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'compliance' | 'security';
  outcome: 'success' | 'failure' | 'warning';
  sessionId: string;
  requestId: string;
  complianceFlags: string[];
  dataRetention: {
    expiresAt: string;
    retentionReason: string;
  };
}

export interface AuditQuery {
  userId?: string;
  userRole?: string;
  action?: string;
  resource?: string;
  severity?: string;
  category?: string;
  outcome?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface AuditSummary {
  totalEvents: number;
  eventsByCategory: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  eventsByOutcome: Record<string, number>;
  eventsByUser: Record<string, number>;
  complianceIssues: number;
  securityIncidents: number;
  lastUpdated: string;
}

class AuditService {
  // Log an audit event
  async logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<AuditEvent> {
    try {
      const auditEvent: AuditEvent = {
        ...event,
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('audit_events')
        .insert({
          id: auditEvent.id,
          user_id: auditEvent.userId,
          user_role: auditEvent.userRole,
          action: auditEvent.action,
          resource: auditEvent.resource,
          resource_id: auditEvent.resourceId,
          details: auditEvent.details,
          ip_address: auditEvent.ipAddress,
          user_agent: auditEvent.userAgent,
          timestamp: auditEvent.timestamp,
          severity: auditEvent.severity,
          category: auditEvent.category,
          outcome: auditEvent.outcome,
          session_id: auditEvent.sessionId,
          request_id: auditEvent.requestId,
          compliance_flags: auditEvent.complianceFlags,
          data_retention: auditEvent.dataRetention
        })
        .select()
        .single();

      if (error) throw error;

      // Check for compliance issues
      await this.checkComplianceFlags(auditEvent);

      // Check for security incidents
      await this.checkSecurityIncidents(auditEvent);

      return auditEvent;
    } catch (error) {
      console.error('Error logging audit event:', error);
      throw error;
    }
  }

  // Query audit events
  async queryEvents(query: AuditQuery): Promise<AuditEvent[]> {
    try {
      let supabaseQuery = supabase
        .from('audit_events')
        .select('*')
        .order('timestamp', { ascending: false });

      if (query.userId) {
        supabaseQuery = supabaseQuery.eq('user_id', query.userId);
      }
      if (query.userRole) {
        supabaseQuery = supabaseQuery.eq('user_role', query.userRole);
      }
      if (query.action) {
        supabaseQuery = supabaseQuery.eq('action', query.action);
      }
      if (query.resource) {
        supabaseQuery = supabaseQuery.eq('resource', query.resource);
      }
      if (query.severity) {
        supabaseQuery = supabaseQuery.eq('severity', query.severity);
      }
      if (query.category) {
        supabaseQuery = supabaseQuery.eq('category', query.category);
      }
      if (query.outcome) {
        supabaseQuery = supabaseQuery.eq('outcome', query.outcome);
      }
      if (query.startDate) {
        supabaseQuery = supabaseQuery.gte('timestamp', query.startDate);
      }
      if (query.endDate) {
        supabaseQuery = supabaseQuery.lte('timestamp', query.endDate);
      }
      if (query.limit) {
        supabaseQuery = supabaseQuery.limit(query.limit);
      }
      if (query.offset) {
        supabaseQuery = supabaseQuery.range(query.offset, query.offset + (query.limit || 50) - 1);
      }

      const { data, error } = await supabaseQuery;

      if (error) throw error;

      return data.map(event => ({
        id: event.id,
        userId: event.user_id,
        userRole: event.user_role,
        action: event.action,
        resource: event.resource,
        resourceId: event.resource_id,
        details: event.details,
        ipAddress: event.ip_address,
        userAgent: event.user_agent,
        timestamp: event.timestamp,
        severity: event.severity,
        category: event.category,
        outcome: event.outcome,
        sessionId: event.session_id,
        requestId: event.request_id,
        complianceFlags: event.compliance_flags,
        dataRetention: event.data_retention
      }));
    } catch (error) {
      console.error('Error querying audit events:', error);
      return [];
    }
  }

  // Get audit summary
  async getAuditSummary(startDate?: string, endDate?: string): Promise<AuditSummary> {
    try {
      let query = supabase
        .from('audit_events')
        .select('*');

      if (startDate) {
        query = query.gte('timestamp', startDate);
      }
      if (endDate) {
        query = query.lte('timestamp', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      const events = data || [];
      const summary: AuditSummary = {
        totalEvents: events.length,
        eventsByCategory: {},
        eventsBySeverity: {},
        eventsByOutcome: {},
        eventsByUser: {},
        complianceIssues: 0,
        securityIncidents: 0,
        lastUpdated: new Date().toISOString()
      };

      events.forEach(event => {
        // Count by category
        summary.eventsByCategory[event.category] = (summary.eventsByCategory[event.category] || 0) + 1;
        
        // Count by severity
        summary.eventsBySeverity[event.severity] = (summary.eventsBySeverity[event.severity] || 0) + 1;
        
        // Count by outcome
        summary.eventsByOutcome[event.outcome] = (summary.eventsByOutcome[event.outcome] || 0) + 1;
        
        // Count by user
        summary.eventsByUser[event.user_id] = (summary.eventsByUser[event.user_id] || 0) + 1;
        
        // Count compliance issues
        if (event.compliance_flags && event.compliance_flags.length > 0) {
          summary.complianceIssues++;
        }
        
        // Count security incidents
        if (event.severity === 'critical' && event.category === 'security') {
          summary.securityIncidents++;
        }
      });

      return summary;
    } catch (error) {
      console.error('Error getting audit summary:', error);
      return {
        totalEvents: 0,
        eventsByCategory: {},
        eventsBySeverity: {},
        eventsByOutcome: {},
        eventsByUser: {},
        complianceIssues: 0,
        securityIncidents: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // Get compliance report
  async getComplianceReport(startDate: string, endDate: string): Promise<{
    fca: { compliant: boolean; issues: string[] };
    easa: { compliant: boolean; issues: string[] };
    faa: { compliant: boolean; issues: string[] };
    icao: { compliant: boolean; issues: string[] };
  }> {
    try {
      const events = await this.queryEvents({
        startDate,
        endDate,
        category: 'compliance'
      });

      const complianceReport = {
        fca: { compliant: true, issues: [] as string[] },
        easa: { compliant: true, issues: [] as string[] },
        faa: { compliant: true, issues: [] as string[] },
        icao: { compliant: true, issues: [] as string[] }
      };

      events.forEach(event => {
        if (event.complianceFlags.includes('fca_violation')) {
          complianceReport.fca.compliant = false;
          complianceReport.fca.issues.push(`FCA violation: ${event.action} on ${event.timestamp}`);
        }
        if (event.complianceFlags.includes('easa_violation')) {
          complianceReport.easa.compliant = false;
          complianceReport.easa.issues.push(`EASA violation: ${event.action} on ${event.timestamp}`);
        }
        if (event.complianceFlags.includes('faa_violation')) {
          complianceReport.faa.compliant = false;
          complianceReport.faa.issues.push(`FAA violation: ${event.action} on ${event.timestamp}`);
        }
        if (event.complianceFlags.includes('icao_violation')) {
          complianceReport.icao.compliant = false;
          complianceReport.icao.issues.push(`ICAO violation: ${event.action} on ${event.timestamp}`);
        }
      });

      return complianceReport;
    } catch (error) {
      console.error('Error getting compliance report:', error);
      return {
        fca: { compliant: true, issues: [] },
        easa: { compliant: true, issues: [] },
        faa: { compliant: true, issues: [] },
        icao: { compliant: true, issues: [] }
      };
    }
  }

  // Export audit data
  async exportAuditData(query: AuditQuery, format: 'json' | 'csv' = 'json'): Promise<string> {
    try {
      const events = await this.queryEvents(query);
      
      if (format === 'csv') {
        const headers = [
          'ID', 'User ID', 'User Role', 'Action', 'Resource', 'Resource ID',
          'IP Address', 'User Agent', 'Timestamp', 'Severity', 'Category',
          'Outcome', 'Session ID', 'Request ID', 'Compliance Flags'
        ];
        
        const csvRows = events.map(event => [
          event.id,
          event.userId,
          event.userRole,
          event.action,
          event.resource,
          event.resourceId,
          event.ipAddress,
          event.userAgent,
          event.timestamp,
          event.severity,
          event.category,
          event.outcome,
          event.sessionId,
          event.requestId,
          event.complianceFlags.join(';')
        ]);
        
        return [headers, ...csvRows].map(row => row.join(',')).join('\n');
      } else {
        return JSON.stringify(events, null, 2);
      }
    } catch (error) {
      console.error('Error exporting audit data:', error);
      throw error;
    }
  }

  // Private helper methods
  private async checkComplianceFlags(event: AuditEvent): Promise<void> {
    const complianceFlags: string[] = [];
    
    // Check for FCA compliance issues
    if (event.userRole === 'broker' && event.action === 'create_rfq') {
      if (!event.details.complianceNotes) {
        complianceFlags.push('fca_missing_compliance_notes');
      }
    }
    
    // Check for EASA compliance issues
    if (event.resource === 'aircraft' && event.action === 'maintenance') {
      if (event.details.hoursSinceInspection > 100) {
        complianceFlags.push('easa_maintenance_overdue');
      }
    }
    
    // Check for FAA compliance issues
    if (event.category === 'security' && event.outcome === 'failure') {
      complianceFlags.push('faa_security_incident');
    }
    
    // Check for ICAO compliance issues
    if (event.userRole === 'pilot' && event.action === 'flight_plan') {
      if (!event.details.icaoFlightPlan) {
        complianceFlags.push('icao_missing_flight_plan');
      }
    }
    
    // Update event with compliance flags if any
    if (complianceFlags.length > 0) {
      await supabase
        .from('audit_events')
        .update({ compliance_flags: complianceFlags })
        .eq('id', event.id);
    }
  }

  private async checkSecurityIncidents(event: AuditEvent): Promise<void> {
    // Check for suspicious patterns
    if (event.severity === 'critical' && event.category === 'security') {
      // Log security incident
      await this.logEvent({
        userId: 'system',
        userRole: 'admin',
        action: 'security_incident_detected',
        resource: 'audit_system',
        resourceId: event.id,
        details: {
          originalEvent: event.id,
          incidentType: 'critical_security_event',
          severity: 'critical'
        },
        ipAddress: 'system',
        userAgent: 'audit_system',
        severity: 'critical',
        category: 'security',
        outcome: 'success',
        sessionId: 'system',
        requestId: `incident_${Date.now()}`,
        complianceFlags: ['security_incident'],
        dataRetention: {
          expiresAt: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000).toISOString(),
          retentionReason: 'security_incident'
        }
      });
    }
  }

  // Helper method to create audit event
  static createAuditEvent(
    userId: string,
    userRole: string,
    action: string,
    resource: string,
    resourceId: string,
    details: Record<string, any> = {},
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system' | 'compliance' | 'security' = 'data_access',
    outcome: 'success' | 'failure' | 'warning' = 'success'
  ): Omit<AuditEvent, 'id' | 'timestamp'> {
    return {
      userId,
      userRole: userRole as any,
      action,
      resource,
      resourceId,
      details,
      ipAddress: 'unknown', // Would be set by middleware
      userAgent: 'unknown', // Would be set by middleware
      severity,
      category,
      outcome,
      sessionId: 'unknown', // Would be set by middleware
      requestId: 'unknown', // Would be set by middleware
      complianceFlags: [],
      dataRetention: {
        expiresAt: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000).toISOString(),
        retentionReason: 'standard_retention'
      }
    };
  }
}

export const auditService = new AuditService();
