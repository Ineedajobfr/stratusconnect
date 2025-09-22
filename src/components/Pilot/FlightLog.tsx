import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  MapPin, 
  Plane, 
  Calendar,
  TrendingUp,
  Award,
  BarChart3,
  Download,
  Plus,
  Filter,
  Search,
  Eye,
  Edit
} from 'lucide-react';

interface FlightLogEntry {
  id: string;
  date: string;
  aircraftType: string;
  aircraftRegistration: string;
  route: string;
  departure: string;
  arrival: string;
  flightTime: number;
  totalTime: number;
  pilotInCommand: boolean;
  operator: string;
  client: string;
  purpose: 'charter' | 'ferry' | 'training' | 'maintenance' | 'positioning';
  weather: 'VMC' | 'IMC';
  landings: number;
  remarks: string;
  verified: boolean;
  earnings: number;
}

interface AircraftHours {
  aircraftType: string;
  totalHours: number;
  lastFlown: string;
  flights: number;
}

interface MonthlyStats {
  month: string;
  totalHours: number;
  flights: number;
  earnings: number;
  aircraftTypes: string[];
}

export default function FlightLog({ terminalType }: { terminalType: string }) {
  const [selectedAircraft, setSelectedAircraft] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const [flightLog] = useState<FlightLogEntry[]>([
    {
      id: 'fl-001',
      date: '2025-09-19',
      aircraftType: 'Gulfstream G650',
      aircraftRegistration: 'N123GX',
      route: 'London (LHR) → New York (JFK)',
      departure: 'LHR',
      arrival: 'JFK',
      flightTime: 7.5,
      totalTime: 2847.5,
      pilotInCommand: true,
      operator: 'Elite Aviation Group',
      client: 'Global Investment Corp',
      purpose: 'charter',
      weather: 'VMC',
      landings: 1,
      remarks: 'Smooth flight, excellent weather conditions',
      verified: true,
      earnings: 1200
    },
    {
      id: 'fl-002',
      date: '2025-09-18',
      aircraftType: 'Bombardier Global 7500',
      aircraftRegistration: 'N456BX',
      route: 'Paris (CDG) → Dubai (DXB)',
      departure: 'CDG',
      arrival: 'DXB',
      flightTime: 6.2,
      totalTime: 2840.0,
      pilotInCommand: true,
      operator: 'Global Charters Ltd',
      client: 'Luxury Travel Inc',
      purpose: 'charter',
      weather: 'VMC',
      landings: 1,
      remarks: 'VIP client, premium service',
      verified: true,
      earnings: 1500
    },
    {
      id: 'fl-003',
      date: '2025-09-17',
      aircraftType: 'Cessna Citation XLS+',
      aircraftRegistration: 'N789CX',
      route: 'Geneva (GVA) → Nice (NCE)',
      departure: 'GVA',
      arrival: 'NCE',
      flightTime: 1.2,
      totalTime: 2833.8,
      pilotInCommand: true,
      operator: 'Swiss Aviation Services',
      client: 'Private Individual',
      purpose: 'charter',
      weather: 'VMC',
      landings: 1,
      remarks: 'Short domestic flight, beautiful scenery',
      verified: true,
      earnings: 800
    },
    {
      id: 'fl-004',
      date: '2025-09-15',
      aircraftType: 'Gulfstream G650',
      aircraftRegistration: 'N123GX',
      route: 'London (LHR) → Dubai (DXB)',
      departure: 'LHR',
      arrival: 'DXB',
      flightTime: 6.8,
      totalTime: 2832.6,
      pilotInCommand: true,
      operator: 'Elite Aviation Group',
      client: 'Business Executive',
      purpose: 'charter',
      weather: 'IMC',
      landings: 1,
      remarks: 'IFR conditions, professional handling',
      verified: true,
      earnings: 1200
    },
    {
      id: 'fl-005',
      date: '2025-09-12',
      aircraftType: 'Dassault Falcon 8X',
      aircraftRegistration: 'N321FX',
      route: 'New York (JFK) → London (LHR)',
      departure: 'JFK',
      arrival: 'LHR',
      flightTime: 7.1,
      totalTime: 2825.8,
      pilotInCommand: true,
      operator: 'Falcon Operations Inc',
      client: 'Corporate Client',
      purpose: 'charter',
      weather: 'VMC',
      landings: 1,
      remarks: 'Transatlantic crossing, excellent performance',
      verified: true,
      earnings: 1800
    }
  ]);

  const [aircraftHours] = useState<AircraftHours[]>([
    { aircraftType: 'Gulfstream G650', totalHours: 1250, lastFlown: '2025-09-19', flights: 45 },
    { aircraftType: 'Bombardier Global 7500', totalHours: 890, lastFlown: '2025-09-18', flights: 32 },
    { aircraftType: 'Cessna Citation XLS+', totalHours: 450, lastFlown: '2025-09-17', flights: 28 },
    { aircraftType: 'Dassault Falcon 8X', totalHours: 257, lastFlown: '2025-09-12', flights: 18 }
  ]);

  const [monthlyStats] = useState<MonthlyStats[]>([
    { month: 'September 2025', totalHours: 28.8, flights: 5, earnings: 6500, aircraftTypes: ['G650', 'Global 7500', 'Citation XLS+', 'Falcon 8X'] },
    { month: 'August 2025', totalHours: 45.2, flights: 8, earnings: 12000, aircraftTypes: ['G650', 'Global 7500', 'Citation XLS+'] },
    { month: 'July 2025', totalHours: 52.1, flights: 9, earnings: 13500, aircraftTypes: ['G650', 'Global 7500', 'Falcon 8X'] }
  ]);

  const filteredFlights = flightLog.filter(flight => {
    const aircraftMatch = selectedAircraft === 'all' || flight.aircraftType === selectedAircraft;
    const monthMatch = selectedMonth === 'all' || flight.date.startsWith(selectedMonth);
    return aircraftMatch && monthMatch;
  });

  const totalHours = flightLog.reduce((sum, flight) => sum + flight.flightTime, 0);
  const totalEarnings = flightLog.reduce((sum, flight) => sum + flight.earnings, 0);
  const totalFlights = flightLog.length;
  const verifiedFlights = flightLog.filter(flight => flight.verified).length;

  const getPurposeColor = (purpose: string) => {
    switch (purpose) {
      case 'charter': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ferry': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'training': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'positioning': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getWeatherColor = (weather: string) => {
    return weather === 'VMC' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold text-accent">{totalHours.toFixed(1)}</p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Flights</p>
                <p className="text-2xl font-bold text-accent">{totalFlights}</p>
              </div>
              <Plane className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold text-accent">£{totalEarnings.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-accent">{verifiedFlights}/{totalFlights}</p>
              </div>
              <Award className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aircraft Hours Breakdown */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            Hours by Aircraft Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aircraftHours.map(aircraft => (
              <div key={aircraft.aircraftType} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{aircraft.aircraftType}</h3>
                  <div className="text-right">
                    <div className="text-lg font-bold text-accent">{aircraft.totalHours} hours</div>
                    <div className="text-sm text-muted-foreground">{aircraft.flights} flights</div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Last flown: {new Date(aircraft.lastFlown).toLocaleDateString()}</span>
                  <span>{((aircraft.totalHours / totalHours) * 100).toFixed(1)}% of total</span>
                </div>
                <Progress value={(aircraft.totalHours / totalHours) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Statistics */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            Monthly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {monthlyStats.map(month => (
              <div key={month.month} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-foreground mb-3">{month.month}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Hours:</span>
                    <span className="text-sm font-medium">{month.totalHours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Flights:</span>
                    <span className="text-sm font-medium">{month.flights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Earnings:</span>
                    <span className="text-sm font-medium">£{month.earnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Aircraft:</span>
                    <span className="text-sm font-medium">{month.aircraftTypes.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Flight Log Entries */}
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              Flight Log Entries
            </CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={selectedAircraft}
                onChange={(e) => setSelectedAircraft(e.target.value)}
                className="h-9 px-3 py-1 bg-terminal-card border border-terminal-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              >
                <option value="all">All Aircraft</option>
                {aircraftHours.map(aircraft => (
                  <option key={aircraft.aircraftType} value={aircraft.aircraftType}>
                    {aircraft.aircraftType}
                  </option>
                ))}
              </select>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFlights.map(flight => (
              <div key={flight.id} className="p-4 border rounded-lg hover:bg-terminal-card/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {flight.aircraftType} - {flight.aircraftRegistration}
                      </h3>
                      <Badge className={getPurposeColor(flight.purpose)}>
                        {flight.purpose.toUpperCase()}
                      </Badge>
                      <Badge className={getWeatherColor(flight.weather)}>
                        {flight.weather}
                      </Badge>
                      {flight.verified && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <Award className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="text-sm font-medium">{new Date(flight.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Route</p>
                        <p className="text-sm font-medium">{flight.route}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Flight Time</p>
                        <p className="text-sm font-medium">{flight.flightTime}h</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Earnings</p>
                        <p className="text-sm font-medium">£{flight.earnings.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Operator</p>
                        <p className="text-sm font-medium">{flight.operator}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Client</p>
                        <p className="text-sm font-medium">{flight.client}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Landings</p>
                        <p className="text-sm font-medium">{flight.landings}</p>
                      </div>
                    </div>

                    {flight.remarks && (
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground">Remarks</p>
                        <p className="text-sm text-foreground">{flight.remarks}</p>
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
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
