// Operator Help Manual - Universal Compliance Features
// FCA Compliant Aviation Platform

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  DollarSign, 
  FileText, 
  Download, 
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  BarChart3,
  Users,
  Plane,
  CreditCard,
  Hash,
  Archive,
  TrendingUp,
  Target
} from 'lucide-react';

export default function OperatorHelpManual() {
  const [activeTab, setActiveTab] = useState('compliance');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Operator Terminal Guide</h1>
        <p className="text-xl text-gray-300">
          Mission control for elite aviation operations with universal compliance and merit-based advantages
        </p>
        <Badge className="mt-4 bg-orange-900/20 text-orange-400 border-orange-500/30">
          <Shield className="w-4 h-4 mr-2" />
          Universal Compliance • 7% Platform Fee • Performance Programme
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compliance">Universal Compliance</TabsTrigger>
          <TabsTrigger value="pricing">Simple Pricing</TabsTrigger>
          <TabsTrigger value="performance">Performance Programme</TabsTrigger>
          <TabsTrigger value="workflow">Quote Workflow</TabsTrigger>
        </TabsList>

        {/* Universal Compliance */}
        <TabsContent value="compliance" className="space-y-6">
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <Shield className="h-5 w-5" />
                Universal Compliance - Your Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 mb-4">
                <strong>Every deal includes universal compliance protection.</strong> This protects your business 
                from disputes, ensures serious inquiries, and provides complete audit trails.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    Deposit Gate Protection
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Brokers must pay deposit before accessing your contact details.
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Filters out time-wasters</li>
                    <li>• Ensures serious inquiries only</li>
                    <li>• Protects your contact information</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    Signed Quote PDFs
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Every accepted quote becomes a legally binding document.
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Complete cancellation grid</li>
                    <li>• Terms and conditions</li>
                    <li>• Cryptographic audit hash</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-purple-600" />
                    Immutable Receipts
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    All payments tracked with tamper-proof audit hashes.
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• SHA-256 hash verification</li>
                    <li>• Complete payment trail</li>
                    <li>• Dispute protection</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Archive className="h-4 w-4 text-red-600" />
                    Evidence Bundles
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    One-click export of all deal documentation for disputes.
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Complete deal history</li>
                    <li>• Chat transcripts</li>
                    <li>• Payment confirmations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Simple Pricing */}
        <TabsContent value="pricing" className="space-y-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <DollarSign className="h-5 w-5" />
                Simple Pricing - Clear Revenue Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-6">
                <strong>One clear pricing structure.</strong> No hidden fees, no compliance add-ons, 
                no confusing tiers. You know exactly what you'll receive.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Plane className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-center">Charter Deals</h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">7%</div>
                    <p className="text-sm text-gray-600 mb-4">Platform fee deducted from gross amount</p>
                    <div className="bg-blue-50 rounded-lg p-3 text-sm">
                      <p className="font-medium">Example:</p>
                      <p>Gross: £10,000</p>
                      <p>Platform fee: £700</p>
                      <p className="font-semibold text-blue-600">Net to you: £9,300</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-center">Hiring Deals</h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">10%</div>
                    <p className="text-sm text-gray-600 mb-4">Platform fee for hiring transactions</p>
                    <div className="bg-orange-50 rounded-lg p-3 text-sm">
                      <p className="font-medium">Example:</p>
                      <p>Gross: £5,000</p>
                      <p>Platform fee: £500</p>
                      <p className="font-semibold text-orange-600">Net to you: £4,500</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-lg p-4">
                <h4 className="font-semibold mb-2">What's Included in Every Deal</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Deposit gate protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Signed quote PDFs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Immutable receipts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Evidence bundles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>KYC/AML verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Dispute protection</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-yellow-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  KYC Verification Required
                </h4>
                <p className="text-sm text-yellow-700">
                  You must complete KYC verification before receiving payouts. This includes identity verification, 
                  sanctions screening, and PEP checks. Required for regulatory compliance.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Programme */}
        <TabsContent value="performance" className="space-y-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <BarChart3 className="h-5 w-5" />
                Performance Programme - Earn Recognition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-6">
                <strong>Earn visibility and speed advantages through operational excellence.</strong> 
                Fast quotes, reliable service, and dispute-free operations drive your Command Rating.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    Merit Points for Operators
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Fast quote submission (≤5 min)</span>
                      <Badge variant="outline">+15 pts</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Quote accepted</span>
                      <Badge variant="outline">+25 pts</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Flight completed on time</span>
                      <Badge variant="outline">+40 pts</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Fallthrough recovery</span>
                      <Badge variant="outline">+30 pts</Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Performance Metrics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Response time (median)</span>
                      <Badge variant="outline">Target: ≤5 min</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Quote acceptance rate</span>
                      <Badge variant="outline">Target: ≥80%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>On-time completion</span>
                      <Badge variant="outline">Target: ≥95%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Dispute-free rate</span>
                      <Badge variant="outline">Target: ≥98%</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-lg p-4">
                <h4 className="font-semibold mb-3">Command Rating Benefits</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium mb-2">Gold League</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• +2 minutes early RFQ access</li>
                      <li>• 1.2x more RFQs shown</li>
                      <li>• Priority support</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Platinum League</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• +4 minutes early RFQ access</li>
                      <li>• 1.2x more RFQs shown</li>
                      <li>• Advanced analytics</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Diamond League</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• +6 minutes early RFQ access</li>
                      <li>• 1.2x more RFQs shown</li>
                      <li>• Direct account manager</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-yellow-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-yellow-600" />
                  Ranking Bias Cap
                </h4>
                <p className="text-sm text-yellow-700">
                  Maximum 5% ranking bias applied after all hard filters. Performance Programme never 
                  overrides compliance, safety, or KYC requirements. Your excellence is recognized, 
                  but safety comes first.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quote Workflow */}
        <TabsContent value="workflow" className="space-y-6">
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Clock className="h-5 w-5" />
                Quote Response Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 mb-6">
                <strong>From RFQ notification to completion with universal compliance protection.</strong>
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Receive RFQ</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Get notified of new RFQs. Higher Command Ratings see RFQs earlier (+2 to +6 minutes).
                    </p>
                    <Badge variant="outline" className="text-xs">Universal Compliance Active</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-600">2</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Submit Quote</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Submit detailed quote with pricing, terms, and availability. Fast quotes earn Merit Points.
                    </p>
                    <Badge variant="outline" className="text-xs">+15 Merit Points (if ≤5 min)</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-orange-600">3</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Quote Accepted</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Your quote is accepted. Signed PDF generated with cancellation grid and audit hash.
                    </p>
                    <Badge variant="outline" className="text-xs">+25 Merit Points</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-red-600">4</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Deposit Received</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Broker pays deposit. Contact details exchanged. Deal moves to execution phase.
                    </p>
                    <Badge variant="outline" className="text-xs">Protected Contact Exchange</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-purple-600">5</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Flight Execution</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Execute flight with GPS tracking. Complete on time for maximum Merit Points.
                    </p>
                    <Badge variant="outline" className="text-xs">Immutable Tracking</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-gray-600">6</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Completion & Payment</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Flight completed. Immutable receipt generated. Payment processed to your account.
                    </p>
                    <Badge variant="outline" className="text-xs">+40 Merit Points</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-lg p-4">
                <h4 className="font-semibold mb-2">Key Benefits for Operators</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Serious inquiries only</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Legal protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Dispute resolution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Performance recognition</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Performance Tips
                </h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Respond to RFQs within 5 minutes for Merit Points</p>
                  <p>• Maintain 95%+ on-time completion rate</p>
                  <p>• Keep dispute rate below 2%</p>
                  <p>• Complete KYC verification for payout access</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
