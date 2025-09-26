// Data Protection Component - Industry Standard Implementation
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { securityService } from '@/lib/security-service';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Key, 
  Database, 
  FileText, 
  Download,
  Upload,
  Trash2,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface DataProtectionProps {
  className?: string;
}

export const DataProtection: React.FC<DataProtectionProps> = ({ className }) => {
  const [encryptionKey, setEncryptionKey] = useState('');
  const [dataToEncrypt, setDataToEncrypt] = useState('');
  const [encryptedData, setEncryptedData] = useState('');
  const [dataToDecrypt, setDataToDecrypt] = useState('');
  const [decryptedData, setDecryptedData] = useState('');
  const [showEncryptionKey, setShowEncryptionKey] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({ valid: false, errors: [] as string[] });
  const [maskedData, setMaskedData] = useState('');
  const [dataType, setDataType] = useState<'email' | 'phone' | 'creditcard' | 'ssn'>('email');

  useEffect(() => {
    validatePassword();
  }, [password]);

  const validatePassword = () => {
    const validation = securityService.validatePassword(password);
    setPasswordValidation(validation);
  };

  const handleEncrypt = async () => {
    try {
      const encrypted = await securityService.encryptData(dataToEncrypt);
      setEncryptedData(encrypted);
    } catch (error) {
      console.error('Encryption failed:', error);
    }
  };

  const handleDecrypt = async () => {
    try {
      const decrypted = await securityService.decryptData(dataToDecrypt);
      setDecryptedData(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
    }
  };

  const handleMaskData = () => {
    const masked = securityService.maskSensitiveData(maskedData, dataType);
    setMaskedData(masked);
  };

  const generateNewKey = () => {
    const newKey = crypto.randomUUID();
    setEncryptionKey(newKey);
  };

  const sanitizeInput = (input: string) => {
    return securityService.sanitizeInput(input);
  };

  const escapeHtml = (input: string) => {
    return securityService.escapeHtml(input);
  };

  const exportEncryptedData = () => {
    const data = {
      encryptedData,
      timestamp: new Date().toISOString(),
      algorithm: 'AES-GCM'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encrypted-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Data Protection</h3>
            <Badge variant="default">FCA Compliant</Badge>
          </div>
        </div>

        <Tabs defaultValue="encryption" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="encryption">Encryption</TabsTrigger>
            <TabsTrigger value="password">Password Security</TabsTrigger>
            <TabsTrigger value="masking">Data Masking</TabsTrigger>
            <TabsTrigger value="sanitization">Input Sanitization</TabsTrigger>
          </TabsList>

          <TabsContent value="encryption" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Encrypt Data
                </h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="encryption-key">Encryption Key</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="encryption-key"
                        type={showEncryptionKey ? "text" : "password"}
                        value={encryptionKey}
                        onChange={(e) => setEncryptionKey(e.target.value)}
                        placeholder="Enter encryption key"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowEncryptionKey(!showEncryptionKey)}
                      >
                        {showEncryptionKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateNewKey}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="data-to-encrypt">Data to Encrypt</Label>
                    <Input
                      id="data-to-encrypt"
                      value={dataToEncrypt}
                      onChange={(e) => setDataToEncrypt(e.target.value)}
                      placeholder="Enter data to encrypt"
                    />
                  </div>
                  
                  <Button onClick={handleEncrypt} className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Encrypt Data
                  </Button>
                  
                  {encryptedData && (
                    <div>
                      <Label>Encrypted Data</Label>
                      <div className="p-3 bg-gray-100 rounded-md font-mono text-sm break-all">
                        {encryptedData}
                      </div>
                      <Button
                        onClick={exportEncryptedData}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  Decrypt Data
                </h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="data-to-decrypt">Encrypted Data</Label>
                    <Input
                      id="data-to-decrypt"
                      value={dataToDecrypt}
                      onChange={(e) => setDataToDecrypt(e.target.value)}
                      placeholder="Enter encrypted data"
                    />
                  </div>
                  
                  <Button onClick={handleDecrypt} className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Decrypt Data
                  </Button>
                  
                  {decryptedData && (
                    <div>
                      <Label>Decrypted Data</Label>
                      <div className="p-3 bg-green-100 rounded-md font-mono text-sm break-all">
                        {decryptedData}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="password" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Password Security
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password to validate"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {passwordValidation.valid ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${passwordValidation.valid ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordValidation.valid ? 'Password is secure' : 'Password needs improvement'}
                    </span>
                  </div>
                  
                  {passwordValidation.errors.length > 0 && (
                    <ul className="space-y-1">
                      {passwordValidation.errors.map((error, index) => (
                        <li key={index} className="text-sm text-red-600 flex items-start space-x-2">
                          <div className="w-1 h-1 bg-red-600 rounded-full mt-2" />
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="masking" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Data Masking
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="data-type">Data Type</Label>
                  <select
                    id="data-type"
                    value={dataType}
                    onChange={(e) => setDataType(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone Number</option>
                    <option value="creditcard">Credit Card</option>
                    <option value="ssn">Social Security Number</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="data-to-mask">Data to Mask</Label>
                  <Input
                    id="data-to-mask"
                    value={maskedData}
                    onChange={(e) => setMaskedData(e.target.value)}
                    placeholder="Enter data to mask"
                  />
                </div>
                
                <Button onClick={handleMaskData} className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Mask Data
                </Button>
                
                {maskedData && (
                  <div>
                    <Label>Masked Data</Label>
                    <div className="p-3 bg-yellow-100 rounded-md font-mono text-sm">
                      {maskedData}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="sanitization" className="space-y-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Input Sanitization
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-to-sanitize">Input to Sanitize</Label>
                  <Input
                    id="input-to-sanitize"
                    value={maskedData}
                    onChange={(e) => setMaskedData(e.target.value)}
                    placeholder="Enter input to sanitize"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={() => setMaskedData(sanitizeInput(maskedData))} className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Sanitize Input
                  </Button>
                  
                  <Button onClick={() => setMaskedData(escapeHtml(maskedData))} className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Escape HTML
                  </Button>
                </div>
                
                {maskedData && (
                  <div>
                    <Label>Sanitized Output</Label>
                    <div className="p-3 bg-blue-100 rounded-md font-mono text-sm">
                      {maskedData}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
