import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Plane, Clock, CheckCircle, AlertCircle, Bell, DollarSign, Users, BarChart3 } from "lucide-react";
import { DemoBanner } from "./DemoBanner";
import { QuoteCard } from "../ui/quote-card";
import { BookingTimeline } from "../ui/booking-timeline";
import { NotificationCenter } from "../ui/notification-center";
import { MessageCenter } from "../messaging/MessageCenter";

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

export const DemoBrokerDashboard: React.FC = () => {
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
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
      case 'cancelled':
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
            <h1 className="text-3xl font-bold">Broker Dashboard</h1>
            <p className="text-gray-600">Manage your charter requests and bookings</p>
          </div>
          <Button onClick={() => setShowNewRequestForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demoStats.totalRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demoStats.activeRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demoStats.totalBookings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <span className="text-sm text-muted-foreground">$</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${demoStats.totalSpent.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">My Requests</TabsTrigger>
            <TabsTrigger value="bookings">Active Bookings</TabsTrigger>
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
                          {request.return_date && ` - ${new Date(request.return_date).toLocaleDateString()}`}
                          • {request.passenger_count} passengers
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {request.quotes && request.quotes.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-semibold">Quotes ({request.quotes.length})</h4>
                        {request.quotes.map((quote) => (
                          <QuoteCard
                            key={quote.id}
                            quote={quote}
                            onAccept={() => {}}
                            canAccept={request.status === 'open'}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No quotes received yet</p>
                    )}
                  </CardContent>
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
                    {booking.flights && booking.flights.length > 0 && (
                      <BookingTimeline flights={booking.flights} />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
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
