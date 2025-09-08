import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Clock, CheckCircle, AlertCircle, Bell, MapPin, Users, Calendar } from "lucide-react";
import { DemoBanner } from "./DemoBanner";
import { NotificationCenter } from "../ui/notification-center";
import { MessageCenter } from "../messaging/MessageCenter";

// Demo data for crew/pilot
const demoAssignments = [
  {
    id: "assign-001",
    flight_id: "flight-001",
    departure_airport: "MIA",
    arrival_airport: "LHR",
    departure_datetime: "2024-01-20T08:00:00Z",
    arrival_datetime: "2024-01-20T18:30:00Z",
    status: "scheduled",
    role: "Captain",
    aircraft: {
      model: "Falcon 7X",
      tail_number: "N156JT"
    },
    passengers: 6,
    booking: {
      id: "book-001",
      broker: "Elite Charter Co."
    }
  },
  {
    id: "assign-002",
    flight_id: "flight-002",
    departure_airport: "JFK",
    arrival_airport: "LAX",
    departure_datetime: "2024-01-15T10:00:00Z",
    arrival_datetime: "2024-01-15T13:30:00Z",
    status: "in_flight",
    role: "First Officer",
    aircraft: {
      model: "Gulfstream G550",
      tail_number: "N425SC"
    },
    passengers: 4,
    booking: {
      id: "book-002",
      broker: "Premier Jets"
    }
  }
];

const demoProfile = {
  id: "crew-001",
  full_name: "Captain Sarah Johnson",
  role: "pilot",
  avatar_url: "/placeholder-avatar.jpg",
  licence_number: "ATP-123456",
  licence_expiry: "2025-06-15",
  ratings: ["Gulfstream G550", "Falcon 7X", "Citation X+"],
  hours_flown: 2847,
  base_airport: "KJFK",
  availability_status: "available"
};

const demoStats = {
  totalFlights: 47,
  hoursThisMonth: 89.5,
  upcomingFlights: 3,
  completedFlights: 44
};

const demoNotifications = [
  {
    id: "notif-001",
    type: "crew_assigned",
    message: "You've been assigned as Captain for Miami→London flight",
    read: false,
    created_at: "2024-01-10T14:30:00Z"
  },
  {
    id: "notif-002",
    type: "flight_delay",
    message: "Flight JFK→LAX delayed by 45 minutes due to weather",
    read: false,
    created_at: "2024-01-15T09:15:00Z"
  }
];

export const DemoCrewDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("assignments");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'boarding':
        return <Plane className="h-4 w-4 text-yellow-500" />;
      case 'in_flight':
        return <Plane className="h-4 w-4 text-green-500" />;
      case 'landed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'delayed':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'boarding':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_flight':
        return 'bg-green-100 text-green-800';
      case 'landed':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DemoBanner />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Crew Dashboard</h1>
            <p className="text-gray-600">Manage your flight assignments and schedule</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold">{demoProfile.full_name}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {demoProfile.full_name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Flights</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demoStats.totalFlights}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours This Month</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demoStats.hoursThisMonth}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Flights</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demoStats.upcomingFlights}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{demoStats.completedFlights}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="assignments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assignments">My Assignments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-4">
            <div className="space-y-4">
              {demoAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(assignment.status)}
                          {assignment.departure_airport} → {assignment.arrival_airport}
                        </CardTitle>
                        <CardDescription>
                          {formatDateTime(assignment.departure_datetime)}
                          • {assignment.aircraft.model} ({assignment.aircraft.tail_number})
                          • {assignment.passengers} passengers
                          • {assignment.role}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>Departure: {assignment.departure_airport}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>Arrival: {assignment.arrival_airport}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{assignment.passengers} pax</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          View Details
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Crew Profile</CardTitle>
                <CardDescription>Your professional information and certifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {demoProfile.full_name}</p>
                      <p><span className="font-medium">Role:</span> {demoProfile.role}</p>
                      <p><span className="font-medium">Base:</span> {demoProfile.base_airport}</p>
                      <p><span className="font-medium">Status:</span> 
                        <Badge className="ml-2 bg-green-100 text-green-800">
                          {demoProfile.availability_status}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Certifications</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Licence:</span> {demoProfile.licence_number}</p>
                      <p><span className="font-medium">Expiry:</span> {new Date(demoProfile.licence_expiry).toLocaleDateString()}</p>
                      <p><span className="font-medium">Total Hours:</span> {demoProfile.hours_flown.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Aircraft Ratings</h4>
                  <div className="flex flex-wrap gap-2">
                    {demoProfile.ratings.map((rating, index) => (
                      <Badge key={index} variant="outline">
                        {rating}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
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
