// Cancellation Rules with Timers and Fees
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  X,
  Calendar,
  Timer,
  Percent,
  FileText,
  Plus
} from 'lucide-react';

export interface CancellationRule {
  id: string;
  name: string;
  description: string;
  timeWindow: number; // hours before departure
  feePercentage: number; // percentage of total amount
  feeAmount: number; // fixed fee amount
  currency: string;
  type: 'percentage' | 'fixed' | 'tiered';
  tiers?: CancellationTier[];
  active: boolean;
  createdAt: string;
}

export interface CancellationTier {
  hoursBefore: number;
  feePercentage: number;
  description: string;
}

export interface CancellationRequest {
  id: string;
  dealId: string;
  requestedBy: string;
  requestedAt: string;
  departureTime: string;
  hoursBeforeDeparture: number;
  totalAmount: number;
  currency: string;
  applicableRule: CancellationRule;
  calculatedFee: number;
  refundAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  reason: string;
  processedAt?: string;
}

export interface CancellationRulesProps {
  dealId: string;
  departureTime: string;
  totalAmount: number;
  currency: string;
  onCancellationRequested: (request: CancellationRequest) => void;
}

export function CancellationRules({ dealId, departureTime, totalAmount, currency, onCancellationRequested }: CancellationRulesProps) {
  const [rules, setRules] = useState<CancellationRule[]>([
    {
      id: 'RULE_001',
      name: 'Standard Cancellation',
      description: 'Standard cancellation policy for charter flights',
      timeWindow: 24,
      feePercentage: 25,
      feeAmount: 0,
      currency: 'GBP',
      type: 'percentage',
      active: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'RULE_002',
      name: 'Last Minute Cancellation',
      description: 'Last minute cancellation with higher fees',
      timeWindow: 4,
      feePercentage: 50,
      feeAmount: 0,
      currency: 'GBP',
      type: 'percentage',
      active: true,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'RULE_003',
      name: 'Tiered Cancellation',
      description: 'Tiered cancellation based on time before departure',
      timeWindow: 0,
      feePercentage: 0,
      feeAmount: 0,
      currency: 'GBP',
      type: 'tiered',
      tiers: [
        { hoursBefore: 72, feePercentage: 10, description: '72+ hours before' },
        { hoursBefore: 24, feePercentage: 25, description: '24-72 hours before' },
        { hoursBefore: 4, feePercentage: 50, description: '4-24 hours before' },
        { hoursBefore: 0, feePercentage: 100, description: 'Less than 4 hours' }
      ],
      active: true,
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [cancellationRequests, setCancellationRequests] = useState<CancellationRequest[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    reason: '',
    requestedBy: 'broker'
  });

  const calculateHoursBeforeDeparture = () => {
    const now = new Date();
    const departure = new Date(departureTime);
    const diffMs = departure.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    return Math.max(0, diffHours);
  };

  const getApplicableRule = (): CancellationRule | null => {
    const hoursBefore = calculateHoursBeforeDeparture();
    
    // Find the most specific rule that applies
    const applicableRules = rules.filter(rule => {
      if (rule.type === 'tiered') {
        return rule.tiers && rule.tiers.some(tier => hoursBefore >= tier.hoursBefore);
      } else {
        return hoursBefore <= rule.timeWindow;
      }
    });

    if (applicableRules.length === 0) return null;

    // Return the rule with the smallest time window (most specific)
    return applicableRules.reduce((prev, current) => 
      current.timeWindow < prev.timeWindow ? current : prev
    );
  };

  const calculateCancellationFee = (rule: CancellationRule): number => {
    const hoursBefore = calculateHoursBeforeDeparture();
    
    if (rule.type === 'percentage') {
      return Math.round(totalAmount * (rule.feePercentage / 100));
    } else if (rule.type === 'fixed') {
      return rule.feeAmount;
    } else if (rule.type === 'tiered' && rule.tiers) {
      const applicableTier = rule.tiers.find(tier => hoursBefore >= tier.hoursBefore);
      if (applicableTier) {
        return Math.round(totalAmount * (applicableTier.feePercentage / 100));
      }
    }
    
    return 0;
  };

  const createCancellationRequest = () => {
    if (!newRequest.reason) {
      alert('Please provide a reason for cancellation');
      return;
    }

    const applicableRule = getApplicableRule();
    if (!applicableRule) {
      alert('No cancellation rule applies to this deal');
      return;
    }

    const calculatedFee = calculateCancellationFee(applicableRule);
    const refundAmount = totalAmount - calculatedFee;

    const request: CancellationRequest = {
      id: `CANCEL_${Date.now()}`,
      dealId,
      requestedBy: newRequest.requestedBy,
      requestedAt: new Date().toISOString(),
      departureTime,
      hoursBeforeDeparture: calculateHoursBeforeDeparture(),
      totalAmount,
      currency,
      applicableRule,
      calculatedFee,
      refundAmount,
      status: 'pending',
      reason: newRequest.reason
    };

    setCancellationRequests(prev => [...prev, request]);
    onCancellationRequested(request);
    setNewRequest({ reason: '', requestedBy: 'broker' });
    setShowRequestForm(false);
  };

  const processCancellation = (requestId: string, approved: boolean) => {
    setCancellationRequests(prev => prev.map(req => 
      req.id === requestId 
        ? {
            ...req,
            status: approved ? 'approved' : 'rejected',
            processedAt: new Date().toISOString()
          }
        : req
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'processed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const applicableRule = getApplicableRule();
  const hoursBefore = calculateHoursBeforeDeparture();

  return (
    <div className="space-y-6">
      {/* Current Rule Display */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Cancellation Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          {applicableRule ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{applicableRule.name}</h3>
                  <p className="text-sm text-gray-600">{applicableRule.description}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Hours Before Departure</p>
                  <p className="text-lg font-semibold">{hoursBefore}h</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cancellation Fee</p>
                  <p className="text-lg font-semibold text-red-600">
                    {currency} {calculateCancellationFee(applicableRule).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Refund Amount</p>
                  <p className="text-lg font-semibold text-green-600">
                    {currency} {(totalAmount - calculateCancellationFee(applicableRule)).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fee Percentage</p>
                  <p className="text-lg font-semibold">
                    {applicableRule.type === 'tiered' && applicableRule.tiers
                      ? applicableRule.tiers.find(tier => hoursBefore >= tier.hoursBefore)?.feePercentage || 0
                      : applicableRule.feePercentage}%
                  </p>
                </div>
              </div>

              {applicableRule.type === 'tiered' && applicableRule.tiers && (
                <div>
                  <h4 className="font-medium mb-2">Tiered Fee Structure</h4>
                  <div className="space-y-2">
                    {applicableRule.tiers.map((tier, index) => (
                      <div key={index} className={`flex items-center justify-between p-2 rounded ${
                        hoursBefore >= tier.hoursBefore ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}>
                        <span className="text-sm">{tier.description}</span>
                        <span className="text-sm font-medium">{tier.feePercentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No cancellation rule applies</p>
              <p className="text-sm">This deal cannot be cancelled</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancellation Requests */}
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Cancellation Requests
            </CardTitle>
            <Button
              onClick={() => setShowRequestForm(true)}
              variant="outline"
              size="sm"
              disabled={!applicableRule}
            >
              <Plus className="w-4 h-4 mr-2" />
              Request Cancellation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {cancellationRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No cancellation requests</p>
              <p className="text-sm">Cancellation requests are tracked and processed here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cancellationRequests.map(request => (
                <Card key={request.id} className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Request #{request.id}</h3>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Reason: {request.reason}</p>
                      <p className="text-sm text-gray-600">
                        Requested by: {request.requestedBy} • {new Date(request.requestedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">Fee: {request.currency} {request.calculatedFee.toLocaleString()}</p>
                      <p className="font-medium">Refund: {request.currency} {request.refundAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Hours Before</p>
                      <p className="font-semibold">{request.hoursBeforeDeparture}h</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold">{request.currency} {request.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cancellation Fee</p>
                      <p className="font-semibold text-red-600">{request.currency} {request.calculatedFee.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Refund Amount</p>
                      <p className="font-semibold text-green-600">{request.currency} {request.refundAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => processCancellation(request.id, true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => processCancellation(request.id, false)}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {request.processedAt && (
                    <div className="text-sm text-gray-500">
                      Processed: {new Date(request.processedAt).toLocaleString()}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Request Form */}
      {showRequestForm && (
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle>Request Cancellation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Reason for Cancellation</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Please provide a detailed reason for cancellation"
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Cancellation Fee</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      Cancellation fee: {currency} {applicableRule ? calculateCancellationFee(applicableRule).toLocaleString() : '0'}
                      <br />
                      Refund amount: {currency} {applicableRule ? (totalAmount - calculateCancellationFee(applicableRule)).toLocaleString() : totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={createCancellationRequest}>
                  Submit Request
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRequestForm(false)}
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
