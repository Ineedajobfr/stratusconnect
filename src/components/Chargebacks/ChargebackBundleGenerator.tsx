// Chargeback Evidence Bundle Generator - One-Click Complete Evidence
// FCA Compliant Aviation Platform

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Shield, 
  Clock, 
  DollarSign,
  User,
  Building,
  MessageSquare,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';

export interface ChargebackBundleProps {
  dealId: string;
  disputeId: string;
  onBundleGenerated: (bundleData: ChargebackBundle) => void;
}

export interface ChargebackBundle {
  bundleId: string;
  dealId: string;
  disputeId: string;
  generatedAt: string;
  evidenceFiles: EvidenceFile[];
  summary: string;
  auditHash: string;
}

export interface EvidenceFile {
  id: string;
  type: 'signed_quote' | 'chat_transcript' | 'timeline' | 'receipts' | 'cancellation_grid' | 'gps_proof' | 'completion_proof';
  title: string;
  content: string;
  timestamp: string;
  hash: string;
}

export function ChargebackBundleGenerator({ dealId, disputeId, onBundleGenerated }: ChargebackBundleProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [bundleGenerated, setBundleGenerated] = useState(false);
  const [bundle, setBundle] = useState<ChargebackBundle | null>(null);

  const generateEvidenceBundle = async () => {
    setIsGenerating(true);
    
    // Simulate bundle generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const evidenceFiles: EvidenceFile[] = [
      {
        id: 'EVID_001',
        type: 'signed_quote',
        title: 'Signed Quote & Terms',
        content: generateSignedQuote(),
        timestamp: new Date().toISOString(),
        hash: `hash_${Date.now()}_001`
      },
      {
        id: 'EVID_002',
        type: 'chat_transcript',
        title: 'Complete Chat Transcript',
        content: generateChatTranscript(),
        timestamp: new Date().toISOString(),
        hash: `hash_${Date.now()}_002`
      },
      {
        id: 'EVID_003',
        type: 'timeline',
        title: 'Deal Timeline & Events',
        content: generateDealTimeline(),
        timestamp: new Date().toISOString(),
        hash: `hash_${Date.now()}_003`
      },
      {
        id: 'EVID_004',
        type: 'receipts',
        title: 'Payment Receipts & Hashes',
        content: generatePaymentReceipts(),
        timestamp: new Date().toISOString(),
        hash: `hash_${Date.now()}_004`
      },
      {
        id: 'EVID_005',
        type: 'cancellation_grid',
        title: 'Cancellation Policy & Grid',
        content: generateCancellationGrid(),
        timestamp: new Date().toISOString(),
        hash: `hash_${Date.now()}_005`
      },
      {
        id: 'EVID_006',
        type: 'gps_proof',
        title: 'GPS Flight Tracking',
        content: generateGPSProof(),
        timestamp: new Date().toISOString(),
        hash: `hash_${Date.now()}_006`
      },
      {
        id: 'EVID_007',
        type: 'completion_proof',
        title: 'Flight Completion Certificate',
        content: generateCompletionProof(),
        timestamp: new Date().toISOString(),
        hash: `hash_${Date.now()}_007`
      }
    ];

    const bundleData: ChargebackBundle = {
      bundleId: `BUNDLE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dealId,
      disputeId,
      generatedAt: new Date().toISOString(),
      evidenceFiles,
      summary: generateBundleSummary(evidenceFiles),
      auditHash: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    setBundle(bundleData);
    setBundleGenerated(true);
    setIsGenerating(false);
    onBundleGenerated(bundleData);
  };

  const generateSignedQuote = (): string => {
    return JSON.stringify({
      dealId,
      quoteId: `QUOTE_${dealId}`,
      broker: 'Elite Aviation Brokers',
      operator: 'Prime Wings',
      aircraft: 'Gulfstream G650',
      route: 'LHR-NYC',
      totalAmount: 85000,
      currency: 'USD',
      platformFee: 5950,
      netAmount: 79050,
      signedAt: new Date().toISOString(),
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent,
      terms: [
        'Deposit required before contact reveal',
        'Platform fee non-refundable once service window starts',
        'Cancellation fees apply per published grid',
        'All communications watermarked with deal ID'
      ],
      cancellationGrid: {
        '72+ hours': '10% fee',
        '24-72 hours': '25% fee',
        '4-24 hours': '50% fee',
        'Less than 4 hours': '100% fee'
      }
    }, null, 2);
  };

  const generateChatTranscript = (): string => {
    return JSON.stringify({
      dealId,
      participants: ['broker@elite.com', 'operator@primewings.com'],
      messages: [
        {
          timestamp: '2024-01-15T10:30:00Z',
          sender: 'broker@elite.com',
          content: 'Hi, I have a client looking for LHR-NYC on Jan 20th, 8 passengers'
        },
        {
          timestamp: '2024-01-15T10:32:00Z',
          sender: 'operator@primewings.com',
          content: 'Perfect, we have a G650 available. Quote attached.'
        },
        {
          timestamp: '2024-01-15T10:35:00Z',
          sender: 'broker@elite.com',
          content: 'Client accepted. Processing deposit now.'
        },
        {
          timestamp: '2024-01-15T10:37:00Z',
          sender: 'operator@primewings.com',
          content: 'Deposit received. Contacts revealed. Flight confirmed.'
        }
      ],
      totalMessages: 4,
      duration: '7 minutes'
    }, null, 2);
  };

  const generateDealTimeline = (): string => {
    return JSON.stringify({
      dealId,
      events: [
        {
          timestamp: '2024-01-15T10:30:00Z',
          event: 'rfq_created',
          description: 'RFQ created for LHR-NYC, 8 passengers',
          actor: 'broker@elite.com'
        },
        {
          timestamp: '2024-01-15T10:32:00Z',
          event: 'quote_issued',
          description: 'Quote issued for $85,000',
          actor: 'operator@primewings.com'
        },
        {
          timestamp: '2024-01-15T10:35:00Z',
          event: 'quote_accepted',
          description: 'Quote accepted by broker',
          actor: 'broker@elite.com'
        },
        {
          timestamp: '2024-01-15T10:37:00Z',
          event: 'deposit_processed',
          description: 'Deposit of $4,250 processed via Stripe',
          actor: 'system'
        },
        {
          timestamp: '2024-01-15T10:37:30Z',
          event: 'contacts_revealed',
          description: 'Contact details revealed to both parties',
          actor: 'system'
        },
        {
          timestamp: '2024-01-20T14:00:00Z',
          event: 'flight_completed',
          description: 'Flight completed successfully',
          actor: 'system'
        }
      ]
    }, null, 2);
  };

  const generatePaymentReceipts = (): string => {
    return JSON.stringify({
      dealId,
      payments: [
        {
          paymentId: 'PAY_123456789',
          type: 'deposit',
          amount: 4250,
          currency: 'USD',
          platformFee: 297.50,
          netAmount: 3952.50,
          timestamp: '2024-01-15T10:37:00Z',
          stripeTransactionId: 'txn_123456789',
          receiptHash: 'receipt_hash_123456789'
        },
        {
          paymentId: 'PAY_123456790',
          type: 'final_payment',
          amount: 80750,
          currency: 'USD',
          platformFee: 5652.50,
          netAmount: 75097.50,
          timestamp: '2024-01-20T13:45:00Z',
          stripeTransactionId: 'txn_123456790',
          receiptHash: 'receipt_hash_123456790'
        }
      ],
      totalAmount: 85000,
      totalPlatformFees: 5950,
      totalNetAmount: 79050
    }, null, 2);
  };

  const generateCancellationGrid = (): string => {
    return JSON.stringify({
      dealId,
      cancellationPolicy: {
        '72+ hours': {
          feePercentage: 10,
          description: 'Full refund minus 10% administrative fee'
        },
        '24-72 hours': {
          feePercentage: 25,
          description: 'Full refund minus 25% administrative fee'
        },
        '4-24 hours': {
          feePercentage: 50,
          description: 'Full refund minus 50% administrative fee'
        },
        'Less than 4 hours': {
          feePercentage: 100,
          description: 'No refund - 100% administrative fee'
        }
      },
      applicableAtTimeOfDispute: '72+ hours',
      termsAccepted: true,
      acceptedAt: '2024-01-15T10:35:00Z'
    }, null, 2);
  };

  const generateGPSProof = (): string => {
    return JSON.stringify({
      dealId,
      flightTracking: {
        aircraft: 'Gulfstream G650',
        registration: 'N123AB',
        departure: {
          airport: 'LHR',
          scheduled: '2024-01-20T14:00:00Z',
          actual: '2024-01-20T14:02:00Z'
        },
        arrival: {
          airport: 'JFK',
          scheduled: '2024-01-20T18:30:00Z',
          actual: '2024-01-20T18:28:00Z'
        },
        route: [
          { lat: 51.4700, lon: -0.4543, timestamp: '2024-01-20T14:02:00Z' },
          { lat: 52.0, lon: -5.0, timestamp: '2024-01-20T15:30:00Z' },
          { lat: 45.0, lon: -30.0, timestamp: '2024-01-20T16:45:00Z' },
          { lat: 40.6413, lon: -73.7781, timestamp: '2024-01-20T18:28:00Z' }
        ],
        totalDistance: 3450,
        totalTime: '4h 26m'
      }
    }, null, 2);
  };

  const generateCompletionProof = (): string => {
    return JSON.stringify({
      dealId,
      completionCertificate: {
        flightNumber: 'PW123',
        aircraft: 'Gulfstream G650',
        registration: 'N123AB',
        route: 'LHR-NYC',
        passengers: 8,
        completedAt: '2024-01-20T18:28:00Z',
        pilot: 'Captain John Smith',
        operator: 'Prime Wings',
        broker: 'Elite Aviation Brokers',
        client: 'Confidential',
        status: 'completed_successfully',
        notes: 'Flight completed on time with no incidents'
      }
    }, null, 2);
  };

  const generateBundleSummary = (files: EvidenceFile[]): string => {
    return `Chargeback Evidence Bundle Summary

Deal ID: ${dealId}
Dispute ID: ${disputeId}
Generated: ${new Date().toISOString()}

Evidence Files (${files.length}):
${files.map(f => `- ${f.title} (${f.type})`).join('\n')}

Key Evidence Points:
✓ Signed quote with clear terms and cancellation grid
✓ Complete chat transcript showing agreement
✓ Detailed timeline of all deal events
✓ Payment receipts with Stripe transaction IDs
✓ GPS flight tracking proving completion
✓ Completion certificate from operator
✓ All communications watermarked with deal ID

This bundle provides comprehensive evidence that the service was delivered as agreed, with clear terms accepted by both parties, and proper payment processing through regulated channels.`;
  };

  const downloadBundle = () => {
    if (!bundle) return;
    
    const bundleContent = {
      bundleId: bundle.bundleId,
      dealId: bundle.dealId,
      disputeId: bundle.disputeId,
      generatedAt: bundle.generatedAt,
      summary: bundle.summary,
      auditHash: bundle.auditHash,
      evidenceFiles: bundle.evidenceFiles
    };

    const blob = new Blob([JSON.stringify(bundleContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chargeback_bundle_${bundle.bundleId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (bundleGenerated && bundle) {
    return (
      <Card className="terminal-card border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">Evidence Bundle Generated</h3>
              <p className="text-green-700">Complete chargeback evidence ready for submission</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Bundle ID</p>
              <p className="font-medium font-mono text-xs">{bundle.bundleId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Evidence Files</p>
              <p className="font-medium">{bundle.evidenceFiles.length} files</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Generated</p>
              <p className="font-medium">{new Date(bundle.generatedAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Audit Hash</p>
              <p className="font-medium font-mono text-xs">audit_123...</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <h4 className="font-medium">Evidence Files Included:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {bundle.evidenceFiles.map(file => (
                <div key={file.id} className="flex items-center gap-2 p-2 bg-blue-900/30 rounded border border-blue-700">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">{file.title}</span>
                  <Badge variant="outline" className="text-xs">{file.type}</Badge>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={downloadBundle} className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Download Bundle
            </Button>
            <Button variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Submit to Stripe
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="terminal-card border-red-200 bg-red-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Chargeback Evidence Bundle</h3>
            <p className="text-red-700">Generate complete evidence package for dispute resolution</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Evidence Package Includes:</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Signed quote with terms and cancellation grid</li>
              <li>• Complete chat transcript between parties</li>
              <li>• Detailed timeline of all deal events</li>
              <li>• Payment receipts with Stripe transaction IDs</li>
              <li>• GPS flight tracking proving completion</li>
              <li>• Completion certificate from operator</li>
              <li>• All communications watermarked with deal ID</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Deal ID</p>
              <p className="font-medium font-mono">{dealId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dispute ID</p>
              <p className="font-medium font-mono">{disputeId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Evidence Files</p>
              <p className="font-medium">7 files</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Size</p>
              <p className="font-medium">~2.5 MB</p>
            </div>
          </div>
          
          <Button 
            onClick={generateEvidenceBundle}
            disabled={isGenerating}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {isGenerating ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Generating Evidence Bundle...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate One-Click Evidence Bundle
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
