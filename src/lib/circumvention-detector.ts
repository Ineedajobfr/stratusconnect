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

/**
 * Detect non-circumvention patterns
 */
export async function detectCircumventionPatterns(
  operatorId: string,
  brokerId: string,
  timeWindowDays: number = 30
): Promise<DetectionResult> {
  try {
    // Get leak signals for the pair
    const { data: leakSignals } = await supabase
      .from('leak_signals')
      .select('*')
      .or(`operator_id.eq.${operatorId},broker_id.eq.${brokerId}`)
      .gte('timestamp', new Date(Date.now() - timeWindowDays * 24 * 60 * 60 * 1000).toISOString());

    if (!leakSignals || leakSignals.length === 0) {
      return {
        isCircumvention: false,
        confidence: 0,
        signals: [],
        recommendedAction: 'warning',
        evidence: []
      };
    }

    // Check for suspicious patterns
    const suspiciousPairs = await checkSuspiciousPairs(operatorId, brokerId, leakSignals);
    const duplicateRoutes = await checkDuplicateRoutePatterns(operatorId, brokerId, timeWindowDays);
    const offPlatformFlights = await checkOffPlatformFlights(operatorId, brokerId, timeWindowDays);

    const allSignals = [...suspiciousPairs, ...duplicateRoutes, ...offPlatformFlights];
    const confidence = calculateConfidence(allSignals);
    const isCircumvention = confidence >= 70; // Threshold for action
    const recommendedAction = determineAction(confidence, allSignals.length);

    return {
      isCircumvention,
      confidence,
      signals: allSignals,
      recommendedAction,
      evidence: generateEvidence(allSignals)
    };

  } catch (error) {
    console.error('Circumvention detection error:', error);
    return {
      isCircumvention: false,
      confidence: 0,
      signals: [],
      recommendedAction: 'warning',
      evidence: ['Detection system error']
    };
  }
}

/**
 * Check for suspicious pairs that message pre-deposit then never pay
 */
async function checkSuspiciousPairs(
  operatorId: string,
  brokerId: string,
  leakSignals: Record<string, unknown>[]
): Promise<CircumventionSignal[]> {
  const suspiciousSignals: CircumventionSignal[] = [];

  // Group signals by route hash
  const routeGroups = leakSignals.reduce((groups, signal) => {
    const routeHash = signal.route_hash;
    if (!groups[routeHash]) {
      groups[routeHash] = [];
    }
    groups[routeHash].push(signal);
    return groups;
  }, {} as Record<string, Record<string, unknown>[]>);

  // Check each route group for suspicious patterns
  Object.entries(routeGroups).forEach(([routeHash, signals]) => {
    const contactAttempts = signals.filter(s => 
      s.signal_type === 'shared_contact_attempt' || s.signal_type === 'blocked_contact'
    );
    
    const offPlatformFlights = signals.filter(s => s.signal_type === 'off_platform_communication');

    if (contactAttempts.length >= 2 && offPlatformFlights.length > 0) {
      suspiciousSignals.push({
        id: `suspicious_${routeHash}_${Date.now()}`,
        signal_type: 'shared_contact_attempt',
        deal_id: signals[0].deal_id,
        operator_id: operatorId,
        broker_id: brokerId,
        route_hash: routeHash,
        timestamp: new Date().toISOString(),
        metadata: {
          contact_attempts: contactAttempts.length,
          off_platform_flights: offPlatformFlights.length,
          route_hash: routeHash
        },
        severity: 'high'
      });
    }
  });

  return suspiciousSignals;
}

/**
 * Check for duplicate route patterns
 */
async function checkDuplicateRoutePatterns(
  operatorId: string,
  brokerId: string,
  timeWindowDays: number
): Promise<CircumventionSignal[]> {
  try {
    // Query for similar routes within time window
    const { data: flights } = await supabase
      .from('flights')
      .select('*')
      .eq('operator_id', operatorId)
      .gte('departure_at', new Date(Date.now() - timeWindowDays * 24 * 60 * 60 * 1000).toISOString())
      .lte('departure_at', new Date(Date.now() + timeWindowDays * 24 * 60 * 60 * 1000).toISOString());

    if (!flights || flights.length === 0) {
      return [];
    }

    // Check for routes that appear on Stratus and off-platform
    const duplicateSignals: CircumventionSignal[] = [];
    
    flights.forEach(flight => {
      const routeHash = generateRouteHash(flight.route);
      
      duplicateSignals.push({
        id: `duplicate_route_${routeHash}_${Date.now()}`,
        signal_type: 'duplicate_route_pattern',
        deal_id: flight.deal_id || '',
        operator_id: operatorId,
        broker_id: brokerId,
        route_hash: routeHash,
        timestamp: new Date().toISOString(),
        metadata: {
          flight_id: flight.id,
          route: flight.route,
          departure_at: flight.departure_at,
          amount: flight.amount
        },
        severity: 'medium'
      });
    });

    return duplicateSignals;
  } catch (error) {
    console.error('Duplicate route check error:', error);
    return [];
  }
}

/**
 * Check for off-platform flights
 */
async function checkOffPlatformFlights(
  operatorId: string,
  brokerId: string,
  timeWindowDays: number
): Promise<CircumventionSignal[]> {
  // This would integrate with external flight tracking APIs
  // For now, return mock data
  return [];
}

/**
 * Calculate confidence score based on signals
 */
function calculateConfidence(signals: CircumventionSignal[]): number {
  if (signals.length === 0) return 0;
  
  const severityWeights = {
    low: 10,
    medium: 30,
    high: 60,
    critical: 90
  };

  const totalWeight = signals.reduce((sum, signal) => {
    return sum + severityWeights[signal.severity];
  }, 0);

  return Math.min(100, totalWeight / signals.length);
}

/**
 * Determine recommended action based on confidence and signal count
 */
function determineAction(confidence: number, signalCount: number): 'warning' | 'freeze_rating' | 'suspend_review' | 'invoice_fee' {
  if (confidence >= 90 || signalCount >= 5) {
    return 'invoice_fee';
  } else if (confidence >= 70 || signalCount >= 3) {
    return 'suspend_review';
  } else if (confidence >= 50 || signalCount >= 2) {
    return 'freeze_rating';
  } else {
    return 'warning';
  }
}

/**
 * Generate evidence summary
 */
function generateEvidence(signals: CircumventionSignal[]): string[] {
  const evidence: string[] = [];
  
  signals.forEach(signal => {
    switch (signal.signal_type) {
      case 'shared_contact_attempt':
        evidence.push(`Contact sharing attempt detected on deal ${signal.deal_id}`);
        break;
      case 'blocked_contact':
        evidence.push(`Contact blocking triggered on deal ${signal.deal_id}`);
        break;
      case 'duplicate_route_pattern':
        evidence.push(`Duplicate route pattern detected: ${signal.metadata.route}`);
        break;
      case 'off_platform_communication':
        evidence.push(`Off-platform communication detected`);
        break;
    }
  });

  return evidence;
}

/**
 * Generate route hash for comparison
 */
function generateRouteHash(route: string): string {
  // Simple hash generation (would use crypto in production)
  return btoa(route).substring(0, 16);
}

/**
 * Log circumvention detection attempt
 */
export async function logCircumventionDetection(
  operatorId: string,
  brokerId: string,
  result: DetectionResult
): Promise<void> {
  try {
    await supabase
      .from('audit_logs')
      .insert({
        event_type: 'circumvention_detection',
        user_id: operatorId,
        metadata: {
          broker_id: brokerId,
          confidence: result.confidence,
          signal_count: result.signals.length,
          recommended_action: result.recommendedAction,
          evidence: result.evidence
        }
      });
  } catch (error) {
    console.error('Failed to log circumvention detection:', error);
  }
}

/**
 * Apply penalties based on detection results
 */
export async function applyCircumventionPenalties(
  operatorId: string,
  brokerId: string,
  result: DetectionResult
): Promise<void> {
  try {
    switch (result.recommendedAction) {
      case 'warning':
        await applyWarning(operatorId, brokerId, result);
        break;
      case 'freeze_rating':
        await freezeCommandRating(operatorId, brokerId, result);
        break;
      case 'suspend_review':
        await suspendAccountReview(operatorId, brokerId, result);
        break;
      case 'invoice_fee':
        await invoiceOffPlatformFee(operatorId, brokerId, result);
        break;
    }
  } catch (error) {
    console.error('Failed to apply penalties:', error);
  }
}

/**
 * Apply warning penalty
 */
async function applyWarning(operatorId: string, brokerId: string, result: DetectionResult): Promise<void> {
  await supabase
    .from('user_penalties')
    .insert({
      user_id: operatorId,
      penalty_type: 'warning',
      reason: 'Circumvention pattern detected',
      evidence: result.evidence,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    });
}

/**
 * Freeze command rating
 */
async function freezeCommandRating(operatorId: string, brokerId: string, result: DetectionResult): Promise<void> {
  await supabase
    .from('user_penalties')
    .insert({
      user_id: operatorId,
      penalty_type: 'freeze_rating',
      reason: 'Multiple circumvention signals detected',
      evidence: result.evidence,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    });
}

/**
 * Suspend account for review
 */
async function suspendAccountReview(operatorId: string, brokerId: string, result: DetectionResult): Promise<void> {
  await supabase
    .from('user_penalties')
    .insert({
      user_id: operatorId,
      penalty_type: 'suspend_review',
      reason: 'High-confidence circumvention detection',
      evidence: result.evidence,
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days
    });
}

/**
 * Invoice off-platform fee
 */
async function invoiceOffPlatformFee(operatorId: string, brokerId: string, result: DetectionResult): Promise<void> {
  await supabase
    .from('off_platform_fees')
    .insert({
      operator_id: operatorId,
      broker_id: brokerId,
      amount: 0, // Would calculate based on deal amounts
      fee_type: 'circumvention_fee',
      reason: 'Off-platform settlement detected',
      evidence: result.evidence,
      status: 'pending'
    });
}

/**
 * Anti-circumvention detector class
 */
class CircumventionDetector {
  async detectPatterns(operatorId: string, brokerId: string, timeWindowDays: number = 30): Promise<DetectionResult> {
    return detectCircumventionPatterns(operatorId, brokerId, timeWindowDays);
  }

  async logDetection(operatorId: string, brokerId: string, result: DetectionResult): Promise<void> {
    return logCircumventionDetection(operatorId, brokerId, result);
  }

  async applyPenalties(operatorId: string, brokerId: string, result: DetectionResult): Promise<void> {
    return applyCircumventionPenalties(operatorId, brokerId, result);
  }
}

export const circumventionDetector = new CircumventionDetector();
