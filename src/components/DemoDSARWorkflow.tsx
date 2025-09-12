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

export default function DemoDSARWorkflow() {
  const [requests, setRequests] = useState([
    {
      id: 'DSAR-001',
      type: 'access',
      status: 'completed',
      submittedAt: '2024-01-10T09:30:00Z',
      completedAt: '2024-01-12T14:20:00Z',
      description: 'Request for access to all personal data'
    },
    {
      id: 'DSAR-002',
      type: 'export',
      status: 'processing',
      submittedAt: '2024-01-14T11:15:00Z',
      description: 'Export all personal data in machine-readable format'
    },
    {
      id: 'DSAR-003',
      type: 'erasure',
      status: 'pending',
      submittedAt: '2024-01-15T16:45:00Z',
      description: 'Delete all personal data except financial records'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: '',
    description: ''
  });

  const isDemoMode = import.meta.env.VITE_SC_DEMO_MODE === 'true';

  const createRequest = () => {
    if (!newRequest.type || !newRequest.description) return;

    const request = {
      id: `DSAR-${String(requests.length + 1).padStart(3, '0')}`,
      type: newRequest.type,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      description: newRequest.description
    };

    setRequests(prev => [request, ...prev]);
    setNewRequest({ type: '', description: '' });
    setShowCreateForm(false);
  };

  const downloadData = (requestId: string) => {
    // Generate mock user data export
    const userData = {
      requestId: requestId,
      timestamp: new Date().toISOString(),
      user: {
        id: 'user_12345',
        email: 'demo@stratusconnect.com',
        name: 'Demo User',
        role: 'broker',
        createdAt: '2023-01-15T10:30:00Z',
        lastLogin: '2024-01-15T14:20:00Z'
      },
      profile: {
        company: 'Demo Aviation Ltd',
        phone: '+44 20 1234 5678',
        address: '123 Aviation Street, London, UK',
        preferences: {
          currency: 'GBP',
          timezone: 'Europe/London',
          notifications: true
        }
      },
      transactions: [
        {
          id: 'TXN_001',
          type: 'broker_deal',
          amount: 45000,
          currency: 'USD',
          date: '2024-01-10T14:30:00Z',
          status: 'completed'
        },
        {
          id: 'TXN_002',
          type: 'platform_fee',
          amount: 3150,
          currency: 'USD',
          date: '2024-01-10T14:30:00Z',
          status: 'completed'
        }
      ],
      auditLog: [
        {
          action: 'login',
          timestamp: '2024-01-15T14:20:00Z',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          action: 'create_payment_intent',
          timestamp: '2024-01-10T14:30:00Z',
          ip: '192.168.1.100',
          details: 'Broker deal: London-New York'
        }
      ],
      metadata: {
        exportReason: 'GDPR Data Subject Access Request',
        dataRetention: 'Financial records: 6 years, Personal data: until deletion requested',
        processingBasis: 'Contract performance and legitimate interest'
      }
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stratusconnect_data_export_${requestId}.json`;
    link.click();
    URL.revokeObjectURL(url);

    alert(`Data export downloaded for request ${requestId}\n\nThis includes all personal data, transactions, and audit logs as required by GDPR.`);
  };

  const processErasure = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'processing' as const }
          : req
      )
    );
    
    // Simulate processing time
    setTimeout(() => {
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'completed' as const, completedAt: new Date().toISOString() }
            : req
        )
      );
      alert(`Data erasure completed for request ${requestId}\n\nAll personal data has been deleted except financial records (retained for 6 years as required by law).`);
    }, 2000);
  };

  const processRectification = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'processing' as const }
          : req
      )
    );
    
    // Simulate processing time
    setTimeout(() => {
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'completed' as const, completedAt: new Date().toISOString() }
            : req
        )
      );
      alert(`Data rectification completed for request ${requestId}\n\nPersonal data has been corrected as requested.`);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-white';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <Button
          onClick={() => setShowCreateForm(true)}
          className="btn-terminal-accent"
        >
          <User className="w-4 h-4 mr-2" />
          New Request
        </Button>
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
                    DSAR #{request.id.slice(-3)}
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
                {request.status === 'completed' && request.type === 'export' && (
                  <Button
                    onClick={() => downloadData(request.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Data
                  </Button>
                )}
                
                {request.status === 'completed' && request.type === 'access' && (
                  <Button
                    onClick={() => downloadData(request.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Data
                  </Button>
                )}

                {request.status === 'pending' && request.type === 'erasure' && (
                  <Button
                    onClick={() => processErasure(request.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Process Erasure
                  </Button>
                )}

                {request.status === 'pending' && request.type === 'rectification' && (
                  <Button
                    onClick={() => processRectification(request.id)}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-600 hover:bg-slate-800"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Process Rectification
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Request Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create DSAR Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="type">Request Type</Label>
              <Select 
                value={newRequest.type} 
                onValueChange={(value) => setNewRequest(prev => ({ ...prev, type: value }))}
              >
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
                value={newRequest.description}
                onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your request..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={createRequest}
                className="btn-terminal-accent"
                disabled={!newRequest.type || !newRequest.description}
              >
                Submit Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Notice */}
      {isDemoMode && (
        <Card className="bg-slate-800 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Demo Mode</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  This is a demonstration of the DSAR workflow. In production, this would integrate 
                  with real data processing and compliance systems.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
