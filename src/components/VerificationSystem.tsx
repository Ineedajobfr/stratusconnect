import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Shield, Upload, CheckCircle, AlertCircle, Clock, FileText, Search } from "lucide-react";
import SanctionsScreening from "./SanctionsScreening";

interface VerificationDocument {
  id: string;
  document_type: string;
  file_name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  rejection_reason?: string;
}

const DOCUMENT_TYPES_BY_ROLE = {
  broker: {
    government_id: { label: "Government ID", icon: FileText, required: true },
    company_registration: { label: "Company Registration / Employment Proof", icon: FileText, required: true },
    references: { label: "References", icon: FileText, required: false },
  },
  pilot: {
    license: { label: "Pilot License", icon: FileText, required: true },
    certificate: { label: "Aircraft Certificate", icon: FileText, required: true },
    insurance: { label: "Insurance Documentation", icon: Shield, required: true },
    company_registration: { label: "Company Registration", icon: FileText, required: false },
  },
  crew: {
    license: { label: "Pilot License", icon: FileText, required: true },
    certificate: { label: "Aircraft Certificate", icon: FileText, required: true },
    insurance: { label: "Insurance Documentation", icon: Shield, required: true },
    company_registration: { label: "Company Registration", icon: FileText, required: false },
  },
  operator: {
    license: { label: "Pilot License", icon: FileText, required: true },
    certificate: { label: "Aircraft Certificate", icon: FileText, required: true },
    insurance: { label: "Insurance Documentation", icon: Shield, required: true },
    company_registration: { label: "Company Registration", icon: FileText, required: false },
  },
  admin: {
    government_id: { label: "Government ID", icon: FileText, required: true },
    company_registration: { label: "Company Registration / Employment Proof", icon: FileText, required: true },
  }
};

export default function VerificationSystem() {
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [isIndependentBroker, setIsIndependentBroker] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserRole();
    fetchDocuments();
  }, []);

  const fetchUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("platform_role")
        .eq("user_id", user.id)
        .single();
      setUserRole((data as Record<string, unknown>)?.platform_role as string || "");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("verification_documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments((data || []) as VerificationDocument[]);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleFileUpload = async (documentType: string, file: File) => {
    if (!file) return;

    setUploading(documentType);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('verification-docs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('verification-docs')
        .getPublicUrl(fileName);

      // Save document record
      const { error: dbError } = await supabase
        .from("verification_documents")
        .insert([{
          user_id: user.id,
          document_type: documentType,
          file_url: publicUrl,
          file_name: file.name,
          status: 'pending'
        }]);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document uploaded successfully. It will be reviewed shortly.",
      });

      fetchDocuments();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const getDocumentForType = (docType: string) => {
    return documents.find(doc => doc.document_type === docType);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-terminal-success" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-terminal-danger" />;
      default:
        return <Clock className="h-4 w-4 text-terminal-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-terminal-success/20 text-terminal-success border-terminal-success/30';
      case 'rejected':
        return 'bg-terminal-danger/20 text-terminal-danger border-terminal-danger/30';
      default:
        return 'bg-terminal-warning/20 text-terminal-warning border-terminal-warning/30';
    }
  };

  const getDocumentTypes = () => {
    const roleDocTypes = DOCUMENT_TYPES_BY_ROLE[userRole as keyof typeof DOCUMENT_TYPES_BY_ROLE];
    if (userRole === 'broker' && isIndependentBroker) {
      return {
        government_id: { label: "Government ID", icon: FileText, required: true },
        tax_registration: { label: "Tax Registration / Sole Trader Document", icon: FileText, required: true },
        references: { label: "References", icon: FileText, required: false },
      };
    }
    return roleDocTypes || DOCUMENT_TYPES_BY_ROLE.pilot;
  };

  const calculateProgress = () => {
    const documentTypes = getDocumentTypes();
    const requiredDocs = Object.entries(documentTypes).filter(([_, config]) => config.required);
    const approvedDocs = requiredDocs.filter(([docType, _]) => {
      const doc = getDocumentForType(docType);
      return doc && doc.status === 'approved';
    });
    return (approvedDocs.length / requiredDocs.length) * 100;
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Fortress of Trust Verification</h2>
        <p className="text-slate-400">Complete multi-layered verification including document upload and sanctions screening</p>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
          <TabsTrigger value="documents" className="data-[state=active]:bg-slate-700">
            <FileText className="mr-2 h-4 w-4" />
            Document Verification
          </TabsTrigger>
          <TabsTrigger value="sanctions" className="data-[state=active]:bg-slate-700">
            <Search className="mr-2 h-4 w-4" />
            Sanctions Screening
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6 mt-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Document Verification Status
              </CardTitle>
              <CardDescription className="text-slate-400">
                Upload your professional credentials for platform verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white">{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              {progress === 100 && (
                <div className="flex items-center space-x-2 text-success">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Document Verification Complete</span>
                </div>
              )}
            </CardContent>
          </Card>

          {userRole === 'broker' && (
            <Card className="bg-slate-800/50 border-slate-700 mb-4">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-white font-medium">Business Type</h3>
                  <div className="space-y-3">
                    <Label className="flex items-center space-x-3 cursor-pointer">
                      <Input
                        type="radio"
                        name="brokerType"
                        checked={!isIndependentBroker}
                        onChange={() => setIsIndependentBroker(false)}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-400">I have a company</span>
                    </Label>
                    <Label className="flex items-center space-x-3 cursor-pointer">
                      <Input
                        type="radio"
                        name="brokerType"
                        checked={isIndependentBroker}
                        onChange={() => setIsIndependentBroker(true)}
                        className="w-4 h-4"
                      />
                      <span className="text-slate-400">I am an independent broker</span>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
        {Object.entries(getDocumentTypes()).map(([docType, config]) => {
          const document = getDocumentForType(docType);
          const Icon = config.icon;
          
          return (
            <Card key={docType} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-white font-medium">{config.label}</h3>
                      <p className="text-sm text-slate-400">
                        {config.required ? "Required" : "Optional"} • 
                        {document ? ` Uploaded ${new Date(document.created_at).toLocaleDateString()}` : " Not uploaded"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {document && (
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(document.status)}
                        <Badge className={getStatusColor(document.status)}>
                          {document.status}
                        </Badge>
                      </div>
                    )}
                    
                    {!document || document.status === 'rejected' ? (
                      <div className="relative">
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(docType, file);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading === docType}
                        />
                        <Button
                          variant="outline"
                          disabled={uploading === docType}
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                        >
                          {uploading === docType ? (
                            "Uploading..."
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              {document ? "Re-upload" : "Upload"}
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" className="text-slate-400">
                        Submitted
                      </Button>
                    )}
                  </div>
                </div>
                
                {document?.status === 'rejected' && document.rejection_reason && (
                  <div className="mt-3 p-3 bg-terminal-danger/10 border border-terminal-danger/20 rounded">
                    <p className="text-sm text-terminal-danger">
                      <strong>Rejection Reason:</strong> {document.rejection_reason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
          })}
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <h4 className="text-white font-medium mb-2">Document Requirements</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Documents must be clear and legible</li>
                    <li>• Accepted formats: PDF, JPG, PNG, DOC, DOCX</li>
                    <li>• Maximum file size: 10MB per document</li>
                    <li>• All documents must be current and valid</li>
                    <li>• Verification typically takes 1-2 business days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sanctions" className="mt-6">
          <SanctionsScreening />
        </TabsContent>
      </Tabs>
    </div>
  );
}