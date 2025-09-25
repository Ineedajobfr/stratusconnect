// AI Monitoring and Fraud Detection Service
// Provides intelligent monitoring and anomaly detection

import { supabase } from '@/integrations/supabase/client';

export interface AIMonitor {
  id: string;
  name: string;
  type: 'fraud_detection' | 'anomaly_detection' | 'pattern_analysis' | 'risk_assessment';
  status: 'active' | 'inactive' | 'error';
  confidence_threshold: number;
  last_run: string;
  next_run: string;
  created_at: string;
  config: any;
}

export interface FraudAlert {
  id: string;
  monitor_id: string;
  user_id?: string;
  deal_id?: string;
  alert_type: 'suspicious_activity' | 'pattern_anomaly' | 'risk_escalation' | 'fraud_indicators';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence_score: number;
  description: string;
  indicators: string[];
  metadata: any;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

export interface AnomalyPattern {
  id: string;
  pattern_name: string;
  description: string;
  indicators: string[];
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  frequency_threshold: number;
  time_window: number; // in hours
  active: boolean;
  created_at: string;
}

export class AIMonitoringService {
  private static instance: AIMonitoringService;

  static getInstance(): AIMonitoringService {
    if (!AIMonitoringService.instance) {
      AIMonitoringService.instance = new AIMonitoringService();
    }
    return AIMonitoringService.instance;
  }

  // Create AI monitor
  async createMonitor(monitor: Omit<AIMonitor, 'id' | 'created_at' | 'last_run' | 'next_run'>): Promise<AIMonitor> {
    try {
      const nextRun = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

      const { data, error } = await supabase
        .from('ai_monitors')
        .insert({
          ...monitor,
          last_run: new Date().toISOString(),
          next_run: nextRun.toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;

    } catch (error) {
      console.error('Error creating AI monitor:', error);
      throw error;
    }
  }

  // Run all active monitors
  async runAllMonitors(): Promise<void> {
    try {
      const { data: monitors, error } = await supabase
        .from('ai_monitors')
        .select('*')
        .eq('status', 'active')
        .lte('next_run', new Date().toISOString());

      if (error) throw error;

      for (const monitor of monitors || []) {
        await this.runMonitor(monitor);
      }

    } catch (error) {
      console.error('Error running monitors:', error);
    }
  }

  // Run specific monitor
  async runMonitor(monitor: AIMonitor): Promise<void> {
    try {
      switch (monitor.type) {
        case 'fraud_detection':
          await this.runFraudDetection(monitor);
          break;
        case 'anomaly_detection':
          await this.runAnomalyDetection(monitor);
          break;
        case 'pattern_analysis':
          await this.runPatternAnalysis(monitor);
          break;
        case 'risk_assessment':
          await this.runRiskAssessment(monitor);
          break;
      }

      // Update monitor last run time
      const nextRun = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
      await supabase
        .from('ai_monitors')
        .update({
          last_run: new Date().toISOString(),
          next_run: nextRun.toISOString()
        })
        .eq('id', monitor.id);

    } catch (error) {
      console.error(`Error running monitor ${monitor.name}:`, error);
      
      // Mark monitor as error
      await supabase
        .from('ai_monitors')
        .update({ status: 'error' })
        .eq('id', monitor.id);
    }
  }

  // Fraud detection monitor
  private async runFraudDetection(monitor: AIMonitor): Promise<void> {
    try {
      // Get recent user activities
      const { data: activities, error } = await supabase
        .from('user_activities')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Analyze for fraud indicators
      const fraudIndicators = await this.analyzeFraudIndicators(activities || []);

      // Create alerts for high-risk activities
      for (const indicator of fraudIndicators) {
        if (indicator.risk_score >= monitor.confidence_threshold) {
          await this.createFraudAlert({
            monitor_id: monitor.id,
            user_id: indicator.user_id,
            deal_id: indicator.deal_id,
            alert_type: 'fraud_indicators',
            severity: indicator.risk_score > 0.8 ? 'critical' : 
                     indicator.risk_score > 0.6 ? 'high' : 'medium',
            confidence_score: indicator.risk_score,
            description: indicator.description,
            indicators: indicator.indicators,
            metadata: indicator.metadata,
            status: 'new'
          });
        }
      }

    } catch (error) {
      console.error('Error in fraud detection:', error);
    }
  }

  // Analyze fraud indicators
  private async analyzeFraudIndicators(activities: any[]): Promise<any[]> {
    const indicators = [];

    // Group activities by user
    const userActivities = activities.reduce((acc, activity) => {
      if (!acc[activity.user_id]) acc[activity.user_id] = [];
      acc[activity.user_id].push(activity);
      return acc;
    }, {});

    for (const [userId, userActs] of Object.entries(userActivities)) {
      const userActivitiesList = userActs as any[];
      
      // Check for rapid-fire activities (potential bot)
      const rapidFire = this.detectRapidFire(userActivitiesList);
      if (rapidFire) {
        indicators.push({
          user_id: userId,
          risk_score: 0.7,
          description: 'Rapid-fire activity detected',
          indicators: ['rapid_fire_actions'],
          metadata: { activity_count: userActivitiesList.length, time_window: '1 hour' }
        });
      }

      // Check for unusual patterns
      const unusualPatterns = this.detectUnusualPatterns(userActivitiesList);
      if (unusualPatterns.length > 0) {
        indicators.push({
          user_id: userId,
          risk_score: 0.6,
          description: 'Unusual activity patterns detected',
          indicators: unusualPatterns,
          metadata: { patterns: unusualPatterns }
        });
      }

      // Check for high-value transactions
      const highValue = this.detectHighValueTransactions(userActivitiesList);
      if (highValue) {
        indicators.push({
          user_id: userId,
          risk_score: 0.5,
          description: 'High-value transaction detected',
          indicators: ['high_value_transaction'],
          metadata: highValue
        });
      }
    }

    return indicators;
  }

  // Detect rapid-fire activities
  private detectRapidFire(activities: any[]): boolean {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentActivities = activities.filter(a => new Date(a.created_at) > oneHourAgo);
    return recentActivities.length > 50; // More than 50 activities in 1 hour
  }

  // Detect unusual patterns
  private detectUnusualPatterns(activities: any[]): string[] {
    const patterns = [];

    // Check for activities at unusual hours (2 AM - 6 AM)
    const unusualHours = activities.filter(a => {
      const hour = new Date(a.created_at).getHours();
      return hour >= 2 && hour <= 6;
    });
    if (unusualHours.length > activities.length * 0.3) {
      patterns.push('unusual_hours');
    }

    // Check for repetitive actions
    const actionCounts = activities.reduce((acc, a) => {
      acc[a.action] = (acc[a.action] || 0) + 1;
      return acc;
    }, {});
    const maxRepetition = Math.max(...Object.values(actionCounts) as number[]);
    if (maxRepetition > activities.length * 0.5) {
      patterns.push('repetitive_actions');
    }

    return patterns;
  }

  // Detect high-value transactions
  private detectHighValueTransactions(activities: any[]): any | null {
    const transactions = activities.filter(a => a.action === 'transaction' && a.amount);
    const highValue = transactions.find(t => t.amount > 100000); // $100k+
    return highValue ? { amount: highValue.amount, deal_id: highValue.deal_id } : null;
  }

  // Anomaly detection monitor
  private async runAnomalyDetection(monitor: AIMonitor): Promise<void> {
    try {
      // Get system metrics
      const metrics = await this.getSystemMetrics();
      
      // Analyze for anomalies
      const anomalies = await this.detectAnomalies(metrics);

      for (const anomaly of anomalies) {
        if (anomaly.severity >= monitor.confidence_threshold) {
          await this.createFraudAlert({
            monitor_id: monitor.id,
            alert_type: 'pattern_anomaly',
            severity: anomaly.severity > 0.8 ? 'critical' : 
                     anomaly.severity > 0.6 ? 'high' : 'medium',
            confidence_score: anomaly.severity,
            description: anomaly.description,
            indicators: anomaly.indicators,
            metadata: anomaly.metadata,
            status: 'new'
          });
        }
      }

    } catch (error) {
      console.error('Error in anomaly detection:', error);
    }
  }

  // Get system metrics
  private async getSystemMetrics(): Promise<any> {
    try {
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('created_at, last_login')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('created_at, quote_amount')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (usersError || dealsError) throw usersError || dealsError;

      return {
        user_registrations: users?.length || 0,
        deal_volume: deals?.length || 0,
        total_value: deals?.reduce((sum, d) => sum + (d.quote_amount || 0), 0) || 0,
        avg_deal_value: deals?.length ? deals.reduce((sum, d) => sum + (d.quote_amount || 0), 0) / deals.length : 0
      };

    } catch (error) {
      console.error('Error getting system metrics:', error);
      return {};
    }
  }

  // Detect anomalies in metrics
  private async detectAnomalies(metrics: any): Promise<any[]> {
    const anomalies = [];

    // Check for unusual spike in registrations
    if (metrics.user_registrations > 100) { // More than 100 registrations in a week
      anomalies.push({
        severity: 0.7,
        description: 'Unusual spike in user registrations',
        indicators: ['registration_spike'],
        metadata: { count: metrics.user_registrations }
      });
    }

    // Check for unusual deal volume
    if (metrics.deal_volume > 50) { // More than 50 deals in a week
      anomalies.push({
        severity: 0.6,
        description: 'High deal volume detected',
        indicators: ['deal_volume_spike'],
        metadata: { count: metrics.deal_volume }
      });
    }

    // Check for unusually high deal values
    if (metrics.avg_deal_value > 500000) { // Average deal over $500k
      anomalies.push({
        severity: 0.8,
        description: 'Unusually high average deal values',
        indicators: ['high_value_deals'],
        metadata: { avg_value: metrics.avg_deal_value }
      });
    }

    return anomalies;
  }

  // Pattern analysis monitor
  private async runPatternAnalysis(monitor: AIMonitor): Promise<void> {
    // Implementation for pattern analysis
    console.log('Running pattern analysis...');
  }

  // Risk assessment monitor
  private async runRiskAssessment(monitor: AIMonitor): Promise<void> {
    // Implementation for risk assessment
    console.log('Running risk assessment...');
  }

  // Create fraud alert
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

      if (error) throw error;

      // Log security event
      await supabase
        .from('security_events')
        .insert({
          event_type: 'suspicious_activity',
          severity: alert.severity,
          message: `AI Alert: ${alert.description}`,
          user_id: alert.user_id,
          metadata: { alert_id: data.id, indicators: alert.indicators }
        });

      return data;

    } catch (error) {
      console.error('Error creating fraud alert:', error);
      throw error;
    }
  }

  // Get all fraud alerts
  async getFraudAlerts(filters?: {
    status?: string;
    severity?: string;
    alert_type?: string;
  }): Promise<FraudAlert[]> {
    // Always return mock data for now
    return this.getMockFraudAlerts();
  }

  // Mock fraud alerts data
  private getMockFraudAlerts(): FraudAlert[] {
    return [
      {
        id: 'alert-1',
        user_id: 'mock-user-3',
        deal_id: 'deal-2',
        monitor_id: 'monitor-1',
        alert_type: 'suspicious_activity',
        description: 'Multiple login attempts from different IP addresses within 5 minutes',
        severity: 'medium',
        confidence_score: 0.85,
        indicators: ['ip_rotation', 'rapid_attempts', 'location_mismatch'],
        status: 'new',
        created_at: '2024-01-20T16:00:00Z',
        resolved_at: null,
        resolved_by: null
      },
      {
        id: 'alert-2',
        user_id: 'mock-user-1',
        deal_id: 'deal-1',
        monitor_id: 'monitor-1',
        alert_type: 'pattern_anomaly',
        description: 'Transaction amount significantly higher than user\'s typical range',
        severity: 'high',
        confidence_score: 0.92,
        indicators: ['amount_spike', 'unusual_frequency', 'pattern_deviation'],
        status: 'investigating',
        created_at: '2024-01-20T14:30:00Z',
        resolved_at: null,
        resolved_by: 'admin'
      },
      {
        id: 'alert-3',
        user_id: 'mock-user-2',
        deal_id: null,
        monitor_id: 'monitor-2',
        alert_type: 'fraud_indicators',
        description: 'Profile information appears to be fabricated or inconsistent',
        severity: 'critical',
        confidence_score: 0.95,
        indicators: ['document_mismatch', 'verification_failures', 'inconsistent_data'],
        status: 'resolved',
        created_at: '2024-01-19T11:15:00Z',
        resolved_at: '2024-01-19T15:30:00Z',
        resolved_by: 'admin'
      }
    ];
  }

  // Resolve fraud alert
  async resolveFraudAlert(alertId: string, resolvedBy: string, resolution: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('fraud_alerts')
        .update({
          status: 'resolved',
          resolved_by: resolvedBy,
          resolved_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;

      // Log security event
      await supabase
        .from('security_events')
        .insert({
          event_type: 'admin_action',
          severity: 'medium',
          message: `Fraud alert resolved: ${resolution}`,
          user_id: resolvedBy,
          metadata: { alert_id: alertId, resolution }
        });

    } catch (error) {
      console.error('Error resolving fraud alert:', error);
      throw error;
    }
  }

  // Get AI monitoring dashboard data
  async getMonitoringDashboard(): Promise<any> {
    try {
      const [alerts, monitors, stats] = await Promise.all([
        this.getFraudAlerts(),
        this.getMonitors(),
        this.getMonitoringStats()
      ]);

      return {
        alerts: alerts.slice(0, 10), // Recent 10 alerts
        monitors,
        stats,
        recent_activity: alerts.filter(a => {
          const created = new Date(a.created_at);
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return created > dayAgo;
        }).length
      };

    } catch (error) {
      console.error('Error getting monitoring dashboard:', error);
      return {
        alerts: [],
        monitors: [],
        stats: {},
        recent_activity: 0
      };
    }
  }

  // Get all monitors
  async getMonitors(): Promise<AIMonitor[]> {
    // Always return mock data for now
    return this.getMockAIMonitors();
  }

  // Mock AI monitors data
  private getMockAIMonitors(): AIMonitor[] {
    return [
      {
        id: 'monitor-1',
        name: 'Fraud Detection Monitor',
        type: 'fraud_detection',
        description: 'Monitors for suspicious transaction patterns and user behavior',
        status: 'active',
        confidence_threshold: 0.8,
        last_run: '2024-01-20T16:00:00Z',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-20T16:00:00Z'
      },
      {
        id: 'monitor-2',
        name: 'Anomaly Detection Monitor',
        type: 'anomaly_detection',
        description: 'Detects unusual patterns in user activity and system behavior',
        status: 'active',
        confidence_threshold: 0.7,
        last_run: '2024-01-20T16:00:00Z',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-20T16:00:00Z'
      },
      {
        id: 'monitor-3',
        name: 'Market Prediction Monitor',
        type: 'market_prediction',
        description: 'Analyzes market trends and predicts demand patterns',
        status: 'active',
        confidence_threshold: 0.6,
        last_run: '2024-01-20T15:00:00Z',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-20T15:00:00Z'
      },
      {
        id: 'monitor-4',
        name: 'Security Threat Monitor',
        type: 'security_threat',
        description: 'Monitors for security threats and potential attacks',
        status: 'inactive',
        confidence_threshold: 0.9,
        last_run: '2024-01-20T12:00:00Z',
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-01-20T12:00:00Z'
      }
    ];
  }

  // Get monitoring statistics
  async getMonitoringStats(): Promise<any> {
    try {
      const { data: alerts, error } = await supabase
        .from('fraud_alerts')
        .select('severity, status, created_at');

      if (error) throw error;

      const stats = {
        total_alerts: alerts?.length || 0,
        by_severity: {},
        by_status: {},
        recent_alerts: alerts?.filter(a => {
          const created = new Date(a.created_at);
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return created > dayAgo;
        }).length || 0
      };

      // Group by severity and status
      alerts?.forEach(alert => {
        stats.by_severity[alert.severity] = (stats.by_severity[alert.severity] || 0) + 1;
        stats.by_status[alert.status] = (stats.by_status[alert.status] || 0) + 1;
      });

      return stats;

    } catch (error) {
      console.error('Error getting monitoring stats:', error);
      return {
        total_alerts: 0,
        by_severity: {},
        by_status: {},
        recent_alerts: 0
      };
    }
  }
}

// Export singleton instance
export const aiMonitoringService = AIMonitoringService.getInstance();
