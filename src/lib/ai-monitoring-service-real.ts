// AI Monitoring and Fraud Detection Service - Real Implementation
// Provides intelligent monitoring and anomaly detection with real database operations

import { supabase } from '@/integrations/supabase/client';

export interface FraudAlert {
  id: string;
  user_id: string;
  deal_id: string | null;
  monitor_id: string;
  alert_type: 'suspicious_activity' | 'pattern_anomaly' | 'risk_escalation' | 'fraud_indicators';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence_score: number;
  indicators: string[];
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  metadata: any;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
}

export interface AIMonitor {
  id: string;
  name: string;
  type: 'fraud_detection' | 'anomaly_detection' | 'market_prediction' | 'security_threat';
  description: string;
  status: 'active' | 'inactive' | 'error';
  confidence_threshold: number;
  last_run: string;
  created_at: string;
  updated_at: string;
}

export const aiMonitoringService = {
  // Get all fraud alerts - REAL DATA ONLY
  async getFraudAlerts(filters?: {
    status?: string;
    severity?: string;
    alert_type?: string;
  }): Promise<FraudAlert[]> {
    try {
      let query = supabase
        .from('fraud_alerts')
        .select(`
          *,
          user:user_id(full_name, email),
          deal:deal_id(id, quote_amount, route)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters?.alert_type) {
        query = query.eq('alert_type', filters.alert_type);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Database error:', error);
        return [];
      }
      return data || [];

    } catch (error) {
      console.error('Error getting fraud alerts:', error);
      return [];
    }
  },

  // Get all monitors - REAL DATA ONLY
  async getMonitors(): Promise<AIMonitor[]> {
    try {
      const { data, error } = await supabase
        .from('ai_monitors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        return [];
      }
      return data || [];

    } catch (error) {
      console.error('Error getting monitors:', error);
      return [];
    }
  },

  // Get monitoring statistics - REAL DATA ONLY
  async getMonitoringStats(): Promise<any> {
    try {
      const { data: alerts, error } = await supabase
        .from('fraud_alerts')
        .select('severity, status, created_at');

      if (error) {
        console.error('Database error:', error);
        return {
          total_alerts: 0,
          critical_alerts: 0,
          resolved_alerts: 0,
          recent_activity: 0
        };
      }

      const totalAlerts = alerts?.length || 0;
      const criticalAlerts = alerts?.filter(a => a.severity === 'critical').length || 0;
      const resolvedAlerts = alerts?.filter(a => a.status === 'resolved').length || 0;
      const recentActivity = alerts?.filter(a => 
        new Date(a.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length || 0;

      return {
        total_alerts: totalAlerts,
        critical_alerts: criticalAlerts,
        resolved_alerts: resolvedAlerts,
        recent_activity: recentActivity
      };
    } catch (error) {
      console.error('Error getting monitoring stats:', error);
      return {
        total_alerts: 0,
        critical_alerts: 0,
        resolved_alerts: 0,
        recent_activity: 0
      };
    }
  },

  // Resolve fraud alert - REAL OPERATION
  async resolveFraudAlert(alertId: string, resolvedBy: string, resolution: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('fraud_alerts')
        .update({
          status: 'resolved',
          resolved_by: resolvedBy,
          resolved_at: new Date().toISOString(),
          metadata: { resolution }
        })
        .eq('id', alertId);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error resolving fraud alert:', error);
      throw error;
    }
  },

  // Create fraud alert - REAL OPERATION
  async createFraudAlert(alert: Omit<FraudAlert, 'id' | 'created_at'>): Promise<FraudAlert> {
    try {
      const { data, error } = await supabase
        .from('fraud_alerts')
        .insert({
          ...alert,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating fraud alert:', error);
      throw error;
    }
  },

  // Update monitor - REAL OPERATION
  async updateMonitor(monitorId: string, updates: Partial<AIMonitor>): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_monitors')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', monitorId);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating monitor:', error);
      throw error;
    }
  }
};

