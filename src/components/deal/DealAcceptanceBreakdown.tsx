// Deal Acceptance Breakdown - Clean Compliance Display
// FCA Compliant Aviation Platform

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  DollarSign, 
  FileText, 
  Shield, 
  Download,
  CheckCircle,
  Clock,
  MapPin,
  Plane
} from 'lucide-react';
import { calcDealFees, formatFee } from '@/lib/fees';
import { universalComplianceEnforcer } from '@/lib/universal-compliance';

export interface DealAcceptanceBreakdownProps {
  dealId: string;
  route: string;
  aircraft: string;
  departureDate: string;
  totalAmount: number;
  currency: string;
  broker: string;
  operator: string;
  onAccept: () => void;
  onDecline: () => void;
  isProcessing?: boolean;
}

export function DealAcceptanceBreakdown({
  dealId,
  route,
  aircraft,
  departureDate,
  totalAmount,
  currency,
  broker,
  operator,
  onAccept,
  onDecline,
  isProcessing = false
}: DealAcceptanceBreakdownProps) {
  
  const fees = calcDealFees(totalAmount, currency);
  const complianceStatus = universalComplianceEnforcer.getComplianceStatus();

  return (
    <div className="space-y-6">
      {/* Deal Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Deal Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Route</Label>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {route}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Aircraft</Label>
              <p>{aircraft}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Departure</Label>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {new Date(departureDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Parties</Label>
              <p>{broker} → {operator}</p>
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
            <span className="font-medium">{formatFee(fees.gross, currency)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between">
            <span>Platform Fee (7%)</span>
            <span className="font-medium">{formatFee(fees.platform, currency)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-semibold text-lg">
            <span>Net to Operator</span>
            <span>{formatFee(fees.net, currency)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Universal Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Universal Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {universalComplianceEnforcer.getComplianceSummary()}
            </p>
            
            <div className="grid grid-cols-1 gap-2">
              {complianceStatus.map((check) => (
                <div key={check.feature} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{check.description}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Grid Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Cancellation Grid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Standard cancellation terms apply:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>24+ hours: 0% cancellation fee</li>
              <li>12-24 hours: 25% cancellation fee</li>
              <li>6-12 hours: 50% cancellation fee</li>
              <li>&lt;6 hours: 100% cancellation fee</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Deposit Gate Notice */}
      <Card className="border-slate-400 bg-slate-900">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-white">Deposit Required</h4>
              <p className="text-sm text-slate-300 mt-1">
                Contact details will be revealed after deposit payment is confirmed. 
                This ensures serious inquiries only and protects all parties.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          onClick={onAccept} 
          disabled={isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Accept Deal'
          )}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onDecline}
          disabled={isProcessing}
        >
          Decline
        </Button>
      </div>

      {/* Compliance Badge */}
      <div className="text-center">
        <Badge variant="secondary" className="text-xs">
          {universalComplianceEnforcer.getComplianceBadgeText()}
        </Badge>
      </div>
    </div>
  );
}
