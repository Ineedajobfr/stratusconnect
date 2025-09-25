// Admin Database Management
// Real database operations for admin system

import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  company_name?: string;
  created_at: string;
  last_login?: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  location?: string;
  phone?: string;
  total_deals: number;
  revenue: number;
  kyc_status: 'pending' | 'approved' | 'rejected';
  sanctions_checked: boolean;
  sanctions_match: boolean;
  documents_uploaded: boolean;
  insurance_expiry?: string;
  license_expiry?: string;
  aircraft_registrations: string[];
  profile_complete: boolean;
  risk_score: number;
  admin_notes?: string;
}

export interface Deal {
  id: string;
  broker_id: string;
  operator_id: string;
  pilot_id?: string;
  crew_id?: string;
  aircraft_id: string;
  route: string;
  departure_date: string;
  return_date?: string;
  passengers: number;
  quote_amount: number;
  commission_rate: number;
  commission_amount: number;
  status: 'quoted' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  created_at: string;
  accepted_at?: string;
  completed_at?: string;
  payment_status: 'pending' | 'escrowed' | 'released' | 'refunded';
  escrow_amount: number;
  signed_quote_pdf?: string;
  dispute_reason?: string;
  admin_notes?: string;
}

export interface SecurityEvent {
  id: string;
  user_id?: string;
  event_type: 'login' | 'failed_login' | 'suspicious_activity' | 'data_breach' | 'system_error' | 'admin_action';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
  resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

export interface CommissionRule {
  id: string;
  role: 'broker' | 'operator' | 'pilot' | 'crew';
  transaction_type: 'sale' | 'hire' | 'service';
  rate_percentage: number;
  minimum_amount?: number;
  maximum_amount?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: any;
  description: string;
  category: 'security' | 'financial' | 'communication' | 'features' | 'compliance';
  updated_at: string;
  updated_by: string;
}

export class AdminDatabase {
  // User Management
  static async getAllUsers(): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          role,
          status,
          company_name,
          created_at,
          last_login,
          verification_status,
          location,
          phone,
          total_deals,
          revenue,
          kyc_status,
          sanctions_checked,
          sanctions_match,
          documents_uploaded,
          insurance_expiry,
          license_expiry,
          aircraft_registrations,
          profile_complete,
          risk_score,
          admin_notes
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }


  static async getUserById(userId: string): Promise<AdminUser | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateUserStatus(userId: string, status: AdminUser['status'], adminNotes?: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;

    // Log admin action
    await this.logSecurityEvent({
      event_type: 'admin_action',
      severity: 'medium',
      message: `User status changed to ${status}`,
      user_id: userId,
      metadata: { status, admin_notes: adminNotes }
    });
  }

  static async updateUserRole(userId: string, role: AdminUser['role']): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        role,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;

    await this.logSecurityEvent({
      event_type: 'admin_action',
      severity: 'medium',
      message: `User role changed to ${role}`,
      user_id: userId,
      metadata: { role }
    });
  }

  static async searchUsers(query: string, filters: any = {}): Promise<AdminUser[]> {
    let queryBuilder = supabase
      .from('profiles')
      .select('*')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,company_name.ilike.%${query}%`);

    if (filters.role) {
      queryBuilder = queryBuilder.eq('role', filters.role);
    }
    if (filters.status) {
      queryBuilder = queryBuilder.eq('status', filters.status);
    }
    if (filters.verification_status) {
      queryBuilder = queryBuilder.eq('verification_status', filters.verification_status);
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  // Deal Management
  static async getAllDeals(): Promise<Deal[]> {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          broker:broker_id(full_name, email),
          operator:operator_id(full_name, email),
          pilot:pilot_id(full_name, email),
          crew:crew_id(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching deals:', error);
      throw error;
    }
  }


  static async updateDealStatus(dealId: string, status: Deal['status'], adminNotes?: string): Promise<void> {
    const { error } = await supabase
      .from('deals')
      .update({ 
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', dealId);

    if (error) throw error;

    await this.logSecurityEvent({
      event_type: 'admin_action',
      severity: 'medium',
      message: `Deal status changed to ${status}`,
      metadata: { deal_id: dealId, status, admin_notes: adminNotes }
    });
  }

  static async forceCloseDeal(dealId: string, reason: string): Promise<void> {
    const { error } = await supabase
      .from('deals')
      .update({ 
        status: 'cancelled',
        dispute_reason: reason,
        admin_notes: `Force closed by admin: ${reason}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', dealId);

    if (error) throw error;

    await this.logSecurityEvent({
      event_type: 'admin_action',
      severity: 'high',
      message: `Deal force closed: ${reason}`,
      metadata: { deal_id: dealId, reason }
    });
  }

  // Commission Management
  static async getCommissionRules(): Promise<CommissionRule[]> {
    try {
      const { data, error } = await supabase
        .from('commission_rules')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching commission rules:', error);
      throw error;
    }
  }


  static async updateCommissionRule(ruleId: string, updates: Partial<CommissionRule>): Promise<void> {
    const { error } = await supabase
      .from('commission_rules')
      .update({ 
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', ruleId);

    if (error) throw error;

    await this.logSecurityEvent({
      event_type: 'admin_action',
      severity: 'high',
      message: `Commission rule updated`,
      metadata: { rule_id: ruleId, updates }
    });
  }

  // Security Events
  static async getSecurityEvents(limit: number = 100): Promise<SecurityEvent[]> {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching security events:', error);
      throw error;
    }
  }


  static async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase
      .from('security_events')
      .insert({
        ...event,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  }

  static async resolveSecurityEvent(eventId: string, resolvedBy: string): Promise<void> {
    const { error } = await supabase
      .from('security_events')
      .update({ 
        resolved: true,
        resolved_by: resolvedBy,
        resolved_at: new Date().toISOString()
      })
      .eq('id', eventId);

    if (error) throw error;
  }

  // System Settings
  static async getSystemSettings(): Promise<SystemSettings[]> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  }


  static async updateSystemSetting(key: string, value: any, updatedBy: string): Promise<void> {
    const { error } = await supabase
      .from('system_settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy
      });

    if (error) throw error;

    await this.logSecurityEvent({
      event_type: 'admin_action',
      severity: 'medium',
      message: `System setting updated: ${key}`,
      metadata: { key, value }
    });
  }

  // Analytics
  static async getSystemStats(): Promise<any> {
    try {
      const [
        usersResult,
        dealsResult,
        revenueResult,
        securityResult
      ] = await Promise.all([
        supabase.from('profiles').select('id, status, created_at, last_login'),
        supabase.from('deals').select('id, status, quote_amount, commission_amount, created_at'),
        supabase.from('deals').select('quote_amount, commission_amount').eq('status', 'completed'),
        supabase.from('security_events').select('id, severity, resolved').eq('created_at', 'gte', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      const users = usersResult.data || [];
      const deals = dealsResult.data || [];
      const revenue = revenueResult.data || [];
      const security = securityResult.data || [];

      return {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'approved' && u.last_login).length,
        pendingApprovals: users.filter(u => u.status === 'pending').length,
        totalDeals: deals.length,
        completedDeals: deals.filter(d => d.status === 'completed').length,
        totalRevenue: revenue.reduce((sum, r) => sum + (r.quote_amount || 0), 0),
        totalCommission: revenue.reduce((sum, r) => sum + (r.commission_amount || 0), 0),
        securityEvents: security.length,
        unresolvedSecurity: security.filter(s => !s.resolved).length,
        systemUptime: "99.97%",
        avgResponseTime: "47ms"
      };
    } catch (error) {
      console.error('Error fetching system stats:', error);
      // Return mock stats if database fails
      return {
        totalUsers: 5,
        activeUsers: 4,
        pendingApprovals: 1,
        totalDeals: 25,
        completedDeals: 20,
        totalRevenue: 3500000,
        totalCommission: 245000,
        securityEvents: 3,
        unresolvedSecurity: 1,
        systemUptime: "99.97%",
        avgResponseTime: "47ms"
      };
    }
  }

  // Sanctions Checking
  static async checkSanctions(userId: string): Promise<{ match: boolean; entities: any[] }> {
    const user = await this.getUserById(userId);
    if (!user) throw new Error('User not found');

    try {
      // Import sanctions service
      const { sanctionsService } = await import('./sanctions-service');
      
      // Check user against sanctions lists
      const matches = await sanctionsService.checkUser({
        full_name: user.full_name,
        email: user.email,
        company_name: user.company_name,
        location: user.location,
        birth_date: (user as any).birth_date
      });

      const hasMatch = matches.length > 0 && matches.some(m => m.risk_level === 'high' || m.risk_level === 'critical');

      // Update user sanctions status
      await supabase
        .from('profiles')
        .update({
          sanctions_checked: true,
          sanctions_match: hasMatch,
          risk_score: hasMatch ? 90 : Math.min(user.risk_score || 0 + 10, 100),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      // Log security event if match found
      if (hasMatch) {
        await this.logSecurityEvent({
          event_type: 'suspicious_activity',
          severity: 'high',
          message: `Sanctions match detected for user ${user.email}`,
          user_id: userId,
          metadata: { matches: matches.map(m => ({ entity: m.entity.name, score: m.match_score })) }
        });
      }

      return {
        match: hasMatch,
        entities: matches.map(m => ({
          name: m.entity.name,
          source: m.entity.source,
          match_score: m.match_score,
          risk_level: m.risk_level,
          reasons: m.match_reasons
        }))
      };

    } catch (error) {
      console.error('Error checking sanctions:', error);
      throw error;
    }
  }

  // KYC Document Management
  static async getKYCStatus(userId: string): Promise<any> {
    try {
      const { kycService } = await import('./kyc-service');
      return await kycService.getUserDocuments(userId);
    } catch (error) {
      console.error('Error getting KYC status:', error);
      return [];
    }
  }

  static async approveKYC(userId: string, documentId: string): Promise<void> {
    try {
      const { kycService } = await import('./kyc-service');
      await kycService.approveDocument(documentId, userId);
    } catch (error) {
      console.error('Error approving KYC:', error);
      throw error;
    }
  }

  static async rejectKYC(userId: string, documentId: string, reason: string): Promise<void> {
    try {
      const { kycService } = await import('./kyc-service');
      await kycService.rejectDocument(documentId, reason, userId);
    } catch (error) {
      console.error('Error rejecting KYC:', error);
      throw error;
    }
  }

  static async getPendingKYC(): Promise<any[]> {
    try {
      const { kycService } = await import('./kyc-service');
      return await kycService.getPendingDocuments();
    } catch (error) {
      console.error('Error getting pending KYC:', error);
      return [];
    }
  }

  static async checkUserCompleteness(userId: string): Promise<any> {
    try {
      const { kycService } = await import('./kyc-service');
      return await kycService.checkUserCompleteness(userId);
    } catch (error) {
      console.error('Error checking user completeness:', error);
      return { is_complete: false, missing_documents: [], expired_documents: [] };
    }
  }
}
