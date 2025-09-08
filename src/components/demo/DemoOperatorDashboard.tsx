import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Plane, Clock, CheckCircle, AlertCircle, Users, BarChart3, Settings, Bell } from "lucide-react";
import { DemoBanner } from "./DemoBanner";
import { FleetCard } from "../ui/fleet-card";
import { CrewCard } from "../ui/crew-card";
import { AnalyticsChart } from "../analytics/AnalyticsChart";
import { NotificationCenter } from "../ui/notification-center";
import { MessageCenter } from "../messaging/MessageCenter";

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
  const [activeTab, setActiveTab] = useState("requests");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'rejected':
        return <Clock className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DemoBanner />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Operator Dashboard</h1>
            <p className="text-gray-600">Manage your fleet, crew, and charter operations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Aircraft
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demoStats.totalRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Quotes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demoStats.myQuotes}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demoStats.winRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <span className="text-sm text-muted-foreground">$</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${demoStats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">Open Requests</TabsTrigger>
            <TabsTrigger value="quotes">My Quotes</TabsTrigger>
            <TabsTrigger value="bookings">Active Bookings</TabsTrigger>
            <TabsTrigger value="fleet">Fleet</TabsTrigger>
            <TabsTrigger value="crew">Crew</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <div className="space-y-4">
              {demoRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          {request.origin} → {request.destination}
                        </CardTitle>
                        <CardDescription>
                          {new Date(request.departure_date).toLocaleDateString()}
                          • {request.passenger_count} passengers
                          • {request.companies?.name}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      Submit Quote
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quotes" className="space-y-4">
            <div className="space-y-4">
              {demoQuotes.map((quote) => (
                <Card key={quote.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(quote.status)}
                          {quote.requests?.origin} → {quote.requests?.destination}
                        </CardTitle>
                        <CardDescription>
                          ${quote.price.toLocaleString()} {quote.currency}
                          {quote.aircraft && ` • ${quote.aircraft.model} (${quote.aircraft.tail_number})`}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <div className="space-y-4">
              {demoBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>
                          {booking.requests.origin} → {booking.requests.destination}
                        </CardTitle>
                        <CardDescription>
                          ${booking.total_price.toLocaleString()} {booking.currency}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full">
                        Assign Crew
                      </Button>
                      <Button variant="outline" className="w-full">
                        Update Flight Status
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fleet" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Fleet Management</h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Aircraft
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoAircraft.map((aircraft) => (
                <FleetCard key={aircraft.id} aircraft={aircraft} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="crew" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Crew Management</h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Crew Member
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoCrew.map((member) => (
                <CrewCard key={member.id} member={member} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsChart />
          </TabsContent>

          <TabsContent value="notifications">
            <div className="space-y-4">
              {demoNotifications.map((notification) => (
                <Card key={notification.id} className={!notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Bell className="h-4 w-4 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <MessageCenter bookingId="demo-booking-001" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
