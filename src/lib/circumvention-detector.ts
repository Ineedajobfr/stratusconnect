// Anti-Circumvention Detection System
// FCA Compliant Aviation Platform

import { supabase } from '@/integrations/supabase/client';

export interface CircumventionSignal {
  id: string;
  signal_type: 'shared_contact_attempt' | 'blocked_contact' | 'off_platform_communication' | 'duplicate_route_pattern';
  deal_id: string;
  operator_id: string;
  broker_id: string;
  route_hash: string;
  timestamp: string;
  metadata: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DetectionResult {
  isCircumvention: boolean;
  confidence: number; // 0-100
  signals: CircumventionSignal[];
  recommendedAction: 'warning' | 'freeze_rating' | 'suspend_review' | 'invoice_fee';
  evidence: string[];
}

export interface LeakageSignal {
  userId: string;
  type: 'contact_attempt' | 'pattern_match' | 'route_concentration' | 'rapid_rebooking';
  confidence: number;
  metadata: Record<string, any>;
  detectedAt: Date;
}

export interface LeakagePattern {
  type: 'repeat_offender' | 'coordinated_circumvention' | 'contact_sharing';
  userId: string;
  confidence: number;
  signals: number;
  description: string;
}

export interface AuditEvent {
  action: string;
  actorId: string;
  targetType: string;
  targetId: string;
  beforeValues?: any;
  afterValues?: any;
  sessionHash?: string;
  requestHash?: string;
}

/**
 * Detect non-circumvention patterns
 */
export async function detectCircumventionPatterns(
  operatorId: string,
  brokerId: string,
  timeWindowDays: number = 30
): Promise<DetectionResult> {
  try {
    // Since leak_signals table doesn't exist, return a basic detection result
    console.log(`Checking circumvention patterns for operator ${operatorId} and broker ${brokerId}`);
    
    return {
      isCircumvention: false,
      confidence: 0,
      signals: [],
      recommendedAction: 'warning',
      evidence: []
    };
  } catch (error) {
    console.error('Error detecting circumvention patterns:', error);
    return {
      isCircumvention: false,
      confidence: 0,
      signals: [],
      recommendedAction: 'warning',
      evidence: []
    };
  }
}

/**
 * Simplified circumvention detector class
 */
export class CircumventionDetector {
  async recordLeakageSignal(signal: LeakageSignal): Promise<void> {
    try {
      // For now, just log the signal since the leak_signals table doesn't exist
      console.log('Leakage signal detected:', {
        userId: signal.userId,
        type: signal.type,
        confidence: signal.confidence,
        metadata: signal.metadata,
        detectedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error recording leakage signal:', error);
      throw error;
    }
  }

  async getLeakageHistory(userId: string, days: number = 30): Promise<any[]> {
    try {
      // Return empty array since leak_signals table doesn't exist
      console.log(`Fetching leakage history for user ${userId} for ${days} days`);
      return [];
    } catch (error) {
      console.error('Error fetching leakage history:', error);
      return [];
    }
  }

  async detectPatterns(): Promise<LeakagePattern[]> {
    try {
      // Return empty patterns since leak_signals table doesn't exist
      console.log('Detecting leakage patterns...');
      return [];
    } catch (error) {
      console.error('Error detecting leakage patterns:', error);
      return [];
    }
  }

  async analyzeFlightPatterns(userId: string): Promise<LeakageSignal[]> {
    const signals: LeakageSignal[] = [];
    
    try {
      // Return empty signals since flights table doesn't exist
      console.log(`Analyzing flight patterns for user ${userId}...`);
      return signals;
    } catch (error) {
      console.error('Error analyzing flight patterns:', error);
      return signals;
    }
  }

  async logAuditEvent(event: AuditEvent): Promise<void> {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          action: event.action,
          actor_id: event.actorId,
          target_type: event.targetType,
          target_id: event.targetId,
          before_values: event.beforeValues,
          after_values: event.afterValues,
          session_hash: event.sessionHash,
          request_hash: event.requestHash,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to log audit event:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error logging audit event:', error);
      throw error;
    }
  }
}

// Export a default instance
export const circumventionDetector = new CircumventionDetector();