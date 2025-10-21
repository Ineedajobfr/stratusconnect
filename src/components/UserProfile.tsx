import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, UserPlus, Quote, Shield, MapPin, Building, Calendar, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sanitizeInput } from '@/utils/sanitize';

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
  created_at: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

interface Credential {
  id: string;
  type: string;
  issuer?: string;
  expires_at?: string;
  status: string;
}

interface Reference {
  id: string;
  ref_name: string;
  ref_company?: string;
  ref_contact_masked?: string;
  note?: string;
  status: string;
}

interface Activity {
  id: string;
  kind: string;
  summary: string;
  created_at: string;
}

export const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const fetchProfile = async () => {
    if (!username) return;

    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      const userId = profileData.user_id;

      // Fetch related data
      const [experienceRes, credentialsRes, referencesRes, activityRes] = await Promise.all([
        supabase.from('experience').select('*').eq('user_id', userId).order('start_date', { ascending: false }),
        supabase.from('credentials').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('references').select('*').eq('user_id', userId).eq('status', 'approved'),
        supabase.from('activity').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5)
      ]);

      setExperience(experienceRes.data || []);
      setCredentials(credentialsRes.data || []);
      setReferences(referencesRes.data || []);
      setActivity(activityRes.data || []);

      // Log profile view in activity table
      if (user && user.id !== userId) {
        await supabase.from('activity').insert({
          user_id: userId,
          kind: 'profile_view',
          summary: `Profile viewed by ${user.fullName || user.email}`
        });
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'broker': return 'bg-blue-500/20 text-blue-400';
      case 'operator': return 'bg-green-500/20 text-green-400';
      case 'pilot': case 'crew': return 'bg-purple-500/20 text-purple-400';
      case 'admin': return 'bg-red-500/20 text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getVerificationLevel = (level: number) => {
    return level >= 2 ? 'Level 2 Verified' : level >= 1 ? 'Level 1 Verified' : 'Unverified';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': case 'approved': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'expired': case 'rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string, maskDate = false) => {
    const date = new Date(dateString);
    if (maskDate) {
      return `${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    }
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested user profile could not be found.</p>
            <Button onClick={() => navigate('/directory')}>Browse Directory</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24 mx-auto md:mx-0">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-2xl">
                  {profile.full_name?.split(' ').map(n => n[0]).join('') || profile.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{profile.full_name || profile.username}</h1>
                  <Badge className={getRoleBadgeColor(profile.role)}>
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Shield className="h-3 w-3" />
                    {getVerificationLevel(profile.level)}
                  </Badge>
                </div>
                
                {profile.headline && (
                  <p className="text-lg text-muted-foreground mb-2">{sanitizeInput(profile.headline)}</p>
                )}
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </span>
                  )}
                  {profile.company && (
                    <span className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {profile.company}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {formatDate(profile.created_at)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Button>
                {(profile.role === 'pilot' || profile.role === 'crew') && (
                  <Button variant="outline" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Request to Hire
                  </Button>
                )}
                {(profile.role === 'broker' || profile.role === 'operator') && (
                  <Button variant="outline" className="gap-2">
                    <Quote className="h-4 w-4" />
                    Request Quote
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trust Sheet */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Trust & Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">Identity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">Email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">Phone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">Sanctions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">Role Docs</span>
                  </div>
                  <Button variant="link" className="text-xs p-0 h-auto justify-start">
                    View Details
                  </Button>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-2xl font-bold text-primary">{profile.trust_score}</span>
                  <p className="text-sm text-muted-foreground">Trust Score</p>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            {profile.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground" dangerouslySetInnerHTML={{
                    __html: sanitizeInput(profile.bio, 'richText')
                  }} />
                </CardContent>
              </Card>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {experience.map((exp, index) => (
                      <div key={exp.id}>
                        {index > 0 && <Separator className="mb-4" />}
                        <div>
                          <h4 className="font-semibold">{exp.title}</h4>
                          <p className="text-primary">{exp.company}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                          </p>
                          {exp.description && (
                            <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Credentials */}
            {credentials.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Credentials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {credentials.map((cred) => (
                      <div key={cred.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{cred.type}</p>
                          {cred.expires_at && (
                            <p className="text-xs text-muted-foreground">
                              Expires {formatDate(cred.expires_at, true)}
                            </p>
                          )}
                        </div>
                        <Badge className={getStatusColor(cred.status)}>
                          {cred.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* References */}
            {references.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>References</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {references.map((ref) => (
                      <div key={ref.id}>
                        <p className="font-medium">{ref.ref_name}</p>
                        {ref.ref_company && (
                          <p className="text-sm text-muted-foreground">{ref.ref_company}</p>
                        )}
                        {ref.note && (
                          <p className="text-xs text-muted-foreground italic">"{ref.note}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activity */}
            {activity.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {activity.map((act) => (
                      <div key={act.id} className="text-sm">
                        <p>{act.summary}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(act.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Report Profile */}
        <div className="mt-8 text-center">
          <Button variant="link" className="text-xs text-muted-foreground">
            Report Profile
          </Button>
        </div>
      </div>
    </div>
  );
};
