// Admin Impersonation with Full Audit
// FCA Compliant Aviation Platform

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  X,
  Eye,
  LogOut,
  FileText,
  Lock,
  Unlock,
  Activity,
  Search
} from 'lucide-react';

export interface ImpersonationSession {
  id: string;
  adminId: string;
  adminName: string;
  targetUserId: string;
  targetUserName: string;
  targetUserRole: string;
  startedAt: string;
  endedAt?: string;
  reason: string;
  actions: ImpersonationAction[];
  status: 'active' | 'ended' | 'expired';
  ipAddress: string;
  userAgent: string;
}

export interface ImpersonationAction {
  id: string;
  sessionId: string;
  action: string;
  description: string;
  timestamp: string;
  details: any;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface AdminImpersonationProps {
  onImpersonationStarted: (session: ImpersonationSession) => void;
  onImpersonationEnded: (session: ImpersonationSession) => void;
}

export function AdminImpersonation({ onImpersonationStarted, onImpersonationEnded }: AdminImpersonationProps) {
  const [sessions, setSessions] = useState<ImpersonationSession[]>([]);
  const [showStartForm, setShowStartForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSession, setNewSession] = useState({
    targetUserId: '',
    targetUserName: '',
    reason: '',
    duration: 60 // minutes
  });

  const startImpersonation = () => {
    if (!newSession.targetUserId || !newSession.reason) {
      alert('Please provide target user ID and reason');
      return;
    }

    const session: ImpersonationSession = {
      id: `IMP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      adminId: 'admin_001',
      adminName: 'Admin User',
      targetUserId: newSession.targetUserId,
      targetUserName: newSession.targetUserName,
      targetUserRole: 'broker',
      startedAt: new Date().toISOString(),
      reason: newSession.reason,
      actions: [{
        id: `ACTION_${Date.now()}`,
        sessionId: '',
        action: 'impersonation_started',
        description: 'Impersonation session started',
        timestamp: new Date().toISOString(),
        details: {
          reason: newSession.reason,
          duration: newSession.duration
        },
        riskLevel: 'high'
      }],
      status: 'active',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };

    // Update the action with session ID
    session.actions[0].sessionId = session.id;

    setSessions(prev => [...prev, session]);
    onImpersonationStarted(session);
    
    setNewSession({ targetUserId: '', targetUserName: '', reason: '', duration: 60 });
    setShowStartForm(false);

    // Auto-end session after duration
    setTimeout(() => {
      endImpersonation(session.id);
    }, newSession.duration * 60 * 1000);
  };

  const endImpersonation = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const updatedSession: ImpersonationSession = {
      ...session,
      endedAt: new Date().toISOString(),
      status: 'ended',
      actions: [...session.actions, {
        id: `ACTION_${Date.now()}`,
        sessionId: sessionId,
        action: 'impersonation_ended',
        description: 'Impersonation session ended',
        timestamp: new Date().toISOString(),
        details: {
          reason: 'Session completed or manually ended'
        },
        riskLevel: 'medium'
      }]
    };

    setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
    onImpersonationEnded(updatedSession);
  };

  const logAction = (sessionId: string, action: string, description: string, details: any, riskLevel: ImpersonationAction['riskLevel'] = 'low') => {
    const newAction: ImpersonationAction = {
      id: `ACTION_${Date.now()}`,
      sessionId,
      action,
      description,
      timestamp: new Date().toISOString(),
      details,
      riskLevel
    };

    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, actions: [...session.actions, newAction] }
        : session
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'ended':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSessions = sessions.filter(session => 
    session.targetUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.targetUserId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Active Sessions */}
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Admin Impersonation
            </CardTitle>
            <Button
              onClick={() => setShowStartForm(true)}
              variant="outline"
              size="sm"
            >
              <User className="w-4 h-4 mr-2" />
              Start Impersonation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No impersonation sessions</p>
              <p className="text-sm">Start a session to impersonate a user for support</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map(session => (
                <Card key={session.id} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Session #{session.id}</h3>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                        <Badge variant="outline">
                          {session.targetUserRole}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Impersonating: {session.targetUserName} ({session.targetUserId})
                      </p>
                      <p className="text-sm text-gray-600">
                        Reason: {session.reason}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>Started: {new Date(session.startedAt).toLocaleString()}</p>
                      {session.endedAt && (
                        <p>Ended: {new Date(session.endedAt).toLocaleString()}</p>
                      )}
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Admin</p>
                      <p className="font-semibold">{session.adminName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Target User</p>
                      <p className="font-semibold">{session.targetUserName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Actions</p>
                      <p className="font-semibold">{session.actions.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold">
                        {session.endedAt 
                          ? `${Math.round((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 60000)} min`
                          : `${Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000)} min`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Actions Log */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Actions Log ({session.actions.length})</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {session.actions.map(action => (
                        <div key={action.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                          <Badge className={getRiskColor(action.riskLevel)}>
                            {action.riskLevel}
                          </Badge>
                          <span className="text-gray-600">{action.description}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">{new Date(action.timestamp).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Session Actions */}
                  {session.status === 'active' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => logAction(session.id, 'view_deals', 'Viewed user deals', { dealCount: 5 }, 'low')}
                        variant="outline"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Deals
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => logAction(session.id, 'view_payments', 'Viewed payment history', { paymentCount: 12 }, 'medium')}
                        variant="outline"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Payments
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => logAction(session.id, 'modify_settings', 'Modified user settings', { setting: 'notification_preferences' }, 'high')}
                        variant="outline"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Modify Settings
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => endImpersonation(session.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        End Session
                      </Button>
                    </div>
                  )}

                  {session.status === 'ended' && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Session ended</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Start Impersonation Form */}
      {showStartForm && (
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle>Start Impersonation Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="targetUserId">Target User ID</Label>
                <Input
                  id="targetUserId"
                  value={newSession.targetUserId}
                  onChange={(e) => setNewSession(prev => ({ ...prev, targetUserId: e.target.value }))}
                  placeholder="Enter user ID to impersonate"
                />
              </div>
              
              <div>
                <Label htmlFor="targetUserName">Target User Name</Label>
                <Input
                  id="targetUserName"
                  value={newSession.targetUserName}
                  onChange={(e) => setNewSession(prev => ({ ...prev, targetUserName: e.target.value }))}
                  placeholder="Enter user name"
                />
              </div>
              
              <div>
                <Label htmlFor="reason">Reason for Impersonation</Label>
                <Input
                  id="reason"
                  value={newSession.reason}
                  onChange={(e) => setNewSession(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Enter reason for impersonation"
                />
              </div>
              
              <div>
                <Label htmlFor="duration">Session Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newSession.duration}
                  onChange={(e) => setNewSession(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                  min="1"
                  max="480"
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Security Notice</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      All impersonation actions are logged and audited. 
                      Only impersonate users when necessary for support purposes.
                      Sessions will automatically expire after the specified duration.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={startImpersonation}>
                  <Shield className="w-4 h-4 mr-2" />
                  Start Impersonation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowStartForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
