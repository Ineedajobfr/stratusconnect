import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  MapPin, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter, 
  RefreshCw,
  Eye,
  EyeOff,
  Zap,
  TrendingUp,
  Globe,
  Users,
  Target,
  X
} from 'lucide-react';

interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  aircraft: string;
  origin: string;
  destination: string;
  status: 'departed' | 'en-route' | 'arrived' | 'delayed';
  departureTime: string;
  arrivalTime: string;
  altitude: number;
  speed: number;
  latitude: number;
  longitude: number;
  heading: number;
  type: 'commercial' | 'private' | 'cargo';
  callsign: string;
}

interface ModernFlightTrackerProps {
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
}

export const ModernFlightTracker: React.FC<ModernFlightTrackerProps> = ({ terminalType }) => {
  const [flights, setFlights] = useState<Flight[]>([
    {
      id: '1',
      flightNumber: 'N123AB',
      airline: 'Elite Aviation',
      aircraft: 'Gulfstream G650',
      origin: 'KJFK',
      destination: 'EGLL',
      status: 'en-route',
      departureTime: '14:30',
      arrivalTime: '22:45',
      altitude: 41000,
      speed: 485,
      latitude: 51.4700,
      longitude: -0.4543,
      heading: 85,
      type: 'private',
      callsign: 'ELITE123'
    },
    {
      id: '2',
      flightNumber: 'N456CD',
      airline: 'SkyHigh Jets',
      aircraft: 'Citation X',
      origin: 'KLAX',
      destination: 'KJFK',
      status: 'departed',
      departureTime: '16:15',
      arrivalTime: '00:30',
      altitude: 45000,
      speed: 520,
      latitude: 40.6413,
      longitude: -73.7781,
      heading: 95,
      type: 'private',
      callsign: 'SKY456'
    },
    {
      id: '3',
      flightNumber: 'BA123',
      airline: 'British Airways',
      aircraft: 'Boeing 777',
      origin: 'EGLL',
      destination: 'KJFK',
      status: 'en-route',
      departureTime: '18:00',
      arrivalTime: '21:30',
      altitude: 38000,
      speed: 560,
      latitude: 52.3555,
      longitude: -1.1743,
      heading: 270,
      type: 'commercial',
      callsign: 'SPEEDBIRD123'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'commercial' | 'private' | 'cargo'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'departed' | 'en-route' | 'arrived' | 'delayed'>('all');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const filteredFlights = flights.filter(flight => {
    const matchesSearch = 
      flight.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.aircraft.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || flight.type === filterType;
    const matchesStatus = filterStatus === 'all' || flight.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'departed': return 'text-blue-400 bg-blue-500/20';
      case 'en-route': return 'text-green-400 bg-green-500/20';
      case 'arrived': return 'text-gray-400 bg-gray-500/20';
      case 'delayed': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'private': return 'text-orange-400 bg-orange-500/20';
      case 'commercial': return 'text-blue-400 bg-blue-500/20';
      case 'cargo': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const formatTime = (time: string) => {
    return time;
  };

  const formatAltitude = (altitude: number) => {
    return `${Math.floor(altitude / 100)}FL`;
  };

  const formatSpeed = (speed: number) => {
    return `${speed} kts`;
  };

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        setFlights(prev => prev.map(flight => ({
          ...flight,
          latitude: flight.latitude + (Math.random() - 0.5) * 0.1,
          longitude: flight.longitude + (Math.random() - 0.5) * 0.1,
          altitude: flight.altitude + (Math.random() - 0.5) * 1000,
          speed: flight.speed + (Math.random() - 0.5) * 20
        })));
        setLastUpdate(new Date());
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // In a real implementation, this would fetch fresh data from FlightRadar24 API
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plane className="w-6 h-6 text-orange-400" />
            Live Flight Tracker
          </h2>
          <p className="text-slate-400">
            Real-time aircraft tracking powered by FlightRadar24
            {isLive && (
              <span className="ml-2 inline-flex items-center gap-1 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Live
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isLive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'
            }`}
          >
            {isLive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {isLive ? 'Live' : 'Paused'}
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{flights.length}</p>
              <p className="text-sm text-slate-400">Active Flights</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {flights.filter(f => f.status === 'en-route').length}
              </p>
              <p className="text-sm text-slate-400">En Route</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {flights.filter(f => f.type === 'private').length}
              </p>
              <p className="text-sm text-slate-400">Private Jets</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {flights.filter(f => f.type === 'commercial').length}
              </p>
              <p className="text-sm text-slate-400">Commercial</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search flights, airlines, aircraft..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Types</option>
          <option value="private">Private</option>
          <option value="commercial">Commercial</option>
          <option value="cargo">Cargo</option>
        </select>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Status</option>
          <option value="departed">Departed</option>
          <option value="en-route">En Route</option>
          <option value="arrived">Arrived</option>
          <option value="delayed">Delayed</option>
        </select>
      </div>

      {/* Flight List */}
      <div className="space-y-3">
        {filteredFlights.map(flight => (
          <div
            key={flight.id}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/70 transition-colors cursor-pointer"
            onClick={() => setSelectedFlight(flight)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center">
                  <Plane className="w-6 h-6 text-orange-400" />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{flight.flightNumber}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${getTypeColor(flight.type)}`}>
                      {flight.type}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(flight.status)}`}>
                      {flight.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{flight.airline} • {flight.aircraft}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-slate-400">Route</p>
                  <p className="font-semibold text-white">{flight.origin} → {flight.destination}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-slate-400">Altitude</p>
                  <p className="font-semibold text-white">{formatAltitude(flight.altitude)}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-slate-400">Speed</p>
                  <p className="font-semibold text-white">{formatSpeed(flight.speed)}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-slate-400">ETA</p>
                  <p className="font-semibold text-white">{formatTime(flight.arrivalTime)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Flight Detail Modal */}
      {selectedFlight && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-4xl border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Flight Details</h3>
              <button
                onClick={() => setSelectedFlight(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Flight Information</h4>
                  <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Flight Number:</span>
                      <span className="text-white">{selectedFlight.flightNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Callsign:</span>
                      <span className="text-white">{selectedFlight.callsign}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Airline:</span>
                      <span className="text-white">{selectedFlight.airline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Aircraft:</span>
                      <span className="text-white">{selectedFlight.aircraft}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type:</span>
                      <span className="text-white capitalize">{selectedFlight.type}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Route Information</h4>
                  <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Origin:</span>
                      <span className="text-white">{selectedFlight.origin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Destination:</span>
                      <span className="text-white">{selectedFlight.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Departure:</span>
                      <span className="text-white">{selectedFlight.departureTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Arrival:</span>
                      <span className="text-white">{selectedFlight.arrivalTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Current Status</h4>
                  <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedFlight.status)}`}>
                        {selectedFlight.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Altitude:</span>
                      <span className="text-white">{formatAltitude(selectedFlight.altitude)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Speed:</span>
                      <span className="text-white">{formatSpeed(selectedFlight.speed)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Heading:</span>
                      <span className="text-white">{selectedFlight.heading}°</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Position</h4>
                  <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Latitude:</span>
                      <span className="text-white">{selectedFlight.latitude.toFixed(4)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Longitude:</span>
                      <span className="text-white">{selectedFlight.longitude.toFixed(4)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Update:</span>
                      <span className="text-white">{lastUpdate.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Last Update */}
      <div className="text-center text-sm text-slate-500">
        Last updated: {lastUpdate.toLocaleString()}
      </div>
    </div>
  );
};
