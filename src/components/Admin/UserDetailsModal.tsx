// User Details Modal
// Comprehensive user information and management

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Mail, Phone, MapPin, Building2, Calendar, Shield, 
  FileText, AlertTriangle, CheckCircle, X, Edit, Save,
  Plane, Briefcase, DollarSign, Clock, Eye, Download
} from "lucide-react";

interface UserDetailsModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (userId: string, updates: any) => void;
  onAction: (userId: string, action: string, notes?: string) => void;
  isProcessing: boolean;
}

const UserDetailsModal = ({ user, isOpen, onClose, onUpdate, onAction, isProcessing }: UserDetailsModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    company_name: user?.company_name || '',
    location: user?.location || '',
    phone: user?.phone || '',
    admin_notes: user?.admin_notes || ''
  });

  if (!user) return null;

  const handleSave = () => {
    onUpdate(user.id, editData);
    setIsEditing(false);
  };

  const handleAction = (action: string) => {
    const notes = editData.admin_notes;
    onAction(user.id, action, notes);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <User className="w-6 h-6" />
            <span>{user.full_name}</span>
            <Badge variant={user.status === 'approved' ? 'default' : 'destructive'}>
              {user.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm text-muted-foreground">Full Name</label>
                      {isEditing ? (
                        <Input 
                          value={editData.full_name}
                          onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-foreground">{user.full_name}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm text-muted-foreground">Email</label>
                      {isEditing ? (
                        <Input 
                          value={editData.email}
                          onChange={(e) => setEditData({...editData, email: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-foreground">{user.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm text-muted-foreground">Company</label>
                      {isEditing ? (
                        <Input 
                          value={editData.company_name}
                          onChange={(e) => setEditData({...editData, company_name: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-foreground">{user.company_name || 'N/A'}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm text-muted-foreground">Location</label>
                      {isEditing ? (
                        <Input 
                          value={editData.location}
                          onChange={(e) => setEditData({...editData, location: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-foreground">{user.location || 'N/A'}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm text-muted-foreground">Phone</label>
                      {isEditing ? (
                        <Input 
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-foreground">{user.phone || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Status & Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-terminal-card/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Role</span>
                    <Badge variant="outline" className="capitalize">{user.role}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-terminal-card/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Verification</span>
                    <Badge variant={user.verification_status === 'approved' ? 'default' : 'destructive'}>
                      {user.verification_status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-terminal-card/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">KYC Status</span>
                    <Badge variant={user.kyc_status === 'approved' ? 'default' : 'destructive'}>
                      {user.kyc_status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-terminal-card/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Sanctions</span>
                    <Badge variant={user.sanctions_match ? 'destructive' : 'default'}>
                      {user.sanctions_match ? 'MATCH' : 'CLEAR'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-terminal-card/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Risk Score</span>
                    <span className="text-sm font-medium text-foreground">{user.risk_score || 0}/100</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-terminal-card/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Total Deals</span>
                    <span className="text-sm font-medium text-foreground">{user.total_deals || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-terminal-card/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="text-sm font-medium text-foreground">${(user.revenue || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-terminal-border">
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} disabled={isProcessing} className="btn-terminal-accent">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit User
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {user.status === 'pending' && (
                  <>
                    <Button 
                      onClick={() => handleAction('approve')} 
                      disabled={isProcessing}
                      className="bg-data-positive hover:bg-data-positive/90"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      onClick={() => handleAction('reject')} 
                      disabled={isProcessing}
                      variant="outline"
                      className="border-terminal-danger text-terminal-danger hover:bg-terminal-danger/10"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {user.status === 'approved' && (
                  <Button 
                    onClick={() => handleAction('suspend')} 
                    disabled={isProcessing}
                    variant="outline"
                    className="border-terminal-warning text-terminal-warning hover:bg-terminal-warning/10"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Suspend
                  </Button>
                )}
                {user.status === 'suspended' && (
                  <Button 
                    onClick={() => handleAction('activate')} 
                    disabled={isProcessing}
                    className="bg-data-positive hover:bg-data-positive/90"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activate
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'Logged in', time: '2 hours ago', type: 'login' },
                { action: 'Created new quote', time: '4 hours ago', type: 'action' },
                { action: 'Updated profile', time: '1 day ago', type: 'update' },
                { action: 'Uploaded document', time: '2 days ago', type: 'document' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-terminal-card/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'login' ? 'bg-data-positive' :
                      activity.type === 'action' ? 'bg-terminal-info' :
                      activity.type === 'update' ? 'bg-terminal-warning' : 'bg-accent'
                    }`}></div>
                    <span className="text-sm text-foreground">{activity.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">KYC Documents</h3>
            <div className="space-y-3">
              {[
                { name: 'Passport', status: 'approved', uploaded: '2 days ago' },
                { name: 'Pilot License', status: 'pending', uploaded: '1 day ago' },
                { name: 'Insurance Certificate', status: 'approved', uploaded: '3 days ago' }
              ].map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-terminal-card/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{doc.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={doc.status === 'approved' ? 'default' : 'destructive'}>
                      {doc.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Admin Tab */}
          <TabsContent value="admin" className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Admin Notes</h3>
            <Textarea
              value={editData.admin_notes}
              onChange={(e) => setEditData({...editData, admin_notes: e.target.value})}
              placeholder="Add admin notes about this user..."
              className="min-h-[100px]"
            />
            
            <div className="space-y-3">
              <h4 className="text-md font-semibold text-foreground">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Check Sanctions
                </Button>
                <Button variant="outline" className="justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Verify Documents
                </Button>
                <Button variant="outline" className="justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Flag User
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
