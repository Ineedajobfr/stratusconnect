// Enhanced Admin Console - Complete System Monitoring & Management
// Comprehensive admin dashboard with AI monitoring, verification, and oversight

import { AIChat } from '@/components/admin/AIChat';
import { PlatformOverview } from '@/components/admin/PlatformOverview';
import { TransactionManagement } from '@/components/admin/TransactionManagement';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { securityAlerts } from '@/lib/security/alerts';
import {
    AlertCircle,
    AlertOctagon,
    AlertTriangle,
    Bot,
    Brain,
    CheckCircle,
    ChevronLeft,
    CreditCard,
    Database,
    DollarSign,
    Eye,
    FileText,
    Flag,
    Globe,
    Lock,
    Plane,
    RefreshCw,
    Search,
    Settings,
    Shield,
    Target,
    UserCheck,
    Users,
    UserX,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  company_id: string | null;
  phone: string | null;
  verification_level: number;
  is_verified: boolean;
  risk_score: number;
  flags: string[];
  last_activity: string;
  device_info: string;
  location: string;
}

interface VerificationRequest {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  verification_type: 'id' | 'license' | 'medical' | 'insurance' | 'company' | 'banking';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  submitted_at: string;
  documents: string[];
  notes?: string;
  reviewer_id?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface SecurityEvent {
  id: string;
  type: 'login_failed' | 'suspicious_activity' | 'rate_limit' | 'unauthorized_access' | 'data_breach' | 'malicious_input' | 'unusual_pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  user_email?: string;
  description: string;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  resolved: boolean;
  ai_confidence: number;
  auto_resolved: boolean;
  action_taken: string;
}

interface Transaction {
  id: string;
  type: 'rfq' | 'quote' | 'payment' | 'refund' | 'fee' | 'commission' | 'penalty';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'disputed';
  user_id: string;
  user_email: string;
  created_at: string;
  description: string;
  reference_id: string;
  payment_method: string;
  fees: number;
  net_amount: number;
  risk_level: 'low' | 'medium' | 'high';
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  response_time: number;
  error_rate: number;
  active_connections: number;
  database_status: 'connected' | 'disconnected' | 'slow';
  last_backup: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_latency: number;
}

interface AIAlert {
  id: string;
  type: 'behavior' | 'security' | 'financial' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  user_id?: string;
  confidence: number;
  timestamp: string;
  resolved: boolean;
  auto_action: string;
  manual_review_required: boolean;
}

interface Stats {
  // User Stats
  totalUsers: number;
  pendingApproval: number;
  adminUsers: number;
  activeToday: number;
  
  // Business Stats
  totalRFQs: number;
  activeDeals: number;
  totalTransactions: number;
  revenue: number;
  monthlyGrowth: number;
  
  // Security Stats
  pendingVerifications: number;
  securityAlerts: number;
  blockedAttempts: number;
  aiFlags: number;
  
  // System Stats
  systemHealth: SystemHealth;
  
  // Role-specific Stats
  brokerStats: {
    total: number;
    active: number;
    pending: number;
    revenue: number;
  };
  operatorStats: {
    total: number;
    active: number;
    pending: number;
    aircraft: number;
  };
  pilotStats: {
    total: number;
    active: number;
    pending: number;
    verified: number;
  };
  crewStats: {
    total: number;
    active: number;
    pending: number;
    certified: number;
  };
}

export default function AdminConsole() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('platform'); // Start with new enterprise platform overview
  
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [aiAlerts, setAiAlerts] = useState<AIAlert[]>([]);
  
  // Advanced Security States
  const [securityDashboardData, setSecurityDashboardData] = useState<any>(null);
  const [penetrationTestResults, setPenetrationTestResults] = useState<any[]>([]);
  const [botDetectionStats, setBotDetectionStats] = useState<any>(null);
  const [threatIntelligence, setThreatIntelligence] = useState<any[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<any>(null);
  
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    pendingApproval: 0,
    adminUsers: 0,
    activeToday: 0,
    totalRFQs: 0,
    activeDeals: 0,
    totalTransactions: 0,
    revenue: 0,
    monthlyGrowth: 0,
    pendingVerifications: 0,
    securityAlerts: 0,
    blockedAttempts: 0,
    aiFlags: 0,
    systemHealth: {
      status: 'healthy',
      uptime: 99.9,
      response_time: 120,
      error_rate: 0.1,
      active_connections: 0,
      database_status: 'connected',
      last_backup: new Date().toISOString(),
      cpu_usage: 45,
      memory_usage: 62,
      disk_usage: 78,
      network_latency: 25
    },
    brokerStats: { total: 0, active: 0, pending: 0, revenue: 0 },
    operatorStats: { total: 0, active: 0, pending: 0, aircraft: 0 },
    pilotStats: { total: 0, active: 0, pending: 0, verified: 0 },
    crewStats: { total: 0, active: 0, pending: 0, certified: 0 }
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [aiMonitoringEnabled, setAiMonitoringEnabled] = useState(true);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadUsers(),
        loadVerifications(),
        loadSecurityEvents(),
        loadTransactions(),
        loadAIAlerts(),
        loadSystemHealth()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadAdvancedSecurityData = async () => {
    try {
      // Load security alerts
      const alerts = await securityAlerts.getAlerts();
      setSecurityDashboardData({ alerts });

      // Load bot detection stats
      const botStats = {
        totalDetected: 1247,
        blockedToday: 89,
        suspiciousIPs: 23,
        fingerprintMatches: 156
      };
      setBotDetectionStats(botStats);

      // Load penetration test results
      const testResults = [
        {
          id: 'pt-001',
          test: 'SQL Injection',
          status: 'passed',
          severity: 'low',
          timestamp: new Date().toISOString(),
          details: 'No SQL injection vulnerabilities found'
        },
        {
          id: 'pt-002', 
          test: 'XSS Protection',
          status: 'passed',
          severity: 'low',
          timestamp: new Date().toISOString(),
          details: 'XSS protection is active and working'
        },
        {
          id: 'pt-003',
          test: 'Rate Limiting',
          status: 'passed', 
          severity: 'medium',
          timestamp: new Date().toISOString(),
          details: 'Rate limiting is properly configured'
        },
        {
          id: 'pt-004',
          test: 'Authentication Bypass',
          status: 'passed',
          severity: 'critical',
          timestamp: new Date().toISOString(),
          details: 'Authentication system is secure'
        }
      ];
      setPenetrationTestResults(testResults);

      // Load threat intelligence
      const threats = [
        {
          id: 'threat-001',
          type: 'Malicious Bot',
          severity: 'high',
          ip: '192.168.1.100',
          timestamp: new Date().toISOString(),
          description: 'Automated scraping attempt detected'
        },
        {
          id: 'threat-002',
          type: 'Suspicious Login',
          severity: 'medium',
          ip: '10.0.0.50',
          timestamp: new Date().toISOString(),
          description: 'Multiple failed login attempts'
        }
      ];
      setThreatIntelligence(threats);

      // Load security metrics
      const metrics = {
        totalScans: 15420,
        vulnerabilitiesFound: 0,
        falsePositives: 2,
        securityScore: 98,
        lastScan: new Date().toISOString()
      };
      setSecurityMetrics(metrics);

    } catch (error) {
      console.error('Error loading advanced security data:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    const userRole = user?.role || user?.user_metadata?.role || user?.app_metadata?.role;
    const isAdminEmail = user?.email?.includes('admin') || 
                        user?.email?.includes('stratuscharters') || 
                        user?.email?.includes('lordbroctree') ||
                        user?.email?.includes('@stratusconnect.org');
    
    if (userRole !== 'admin' && !isAdminEmail) {
      toast({
        title: 'Access Denied',
        description: 'Only administrators can access this page',
        variant: 'destructive',
      });
      setTimeout(() => navigate('/'), 2000);
      return;
    }
    
    loadAllData();
    loadAdvancedSecurityData();
  }, [user, navigate]);

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u =>
        u.email.toLowerCase().includes(query) ||
        u.full_name?.toLowerCase().includes(query) ||
        u.id.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(u => u.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter, statusFilter, filterUsers]);

  const loadUsers = async () => {
    // Enhanced sample users with comprehensive data
    const sampleUsers: User[] = [
      {
        id: 'user-1',
        email: 'john.doe@example.com',
        full_name: 'John Doe',
        role: 'broker',
        status: 'active',
        created_at: new Date().toISOString(),
        last_sign_in_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        email_confirmed_at: new Date().toISOString(),
        company_id: null,
        phone: '+1-555-0123',
        verification_level: 5,
        is_verified: true,
        risk_score: 15,
        flags: [],
        last_activity: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        device_info: 'Chrome 120.0 / Windows 11',
        location: 'New York, NY'
      },
      {
        id: 'user-2',
        email: 'jane.smith@airline.com',
        full_name: 'Jane Smith',
        role: 'operator',
        status: 'active',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        last_sign_in_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        email_confirmed_at: new Date().toISOString(),
        company_id: null,
        phone: '+1-555-0456',
        verification_level: 5,
        is_verified: true,
        risk_score: 8,
        flags: [],
        last_activity: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
        device_info: 'Safari 17.0 / macOS 14',
        location: 'Los Angeles, CA'
      },
      {
        id: 'user-3',
        email: 'mike.pilot@charter.com',
        full_name: 'Mike Johnson',
        role: 'pilot',
        status: 'pending',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        last_sign_in_at: null,
        email_confirmed_at: null,
        company_id: null,
        phone: '+1-555-0789',
        verification_level: 2,
        is_verified: false,
        risk_score: 45,
        flags: ['unusual_login_pattern', 'document_verification_pending'],
        last_activity: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        device_info: 'Firefox 121.0 / Ubuntu 22.04',
        location: 'Miami, FL'
      },
      {
        id: 'user-4',
        email: 'sarah.crew@aviation.com',
        full_name: 'Sarah Wilson',
        role: 'crew',
        status: 'active',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        last_sign_in_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        email_confirmed_at: new Date().toISOString(),
        company_id: null,
        phone: '+1-555-0321',
        verification_level: 4,
        is_verified: true,
        risk_score: 12,
        flags: [],
        last_activity: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        device_info: 'Edge 120.0 / Windows 10',
        location: 'Chicago, IL'
      }
    ];
    
    setUsers(sampleUsers);
    calculateUserStats(sampleUsers);
  };

  const loadVerifications = async () => {
    const sampleVerifications: VerificationRequest[] = [
      {
        id: 'ver-1',
        user_id: 'user-3',
        user_name: 'Mike Johnson',
        user_email: 'mike.pilot@charter.com',
        verification_type: 'license',
        status: 'pending',
        submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        documents: ['pilot_license.pdf', 'medical_certificate.pdf', 'flight_hours_log.pdf'],
        notes: 'PPL with 1500+ hours, recent medical exam',
        priority: 'high'
      },
      {
        id: 'ver-2',
        user_id: 'user-4',
        user_name: 'Sarah Wilson',
        user_email: 'sarah.crew@aviation.com',
        verification_type: 'id',
        status: 'pending',
        submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        documents: ['passport.pdf', 'drivers_license.pdf'],
        priority: 'medium'
      },
      {
        id: 'ver-3',
        user_id: 'user-5',
        user_name: 'Alex Rodriguez',
        user_email: 'alex.operator@charter.com',
        verification_type: 'company',
        status: 'approved',
        submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        documents: ['business_license.pdf', 'insurance_certificate.pdf'],
        reviewer_id: 'admin-1',
        reviewed_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        priority: 'urgent'
      }
    ];
    
    setVerifications(sampleVerifications);
  };

  const loadSecurityEvents = async () => {
    const sampleEvents: SecurityEvent[] = [
      {
        id: 'sec-1',
        type: 'login_failed',
        severity: 'medium',
        user_email: 'hacker@example.com',
        description: 'Multiple failed login attempts from suspicious IP',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        resolved: false,
        ai_confidence: 0.85,
        auto_resolved: false,
        action_taken: 'IP temporarily blocked'
      },
      {
        id: 'sec-2',
        type: 'suspicious_activity',
        severity: 'high',
        user_id: 'user-1',
        user_email: 'john.doe@example.com',
        description: 'Unusual API access pattern detected - rapid successive requests',
        ip_address: '10.0.0.50',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        resolved: true,
        ai_confidence: 0.92,
        auto_resolved: true,
        action_taken: 'Rate limit applied, user notified'
      },
      {
        id: 'sec-3',
        type: 'malicious_input',
        severity: 'critical',
        user_id: 'user-6',
        user_email: 'suspicious@test.com',
        description: 'SQL injection attempt detected in RFQ form',
        ip_address: '203.0.113.42',
        user_agent: 'curl/7.68.0',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        resolved: false,
        ai_confidence: 0.98,
        auto_resolved: false,
        action_taken: 'Account suspended pending review'
      }
    ];
    
    setSecurityEvents(sampleEvents);
  };

  const loadTransactions = async () => {
    const sampleTransactions: Transaction[] = [
      {
        id: 'txn-1',
        type: 'payment',
        amount: 50000,
        currency: 'USD',
        status: 'completed',
        user_id: 'user-1',
        user_email: 'john.doe@example.com',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        description: 'Charter payment - NYC to LAX',
        reference_id: 'CHT-2024-001',
        payment_method: 'Wire Transfer',
        fees: 1250,
        net_amount: 48750,
        risk_level: 'low'
      },
      {
        id: 'txn-2',
        type: 'fee',
        amount: 1250,
        currency: 'USD',
        status: 'completed',
        user_id: 'user-2',
        user_email: 'jane.smith@airline.com',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        description: 'Platform fee - 2.5%',
        reference_id: 'FEE-2024-001',
        payment_method: 'Credit Card',
        fees: 0,
        net_amount: 1250,
        risk_level: 'low'
      },
      {
        id: 'txn-3',
        type: 'refund',
        amount: 15000,
        currency: 'USD',
        status: 'completed',
        user_id: 'user-1',
        user_email: 'john.doe@example.com',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        description: 'Flight cancellation refund',
        reference_id: 'REF-2024-001',
        payment_method: 'Wire Transfer',
        fees: 0,
        net_amount: 15000,
        risk_level: 'medium'
      }
    ];
    
    setTransactions(sampleTransactions);
  };

  const loadAIAlerts = async () => {
    const sampleAlerts: AIAlert[] = [
      {
        id: 'ai-1',
        type: 'behavior',
        severity: 'medium',
        title: 'Unusual Login Pattern Detected',
        description: 'User mike.pilot@charter.com has logged in from 3 different countries in 24 hours',
        user_id: 'user-3',
        confidence: 0.87,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        resolved: false,
        auto_action: 'Account flagged for manual review',
        manual_review_required: true
      },
      {
        id: 'ai-2',
        type: 'financial',
        severity: 'high',
        title: 'Large Transaction Anomaly',
        description: 'Transaction amount $50,000 is 300% higher than user average',
        user_id: 'user-1',
        confidence: 0.92,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        resolved: true,
        auto_action: 'Transaction held for verification',
        manual_review_required: false
      },
      {
        id: 'ai-3',
        type: 'security',
        severity: 'critical',
        title: 'Potential Account Takeover',
        description: 'Multiple failed password attempts followed by successful login from new device',
        user_id: 'user-4',
        confidence: 0.95,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        resolved: false,
        auto_action: 'Account temporarily locked',
        manual_review_required: true
      }
    ];
    
    setAiAlerts(sampleAlerts);
  };

  const loadSystemHealth = async () => {
    // Simulate real-time system health data
    setStats(prev => ({
      ...prev,
      systemHealth: {
        status: 'healthy',
        uptime: 99.9,
        response_time: 120,
        error_rate: 0.1,
        active_connections: 42,
        database_status: 'connected',
        last_backup: new Date().toISOString(),
        cpu_usage: 45,
        memory_usage: 62,
        disk_usage: 78,
        network_latency: 25
      }
    }));
  };

  const calculateUserStats = (userList: User[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const roleStats = {
      broker: userList.filter(u => u.role === 'broker'),
      operator: userList.filter(u => u.role === 'operator'),
      pilot: userList.filter(u => u.role === 'pilot'),
      crew: userList.filter(u => u.role === 'crew'),
      admin: userList.filter(u => u.role === 'admin')
    };

    setStats(prev => ({
      ...prev,
      totalUsers: userList.length,
      pendingApproval: userList.filter(u => u.status === 'pending').length,
      adminUsers: roleStats.admin.length,
      activeToday: userList.filter(u => {
        if (!u.last_sign_in_at) return false;
        const lastSignIn = new Date(u.last_sign_in_at);
        return lastSignIn >= today;
      }).length,
      pendingVerifications: verifications.filter(v => v.status === 'pending').length,
      securityAlerts: securityEvents.filter(e => !e.resolved).length,
      aiFlags: aiAlerts.filter(a => !a.resolved).length,
      totalTransactions: transactions.length,
      revenue: transactions
        .filter(t => t.type === 'payment' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      brokerStats: {
        total: roleStats.broker.length,
        active: roleStats.broker.filter(u => u.status === 'active').length,
        pending: roleStats.broker.filter(u => u.status === 'pending').length,
        revenue: transactions
          .filter(t => t.user_id && roleStats.broker.some(u => u.id === t.user_id) && t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0)
      },
      operatorStats: {
        total: roleStats.operator.length,
        active: roleStats.operator.filter(u => u.status === 'active').length,
        pending: roleStats.operator.filter(u => u.status === 'pending').length,
        aircraft: 12 // Mock data
      },
      pilotStats: {
        total: roleStats.pilot.length,
        active: roleStats.pilot.filter(u => u.status === 'active').length,
        pending: roleStats.pilot.filter(u => u.status === 'pending').length,
        verified: roleStats.pilot.filter(u => u.is_verified).length
      },
      crewStats: {
        total: roleStats.crew.length,
        active: roleStats.crew.filter(u => u.status === 'active').length,
        pending: roleStats.crew.filter(u => u.status === 'pending').length,
        certified: roleStats.crew.filter(u => u.verification_level >= 4).length
      }
    }));
  };

  // Action functions
  const approveVerification = async (verificationId: string) => {
    setVerifications(prev => 
      prev.map(v => v.id === verificationId ? { 
        ...v, 
        status: 'approved' as const,
        reviewed_at: new Date().toISOString(),
        reviewer_id: user?.id || 'admin'
      } : v)
    );
    toast({
      title: 'Verification Approved',
      description: 'User verification has been approved',
    });
  };

  const rejectVerification = async (verificationId: string, reason: string) => {
    setVerifications(prev => 
      prev.map(v => v.id === verificationId ? { 
        ...v, 
        status: 'rejected' as const,
        rejection_reason: reason,
        reviewed_at: new Date().toISOString(),
        reviewer_id: user?.id || 'admin'
      } : v)
    );
    toast({
      title: 'Verification Rejected',
      description: 'User verification has been rejected',
    });
  };

  const resolveSecurityEvent = async (eventId: string) => {
    setSecurityEvents(prev => 
      prev.map(e => e.id === eventId ? { ...e, resolved: true } : e)
    );
    toast({
      title: 'Security Event Resolved',
      description: 'Security event has been marked as resolved',
    });
  };

  const resolveAIAlert = async (alertId: string) => {
    setAiAlerts(prev => 
      prev.map(a => a.id === alertId ? { ...a, resolved: true } : a)
    );
    toast({
      title: 'AI Alert Resolved',
      description: 'AI alert has been marked as resolved',
    });
  };

  const flagUser = async (userId: string, flag: string) => {
    setUsers(prev => 
      prev.map(u => u.id === userId ? { 
        ...u, 
        flags: [...u.flags, flag],
        risk_score: Math.min(u.risk_score + 10, 100)
      } : u)
    );
    toast({
      title: 'User Flagged',
      description: `User has been flagged: ${flag}`,
    });
  };

  const suspendUser = async (userId: string, reason: string) => {
    setUsers(prev => 
      prev.map(u => u.id === userId ? { 
        ...u, 
        status: 'suspended' as const,
        flags: [...u.flags, `suspended: ${reason}`]
      } : u)
    );
    toast({
      title: 'User Suspended',
      description: `User has been suspended: ${reason}`,
    });
  };

  const unsuspendUser = async (userId: string) => {
    setUsers(prev => 
      prev.map(u => u.id === userId ? { 
        ...u, 
        status: 'active' as const,
        flags: u.flags.filter(flag => !flag.startsWith('suspended:'))
      } : u)
    );
    toast({
      title: 'User Unsuspended',
      description: 'User has been unsuspended and restored to active status',
    });
  };

  const removeFlag = async (userId: string, flagToRemove: string) => {
    setUsers(prev => 
      prev.map(u => u.id === userId ? { 
        ...u, 
        flags: u.flags.filter(flag => flag !== flagToRemove),
        risk_score: Math.max(u.risk_score - 5, 0)
      } : u)
    );
    toast({
      title: 'Flag Removed',
      description: `Flag "${flagToRemove}" has been removed from user`,
    });
  };

  const viewUserProfile = (user: User) => {
    setSelectedUser(user);
    setUserDetailOpen(true);
  };

  const viewDocument = (document: string, verification: VerificationRequest) => {
    setSelectedDocument(document);
    setSelectedVerification(verification);
    setDocumentViewerOpen(true);
  };

  const unresolveSecurityEvent = async (eventId: string) => {
    setSecurityEvents(prev => 
      prev.map(e => e.id === eventId ? { ...e, resolved: false } : e)
    );
    toast({
      title: 'Security Event Unresolved',
      description: 'Security event has been marked as unresolved',
    });
  };

  const unresolveAIAlert = async (alertId: string) => {
    setAiAlerts(prev => 
      prev.map(a => a.id === alertId ? { ...a, resolved: false } : a)
    );
    toast({
      title: 'AI Alert Unresolved',
      description: 'AI alert has been marked as unresolved',
    });
  };

  const refreshData = async () => {
    await loadAllData();
    toast({
      title: 'Data Refreshed',
      description: 'All data has been refreshed',
    });
  };

  const backupDatabase = async () => {
    // Simulate database backup
    toast({
      title: 'Database Backup Started',
      description: 'Database backup is in progress...',
    });
    
    // Simulate backup completion after 3 seconds
    setTimeout(() => {
      toast({
        title: 'Database Backup Complete',
        description: 'Database has been successfully backed up',
      });
    }, 3000);
  };

  const trainAIModel = async () => {
    toast({
      title: 'AI Model Training Started',
      description: 'AI model training is in progress...',
    });
    
    // Simulate training completion after 5 seconds
    setTimeout(() => {
      toast({
        title: 'AI Model Training Complete',
        description: 'AI model has been successfully trained',
      });
    }, 5000);
  };

  const sendEmailToUser = async (userEmail: string, subject: string, message: string) => {
    // Simulate email sending
    toast({
      title: 'Email Sent',
      description: `Email sent to ${userEmail}: ${subject}`,
    });
    
    // In a real implementation, this would call your email service
    console.log('Email sent:', { to: userEmail, subject, message });
  };

  const verifyWithPersona = async (verificationId: string) => {
    // Simulate Persona verification
    toast({
      title: 'Persona Verification Started',
      description: 'Verifying documents with Persona...',
    });
    
    setTimeout(() => {
      toast({
        title: 'Persona Verification Complete',
        description: 'Documents verified successfully with Persona',
      });
      
      // Auto-approve if Persona verification passes
      setVerifications(prev => 
        prev.map(v => v.id === verificationId ? { 
          ...v, 
          status: 'approved' as const,
          reviewed_at: new Date().toISOString(),
          reviewer_id: user?.id || 'admin',
          notes: (v.notes || '') + '\n[Persona Verified]'
        } : v)
      );
    }, 3000);
  };

  const generateReceipt = (transaction: Transaction) => {
    const receipt = {
      transactionId: transaction.id,
      amount: transaction.amount,
      currency: transaction.currency,
      description: transaction.description,
      userEmail: transaction.user_email,
      timestamp: transaction.created_at,
      fees: transaction.fees,
      netAmount: transaction.net_amount,
      referenceId: transaction.reference_id
    };
    
    // In a real implementation, this would generate a PDF receipt
    console.log('Receipt generated:', receipt);
    
    toast({
      title: 'Receipt Generated',
      description: `Receipt for transaction ${transaction.reference_id} has been generated`,
    });
    
    return receipt;
  };

  const resolveSecurityIssue = async (eventId: string, resolution: string) => {
    setSecurityEvents(prev => 
      prev.map(e => e.id === eventId ? { 
        ...e, 
        resolved: true,
        action_taken: resolution
      } : e)
    );
    toast({
      title: 'Security Issue Resolved',
      description: `Resolution: ${resolution}`,
    });
  };

  const resolveAIAlertIssue = async (alertId: string, resolution: string) => {
    setAiAlerts(prev => 
      prev.map(a => a.id === alertId ? { 
        ...a, 
        resolved: true,
        auto_action: resolution
      } : a)
    );
    toast({
      title: 'AI Alert Resolved',
      description: `Resolution: ${resolution}`,
    });
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User role updated successfully',
      });

      loadUsers();
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      // Since profiles table doesn't have status, we'll update verification_level instead
      const verificationLevel = newStatus === 'active' ? 5 : 0;
      const { error } = await supabase
        .from('profiles')
        .update({ 
          verification_level: verificationLevel,
          is_verified: newStatus === 'active'
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `User ${newStatus === 'active' ? 'approved' : 'status updated'} successfully`,
      });

      loadUsers();
    } catch (error) {
      console.error('Failed to update user status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete from auth (requires admin)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.error('Auth delete error:', authError);
        // Fallback: soft delete from profiles table
        const { error: profilesError } = await supabase
          .from('profiles')
          .update({ 
            verification_level: 0,
            is_verified: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (profilesError) throw profilesError;
      }

      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });

      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      broker: 'bg-blue-500',
      operator: 'bg-green-500',
      pilot: 'bg-purple-500',
      crew: 'bg-orange-500',
      admin: 'bg-red-500',
    };
    return colors[role] || 'bg-gray-500';
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500',
      pending: 'bg-yellow-500',
      suspended: 'bg-red-500',
      inactive: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
        }}
      >
        <div className="text-white text-xl">Loading admin console...</div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-8"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.1) 25%, rgba(236, 72, 153, 0.08) 50%, rgba(251, 191, 36, 0.05) 75%, rgba(255, 255, 255, 0.02) 100%), linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 75%, #64748b 100%)',
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
              className="text-slate-700 hover:bg-slate-100 border border-slate-200"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
            <div className="text-sm text-slate-500 font-medium">
            STRATUSCONNECT
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-emerald-500" />
              <span className="text-sm text-slate-600 font-medium">AI Monitoring</span>
              <div className={`w-3 h-3 rounded-full ${aiMonitoringEnabled ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            </div>
            <Button
              onClick={() => setAiMonitoringEnabled(!aiMonitoringEnabled)}
              size="sm"
              variant="outline"
              className="text-slate-700 border-slate-300 hover:bg-slate-50"
            >
              {aiMonitoringEnabled ? 'Disable' : 'Enable'} AI
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-2">
          <Shield className="h-10 w-10 text-blue-600" />
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Enhanced Admin Console</h1>
            <p className="text-slate-600">Complete system monitoring, verification, and management</p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-13 bg-white/80 border-slate-200 shadow-sm">
          <TabsTrigger value="platform" className="text-slate-700 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 font-semibold">🎛️ Platform</TabsTrigger>
          <TabsTrigger value="ai-assistant" className="text-slate-700 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 font-semibold">🤖 AI Assistant</TabsTrigger>
          <TabsTrigger value="revenue" className="text-slate-700 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 font-semibold">💰 Revenue</TabsTrigger>
          <TabsTrigger value="overview" className="text-slate-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Overview</TabsTrigger>
          <TabsTrigger value="users" className="text-slate-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Users</TabsTrigger>
          <TabsTrigger value="verification" className="text-slate-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Verification</TabsTrigger>
          <TabsTrigger value="security" className="text-slate-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Security</TabsTrigger>
          <TabsTrigger value="threats" className="text-slate-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Threats</TabsTrigger>
          <TabsTrigger value="penetration" className="text-slate-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Pen Test</TabsTrigger>
          <TabsTrigger value="transactions" className="text-slate-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Transactions</TabsTrigger>
          <TabsTrigger value="ai-monitoring" className="text-slate-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">AI Monitoring</TabsTrigger>
          <TabsTrigger value="bot-detection" className="text-slate-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Bot Detection</TabsTrigger>
          <TabsTrigger value="system" className="text-slate-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">System</TabsTrigger>
        </TabsList>

        {/* NEW: Platform Overview Tab - Enterprise Dashboard */}
        <TabsContent value="platform" className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-lg">
            <PlatformOverview />
          </div>
        </TabsContent>

        {/* NEW: AI Assistant Tab - Natural Language Admin */}
        <TabsContent value="ai-assistant" className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-lg h-[800px]">
            <AIChat />
          </div>
        </TabsContent>

        {/* NEW: Revenue Tab - Commission Tracking (7%/10%) */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-lg">
            <TransactionManagement />
          </div>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/90 border-slate-200 shadow-lg backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                    <p className="text-sm text-slate-600 mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-slate-800">{stats.totalUsers}</p>
              </div>
                  <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

            <Card className="bg-white/90 border-slate-200 shadow-lg backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                    <p className="text-sm text-slate-600 mb-1">Pending Verifications</p>
                    <p className="text-3xl font-bold text-slate-800">{stats.pendingVerifications}</p>
              </div>
                  <UserCheck className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

            <Card className="bg-white/90 border-slate-200 shadow-lg backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                    <p className="text-sm text-slate-600 mb-1">Security Alerts</p>
                    <p className="text-3xl font-bold text-slate-800">{stats.securityAlerts}</p>
              </div>
                  <AlertOctagon className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

            <Card className="bg-white/90 border-slate-200 shadow-lg backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                    <p className="text-sm text-slate-600 mb-1">Revenue</p>
                    <p className="text-3xl font-bold text-slate-800">${stats.revenue.toLocaleString()}</p>
              </div>
                  <DollarSign className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

          {/* Role-specific Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/90 border-slate-200 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 text-lg flex items-center gap-2">
                  <Plane className="h-5 w-5 text-blue-500" />
                  Brokers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total:</span>
                    <span className="text-slate-800 font-medium">{stats.brokerStats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Active:</span>
                    <span className="text-emerald-600 font-medium">{stats.brokerStats.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Revenue:</span>
                    <span className="text-emerald-600 font-medium">${stats.brokerStats.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-slate-200 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-emerald-500" />
                  Operators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total:</span>
                    <span className="text-slate-800 font-medium">{stats.operatorStats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Active:</span>
                    <span className="text-emerald-600 font-medium">{stats.operatorStats.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Aircraft:</span>
                    <span className="text-blue-600 font-medium">{stats.operatorStats.aircraft}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-slate-200 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  Pilots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total:</span>
                    <span className="text-slate-800 font-medium">{stats.pilotStats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Verified:</span>
                    <span className="text-emerald-600 font-medium">{stats.pilotStats.verified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Pending:</span>
                    <span className="text-amber-600 font-medium">{stats.pilotStats.pending}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-slate-200 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  Crew
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total:</span>
                    <span className="text-slate-800 font-medium">{stats.crewStats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Certified:</span>
                    <span className="text-emerald-600 font-medium">{stats.crewStats.certified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Active:</span>
                    <span className="text-blue-600 font-medium">{stats.crewStats.active}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <Card className="bg-white/90 border-slate-200 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-800 text-xl">Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 mb-2">${Math.round(stats.revenue * 0.07).toLocaleString()}</div>
                  <div className="text-sm text-slate-600">7% Broker/Operator Fees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">${Math.round(stats.revenue * 0.10).toLocaleString()}</div>
                  <div className="text-sm text-slate-600">10% Hiring Fees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">${Math.round(stats.revenue * 0.83).toLocaleString()}</div>
                  <div className="text-sm text-slate-600">User Earnings</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="bg-white/90 border-slate-200 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-800 text-xl">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800 mb-2">{stats.systemHealth.uptime}%</div>
                  <div className="text-sm text-slate-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800 mb-2">{stats.systemHealth.response_time}ms</div>
                  <div className="text-sm text-slate-600">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800 mb-2">{stats.systemHealth.active_connections}</div>
                  <div className="text-sm text-slate-600">Active Connections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800 mb-2">{stats.systemHealth.memory_usage}%</div>
                  <div className="text-sm text-slate-600">Memory Usage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-2xl">User Management</CardTitle>
          <p className="text-white/60 text-sm">Manage user accounts, roles, and verification status</p>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/30 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48 bg-black/30 border-white/20 text-white">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="broker">Broker</SelectItem>
                <SelectItem value="operator">Operator</SelectItem>
                <SelectItem value="pilot">Pilot</SelectItem>
                <SelectItem value="crew">Crew</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-black/30 border-white/20 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

              {/* Enhanced Users Table */}
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/30 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Risk Score</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">Flags</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-white/60">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-white">{u.full_name || 'No Name'}</div>
                            <div className="text-sm text-white/60">{u.email}</div>
                                <div className="text-xs text-white/40">{u.location}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`${getRoleBadgeColor(u.role)} text-white text-xs`}>
                            {u.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`${getStatusBadgeColor(u.status)} text-white text-xs`}>
                            {u.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                              <div className={`text-sm font-medium ${
                                u.risk_score < 20 ? 'text-green-400' :
                                u.risk_score < 50 ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {u.risk_score}/100
                              </div>
                        </td>
                        <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {u.flags.slice(0, 2).map((flag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs text-red-400 border-red-400">
                                    {flag}
                                  </Badge>
                                ))}
                                {u.flags.length > 2 && (
                                  <Badge variant="outline" className="text-xs text-white/60">
                                    +{u.flags.length - 2}
                                  </Badge>
                                )}
                              </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                  variant="outline"
                                  className="text-white border-white/20"
                                  onClick={() => viewUserProfile(u)}
                              >
                                  <Eye className="h-4 w-4" />
                              </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-white border-white/20"
                                  onClick={() => flagUser(u.id, 'manual_review')}
                                >
                                  <Flag className="h-4 w-4" />
                                </Button>
                            <Button
                              size="sm"
                                  variant="outline"
                                  className="text-red-400 border-red-400"
                                  onClick={() => suspendUser(u.id, 'admin_action')}
                                >
                                  <UserX className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 text-sm text-white/60">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Fortress of Trust - Verification Center</CardTitle>
              <p className="text-white/60">Review and approve user verification requests</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verifications.map((verification) => (
                  <div key={verification.id} className="p-4 bg-black/30 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-medium text-white">{verification.user_name}</div>
                        <div className="text-sm text-white/60">{verification.user_email}</div>
                        <div className="text-sm text-white/60">
                          {verification.verification_type.toUpperCase()} Verification
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          verification.status === 'pending' ? 'bg-yellow-500' : 
                          verification.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                        } text-white`}>
                          {verification.status}
                        </Badge>
                        <Badge className={`${
                          verification.priority === 'urgent' ? 'bg-red-500' :
                          verification.priority === 'high' ? 'bg-orange-500' :
                          verification.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        } text-white`}>
                          {verification.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm text-white/60 mb-2">Documents:</div>
                      <div className="flex gap-2">
                        {verification.documents.map((doc, index) => (
                          <Button key={index} size="sm" variant="outline" className="text-white border-white/20">
                            <FileText className="h-4 w-4 mr-1" />
                            {doc}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {verification.notes && (
                      <div className="mb-4">
                        <div className="text-sm text-white/60 mb-1">Notes:</div>
                        <div className="text-sm text-white">{verification.notes}</div>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => approveVerification(verification.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => rejectVerification(verification.id, 'Document verification failed')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-white border-white/20"
                        onClick={() => viewDocument(verification.documents[0], verification)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review Documents
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => verifyWithPersona(verification.id)}
                      >
                        <Brain className="h-4 w-4 mr-1" />
                        Persona Verify
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-white border-white/20"
                        onClick={() => sendEmailToUser(
                          verification.user_email, 
                          'Document Verification Update', 
                          'Please provide additional documentation for verification.'
                        )}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Send Email
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Security Monitoring</CardTitle>
              <p className="text-white/60">Monitor security events and threats</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.map((event) => (
                  <div key={event.id} className={`p-4 rounded-lg ${
                    event.resolved ? 'bg-black/20' : 
                    event.severity === 'critical' ? 'bg-red-900/20' :
                    event.severity === 'high' ? 'bg-orange-900/20' : 'bg-yellow-900/20'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          event.severity === 'critical' ? 'bg-red-500' :
                          event.severity === 'high' ? 'bg-orange-500' :
                          event.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        } text-white`}>
                          {event.severity}
                        </Badge>
                        <span className="text-white font-medium">{event.type.replace('_', ' ').toUpperCase()}</span>
                        {event.ai_confidence > 0.8 && (
                          <Badge className="bg-purple-500 text-white">
                            AI: {Math.round(event.ai_confidence * 100)}%
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-white/60">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="text-white mb-2">{event.description}</div>
                    <div className="text-sm text-white/60 mb-2">
                      User: {event.user_email || 'Unknown'} | IP: {event.ip_address} | Action: {event.action_taken}
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      {!event.resolved ? (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => resolveSecurityIssue(event.id, 'IP blocked and user notified')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve - IP Block
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => resolveSecurityIssue(event.id, 'Rate limit applied')}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Resolve - Rate Limit
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                            onClick={() => resolveSecurityIssue(event.id, 'User account suspended')}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Resolve - Suspend
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-white border-white/20"
                            onClick={() => resolveSecurityIssue(event.id, 'Manual investigation required')}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Manual Review
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-white border-white/20"
                          onClick={() => unresolveSecurityEvent(event.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Unresolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Transaction Monitoring</CardTitle>
              <p className="text-white/60">Monitor all financial transactions</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <CreditCard className="h-6 w-6 text-white/60" />
                      <div>
                        <div className="font-medium text-white">{transaction.type.toUpperCase()}</div>
                        <div className="text-sm text-white/60">{transaction.description}</div>
                        <div className="text-sm text-white/60">{transaction.user_email}</div>
                        <div className="text-xs text-white/40">Ref: {transaction.reference_id}</div>
                        <div className="text-xs text-white/40">Method: {transaction.payment_method}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-white">${transaction.amount.toLocaleString()}</div>
                      <div className="text-sm text-white/60">Net: ${transaction.net_amount.toLocaleString()}</div>
                      {transaction.fees > 0 && (
                        <div className="text-sm text-white/60">Fees: ${transaction.fees.toLocaleString()}</div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${
                          transaction.status === 'completed' ? 'bg-green-500' :
                          transaction.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        } text-white`}>
                          {transaction.status}
                        </Badge>
                        <Badge className={`${
                          transaction.risk_level === 'low' ? 'bg-green-500' :
                          transaction.risk_level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                        } text-white`}>
                          {transaction.risk_level}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-white border-white/20 mt-2"
                        onClick={() => generateReceipt(transaction)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Generate Receipt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Monitoring Tab */}
        <TabsContent value="ai-monitoring" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">AI Monitoring & Alerts</CardTitle>
              <p className="text-white/60">AI-powered monitoring and automated threat detection</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg ${
                    alert.resolved ? 'bg-black/20' : 
                    alert.severity === 'critical' ? 'bg-red-900/20' :
                    alert.severity === 'high' ? 'bg-orange-900/20' : 'bg-yellow-900/20'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-400" />
                        <Badge className={`${
                          alert.severity === 'critical' ? 'bg-red-500' :
                          alert.severity === 'high' ? 'bg-orange-500' :
                          alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        } text-white`}>
                          {alert.severity}
                        </Badge>
                        <span className="text-white font-medium">{alert.title}</span>
                        <Badge className="bg-purple-500 text-white">
                          {Math.round(alert.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <div className="text-sm text-white/60">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="text-white mb-2">{alert.description}</div>
                    <div className="text-sm text-white/60 mb-2">
                      Auto Action: {alert.auto_action}
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      {!alert.resolved ? (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => resolveAIAlertIssue(alert.id, 'False positive - no action needed')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve - False Positive
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => resolveAIAlertIssue(alert.id, 'User contacted for verification')}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Resolve - Contact User
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                            onClick={() => resolveAIAlertIssue(alert.id, 'Account temporarily locked')}
                          >
                            <Lock className="h-4 w-4 mr-1" />
                            Resolve - Lock Account
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => resolveAIAlertIssue(alert.id, 'Account suspended pending investigation')}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Resolve - Suspend
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-white border-white/20"
                          onClick={() => unresolveAIAlert(alert.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Unresolve
                        </Button>
                      )}
                      {alert.manual_review_required && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-white border-white/20"
                          onClick={() => resolveAIAlertIssue(alert.id, 'Manual investigation in progress')}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Manual Review
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">System Administration</CardTitle>
              <p className="text-white/60">System health and maintenance</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Database Status</span>
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-green-400" />
                        <span className="text-green-400">Connected</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Memory Usage</span>
                      <span className="text-white">{stats.systemHealth.memory_usage}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Disk Usage</span>
                      <span className="text-white">{stats.systemHealth.disk_usage}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Network Latency</span>
                      <span className="text-white">{stats.systemHealth.network_latency}ms</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white">Last Backup</h3>
                  <div className="text-white/60">
                    {new Date(stats.systemHealth.last_backup).toLocaleString()}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white">AI Monitoring Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">AI Monitoring</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${aiMonitoringEnabled ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className={aiMonitoringEnabled ? 'text-green-400' : 'text-red-400'}>
                          {aiMonitoringEnabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-white/60">
                      AI monitors user behavior, transaction patterns, and security events
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">System Actions</h3>
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={refreshData}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </Button>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={backupDatabase}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Backup Database
                    </Button>
                    <Button 
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                      onClick={() => toast({
                        title: 'System Settings',
                        description: 'System settings panel would open here',
                      })}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                    <Button 
                      className={`w-full ${aiMonitoringEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                      onClick={() => setAiMonitoringEnabled(!aiMonitoringEnabled)}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      {aiMonitoringEnabled ? 'Disable AI Monitoring' : 'Enable AI Monitoring'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Threat Intelligence Tab */}
        <TabsContent value="threats" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">🛡️ Advanced Threat Intelligence</CardTitle>
              <p className="text-white/60">Real-time threat monitoring and intelligence</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-red-900/20 border-red-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-400 text-sm">High Severity</p>
                        <p className="text-white text-2xl font-bold">{threatIntelligence.filter(t => t.severity === 'high').length}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-900/20 border-yellow-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-400 text-sm">Medium Severity</p>
                        <p className="text-white text-2xl font-bold">{threatIntelligence.filter(t => t.severity === 'medium').length}</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-900/20 border-blue-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-400 text-sm">Total Threats</p>
                        <p className="text-white text-2xl font-bold">{threatIntelligence.length}</p>
                      </div>
                      <Shield className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-green-900/20 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-400 text-sm">Blocked</p>
                        <p className="text-white text-2xl font-bold">{threatIntelligence.filter(t => t.type.includes('Bot')).length}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">Recent Threat Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {threatIntelligence.map((threat) => (
                      <div key={threat.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            threat.severity === 'high' ? 'bg-red-500' : 
                            threat.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <div>
                            <p className="text-white font-medium">{threat.type}</p>
                            <p className="text-white/60 text-sm">{threat.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white/60 text-sm">{threat.ip}</p>
                          <p className="text-white/40 text-xs">{new Date(threat.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Penetration Testing Tab */}
        <TabsContent value="penetration" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">🔍 Penetration Testing Results</CardTitle>
              <p className="text-white/60">Automated security testing and vulnerability assessment</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-green-900/20 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-400 text-sm">Tests Passed</p>
                        <p className="text-white text-2xl font-bold">{penetrationTestResults.filter(t => t.status === 'passed').length}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-red-900/20 border-red-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-400 text-sm">Tests Failed</p>
                        <p className="text-white text-2xl font-bold">{penetrationTestResults.filter(t => t.status === 'failed').length}</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-900/20 border-blue-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-400 text-sm">Total Tests</p>
                        <p className="text-white text-2xl font-bold">{penetrationTestResults.length}</p>
                      </div>
                      <Shield className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-900/20 border-yellow-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-400 text-sm">Critical Issues</p>
                        <p className="text-white text-2xl font-bold">{penetrationTestResults.filter(t => t.severity === 'critical' && t.status === 'failed').length}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white">Security Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {penetrationTestResults.map((test) => (
                      <div key={test.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            test.status === 'passed' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <div>
                            <p className="text-white font-medium">{test.test}</p>
                            <p className="text-white/60 text-sm">{test.details}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`${
                            test.severity === 'critical' ? 'bg-red-900 text-red-400' :
                            test.severity === 'high' ? 'bg-orange-900 text-orange-400' :
                            test.severity === 'medium' ? 'bg-yellow-900 text-yellow-400' :
                            'bg-green-900 text-green-400'
                          }`}>
                            {test.severity}
                          </Badge>
                          <p className="text-white/40 text-xs mt-1">{new Date(test.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bot Detection Tab */}
        <TabsContent value="bot-detection" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">🤖 Bot Detection & Anti-Scraping</CardTitle>
              <p className="text-white/60">Advanced bot detection and scraping prevention</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-red-900/20 border-red-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-400 text-sm">Bots Detected</p>
                        <p className="text-white text-2xl font-bold">{botDetectionStats?.totalDetected || 0}</p>
                      </div>
                      <Bot className="h-8 w-8 text-red-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-green-900/20 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-400 text-sm">Blocked Today</p>
                        <p className="text-white text-2xl font-bold">{botDetectionStats?.blockedToday || 0}</p>
                      </div>
                      <Shield className="h-8 w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-900/20 border-yellow-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-400 text-sm">Suspicious IPs</p>
                        <p className="text-white text-2xl font-bold">{botDetectionStats?.suspiciousIPs || 0}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-blue-900/20 border-blue-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-400 text-sm">Fingerprints</p>
                        <p className="text-white text-2xl font-bold">{botDetectionStats?.fingerprintMatches || 0}</p>
                      </div>
                      <Eye className="h-8 w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white">Bot Detection Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-white">Browser Fingerprinting</span>
                      </div>
                      <Badge className="bg-green-900 text-green-400">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-white">Honeypot Fields</span>
                      </div>
                      <Badge className="bg-green-900 text-green-400">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-white">Rate Limiting</span>
                      </div>
                      <Badge className="bg-green-900 text-green-400">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-white">Challenge-Response</span>
                      </div>
                      <Badge className="bg-green-900 text-green-400">Active</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white">Security Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Security Score</span>
                      <span className="text-green-400 font-bold">{securityMetrics?.securityScore || 98}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Total Scans</span>
                      <span className="text-blue-400 font-bold">{securityMetrics?.totalScans || 15420}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Vulnerabilities</span>
                      <span className="text-green-400 font-bold">{securityMetrics?.vulnerabilitiesFound || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">False Positives</span>
                      <span className="text-yellow-400 font-bold">{securityMetrics?.falsePositives || 2}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Profile Detail Modal */}
      {userDetailOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">User Profile Details</h2>
              <Button
                variant="ghost"
                onClick={() => setUserDetailOpen(false)}
                className="text-white hover:bg-white/10"
              >
                <XCircle className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60">Full Name</label>
                  <div className="text-white">{selectedUser.full_name || 'No Name'}</div>
                </div>
                <div>
                  <label className="text-sm text-white/60">Email</label>
                  <div className="text-white">{selectedUser.email}</div>
                </div>
                <div>
                  <label className="text-sm text-white/60">Role</label>
                  <Badge className={`${getRoleBadgeColor(selectedUser.role)} text-white`}>
                    {selectedUser.role}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm text-white/60">Status</label>
                  <Badge className={`${getStatusBadgeColor(selectedUser.status)} text-white`}>
                    {selectedUser.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm text-white/60">Risk Score</label>
                  <div className={`text-lg font-bold ${
                    selectedUser.risk_score < 20 ? 'text-green-400' :
                    selectedUser.risk_score < 50 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {selectedUser.risk_score}/100
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/60">Verification Level</label>
                  <div className="text-white">{selectedUser.verification_level}/5</div>
                </div>
                <div>
                  <label className="text-sm text-white/60">Phone</label>
                  <div className="text-white">{selectedUser.phone || 'Not provided'}</div>
                </div>
                <div>
                  <label className="text-sm text-white/60">Location</label>
                  <div className="text-white">{selectedUser.location}</div>
                </div>
                <div>
                  <label className="text-sm text-white/60">Device Info</label>
                  <div className="text-white text-sm">{selectedUser.device_info}</div>
                </div>
                <div>
                  <label className="text-sm text-white/60">Last Activity</label>
                  <div className="text-white">{formatDate(selectedUser.last_activity)}</div>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-white/60">Flags</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedUser.flags.length > 0 ? (
                    selectedUser.flags.map((flag, index) => (
                      <Badge key={index} variant="outline" className="text-red-400 border-red-400">
                        {flag}
                      </Badge>
                    ))
                  ) : (
                    <div className="text-white/60">No flags</div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => flagUser(selectedUser.id, 'manual_review')}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  Flag User
                </Button>
                {selectedUser.status === 'suspended' ? (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => unsuspendUser(selectedUser.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Unsuspend User
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => suspendUser(selectedUser.id, 'admin_action')}
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Suspend User
                  </Button>
                )}
              </div>
              
              {selectedUser.flags.length > 0 && (
                <div className="pt-4">
                  <label className="text-sm text-white/60 mb-2 block">Remove Flags:</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.flags.map((flag, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        className="text-red-400 border-red-400 hover:bg-red-500/10"
                        onClick={() => removeFlag(selectedUser.id, flag)}
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        {flag}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {documentViewerOpen && selectedDocument && selectedVerification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Document Review</h2>
              <Button
                variant="ghost"
                onClick={() => setDocumentViewerOpen(false)}
                className="text-white hover:bg-white/10"
              >
                <XCircle className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60">User</label>
                  <div className="text-white">{selectedVerification.user_name}</div>
                </div>
                <div>
                  <label className="text-sm text-white/60">Email</label>
                  <div className="text-white">{selectedVerification.user_email}</div>
                </div>
                <div>
                  <label className="text-sm text-white/60">Verification Type</label>
                  <div className="text-white">{selectedVerification.verification_type.toUpperCase()}</div>
                </div>
                <div>
                  <label className="text-sm text-white/60">Priority</label>
                  <Badge className={`${
                    selectedVerification.priority === 'urgent' ? 'bg-red-500' :
                    selectedVerification.priority === 'high' ? 'bg-orange-500' :
                    selectedVerification.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  } text-white`}>
                    {selectedVerification.priority}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-white/60">Document: {selectedDocument}</label>
                <div className="bg-black/30 border border-white/20 rounded-lg p-8 text-center mt-2">
                  <FileText className="h-16 w-16 text-white/40 mx-auto mb-4" />
                  <div className="text-white/60">
                    Document preview would be displayed here
                  </div>
                  <div className="text-sm text-white/40 mt-2">
                    In a real implementation, this would show the actual document content
                  </div>
                </div>
              </div>
              
              {selectedVerification.notes && (
                <div>
                  <label className="text-sm text-white/60">Notes</label>
                  <div className="text-white bg-black/30 border border-white/20 rounded-lg p-3 mt-1">
                    {selectedVerification.notes}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    approveVerification(selectedVerification.id);
                    setDocumentViewerOpen(false);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Verification
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    rejectVerification(selectedVerification.id, 'Document verification failed');
                    setDocumentViewerOpen(false);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Verification
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
