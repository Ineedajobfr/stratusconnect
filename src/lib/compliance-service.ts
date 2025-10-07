// Compliance Service - FCA, FAA, GDPR compliance tracking
// Regulatory compliance for aviation charter platform

import { supabase } from '@/integrations/supabase/client';

// FCA Compliance (Financial Conduct Authority) for Brokers
export interface FCAComplianceRecord {
  id: string;
  brokerId: string;
  transactionId: string;
  transactionType: 'booking' | 'payment' | 'commission' | 'refund';
  amount: number;
  currency: string;
  timestamp: string;
  clientId: string;
  verified: boolean;
  flagged: boolean;
  flagReason?: string;
  amlCheckPassed: boolean;
  auditTrail: AuditEntry[];
}

export interface AuditEntry {
  action: string;
  performedBy: string;
  timestamp: string;
  details: Record<string, any>;
  ipAddress: string;
}

// FAA Compliance (Federal Aviation Administration) for Operators/Pilots
export interface DutyTimeRecord {
  id: string;
  pilotId: string;
  startTime: string;
  endTime?: string;
  dutyHours: number;
  flightHours: number;
  restHours: number;
  compliant: boolean;
  violations: string[];
}

export interface MaintenanceComplianceRecord {
  id: string;
  aircraftId: string;
  registration: string;
  nextInspectionDate: string;
  nextInspectionType: string;
  hoursUntilInspection: number;
  airworthinessStatus: 'valid' | 'expiring_soon' | 'expired';
  lastInspectionDate: string;
  complianceStatus: 'compliant' | 'warning' | 'non_compliant';
}

// GDPR Compliance (General Data Protection Regulation)
export interface DataAccessRequest {
  id: string;
  userId: string;
  requestType: 'access' | 'deletion' | 'portability' | 'rectification';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
  completedAt?: string;
  reason?: string;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: 'marketing' | 'analytics' | 'cookies' | 'data_sharing';
  granted: boolean;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

class ComplianceService {
  // ==================== FCA COMPLIANCE ====================

  // Record transaction for FCA audit trail
  async recordTransaction(
    brokerId: string,
    transactionData: {
      transactionId: string;
      transactionType: 'booking' | 'payment' | 'commission' | 'refund';
      amount: number;
      currency: string;
      clientId: string;
    }
  ): Promise<boolean> {
    try {
      // Perform AML check
      const amlCheckPassed = await this.performAMLCheck(
        brokerId,
        transactionData.clientId,
        transactionData.amount
      );

      // Check for suspicious activity
      const flagged = transactionData.amount > 50000 || !amlCheckPassed;
      const flagReason = flagged
        ? transactionData.amount > 50000
          ? 'High value transaction'
          : 'AML check failed'
        : undefined;

      const { error } = await supabase
        .from('fca_compliance_records')
        .insert({
          broker_id: brokerId,
          transaction_id: transactionData.transactionId,
          transaction_type: transactionData.transactionType,
          amount: transactionData.amount,
          currency: transactionData.currency,
          client_id: transactionData.clientId,
          verified: amlCheckPassed,
          flagged,
          flag_reason: flagReason,
          aml_check_passed: amlCheckPassed,
          timestamp: new Date().toISOString(),
        });

      if (error) throw error;

      // Create audit entry
      await this.createAuditEntry({
        entityType: 'transaction',
        entityId: transactionData.transactionId,
        action: `Transaction recorded: ${transactionData.transactionType}`,
        performedBy: brokerId,
        details: transactionData,
      });

      return true;
    } catch (error) {
      console.error('Failed to record transaction:', error);
      return false;
    }
  }

  // Perform Anti-Money Laundering (AML) check
  private async performAMLCheck(
    brokerId: string,
    clientId: string,
    amount: number
  ): Promise<boolean> {
    try {
      // Check transaction patterns
      const { data: recentTransactions } = await supabase
        .from('fca_compliance_records')
        .select('amount, timestamp')
        .eq('broker_id', brokerId)
        .eq('client_id', clientId)
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Check for suspicious patterns
      const totalRecent = recentTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const suspiciousAmount = totalRecent + amount > 100000;
      const rapidTransactions = (recentTransactions?.length || 0) > 10;

      // In production, would integrate with AML service providers
      const passed = !suspiciousAmount && !rapidTransactions;

      // Log AML check
      await supabase
        .from('aml_checks')
        .insert({
          broker_id: brokerId,
          client_id: clientId,
          check_type: 'transaction_pattern',
          passed,
          details: {
            amount,
            totalRecent,
            suspiciousAmount,
            rapidTransactions,
          },
          checked_at: new Date().toISOString(),
        });

      return passed;
    } catch (error) {
      console.error('AML check failed:', error);
      return false;
    }
  }

  // Get FCA compliance report
  async getFCAComplianceReport(
    brokerId: string,
    startDate: string,
    endDate: string
  ): Promise<FCAComplianceRecord[]> {
    try {
      const { data, error } = await supabase
        .from('fca_compliance_records')
        .select('*')
        .eq('broker_id', brokerId)
        .gte('timestamp', startDate)
        .lte('timestamp', endDate)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return (data || []).map(record => ({
        id: record.id,
        brokerId: record.broker_id,
        transactionId: record.transaction_id,
        transactionType: record.transaction_type as any,
        amount: record.amount,
        currency: record.currency,
        timestamp: record.timestamp,
        clientId: record.client_id,
        verified: record.verified,
        flagged: record.flagged,
        flagReason: record.flag_reason,
        amlCheckPassed: record.aml_check_passed,
        auditTrail: record.audit_trail || [],
      }));
    } catch (error) {
      console.error('Failed to get FCA compliance report:', error);
      return [];
    }
  }

  // ==================== FAA COMPLIANCE ====================

  // Track duty time
  async trackDutyTime(
    pilotId: string,
    flightId: string,
    startTime: string,
    endTime: string,
    flightHours: number
  ): Promise<DutyTimeRecord | null> {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const dutyHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      // Check FAA regulations (14 CFR Part 117)
      const violations: string[] = [];
      let compliant = true;

      // Check 8-hour flight time limit
      if (flightHours > 8) {
        violations.push('Exceeded 8-hour flight time limit');
        compliant = false;
      }

      // Check 14-hour duty period
      if (dutyHours > 14) {
        violations.push('Exceeded 14-hour duty period limit');
        compliant = false;
      }

      // Check rest requirements (last 24 hours)
      const { data: recentDuty } = await supabase
        .from('duty_time_records')
        .select('duty_hours, rest_hours')
        .eq('pilot_id', pilotId)
        .gte('start_time', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const totalDutyLast24h = (recentDuty?.reduce((sum, d) => sum + d.duty_hours, 0) || 0) + dutyHours;
      const totalRestLast24h = recentDuty?.reduce((sum, d) => sum + d.rest_hours, 0) || 0;

      if (totalDutyLast24h > 14) {
        violations.push('Exceeded 14-hour duty limit in 24-hour period');
        compliant = false;
      }

      if (totalRestLast24h < 10) {
        violations.push('Insufficient rest period (minimum 10 hours required)');
        compliant = false;
      }

      // Calculate rest hours until next duty
      const restHours = 10; // Required minimum

      const { data, error } = await supabase
        .from('duty_time_records')
        .insert({
          pilot_id: pilotId,
          flight_id: flightId,
          start_time: startTime,
          end_time: endTime,
          duty_hours: dutyHours,
          flight_hours: flightHours,
          rest_hours: restHours,
          compliant,
          violations,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        pilotId: data.pilot_id,
        startTime: data.start_time,
        endTime: data.end_time,
        dutyHours: data.duty_hours,
        flightHours: data.flight_hours,
        restHours: data.rest_hours,
        compliant: data.compliant,
        violations: data.violations || [],
      };
    } catch (error) {
      console.error('Failed to track duty time:', error);
      return null;
    }
  }

  // Check maintenance compliance
  async checkMaintenanceCompliance(aircraftId: string): Promise<MaintenanceComplianceRecord | null> {
    try {
      const { data: aircraft } = await supabase
        .from('aircraft')
        .select(`
          id,
          registration,
          total_hours,
          maintenance (
            next_inspection_date,
            next_inspection_type,
            last_inspection_date,
            hours_at_last_inspection
          )
        `)
        .eq('id', aircraftId)
        .single();

      if (!aircraft) throw new Error('Aircraft not found');

      const nextInspectionDate = new Date(aircraft.maintenance?.next_inspection_date);
      const daysUntilInspection = Math.floor((nextInspectionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      const hoursUntilInspection = 100 - (aircraft.total_hours - (aircraft.maintenance?.hours_at_last_inspection || 0));

      let airworthinessStatus: 'valid' | 'expiring_soon' | 'expired' = 'valid';
      let complianceStatus: 'compliant' | 'warning' | 'non_compliant' = 'compliant';

      if (daysUntilInspection < 0 || hoursUntilInspection < 0) {
        airworthinessStatus = 'expired';
        complianceStatus = 'non_compliant';
      } else if (daysUntilInspection < 30 || hoursUntilInspection < 10) {
        airworthinessStatus = 'expiring_soon';
        complianceStatus = 'warning';
      }

      return {
        id: aircraft.id,
        aircraftId: aircraft.id,
        registration: aircraft.registration,
        nextInspectionDate: aircraft.maintenance?.next_inspection_date,
        nextInspectionType: aircraft.maintenance?.next_inspection_type || 'Annual',
        hoursUntilInspection,
        airworthinessStatus,
        lastInspectionDate: aircraft.maintenance?.last_inspection_date,
        complianceStatus,
      };
    } catch (error) {
      console.error('Failed to check maintenance compliance:', error);
      return null;
    }
  }

  // ==================== GDPR COMPLIANCE ====================

  // Process data access request
  async processDataAccessRequest(
    userId: string,
    requestType: 'access' | 'deletion' | 'portability' | 'rectification',
    reason?: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('data_access_requests')
        .insert({
          user_id: userId,
          request_type: requestType,
          status: 'pending',
          requested_at: new Date().toISOString(),
          reason,
        })
        .select()
        .single();

      if (error) throw error;

      // Create audit entry
      await this.createAuditEntry({
        entityType: 'user_data',
        entityId: userId,
        action: `Data ${requestType} request submitted`,
        performedBy: userId,
        details: { requestType, reason },
      });

      return data.id;
    } catch (error) {
      console.error('Failed to process data access request:', error);
      return null;
    }
  }

  // Record consent
  async recordConsent(
    userId: string,
    consentType: 'marketing' | 'analytics' | 'cookies' | 'data_sharing',
    granted: boolean,
    ipAddress: string,
    userAgent: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('consent_records')
        .insert({
          user_id: userId,
          consent_type: consentType,
          granted,
          timestamp: new Date().toISOString(),
          ip_address: ipAddress,
          user_agent: userAgent,
        });

      if (error) throw error;

      // Update user preferences
      await supabase
        .from('users')
        .update({ [`${consentType}_consent`]: granted })
        .eq('id', userId);

      return true;
    } catch (error) {
      console.error('Failed to record consent:', error);
      return false;
    }
  }

  // Get user's data for GDPR export
  async exportUserData(userId: string): Promise<Record<string, any> | null> {
    try {
      // Gather all user data across tables
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .or(`broker_id.eq.${userId},operator_id.eq.${userId},pilot_id.eq.${userId}`);

      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .or(`payer_id.eq.${userId},payee_id.eq.${userId}`);

      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);

      const { data: consents } = await supabase
        .from('consent_records')
        .select('*')
        .eq('user_id', userId);

      return {
        user,
        bookings,
        payments,
        messages,
        consents,
        exportedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to export user data:', error);
      return null;
    }
  }

  // Delete user data (GDPR right to be forgotten)
  async deleteUserData(userId: string): Promise<boolean> {
    try {
      // Anonymize rather than delete to preserve referential integrity
      await supabase
        .from('users')
        .update({
          email: `deleted_${userId}@deleted.com`,
          full_name: 'Deleted User',
          phone: null,
          deleted: true,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', userId);

      // Create audit entry
      await this.createAuditEntry({
        entityType: 'user_data',
        entityId: userId,
        action: 'User data deleted (GDPR)',
        performedBy: userId,
        details: { reason: 'GDPR right to be forgotten' },
      });

      return true;
    } catch (error) {
      console.error('Failed to delete user data:', error);
      return false;
    }
  }

  // ==================== AUDIT TRAIL ====================

  // Create audit entry
  async createAuditEntry(entry: {
    entityType: string;
    entityId: string;
    action: string;
    performedBy: string;
    details: Record<string, any>;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          entity_type: entry.entityType,
          entity_id: entry.entityId,
          action: entry.action,
          performed_by: entry.performedBy,
          details: entry.details,
          timestamp: new Date().toISOString(),
          ip_address: '0.0.0.0', // Would get from request
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to create audit entry:', error);
      return false;
    }
  }

  // Get audit trail
  async getAuditTrail(
    entityType: string,
    entityId: string
  ): Promise<AuditEntry[]> {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return (data || []).map(entry => ({
        action: entry.action,
        performedBy: entry.performed_by,
        timestamp: entry.timestamp,
        details: entry.details || {},
        ipAddress: entry.ip_address || '0.0.0.0',
      }));
    } catch (error) {
      console.error('Failed to get audit trail:', error);
      return [];
    }
  }
}

export const complianceService = new ComplianceService();









