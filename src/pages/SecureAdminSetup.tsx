import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Users, 
  Bot, 
  Settings, 
  Eye, 
  EyeOff, 
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Events } from "@/lib/events";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export default function SecureAdminSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    full_name: '',
    role: 'admin'
  });

  useEffect(() => {
    checkAdminAuthorization();
  }, [user]);

  const checkAdminAuthorization = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Check if current user is a super admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_super_admin')
        .eq('user_id', user.id)
        .single();

      if (profile?.is_super_admin || profile?.role === 'admin') {
        setIsAuthorized(true);
        loadAdminUsers();
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error('Error checking admin authorization:', error);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'broker', 'operator', 'pilot', 'crew'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminUsers(data || []);
    } catch (error) {
      console.error('Error loading admin users:', error);
      toast({
        title: "Error",
        description: "Failed to load admin users",
        variant: "destructive"
      });
    }
  };

  const createAdminUser = async () => {
    if (!newAdmin.email || !newAdmin.full_name) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newAdmin.email,
        password: generateSecurePassword(),
        email_confirm: true
      });

      if (authError) throw authError;

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          email: newAdmin.email,
          full_name: newAdmin.full_name,
          role: newAdmin.role,
          is_active: true,
          is_verified: true
        });

      if (profileError) throw profileError;

      // Emit admin creation event
      Events.emitEvent('admin.user_created', {
        adminId: user?.id,
        newUserId: authData.user.id,
        role: newAdmin.role
      }, { severity: 'high' });

      toast({
        title: "Success",
        description: "Admin user created successfully",
      });

      setNewAdmin({ email: '', full_name: '', role: 'admin' });
      loadAdminUsers();
    } catch (error) {
      console.error('Error creating admin user:', error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to create admin user",
        variant: "destructive"
      });
    }
  };

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const deactivateUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('user_id', userId);

      if (error) throw error;

      // Emit deactivation event
      Events.emitEvent('admin.user_deactivated', {
        adminId: user?.id,
        targetUserId: userId
      }, { severity: 'high' });

      toast({
        title: "Success",
        description: "User deactivated successfully",
      });

      loadAdminUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate user",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
        <div className="text-white">Checking authorization...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You must be logged in to access admin functions.
            </p>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access admin functions.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-bg p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Management</h1>
          <p className="text-gunmetal">
            Manage platform users and AI system
          </p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="ai">AI System</TabsTrigger>
            <TabsTrigger value="settings">Platform Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Create New Admin User
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="admin@stratusconnect.org"
                    />
                  </div>
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={newAdmin.full_name}
                      onChange={(e) => setNewAdmin(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={newAdmin.role}
                      onChange={(e) => setNewAdmin(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="admin">Admin</option>
                      <option value="broker">Broker</option>
                      <option value="operator">Operator</option>
                      <option value="pilot">Pilot</option>
                      <option value="crew">Crew</option>
                    </select>
                  </div>
                </div>
                <Button onClick={createAdminUser} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Admin User
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminUsers.map((adminUser) => (
                    <div key={adminUser.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                          <Shield className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <div className="font-medium">{adminUser.full_name}</div>
                          <div className="text-sm text-gunmetal">{adminUser.email}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={adminUser.is_active ? "default" : "secondary"}>
                              {adminUser.role}
                            </Badge>
                            {adminUser.is_active ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePasswordVisibility(adminUser.id)}
                        >
                          {showPasswords[adminUser.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deactivateUser(adminUser.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI System Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    AI agents are running 24/7. Monitor their activity and manage their behavior.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={() => navigate('/admin/ai-reports')} className="h-20">
                    <div className="text-center">
                      <Bot className="h-6 w-6 mx-auto mb-2" />
                      <div>View AI Reports</div>
                      <div className="text-xs opacity-70">Real-time monitoring</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="h-20">
                    <div className="text-center">
                      <Settings className="h-6 w-6 mx-auto mb-2" />
                      <div>AI Settings</div>
                      <div className="text-xs opacity-70">Configure agents</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Platform Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Platform configuration and maintenance tools will be available here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}