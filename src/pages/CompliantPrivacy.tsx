import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Trash2, Download, AlertTriangle, Clock } from 'lucide-react';

export default function CompliantPrivacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Notice</h1>
          
          <div className="space-y-8">
            {/* Compliance Notice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">GDPR Compliant</h3>
                    <p className="text-blue-700 text-sm">
                      This privacy notice complies with the General Data Protection Regulation (GDPR) 
                      and the Data Protection Act 2018. We process personal data lawfully, fairly, 
                      and transparently.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Controller */}
            <Card>
              <CardHeader>
                <CardTitle>Data Controller</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    Stratus Connect Limited is the data controller for personal data processed through 
                    our platform. We are responsible for determining how and why personal data is processed.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold">Contact Information</p>
                    <p className="text-sm text-gunmetal">
                      Email: privacy@stratusconnect.com<br />
                      Address: [Registered Address]<br />
                      Data Protection Officer: dpo@stratusconnect.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data We Collect */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Data We Collect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Identity Information</h4>
                    <ul className="list-disc list-inside space-y-2 text-gunmetal">
                      <li>Full name and contact details</li>
                      <li>Date of birth and nationality</li>
                      <li>Government-issued ID documents</li>
                      <li>Professional qualifications and licenses</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Financial Information</h4>
                    <ul className="list-disc list-inside space-y-2 text-gunmetal">
                      <li>Bank account details (for payouts)</li>
                      <li>Transaction history and payment records</li>
                      <li>Tax identification numbers</li>
                      <li>Credit and background check results</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Technical Information</h4>
                    <ul className="list-disc list-inside space-y-2 text-gunmetal">
                      <li>IP addresses and device information</li>
                      <li>Browser type and version</li>
                      <li>Usage patterns and preferences</li>
                      <li>Cookies and similar technologies</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Basis */}
            <Card>
              <CardHeader>
                <CardTitle>Legal Basis for Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Contract Performance</h4>
                      <p className="text-sm text-gunmetal">
                        Processing necessary to perform our contract with you, including 
                        facilitating transactions and providing platform services.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Legal Obligation</h4>
                      <p className="text-sm text-gunmetal">
                        Processing required by law, including AML/KYC checks, tax reporting, 
                        and regulatory compliance.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Legitimate Interest</h4>
                      <p className="text-sm text-gunmetal">
                        Processing necessary for our legitimate business interests, including 
                        fraud prevention and platform security.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Consent</h4>
                      <p className="text-sm text-gunmetal">
                        Processing based on your explicit consent, such as marketing 
                        communications and optional features.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Rights */}
            <Card>
              <CardHeader>
                <CardTitle>Your Data Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    Under GDPR, you have the following rights regarding your personal data:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800">Right of Access</h4>
                        <p className="text-blue-700 text-sm">
                          Request a copy of all personal data we hold about you
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-800">Right to Rectification</h4>
                        <p className="text-green-700 text-sm">
                          Correct inaccurate or incomplete personal data
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                      <Trash2 className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800">Right to Erasure</h4>
                        <p className="text-red-700 text-sm">
                          Request deletion of your personal data in certain circumstances
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                      <Download className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-purple-800">Right to Portability</h4>
                        <p className="text-purple-700 text-sm">
                          Receive your data in a structured, machine-readable format
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Exercise Your Rights</h4>
                        <p className="text-yellow-700 text-sm mt-1">
                          To exercise any of these rights, contact us at privacy@stratusconnect.com. 
                          We will respond within 30 days and may require identity verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card>
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    We retain personal data only for as long as necessary for the purposes 
                    for which it was collected:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Financial records</span>
                      <Badge variant="outline">6 years</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">KYC/AML documents</span>
                      <Badge variant="outline">5 years</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Account data</span>
                      <Badge variant="outline">Until account closure + 1 year</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Marketing data</span>
                      <Badge variant="outline">Until consent withdrawn</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    We implement appropriate technical and organizational measures to protect 
                    your personal data:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Technical Measures</h4>
                      <ul className="text-sm text-gunmetal space-y-1">
                        <li>• TLS 1.3 encryption in transit</li>
                        <li>• AES 256 encryption at rest</li>
                        <li>• Regular security assessments</li>
                        <li>• Access controls and authentication</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Organizational Measures</h4>
                      <ul className="text-sm text-gunmetal space-y-1">
                        <li>• Staff training on data protection</li>
                        <li>• Data processing agreements</li>
                        <li>• Incident response procedures</li>
                        <li>• Regular compliance audits</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Transfers */}
            <Card>
              <CardHeader>
                <CardTitle>International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    Some of our service providers may be located outside the UK/EEA. 
                    When we transfer personal data internationally, we ensure appropriate 
                    safeguards are in place:
                  </p>
                  
                  <ul className="list-disc list-inside space-y-2 text-gunmetal">
                    <li>Standard Contractual Clauses (SCCs) with service providers</li>
                    <li>Adequacy decisions by the European Commission</li>
                    <li>Binding Corporate Rules where applicable</li>
                    <li>Explicit consent for specific transfers</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardHeader>
                <CardTitle>Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    We use cookies and similar technologies to enhance your experience 
                    and analyze platform usage. You can control cookie preferences through 
                    our cookie settings.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Cookie Categories</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Essential:</span>
                        <p className="text-blue-700">Required for platform functionality</p>
                      </div>
                      <div>
                        <span className="font-medium">Analytics:</span>
                        <p className="text-blue-700">Help us understand usage patterns</p>
                      </div>
                      <div>
                        <span className="font-medium">Marketing:</span>
                        <p className="text-blue-700">Used for targeted advertising</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gunmetal">
                    If you have questions about this privacy notice or wish to exercise 
                    your data rights, please contact us:
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold">Data Protection Officer</p>
                    <p className="text-sm text-gunmetal">
                      Email: dpo@stratusconnect.com<br />
                      Phone: [Phone Number]<br />
                      Address: [Registered Address]
                    </p>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800">Complaints</h4>
                        <p className="text-red-700 text-sm mt-1">
                          You have the right to lodge a complaint with the Information Commissioner's 
                          Office (ICO) if you believe we have not handled your personal data properly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Version Information */}
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gunmetal">Privacy Notice</p>
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
