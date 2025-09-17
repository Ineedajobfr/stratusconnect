// Demo Signed Quote PDF - Universal Compliance Feature
// FCA Compliant Aviation Platform

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Download, 
  Shield, 
  Clock, 
  DollarSign,
  User,
  Building,
  Calendar,
  CheckCircle,
  Hash,
  Eye,
  Printer
} from 'lucide-react';
import { calcDealFees, formatFee } from '@/lib/fees';

export default function DemoSignedQuotePDF() {
  const [quoteData] = useState({
    quoteId: 'QUOTE-2025-003',
    dealId: 'DEAL-2025-003',
    timestamp: '2025-01-15T14:30:00Z',
    broker: {
      name: 'Marcus Thompson',
      company: 'Premier Aviation Brokers',
      email: 'marcus@premieraviation.co.uk',
      phone: '+44 20 7946 0958',
      address: '25 Berkeley Square, London W1J 6BR'
    },
    operator: {
      name: 'David Rodriguez',
      company: 'Skyward Aviation Group',
      email: 'david@skywardaviation.com',
      phone: '+44 20 7946 0959',
      address: '15 Aviation Way, London SW1A 1AA'
    },
    flight: {
      route: 'London (EGLL) → Dubai (OMDB)',
      aircraft: 'Global 6000',
      departureDate: '2025-01-25',
      departureTime: '09:00 GMT',
      arrivalDate: '2025-01-25',
      arrivalTime: '18:30 GST',
      passengers: 8,
      duration: '6h 30m'
    },
    financial: {
      totalAmount: 380000, // £3,800 in pennies
      currency: 'GBP',
      platformFee: 26600, // 7% of £3,800
      netToOperator: 353400,
      depositAmount: 19000 // 5% deposit
    },
    cancellationGrid: {
      '48+ hours': '0% cancellation fee',
      '24-48 hours': '25% cancellation fee',
      '12-24 hours': '50% cancellation fee',
      '6-12 hours': '75% cancellation fee',
      '<6 hours': '100% cancellation fee'
    },
    terms: [
      'Flight subject to weather and operational conditions',
      'All passengers must provide valid travel documentation',
      'Catering preferences must be confirmed 24 hours prior',
      'Ground transportation arrangements available on request',
      'Fuel surcharges may apply based on market conditions'
    ],
    compliance: {
      fcaCompliant: true,
      kycVerified: true,
      auditHash: 'sha256:9f8e7d6c5b4a3210fedcba9876543210abcdef123456789',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  const downloadPDF = () => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `signed-quote-${quoteData.quoteId}.pdf`;
    link.click();
  };

  const previewPDF = () => {
    // Simulate PDF preview
    window.open('#', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-slate-400 bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5" />
            Universal Compliance: Signed Quote PDF
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 mb-4">
            <strong>Every accepted quote generates a signed PDF with cancellation grid, terms, and audit hash.</strong> 
            This creates a legally binding document with complete transparency.
          </p>
          
          <div className="bg-slate-800 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-slate-300 font-medium">Quote ID</Label>
                <p className="text-slate-100">{quoteData.quoteId}</p>
              </div>
              <div>
                <Label className="text-slate-300 font-medium">Deal ID</Label>
                <p className="text-slate-100">{quoteData.dealId}</p>
              </div>
              <div>
                <Label className="text-slate-300 font-medium">Route</Label>
                <p className="text-slate-100">{quoteData.flight.route}</p>
              </div>
              <div>
                <Label className="text-slate-300 font-medium">Aircraft</Label>
                <p className="text-slate-100">{quoteData.flight.aircraft}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Signed Quote PDF Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6">
            {/* PDF Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">SIGNED QUOTE</h1>
              <p className="text-sm text-gray-600">Stratus Connect Aviation Platform</p>
              <p className="text-xs text-gray-500 mt-1">
                Generated: {new Date(quoteData.timestamp).toLocaleString()}
              </p>
            </div>

            {/* Quote Details */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Broker Details</h3>
                  <div className="text-sm text-slate-100 space-y-1">
                    <p><strong>{quoteData.broker.name}</strong></p>
                    <p>{quoteData.broker.company}</p>
                    <p>{quoteData.broker.email}</p>
                    <p>{quoteData.broker.phone}</p>
                    <p className="text-xs">{quoteData.broker.address}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Operator Details</h3>
                  <div className="text-sm text-slate-100 space-y-1">
                    <p><strong>{quoteData.operator.name}</strong></p>
                    <p>{quoteData.operator.company}</p>
                    <p>{quoteData.operator.email}</p>
                    <p>{quoteData.operator.phone}</p>
                    <p className="text-xs">{quoteData.operator.address}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Flight Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-100">
                  <div>
                    <p><strong>Route:</strong> {quoteData.flight.route}</p>
                    <p><strong>Aircraft:</strong> {quoteData.flight.aircraft}</p>
                    <p><strong>Passengers:</strong> {quoteData.flight.passengers}</p>
                  </div>
                  <div>
                    <p><strong>Departure:</strong> {quoteData.flight.departureDate} at {quoteData.flight.departureTime}</p>
                    <p><strong>Arrival:</strong> {quoteData.flight.arrivalDate} at {quoteData.flight.arrivalTime}</p>
                    <p><strong>Duration:</strong> {quoteData.flight.duration}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Financial Breakdown</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Gross Amount</span>
                    <span className="font-medium">{formatFee(quoteData.financial.totalAmount, quoteData.financial.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee (7%)</span>
                    <span className="font-medium">{formatFee(quoteData.financial.platformFee, quoteData.financial.currency)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Net to Operator</span>
                    <span>{formatFee(quoteData.financial.netToOperator, quoteData.financial.currency)}</span>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Deposit Required (5%)</span>
                    <span className="font-medium">{formatFee(quoteData.financial.depositAmount, quoteData.financial.currency)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Grid */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Cancellation Terms</h3>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="space-y-1 text-sm">
                  {Object.entries(quoteData.cancellationGrid).map(([timeframe, fee]) => (
                    <div key={timeframe} className="flex justify-between">
                      <span className="font-medium">{timeframe}</span>
                      <span>{fee}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Terms and Conditions</h3>
              <div className="space-y-1 text-sm text-slate-100">
                {quoteData.terms.map((term, index) => (
                  <p key={index} className="flex items-start gap-2">
                    <span className="text-gray-400">•</span>
                    <span>{term}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Compliance Footer */}
            <div className="border-t pt-4 text-xs text-gray-500 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>FCA Compliant Transaction</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-blue-600" />
                <span>KYC Verified: {quoteData.compliance.kycVerified ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-3 w-3 text-gray-600" />
                <span>Audit Hash: {quoteData.compliance.auditHash.substring(0, 16)}...</span>
              </div>
              <div className="text-xs">
                <p>IP Address: {quoteData.compliance.ipAddress}</p>
                <p>User Agent: {quoteData.compliance.userAgent.substring(0, 50)}...</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Button onClick={previewPDF} variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Preview PDF
            </Button>
            <Button onClick={downloadPDF} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={downloadPDF} variant="outline" size="sm">
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Features */}
      <Card className="border-slate-400 bg-slate-900">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-white">Complete Legal Documentation</h4>
              <p className="text-sm text-slate-300 mt-1">
                Every signed quote includes cancellation grids, complete terms, audit hashes, and compliance verification. 
                This creates a legally binding document that protects all parties and ensures complete transparency.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Universal Compliance Notice */}
      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-slate-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-slate-900">Universal Compliance</h4>
              <p className="text-sm text-slate-700 mt-1">
                Signed quote PDFs are generated for <strong>every accepted quote</strong> - no exceptions, no tiers, no add-ons. 
                This ensures complete documentation and legal protection for all transactions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
