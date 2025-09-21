import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Clock, CheckCircle, AlertCircle, Bell, DollarSign, Users, BarChart3, FileText, Settings, Shield, Award, Plane, Activity } from "lucide-react";
import { DemoBanner } from "../DemoBanner";
import { UnifiedTerminalLayout, TerminalIcons } from "./UnifiedTerminalLayout";
import { ProfessionalDataCard, ProfessionalFlightCard } from "./ProfessionalDataCard";
import { AircraftTrackingMap } from "./AircraftTrackingMap";
import { OperatorCommandCenter } from "./OperatorCommandCenter";
import { FlightRadar24Widget } from "../flight-tracking/FlightRadar24Widget";

// Demo data for operator
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
  },
  {
    id: "req-003",
    origin: "Chicago (ORD)",
    destination: "Paris (CDG)",
    departure_date: "2024-01-25T14:00:00Z",
    passenger_count: 8,
    status: "quoted",
    created_at: "2024-01-12T16:00:00Z",
    companies: { name: "Global Aviation" }
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
      destination: "Los Angeles (LAX)",
      departure_date: "2024-01-15T10:00:00Z",
      passenger_count: 4
    }
  },
  {
    id: "quote-002",
    request_id: "req-002",
    price: 85000,
    currency: "USD",
    status: "accepted",
    created_at: "2024-01-08T15:00:00Z",
    requests: {
      origin: "Miami (MIA)",
      destination: "London (LHR)",
      departure_date: "2024-01-20T08:00:00Z",
      passenger_count: 6
    }
  }
];

const demoFleet = [
  {
    id: "aircraft-001",
    tail_number: "N425SC",
    model: "Gulfstream G550",
    status: "in_flight",
    location: "New York (JFK)",
    next_maintenance: "2024-02-15",
    hours_flown: 1250,
    crew: {
      captain: "Captain Sarah Mitchell",
      first_officer: "Mike Chen"
    }
  },
  {
    id: "aircraft-002",
    tail_number: "N892AV",
    model: "Citation X+",
    status: "available",
    location: "Los Angeles (LAX)",
    next_maintenance: "2024-03-20",
    hours_flown: 890,
    crew: {
      captain: "David Rodriguez",
      first_officer: "Emma Davis"
    }
  },
  {
    id: "aircraft-003",
    tail_number: "N156JT",
    model: "Falcon 7X",
    status: "maintenance" as const,
    location: "Miami (MIA)",
    next_maintenance: "2024-01-30",
    hours_flown: 2100,
    crew: {
      captain: "James Wilson",
      first_officer: "Lisa Brown"
    }
  }
];

const demoCrew = [
  {
    id: "crew-001",
    name: "Captain Sarah Mitchell",
    role: "Captain",
    status: "available",
    aircraft_type: "Gulfstream G550",
    hours_flown: 12500,
    rating: 4.9,
    next_available: "Available now"
  },
  {
    id: "crew-002",
    name: "Mike Chen",
    role: "First Officer",
    status: "in_flight",
    aircraft_type: "Gulfstream G550",
    hours_flown: 8500,
    rating: 4.8,
    next_available: "Tomorrow 08:00"
  },
  {
    id: "crew-003",
    name: "David Rodriguez",
    role: "Captain",
    status: "available" as const,
    aircraft_type: "Citation X+",
    hours_flown: 9800,
    rating: 4.7,
    next_available: "Available now"
  }
];

const demoStats = {
  totalFlights: 156,
  activeFlights: 8,
  totalRevenue: 2450000,
  fleetUtilization: 78.5
};

// Aircraft tracking data for operator view
const demoAircraftTracking = [
  {
    id: "aircraft-001",
    tail_number: "N425SC",
    model: "Gulfstream G550",
    status: "in_flight" as const,
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
    status: "available" as const,
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

export const DemoOperatorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [viewMode, setViewMode] = useState<"standard" | "command">("standard");
  
  // Force rebuild to ensure new content is deployed

  const sidebarItems = [
    { id: "dashboard", label: "Operations Center", icon: <TerminalIcons.Dashboard />, active: true },
    { id: "fleet", label: "Fleet Management", icon: <TerminalIcons.Fleet /> },
    { id: "dispatch", label: "Flight Dispatch", icon: <TerminalIcons.Dispatch /> },
    { id: "maintenance", label: "Maintenance", icon: <TerminalIcons.Maintenance /> },
    { id: "crew", label: "Crew Scheduling", icon: <TerminalIcons.Crew /> },
    { id: "bookings", label: "Charter Bookings", icon: <TerminalIcons.Bookings /> },
    { id: "marketplace", label: "Marketplace", icon: <TerminalIcons.Marketplace /> },
    { id: "communications", label: "Communications", icon: <TerminalIcons.Communications /> },
    { id: "analytics", label: "Performance Analytics", icon: <TerminalIcons.Analytics /> },
    { id: "compliance", label: "Compliance Center", icon: <TerminalIcons.Compliance /> },
    { id: "news", label: "Aviation News", icon: <TerminalIcons.News /> }
  ];

  const user = {
    name: "Alex Thompson",
    role: "Aircraft Operator",
    status: "available" as const
  };

  if (viewMode === "command") {
    return <OperatorCommandCenter />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <DemoBanner />
      <div className="flex justify-end p-4">
        <Button
          onClick={() => setViewMode(viewMode === "standard" ? "command" : "standard")}
          variant="outline"
          className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white"
        >
          {viewMode === "standard" ? "Command Center" : "Standard View"}
        </Button>
      </div>
      
      <UnifiedTerminalLayout
        title="Operator Terminal"
        subtitle="Aircraft Operations Management"
        user={user}
        sidebarItems={sidebarItems}
        onNavigate={(direction) => console.log(`Navigate ${direction}`)}
        onLogout={() => console.log('Logout')}
        onNotificationClick={() => console.log('Notifications')}
        onMessageClick={() => console.log('Messages')}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-11 bg-slate-800 border-slate-700">
            <TabsTrigger value="dashboard" className="text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="fleet" className="text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-white">Fleet</TabsTrigger>
            <TabsTrigger value="dispatch" className="text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-white">Dispatch</TabsTrigger>
            <TabsTrigger value="maintenance" className="text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-white">Maintenance</TabsTrigger>
            <TabsTrigger value="crew" className="text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-white">Crew</TabsTrigger>
            <TabsTrigger value="bookings" className="text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-white">Bookings</TabsTrigger>
            <TabsTrigger value="marketplace" className="text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-white">Marketplace</TabsTrigger>
            <TabsTrigger value="communications" className="text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-white">Comm</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-white">Analytics</TabsTrigger>
            <TabsTrigger value="compliance" className="text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-white">Compliance</TabsTrigger>
            <TabsTrigger value="news" className="text-xs data-[state=active]:bg-cyan-500 data-[state=active]:text-white">News</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ProfessionalDataCard
                title="Total Flights"
                value={demoStats.totalFlights}
                icon={Plane}
                trend={{ value: 12, isPositive: true }}
              />
              <ProfessionalDataCard
                title="Active Flights"
                value={demoStats.activeFlights}
                icon={Activity}
                badge={{ text: "Live", variant: "destructive" }}
              />
              <ProfessionalDataCard
                title="Total Revenue"
                value={`$${(demoStats.totalRevenue / 1000000).toFixed(1)}M`}
                icon={DollarSign}
                trend={{ value: 8, isPositive: true }}
              />
              <ProfessionalDataCard
                title="Fleet Utilization"
                value={`${demoStats.fleetUtilization}%`}
                icon={BarChart3}
                trend={{ value: 5, isPositive: true }}
              />
            </div>

            {/* Flight Tracking */}
            <FlightRadar24Widget 
              tailNumbers={["N123SC", "N456SC", "N789SC"]}
              role="operator"
              showMap={true}
              autoRefresh={true}
              refreshInterval={30}
            />

            {/* Aircraft Tracking Map */}
            <AircraftTrackingMap aircraft={demoAircraftTracking} />

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Clock className="h-5 w-5 text-cyan-400" />
                    <span>RECENT REQUESTS</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {demoRequests.map((request) => (
                    <Card key={request.id} className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-white">{request.origin} → {request.destination}</h3>
                          <Badge className={`${
                            request.status === 'open' ? 'bg-yellow-500' : 'bg-green-500'
                          } text-white`}>
                            {request.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-slate-300">
                          <div className="flex items-center justify-between">
                            <span>{new Date(request.departure_date).toLocaleDateString()}</span>
                            <span className="text-cyan-400">{request.passenger_count} PAX</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>{request.companies.name}</span>
                            <span className="text-slate-400">{new Date(request.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <CheckCircle className="h-5 w-5 text-cyan-400" />
                    <span>RECENT QUOTES</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {demoQuotes.map((quote) => (
                    <Card key={quote.id} className="bg-slate-700 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-white">{quote.requests.origin} → {quote.requests.destination}</h3>
                          <Badge className={`${
                            quote.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                          } text-white`}>
                            {quote.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-slate-300">
                          <div className="flex items-center justify-between">
                            <span>{new Date(quote.requests.departure_date).toLocaleDateString()}</span>
                            <span className="text-cyan-400">${quote.price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>{quote.requests.passenger_count} PAX</span>
                            <span className="text-slate-400">{new Date(quote.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fleet" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Plane className="h-5 w-5 text-cyan-400" />
                  <span>FLEET MANAGEMENT</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoFleet.map((aircraft) => (
                  <Card key={aircraft.id} className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">{aircraft.tail_number} - {aircraft.model}</h3>
                        <Badge className={`${
                          aircraft.status === 'in_flight' ? 'bg-green-500' : 
                          aircraft.status === 'available' ? 'bg-blue-500' : 'bg-red-500'
                        } text-white`}>
                          {aircraft.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-slate-300">
                        <div className="flex items-center justify-between">
                          <span>Location: {aircraft.location}</span>
                          <span className="text-cyan-400">{aircraft.hours_flown} hours</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Captain: {aircraft.crew.captain}</span>
                          <span className="text-slate-400">Next MX: {aircraft.next_maintenance}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dispatch" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Plane className="h-5 w-5 text-cyan-400" />
                  <span>FLIGHT DISPATCH</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoRequests.map((request) => (
                  <Card key={request.id} className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">{request.origin} → {request.destination}</h3>
                        <Badge className={`${
                          request.status === 'open' ? 'bg-yellow-500' : 'bg-green-500'
                        } text-white`}>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-slate-300">
                        <div className="flex items-center justify-between">
                          <span>{new Date(request.departure_date).toLocaleDateString()}</span>
                          <span className="text-cyan-400">{request.passenger_count} PAX</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{request.companies.name}</span>
                          <Button size="sm" variant="outline" className="text-xs">
                            Assign Aircraft
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Settings className="h-5 w-5 text-cyan-400" />
                  <span>MAINTENANCE SCHEDULE</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoFleet.map((aircraft) => (
                  <Card key={aircraft.id} className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">{aircraft.tail_number} - {aircraft.model}</h3>
                        <Badge className={`${
                          aircraft.status === 'maintenance' ? 'bg-red-500' : 'bg-green-500'
                        } text-white`}>
                          {aircraft.status === 'maintenance' ? 'In MX' : 'Operational'}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-slate-300">
                        <div className="flex items-center justify-between">
                          <span>Next Maintenance: {aircraft.next_maintenance}</span>
                          <span className="text-cyan-400">{aircraft.hours_flown} hours</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Location: {aircraft.location}</span>
                          <Button size="sm" variant="outline" className="text-xs">
                            Schedule MX
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crew" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Users className="h-5 w-5 text-cyan-400" />
                  <span>CREW SCHEDULING</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoCrew.map((crew) => (
                  <Card key={crew.id} className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">{crew.name}</h3>
                        <Badge className={`${
                          crew.status === 'available' ? 'bg-green-500' : 'bg-blue-500'
                        } text-white`}>
                          {crew.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-slate-300">
                        <div className="flex items-center justify-between">
                          <span>{crew.role} - {crew.aircraft_type}</span>
                          <span className="text-cyan-400">{crew.hours_flown} hours</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Rating: {crew.rating}/5.0</span>
                          <span className="text-slate-400">{crew.next_available}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Calendar className="h-5 w-5 text-cyan-400" />
                  <span>CHARTER BOOKINGS</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoQuotes.map((quote) => (
                  <Card key={quote.id} className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-white">{quote.requests.origin} → {quote.requests.destination}</h3>
                        <Badge className={`${
                          quote.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                        } text-white`}>
                          {quote.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-slate-300">
                        <div className="flex items-center justify-between">
                          <span>{new Date(quote.requests.departure_date).toLocaleDateString()}</span>
                          <span className="text-cyan-400">${quote.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{quote.requests.passenger_count} PAX</span>
                          <Button size="sm" variant="outline" className="text-xs">
                            {quote.status === 'pending' ? 'Confirm' : 'View Details'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <BarChart3 className="h-5 w-5 text-cyan-400" />
                  <span>MARKETPLACE</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400">$2.45M</div>
                    <div className="text-sm text-slate-400">Total Revenue</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400">156</div>
                    <div className="text-sm text-slate-400">Total Flights</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400">78.5%</div>
                    <div className="text-sm text-slate-400">Fleet Utilization</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {demoRequests.map((request) => (
                    <Card key={request.id} className="bg-slate-700 border-slate-600">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-white">{request.origin} → {request.destination}</h3>
                            <p className="text-sm text-slate-400">{request.companies.name}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-cyan-400 font-medium">{request.passenger_count} PAX</div>
                            <div className="text-sm text-slate-400">{new Date(request.departure_date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communications" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Bell className="h-5 w-5 text-cyan-400" />
                  <span>COMMUNICATIONS</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div>
                      <h3 className="font-semibold text-white">Flight N425SC Status Update</h3>
                      <p className="text-sm text-slate-400">Captain Sarah Mitchell - 2 minutes ago</p>
                    </div>
                    <Badge className="bg-green-500 text-white">New</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div>
                      <h3 className="font-semibold text-white">Maintenance Alert</h3>
                      <p className="text-sm text-slate-400">N156JT requires inspection - 1 hour ago</p>
                    </div>
                    <Badge className="bg-yellow-500 text-white">Alert</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div>
                      <h3 className="font-semibold text-white">New Charter Request</h3>
                      <p className="text-sm text-slate-400">JFK to LAX - 3 hours ago</p>
                    </div>
                    <Badge className="bg-blue-500 text-white">Request</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <BarChart3 className="h-5 w-5 text-cyan-400" />
                  <span>PERFORMANCE ANALYTICS</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Monthly Performance</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                        <span className="text-white">Revenue</span>
                        <span className="text-green-400 font-medium">+12.5%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                        <span className="text-white">Flight Hours</span>
                        <span className="text-green-400 font-medium">+8.3%</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                        <span className="text-white">Fleet Utilization</span>
                        <span className="text-green-400 font-medium">+5.2%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Top Routes</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                        <span className="text-white">JFK → LAX</span>
                        <span className="text-cyan-400 font-medium">45 flights</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                        <span className="text-white">MIA → LHR</span>
                        <span className="text-cyan-400 font-medium">32 flights</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                        <span className="text-white">ORD → CDG</span>
                        <span className="text-cyan-400 font-medium">28 flights</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Shield className="h-5 w-5 text-cyan-400" />
                  <span>COMPLIANCE CENTER</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <span className="text-white">FAA Part 135 Compliance</span>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <span className="text-white">Safety Management System</span>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <span className="text-white">Crew Training Records</span>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <span className="text-white">Aircraft Maintenance Logs</span>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Bell className="h-5 w-5 text-cyan-400" />
                  <span>AVIATION NEWS</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "New Gulfstream G800 Enters Service", date: "2024-01-10", category: "Aircraft" },
                  { title: "FAA Updates Weather Minimums", date: "2024-01-08", category: "Regulations" },
                  { title: "Private Jet Demand Surges 15%", date: "2024-01-05", category: "Market" },
                  { title: "New Pilot Training Requirements", date: "2024-01-03", category: "Training" },
                  { title: "Aviation Safety Milestone Reached", date: "2024-01-01", category: "Safety" }
                ].map((news, index) => (
                  <Card key={index} className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-white">{news.title}</h3>
                          <p className="text-sm text-slate-400">{news.date}</p>
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
