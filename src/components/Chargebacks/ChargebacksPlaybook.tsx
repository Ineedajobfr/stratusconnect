// Chargebacks Playbook - Stripe Evidence to Deal Timeline
// FCA Compliant Aviation Platform

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  FileText, 
  Download, 
  Clock, 
  DollarSign,
  Shield,
  CheckCircle,
  X,
  Eye,
  Calendar,
  User,
  CreditCard,
  Plus,
  Building
} from 'lucide-react';

export interface Chargeback {
  id: string;
  dealId: string;
  stripeDisputeId: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'warning' | 'under_review' | 'won' | 'lost' | 'expired';
  createdAt: string;
  dueDate: string;
  evidence: ChargebackEvidence[];
  timeline: ChargebackEvent[];
}

export interface ChargebackEvidence {
  id: string;
  type: 'receipt' | 'communication' | 'service_documentation' | 'duplicate_charge_documentation';
  name: string;
  description: string;
  url: string;
  uploadedAt: string;
  stripeEvidenceId?: string;
}

export interface ChargebackEvent {
  id: string;
  type: 'created' | 'evidence_submitted' | 'status_changed' | 'won' | 'lost' | 'expired';
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ChargebacksPlaybookProps {
  dealId: string;
  dealType: 'charter' | 'hiring';
  totalAmount: number;
  currency: string;
  broker: string;
  operator: string;
  pilot?: string;
}

export function ChargebacksPlaybook({ dealId, dealType, totalAmount, currency, broker, operator, pilot }: ChargebacksPlaybookProps) {
  const [chargebacks, setChargebacks] = useState<Chargeback[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const createChargeback = (chargebackData: Partial<Chargeback>) => {
    const chargeback: Chargeback = {
      id: `CB_${Date.now()}`,
      dealId,
      stripeDisputeId: `dp_${Date.now()}`,
      amount: totalAmount,
      currency,
      reason: chargebackData.reason || 'fraudulent',
      status: 'warning',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      evidence: [],
      timeline: [{
        id: `EVENT_${Date.now()}`,
        type: 'created',
        description: 'Chargeback created and evidence collection started',
        timestamp: new Date().toISOString()
      }]
    };

    setChargebacks(prev => [...prev, chargeback]);
    setShowCreateForm(false);
  };

  const submitEvidence = (chargebackId: string, evidence: ChargebackEvidence) => {
    setChargebacks(prev => prev.map(cb => 
      cb.id === chargebackId 
        ? {
            ...cb,
            evidence: [...cb.evidence, evidence],
            timeline: [...cb.timeline, {
              id: `EVENT_${Date.now()}`,
              type: 'evidence_submitted',
              description: `Evidence submitted: ${evidence.name}`,
              timestamp: new Date().toISOString()
            }]
          }
        : cb
    ));
  };

  const generateEvidenceBundle = (chargeback: Chargeback) => {
    const evidenceBundle = {
      chargebackId: chargeback.id,
      dealId: chargeback.dealId,
      stripeDisputeId: chargeback.stripeDisputeId,
      amount: chargeback.amount,
      currency: chargeback.currency,
      reason: chargeback.reason,
      evidence: chargeback.evidence,
      timeline: chargeback.timeline,
      dealDetails: {
        broker,
        operator,
        pilot,
        dealType,
        totalAmount,
        currency
      },
      generatedAt: new Date().toISOString(),
      evidenceHash: `evidence_hash_${Date.now()}`
    };

    const bundleData = JSON.stringify(evidenceBundle, null, 2);
    const blob = new Blob([bundleData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chargeback_evidence_${chargeback.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`📦 Evidence Bundle Generated\n\nChargeback: ${chargeback.id}\nEvidence: ${chargeback.evidence.length} items\nHash: ${evidenceBundle.evidenceHash}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'won':
        return 'bg-green-100 text-white';
      case 'lost':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-purple-900/30 text-purple-200';
      default:
        return 'bg-purple-900/30 text-purple-200';
    }
  };

  const getEvidenceTypeIcon = (type: string) => {
    switch (type) {
      case 'receipt':
        return <FileText className="w-4 h-4" />;
      case 'communication':
        return <User className="w-4 h-4" />;
      case 'service_documentation':
        return <Shield className="w-4 h-4" />;
      case 'duplicate_charge_documentation':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Chargebacks Playbook
            </CardTitle>
            <Button
              onClick={() => setShowCreateForm(true)}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Chargeback
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {chargebacks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No chargebacks for this deal</p>
              <p className="text-sm">Chargebacks are automatically tracked and evidence collected</p>
            </div>
          ) : (
            <div className="space-y-4">
              {chargebacks.map(chargeback => (
                <Card key={chargeback.id} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Chargeback #{chargeback.id}</h3>
                        <Badge className={getStatusColor(chargeback.status)}>
                          {chargeback.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {chargeback.currency} {chargeback.amount.toLocaleString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Stripe Dispute: {chargeback.stripeDisputeId}</p>
                      <p className="text-sm text-gray-600">Reason: {chargeback.reason}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>Created: {new Date(chargeback.createdAt).toLocaleDateString()}</p>
                      <p>Due: {new Date(chargeback.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Evidence Section */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Evidence ({chargeback.evidence.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {chargeback.evidence.map(evidence => (
                        <div key={evidence.id} className="flex items-center gap-2 p-2 bg-purple-900/20 rounded border border-purple-700">
                          {getEvidenceTypeIcon(evidence.type)}
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
                          const evidence: ChargebackEvidence = {
                            id: `EVIDENCE_${Date.now()}`,
                            type: 'receipt',
                            name: 'Receipt.pdf',
                            description: 'Transaction receipt',
                            url: '/evidence/receipt.pdf',
                            uploadedAt: new Date().toISOString(),
                            stripeEvidenceId: `ev_${Date.now()}`
                          };
                          submitEvidence(chargeback.id, evidence);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Evidence
                      </Button>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Timeline</h4>
                    <div className="space-y-2">
                      {chargeback.timeline.map(event => (
                        <div key={event.id} className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{event.description}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => generateEvidenceBundle(chargeback)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Generate Evidence Bundle
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Set Reminder
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Chargeback Form */}
      {showCreateForm && (
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle>Create New Chargeback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Reason</label>
                <select
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => {
                    if (e.target.value) {
                      createChargeback({ reason: e.target.value });
                    }
                  }}
                >
                  <option value="">Select reason</option>
                  <option value="fraudulent">Fraudulent</option>
                  <option value="product_not_received">Product Not Received</option>
                  <option value="duplicate_charge">Duplicate Charge</option>
                  <option value="subscription_cancelled">Subscription Cancelled</option>
                  <option value="product_unacceptable">Product Unacceptable</option>
                  <option value="credit_not_processed">Credit Not Processed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
