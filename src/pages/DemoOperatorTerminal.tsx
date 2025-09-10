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
import { OperatorAnalytics } from "@/components/analytics/OperatorAnalytics";
import { ProfileWidget } from "@/components/ProfileWidget";
import EnhancedMarketplace from "@/components/EnhancedMarketplace";
import EnhancedMessaging from "@/components/EnhancedMessaging";
import { Plane, MessageSquare, TrendingUp, DollarSign, Clock, Users, Globe, Bookmark, FileText, Settings, AlertTriangle, Star, Calendar, Shield, MapPin } from "lucide-react";
import { NavigationArrows } from "@/components/NavigationArrows";

const DemoOperatorTerminal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock user data for demo
  const mockUser = {
    id: "demo-operator-001",
    email: "demo@operator.stratusconnect.com",
    user_metadata: {
      full_name: "Demo Operator",
      role: "operator",
      company: "StratusConnect Demo Fleet"
    }
  };

  const mockKPIs = [
    { title: "Active Flights", value: "6", change: "+2", trend: "up", icon: Plane },
    { title: "Fleet Utilization", value: "78%", change: "+5%", trend: "up", icon: TrendingUp },
    { title: "Monthly Revenue", value: "$1.8M", change: "+12%", trend: "up", icon: DollarSign },
    { title: "On-Time Performance", value: "94%", change: "+2%", trend: "up", icon: Clock }
  ];

  const mockFleetData = [
    { id: 1, aircraft: "Gulfstream G650", status: "In Flight", route: "LAX → JFK", eta: "2h 15m", revenue: "$45,000" },
    { id: 2, aircraft: "Citation XLS+", status: "Available", route: "NYC", eta: "Ready", revenue: "$0" },
    { id: 3, aircraft: "Phenom 300", status: "Maintenance", route: "Hangar", eta: "4h", revenue: "$0" },
    { id: 4, aircraft: "Challenger 350", status: "Boarding", route: "MIA → LAX", eta: "30m", revenue: "$28,000" }
  ];

        return (
    <TerminalLayout
      title="Operator Terminal"
      subtitle="Mission control center with real-time fleet tracking and operations"
      user={mockUser}
      isDemo={true}
    >
      <div className="space-y-6">
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Plane className="h-5 w-5 text-blue-400" />
              <div>
              <h3 className="font-semibold text-blue-400">Demo Mode - Operator Terminal</h3>
              <p className="text-sm text-blue-300">This is a demonstration of the operator interface with sample fleet data</p>
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
              { id: "dashboard", label: "Dashboard", icon: Plane },
              { id: "fleet", label: "Fleet", icon: Users },
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
                    ? "bg-blue-500 text-white"
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
                <Section title="Fleet Status" icon={Plane}>
                  <div className="space-y-3">
                    {mockFleetData.map((aircraft) => (
                      <div key={aircraft.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${
                            aircraft.status === 'In Flight' ? 'bg-green-400' :
                            aircraft.status === 'Available' ? 'bg-blue-400' :
                            aircraft.status === 'Maintenance' ? 'bg-yellow-400' : 'bg-orange-400'
                            }`} />
                          <div>
                            <p className="font-medium text-white">{aircraft.aircraft}</p>
                            <p className="text-sm text-slate-400">{aircraft.route}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">{aircraft.eta}</p>
                          <p className="text-xs text-slate-400">{aircraft.revenue}</p>
                        </div>
                        <Badge variant={
                          aircraft.status === 'In Flight' ? 'default' :
                          aircraft.status === 'Available' ? 'secondary' :
                          aircraft.status === 'Maintenance' ? 'destructive' : 'outline'
                          }>
                            {aircraft.status}
                          </Badge>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Quick Actions" icon={Settings}>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-12 bg-blue-500 hover:bg-blue-600 text-white">
                      <FileText className="h-4 w-4 mr-2" />
                      Create Listing
                    </Button>
                    <Button variant="outline" className="h-12 border-slate-600 text-white hover:bg-slate-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Flight
                    </Button>
                  </div>
                </Section>
            </div>

              <div className="space-y-6">
                <ProfileWidget user={mockUser} />
                
                <Section title="Weather Alerts" icon={AlertTriangle}>
                  <div className="space-y-2">
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-sm text-yellow-300">Thunderstorms in NYC area</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-sm text-blue-300">Clear skies over LAX</p>
                    </div>
                  </div>
                </Section>

                <Section title="Recent Bookings" icon={Star}>
                  <div className="space-y-2">
                    <div className="p-2 bg-slate-800 rounded">
                      <p className="text-sm text-white">G650 - LAX to JFK</p>
                      <p className="text-xs text-slate-400">$45,000 • 2h ago</p>
                    </div>
                    <div className="p-2 bg-slate-800 rounded">
                      <p className="text-sm text-white">Challenger 350 - MIA to LAX</p>
                      <p className="text-xs text-slate-400">$28,000 • 4h ago</p>
                    </div>
                  </div>
                </Section>
              </div>
            </div>
          )}

          {activeTab === "fleet" && (
                  <div>
              <Section title="Fleet Management" icon={Users}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockFleetData.map((aircraft) => (
                    <Card key={aircraft.id} className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">{aircraft.aircraft}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status:</span>
                            <Badge variant={
                              aircraft.status === 'In Flight' ? 'default' :
                              aircraft.status === 'Available' ? 'secondary' :
                              aircraft.status === 'Maintenance' ? 'destructive' : 'outline'
                            }>
                              {aircraft.status}
                            </Badge>
                  </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Route:</span>
                            <span className="text-white">{aircraft.route}</span>
                  </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">ETA:</span>
                            <span className="text-white">{aircraft.eta}</span>
                  </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Revenue:</span>
                            <span className="text-green-400">{aircraft.revenue}</span>
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
              <OperatorAnalytics />
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

export default DemoOperatorTerminal;