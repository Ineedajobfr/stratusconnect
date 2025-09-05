import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Search, UserCheck, UserX, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  user_id: string;
  username: string;
  display_name: string;
  platform_role: string;
  avatar_url?: string;
  phone?: string;
  country?: string;
  created_at: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: string) => {
    console.log(`Pretend to update user ${userId} to ${status}`);
    toast.success(`User ${status} successfully`);
  };

  const deactivateUser = async (userId: string) => {
    console.log(`Pretend to deactivate user ${userId}`);
    toast.success('User deactivated successfully');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.platform_role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'operator': return 'default';
      case 'broker': return 'secondary';
      case 'pilot': return 'outline';
      case 'crew': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <Card className="terminal-card">
        <CardContent className="p-12">
          <div className="text-center text-slate-400">
            <Users className="w-16 h-16 mx-auto mb-6 opacity-30 animate-pulse" />
            <p>Loading users...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="terminal-card">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="terminal-subheader flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management ({users.length} total users)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="terminal-input pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="terminal-input w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="operator">Operator</SelectItem>
                <SelectItem value="broker">Broker</SelectItem>
                <SelectItem value="pilot">Pilot</SelectItem>
                <SelectItem value="crew">Crew</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-300">User</TableHead>
                  <TableHead className="text-slate-300">Role</TableHead>
                  <TableHead className="text-slate-300">Joined</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.user_id} className="border-slate-800">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{user.display_name || user.username}</div>
                        <div className="text-sm text-slate-400 font-mono">{user.username}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.platform_role)} className="font-mono">
                        {user.platform_role?.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 font-mono text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateUserStatus(user.user_id, 'approved')}
                          className="btn-terminal-success"
                        >
                          <UserCheck className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deactivateUser(user.user_id)}
                          className="btn-terminal-secondary"
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Deactivate
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No users found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};