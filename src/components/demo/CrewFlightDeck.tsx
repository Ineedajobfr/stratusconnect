import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plane, Clock, CheckCircle, AlertCircle, Bell, MapPin, Users, Calendar, 
  Shield, Award, FileText, DollarSign, Star, BarChart3, TrendingUp, 
  TrendingDown, Activity, Zap, Target, Globe, Database, Settings,
  Play, Pause, Volume2, MoreHorizontal, ArrowRight, Triangle, Gauge,
  Navigation, Wind, Thermometer, Droplets, Eye, EyeOff
} from "lucide-react";

export const CrewFlightDeck: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const [flightData, setFlightData] = useState({
    altitude: 41000,
    speed: 485,
    heading: 270,
    temperature: -56,
    windSpeed: 45,
    fuel: 78
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate live flight data updates
      setFlightData(prev => ({
        ...prev,
        altitude: prev.altitude + Math.floor(Math.random() * 200 - 100),
        speed: prev.speed + Math.floor(Math.random() * 20 - 10),
        heading: (prev.heading + Math.floor(Math.random() * 10 - 5) + 360) % 360,
        temperature: prev.temperature + Math.floor(Math.random() * 4 - 2),
        windSpeed: prev.windSpeed + Math.floor(Math.random() * 10 - 5),
        fuel: Math.max(0, prev.fuel - 0.1)
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Flight Deck Bar */}
      <div className="bg-gray-900 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold">STRATUSCONNECT</span>
            </div>
            <div className="text-sm text-gray-400">FLIGHT DECK</div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-gray-400">CREW</div>
              <div className="text-lg font-mono font-bold text-blue-400">CAPT-001</div>
            </div>
            <div className="text-2xl font-mono text-blue-400">
              {formatTime(currentTime)}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-400">{isLive ? 'LIVE' : 'OFFLINE'}</span>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Play className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 p-6 h-screen">
        {/* Left Column - Flight Info & Crew */}
        <div className="col-span-3 space-y-4">
          {/* Flight Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-sm font-mono">FLIGHT INFO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-mono font-bold text-white">FL-001</div>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Route:</span>
                  <span className="text-white">JFK → LAX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Aircraft:</span>
                  <span className="text-white">G550</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400">IN FLIGHT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Passengers:</span>
                  <span className="text-white">8</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crew Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-sm font-mono">CREW</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <div>
                    <div className="text-white font-mono text-sm">CAPT Sarah Johnson</div>
                    <div className="text-gray-400 text-xs">PIC • 8,500 hrs</div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <div>
                    <div className="text-white font-mono text-sm">FO Mike Chen</div>
                    <div className="text-gray-400 text-xs">SIC • 3,200 hrs</div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <div>
                    <div className="text-white font-mono text-sm">FA Emma Davis</div>
                    <div className="text-gray-400 text-xs">Cabin • 1,500 hrs</div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flight Progress */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-sm font-mono">PROGRESS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-mono text-white">65%</div>
                <div className="text-sm text-gray-400">Complete</div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '65%'}}></div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-white font-mono">2h 15m</div>
                  <div className="text-gray-400">ETA</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-mono">1,200nm</div>
                  <div className="text-gray-400">Remaining</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Flight Instruments */}
        <div className="col-span-6 space-y-4">
          {/* Primary Flight Display */}
          <Card className="bg-gray-800 border-gray-700 h-64">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-sm font-mono">PRIMARY FLIGHT DISPLAY</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <div className="relative h-full bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden">
                {/* Artificial Horizon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-2 border-gray-600 rounded-full relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-blue-500 rounded-full opacity-20"></div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-white"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-white"></div>
                  </div>
                </div>
                
                {/* Flight data overlay */}
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="text-white font-mono text-sm">ALT: {flightData.altitude.toLocaleString()}</div>
                  <div className="text-white font-mono text-sm">SPD: {flightData.speed}</div>
                  <div className="text-white font-mono text-sm">HDG: {flightData.heading}°</div>
                </div>
                
                <div className="absolute top-4 right-4 space-y-2">
                  <div className="text-white font-mono text-sm">TEMP: {flightData.temperature}°C</div>
                  <div className="text-white font-mono text-sm">WIND: {flightData.windSpeed} kts</div>
                  <div className="text-white font-mono text-sm">FUEL: {flightData.fuel.toFixed(1)}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Display */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-sm font-mono">NAVIGATION</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="text-white font-mono text-lg">JFK</div>
                    <div className="text-gray-400 text-xs">Origin</div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="text-white font-mono text-lg">LAX</div>
                    <div className="text-gray-400 text-xs">Destination</div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded">
                    <div className="text-white font-mono text-lg">ORD</div>
                    <div className="text-gray-400 text-xs">Next Waypoint</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm font-mono">
                  <span className="text-gray-400">Current Position:</span>
                  <span className="text-white">41°N 87°W</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Systems & Alerts */}
        <div className="col-span-3 space-y-4">
          {/* System Status */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-sm font-mono">SYSTEMS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-mono">Engines</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-xs">NORMAL</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-mono">APU</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-xs">ON</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-mono">Hydraulics</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-xs">NORMAL</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-mono">Electrical</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-xs">NORMAL</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flight Alerts */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-sm font-mono">ALERTS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded">
                <Triangle className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-400 text-xs font-mono">TURBULENCE AHEAD</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded">
                <Bell className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 text-xs font-mono">ATC CONTACT</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-green-900/20 border border-green-500/30 rounded">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-xs font-mono">AUTO PILOT ON</span>
              </div>
            </CardContent>
          </Card>

          {/* Weather Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-sm font-mono">WEATHER</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-mono">Current</span>
                <span className="text-white text-sm font-mono">Clear</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-mono">Visibility</span>
                <span className="text-white text-sm font-mono">10+ SM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-mono">Wind</span>
                <span className="text-white text-sm font-mono">270/45</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-mono">Temp</span>
                <span className="text-white text-sm font-mono">-56°C</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-400 text-sm font-mono">ACTIONS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-mono">
                CONTACT ATC
              </Button>
              <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white text-xs font-mono">
                WEATHER UPDATE
              </Button>
              <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white text-xs font-mono">
                FLIGHT LOG
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
