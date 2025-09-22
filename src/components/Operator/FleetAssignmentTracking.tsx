import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plane, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Edit,
  Navigation,
  Calendar,
  DollarSign,
  BarChart3,
  TrendingUp,
  Shield,
  FileText
} from 'lucide-react';

interface Aircraft {
  id: string;
  registration: string;
  type: string;
  status: 'active' | 'maintenance' | 'grounded' | 'chartered';
  location: string;
  lastFlight: string;
  totalHours: number;
  nextMaintenance: string;
  crew: {
    pilot: string;
    crew: string[];
  };
  currentAssignment?: string;
}

interface Assignment {
  id: string;
  aircraftId: string;
  title: string;
  client: string;
  route: string;
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  crew: {
    pilot: string;
    crew: string[];
  };
  earnings: number;
  progress: number;
  tracking: {
    currentLocation: string;
    altitude: number;
    speed: number;
    eta: string;
  };
}

interface FleetMetrics {
  totalAircraft: number;
  activeAircraft: number;
  maintenanceAircraft: number;
  totalHours: number;
  monthlyEarnings: number;
  utilizationRate: number;
  averageResponseTime: number;
}

export default function FleetAssignmentTracking({ terminalType }: { terminalType: string }) {
  const [selectedAircraft, setSelectedAircraft] = useState<string | null>(null);

  const [fleetMetrics] = useState<FleetMetrics>({
    totalAircraft: 12,
    activeAircraft: 8,
    maintenanceAircraft: 2,
    totalHours: 2847,
    monthlyEarnings: 125000,
    utilizationRate: 78,
    averageResponseTime: 2.3
  });

  const [aircraft] = useState<Aircraft[]>([
    {
      id: 'ac-001',
      registration: 'N123GX',
      type: 'Gulfstream G650',
      status: 'active',
      location: 'London (LHR)',
      lastFlight: '2025-09-19T14:30:00Z',
      totalHours: 1250,
      nextMaintenance: '2025-10-15',
      crew: {
        pilot: 'Captain James Mitchell',
        crew: ['Sophie Chen', 'Maria Rodriguez']
      },
      currentAssignment: 'assign-001'
    },
    {
      id: 'ac-002',
      registration: 'N456BX',
      type: 'Bombardier Global 7500',
      status: 'active',
      location: 'Paris (CDG)',
      lastFlight: '2025-09-18T16:45:00Z',
      totalHours: 890,
      nextMaintenance: '2025-11-20',
      crew: {
        pilot: 'Captain Sarah Johnson',
        crew: ['David Thompson', 'Lisa Anderson']
      },
      currentAssignment: 'assign-002'
    },
    {
      id: 'ac-003',
      registration: 'N789CX',
      type: 'Cessna Citation XLS+',
      status: 'maintenance',
      location: 'Geneva (GVA)',
      lastFlight: '2025-09-15T10:20:00Z',
      totalHours: 450,
      nextMaintenance: '2025-09-25',
      crew: {
        pilot: '',
        crew: []
      }
    },
    {
      id: 'ac-004',
      registration: 'N321FX',
      type: 'Dassault Falcon 8X',
      status: 'chartered',
      location: 'New York (JFK)',
      lastFlight: '2025-09-17T18:30:00Z',
      totalHours: 1200,
      nextMaintenance: '2025-12-10',
      crew: {
        pilot: 'Captain Michael Brown',
        crew: ['Jennifer Davis', 'Robert Wilson']
      },
      currentAssignment: 'assign-003'
    }
  ]);

  const [assignments] = useState<Assignment[]>([
    {
      id: 'assign-001',
      aircraftId: 'ac-001',
      title: 'VIP Charter - London to Dubai',
      client: 'Global Investment Corp',
      route: 'London (LHR) → Dubai (DXB)',
      startDate: '2025-09-21T10:00:00Z',
      endDate: '2025-09-21T18:00:00Z',
      status: 'scheduled',
      crew: {
        pilot: 'Captain James Mitchell',
        crew: ['Sophie Chen', 'Maria Rodriguez']
      },
      earnings: 12000,
      progress: 0,
      tracking: {
        currentLocation: 'London (LHR)',
        altitude: 0,
        speed: 0,
        eta: '2025-09-21T10:00:00Z'
      }
    },
    {
      id: 'assign-002',
      aircraftId: 'ac-002',
      title: 'Business Flight - Paris to Geneva',
      client: 'Corporate Client',
      route: 'Paris (CDG) → Geneva (GVA)',
      startDate: '2025-09-20T14:00:00Z',
      endDate: '2025-09-20T16:00:00Z',
      status: 'in-progress',
      crew: {
        pilot: 'Captain Sarah Johnson',
        crew: ['David Thompson', 'Lisa Anderson']
      },
      earnings: 8000,
      progress: 65,
      tracking: {
        currentLocation: 'Over Switzerland',
        altitude: 41000,
        speed: 450,
        eta: '2025-09-20T15:45:00Z'
      }
    },
    {
      id: 'assign-003',
      aircraftId: 'ac-004',
      title: 'Transatlantic Charter',
      client: 'Luxury Travel Inc',
      route: 'New York (JFK) → London (LHR)',
      startDate: '2025-09-18T18:30:00Z',
      endDate: '2025-09-19T06:30:00Z',
      status: 'completed',
      crew: {
        pilot: 'Captain Michael Brown',
        crew: ['Jennifer Davis', 'Robert Wilson']
      },
      earnings: 25000,
      progress: 100,
      tracking: {
        currentLocation: 'London (LHR)',
        altitude: 0,
        speed: 0,
        eta: 'Completed'
      }
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'grounded': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'chartered': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const selectedAircraftData = selectedAircraft ? aircraft.find(ac => ac.id === selectedAircraft) : null;
  const selectedAircraftAssignments = selectedAircraft ? assignments.filter(assign => assign.aircraftId === selectedAircraft) : [];

  return (
    <div className="space-y-6">
      {/* Fleet Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Aircraft</p>
                <p className="text-2xl font-bold text-accent">{fleetMetrics.totalAircraft}</p>
              </div>
              <Plane className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Aircraft</p>
                <p className="text-2xl font-bold text-accent">{fleetMetrics.activeAircraft}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Utilization Rate</p>
                <p className="text-2xl font-bold text-accent">{fleetMetrics.utilizationRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                <p className="text-2xl font-bold text-accent">£{fleetMetrics.monthlyEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Overview and Assignment Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fleet List */}
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-accent" />
              Fleet Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aircraft.map(aircraft => (
                <div 
                  key={aircraft.id} 
                  className={`p-4 border rounded-lg hover:bg-terminal-card/50 transition-colors cursor-pointer ${
                    selectedAircraft === aircraft.id ? 'bg-accent/10 border-accent/30' : ''
                  }`}
                  onClick={() => setSelectedAircraft(aircraft.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{aircraft.registration}</h3>
                        <Badge className={getStatusColor(aircraft.status)}>
                          {aircraft.status.toUpperCase()}
                        </Badge>
                        {aircraft.currentAssignment && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            <FileText className="w-3 h-3 mr-1" />
                            ASSIGNED
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Type</p>
                          <p className="text-sm font-medium">{aircraft.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="text-sm font-medium">{aircraft.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Hours</p>
                          <p className="text-sm font-medium">{aircraft.totalHours.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Maintenance</p>
                          <p className="text-sm font-medium">{new Date(aircraft.nextMaintenance).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {aircraft.crew.pilot && (
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground mb-1">Current Crew</p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-3 h-3" />
                              <span>Pilot: {aircraft.crew.pilot}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-3 h-3" />
                              <span>Crew: {aircraft.crew.crew.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assignment Tracking */}
        <Card className="terminal-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-accent" />
              Assignment Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAircraftData ? (
              <div className="space-y-4">
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <h3 className="font-semibold text-foreground mb-2">
                    {selectedAircraftData.registration} - {selectedAircraftData.type}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={getStatusColor(selectedAircraftData.status)}>
                        {selectedAircraftData.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">{selectedAircraftData.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedAircraftAssignments.map(assignment => (
                    <div key={assignment.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-foreground">{assignment.title}</h4>
                            <Badge className={getAssignmentStatusColor(assignment.status)}>
                              {assignment.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Client</p>
                              <p className="text-sm font-medium">{assignment.client}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Route</p>
                              <p className="text-sm font-medium">{assignment.route}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Earnings</p>
                              <p className="text-sm font-medium">£{assignment.earnings.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Progress</p>
                              <p className="text-sm font-medium">{assignment.progress}%</p>
                            </div>
                          </div>

                          {assignment.status === 'in-progress' && (
                            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                              <h5 className="text-sm font-medium text-yellow-400 mb-2">Live Tracking</h5>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Current Location</p>
                                  <p className="font-medium">{assignment.tracking.currentLocation}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Altitude</p>
                                  <p className="font-medium">{assignment.tracking.altitude.toLocaleString()} ft</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Speed</p>
                                  <p className="font-medium">{assignment.tracking.speed} kts</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">ETA</p>
                                  <p className="font-medium">{new Date(assignment.tracking.eta).toLocaleTimeString()}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mt-3">
                            <p className="text-sm text-muted-foreground mb-1">Crew</p>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="w-3 h-3" />
                                <span>Pilot: {assignment.crew.pilot}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="w-3 h-3" />
                                <span>Crew: {assignment.crew.crew.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Select an aircraft to view assignments</h3>
                <p className="text-muted-foreground">
                  Click on an aircraft from the fleet overview to see its current assignments and tracking information.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
