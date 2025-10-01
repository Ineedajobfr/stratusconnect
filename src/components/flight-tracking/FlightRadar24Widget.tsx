import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    formatAltitude,
    formatCoordinates,
    formatSpeed,
    formatVerticalRate,
    getAircraftByCallsign,
    getAllAircraft,
    type ProcessedAircraft
} from "@/lib/opensky-api";
import {
    Activity,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    MapPin,
    Navigation,
    Plane,
    RefreshCw,
    TrendingUp
} from "lucide-react";
import { useEffect, useState } from "react";
import { InteractiveFlightMap } from "./InteractiveFlightMap";

// Use the ProcessedAircraft type from the OpenSky API module
type AircraftPosition = ProcessedAircraft;

interface FlightRadar24WidgetProps {
  tailNumbers?: string[];
  showMap?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds
  role?: string;
}

export function FlightRadar24Widget({ 
  tailNumbers = [], 
  showMap = true, 
  autoRefresh = true,
  refreshInterval = 30,
  role = "operator"
}: FlightRadar24WidgetProps) {
  const [aircraftPositions, setAircraftPositions] = useState<AircraftPosition[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  const [selectedAircraft, setSelectedAircraft] = useState<ProcessedAircraft | null>(null);
  const [activeTab, setActiveTab] = useState("list");

  useEffect(() => {
    if (tailNumbers.length > 0 && autoRefresh) {
      startTracking();
      const interval = setInterval(startTracking, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [tailNumbers, autoRefresh, refreshInterval]);

  const startTracking = async () => {
    setIsTracking(true);
    setError(null);
    
    try {
      let positions: ProcessedAircraft[];
      
      if (tailNumbers.length > 0) {
        // Get specific aircraft by callsign/tail number
        positions = await getAircraftByCallsign(tailNumbers);
      } else {
        // Get all aircraft in the area
        positions = await getAllAircraft();
      }
      
      setAircraftPositions(positions);
      setLastUpdate(new Date());
    } catch (err) {
      setError("Failed to fetch aircraft positions");
      console.error("Flight tracking error:", err);
    } finally {
      setIsTracking(false);
    }
  };

  const toggleDetails = (tailNumber: string) => {
    setShowDetails(prev => ({
      ...prev,
      [tailNumber]: !prev[tailNumber]
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "tracking":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "offline":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "tracking":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "offline":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-terminal-muted/20 text-terminal-muted border-terminal-muted/30";
    }
  };

  // Formatting functions are now imported from the API module

  return (
    <Card className="bg-terminal-card/50 border-terminal-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-foreground">
              <Plane className="h-5 w-5 mr-2 text-accent" />
              Real-Time Flight Tracking
            </CardTitle>
            <CardDescription>
              Live aircraft positions and status updates
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={startTracking}
              disabled={isTracking}
              className="flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isTracking ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Badge variant="outline" className="text-xs">
              {lastUpdate ? `Last update: ${lastUpdate.toLocaleTimeString()}` : 'No data'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-terminal-bg/50">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Flight List
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Live Map
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            {aircraftPositions.length === 0 ? (
              <div className="text-center py-8">
                <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No aircraft data available</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click refresh to load live aircraft positions
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {aircraftPositions.map((aircraft) => (
                  <div key={aircraft.id} className="border border-terminal-border rounded-lg p-4 bg-terminal-bg/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                          <Plane className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{aircraft.callsign}</h3>
                          <p className="text-sm text-muted-foreground">{aircraft.tailNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(aircraft.status)}>
                          {getStatusIcon(aircraft.status)}
                          <span className="ml-1 capitalize">{aircraft.status}</span>
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleDetails(aircraft.tailNumber)}
                        >
                          {showDetails[aircraft.tailNumber] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-sm text-muted-foreground">Altitude</div>
                        <div className="font-semibold text-foreground">{formatAltitude(aircraft.altitude)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Speed</div>
                        <div className="font-semibold text-foreground">{formatSpeed(aircraft.speed)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Heading</div>
                        <div className="font-semibold text-foreground flex items-center justify-center">
                          <Navigation 
                            className="h-3 w-3 mr-1" 
                            style={{ transform: `rotate(${aircraft.heading}deg)` }}
                          />
                          {aircraft.heading}°
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Country</div>
                        <div className="font-semibold text-foreground">{aircraft.country}</div>
                      </div>
                    </div>

                    {showDetails[aircraft.tailNumber] && (
                      <div className="space-y-4 mt-4 pt-4 border-t border-terminal-border">
                        {/* Detailed Information */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Position</div>
                            <div className="font-mono text-sm text-foreground">
                              {formatCoordinates(aircraft.latitude, aircraft.longitude)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Vertical Rate</div>
                            <div className="font-semibold text-foreground">
                              {formatVerticalRate(aircraft.verticalRate)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Squawk</div>
                            <div className="font-semibold text-foreground">{aircraft.squawk}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">On Ground</div>
                            <div className="font-semibold text-foreground">
                              {aircraft.onGround ? 'Yes' : 'No'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          {aircraft.aircraftType && <span>Aircraft: {aircraft.aircraftType}</span>}
                          {aircraft.flightNumber && <span>Flight: {aircraft.flightNumber}</span>}
                          <span>Updated: {new Date(aircraft.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="map" className="mt-4">
            <InteractiveFlightMap
              aircraft={aircraftPositions}
              onAircraftSelect={setSelectedAircraft}
              selectedAircraft={selectedAircraft}
              autoRefresh={autoRefresh}
              refreshInterval={refreshInterval}
            />
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-terminal-bg/30 rounded-lg border border-terminal-border text-center">
                <div className="text-2xl font-bold text-accent">{aircraftPositions.length}</div>
                <div className="text-sm text-muted-foreground">Total Aircraft</div>
              </div>
              <div className="p-4 bg-terminal-bg/30 rounded-lg border border-terminal-border text-center">
                <div className="text-2xl font-bold text-green-400">
                  {aircraftPositions.filter(a => a.status === 'tracking').length}
                </div>
                <div className="text-sm text-muted-foreground">In Flight</div>
              </div>
              <div className="p-4 bg-terminal-bg/30 rounded-lg border border-terminal-border text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {aircraftPositions.filter(a => a.status === 'ground').length}
                </div>
                <div className="text-sm text-muted-foreground">On Ground</div>
              </div>
              <div className="p-4 bg-terminal-bg/30 rounded-lg border border-terminal-border text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {Math.round(aircraftPositions.reduce((acc, a) => acc + a.altitude, 0) / aircraftPositions.length) || 0}
                </div>
                <div className="text-sm text-muted-foreground">Avg Altitude (ft)</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Mock data generator - replace with real FlightRadar24 API integration
// Mock data generator is now handled by the flightradar24-api module
