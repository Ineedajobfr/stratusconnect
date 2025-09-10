import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TerminalLayout } from "@/components/TerminalLayout";
import { KPICard } from "@/components/KPICard";
import { Section } from "@/components/Section";
import { DataTile } from "@/components/DataTile";
import { AviationNews } from "@/components/AviationNews";
import { PrivacyOverlay } from "@/components/PrivacyOverlay";
import { AdminAnalytics } from "@/components/analytics/AdminAnalytics";
import FortressOfTrustDashboard from "@/components/FortressOfTrustDashboard";
import AuthForm from "@/components/AuthForm";
import { StrikeManagement } from "@/components/StrikeManagement";
import { CommissionCalculator } from "@/components/CommissionCalculator";
import { UserManagement } from "@/components/UserManagement";
import { AuditLogs } from "@/components/AuditLogs";
import { SecurityMonitor } from "@/components/SecurityMonitor";
import AdminSanctionsManagement from "@/components/AdminSanctionsManagement";
import { ContentEditor } from "@/components/ContentEditor";
import { 
  Shield,
  Users,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  FileText,
  Clock,
  Globe,
  Eye,
  X,
  Gavel,
  BarChart3,
  Lock,
  ChevronRight,
  Bot
} from "lucide-react";
import type { User } from '@supabase/supabase-js';

interface PendingUser {
  user_id: string;
  username: string;
  display_name?: string;
  platform_role?: string;
  created_at: string;
}

const AdminTerminal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    activeSessions: 0,
    flaggedAccounts: 0,
    systemUptime: "99.97%",
    securityScore: 94
  });
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);

  useEffect(() => {
    const location = window.location;
    const isBetaMode = location.pathname.startsWith('/beta/');
    
    const checkAuthAndRole = async () => {
      try {
        if (isBetaMode) {
          // Beta mode - create mock admin user
          setUser({
            id: 'beta-admin-user',
            email: 'beta.admin@stratusconnect.org',
            user_metadata: {
              full_name: 'Beta Admin',
              role: 'admin'
            },
            app_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
          } as Record<string, unknown>);
          setLoading(false);
          return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session?.user) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Check if user has admin role
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, email')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          setUser(null);
          setLoading(false);
          return;
        }

        // Only allow admin users, not demo users
        if (userData?.role === 'admin' && !session.user.email?.includes('demo')) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        setLoading(false);
      }
    };

    checkAuthAndRole();

    if (!isBetaMode) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            // Re-check role when auth state changes
            const { data: userData } = await supabase
              .from('users')
              .select('role, email')
              .eq('id', session.user.id)
              .single();

            if (userData?.role === 'admin' && !session.user.email?.includes('demo')) {
              setUser(session.user);
            } else {
              setUser(null);
            }
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchSystemData();
    }
  }, [user]);

  const fetchSystemData = async () => {
    try {
      // Fetch real user counts
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id');
      
      if (profilesError) throw profilesError;

      // Fetch security events
      const { data: securityEvents, error: securityError } = await supabase
        .from('security_events')
        .select('severity, resolved');
      
      if (securityError) throw securityError;

      // Fetch pending verification users
      const { data: pending, error: pendingError } = await supabase
        .from('profiles')
        .select('*')
        .limit(10);
      
      if (pendingError) throw pendingError;

      setSystemStats({
        totalUsers: profiles?.length || 0,
        pendingVerifications: 0,
        activeSessions: 0,
        flaggedAccounts: securityEvents?.filter(e => e.severity === 'high' && !e.resolved).length || 0,
        systemUptime: "99.97%",
        securityScore: 94
      });

      setPendingUsers((pending as Record<string, unknown>[]) || []);
    } catch (error) {
      console.error('Error fetching system data:', error);
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Shield },
    { id: "fortress", label: "Fortress of Trust", icon: Lock },
    { id: "ai-monitor", label: "AI System Monitor", icon: Bot },
    { id: "verification", label: "User Verification", icon: UserCheck },
    { id: "users", label: "User Management", icon: Users },
    { id: "strikes", label: "Strike Management", icon: Gavel },
    { id: "security", label: "Security Monitor", icon: Shield },
    { id: "audit", label: "Audit Logs", icon: FileText },
    { id: "commission", label: "Commission Center", icon: BarChart3 },
    { id: "content", label: "Content Manager", icon: FileText },
    { id: "news", label: "Aviation News", icon: Globe },
    { id: "analytics", label: "System Analytics", icon: Eye }
  ];

  const handleVerifyUser = async (userId: string, action: 'approve' | 'reject') => {
    try {
      console.log(`Pretend to ${action} user ${userId}`);
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    const isBetaMode = window.location.pathname.startsWith('/beta/');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-slate-300 mb-6">
            {isBetaMode 
              ? "Admin terminal in beta mode. This should have loaded automatically."
              : "This admin terminal requires verified administrator credentials. Demo users and regular accounts are not authorized."
            }
          </p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TerminalLayout 
      title="Admin Terminal"
      userRole="System Administrator"
      menuItems={menuItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      bannerText="The network lives on trust. Verify fast. Audit everything."
      terminalType="admin"
    >
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.history.back()}
          className="btn-terminal-secondary"
        >
          <X className="w-4 h-4 mr-2" />
          Close
        </Button>
      </div>

      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* System Status Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Fortress Command</h1>
              <p className="text-gunmetal mt-2">Comprehensive system administration and security oversight</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-data-positive text-sm">
                <div className="w-2 h-2 bg-data-positive rounded-full terminal-pulse"></div>
                <span className="font-mono">ALL SYSTEMS OPERATIONAL</span>
              </div>
              <div className="text-gunmetal text-sm font-mono">
                {new Date().toLocaleTimeString()} UTC
              </div>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Users"
              value={systemStats.totalUsers}
              delta="REGISTERED USERS"
              icon={Users}
              variant="info"
            />
            <KPICard
              title="Pending Verifications"
              value={systemStats.pendingVerifications}
              delta="REQUIRES REVIEW"
              icon={Clock}
              variant="warning"
            />
            <KPICard
              title="Security Score"
              value={`${systemStats.securityScore}%`}
              delta="EXCELLENT STATUS"
              icon={Shield}
              variant="success"
            />
            <KPICard
              title="Flagged Accounts"
              value={systemStats.flaggedAccounts}
              delta="NEEDS ATTENTION"
              icon={AlertTriangle}
              variant="danger"
            />
          </div>

          {/* Pending Users Section */}
          {pendingUsers.length > 0 && (
            <Section 
              title="Pending User Verifications"
              subtitle="Review and approve new user registrations"
              actions={
                <Button variant="outline" size="sm" className="btn-terminal-secondary">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Bulk Actions
                </Button>
              }
            >
              <div className="space-y-0">
                {pendingUsers.slice(0, 5).map((user) => (
                  <DataTile
                    key={user.user_id}
                    title={user.display_name || user.username}
                    subtitle={user.platform_role || 'Role not specified'}
                    status="Pending Review"
                    statusVariant="warning"
                    metadata={[
                      {
                        label: "Registered",
                        value: new Date(user.created_at).toLocaleDateString(),
                        icon: <Clock className="w-3 h-3" />
                      }
                    ]}
                    actions={[
                      { 
                        label: "Approve", 
                        onClick: () => handleVerifyUser(user.user_id, 'approve'),
                        variant: "default"
                      },
                      { 
                        label: "Reject", 
                        onClick: () => handleVerifyUser(user.user_id, 'reject'),
                        variant: "outline"
                      }
                    ]}
                  />
                ))}
              </div>
            </Section>
          )}
        </div>
      )}

      {activeTab === "fortress" && (
        <div className="space-y-6">
          <FortressOfTrustDashboard />
        </div>
      )}

      {activeTab === "verification" && (
        <div className="space-y-6">
          <AdminAnalytics section="verification" />
          <UserManagement />
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-6">
          <AdminAnalytics section="users" />
          <UserManagement />
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-6">
          <AdminAnalytics section="security" />
          <SecurityMonitor />
          <AdminSanctionsManagement />
        </div>
      )}

      {activeTab === "strikes" && (
        <div className="space-y-6">
          <StrikeManagement />
        </div>
      )}

      {activeTab === "audit" && (
        <div className="space-y-6">
          <AuditLogs />
        </div>
      )}

      {activeTab === "commission" && (
        <div className="space-y-6">
          <CommissionCalculator />
        </div>
      )}

      {activeTab === "content" && (
        <div className="space-y-6">
          <ContentEditor />
        </div>
      )}

      {activeTab === "news" && (
        <div className="space-y-6">
          <AviationNews />
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <AdminAnalytics section="analytics" />
          <Card className="terminal-card relative">
            <PrivacyOverlay
              title="Restricted Analytics"
              description="Advanced system analytics require elevated permissions. Please verify your administrator credentials."
              onUnlock={() => console.log('Unlock analytics')}
              icon="chart"
            />
            <CardHeader className="border-b border-terminal-border">
              <CardTitle className="terminal-subheader">System Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="p-12">
              <div className="text-center text-gunmetal">
                <Eye className="w-16 h-16 mx-auto mb-6 opacity-30" />
                <p className="terminal-subheader mb-2">Advanced Analytics</p>
                <p className="text-sm font-mono">
                  Comprehensive system performance and usage analytics
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </TerminalLayout>
  );
};

export default AdminTerminal;