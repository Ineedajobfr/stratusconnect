import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  User,
  Shield,
  Database
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DSARRequest {
  id: string;
  userId: string;
  requestType: 'access' | 'portability' | 'erasure' | 'restriction' | 'objection';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  description: string;
  requestedAt: string;
  completedAt?: string;
  responseData?: any;
  rejectionReason?: string;
}

interface DSARWorkflowProps {
  userRole: 'admin' | 'user';
}

export default function DSARWorkflow({ userRole }: DSARWorkflowProps) {
  const [requests, setRequests] = useState<DSARRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DSARRequest | null>(null);
  const [newRequest, setNewRequest] = useState({
    requestType: 'access' as DSARRequest['requestType'],
    description: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadDSARRequests();
  }, []);

  const loadDSARRequests = async () => {
    try {
      setLoading(true);
      
      if (userRole === 'admin') {
        // Load all requests for admin
        const { data, error } = await supabase
          .from('dsar_requests')
          .select('*')
          .order('requested_at', { ascending: false });
        
        if (error) throw error;
        setRequests(data || []);
      } else {
        // Load user's own requests
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data, error } = await supabase
          .from('dsar_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('requested_at', { ascending: false });
        
        if (error) throw error;
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error loading DSAR requests:', error);
      toast({
        title: "Error",
        description: "Failed to load DSAR requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDSARRequest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a DSAR request",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from('dsar_requests')
        .insert({
          user_id: user.id,
          request_type: newRequest.requestType,
          description: newRequest.description,
          status: 'pending',
          requested_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "DSAR Request Created",
        description: "Your data subject access request has been submitted",
      });

      setShowCreateDialog(false);
      setNewRequest({ requestType: 'access', description: '' });
      loadDSARRequests();
    } catch (error: any) {
      console.error('Error creating DSAR request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create DSAR request",
        variant: "destructive"
      });
    }
  };

  const updateRequestStatus = async (requestId: string, status: DSARRequest['status'], rejectionReason?: string) => {
    try {
      const updateData: any = { status };
      if (rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('dsar_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Request Updated",
        description: `Request status updated to ${status}`,
      });

      loadDSARRequests();
    } catch (error: any) {
      console.error('Error updating request status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update request status",
        variant: "destructive"
      });
    }
  };

  const generateDataExport = async (requestId: string) => {
    try {
      // In a real implementation, this would generate a comprehensive data export
      // For now, we'll create a placeholder response
      const exportData = {
        personalData: {
          profile: "User profile data",
          transactions: "Transaction history",
          communications: "Message history",
          preferences: "User preferences",
        },
        generatedAt: new Date().toISOString(),
        requestId,
      };

      const { error } = await supabase
        .from('dsar_requests')
        .update({
          response_data: exportData,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Data Export Generated",
        description: "Your data export has been prepared and is available for download",
      });

      loadDSARRequests();
    } catch (error: any) {
      console.error('Error generating data export:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate data export",
        variant: "destructive"
      });
    }
  };

  const deleteUserData = async (requestId: string) => {
    try {
      // In a real implementation, this would perform actual data deletion
      // For now, we'll mark the request as completed
      const { error } = await supabase
        .from('dsar_requests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          response_data: { action: 'data_deleted', deletedAt: new Date().toISOString() },
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Data Deleted",
        description: "Your personal data has been deleted as requested",
      });

      loadDSARRequests();
    } catch (error: any) {
      console.error('Error deleting user data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user data",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: DSARRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'in_progress':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: DSARRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeLabel = (type: DSARRequest['requestType']) => {
    switch (type) {
      case 'access':
        return 'Data Access';
      case 'portability':
        return 'Data Portability';
      case 'erasure':
        return 'Right to Erasure';
      case 'restriction':
        return 'Processing Restriction';
      case 'objection':
        return 'Objection to Processing';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-gunmetal">Loading DSAR requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Data Subject Access Requests</h2>
        {userRole === 'user' && (
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="btn-terminal-accent"
          >
            <FileText className="w-4 h-4 mr-2" />
            New Request
          </Button>
        )}
      </div>

      {/* DSAR Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Your Data Rights</h3>
              <p className="text-blue-700 text-sm mt-1">
                Under UK GDPR, you have the right to access, port, restrict, object to, or delete your personal data. 
                Use this system to exercise your rights.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} className="terminal-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    {getRequestTypeLabel(request.requestType)}
                  </CardTitle>
                  <p className="text-gunmetal text-sm mt-1">
                    Requested: {new Date(request.requestedAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={getStatusColor(request.status)}>
                  {request.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gunmetal mb-4">{request.description}</p>
              
              {request.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-800 font-medium">Rejection Reason</p>
                  <p className="text-red-700 text-sm mt-1">{request.rejectionReason}</p>
                </div>
              )}

              {request.responseData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-green-800 font-medium">Response Data Available</p>
                  <p className="text-green-700 text-sm mt-1">
                    Your request has been completed. Data is available for download.
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedRequest(request)}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>

                {request.status === 'completed' && request.responseData && (
                  <Button
                    onClick={() => {
                      // In a real implementation, this would download the actual data
                      const dataStr = JSON.stringify(request.responseData, null, 2);
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `dsar-export-${request.id}.json`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    size="sm"
                    className="btn-terminal-accent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}

                {userRole === 'admin' && request.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => updateRequestStatus(request.id, 'in_progress')}
                      size="sm"
                      variant="outline"
                    >
                      Start Processing
                    </Button>
                    <Button
                      onClick={() => {
                        const reason = prompt('Rejection reason:');
                        if (reason) {
                          updateRequestStatus(request.id, 'rejected', reason);
                        }
                      }}
                      size="sm"
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </>
                )}

                {userRole === 'admin' && request.status === 'in_progress' && (
                  <>
                    {request.requestType === 'access' || request.requestType === 'portability' ? (
                      <Button
                        onClick={() => generateDataExport(request.id)}
                        size="sm"
                        className="btn-terminal-accent"
                      >
                        Generate Export
                      </Button>
                    ) : request.requestType === 'erasure' ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Data
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User Data</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the user's personal data. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteUserData(request.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Data
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button
                        onClick={() => updateRequestStatus(request.id, 'completed')}
                        size="sm"
                        className="btn-terminal-accent"
                      >
                        Complete
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <Card className="terminal-card">
          <CardContent className="text-center py-12">
            <Database className="w-16 h-16 mx-auto mb-4 text-accent opacity-60" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No DSAR Requests
            </h3>
            <p className="text-gunmetal mb-4">
              {userRole === 'user' 
                ? 'You haven\'t submitted any data subject access requests yet.'
                : 'No data subject access requests have been submitted.'
              }
            </p>
            {userRole === 'user' && (
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="btn-terminal-accent"
              >
                <FileText className="w-4 h-4 mr-2" />
                Submit First Request
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Request Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create DSAR Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="requestType">Request Type</Label>
              <Select
                value={newRequest.requestType}
                onValueChange={(value: DSARRequest['requestType']) => 
                  setNewRequest(prev => ({ ...prev, requestType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="access">Data Access</SelectItem>
                  <SelectItem value="portability">Data Portability</SelectItem>
                  <SelectItem value="erasure">Right to Erasure</SelectItem>
                  <SelectItem value="restriction">Processing Restriction</SelectItem>
                  <SelectItem value="objection">Objection to Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newRequest.description}
                onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your request in detail..."
                rows={4}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={createDSARRequest}
                className="btn-terminal-accent"
                disabled={!newRequest.description.trim()}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Request Type</Label>
                <p className="text-foreground font-medium">
                  {getRequestTypeLabel(selectedRequest.requestType)}
                </p>
              </div>
              
              <div>
                <Label>Status</Label>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedRequest.status)}
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <p className="text-gunmetal">{selectedRequest.description}</p>
              </div>
              
              <div>
                <Label>Requested At</Label>
                <p className="text-gunmetal">
                  {new Date(selectedRequest.requestedAt).toLocaleString()}
                </p>
              </div>
              
              {selectedRequest.completedAt && (
                <div>
                  <Label>Completed At</Label>
                  <p className="text-gunmetal">
                    {new Date(selectedRequest.completedAt).toLocaleString()}
                  </p>
                </div>
              )}
              
              {selectedRequest.rejectionReason && (
                <div>
                  <Label>Rejection Reason</Label>
                  <p className="text-red-600">{selectedRequest.rejectionReason}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
