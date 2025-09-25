import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plane, Clock, CheckCircle, AlertCircle, Bell, MapPin, Users, Calendar, 
  Shield, Award, FileText, DollarSign, Star, BarChart3, TrendingUp, 
  TrendingDown, Activity, Zap, Target, Globe, Database, Settings
} from "lucide-react";

// Interactive demo data generator hook
export const useInteractiveDemoData = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    currentTime,
    isLive,
    setIsLive
  };
};

// Real-time flight status component
export const RealTimeFlightStatus: React.FC = () => {
  const { currentTime, isLive } = useInteractiveDemoData();
  
  const flights = [
    {
      id: "FL-001",
      route: "JFK → LAX",
      status: "in_flight",
      progress: 65,
      eta: "2h 15m",
      altitude: "41,000 ft",
      speed: "Mach 0.85"
    },
    {
      id: "FL-002", 
      route: "MIA → LHR",
      status: "boarding",
      progress: 0,
      eta: "Departs in 30m",
      altitude: "Ground",
      speed: "0 kts"
    },
    {
      id: "FL-003",
      route: "LAX → JFK",
      status: "scheduled",
      progress: 0,
      eta: "Departs in 4h",
      altitude: "Ground",
      speed: "0 kts"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_flight': return 'bg-blue-500';
      case 'boarding': return 'bg-yellow-500';
      case 'scheduled': return 'bg-terminal-muted';
      default: return 'bg-terminal-muted';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-white">
            <Activity className="h-5 w-5 text-orange-400" />
            <span>REAL-TIME FLIGHT STATUS</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-terminal-muted'}`}></div>
            <span className="text-sm text-gray-400">{isLive ? 'LIVE' : 'OFFLINE'}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {flights.map((flight) => (
          <Card key={flight.id} className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(flight.status)}`}></div>
                  <h3 className="font-semibold text-white">{flight.route}</h3>
                  <Badge className={`${getStatusColor(flight.status)} text-white text-xs`}>
                    {flight.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="text-sm text-orange-400 font-medium">{flight.eta}</div>
              </div>
              
              {flight.status === 'in_flight' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <span>Progress</span>
                    <span>{flight.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${flight.progress}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>Altitude: <span className="text-orange-400">{flight.altitude}</span></div>
                    <div>Speed: <span className="text-orange-400">{flight.speed}</span></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

// Interactive analytics dashboard
export const InteractiveAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const analyticsData = {
    revenue: {
      '7d': { value: 125000, change: 12.5, trend: 'up' },
      '30d': { value: 485000, change: 8.2, trend: 'up' },
      '90d': { value: 1420000, change: -2.1, trend: 'down' }
    },
    flights: {
      '7d': { value: 23, change: 15.3, trend: 'up' },
      '30d': { value: 89, change: 5.7, trend: 'up' },
      '90d': { value: 267, change: -1.2, trend: 'down' }
    },
    utilization: {
      '7d': { value: 78.5, change: 3.2, trend: 'up' },
      '30d': { value: 82.1, change: 1.8, trend: 'up' },
      '90d': { value: 79.3, change: -0.5, trend: 'down' }
    }
  };

  const currentData = analyticsData[selectedMetric as 'revenue' | 'flights' | 'utilization'][selectedPeriod as '7d' | '30d' | '90d'];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-white">
            <BarChart3 className="h-5 w-5 text-orange-400" />
            <span>INTERACTIVE ANALYTICS</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={selectedPeriod === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('7d')}
              className={selectedPeriod === '7d' ? 'bg-orange-500' : 'border-gray-600 text-gray-300'}
            >
              7D
            </Button>
            <Button
              variant={selectedPeriod === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('30d')}
              className={selectedPeriod === '30d' ? 'bg-orange-500' : 'border-gray-600 text-gray-300'}
            >
              30D
            </Button>
            <Button
              variant={selectedPeriod === '90d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('90d')}
              className={selectedPeriod === '90d' ? 'bg-orange-500' : 'border-gray-600 text-gray-300'}
            >
              90D
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Button
            variant={selectedMetric === 'revenue' ? 'default' : 'outline'}
            onClick={() => setSelectedMetric('revenue')}
            className={selectedMetric === 'revenue' ? 'bg-orange-500' : 'border-gray-600 text-gray-300'}
          >
            Revenue
          </Button>
          <Button
            variant={selectedMetric === 'flights' ? 'default' : 'outline'}
            onClick={() => setSelectedMetric('flights')}
            className={selectedMetric === 'flights' ? 'bg-orange-500' : 'border-gray-600 text-gray-300'}
          >
            Flights
          </Button>
          <Button
            variant={selectedMetric === 'utilization' ? 'default' : 'outline'}
            onClick={() => setSelectedMetric('utilization')}
            className={selectedMetric === 'utilization' ? 'bg-orange-500' : 'border-gray-600 text-gray-300'}
          >
            Utilization
          </Button>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {selectedMetric === 'revenue' ? `$${currentData.value.toLocaleString()}` : 
             selectedMetric === 'flights' ? currentData.value : 
             `${currentData.value}%`}
          </div>
          <div className="flex items-center justify-center space-x-2">
            {currentData.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-white" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
            <span className={`text-sm ${currentData.trend === 'up' ? 'text-white' : 'text-red-400'}`}>
              {currentData.change}% vs previous period
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Interactive notifications center
export const InteractiveNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: "notif-001",
      type: "urgent",
      title: "Weather Alert",
      message: "Severe weather conditions detected in Miami area",
      time: "2 minutes ago",
      read: false
    },
    {
      id: "notif-002",
      type: "info",
      title: "Flight Update",
      message: "Flight JFK→LAX delayed by 45 minutes",
      time: "15 minutes ago",
      read: false
    },
    {
      id: "notif-003",
      type: "success",
      title: "Booking Confirmed",
      message: "New booking confirmed for Miami→London route",
      time: "1 hour ago",
      read: true
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      case 'success': return 'bg-green-500';
      default: return 'bg-terminal-muted';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Bell className="h-5 w-5 text-orange-400" />
          <span>INTERACTIVE NOTIFICATIONS</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`bg-gray-700 border-gray-600 cursor-pointer transition-colors ${
              !notification.read ? 'ring-2 ring-orange-500' : ''
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full ${getTypeColor(notification.type)} mt-2`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white text-sm">{notification.title}</h3>
                    <span className="text-xs text-gray-400">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-300">{notification.message}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

// Interactive system status
export const InteractiveSystemStatus: React.FC = () => {
  const [systems, setSystems] = useState([
    { name: "Flight Tracking", status: "operational", uptime: "99.9%" },
    { name: "Booking System", status: "operational", uptime: "99.8%" },
    { name: "Payment Gateway", status: "operational", uptime: "99.7%" },
    { name: "Weather API", status: "degraded", uptime: "95.2%" },
    { name: "Database", status: "operational", uptime: "99.9%" }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-white';
      case 'degraded': return 'text-yellow-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Zap className="h-5 w-5 text-orange-400" />
          <span>SYSTEM STATUS</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {systems.map((system, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                system.status === 'operational' ? 'bg-green-500' :
                system.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-white font-medium">{system.name}</span>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${getStatusColor(system.status)}`}>
                {system.status.toUpperCase()}
              </div>
              <div className="text-xs text-gray-400">{system.uptime} uptime</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
