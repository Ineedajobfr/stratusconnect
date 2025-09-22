import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Edit,
  Save,
  X,
  Star,
  DollarSign,
  Plane
} from 'lucide-react';

interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  aircraftTypes: string[];
  regions: string[];
  serviceLevel: 'economy' | 'business' | 'first' | 'vip';
  languages: string[];
  shortNotice: boolean;
  dayRate: number;
  status: 'available' | 'assigned' | 'blocked';
}

interface Assignment {
  id: string;
  title: string;
  operator: string;
  aircraftType: string;
  route: string;
  date: string;
  startTime: string;
  endTime: string;
  passengers: number;
  serviceLevel: string;
  dayRate: number;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  briefingUrl?: string;
  client: string;
  specialRequirements: string[];
}

interface CrewProfile {
  id: string;
  name: string;
  experience: number;
  languages: string[];
  specializations: string[];
  availability: AvailabilitySlot[];
  assignments: Assignment[];
  preferences: {
    maxFlightHours: number;
    minRestHours: number;
    preferredRegions: string[];
    preferredAircraft: string[];
    shortNoticeAvailable: boolean;
    dayRateRange: { min: number; max: number };
  };
}

export default function AvailabilityAssignments({ terminalType }: { terminalType: string }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [newSlot, setNewSlot] = useState<Partial<AvailabilitySlot>>({
    startTime: '08:00',
    endTime: '18:00',
    aircraftTypes: [],
    regions: [],
    serviceLevel: 'business',
    languages: [],
    shortNotice: false,
    dayRate: 300
  });

  const [profile, setProfile] = useState<CrewProfile>({
    id: 'crew-001',
    name: 'Sophie Chen',
    experience: 5,
    languages: ['English', 'French', 'Mandarin'],
    specializations: ['VIP Service', 'Wine Knowledge', 'Medical Training'],
    availability: [
      {
        id: 'avail-001',
        date: '2025-09-20',
        startTime: '08:00',
        endTime: '18:00',
        aircraftTypes: ['Gulfstream G650', 'Bombardier Global 7500'],
        regions: ['Europe', 'North America'],
        serviceLevel: 'vip',
        languages: ['English', 'French'],
        shortNotice: true,
        dayRate: 500,
        status: 'available'
      },
      {
        id: 'avail-002',
        date: '2025-09-21',
        startTime: '10:00',
        endTime: '20:00',
        aircraftTypes: ['Cessna Citation XLS+'],
        regions: ['Europe'],
        serviceLevel: 'business',
        languages: ['English'],
        shortNotice: false,
        dayRate: 300,
        status: 'assigned'
      }
    ],
    assignments: [
      {
        id: 'assign-001',
        title: 'VIP Charter - London to Dubai',
        operator: 'Elite Aviation Group',
        aircraftType: 'Gulfstream G650',
        route: 'London (LHR) → Dubai (DXB)',
        date: '2025-09-21',
        startTime: '10:00',
        endTime: '20:00',
        passengers: 4,
        serviceLevel: 'VIP',
        dayRate: 500,
        status: 'upcoming',
        client: 'Global Investment Corp',
        specialRequirements: ['Halal catering', 'French language', 'Medical assistance']
      },
      {
        id: 'assign-002',
        title: 'Business Flight - Paris to Geneva',
        operator: 'Swiss Aviation Services',
        aircraftType: 'Cessna Citation XLS+',
        route: 'Paris (CDG) → Geneva (GVA)',
        date: '2025-09-18',
        startTime: '14:00',
        endTime: '16:00',
        passengers: 6,
        serviceLevel: 'Business',
        dayRate: 300,
        status: 'completed',
        client: 'Corporate Client',
        specialRequirements: ['Vegetarian options', 'English language']
      }
    ],
    preferences: {
      maxFlightHours: 10,
      minRestHours: 12,
      preferredRegions: ['Europe', 'North America', 'Middle East'],
      preferredAircraft: ['Gulfstream G650', 'Bombardier Global 7500', 'Dassault Falcon 8X'],
      shortNoticeAvailable: true,
      dayRateRange: { min: 250, max: 800 }
    }
  });

  const aircraftTypes = [
    'Gulfstream G650',
    'Gulfstream G700',
    'Bombardier Global 7500',
    'Bombardier Global 8000',
    'Cessna Citation XLS+',
    'Cessna Citation CJ4',
    'Dassault Falcon 8X',
    'Dassault Falcon 6X',
    'Embraer Legacy 650E',
    'Pilatus PC-24'
  ];

  const regions = [
    'Europe',
    'North America',
    'South America',
    'Asia',
    'Middle East',
    'Africa',
    'Oceania'
  ];

  const languages = [
    'English',
    'French',
    'Spanish',
    'German',
    'Italian',
    'Portuguese',
    'Mandarin',
    'Japanese',
    'Arabic',
    'Russian'
  ];

  const addAvailabilitySlot = () => {
    if (!selectedDate || !newSlot.startTime || !newSlot.endTime) return;

    const slot: AvailabilitySlot = {
      id: `avail-${Date.now()}`,
      date: selectedDate.toISOString().split('T')[0],
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      aircraftTypes: newSlot.aircraftTypes || [],
      regions: newSlot.regions || [],
      serviceLevel: newSlot.serviceLevel || 'business',
      languages: newSlot.languages || [],
      shortNotice: newSlot.shortNotice || false,
      dayRate: newSlot.dayRate || 300,
      status: 'available'
    };

    setProfile(prev => ({
      ...prev,
      availability: [...prev.availability, slot]
    }));

    setNewSlot({
      startTime: '08:00',
      endTime: '18:00',
      aircraftTypes: [],
      regions: [],
      serviceLevel: 'business',
      languages: [],
      shortNotice: false,
      dayRate: 300
    });
    setIsEditing(false);
  };

  const toggleArrayItem = (array: string[], item: string, setter: (value: string[]) => void) => {
    setter(array.includes(item) ? array.filter(i => i !== item) : [...array, item]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'assigned': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'blocked': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getServiceLevelColor = (level: string) => {
    switch (level) {
      case 'vip': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'first': return 'bg-gold-500/20 text-gold-400 border-gold-500/30';
      case 'business': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'economy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Availability & Assignment Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Profile</h3>
              <div className="space-y-1">
                <p className="text-sm text-foreground">{profile.name}</p>
                <p className="text-sm text-muted-foreground">{profile.experience} years experience</p>
                <div className="flex flex-wrap gap-1">
                  {profile.languages.slice(0, 2).map(lang => (
                    <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                  ))}
                  {profile.languages.length > 2 && (
                    <Badge variant="outline" className="text-xs">+{profile.languages.length - 2}</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Availability</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Available Days:</span>
                  <span className="text-sm font-medium">{profile.availability.filter(a => a.status === 'available').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Assigned Days:</span>
                  <span className="text-sm font-medium">{profile.availability.filter(a => a.status === 'assigned').length}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Assignments</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Upcoming:</span>
                  <span className="text-sm font-medium">{profile.assignments.filter(a => a.status === 'upcoming').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed:</span>
                  <span className="text-sm font-medium">{profile.assignments.filter(a => a.status === 'completed').length}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Earnings</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">This Month:</span>
                  <span className="text-sm font-medium">£{profile.assignments.reduce((sum, a) => sum + a.dayRate, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg Rate:</span>
                  <span className="text-sm font-medium">£{Math.round(profile.assignments.reduce((sum, a) => sum + a.dayRate, 0) / profile.assignments.length)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar and Add Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-accent" />
              Availability Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-accent" />
                Add Availability
              </CardTitle>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                size="sm"
              >
                {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditing ? 'Cancel' : 'Add Slot'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Start Time</label>
                    <input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-terminal-input-bg border border-terminal-input-border rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">End Time</label>
                    <input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-terminal-input-bg border border-terminal-input-border rounded-md text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Service Level</label>
                    <select
                      value={newSlot.serviceLevel}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, serviceLevel: e.target.value as any }))}
                      className="w-full mt-1 px-3 py-2 bg-terminal-card border border-terminal-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    >
                      <option value="economy">Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Day Rate (£)</label>
                    <input
                      type="number"
                      value={newSlot.dayRate}
                      onChange={(e) => setNewSlot(prev => ({ ...prev, dayRate: parseInt(e.target.value) || 0 }))}
                      className="w-full mt-1 px-3 py-2 bg-terminal-input-bg border border-terminal-input-border rounded-md text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={newSlot.shortNotice}
                    onCheckedChange={(checked) => setNewSlot(prev => ({ ...prev, shortNotice: checked }))}
                  />
                  <span className="text-sm text-foreground">Available for short notice</span>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Aircraft Types</label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {aircraftTypes.map(type => (
                      <label key={type} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={newSlot.aircraftTypes?.includes(type) || false}
                          onChange={() => toggleArrayItem(newSlot.aircraftTypes || [], type, (value) => setNewSlot(prev => ({ ...prev, aircraftTypes: value })))}
                          className="rounded"
                        />
                        <span className="text-xs">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Languages</label>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map(lang => (
                      <label key={lang} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={newSlot.languages?.includes(lang) || false}
                          onChange={() => toggleArrayItem(newSlot.languages || [], lang, (value) => setNewSlot(prev => ({ ...prev, languages: value })))}
                          className="rounded"
                        />
                        <span className="text-xs">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={addAvailabilitySlot} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Add Slot
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Click "Add Slot" to set your availability</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Current Assignments */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-accent" />
            Current Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.assignments.map(assignment => (
              <div key={assignment.id} className="p-4 border rounded-lg hover:bg-terminal-card/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                      <Badge className={getAssignmentStatusColor(assignment.status)}>
                        {assignment.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={getServiceLevelColor(assignment.serviceLevel.toLowerCase())}>
                        {assignment.serviceLevel}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Date & Time</p>
                        <p className="text-sm font-medium">{new Date(assignment.date).toLocaleDateString()} • {assignment.startTime} - {assignment.endTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Route</p>
                        <p className="text-sm font-medium">{assignment.route}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Aircraft</p>
                        <p className="text-sm font-medium">{assignment.aircraftType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Day Rate</p>
                        <p className="text-sm font-medium">£{assignment.dayRate}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Operator</p>
                        <p className="text-sm font-medium">{assignment.operator}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Client</p>
                        <p className="text-sm font-medium">{assignment.client}</p>
                      </div>
                    </div>

                    {assignment.specialRequirements.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground mb-2">Special Requirements</p>
                        <div className="flex flex-wrap gap-1">
                          {assignment.specialRequirements.map(req => (
                            <Badge key={req} variant="outline" className="text-xs">{req}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {assignment.briefingUrl && (
                      <Button size="sm" variant="outline">
                        <Users className="w-4 h-4 mr-2" />
                        Briefing
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Availability Slots */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Your Availability Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.availability.map(slot => (
              <div key={slot.id} className="p-4 border rounded-lg hover:bg-terminal-card/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {new Date(slot.date).toLocaleDateString()} • {slot.startTime} - {slot.endTime}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        £{slot.dayRate} per day • {slot.serviceLevel.toUpperCase()} service
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(slot.status)}>
                    {slot.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Aircraft Types</h4>
                    <div className="flex flex-wrap gap-1">
                      {slot.aircraftTypes.map(type => (
                        <Badge key={type} variant="outline" className="text-xs">
                          <Plane className="w-3 h-3 mr-1" />
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Regions</h4>
                    <div className="flex flex-wrap gap-1">
                      {slot.regions.map(region => (
                        <Badge key={region} variant="outline" className="text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-1">
                      {slot.languages.map(lang => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {slot.shortNotice && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-accent">
                    <AlertTriangle className="w-4 h-4" />
                    Available for short notice
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
