import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Eye, 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Shield,
  FileText,
  User
} from 'lucide-react';

interface DSARRequest {
  id: string;
  type: 'access' | 'export' | 'erasure' | 'rectification';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  submittedAt: string;
  completedAt?: string;
  description: string;
  userId: string;
  requestData?: Record<string, unknown>;
}

export default function DSARWorkflow() {
  const [requests, setRequests] = useState<DSARRequest[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DSARRequest | null>(null);
  const [currentRequest, setCurrentRequest] = useState<{
    type: 'access' | 'export' | 'erasure' | 'rectification';
    email: string;
    reason: string;
    status: string;
  }>({
    type: 'access',
    email: '',
    reason: '',
    status: 'pending'
  });

  const createDSARRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const request: DSARRequest = {
      id: crypto.randomUUID(),
      type: formData.get('type') as 'access' | 'export' | 'erasure' | 'rectification',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      description: formData.get('description') as string,
      userId: 'current-user', // In production, this would be the actual user ID
    };

    setRequests(prev => [request, ...prev]);
    setShowCreateDialog(false);
  };

  const processRequest = async (requestId: string, action: 'approve' | 'reject') => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: action === 'approve' ? 'processing' : 'rejected',
            completedAt: action === 'approve' ? new Date().toISOString() : undefined
          }
        : req
    ));
  };

  const completeRequest = async (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'completed', completedAt: new Date().toISOString() }
        : req
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-white" />;
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30';
      case 'processing':
        return 'bg-blue-900/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-green-900/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-900/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-900/20 text-slate-400 border-slate-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'access':
        return <Eye className="w-4 h-4" />;
      case 'export':
        return <Download className="w-4 h-4" />;
      case 'erasure':
        return <Trash2 className="w-4 h-4" />;
      case 'rectification':
        return <FileText className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Data Subject Access Requests</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="btn-terminal-accent">
              <User className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create DSAR Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={createDSARRequest} className="space-y-4">
              <div>
                <Label htmlFor="type">Request Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="access">Access to Data</SelectItem>
                    <SelectItem value="export">Export Data</SelectItem>
                    <SelectItem value="erasure">Delete Data</SelectItem>
                    <SelectItem value="rectification">Correct Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  placeholder="Describe your request..."
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
                <Button type="submit" className="btn-terminal-accent">
                  Submit Request
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Compliance Notice */}
      <Card className="bg-slate-800 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">GDPR Data Rights</h3>
              <p className="text-blue-700 text-sm mt-1">
                Under GDPR, you have the right to access, export, correct, or delete your personal data. 
                All requests are processed within 30 days and logged for audit purposes.
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
                    {getTypeIcon(request.type)}
                    DSAR #{request.id.slice(-8)}
                  </CardTitle>
                  <p className="text-gunmetal text-sm mt-1">
                    {request.description}
                  </p>
                </div>
                <Badge className={getStatusColor(request.status)}>
                  {request.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Type</Label>
                  <p className="text-foreground font-mono">
                    {request.type.toUpperCase()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Status</Label>
                  <p className="text-foreground text-sm flex items-center gap-1">
                    {getStatusIcon(request.status)}
                    {request.status.toUpperCase()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Submitted</Label>
                  <p className="text-foreground text-sm">
                    {new Date(request.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Completed</Label>
                  <p className="text-foreground text-sm">
                    {request.completedAt 
                      ? new Date(request.completedAt).toLocaleDateString()
                      : 'Pending'
                    }
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedRequest(request)}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                
                {request.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => processRequest(request.id, 'approve')}
                      size="sm"
                      className="btn-terminal-accent"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => processRequest(request.id, 'reject')}
                      variant="destructive"
                      size="sm"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                
                {request.status === 'processing' && (
                  <Button
                    onClick={() => completeRequest(request.id)}
                    size="sm"
                    className="btn-terminal-accent"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
                
                {request.status === 'completed' && request.type === 'export' && (
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Data
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <Card className="terminal-card">
          <CardContent className="text-center py-12">
            <User className="w-16 h-16 mx-auto mb-4 text-accent opacity-60" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No DSAR Requests
            </h3>
            <p className="text-gunmetal mb-4">
              Create a data subject access request to exercise your GDPR rights
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="btn-terminal-accent"
            >
              <User className="w-4 h-4 mr-2" />
              Create First Request
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>DSAR Request Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Request ID</Label>
                  <p className="text-foreground font-mono">{selectedRequest.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Type</Label>
                  <p className="text-foreground">{selectedRequest.type.toUpperCase()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Status</Label>
                  <p className="text-foreground">{selectedRequest.status.toUpperCase()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Submitted</Label>
                  <p className="text-foreground">
                    {new Date(selectedRequest.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gunmetal">Description</Label>
                <p className="text-foreground">{selectedRequest.description}</p>
              </div>
              
              {selectedRequest.completedAt && (
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Completed</Label>
                  <p className="text-foreground">
                    {new Date(selectedRequest.completedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
