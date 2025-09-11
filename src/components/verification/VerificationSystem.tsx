import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Clock, Upload, Eye, AlertTriangle, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow, format } from 'date-fns';

interface Verification {
  id: string;
  subject_type: 'individual' | 'company';
  subject_id: string;
  check_type: 'id' | 'liveness' | 'sanction' | 'licence' | 'medical' | 'ratings' | 'company_registry' | 'insurance' | 'aoc' | 'part_135';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  evidence_url?: string;
  expires_at?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

const checkTypeLabels = {
  id: 'Identity Verification',
  liveness: 'Liveness Check',
  sanction: 'Sanctions Check',
  licence: 'Pilot Licence',
  medical: 'Medical Certificate',
  ratings: 'Flight Ratings',
  company_registry: 'Company Registry',
  insurance: 'Insurance Certificate',
  aoc: 'Air Operator Certificate',
  part_135: 'Part 135 Certificate',
};

const checkTypeIcons = {
  id: User,
  liveness: User,
  sanction: Shield,
  licence: Shield,
  medical: Shield,
  ratings: Shield,
  company_registry: Building,
  insurance: Building,
  aoc: Building,
  part_135: Building,
};

const statusColors = {
  pending: 'text-yellow-400',
  approved: 'text-green-400',
  rejected: 'text-red-400',
  expired: 'text-gray-400',
};

const statusLabels = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  expired: 'Expired',
};

export const VerificationSystem: React.FC = () => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [verificationLevel, setVerificationLevel] = useState(0);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockVerifications: Verification[] = [
      {
        id: '1',
        subject_type: 'individual',
        subject_id: 'user-1',
        check_type: 'id',
        status: 'approved',
        evidence_url: 'https://example.com/id-document.pdf',
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(), // 1 year from now
        reviewed_by: 'admin-1',
        reviewed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      },
      {
        id: '2',
        subject_type: 'individual',
        subject_id: 'user-1',
        check_type: 'medical',
        status: 'pending',
        evidence_url: 'https://example.com/medical-cert.pdf',
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days from now
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      },
      {
        id: '3',
        subject_type: 'individual',
        subject_id: 'user-1',
        check_type: 'licence',
        status: 'approved',
        evidence_url: 'https://example.com/pilot-licence.pdf',
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString(), // 6 months from now
        reviewed_by: 'admin-2',
        reviewed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
      },
      {
        id: '4',
        subject_type: 'company',
        subject_id: 'company-1',
        check_type: 'aoc',
        status: 'rejected',
        evidence_url: 'https://example.com/aoc.pdf',
        reviewed_by: 'admin-1',
        reviewed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      },
      {
        id: '5',
        subject_type: 'company',
        subject_id: 'company-1',
        check_type: 'insurance',
        status: 'expired',
        evidence_url: 'https://example.com/insurance.pdf',
        expires_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
        reviewed_by: 'admin-2',
        reviewed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
      },
    ];

    setVerifications(mockVerifications);
    
    // Calculate verification level (0-5)
    const approvedCount = mockVerifications.filter(v => v.status === 'approved').length;
    const totalRequired = 5; // Assuming 5 required verifications
    setVerificationLevel(Math.min(5, Math.floor((approvedCount / totalRequired) * 5)));
  }, []);

  const uploadDocument = (verificationId: string) => {
    // Mock upload - replace with actual file upload
    console.log('Uploading document for verification:', verificationId);
  };

  const getVerificationProgress = () => {
    const total = verifications.length;
    const approved = verifications.filter(v => v.status === 'approved').length;
    const pending = verifications.filter(v => v.status === 'pending').length;
    const rejected = verifications.filter(v => v.status === 'rejected').length;
    const expired = verifications.filter(v => v.status === 'expired').length;

    return { total, approved, pending, rejected, expired };
  };

  const getExpiringSoon = () => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return verifications.filter(v => 
      v.expires_at && 
      new Date(v.expires_at) <= thirtyDaysFromNow && 
      v.status === 'approved'
    );
  };

  const progress = getVerificationProgress();
  const expiringSoon = getExpiringSoon();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Verification Center</h2>
          <p className="text-gray-400">Manage your identity and compliance documents</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-400">{verificationLevel}/5</div>
          <div className="text-sm text-gray-400">Verification Level</div>
        </div>
      </div>

      {/* Verification Level Progress */}
      <Card className="border-gray-800 bg-gray-900/50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Verification Progress</h3>
              <Badge variant="outline" className="text-orange-400">
                Level {verificationLevel}
              </Badge>
            </div>
            <Progress value={(verificationLevel / 5) * 100} className="h-3" />
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{progress.approved}</div>
                <div className="text-sm text-gray-400">Approved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{progress.pending}</div>
                <div className="text-sm text-gray-400">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{progress.rejected}</div>
                <div className="text-sm text-gray-400">Rejected</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-400">{progress.expired}</div>
                <div className="text-sm text-gray-400">Expired</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expiring Documents Alert */}
      {expiringSoon.length > 0 && (
        <Card className="border-orange-500/50 bg-orange-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              <div>
                <h4 className="font-medium text-orange-400">Documents Expiring Soon</h4>
                <p className="text-sm text-orange-300">
                  {expiringSoon.length} document(s) will expire within 30 days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Documents */}
      <div className="grid gap-4">
        {verifications.map((verification) => {
          const Icon = checkTypeIcons[verification.check_type];
          const isExpired = verification.expires_at && new Date(verification.expires_at) < new Date();
          const isExpiringSoon = verification.expires_at && 
            new Date(verification.expires_at) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) &&
            verification.status === 'approved';
          
          return (
            <Card key={verification.id} className="border-gray-800 bg-gray-900/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Icon className="h-6 w-6 text-orange-500 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-white">
                          {checkTypeLabels[verification.check_type]}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={`${statusColors[verification.status]}`}
                        >
                          {statusLabels[verification.status]}
                        </Badge>
                        {isExpired && (
                          <Badge variant="destructive">EXPIRED</Badge>
                        )}
                        {isExpiringSoon && !isExpired && (
                          <Badge variant="secondary" className="bg-orange-600/20 text-orange-400">
                            EXPIRING SOON
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            Created {formatDistanceToNow(new Date(verification.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        
                        {verification.expires_at && (
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span className={isExpired ? 'text-red-400' : isExpiringSoon ? 'text-orange-400' : 'text-gray-400'}>
                              {isExpired ? 'Expired' : 'Expires'} {formatDistanceToNow(new Date(verification.expires_at), { addSuffix: true })}
                            </span>
                          </div>
                        )}
                        
                        {verification.reviewed_at && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>
                              Reviewed {formatDistanceToNow(new Date(verification.reviewed_at), { addSuffix: true })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {verification.evidence_url && (
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {verification.status === 'pending' && (
                      <Button 
                        size="sm" 
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => uploadDocument(verification.id)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    )}
                    {verification.status === 'rejected' && (
                      <Button 
                        size="sm" 
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => uploadDocument(verification.id)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Re-upload
                      </Button>
                    )}
                    {verification.status === 'expired' && (
                      <Button 
                        size="sm" 
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => uploadDocument(verification.id)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Renew
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Required Verifications */}
      <Card className="border-gray-800 bg-gray-900/50">
        <CardHeader>
          <CardTitle className="text-lg">Required Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-orange-500" />
                <span className="text-white">Identity Verification</span>
              </div>
              <Badge variant="outline" className="text-green-400">Required</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-orange-500" />
                <span className="text-white">Pilot Licence</span>
              </div>
              <Badge variant="outline" className="text-green-400">Required</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-orange-500" />
                <span className="text-white">Medical Certificate</span>
              </div>
              <Badge variant="outline" className="text-yellow-400">Required</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-orange-500" />
                <span className="text-white">Air Operator Certificate</span>
              </div>
              <Badge variant="outline" className="text-gray-400">Optional</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
