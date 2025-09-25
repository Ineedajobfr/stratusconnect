// Dispute Resolution Service
// Handles dispute management and resolution workflows

import { supabase } from '@/integrations/supabase/client';

export interface Dispute {
  id: string;
  deal_id: string;
  complainant_id: string;
  respondent_id: string;
  dispute_type: 'payment' | 'service' | 'communication' | 'fraud' | 'other';
  subject: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_admin?: string;
  resolution?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  evidence: DisputeEvidence[];
  communications: DisputeCommunication[];
}

export interface DisputeEvidence {
  id: string;
  dispute_id: string;
  uploaded_by: string;
  file_url: string;
  file_type: string;
  description: string;
  created_at: string;
}

export interface DisputeCommunication {
  id: string;
  dispute_id: string;
  sender_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

export interface DisputeResolution {
  dispute_id: string;
  resolution_type: 'refund' | 'partial_refund' | 'service_credit' | 'no_action' | 'account_suspension';
  amount?: number;
  reason: string;
  admin_notes: string;
  resolved_by: string;
  resolved_at: string;
}

export class DisputeService {
  private static instance: DisputeService;

  static getInstance(): DisputeService {
    if (!DisputeService.instance) {
      DisputeService.instance = new DisputeService();
    }
    return DisputeService.instance;
  }

  // Create new dispute
  async createDispute(dispute: Omit<Dispute, 'id' | 'created_at' | 'updated_at' | 'evidence' | 'communications'>): Promise<Dispute> {
    try {
      const { data, error } = await supabase
        .from('disputes')
        .insert({
          ...dispute,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Log security event
      await supabase
        .from('security_events')
        .insert({
          event_type: 'admin_action',
          severity: 'medium',
          message: `New dispute created: ${dispute.subject}`,
          user_id: dispute.complainant_id,
          metadata: { dispute_id: data.id, dispute_type: dispute.dispute_type }
        });

      return {
        ...data,
        evidence: [],
        communications: []
      };

    } catch (error) {
      console.error('Error creating dispute:', error);
      throw error;
    }
  }

  // Get all disputes
  async getDisputes(filters?: {
    status?: string;
    priority?: string;
    dispute_type?: string;
    assigned_admin?: string;
  }): Promise<Dispute[]> {
    try {
      let query = supabase
        .from('disputes')
        .select(`
          *,
          deal:deal_id(*),
          complainant:complainant_id(full_name, email),
          respondent:respondent_id(full_name, email),
          assigned_admin_user:assigned_admin(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.dispute_type) {
        query = query.eq('dispute_type', filters.dispute_type);
      }
      if (filters?.assigned_admin) {
        query = query.eq('assigned_admin', filters.assigned_admin);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Database error:', error);
        return this.getMockDisputes();
      }

      // Get evidence and communications for each dispute
      const disputesWithDetails = await Promise.all(
        (data || []).map(async (dispute) => {
          const [evidence, communications] = await Promise.all([
            this.getDisputeEvidence(dispute.id),
            this.getDisputeCommunications(dispute.id)
          ]);

          return {
            ...dispute,
            evidence,
            communications
          };
        })
      );

      return disputesWithDetails;

    } catch (error) {
      console.error('Error getting disputes:', error);
      return this.getMockDisputes();
    }
  }

  // Mock disputes data
  private getMockDisputes(): Dispute[] {
    return [
      {
        id: 'dispute-1',
        deal_id: 'deal-1',
        complainant_id: 'mock-user-1',
        respondent_id: 'mock-user-2',
        dispute_type: 'payment',
        subject: 'Payment Dispute - London to Paris',
        description: 'Client claims the flight was delayed by 2 hours and wants a partial refund. We maintain the delay was due to weather conditions beyond our control.',
        status: 'open',
        priority: 'high',
        assigned_admin: 'admin',
        created_at: '2024-01-20T15:00:00Z',
        updated_at: '2024-01-20T15:00:00Z',
        evidence: [],
        communications: []
      },
      {
        id: 'dispute-2',
        deal_id: 'deal-2',
        complainant_id: 'mock-user-3',
        respondent_id: 'mock-user-1',
        dispute_type: 'service',
        subject: 'Service Quality Issue',
        description: 'Pilot claims the aircraft was not properly maintained and had technical issues during flight.',
        status: 'investigating',
        priority: 'medium',
        assigned_admin: 'admin',
        created_at: '2024-01-19T10:30:00Z',
        updated_at: '2024-01-20T09:00:00Z',
        evidence: [],
        communications: []
      },
      {
        id: 'dispute-3',
        deal_id: 'deal-3',
        complainant_id: 'mock-user-2',
        respondent_id: 'mock-user-4',
        dispute_type: 'communication',
        subject: 'Communication Breakdown',
        description: 'Crew member did not respond to messages and failed to show up for scheduled flight.',
        status: 'resolved',
        priority: 'low',
        assigned_admin: 'admin',
        resolution: 'Crew member provided medical documentation. Dispute resolved in favor of crew member.',
        resolution_notes: 'Valid medical emergency. No fault assigned.',
        created_at: '2024-01-18T14:20:00Z',
        updated_at: '2024-01-19T16:45:00Z',
        resolved_at: '2024-01-19T16:45:00Z',
        evidence: [],
        communications: []
      }
    ];
  }

  // Get dispute by ID
  async getDisputeById(disputeId: string): Promise<Dispute | null> {
    try {
      const { data, error } = await supabase
        .from('disputes')
        .select(`
          *,
          deal:deal_id(*),
          complainant:complainant_id(full_name, email),
          respondent:respondent_id(full_name, email),
          assigned_admin_user:assigned_admin(full_name, email)
        `)
        .eq('id', disputeId)
        .single();

      if (error) throw error;

      const [evidence, communications] = await Promise.all([
        this.getDisputeEvidence(disputeId),
        this.getDisputeCommunications(disputeId)
      ]);

      return {
        ...data,
        evidence,
        communications
      };

    } catch (error) {
      console.error('Error getting dispute:', error);
      return null;
    }
  }

  // Get dispute evidence
  async getDisputeEvidence(disputeId: string): Promise<DisputeEvidence[]> {
    try {
      const { data, error } = await supabase
        .from('dispute_evidence')
        .select('*')
        .eq('dispute_id', disputeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Error getting dispute evidence:', error);
      return [];
    }
  }

  // Get dispute communications
  async getDisputeCommunications(disputeId: string): Promise<DisputeCommunication[]> {
    try {
      const { data, error } = await supabase
        .from('dispute_communications')
        .select(`
          *,
          sender:sender_id(full_name, email)
        `)
        .eq('dispute_id', disputeId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Error getting dispute communications:', error);
      return [];
    }
  }

  // Add evidence to dispute
  async addEvidence(disputeId: string, evidence: Omit<DisputeEvidence, 'id' | 'dispute_id' | 'created_at'>): Promise<DisputeEvidence> {
    try {
      const { data, error } = await supabase
        .from('dispute_evidence')
        .insert({
          ...evidence,
          dispute_id: disputeId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;

    } catch (error) {
      console.error('Error adding evidence:', error);
      throw error;
    }
  }

  // Add communication to dispute
  async addCommunication(disputeId: string, communication: Omit<DisputeCommunication, 'id' | 'dispute_id' | 'created_at'>): Promise<DisputeCommunication> {
    try {
      const { data, error } = await supabase
        .from('dispute_communications')
        .insert({
          ...communication,
          dispute_id: disputeId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;

    } catch (error) {
      console.error('Error adding communication:', error);
      throw error;
    }
  }

  // Update dispute status
  async updateDisputeStatus(disputeId: string, status: Dispute['status'], adminId: string, notes?: string): Promise<void> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'resolved' || status === 'closed') {
        updateData.resolved_at = new Date().toISOString();
      }

      if (notes) {
        updateData.resolution_notes = notes;
      }

      const { error } = await supabase
        .from('disputes')
        .update(updateData)
        .eq('id', disputeId);

      if (error) throw error;

      // Add admin communication
      await this.addCommunication(disputeId, {
        sender_id: adminId,
        message: `Status updated to ${status}${notes ? `: ${notes}` : ''}`,
        is_admin: true
      });

      // Log security event
      await supabase
        .from('security_events')
        .insert({
          event_type: 'admin_action',
          severity: 'medium',
          message: `Dispute status updated to ${status}`,
          user_id: adminId,
          metadata: { dispute_id: disputeId, status }
        });

    } catch (error) {
      console.error('Error updating dispute status:', error);
      throw error;
    }
  }

  // Assign dispute to admin
  async assignDispute(disputeId: string, adminId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('disputes')
        .update({
          assigned_admin: adminId,
          status: 'investigating',
          updated_at: new Date().toISOString()
        })
        .eq('id', disputeId);

      if (error) throw error;

      // Add admin communication
      await this.addCommunication(disputeId, {
        sender_id: adminId,
        message: `Dispute assigned to admin for investigation`,
        is_admin: true
      });

    } catch (error) {
      console.error('Error assigning dispute:', error);
      throw error;
    }
  }

  // Resolve dispute
  async resolveDispute(disputeId: string, resolution: DisputeResolution): Promise<void> {
    try {
      const { error } = await supabase
        .from('disputes')
        .update({
          status: 'resolved',
          resolution: resolution.resolution_type,
          resolution_notes: resolution.reason,
          resolved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', disputeId);

      if (error) throw error;

      // Create resolution record
      await supabase
        .from('dispute_resolutions')
        .insert({
          ...resolution,
          resolved_at: new Date().toISOString()
        });

      // Add admin communication
      await this.addCommunication(disputeId, {
        sender_id: resolution.resolved_by,
        message: `Dispute resolved: ${resolution.reason}`,
        is_admin: true
      });

      // Log security event
      await supabase
        .from('security_events')
        .insert({
          event_type: 'admin_action',
          severity: 'medium',
          message: `Dispute resolved: ${resolution.resolution_type}`,
          user_id: resolution.resolved_by,
          metadata: { dispute_id: disputeId, resolution_type: resolution.resolution_type }
        });

    } catch (error) {
      console.error('Error resolving dispute:', error);
      throw error;
    }
  }

  // Get dispute statistics
  async getDisputeStats(): Promise<any> {
    try {
      const { data: disputes, error } = await supabase
        .from('disputes')
        .select('status, priority, dispute_type, created_at');

      if (error) throw error;

      const stats = {
        total: disputes?.length || 0,
        by_status: {},
        by_priority: {},
        by_type: {},
        recent: disputes?.filter(d => {
          const created = new Date(d.created_at);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return created > weekAgo;
        }).length || 0
      };

      // Group by status
      disputes?.forEach(dispute => {
        stats.by_status[dispute.status] = (stats.by_status[dispute.status] || 0) + 1;
        stats.by_priority[dispute.priority] = (stats.by_priority[dispute.priority] || 0) + 1;
        stats.by_type[dispute.dispute_type] = (stats.by_type[dispute.dispute_type] || 0) + 1;
      });

      return stats;

    } catch (error) {
      console.error('Error getting dispute stats:', error);
      return {
        total: 0,
        by_status: {},
        by_priority: {},
        by_type: {},
        recent: 0
      };
    }
  }

  // Escalate dispute
  async escalateDispute(disputeId: string, adminId: string, reason: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('disputes')
        .update({
          status: 'escalated',
          priority: 'urgent',
          updated_at: new Date().toISOString()
        })
        .eq('id', disputeId);

      if (error) throw error;

      // Add admin communication
      await this.addCommunication(disputeId, {
        sender_id: adminId,
        message: `Dispute escalated: ${reason}`,
        is_admin: true
      });

      // Log security event
      await supabase
        .from('security_events')
        .insert({
          event_type: 'admin_action',
          severity: 'high',
          message: `Dispute escalated: ${reason}`,
          user_id: adminId,
          metadata: { dispute_id: disputeId, reason }
        });

    } catch (error) {
      console.error('Error escalating dispute:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const disputeService = DisputeService.getInstance();
