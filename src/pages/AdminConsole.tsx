// Admin Console - Complete User Management System
// Real-time admin dashboard with full user control

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
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    ChevronLeft,
    Search,
    Shield,
    Trash2,
    Users
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
}

interface Stats {
  totalUsers: number;
  pendingApproval: number;
  adminUsers: number;
  activeToday: number;
}

export default function AdminConsole() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    pendingApproval: 0,
    adminUsers: 0,
    activeToday: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    console.log('Current user:', user);
    console.log('User role:', user?.role);
    console.log('User ID:', user?.id);
    
    if (!user) {
      console.log('No user logged in');
      setLoading(false);
      return;
    }
    
    if (user?.role !== 'admin') {
      console.log('User is not admin, redirecting');
      toast({
        title: 'Access Denied',
        description: 'Only administrators can access this page',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }
    
    console.log('User is admin, loading users...');
    loadUsers();
  }, [user, navigate]);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('Starting to load users...');
      console.log('Current auth user:', await supabase.auth.getUser());

      // Try to get users from users table (works with both public and api schemas)
      const { data: publicUsers, error: publicError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Query result:', { publicUsers, publicError });

      if (publicError) {
        console.error('Error loading users:', publicError);
        console.error('Error details:', {
          message: publicError.message,
          details: publicError.details,
          hint: publicError.hint,
          code: publicError.code
        });
        toast({
          title: 'Database Error',
          description: `Failed to load users: ${publicError.message}`,
          variant: 'destructive',
        });
        throw publicError;
      }

      if (!publicUsers || publicUsers.length === 0) {
        console.log('No users found in database');
        setUsers([]);
        calculateStats([]);
        return;
      }

      const mappedUsers: User[] = publicUsers.map(u => ({
        id: u.id,
        email: u.email || '',
        full_name: u.full_name,
        role: u.role as any,
        status: (u.status || 'active') as any,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        email_confirmed_at: u.email_confirmed_at,
        company_id: u.company_id,
        phone: u.phone,
      }));

      console.log(`Loaded ${mappedUsers.length} users successfully`);
      setUsers(mappedUsers);
      calculateStats(mappedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userList: User[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    setStats({
      totalUsers: userList.length,
      pendingApproval: userList.filter(u => u.status === 'pending').length,
      adminUsers: userList.filter(u => u.role === 'admin').length,
      activeToday: userList.filter(u => {
        if (!u.last_sign_in_at) return false;
        const lastSignIn = new Date(u.last_sign_in_at);
        return lastSignIn >= today;
      }).length,
    });
  };

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

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
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
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
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
        // Fallback: soft delete from users table
        const { error: publicError } = await supabase
          .from('users')
          .update({ status: 'inactive', deleted: true, deleted_at: new Date().toISOString() })
          .eq('id', userId);

        if (publicError) throw publicError;
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
        background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div className="text-sm text-white/60">
            STRATUSCONNECT
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-2">
          <Shield className="h-10 w-10 text-red-500" />
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Console</h1>
            <p className="text-white/60">System administration and user management</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">Pending Approval</p>
                <p className="text-3xl font-bold text-white">{stats.pendingApproval}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">Admin Users</p>
                <p className="text-3xl font-bold text-white">{stats.adminUsers}</p>
              </div>
              <Shield className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1">Active Today</p>
                <p className="text-3xl font-bold text-white">{stats.activeToday}</p>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Section */}
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

          {/* Users Table */}
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/30 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">Created</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">Last Sign In</th>
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
                          <div className="text-sm text-white/80">{formatDate(u.created_at)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-white/80">{formatDate(u.last_sign_in_at)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {u.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => updateUserStatus(u.id, 'active')}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                            
                            <Select
                              value={u.role}
                              onValueChange={(value) => updateUserRole(u.id, value)}
                            >
                              <SelectTrigger className="w-32 h-8 bg-black/30 border-white/20 text-white text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="broker">Broker</SelectItem>
                                <SelectItem value="operator">Operator</SelectItem>
                                <SelectItem value="pilot">Pilot</SelectItem>
                                <SelectItem value="crew">Crew</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteUser(u.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
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
    </div>
  );
}
