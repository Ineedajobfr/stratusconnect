// Crew Scheduling System - Pilot & cabin crew management
// Includes duty time tracking, assignments, and FAA compliance

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertCircle,
    Award,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    Plane,
    Plus,
    Search,
    Users
} from 'lucide-react';
import { useState } from 'react';

export interface CrewMember {
  id: string;
  fullName: string;
  role: 'Captain' | 'First Officer' | 'Flight Attendant' | 'Engineer' | 'Purser';
  certifications: string[];
  typeRatings?: string[]; // For pilots
  medicalExpiry: string;
  flightHours?: number;
  availability: 'available' | 'on_duty' | 'on_rest' | 'unavailable';
  dutyHoursThisWeek: number;
  lastFlightDate?: string;
  email: string;
  phone: string;
  baseLocation: string;
}

export interface CrewAssignment {
  id: string;
  flightId: string;
  crewMemberId: string;
  crewName: string;
  role: string;
  flightRoute: string;
  departureDate: string;
  duration: number; // hours
  status: 'assigned' | 'accepted' | 'declined' | 'completed';
}

interface CrewSchedulingProps {
  operatorId: string;
  onCrewUpdate?: (crew: CrewMember) => void;
  onAssignmentCreate?: (assignment: CrewAssignment) => void;
}

export function CrewScheduling({ operatorId, onCrewUpdate, onAssignmentCreate }: CrewSchedulingProps) {
  const [crew, setCrew] = useState<CrewMember[]>([
    {
      id: '1',
      fullName: 'Captain James Wilson',
      role: 'Captain',
      certifications: ['ATP', 'Type Rating G550', 'Instrument'],
      typeRatings: ['G550', 'G650', 'Citation X'],
      medicalExpiry: '2026-03-15',
      flightHours: 12500,
      availability: 'available',
      dutyHoursThisWeek: 18,
      lastFlightDate: '2025-09-28',
      email: 'james.wilson@aviation.com',
      phone: '+1-555-0101',
      baseLocation: 'KJFK'
    },
    {
      id: '2',
      fullName: 'First Officer Sarah Chen',
      role: 'First Officer',
      certifications: ['Commercial', 'Type Rating G550', 'Multi-Engine'],
      typeRatings: ['G550', 'Citation X'],
      medicalExpiry: '2025-12-20',
      flightHours: 4800,
      availability: 'on_duty',
      dutyHoursThisWeek: 32,
      lastFlightDate: '2025-09-30',
      email: 'sarah.chen@aviation.com',
      phone: '+1-555-0102',
      baseLocation: 'KJFK'
    },
    {
      id: '3',
      fullName: 'Emily Rodriguez',
      role: 'Flight Attendant',
      certifications: ['FAA Cabin Crew', 'First Aid', 'Security Training'],
      medicalExpiry: '2026-01-10',
      availability: 'available',
      dutyHoursThisWeek: 24,
      lastFlightDate: '2025-09-29',
      email: 'emily.rodriguez@aviation.com',
      phone: '+1-555-0103',
      baseLocation: 'KBOS'
    }
  ]);

  const [assignments, setAssignments] = useState<CrewAssignment[]>([
    {
      id: '1',
      flightId: 'FLT-001',
      crewMemberId: '2',
      crewName: 'Sarah Chen',
      role: 'First Officer',
      flightRoute: 'JFK → LAX',
      departureDate: '2025-10-02T14:00:00',
      duration: 5.5,
      status: 'assigned'
    }
  ]);

  const [activeTab, setActiveTab] = useState('crew');
  const [searchTerm, setSearchTerm] = useState('');

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Available</Badge>;
      case 'on_duty':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">On Duty</Badge>;
      case 'on_rest':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">On Rest</Badge>;
      case 'unavailable':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Unavailable</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getDutyTimeWarning = (hours: number) => {
    if (hours >= 60) {
      return <AlertCircle className="w-4 h-4 text-red-400" title="Exceeds weekly limit" />;
    }
    if (hours >= 50) {
      return <AlertCircle className="w-4 h-4 text-yellow-400" title="Approaching limit" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-400" title="Within limits" />;
  };

  const filteredCrew = crew.filter(member =>
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-terminal-bg/50">
          <TabsTrigger value="crew">
            <Users className="w-4 h-4 mr-2" />
            Crew Members
          </TabsTrigger>
          <TabsTrigger value="assignments">
            <Calendar className="w-4 h-4 mr-2" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <FileText className="w-4 h-4 mr-2" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="crew" className="mt-6 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search crew members..."
                className="pl-10 bg-terminal-bg border-terminal-border text-foreground"
              />
            </div>
            <Button className="bg-accent hover:bg-accent/80 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Crew Member
            </Button>
          </div>

          {/* Crew List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCrew.map((member) => (
              <Card key={member.id} className="bg-terminal-card/50 border-terminal-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">{member.fullName}</CardTitle>
                      <div className="text-sm text-accent mt-1">{member.role}</div>
                    </div>
                    {getAvailabilityBadge(member.availability)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 bg-terminal-bg/30 rounded text-center">
                      <div className="text-xs text-muted-foreground">Base</div>
                      <div className="text-sm font-semibold text-foreground">{member.baseLocation}</div>
                    </div>
                    {member.flightHours && (
                      <div className="p-2 bg-terminal-bg/30 rounded text-center">
                        <div className="text-xs text-muted-foreground">Flight Hours</div>
                        <div className="text-sm font-semibold text-foreground">{member.flightHours.toLocaleString()}</div>
                      </div>
                    )}
                  </div>

                  {/* Duty Hours Warning */}
                  <div className="flex items-center justify-between p-3 bg-terminal-bg/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      <span className="text-sm text-foreground">Duty Hours This Week</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{member.dutyHoursThisWeek} / 60</span>
                      {getDutyTimeWarning(member.dutyHoursThisWeek)}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Certifications:</div>
                    <div className="flex flex-wrap gap-1">
                      {member.certifications.map((cert, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Type Ratings (Pilots only) */}
                  {member.typeRatings && member.typeRatings.length > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Type Ratings:</div>
                      <div className="flex flex-wrap gap-1">
                        {member.typeRatings.map((rating, idx) => (
                          <Badge key={idx} className="bg-accent/20 text-accent border-accent/30 text-xs">
                            {rating}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medical Expiry */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Medical Expiry:</span>
                    <span className="font-semibold text-foreground">
                      {new Date(member.medicalExpiry).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Contact */}
                  <div className="pt-3 border-t border-terminal-border text-xs text-muted-foreground">
                    <div>{member.email}</div>
                    <div>{member.phone}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="mt-6 space-y-4">
          {assignments.length > 0 ? (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="bg-terminal-card/50 border-terminal-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Plane className="w-5 h-5 text-accent" />
                          <div>
                            <div className="font-semibold text-foreground">{assignment.flightRoute}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(assignment.departureDate).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Crew: </span>
                            <span className="text-foreground font-semibold">{assignment.crewName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Role: </span>
                            <span className="text-foreground">{assignment.role}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration: </span>
                            <span className="text-foreground">{assignment.duration}h</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={
                        assignment.status === 'accepted' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        assignment.status === 'declined' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        assignment.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }>
                        {assignment.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-terminal-card/50 border-terminal-border">
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Assignments</h3>
                <p className="text-muted-foreground">Create flight assignments to manage your crew schedule</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="compliance" className="mt-6 space-y-4">
          {/* FAA Duty Time Compliance */}
          <Card className="bg-terminal-card/50 border-terminal-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="w-5 h-5 text-accent" />
                FAA Duty Time Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {crew.filter(m => m.role === 'Captain' || m.role === 'First Officer').map((pilot) => (
                  <div key={pilot.id} className="flex items-center justify-between p-4 bg-terminal-bg/30 rounded-lg">
                    <div>
                      <div className="font-semibold text-foreground">{pilot.fullName}</div>
                      <div className="text-sm text-muted-foreground">{pilot.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground">{pilot.dutyHoursThisWeek} / 60 hours</span>
                        {getDutyTimeWarning(pilot.dutyHoursThisWeek)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {60 - pilot.dutyHoursThisWeek} hours remaining
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Compliance Summary */}
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="font-semibold text-foreground">All crew members within FAA limits</div>
                    <div className="text-sm text-muted-foreground">No duty time violations detected</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Certificate Expiry */}
          <Card className="bg-terminal-card/50 border-terminal-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Award className="w-5 h-5 text-accent" />
                Medical Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {crew.map((member) => {
                  const expiryDate = new Date(member.medicalExpiry);
                  const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  const isExpiringSoon = daysUntilExpiry < 60;

                  return (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-terminal-bg/30 rounded-lg">
                      <div>
                        <div className="font-semibold text-foreground">{member.fullName}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      </div>
                      <div className="text-right">
                        <div className={isExpiringSoon ? 'text-yellow-400 font-semibold' : 'text-foreground'}>
                          {expiryDate.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {daysUntilExpiry} days remaining
                          {isExpiringSoon && ' ⚠️'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Crew Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-accent">{crew.length}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Crew</div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-green-400">
              {crew.filter(c => c.availability === 'available').length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Available</div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-blue-400">
              {crew.filter(c => c.availability === 'on_duty').length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">On Duty</div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-card/50 border-terminal-border">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {crew.filter(c => c.role === 'Captain' || c.role === 'First Officer').length}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Pilots</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

