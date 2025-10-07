import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import {
    AlertTriangle,
    Award,
    CheckCircle,
    Clock,
    DollarSign,
    Heart,
    MapPin,
    MessageSquare,
    Plus,
    Search,
    Star,
    XCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface SavedCrew {
  id: string;
  broker_id: string;
  crew_id: string;
  notes: string;
  tags: string[];
  rating: number;
  saved_at: string;
  crew: {
    name: string;
    email: string;
    role: 'pilot' | 'crew';
    avatar: string;
    location: string;
    experience_years: number;
    total_flight_hours: number;
    skills: string[];
    certifications: string[];
    aircraft_types: string[];
    hourly_rate_min: number;
    hourly_rate_max: number;
    availability_status: 'available' | 'busy' | 'unavailable';
    last_active: string;
    verified: boolean;
    portfolio_urls: string[];
    bio: string;
    languages: string[];
    timezone: string;
  };
}

interface SavedCrewsProps {
  brokerId: string;
}

const SavedCrews = React.memo(function SavedCrews({ brokerId }: SavedCrewsProps) {
  const { user } = useAuth();
  const [savedCrews, setSavedCrews] = useState<SavedCrew[]>([]);
  const [filteredCrews, setFilteredCrews] = useState<SavedCrew[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [showAddCrewDialog, setShowAddCrewDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [crewToRemove, setCrewToRemove] = useState<string | null>(null);
  const [removeCountdown, setRemoveCountdown] = useState(5);
  const [newCrew, setNewCrew] = useState({
    crew_id: '',
    notes: '',
    tags: [] as string[],
    rating: 5
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockSavedCrews: SavedCrew[] = [
      {
        id: '1',
        broker_id: brokerId,
        crew_id: 'crew-1',
        notes: 'Excellent pilot with great communication skills. Always punctual and professional.',
        tags: ['reliable', 'experienced', 'gulfstream', 'international'],
        rating: 5,
        saved_at: '2024-01-15T10:00:00Z',
        crew: {
          name: 'Captain Sarah Johnson',
          email: 'sarah.johnson@example.com',
          role: 'pilot',
          avatar: '/avatars/sarah-johnson.jpg',
          location: 'New York, NY',
          experience_years: 12,
          total_flight_hours: 8500,
          skills: ['Gulfstream G650', 'Gulfstream G550', 'ATP', 'Type Rating', 'International Experience'],
          certifications: ['ATP', 'G650 Type Rating', 'G550 Type Rating', 'First Class Medical'],
          aircraft_types: ['Gulfstream G650', 'Gulfstream G550', 'Bombardier Global 6000'],
          hourly_rate_min: 140,
          hourly_rate_max: 180,
          availability_status: 'available',
          last_active: '2024-01-20T15:30:00Z',
          verified: true,
          portfolio_urls: ['https://linkedin.com/in/sarah-johnson', 'https://portfolio.sarah.com'],
          bio: 'Experienced corporate pilot with 12 years of experience flying high-end business jets.',
          languages: ['English', 'Spanish', 'French'],
          timezone: 'EST'
        }
      },
      {
        id: '2',
        broker_id: brokerId,
        crew_id: 'crew-2',
        notes: 'Great flight attendant with excellent customer service skills. Perfect for luxury operations.',
        tags: ['customer-service', 'luxury', 'international', 'wine-service'],
        rating: 4,
        saved_at: '2024-01-18T14:20:00Z',
        crew: {
          name: 'Maria Rodriguez',
          email: 'maria.rodriguez@example.com',
          role: 'crew',
          avatar: '/avatars/maria-rodriguez.jpg',
          location: 'Los Angeles, CA',
          experience_years: 8,
          total_flight_hours: 0,
          skills: ['Customer Service', 'Safety Training', 'Wine Service', 'International Experience'],
          certifications: ['FAA Flight Attendant Certificate', 'CPR', 'First Aid', 'Wine Service'],
          aircraft_types: ['Gulfstream G650', 'Gulfstream G550', 'Bombardier Global 6000'],
          hourly_rate_min: 45,
          hourly_rate_max: 65,
          availability_status: 'busy',
          last_active: '2024-01-19T09:15:00Z',
          verified: true,
          portfolio_urls: ['https://linkedin.com/in/maria-rodriguez'],
          bio: 'Professional flight attendant specializing in luxury private jet operations.',
          languages: ['English', 'Spanish', 'Portuguese'],
          timezone: 'PST'
        }
      },
      {
        id: '3',
        broker_id: brokerId,
        crew_id: 'crew-3',
        notes: 'Young but very talented pilot. Great potential for long-term partnership.',
        tags: ['young-talent', 'potential', 'eager', 'learning'],
        rating: 4,
        saved_at: '2024-01-20T11:45:00Z',
        crew: {
          name: 'First Officer Alex Chen',
          email: 'alex.chen@example.com',
          role: 'pilot',
          avatar: '/avatars/alex-chen.jpg',
          location: 'Miami, FL',
          experience_years: 3,
          total_flight_hours: 2500,
          skills: ['Gulfstream G550', 'Commercial Pilot', 'Instrument Rating', 'Multi-Engine'],
          certifications: ['Commercial Pilot License', 'Instrument Rating', 'Multi-Engine Rating', 'Second Class Medical'],
          aircraft_types: ['Gulfstream G550', 'Cessna Citation'],
          hourly_rate_min: 80,
          hourly_rate_max: 120,
          availability_status: 'available',
          last_active: '2024-01-20T16:20:00Z',
          verified: false,
          portfolio_urls: ['https://linkedin.com/in/alex-chen'],
          bio: 'Ambitious young pilot looking to build experience in corporate aviation.',
          languages: ['English', 'Mandarin'],
          timezone: 'EST'
        }
      }
    ];

    setSavedCrews(mockSavedCrews);
    setFilteredCrews(mockSavedCrews);
    setLoading(false);
  }, [brokerId]);

  // Filter crews
  useEffect(() => {
    let filtered = savedCrews.filter(crew => {
      const matchesSearch = crew.crew.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           crew.crew.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           crew.crew.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = selectedRole === 'all' || crew.crew.role === selectedRole;
      const matchesAvailability = selectedAvailability === 'all' || crew.crew.availability_status === selectedAvailability;
      const matchesRating = selectedRating === 'all' || crew.rating.toString() === selectedRating;
      
      return matchesSearch && matchesRole && matchesAvailability && matchesRating;
    });

    setFilteredCrews(filtered);
  }, [savedCrews, searchTerm, selectedRole, selectedAvailability, selectedRating]);

  const handleAddCrew = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual API call
    console.log('Adding crew:', newCrew);
    setShowAddCrewDialog(false);
    setNewCrew({ crew_id: '', notes: '', tags: [], rating: 5 });
  };

  const handleRemoveCrew = async (crewId: string) => {
    setCrewToRemove(crewId);
    setShowRemoveDialog(true);
    setRemoveCountdown(5);
    
    // Start countdown
    const interval = setInterval(() => {
      setRemoveCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Actually remove the crew
          setSavedCrews(prev => prev.filter(crew => crew.id !== crewId));
          setShowRemoveDialog(false);
          setCrewToRemove(null);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelRemove = () => {
    setShowRemoveDialog(false);
    setCrewToRemove(null);
    setRemoveCountdown(5);
  };

  const handleContactCrew = async (crewId: string) => {
    // TODO: Implement actual API call
    console.log('Contacting crew:', crewId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'busy': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'unavailable': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-terminal-muted text-terminal-fg';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-terminal-muted'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terminal-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-terminal-fg">Saved Crew Members</h1>
          <Dialog open={showAddCrewDialog} onOpenChange={setShowAddCrewDialog}>
            <DialogTrigger asChild>
              <Button className="bg-terminal-accent hover:bg-terminal-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Crew
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-terminal-bg border-terminal-border">
              <DialogHeader>
                <DialogTitle className="text-terminal-fg">Add Crew to Favorites</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCrew} className="space-y-4">
                <div>
                  <label className="text-terminal-fg">Crew ID</label>
                  <Input
                    value={newCrew.crew_id}
                    onChange={(e) => setNewCrew(prev => ({ ...prev, crew_id: e.target.value }))}
                    className="bg-terminal-bg border-terminal-border text-terminal-fg"
                    required
                  />
                </div>
                <div>
                  <label className="text-terminal-fg">Notes</label>
                  <Textarea
                    value={newCrew.notes}
                    onChange={(e) => setNewCrew(prev => ({ ...prev, notes: e.target.value }))}
                    className="bg-terminal-bg border-terminal-border text-terminal-fg"
                    placeholder="Add your notes about this crew member..."
                  />
                </div>
                <div>
                  <label className="text-terminal-fg">Rating</label>
                  <Select value={newCrew.rating.toString()} onValueChange={(value) => setNewCrew(prev => ({ ...prev, rating: parseInt(value) }))}>
                    <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Star</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-4">
                  <Button type="submit" className="bg-terminal-accent hover:bg-terminal-accent/90">
                    Add Crew
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddCrewDialog(false)} className="border-terminal-border text-terminal-fg">
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <p className="text-terminal-muted">
          Manage your favorite crew members and pilots for quick access
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="bg-terminal-bg border-terminal-border">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terminal-muted h-4 w-4" />
              <Input
                placeholder="Search crews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-terminal-bg border-terminal-border text-terminal-fg"
              />
            </div>
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="pilot">Pilots</SelectItem>
                <SelectItem value="crew">Crew</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
              <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
                <SelectItem value="3">3+ Stars</SelectItem>
                <SelectItem value="2">2+ Stars</SelectItem>
                <SelectItem value="1">1+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Crew Listings */}
      <div className="space-y-4">
        {filteredCrews.length === 0 ? (
          <Card className="bg-terminal-bg border-terminal-border">
            <CardContent className="p-8 text-center">
              <Heart className="h-12 w-12 text-terminal-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-terminal-fg mb-2">No Saved Crew Members</h3>
              <p className="text-terminal-muted">
                Start building your network by adding crew members to your favorites.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCrews.map(crew => (
            <Card key={crew.id} className="bg-terminal-bg border-terminal-border hover:border-terminal-accent transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={crew.crew.avatar} />
                      <AvatarFallback>{crew.crew.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-semibold text-terminal-fg">{crew.crew.name}</h3>
                        {crew.crew.verified && (
                          <CheckCircle className="h-5 w-5 text-terminal-accent" />
                        )}
                        <Badge className={getAvailabilityColor(crew.crew.availability_status)}>
                          {crew.crew.availability_status}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {getRatingStars(crew.rating)}
                        </div>
                      </div>
                      
                      <p className="text-terminal-muted">{crew.crew.email} • {crew.crew.role}</p>
                      <p className="text-terminal-fg">{crew.crew.bio}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-terminal-muted">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{crew.crew.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{crew.crew.experience_years} years exp</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatCurrency(crew.crew.hourly_rate_min)}-{formatCurrency(crew.crew.hourly_rate_max)}/hr</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4" />
                          <span>{crew.crew.total_flight_hours.toLocaleString()} hours</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {crew.crew.skills.slice(0, 5).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="bg-terminal-muted text-terminal-fg">
                            {skill}
                          </Badge>
                        ))}
                        {crew.crew.skills.length > 5 && (
                          <Badge variant="secondary" className="bg-terminal-muted text-terminal-fg">
                            +{crew.crew.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                      
                      {crew.notes && (
                        <div className="bg-terminal-muted/20 p-3 rounded-lg">
                          <p className="text-sm text-terminal-fg">
                            <strong>Your Notes:</strong> {crew.notes}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        {crew.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="border-terminal-border text-terminal-fg">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-sm text-terminal-muted">
                          Saved {formatDate(crew.saved_at)} • Last active {formatDate(crew.crew.last_active)}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            onClick={() => handleContactCrew(crew.crew_id)}
                            className="bg-terminal-accent hover:bg-terminal-accent/90"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => handleRemoveCrew(crew.id)}
                            className="border-terminal-border text-terminal-fg"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Remove Confirmation Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent className="bg-terminal-bg border-terminal-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-terminal-fg">
              <AlertTriangle className="h-5 w-5 text-terminal-warning" />
              Confirm Removal
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-terminal-muted">
              Are you sure you want to remove this crew member? This action cannot be undone.
            </p>
            <div className="bg-terminal-warning/10 border border-terminal-warning/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-terminal-warning" />
                <span className="font-medium text-terminal-fg">Auto-removing in {removeCountdown} seconds...</span>
              </div>
              <p className="text-sm text-terminal-muted">
                Click "Cancel" to stop the removal process.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={cancelRemove}
                className="border-terminal-border text-terminal-fg hover:bg-terminal-hover"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (crewToRemove) {
                    setSavedCrews(prev => prev.filter(crew => crew.id !== crewToRemove));
                    setShowRemoveDialog(false);
                    setCrewToRemove(null);
                    setRemoveCountdown(5);
                  }
                }}
                className="bg-terminal-warning hover:bg-terminal-warning/90 text-terminal-bg"
              >
                Remove Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default SavedCrews;
