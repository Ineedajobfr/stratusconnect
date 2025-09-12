// Cancellation Engine with UI and Audit
// FCA Compliant Aviation Platform

import React, { useState } from 'react';
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
  Download,
  User,
  Building
} from 'lucide-react';

export interface CancellationEngineProps {
  dealId: string;
  totalAmount: number;
  currency: string;
  departureTime: string;
  broker: string;
  operator: string;
  onCancellationProcessed: (cancellationData: CancellationData) => void;
}

export interface CancellationData {
  cancellationId: string;
  dealId: string;
  totalAmount: number;
  currency: string;
  cancellationFee: number;
  refundAmount: number;
  reason: string;
  processedBy: string;
  timestamp: string;
  auditHash: string;
  status: 'processed' | 'pending' | 'rejected';
}

export function CancellationEngine({ 
  dealId, 
  totalAmount, 
  currency, 
  departureTime, 
  broker, 
  operator, 
  onCancellationProcessed 
}: CancellationEngineProps) {
  const [showCancellationForm, setShowCancellationForm] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateHoursUntilDeparture = (): number => {
    const now = new Date();
    const departure = new Date(departureTime);
    const diffMs = departure.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    return Math.max(0, diffHours);
  };

  const getCancellationFee = (): { feePercentage: number; feeAmount: number; refundAmount: number } => {
    const hoursUntilDeparture = calculateHoursUntilDeparture();
    let feePercentage = 0;
    
    if (hoursUntilDeparture >= 72) {
      feePercentage = 10;
    } else if (hoursUntilDeparture >= 24) {
      feePercentage = 25;
    } else if (hoursUntilDeparture >= 4) {
      feePercentage = 50;
    } else {
      feePercentage = 100;
    }
    
    const feeAmount = Math.round(totalAmount * (feePercentage / 100));
    const refundAmount = totalAmount - feeAmount;
    
    return { feePercentage, feeAmount, refundAmount };
  };

  const processCancellation = async () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { feePercentage, feeAmount, refundAmount } = getCancellationFee();
    
    const cancellationData: CancellationData = {
      cancellationId: `CANCEL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dealId,
      totalAmount,
      currency,
      cancellationFee: feeAmount,
      refundAmount: refundAmount,
      reason: cancellationReason,
      processedBy: 'system',
      timestamp: new Date().toISOString(),
      auditHash: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'processed'
    };

    setIsProcessing(false);
    setShowCancellationForm(false);
    onCancellationProcessed(cancellationData);
    
    alert(`Cancellation processed!\n\nFee: ${currency} ${feeAmount.toLocaleString()} (${feePercentage}%)\nRefund: ${currency} ${refundAmount.toLocaleString()}`);
  };

  const generateCancellationPDF = (cancellationData: CancellationData) => {
    const pdfContent = {
      cancellationId: cancellationData.cancellationId,
      dealId: cancellationData.dealId,
      broker,
      operator,
      totalAmount: cancellationData.totalAmount,
      currency: cancellationData.currency,
      cancellationFee: cancellationData.cancellationFee,
      refundAmount: cancellationData.refundAmount,
      reason: cancellationData.reason,
      processedBy: cancellationData.processedBy,
      timestamp: cancellationData.timestamp,
      auditHash: cancellationData.auditHash,
      hoursUntilDeparture: calculateHoursUntilDeparture(),
      cancellationGrid: {
        '72+ hours': '10% fee',
        '24-72 hours': '25% fee',
        '4-24 hours': '50% fee',
        'Less than 4 hours': '100% fee'
      }
    };

    const blob = new Blob([JSON.stringify(pdfContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cancellation_${cancellationData.cancellationId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hoursUntilDeparture = calculateHoursUntilDeparture();
  const { feePercentage, feeAmount, refundAmount } = getCancellationFee();

  const getFeeColor = (percentage: number) => {
    if (percentage <= 25) return 'text-white';
    if (percentage <= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFeeBadgeColor = (percentage: number) => {
    if (percentage <= 25) return 'bg-green-100 text-white';
    if (percentage <= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Cancellation Grid Display */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Cancellation Policy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Time-Based Fee Structure</h4>
              <div className="space-y-2">
                <div className={`flex justify-between p-2 rounded ${hoursUntilDeparture >= 72 ? 'bg-slate-800 border border-green-200' : 'bg-slate-800'}`}>
                  <span className="text-sm">72+ hours before departure</span>
                  <span className="text-sm font-medium">10% fee</span>
                </div>
                <div className={`flex justify-between p-2 rounded ${hoursUntilDeparture >= 24 && hoursUntilDeparture < 72 ? 'bg-slate-800 border border-yellow-200' : 'bg-slate-800'}`}>
                  <span className="text-sm">24-72 hours before departure</span>
                  <span className="text-sm font-medium">25% fee</span>
                </div>
                <div className={`flex justify-between p-2 rounded ${hoursUntilDeparture >= 4 && hoursUntilDeparture < 24 ? 'bg-slate-800 border border-orange-200' : 'bg-slate-800'}`}>
                  <span className="text-sm">4-24 hours before departure</span>
                  <span className="text-sm font-medium">50% fee</span>
                </div>
                <div className={`flex justify-between p-2 rounded ${hoursUntilDeparture < 4 ? 'bg-slate-800 border border-red-200' : 'bg-slate-800'}`}>
                  <span className="text-sm">Less than 4 hours</span>
                  <span className="text-sm font-medium">100% fee</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Current Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hours until departure:</span>
                  <span className="font-medium">{hoursUntilDeparture}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Applicable fee:</span>
                  <Badge className={getFeeBadgeColor(feePercentage)}>
                    {feePercentage}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cancellation fee:</span>
                  <span className={`font-medium ${getFeeColor(feePercentage)}`}>
                    {currency} {feeAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm text-gray-600">Refund amount:</span>
                  <span className="font-medium text-white">
                    {currency} {refundAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Form */}
      {!showCancellationForm ? (
        <Card className="terminal-card">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Cancel Deal</h3>
              <p className="text-gray-600 mb-4">
                Cancellation will incur a {feePercentage}% fee ({currency} {feeAmount.toLocaleString()})
              </p>
              <Button 
                onClick={() => setShowCancellationForm(true)}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-slate-800"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Deal
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="terminal-card border-red-200 bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Confirm Cancellation</h3>
                <p className="text-red-700">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Reason for Cancellation</label>
                <textarea
                  className="w-full p-3 border rounded-md"
                  rows={3}
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Please provide a detailed reason for cancellation..."
                />
              </div>
              
              <div className="bg-slate-800 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Cancellation Summary</h4>
                <div className="space-y-1 text-sm text-yellow-700">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span>{currency} {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancellation Fee ({feePercentage}%):</span>
                    <span className={getFeeColor(feePercentage)}>{currency} {feeAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span>Refund Amount:</span>
                    <span className="text-white">{currency} {refundAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={processCancellation}
                  disabled={isProcessing || !cancellationReason.trim()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Confirm Cancellation
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => setShowCancellationForm(false)}
                  variant="outline"
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
