import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TerminalLayout } from "@/components/TerminalLayout";
import { KPICard } from "@/components/KPICard";
import { Section } from "@/components/Section";
import { DataTile } from "@/components/DataTile";
import VerificationSystem from "@/components/VerificationSystem";
import { PrivacyOverlay } from "@/components/PrivacyOverlay";
import { CrewAnalytics } from "@/components/analytics/CrewAnalytics";
import { ProfileWidget } from "@/components/ProfileWidget";
import EnhancedMarketplace from "@/components/EnhancedMarketplace";
import EnhancedMessaging from "@/components/EnhancedMessaging";
import { Users, MessageSquare, TrendingUp, DollarSign, Clock, Plane, Globe, Bookmark, FileText, Settings, AlertTriangle, Star, Calendar, Shield, Heart } from "lucide-react";
import { NavigationArrows } from "@/components/NavigationArrows";

const DemoCrewTerminal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock user data for demo
  const mockUser = {
    id: "demo-crew-001",
    email: "demo@crew.stratusconnect.com",
    user_metadata: {
      full_name: "Demo Crew Member",
      role: "crew",
      company: "StratusConnect Demo"
    }
  };

  const mockKPIs = [
    { title: "Flight Hours", value: "1,245", change: "+32", trend: "up", icon: Clock },
    { title: "Available Hours", value: "80", change: "+12", trend: "up", icon: TrendingUp },
    { title: "Monthly Earnings", value: "$8,500", change: "+15%", trend: "up", icon: DollarSign },
    { title: "Customer Rating", value: "4.8/5", change: "+0.2", trend: "up", icon: Star }
  ];

  const mockAssignments = [
    { id: 1, date: "Today", aircraft: "Gulfstream G650", route: "LAX → JFK", time: "14:30", status: "Confirmed", passengers: 4 },
    { id: 2, date: "Tomorrow", aircraft: "Citation XLS+", route: "JFK → MIA", time: "09:15", status: "Pending", passengers: 2 },
    { id: 3, date: "Dec 15", aircraft: "Challenger 350", route: "MIA → LAX", time: "16:45", status: "Available", passengers: 6 },
    { id: 4, date: "Dec 18", aircraft: "Phenom 300", route: "LAX → SFO", time: "11:20", status: "Available", passengers: 3 }
  ];

  const mockCertifications = [
    { name: "Cabin Safety", status: "Valid", expiry: "2025-12-31", icon: Shield },
    { name: "First Aid", status: "Current", expiry: "2025-08-15", icon: Heart },
    { name: "Emergency Procedures", status: "Current", expiry: "2025-06-20", icon: AlertTriangle },
    { name: "Service Excellence", status: "Current", expiry: "2025-09-10", icon: Star }
  ];

        return (
    <TerminalLayout
      title="Crew Terminal"
      subtitle="Professional flight deck with crew coordination and safety monitoring"
      user={mockUser}
      isDemo={true}
    >
      <div className="space-y-6">
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-purple-400" />
              <div>
              <h3 className="font-semibold text-purple-400">Demo Mode - Crew Terminal</h3>
              <p className="text-sm text-purple-300">This is a demonstration of the crew interface with sample assignment data</p>
            </div>
                    </div>
                  </div>
                  
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockKPIs.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              trend={kpi.trend}
              icon={kpi.icon}
            />
          ))}
                    </div>
                    
        {/* Main Content Tabs */}
        <div className="space-y-6">
          <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
            {[
              { id: "dashboard", label: "Dashboard", icon: Users },
              { id: "assignments", label: "Assignments", icon: Calendar },
              { id: "certifications", label: "Certifications", icon: Shield },
              { id: "marketplace", label: "Marketplace", icon: Globe },
              { id: "messaging", label: "Messaging", icon: MessageSquare },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
              { id: "verification", label: "Verification", icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-purple-500 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
            </div>

          {/* Tab Content */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Section title="Upcoming Assignments" icon={Calendar}>
                  <div className="space-y-3">
                    {mockAssignments.slice(0, 3).map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${
                            assignment.status === 'Confirmed' ? 'bg-green-400' :
                            assignment.status === 'Pending' ? 'bg-yellow-400' : 'bg-blue-400'
                          }`} />
                          <div>
                            <p className="font-medium text-white">{assignment.aircraft}</p>
                            <p className="text-sm text-slate-400">{assignment.route} • {assignment.time} • {assignment.passengers} pax</p>
                        </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">{assignment.date}</p>
                          <Badge variant={
                            assignment.status === 'Confirmed' ? 'default' :
                            assignment.status === 'Pending' ? 'secondary' : 'outline'
                          }>
                            {assignment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Quick Actions" icon={Settings}>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-12 bg-purple-500 hover:bg-purple-600 text-white">
                      <FileText className="h-4 w-4 mr-2" />
                      Update Availability
                    </Button>
                    <Button variant="outline" className="h-12 border-slate-600 text-white hover:bg-slate-700">
                      <Bookmark className="h-4 w-4 mr-2" />
                      View Opportunities
                    </Button>
                        </div>
                </Section>
                        </div>

              <div className="space-y-6">
                <ProfileWidget user={mockUser} />
                
                <Section title="Safety Alerts" icon={AlertTriangle}>
                  <div className="space-y-2">
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-sm text-yellow-300">Turbulence expected on JFK route</p>
                        </div>
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-sm text-green-300">All safety checks completed</p>
                      </div>
                  </div>
                </Section>

                <Section title="Recent Earnings" icon={DollarSign}>
                  <div className="space-y-2">
                    <div className="p-2 bg-slate-800 rounded">
                      <p className="text-sm text-white">G650 - LAX to JFK</p>
                      <p className="text-xs text-green-400">$1,200 • Today</p>
                    </div>
                    <div className="p-2 bg-slate-800 rounded">
                      <p className="text-sm text-white">Citation XLS+ - JFK to MIA</p>
                      <p className="text-xs text-green-400">$800 • Yesterday</p>
            </div>
          </div>
                </Section>
              </div>
            </div>
          )}

          {activeTab === "assignments" && (
            <div>
              <Section title="Flight Assignments" icon={Calendar}>
                <div className="space-y-3">
                  {mockAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          assignment.status === 'Confirmed' ? 'bg-green-400' :
                          assignment.status === 'Pending' ? 'bg-yellow-400' : 'bg-blue-400'
                           }`} />
                        <div>
                          <p className="font-medium text-white">{assignment.aircraft}</p>
                          <p className="text-sm text-slate-400">{assignment.route} • {assignment.passengers} passengers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{assignment.date} • {assignment.time}</p>
                        <Badge variant={
                          assignment.status === 'Confirmed' ? 'default' :
                          assignment.status === 'Pending' ? 'secondary' : 'outline'
                        }>
                          {assignment.status}
                        </Badge>
                      </div>
                    </div>
              ))}
            </div>
              </Section>
            </div>
          )}

          {activeTab === "certifications" && (
                        <div>
              <Section title="Certifications & Training" icon={Shield}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockCertifications.map((cert, index) => (
                    <Card key={index} className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <cert.icon className="h-5 w-5 text-purple-400" />
                          {cert.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status:</span>
                            <Badge variant={cert.status === 'Valid' || cert.status === 'Current' ? 'default' : 'destructive'}>
                        {cert.status}
                      </Badge>
                    </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Expires:</span>
                            <span className="text-white">{cert.expiry}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
              </Section>
          </div>
          )}

          {activeTab === "marketplace" && (
            <div>
              <EnhancedMarketplace user={mockUser} />
            </div>
          )}

          {activeTab === "messaging" && (
            <div>
              <EnhancedMessaging user={mockUser} />
            </div>
          )}

          {activeTab === "analytics" && (
                        <div>
              <CrewAnalytics />
                        </div>
          )}

          {activeTab === "verification" && (
                  <div>
              <VerificationSystem user={mockUser} />
                  </div>
          )}
                  </div>
                </div>
    </TerminalLayout>
  );
};

export default DemoCrewTerminal;