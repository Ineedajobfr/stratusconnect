import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Plane, MapPin, Clock, Star, Globe, Save, Upload } from "lucide-react";
interface CrewProfile {
  id: string;
  user_id: string;
  crew_type: 'pilot' | 'co_pilot' | 'flight_attendant' | 'engineer';
  license_number: string;
  license_type: string;
  experience_years: number;
  total_flight_hours: number;
  certifications: string[];
  languages: string[];
  availability_status: 'available' | 'busy' | 'off_duty';
  hourly_rate: number;
  base_location: string;
  willing_to_travel: boolean;
  bio: string;
  profile_image_url: string;
}
export default function CrewProfile() {
  const [profile, setProfile] = useState<CrewProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const {
    toast
  } = useToast();
  const [profileForm, setProfileForm] = useState({
    crew_type: "pilot",
    license_number: "",
    license_type: "",
    experience_years: 0,
    total_flight_hours: 0,
    certifications: [] as string[],
    languages: [] as string[],
    availability_status: "available",
    hourly_rate: 0,
    base_location: "",
    willing_to_travel: true,
    bio: ""
  });
  useEffect(() => {
    fetchUserData();
    fetchProfile();
  }, []);
  const fetchUserData = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const fetchProfile = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;
      const {
        data,
        error
      } = await supabase.from("crew_profiles").select("*").eq("user_id", user.id).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setProfile(data as CrewProfile);
        setProfileForm({
          crew_type: data.crew_type,
          license_number: data.license_number || "",
          license_type: data.license_type || "",
          experience_years: data.experience_years || 0,
          total_flight_hours: data.total_flight_hours || 0,
          certifications: data.certifications || [],
          languages: data.languages || [],
          availability_status: data.availability_status,
          hourly_rate: data.hourly_rate || 0,
          base_location: data.base_location || "",
          willing_to_travel: data.willing_to_travel,
          bio: data.bio || ""
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
    }
  };
  const saveProfile = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;
      const profileData = {
        user_id: user.id,
        ...profileForm
      };
      let error;
      if (profile) {
        ({
          error
        } = await supabase.from("crew_profiles").update(profileData).eq("user_id", user.id));
      } else {
        ({
          error
        } = await supabase.from("crew_profiles").insert(profileData));
      }
      if (error) throw error;
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      setIsEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive"
      });
    }
  };
  const addCertification = () => {
    setProfileForm(prev => ({
      ...prev,
      certifications: [...prev.certifications, ""]
    }));
  };
  const updateCertification = (index: number, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => i === index ? value : cert)
    }));
  };
  const removeCertification = (index: number) => {
    setProfileForm(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };
  const addLanguage = () => {
    setProfileForm(prev => ({
      ...prev,
      languages: [...prev.languages, ""]
    }));
  };
  const updateLanguage = (index: number, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => i === index ? value : lang)
    }));
  };
  const removeLanguage = (index: number) => {
    setProfileForm(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };
  if (!profile && !isEditing) {
    return <div className="space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-slate-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Create Your Crew Profile</h3>
            <p className="text-slate-400 text-center mb-6">
              Set up your professional aviation profile to start receiving job opportunities
            </p>
            <Button onClick={() => setIsEditing(true)} className="bg-terminal-success hover:bg-terminal-success/80">
              <User className="mr-2 h-4 w-4" />
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Crew Profile</h2>
          <p className="text-slate-400">Manage your professional aviation profile</p>
        </div>
        {!isEditing ? <Button onClick={() => setIsEditing(true)} variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
            Edit Profile
          </Button> : <div className="flex space-x-2">
            <Button onClick={() => setIsEditing(false)} variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
              Cancel
            </Button>
            <Button onClick={saveProfile} className="bg-terminal-success hover:bg-terminal-success/80 bg-black">
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </Button>
          </div>}
      </div>

      {isEditing ? <div className="grid gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Crew Type</Label>
                  <Select value={profileForm.crew_type} onValueChange={value => setProfileForm(prev => ({
                ...prev,
                crew_type: value
              }))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="pilot" className="text-white">Pilot</SelectItem>
                      <SelectItem value="co_pilot" className="text-white">Co-Pilot</SelectItem>
                      <SelectItem value="flight_attendant" className="text-white">Flight Attendant</SelectItem>
                      <SelectItem value="engineer" className="text-white">Flight Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">License Number</Label>
                  <Input value={profileForm.license_number} onChange={e => setProfileForm(prev => ({
                ...prev,
                license_number: e.target.value
              }))} className="bg-slate-700 border-slate-600 text-white" placeholder="License/Certificate Number" />
                </div>
                <div>
                  <Label className="text-white">License Type</Label>
                  <Input value={profileForm.license_type} onChange={e => setProfileForm(prev => ({
                ...prev,
                license_type: e.target.value
              }))} className="bg-slate-700 border-slate-600 text-white" placeholder="ATP, CPL, PPL, etc." />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Experience (Years)</Label>
                  <Input type="number" value={profileForm.experience_years} onChange={e => setProfileForm(prev => ({
                ...prev,
                experience_years: parseInt(e.target.value) || 0
              }))} className="bg-slate-700 border-slate-600 text-white" />
                </div>
                <div>
                  <Label className="text-white">Total Flight Hours</Label>
                  <Input type="number" value={profileForm.total_flight_hours} onChange={e => setProfileForm(prev => ({
                ...prev,
                total_flight_hours: parseInt(e.target.value) || 0
              }))} className="bg-slate-700 border-slate-600 text-white" />
                </div>
                <div>
                  <Label className="text-white">Hourly Rate ($)</Label>
                  <Input type="number" value={profileForm.hourly_rate} onChange={e => setProfileForm(prev => ({
                ...prev,
                hourly_rate: parseFloat(e.target.value) || 0
              }))} className="bg-slate-700 border-slate-600 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Base Location</Label>
                  <Input value={profileForm.base_location} onChange={e => setProfileForm(prev => ({
                ...prev,
                base_location: e.target.value
              }))} className="bg-slate-700 border-slate-600 text-white" placeholder="City, State/Country" />
                </div>
                <div>
                  <Label className="text-white">Availability Status</Label>
                  <Select value={profileForm.availability_status} onValueChange={value => setProfileForm(prev => ({
                ...prev,
                availability_status: value
              }))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="available" className="text-white">Available</SelectItem>
                      <SelectItem value="busy" className="text-white">Busy</SelectItem>
                      <SelectItem value="off_duty" className="text-white">Off Duty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch checked={profileForm.willing_to_travel} onCheckedChange={checked => setProfileForm(prev => ({
              ...prev,
              willing_to_travel: checked
            }))} className="text-gray-50 bg-gray-600 hover:bg-gray-500" />
                <Label className="text-white">Willing to travel</Label>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Certifications</CardTitle>
              <CardDescription className="text-slate-400">
                Add your aviation certifications and ratings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileForm.certifications.map((cert, index) => <div key={index} className="flex gap-2">
                  <Input value={cert} onChange={e => updateCertification(index, e.target.value)} className="bg-slate-700 border-slate-600 text-white" placeholder="e.g., Instrument Rating, Type Rating A320" />
                  <Button variant="outline" size="sm" onClick={() => removeCertification(index)} className="border-slate-600 text-white hover:bg-slate-700">
                    Remove
                  </Button>
                </div>)}
              <Button variant="outline" onClick={addCertification} className="border-slate-600 text-white hover:bg-slate-700">
                Add Certification
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Languages</CardTitle>
              <CardDescription className="text-slate-400">
                Languages you speak fluently
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileForm.languages.map((lang, index) => <div key={index} className="flex gap-2">
                  <Input value={lang} onChange={e => updateLanguage(index, e.target.value)} className="bg-slate-700 border-slate-600 text-white" placeholder="e.g., English, Spanish, French" />
                  <Button variant="outline" size="sm" onClick={() => removeLanguage(index)} className="border-slate-600 text-white hover:bg-slate-700">
                    Remove
                  </Button>
                </div>)}
              <Button variant="outline" onClick={addLanguage} className="border-slate-600 text-white hover:bg-slate-700">
                Add Language
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Professional Bio</CardTitle>
              <CardDescription className="text-slate-400">
                Tell potential employers about your experience and expertise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea value={profileForm.bio} onChange={e => setProfileForm(prev => ({
            ...prev,
            bio: e.target.value
          }))} className="bg-slate-700 border-slate-600 text-white min-h-24" placeholder="Describe your aviation experience, specialties, and what makes you a great crew member..." />
            </CardContent>
          </Card>
        </div> : profile && <div className="grid gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-2xl font-bold text-white capitalize">
                        {profile.crew_type.replace('_', ' ')}
                      </h3>
                      <Badge className={`${profile.availability_status === 'available' ? 'bg-terminal-success' : profile.availability_status === 'busy' ? 'bg-terminal-warning' : 'bg-slate-500'} text-white`}>
                        {profile.availability_status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Plane className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">{profile.total_flight_hours} hours</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">{profile.experience_years} years</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">{profile.base_location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">${profile.hourly_rate}/hr</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {profile.bio && <div className="mt-6 pt-6 border-t border-slate-700">
                    <p className="text-slate-300">{profile.bio}</p>
                  </div>}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profile.certifications && profile.certifications.length > 0 ? profile.certifications.map((cert, index) => <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                          {cert}
                        </Badge>) : <p className="text-slate-400">No certifications added</p>}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profile.languages && profile.languages.length > 0 ? profile.languages.map((lang, index) => <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                          <Globe className="mr-1 h-3 w-3" />
                          {lang}
                        </Badge>) : <p className="text-slate-400">No languages added</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>}
    </div>;
}