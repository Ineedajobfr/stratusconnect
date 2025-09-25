// Dispute Resolution Service - Real Implementation
// Handles dispute management and resolution workflows with real database operations

import { supabase } from '@/integrations/supabase/client';

export interface Dispute {
  id: string;
  deal_id?: string;
  complainant_id: string;
  respondent_id?: string;
  dispute_type: 'payment' | 'service' | 'communication' | 'other';
  subject: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_admin?: string;
  resolution?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  evidence: any[];
  communications: any[];
}

export const disputeService = {
  // Get all disputes - REAL DATA ONLY
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
        return [];
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
      return [];
    }
  },

  // Get dispute by ID - REAL DATA ONLY
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

      if (error) {
        console.error('Database error:', error);
        return null;
      }

      if (!data) return null;

      // Get evidence and communications
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
  },

  // Create dispute - REAL OPERATION
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

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      return {
        ...data,
        evidence: [],
        communications: []
      };

    } catch (error) {
      console.error('Error creating dispute:', error);
      throw error;
    }
  },

  // Update dispute - REAL OPERATION
  async updateDispute(disputeId: string, updates: Partial<Dispute>): Promise<void> {
    try {
      const { error } = await supabase
        .from('disputes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', disputeId);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating dispute:', error);
      throw error;
    }
  },

  // Resolve dispute - REAL OPERATION
  async resolveDispute(disputeId: string, resolution: string, resolvedBy: string, notes?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('disputes')
        .update({
          status: 'resolved',
          resolution,
          resolution_notes: notes,
          resolved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', disputeId);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error resolving dispute:', error);
      throw error;
    }
  },

  // Assign dispute - REAL OPERATION
  async assignDispute(disputeId: string, adminId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('disputes')
        .update({
          assigned_admin: adminId,
          updated_at: new Date().toISOString()
        })
        .eq('id', disputeId);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error assigning dispute:', error);
      throw error;
    }
  },

  // Get dispute evidence - REAL DATA ONLY
  async getDisputeEvidence(disputeId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('dispute_evidence')
        .select('*')
        .eq('dispute_id', disputeId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting dispute evidence:', error);
      return [];
    }
  },

  // Get dispute communications - REAL DATA ONLY
  async getDisputeCommunications(disputeId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('dispute_communications')
        .select(`
          *,
          user:user_id(full_name, email)
        `)
        .eq('dispute_id', disputeId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting dispute communications:', error);
      return [];
    }
  },

  // Add evidence - REAL OPERATION
  async addEvidence(disputeId: string, evidence: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('dispute_evidence')
        .insert({
          dispute_id: disputeId,
          ...evidence,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error adding evidence:', error);
      throw error;
    }
  },

  // Add communication - REAL OPERATION
  async addCommunication(disputeId: string, communication: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('dispute_communications')
        .insert({
          dispute_id: disputeId,
          ...communication,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error adding communication:', error);
      throw error;
    }
  }
};

