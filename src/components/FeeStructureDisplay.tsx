import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  Percent,
  Users,
  Briefcase
} from 'lucide-react';
import { FeeStructureValidator, FEE_STRUCTURE_CONSTANTS } from '@/lib/fee-structure';

interface FeeStructureDisplayProps {
  showDetails?: boolean;
  className?: string;
}

export default function FeeStructureDisplay({ showDetails = true, className = '' }: FeeStructureDisplayProps) {
  const feeStructure = FeeStructureValidator.getFeeStructureDisplay();
  const isValid = FeeStructureValidator.validateFeeStructure();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Fee Structure</h3>
        <div className="flex items-center gap-2">
          {isValid ? (
            <Badge className="bg-green-100 text-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Invalid
            </Badge>
          )}
          <Badge variant="outline" className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Locked
          </Badge>
        </div>
      </div>

      {/* Fee Cards */}
      <div className="grid gap-4">
        {/* Broker-Operator Commission */}
        <Card className="border-l-4 border-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-500" />
                <span>{feeStructure.brokerOperator.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">
                  {feeStructure.brokerOperator.percentage}
                </span>
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gunmetal text-sm">
              {feeStructure.brokerOperator.description}
            </p>
            {showDetails && (
              <div className="mt-3 text-xs text-gunmetal">
                <p>• Applied to all completed broker-operator transactions</p>
                <p>• Calculated on gross transaction amount</p>
                <p>• Non-negotiable and locked in system</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Operator Hiring Fee */}
        <Card className="border-l-4 border-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-green-500" />
                <span>{feeStructure.operatorHiring.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {feeStructure.operatorHiring.percentage}
                </span>
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gunmetal text-sm">
              {feeStructure.operatorHiring.description}
            </p>
            {showDetails && (
              <div className="mt-3 text-xs text-gunmetal">
                <p>• Applied when operators hire through platform</p>
                <p>• Calculated on hiring transaction amount</p>
                <p>• Non-negotiable and locked in system</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pilot/Crew Fees */}
        <Card className="border-l-4 border-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span>{feeStructure.pilotCrew.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-purple-600">
                  {feeStructure.pilotCrew.percentage}
                </span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gunmetal text-sm">
              {feeStructure.pilotCrew.description}
            </p>
            {showDetails && (
              <div className="mt-3 text-xs text-gunmetal">
                <p>• Pilots and crew pay nothing to use the platform</p>
                <p>• No transaction fees for pilot/crew activities</p>
                <p>• Always free - guaranteed by system design</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      {showDetails && (
        <Card className="bg-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-4 h-4 text-accent" />
              <span className="font-medium text-foreground">Fee Summary</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-blue-600">
                  {FEE_STRUCTURE_CONSTANTS.BROKER_OPERATOR_COMMISSION}%
                </div>
                <div className="text-gunmetal">Broker-Operator</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-white">
                  {FEE_STRUCTURE_CONSTANTS.OPERATOR_HIRING_FEE}%
                </div>
                <div className="text-gunmetal">Operator Hiring</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">
                  {FEE_STRUCTURE_CONSTANTS.PILOT_CREW_FEE}%
                </div>
                <div className="text-gunmetal">Pilot/Crew</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Notice */}
      <div className="bg-slate-800 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-yellow-800 font-medium">Fee Structure Notice</p>
            <p className="text-yellow-700 text-sm mt-1">
              All fees are locked in the system and cannot be negotiated or modified. 
              This ensures fair and consistent pricing for all users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
