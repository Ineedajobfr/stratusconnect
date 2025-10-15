import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllAircraft, type ProcessedAircraft } from '@/lib/opensky-api';
import { MapPin, Navigation, Plane, RefreshCw, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface InteractiveFlightMapProps {
  aircraft?: ProcessedAircraft[];
  onAircraftSelect?: (aircraft: ProcessedAircraft) => void;
  selectedAircraft?: ProcessedAircraft | null;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function InteractiveFlightMap({ 
  aircraft = [], 
  onAircraftSelect,
  selectedAircraft,
  autoRefresh = true,
  refreshInterval = 30
}: InteractiveFlightMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [zoom, setZoom] = useState(5);
  const [liveAircraft, setLiveAircraft] = useState<ProcessedAircraft[]>(aircraft);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const data = await getAllAircraft();
          setLiveAircraft(data);
          setLastUpdate(new Date());
        } catch (error) {
          console.error('Failed to fetch aircraft data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
      const interval = setInterval(fetchData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // Draw the map and aircraft
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Convert lat/lng to canvas coordinates
    const latLngToCanvas = (lat: number, lng: number) => {
      const x = ((lng + 180) / 360) * canvas.width;
      const y = ((90 - lat) / 180) * canvas.height;
      return { x, y };
    };

    // Draw aircraft
    liveAircraft.forEach(aircraft => {
      const { x, y } = latLngToCanvas(aircraft.latitude, aircraft.longitude);
      
      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        // Draw aircraft icon
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((aircraft.heading * Math.PI) / 180);
        
        // Aircraft body
        ctx.fillStyle = selectedAircraft?.id === aircraft.id ? '#ff6b35' : '#00ff88';
        ctx.fillRect(-8, -2, 16, 4);
        
        // Aircraft wings
        ctx.fillStyle = selectedAircraft?.id === aircraft.id ? '#ff6b35' : '#00ff88';
        ctx.fillRect(-6, -6, 12, 2);
        ctx.fillRect(-6, 4, 12, 2);
        
        // Aircraft nose
        ctx.fillStyle = selectedAircraft?.id === aircraft.id ? '#ff6b35' : '#ffffff';
        ctx.fillRect(6, -1, 4, 2);
        
        ctx.restore();

        // Draw altitude and speed info
        if (selectedAircraft?.id === aircraft.id) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px monospace';
          ctx.fillText(`${aircraft.altitude}ft`, x + 10, y - 10);
          ctx.fillText(`${aircraft.speed}kts`, x + 10, y + 5);
        }
      }
    });

    // Draw center marker
    const center = latLngToCanvas(mapCenter.lat, mapCenter.lng);
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(center.x, center.y, 8, 0, 2 * Math.PI);
    ctx.stroke();

  }, [liveAircraft, mapCenter, zoom, selectedAircraft]);

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find closest aircraft
    let closestAircraft: ProcessedAircraft | null = null;
    let closestDistance = Infinity;

    liveAircraft.forEach(aircraft => {
      const aircraftX = ((aircraft.longitude + 180) / 360) * canvas.width;
      const aircraftY = ((90 - aircraft.latitude) / 180) * canvas.height;
      
      const distance = Math.sqrt((x - aircraftX) ** 2 + (y - aircraftY) ** 2);
      if (distance < 20 && distance < closestDistance) {
        closestDistance = distance;
        closestAircraft = aircraft;
      }
    });

    if (closestAircraft && onAircraftSelect) {
      onAircraftSelect(closestAircraft);
    }
  };

  // Handle zoom
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 10));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 1));
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await getAllAircraft();
      setLiveAircraft(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to refresh aircraft data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-terminal-card/50 border-terminal-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-foreground">
            <MapPin className="h-5 w-5 mr-2 text-accent" />
            Live Aircraft Map
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {liveAircraft.length} Aircraft
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Map Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMapCenter({ lat: 40.7128, lng: -74.0060 })}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            {lastUpdate && (
              <div className="text-sm text-muted-foreground">
                Last update: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Interactive Map Canvas */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full h-96 border border-terminal-border rounded-lg cursor-crosshair"
              onClick={handleCanvasClick}
              style={{ backgroundColor: '#1a1a1a' }}
            />
            
            {/* Map Legend */}
            <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm rounded p-2 text-xs">
              <div className="flex items-center space-x-4 text-white">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-400 rounded"></div>
                  <span>En Route</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-orange-400 rounded"></div>
                  <span>Selected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Aircraft Info */}
          {selectedAircraft && (
            <div className="p-4 bg-terminal-bg/50 rounded-lg border border-terminal-border">
              <h4 className="font-semibold text-foreground mb-2">Selected Aircraft</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Callsign</div>
                  <div className="font-semibold text-foreground">{selectedAircraft.callsign}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Altitude</div>
                  <div className="font-semibold text-foreground">{selectedAircraft.altitude.toLocaleString()} ft</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Speed</div>
                  <div className="font-semibold text-foreground">{selectedAircraft.speed} kts</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Heading</div>
                  <div className="font-semibold text-foreground flex items-center">
                    <Navigation 
                      className="h-4 w-4 mr-1" 
                      style={{ transform: `rotate(${selectedAircraft.heading}deg)` }}
                    />
                    {selectedAircraft.heading}°
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aircraft List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {liveAircraft.slice(0, 10).map((aircraft) => (
              <div
                key={aircraft.id}
                className={`p-2 rounded border cursor-pointer transition-colors ${
                  selectedAircraft?.id === aircraft.id
                    ? 'bg-accent/20 border-accent'
                    : 'bg-terminal-bg/30 border-terminal-border hover:bg-terminal-bg/50'
                }`}
                onClick={() => onAircraftSelect?.(aircraft)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Plane className="h-4 w-4 text-accent" />
                    <div>
                      <div className="font-semibold text-foreground">{aircraft.callsign}</div>
                      <div className="text-xs text-muted-foreground">{aircraft.aircraftType}</div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-foreground">{aircraft.altitude.toLocaleString()} ft</div>
                    <div className="text-muted-foreground">{aircraft.speed} kts</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}














