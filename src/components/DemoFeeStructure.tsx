import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DollarSign, 
  Building, 
  User, 
  Calculator,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { calcDealFees, calcHiringFees, calcPilotCrewFees, getFeePercentage } from '@/lib/fees';

export default function DemoFeeStructure() {
  const [transactionAmount, setTransactionAmount] = useState(50000);
  const [transactionType, setTransactionType] = useState('broker-operator');

  const isDemoMode = import.meta.env.VITE_SC_DEMO_MODE === 'true';

  const calculateFees = () => {
    let platformFee = 0;
    let feePercent = 0;
    
    if (transactionType === 'broker-operator') {
      const fees = calcDealFees(transactionAmount);
      platformFee = fees.platform;
      feePercent = getFeePercentage('charter');
    } else if (transactionType === 'operator-hiring') {
      const fees = calcHiringFees(transactionAmount);
      platformFee = fees.hiring;
      feePercent = getFeePercentage('hiring');
    } else if (transactionType === 'pilot-crew') {
      const fees = calcPilotCrewFees(transactionAmount);
      platformFee = fees.platform;
      feePercent = getFeePercentage('pilot-crew');
    }
    
    const netAmount = transactionAmount - platformFee;
    
    return {
      platformFee,
      feePercent,
      netAmount,
      transactionAmount
    };
  };

  const fees = calculateFees();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Fee Structure Calculator</h2>
        <Badge className="bg-green-900/30 text-white">
          <Shield className="w-3 h-3 mr-1" />
          FCA Compliant
        </Badge>
      </div>

      {/* Compliance Notice */}
      <Card className="bg-purple-900/20 border-purple-700">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-white mt-0.5" />
            <div>
              <h3 className="font-medium text-white">Transparent Fee Structure</h3>
              <p className="text-white/70 text-sm mt-1">
                All fees are clearly disclosed and automatically calculated. No hidden charges. 
                Platform fees are deducted by Stripe Connect during payment processing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fee Structure Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center p-4">
          <div className="flex items-center justify-center mb-2">
            <Building className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-foreground">Broker-Operator</h3>
          <p className="text-3xl font-bold text-blue-600">7%</p>
          <p className="text-sm text-gunmetal">Platform commission</p>
        </Card>
        
        <Card className="text-center p-4">
          <div className="flex items-center justify-center mb-2">
            <User className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-semibold text-foreground">Operator Hiring</h3>
          <p className="text-3xl font-bold text-white">10%</p>
          <p className="text-sm text-gunmetal">Hiring fee</p>
        </Card>
        
        <Card className="text-center p-4">
          <div className="flex items-center justify-center mb-2">
            <User className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="font-semibold text-foreground">Pilots & Crew</h3>
          <p className="text-3xl font-bold text-gray-600">0%</p>
          <p className="text-sm text-gunmetal">Always free</p>
        </Card>
      </div>

      {/* Fee Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Fee Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Transaction Amount</Label>
              <Input
                id="amount"
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(Number(e.target.value))}
                placeholder="Enter amount"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Transaction Type</Label>
              <select
                id="type"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="broker-operator">Broker-Operator Deal</option>
                <option value="operator-hiring">Operator Hiring</option>
                <option value="pilot-crew">Pilot/Crew (Free)</option>
              </select>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="bg-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gunmetal">Transaction Amount</span>
              <span className="font-mono font-semibold">
                ${fees.transactionAmount.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gunmetal">Platform Fee ({fees.feePercent}%)</span>
              <span className="font-mono font-semibold text-red-600">
                -${fees.platformFee.toLocaleString()}
              </span>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-foreground font-semibold">Net Amount</span>
                <span className="font-mono font-bold text-white text-lg">
                  ${fees.netAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Fee Explanation */}
          <div className="text-sm text-gunmetal">
            {transactionType === 'broker-operator' && (
              <p>
                <strong>Broker-Operator Deal:</strong> 7% platform commission automatically deducted 
                by Stripe Connect during payment processing. No additional fees.
              </p>
            )}
            {transactionType === 'operator-hiring' && (
              <p>
                <strong>Operator Hiring:</strong> 10% hiring fee when operators hire pilots or crew 
                through the platform. Charged only on successful hires.
              </p>
            )}
            {transactionType === 'pilot-crew' && (
              <p>
                <strong>Pilots & Crew:</strong> Always free. No platform fees for pilots and crew members.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Processing Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payment Processing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Stripe Connect</h4>
                <ul className="text-sm text-gunmetal space-y-1">
                  <li>• FCA regulated payment processing</li>
                  <li>• Automatic fee deduction</li>
                  <li>• No custody of client funds</li>
                  <li>• Real-time transaction tracking</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Compliance</h4>
                <ul className="text-sm text-gunmetal space-y-1">
                  <li>• KYC verification required</li>
                  <li>• Sanctions screening</li>
                  <li>• Audit logging</li>
                  <li>• Receipt generation</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Notice */}
      {isDemoMode && (
        <Card className="bg-purple-900/20 border-purple-700">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-white">Demo Mode</h3>
                <p className="text-white/70 text-sm mt-1">
                  This calculator demonstrates the fee structure. In production, fees are 
                  automatically calculated and deducted by Stripe Connect during payment processing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
