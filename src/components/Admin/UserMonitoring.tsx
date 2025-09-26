import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  AlertTriangle, 
  Shield, 
  Activity, 
  TrendingDown, 
  Clock, 
  DollarSign,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'login' | 'job_apply' | 'job_post' | 'forum_post' | 'message_send' | 'profile_update' | 'skill_update';
  activity_data: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
  user: {
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
}

interface UserWarning {
  id: string;
  user_id: string;
  warning_type: 'inactivity' | 'undercutting' | 'policy_violation' | 'spam' | 'inappropriate_behavior';
  warning_level: 1 | 2 | 3;
  description: string;
  issued_by: string;
  expires_at: string;
  is_resolved: boolean;
  resolved_at: string;
  created_at: string;
  user: {
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
  issuer: {
    name: string;
    email: string;
    role: string;
  };
}

interface TerminationQueue {
  id: string;
  user_id: string;
  termination_reason: string;
  termination_date: string;
  warnings_count: number;
  last_warning_date: string;
  grace_period_ends: string;
  is_processed: boolean;
  processed_at: string;
  created_at: string;
  user: {
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
}

interface UserMonitoringProps {
  // Admin-only component
}

export default function UserMonitoring({}: UserMonitoringProps) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [warnings, setWarnings] = useState<UserWarning[]>([]);
  const [terminationQueue, setTerminationQueue] = useState<TerminationQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivityType, setSelectedActivityType] = useState('all');
  const [selectedWarningType, setSelectedWarningType] = useState('all');
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newWarning, setNewWarning] = useState({
    user_id: '',
    warning_type: 'inactivity' as const,
    warning_level: 1 as const,
    description: '',
    expires_at: ''
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockActivities: UserActivity[] = [
      {
        id: '1',
        user_id: 'user-1',
        activity_type: 'job_apply',
        activity_data: { job_id: 'job-1', proposed_rate: 120 },
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        created_at: '2024-01-20T10:30:00Z',
        user: {
          name: 'John Pilot',
          email: 'john@example.com',
          role: 'pilot',
          avatar: '/avatars/john-pilot.jpg'
        }
      },
      {
        id: '2',
        user_id: 'user-2',
        activity_type: 'undercutting',
        activity_data: { rate_difference: 0.3, applications_count: 8 },
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        created_at: '2024-01-20T09:15:00Z',
        user: {
          name: 'Jane Crew',
          email: 'jane@example.com',
          role: 'crew',
          avatar: '/avatars/jane-crew.jpg'
        }
      }
    ];

    const mockWarnings: UserWarning[] = [
      {
        id: '1',
        user_id: 'user-2',
        warning_type: 'undercutting',
        warning_level: 2,
        description: 'User has been consistently undercutting market rates by 30% or more in recent applications',
        issued_by: 'admin-1',
        expires_at: '2024-02-20T00:00:00Z',
        is_resolved: false,
        resolved_at: '',
        created_at: '2024-01-20T09:30:00Z',
        user: {
          name: 'Jane Crew',
          email: 'jane@example.com',
          role: 'crew',
          avatar: '/avatars/jane-crew.jpg'
        },
        issuer: {
          name: 'Admin User',
          email: 'admin@stratusconnect.com',
          role: 'admin'
        }
      },
      {
        id: '2',
        user_id: 'user-3',
        warning_type: 'inactivity',
        warning_level: 1,
        description: 'User has not logged in or performed any activities for 45 days',
        issued_by: 'admin-1',
        expires_at: '2024-02-15T00:00:00Z',
        is_resolved: false,
        resolved_at: '',
        created_at: '2024-01-15T14:20:00Z',
        user: {
          name: 'Bob Operator',
          email: 'bob@example.com',
          role: 'operator',
          avatar: '/avatars/bob-operator.jpg'
        },
        issuer: {
          name: 'Admin User',
          email: 'admin@stratusconnect.com',
          role: 'admin'
        }
      }
    ];

    const mockTerminationQueue: TerminationQueue[] = [
      {
        id: '1',
        user_id: 'user-4',
        termination_reason: 'Multiple policy violations and undercutting behavior',
        termination_date: '2024-02-01T00:00:00Z',
        warnings_count: 3,
        last_warning_date: '2024-01-15T00:00:00Z',
        grace_period_ends: '2024-01-25T00:00:00Z',
        is_processed: false,
        processed_at: '',
        created_at: '2024-01-20T16:00:00Z',
        user: {
          name: 'Mike Spammer',
          email: 'mike@example.com',
          role: 'pilot',
          avatar: '/avatars/mike-spammer.jpg'
        }
      }
    ];

    setActivities(mockActivities);
    setWarnings(mockWarnings);
    setTerminationQueue(mockTerminationQueue);
    setLoading(false);
  }, []);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedActivityType === 'all' || activity.activity_type === selectedActivityType;
    return matchesSearch && matchesType;
  });

  const filteredWarnings = warnings.filter(warning => {
    const matchesSearch = warning.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warning.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedWarningType === 'all' || warning.warning_type === selectedWarningType;
    return matchesSearch && matchesType;
  });

  const handleIssueWarning = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual API call
    console.log('Issuing warning:', newWarning);
    setShowWarningDialog(false);
    setNewWarning({
      user_id: '',
      warning_type: 'inactivity',
      warning_level: 1,
      description: '',
      expires_at: ''
    });
  };

  const handleProcessTermination = async (terminationId: string) => {
    // TODO: Implement actual API call
    console.log('Processing termination:', terminationId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return '🔐';
      case 'job_apply': return '📝';
      case 'job_post': return '📋';
      case 'forum_post': return '💬';
      case 'message_send': return '💌';
      case 'profile_update': return '👤';
      case 'skill_update': return '🎯';
      default: return '📊';
    }
  };

  const getWarningLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 2: return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 3: return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-terminal-muted text-terminal-fg';
    }
  };

  const getWarningTypeIcon = (type: string) => {
    switch (type) {
      case 'inactivity': return '⏰';
      case 'undercutting': return '💰';
      case 'policy_violation': return '⚠️';
      case 'spam': return '🚫';
      case 'inappropriate_behavior': return '😡';
      default: return '⚠️';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terminal-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-terminal-fg">User Monitoring</h1>
          <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
            <DialogTrigger asChild>
              <Button className="bg-terminal-accent hover:bg-terminal-accent/90">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Issue Warning
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-terminal-bg border-terminal-border">
              <DialogHeader>
                <DialogTitle className="text-terminal-fg">Issue User Warning</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleIssueWarning} className="space-y-4">
                <div>
                  <label className="text-terminal-fg">User ID</label>
                  <Input
                    value={newWarning.user_id}
                    onChange={(e) => setNewWarning(prev => ({ ...prev, user_id: e.target.value }))}
                    className="bg-terminal-bg border-terminal-border text-terminal-fg"
                    required
                  />
                </div>
                <div>
                  <label className="text-terminal-fg">Warning Type</label>
                  <Select value={newWarning.warning_type} onValueChange={(value: any) => setNewWarning(prev => ({ ...prev, warning_type: value }))}>
                    <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inactivity">Inactivity</SelectItem>
                      <SelectItem value="undercutting">Undercutting</SelectItem>
                      <SelectItem value="policy_violation">Policy Violation</SelectItem>
                      <SelectItem value="spam">Spam</SelectItem>
                      <SelectItem value="inappropriate_behavior">Inappropriate Behavior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-terminal-fg">Warning Level</label>
                  <Select value={newWarning.warning_level.toString()} onValueChange={(value) => setNewWarning(prev => ({ ...prev, warning_level: parseInt(value) as 1 | 2 | 3 }))}>
                    <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Level 1 (Warning)</SelectItem>
                      <SelectItem value="2">Level 2 (Serious)</SelectItem>
                      <SelectItem value="3">Level 3 (Critical)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-terminal-fg">Description</label>
                  <Textarea
                    value={newWarning.description}
                    onChange={(e) => setNewWarning(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-terminal-bg border-terminal-border text-terminal-fg"
                    required
                  />
                </div>
                <div>
                  <label className="text-terminal-fg">Expires At</label>
                  <Input
                    type="datetime-local"
                    value={newWarning.expires_at}
                    onChange={(e) => setNewWarning(prev => ({ ...prev, expires_at: e.target.value }))}
                    className="bg-terminal-bg border-terminal-border text-terminal-fg"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <Button type="submit" className="bg-terminal-accent hover:bg-terminal-accent/90">
                    Issue Warning
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowWarningDialog(false)} className="border-terminal-border text-terminal-fg">
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <p className="text-terminal-muted">
          Monitor user activity, issue warnings, and manage account terminations
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-terminal-bg border-terminal-border">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-muted h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-terminal-bg border-terminal-border text-terminal-fg"
              />
            </div>
            
            <Select value={selectedActivityType} onValueChange={setSelectedActivityType}>
              <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="job_apply">Job Apply</SelectItem>
                <SelectItem value="job_post">Job Post</SelectItem>
                <SelectItem value="forum_post">Forum Post</SelectItem>
                <SelectItem value="message_send">Message Send</SelectItem>
                <SelectItem value="profile_update">Profile Update</SelectItem>
                <SelectItem value="skill_update">Skill Update</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedWarningType} onValueChange={setSelectedWarningType}>
              <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                <SelectValue placeholder="Warning Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warnings</SelectItem>
                <SelectItem value="inactivity">Inactivity</SelectItem>
                <SelectItem value="undercutting">Undercutting</SelectItem>
                <SelectItem value="policy_violation">Policy Violation</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
                <SelectItem value="inappropriate_behavior">Inappropriate Behavior</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="activities" className="space-y-6">
        <TabsList className="bg-terminal-bg border-terminal-border">
          <TabsTrigger value="activities" className="data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg">
            Activities
          </TabsTrigger>
          <TabsTrigger value="warnings" className="data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg">
            Warnings
          </TabsTrigger>
          <TabsTrigger value="terminations" className="data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg">
            Termination Queue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-4">
          {filteredActivities.length === 0 ? (
            <Card className="bg-terminal-bg border-terminal-border">
              <CardContent className="p-8 text-center">
                <Activity className="h-12 w-12 text-terminal-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-terminal-fg mb-2">No Activities Found</h3>
                <p className="text-terminal-muted">
                  Try adjusting your search criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredActivities.map(activity => (
              <Card key={activity.id} className="bg-terminal-bg border-terminal-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getActivityIcon(activity.activity_type)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-terminal-fg">{activity.user.name}</h3>
                        <p className="text-terminal-muted">{activity.user.email} • {activity.user.role}</p>
                        <p className="text-sm text-terminal-muted">
                          {activity.activity_type.replace('_', ' ')} • {formatDate(activity.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-terminal-muted">
                      <p>IP: {activity.ip_address}</p>
                      <p>Agent: {activity.user_agent.substring(0, 50)}...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="warnings" className="space-y-4">
          {filteredWarnings.length === 0 ? (
            <Card className="bg-terminal-bg border-terminal-border">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-terminal-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-terminal-fg mb-2">No Warnings Found</h3>
                <p className="text-terminal-muted">
                  Try adjusting your search criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredWarnings.map(warning => (
              <Card key={warning.id} className="bg-terminal-bg border-terminal-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getWarningTypeIcon(warning.warning_type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-terminal-fg">{warning.user.name}</h3>
                          <Badge className={getWarningLevelColor(warning.warning_level)}>
                            Level {warning.warning_level}
                          </Badge>
                          {warning.is_resolved && (
                            <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="text-terminal-muted">{warning.user.email} • {warning.user.role}</p>
                        <p className="text-terminal-fg mt-2">{warning.description}</p>
                        <p className="text-sm text-terminal-muted mt-2">
                          Issued by {warning.issuer.name} • {formatDate(warning.created_at)}
                          {warning.expires_at && ` • Expires ${formatDate(warning.expires_at)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!warning.is_resolved && (
                        <Button variant="outline" size="sm" className="border-terminal-border text-terminal-fg">
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="terminations" className="space-y-4">
          {terminationQueue.length === 0 ? (
            <Card className="bg-terminal-bg border-terminal-border">
              <CardContent className="p-8 text-center">
                <Ban className="h-12 w-12 text-terminal-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-terminal-fg mb-2">No Terminations Pending</h3>
                <p className="text-terminal-muted">
                  No users are currently scheduled for termination.
                </p>
              </CardContent>
            </Card>
          ) : (
            terminationQueue.map(termination => (
              <Card key={termination.id} className="bg-terminal-bg border-terminal-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">⚠️</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-terminal-fg">{termination.user.name}</h3>
                          <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
                            Scheduled for Termination
                          </Badge>
                          {termination.is_processed && (
                            <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                              Processed
                            </Badge>
                          )}
                        </div>
                        <p className="text-terminal-muted">{termination.user.email} • {termination.user.role}</p>
                        <p className="text-terminal-fg mt-2">{termination.termination_reason}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm text-terminal-muted">
                          <div>
                            <p className="font-semibold">Warnings Count</p>
                            <p>{termination.warnings_count}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Last Warning</p>
                            <p>{formatDate(termination.last_warning_date)}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Termination Date</p>
                            <p>{formatDate(termination.termination_date)}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Grace Period Ends</p>
                            <p>{formatDate(termination.grace_period_ends)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!termination.is_processed && (
                        <Button 
                          onClick={() => handleProcessTermination(termination.id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Process Termination
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
