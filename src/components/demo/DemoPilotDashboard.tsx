import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Clock, CheckCircle, AlertCircle, Bell, MapPin, Users, Calendar, Shield, Award, FileText, DollarSign, Star, BarChart3 } from "lucide-react";
import { DemoBanner } from "../DemoBanner";
import { NotificationCenter } from "../ui/notification-center";
import { MessageCenter } from "../messaging/MessageCenter";
import { UnifiedTerminalLayout, TerminalIcons } from "./UnifiedTerminalLayout";
import { ProfessionalDataCard, ProfessionalFlightCard, ProfessionalProfileCard } from "./ProfessionalDataCard";
import { AircraftTrackingMap } from "./AircraftTrackingMap";
import { PilotTrackingMap } from "./PilotTrackingMap";
import { PilotCockpit } from "./PilotCockpit";

// Demo data for pilot
const demoAssignments = [
  {
    id: "assign-001",
    flight_id: "flight-001",
    departure_airport: "KTEB",
    arrival_airport: "KMIA",
    departure_datetime: "2024-01-20T08:00:00Z",
    arrival_datetime: "2024-01-20T11:30:00Z",
    status: "scheduled",
    role: "Captain",
    aircraft: {
      model: "Gulfstream G550",
      tail_number: "N425SC"
    },
    passengers: 8,
    booking: {
      id: "book-001",
      broker: "Elite Charter Co."
    }
  },
  {
    id: "assign-002",
    flight_id: "flight-002",
    departure_airport: "KJFK",
    arrival_airport: "KLAX",
    departure_datetime: "2024-01-15T10:00:00Z",
    arrival_datetime: "2024-01-15T13:30:00Z",
    status: "in_flight",
    role: "Captain",
    aircraft: {
      model: "Falcon 7X",
      tail_number: "N156JT"
    },
    passengers: 6,
    booking: {
      id: "book-002",
      broker: "Premier Jets"
    }
  }
];

const demoProfile = {
  id: "pilot-001",
  full_name: "Captain James Mitchell",
  role: "Senior Captain",
  avatar_url: "/placeholder-avatar.jpg",
  licence_number: "ATP-987654",
  licence_expiry: "2025-08-20",
  ratings: ["Boeing 737", "Airbus A320", "Gulfstream G550", "Falcon 7X", "Citation X+"],
  hours_flown: 12500,
  base_airport: "KJFK",
  availability_status: "available"
};

const demoStats = {
  totalFlights: 89,
  hoursThisMonth: 156.5,
  upcomingFlights: 5,
  completedFlights: 84
};

const demoNotifications = [
  {
    id: "notif-001",
    type: "flight_assigned",
    message: "You've been assigned as Captain for Teterboro→Miami flight",
    read: false,
    created_at: "2024-01-10T14:30:00Z"
  },
  {
    id: "notif-002",
    type: "weather_alert",
    message: "Weather advisory: Strong winds expected in Miami area",
    read: false,
    created_at: "2024-01-15T09:15:00Z"
  }
];

// Aircraft tracking data for pilot view
const demoAircraftTracking = [
  {
    id: "aircraft-001",
    tail_number: "N425SC",
    model: "Boeing 737",
    status: "in_flight",
    location: {
      lat: 40.7128,
      lng: -74.0060,
      airport: "KJFK",
      city: "New York",
      country: "USA"
    },
    current_flight: {
      origin: "KJFK",
      destination: "KLAX",
      departure_time: "14:30 UTC",
      arrival_time: "17:45 UTC",
      passengers: 156
    },
    crew: {
      captain: "Captain James Mitchell",
      first_officer: "Mike Chen"
    },
    next_scheduled: {
      route: "KLAX → KJFK",
      time: "Tomorrow 09:00"
    }
  },
  {
    id: "aircraft-002",
    tail_number: "N892AV",
    model: "Airbus A320",
    status: "available",
    location: {
      lat: 34.0522,
      lng: -118.2437,
      airport: "KLAX",
      city: "Los Angeles",
      country: "USA"
    },
    crew: {
      captain: "David Rodriguez",
      first_officer: "Emma Davis"
    },
    next_scheduled: {
      route: "KLAX → KJFK",
      time: "Today 18:00"
    }
  }
];

// Pilot network data for pilot view
const demoPilotNetwork = [
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
    ratings: ["Boeing 737", "Airbus A320", "Gulfstream G550"],
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
      aircraft: "Boeing 737",
      departure_time: "14:30 UTC",
      arrival_time: "22:45 UTC"
    },
    ratings: ["Boeing 737", "Airbus A320", "Gulfstream G550"],
    hours_flown: 12000,
    rating: 4.8,
    next_available: "Tomorrow 08:00"
  }
];

export const DemoPilotDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [viewMode, setViewMode] = useState<"standard" | "cockpit">("standard");

  const sidebarItems = [
    { id: "profile", label: "Pilot Profile", icon: <TerminalIcons.Profile />, active: true },
    { id: "schedule", label: "Flight Schedule", icon: <TerminalIcons.Schedule />, badge: 5 },
    { id: "logbook", label: "Digital Logbook", icon: <TerminalIcons.Logbook /> },
    { id: "certifications", label: "Certifications", icon: <TerminalIcons.Certifications /> },
    { id: "training", label: "Training Records", icon: <TerminalIcons.Training /> },
    { id: "earnings", label: "Earnings", icon: <TerminalIcons.Earnings /> },
    { id: "analytics", label: "Performance Analytics", icon: <TerminalIcons.Analytics /> },
    { id: "network", label: "Professional Network", icon: <TerminalIcons.Network /> },
    { id: "weather", label: "Weather Center", icon: <TerminalIcons.Trust /> },
    { id: "news", label: "Aviation News", icon: <TerminalIcons.News /> }
  ];

  const user = {
    name: "Captain James Mitchell",
    role: "Senior Captain",
    status: "available" as const
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (viewMode === "cockpit") {
    return <PilotCockpit />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <DemoBanner />
      <div className="flex justify-end p-4">
        <Button
          onClick={() => setViewMode(viewMode === "standard" ? "cockpit" : "standard")}
          variant="outline"
          className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
        >
          {viewMode === "standard" ? "Cockpit View" : "Standard View"}
        </Button>
      </div>
      
      <UnifiedTerminalLayout
        title="Pilot Terminal"
        subtitle="Professional Flight Operations & Career Management"
        user={user}
        sidebarItems={sidebarItems}
        onNavigate={(direction) => console.log(`Navigate ${direction}`)}
        onLogout={() => console.log('Logout')}
        onNotificationClick={() => console.log('Notifications')}
        onMessageClick={() => console.log('Messages')}
      >
        <div className="space-y-6">
          {/* Pilot Profile Card */}
          <ProfessionalProfileCard
            name="Captain James Mitchell"
            title="ATP-987654"
            rating={4.8}
            flights={89}
            location="New York, NY (KJFK)"
            typeRatings={["Boeing 737", "Airbus A320", "Gulfstream G550", "Falcon 7X", "Citation X+"]}
            operatingRegions={["North America", "Europe", "Asia", "Caribbean"]}
          />

          {/* Flight Experience Summary */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Plane className="h-5 w-5 text-orange-400" />
                <span>FLIGHT EXPERIENCE SUMMARY</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">12,500</div>
                  <div className="text-sm text-gray-400">Total Flight Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">9,200</div>
                  <div className="text-sm text-gray-400">PIC Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">5</div>
                  <div className="text-sm text-gray-400">Type Ratings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">18</div>
                  <div className="text-sm text-gray-400">Years Experience</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity and Upcoming Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Flight Activity */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Clock className="h-5 w-5 text-orange-400" />
                  <span>RECENT FLIGHT ACTIVITY</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProfessionalFlightCard
                  route="KJFK → KLAX"
                  date="Dec 22 • Boeing 737 • 5.2h • Captain"
                  aircraft="Boeing 737"
                  status="landed"
                  passengers={156}
                  earnings={3200}
                  rating={4.9}
                />
                <ProfessionalFlightCard
                  route="KLAX → KJFK"
                  date="Dec 20 • Airbus A320 • 4.8h • Captain"
                  aircraft="Airbus A320"
                  status="landed"
                  passengers={142}
                  earnings={2800}
                  rating={4.7}
                />
                <ProfessionalFlightCard
                  route="KJFK → KMIA"
                  date="Dec 18 • Gulfstream G550 • 2.9h • Captain"
                  aircraft="Gulfstream G550"
                  status="landed"
                  passengers={8}
                  earnings={1800}
                  rating={5.0}
                />
              </CardContent>
            </Card>

            {/* Upcoming Schedule */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Calendar className="h-5 w-5 text-orange-400" />
                  <span>UPCOMING SCHEDULE</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProfessionalFlightCard
                  route="KJFK → KORD"
                  date="Dec 28 at 14:30 UTC"
                  aircraft="Boeing 737"
                  status="scheduled"
                  passengers={156}
                />
                <ProfessionalFlightCard
                  route="KORD → KLAX"
                  date="Dec 30 at 09:15 UTC"
                  aircraft="Airbus A320"
                  status="scheduled"
                  passengers={142}
                />
                <ProfessionalFlightCard
                  route="KLAX → KJFK"
                  date="Jan 2 at 16:45 UTC"
                  aircraft="Falcon 7X"
                  status="scheduled"
                  passengers={6}
                />
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ProfessionalDataCard
              title="Total Flights"
              value={demoStats.totalFlights}
              icon={Plane}
              trend={{ value: 15, isPositive: true }}
            />
            <ProfessionalDataCard
              title="Hours This Month"
              value={demoStats.hoursThisMonth}
              icon={Clock}
              trend={{ value: 12, isPositive: true }}
            />
            <ProfessionalDataCard
              title="Upcoming Flights"
              value={demoStats.upcomingFlights}
              icon={Calendar}
              badge={{ text: "Active", variant: "outline" }}
            />
            <ProfessionalDataCard
              title="Completed"
              value={demoStats.completedFlights}
              icon={CheckCircle}
              trend={{ value: 8, isPositive: true }}
            />
          </div>

          {/* Performance Analytics */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <BarChart3 className="h-5 w-5 text-orange-400" />
                <span>PERFORMANCE ANALYTICS</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">98.5%</div>
                  <div className="text-sm text-gray-400">On-Time Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">4.8</div>
                  <div className="text-sm text-gray-400">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">0</div>
                  <div className="text-sm text-gray-400">Safety Incidents</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aircraft Tracking Map */}
          <AircraftTrackingMap aircraft={demoAircraftTracking} />

          {/* Professional Network Map */}
          <PilotTrackingMap pilots={demoPilotNetwork} />
        </div>
      </UnifiedTerminalLayout>
    </div>
  );
};
