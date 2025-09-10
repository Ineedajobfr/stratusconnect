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
import { BrokerAnalytics } from "@/components/analytics/BrokerAnalytics";
import { ProfileWidget } from "@/components/ProfileWidget";
import EnhancedMarketplace from "@/components/EnhancedMarketplace";
import EnhancedMessaging from "@/components/EnhancedMessaging";
import { BarChart3, MessageSquare, TrendingUp, DollarSign, Clock, Users, Globe, Bookmark, FileText, Settings, AlertTriangle, Star, Calendar, Shield } from "lucide-react";
import { NavigationArrows } from "@/components/NavigationArrows";

const DemoBrokerTerminal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock user data for demo
  const mockUser = {
    id: "demo-broker-001",
    email: "demo@broker.stratusconnect.com",
    user_metadata: {
      full_name: "Demo Broker",
      role: "broker",
      company: "StratusConnect Demo"
    }
  };

  const mockKPIs = [
    { title: "Active Quotes", value: "12", change: "+3", trend: "up", icon: BarChart3 },
    { title: "Closed Deals", value: "8", change: "+2", trend: "up", icon: TrendingUp },
    { title: "Revenue", value: "$2.4M", change: "+15%", trend: "up", icon: DollarSign },
    { title: "Response Time", value: "2.3m", change: "-0.5m", trend: "up", icon: Clock }
  ];

  const mockRecentActivity = [
    { id: 1, type: "quote", message: "New quote request for Gulfstream G650", time: "2 min ago", status: "pending" },
    { id: 2, type: "deal", message: "Deal closed: Citation XLS+ charter", time: "15 min ago", status: "completed" },
    { id: 3, type: "message", message: "New message from operator", time: "1 hour ago", status: "unread" },
    { id: 4, type: "alert", message: "Price alert: G550 availability", time: "2 hours ago", status: "active" }
  ];

  return (
    <TerminalLayout
      title="Broker Terminal"
      subtitle="Trading floor interface with live market data and quote management"
      user={mockUser}
      isDemo={true}
    >
      <div className="space-y-6">
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-orange-400" />
            <div>
              <h3 className="font-semibold text-orange-400">Demo Mode - Broker Terminal</h3>
              <p className="text-sm text-orange-300">This is a demonstration of the broker interface with sample data</p>
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
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
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
                    ? "bg-orange-500 text-white"
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
                <Section title="Recent Activity" icon={Clock}>
                  <div className="space-y-3">
                    {mockRecentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.status === 'completed' ? 'bg-green-400' :
                            activity.status === 'pending' ? 'bg-yellow-400' :
                            activity.status === 'unread' ? 'bg-blue-400' : 'bg-orange-400'
                          }`} />
                          <div>
                            <p className="text-sm font-medium text-white">{activity.message}</p>
                            <p className="text-xs text-slate-400">{activity.time}</p>
                          </div>
                        </div>
                        <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Quick Actions" icon={Settings}>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-12 bg-orange-500 hover:bg-orange-600 text-white">
                      <FileText className="h-4 w-4 mr-2" />
                      Create Quote
                    </Button>
                    <Button variant="outline" className="h-12 border-slate-600 text-white hover:bg-slate-700">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save Search
                    </Button>
                  </div>
                </Section>
          </div>

          <div className="space-y-6">
                <ProfileWidget user={mockUser} />
                
                <Section title="Market Alerts" icon={AlertTriangle}>
                  <div className="space-y-2">
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-sm text-yellow-300">Gulfstream G650 available in NYC</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-sm text-blue-300">Price drop: Citation XLS+</p>
                    </div>
                  </div>
                </Section>
              </div>
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
              <BrokerAnalytics />
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

export default DemoBrokerTerminal;