// Deposit Gate with Signed Terms - The Leak Plug
// FCA Compliant Aviation Platform

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Lock, 
  DollarSign, 
  FileText, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  Download,
  User,
  Building
} from 'lucide-react';

export interface DepositGateProps {
  dealId: string;
  totalAmount: number;
  currency: string;
  broker: string;
  operator: string;
  onDepositSuccess: (depositData: DepositData) => void;
}

export interface DepositData {
  depositId: string;
  amount: number;
  currency: string;
  platformFee: number;
  netAmount: number;
  timestamp: string;
  auditHash: string;
  signedTerms: string;
  contactRevealed: boolean;
}

export function DepositGate({ dealId, totalAmount, currency, broker, operator, onDepositSuccess }: DepositGateProps) {
  const [depositAmount, setDepositAmount] = useState(Math.round(totalAmount * 0.05)); // 5% minimum
  const [isProcessing, setIsProcessing] = useState(false);
  const [depositComplete, setDepositComplete] = useState(false);
  const [contactRevealed, setContactRevealed] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const { toast } = useToast();

  const platformFee = Math.round(depositAmount * 0.07);
  const netAmount = depositAmount - platformFee;

  const generateSignedTerms = (): string => {
    const terms = {
      dealId,
      broker,
      operator,
      totalAmount,
      depositAmount,
      currency,
      platformFee,
      netAmount,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent,
      cancellationGrid: {
        '72+ hours': '10% fee',
        '24-72 hours': '25% fee',
        '4-24 hours': '50% fee',
        'Less than 4 hours': '100% fee'
      },
      terms: [
        'Deposit required before contact reveal',
        'Platform fee non-refundable once service window starts',
        'Cancellation fees apply per grid above',
        'All communications watermarked with deal ID',
        'Disputes resolved through platform arbitration'
      ]
    };

    return JSON.stringify(terms, null, 2);
  };

  const processDeposit = async () => {
    setIsProcessing(true);
    
    try {
      // Check if user has deposit capability
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create payment intent via Supabase function
      const { data: paymentData, error } = await supabase.functions.invoke('create-deposit-payment', {
        body: {
          dealId,
          amount: depositAmount,
          currency,
          userId: user.id,
          metadata: {
            deal_id: dealId,
            broker,
            operator,
            deposit_type: 'contact_reveal'
          }
        }
      });

      if (error) throw error;

      setPaymentIntentId(paymentData.payment_intent_id);
      
      const depositData: DepositData = {
        depositId: paymentData.payment_intent_id,
        amount: depositAmount,
        currency,
        platformFee,
        netAmount,
        timestamp: new Date().toISOString(),
        auditHash: paymentData.audit_hash,
        signedTerms: generateSignedTerms(),
        contactRevealed: false
      };

      setDepositComplete(true);
      onDepositSuccess(depositData);
      
      toast({
        title: 'Deposit Created',
        description: 'Payment intent created successfully. Complete payment to reveal contacts.',
      });
    } catch (error) {
      console.error('Deposit processing error:', error);
      toast({
        title: 'Deposit Failed',
        description: error instanceof Error ? error.message : 'Failed to create deposit',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const revealContacts = async () => {
    try {
      if (!paymentIntentId) {
        throw new Error('No payment intent found');
      }

      // Check payment status before revealing contacts
      const { data: paymentStatus, error } = await supabase.functions.invoke('check-payment-status', {
        body: { paymentIntentId }
      });

      if (error) throw error;

      if (!['requires_capture', 'succeeded'].includes(paymentStatus.status)) {
        throw new Error('Payment must be completed before contacts can be revealed');
      }

      setContactRevealed(true);
      
      toast({
        title: 'Contacts Revealed',
        description: 'All communications are now watermarked and audited.',
      });
    } catch (error) {
      console.error('Contact reveal error:', error);
      toast({
        title: 'Cannot Reveal Contacts',
        description: error instanceof Error ? error.message : 'Payment verification failed',
        variant: 'destructive'
      });
    }
  };

  const downloadSignedTerms = () => {
    const terms = generateSignedTerms();
    const blob = new Blob([terms], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signed_terms_${dealId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (contactRevealed) {
    return (
      <Card className="terminal-card border-green-200 bg-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-white" />
            <div>
              <h3 className="text-lg font-semibold text-white">Contacts Revealed</h3>
              <p className="text-white">All communications are now watermarked and audited</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Broker Contact</p>
              <p className="font-medium">{broker}</p>
              <p className="text-sm text-gray-500">john@elitebrokers.com</p>
              <p className="text-sm text-gray-500">+44 20 7123 4567</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Operator Contact</p>
              <p className="font-medium">{operator}</p>
              <p className="text-sm text-gray-500">mike@primewings.com</p>
              <p className="text-sm text-gray-500">+44 20 7654 3210</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Deal ID</p>
              <p className="font-medium font-mono">{dealId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Watermark</p>
              <p className="font-medium font-mono">WM_{dealId}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={downloadSignedTerms} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Terms
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              View Audit Log
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (depositComplete) {
    return (
      <Card className="terminal-card border-blue-200 bg-slate-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Deposit Processed</h3>
              <p className="text-blue-700">Ready to reveal contacts and proceed with deal</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Deposit Amount</p>
              <p className="font-medium">{currency} {depositAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Platform Fee</p>
              <p className="font-medium">{currency} {platformFee.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Net Amount</p>
              <p className="font-medium">{currency} {netAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Audit Hash</p>
              <p className="font-medium font-mono text-xs">audit_123...</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={revealContacts} className="bg-green-600 hover:bg-green-700">
              <Eye className="w-4 h-4 mr-2" />
              Reveal Contacts
            </Button>
            <Button onClick={downloadSignedTerms} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Terms
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="terminal-card border-red-200 bg-slate-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Deposit Required</h3>
            <p className="text-red-700">Contact details will be revealed after deposit is processed</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium mb-3">Deal Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium">{currency} {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Minimum Deposit:</span>
                <span className="font-medium">{currency} {depositAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee (7%):</span>
                <span className="font-medium">{currency} {platformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Net to Operator:</span>
                <span className="font-medium">{currency} {netAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Cancellation Grid</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>72+ hours:</span>
                <span>10% fee</span>
              </div>
              <div className="flex justify-between">
                <span>24-72 hours:</span>
                <span>25% fee</span>
              </div>
              <div className="flex justify-between">
                <span>4-24 hours:</span>
                <span>50% fee</span>
              </div>
              <div className="flex justify-between">
                <span>Less than 4 hours:</span>
                <span>100% fee</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Important Terms</h4>
              <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                <li>• Deposit required before contact reveal</li>
                <li>• Platform fee non-refundable once service window starts</li>
                <li>• All communications watermarked with deal ID</li>
                <li>• Cancellation fees apply per grid above</li>
              </ul>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={processDeposit} 
          disabled={isProcessing}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          {isProcessing ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Processing Deposit...
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4 mr-2" />
              Process Deposit & Reveal Contacts
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
