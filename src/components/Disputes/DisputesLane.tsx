// Disputes and Refunds Lane - Inside Each Deal
// FCA Compliant Aviation Platform

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  FileText, 
  Clock, 
  CheckCircle, 
  X,
  Upload,
  Download,
  Shield,
  DollarSign,
  Plus,
  Calendar,
  User,
  MessageSquare,
  Plus
} from 'lucide-react';

export interface Dispute {
  id: string;
  dealId: string;
  type: 'payment_dispute' | 'service_dispute' | 'cancellation_dispute';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  initiator: 'broker' | 'operator' | 'pilot' | 'system';
  reason: string;
  description: string;
  evidence: DisputeEvidence[];
  timeline: DisputeEvent[];
  resolution?: {
    type: 'full_refund' | 'partial_refund' | 'no_refund' | 'service_credit';
    amount: number;
    currency: string;
    reason: string;
    resolvedBy: string;
    resolvedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DisputeEvidence {
  id: string;
  type: 'document' | 'image' | 'communication' | 'receipt';
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  description: string;
}

export interface DisputeEvent {
  id: string;
  type: 'created' | 'evidence_added' | 'status_changed' | 'resolution_proposed' | 'resolved';
  description: string;
  actor: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface DisputesLaneProps {
  dealId: string;
  dealType: 'charter' | 'hiring';
  totalAmount: number;
  currency: string;
  broker: string;
  operator: string;
  pilot?: string;
}

export function DisputesLane({ dealId, dealType, totalAmount, currency, broker, operator, pilot }: DisputesLaneProps) {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDispute, setNewDispute] = useState({
    type: 'payment_dispute' as const,
    reason: '',
    description: ''
  });

  const createDispute = () => {
    if (!newDispute.reason || !newDispute.description) {
      alert('Please provide a reason and description');
      return;
    }

    const dispute: Dispute = {
      id: `DISPUTE_${Date.now()}`,
      dealId,
      type: newDispute.type,
      status: 'open',
      initiator: 'broker',
      reason: newDispute.reason,
      description: newDispute.description,
      evidence: [],
      timeline: [{
        id: `EVENT_${Date.now()}`,
        type: 'created',
        description: 'Dispute created',
        actor: 'broker',
        timestamp: new Date().toISOString()
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDisputes(prev => [...prev, dispute]);
    setNewDispute({ type: 'payment_dispute', reason: '', description: '' });
    setShowCreateForm(false);
  };

  const addEvidence = (disputeId: string, evidence: DisputeEvidence) => {
    setDisputes(prev => prev.map(dispute => 
      dispute.id === disputeId 
        ? {
            ...dispute,
            evidence: [...dispute.evidence, evidence],
            timeline: [...dispute.timeline, {
              id: `EVENT_${Date.now()}`,
              type: 'evidence_added',
              description: `Evidence added: ${evidence.name}`,
              actor: 'broker',
              timestamp: new Date().toISOString()
            }]
          }
        : dispute
    ));
  };

  const updateDisputeStatus = (disputeId: string, status: Dispute['status']) => {
    setDisputes(prev => prev.map(dispute => 
      dispute.id === disputeId 
        ? {
            ...dispute,
            status,
            timeline: [...dispute.timeline, {
              id: `EVENT_${Date.now()}`,
              type: 'status_changed',
              description: `Status changed to ${status}`,
              actor: 'system',
              timestamp: new Date().toISOString()
            }],
            updatedAt: new Date().toISOString()
          }
        : dispute
    ));
  };

  const proposeResolution = (disputeId: string, resolution: Dispute['resolution']) => {
    setDisputes(prev => prev.map(dispute => 
      dispute.id === disputeId 
        ? {
            ...dispute,
            resolution,
            status: 'resolved',
            timeline: [...dispute.timeline, {
              id: `EVENT_${Date.now()}`,
              type: 'resolution_proposed',
              description: `Resolution proposed: ${resolution?.type}`,
              actor: 'system',
              timestamp: new Date().toISOString()
            }],
            updatedAt: new Date().toISOString()
          }
        : dispute
    ));
  };

  const getDisputeTypeColor = (type: string) => {
    switch (type) {
      case 'payment_dispute':
        return 'bg-red-900 text-red-100';
      case 'service_dispute':
        return 'bg-yellow-900 text-yellow-100';
      case 'cancellation_dispute':
        return 'bg-blue-900 text-blue-100';
      default:
        return 'bg-purple-900/30 text-purple-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-900 text-red-100';
      case 'investigating':
        return 'bg-yellow-900 text-yellow-100';
      case 'resolved':
        return 'bg-green-100 text-white';
      case 'closed':
        return 'bg-purple-900/30 text-purple-200';
      default:
        return 'bg-purple-900/30 text-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Disputes & Refunds
            </CardTitle>
            <Button
              onClick={() => setShowCreateForm(true)}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Dispute
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {disputes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No disputes for this deal</p>
              <p className="text-sm">Disputes are automatically logged and tracked</p>
            </div>
          ) : (
            <div className="space-y-4">
              {disputes.map(dispute => (
                <Card key={dispute.id} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Dispute #{dispute.id}</h3>
                        <Badge className={getDisputeTypeColor(dispute.type)}>
                          {dispute.type.replace('_', ' ')}
                        </Badge>
                        <Badge className={getStatusColor(dispute.status)}>
                          {dispute.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{dispute.reason}</p>
                      <p className="text-sm">{dispute.description}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>Created: {new Date(dispute.createdAt).toLocaleDateString()}</p>
                      <p>Updated: {new Date(dispute.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Evidence Section */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Evidence ({dispute.evidence.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {dispute.evidence.map(evidence => (
                        <div key={evidence.id} className="flex items-center gap-2 p-2 bg-purple-900/20 rounded border border-purple-700">
                          <FileText className="w-4 h-4 text-white/70" />
                          <span className="text-sm text-white">{evidence.name}</span>
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const evidence: DisputeEvidence = {
                            id: `EVIDENCE_${Date.now()}`,
                            type: 'document',
                            name: 'Evidence Document.pdf',
                            url: '/evidence/placeholder.pdf',
                            uploadedBy: 'broker',
                            uploadedAt: new Date().toISOString(),
                            description: 'Supporting documentation'
                          };
                          addEvidence(dispute.id, evidence);
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Add Evidence
                      </Button>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Timeline</h4>
                    <div className="space-y-2">
                      {dispute.timeline.map(event => (
                        <div key={event.id} className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{event.description}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resolution */}
                  {dispute.resolution && (
                    <div className="mb-4 p-3 bg-slate-800 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Resolution</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <p className="font-medium">{dispute.resolution.type.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <p className="font-medium">{dispute.resolution.currency} {dispute.resolution.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Resolved By:</span>
                          <p className="font-medium">{dispute.resolution.resolvedBy}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Date:</span>
                          <p className="font-medium">{new Date(dispute.resolution.resolvedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {dispute.status === 'open' && (
                      <Button
                        size="sm"
                        onClick={() => updateDisputeStatus(dispute.id, 'investigating')}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Start Investigation
                      </Button>
                    )}
                    {dispute.status === 'investigating' && (
                      <Button
                        size="sm"
                        onClick={() => proposeResolution(dispute.id, {
                          type: 'partial_refund',
                          amount: Math.round(totalAmount * 0.5),
                          currency: currency,
                          reason: 'Partial refund due to service issues',
                          resolvedBy: 'system',
                          resolvedAt: new Date().toISOString()
                        })}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Propose Resolution
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Note
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dispute Form */}
      {showCreateForm && (
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle>Create New Dispute</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="disputeType">Dispute Type</Label>
                <select
                  id="disputeType"
                  value={newDispute.type}
                  onChange={(e) => setNewDispute(prev => ({ ...prev, type: e.target.value as string }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="payment_dispute">Payment Dispute</option>
                  <option value="service_dispute">Service Dispute</option>
                  <option value="cancellation_dispute">Cancellation Dispute</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  value={newDispute.reason}
                  onChange={(e) => setNewDispute(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Brief reason for the dispute"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newDispute.description}
                  onChange={(e) => setNewDispute(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the issue"
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={createDispute}>
                  Create Dispute
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
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
