import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Plane, Clock, CheckCircle, AlertCircle, Users, BarChart3, Settings, Bell, FileText, Shield, Award, DollarSign } from "lucide-react";
import { DemoBanner } from "../DemoBanner";
import { FleetCard } from "../ui/fleet-card";
import { CrewCard } from "../ui/crew-card";
import { AnalyticsChart } from "../analytics/AnalyticsChart";
import { NotificationCenter } from "../ui/notification-center";
import { MessageCenter } from "../messaging/MessageCenter";
import { UnifiedTerminalLayout, TerminalIcons } from "./UnifiedTerminalLayout";
import { ProfessionalDataCard, ProfessionalFlightCard } from "./ProfessionalDataCard";

// Demo data
const demoRequests = [
  {
    id: "req-001",
    origin: "New York (JFK)",
    destination: "Los Angeles (LAX)",
    departure_date: "2024-01-15T10:00:00Z",
    passenger_count: 4,
    status: "open",
    created_at: "2024-01-10T09:00:00Z",
    companies: { name: "Elite Charter Co." }
  },
  {
    id: "req-002",
    origin: "Miami (MIA)",
    destination: "London (LHR)",
    departure_date: "2024-01-20T08:00:00Z",
    passenger_count: 6,
    status: "open",
    created_at: "2024-01-08T11:00:00Z",
    companies: { name: "Premier Jets" }
  }
];

const demoQuotes = [
  {
    id: "quote-001",
    request_id: "req-001",
    price: 45000,
    currency: "USD",
    status: "pending",
    created_at: "2024-01-10T14:30:00Z",
    requests: {
      origin: "New York (JFK)",
      destination: "Los Angeles (LAX)"
    },
    aircraft: { model: "Gulfstream G550", tail_number: "N425SC" }
  },
  {
    id: "quote-002",
    request_id: "req-002",
    price: 85000,
    currency: "USD",
    status: "accepted",
    created_at: "2024-01-08T15:20:00Z",
    requests: {
      origin: "Miami (MIA)",
      destination: "London (LHR)"
    },
    aircraft: { model: "Falcon 7X", tail_number: "N156JT" }
  }
];

const demoBookings = [
  {
    id: "book-001",
    total_price: 85000,
    currency: "USD",
    status: "upcoming",
    created_at: "2024-01-08T15:30:00Z",
    requests: {
      origin: "Miami (MIA)",
      destination: "London (LHR)"
    },
    quotes: {
      price: 85000,
      currency: "USD"
    }
  }
];

const demoAircraft = [
  {
    id: "aircraft-001",
    tail_number: "N425SC",
    model: "Gulfstream G550",
    category: "heavy_jet",
    seats: 12,
    status: "available",
    photo_url: "/placeholder-aircraft.jpg",
    range_nm: 6750,
    year: 2018
  },
  {
    id: "aircraft-002",
    tail_number: "N892AV",
    model: "Citation X+",
    category: "midsize_jet",
    seats: 8,
    status: "in_use",
    photo_url: "/placeholder-aircraft.jpg",
    range_nm: 3500,
    year: 2020
  },
  {
    id: "aircraft-003",
    tail_number: "N156JT",
    model: "Falcon 7X",
    category: "heavy_jet",
    seats: 14,
    status: "maintenance",
    photo_url: "/placeholder-aircraft.jpg",
    range_nm: 5950,
    year: 2019
  }
];

const demoCrew = [
  {
    id: "crew-001",
    full_name: "Captain Sarah Johnson",
    role: "pilot",
    avatar_url: "/placeholder-avatar.jpg",
    crew_profiles: {
      licence_expiry: "2025-06-15",
      availability_status: "available"
    }
  },
  {
    id: "crew-002",
    full_name: "First Officer Mike Chen",
    role: "pilot",
    avatar_url: "/placeholder-avatar.jpg",
    crew_profiles: {
      licence_expiry: "2024-12-20",
      availability_status: "busy"
    }
  },
  {
    id: "crew-003",
    full_name: "Flight Attendant Emma Davis",
    role: "crew",
    avatar_url: "/placeholder-avatar.jpg",
    crew_profiles: {
      licence_expiry: "2025-03-10",
      availability_status: "available"
    }
  }
];

const demoStats = {
  totalRequests: 8,
  myQuotes: 12,
  acceptedQuotes: 5,
  activeBookings: 3,
  fleetSize: 3,
  crewSize: 8,
  winRate: 41.7,
  totalRevenue: 425000
};

const demoNotifications = [
  {
    id: "notif-001",
    type: "new_request",
    message: "New charter request: NYC→LAX on Jan 15",
    read: false,
    created_at: "2024-01-10T09:00:00Z"
  },
  {
    id: "notif-002",
    type: "quote_accepted",
    message: "Your quote was accepted for Miami→London",
    read: false,
    created_at: "2024-01-08T15:30:00Z"
  }
];

export const DemoOperatorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Operator Dashboard", icon: <TerminalIcons.Analytics />, active: true },
    { id: "requests", label: "Open Requests", icon: <TerminalIcons.Requests />, badge: 8 },
    { id: "quotes", label: "My Quotes", icon: <TerminalIcons.Analytics />, badge: 12 },
    { id: "bookings", label: "Active Bookings", icon: <TerminalIcons.Bookings />, badge: 3 },
    { id: "fleet", label: "Fleet Management", icon: <TerminalIcons.Fleet /> },
    { id: "crew", label: "Crew Management", icon: <TerminalIcons.Crew /> },
    { id: "analytics", label: "Analytics", icon: <TerminalIcons.Analytics /> },
    { id: "billing", label: "Billing & Revenue", icon: <TerminalIcons.Earnings /> },
    { id: "reports", label: "Reports", icon: <TerminalIcons.FileText /> },
    { id: "settings", label: "Settings", icon: <TerminalIcons.Settings /> }
  ];

  const user = {
    name: "David Rodriguez",
    role: "Fleet Operations Manager",
    status: "available" as const
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-500';
      case 'accepted':
        return 'bg-green-500';
      case 'pending':
        return 'bg-blue-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <DemoBanner />
      
      <UnifiedTerminalLayout
        title="Operator Terminal"
        subtitle="Fleet Operations & Charter Management"
        user={user}
        sidebarItems={sidebarItems}
        onNavigate={(direction) => console.log(`Navigate ${direction}`)}
        onLogout={() => console.log('Logout')}
        onNotificationClick={() => console.log('Notifications')}
        onMessageClick={() => console.log('Messages')}
      >
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ProfessionalDataCard
              title="Open Requests"
              value={demoStats.totalRequests}
              icon={Plane}
              badge={{ text: "New", variant: "destructive" }}
            />
            <ProfessionalDataCard
              title="My Quotes"
              value={demoStats.myQuotes}
              icon={Clock}
              trend={{ value: 18, isPositive: true }}
            />
            <ProfessionalDataCard
              title="Win Rate"
              value={`${demoStats.winRate.toFixed(1)}%`}
              icon={BarChart3}
              trend={{ value: 5, isPositive: true }}
            />
            <ProfessionalDataCard
              title="Total Revenue"
              value={`$${demoStats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              trend={{ value: 22, isPositive: true }}
            />
          </div>

          {/* Fleet Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fleet Status */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Plane className="h-5 w-5 text-orange-400" />
                  <span>FLEET STATUS</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoAircraft.map((aircraft) => (
                  <Card key={aircraft.id} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {aircraft.tail_number.slice(-2)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{aircraft.model}</h3>
                            <p className="text-sm text-gray-400">{aircraft.tail_number}</p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(aircraft.status)} text-white`}>
                          {aircraft.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
                        <div>
                          <span className="text-gray-400">Seats:</span>
                          <span className="ml-1 text-orange-400">{aircraft.seats}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Range:</span>
                          <span className="ml-1 text-orange-400">{aircraft.range_nm}nm</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Year:</span>
                          <span className="ml-1 text-orange-400">{aircraft.year}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Clock className="h-5 w-5 text-orange-400" />
                  <span>RECENT ACTIVITY</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoRequests.map((request) => (
                  <Card key={request.id} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <h3 className="font-semibold text-white">{request.origin} → {request.destination}</h3>
                        </div>
                        <Badge className={`${getStatusColor(request.status)} text-white`}>
                          {request.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex items-center justify-between">
                          <span>{new Date(request.departure_date).toLocaleDateString()}</span>
                          <span className="text-orange-400">{request.passenger_count} PAX</span>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-600">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Broker: {request.companies?.name}</span>
                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                              Submit Quote
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Plus className="h-5 w-5 text-orange-400" />
                <span>QUICK ACTIONS</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white h-12">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Aircraft
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 h-12">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Crew
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 h-12">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 h-12">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </UnifiedTerminalLayout>
    </div>
  );
};
