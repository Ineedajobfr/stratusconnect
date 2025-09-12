// Broker Help Manual - Universal Compliance Features
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
  Archive
} from 'lucide-react';

export default function BrokerHelpManual() {
  const [activeTab, setActiveTab] = useState('compliance');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Broker Terminal Guide</h1>
        <p className="text-xl text-gray-300">
          Master the elite aviation marketplace with universal compliance and simple pricing
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
          <TabsTrigger value="workflow">Deal Workflow</TabsTrigger>
        </TabsList>

        {/* Universal Compliance */}
        <TabsContent value="compliance" className="space-y-6">
          <Card className="border-slate-400 bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5" />
                Universal Compliance - No Exceptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                <strong>Every deal includes universal compliance features.</strong> No tiers, no add-ons, no opt-outs. 
                This ensures your time is protected and builds trust in the marketplace.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    Deposit Gate
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Contact details are revealed only after deposit payment is confirmed.
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Minimum 5% deposit required</li>
                    <li>• Protects from time-wasters</li>
                    <li>• Ensures serious inquiries only</li>
                  </ul>
                </div>

                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    Signed Quote PDFs
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Every accepted quote generates a legally binding PDF document.
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Includes cancellation grid</li>
                    <li>• Complete terms and conditions</li>
                    <li>• SHA-256 audit hash</li>
                  </ul>
                </div>

                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-purple-600" />
                    Immutable Receipts
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    All receipts include cryptographic audit hashes for verification.
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• SHA-256 hash verification</li>
                    <li>• Tamper-proof records</li>
                    <li>• Complete audit trail</li>
                  </ul>
                </div>

                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Archive className="h-4 w-4 text-red-600" />
                    Evidence Bundles
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    One-click export of all deal documentation for disputes.
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Complete deal documentation</li>
                    <li>• Chat transcripts</li>
                    <li>• Payment receipts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Simple Pricing */}
        <TabsContent value="pricing" className="space-y-6">
          <Card className="border-slate-400 bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="h-5 w-5" />
                Simple Pricing - No Tiers, No Add-ons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-6">
                <strong>One clear pricing structure.</strong> No confusing tiers, no hidden fees, no compliance add-ons.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Plane className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Broker-Operator Deals</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">7%</div>
                  <p className="text-sm text-gray-600">Platform commission on all charter transactions</p>
                  <div className="mt-4 text-xs text-gray-500">
                    <p>Example: £10,000 flight</p>
                    <p>Platform fee: £700</p>
                    <p>Net to operator: £9,300</p>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Operator Hiring</h3>
                  <div className="text-3xl font-bold text-orange-600 mb-2">10%</div>
                  <p className="text-sm text-gray-600">Platform fee when hiring through Stratus</p>
                  <div className="mt-4 text-xs text-gray-500">
                    <p>Example: £5,000 hiring</p>
                    <p>Platform fee: £500</p>
                    <p>Net to operator: £4,500</p>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Pilot & Crew</h3>
                  <div className="text-3xl font-bold text-green-600 mb-2">0%</div>
                  <p className="text-sm text-gray-600">Always free for pilots and crew members</p>
                  <div className="mt-4 text-xs text-gray-500">
                    <p>Example: £2,000 assignment</p>
                    <p>Platform fee: £0</p>
                    <p>Net to pilot: £2,000</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-slate-800 rounded-lg p-4">
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
                    <span>Audit logging</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Programme */}
        <TabsContent value="performance" className="space-y-6">
          <Card className="border-slate-400 bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-5 w-5" />
                Performance Programme - Merit-Based Advantages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-6">
                <strong>Earn visibility and speed advantages through performance.</strong> No safety bypasses, 
                no compliance overrides - just professional recognition for excellence.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    Merit Points System
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Quality RFQ posted</span>
                      <Badge variant="outline">+5 pts</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Quick saved search response</span>
                      <Badge variant="outline">+10 pts</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Quote accepted</span>
                      <Badge variant="outline">+25 pts</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Deal completed on time</span>
                      <Badge variant="outline">+40 pts</Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-600" />
                    Command Ratings
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Bronze</span>
                      <Badge className="bg-amber-600">0+ pts</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Silver</span>
                      <Badge className="bg-gray-400">100+ pts</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Gold</span>
                      <Badge className="bg-yellow-500">250+ pts</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Platinum</span>
                      <Badge className="bg-blue-500">500+ pts</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Diamond</span>
                      <Badge className="bg-purple-600">1000+ pts</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-slate-800 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Perks by Command Rating</h4>
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
                      <li>• Priority support</li>
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
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Important: Ranking Bias Cap
                </h4>
                <p className="text-sm text-yellow-700">
                  Maximum 5% ranking bias applied after all hard filters. Performance Programme never 
                  overrides compliance, safety, or KYC requirements.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deal Workflow */}
        <TabsContent value="workflow" className="space-y-6">
          <Card className="border-slate-400 bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-5 w-5" />
                Complete Deal Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-6">
                <strong>From RFQ to completion with universal compliance at every step.</strong>
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Post RFQ</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Create detailed RFQ with route, aircraft, passengers, and special requirements.
                    </p>
                    <Badge variant="outline" className="text-xs">+5 Merit Points</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-600">2</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Receive Quotes</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Operators respond with quotes. Ranking may reflect recent performance (≤5% bias).
                    </p>
                    <Badge variant="outline" className="text-xs">Universal Compliance Active</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-orange-600">3</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Accept Quote</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Accept quote triggers signed PDF generation with cancellation grid and audit hash.
                    </p>
                    <Badge variant="outline" className="text-xs">+25 Merit Points</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-red-600">4</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Pay Deposit</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Deposit gate activates. Contact details revealed only after payment confirmation.
                    </p>
                    <Badge variant="outline" className="text-xs">Universal Compliance</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-purple-600">5</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Flight Execution</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Flight completed with GPS tracking and completion certificates generated.
                    </p>
                    <Badge variant="outline" className="text-xs">Immutable Records</Badge>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-gray-600">6</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Completion & Receipt</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Immutable receipt generated with SHA-256 hash. Evidence bundle available for disputes.
                    </p>
                    <Badge variant="outline" className="text-xs">+40 Merit Points</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-slate-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Key Benefits for Brokers</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Protected from time-wasters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Legally binding documentation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Instant dispute resolution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Performance recognition</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
