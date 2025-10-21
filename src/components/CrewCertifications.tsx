import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Award, Plus, Calendar, CheckCircle, 
  AlertTriangle, FileText, Upload, Eye
} from "lucide-react";

interface CrewCertification {
  id: string;
  crew_id: string;
  certification_name: string;
  certification_number: string;
  issuing_authority: string;
  issue_date: string;
  expiry_date: string;
  status: 'active' | 'expired' | 'pending';
  document_url: string;
  created_at: string;
}

export default function CrewCertifications() {
  const [certifications, setCertifications] = useState<CrewCertification[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [crewProfileId, setCrewProfileId] = useState<string>("");
  const { toast } = useToast();

  const [certificationForm, setCertificationForm] = useState({
    certification_name: "",
    certification_number: "",
    issuing_authority: "",
    issue_date: "",
    expiry_date: "",
    document_url: ""
  });

  useEffect(() => {
    fetchUserData();
    fetchCertifications();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get crew profile ID
        const { data: profile } = await supabase
          .from("crew_profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();
          
        if (profile) {
          setCrewProfileId(profile.id);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchCertifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get crew profile first
      const { data: crewProfile } = await supabase
        .from("crew_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!crewProfile) return;

      const { data, error } = await supabase
        .from("crew_certifications")
        .select("*")
        .eq("crew_id", crewProfile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCertifications((data || []) as CrewCertification[]);
    } catch (error: unknown) {
      console.error("Error fetching certifications:", error);
    }
  };

  const createCertification = async () => {
    if (!certificationForm.certification_name || !crewProfileId) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Determine status based on expiry date
      let status = 'active';
      if (certificationForm.expiry_date) {
        const expiryDate = new Date(certificationForm.expiry_date);
        const today = new Date();
        if (expiryDate < today) {
          status = 'expired';
        }
      }

      const { error } = await supabase
        .from("crew_certifications")
        .insert({
          crew_id: crewProfileId,
          ...certificationForm,
          status
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Certification added successfully",
      });

      setIsCreateDialogOpen(false);
      setCertificationForm({
        certification_name: "",
        certification_number: "",
        issuing_authority: "",
        issue_date: "",
        expiry_date: "",
        document_url: ""
      });
      fetchCertifications();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: (error as Error)?.message || "Failed to add certification",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string, expiryDate?: string) => {
    if (status === 'expired') return 'bg-terminal-danger';
    
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry <= 30) return 'bg-terminal-warning';
    }
    
    return 'bg-terminal-success';
  };

  const getStatusIcon = (status: string, expiryDate?: string) => {
    if (status === 'expired') return <AlertTriangle className="h-4 w-4" />;
    
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry <= 30) return <AlertTriangle className="h-4 w-4" />;
    }
    
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusText = (status: string, expiryDate?: string) => {
    if (status === 'expired') return 'Expired';
    
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry <= 0) return 'Expired';
      if (daysUntilExpiry <= 30) return `Expires in ${daysUntilExpiry} days`;
    }
    
    return 'Active';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Common aviation certifications for suggestions
  const commonCertifications = [
    "Airline Transport Pilot License (ATPL)",
    "Commercial Pilot License (CPL)",
    "Private Pilot License (PPL)",
    "Instrument Rating (IR)",
    "Multi-Engine Rating",
    "Type Rating - Boeing 737",
    "Type Rating - Airbus A320",
    "Flight Attendant Certificate",
    "Medical Certificate - Class 1",
    "Medical Certificate - Class 2",
    "Radio Operator License",
    "English Proficiency Check"
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Certifications & Licenses</h2>
          <p className="text-slate-400">Manage your aviation certifications and qualifications</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-terminal-success hover:bg-terminal-success/80">
              <Plus className="mr-2 h-4 w-4" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Certification</DialogTitle>
              <DialogDescription className="text-slate-400">
                Add your aviation certifications and licenses
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Certification Name</Label>
                  <Input
                    value={certificationForm.certification_name}
                    onChange={(e) => setCertificationForm(prev => ({ 
                      ...prev, 
                      certification_name: e.target.value 
                    }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="e.g., ATPL, Type Rating"
                  />
                  {/* Quick suggestions */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {commonCertifications.slice(0, 3).map((cert) => (
                      <Button
                        key={cert}
                        variant="outline"
                        size="sm"
                        onClick={() => setCertificationForm(prev => ({ 
                          ...prev, 
                          certification_name: cert 
                        }))}
                        className="text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        {cert}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-white">Certificate Number</Label>
                  <Input
                    value={certificationForm.certification_number}
                    onChange={(e) => setCertificationForm(prev => ({ 
                      ...prev, 
                      certification_number: e.target.value 
                    }))}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="License/Certificate Number"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-white">Issuing Authority</Label>
                <Input
                  value={certificationForm.issuing_authority}
                  onChange={(e) => setCertificationForm(prev => ({ 
                    ...prev, 
                    issuing_authority: e.target.value 
                  }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="e.g., FAA, EASA, ICAO"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Issue Date</Label>
                  <Input
                    type="date"
                    value={certificationForm.issue_date}
                    onChange={(e) => setCertificationForm(prev => ({ 
                      ...prev, 
                      issue_date: e.target.value 
                    }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Expiry Date</Label>
                  <Input
                    type="date"
                    value={certificationForm.expiry_date}
                    onChange={(e) => setCertificationForm(prev => ({ 
                      ...prev, 
                      expiry_date: e.target.value 
                    }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Document URL (Optional)</Label>
                <Input
                  value={certificationForm.document_url}
                  onChange={(e) => setCertificationForm(prev => ({ 
                    ...prev, 
                    document_url: e.target.value 
                  }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Link to certificate document"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button onClick={createCertification} className="bg-terminal-success hover:bg-terminal-success/80">
                  Add Certification
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-slate-400">Total Certifications</p>
                <p className="text-xl font-bold text-white">{certifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-terminal-success" />
              <div>
                <p className="text-sm text-slate-400">Active</p>
                <p className="text-xl font-bold text-white">
                  {certifications.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-terminal-warning" />
              <div>
                <p className="text-sm text-slate-400">Expiring Soon</p>
                <p className="text-xl font-bold text-white">
                  {certifications.filter(c => {
                    if (!c.expiry_date) return false;
                    const expiry = new Date(c.expiry_date);
                    const today = new Date();
                    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-terminal-danger" />
              <div>
                <p className="text-sm text-slate-400">Expired</p>
                <p className="text-xl font-bold text-white">
                  {certifications.filter(c => c.status === 'expired' || (c.expiry_date && new Date(c.expiry_date) < new Date())).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certifications List */}
      <div className="space-y-4">
        {certifications.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Award className="h-12 w-12 text-slate-500 mb-4" />
              <p className="text-slate-400 text-center">No certifications added yet</p>
              <p className="text-slate-500 text-sm text-center">Add your aviation certifications to showcase your qualifications</p>
            </CardContent>
          </Card>
        ) : (
          certifications.map((certification) => (
            <Card key={certification.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-white">{certification.certification_name}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {certification.issuing_authority}
                        {certification.certification_number && ` • ${certification.certification_number}`}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(certification.status, certification.expiry_date)} text-white`}>
                    {getStatusIcon(certification.status, certification.expiry_date)}
                    <span className="ml-1">{getStatusText(certification.status, certification.expiry_date)}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {certification.issue_date && (
                    <div>
                      <p className="text-sm text-slate-400">Issue Date</p>
                      <p className="text-white">{formatDate(certification.issue_date)}</p>
                    </div>
                  )}
                  {certification.expiry_date && (
                    <div>
                      <p className="text-sm text-slate-400">Expiry Date</p>
                      <p className="text-white">{formatDate(certification.expiry_date)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-slate-400">Added</p>
                    <p className="text-white">{formatDate(certification.created_at)}</p>
                  </div>
                  {certification.document_url && (
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(certification.document_url, '_blank')}
                        className="border-slate-600 text-white hover:bg-slate-700"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View Document
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
