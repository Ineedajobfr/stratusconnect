import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, MapPin, Clock, Users, Navigation, AlertCircle, CheckCircle } from "lucide-react";

interface Aircraft {
  id: string;
  tail_number: string;
  model: string;
  status: 'available' | 'in_flight' | 'maintenance' | 'scheduled';
  location: {
    lat: number;
    lng: number;
    airport: string;
    city: string;
    country: string;
  };
  current_flight?: {
    origin: string;
    destination: string;
    departure_time: string;
    arrival_time: string;
    passengers: number;
  };
  crew: {
    captain: string;
    first_officer: string;
  };
  next_scheduled?: {
    route: string;
    time: string;
  };
}

interface AircraftTrackingMapProps {
  aircraft: Aircraft[];
  className?: string;
}

export const AircraftTrackingMap: React.FC<AircraftTrackingMapProps> = ({ 
  aircraft, 
  className = "" 
}) => {
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [mapView, setMapView] = useState<'world' | 'regional'>('world');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'in_flight':
        return 'bg-blue-500';
      case 'maintenance':
        return 'bg-red-500';
      case 'scheduled':
        return 'bg-yellow-500';
      default:
        return 'bg-terminal-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_flight':
        return <Plane className="h-4 w-4" />;
      case 'maintenance':
        return <AlertCircle className="h-4 w-4" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      default:
        return <Plane className="h-4 w-4" />;
    }
  };

  // Mock world map with aircraft positions
  const worldMapPositions = [
    { lat: 40.7128, lng: -74.0060, label: "New York" },
    { lat: 34.0522, lng: -118.2437, label: "Los Angeles" },
    { lat: 51.5074, lng: -0.1278, label: "London" },
    { lat: 48.8566, lng: 2.3522, label: "Paris" },
    { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
    { lat: -33.8688, lng: 151.2093, label: "Sydney" },
    { lat: 25.7617, lng: -80.1918, label: "Miami" },
    { lat: 41.8781, lng: -87.6298, label: "Chicago" },
  ];

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-white">
            <MapPin className="h-5 w-5 text-orange-400" />
            <span>AIRCRAFT TRACKING</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={mapView === 'world' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapView('world')}
              className={mapView === 'world' ? 'bg-orange-500' : 'border-gray-600 text-gray-300'}
            >
              World View
            </Button>
            <Button
              variant={mapView === 'regional' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapView('regional')}
              className={mapView === 'regional' ? 'bg-orange-500' : 'border-gray-600 text-gray-300'}
            >
              Regional View
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Visualization */}
          <div className="lg:col-span-2">
            <div className="relative bg-gray-900 rounded-lg h-80 overflow-hidden">
              {/* Mock World Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 800 400" className="w-full h-full">
                    {/* Simplified world map outline */}
                    <path
                      d="M100,200 Q200,150 300,180 Q400,200 500,190 Q600,180 700,200 Q750,220 700,250 Q600,280 500,270 Q400,260 300,270 Q200,280 100,250 Z"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="2"
                    />
                    {/* Continents */}
                    <circle cx="150" cy="180" r="30" fill="#4B5563" opacity="0.3" />
                    <circle cx="300" cy="160" r="25" fill="#4B5563" opacity="0.3" />
                    <circle cx="500" cy="170" r="35" fill="#4B5563" opacity="0.3" />
                    <circle cx="650" cy="190" r="20" fill="#4B5563" opacity="0.3" />
                  </svg>
                </div>
                
                {/* Aircraft Markers */}
                {aircraft.map((aircraft, index) => {
                  const position = worldMapPositions[index % worldMapPositions.length];
                  return (
                    <div
                      key={aircraft.id}
                      className="absolute cursor-pointer group"
                      style={{
                        left: `${(position.lng + 180) / 360 * 100}%`,
                        top: `${(90 - position.lat) / 180 * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => setSelectedAircraft(aircraft)}
                    >
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(aircraft.status)} flex items-center justify-center text-white text-xs font-bold group-hover:scale-125 transition-transform`}>
                        {aircraft.tail_number.slice(-2)}
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {aircraft.tail_number}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <Button size="sm" variant="outline" className="bg-gray-800 border-gray-600 text-white">
                  <Navigation className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-gray-800 border-gray-600 text-white">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Aircraft List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white mb-4">Fleet Status</h3>
            {aircraft.map((aircraft) => (
              <Card
                key={aircraft.id}
                className={`bg-gray-700 border-gray-600 cursor-pointer transition-colors ${
                  selectedAircraft?.id === aircraft.id ? 'ring-2 ring-orange-500' : 'hover:bg-gray-600'
                }`}
                onClick={() => setSelectedAircraft(aircraft)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(aircraft.status)}
                      <span className="font-semibold text-white">{aircraft.tail_number}</span>
                    </div>
                    <Badge className={`${getStatusColor(aircraft.status)} text-white text-xs`}>
                      {aircraft.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-300 space-y-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{aircraft.location.airport}, {aircraft.location.city}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Plane className="h-3 w-3" />
                      <span>{aircraft.model}</span>
                    </div>
                    {aircraft.current_flight && (
                      <div className="text-orange-400 text-xs">
                        En route: {aircraft.current_flight.origin} → {aircraft.current_flight.destination}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Aircraft Details */}
        {selectedAircraft && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {selectedAircraft.tail_number} - {selectedAircraft.model}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAircraft(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Current Status</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedAircraft.location.airport}, {selectedAircraft.location.city}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Capt: {selectedAircraft.crew.captain}</span>
                  </div>
                </div>
              </div>
              
              {selectedAircraft.current_flight && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Current Flight</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="text-orange-400 font-medium">
                      {selectedAircraft.current_flight.origin} → {selectedAircraft.current_flight.destination}
                    </div>
                    <div>Departure: {selectedAircraft.current_flight.departure_time}</div>
                    <div>Arrival: {selectedAircraft.current_flight.arrival_time}</div>
                    <div>Passengers: {selectedAircraft.current_flight.passengers}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
