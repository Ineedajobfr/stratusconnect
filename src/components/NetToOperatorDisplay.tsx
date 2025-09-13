// Net to Operator Display - Anti-Circumvention Transparency
// FCA Compliant Aviation Platform

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Shield } from 'lucide-react';
import { calcDealFees, calcHiringFees } from '@/lib/fees';

export interface NetToOperatorDisplayProps {
  grossAmount: number;
  currency: string;
  dealType: 'charter' | 'hiring';
  className?: string;
  showBreakdown?: boolean;
}

export function NetToOperatorDisplay({
  grossAmount,
  currency,
  dealType,
  className = '',
  showBreakdown = true
}: NetToOperatorDisplayProps) {
  // Calculate fees based on deal type
  let fees;
  let feePercentage;
  
  if (dealType === 'charter') {
    fees = calcDealFees(grossAmount, currency);
    feePercentage = 7;
  } else {
    fees = calcHiringFees(grossAmount, currency);
    feePercentage = 10;
  }

  const netAmount = fees.net;
  const platformFee = dealType === 'charter' ? fees.platform : fees.hiring;

  return (
    <Card className={`border-slate-400 bg-slate-900 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-slate-300">Net to Operator</span>
          </div>
          <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-500/30">
            <Shield className="w-3 h-3 mr-1" />
            Protected
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-white">
              {currency} {(netAmount / 100).toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">
              After {feePercentage}% platform fee
            </span>
          </div>
          
          {showBreakdown && (
            <div className="text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Gross Amount:</span>
                <span>{currency} {(grossAmount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee ({feePercentage}%):</span>
                <span className="text-orange-400">{currency} {(platformFee / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Net to You:</span>
                <span className="text-green-400">{currency} {(netAmount / 100).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t border-slate-600">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <TrendingUp className="h-3 w-3" />
            <span>Transparent pricing prevents off-platform circumvention</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Compact version for quote cards
 */
export function NetToOperatorCompact({
  grossAmount,
  currency,
  dealType,
  className = ''
}: NetToOperatorDisplayProps) {
  let fees;
  let feePercentage;
  
  if (dealType === 'charter') {
    fees = calcDealFees(grossAmount, currency);
    feePercentage = 7;
  } else {
    fees = calcHiringFees(grossAmount, currency);
    feePercentage = 10;
  }

  const netAmount = fees.net;

  return (
    <div className={`bg-slate-800 rounded-lg p-3 border border-slate-600 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-400">Net to You</div>
          <div className="text-lg font-bold text-green-400">
            {currency} {(netAmount / 100).toFixed(2)}
          </div>
        </div>
        <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-500/30 text-xs">
          {feePercentage}% fee
        </Badge>
      </div>
    </div>
  );
}

/**
 * Anti-circumvention notice component
 */
export function AntiCircumventionNotice({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-orange-900/20 border border-orange-500/30 rounded-lg p-3 ${className}`}>
      <div className="flex items-start gap-2">
        <Shield className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-orange-300">
          <div className="font-medium mb-1">Anti-Circumvention Protection</div>
          <div>
            Net amounts shown prevent off-platform deals. All parties introduced through Stratus 
            are bound by 12-month non-circumvention terms. Direct dealings trigger off-platform fees.
          </div>
        </div>
      </div>
    </div>
  );
}
