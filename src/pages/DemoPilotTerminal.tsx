import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TerminalLayout } from "@/components/TerminalLayout";
import { DemoBanner } from "@/components/DemoBanner";
import { 
  User, Briefcase, Award, Calendar, DollarSign, Globe, Shield, 
  MapPin, Clock, Star, AlertTriangle, CheckCircle, Plane 
} from "lucide-react";

export default function DemoPilotTerminal() {
  const [activeTab, setActiveTab] = useState("profile");

  // Demo data for pilots
  const certifications = [
    { type: "ATP License", status: "Current", expires: "Dec 2025", authority: "FAA", number: "ATP-1234567" },
    { type: "Type Rating - G650", status: "Current", expires: "Mar 2025", authority: "FAA", number: "TR-G650-789" },
    { type: "Type Rating - Citation X+", status: "Current", expires: "Jan 2025", authority: "FAA", number: "TR-CX-456" },
    { type: "Medical Certificate - Class 1", status: "Current", expires: "Jun 2024", authority: "FAA", number: "MED-789012" },
    { type: "Instrument Rating", status: "Current", expires: "Never", authority: "FAA", number: "IR-345678" }
  ];

  const flightRequests = [
    { id: "FLT-2024-089", route: "KTEB → KPBI", date: "Dec 28", aircraft: "Gulfstream G650", duration: "2.8h", rate: "$1,200/day", status: "Available", pax: "6", type: "Corporate Charter" },
    { id: "FLT-2024-090", route: "KJFK → EGLL", date: "Dec 30", aircraft: "Falcon 7X", duration: "7.5h", rate: "$1,850/day", status: "Pending", pax: "12", type: "International" },
    { id: "FLT-2024-091", route: "KLAS → KDEN", date: "Jan 2", aircraft: "Citation X+", duration: "2.2h", rate: "$950/day", status: "Available", pax: "8", type: "Executive" }
  ];

  const recentFlights = [
    { date: "Dec 20", route: "KTEB → KMIA", aircraft: "G650", duration: "2.9h", role: "PIC", payment: "$1,150", pax: "8" },
    { date: "Dec 18", route: "KLAX → KJFK", aircraft: "Falcon 7X", duration: "4.8h", role: "SIC", payment: "$920", pax: "10" },
    { date: "Dec 15", route: "KDFW → KLAX", aircraft: "Citation X+", duration: "2.5h", role: "PIC", payment: "$1,000", pax: "6" },
    { date: "Dec 12", route: "KORD → KBOS", aircraft: "G550", duration: "2.1h", role: "PIC", payment: "$850", pax: "4" }
  ];

  const menuItems = [
    { id: "profile", label: "Pilot Profile", icon: User },
    { id: "verification", label: "Fortress of Trust", icon: Shield },
    { id: "flights", label: "Flight Requests", icon: Plane },
    { id: "certifications", label: "Licenses & Ratings", icon: Award },
    { id: "logbook", label: "Digital Logbook", icon: Briefcase },
    { id: "schedule", label: "Flight Schedule", icon: Calendar },
    { id: "earnings", label: "Flight Earnings", icon: DollarSign },
    { id: "news", label: "Aviation News", icon: Globe }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
              <div className="mb-8">
                <h2 className="terminal-header">Pilot Profile</h2>
                <p className="text-gunmetal">Your professional aviation credentials and flight experience</p>
              </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pilot Profile Widget */}
              <Card className="terminal-card">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-terminal-card rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Plane className="w-10 h-10 text-terminal-info" />
                  </div>
                  <h3 className="text-foreground font-semibold mb-2">Captain Marcus Thompson</h3>
                  <p className="text-gunmetal text-sm mb-4">ATP • 12,450+ flight hours</p>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Star className="w-4 h-4 text-accent" />
                    <span className="text-accent font-medium">4.95/5.0</span>
                    <span className="text-gunmetal text-sm">(189 flights)</span>
                  </div>
                  <Badge className="bg-terminal-success/20 text-terminal-success border-terminal-success/30">
                    Available for Hire
                  </Badge>
                </CardContent>
              </Card>

              {/* Flight Stats */}
              <Card className="terminal-card lg:col-span-2">
                <CardHeader className="border-b border-terminal-border">
                  <CardTitle className="terminal-subheader">Flight Experience Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-gunmetal text-sm mb-1">Total Flight Hours</div>
                      <div className="text-foreground text-xl font-semibold">12,450</div>
                    </div>
                    <div>
                      <div className="text-gunmetal text-sm mb-1">PIC Hours</div>
                      <div className="text-foreground text-xl font-semibold">8,920</div>
                    </div>
                    <div>
                      <div className="text-gunmetal text-sm mb-1">Multi-Engine</div>
                      <div className="text-foreground text-xl font-semibold">11,200</div>
                    </div>
                    <div>
                      <div className="text-gunmetal text-sm mb-1">Turbine Hours</div>
                      <div className="text-foreground text-xl font-semibold">9,850</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-gunmetal text-sm mb-1">Current Type Ratings</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">G650/G650ER</Badge>
                        <Badge variant="outline">Falcon 7X/8X</Badge>
                        <Badge variant="outline">Citation X/X+</Badge>
                        <Badge variant="outline">G550/G500</Badge>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-gunmetal text-sm mb-1">Home Base</div>
                      <div className="text-foreground">Teterboro Airport (KTEB) • New Jersey</div>
                    </div>

                    <div>
                      <div className="text-gunmetal text-sm mb-1">Available Regions</div>
                      <div className="text-foreground">Domestic US, Europe, Caribbean</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "flights":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="terminal-header">Flight Requests</h2>
              <Button className="btn-terminal-primary" disabled>
                Flight Preferences (Demo)
              </Button>
            </div>

            <Card className="terminal-card">
              <CardHeader className="border-b border-terminal-border">
                <CardTitle className="terminal-subheader">Available Flight Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {flightRequests.map((flight) => (
                    <div key={flight.id} className="flex items-center justify-between py-4 border-b border-terminal-border/50">
                      <div className="flex items-center space-x-4">
                        <Plane className="w-6 h-6 text-terminal-info" />
                        <div>
                          <div className="text-foreground font-medium">{flight.route}</div>
                          <div className="text-gunmetal text-sm">{flight.date} • {flight.aircraft} • {flight.duration}</div>
                          <div className="text-gunmetal text-xs">{flight.type} • {flight.pax} PAX</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-terminal-success font-medium">{flight.rate}</div>
                          <div className="text-gunmetal text-xs">Daily Rate</div>
                        </div>
                        <Badge className={
                          flight.status === "Available" ? "bg-terminal-success/20 text-terminal-success border-terminal-success/30" :
                          "bg-terminal-warning/20 text-terminal-warning border-terminal-warning/30"
                        }>
                          {flight.status}
                        </Badge>
                        <Button size="sm" className="btn-terminal-success" disabled>
                          {flight.status === "Available" ? "Apply (Demo)" : "Applied"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "certifications":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="terminal-header">Licenses & Type Ratings</h2>
              <Button className="btn-terminal-primary" disabled>
                Add Certificate (Demo)
              </Button>
            </div>

            <Card className="terminal-card">
              <CardHeader className="border-b border-terminal-border">
                <CardTitle className="terminal-subheader">Current Aviation Certificates</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-terminal-border/50">
                      <div className="flex items-center space-x-4">
                        <Award className="w-5 h-5 text-accent" />
                        <div>
                          <div className="text-foreground font-medium">{cert.type}</div>
                          <div className="text-gunmetal text-sm">{cert.authority} • {cert.number}</div>
                          <div className="text-gunmetal text-xs">Expires: {cert.expires}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className="bg-terminal-success/20 text-terminal-success border-terminal-success/30">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {cert.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "logbook":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="terminal-header">Digital Logbook</h2>
              <Button className="btn-terminal-primary" disabled>
                Add Flight (Demo)
              </Button>
            </div>

            <Card className="terminal-card">
              <CardHeader className="border-b border-terminal-border">
                <CardTitle className="terminal-subheader">Recent Flight Records</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentFlights.map((flight, index) => (
                    <div key={index} className="flex justify-between py-3 border-b border-terminal-border/50">
                      <div className="flex items-center space-x-4">
                        <Clock className="w-4 h-4 text-gunmetal" />
                        <div>
                          <div className="text-foreground text-sm font-medium">{flight.route}</div>
                          <div className="text-gunmetal text-xs">{flight.date} • {flight.aircraft} • {flight.pax} PAX</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-foreground text-sm">{flight.duration} • {flight.role}</div>
                        <div className="text-terminal-success text-sm font-medium">{flight.payment}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "earnings":
        return (
          <div className="space-y-6">
              <div>
                <h2 className="terminal-header">Flight Earnings</h2>
                <p className="text-gunmetal">Track your completed flights and pilot earnings</p>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="terminal-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-terminal-success" />
                    <span className="terminal-label">This Month</span>
                  </div>
                  <div className="terminal-metric text-terminal-success">$18,750</div>
                  <div className="text-gunmetal text-sm">15 flight legs</div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Plane className="w-5 h-5 text-terminal-info" />
                    <span className="terminal-label">Flight Hours</span>
                  </div>
                  <div className="terminal-metric text-terminal-info">62.5</div>
                  <div className="text-gunmetal text-sm">Last 30 days</div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-accent" />
                    <span className="terminal-label">Client Rating</span>
                  </div>
                  <div className="terminal-metric text-accent">4.95</div>
                  <div className="text-gunmetal text-sm">Last 30 flights</div>
                </CardContent>
              </Card>
            </div>

            <Card className="terminal-card">
              <CardHeader className="border-b border-terminal-border">
                <CardTitle className="terminal-subheader">Flight Earnings History</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentFlights.map((flight, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <div>
                        <div className="text-foreground text-sm">{flight.route}</div>
                        <div className="text-gunmetal text-xs">{flight.date} • {flight.aircraft} • {flight.duration}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-terminal-success text-sm font-medium">{flight.payment}</div>
                        <div className="text-gunmetal text-xs">{flight.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
              <Card className="terminal-card">
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gunmetal" />
                  <h3 className="text-foreground text-lg mb-2">Demo Mode</h3>
                  <p className="text-gunmetal">
                    This is a demonstration version. Sign up for full access to all pilot features.
                  </p>
                </CardContent>
              </Card>
          </div>
        );
    }
  };

  return (
    <>
      <DemoBanner />
      <TerminalLayout 
        title="Pilot Terminal"
        userRole="Commercial Pilot"
        menuItems={menuItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        bannerText="Cleared for takeoff. Your cockpit command center for charter opportunities."
        terminalType="crew"
      >
        {renderContent()}
      </TerminalLayout>
    </>
  );
}