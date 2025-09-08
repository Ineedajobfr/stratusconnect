import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Clock, CheckCircle, AlertCircle, Bell, MapPin, Users, Calendar, Shield, Award, FileText, DollarSign, Star } from "lucide-react";
import { DemoBanner } from "../DemoBanner";
import { NotificationCenter } from "../ui/notification-center";
import { MessageCenter } from "../messaging/MessageCenter";
import { UnifiedTerminalLayout, TerminalIcons } from "./UnifiedTerminalLayout";
import { ProfessionalDataCard, ProfessionalFlightCard, ProfessionalProfileCard } from "./ProfessionalDataCard";
import { AircraftTrackingMap } from "./AircraftTrackingMap";
import { PilotTrackingMap } from "./PilotTrackingMap";
import { CrewFlightDeck } from "./CrewFlightDeck";

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

// Aircraft tracking data for crew view
const demoAircraftTracking = [
  {
    id: "aircraft-001",
    tail_number: "N425SC",
    model: "Gulfstream G550",
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
      passengers: 8
    },
    crew: {
      captain: "Captain Sarah Mitchell",
      first_officer: "Mike Chen"
    },
    next_scheduled: {
      route: "KLAX → KMIA",
      time: "Tomorrow 09:00"
    }
  },
  {
    id: "aircraft-002",
    tail_number: "N892AV",
    model: "Citation X+",
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

// Pilot network data for crew view
const demoPilotNetwork = [
  {
    id: "pilot-001",
    name: "Captain James Mitchell",
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
    hours_flown: 12500,
    rating: 4.8,
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
  }
];

export const DemoCrewDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [viewMode, setViewMode] = useState<"standard" | "flightdeck">("standard");

  const sidebarItems = [
    { id: "profile", label: "Pilot Profile", icon: <TerminalIcons.Profile />, active: true },
    { id: "trust", label: "Fortress of Trust", icon: <TerminalIcons.Trust /> },
    { id: "jobs", label: "Job Opportunities", icon: <TerminalIcons.Jobs />, badge: 3 },
    { id: "schedule", label: "Flight Schedule", icon: <TerminalIcons.Schedule /> },
    { id: "certifications", label: "Certifications", icon: <TerminalIcons.Certifications /> },
    { id: "logbook", label: "Digital Logbook", icon: <TerminalIcons.Logbook /> },
    { id: "earnings", label: "Earnings", icon: <TerminalIcons.Earnings /> },
    { id: "network", label: "Professional Network", icon: <TerminalIcons.Network /> },
    { id: "training", label: "Training Records", icon: <TerminalIcons.Training /> },
    { id: "news", label: "Aviation News", icon: <TerminalIcons.News /> }
  ];

  const user = {
    name: "Captain Sarah Mitchell",
    role: "Professional Pilot",
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

  if (viewMode === "flightdeck") {
    return <CrewFlightDeck />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <DemoBanner />
      <div className="flex justify-end p-4">
        <Button
          onClick={() => setViewMode(viewMode === "standard" ? "flightdeck" : "standard")}
          variant="outline"
          className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
        >
          {viewMode === "standard" ? "Flight Deck" : "Standard View"}
        </Button>
      </div>
      
      <UnifiedTerminalLayout
        title="Crew Terminal"
        subtitle="Professional Pilot Profile"
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
            name="Captain Sarah Mitchell"
            title="ATP-1234567"
            rating={4.9}
            flights={127}
            location="Teterboro, NJ (KTEB)"
            typeRatings={["G650/G650ER", "Falcon 7X/8X", "Citation X/X+", "G550/G500"]}
            operatingRegions={["Domestic US", "Europe", "Caribbean", "Central America"]}
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
                  <div className="text-3xl font-bold text-orange-400">8,547</div>
                  <div className="text-sm text-gray-400">Total Flight Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">6,240</div>
                  <div className="text-sm text-gray-400">PIC Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">6</div>
                  <div className="text-sm text-gray-400">Type Ratings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">12</div>
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
                  route="KTEB → KMIA"
                  date="Dec 20 • G550 • 2.9h • PIC"
                  aircraft="G550"
                  status="landed"
                  passengers={8}
                  earnings={1150}
                  rating={5.0}
                />
                <ProfessionalFlightCard
                  route="KJFK → KLAX"
                  date="Dec 18 • G650 • 5.2h • PIC"
                  aircraft="G650"
                  status="landed"
                  passengers={6}
                  earnings={2100}
                  rating={4.8}
                />
                <ProfessionalFlightCard
                  route="KMIA → KORD"
                  date="Dec 15 • Falcon 7X • 3.1h • PIC"
                  aircraft="Falcon 7X"
                  status="landed"
                  passengers={4}
                  earnings={1800}
                  rating={4.9}
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
                  route="KTEB → KPBI"
                  date="Dec 28 at 14:30 UTC"
                  aircraft="G550"
                  status="scheduled"
                  passengers={6}
                />
                <ProfessionalFlightCard
                  route="KPBI → KLAX"
                  date="Dec 30 at 09:15 UTC"
                  aircraft="G650"
                  status="scheduled"
                  passengers={8}
                />
                <ProfessionalFlightCard
                  route="KLAX → KJFK"
                  date="Jan 2 at 16:45 UTC"
                  aircraft="Falcon 7X"
                  status="scheduled"
                  passengers={4}
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
              trend={{ value: 12, isPositive: true }}
            />
            <ProfessionalDataCard
              title="Hours This Month"
              value={demoStats.hoursThisMonth}
              icon={Clock}
              trend={{ value: 8, isPositive: true }}
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
              trend={{ value: 5, isPositive: true }}
            />
          </div>

          {/* Aircraft Tracking Map */}
          <AircraftTrackingMap aircraft={demoAircraftTracking} />

          {/* Professional Network Map */}
          <PilotTrackingMap pilots={demoPilotNetwork} />
                    </div>
      </UnifiedTerminalLayout>
    </div>
  );
};
