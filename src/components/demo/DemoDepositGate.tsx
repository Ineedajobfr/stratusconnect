// Demo Deposit Gate - Universal Compliance Feature
// FCA Compliant Aviation Platform

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Building,
  CreditCard
} from 'lucide-react';
import { calcDealFees, formatFee } from '@/lib/fees';

export default function DemoDepositGate() {
  const [dealData] = useState({
    dealId: 'DEAL-2025-001',
    route: 'London (EGLL) → Paris (LFPG)',
    aircraft: 'Citation X',
    departureDate: '2025-01-20',
    totalAmount: 250000, // £2,500 in pennies
    currency: 'GBP',
    broker: 'James Mitchell',
    operator: 'Elite Aviation Services'
  });

  const [depositAmount, setDepositAmount] = useState(Math.round(dealData.totalAmount * 0.05));
  const [isProcessing, setIsProcessing] = useState(false);
  const [depositComplete, setDepositComplete] = useState(false);
  const [contactRevealed, setContactRevealed] = useState(false);

  const fees = calcDealFees(dealData.totalAmount, dealData.currency);

  const processDeposit = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setDepositComplete(true);
      
      // Simulate contact reveal after deposit
      setTimeout(() => {
        setContactRevealed(true);
      }, 1000);
    }, 2000);
  };

  const downloadSignedQuote = () => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `signed-quote-${dealData.dealId}.pdf`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Deal Summary */}
      <Card className="border-slate-400 bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5" />
            Universal Compliance: Deposit Gate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 mb-4">
            <strong>Every deal requires a deposit before contact details are revealed.</strong> This ensures serious inquiries only and protects all parties from time-wasters.
          </p>
          
          <div className="bg-slate-800 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-slate-300 font-medium">Route</Label>
                <p className="text-slate-100">{dealData.route}</p>
              </div>
              <div>
                <Label className="text-slate-300 font-medium">Aircraft</Label>
                <p className="text-slate-100">{dealData.aircraft}</p>
              </div>
              <div>
                <Label className="text-slate-300 font-medium">Departure</Label>
                <p className="text-slate-100">{dealData.departureDate}</p>
              </div>
              <div>
                <Label className="text-slate-300 font-medium">Parties</Label>
                <p className="text-slate-100">{dealData.broker} → {dealData.operator}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Gross Amount</span>
            <span className="font-medium">{formatFee(fees.gross, dealData.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee (7%)</span>
            <span className="font-medium">{formatFee(fees.platform, dealData.currency)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Net to Operator</span>
            <span>{formatFee(fees.net, dealData.currency)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Deposit Gate */}
      <Card className={`border-2 ${depositComplete ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${depositComplete ? 'text-green-800' : 'text-red-800'}`}>
            {depositComplete ? <CheckCircle className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
            {depositComplete ? 'Deposit Verified' : 'Deposit Required'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!depositComplete ? (
            <>
              <div className="space-y-3">
                <Label htmlFor="deposit-amount">Deposit Amount (Minimum 5%)</Label>
                <div className="flex gap-2">
                  <Input
                    id="deposit-amount"
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="flex-1"
                    min={Math.round(dealData.totalAmount * 0.05)}
                    max={dealData.totalAmount}
                  />
                  <Badge variant="outline">{formatFee(depositAmount, dealData.currency)}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Contact details will be revealed after deposit payment is confirmed.
                </p>
              </div>

              <Button 
                onClick={processDeposit} 
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Deposit
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Deposit of {formatFee(depositAmount, dealData.currency)} confirmed</span>
              </div>
              
              {contactRevealed && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">Contact Details Unlocked</span>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <p className="font-medium">James Mitchell</p>
                        <p className="text-sm text-gray-600">james.mitchell@elitebrokers.co.uk</p>
                        <p className="text-sm text-gray-600">+44 20 7946 0958</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Elite Aviation Services</p>
                        <p className="text-sm text-gray-600">contact@eliteaviation.com</p>
                        <p className="text-sm text-gray-600">+44 20 7946 0959</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signed Quote PDF */}
      {depositComplete && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-900">Signed Quote PDF Generated</h4>
                  <p className="text-sm text-blue-700">Includes cancellation grid, terms, and audit hash</p>
                </div>
              </div>
              <Button onClick={downloadSignedQuote} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Notice */}
      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-slate-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-slate-900">Universal Compliance</h4>
              <p className="text-sm text-slate-700 mt-1">
                This deposit gate is active on <strong>every deal</strong> to ensure serious inquiries only. 
                No exceptions, no tiers, no opt-outs. This protects your time and builds trust in the marketplace.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
