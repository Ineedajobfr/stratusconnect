import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  FileText, 
  Download, 
  Eye, 
  XCircle,
  CheckCircle,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Events } from "@/lib/events";

interface Certificate {
  id: string;
  cert_type: string;
  subject_name: string;
  subject_email?: string;
  created_at: string;
  expires_at?: string;
  status: string;
  digest: string;
  signatures: Array<{kid: string; sig: string}>;
}

export default function CertificateManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newCert, setNewCert] = useState({
    cert_type: "",
    subject_name: "",
    subject_email: "",
    subject_id: "",
    summary: "",
    amount_numeric: 0
  });

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      // This would normally fetch from your API
      // For now, we'll show a placeholder
      setCertificates([]);
    } catch (error) {
      console.error('Error loading certificates:', error);
      toast({
        title: "Error",
        description: "Failed to load certificates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const issueCertificate = async () => {
    if (!newCert.cert_type || !newCert.subject_name || !newCert.summary) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/cert/issue?force=1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCert)
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      
      // Emit certificate issuance event
      Events.emitEvent('cert.issued', {
        certId: result.id,
        certType: newCert.cert_type,
        subjectName: newCert.subject_name
      }, { severity: 'high' });

      toast({
        title: "Success",
        description: "Certificate issued successfully",
      });

      // Show PDF download
      if (result.pdf_base64) {
        const pdfBlob = new Blob([Buffer.from(result.pdf_base64, 'base64')], { type: 'application/pdf' });
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${result.id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }

      setNewCert({
        cert_type: "",
        subject_name: "",
        subject_email: "",
        subject_id: "",
        summary: "",
        amount_numeric: 0
      });
      loadCertificates();
    } catch (error) {
      console.error('Error issuing certificate:', error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to issue certificate",
        variant: "destructive"
      });
    }
  };

  const revokeCertificate = async (certId: string) => {
    try {
      const response = await fetch('/api/cert/revoke?force=1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: certId,
          reason: "Revoked by admin",
          summary: "Certificate revoked"
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Emit revocation event
      Events.emitEvent('cert.revoked', {
        certId,
        reason: "Revoked by admin"
      }, { severity: 'high' });

      toast({
        title: "Success",
        description: "Certificate revoked successfully",
      });

      loadCertificates();
    } catch (error) {
      console.error('Error revoking certificate:', error);
      toast({
        title: "Error",
        description: "Failed to revoke certificate",
        variant: "destructive"
      });
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.cert_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || cert.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
        <div className="text-white">Loading certificates...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-bg p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Certificate Management</h1>
          <p className="text-gunmetal">
            Defense-grade PKI certificate issuance and management
          </p>
        </div>

        <Tabs defaultValue="issue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="issue">Issue Certificate</TabsTrigger>
            <TabsTrigger value="manage">Manage Certificates</TabsTrigger>
            <TabsTrigger value="verify">Verify Certificate</TabsTrigger>
          </TabsList>

          <TabsContent value="issue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Issue New Certificate
                </CardTitle>
                <CardDescription>
                  Create a cryptographically signed certificate with Ed25519 signatures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cert_type">Certificate Type</Label>
                    <Input
                      id="cert_type"
                      value={newCert.cert_type}
                      onChange={(e) => setNewCert(prev => ({ ...prev, cert_type: e.target.value }))}
                      placeholder="e.g., Pilot Verification, Broker Accreditation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject_name">Subject Name</Label>
                    <Input
                      id="subject_name"
                      value={newCert.subject_name}
                      onChange={(e) => setNewCert(prev => ({ ...prev, subject_name: e.target.value }))}
                      placeholder="Full name of certificate holder"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject_email">Subject Email (Optional)</Label>
                    <Input
                      id="subject_email"
                      type="email"
                      value={newCert.subject_email}
                      onChange={(e) => setNewCert(prev => ({ ...prev, subject_email: e.target.value }))}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject_id">Subject ID (Optional)</Label>
                    <Input
                      id="subject_id"
                      value={newCert.subject_id}
                      onChange={(e) => setNewCert(prev => ({ ...prev, subject_id: e.target.value }))}
                      placeholder="User ID or reference"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="summary">Summary</Label>
                  <Input
                    id="summary"
                    value={newCert.summary}
                    onChange={(e) => setNewCert(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Brief description of the certificate"
                  />
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    This certificate will be signed with Ed25519 signatures and includes tamper-proof verification.
                  </AlertDescription>
                </Alert>

                <Button onClick={issueCertificate} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Issue Certificate
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Certificate Registry</CardTitle>
                <CardDescription>Manage issued certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gunmetal" />
                      <Input
                        placeholder="Search certificates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background text-foreground"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="revoked">Revoked</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {filteredCertificates.length === 0 ? (
                    <div className="text-center py-8 text-gunmetal">
                      No certificates found
                    </div>
                  ) : (
                    filteredCertificates.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-800 border-slate-700">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                            <FileText className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{cert.subject_name}</div>
                            <div className="text-sm text-gunmetal">{cert.cert_type}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={cert.status === "active" ? "default" : "secondary"}>
                                {cert.status}
                              </Badge>
                              {cert.status === "active" ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/verify?id=${cert.id}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {cert.status === "active" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => revokeCertificate(cert.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verify" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verify Certificate
                </CardTitle>
                <CardDescription>
                  Verify the authenticity of a certificate using its ID
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="verify_id">Certificate ID</Label>
                    <Input
                      id="verify_id"
                      placeholder="Enter certificate ID to verify"
                      onChange={(e) => {
                        if (e.target.value) {
                          window.open(`/verify?id=${e.target.value}`, '_blank');
                        }
                      }}
                    />
                  </div>
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Verification checks Ed25519 signatures, SHA-256 digests, ledger integrity, and transparency anchors.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
