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

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

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
        return 'Document';
    }
  };

  const getStatusIcon = (status: AviationDocument['status']) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expiring':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: AviationDocument['status']) => {
    switch (status) {
      case 'valid':
        return 'default';
      case 'expiring':
        return 'secondary';
      case 'expired':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getDocumentsByStatus = (status: AviationDocument['status']) => {
    return documents.filter(doc => doc.status === status);
  };

  const validDocuments = getDocumentsByStatus('valid');
  const expiringDocuments = getDocumentsByStatus('expiring');
  const expiredDocuments = getDocumentsByStatus('expired');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading compliance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Aviation Compliance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-700">{validDocuments.length}</p>
                <p className="text-sm text-green-600">Valid Documents</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-yellow-700">{expiringDocuments.length}</p>
                <p className="text-sm text-yellow-600">Expiring Soon</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-700">{expiredDocuments.length}</p>
                <p className="text-sm text-red-600">Expired Documents</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents requiring attention */}
      {(expiringDocuments.length > 0 || expiredDocuments.length > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expiredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-red-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="font-medium text-red-800">{doc.name}</p>
                    <p className="text-sm text-red-600">Expired on {new Date(doc.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant="destructive">Expired</Badge>
              </div>
            ))}
            
            {expiringDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-yellow-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="font-medium text-yellow-800">{doc.name}</p>
                    <p className="text-sm text-yellow-600">
                      Expires in {doc.daysUntilExpiry} days ({new Date(doc.expiryDate).toLocaleDateString()})
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Expiring</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Aviation Documents
          </CardTitle>
          <Button 
            onClick={() => setShowAddDocument(true)}
            size="sm"
          >
            Add Document
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((document) => (
              <div key={document.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(document.status)}
                      <h3 className="font-medium">{document.name}</h3>
                      <Badge variant={getStatusBadgeVariant(document.status)}>
                        {document.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <Label className="font-medium">Document Number</Label>
                        <p>{document.number}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Issued By</Label>
                        <p>{document.issuedBy}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Issue Date</Label>
                        <p>{new Date(document.issueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Expiry Date</Label>
                        <p>{new Date(document.expiryDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {document.regulatoryAuthority}
                      </Badge>
                      {document.requiredFor.map((role) => (
                        <Badge key={role} variant="secondary" className="text-xs">
                          Required for {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {documents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No aviation documents found</p>
                <p className="text-sm">Add your first document to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Regulatory Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">FAA Requirements</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Commercial pilots must renew medical certificates every 12 months</li>
                <li>• Type ratings must be renewed every 24 months</li>
                <li>• Part 135 operators require current AOC</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">EASA Requirements</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Class 1 medical certificates valid for 12 months (under 40) or 6 months (over 40)</li>
                <li>• Type ratings require recurrent training every 12 months</li>
                <li>• Air operator certificates require annual renewal</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}