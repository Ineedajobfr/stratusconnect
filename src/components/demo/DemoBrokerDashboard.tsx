import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Plane, Clock, CheckCircle, AlertCircle, Bell, DollarSign, Users, BarChart3, FileText, Settings, Shield, Award } from "lucide-react";
import { DemoBanner } from "../DemoBanner";
import { QuoteCard } from "../ui/quote-card";
import { BookingTimeline } from "../ui/booking-timeline";
import { NotificationCenter } from "../ui/notification-center";
import { MessageCenter } from "../messaging/MessageCenter";
import { UnifiedTerminalLayout, TerminalIcons } from "./UnifiedTerminalLayout";
import { ProfessionalDataCard, ProfessionalFlightCard } from "./ProfessionalDataCard";
import { PilotTrackingMap } from "./PilotTrackingMap";

// Demo data
const demoRequests = [
  {
    id: "req-001",
    origin: "New York (JFK)",
    destination: "Los Angeles (LAX)",
    departure_date: "2024-01-15T10:00:00Z",
    return_date: "2024-01-18T18:00:00Z",
    passenger_count: 4,
    status: "open",
    created_at: "2024-01-10T09:00:00Z",
    quotes: [
      {
        id: "quote-001",
        price: 45000,
        currency: "USD",
        status: "pending",
        created_at: "2024-01-10T14:30:00Z",
        companies: { name: "Elite Aviation" },
        aircraft: { model: "Gulfstream G550", tail_number: "N425SC" }
      },
      {
        id: "quote-002",
        price: 52000,
        currency: "USD",
        status: "pending",
        created_at: "2024-01-10T16:45:00Z",
        companies: { name: "Premier Jets" },
        aircraft: { model: "Citation X+", tail_number: "N892AV" }
      }
    ]
  },
  {
    id: "req-002",
    origin: "Miami (MIA)",
    destination: "London (LHR)",
    departure_date: "2024-01-20T08:00:00Z",
    passenger_count: 6,
    status: "accepted",
    created_at: "2024-01-08T11:00:00Z",
    quotes: [
      {
        id: "quote-003",
        price: 85000,
        currency: "USD",
        status: "accepted",
        created_at: "2024-01-08T15:20:00Z",
        companies: { name: "Global Aviation" },
        aircraft: { model: "Falcon 7X", tail_number: "N156JT" }
      }
    ]
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
      destination: "London (LHR)",
      departure_date: "2024-01-20T08:00:00Z"
    },
    quotes: {
      price: 85000,
      currency: "USD"
    },
    flights: [
      {
        id: "flight-001",
        departure_airport: "MIA",
        arrival_airport: "LHR",
        departure_datetime: "2024-01-20T08:00:00Z",
        arrival_datetime: "2024-01-20T18:30:00Z",
        status: "scheduled"
      }
    ]
  }
];

const demoStats = {
  totalRequests: 12,
  activeRequests: 3,
  totalBookings: 8,
  totalSpent: 425000
};

const demoNotifications = [
  {
    id: "notif-001",
    type: "quote_submitted",
    message: "New quote received: $45,000 for NYC→LAX",
    read: false,
    created_at: "2024-01-10T14:30:00Z"
  },
  {
    id: "notif-002",
    type: "booking_created",
    message: "Booking confirmed for Miami→London",
    read: false,
    created_at: "2024-01-08T15:30:00Z"
  }
];

// Pilot tracking data for the map
const demoPilotTracking = [
  {
    id: "pilot-001",
    name: "Captain Sarah Johnson",
    role: "captain",
    status: "available",
    location: {
      lat: 40.7128,
      lng: -74.0060,
      airport: "KJFK",
      city: "New York",
      country: "USA"
    },
    ratings: ["Gulfstream G550", "Falcon 7X", "Citation X+"],
    hours_flown: 8500,
    rating: 4.9,
    next_available: "Available now"
  },
  {
    id: "pilot-002",
    name: "Captain Mike Chen",
    role: "captain",
    status: "in_flight",
    location: {
      lat: 34.0522,
      lng: -118.2437,
      airport: "KLAX",
      city: "Los Angeles",
      country: "USA"
    },
    current_assignment: {
      flight_id: "FL-001",
      route: "KLAX → KJFK",
      aircraft: "Gulfstream G550",
      departure_time: "14:30 UTC",
      arrival_time: "22:45 UTC"
    },
    ratings: ["Boeing 737", "Airbus A320", "Gulfstream G550"],
    hours_flown: 12000,
    rating: 4.8,
    next_available: "Tomorrow 08:00"
  },
  {
    id: "pilot-003",
    name: "First Officer Emma Davis",
    role: "first_officer",
    status: "on_duty",
    location: {
      lat: 25.7617,
      lng: -80.1918,
      airport: "KMIA",
      city: "Miami",
      country: "USA"
    },
    ratings: ["Falcon 7X", "Citation X+", "Challenger 350"],
    hours_flown: 3200,
    rating: 4.7,
    next_available: "Today 18:00"
  },
  {
    id: "pilot-004",
    name: "Captain James Mitchell",
    role: "captain",
    status: "available",
    location: {
      lat: 51.5074,
      lng: -0.1278,
      airport: "EGLL",
      city: "London",
      country: "UK"
    },
    ratings: ["Boeing 777", "Airbus A350", "Gulfstream G650"],
    hours_flown: 15000,
    rating: 4.9,
    next_available: "Available now"
  },
  {
    id: "pilot-005",
    name: "Captain Lisa Wang",
    role: "captain",
    status: "in_flight",
    location: {
      lat: 35.6762,
      lng: 139.6503,
      airport: "RJTT",
      city: "Tokyo",
      country: "Japan"
    },
    current_assignment: {
      flight_id: "FL-002",
      route: "RJTT → KLAX",
      aircraft: "Boeing 777",
      departure_time: "16:00 UTC",
      arrival_time: "08:30 UTC"
    },
    ratings: ["Boeing 777", "Boeing 787", "Airbus A350"],
    hours_flown: 11000,
    rating: 4.8,
    next_available: "Jan 15 10:00"
  }
];

export const DemoBrokerDashboard: React.FC = () => {
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);

  const sidebarItems = [
    { id: "dashboard", label: "Broker Dashboard", icon: <TerminalIcons.Analytics />, active: true },
    { id: "requests", label: "My Requests", icon: <TerminalIcons.Requests />, badge: 3 },
    { id: "bookings", label: "Active Bookings", icon: <TerminalIcons.Bookings />, badge: 2 },
    { id: "quotes", label: "Quote Management", icon: <TerminalIcons.Analytics /> },
    { id: "clients", label: "Client Management", icon: <TerminalIcons.Network /> },
    { id: "analytics", label: "Analytics", icon: <TerminalIcons.Analytics /> },
    { id: "billing", label: "Billing & Payments", icon: <TerminalIcons.Earnings /> },
    { id: "reports", label: "Reports", icon: <TerminalIcons.FileText /> },
    { id: "settings", label: "Settings", icon: <TerminalIcons.Settings /> },
    { id: "support", label: "Support", icon: <TerminalIcons.Trust /> }
  ];

  const user = {
    name: "Michael Chen",
    role: "Senior Charter Broker",
    status: "available" as const
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-500';
      case 'accepted':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <DemoBanner />
      
      <UnifiedTerminalLayout
        title="Broker Terminal"
        subtitle="Charter Request Management & Client Relations"
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
              title="Total Requests"
              value={demoStats.totalRequests}
              icon={Plane}
              trend={{ value: 15, isPositive: true }}
            />
            <ProfessionalDataCard
              title="Active Requests"
              value={demoStats.activeRequests}
              icon={Clock}
              badge={{ text: "Urgent", variant: "destructive" }}
            />
            <ProfessionalDataCard
              title="Total Bookings"
              value={demoStats.totalBookings}
              icon={CheckCircle}
              trend={{ value: 8, isPositive: true }}
            />
            <ProfessionalDataCard
              title="Total Spent"
              value={`$${demoStats.totalSpent.toLocaleString()}`}
              icon={DollarSign}
              trend={{ value: 12, isPositive: true }}
            />
          </div>

          {/* Pilot Tracking Map */}
          <PilotTrackingMap pilots={demoPilotTracking} />

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Requests */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Clock className="h-5 w-5 text-orange-400" />
                  <span>ACTIVE REQUESTS</span>
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
                        
                        {request.quotes && request.quotes.length > 0 && (
                          <div className="pt-2 border-t border-gray-600">
                            <div className="flex items-center justify-between">
                              <span className="text-green-400">{request.quotes.length} Quotes</span>
                              <span className="text-orange-400">${request.quotes[0].price.toLocaleString()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <CheckCircle className="h-5 w-5 text-orange-400" />
                  <span>RECENT BOOKINGS</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoBookings.map((booking) => (
                  <Card key={booking.id} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <h3 className="font-semibold text-white">{booking.requests.origin} → {booking.requests.destination}</h3>
                        </div>
                        <Badge className="bg-green-500 text-white">
                          {booking.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex items-center justify-between">
                          <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                          <span className="text-green-400 font-medium">${booking.total_price.toLocaleString()}</span>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-600">
                          <div className="flex items-center justify-between">
                            <span className="text-orange-400">Status: Confirmed</span>
                            <span className="text-gray-400">USD</span>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-white h-12"
                  onClick={() => setShowNewRequestForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Charter Request
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 h-12">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 h-12">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Clients
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </UnifiedTerminalLayout>
    </div>
  );
};
