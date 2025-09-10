import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Settings, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  username: string;
  display_name?: string;
  platform_role?: string;
  avatar_url?: string;
  headline?: string;
  level?: number;
  trust_score?: number;
}

export const ProfileWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const fetchProfile = useCallback(async () => {
              if (!user) return;

              try {
                const { data, error } = await supabase
                  .from('user_profiles')
                  .select('*')
                  .eq('user_id', user.id)
                  .maybeSingle();

                if (error && error.code !== 'PGRST116') {
                  throw error;
                }

                setProfile(data);
              } catch (error) {
                console.error('Error fetching profile:', error);
              } finally {
                setLoading(false);
              }
            }, [user, data, from, select, eq, id, maybeSingle, code]);

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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-muted rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Complete your profile to unlock full platform features.</p>
          <Button onClick={() => navigate('/settings/profile')} className="w-full gap-2">
            <Settings className="h-4 w-4" />
            Setup Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          My Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback>
              {profile.display_name?.split(' ').map(n => n[0]).join('') || profile.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{profile.display_name || profile.username}</h3>
            {profile.headline && (
              <p className="text-sm text-muted-foreground truncate">{profile.headline}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getRoleBadgeColor(profile.platform_role)}>
                {profile.platform_role.charAt(0).toUpperCase() + profile.platform_role.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <Shield className="h-4 w-4 text-green-500" />
            <span className="text-muted-foreground">{getVerificationLevel(profile.level)}</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{profile.trust_score}</span>
            <span className="text-muted-foreground">trust</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/u/${profile.username}`)}
            className="flex-1"
          >
            View Public
          </Button>
          <Button 
            size="sm" 
            onClick={() => navigate('/settings/profile')}
            className="flex-1 gap-2"
          >
            <Settings className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};