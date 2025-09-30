import StratusConnectHeader from '@/components/StratusConnectHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Database, Download, Eye, Lock, Shield, Trash2 } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <StratusConnectHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Privacy Notice
          </h1>
          <div className="flex items-center justify-center gap-4 text-gunmetal">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Last Updated: January 15, 2025</span>
            </div>
            <Badge variant="outline">GDPR Compliant</Badge>
          </div>
        </div>

        {/* Privacy Content */}
        <div className="space-y-8">
          {/* Controller Identity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Controller Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                Stratus Connect Limited is the data controller for personal data processed through our platform.
              </p>
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="font-medium text-foreground">Contact Information</p>
                <p className="text-gunmetal text-sm mt-1">
                  Email: privacy@stratusconnect.com<br />
                  Address: [Registered Office Address]<br />
                  Data Protection Officer: dpo@stratusconnect.com
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Categories of Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Categories of Personal Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                We collect and process the following categories of personal data:
              </p>
              <div className="grid gap-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-foreground">Identity Data</h4>
                  <p className="text-gunmetal text-sm">Name, date of birth, nationality, passport/ID numbers</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-foreground">Contact Data</h4>
                  <p className="text-gunmetal text-sm">Email address, phone number, postal address</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-medium text-foreground">Aviation Credentials</h4>
                  <p className="text-gunmetal text-sm">Pilot licenses, medical certificates, type ratings, training records</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-foreground">Financial Data</h4>
                  <p className="text-gunmetal text-sm">Bank account details, payment history, transaction records</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-medium text-foreground">Technical Data</h4>
                  <p className="text-gunmetal text-sm">IP address, browser type, device information, usage patterns</p>
                </div>
              </div>
              
              <div className="bg-slate-800 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-medium">No Profiling Data</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      We do not collect or process psychometric testing data, personality profiles, or behavioral analytics.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purposes and Legal Bases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Purposes and Legal Bases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium text-foreground">Purpose</th>
                      <th className="text-left p-2 font-medium text-foreground">Legal Basis</th>
                      <th className="text-left p-2 font-medium text-foreground">Data Categories</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="p-2 text-gunmetal">Account creation and management</td>
                      <td className="p-2 text-gunmetal">Contract</td>
                      <td className="p-2 text-gunmetal">Identity, Contact</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 text-gunmetal">Identity verification</td>
                      <td className="p-2 text-gunmetal">Legal obligation</td>
                      <td className="p-2 text-gunmetal">Identity, Aviation Credentials</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 text-gunmetal">Payment processing</td>
                      <td className="p-2 text-gunmetal">Contract</td>
                      <td className="p-2 text-gunmetal">Financial, Identity</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 text-gunmetal">Service delivery</td>
                      <td className="p-2 text-gunmetal">Contract</td>
                      <td className="p-2 text-gunmetal">All categories</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 text-gunmetal">Compliance monitoring</td>
                      <td className="p-2 text-gunmetal">Legal obligation</td>
                      <td className="p-2 text-gunmetal">Aviation Credentials, Financial</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 text-gunmetal">Security and fraud prevention</td>
                      <td className="p-2 text-gunmetal">Legitimate interests</td>
                      <td className="p-2 text-gunmetal">Technical, Identity</td>
                    </tr>
                    <tr>
                      <td className="p-2 text-gunmetal">Marketing communications</td>
                      <td className="p-2 text-gunmetal">Consent</td>
                      <td className="p-2 text-gunmetal">Contact</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Retention Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Retention Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                We retain personal data only as long as necessary for the purposes outlined above:
              </p>
              <div className="grid gap-3">
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-foreground font-medium">Account Data</span>
                  <span className="text-gunmetal">Until account closure + 7 years</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-foreground font-medium">Financial Records</span>
                  <span className="text-gunmetal">7 years (legal requirement)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-foreground font-medium">Aviation Credentials</span>
                  <span className="text-gunmetal">Until expiry + 2 years</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-foreground font-medium">Marketing Data</span>
                  <span className="text-gunmetal">Until consent withdrawn</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                  <span className="text-foreground font-medium">Technical Data</span>
                  <span className="text-gunmetal">2 years</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Subject Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Your Data Subject Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                Under UK GDPR, you have the following rights regarding your personal data:
              </p>
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Right of Access</h4>
                    <p className="text-gunmetal text-sm">Request copies of your personal data</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Right to Portability</h4>
                    <p className="text-gunmetal text-sm">Receive your data in a structured, machine-readable format</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Trash2 className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Right to Erasure</h4>
                    <p className="text-gunmetal text-sm">Request deletion of your personal data</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Right to Restriction</h4>
                    <p className="text-gunmetal text-sm">Request limitation of processing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Right to Object</h4>
                    <p className="text-gunmetal text-sm">Object to processing based on legitimate interests</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">Exercise Your Rights</p>
                <p className="text-blue-700 text-sm mt-1">
                  To exercise any of these rights, contact us at privacy@stratusconnect.com or use our DSAR portal. 
                  We will respond within 30 days.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                International Transfers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                Some of our service providers may be located outside the UK/EU. When we transfer personal data internationally, 
                we ensure adequate protection through:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gunmetal ml-4">
                <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                <li>Adequacy decisions by the European Commission</li>
                <li>Other appropriate safeguards as required by law</li>
              </ul>
            </CardContent>
          </Card>

          {/* Security Measures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security Measures
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                We implement appropriate technical and organizational measures to protect your personal data:
              </p>
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span className="text-gunmetal">AES-256 encryption at rest</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span className="text-gunmetal">TLS 1.3 encryption in transit</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span className="text-gunmetal">Row-level security for data access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span className="text-gunmetal">Multi-factor authentication</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span className="text-gunmetal">Regular security audits</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Contact and Complaints
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                If you have questions about this privacy notice or wish to exercise your rights, contact us:
              </p>
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="font-medium text-foreground">Data Protection Officer</p>
                <p className="text-gunmetal text-sm mt-1">
                  Email: dpo@stratusconnect.com<br />
                  Phone: [Contact Number]
                </p>
              </div>
              <p className="text-gunmetal">
                You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) 
                if you believe we have not handled your personal data in accordance with the law.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gunmetal text-sm">
          <p>
            This privacy notice is effective from January 15, 2025. We will notify you of any material changes.
          </p>
        </div>
      </div>
    </div>
  );
}