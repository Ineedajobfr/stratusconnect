import { DemoBanner } from '@/components/DemoBanner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Save, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  headline?: string;
  bio?: string;
  location?: string;
  company?: string;
  level: number;
  trust_score: number;
}

interface Experience {
  id?: string;
  title: string;
  company: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

interface PrivacySettings {
  show_email: boolean;
  show_phone: boolean;
  show_activity: boolean;
  allow_messages: boolean;
}

export default function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    show_email: false,
    show_phone: false,
    show_activity: true,
    allow_messages: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user, fetchProfileData]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        setProfile(profileData);
      } else {
        // Create initial profile
        const username = await generateUsername();
        const newProfile = {
          user_id: user.id,
          username,
          full_name: user.fullName,
          role: user.role,
          level: 1,
          trust_score: 0
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;
        setProfile(createdProfile);
      }

      // Fetch experience
      const { data: experienceData } = await supabase
        .from('experience')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      setExperience(experienceData || []);

      // Fetch privacy settings
      const { data: privacyData } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (privacyData) {
        setPrivacySettings({
          show_email: privacyData.show_email,
          show_phone: privacyData.show_phone,
          show_activity: privacyData.show_activity,
          allow_messages: privacyData.allow_messages
        });
      } else {
        // Create default privacy settings
        await supabase.from('privacy_settings').insert([{
          user_id: user.id,
          ...privacySettings
        }]);
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateUsername = async () => {
    try {
      const { data, error } = await supabase.rpc('generate_unique_profile_username');
      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to basic generation
      return user?.email?.split('@')[0] + Math.random().toString(36).substr(2, 4) || 'user' + Math.random().toString(36).substr(2, 7);
    }
  };

  const saveProfile = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profile.full_name,
          headline: profile.headline,
          bio: profile.bio,
          location: profile.location,
          company: profile.company
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const saveExperience = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Delete existing experience
      await supabase.from('experience').delete().eq('user_id', user.id);

      // Insert new experience
      if (experience.length > 0) {
        const experienceData = experience.map(exp => ({
          ...exp,
          user_id: user.id,
          id: undefined // Let database generate new IDs
        }));

        const { error } = await supabase.from('experience').insert(experienceData);
        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Experience updated successfully'
      });
    } catch (error) {
      console.error('Error saving experience:', error);
      toast({
        title: 'Error',
        description: 'Failed to save experience',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const savePrivacySettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('privacy_settings')
        .upsert({
          user_id: user.id,
          ...privacySettings
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Privacy settings updated successfully'
      });
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save privacy settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    setExperience([...experience, {
      title: '',
      company: '',
      start_date: '',
      end_date: '',
      description: ''
    }]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  const removeExperience = (index: number) => {
    const updated = experience.filter((_, i) => i !== index);
    setExperience(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Profile Setup Required</h2>
            <p className="text-muted-foreground">Please complete your profile setup.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      <DemoBanner />
      <div className="fixed top-20 right-6 z-40">
      </div>
      <div className="container mx-auto px-4 py-8 pt-20 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your public profile and privacy settings</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Public Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="text-lg">
                      {profile.full_name?.split(' ').map(n => n[0]).join('') || profile.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Avatar
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profile.username}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Username cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profile.full_name || ''}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headline">Headline</Label>
                    <Input
                      id="headline"
                      value={profile.headline || ''}
                      onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                      placeholder="Professional title or tagline"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location || ''}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profile.company || ''}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell others about yourself (max 400 characters)"
                    maxLength={400}
                    className="min-h-20"
                  />
                  <p className="text-xs text-muted-foreground">
                    {(profile.bio || '').length}/400 characters
                  </p>
                </div>

                <Button onClick={saveProfile} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Professional Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Experience {index + 1}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateExperience(index, 'title', e.target.value)}
                          placeholder="e.g. Senior Pilot"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                          placeholder="e.g. Emirates Airlines"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={exp.start_date}
                          onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={exp.end_date || ''}
                          onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                          placeholder="Leave empty if current"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description || ''}
                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        placeholder="Brief description of responsibilities and achievements"
                        className="min-h-16"
                      />
                    </div>
                  </div>
                ))}

                <div className="flex gap-4">
                  <Button variant="outline" onClick={addExperience} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Experience
                  </Button>

                  <Button onClick={saveExperience} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Experience
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show_email">Show Email</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your email address</p>
                    </div>
                    <Switch
                      id="show_email"
                      checked={privacySettings.show_email}
                      onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, show_email: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show_phone">Show Phone</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your phone number</p>
                    </div>
                    <Switch
                      id="show_phone"
                      checked={privacySettings.show_phone}
                      onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, show_phone: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show_activity">Show Activity</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your recent activity</p>
                    </div>
                    <Switch
                      id="show_activity"
                      checked={privacySettings.show_activity}
                      onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, show_activity: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allow_messages">Allow Messages</Label>
                      <p className="text-sm text-muted-foreground">Allow others to send you messages</p>
                    </div>
                    <Switch
                      id="allow_messages"
                      checked={privacySettings.allow_messages}
                      onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, allow_messages: checked })}
                    />
                  </div>
                </div>

                <Button onClick={savePrivacySettings} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
