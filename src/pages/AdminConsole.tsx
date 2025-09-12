import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Shield, Users, Activity, AlertTriangle, Search, Lock } from "lucide-react";
import AuthForm from "@/components/AuthForm";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";

interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  verification_status: string;
  created_at: string;
  last_sign_in_at?: string;
}

export default function AdminConsole() {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAuthForm, setShowAuthForm] = useState(false);

  // Check if user is admin  
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (user && !isAdmin) {
      // Non-admin users should not access this page
      return;
    }
    
    if (user && isAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user, isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) throw error;

      const adminUsers = data.users.map(user => ({
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name,
        role: user.user_metadata?.role || 'user',
        verification_status: user.user_metadata?.verification_status || 'pending',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at
      }));

      setUsers(adminUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          verification_status: status
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `User status updated to ${status}`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-accent">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: "bg-accent hover:bg-accent/80",
      broker: "bg-accent hover:bg-accent/80", 
      operator: "bg-accent hover:bg-accent/80",
      crew: "bg-accent hover:bg-accent/80",
      pilot: "bg-accent hover:bg-accent/80"
    };
    
    return (
      <Badge className={colors[role as keyof typeof colors] || "bg-accent hover:bg-accent/80"}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show auth form if not authenticated
  if (!user) {
    return (
      <div className="relative min-h-screen bg-slate-900">
        <StarfieldRunwayBackground intensity={0.5} starCount={200} />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="absolute top-6 left-6">
            <StratusConnectLogo />
          </div>
          
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-12 w-12 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Console</h1>
              <p className="text-white/70">Secure administrator access required</p>
            </div>
            
            <AuthForm />
          </div>
        </div>
      </div>
    );
  }

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="relative min-h-screen bg-slate-900">
        <StarfieldRunwayBackground intensity={0.5} starCount={200} />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading admin console...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-900">
      <StarfieldRunwayBackground intensity={0.3} starCount={150} />
      
      <div className="relative z-10 min-h-screen p-6">
        <div className="absolute top-6 left-6">
          <StratusConnectLogo />
        </div>
        
        <div className="max-w-7xl mx-auto pt-20">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="h-10 w-10 text-red-500" />
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                Admin Console
              </h1>
              <p className="text-white/70 text-lg">
                System administration and user management
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{users.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Pending Approval</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {users.filter(u => u.verification_status === 'pending').length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Admin Users</CardTitle>
                <Lock className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {users.filter(u => u.role === 'admin').length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Active Today</CardTitle>
                <Activity className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {users.filter(u => {
                    if (!u.last_sign_in_at) return false;
                    const lastSignIn = new Date(u.last_sign_in_at);
                    const today = new Date();
                    return lastSignIn.toDateString() === today.toDateString();
                  }).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Management */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
              <CardDescription className="text-white/70">
                Manage user accounts, roles, and verification status
              </CardDescription>
              
              <div className="flex items-center space-x-2 pt-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-white">User</TableHead>
                    <TableHead className="text-white">Role</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Created</TableHead>
                    <TableHead className="text-white">Last Sign In</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-slate-700">
                      <TableCell>
                        <div className="text-white">
                          <div className="font-medium">{user.full_name || 'Unknown'}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.verification_status)}</TableCell>
                      <TableCell className="text-white">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-white">
                        {user.last_sign_in_at 
                          ? new Date(user.last_sign_in_at).toLocaleDateString()
                          : 'Never'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {user.verification_status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => updateUserStatus(user.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => updateUserStatus(user.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {user.verification_status !== 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateUserStatus(user.id, 'pending')}
                              className="border-slate-600 text-white hover:bg-slate-700"
                            >
                              Reset
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}