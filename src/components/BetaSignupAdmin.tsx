import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star, 
  Filter, 
  Search,
  Download,
  Eye,
  Mail,
  Phone,
  Calendar,
  Building,
  Plane
} from 'lucide-react';

interface BetaSignup {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  country: string;
  role: string;
  job_title: string;
  years_in_aviation: number;
  company_name: string;
  company_type: string;
  primary_aircraft_types: string[];
  fleet_size: number;
  expected_monthly_volume: number;
  availability_hours_per_week: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'waitlisted';
  priority_score: number;
  created_at: string;
  willing_to_interview: boolean;
  documents_uploaded: boolean;
  documents_verified: boolean;
}

export default function BetaSignupAdmin() {
  const [signups, setSignups] = useState<BetaSignup[]>([]);
  const [filteredSignups, setFilteredSignups] = useState<BetaSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority_score');
  const [selectedSignup, setSelectedSignup] = useState<BetaSignup | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchSignups();
  }, []);

  useEffect(() => {
    filterSignups();
  }, [signups, searchTerm, statusFilter, roleFilter, sortBy]);

  const fetchSignups = async () => {
    try {
      const { data, error } = await supabase
        .from('beta_signups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSignups(data || []);
    } catch (error) {
      console.error('Error fetching signups:', error);
      toast({
        title: "Error",
        description: "Failed to fetch beta signups",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSignups = () => {
    let filtered = [...signups];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(signup => 
        signup.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signup.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(signup => signup.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(signup => signup.role === roleFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority_score':
          return b.priority_score - a.priority_score;
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'name':
          return a.full_name.localeCompare(b.full_name);
        default:
          return 0;
      }
    });

    setFilteredSignups(filtered);
  };

  const updateStatus = async (id: string, status: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('beta_signups')
        .update({ 
          status,
          review_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setSignups(prev => 
        prev.map(signup => 
          signup.id === id 
            ? { ...signup, status: status as any, review_notes: notes }
            : signup
        )
      );

      toast({
        title: "Status Updated",
        description: `Application status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'under_review':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'waitlisted':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const exportToCSV = () => {
    const headers = [
      'Name', 'Email', 'Phone', 'Country', 'Role', 'Company', 'Years in Aviation',
      'Fleet Size', 'Monthly Volume', 'Availability', 'Priority Score', 'Status', 'Created At'
    ];
    
    const csvData = filteredSignups.map(signup => [
      signup.full_name,
      signup.email,
      signup.phone || '',
      signup.country,
      signup.role,
      signup.company_name,
      signup.years_in_aviation,
      signup.fleet_size,
      signup.expected_monthly_volume,
      signup.availability_hours_per_week,
      signup.priority_score,
      signup.status,
      new Date(signup.created_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beta-signups-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading beta signups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8" />
              Beta Signup Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and review beta application submissions
            </p>
          </div>
          <Button onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold">{signups.length}</p>
                </div>
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {signups.filter(s => s.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-400">
                    {signups.filter(s => s.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-bold text-accent">
                    {signups.filter(s => s.priority_score >= 80).length}
                  </p>
                </div>
                <Star className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="waitlisted">Waitlisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="broker">Broker</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="pilot">Pilot</SelectItem>
                    <SelectItem value="crew">Crew</SelectItem>
                    <SelectItem value="ground_support">Ground Support</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="priority_score">Priority Score</SelectItem>
                    <SelectItem value="created_at">Date Created</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Applications ({filteredSignups.length})</CardTitle>
                <CardDescription>
                  Review and manage beta signup applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSignups.map((signup) => (
                    <div
                      key={signup.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedSignup?.id === signup.id 
                          ? 'border-accent bg-accent/5' 
                          : 'border-border hover:border-accent/50'
                      }`}
                      onClick={() => setSelectedSignup(signup)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{signup.full_name}</h3>
                            <Badge className={getStatusColor(signup.status)}>
                              {signup.status.replace('_', ' ')}
                            </Badge>
                            <span className={`text-sm font-medium ${getPriorityColor(signup.priority_score)}`}>
                              Score: {signup.priority_score}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {signup.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              {signup.company_name}
                            </div>
                            <div className="flex items-center gap-2">
                              <Plane className="w-4 h-4" />
                              {signup.role} • {signup.years_in_aviation} years
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(signup.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(signup.id, 'approved');
                            }}
                            disabled={signup.status === 'approved'}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(signup.id, 'rejected');
                            }}
                            disabled={signup.status === 'rejected'}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Details */}
          <div>
            {selectedSignup ? (
              <Card>
                <CardHeader>
                  <CardTitle>Application Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {selectedSignup.email}
                      </div>
                      {selectedSignup.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {selectedSignup.phone}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {selectedSignup.country}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Professional Info</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Role:</strong> {selectedSignup.role}</p>
                      <p><strong>Job Title:</strong> {selectedSignup.job_title}</p>
                      <p><strong>Years in Aviation:</strong> {selectedSignup.years_in_aviation}</p>
                      <p><strong>Company:</strong> {selectedSignup.company_name}</p>
                      <p><strong>Company Type:</strong> {selectedSignup.company_type}</p>
                      {selectedSignup.fleet_size > 0 && (
                        <p><strong>Fleet Size:</strong> {selectedSignup.fleet_size}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Beta Testing</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Availability:</strong> {selectedSignup.availability_hours_per_week} hours/week</p>
                      <p><strong>Monthly Volume:</strong> {selectedSignup.expected_monthly_volume}</p>
                      <p><strong>Interview Willing:</strong> {selectedSignup.willing_to_interview ? 'Yes' : 'No'}</p>
                      <p><strong>Documents:</strong> {selectedSignup.documents_uploaded ? 'Uploaded' : 'Not uploaded'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Aircraft Types</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedSignup.primary_aircraft_types.map((aircraft, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {aircraft}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateStatus(selectedSignup.id, 'approved')}
                        disabled={selectedSignup.status === 'approved'}
                        className="flex-1"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(selectedSignup.id, 'rejected')}
                        disabled={selectedSignup.status === 'rejected'}
                        className="flex-1"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select an application to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
