import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Upload, 
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Clock,
  Award,
  User,
  Plane
} from 'lucide-react';

interface Credential {
  id: string;
  type: 'license' | 'type-rating' | 'medical' | 'training' | 'visa' | 'id';
  name: string;
  number: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired' | 'pending';
  fileUrl?: string;
  verified: boolean;
  required: boolean;
}

interface PilotProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  baseLocation: string;
  totalHours: number;
  credentials: Credential[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  lastVerified: string;
}

export default function CredentialsVault({ terminalType }: { terminalType: string }) {
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [profile, setProfile] = useState<PilotProfile>({
    id: 'pilot-001',
    name: 'Captain James Mitchell',
    email: 'james.mitchell@stratusconnect.com',
    phone: '+44 7700 900123',
    baseLocation: 'London, UK',
    totalHours: 2847,
    verificationStatus: 'verified',
    lastVerified: '2025-09-15T10:30:00Z',
    credentials: [
      {
        id: 'cred-001',
        type: 'license',
        name: 'Commercial Pilot License (CPL)',
        number: 'CPL-UK-2023-001234',
        issuedBy: 'UK CAA',
        issueDate: '2023-03-15',
        expiryDate: '2028-03-15',
        status: 'valid',
        verified: true,
        required: true,
        fileUrl: '/documents/cpl-certificate.pdf'
      },
      {
        id: 'cred-002',
        type: 'type-rating',
        name: 'Gulfstream G650 Type Rating',
        number: 'G650-TR-2024-5678',
        issuedBy: 'Gulfstream Training Center',
        issueDate: '2024-01-20',
        expiryDate: '2026-01-20',
        status: 'valid',
        verified: true,
        required: true,
        fileUrl: '/documents/g650-rating.pdf'
      },
      {
        id: 'cred-003',
        type: 'medical',
        name: 'Class 1 Medical Certificate',
        number: 'MED-UK-2024-9876',
        issuedBy: 'UK CAA Medical Division',
        issueDate: '2024-06-10',
        expiryDate: '2025-06-10',
        status: 'expiring',
        verified: true,
        required: true,
        fileUrl: '/documents/medical-cert.pdf'
      },
      {
        id: 'cred-004',
        type: 'training',
        name: 'CRM (Crew Resource Management)',
        number: 'CRM-2024-3456',
        issuedBy: 'Aviation Training Ltd',
        issueDate: '2024-02-15',
        expiryDate: '2026-02-15',
        status: 'valid',
        verified: true,
        required: true,
        fileUrl: '/documents/crm-certificate.pdf'
      },
      {
        id: 'cred-005',
        type: 'visa',
        name: 'US B1/B2 Visa',
        number: 'US-VISA-2024-7890',
        issuedBy: 'US Embassy London',
        issueDate: '2024-04-01',
        expiryDate: '2029-04-01',
        status: 'valid',
        verified: true,
        required: false,
        fileUrl: '/documents/us-visa.pdf'
      },
      {
        id: 'cred-006',
        type: 'id',
        name: 'Passport',
        number: 'GB123456789',
        issuedBy: 'UK Passport Office',
        issueDate: '2020-08-15',
        expiryDate: '2030-08-15',
        status: 'valid',
        verified: true,
        required: true,
        fileUrl: '/documents/passport.pdf'
      }
    ]
  });

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case 'license': return <Award className="w-5 h-5" />;
      case 'type-rating': return <Plane className="w-5 h-5" />;
      case 'medical': return <Shield className="w-5 h-5" />;
      case 'training': return <FileText className="w-5 h-5" />;
      case 'visa': return <User className="w-5 h-5" />;
      case 'id': return <FileText className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'expiring': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4" />;
      case 'expiring': return <Clock className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryProgress = (expiryDate: string) => {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
    if (daysUntilExpiry <= 0) return 0;
    if (daysUntilExpiry <= 30) return 100 - (daysUntilExpiry / 30) * 100;
    if (daysUntilExpiry <= 90) return 100 - ((daysUntilExpiry - 30) / 60) * 50;
    return 0;
  };

  const expiringCredentials = profile.credentials.filter(cred => 
    cred.status === 'expiring' || cred.status === 'expired'
  );

  const requiredCredentials = profile.credentials.filter(cred => cred.required);
  const verifiedRequired = requiredCredentials.filter(cred => cred.verified).length;
  const verificationPercentage = (verifiedRequired / requiredCredentials.length) * 100;

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Profile & Credentials Vault
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Verification Status</h3>
              <div className="flex items-center gap-2">
                <Badge className={profile.verificationStatus === 'verified' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}>
                  {profile.verificationStatus === 'verified' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                  {profile.verificationStatus.charAt(0).toUpperCase() + profile.verificationStatus.slice(1)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Last verified: {new Date(profile.lastVerified).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Required Credentials</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Verified:</span>
                  <span>{verifiedRequired}/{requiredCredentials.length}</span>
                </div>
                <Progress value={verificationPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {verificationPercentage.toFixed(0)}% complete
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Total Flight Hours</h3>
              <div className="text-2xl font-bold text-accent">{profile.totalHours.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Verified hours</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Expiring Soon</h3>
              <div className="text-2xl font-bold text-yellow-400">{expiringCredentials.length}</div>
              <p className="text-xs text-muted-foreground">Need renewal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expiring Credentials Alert */}
      {expiringCredentials.length > 0 && (
        <Card className="terminal-card border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-5 h-5" />
              Credentials Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expiringCredentials.map(cred => (
                <div key={cred.id} className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getCredentialIcon(cred.type)}
                    <div>
                      <h4 className="font-medium text-foreground">{cred.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Expires: {new Date(cred.expiryDate).toLocaleDateString()} 
                        ({getDaysUntilExpiry(cred.expiryDate)} days)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={getExpiryProgress(cred.expiryDate)} className="w-20 h-2" />
                    <Button size="sm" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Renew
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Credentials List */}
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              All Credentials
            </CardTitle>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Credential
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.credentials.map(credential => (
              <div key={credential.id} className="p-4 border rounded-lg hover:bg-terminal-card/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getCredentialIcon(credential.type)}
                    <div>
                      <h3 className="font-semibold text-foreground">{credential.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {credential.number} • Issued by {credential.issuedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(credential.status)}>
                      {getStatusIcon(credential.status)}
                      <span className="ml-1">{credential.status}</span>
                    </Badge>
                    {credential.verified && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="text-sm font-medium">{new Date(credential.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expiry Date</p>
                    <p className="text-sm font-medium">{new Date(credential.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Days Until Expiry</p>
                    <p className="text-sm font-medium">
                      {getDaysUntilExpiry(credential.expiryDate) > 0 
                        ? `${getDaysUntilExpiry(credential.expiryDate)} days`
                        : 'Expired'
                      }
                    </p>
                  </div>
                </div>

                {credential.status === 'expiring' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Expiry Progress</span>
                      <span>{getExpiryProgress(credential.expiryDate).toFixed(0)}%</span>
                    </div>
                    <Progress value={getExpiryProgress(credential.expiryDate)} className="h-2" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {credential.required && (
                      <Badge variant="outline" className="text-xs">
                        Required
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {credential.type.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
