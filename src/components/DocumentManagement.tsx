import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    Download,
    File,
    FileText,
    Filter,
    Folder,
    Image,
    Search,
    Share,
    Trash2,
    Upload
} from 'lucide-react';
import React, { useRef, useState } from 'react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'spreadsheet' | 'text' | 'other';
  size: number;
  uploadDate: Date;
  category: 'contracts' | 'compliance' | 'operations' | 'financial' | 'personal';
  status: 'private' | 'shared' | 'public';
  description?: string;
  tags: string[];
  uploadedBy: string;
}

interface DocumentManagementProps {
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
}

export default function DocumentManagement({ terminalType }: DocumentManagementProps) {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Charter Agreement - G550 London-NY.pdf',
      type: 'pdf',
      size: 2048576,
      uploadDate: new Date('2024-01-10'),
      category: 'contracts',
      status: 'private',
      description: 'Standard charter agreement for Gulfstream G550',
      tags: ['charter', 'g550', 'london', 'new-york'],
      uploadedBy: 'John Smith'
    },
    {
      id: '2',
      name: 'EASA Compliance Certificate.jpg',
      type: 'image',
      size: 1024000,
      uploadDate: new Date('2024-01-08'),
      category: 'compliance',
      status: 'shared',
      description: 'Current EASA compliance certificate',
      tags: ['easa', 'compliance', 'certificate'],
      uploadedBy: 'Sarah Johnson'
    },
    {
      id: '3',
      name: 'Monthly Revenue Report.xlsx',
      type: 'spreadsheet',
      size: 512000,
      uploadDate: new Date('2024-01-05'),
      category: 'financial',
      status: 'private',
      description: 'December 2023 revenue breakdown',
      tags: ['revenue', 'report', 'december-2023'],
      uploadedBy: 'Mike Davis'
    },
    {
      id: '4',
      name: 'Flight Operations Manual.docx',
      type: 'text',
      size: 3072000,
      uploadDate: new Date('2024-01-03'),
      category: 'operations',
      status: 'shared',
      description: 'Updated flight operations procedures',
      tags: ['operations', 'manual', 'procedures'],
      uploadedBy: 'Captain Wilson'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'contracts', label: 'Contracts' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'operations', label: 'Operations' },
    { value: 'financial', label: 'Financial' },
    { value: 'personal', label: 'Personal' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'private', label: 'Private' },
    { value: 'shared', label: 'Shared' },
    { value: 'public', label: 'Public' }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <File className="w-5 h-5 text-red-400" />;
      case 'image': return <Image className="w-5 h-5 text-green-400" />;
      case 'spreadsheet': return <File className="w-5 h-5 text-green-600" />;
      case 'text': return <FileText className="w-5 h-5 text-blue-400" />;
      default: return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contracts': return 'bg-blue-500';
      case 'compliance': return 'bg-green-500';
      case 'operations': return 'bg-purple-500';
      case 'financial': return 'bg-yellow-500';
      case 'personal': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'private': return 'bg-red-500';
      case 'shared': return 'bg-yellow-500';
      case 'public': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Determine file type based on MIME type or extension
      let fileType: 'pdf' | 'image' | 'spreadsheet' | 'text' | 'other';
      if (file.type.includes('pdf')) {
        fileType = 'pdf';
      } else if (file.type.startsWith('image/')) {
        fileType = 'image';
      } else if (file.type.includes('spreadsheet') || file.type.includes('excel')) {
        fileType = 'spreadsheet';
      } else if (file.type.startsWith('text/')) {
        fileType = 'text';
      } else {
        fileType = 'other';
      }
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const newDocument: Document = {
        id: Date.now().toString() + i,
        name: file.name,
        type: fileType,
        size: file.size,
        uploadDate: new Date(),
        category: 'personal',
        status: 'private',
        tags: [],
        uploadedBy: 'Current User'
      };

      setDocuments(prev => [newDocument, ...prev]);
    }

    setIsUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (document: Document) => {
    // Simulate download
    console.log('Downloading:', document.name);
  };

  const handleDelete = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const handleShare = (documentId: string) => {
    // Simulate sharing
    console.log('Sharing document:', documentId);
  };

  const handleStatusChange = (documentId: string, newStatus: 'private' | 'shared' | 'public') => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? { ...doc, status: newStatus } : doc
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Document Management</h2>
          <p className="text-gray-400">Upload, organize, and share your aviation documents</p>
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white">Uploading files...</span>
                <span className="text-gray-400">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <Button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      <div className="grid gap-4">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {getFileIcon(document.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {document.name}
                      </h3>
                      <Badge className={`${getCategoryColor(document.category)} text-white`}>
                        {document.category}
                      </Badge>
                      <Badge className={`${getStatusColor(document.status)} text-white`}>
                        {document.status}
                      </Badge>
                    </div>
                    {document.description && (
                      <p className="text-gray-400 text-sm mb-2">{document.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{formatFileSize(document.size)}</span>
                      <span>•</span>
                      <span>Uploaded {formatDate(document.uploadDate)}</span>
                      <span>•</span>
                      <span>By {document.uploadedBy}</span>
                    </div>
                    {document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {document.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs text-gray-300 border-gray-600">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    onClick={() => handleDownload(document)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleShare(document.id)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                  <select
                    value={document.status}
                    onChange={(e) => handleStatusChange(document.id, e.target.value as any)}
                    className="bg-slate-700 border border-slate-600 text-white rounded-md px-2 py-1 text-xs"
                  >
                    <option value="private">Private</option>
                    <option value="shared">Shared</option>
                    <option value="public">Public</option>
                  </select>
                  <Button
                    onClick={() => handleDelete(document.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No documents found</h3>
            <p className="text-gray-400">Upload your first document or adjust your search criteria</p>
          </CardContent>
        </Card>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
      />
    </div>
  );
}
