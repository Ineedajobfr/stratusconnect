import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { NavigationArrows } from '@/components/NavigationArrows';
import { DemoBanner } from '@/components/DemoBanner';
import { Search, Filter, Shield, MapPin, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  headline?: string;
  location?: string;
  company?: string;
  level: number;
  trust_score: number;
  created_at: string;
}

export default function Directory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [sortBy, setSortBy] = useState('trust_score');

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    filterAndSortProfiles();
  }, [profiles, searchTerm, roleFilter, levelFilter, sortBy]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('trust_score', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProfiles = () => {
    let filtered = [...profiles];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(profile => 
        profile.full_name?.toLowerCase().includes(search) ||
        profile.username.toLowerCase().includes(search) ||
        profile.headline?.toLowerCase().includes(search) ||
        profile.company?.toLowerCase().includes(search) ||
        profile.location?.toLowerCase().includes(search)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(profile => profile.role === roleFilter);
    }

    // Level filter
    if (levelFilter !== 'all') {
      const level = parseInt(levelFilter);
      filtered = filtered.filter(profile => profile.level >= level);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'trust_score':
          return b.trust_score - a.trust_score;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'name':
          return (a.full_name || a.username).localeCompare(b.full_name || b.username);
        default:
          return 0;
      }
    });

    setFilteredProfiles(filtered);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'broker': return 'bg-accent/20 text-accent';
      case 'operator': return 'bg-accent/20 text-accent';
      case 'pilot': case 'crew': return 'bg-accent/20 text-accent';
      case 'admin': return 'bg-accent/20 text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getVerificationLevel = (level: number) => {
    return level >= 2 ? 'Level 2' : level >= 1 ? 'Level 1' : 'Unverified';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading directory...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      <DemoBanner />
      <div className="fixed top-20 right-6 z-40">
        <NavigationArrows />
      </div>
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Professional Directory</h1>
          <p className="text-muted-foreground">Connect with verified aviation professionals</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name, company, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="broker">Brokers</SelectItem>
                  <SelectItem value="operator">Operators</SelectItem>
                  <SelectItem value="pilot">Pilots</SelectItem>
                  <SelectItem value="crew">Crew</SelectItem>
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="2">Level 2+</SelectItem>
                  <SelectItem value="1">Level 1+</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trust_score">Trust Score</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback>
                      {profile.full_name?.split(' ').map(n => n[0]).join('') || profile.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{profile.full_name || profile.username}</h3>
                    {profile.headline && (
                      <p className="text-sm text-muted-foreground">{profile.headline}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getRoleBadgeColor(profile.role)}>
                        {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Shield className="h-3 w-3" />
                        {getVerificationLevel(profile.level)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {profile.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                  )}
                  {profile.company && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      {profile.company}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{profile.trust_score}</div>
                    <div className="text-xs text-muted-foreground">Trust Score</div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={() => navigate(`/u/${profile.username}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No profiles found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}