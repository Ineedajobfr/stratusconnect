import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TerminalLayout } from "@/components/TerminalLayout";
import { DemoBanner } from "@/components/DemoBanner";
import { PrivacyOverlay } from "@/components/PrivacyOverlay";
import { 
  User, Briefcase, Award, Calendar, DollarSign, Globe, Shield, 
  MapPin, Clock, Star, AlertTriangle, CheckCircle, Plane, Users, ChevronRight, TrendingUp 
} from "lucide-react";

export default function DemoCrewTerminal() {
  const [activeTab, setActiveTab] = useState("profile");

  // Enhanced demo data for crew professionals
  const crewProfile = {
    name: "Captain Sarah Mitchell",
    license: "ATP-1234567",
    totalHours: "8,547",
    picHours: "6,240", 
    rating: "4.9",
    reviews: "127",
    status: "Available",
    homeBase: "Teterboro, NJ (KTEB)"
  };

  const certifications = [
    { 
      type: "ATP License", 
      status: "Current", 
      expires: "Dec 2025", 
      authority: "FAA", 
      number: "ATP-1234567",
      daysRemaining: 365 
    },
    { 
      type: "Type Rating - G550/G650", 
      status: "Current", 
      expires: "Mar 2025", 
      authority: "FAA", 
      number: "TR-G550-789",
      daysRemaining: 89 
    },
    { 
      type: "Medical Certificate - Class 1", 
      status: "Current", 
      expires: "Jun 2024", 
      authority: "FAA", 
      number: "MED-789012",
      daysRemaining: 180 
    },
    { 
      type: "Instrument Rating", 
      status: "Current", 
      expires: "Never", 
      authority: "FAA", 
      number: "IR-345678",
      daysRemaining: null 
    }
  ];

  const jobOpportunities = [
    { 
      id: "JOB-2024-089", 
      route: "KTEB → KPBI", 
      date: "Dec 28", 
      aircraft: "Gulfstream G550", 
      duration: "2.8h", 
      rate: "$1,200/day", 
      status: "Available", 
      pax: "6", 
      type: "Corporate Charter",
      client: "Fortune 500 Executive",
      urgency: "High"
    },
    { 
      id: "JOB-2024-090", 
      route: "KJFK → EGLL", 
      date: "Dec 30", 
      aircraft: "Falcon 7X", 
      duration: "7.5h", 
      rate: "$1,850/day", 
      status: "Applied", 
      pax: "12", 
      type: "International",
      client: "Private Family Charter",
      urgency: "Medium"
    },
    { 
      id: "JOB-2024-091", 
      route: "KLAS → KDEN", 
      date: "Jan 2", 
      aircraft: "Citation X+", 
      duration: "2.2h", 
      rate: "$950/day", 
      status: "Available", 
      pax: "8", 
      type: "Executive",
      client: "Corporate Meeting",
      urgency: "Low"
    }
  ];

  const recentFlights = [
    { 
      date: "Dec 20", 
      route: "KTEB → KMIA", 
      aircraft: "G550", 
      duration: "2.9h", 
      role: "PIC", 
      payment: "$1,150", 
      pax: "8",
      rating: "5.0",
      client: "Excellent service"
    },
    { 
      date: "Dec 18", 
      route: "KLAX → KJFK", 
      aircraft: "Falcon 7X", 
      duration: "4.8h", 
      role: "SIC", 
      payment: "$920", 
      pax: "10",
      rating: "4.8",
      client: "Professional crew"
    },
    { 
      date: "Dec 15", 
      route: "KDFW → KLAX", 
      aircraft: "Citation X+", 
      duration: "2.5h", 
      role: "PIC", 
      payment: "$1,000", 
      pax: "6",
      rating: "5.0",
      client: "Outstanding pilot"
    }
  ];

  const upcomingSchedule = [
    { date: "Dec 28", time: "14:30", route: "KTEB → KPBI", aircraft: "G550", type: "Charter" },
    { date: "Dec 30", time: "09:15", route: "KJFK → EGLL", aircraft: "Falcon 7X", type: "International" },
    { date: "Jan 3", time: "16:00", route: "KMIA → KTEB", aircraft: "Citation X+", type: "Positioning" }
  ];

  const menuItems = [
    { id: "profile", label: "Pilot Profile", icon: User },
    { id: "verification", label: "Fortress of Trust", icon: Shield },
    { id: "jobs", label: "Job Opportunities", icon: Briefcase },
    { id: "schedule", label: "Flight Schedule", icon: Calendar },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "logbook", label: "Digital Logbook", icon: Plane },
    { id: "earnings", label: "Earnings", icon: DollarSign },
    { id: "network", label: "Professional Network", icon: Users },
    { id: "training", label: "Training Records", icon: Award },
    { id: "news", label: "Aviation News", icon: Globe }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Professional Pilot Profile</h2>
                <p className="text-gunmetal">Your aviation credentials and career dashboard</p>
              </div>
              <Badge className="bg-terminal-success/20 text-terminal-success border-terminal-success/30 text-lg px-4 py-2">
                {crewProfile.status}
              </Badge>
            </div>

            {/* Profile Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <Card className="terminal-card lg:col-span-1">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent/80 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-12 h-12 text-foreground" />
                  </div>
                  <h3 className="text-foreground font-bold text-lg mb-2">{crewProfile.name}</h3>
                  <p className="text-gunmetal text-sm mb-4">{crewProfile.license}</p>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Star className="w-5 h-5 text-accent" />
                    <span className="text-accent font-bold text-lg">{crewProfile.rating}/5.0</span>
                    <span className="text-gunmetal text-sm">({crewProfile.reviews} flights)</span>
                  </div>
                  <div className="text-gunmetal text-sm">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {crewProfile.homeBase}
                  </div>
                </CardContent>
              </Card>

              <Card className="terminal-card lg:col-span-3">
                <CardHeader className="border-b border-terminal-border">
                  <CardTitle className="flex items-center space-x-2">
                    <Plane className="w-5 h-5 text-accent" />
                    <span className="terminal-subheader">Flight Experience Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-accent text-3xl font-bold mb-2">{crewProfile.totalHours}</div>
                      <div className="text-gunmetal text-sm">Total Flight Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-accent text-3xl font-bold mb-2">{crewProfile.picHours}</div>
                      <div className="text-gunmetal text-sm">PIC Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-accent text-3xl font-bold mb-2">6</div>
                      <div className="text-gunmetal text-sm">Type Ratings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-accent text-3xl font-bold mb-2">12</div>
                      <div className="text-gunmetal text-sm">Years Experience</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <div className="text-gunmetal text-sm mb-2">Current Type Ratings</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-accent/10">G650/G650ER</Badge>
                        <Badge variant="outline" className="bg-accent/10">Falcon 7X/8X</Badge>
                        <Badge variant="outline" className="bg-accent/10">Citation X/X+</Badge>
                        <Badge variant="outline" className="bg-accent/10">G550/G500</Badge>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-gunmetal text-sm mb-2">Operating Regions</div>
                      <div className="text-foreground">Domestic US, Europe, Caribbean, Central America</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="terminal-card">
                <CardHeader className="border-b border-terminal-border">
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-terminal-success" />
                    <span className="terminal-subheader">Recent Flight Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {recentFlights.slice(0, 3).map((flight, index) => (
                      <div key={index} className="p-3 bg-terminal-bg/30 rounded border border-terminal-border/20">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-foreground text-sm">{flight.route}</div>
                          <div className="text-terminal-success font-bold text-sm">{flight.payment}</div>
                        </div>
                        <div className="text-xs text-gunmetal mb-2">
                          {flight.date} • {flight.aircraft} • {flight.duration} • {flight.role}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Star className="w-3 h-3 text-accent" />
                            <span className="text-accent text-xs">{flight.rating}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {flight.pax} PAX
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardHeader className="border-b border-terminal-border">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    <span className="terminal-subheader">Upcoming Schedule</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {upcomingSchedule.map((schedule, index) => (
                      <div key={index} className="p-3 bg-terminal-bg/30 rounded border border-terminal-border/20">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-foreground text-sm">{schedule.route}</div>
                          <Badge variant="outline" className="text-xs">
                            {schedule.type}
                          </Badge>
                        </div>
                        <div className="text-xs text-gunmetal mb-1">
                          {schedule.date} at {schedule.time} UTC
                        </div>
                        <div className="text-xs text-accent">
                          {schedule.aircraft}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "jobs":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Job Opportunities</h2>
                <p className="text-gunmetal">Professional charter and corporate flight positions</p>
              </div>
              <Button className="btn-terminal-primary" disabled>
                Job Preferences (Demo)
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {jobOpportunities.map((job) => (
                <Card key={job.id} className="terminal-card hover:border-accent/50 transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                         <div className="flex flex-col items-center">
                           <Plane className={`w-8 h-8 ${
                             job.urgency === "High" ? "text-terminal-danger" :
                             job.urgency === "Medium" ? "text-terminal-warning" : "text-terminal-success"
                           }`} />
                           <Badge variant="outline" className={`text-xs mt-1 ${
                             job.urgency === "High" ? "border-terminal-danger/50 text-terminal-danger" :
                             job.urgency === "Medium" ? "border-terminal-warning/50 text-terminal-warning" : 
                             "border-terminal-success/50 text-terminal-success"
                           }`}>
                             {job.urgency}
                           </Badge>
                         </div>
                        <div>
                          <div className="font-bold text-foreground text-lg mb-1">{job.route}</div>
                          <div className="text-gunmetal text-sm mb-2">{job.client}</div>
                          <div className="flex items-center space-x-4 text-sm text-gunmetal">
                            <span>{job.date} • {job.aircraft}</span>
                            <span>• {job.duration} • {job.pax} PAX</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-accent font-bold text-xl mb-1">{job.rate}</div>
                        <Badge className={
                          job.status === "Available" ? "bg-terminal-success/20 text-terminal-success border-terminal-success/30" :
                          "bg-terminal-info/20 text-terminal-info border-terminal-info/30"
                        }>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-accent/10">
                        {job.type}
                      </Badge>
                      <Button 
                        size="sm" 
                        className={job.status === "Available" ? "btn-terminal-success" : "btn-terminal-secondary"} 
                        disabled
                      >
                        {job.status === "Available" ? "Apply Now (Demo)" : "Applied"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "certifications":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Licenses & Certifications</h2>
                <p className="text-gunmetal">Manage your aviation credentials and renewals</p>
              </div>
              <Button className="btn-terminal-primary" disabled>
                Add Certificate (Demo)
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <Card key={index} className="terminal-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <Award className="w-6 h-6 text-accent mt-1" />
                        <div>
                          <div className="font-bold text-foreground text-lg">{cert.type}</div>
                          <div className="text-gunmetal text-sm">{cert.authority} • {cert.number}</div>
                        </div>
                      </div>
                      <Badge className="bg-terminal-success/20 text-terminal-success border-terminal-success/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {cert.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gunmetal">
                        Expires: {cert.expires}
                      </div>
                      {cert.daysRemaining && (
                        <div className={`text-sm font-medium ${
                          cert.daysRemaining < 90 ? "text-terminal-warning" : "text-terminal-success"
                        }`}>
                          {cert.daysRemaining} days remaining
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "earnings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Earnings Dashboard</h2>
              <p className="text-gunmetal">Track your flight earnings and performance metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="terminal-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-terminal-success" />
                    <span className="terminal-label">This Month</span>
                  </div>
                  <div className="text-2xl font-bold text-terminal-success mb-1">$18,750</div>
                  <div className="text-xs text-gunmetal">15 flight legs</div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Plane className="w-5 h-5 text-terminal-info" />
                    <span className="terminal-label">Flight Hours</span>
                  </div>
                  <div className="text-2xl font-bold text-terminal-info mb-1">62.5</div>
                  <div className="text-xs text-gunmetal">Last 30 days</div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-accent" />
                    <span className="terminal-label">Client Rating</span>
                  </div>
                  <div className="text-2xl font-bold text-accent mb-1">4.95</div>
                  <div className="text-xs text-gunmetal">Last 30 flights</div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-terminal-info" />
                    <span className="terminal-label">Growth</span>
                  </div>
                  <div className="text-2xl font-bold text-terminal-info mb-1">+28%</div>
                  <div className="text-xs text-gunmetal">vs last month</div>
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
                    <div key={index} className="flex justify-between items-center py-3 border-b border-terminal-border/30 last:border-0">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-center">
                          <Plane className="w-5 h-5 text-accent" />
                          <div className="text-xs text-gunmetal mt-1">{flight.duration}</div>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{flight.route}</div>
                          <div className="text-sm text-gunmetal">{flight.date} • {flight.aircraft} • {flight.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-terminal-success text-lg">{flight.payment}</div>
                        <div className="flex items-center text-accent text-sm">
                          <Star className="w-3 h-3 mr-1" />
                          {flight.rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "analytics":
        return (
          <Card className="terminal-card relative">
            <PrivacyOverlay 
              title="Career Analytics" 
              description="Access detailed career progression analytics, earnings forecasts, and professional development insights." 
              onUnlock={() => console.log('Unlock crew analytics')} 
              icon="chart" 
            />
            <CardContent className="p-12">
              <div className="text-center text-gunmetal opacity-20">
                <User className="w-16 h-16 mx-auto mb-6" />
                <p className="terminal-subheader mb-2">Professional Development Dashboard</p>
                <div className="grid grid-cols-3 gap-8 mt-8">
                  <div>
                    <div className="text-3xl font-bold mb-2">$287K</div>
                    <div className="text-sm">Annual Earnings</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">847</div>
                    <div className="text-sm">Total Flights</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">4.95</div>
                    <div className="text-sm">Avg Rating</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="terminal-card">
            <CardHeader className="border-b border-terminal-border">
              <CardTitle className="terminal-subheader capitalize flex items-center space-x-2">
                <User className="w-5 h-5 text-accent" />
                <span>{activeTab} Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-12">
              <div className="text-center text-gunmetal">
                <div className="w-16 h-16 mx-auto mb-6 opacity-30 flex items-center justify-center">
                  <User className="w-12 h-12" />
                </div>
                <p className="terminal-subheader mb-2 capitalize">Professional {activeTab}</p>
                <p className="text-sm">
                  Advanced {activeTab} management for aviation professionals
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <>
      <DemoBanner />
      <TerminalLayout 
        title="Crew Terminal"
        userRole="Aviation Professional"
        menuItems={menuItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        bannerText="Certified. Experienced. Ready. Your aviation career command center."
        terminalType="crew"
      >
        {renderContent()}
      </TerminalLayout>
    </>
  );
}