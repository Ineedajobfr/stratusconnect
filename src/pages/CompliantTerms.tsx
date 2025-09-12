import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, DollarSign, User, Building, AlertTriangle } from 'lucide-react';

export default function CompliantTerms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms and Conditions</h1>
          
          <div className="space-y-8">
            {/* Compliance Notice */}
            <Card className="border-slate-400 bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white mb-2">Universal Compliance Platform</h3>
                    <p className="text-slate-300 text-sm">
                      Stratus Connect operates as a regulated platform under FCA guidelines with 
                      universal compliance features on every deal: regulated payments through Stripe Connect, 
                      deposit-before-contact, signed terms, immutable receipts, and evidence bundles. 
                      We never hold client funds directly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Non-Circumvention Notice */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Non-Circumvention Agreement</h3>
                    <p className="text-red-800 text-sm mb-3">
                      <strong>CRITICAL:</strong> All parties introduced through Stratus Connect are bound by strict non-circumvention terms.
                    </p>
                    <div className="space-y-2 text-sm text-red-700">
                      <p><strong>12-Month Restriction:</strong> Direct dealings outside Stratus Connect for any party introduced through our platform are prohibited for twelve months from first introduction.</p>
                      <p><strong>Off-Platform Fee:</strong> Violations trigger an off-platform settlement fee equal to our standard platform fee (7% for deals, 10% for hiring) plus reasonable enforcement costs.</p>
                      <p><strong>Evidence by Default:</strong> All contact reveals, file access, and signatures are watermarked and traceable for enforcement purposes.</p>
                      <p><strong>English Law:</strong> This agreement is governed by English law and subject to English jurisdiction.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fee Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Fee Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">Broker-Operator</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">7%</p>
                      <p className="text-sm text-gunmetal">Platform commission on all transactions</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-white" />
                        <span className="font-semibold">Operator Hiring</span>
                      </div>
                      <p className="text-2xl font-bold text-white">10%</p>
                      <p className="text-sm text-gunmetal">Hiring fee when operators hire through platform</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="font-semibold">Pilots & Crew</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-600">0%</p>
                      <p className="text-sm text-gunmetal">Always free for pilots and crew</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Processing */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    All payments are processed through Stripe Connect, a regulated payment service provider 
                    authorized by the Financial Conduct Authority (FCA). Stratus Connect never holds client 
                    funds directly. Our platform fee is automatically deducted by Stripe during the payment 
                    process, ensuring full compliance with FCA safeguarding requirements.
                  </p>
                  
                  <div className="bg-slate-800 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Important Notice</h4>
                        <p className="text-yellow-700 text-sm mt-1">
                          We do not provide escrow services. All funds are processed directly between 
                          parties through Stripe Connect. Our role is limited to facilitating transactions 
                          and collecting our platform fee.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aviation Compliance */}
            <Card>
              <CardHeader>
                <CardTitle>Aviation Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    Stratus Connect is a platform that connects aviation professionals. We do not operate 
                    flights, provide regulatory approvals, or assume operational responsibilities. All 
                    operational compliance remains with the operators and pilots who must maintain:
                  </p>
                  
                  <ul className="list-disc list-inside space-y-2 text-gunmetal">
                    <li>Valid EASA Air Operations certificates</li>
                    <li>FAA Part 135 or equivalent approvals</li>
                    <li>Current pilot licenses and medical certificates</li>
                    <li>Aircraft maintenance and safety compliance</li>
                    <li>Insurance coverage as required by law</li>
                  </ul>
                  
                  <p className="text-gunmetal">
                    We provide document expiry warnings and reminders, but ultimate responsibility for 
                    operational compliance rests with the operators and pilots.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Protection */}
            <Card>
              <CardHeader>
                <CardTitle>Data Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    We process personal data in accordance with the General Data Protection Regulation (GDPR) 
                    and the Data Protection Act 2018. Our data processing activities are designed to comply 
                    with these regulations, though we are not currently ISO 27001 certified.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <h4 className="font-semibold mb-2">Data Rights</h4>
                      <ul className="text-sm text-gunmetal space-y-1">
                        <li>• Right to access your data</li>
                        <li>• Right to rectification</li>
                        <li>• Right to erasure</li>
                        <li>• Right to data portability</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-slate-800 rounded-lg">
                      <h4 className="font-semibold mb-2">Security Measures</h4>
                      <ul className="text-sm text-gunmetal space-y-1">
                        <li>• TLS 1.3 encryption in transit</li>
                        <li>• AES 256 encryption at rest</li>
                        <li>• Role-based access control</li>
                        <li>• Regular security assessments</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Level Agreement */}
            <Card>
              <CardHeader>
                <CardTitle>Service Level Agreement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    We target 99.9% uptime as measured by our monitoring system. Actual uptime and 
                    response times are displayed on our status page and are based on real telemetry 
                    data from UptimeRobot monitoring.
                  </p>
                  
                  <div className="bg-slate-800 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Current Status</h4>
                    <p className="text-blue-700 text-sm">
                      Live uptime and performance metrics are available at{' '}
                      <a href="/status" className="underline">/status</a>. 
                      We do not make static claims about performance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    Stratus Connect's liability is limited to the platform fee collected in the 
                    relevant transaction. We are not liable for:
                  </p>
                  
                  <ul className="list-disc list-inside space-y-2 text-gunmetal">
                    <li>Operational failures of connected parties</li>
                    <li>Regulatory violations by operators or pilots</li>
                    <li>Financial losses beyond our platform fee</li>
                    <li>Third-party service disruptions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    For questions about these terms or to exercise your data rights, please contact:
                  </p>
                  
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="font-semibold">Stratus Connect Limited</p>
                    <p className="text-sm text-gunmetal">
                      Email: legal@stratusconnect.com<br />
                      Address: [Registered Address]<br />
                      Company Number: [Company Number]
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Version Information */}
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gunmetal">Terms and Conditions</p>
                    <p className="text-xs text-gunmetal">Version 1.0 - Effective Date: [Date]</p>
                  </div>
                  <Badge variant="outline">Current</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
