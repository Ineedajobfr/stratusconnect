import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plane, 
  MapPin, 
  Clock, 
  Navigation, 
  Eye, 
  EyeOff,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from "lucide-react";

interface AircraftPosition {
  id: string;
  tailNumber: string;
  callsign: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  heading: number;
  squawk: string;
  timestamp: string;
  status: "tracking" | "offline" | "error";
}

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
      // Simulate FlightRadar24 API call
      // In real implementation, you would call FlightRadar24's API or use their widget
      const mockPositions = generateMockPositions(tailNumbers);
      setAircraftPositions(mockPositions);
      setLastUpdate(new Date());
    } catch (err) {
      setError("Failed to fetch aircraft positions");
      console.error("FlightRadar24 API error:", err);
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
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const formatAltitude = (alt: number) => {
    return `${alt.toLocaleString()} ft`;
  };

  const formatSpeed = (speed: number) => {
    return `${speed} kts`;
  };

  const formatHeading = (heading: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(heading / 45) % 8;
    return `${heading}° ${directions[index]}`;
  };

  return (
    <Card className="bg-terminal-card/50 border-terminal-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-foreground">
              <Plane className="h-5 w-5 mr-2 text-accent" />
              Real-Time Aircraft Tracking
            </CardTitle>
            <CardDescription>
              Live aircraft positions powered by FlightRadar24
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
              {role === "operator" ? "Operator View" : "Broker View"}
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

        {lastUpdate && (
          <div className="mb-4 text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}

        {tailNumbers.length === 0 ? (
          <div className="text-center py-8">
            <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No aircraft configured for tracking</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add tail numbers to start tracking aircraft positions
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {aircraftPositions.map((aircraft) => (
              <div key={aircraft.id} className="border border-terminal-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                      <Plane className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{aircraft.tailNumber}</h3>
                      <p className="text-sm text-muted-foreground">{aircraft.callsign}</p>
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

                {showDetails[aircraft.tailNumber] && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-terminal-border">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Position</div>
                      <div className="font-mono text-sm text-foreground">
                        {formatCoordinates(aircraft.latitude, aircraft.longitude)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Altitude</div>
                      <div className="font-semibold text-foreground">
                        {formatAltitude(aircraft.altitude)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Speed</div>
                      <div className="font-semibold text-foreground">
                        {formatSpeed(aircraft.speed)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Heading</div>
                      <div className="flex items-center justify-center">
                        <Navigation 
                          className="h-4 w-4 mr-1 text-accent" 
                          style={{ transform: `rotate(${aircraft.heading}deg)` }}
                        />
                        <span className="font-semibold text-foreground">
                          {formatHeading(aircraft.heading)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {showMap && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        // Open FlightRadar24 in new tab with aircraft position
                        const url = `https://www.flightradar24.com/${aircraft.tailNumber}`;
                        window.open(url, '_blank');
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on FlightRadar24
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showMap && (
          <div className="mt-6 p-4 bg-terminal-bg/50 rounded-lg border border-terminal-border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-foreground">Interactive Map</h4>
              <Badge variant="outline" className="text-xs">
                FlightRadar24
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mb-3">
              Click "View on FlightRadar24" to see aircraft on the interactive map
            </div>
            <div className="h-32 bg-terminal-border/50 rounded flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  FlightRadar24 Map Widget
                </p>
                <p className="text-xs text-muted-foreground">
                  Real-time tracking visualization
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Mock data generator - replace with real FlightRadar24 API integration
function generateMockPositions(tailNumbers: string[]): AircraftPosition[] {
  return tailNumbers.map((tailNumber, index) => ({
    id: `aircraft-${index}`,
    tailNumber,
    callsign: `${tailNumber.slice(0, 3)}${Math.floor(Math.random() * 100)}`,
    latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
    longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
    altitude: 35000 + Math.random() * 10000,
    speed: 450 + Math.random() * 100,
    heading: Math.floor(Math.random() * 360),
    squawk: Math.floor(1000 + Math.random() * 8000).toString(),
    timestamp: new Date().toISOString(),
    status: Math.random() > 0.1 ? "tracking" : "offline"
  }));
}
