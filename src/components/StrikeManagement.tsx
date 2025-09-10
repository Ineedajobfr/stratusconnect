import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Plus, User, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Strike {
  id: string;
  user_id: string;
  reason: string;
  notes: string;
  severity: string;
  count: number;
  resolved_flag: boolean;
  created_at: string;
  created_by: string;
  resolved_at?: string;
  resolved_by?: string;
  profiles: {
    display_name: string;
    platform_role: string;
  } | null;
}

export const StrikeManagement = () => {
  const [strikes, setStrikes] = useState<Strike[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingStrike, setIsAddingStrike] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterResolved, setFilterResolved] = useState('all');
  const { toast } = useToast();

  // New strike form data
  const [newStrike, setNewStrike] = useState({
    user_email: '',
    reason: '',
    notes: '',
    severity: 'minor'
  });

  useEffect(() => {
    fetchStrikes();
  }, [fetchStrikes]);

  const fetchStrikes = useCallback(async () => {
              try {
                const { data, error } = await supabase
                  .from('strikes')
                  .select(`
          *,
          profiles!strikes_user_id_fkey (
            display_name,
            platform_role
          )
        `)
                  .order('created_at', { ascending: false });

                if (error) throw error;
                
                // Handle the query result and map to correct type
                const mappedStrikes: Strike[] = (data || [])
                  .filter((item: Record<string, unknown>) => item.profiles && (item.profiles as Record<string, unknown>).display_name)
                  .map((item: Record<string, unknown>) => ({
                    ...item,
                    profiles: item.profiles
                  }));
                
                setStrikes(mappedStrikes);
              } catch (error: unknown) {
                toast({
                  title: 'Error',
                  description: (error as Error).message || 'Failed to fetch strikes',
                  variant: 'destructive',
                });
              } finally {
                setLoading(false);
              }
            }, [data, from, select, order, ascending, Strike, filter, Record, profiles, display_name, map, toast, title, description, Error, message, variant]);

  const issueStrike = async () => {
    if (!newStrike.user_email || !newStrike.reason) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsAddingStrike(true);
    try {
      // First, find the user by email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, full_name, email')
        .eq('email', newStrike.user_email)
        .single();

      if (userError || !userData) {
        throw new Error('User not found with that email address');
      }

      // Get current user for created_by
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Count existing strikes for this user
      const { count } = await supabase
        .from('strikes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userData.id)
        .eq('resolved_flag', false);

      const strikeCount = (count || 0) + 1;

      // Create the strike
      const { error: strikeError } = await supabase
        .from('strikes')
        .insert([{
          user_id: userData.id,
          reason: newStrike.reason,
          notes: newStrike.notes,
          severity: newStrike.severity,
          count: strikeCount,
          created_by: user.id
        }]);

      if (strikeError) throw strikeError;

      // Log the action
      await supabase
        .from('audit_logs')
        .insert([{
          actor_id: user.id,
          action: 'strike_issued',
          target_type: 'user',
          target_id: userData.id,
          after_values: {
            reason: newStrike.reason,
            severity: newStrike.severity,
            count: strikeCount
          }
        }]);

      // Check for auto-suspension (3 strikes policy)
      if (strikeCount >= 3 && newStrike.severity === 'minor') {
        toast({
          title: 'Auto-Suspension Triggered',
          description: `${userData.full_name || userData.email} has received 3 strikes and will be suspended.`,
          variant: 'destructive',
        });
      } else if (newStrike.severity === 'severe') {
        toast({
          title: 'Severe Violation',
          description: `${userData.full_name || userData.email} has been issued a severe strike for immediate review.`,
          variant: 'destructive',
        });
      }

      toast({
        title: 'Strike Issued',
        description: `Strike #${strikeCount} issued to ${userData.full_name || userData.email}`,
      });

      // Reset form and refresh
      setNewStrike({ user_email: '', reason: '', notes: '', severity: 'minor' });
      fetchStrikes();
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to issue strike',
        variant: 'destructive',
      });
    } finally {
      setIsAddingStrike(false);
    }
  };

  const resolveStrike = async (strikeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('strikes')
        .update({
          resolved_flag: true,
          resolved_at: new Date().toISOString(),
          resolved_by: user.id
        })
        .eq('id', strikeId);

      if (error) throw error;

      toast({
        title: 'Strike Resolved',
        description: 'The strike has been marked as resolved',
      });

      fetchStrikes();
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: (error as Error).message || 'Failed to resolve strike',
        variant: 'destructive',
      });
    }
  };

  const getSeverityBadge = (severity: string) => {
    return severity === 'severe' 
      ? 'bg-red-500/20 text-red-400 border-red-500/30'
      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  };

  const getStrikeStatusBadge = (resolved: boolean) => {
    return resolved
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const filteredStrikes = strikes.filter(strike => {
    if (!strike.profiles) return false;
    
    const matchesSearch = strike.profiles.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strike.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'all' || strike.severity === filterSeverity;
    const matchesResolved = filterResolved === 'all' || 
                          (filterResolved === 'resolved' && strike.resolved_flag) ||
                          (filterResolved === 'active' && !strike.resolved_flag);

    return matchesSearch && matchesSeverity && matchesResolved;
  });

  if (loading) {
    return <div className="text-center text-slate-400">Loading strikes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Strike Management</h3>
          <p className="text-slate-400">Three strike policy enforcement</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="btn-terminal-primary">
              <Plus className="w-4 h-4 mr-2" />
              Issue Strike
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Issue New Strike</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="user_email" className="text-slate-300">User Email</Label>
                <Input
                  id="user_email"
                  placeholder="user@example.com"
                  value={newStrike.user_email}
                  onChange={(e) => setNewStrike(prev => ({ ...prev, user_email: e.target.value }))}
                  className="terminal-input"
                />
              </div>
              <div>
                <Label htmlFor="severity" className="text-slate-300">Severity</Label>
                <Select value={newStrike.severity} onValueChange={(value) => setNewStrike(prev => ({ ...prev, severity: value }))}>
                  <SelectTrigger className="terminal-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor Violation</SelectItem>
                    <SelectItem value="severe">Severe Violation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reason" className="text-slate-300">Reason</Label>
                <Input
                  id="reason"
                  placeholder="Attempted off-platform communication"
                  value={newStrike.reason}
                  onChange={(e) => setNewStrike(prev => ({ ...prev, reason: e.target.value }))}
                  className="terminal-input"
                />
              </div>
              <div>
                <Label htmlFor="notes" className="text-slate-300">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional details about the violation..."
                  value={newStrike.notes}
                  onChange={(e) => setNewStrike(prev => ({ ...prev, notes: e.target.value }))}
                  className="terminal-input"
                />
              </div>
              <Button 
                onClick={issueStrike} 
                disabled={isAddingStrike}
                className="w-full btn-terminal-danger"
              >
                {isAddingStrike ? 'Issuing Strike...' : 'Issue Strike'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search strikes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="terminal-input w-64"
        />
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="terminal-input w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="minor">Minor</SelectItem>
            <SelectItem value="severe">Severe</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterResolved} onValueChange={setFilterResolved}>
          <SelectTrigger className="terminal-input w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Strikes List */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="terminal-subheader flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Active Strikes ({filteredStrikes.filter(s => !s.resolved_flag).length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredStrikes.map((strike, index) => (
              <div key={strike.id} className={`p-6 border-b border-slate-800/50 ${index === filteredStrikes.length - 1 ? 'border-b-0' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-white font-medium">
                          {strike.profiles?.display_name || 'Unknown User'}
                        </span>
                      </div>
                      <Badge className={getSeverityBadge(strike.severity)}>
                        {strike.severity.toUpperCase()}
                      </Badge>
                      <Badge className={getStrikeStatusBadge(strike.resolved_flag)}>
                        {strike.resolved_flag ? 'RESOLVED' : 'ACTIVE'}
                      </Badge>
                      <Badge variant="outline" className="font-mono text-xs">
                        Strike #{strike.count}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="text-slate-300">{strike.reason}</div>
                      {strike.notes && (
                        <div className="text-sm text-slate-400">{strike.notes}</div>
                      )}
          <div className="text-xs text-slate-500 font-mono flex items-center space-x-4">
            <span>{strike.profiles?.platform_role?.toUpperCase() || 'NO ROLE'}</span>
            <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(strike.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!strike.resolved_flag && (
                      <Button
                        onClick={() => resolveStrike(strike.id)}
                        size="sm"
                        className="btn-terminal-success"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Resolve
                      </Button>
                    )}
                    {strike.resolved_flag && (
                      <div className="text-green-400 text-sm font-mono flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        RESOLVED
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredStrikes.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No strikes found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};