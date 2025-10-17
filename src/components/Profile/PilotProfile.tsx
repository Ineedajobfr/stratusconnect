// Pilot Profile Component
// Comprehensive profile management for pilots

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
    Award,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    Loader2,
    Plane,
    Save,
    Shield,
    X
} from "lucide-react";
import { useEffect, useState } from "react";

interface PilotProfileProps {
  pilotId: string;
}

export function PilotProfile({ pilotId }: PilotProfileProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseType: "",
    totalFlightHours: 0,
    ratings: [] as string[],
    certifications: [] as string[],
    experience: ""
  });

  useEffect(() => {
    loadProfile();
  }, [pilotId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Mock data for now
      setFormData({
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 8900",
        licenseNumber: "ATP-123456",
        licenseType: "ATP",
        totalFlightHours: 5000,
        ratings: ["G650", "Citation X"],
        certifications: ["ATP", "Type Rating", "Instrument"],
        experience: "15 years of corporate aviation experience"
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
          <h2 className="text-2xl font-bold text-white">Pilot Profile</h2>
          <p className="text-gray-400">Manage your pilot credentials and experience</p>
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
              <span className="text-white">License Verified</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-white">Background Check</span>
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
          <TabsTrigger value="credentials" className="data-[state=active]:bg-blue-500">
            Credentials
          </TabsTrigger>
          <TabsTrigger value="experience" className="data-[state=active]:bg-green-500">
            Experience
          </TabsTrigger>
          <TabsTrigger value="availability" className="data-[state=active]:bg-purple-500">
            Availability
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
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <span className="text-white">Total Flight Hours</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-400">{formData.totalFlightHours}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-green-400" />
                    <span className="text-white">Type Ratings</span>
                  </div>
                  <span className="text-2xl font-bold text-green-400">{formData.ratings.length}</span>
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

        {/* Credentials Tab */}
        <TabsContent value="credentials" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Pilot License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">License Type</Label>
                  <Select value={formData.licenseType} disabled={!editing}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="ATP" className="text-white">ATP - Airline Transport Pilot</SelectItem>
                      <SelectItem value="CPL" className="text-white">CPL - Commercial Pilot</SelectItem>
                      <SelectItem value="PPL" className="text-white">PPL - Private Pilot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">License Number</Label>
                  <Input
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                    disabled={!editing}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
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
                placeholder="Describe your aviation experience..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Availability Calendar</CardTitle>
              <CardDescription>Manage your availability for assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Availability calendar coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
