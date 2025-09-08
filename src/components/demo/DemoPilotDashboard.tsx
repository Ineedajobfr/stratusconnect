import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Clock, CheckCircle, AlertCircle, Bell, MapPin, Users, Calendar, Shield, Award, FileText, DollarSign, Star, Activity } from "lucide-react";
import { DemoBanner } from "../DemoBanner";
import { UnifiedTerminalLayout, TerminalIcons } from "./UnifiedTerminalLayout";
import { ProfessionalDataCard, ProfessionalFlightCard, ProfessionalProfileCard } from "./ProfessionalDataCard";
import { AircraftTrackingMap } from "./AircraftTrackingMap";
import { PilotTrackingMap } from "./PilotTrackingMap";
import { PilotCockpit } from "./PilotCockpit";

// Demo data for pilot
const demoAssignments = [
  {
    id: "assign-001",
    route: "KTEB → KMIA",
    date: "Dec 20 • G550 • 2.9h • PIC",
    aircraft: "G550",
    status: "landed",
    passengers: 8,
    earnings: 1150,
    rating: 5.0
  },
  {
    id: "assign-002",
    route: "KJFK → KLAX",
    date: "Dec 18 • G650 • 5.2h • PIC",
    aircraft: "G650",
    status: "landed",
    passengers: 6,
    earnings: 2100,
    rating: 4.8
  },
  {
    id: "assign-003",
    route: "KMIA → KORD",
    date: "Dec 15 • Falcon 7X • 3.1h • PIC",
    aircraft: "Falcon 7X",
    status: "landed",
    passengers: 4,
    earnings: 1800,
    rating: 4.9
  },
  {
    id: "assign-004",
    route: "KTEB → KPBI",
    date: "Dec 28 at 14:30 UTC",
    aircraft: "G550",
    status: "scheduled",
    passengers: 6
  },
  {
    id: "assign-005",
    route: "KPBI → KLAX",
    date: "Dec 30 at 09:15 UTC",
    aircraft: "G650",
    status: "scheduled",
    passengers: 8
  },
  {
    id: "assign-006",
    route: "KLAX → KJFK",
    date: "Jan 2 at 16:45 UTC",
    aircraft: "Falcon 7X",
    status: "scheduled",
    passengers: 4
  }
];

const demoStats = {
  totalFlights: 89,
  hoursThisMonth: 156.5,
  upcomingFlights: 3,
  completedFlights: 86
};

// Aircraft tracking data for pilot view
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
      captain: "Captain James Mitchell",
      first_officer: "Sarah Chen"
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

// Pilot network data for pilot view
const demoPilotNetwork = [
  {
    id: "pilot-001",
    name: "Captain Sarah Mitchell",
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

export const DemoPilotDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [viewMode, setViewMode] = useState<"standard" | "cockpit">("standard");
  
  // Force rebuild to ensure new content is deployed

  const sidebarItems = [
    { id: "profile", label: "Pilot Profile", icon: <TerminalIcons.Profile />, active: true },
    { id: "trust", label: "Fortress of Trust", icon: <TerminalIcons.Trust /> },
    { id: "requests", label: "Flight Requests", icon: <TerminalIcons.Requests /> },
    { id: "licenses", label: "Licenses & Ratings", icon: <TerminalIcons.Licenses /> },
    { id: "logbook", label: "Digital Logbook", icon: <TerminalIcons.Logbook /> },
    { id: "schedule", label: "Flight Schedule", icon: <TerminalIcons.Schedule /> },
    { id: "earnings", label: "Flight Earnings", icon: <TerminalIcons.Earnings /> },
    { id: "network", label: "Professional Network", icon: <TerminalIcons.Network /> },
    { id: "news", label: "Aviation News", icon: <TerminalIcons.News /> }
  ];

  const user = {
    name: "Captain James Mitchell",
    role: "Commercial Pilot",
    status: "available" as const
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
        subtitle="Commercial Pilot Profile"
        user={user}
        sidebarItems={sidebarItems}
        onNavigate={(direction) => console.log(`Navigate ${direction}`)}
        onLogout={() => console.log('Logout')}
        onNotificationClick={() => console.log('Notifications')}
        onMessageClick={() => console.log('Messages')}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 bg-gray-800">
            <TabsTrigger value="profile" className="text-xs">Profile</TabsTrigger>
            <TabsTrigger value="trust" className="text-xs">Trust</TabsTrigger>
            <TabsTrigger value="requests" className="text-xs">Requests</TabsTrigger>
            <TabsTrigger value="licenses" className="text-xs">Licenses</TabsTrigger>
            <TabsTrigger value="logbook" className="text-xs">Logbook</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs">Schedule</TabsTrigger>
            <TabsTrigger value="earnings" className="text-xs">Earnings</TabsTrigger>
            <TabsTrigger value="network" className="text-xs">Network</TabsTrigger>
            <TabsTrigger value="news" className="text-xs">News</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
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

            {/* Aircraft Tracking Map */}
            <AircraftTrackingMap aircraft={demoAircraftTracking} />
          </TabsContent>

          <TabsContent value="trust" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Shield className="h-5 w-5 text-orange-400" />
                  <span>FORTRESS OF TRUST</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">99.2%</div>
                    <div className="text-sm text-gray-400">Safety Rating</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">0</div>
                    <div className="text-sm text-gray-400">Safety Incidents</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">4.8</div>
                    <div className="text-sm text-gray-400">Client Rating</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <span className="text-white">Background Check</span>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <span className="text-white">Drug Testing</span>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <span className="text-white">Security Clearance</span>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Plane className="h-5 w-5 text-orange-400" />
                  <span>FLIGHT REQUESTS</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    id: "req-1",
                    route: "KJFK → KLAX",
                    date: "Dec 25, 2024",
                    aircraft: "Gulfstream G550",
                    passengers: 6,
                    duration: "5h 15m",
                    status: "pending",
                    pay: "$2,100"
                  },
                  {
                    id: "req-2",
                    route: "KMIA → KORD",
                    date: "Dec 28, 2024",
                    aircraft: "Falcon 7X",
                    passengers: 4,
                    duration: "3h 45m",
                    status: "accepted",
                    pay: "$1,800"
                  },
                  {
                    id: "req-3",
                    route: "KTEB → KPBI",
                    date: "Jan 2, 2025",
                    aircraft: "Citation X+",
                    passengers: 8,
                    duration: "2h 30m",
                    status: "pending",
                    pay: "$1,200"
                  }
                ].map((request) => (
                  <Card key={request.id} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">{request.route}</h3>
                        <Badge className={`${
                          request.status === 'accepted' ? 'bg-green-500' : 'bg-yellow-500'
                        } text-white`}>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex items-center justify-between">
                          <span>{request.date}</span>
                          <span className="text-orange-400">{request.pay}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{request.aircraft}</span>
                          <span className="text-gray-400">{request.passengers} PAX</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{request.duration}</span>
                          <Button size="sm" variant="outline" className="text-xs">
                            {request.status === 'accepted' ? 'View Details' : 'Accept'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="licenses" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <FileText className="h-5 w-5 text-orange-400" />
                  <span>LICENSES & RATINGS</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Airline Transport Pilot (ATP)", status: "Current", expiry: "2025-12-31" },
                  { name: "Boeing 737 Type Rating", status: "Current", expiry: "2025-08-15" },
                  { name: "Airbus A320 Type Rating", status: "Current", expiry: "2025-06-20" },
                  { name: "Gulfstream G550", status: "Current", expiry: "2025-09-10" },
                  { name: "Falcon 7X", status: "Current", expiry: "2025-11-05" },
                  { name: "Citation X+", status: "Current", expiry: "2025-07-15" },
                  { name: "First Class Medical", status: "Current", expiry: "2025-03-15" }
                ].map((license, index) => (
                  <Card key={index} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-white">{license.name}</h3>
                          <p className="text-sm text-gray-400">Expires: {license.expiry}</p>
                        </div>
                        <Badge className="bg-green-500 text-white">{license.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logbook" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <FileText className="h-5 w-5 text-orange-400" />
                  <span>DIGITAL LOGBOOK</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">12,500</div>
                    <div className="text-sm text-gray-400">Total Hours</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">9,200</div>
                    <div className="text-sm text-gray-400">PIC Hours</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">89</div>
                    <div className="text-sm text-gray-400">Total Flights</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {demoAssignments.slice(0, 5).map((assignment) => (
                    <Card key={assignment.id} className="bg-gray-700 border-gray-600">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-white">{assignment.route}</h3>
                            <p className="text-sm text-gray-400">{assignment.date}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-orange-400 font-medium">{assignment.aircraft}</div>
                            <div className="text-sm text-gray-400">{assignment.passengers} PAX</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Calendar className="h-5 w-5 text-orange-400" />
                  <span>FLIGHT SCHEDULE</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoAssignments.map((assignment) => (
                  <ProfessionalFlightCard
                    key={assignment.id}
                    route={assignment.route}
                    date={assignment.date}
                    aircraft={assignment.aircraft}
                    status={assignment.status}
                    passengers={assignment.passengers}
                    earnings={assignment.earnings}
                    rating={assignment.rating}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <DollarSign className="h-5 w-5 text-orange-400" />
                  <span>FLIGHT EARNINGS</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">$52,800</div>
                    <div className="text-sm text-gray-400">This Month</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">$445,200</div>
                    <div className="text-sm text-gray-400">This Year</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">$3,200</div>
                    <div className="text-sm text-gray-400">Avg per Flight</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {demoAssignments.slice(0, 5).map((assignment) => (
                    <Card key={assignment.id} className="bg-gray-700 border-gray-600">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-white">{assignment.route}</h3>
                            <p className="text-sm text-gray-400">{assignment.date}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 font-medium">${assignment.earnings}</div>
                            <div className="text-sm text-gray-400">Paid</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Users className="h-5 w-5 text-orange-400" />
                  <span>PROFESSIONAL NETWORK</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PilotTrackingMap pilots={demoPilotNetwork} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Bell className="h-5 w-5 text-orange-400" />
                  <span>AVIATION NEWS</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "New Boeing 737 MAX Updates", date: "2024-01-10", category: "Aircraft" },
                  { title: "FAA Updates Weather Minimums", date: "2024-01-08", category: "Regulations" },
                  { title: "Pilot Shortage Reaches Critical Level", date: "2024-01-05", category: "Industry" },
                  { title: "New Training Requirements for Pilots", date: "2024-01-03", category: "Training" },
                  { title: "Aviation Safety Milestone Reached", date: "2024-01-01", category: "Safety" }
                ].map((news, index) => (
                  <Card key={index} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-white">{news.title}</h3>
                          <p className="text-sm text-gray-400">{news.date}</p>
                        </div>
                        <Badge className="bg-orange-500 text-white">{news.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </UnifiedTerminalLayout>
    </div>
  );
};
