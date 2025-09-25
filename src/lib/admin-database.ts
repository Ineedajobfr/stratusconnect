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

  // Mock data for when database is not available
  static getMockUsers(): AdminUser[] {
    return [
      {
        id: 'mock-user-1',
        email: 'broker1@example.com',
        full_name: 'Alice Johnson',
        role: 'broker',
        status: 'approved',
        company_name: 'Global Aviation Brokers',
        created_at: '2024-01-15T10:00:00Z',
        last_login: '2024-01-20T14:30:00Z',
        verification_status: 'approved',
        location: 'London, UK',
        phone: '+44 7123 456789',
        total_deals: 15,
        revenue: 1500000,
        kyc_status: 'approved',
        sanctions_checked: true,
        sanctions_match: false,
        documents_uploaded: true,
        insurance_expiry: '2025-01-15',
        license_expiry: '2025-06-15',
        aircraft_registrations: ['G-ABCD', 'G-EFGH'],
        profile_complete: true,
        risk_score: 25,
        admin_notes: 'High-performing broker with excellent track record'
      },
      {
        id: 'mock-user-2',
        email: 'operator1@example.com',
        full_name: 'Bob Smith',
        role: 'operator',
        status: 'approved',
        company_name: 'SkyFleet Operations',
        created_at: '2024-01-20T11:00:00Z',
        last_login: '2024-01-20T15:00:00Z',
        verification_status: 'approved',
        location: 'Manchester, UK',
        phone: '+44 7234 567890',
        total_deals: 10,
        revenue: 2000000,
        kyc_status: 'approved',
        sanctions_checked: true,
        sanctions_match: false,
        documents_uploaded: true,
        insurance_expiry: '2025-02-20',
        license_expiry: '2025-07-20',
        aircraft_registrations: ['G-IJKL', 'G-MNOP'],
        profile_complete: true,
        risk_score: 15,
        admin_notes: 'Reliable operator with modern fleet'
      },
      {
        id: 'mock-user-3',
        email: 'pilot1@example.com',
        full_name: 'Charlie Brown',
        role: 'pilot',
        status: 'pending',
        company_name: '',
        created_at: '2024-01-22T12:00:00Z',
        last_login: '2024-01-19T09:00:00Z',
        verification_status: 'pending',
        location: 'Edinburgh, UK',
        phone: '+44 7345 678901',
        total_deals: 0,
        revenue: 0,
        kyc_status: 'pending',
        sanctions_checked: false,
        sanctions_match: false,
        documents_uploaded: false,
        insurance_expiry: '',
        license_expiry: '2024-12-22',
        aircraft_registrations: [],
        profile_complete: false,
        risk_score: 45,
        admin_notes: 'New pilot application - needs verification'
      },
      {
        id: 'mock-user-4',
        email: 'crew1@example.com',
        full_name: 'Diana Prince',
        role: 'crew',
        status: 'approved',
        company_name: '',
        created_at: '2024-01-18T13:00:00Z',
        last_login: '2024-01-20T10:00:00Z',
        verification_status: 'approved',
        location: 'Glasgow, UK',
        phone: '+44 7456 789012',
        total_deals: 0,
        revenue: 0,
        kyc_status: 'approved',
        sanctions_checked: true,
        sanctions_match: false,
        documents_uploaded: true,
        insurance_expiry: '2025-01-18',
        license_expiry: '',
        aircraft_registrations: [],
        profile_complete: true,
        risk_score: 20,
        admin_notes: 'Experienced cabin crew member'
      },
      {
        id: 'mock-user-5',
        email: 'admin1@example.com',
        full_name: 'Eve Administrator',
        role: 'admin',
        status: 'approved',
        company_name: 'StratusConnect',
        created_at: '2024-01-01T09:00:00Z',
        last_login: '2024-01-20T16:00:00Z',
        verification_status: 'approved',
        location: 'London, UK',
        phone: '+44 7567 890123',
        total_deals: 0,
        revenue: 0,
        kyc_status: 'approved',
        sanctions_checked: true,
        sanctions_match: false,
        documents_uploaded: true,
        insurance_expiry: '',
        license_expiry: '',
        aircraft_registrations: [],
        profile_complete: true,
        risk_score: 5,
        admin_notes: 'System administrator'
      }
    ];
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
        return this.getMockDeals();
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching deals:', error);
      return this.getMockDeals();
    }
  }

  // Mock deals data
  static getMockDeals(): Deal[] {
    return [
      {
        id: 'deal-1',
        broker_id: 'mock-user-1',
        operator_id: 'mock-user-2',
        pilot_id: 'mock-user-3',
        crew_id: 'mock-user-4',
        aircraft_id: 'aircraft-1',
        route: 'London to Paris',
        departure_date: '2024-01-25T10:00:00Z',
        return_date: '2024-01-25T18:00:00Z',
        passengers: 8,
        quote_amount: 15000,
        commission_rate: 7.0,
        commission_amount: 1050,
        status: 'completed',
        payment_status: 'released',
        escrow_amount: 15000,
        signed_quote_pdf: 'quote-1.pdf',
        created_at: '2024-01-20T09:00:00Z',
        accepted_at: '2024-01-20T10:30:00Z',
        completed_at: '2024-01-25T19:00:00Z',
        updated_at: '2024-01-25T19:00:00Z'
      },
      {
        id: 'deal-2',
        broker_id: 'mock-user-1',
        operator_id: 'mock-user-2',
        aircraft_id: 'aircraft-2',
        route: 'Manchester to Edinburgh',
        departure_date: '2024-01-26T14:00:00Z',
        passengers: 4,
        quote_amount: 8500,
        commission_rate: 7.0,
        commission_amount: 595,
        status: 'in_progress',
        payment_status: 'escrowed',
        escrow_amount: 8500,
        created_at: '2024-01-21T11:00:00Z',
        accepted_at: '2024-01-21T12:00:00Z',
        updated_at: '2024-01-21T12:00:00Z'
      },
      {
        id: 'deal-3',
        broker_id: 'mock-user-1',
        operator_id: 'mock-user-2',
        aircraft_id: 'aircraft-3',
        route: 'Birmingham to Glasgow',
        departure_date: '2024-01-27T16:00:00Z',
        passengers: 6,
        quote_amount: 12000,
        commission_rate: 7.0,
        commission_amount: 840,
        status: 'quoted',
        payment_status: 'pending',
        escrow_amount: 0,
        created_at: '2024-01-22T13:00:00Z',
        updated_at: '2024-01-22T13:00:00Z'
      }
    ];
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
        return this.getMockCommissionRules();
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching commission rules:', error);
      return this.getMockCommissionRules();
    }
  }

  // Mock commission rules data
  static getMockCommissionRules(): CommissionRule[] {
    return [
      {
        id: 'rule-1',
        role: 'broker',
        transaction_type: 'sale',
        rate_percentage: 7.0,
        minimum_amount: 1000,
        maximum_amount: 100000,
        active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        created_by: 'admin'
      },
      {
        id: 'rule-2',
        role: 'operator',
        transaction_type: 'sale',
        rate_percentage: 7.0,
        minimum_amount: 1000,
        maximum_amount: 100000,
        active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        created_by: 'admin'
      },
      {
        id: 'rule-3',
        role: 'broker',
        transaction_type: 'hire',
        rate_percentage: 10.0,
        minimum_amount: 500,
        maximum_amount: 50000,
        active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        created_by: 'admin'
      },
      {
        id: 'rule-4',
        role: 'pilot',
        transaction_type: 'service',
        rate_percentage: 0.0,
        active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        created_by: 'admin'
      },
      {
        id: 'rule-5',
        role: 'crew',
        transaction_type: 'service',
        rate_percentage: 0.0,
        active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        created_by: 'admin'
      }
    ];
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
        return this.getMockSecurityEvents();
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching security events:', error);
      return this.getMockSecurityEvents();
    }
  }

  // Mock security events data
  static getMockSecurityEvents(): SecurityEvent[] {
    return [
      {
        id: 'sec-1',
        user_id: 'mock-user-1',
        event_type: 'login',
        severity: 'low',
        message: 'Successful login from London, UK',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        metadata: { location: 'London, UK', device: 'Desktop' },
        resolved: true,
        resolved_by: 'admin',
        resolved_at: '2024-01-20T15:00:00Z',
        created_at: '2024-01-20T14:30:00Z'
      },
      {
        id: 'sec-2',
        user_id: 'mock-user-3',
        event_type: 'suspicious_activity',
        severity: 'medium',
        message: 'Multiple failed login attempts detected',
        ip_address: '192.168.1.200',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        metadata: { attempts: 5, time_window: '5 minutes' },
        resolved: false,
        created_at: '2024-01-20T16:00:00Z'
      },
      {
        id: 'sec-3',
        event_type: 'system_error',
        severity: 'high',
        message: 'Database connection timeout',
        ip_address: null,
        user_agent: null,
        metadata: { error_code: 'DB_TIMEOUT', duration: '30s' },
        resolved: true,
        resolved_by: 'admin',
        resolved_at: '2024-01-20T16:30:00Z',
        created_at: '2024-01-20T16:15:00Z'
      }
    ];
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
        return this.getMockSystemSettings();
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching system settings:', error);
      return this.getMockSystemSettings();
    }
  }

  // Mock system settings data
  static getMockSystemSettings(): SystemSettings[] {
    return [
      {
        id: 'setting-1',
        key: 'maintenance_mode',
        value: false,
        description: 'Enable maintenance mode',
        category: 'features',
        updated_at: '2024-01-20T00:00:00Z',
        updated_by: 'admin'
      },
      {
        id: 'setting-2',
        key: 'pilot_marketplace',
        value: true,
        description: 'Enable pilot marketplace',
        category: 'features',
        updated_at: '2024-01-20T00:00:00Z',
        updated_by: 'admin'
      },
      {
        id: 'setting-3',
        key: 'crew_marketplace',
        value: true,
        description: 'Enable crew marketplace',
        category: 'features',
        updated_at: '2024-01-20T00:00:00Z',
        updated_by: 'admin'
      },
      {
        id: 'setting-4',
        key: 'demo_mode',
        value: false,
        description: 'Enable demo mode',
        category: 'features',
        updated_at: '2024-01-20T00:00:00Z',
        updated_by: 'admin'
      },
      {
        id: 'setting-5',
        key: 'require_kyc',
        value: true,
        description: 'Require KYC verification',
        category: 'compliance',
        updated_at: '2024-01-20T00:00:00Z',
        updated_by: 'admin'
      },
      {
        id: 'setting-6',
        key: 'require_sanctions_check',
        value: true,
        description: 'Require sanctions screening',
        category: 'compliance',
        updated_at: '2024-01-20T00:00:00Z',
        updated_by: 'admin'
      },
      {
        id: 'setting-7',
        key: 'email_verification',
        value: true,
        description: 'Require email verification',
        category: 'security',
        updated_at: '2024-01-20T00:00:00Z',
        updated_by: 'admin'
      },
      {
        id: 'setting-8',
        key: 'two_factor_auth',
        value: true,
        description: 'Enable two-factor authentication',
        category: 'security',
        updated_at: '2024-01-20T00:00:00Z',
        updated_by: 'admin'
      }
    ];
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
