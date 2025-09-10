import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MapPin, Clock, Plane, Award, Star, Navigation, Users } from "lucide-react";

interface Pilot {
  id: string;
  name: string;
  role: 'captain' | 'first_officer' | 'instructor';
  status: 'available' | 'in_flight' | 'on_duty' | 'off_duty';
  location: {
    lat: number;
    lng: number;
    airport: string;
    city: string;
    country: string;
  };
  current_assignment?: {
    flight_id: string;
    route: string;
    aircraft: string;
    departure_time: string;
    arrival_time: string;
  };
  ratings: string[];
  hours_flown: number;
  rating: number;
  next_available?: string;
}

interface PilotTrackingMapProps {
  pilots: Pilot[];
  className?: string;
}

export const PilotTrackingMap: React.FC<PilotTrackingMapProps> = ({ 
  pilots, 
  className = "" 
}) => {
  const [selectedPilot, setSelectedPilot] = useState<Pilot | null>(null);
  const [mapView, setMapView] = useState<'world' | 'regional'>('world');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'in_flight' | 'on_duty'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'in_flight':
        return 'bg-blue-500';
      case 'on_duty':
        return 'bg-yellow-500';
      case 'off_duty':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <User className="h-4 w-4" />;
      case 'in_flight':
        return <Plane className="h-4 w-4" />;
      case 'on_duty':
        return <Clock className="h-4 w-4" />;
      case 'off_duty':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const filteredPilots = pilots.filter(pilot => 
    filterStatus === 'all' || pilot.status === filterStatus
  );

  // Mock world map with pilot positions
  const worldMapPositions = [
    { lat: 40.7128, lng: -74.0060, label: "New York" },
    { lat: 34.0522, lng: -118.2437, label: "Los Angeles" },
    { lat: 51.5074, lng: -0.1278, label: "London" },
    { lat: 48.8566, lng: 2.3522, label: "Paris" },
    { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
    { lat: -33.8688, lng: 151.2093, label: "Sydney" },
    { lat: 25.7617, lng: -80.1918, label: "Miami" },
    { lat: 41.8781, lng: -87.6298, label: "Chicago" },
    { lat: 29.7604, lng: -95.3698, label: "Houston" },
    { lat: 33.4484, lng: -112.0740, label: "Phoenix" },
  ];

  return (
    <Card className={`bg-gray-800 border-gray-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-white">
            <Users className="h-5 w-5 text-orange-400" />
            <span>PILOT TRACKING</span>
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
                
                {/* Pilot Markers */}
                {filteredPilots.map((pilot, index) => {
                  const position = worldMapPositions[index % worldMapPositions.length];
                  return (
                    <div
                      key={pilot.id}
                      className="absolute cursor-pointer group"
                      style={{
                        left: `${(position.lng + 180) / 360 * 100}%`,
                        top: `${(90 - position.lat) / 180 * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => setSelectedPilot(pilot)}
                    >
                      <div className={`w-6 h-6 rounded-full ${getStatusColor(pilot.status)} flex items-center justify-center text-white text-xs font-bold group-hover:scale-125 transition-transform`}>
                        {pilot.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {pilot.name}
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

          {/* Pilot List and Filters */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Pilot Status</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {['all', 'available', 'in_flight', 'on_duty'].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(status as any)}
                    className={filterStatus === status ? 'bg-orange-500' : 'border-gray-600 text-gray-300'}
                  >
                    {status.replace('_', ' ')}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {filteredPilots.map((pilot) => (
                <Card
                  key={pilot.id}
                  className={`bg-gray-700 border-gray-600 cursor-pointer transition-colors ${
                    selectedPilot?.id === pilot.id ? 'ring-2 ring-orange-500' : 'hover:bg-gray-600'
                  }`}
                  onClick={() => setSelectedPilot(pilot)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(pilot.status)}
                        <span className="font-semibold text-white text-sm">{pilot.name}</span>
                      </div>
                      <Badge className={`${getStatusColor(pilot.status)} text-white text-xs`}>
                        {pilot.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-gray-300 space-y-1">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{pilot.location.airport}, {pilot.location.city}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="h-3 w-3" />
                        <span>{pilot.role.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>{pilot.rating}/5.0</span>
                      </div>
                      {pilot.current_assignment && (
                        <div className="text-orange-400 text-xs">
                          {pilot.current_assignment.route}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Pilot Details */}
        {selectedPilot && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {selectedPilot.name} - {selectedPilot.role.replace('_', ' ')}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPilot(null)}
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
                    <span>{selectedPilot.location.airport}, {selectedPilot.location.city}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4" />
                    <span>{selectedPilot.hours_flown.toLocaleString()} flight hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4" />
                    <span>Rating: {selectedPilot.rating}/5.0</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Aircraft Ratings</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedPilot.ratings.map((rating, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-orange-500 text-orange-400">
                      {rating}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {selectedPilot.current_assignment && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Current Assignment</h4>
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <div className="text-orange-400 font-medium mb-2">
                      {selectedPilot.current_assignment.route}
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div>Aircraft: {selectedPilot.current_assignment.aircraft}</div>
                      <div>Departure: {selectedPilot.current_assignment.departure_time}</div>
                      <div>Arrival: {selectedPilot.current_assignment.arrival_time}</div>
                    </div>
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
