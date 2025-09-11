import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Shield, DollarSign, Users, AlertTriangle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Terms and Conditions
          </h1>
          <div className="flex items-center justify-center gap-4 text-gunmetal">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Last Updated: January 15, 2025</span>
            </div>
            <Badge variant="outline">Version 1.0</Badge>
          </div>
        </div>

        {/* Terms Content */}
        <div className="space-y-8">
          {/* 1. Definitions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                1. Definitions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                In these Terms and Conditions, the following terms have the meanings set out below:
              </p>
              <div className="grid gap-3">
                <div>
                  <strong className="text-foreground">"Broker"</strong> means a person or entity that arranges aviation services between clients and operators.
                </div>
                <div>
                  <strong className="text-foreground">"Operator"</strong> means a person or entity that provides aviation services including aircraft operations.
                </div>
                <div>
                  <strong className="text-foreground">"Pilot"</strong> means a licensed pilot who operates aircraft.
                </div>
                <div>
                  <strong className="text-foreground">"Crew"</strong> means flight crew members including pilots, co-pilots, and flight attendants.
                </div>
                <div>
                  <strong className="text-foreground">"User"</strong> means any person who accesses or uses the Platform.
                </div>
                <div>
                  <strong className="text-foreground">"Platform"</strong> means the Stratus Connect website, mobile application, and related services.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Platform Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                2. Platform Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                Only verified users may transact on the Platform. All account information must be accurate and up-to-date. 
                Misrepresentation of identity, qualifications, or capabilities will result in immediate account termination.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-medium">Verification Required</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      All users must complete identity verification and provide valid aviation credentials before accessing transaction features.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Use of Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                3. Use of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                Users must comply with all applicable aviation regulations including EASA, CAA UK, and FAA US requirements. 
                Stratus Connect provides connection and payment facilitation services only. We do not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gunmetal ml-4">
                <li>Operate aircraft or provide flight services</li>
                <li>Schedule flights or manage flight operations</li>
                <li>Provide regulatory approvals or certifications</li>
                <li>Guarantee the safety or compliance of any flight</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">Aviation Compliance Notice</p>
                <p className="text-blue-700 text-sm mt-1">
                  Operational aviation compliance rests with Operators and Pilots. Users must ensure they meet all applicable 
                  EASA Air OPS and FAA Part 135 obligations. Stratus Connect is a platform facilitator only.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 4. Fees */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                4. Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                Stratus Connect charges the following fees:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-medium">Broker-Operator Transactions</span>
                    <span className="font-mono font-bold text-accent">7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-medium">Operator Hiring Fee</span>
                    <span className="font-mono font-bold text-accent">10%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-medium">Pilot/Crew Fees</span>
                    <span className="font-mono font-bold text-green-600">0%</span>
                  </div>
                </div>
              </div>
              <p className="text-gunmetal text-sm">
                Commission applies only to completed transactions. No fees are charged for pilot or crew participation.
              </p>
            </CardContent>
          </Card>

          {/* 5. Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                5. Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                All transactions are processed through FCA or EU regulated payment partners using escrow or safeguarded e-money accounts. 
                Stratus Connect never holds client funds directly.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">Regulated Payment Processing</p>
                <p className="text-green-700 text-sm mt-1">
                  Funds are protected until both parties confirm service completion. Digital receipts and immutable audit logs 
                  are issued for every transaction state change.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 6. Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                6. Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                Users must provide accurate identification, licenses, and certifications. False or expired documents will result 
                in account suspension until corrected. All verification documents are subject to periodic review.
              </p>
            </CardContent>
          </Card>

          {/* 7. Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                7. Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                We comply with UK GDPR and the Data Protection Act 2018. Data is encrypted in transit and at rest. 
                We do not sell personal data. Expired documents are deleted unless retention is required by law.
              </p>
              <p className="text-gunmetal">
                Users may access, export, and request deletion of their data through our Data Subject Access Request (DSAR) system.
              </p>
            </CardContent>
          </Card>

          {/* 8. Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                8. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                Stratus Connect provides connection and payment facilitation services only. We are not responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gunmetal ml-4">
                <li>Operational safety of any flight</li>
                <li>Regulatory compliance of flight operations</li>
                <li>Performance or conduct of users</li>
                <li>Third-party service quality</li>
              </ul>
              <p className="text-gunmetal">
                Our liability is limited to fees paid in the twelve months prior to any claim, except where law prohibits such limitation.
              </p>
            </CardContent>
          </Card>

          {/* 9. Dispute Resolution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                9. Dispute Resolution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                Commercial disputes should first use the escrow process. Legal disputes are governed by English law and 
                the courts of England and Wales. Mediation is preferred before litigation.
              </p>
            </CardContent>
          </Card>

          {/* 10. Amendments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                10. Amendments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                We may update these terms with reasonable notice. Continued use confirms acceptance. 
                Material changes require consent where required by law.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Governing Law and Jurisdiction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gunmetal">
                These terms are governed by English law. Any disputes will be subject to the exclusive jurisdiction 
                of the courts of England and Wales.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gunmetal text-sm">
          <p>
            For questions about these terms, please contact our legal team at legal@stratusconnect.com
          </p>
          <p className="mt-2">
            This document is version 1.0, effective January 15, 2025.
          </p>
        </div>
      </div>
    </div>
  );
}