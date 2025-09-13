import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Plane, 
  Shield,
  Calendar,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AviationDocument {
  id: string;
  type: 'pilot_license' | 'medical_certificate' | 'type_rating' | 'insurance' | 'aoc' | 'part_135';
  name: string;
  number: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired';
  daysUntilExpiry: number;
  regulatoryAuthority: 'FAA' | 'EASA' | 'CAA' | 'Other';
  requiredFor: string[];
}

interface AviationComplianceProps {
  userRole: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
  userId?: string;
}

export default function AviationCompliance({ userRole, userId }: AviationComplianceProps) {
  const [documents, setDocuments] = useState<AviationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, [userId, loadDocuments]);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      // In a real implementation, this would load from the database
      // For now, we'll use mock data
      const mockDocuments: AviationDocument[] = [
        {
          id: '1',
          type: 'pilot_license',
          name: 'Commercial Pilot License',
          number: 'CPL-123456',
          issuedBy: 'FAA',
          issueDate: '2020-01-15',
          expiryDate: '2025-01-15',
          status: 'valid',
          daysUntilExpiry: 365,
          regulatoryAuthority: 'FAA',
          requiredFor: ['pilot', 'operator'],
        },
        {
          id: '2',
          type: 'medical_certificate',
          name: 'First Class Medical Certificate',
          number: 'MED-789012',
          issuedBy: 'FAA',
          issueDate: '2024-01-01',
          expiryDate: '2025-01-01',
          status: 'expiring',
          daysUntilExpiry: 30,
          regulatoryAuthority: 'FAA',
          requiredFor: ['pilot'],
        },
        {
          id: '3',
          type: 'type_rating',
          name: 'Boeing 737 Type Rating',
          number: 'TR-345678',
          issuedBy: 'EASA',
          issueDate: '2023-06-01',
          expiryDate: '2025-06-01',
          status: 'valid',
          daysUntilExpiry: 150,
          regulatoryAuthority: 'EASA',
          requiredFor: ['pilot'],
        },
      ];
      
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: "Error",
        description: "Failed to load aviation documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getDocumentTypeLabel = (type: AviationDocument['type']) => {
    switch (type) {
      case 'pilot_license':
        return 'Pilot License';
      case 'medical_certificate':
        return 'Medical Certificate';
      case 'type_rating':
        return 'Type Rating';
      case 'insurance':
        return 'Insurance';
      case 'aoc':
        return 'Air Operator Certificate';
      case 'part_135':
        return 'Part 135 Certificate';
      default:
        return type;
    }
  };

  const getStatusIcon = (status: AviationDocument['status']) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-white" />;
      case 'expiring':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: AviationDocument['status']) => {
    switch (status) {
      case 'valid':
        return 'bg-green-900/20 text-green-400 border-green-500/30';
      case 'expiring':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30';
      case 'expired':
        return 'bg-red-900/20 text-red-400 border-red-500/30';
      default:
        return 'bg-purple-900/30 text-purple-200';
    }
  };

  const getRegulatoryAuthorityInfo = (authority: AviationDocument['regulatoryAuthority']) => {
    switch (authority) {
      case 'FAA':
        return {
          name: 'Federal Aviation Administration',
          website: 'https://www.faa.gov',
          region: 'United States',
        };
      case 'EASA':
        return {
          name: 'European Union Aviation Safety Agency',
          website: 'https://www.easa.europa.eu',
          region: 'European Union',
        };
      case 'CAA':
        return {
          name: 'Civil Aviation Authority',
          website: 'https://www.caa.co.uk',
          region: 'United Kingdom',
        };
      default:
        return {
          name: 'Other Regulatory Authority',
          website: '#',
          region: 'Various',
        };
    }
  };

  const getComplianceRequirements = () => {
    const requirements = {
      broker: [
        'Valid business license',
        'Insurance coverage',
        'Compliance with aviation regulations',
      ],
      operator: [
        'Air Operator Certificate (AOC)',
        'Part 135 Certificate (if applicable)',
        'Insurance coverage',
        'Maintenance program approval',
        'Operations manual approval',
      ],
      pilot: [
        'Commercial Pilot License',
        'Medical Certificate (current)',
        'Type Ratings (as required)',
        'Currency requirements',
        'Training records',
      ],
      crew: [
        'Crew member certificate',
        'Medical certificate (if required)',
        'Training records',
        'Security clearance (if required)',
      ],
    };

    return requirements[userRole] || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-gunmetal">Loading aviation compliance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Aviation Compliance</h2>
        <Button
          onClick={() => setShowAddDocument(true)}
          className="btn-terminal-accent"
        >
          <FileText className="w-4 h-4 mr-2" />
          Add Document
        </Button>
      </div>

      {/* Compliance Notice */}
      <Card className="bg-slate-800 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Compliance Notice</h3>
              <p className="text-blue-700 text-sm mt-1">
                Stratus Connect is a platform facilitator only. Operational aviation compliance 
                rests with Operators and Pilots. Users must ensure they meet all applicable 
                EASA Air OPS and FAA Part 135 obligations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Regulatory Requirements for {userRole.charAt(0).toUpperCase() + userRole.slice(1)}s
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getComplianceRequirements().map((requirement, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-white" />
                <span className="text-gunmetal">{requirement}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Aviation Documents</h3>
        
        {documents.map((document) => (
          <Card key={document.id} className="terminal-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    {getStatusIcon(document.status)}
                    {getDocumentTypeLabel(document.type)}
                  </CardTitle>
                  <p className="text-gunmetal text-sm mt-1">
                    {document.name} - {document.number}
                  </p>
                </div>
                <Badge className={getStatusColor(document.status)}>
                  {document.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Issued By</Label>
                  <p className="text-foreground text-sm">{document.issuedBy}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Issue Date</Label>
                  <p className="text-foreground text-sm">
                    {new Date(document.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Expiry Date</Label>
                  <p className="text-foreground text-sm">
                    {new Date(document.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Days Until Expiry</Label>
                  <p className="text-foreground text-sm font-mono">
                    {document.daysUntilExpiry} days
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gunmetal">Regulatory Authority:</span>
                  <a
                    href={getRegulatoryAuthorityInfo(document.regulatoryAuthority).website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline flex items-center gap-1"
                  >
                    {getRegulatoryAuthorityInfo(document.regulatoryAuthority).name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Renewal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expiry Warnings */}
      {documents.some(doc => doc.status === 'expiring' || doc.status === 'expired') && (
        <Card className="border-yellow-200 bg-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              Document Expiry Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documents
                .filter(doc => doc.status === 'expiring' || doc.status === 'expired')
                .map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-2 bg-blue-900/30 rounded border border-blue-700">
                    <div>
                      <span className="font-medium text-foreground">
                        {getDocumentTypeLabel(document.type)} - {document.number}
                      </span>
                      <span className="text-gunmetal text-sm ml-2">
                        {document.status === 'expired' 
                          ? 'Expired' 
                          : `Expires in ${document.daysUntilExpiry} days`
                        }
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      Renew Now
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Regulatory Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Regulatory Authority Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <a
              href="https://www.faa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-purple-900/20"
            >
              <Plane className="w-4 h-4 text-blue-500" />
              <div>
                <p className="font-medium text-foreground">Federal Aviation Administration (FAA)</p>
                <p className="text-gunmetal text-sm">United States aviation regulations</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </a>
            
            <a
              href="https://www.easa.europa.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-purple-900/20"
            >
              <Plane className="w-4 h-4 text-blue-500" />
              <div>
                <p className="font-medium text-foreground">European Union Aviation Safety Agency (EASA)</p>
                <p className="text-gunmetal text-sm">European aviation regulations</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </a>
            
            <a
              href="https://www.caa.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-purple-900/20"
            >
              <Plane className="w-4 h-4 text-blue-500" />
              <div>
                <p className="font-medium text-foreground">Civil Aviation Authority (CAA)</p>
                <p className="text-gunmetal text-sm">United Kingdom aviation regulations</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Add Document Dialog */}
      {showAddDocument && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <CardContent className="bg-blue-900/30 p-6 rounded-lg max-w-md w-full mx-4 border border-blue-700">
            <h3 className="text-lg font-semibold text-foreground mb-4">Add Aviation Document</h3>
            <p className="text-gunmetal text-sm mb-4">
              This feature would allow users to upload and manage their aviation documents.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAddDocument(false)}
                className="btn-terminal-accent"
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
