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
  Navigation, Wind, Thermometer, Droplets, Eye, EyeOff, Compass
} from "lucide-react";

export const PilotCockpit: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const [flightData, setFlightData] = useState({
    altitude: 41000,
    speed: 485,
    heading: 270,
    verticalSpeed: 1200,
    temperature: -56,
    windSpeed: 45,
    fuel: 78,
    autopilot: true,
    flaps: 0,
    gear: 'UP'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate live flight data updates
      setFlightData(prev => ({
        ...prev,
        altitude: prev.altitude + Math.floor(Math.random() * 100 - 50),
        speed: prev.speed + Math.floor(Math.random() * 10 - 5),
        heading: (prev.heading + Math.floor(Math.random() * 5 - 2) + 360) % 360,
        verticalSpeed: prev.verticalSpeed + Math.floor(Math.random() * 200 - 100),
        temperature: prev.temperature + Math.floor(Math.random() * 2 - 1),
        windSpeed: prev.windSpeed + Math.floor(Math.random() * 5 - 2),
        fuel: Math.max(0, prev.fuel - 0.05)
      }));
    }, 500);
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
      {/* Top Cockpit Bar */}
      <div className="bg-gray-900 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold">STRATUSCONNECT</span>
            </div>
            <div className="text-sm text-gray-400">COCKPIT</div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-gray-400">PILOT</div>
              <div className="text-lg font-mono font-bold text-orange-400">PIC-001</div>
            </div>
            <div className="text-2xl font-mono text-orange-400">
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
        {/* Left Column - Flight Controls & Status */}
        <div className="col-span-3 space-y-4">
          {/* Flight Controls */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono">FLIGHT CONTROLS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <span className="text-white text-sm font-mono">AUTOPILOT</span>
                  <div className={`w-3 h-3 rounded-full ${flightData.autopilot ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <span className="text-white text-sm font-mono">FLAPS</span>
                  <span className="text-orange-400 text-sm font-mono">{flightData.flaps}°</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                  <span className="text-white text-sm font-mono">GEAR</span>
                  <span className="text-orange-400 text-sm font-mono">{flightData.gear}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flight Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono">FLIGHT INFO</CardTitle>
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
                  <span className="text-white">Boeing 737</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400">IN FLIGHT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Passengers:</span>
                  <span className="text-white">156</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono">PERFORMANCE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-gray-700 p-2 rounded">
                  <div className="text-white font-mono text-lg">98.5%</div>
                  <div className="text-xs text-gray-400">On-Time</div>
                </div>
                <div className="bg-gray-700 p-2 rounded">
                  <div className="text-white font-mono text-lg">4.8</div>
                  <div className="text-xs text-gray-400">Rating</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">This Month</span>
                  <span className="text-orange-400">156.5 hrs</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Primary Flight Display */}
        <div className="col-span-6 space-y-4">
          {/* Primary Flight Display */}
          <Card className="bg-gray-800 border-gray-700 h-80">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono">PRIMARY FLIGHT DISPLAY</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <div className="relative h-full bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden">
                {/* Artificial Horizon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 border-2 border-gray-600 rounded-full relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-blue-500 rounded-full opacity-20"></div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-12 bg-white"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-white"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white rounded-full"></div>
                  </div>
                </div>
                
                {/* Flight data overlay */}
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="text-white font-mono text-lg">ALT: {flightData.altitude.toLocaleString()}</div>
                  <div className="text-white font-mono text-lg">SPD: {flightData.speed}</div>
                  <div className="text-white font-mono text-lg">HDG: {flightData.heading}°</div>
                  <div className="text-white font-mono text-lg">VS: {flightData.verticalSpeed}</div>
                </div>
                
                <div className="absolute top-4 right-4 space-y-2">
                  <div className="text-white font-mono text-lg">TEMP: {flightData.temperature}°C</div>
                  <div className="text-white font-mono text-lg">WIND: {flightData.windSpeed} kts</div>
                  <div className="text-white font-mono text-lg">FUEL: {flightData.fuel.toFixed(1)}%</div>
                  <div className="text-white font-mono text-lg">AP: {flightData.autopilot ? 'ON' : 'OFF'}</div>
                </div>

                {/* Compass */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-16 h-16 border-2 border-gray-600 rounded-full relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border border-white rounded-full"></div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-white"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-1 bg-white"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Display */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono">NAVIGATION</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-white font-mono text-sm">JFK</div>
                    <div className="text-gray-400 text-xs">Origin</div>
                  </div>
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-white font-mono text-sm">ORD</div>
                    <div className="text-gray-400 text-xs">Waypoint</div>
                  </div>
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-white font-mono text-sm">DEN</div>
                    <div className="text-gray-400 text-xs">Waypoint</div>
                  </div>
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-white font-mono text-sm">LAX</div>
                    <div className="text-gray-400 text-xs">Destination</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm font-mono">
                  <span className="text-gray-400">Current Position:</span>
                  <span className="text-white">41°N 87°W</span>
                </div>
                <div className="flex items-center justify-between text-sm font-mono">
                  <span className="text-gray-400">Next Waypoint:</span>
                  <span className="text-white">ORD - 45nm</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Systems & Alerts */}
        <div className="col-span-3 space-y-4">
          {/* Engine Status */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono">ENGINES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-mono">ENG 1</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-xs">NORMAL</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-mono">ENG 2</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-xs">NORMAL</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-mono">N1</span>
                <span className="text-white text-sm font-mono">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-mono">EGT</span>
                <span className="text-white text-sm font-mono">650°C</span>
              </div>
            </CardContent>
          </Card>

          {/* Flight Alerts */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-400 text-sm font-mono">ALERTS</CardTitle>
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
              <CardTitle className="text-orange-400 text-sm font-mono">WEATHER</CardTitle>
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
              <CardTitle className="text-orange-400 text-sm font-mono">ACTIONS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-mono">
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
