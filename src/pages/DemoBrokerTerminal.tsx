import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TerminalLayout } from "@/components/TerminalLayout";
import { KPICard } from "@/components/KPICard";
import { Section } from "@/components/Section";
import { DataTile } from "@/components/DataTile";
import { DemoBanner } from "@/components/DemoBanner";
import { ProfileWidget } from "@/components/ProfileWidget";
import { PrivacyOverlay } from "@/components/PrivacyOverlay";
import { 
  BarChart3, MessageSquare, TrendingUp, DollarSign, Clock, Users, Globe, 
  Bookmark, FileText, Settings, AlertTriangle, Star, Calendar, Shield, Plane,
  MapPin, CheckCircle
} from "lucide-react";

export default function DemoBrokerTerminal() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Enhanced demo data
  const liveRequests = [
    { id: "REQ-2024-001", route: "JFK → LAX", date: "Dec 28", pax: 8, status: "Active", offers: 5, urgency: "high" },
    { id: "REQ-2024-002", route: "MIA → TEB", date: "Dec 29", pax: 4, status: "Pending", offers: 2, urgency: "medium" },
    { id: "REQ-2024-003", route: "LAX → LAS", date: "Dec 30", pax: 6, status: "Active", offers: 8, urgency: "low" },
    { id: "REQ-2024-004", route: "DFW → ORD", date: "Jan 2", pax: 3, status: "Won", offers: 12, urgency: "medium" },
    { id: "REQ-2024-005", route: "BOS → MIA", date: "Jan 3", pax: 7, status: "Active", offers: 3, urgency: "high" }
  ];

  const marketData = [
    { route: "JFK → LAX", avgPrice: "$42,000", change: "+8.2%", trend: "up", volume: 24 },
    { route: "MIA → TEB", avgPrice: "$18,500", change: "-3.1%", trend: "down", volume: 18 },
    { route: "DFW → ORD", avgPrice: "$15,200", change: "+12.5%", trend: "up", volume: 31 },
    { route: "LAX → SFO", avgPrice: "$8,900", change: "+5.7%", trend: "up", volume: 42 },
    { route: "BOS → DCA", avgPrice: "$12,400", change: "-1.8%", trend: "down", volume: 15 }
  ];

  const recentTransactions = [
    { id: "TXN-2447", route: "JFK → LAX", amount: "$45,200", commission: "$2,260", status: "Completed", date: "Dec 26" },
    { id: "TXN-2446", route: "MIA → LAS", amount: "$28,900", commission: "$1,445", status: "Processing", date: "Dec 25" },
    { id: "TXN-2445", route: "LAX → SFO", amount: "$12,800", commission: "$640", status: "Completed", date: "Dec 24" },
    { id: "TXN-2444", route: "DFW → ATL", amount: "$22,100", commission: "$1,105", status: "Completed", date: "Dec 23" },
    { id: "TXN-2443", route: "BOS → JFK", amount: "$9,500", commission: "$475", status: "Completed", date: "Dec 22" }
  ];

  const emptyLegs = [
    { route: "JFK → LAX", aircraft: "G650", price: "$38K", available: "Today 14:00", operator: "Elite Aviation", savings: "25%" },
    { route: "MIA → TEB", aircraft: "Citation X", price: "$16K", available: "Tomorrow 09:00", operator: "Charter Pro", savings: "18%" },
    { route: "DFW → LAS", aircraft: "Falcon 7X", price: "$24K", available: "Dec 30", operator: "Executive Jets", savings: "32%" },
    { route: "LAX → SFO", aircraft: "Citation Sovereign", price: "$7K", available: "Jan 2", operator: "West Coast Charter", savings: "28%" }
  ];

  const topOperators = [
    { operator: "Elite Aviation", aircraft: "G650", location: "JFK", rating: 4.9, response: "2m", deals: 47 },
    { operator: "Charter Pro", aircraft: "Citation Sovereign", location: "MIA", rating: 4.8, response: "5m", deals: 34 },
    { operator: "Executive Jets", aircraft: "Falcon 2000", location: "LAX", rating: 4.7, response: "8m", deals: 28 },
    { operator: "Premier Flight", aircraft: "G550", location: "DFW", rating: 4.9, response: "3m", deals: 52 }
  ];

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "marketplace", label: "Marketplace", icon: Globe },
    { id: "verification", label: "Fortress of Trust", icon: Shield },
    { id: "requests", label: "My Requests", icon: FileText },
    { id: "quotes", label: "Quotes", icon: DollarSign },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "directory", label: "Directory", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "transactions", label: "Transactions", icon: DollarSign },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
    { id: "saved", label: "Saved Jets", icon: Bookmark },
    { id: "profile", label: "Profile", icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            {/* Broker Command Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Broker Command Center</h1>
                <p className="text-gunmetal mt-2">Real-time marketplace intelligence and quote management</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-data-positive text-sm">
                  <div className="w-2 h-2 bg-data-positive rounded-full terminal-pulse"></div>
                  <span className="font-mono">MARKET ACTIVE</span>
                </div>
                <div className="text-gunmetal text-sm font-mono">
                  {new Date().toLocaleTimeString()} UTC
                </div>
              </div>
            </div>

            {/* KPI Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Active Requests"
                value="32"
                delta="+18% this week"
                icon={FileText}
                variant="info"
              />
              <KPICard
                title="Quotes Sent"
                value="186"
                delta="78% win rate"
                icon={DollarSign}
                variant="success"
              />
              <KPICard
                title="Avg Response"
                value="4.2m"
                delta="Industry leading"
                icon={Clock}
                variant="warning"
              />
              <KPICard
                title="Revenue (MTD)"
                value="$127K"
                delta="+34% vs last month"
                icon={TrendingUp}
                variant="success"
              />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ProfileWidget />
              
              <Section 
                title="Empty Legs Near Me"
                subtitle="Hot deals and repositioning flights"
                actions={
                  <Badge className="status-active">Live Feed</Badge>
                }
              >
                <div className="space-y-0">
                  {emptyLegs.map((leg, index) => (
                    <DataTile
                      key={index}
                      title={leg.route}
                      subtitle={`${leg.aircraft} • ${leg.available}`}
                      metadata={[
                        {
                          label: "SAVE",
                          value: leg.savings,
                          icon: <TrendingUp className="w-3 h-3" />
                        }
                      ]}
                      rightSlot={
                        <div className="text-right">
                          <div className="text-accent font-bold text-lg mb-1">{leg.price}</div>
                          <Button size="sm" className="btn-terminal-accent text-xs">Quote Now</Button>
                        </div>
                      }
                    />
                  ))}
                </div>
              </Section>

              <Section 
                title="Top Operators"
                subtitle="Fastest response times this week"
                actions={
                  <Button variant="outline" size="sm" className="btn-terminal-secondary">
                    <Users className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                }
              >
                <div className="space-y-0">
                  {topOperators.map((op, index) => (
                    <DataTile
                      key={index}
                      title={op.operator}
                      subtitle={`${op.aircraft} • ${op.location}`}
                      metadata={[
                        {
                          label: "RESP",
                          value: op.response,
                          icon: <Clock className="w-3 h-3" />
                        },
                        {
                          label: "DEALS",
                          value: op.deals.toString(),
                          icon: <CheckCircle className="w-3 h-3" />
                        }
                      ]}
                      rightSlot={
                        <div className="text-right">
                          <div className="flex items-center text-accent text-sm mb-1">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            {op.rating}
                          </div>
                          <Button size="sm" className="btn-terminal-secondary text-xs">Contact</Button>
                        </div>
                      }
                    />
                  ))}
                </div>
              </Section>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Section 
                title="Live Requests"
                subtitle="Active charter requests requiring quotes"
                actions={
                  <Badge className="status-processing">5 Urgent</Badge>
                }
              >
                <div className="space-y-0">
                  {liveRequests.slice(0, 4).map((request) => (
                    <DataTile
                      key={request.id}
                      title={request.route}
                      subtitle={request.id}
                      status={request.status}
                      statusVariant={
                        request.status === 'Won' ? 'success' : 
                        request.status === 'Active' ? 'info' : 'warning'
                      }
                      metadata={[
                        {
                          label: "PAX",
                          value: request.pax.toString(),
                          icon: <Users className="w-3 h-3" />
                        },
                        {
                          label: "OFFERS",
                          value: request.offers.toString(),
                          icon: <FileText className="w-3 h-3" />
                        },
                        {
                          label: "DATE",
                          value: request.date,
                          icon: <Calendar className="w-3 h-3" />
                        }
                      ]}
                      rightSlot={
                        request.urgency === 'high' && (
                          <Badge className="status-error">Urgent</Badge>
                        )
                      }
                    />
                  ))}
                </div>
              </Section>

              <Section 
                title="Recent Transactions"
                subtitle="Commission earnings and completed deals"
                actions={
                  <div className="text-right">
                    <div className="text-data-positive font-bold">$6,925</div>
                    <div className="text-xs text-gunmetal">This week</div>
                  </div>
                }
              >
                <div className="space-y-0">
                  {recentTransactions.slice(0, 4).map((txn) => (
                    <DataTile
                      key={txn.id}
                      title={txn.route}
                      subtitle={`${txn.id} • ${txn.date}`}
                      status={txn.status}
                      statusVariant={txn.status === 'Completed' ? 'success' : 'info'}
                      metadata={[
                        {
                          label: "DEAL",
                          value: txn.amount,
                          icon: <DollarSign className="w-3 h-3" />
                        }
                      ]}
                      rightSlot={
                        <div className="text-right">
                          <div className="text-data-positive font-bold">{txn.commission}</div>
                          <div className="text-xs text-gunmetal">Commission</div>
                        </div>
                      }
                    />
                  ))}
                </div>
              </Section>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-8">
            {/* Analytics Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Performance Analytics</h1>
                <p className="text-gunmetal mt-2">Comprehensive business intelligence and market insights</p>
              </div>
            </div>

            {/* Performance KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Success Rate"
                value="94.2%"
                delta="Industry leading"
                icon={TrendingUp}
                variant="success"
              />
              <KPICard
                title="Commission MTD"
                value="$84K"
                delta="+67% vs last month"
                icon={DollarSign}
                variant="success"
              />
              <KPICard
                title="Active Clients"
                value="247"
                delta="18 new this month"
                icon={Users}
                variant="info"
              />
              <KPICard
                title="Market Share"
                value="12.4%"
                delta="Top 3 in region"
                icon={Globe}
                variant="info"
              />
            </div>

            {/* Market Intelligence */}
            <Section 
              title="Market Intelligence"
              subtitle="Real-time pricing and demand analytics"
            >
              <div className="space-y-0">
                {marketData.map((market, index) => (
                  <DataTile
                    key={index}
                    title={market.route}
                    subtitle={`${market.volume} flights this month`}
                    metadata={[
                      {
                        label: "AVG",
                        value: market.avgPrice,
                        icon: <DollarSign className="w-3 h-3" />
                      },
                      {
                        label: "CHANGE",
                        value: market.change,
                        icon: market.trend === 'up' ? 
                          <TrendingUp className="w-3 h-3 text-data-positive" /> : 
                          <TrendingUp className="w-3 h-3 text-data-negative rotate-180" />
                      }
                    ]}
                    rightSlot={
                      <Badge className={market.trend === 'up' ? 'status-active' : 'status-error'}>
                        {market.trend === 'up' ? 'Hot' : 'Cool'}
                      </Badge>
                    }
                  />
                ))}
              </div>
            </Section>
          </div>
        );

      case "requests":
        return (
          <div className="space-y-6">
            <Section 
              title="My Requests"
              subtitle="Manage your charter requests and quotes"
              actions={
                <Button className="btn-terminal-accent">
                  <FileText className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              }
            >
              <div className="space-y-0">
                {liveRequests.map((request) => (
                  <DataTile
                    key={request.id}
                    title={request.route}
                    subtitle={request.id}
                    status={request.status}
                    statusVariant={
                      request.status === 'Won' ? 'success' : 
                      request.status === 'Active' ? 'info' : 'warning'
                    }
                    metadata={[
                      {
                        label: "PAX",
                        value: request.pax.toString(),
                        icon: <Users className="w-3 h-3" />
                      },
                      {
                        label: "OFFERS",
                        value: request.offers.toString(),
                        icon: <FileText className="w-3 h-3" />
                      },
                      {
                        label: "DATE",
                        value: request.date,
                        icon: <Calendar className="w-3 h-3" />
                      }
                    ]}
                    actions={[
                      { label: "View", onClick: () => {} },
                      { label: "Edit", onClick: () => {} }
                    ]}
                  />
                ))}
              </div>
            </Section>
          </div>
        );

      default:
        return (
          <Section 
            title={`${activeTab.charAt(0).toUpperCase()}${activeTab.slice(1)} Center`}
            subtitle={`Advanced ${activeTab} management and processing`}
          >
            <div className="text-center text-gunmetal py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-6 opacity-30" />
              <p className="terminal-subheader mb-2 capitalize">{activeTab} Management</p>
              <p className="text-sm">
                This section will contain advanced {activeTab} management tools and analytics.
              </p>
            </div>
          </Section>
        );
    }
  };

  return (
    <>
      <DemoBanner />
      <TerminalLayout 
        title="Broker Terminal"
        userRole="Charter Broker"
        menuItems={menuItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        bannerText="Speed creates advantage. Win more quotes with a cleaner cockpit."
        terminalType="broker"
      >
        {renderContent()}
      </TerminalLayout>
    </>
  );
}