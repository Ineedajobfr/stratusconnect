import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Calendar, 
  Briefcase, 
  Bell, 
  MessageCircle, 
  Settings, 
  MapPin, 
  Clock,
  Star,
  Award,
  FileText,
  Shield,
  Plane,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Utensils,
  Heart,
  Coffee,
  Plus
} from "lucide-react";

interface CrewProfile {
  name: string;
  role: string;
  certifications: string[];
  languages: string[];
  experience: string;
  baseLocation: string;
  verificationStatus: 'pending' | 'verified' | 'incomplete';
  rating: number;
  reviews: number;
  specialties: string[];
}

interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'blocked';
  location: string;
  notes?: string;
}

interface JobOpportunity {
  id: string;
  operator: string;
  aircraft: string;
  route: string;
  date: string;
  duration: string;
  pay: number;
  status: 'open' | 'applied' | 'accepted' | 'declined';
  requirements: string[];
  description: string;
  services: string[];
}

interface Assignment {
  id: string;
  operator: string;
  aircraft: string;
  route: string;
  date: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  pay: number;
  notes: string;
  services: string[];
  passengers: number;
}

interface Notification {
  id: string;
  type: 'job_invitation' | 'message' | 'profile_view' | 'assignment_update';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export default function CrewDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - in real app this would come from Supabase
  const [profile] = useState<CrewProfile>({
    name: 'Emma Davis',
    role: 'Senior Flight Attendant',
    certifications: ['Safety Training', 'First Aid/CPR', 'Food Safety', 'Wine Service', 'VIP Training'],
    languages: ['English', 'French', 'Spanish', 'Italian'],
    experience: '6 years private aviation, 4 years commercial',
    baseLocation: 'New York (JFK)',
    verificationStatus: 'verified',
    rating: 4.8,
    reviews: 32,
    specialties: ['Luxury Service', 'International Flights', 'Catering', 'VIP Clients']
  });

  const [availability] = useState<AvailabilitySlot[]>([
    {
      id: 'A-001',
      date: '2025-01-15',
      startTime: '08:00',
      endTime: '18:00',
      status: 'available',
      location: 'JFK',
      notes: 'Available for short notice'
    },
    {
      id: 'A-002',
      date: '2025-01-16',
      startTime: '10:00',
      endTime: '20:00',
      status: 'booked',
      location: 'LAX',
      notes: 'Charter flight to Miami'
    },
    {
      id: 'A-003',
      date: '2025-01-17',
      startTime: '06:00',
      endTime: '16:00',
      status: 'available',
      location: 'JFK',
      notes: 'Preferred for international flights'
    }
  ]);

  const [jobOpportunities] = useState<JobOpportunity[]>([
    {
      id: 'J-001',
      operator: 'Elite Aviation Group',
      aircraft: 'Gulfstream G650',
      route: 'JFK → LAX',
      date: '2025-01-20',
      duration: '6 hours',
      pay: 800,
      status: 'open',
      requirements: ['Safety Training', 'VIP Experience', 'French Language'],
      description: 'Luxury charter for VIP client. High-end service required.',
      services: ['Catering', 'Concierge', 'Luxury Amenities']
    },
    {
      id: 'J-002',
      operator: 'SkyBridge Aviation',
      aircraft: 'Citation X',
      route: 'MIA → SFO',
      date: '2025-01-22',
      duration: '5 hours',
      pay: 600,
      status: 'applied',
      requirements: ['Safety Training', 'Food Service'],
      description: 'Business charter with catering service.',
      services: ['Catering', 'Business Service']
    }
  ]);

  const [assignments] = useState<Assignment[]>([
    {
      id: 'AS-001',
      operator: 'Premier Jets',
      aircraft: 'Bombardier Global 6000',
      route: 'LHR → CDG',
      date: '2025-01-18',
      status: 'upcoming',
      pay: 700,
      notes: 'International flight, luxury service required',
      services: ['Catering', 'Concierge', 'Luxury Amenities'],
      passengers: 8
    }
  ]);

  const [notifications] = useState<Notification[]>([
    {
      id: 'N-001',
      type: 'job_invitation',
      title: 'New Job Invitation',
      message: 'Elite Aviation Group invited you to a Gulfstream G650 flight',
      timestamp: '2 hours ago',
      read: false,
      actionUrl: '/jobs/J-001'
    },
    {
      id: 'N-002',
      type: 'message',
      title: 'New Message',
      message: 'SkyBridge Aviation sent you a message about your application',
      timestamp: '4 hours ago',
      read: true
    },
    {
      id: 'N-003',
      type: 'profile_view',
      title: 'Profile Viewed',
      message: '3 operators viewed your profile this week',
      timestamp: '1 day ago',
      read: true
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'booked': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'blocked': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'open': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'applied': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'accepted': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'declined': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'verified': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'incomplete': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'booked': return 'Booked';
      case 'blocked': return 'Blocked';
      case 'open': return 'Open';
      case 'applied': return 'Applied';
      case 'accepted': return 'Accepted';
      case 'declined': return 'Declined';
      case 'upcoming': return 'Upcoming';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'verified': return 'Verified';
      case 'pending': return 'Pending';
      case 'incomplete': return 'Incomplete';
      default: return status;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold">STRATUSCONNECT</span>
            </div>
            <div className="text-sm text-slate-400">CREW TERMINAL</div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-slate-400">CREW</div>
              <div className="text-lg font-bold text-orange-400">{profile.name}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono text-orange-400">
                {new Date().toLocaleTimeString()}
              </div>
              <div className="text-sm text-slate-400">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="availability" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Briefcase className="h-4 w-4 mr-2" />
              Opportunities
            </TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Plane className="h-4 w-4 mr-2" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Utensils className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Bell className="h-4 w-4 mr-2" />
              Notifications {unreadNotifications > 0 && `(${unreadNotifications})`}
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <MessageCircle className="h-4 w-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Overview */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-orange-400">Crew Profile</CardTitle>
                    <CardDescription>Your professional aviation service profile</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-xl">ED</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{profile.name}</div>
                        <div className="text-slate-400">{profile.role}</div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getStatusColor(profile.verificationStatus)}>
                            {getStatusText(profile.verificationStatus)}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-slate-400">{profile.rating} ({profile.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Certifications</h4>
                        <div className="space-y-2">
                          {profile.certifications.map((cert, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-slate-300">{cert}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Languages</h4>
                        <div className="space-y-2">
                          {profile.languages.map((language, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <span className="text-slate-300">{language}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Experience</h4>
                      <p className="text-slate-300">{profile.experience}</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.specialties.map((specialty, index) => (
                          <Badge key={index} className="bg-slate-700 text-slate-300 border-slate-600">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-orange-400">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Certifications</span>
                      <span className="text-white font-bold">{profile.certifications.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Languages</span>
                      <span className="text-white font-bold">{profile.languages.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Rating</span>
                      <span className="text-white font-bold">{profile.rating}/5.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Reviews</span>
                      <span className="text-white font-bold">{profile.reviews}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-orange-400">Verification Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Identity Verification</span>
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Safety Training</span>
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Background Check</span>
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Sanctions Screening</span>
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Schedule & Availability</h2>
              <Button className="btn-terminal-accent">
                <Plus className="h-4 w-4 mr-2" />
                Add Availability
              </Button>
            </div>

            <div className="space-y-4">
              {availability.map((slot) => (
                <Card key={slot.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-black" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{slot.date}</div>
                          <div className="text-slate-400">{slot.startTime} - {slot.endTime}</div>
                          <div className="text-slate-400">{slot.location} • {slot.notes}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(slot.status)}>
                          {getStatusText(slot.status)}
                        </Badge>
                        <Button className="btn-terminal-accent">
                          <Eye className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Job Opportunities</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white w-64"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="applied">Applied</option>
                  <option value="accepted">Accepted</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {jobOpportunities.map((job) => (
                <Card key={job.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Plane className="h-8 w-8 text-black" />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-white">{job.operator}</div>
                          <div className="text-slate-400">{job.aircraft} • {job.route}</div>
                          <div className="text-slate-400">{job.date} • {job.duration}</div>
                          <div className="text-slate-400">Requirements: {job.requirements.join(', ')}</div>
                          <div className="text-slate-400">Services: {job.services.join(', ')}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-400">${job.pay.toLocaleString()}</div>
                          <Badge className={getStatusColor(job.status)}>
                            {getStatusText(job.status)}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button className="btn-terminal-accent">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {job.status === 'open' && (
                            <Button className="btn-terminal-secondary">
                              Apply
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Current Assignments</h2>
            
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Plane className="h-8 w-8 text-black" />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-white">{assignment.operator}</div>
                          <div className="text-slate-400">{assignment.aircraft} • {assignment.route}</div>
                          <div className="text-slate-400">{assignment.date} • {assignment.passengers} passengers</div>
                          <div className="text-slate-400">Services: {assignment.services.join(', ')}</div>
                          <div className="text-slate-400">{assignment.notes}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-400">${assignment.pay.toLocaleString()}</div>
                          <Badge className={getStatusColor(assignment.status)}>
                            {getStatusText(assignment.status)}
                          </Badge>
                        </div>
                        <Button className="btn-terminal-accent">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Service Capabilities</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-orange-400 flex items-center">
                    <Utensils className="h-5 w-5 mr-2" />
                    Catering Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">Fine Dining</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">Wine Service</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">Dietary Restrictions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">Custom Menus</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-orange-400 flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    VIP Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">Concierge</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">Luxury Amenities</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">Personalized Service</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">Discretion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-orange-400 flex items-center">
                    <Coffee className="h-5 w-5 mr-2" />
                    Business Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">Meeting Setup</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">Document Handling</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">Tech Support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">Efficiency Focus</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
            
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className={`bg-slate-800 border-slate-700 ${!notification.read ? 'border-orange-500/50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          notification.type === 'job_invitation' ? 'bg-orange-500' :
                          notification.type === 'message' ? 'bg-blue-500' :
                          notification.type === 'profile_view' ? 'bg-green-500' :
                          'bg-slate-500'
                        }`}>
                          {notification.type === 'job_invitation' && <Briefcase className="h-6 w-6 text-black" />}
                          {notification.type === 'message' && <MessageCircle className="h-6 w-6 text-black" />}
                          {notification.type === 'profile_view' && <Eye className="h-6 w-6 text-black" />}
                          {notification.type === 'assignment_update' && <Plane className="h-6 w-6 text-black" />}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{notification.title}</div>
                          <div className="text-slate-400">{notification.message}</div>
                          <div className="text-sm text-slate-500">{notification.timestamp}</div>
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="w-3 h-3 bg-orange-500 rounded-full" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Messages</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>No messages yet. Start a conversation with an operator!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Settings & Verification</h2>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center text-slate-400">
                  <Settings className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p>Profile settings and Fortress of Trust verification coming soon!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
