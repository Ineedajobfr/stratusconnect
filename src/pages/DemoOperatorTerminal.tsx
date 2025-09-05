import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TerminalLayout } from "@/components/TerminalLayout";
import { DemoBanner } from "@/components/DemoBanner";
import { PrivacyOverlay } from "@/components/PrivacyOverlay";
import { 
  Plane, Calendar, DollarSign, TrendingUp, Users, MapPin, Clock, Settings, 
  MessageSquare, BarChart3, CheckCircle, Activity, Gauge, Fuel, AlertTriangle, Globe, Shield, 
  Wrench, Navigation 
} from "lucide-react";

export default function DemoOperatorTerminal() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Enhanced demo data for operator focus
  const fleetStatus = [
    { 
      id: "N425SC", 
      model: "Gulfstream G550", 
      status: "Available", 
      location: "KJFK - New York", 
      nextFlight: "Tomorrow 14:00 UTC", 
      utilization: "78%",
      flightHours: "348.2",
      revenue: "$89,400"
    },
    { 
      id: "N892AV", 
      model: "Citation X+", 
      status: "In Flight", 
      location: "En Route KMIA→KLAX", 
      nextFlight: "Dec 29 09:00 UTC", 
      utilization: "85%",
      flightHours: "412.7", 
      revenue: "$72,800"
    },
    { 
      id: "N156JT", 
      model: "Falcon 7X", 
      status: "Maintenance", 
      location: "KTEB - Teterboro", 
      nextFlight: "Jan 2 Available", 
      utilization: "62%",
      flightHours: "289.1",
      revenue: "$45,200"
    }
  ];

  const operationsData = [
    { flight: "SC425", route: "KJFK → KLAX", status: "Boarding", departure: "14:30", aircraft: "G550", pax: "8" },
    { flight: "SC892", route: "KMIA → KTEB", status: "En Route", arrival: "16:45", aircraft: "Citation X+", pax: "4" },
    { flight: "SC156", route: "KLAS → KDEN", status: "Scheduled", departure: "Tomorrow 09:00", aircraft: "Falcon 7X", pax: "12" }
  ];

  const maintenanceAlerts = [
    { aircraft: "N425SC", type: "100-Hour Inspection", due: "Jan 15, 2025", priority: "Medium" },
    { aircraft: "N892AV", type: "Annual Inspection", due: "Mar 2, 2025", priority: "Low" },
    { aircraft: "N156JT", type: "Avionics Update", due: "Current", priority: "High" }
  ];

  const menuItems = [
    { id: "dashboard", label: "Operations Center", icon: Activity },
    { id: "fleet", label: "Fleet Management", icon: Plane },
    { id: "dispatch", label: "Flight Dispatch", icon: Navigation },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "crew", label: "Crew Scheduling", icon: Users },
    { id: "bookings", label: "Charter Bookings", icon: Calendar },
    { id: "marketplace", label: "Marketplace", icon: TrendingUp },
    { id: "messages", label: "Communications", icon: MessageSquare },
    { id: "analytics", label: "Performance Analytics", icon: BarChart3 },
    { id: "compliance", label: "Compliance Center", icon: Shield },
    { id: "news", label: "Aviation News", icon: Globe }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            {/* Operations Status Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Operations Control Center</h2>
                <p className="text-gunmetal">Real-time fleet operations and performance monitoring</p>
              </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-terminal-success text-sm font-mono">
                      <div className="w-3 h-3 bg-terminal-success rounded-full terminal-pulse"></div>
                      <span>ALL SYSTEMS OPERATIONAL</span>
                    </div>
                <div className="text-gunmetal text-sm font-mono">
                  {new Date().toLocaleString('en-US', { 
                    timeZone: 'UTC', 
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                  })} UTC
                </div>
              </div>
            </div>

            {/* Key Operations Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="terminal-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Plane className="w-6 h-6 text-terminal-info" />
                    <Badge variant="outline" className="text-terminal-info border-terminal-info/30">FLEET</Badge>
                  </div>
                  <div className="text-2xl font-bold text-terminal-info mb-1">8</div>
                  <div className="text-xs text-gunmetal">6 Active • 1 Maint • 1 Standby</div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <DollarSign className="w-6 h-6 text-terminal-success" />
                    <Badge variant="outline" className="text-terminal-success border-terminal-success/30">REVENUE</Badge>
                  </div>
                  <div className="text-2xl font-bold text-terminal-success mb-1">$1.2M</div>
                  <div className="text-xs text-gunmetal">+22% vs last month</div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Gauge className="w-6 h-6 text-terminal-warning" />
                    <Badge variant="outline" className="text-terminal-warning border-terminal-warning/30">UTIL</Badge>
                  </div>
                  <div className="text-2xl font-bold text-terminal-warning mb-1">74%</div>
                  <div className="text-xs text-gunmetal">Above industry avg</div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Calendar className="w-6 h-6 text-accent" />
                    <Badge variant="outline" className="text-accent border-accent/30">SCHED</Badge>
                  </div>
                  <div className="text-2xl font-bold text-accent mb-1">24</div>
                  <div className="text-xs text-gunmetal">Next 30 days</div>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Clock className="w-6 h-6 text-terminal-info" />
                    <Badge variant="outline" className="text-terminal-info border-terminal-info/30">OTP</Badge>
                  </div>
                  <div className="text-2xl font-bold text-terminal-info mb-1">96.2%</div>
                  <div className="text-xs text-gunmetal">On-time performance</div>
                </CardContent>
              </Card>
            </div>

            {/* Live Operations Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Fleet Status */}
              <Card className="terminal-card xl:col-span-2">
                <CardHeader className="border-b border-terminal-border">
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-terminal-info" />
                    <span className="terminal-subheader">Live Fleet Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {fleetStatus.map((aircraft) => (
                      <div key={aircraft.id} className="flex items-center justify-between p-4 bg-terminal-bg/50 rounded-lg border border-terminal-border/30">
                        <div className="flex items-center space-x-4">
                          <div className="flex flex-col items-center">
                            <Plane className={`w-6 h-6 ${
                              aircraft.status === "Available" ? "text-terminal-success" :
                              aircraft.status === "In Flight" ? "text-terminal-info" : "text-terminal-warning"
                            }`} />
                            <div className="text-xs text-gunmetal mt-1">{aircraft.utilization}</div>
                          </div>
                          <div>
                            <div className="font-bold text-foreground">{aircraft.id}</div>
                            <div className="text-sm text-gunmetal">{aircraft.model}</div>
                            <div className="text-xs text-gunmetal">{aircraft.location}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={
                            aircraft.status === "Available" ? "bg-terminal-success/20 text-terminal-success border-terminal-success/30" :
                            aircraft.status === "In Flight" ? "bg-terminal-info/20 text-terminal-info border-terminal-info/30" :
                            "bg-terminal-warning/20 text-terminal-warning border-terminal-warning/30"
                          }>
                            {aircraft.status}
                          </Badge>
                          <div className="text-xs text-gunmetal mt-1">{aircraft.nextFlight}</div>
                          <div className="text-xs text-accent font-medium">{aircraft.revenue} MTD</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Operations */}
              <Card className="terminal-card">
                <CardHeader className="border-b border-terminal-border">
                  <CardTitle className="flex items-center space-x-2">
                    <Navigation className="w-5 h-5 text-accent" />
                    <span className="terminal-subheader">Active Operations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {operationsData.map((op, index) => (
                      <div key={index} className="p-3 bg-terminal-bg/30 rounded border border-terminal-border/20">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-foreground text-sm">{op.flight}</div>
                          <Badge variant="outline" className="text-xs">
                            {op.pax} PAX
                          </Badge>
                        </div>
                        <div className="text-sm text-gunmetal mb-1">{op.route}</div>
                        <div className="text-xs text-gunmetal">{op.aircraft}</div>
                        <div className="flex justify-between items-center mt-2">
                          <Badge className={
                            op.status === "Boarding" ? "bg-terminal-warning/20 text-terminal-warning border-terminal-warning/30" :
                            op.status === "En Route" ? "bg-terminal-info/20 text-terminal-info border-terminal-info/30" :
                            "bg-terminal-success/20 text-terminal-success border-terminal-success/30"
                          }>
                            {op.status}
                          </Badge>
                          <div className="text-xs text-accent font-mono">
                            {op.departure || op.arrival}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Maintenance & Performance Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="terminal-card">
                <CardHeader className="border-b border-terminal-border">
                  <CardTitle className="flex items-center space-x-2">
                    <Wrench className="w-5 h-5 text-terminal-warning" />
                    <span className="terminal-subheader">Maintenance Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {maintenanceAlerts.map((alert, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-terminal-border/30 last:border-0">
                        <div>
                          <div className="font-medium text-foreground text-sm">{alert.aircraft}</div>
                          <div className="text-xs text-gunmetal">{alert.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gunmetal">{alert.due}</div>
                          <Badge className={
                            alert.priority === "High" ? "bg-terminal-danger/20 text-terminal-danger border-terminal-danger/30" :
                            alert.priority === "Medium" ? "bg-terminal-warning/20 text-terminal-warning border-terminal-warning/30" :
                            "bg-terminal-success/20 text-terminal-success border-terminal-success/30"
                          }>
                            {alert.priority}
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
                    <BarChart3 className="w-5 h-5 text-terminal-success" />
                    <span className="terminal-subheader">Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2">
                      <span className="text-gunmetal text-sm">Revenue/Flight Hour</span>
                      <span className="text-terminal-success font-medium text-sm">$4,250</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gunmetal text-sm">Customer Satisfaction</span>
                      <span className="text-terminal-success font-medium text-sm">4.8/5.0</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gunmetal text-sm">Fuel Efficiency</span>
                      <span className="text-terminal-warning font-medium text-sm">94.5%</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gunmetal text-sm">Safety Score</span>
                      <span className="text-terminal-success font-medium text-sm">99.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "analytics":
        return (
          <Card className="terminal-card relative">
            <PrivacyOverlay 
              title="Advanced Fleet Analytics" 
              description="Access comprehensive fleet performance analytics, utilization reports, and predictive maintenance insights." 
              onUnlock={() => console.log('Unlock fleet analytics')} 
              icon="chart" 
            />
            <CardContent className="p-12">
              <div className="text-center text-gunmetal opacity-20">
                <BarChart3 className="w-16 h-16 mx-auto mb-6" />
                <p className="terminal-subheader mb-2">Fleet Performance Dashboard</p>
                <div className="grid grid-cols-3 gap-8 mt-8">
                  <div>
                    <div className="text-3xl font-bold mb-2">$1.2M</div>
                    <div className="text-sm">Monthly Revenue</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">847</div>
                    <div className="text-sm">Flight Hours</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">96.2%</div>
                    <div className="text-sm">On-Time Rate</div>
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
                <Activity className="w-5 h-5 text-terminal-info" />
                <span>{activeTab} Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-12">
              <div className="text-center text-gunmetal">
                <div className="w-16 h-16 mx-auto mb-6 opacity-30 flex items-center justify-center">
                  <Plane className="w-12 h-12" />
                </div>
                <p className="terminal-subheader mb-2 capitalize">{activeTab} Operations</p>
                <p className="text-sm">
                  Professional fleet {activeTab} and operational control systems
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
        title="Operator Terminal"
        userRole="Aircraft Operator"
        menuItems={menuItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        bannerText="Optimize. Execute. Deliver. Maximum efficiency at every altitude."
        terminalType="operator"
      >
        {renderContent()}
      </TerminalLayout>
    </>
  );
}