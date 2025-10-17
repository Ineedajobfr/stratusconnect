// Operator Profile Component
// Comprehensive profile management for operators

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { profileService, type OperatorProfile as OperatorProfileType } from "@/lib/profile-service";
import {
    Award,
    Building,
    CheckCircle,
    Clock,
    Edit,
    FileText,
    Loader2,
    MapPin,
    Plane,
    Plus,
    RefreshCw,
    Save,
    Shield,
    User,
    X
} from "lucide-react";
import { useEffect, useState } from "react";

interface OperatorProfileProps {
  operatorId: string;
}

export function OperatorProfile({ operatorId }: OperatorProfileProps) {
  const { toast } = useToast();
  const [profile, setProfile] = useState<OperatorProfileType | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    companyName: "",
    fullName: "",
    phone: "",
    licenseNumber: "",
    aocNumber: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    headquarters: "",
    establishedYear: new Date().getFullYear()
  });

  useEffect(() => {
    loadProfile();
  }, [operatorId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await profileService.getOperatorProfile(operatorId);
      setProfile(data);
      
      // Update form data
      setFormData({
        companyName: data.companyName,
        fullName: data.fullName,
        phone: data.phone || "",
        licenseNumber: data.companyInfo.licenseNumber || "",
        aocNumber: data.companyInfo.aocNumber || "",
        insuranceProvider: data.companyInfo.insuranceProvider || "",
        insurancePolicyNumber: data.companyInfo.insurancePolicyNumber || "",
        headquarters: data.companyInfo.headquarters || "",
        establishedYear: data.companyInfo.establishedYear || new Date().getFullYear()
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
      await profileService.updateOperatorProfile(operatorId, {
        ...profile!,
        companyName: formData.companyName,
        fullName: formData.fullName,
        phone: formData.phone,
        companyInfo: {
          ...profile?.companyInfo,
          licenseNumber: formData.licenseNumber,
          aocNumber: formData.aocNumber,
          insuranceProvider: formData.insuranceProvider,
          insurancePolicyNumber: formData.insurancePolicyNumber,
          headquarters: formData.headquarters,
          establishedYear: formData.establishedYear
        }
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully"
      });
      
      setEditing(false);
      loadProfile();
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

  const handleRequestVerification = async (type: 'email' | 'phone' | 'identity' | 'business') => {
    try {
      await profileService.requestVerification(operatorId, type);
      toast({
        title: "Verification Requested",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} verification has been requested`
      });
    } catch (error) {
      console.error('Error requesting verification:', error);
      toast({
        title: "Request Failed",
        description: "Failed to request verification",
        variant: "destructive"
      });
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Profile Not Found</h3>
        <p className="text-gray-400 mb-6">
          Unable to load profile information
        </p>
        <Button onClick={loadProfile} className="bg-orange-500 hover:bg-orange-600 text-white">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Operator Profile</h2>
          <p className="text-gray-400">Manage your company information and credentials</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={loadProfile}
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
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
                onClick={() => {
                  setEditing(false);
                  loadProfile();
                }}
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
          <CardDescription>Complete verifications to build trust</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${profile.verifications.emailVerified ? 'text-green-400' : 'text-gray-400'}`} />
                <span className="text-white">Email</span>
              </div>
              {!profile.verifications.emailVerified && (
                <Button
                  size="sm"
                  onClick={() => handleRequestVerification('email')}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Verify
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${profile.verifications.phoneVerified ? 'text-green-400' : 'text-gray-400'}`} />
                <span className="text-white">Phone</span>
              </div>
              {!profile.verifications.phoneVerified && (
                <Button
                  size="sm"
                  onClick={() => handleRequestVerification('phone')}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Verify
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${profile.verifications.identityVerified ? 'text-green-400' : 'text-gray-400'}`} />
                <span className="text-white">Identity</span>
              </div>
              {!profile.verifications.identityVerified && (
                <Button
                  size="sm"
                  onClick={() => handleRequestVerification('identity')}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Verify
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${profile.verifications.businessVerified ? 'text-green-400' : 'text-gray-400'}`} />
                <span className="text-white">Business</span>
              </div>
              {!profile.verifications.businessVerified && (
                <Button
                  size="sm"
                  onClick={() => handleRequestVerification('business')}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Verify
                </Button>
              )}
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
          <TabsTrigger value="company" className="data-[state=active]:bg-blue-500">
            Company
          </TabsTrigger>
          <TabsTrigger value="certifications" className="data-[state=active]:bg-green-500">
            Certifications
          </TabsTrigger>
          <TabsTrigger value="fleet" className="data-[state=active]:bg-purple-500">
            Fleet
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="text-white">{profile.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Company</p>
                    <p className="text-white">{profile.companyName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Headquarters</p>
                    <p className="text-white">{profile.companyInfo.headquarters || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Established</p>
                    <p className="text-white">{profile.companyInfo.establishedYear || 'Not specified'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Certifications & Fleet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-400" />
                    <span className="text-white">Certifications</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-400">{profile.certifications.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-blue-400" />
                    <span className="text-white">Fleet Size</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-400">{profile.fleet.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-400" />
                    <span className="text-white">Total Flights</span>
                  </div>
                  <span className="text-2xl font-bold text-green-400">{profile.companyInfo.totalFlights || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Company Information</CardTitle>
              <CardDescription>Your company details and credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Company Name</Label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    disabled={!editing}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Contact Name</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    disabled={!editing}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!editing}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">License Number</Label>
                  <Input
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                    disabled={!editing}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">AOC Number</Label>
                  <Input
                    value={formData.aocNumber}
                    onChange={(e) => setFormData({...formData, aocNumber: e.target.value})}
                    disabled={!editing}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Insurance Provider</Label>
                  <Input
                    value={formData.insuranceProvider}
                    onChange={(e) => setFormData({...formData, insuranceProvider: e.target.value})}
                    disabled={!editing}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Insurance Policy Number</Label>
                  <Input
                    value={formData.insurancePolicyNumber}
                    onChange={(e) => setFormData({...formData, insurancePolicyNumber: e.target.value})}
                    disabled={!editing}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Headquarters</Label>
                  <Input
                    value={formData.headquarters}
                    onChange={(e) => setFormData({...formData, headquarters: e.target.value})}
                    disabled={!editing}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Year Established</Label>
                  <Input
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => setFormData({...formData, establishedYear: parseInt(e.target.value) || 2024})}
                    disabled={!editing}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
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

          {profile.certifications.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-12 text-center">
                <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Certifications</h3>
                <p className="text-gray-400 mb-6">
                  Add certifications to build trust with brokers
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Certification
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.certifications.map((cert) => (
                <Card key={cert.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium">{cert.name}</h4>
                        <p className="text-sm text-gray-400">{cert.issuer}</p>
                      </div>
                      <Badge className={
                        cert.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        cert.status === 'expired' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }>
                        {cert.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-400">
                      {cert.certificateNumber && (
                        <div>Certificate: {cert.certificateNumber}</div>
                      )}
                      <div>Issued: {new Date(cert.issuedDate).toLocaleDateString()}</div>
                      {cert.expiryDate && (
                        <div>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Fleet Tab */}
        <TabsContent value="fleet" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Your Fleet</h3>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Aircraft
            </Button>
          </div>

          {profile.fleet.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-12 text-center">
                <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Aircraft</h3>
                <p className="text-gray-400 mb-6">
                  Add aircraft to your fleet to start creating listings
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Aircraft
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.fleet.map((aircraft) => (
                <Card key={aircraft.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">
                          {aircraft.manufacturer} {aircraft.model}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {aircraft.registration}
                        </CardDescription>
                      </div>
                      <Badge className={
                        aircraft.availability === 'available' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        aircraft.availability === 'in-use' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }>
                        {aircraft.availability}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-gray-400 space-y-1">
                      <div>Category: {aircraft.category}</div>
                      <div>Seats: {aircraft.seats}</div>
                      {aircraft.yearOfManufacture && (
                        <div>Year: {aircraft.yearOfManufacture}</div>
                      )}
                      {aircraft.totalFlightHours && (
                        <div>Flight Hours: {aircraft.totalFlightHours.toLocaleString()}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
