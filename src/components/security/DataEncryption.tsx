import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Lock, 
  Unlock, 
  Key, 
  Shield, 
  CheckCircle, 
  XCircle,
  Eye,
  EyeOff,
  FileText,
  Database,
  Cloud
} from 'lucide-react';

interface EncryptionStatus {
  id: string;
  name: string;
  type: 'database' | 'file' | 'api' | 'storage';
  status: 'encrypted' | 'unencrypted' | 'partial';
  algorithm: string;
  keySize: number;
  lastEncrypted: string;
  compliance: 'compliant' | 'non-compliant' | 'warning';
}

interface EncryptionKey {
  id: string;
  name: string;
  algorithm: string;
  keySize: number;
  created: string;
  expires: string;
  status: 'active' | 'expired' | 'revoked';
  usage: number;
}

const DataEncryption: React.FC = () => {
  const [encryptionStatus, setEncryptionStatus] = useState<EncryptionStatus[]>([]);
  const [encryptionKeys, setEncryptionKeys] = useState<EncryptionKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showKeyDetails, setShowKeyDetails] = useState(false);
  const [newKey, setNewKey] = useState({
    name: '',
    algorithm: 'AES-256',
    keySize: 256
  });

  useEffect(() => {
    // Mock encryption status data
    const mockStatus: EncryptionStatus[] = [
      {
        id: '1',
        name: 'User Profiles',
        type: 'database',
        status: 'encrypted',
        algorithm: 'AES-256',
        keySize: 256,
        lastEncrypted: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        compliance: 'compliant'
      },
      {
        id: '2',
        name: 'Financial Data',
        type: 'database',
        status: 'encrypted',
        algorithm: 'AES-256',
        keySize: 256,
        lastEncrypted: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        compliance: 'compliant'
      },
      {
        id: '3',
        name: 'Document Storage',
        type: 'file',
        status: 'partial',
        algorithm: 'AES-128',
        keySize: 128,
        lastEncrypted: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        compliance: 'warning'
      },
      {
        id: '4',
        name: 'API Communications',
        type: 'api',
        status: 'encrypted',
        algorithm: 'TLS 1.3',
        keySize: 256,
        lastEncrypted: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        compliance: 'compliant'
      },
      {
        id: '5',
        name: 'Backup Storage',
        type: 'storage',
        status: 'unencrypted',
        algorithm: 'None',
        keySize: 0,
        lastEncrypted: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        compliance: 'non-compliant'
      }
    ];

    // Mock encryption keys data
    const mockKeys: EncryptionKey[] = [
      {
        id: '1',
        name: 'Primary Database Key',
        algorithm: 'AES-256',
        keySize: 256,
        created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
        status: 'active',
        usage: 85
      },
      {
        id: '2',
        name: 'File Storage Key',
        algorithm: 'AES-128',
        keySize: 128,
        created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString(),
        status: 'active',
        usage: 45
      },
      {
        id: '3',
        name: 'Legacy Key',
        algorithm: 'AES-128',
        keySize: 128,
        created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
        expires: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        status: 'expired',
        usage: 0
      }
    ];

    setEncryptionStatus(mockStatus);
    setEncryptionKeys(mockKeys);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'encrypted': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'partial': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'unencrypted': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-terminal-muted text-terminal-fg';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'encrypted': return <Lock className="h-4 w-4" />;
      case 'partial': return <Eye className="h-4 w-4" />;
      case 'unencrypted': return <Unlock className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'compliant': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'non-compliant': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-terminal-muted text-terminal-fg';
    }
  };

  const getComplianceIcon = (compliance: string) => {
    switch (compliance) {
      case 'compliant': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <Eye className="h-4 w-4" />;
      case 'non-compliant': return <XCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database': return <Database className="h-4 w-4" />;
      case 'file': return <FileText className="h-4 w-4" />;
      case 'api': return <Shield className="h-4 w-4" />;
      case 'storage': return <Cloud className="h-4 w-4" />;
      default: return <Lock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCreateKey = () => {
    const key: EncryptionKey = {
      id: `key-${Date.now()}`,
      name: newKey.name,
      algorithm: newKey.algorithm,
      keySize: newKey.keySize,
      created: new Date().toISOString(),
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
      status: 'active',
      usage: 0
    };

    setEncryptionKeys(prev => [key, ...prev]);
    setNewKey({ name: '', algorithm: 'AES-256', keySize: 256 });
    setShowKeyDetails(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-terminal-fg">Data Encryption</h1>
          <p className="text-terminal-muted">Manage encryption status and keys</p>
        </div>
        <Button 
          className="bg-terminal-accent hover:bg-terminal-accent/90"
          onClick={() => setShowKeyDetails(true)}
        >
          <Key className="h-4 w-4 mr-2" />
          Create Key
        </Button>
      </div>

      {/* Encryption Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-terminal-bg border-terminal-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Lock className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-terminal-muted">Encrypted</p>
                <p className="text-2xl font-bold text-terminal-fg">
                  {encryptionStatus.filter(s => s.status === 'encrypted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-bg border-terminal-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Eye className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-terminal-muted">Partial</p>
                <p className="text-2xl font-bold text-terminal-fg">
                  {encryptionStatus.filter(s => s.status === 'partial').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-bg border-terminal-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Unlock className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-terminal-muted">Unencrypted</p>
                <p className="text-2xl font-bold text-terminal-fg">
                  {encryptionStatus.filter(s => s.status === 'unencrypted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Encryption Status Details */}
      <Card className="bg-terminal-bg border-terminal-border">
        <CardHeader>
          <CardTitle className="text-terminal-fg">Encryption Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {encryptionStatus.map((status) => (
              <div key={status.id} className="flex items-center justify-between p-4 border border-terminal-border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getTypeIcon(status.type)}
                  <div>
                    <h3 className="font-semibold text-terminal-fg">{status.name}</h3>
                    <p className="text-sm text-terminal-muted">
                      {status.algorithm} • {status.keySize} bits
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(status.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(status.status)}
                      <span>{status.status}</span>
                    </div>
                  </Badge>
                  <Badge className={getComplianceColor(status.compliance)}>
                    <div className="flex items-center space-x-1">
                      {getComplianceIcon(status.compliance)}
                      <span>{status.compliance}</span>
                    </div>
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Encryption Keys */}
      <Card className="bg-terminal-bg border-terminal-border">
        <CardHeader>
          <CardTitle className="text-terminal-fg">Encryption Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {encryptionKeys.map((key) => (
              <div key={key.id} className="flex items-center justify-between p-4 border border-terminal-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Key className="h-6 w-6 text-terminal-accent" />
                  <div>
                    <h3 className="font-semibold text-terminal-fg">{key.name}</h3>
                    <p className="text-sm text-terminal-muted">
                      {key.algorithm} • {key.keySize} bits • Created {formatDate(key.created)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-terminal-muted">Usage</p>
                    <Progress value={key.usage} className="w-20 h-2" />
                  </div>
                  <Badge className={key.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                    {key.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Key Dialog */}
      {showKeyDetails && (
        <Card className="bg-terminal-bg border-terminal-border">
          <CardHeader>
            <CardTitle className="text-terminal-fg">Create New Encryption Key</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-terminal-fg">Key Name</label>
              <Input
                value={newKey.name}
                onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                className="bg-terminal-bg border-terminal-border text-terminal-fg"
                placeholder="Enter key name"
              />
            </div>
            <div>
              <label className="text-terminal-fg">Algorithm</label>
              <select
                value={newKey.algorithm}
                onChange={(e) => setNewKey(prev => ({ ...prev, algorithm: e.target.value }))}
                className="w-full p-2 bg-terminal-bg border border-terminal-border text-terminal-fg rounded"
              >
                <option value="AES-256">AES-256</option>
                <option value="AES-128">AES-128</option>
                <option value="RSA-2048">RSA-2048</option>
                <option value="RSA-4096">RSA-4096</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleCreateKey}
                className="bg-terminal-accent hover:bg-terminal-accent/90"
              >
                Create Key
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowKeyDetails(false)}
                className="border-terminal-border text-terminal-fg"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataEncryption;
