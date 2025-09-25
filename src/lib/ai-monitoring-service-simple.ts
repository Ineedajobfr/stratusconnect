// Simplified AI Monitoring Service
// Returns mock data to avoid database issues

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
  // Get all fraud alerts
  async getFraudAlerts(filters?: {
    status?: string;
    severity?: string;
    alert_type?: string;
  }): Promise<FraudAlert[]> {
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
        metadata: { ip_addresses: ['192.168.1.100', '192.168.1.200'], attempts: 5 },
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
        metadata: { amount: 15000, typical_range: '5000-8000', deviation: '87.5%' },
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
        metadata: { name_inconsistency: true, document_mismatch: true, verification_failures: 3 },
        created_at: '2024-01-19T11:15:00Z',
        resolved_at: '2024-01-19T15:30:00Z',
        resolved_by: 'admin'
      }
    ];
  },

  // Get all monitors
  async getMonitors(): Promise<AIMonitor[]> {
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
  },

  // Get monitoring statistics
  async getMonitoringStats(): Promise<any> {
    return {
      total_alerts: 3,
      critical_alerts: 1,
      resolved_alerts: 1,
      recent_activity: 2
    };
  },

  // Resolve fraud alert
  async resolveFraudAlert(alertId: string, resolvedBy: string, resolution: string): Promise<void> {
    console.log(`Alert ${alertId} resolved by ${resolvedBy}: ${resolution}`);
  },

  // Create fraud alert
  async createFraudAlert(alert: Omit<FraudAlert, 'id' | 'created_at'>): Promise<FraudAlert> {
    const newAlert: FraudAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    console.log('Created fraud alert:', newAlert);
    return newAlert;
  },

  // Update monitor
  async updateMonitor(monitorId: string, updates: Partial<AIMonitor>): Promise<void> {
    console.log(`Monitor ${monitorId} updated:`, updates);
  }
};
