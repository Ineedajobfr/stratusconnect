import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, Users, CheckCircle, AlertTriangle, UserCheck, FileText, Clock, 
  Globe, Eye, X, Gavel, BarChart3, Lock, ChevronRight, Bot, Search, 
  Filter, Download, Settings, Activity, Database, Server, Zap, TrendingUp, 
  TrendingDown, AlertCircle, UserX, UserPlus, Mail, Phone, MapPin, Calendar, 
  DollarSign, Plane, Building2, Briefcase, RefreshCw, Ban, CheckSquare, 
  Square, AlertOctagon, FileCheck, FileX, CreditCard, Receipt, MessageSquare,
  Send, Bell, Edit, Trash2, Plus, Minus, ArrowUpDown, Target, PieChart
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";
import { AdminDatabase, AdminUser, Deal, SecurityEvent, CommissionRule, SystemSettings } from "@/lib/admin-database";
import { broadcastService } from "@/lib/broadcast-service";
import { disputeService } from "@/lib/dispute-service-real";
import { aiMonitoringService } from "@/lib/ai-monitoring-service-real";
import AdminTest from "@/components/AdminTest";
import AdminCharts from "@/components/admin/AdminCharts";
import UserDetailsModal from "@/components/admin/UserDetailsModal";

const AdminTerminal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Data states
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings[]>([]);
  const [systemStats, setSystemStats] = useState<any>({});
  const [broadcastMessages, setBroadcastMessages] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<any[]>([]);
  const [aiMonitors, setAiMonitors] = useState<any[]>([]);

  // Filters
  const [userFilters, setUserFilters] = useState({
    role: '',
    status: '',
    verification_status: ''
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        AdminDatabase.getAllUsers(),
        AdminDatabase.getAllDeals(),
        AdminDatabase.getSecurityEvents(50),
        AdminDatabase.getCommissionRules(),
        AdminDatabase.getSystemSettings(),
        AdminDatabase.getSystemStats(),
        broadcastService.getBroadcastMessages(),
        disputeService.getDisputes(),
        aiMonitoringService.getFraudAlerts(),
        aiMonitoringService.getMonitors()
      ]);

      // Process results - use data if successful, empty array if failed
      const [
        usersResult,
        dealsResult,
        securityResult,
        commissionResult,
        settingsResult,
        statsResult,
        broadcastResult,
        disputesResult,
        fraudResult,
        monitorsResult
      ] = results;

      setUsers(usersResult.status === 'fulfilled' ? usersResult.value : []);
      setDeals(dealsResult.status === 'fulfilled' ? dealsResult.value : []);
      setSecurityEvents(securityResult.status === 'fulfilled' ? securityResult.value : []);
      setCommissionRules(commissionResult.status === 'fulfilled' ? commissionResult.value : []);
      setSystemSettings(settingsResult.status === 'fulfilled' ? settingsResult.value : []);
      setSystemStats(statsResult.status === 'fulfilled' ? statsResult.value : {});
      setBroadcastMessages(broadcastResult.status === 'fulfilled' ? broadcastResult.value : []);
      setDisputes(disputesResult.status === 'fulfilled' ? disputesResult.value : []);
      setFraudAlerts(fraudResult.status === 'fulfilled' ? fraudResult.value : []);
      setAiMonitors(monitorsResult.status === 'fulfilled' ? monitorsResult.value : []);

      // Log any errors for debugging
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const serviceNames = [
            'getAllUsers', 'getAllDeals', 'getSecurityEvents', 'getCommissionRules',
            'getSystemSettings', 'getSystemStats', 'getBroadcastMessages', 
            'getDisputes', 'getFraudAlerts', 'getMonitors'
          ];
          console.error(`Error loading ${serviceNames[index]}:`, result.reason);
        }
      });

    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
          setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'approve' | 'reject' | 'suspend' | 'activate', notes?: string) => {
    try {
      setIsProcessing(true);
      const status = action === 'approve' ? 'approved' : 
                   action === 'reject' ? 'rejected' :
                   action === 'suspend' ? 'suspended' : 'approved';
      
      await AdminDatabase.updateUserStatus(userId, status, notes);
      await loadAllData(); // Refresh data
      
      // Show success message
      console.log(`User ${action}ed successfully`);
      } catch (error) {
      console.error('Error updating user:', error);
      alert(`Error ${action}ing user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDealAction = async (dealId: string, action: 'force_close' | 'dispute', reason: string) => {
    try {
      if (action === 'force_close') {
        await AdminDatabase.forceCloseDeal(dealId, reason);
            } else {
        await AdminDatabase.updateDealStatus(dealId, 'disputed', reason);
      }
      await loadAllData();
    } catch (error) {
      console.error('Error updating deal:', error);
    }
  };

  const handleCommissionUpdate = async (ruleId: string, updates: Partial<CommissionRule>) => {
    try {
      await AdminDatabase.updateCommissionRule(ruleId, updates);
      await loadAllData();
    } catch (error) {
      console.error('Error updating commission rule:', error);
    }
  };

  const handleSanctionsCheck = async (userId: string) => {
    try {
      const result = await AdminDatabase.checkSanctions(userId);
      await loadAllData();
      return result;
    } catch (error) {
      console.error('Error checking sanctions:', error);
    }
  };

  const handleUserUpdate = async (userId: string, updates: any) => {
    try {
      setIsProcessing(true);
      // Update user in database
      await AdminDatabase.updateUserStatus(userId, updates.status || 'approved', updates.admin_notes);
      await loadAllData();
      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      alert(`Error updating user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBroadcastMessage = async () => {
    try {
      setIsProcessing(true);
      // Create a test broadcast message
      await broadcastService.createBroadcast({
        title: 'System Update',
        content: 'The system has been updated with new features.',
        target_roles: ['broker', 'operator', 'pilot', 'crew'],
        message_type: 'info',
        priority: 'medium',
        created_by: user?.id || 'admin'
      });
      await loadAllData();
      console.log('Broadcast message created successfully');
    } catch (error) {
      console.error('Error creating broadcast:', error);
      alert(`Error creating broadcast: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !userFilters.role || user.role === userFilters.role;
    const matchesStatus = !userFilters.status || user.status === userFilters.status;
    const matchesVerification = !userFilters.verification_status || user.verification_status === userFilters.verification_status;
    
    return matchesSearch && matchesRole && matchesStatus && matchesVerification;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-app relative overflow-hidden">
        <StarfieldRunwayBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground text-lg">Loading Admin Console...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app relative overflow-hidden">
      <StarfieldRunwayBackground />
      
      {/* Header */}
      <div className="relative z-10 border-b border-terminal-border bg-terminal-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Console</h1>
                <p className="text-muted-foreground">System administration and user management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-data-positive text-sm">
                <div className="w-2 h-2 bg-data-positive rounded-full animate-pulse"></div>
                <span className="font-mono">ALL SYSTEMS OPERATIONAL</span>
              </div>
        <Button
          variant="outline"
          size="sm"
                onClick={() => navigate('/')}
          className="btn-terminal-secondary"
        >
          <X className="w-4 h-4 mr-2" />
          Close
        </Button>
      </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-10 bg-terminal-card border-terminal-border">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-accent/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-accent/20">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="deals" className="data-[state=active]:bg-accent/20">
              <Plane className="w-4 h-4 mr-2" />
              Deals
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-accent/20">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="financial" className="data-[state=active]:bg-accent/20">
              <DollarSign className="w-4 h-4 mr-2" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-accent/20">
              <FileCheck className="w-4 h-4 mr-2" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="communications" className="data-[state=active]:bg-accent/20">
              <MessageSquare className="w-4 h-4 mr-2" />
              Comm
            </TabsTrigger>
            <TabsTrigger value="disputes" className="data-[state=active]:bg-accent/20">
              <Gavel className="w-4 h-4 mr-2" />
              Disputes
            </TabsTrigger>
            <TabsTrigger value="ai-monitoring" className="data-[state=active]:bg-accent/20">
              <Bot className="w-4 h-4 mr-2" />
              AI Monitor
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-accent/20">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="terminal-card">
                <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-3xl font-bold text-foreground">{systemStats.totalUsers || 0}</p>
            </div>
                    <Users className="w-8 h-8 text-accent" />
              </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-data-positive mr-1" />
                    <span className="text-sm text-data-positive">+{systemStats.activeUsers || 0} active</span>
              </div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                      <p className="text-3xl font-bold text-foreground">{systemStats.pendingApprovals || 0}</p>
            </div>
                    <Clock className="w-8 h-8 text-terminal-warning" />
          </div>
                  <div className="flex items-center mt-2">
                    <AlertCircle className="w-4 h-4 text-terminal-warning mr-1" />
                    <span className="text-sm text-terminal-warning">Requires review</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <p className="text-3xl font-bold text-foreground">${(systemStats.totalRevenue || 0).toLocaleString()}</p>
          </div>
                    <DollarSign className="w-8 h-8 text-data-positive" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-data-positive mr-1" />
                    <span className="text-sm text-data-positive">${(systemStats.totalCommission || 0).toLocaleString()} commission</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
                      <p className="text-sm font-medium text-muted-foreground">Security Events</p>
                      <p className="text-3xl font-bold text-foreground">{systemStats.securityEvents || 0}</p>
                    </div>
                    <Shield className="w-8 h-8 text-terminal-danger" />
                  </div>
                  <div className="flex items-center mt-2">
                    <AlertTriangle className="w-4 h-4 text-terminal-warning mr-1" />
                    <span className="text-sm text-terminal-warning">{systemStats.unresolvedSecurity || 0} unresolved</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Security Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securityEvents.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-terminal-card/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            event.severity === 'critical' ? 'bg-terminal-danger' :
                            event.severity === 'high' ? 'bg-terminal-warning' :
                            event.severity === 'medium' ? 'bg-terminal-info' : 'bg-data-positive'
                          }`}></div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{event.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.user_id && `User: ${event.user_id}`}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">System Uptime</span>
                      <span className="text-2xl font-bold text-data-positive">{systemStats.systemUptime || '99.97%'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg Response Time</span>
                      <span className="text-lg font-semibold text-data-positive">{systemStats.avgResponseTime || '47ms'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Deals</span>
                      <span className="text-lg font-semibold text-foreground">{systemStats.totalDeals || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Completed Deals</span>
                      <span className="text-lg font-semibold text-data-positive">{systemStats.completedDeals || 0}</span>
              </div>
              </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Charts */}
            <AdminCharts 
              systemStats={systemStats}
              users={users}
              deals={deals}
              securityEvents={securityEvents}
            />

            {/* Quick Actions */}
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={handleBroadcastMessage}
                    disabled={isProcessing}
                    className="btn-terminal-accent h-20 flex-col space-y-2"
                  >
                    <Send className="w-6 h-6" />
                    <span>Send Broadcast</span>
                </Button>
                  <Button 
                    onClick={() => setShowBroadcastModal(true)}
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                  >
                    <MessageSquare className="w-6 h-6" />
                    <span>New Message</span>
                  </Button>
                  <Button 
                    onClick={() => setShowDisputeModal(true)}
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                  >
                    <Gavel className="w-6 h-6" />
                    <span>Resolve Dispute</span>
                  </Button>
                  <Button 
                    onClick={loadAllData}
                    disabled={isProcessing}
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                  >
                    <RefreshCw className={`w-6 h-6 ${isProcessing ? 'animate-spin' : ''}`} />
                    <span>Refresh Data</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Admin System Test */}
            <AdminTest />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="terminal-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <p className="text-sm text-muted-foreground">Manage user accounts, roles, and verification status</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
            />
              </div>
                    <Select value={userFilters.role} onValueChange={(value) => setUserFilters({...userFilters, role: value})}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Roles</SelectItem>
                        <SelectItem value="broker">Broker</SelectItem>
                        <SelectItem value="operator">Operator</SelectItem>
                        <SelectItem value="pilot">Pilot</SelectItem>
                        <SelectItem value="crew">Crew</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={userFilters.status} onValueChange={(value) => setUserFilters({...userFilters, status: value})}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={loadAllData}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
        </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-terminal-card/50 rounded-lg border border-terminal-border">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{user.full_name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                              {user.role}
                            </Badge>
                            <Badge variant={
                              user.status === 'approved' ? 'default' :
                              user.status === 'pending' ? 'secondary' :
                              user.status === 'suspended' ? 'destructive' : 'outline'
                            }>
                              {user.status}
                            </Badge>
                            <Badge variant={user.sanctions_match ? 'destructive' : 'outline'}>
                              {user.sanctions_match ? 'SANCTIONS MATCH' : 'CLEAR'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUserAction(user.id, 'approve')}
                              className="bg-data-positive hover:bg-data-positive/90"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction(user.id, 'reject')}
                              className="border-terminal-danger text-terminal-danger hover:bg-terminal-danger/10"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {user.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'suspend')}
                            className="border-terminal-warning text-terminal-warning hover:bg-terminal-warning/10"
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Suspend
                          </Button>
                        )}
                        {user.status === 'suspended' && (
                          <Button
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'activate')}
                            className="bg-data-positive hover:bg-data-positive/90"
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Activate
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSanctionsCheck(user.id)}
                        >
                          <Shield className="w-4 h-4 mr-1" />
                          Check
                        </Button>
                      </div>
                    </div>
                ))}
              </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deals Tab */}
          <TabsContent value="deals" className="space-y-6">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle>Deal Management</CardTitle>
                <p className="text-sm text-muted-foreground">Monitor and manage all platform deals</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deals.map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-4 bg-terminal-card/50 rounded-lg border border-terminal-border">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                          <Plane className="w-5 h-5 text-accent" />
        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">Deal #{deal.id.slice(0, 8)}</h3>
                          <p className="text-sm text-muted-foreground">{deal.route}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={
                              deal.status === 'completed' ? 'default' :
                              deal.status === 'in_progress' ? 'secondary' :
                              deal.status === 'disputed' ? 'destructive' : 'outline'
                            }>
                              {deal.status}
                            </Badge>
                            <span className="text-sm text-foreground">${deal.quote_amount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedDeal(deal)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {deal.status !== 'completed' && deal.status !== 'cancelled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDealAction(deal.id, 'force_close', 'Admin intervention')}
                            className="border-terminal-danger text-terminal-danger hover:bg-terminal-danger/10"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Force Close
                          </Button>
          )}
        </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
          <Card className="terminal-card">
            <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                  {securityEvents.map((event) => (
                    <div key={event.id} className={`p-4 rounded-lg border ${
                      event.severity === 'critical' ? 'border-terminal-danger bg-terminal-danger/10' :
                      event.severity === 'high' ? 'border-terminal-warning bg-terminal-warning/10' :
                      event.severity === 'medium' ? 'border-terminal-info bg-terminal-info/10' :
                      'border-terminal-border bg-terminal-card/50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            event.severity === 'critical' ? 'bg-terminal-danger' :
                            event.severity === 'high' ? 'bg-terminal-warning' :
                            event.severity === 'medium' ? 'bg-terminal-info' : 'bg-data-positive'
                          }`}></div>
                          <div>
                            <p className="font-medium text-foreground">{event.message}</p>
                            <p className="text-sm text-muted-foreground">
                              {event.user_id && `User: ${event.user_id}`}
                              {event.ip_address && ` • IP: ${event.ip_address}`}
                            </p>
                  </div>
                </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            event.severity === 'critical' ? 'destructive' :
                            event.severity === 'high' ? 'secondary' :
                            event.severity === 'medium' ? 'outline' : 'default'
                          }>
                            {event.severity}
                          </Badge>
                          {!event.resolved && (
                            <Button
                              size="sm"
                              onClick={() => AdminDatabase.resolveSecurityEvent(event.id, user?.email || 'admin')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Resolve
                            </Button>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.created_at).toLocaleString()}
                          </span>
                  </div>
                </div>
                  </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle>Commission Management</CardTitle>
                <p className="text-sm text-muted-foreground">Manage platform commission rates and rules</p>
              </CardHeader>
              <CardContent>
              <div className="space-y-4">
                  {commissionRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-4 bg-terminal-card/50 rounded-lg border border-terminal-border">
                        <div>
                        <h3 className="font-semibold text-foreground">{rule.role} - {rule.transaction_type}</h3>
                        <p className="text-sm text-muted-foreground">
                          Rate: {rule.rate_percentage}%
                          {rule.minimum_amount && ` • Min: $${rule.minimum_amount}`}
                          {rule.maximum_amount && ` • Max: $${rule.maximum_amount}`}
                        </p>
                        </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={rule.rate_percentage}
                          onChange={(e) => handleCommissionUpdate(rule.id, { rate_percentage: parseFloat(e.target.value) })}
                          className="w-20"
                        />
                        <Switch
                          checked={rule.active}
                          onCheckedChange={(checked) => handleCommissionUpdate(rule.id, { active: checked })}
                        />
                      </div>
                    </div>
                  ))}
        </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
          <Card className="terminal-card">
            <CardHeader>
                <CardTitle>KYC/AML Compliance</CardTitle>
                <p className="text-sm text-muted-foreground">Manage user verification and compliance</p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-terminal-card/50 rounded-lg">
                    <FileCheck className="w-8 h-8 text-data-positive mx-auto mb-2" />
                    <h3 className="font-semibold text-foreground">Documents Pending</h3>
                    <p className="text-2xl font-bold text-terminal-warning">
                      {users.filter(u => u.kyc_status === 'pending').length}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-terminal-card/50 rounded-lg">
                    <Shield className="w-8 h-8 text-terminal-danger mx-auto mb-2" />
                    <h3 className="font-semibold text-foreground">Sanctions Matches</h3>
                    <p className="text-2xl font-bold text-terminal-danger">
                      {users.filter(u => u.sanctions_match).length}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-terminal-card/50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-data-positive mx-auto mb-2" />
                    <h3 className="font-semibold text-foreground">Verified Users</h3>
                    <p className="text-2xl font-bold text-data-positive">
                      {users.filter(u => u.verification_status === 'approved').length}
                    </p>
                </div>
              </div>
            </CardContent>
          </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Revenue</span>
                      <span className="text-2xl font-bold text-data-positive">
                        ${(systemStats.totalRevenue || 0).toLocaleString()}
                      </span>
        </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Platform Commission</span>
                      <span className="text-xl font-semibold text-foreground">
                        ${(systemStats.totalCommission || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg Deal Value</span>
                      <span className="text-lg font-semibold text-foreground">
                        ${Math.round((systemStats.totalRevenue || 0) / Math.max(systemStats.totalDeals || 1, 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle>User Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Users</span>
                      <span className="text-2xl font-bold text-data-positive">{systemStats.activeUsers || 0}</span>
        </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pending Approvals</span>
                      <span className="text-xl font-semibold text-terminal-warning">{systemStats.pendingApprovals || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Completion Rate</span>
                      <span className="text-lg font-semibold text-data-positive">
                        {Math.round(((systemStats.completedDeals || 0) / Math.max(systemStats.totalDeals || 1, 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <Card className="terminal-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Broadcast Messages</CardTitle>
                    <p className="text-sm text-muted-foreground">Send system-wide notifications and updates</p>
        </div>
                  <Button className="btn-terminal-accent">
                    <Send className="w-4 h-4 mr-2" />
                    New Message
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {broadcastMessages.map((message) => (
                    <div key={message.id} className="flex items-center justify-between p-4 bg-terminal-card/50 rounded-lg border border-terminal-border">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          message.message_type === 'critical' ? 'bg-terminal-danger' :
                          message.message_type === 'warning' ? 'bg-terminal-warning' :
                          message.message_type === 'info' ? 'bg-terminal-info' : 'bg-data-positive'
                        }`}></div>
                        <div>
                          <h3 className="font-semibold text-foreground">{message.title}</h3>
                          <p className="text-sm text-muted-foreground">{message.content}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {message.message_type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {message.total_recipients} recipients
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleString()}
                        </span>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes" className="space-y-6">
            <Card className="terminal-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Dispute Resolution</CardTitle>
                    <p className="text-sm text-muted-foreground">Manage and resolve user disputes</p>
        </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-terminal-warning/20 text-terminal-warning">
                      {disputes.filter(d => d.status === 'open').length} Open
                    </Badge>
                    <Badge variant="outline" className="bg-terminal-danger/20 text-terminal-danger">
                      {disputes.filter(d => d.priority === 'urgent').length} Urgent
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
              <div className="space-y-4">
                  {disputes.map((dispute) => (
                    <div key={dispute.id} className="flex items-center justify-between p-4 bg-terminal-card/50 rounded-lg border border-terminal-border">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          dispute.priority === 'urgent' ? 'bg-terminal-danger' :
                          dispute.priority === 'high' ? 'bg-terminal-warning' :
                          dispute.priority === 'medium' ? 'bg-terminal-info' : 'bg-data-positive'
                        }`}></div>
                        <div>
                          <h3 className="font-semibold text-foreground">{dispute.subject}</h3>
                          <p className="text-sm text-muted-foreground">{dispute.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {dispute.dispute_type}
                            </Badge>
                            <Badge variant={
                              dispute.status === 'open' ? 'destructive' :
                              dispute.status === 'investigating' ? 'secondary' :
                              dispute.status === 'resolved' ? 'default' : 'outline'
                            } className="text-xs">
                              {dispute.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(dispute.created_at).toLocaleString()}
                        </span>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Gavel className="w-4 h-4" />
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
            <Card className="terminal-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Bot className="w-5 h-5 mr-2" />
                      AI Monitoring & Fraud Detection
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Intelligent monitoring and anomaly detection</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-terminal-danger/20 text-terminal-danger">
                      {fraudAlerts.filter(a => a.status === 'new').length} New Alerts
                    </Badge>
                    <Badge variant="outline" className="bg-terminal-info/20 text-terminal-info">
                      {aiMonitors.filter(m => m.status === 'active').length} Active Monitors
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
        <div className="space-y-6">
                  {/* Fraud Alerts */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Recent Fraud Alerts</h3>
                    <div className="space-y-3">
                      {fraudAlerts.slice(0, 5).map((alert) => (
                        <div key={alert.id} className={`p-3 rounded-lg border ${
                          alert.severity === 'critical' ? 'border-terminal-danger bg-terminal-danger/10' :
                          alert.severity === 'high' ? 'border-terminal-warning bg-terminal-warning/10' :
                          alert.severity === 'medium' ? 'border-terminal-info bg-terminal-info/10' :
                          'border-terminal-border bg-terminal-card/50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">{alert.description}</p>
                              <p className="text-sm text-muted-foreground">
                                Confidence: {Math.round(alert.confidence_score * 100)}%
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                {alert.indicators.map((indicator, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {indicator}
                                  </Badge>
                                ))}
        </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={
                                alert.status === 'new' ? 'destructive' :
                                alert.status === 'investigating' ? 'secondary' :
                                'default'
                              } className="text-xs">
                                {alert.status}
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
        </div>

                  {/* AI Monitors */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Active Monitors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiMonitors.map((monitor) => (
                        <div key={monitor.id} className="p-4 bg-terminal-card/50 rounded-lg border border-terminal-border">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-foreground">{monitor.name}</h4>
                            <Badge variant={
                              monitor.status === 'active' ? 'default' :
                              monitor.status === 'error' ? 'destructive' : 'secondary'
                            } className="text-xs">
                              {monitor.status}
                            </Badge>
        </div>
                          <p className="text-sm text-muted-foreground mb-2">{monitor.type}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Threshold: {monitor.confidence_threshold * 100}%</span>
                            <span>Last run: {new Date(monitor.last_run).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
        </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
        <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Security Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Enable two-factor authentication</span>
                        <Switch defaultChecked />
        </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Require email verification</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Enable IP whitelisting</span>
                        <Switch />
                      </div>
                    </div>
        </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Feature Toggles</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Pilot Marketplace</span>
                        <Switch defaultChecked />
        </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Crew Marketplace</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Demo Mode</span>
                        <Switch />
        </div>
        </div>
        </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Maintenance Mode</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Enable maintenance mode</span>
                      <Switch />
        </div>
        </div>
              </div>
            </CardContent>
          </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onUpdate={handleUserUpdate}
        onAction={handleUserAction}
        isProcessing={isProcessing}
      />

      {/* Broadcast Modal Placeholder */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Create Broadcast Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Broadcast functionality coming soon...</p>
              <Button onClick={() => setShowBroadcastModal(false)} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
              </div>
      )}

      {/* Dispute Modal Placeholder */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Resolve Dispute</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Dispute resolution functionality coming soon...</p>
              <Button onClick={() => setShowDisputeModal(false)} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminTerminal;