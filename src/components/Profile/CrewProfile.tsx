// Crew Profile Component
// Comprehensive profile management for cabin crew

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
    Award,
    CheckCircle,
    Edit,
    Globe,
    Loader2,
    Plus,
    Save,
    Shield,
    Users,
    X
} from "lucide-react";
import { useEffect, useState } from "react";

interface CrewProfileProps {
  crewId: string;
}

export function CrewProfile({ crewId }: CrewProfileProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Flight Attendant",
    yearsExperience: 0,
    languages: [] as string[],
    certifications: [] as string[],
    specialties: [] as string[],
    experience: ""
  });

  useEffect(() => {
    loadProfile();
  }, [crewId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Mock data for now
      setFormData({
        fullName: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 234 567 8901",
        role: "Flight Attendant",
        yearsExperience: 8,
        languages: ["English", "French", "Spanish"],
        certifications: ["Safety Training", "First Aid", "Customer Service"],
        specialties: ["VIP Service", "Catering Management"],
        experience: "8 years of corporate aviation cabin crew experience"
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Implementation will save to database
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully"
      });
      
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.fullName) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Crew Profile</h2>
          <p className="text-gray-400">Manage your cabin crew credentials and experience</p>
        </div>
        <div className="flex gap-3">
          {!editing ? (
            <Button
              onClick={() => setEditing(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSaveProfile}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                onClick={() => setEditing(false)}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-600"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Verification Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5 text-green-400" />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-white">Email Verified</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-white">Background Check</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-white">Safety Training</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-white">Medical Certificate</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-600">
          <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500">
            Overview
          </TabsTrigger>
          <TabsTrigger value="certifications" className="data-[state=active]:bg-blue-500">
            Certifications
          </TabsTrigger>
          <TabsTrigger value="experience" className="data-[state=active]:bg-green-500">
            Experience
          </TabsTrigger>
          <TabsTrigger value="languages" className="data-[state=active]:bg-purple-500">
            Languages
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Full Name</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    disabled={!editing}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!editing}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!editing}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Role</Label>
                  <Select value={formData.role} disabled={!editing}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="Flight Attendant" className="text-white">Flight Attendant</SelectItem>
                      <SelectItem value="Purser" className="text-white">Purser</SelectItem>
                      <SelectItem value="Chief Flight Attendant" className="text-white">Chief Flight Attendant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    <span className="text-white">Years Experience</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-400">{formData.yearsExperience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green-400" />
                    <span className="text-white">Languages</span>
                  </div>
                  <span className="text-2xl font-bold text-green-400">{formData.languages.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-400" />
                    <span className="text-white">Certifications</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-400">{formData.certifications.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Your Certifications</h3>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.certifications.map((cert, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-yellow-400" />
                    <h4 className="text-white font-medium">{cert}</h4>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Active
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Professional Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                disabled={!editing}
                className="bg-slate-700 border-slate-600 text-white"
                rows={6}
                placeholder="Describe your cabin crew experience..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Language Skills</h3>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Language
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.languages.map((language, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-blue-400" />
                    <h4 className="text-white font-medium">{language}</h4>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Fluent
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
