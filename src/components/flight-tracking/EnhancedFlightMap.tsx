import { EnterpriseCard } from '@/components/enterprise/EnterpriseCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Activity, CloudRain, Plane, Radio } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Flight {
  id: string;
  icao24: string;
  callsign: string;
  lat: number;
  lon: number;
  altitude: number;
  velocity: number;
  heading: number;
  origin?: string;
  destination?: string;
  aircraft_type?: string;
}

interface EmptyLeg {
  id: string;
  from: { lat: number; lon: number; name: string };
  to: { lat: number; lon: number; name: string };
  date: string;
  aircraft: string;
  price: number;
  operator: string;
}

interface Airport {
  id: string;
  name: string;
  iata: string;
  lat: number;
  lon: number;
  type: 'major' | 'regional' | 'fbo';
}

export const EnhancedFlightMap: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [emptyLegs, setEmptyLegs] = useState<EmptyLeg[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFlights, setShowFlights] = useState(true);
  const [showEmptyLegs, setShowEmptyLegs] = useState(true);
  const [showAirports, setShowAirports] = useState(true);
  const [showWeather, setShowWeather] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  // Center on USA
  const defaultCenter: [number, number] = [39.8283, -98.5795];
  const defaultZoom = 5;

  useEffect(() => {
    loadMapData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadMapData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMapData = async () => {
    try {
      // Load real-time flights (OpenSky API - FREE!)
      await loadFlights();
      
      // Load empty legs (from our database)
      await loadEmptyLegs();
      
      // Load airports
      await loadAirports();
    } catch (error) {
      console.error('Failed to load map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFlights = async () => {
    try {
      // OpenSky Network API (FREE real-time flight tracking)
      const response = await fetch(
        'https://opensky-network.org/api/states/all?lamin=24.396308&lomin=-125.0&lamax=49.384358&lomax=-66.93457'
      );
      
      if (!response.ok) return;
      
      const data = await response.json();
      
      const processedFlights: Flight[] = data.states
        ?.filter((state: any) => state[5] && state[6]) // Has lat/lon
        ?.slice(0, 50) // Limit to 50 flights for performance
        ?.map((state: any) => ({
          id: state[0],
          icao24: state[0],
          callsign: state[1]?.trim() || 'Unknown',
          lat: state[6],
          lon: state[5],
          altitude: state[7] || 0,
          velocity: state[9] || 0,
          heading: state[10] || 0,
        })) || [];
      
      setFlights(processedFlights);
    } catch (error) {
      console.error('Failed to load flights:', error);
    }
  };

  const loadEmptyLegs = async () => {
    // Mock empty legs - in production, load from Supabase
    const mockEmptyLegs: EmptyLeg[] = [
      {
        id: '1',
        from: { lat: 40.7128, lon: -74.0060, name: 'New York (TEB)' },
        to: { lat: 25.7617, lon: -80.1918, name: 'Miami (OPF)' },
        date: '2025-01-15',
        aircraft: 'Citation X',
        price: 18500,
        operator: 'Elite Jets',
      },
      {
        id: '2',
        from: { lat: 34.0522, lon: -118.2437, name: 'Los Angeles (VNY)' },
        to: { lat: 37.7749, lon: -122.4194, name: 'San Francisco (SFO)' },
        date: '2025-01-16',
        aircraft: 'Gulfstream G450',
        price: 12300,
        operator: 'Pacific Air',
      },
      {
        id: '3',
        from: { lat: 41.8781, lon: -87.6298, name: 'Chicago (MDW)' },
        to: { lat: 29.7604, lon: -95.3698, name: 'Houston (HOU)' },
        date: '2025-01-17',
        aircraft: 'Phenom 300',
        price: 9800,
        operator: 'Central Aviation',
      },
    ];
    
    setEmptyLegs(mockEmptyLegs);
  };

  const loadAirports = async () => {
    // Mock major airports - in production, load from database
    const mockAirports: Airport[] = [
      { id: '1', name: 'Teterboro Airport', iata: 'TEB', lat: 40.8501, lon: -74.0608, type: 'major' },
      { id: '2', name: 'Van Nuys Airport', iata: 'VNY', lat: 34.2098, lon: -118.4897, type: 'major' },
      { id: '3', name: 'Miami-Opa Locka', iata: 'OPF', lat: 25.9070, lon: -80.2784, type: 'fbo' },
      { id: '4', name: 'Chicago Midway', iata: 'MDW', lat: 41.7868, lon: -87.7522, type: 'major' },
      { id: '5', name: 'Dallas Love Field', iata: 'DAL', lat: 32.8471, lon: -96.8518, type: 'major' },
    ];
    
    setAirports(mockAirports);
  };

  // Custom icons
  const createPlaneIcon = (heading: number) => {
    return L.divIcon({
      html: `<div style="transform: rotate(${heading}deg);">✈️</div>`,
      className: 'plane-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const emptyLegIcon = L.divIcon({
    html: '<div style="font-size: 20px;">🛫</div>',
    className: 'empty-leg-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const airportIcon = L.divIcon({
    html: '<div style="font-size: 16px;">🛬</div>',
    className: 'airport-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  if (loading) {
    return (
      <EnterpriseCard title="Enhanced Flight Map" status="pending">
        <div className="flex items-center justify-center h-96">
          <div className="enterprise-spinner" />
          <span className="ml-3 text-white/60 font-mono">Loading map data...</span>
        </div>
      </EnterpriseCard>
    );
  }

  return (
    <EnterpriseCard
      title="Enhanced Flight Map"
      description="Real-time flight tracking with empty leg marketplace"
      status="live"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFlights(!showFlights)}
            className={cn(
              'border-enterprise-primary/20 text-white',
              showFlights && 'bg-enterprise-primary/20'
            )}
          >
            <Plane className="w-4 h-4 mr-2" />
            Flights ({flights.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEmptyLegs(!showEmptyLegs)}
            className={cn(
              'border-enterprise-primary/20 text-white',
              showEmptyLegs && 'bg-enterprise-gold/20'
            )}
          >
            <Radio className="w-4 h-4 mr-2" />
            Empty Legs ({emptyLegs.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAirports(!showAirports)}
            className={cn(
              'border-enterprise-primary/20 text-white',
              showAirports && 'bg-enterprise-info/20'
            )}
          >
            <Activity className="w-4 h-4 mr-2" />
            Airports ({airports.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowWeather(!showWeather)}
            className={cn(
              'border-enterprise-primary/20 text-white',
              showWeather && 'bg-enterprise-warning/20'
            )}
          >
            <CloudRain className="w-4 h-4 mr-2" />
            Weather
          </Button>
        </div>
      }
    >
      <div className="relative h-[600px] rounded-lg overflow-hidden border border-enterprise-primary/20">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Real-time Flights */}
          {showFlights && flights.map((flight) => (
            <Marker
              key={flight.id}
              position={[flight.lat, flight.lon]}
              icon={createPlaneIcon(flight.heading)}
              eventHandlers={{
                click: () => setSelectedFlight(flight),
              }}
            >
              <Popup>
                <div className="p-2">
                  <div className="font-bold text-enterprise-primary">{flight.callsign}</div>
                  <div className="text-xs space-y-1 mt-2">
                    <div>Altitude: {Math.round(flight.altitude)}m</div>
                    <div>Speed: {Math.round(flight.velocity * 3.6)}km/h</div>
                    <div>Heading: {Math.round(flight.heading)}°</div>
                  </div>
                  <Badge className="status-badge status-badge-success mt-2">
                    <span className="mr-1">●</span>
                    LIVE
                  </Badge>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Empty Legs */}
          {showEmptyLegs && emptyLegs.map((leg) => (
            <React.Fragment key={leg.id}>
              {/* Route line */}
              <Polyline
                positions={[
                  [leg.from.lat, leg.from.lon],
                  [leg.to.lat, leg.to.lon],
                ]}
                color="#FFD700"
                weight={3}
                opacity={0.7}
                dashArray="10, 10"
              />
              
              {/* Origin marker */}
              <Marker
                position={[leg.from.lat, leg.from.lon]}
                icon={emptyLegIcon}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="font-bold text-enterprise-gold">Empty Leg Available!</div>
                    <div className="text-sm space-y-1 mt-2">
                      <div><strong>Route:</strong> {leg.from.name} → {leg.to.name}</div>
                      <div><strong>Date:</strong> {leg.date}</div>
                      <div><strong>Aircraft:</strong> {leg.aircraft}</div>
                      <div><strong>Operator:</strong> {leg.operator}</div>
                      <div className="text-lg font-bold text-enterprise-gold mt-2">
                        ${leg.price.toLocaleString()}
                      </div>
                    </div>
                    <Button
                      className="w-full mt-3 bg-enterprise-gold text-black hover:bg-enterprise-gold/80"
                      size="sm"
                    >
                      Book Now
                    </Button>
                  </div>
                </Popup>
              </Marker>
              
              {/* Destination marker */}
              <Marker
                position={[leg.to.lat, leg.to.lon]}
                icon={emptyLegIcon}
              />
            </React.Fragment>
          ))}
          
          {/* Airports */}
          {showAirports && airports.map((airport) => (
            <Marker
              key={airport.id}
              position={[airport.lat, airport.lon]}
              icon={airportIcon}
            >
              <Popup>
                <div className="p-2">
                  <div className="font-bold">{airport.name}</div>
                  <div className="text-xs space-y-1 mt-2">
                    <div>IATA: {airport.iata}</div>
                    <div>Type: {airport.type.toUpperCase()}</div>
                  </div>
                  <Badge className={cn(
                    'status-badge mt-2',
                    airport.type === 'major' ? 'status-badge-info' : 'status-badge-neutral'
                  )}>
                    {airport.type}
                  </Badge>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Weather overlay (when enabled) */}
          {showWeather && (
            <Circle
              center={defaultCenter}
              radius={500000}
              pathOptions={{
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.1,
              }}
            />
          )}
        </MapContainer>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-black/90 p-4 rounded-lg border border-enterprise-primary/20">
          <div className="text-xs font-mono space-y-2">
            <div className="text-white/80 font-semibold mb-2">Legend</div>
            <div className="flex items-center gap-2">
              <span>✈️</span>
              <span className="text-white/70">Live Flights ({flights.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🛫</span>
              <span className="text-white/70">Empty Legs ({emptyLegs.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🛬</span>
              <span className="text-white/70">Airports ({airports.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-enterprise-gold"></div>
              <span className="text-white/70">Available Route</span>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="absolute top-4 right-4 z-[1000] bg-black/90 p-4 rounded-lg border border-enterprise-primary/20">
          <div className="text-xs font-mono space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-enterprise-success" />
              <span className="text-white/70">Live Tracking Active</span>
            </div>
            <div className="text-white/50 text-xs">Updates every 30s</div>
          </div>
        </div>
      </div>
      
      {/* Map powered by OpenStreetMap (FREE!) */}
      <p className="text-xs text-white/40 mt-2 font-mono text-center">
        Powered by OpenStreetMap (FREE) • Real-time data from OpenSky Network • No Mapbox fees!
      </p>
    </EnterpriseCard>
  );
};

