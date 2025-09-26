import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Download, 
  Eye, 
  Upload, 
  Search, 
  Filter, 
  Calendar,
  DollarSign,
  Users,
  Plane,
  Briefcase,
  Receipt,
  FileCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Plus,
  Folder,
  Archive
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Document {
  id: string;
  user_id: string;
  deal_id?: string;
  document_type: 'contract' | 'receipt' | 'invoice' | 'agreement' | 'certificate' | 'other';
  title: string;
  description?: string;
  file_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  is_public: boolean;
  tags: string[];
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  deal?: {
    id: string;
    title: string;
    status: string;
    total_amount: number;
    broker: {
      name: string;
      company: string;
    };
    operator: {
      name: string;
      company: string;
    };
    aircraft: {
      make: string;
      model: string;
      registration: string;
    };
  };
}

interface DocumentStorageProps {
  userRole: 'pilot' | 'crew' | 'broker' | 'operator' | 'admin';
}

export default function DocumentStorage({ userRole }: DocumentStorageProps) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDeal, setSelectedDeal] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    description: '',
    document_type: 'other' as const,
    tags: [] as string[],
    is_public: false
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: '1',
        user_id: user?.id || '',
        deal_id: 'deal-1',
        document_type: 'contract',
        title: 'Pilot Hire Agreement - Captain Mike Smith',
        description: 'Standard pilot hire agreement for Gulfstream G650 operations',
        file_url: '/documents/contracts/contract-2024-000001.pdf',
        file_name: 'contract-2024-000001.pdf',
        file_size: 245760,
        mime_type: 'application/pdf',
        is_public: false,
        tags: ['pilot', 'hire', 'gulfstream', 'g650'],
        metadata: {
          contract_number: 'CONTRACT-2024-000001',
          status: 'signed',
          parties: ['SkyHigh Operations', 'Captain Mike Smith']
        },
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:30:00Z',
        deal: {
          id: 'deal-1',
          title: 'Gulfstream G650 Charter - NYC to LAX',
          status: 'completed',
          total_amount: 50000,
          broker: {
            name: 'John Broker',
            company: 'Elite Aviation Brokers'
          },
          operator: {
            name: 'Sarah Operator',
            company: 'SkyHigh Operations'
          },
          aircraft: {
            make: 'Gulfstream',
            model: 'G650',
            registration: 'N123AB'
          }
        }
      },
      {
        id: '2',
        user_id: user?.id || '',
        deal_id: 'deal-1',
        document_type: 'receipt',
        title: 'Payment Receipt - Broker Commission',
        description: 'Receipt for broker commission payment',
        file_url: '/documents/receipts/receipt-2024-000001.pdf',
        file_name: 'receipt-2024-000001.pdf',
        file_size: 128000,
        mime_type: 'application/pdf',
        is_public: false,
        tags: ['payment', 'commission', 'broker'],
        metadata: {
          receipt_number: 'RECEIPT-2024-000001',
          amount: 5000,
          currency: 'USD',
          payment_method: 'Bank Transfer'
        },
        created_at: '2024-01-25T14:30:00Z',
        updated_at: '2024-01-25T14:30:00Z',
        deal: {
          id: 'deal-1',
          title: 'Gulfstream G650 Charter - NYC to LAX',
          status: 'completed',
          total_amount: 50000,
          broker: {
            name: 'John Broker',
            company: 'Elite Aviation Brokers'
          },
          operator: {
            name: 'Sarah Operator',
            company: 'SkyHigh Operations'
          },
          aircraft: {
            make: 'Gulfstream',
            model: 'G650',
            registration: 'N123AB'
          }
        }
      },
      {
        id: '3',
        user_id: user?.id || '',
        document_type: 'certificate',
        title: 'ATP Certificate - Captain Mike Smith',
        description: 'Airline Transport Pilot certificate',
        file_url: '/documents/certificates/atp-certificate.pdf',
        file_name: 'atp-certificate.pdf',
        file_size: 512000,
        mime_type: 'application/pdf',
        is_public: false,
        tags: ['certificate', 'atp', 'pilot', 'faa'],
        metadata: {
          certificate_number: 'ATP-123456',
          issue_date: '2020-03-15',
          expiry_date: '2024-03-15',
          issuing_authority: 'FAA'
        },
        created_at: '2024-01-15T09:00:00Z',
        updated_at: '2024-01-15T09:00:00Z'
      }
    ];

    setDocuments(mockDocuments);
    setFilteredDocuments(mockDocuments);
    setLoading(false);
  }, [user]);

  // Filter documents
  useEffect(() => {
    let filtered = documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || doc.document_type === selectedType;
      const matchesDeal = selectedDeal === 'all' || doc.deal_id === selectedDeal;
      
      return matchesSearch && matchesType && matchesDeal;
    });

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, selectedType, selectedDeal]);

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual file upload
    console.log('Uploading document:', newDocument);
    setShowUploadDialog(false);
    setNewDocument({ title: '', description: '', document_type: 'other', tags: [], is_public: false });
  };

  const handleDownloadDocument = async (documentId: string) => {
    // TODO: Implement actual file download
    console.log('Downloading document:', documentId);
  };

  const handleViewDocument = (documentId: string) => {
    // TODO: Implement document viewer
    console.log('Viewing document:', documentId);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'contract': return <FileCheck className="h-5 w-5" />;
      case 'receipt': return <Receipt className="h-5 w-5" />;
      case 'invoice': return <DollarSign className="h-5 w-5" />;
      case 'agreement': return <FileText className="h-5 w-5" />;
      case 'certificate': return <FileCheck className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'contract': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'receipt': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'invoice': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'agreement': return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      case 'certificate': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      default: return 'bg-terminal-muted text-terminal-fg';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terminal-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-terminal-fg">Document Storage</h1>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="bg-terminal-accent hover:bg-terminal-accent/90">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-terminal-bg border-terminal-border">
              <DialogHeader>
                <DialogTitle className="text-terminal-fg">Upload New Document</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUploadDocument} className="space-y-4">
                <div>
                  <label className="text-terminal-fg">Document Title</label>
                  <Input
                    value={newDocument.title}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-terminal-bg border-terminal-border text-terminal-fg"
                    required
                  />
                </div>
                <div>
                  <label className="text-terminal-fg">Description</label>
                  <Textarea
                    value={newDocument.description}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-terminal-bg border-terminal-border text-terminal-fg"
                  />
                </div>
                <div>
                  <label className="text-terminal-fg">Document Type</label>
                  <Select value={newDocument.document_type} onValueChange={(value: any) => setNewDocument(prev => ({ ...prev, document_type: value }))}>
                    <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="receipt">Receipt</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="agreement">Agreement</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-4">
                  <Button type="submit" className="bg-terminal-accent hover:bg-terminal-accent/90">
                    Upload
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowUploadDialog(false)} className="border-terminal-border text-terminal-fg">
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <p className="text-terminal-muted">
          Manage your contracts, receipts, and other important documents
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-terminal-bg border-terminal-border">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-muted h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-terminal-bg border-terminal-border text-terminal-fg"
              />
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="contract">Contracts</SelectItem>
                <SelectItem value="receipt">Receipts</SelectItem>
                <SelectItem value="invoice">Invoices</SelectItem>
                <SelectItem value="agreement">Agreements</SelectItem>
                <SelectItem value="certificate">Certificates</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedDeal} onValueChange={setSelectedDeal}>
              <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                <SelectValue placeholder="Deal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Deals</SelectItem>
                {Array.from(new Set(documents.map(doc => doc.deal_id).filter(Boolean))).map(dealId => {
                  const deal = documents.find(doc => doc.deal_id === dealId)?.deal;
                  return (
                    <SelectItem key={dealId} value={dealId}>
                      {deal?.title || `Deal ${dealId}`}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      <div className="space-y-4">
        {filteredDocuments.length === 0 ? (
          <Card className="bg-terminal-bg border-terminal-border">
            <CardContent className="p-8 text-center">
              <Folder className="h-12 w-12 text-terminal-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-terminal-fg mb-2">No Documents Found</h3>
              <p className="text-terminal-muted">
                Upload your first document or adjust your search criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map(document => (
            <Card key={document.id} className="bg-terminal-bg border-terminal-border hover:border-terminal-accent transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getDocumentIcon(document.document_type)}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-terminal-fg">{document.title}</h3>
                        <Badge className={getDocumentTypeColor(document.document_type)}>
                          {document.document_type}
                        </Badge>
                        {document.is_public && (
                          <Badge variant="outline" className="border-terminal-border text-terminal-fg">
                            Public
                          </Badge>
                        )}
                      </div>
                      
                      {document.description && (
                        <p className="text-terminal-muted">{document.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-terminal-muted">
                        <div>
                          <p className="font-semibold">File Size</p>
                          <p>{formatFileSize(document.file_size)}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Created</p>
                          <p>{formatDate(document.created_at)}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Type</p>
                          <p className="capitalize">{document.mime_type.split('/')[1]}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Tags</p>
                          <p>{document.tags.length} tags</p>
                        </div>
                      </div>
                      
                      {document.deal && (
                        <div className="bg-terminal-muted/20 p-3 rounded-lg">
                          <h4 className="font-semibold text-terminal-fg mb-2">Related Deal</h4>
                          <p className="text-sm text-terminal-fg">{document.deal.title}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-xs text-terminal-muted">
                            <div>
                              <p><strong>Broker:</strong> {document.deal.broker.name}</p>
                            </div>
                            <div>
                              <p><strong>Operator:</strong> {document.deal.operator.name}</p>
                            </div>
                            <div>
                              <p><strong>Aircraft:</strong> {document.deal.aircraft.make} {document.deal.aircraft.model}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        {document.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-terminal-muted text-terminal-fg">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDocument(document.id)}
                      className="border-terminal-border text-terminal-fg"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadDocument(document.id)}
                      className="border-terminal-border text-terminal-fg"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
