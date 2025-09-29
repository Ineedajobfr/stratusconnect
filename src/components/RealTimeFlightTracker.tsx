import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plane, MapPin, Clock, Navigation, RefreshCw, Search, Filter } from 'lucide-react';

interface Flight {
  id: string;
  callsign: string;
  aircraft: string;
  origin: string;
  destination: string;
  altitude: number;
  speed: number;
  heading: number;
  latitude: number;
  longitude: number;
  status: 'en-route' | 'departed' | 'arrived' | 'delayed';
  eta: string;
  distance: number;
}

interface FlightTrackerProps {
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
}

export default function RealTimeFlightTracker({ terminalType }: FlightTrackerProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [aircraftFilter, setAircraftFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Mock flight data - replace with real API
  const mockFlights: Flight[] = [
    {
      id: '1',
      callsign: 'N123AB',
      aircraft: 'Gulfstream G550',
      origin: 'EGLL',
      destination: 'KJFK',
      altitude: 41000,
      speed: 485,
      heading: 285,
      latitude: 51.4700,
      longitude: -0.4543,
      status: 'en-route',
      eta: '14:30',
      distance: 3450
    },
    {
      id: '2',
      callsign: 'N456CD',
      aircraft: 'Falcon 7X',
      origin: 'KJFK',
      destination: 'EGLL',
      altitude: 43000,
      speed: 495,
      heading: 105,
      latitude: 40.6413,
      longitude: -73.7781,
      status: 'en-route',
      eta: '06:45',
      distance: 3450
    },
    {
      id: '3',
      callsign: 'N789EF',
      aircraft: 'Citation X',
      origin: 'KLAX',
      destination: 'KJFK',
      altitude: 45000,
      speed: 520,
      heading: 75,
      latitude: 34.0522,
      longitude: -118.2437,
      status: 'en-route',
      eta: '18:20',
      distance: 2475
    },
    {
      id: '4',
      callsign: 'N321GH',
      aircraft: 'Global 6000',
      origin: 'EGLL',
      destination: 'LFPG',
      altitude: 0,
      speed: 0,
      heading: 0,
      latitude: 51.4700,
      longitude: -0.4543,
      status: 'departed',
      eta: '12:15',
      distance: 214
    }
  ];

  useEffect(() => {
    loadFlights();
    const interval = setInterval(loadFlights, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterFlights();
  }, [flights, searchTerm, statusFilter, aircraftFilter]);

  const loadFlights = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFlights(mockFlights);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load flights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterFlights = () => {
    let filtered = flights;

    if (searchTerm) {
      filtered = filtered.filter(flight =>
        flight.callsign.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.aircraft.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(flight => flight.status === statusFilter);
    }

    if (aircraftFilter !== 'all') {
      filtered = filtered.filter(flight => flight.aircraft === aircraftFilter);
    }

    setFilteredFlights(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en-route': return 'bg-green-500';
      case 'departed': return 'bg-blue-500';
      case 'arrived': return 'bg-gray-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDistance = (distance: number) => {
    return `${distance.toLocaleString()} nm`;
  };

  const formatSpeed = (speed: number) => {
    return `${speed} kts`;
  };

  const formatAltitude = (altitude: number) => {
    return altitude > 0 ? `${altitude.toLocaleString()} ft` : 'Ground';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Real-Time Flight Tracking</h2>
          <p className="text-gray-400">Live aircraft positions and status updates</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={loadFlights}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Badge variant="outline" className="text-gray-400">
            Last update: {lastUpdate.toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search flights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="en-route">En Route</SelectItem>
                <SelectItem value="departed">Departed</SelectItem>
                <SelectItem value="arrived">Arrived</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={aircraftFilter} onValueChange={setAircraftFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filter by aircraft" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Aircraft</SelectItem>
                <SelectItem value="Gulfstream G550">Gulfstream G550</SelectItem>
                <SelectItem value="Falcon 7X">Falcon 7X</SelectItem>
                <SelectItem value="Citation X">Citation X</SelectItem>
                <SelectItem value="Global 6000">Global 6000</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setAircraftFilter('all');
              }}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Flight List */}
      <div className="grid gap-4">
        {filteredFlights.map((flight) => (
          <Card key={flight.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-blue-400" />
                    <span className="font-mono text-lg font-bold text-white">{flight.callsign}</span>
                    <Badge className={`${getStatusColor(flight.status)} text-white`}>
                      {flight.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-gray-300">
                    <span className="font-medium">{flight.aircraft}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">ETA</div>
                  <div className="text-lg font-bold text-white">{flight.eta}</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <div>
                    <div className="text-sm text-gray-400">Route</div>
                    <div className="font-medium text-white">{flight.origin} → {flight.destination}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-sm text-gray-400">Altitude</div>
                    <div className="font-medium text-white">{formatAltitude(flight.altitude)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <div>
                    <div className="text-sm text-gray-400">Speed</div>
                    <div className="font-medium text-white">{formatSpeed(flight.speed)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="text-sm text-gray-400">Distance</div>
                    <div className="font-medium text-white">{formatDistance(flight.distance)}</div>
                  </div>
                </div>
              </div>

              {flight.status === 'en-route' && (
                <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Current Position</div>
                  <div className="text-white font-mono">
                    {flight.latitude.toFixed(4)}°N, {flight.longitude.toFixed(4)}°W
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Heading: {flight.heading}° | Speed: {formatSpeed(flight.speed)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFlights.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No flights found</h3>
            <p className="text-gray-400">Try adjusting your search criteria or refresh the data</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
