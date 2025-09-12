// Demo Evidence Bundle - Universal Compliance Feature
// FCA Compliant Aviation Platform

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  Zap,
  Hash,
  Archive,
  ChevronDown
} from 'lucide-react';

export default function DemoEvidenceBundle() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [bundleGenerated, setBundleGenerated] = useState(false);
  
  const dealData = {
    dealId: 'DEAL-2025-002',
    route: 'New York (KJFK) → London (EGLL)',
    aircraft: 'Gulfstream G650',
    amount: 450000, // £4,500 in pennies
    currency: 'GBP',
    broker: 'Sarah Chen',
    operator: 'Atlantic Aviation Group',
    disputeId: 'DISPUTE-2025-001'
  };

  const evidenceFiles = [
    {
      id: 'evidence-001',
      type: 'signed_quote',
      title: 'Signed Quote PDF',
      content: 'Complete quote with cancellation grid, terms, and SHA-256 hash',
      timestamp: '2025-01-15T10:30:00Z',
      hash: 'sha256:a1b2c3d4e5f6...',
      size: '2.3 MB'
    },
    {
      id: 'evidence-002',
      type: 'chat_transcript',
      title: 'Complete Chat Transcript',
      content: 'Full conversation between broker and operator',
      timestamp: '2025-01-15T10:45:00Z',
      hash: 'sha256:f6e5d4c3b2a1...',
      size: '156 KB'
    },
    {
      id: 'evidence-003',
      type: 'timeline',
      title: 'Deal Timeline',
      content: 'Chronological log of all deal events and milestones',
      timestamp: '2025-01-15T11:00:00Z',
      hash: 'sha256:9876543210ab...',
      size: '89 KB'
    },
    {
      id: 'evidence-004',
      type: 'receipts',
      title: 'Payment Receipts',
      content: 'Stripe payment confirmations and transfer records',
      timestamp: '2025-01-15T11:15:00Z',
      hash: 'sha256:abcdef123456...',
      size: '445 KB'
    },
    {
      id: 'evidence-005',
      type: 'cancellation_grid',
      title: 'Cancellation Terms',
      content: 'Time-based cancellation fee structure',
      timestamp: '2025-01-15T10:30:00Z',
      hash: 'sha256:fedcba654321...',
      size: '67 KB'
    },
    {
      id: 'evidence-006',
      type: 'gps_proof',
      title: 'Flight Tracking Data',
      content: 'GPS coordinates and flight path verification',
      timestamp: '2025-01-15T14:30:00Z',
      hash: 'sha256:123456789abc...',
      size: '1.2 MB'
    },
    {
      id: 'evidence-007',
      type: 'completion_proof',
      title: 'Completion Certificate',
      content: 'Signed completion certificate with timestamps',
      timestamp: '2025-01-15T16:45:00Z',
      hash: 'sha256:abc123def456...',
      size: '234 KB'
    }
  ];

  const generateBundle = async () => {
    setIsGenerating(true);
    
    // Simulate bundle generation
    setTimeout(() => {
      setIsGenerating(false);
      setBundleGenerated(true);
    }, 3000);
  };

  const downloadBundle = () => {
    // Simulate bundle download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `evidence-bundle-${dealData.dealId}-${dealData.disputeId}.zip`;
    link.click();
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'signed_quote':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'chat_transcript':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'timeline':
        return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'receipts':
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'cancellation_grid':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'gps_proof':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'completion_proof':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-slate-400 bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Archive className="h-5 w-5" />
            Universal Compliance: Evidence Bundle Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 mb-4">
            <strong>One-click evidence bundle generation for all deals.</strong> Complete audit trail with SHA-256 hashes for instant dispute resolution.
          </p>
          
          <div className="bg-slate-800 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-slate-300 font-medium">Deal ID</Label>
                <p className="text-slate-100">{dealData.dealId}</p>
              </div>
              <div>
                <Label className="text-slate-300 font-medium">Dispute ID</Label>
                <p className="text-slate-100">{dealData.disputeId}</p>
              </div>
              <div>
                <Label className="text-slate-300 font-medium">Route</Label>
                <p className="text-slate-100">{dealData.route}</p>
              </div>
              <div>
                <Label className="text-slate-300 font-medium">Amount</Label>
                <p className="text-slate-100">£{(dealData.amount / 100).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Files */}
      <Card className="border-slate-400 bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5" />
            Evidence Files ({evidenceFiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {evidenceFiles.map((file) => (
              <Collapsible key={file.id}>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between p-3 h-auto border border-slate-600 bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div className="text-left">
                        <p className="font-medium">{file.title}</p>
                        <p className="text-sm text-slate-300">{file.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-slate-700 border-slate-500 text-slate-200">
                        <Hash className="h-3 w-3 mr-1" />
                        {file.hash.substring(0, 12)}...
                      </Badge>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="border border-slate-600 border-t-0 rounded-b-lg bg-slate-800">
                  <div className="p-3 text-sm text-slate-300">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(file.timestamp).toLocaleString()}
                      </span>
                      <span>{file.size}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      <p className="font-mono break-all">{file.hash}</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bundle Generation */}
      <Card className="border-slate-400 bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            {bundleGenerated ? <CheckCircle className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
            {bundleGenerated ? 'Bundle Ready' : 'Generate Evidence Bundle'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!bundleGenerated ? (
            <>
              <div className="space-y-3">
                <p className="text-slate-300">
                  Click below to generate a complete evidence bundle with all deal documentation, 
                  chat transcripts, payment receipts, and audit hashes.
                </p>
                
                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="font-medium mb-2 text-white">Bundle Contents:</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Signed quote PDF with cancellation grid</li>
                    <li>• Complete chat transcript</li>
                    <li>• Chronological deal timeline</li>
                    <li>• Payment receipts and transfers</li>
                    <li>• GPS flight tracking data</li>
                    <li>• Completion certificates</li>
                    <li>• SHA-256 audit hashes for all files</li>
                  </ul>
                </div>
              </div>

              <Button 
                onClick={generateBundle} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Generating Bundle...
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4 mr-2" />
                    Generate Evidence Bundle
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Evidence bundle generated successfully</span>
              </div>
              
              <div className="bg-white rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Bundle Details</h4>
                    <p className="text-sm text-gray-600">Ready for download</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <Hash className="h-3 w-3 mr-1" />
                    SHA-256 Verified
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Files:</span> {evidenceFiles.length}
                  </div>
                  <div>
                    <span className="font-medium">Size:</span> 4.5 MB
                  </div>
                  <div>
                    <span className="font-medium">Generated:</span> {new Date().toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Hash:</span> 
                    <span className="font-mono text-xs"> sha256:a1b2c3d4e5f6...</span>
                  </div>
                </div>
              </div>

              <Button onClick={downloadBundle} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Evidence Bundle (ZIP)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dispute Resolution Benefits */}
      <Card className="border-slate-400 bg-slate-900">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-white">Instant Dispute Resolution</h4>
              <p className="text-sm text-slate-300 mt-1">
                This evidence bundle can be submitted to Stripe within <strong>2 minutes</strong> of a dispute notification. 
                Every file includes SHA-256 hashes for cryptographic verification. No gaps, no missing data, no delays.
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
                Evidence bundle export is available on <strong>every deal</strong> - no exceptions, no tiers, no add-ons. 
                This ensures you're always protected and can resolve disputes quickly and professionally.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
