import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TerminalLayout } from "@/components/TerminalLayout";
import { HelpGuide } from "@/components/HelpGuide";
import { NotificationSystem } from "@/components/NotificationSystem";
import { BidWorkflow } from "@/components/BidWorkflow";
import FleetManagement from "@/components/FleetManagement";
import EnhancedMarketplace from "@/components/EnhancedMarketplace";
import EnhancedMessaging from "@/components/EnhancedMessaging";
import VerificationSystem from "@/components/VerificationSystem";
import { AviationNews } from "@/components/AviationNews";
import { PrivacyOverlay } from "@/components/PrivacyOverlay";
import { OperatorAnalytics } from "@/components/analytics/OperatorAnalytics";
import { ProfileWidget } from "@/components/ProfileWidget";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { 
  Plane, Calendar, DollarSign, TrendingUp, Users, MapPin, Clock, Settings, 
  MessageSquare, BarChart3, CheckCircle, Activity, Gauge, Shield, Globe,
  AlertTriangle, Bell, Zap
} from "lucide-react";

export const EnhancedOperatorTerminal = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBidWorkflow, setShowBidWorkflow] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState(0);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeUpdates(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <div>Authentication required</div>;
  }

  const isVerified = user.verificationStatus === 'approved';

  // Mock data - in production this would come from API
  const fleetData = [
    {
      id: "N425SC",
      model: "Gulfstream G550",
      status: "Available",
      location: "KJFK",
      nextFlight: "Tomorrow 14:00",
      utilization: "78%",
      revenue: "$42,500",
      lastMaintenance: "2024-01-15"
    },
    {
      id: "N892AV",
      model: "Citation X+",
      status: "In Flight",
      location: "En Route KMIA→KLAX",
      nextFlight: "Dec 29 09:00",
      utilization: "85%",
      revenue: "$28,900",
      lastMaintenance: "2024-01-20"
    },
    {
      id: "N156JT",
      model: "Falcon 7X",
      status: "Maintenance",
      location: "KTEB",
      nextFlight: "Jan 2 Available",
      utilization: "62%",
      revenue: "$35,200",
      lastMaintenance: "2024-01-25"
    }
  ];

  const todaysBookings = [
    {
      id: "BKG-2024-089",
      route: "KJFK → KLAX",
      client: "Corporate Executive Travel",
      aircraft: "N425SC",
      departure: "14:00",
      revenue: "$45,200",
      status: "Confirmed",
      passengers: 8
    },
    {
      id: "BKG-2024-090",
      route: "KMIA → KTEB",
      client: "Private Charter Group",
      aircraft: "N892AV",
      departure: "09:00",
      revenue: "$18,500",
      status: "Boarding",
      passengers: 4
    },
    {
      id: "BKG-2024-091",
      route: "KLAX → KSFO",
      client: "Tech Startup Leadership",
      aircraft: "N425SC",
      departure: "16:30",
      revenue: "$12,800",
      status: "Confirmed",
      passengers: 6
    }
  ];

  const menuItems = [
    { id: "dashboard", label: "Command Center", icon: BarChart3 },
    { id: "fleet", label: "Fleet Management", icon: Plane },
    { id: "verification", label: "Fortress of Trust", icon: Shield },
    { id: "marketplace", label: "Marketplace", icon: Calendar },
    { id: "messages", label: "Secure Messages", icon: MessageSquare },
    { id: "news", label: "Aviation News", icon: Globe },
    { id: "revenue", label: "Revenue Analytics", icon: DollarSign }
  ];

  const renderDashboard = () => (
    <div className="terminal-section">
      <div className="terminal-container space-y-8">
        {/* System Status Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="terminal-header">Operator Command Center</h2>
            <p className="text-muted-foreground">Real-time operations overview</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-terminal-success border-terminal-success">
              <Activity className="mr-1 h-3 w-3" />
              Systems Operational
            </Badge>
            <Badge variant="outline" className="text-terminal-info border-terminal-info">
              <Zap className="mr-1 h-3 w-3" />
              {realTimeUpdates} Live Updates
            </Badge>
            <div className="text-sm text-muted-foreground font-mono">
              {new Date().toLocaleTimeString()} UTC
            </div>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="terminal-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Plane className="w-5 h-5 text-terminal-info" />
                  <span className="terminal-label">Fleet Status</span>
                </div>
                <Activity className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="terminal-metric text-terminal-info">15</div>
              <div className="text-muted-foreground text-sm font-mono">
                12 ACTIVE • 2 FLIGHT • 1 MAINT
              </div>
            </CardContent>
          </Card>

          <Card className="terminal-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-terminal-success" />
                  <span className="terminal-label">Today's Flights</span>
                </div>
                <TrendingUp className="w-4 h-4 text-terminal-success" />
              </div>
              <div className="terminal-metric text-terminal-success">8</div>
              <div className="text-muted-foreground text-sm font-mono">
                +33% VS LAST WEEK
              </div>
            </CardContent>
          </Card>

          <Card className="terminal-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-terminal-warning" />
                  <span className="terminal-label">Revenue (MTD)</span>
                </div>
                <BarChart3 className="w-4 h-4 text-terminal-warning" />
              </div>
              <div className="terminal-metric text-terminal-warning">$1.2M</div>
              <div className="text-muted-foreground text-sm font-mono">
                +24.8% VS LAST MONTH
              </div>
            </CardContent>
          </Card>

          <Card className="terminal-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Gauge className="w-5 h-5 text-primary" />
                  <span className="terminal-label">Utilization</span>
                </div>
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <div className="terminal-metric text-primary">74.5%</div>
              <div className="text-muted-foreground text-sm font-mono">
                ABOVE INDUSTRY AVG
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProfileWidget />
          </div>
          
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    className="h-16 flex-col space-y-1 border-terminal-border hover:bg-terminal-card"
                    onClick={() => setActiveTab('fleet')}
                    disabled={!isVerified}
                  >
                    <Plane className="h-5 w-5" />
                    <span className="text-xs">Add Aircraft</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex-col space-y-1 border-terminal-border hover:bg-terminal-card"
                    onClick={() => setActiveTab('marketplace')}
                    disabled={!isVerified}
                  >
                    <Calendar className="h-5 w-5" />
                    <span className="text-xs">Create Listing</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex-col space-y-1 border-terminal-border hover:bg-terminal-card"
                    onClick={() => setActiveTab('messages')}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-xs">Messages</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex-col space-y-1 border-terminal-border hover:bg-terminal-card"
                    onClick={() => setActiveTab('revenue')}
                    disabled={!isVerified}
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-xs">Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Fleet Status Overview */}
        <Card className="terminal-card">
          <CardHeader className="border-b border-terminal-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Fleet Status Overview</CardTitle>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('fleet')}
                className="border-terminal-border text-foreground hover:bg-terminal-card"
                disabled={!isVerified}
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Fleet
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {fleetData.map((aircraft, index) => (
                <div 
                  key={aircraft.id} 
                  className={`flex items-center justify-between p-6 hover:bg-terminal-card/30 transition-colors ${
                    index !== fleetData.length - 1 ? 'border-b border-terminal-border/30' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <Badge variant="outline" className="font-mono text-xs">
                        {aircraft.id}
                      </Badge>
                      <Badge className={`text-xs font-mono ${
                        aircraft.status === 'Available' ? 'status-active' : 
                        aircraft.status === 'In Flight' ? 'status-processing' : 'status-pending'
                      }`}>
                        {aircraft.status.replace(' ', '_').toUpperCase()}
                      </Badge>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Gauge className="w-3 h-3 mr-1" />
                        <span className="font-mono">UTIL: {aircraft.utilization}</span>
                      </div>
                    </div>
                    <div className="font-semibold text-foreground mb-2">{aircraft.model}</div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground font-mono">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {aircraft.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {aircraft.nextFlight}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {aircraft.revenue}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-terminal-border text-foreground hover:bg-terminal-card"
                      disabled={!isVerified}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Flight Schedule */}
        <Card className="terminal-card">
          <CardHeader className="border-b border-terminal-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Today's Flight Schedule</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-terminal-success border-terminal-success">
                  {todaysBookings.length} Active Flights
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {todaysBookings.map((booking, index) => (
                <div 
                  key={booking.id} 
                  className={`flex items-center justify-between p-6 hover:bg-terminal-card/30 transition-colors ${
                    index !== todaysBookings.length - 1 ? 'border-b border-terminal-border/30' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <Badge variant="outline" className="font-mono text-xs">
                        {booking.id}
                      </Badge>
                      <Badge className={`text-xs font-mono ${
                        booking.status === 'Confirmed' ? 'status-active' : 
                        booking.status === 'Boarding' ? 'status-processing' : 'status-pending'
                      }`}>
                        {booking.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {booking.aircraft}
                      </span>
                    </div>
                    <div className="font-semibold text-foreground mb-2">{booking.route}</div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {booking.client}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Departure: {booking.departure}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {booking.passengers} PAX
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-terminal-success mb-1">
                      {booking.revenue}
                    </div>
                    {booking.status === 'Confirmed' && (
                      <CheckCircle className="w-4 h-4 text-terminal-success ml-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      <TerminalLayout
        title="Operator Terminal"
        userRole={`${isVerified ? 'Verified' : 'Pending'} Operator`}
        menuItems={menuItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        bannerText="Fill the legs. Lift the yield. Control the risk."
        terminalType="operator"
      >
        {/* Alert for unverified users */}
        {!isVerified && (
          <div className="mb-6 p-4 bg-terminal-warning/10 border border-terminal-warning/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-terminal-warning flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-terminal-warning mb-1">
                  Verification Required
                </h4>
                <p className="text-sm text-muted-foreground">
                  Complete your Fortress of Trust verification to unlock full platform features including fleet management, marketplace listings, and revenue analytics.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('verification')}
                  className="mt-3 border-terminal-warning text-terminal-warning hover:bg-terminal-warning/10"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Start Verification
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "dashboard" && renderDashboard()}

        {activeTab === "fleet" && (
          <div className="space-y-6">
            <OperatorAnalytics section="fleet" />
            <FleetManagement />
          </div>
        )}

        {activeTab === "verification" && (
          <div className="space-y-6">
            <VerificationSystem />
          </div>
        )}

        {activeTab === "marketplace" && <div className="terminal-section"><div className="terminal-container"><EnhancedMarketplace /></div></div>}

        {activeTab === "messages" && <div className="terminal-section"><div className="terminal-container"><EnhancedMessaging /></div></div>}

        {activeTab === "news" && (
          <div className="terminal-section">
            <div className="terminal-container">
              <AviationNews />
            </div>
          </div>
        )}

        {activeTab === "revenue" && (
          <div className="terminal-section">
            <div className="space-y-6">
              <OperatorAnalytics section="revenue" />
              {!isVerified && (
                <Card className="terminal-card relative">
                  <PrivacyOverlay 
                    title="Revenue Analytics" 
                    description="Detailed financial reporting and revenue analytics require verification. Complete your Fortress of Trust verification to unlock advanced analytics features." 
                    onUnlock={() => setActiveTab('verification')} 
                    icon="chart" 
                  />
                  <CardHeader className="border-b border-terminal-border">
                    <CardTitle className="text-foreground">Advanced Revenue Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent className="p-12">
                    <div className="text-center text-muted-foreground">
                      <DollarSign className="w-16 h-16 mx-auto mb-6 opacity-30" />
                      <p className="font-semibold mb-2">Financial Analytics Suite</p>
                      <p className="text-sm">
                        Comprehensive revenue analytics and financial reporting
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </TerminalLayout>

      {/* Help Guide */}
      <HelpGuide
        page={activeTab}
        userRole="operator"
        isVerified={isVerified}
        onClose={() => setShowHelpGuide(false)}
        showOnMount={showHelpGuide}
      />

      {/* Notification System */}
      <NotificationSystem
        isVisible={showNotifications}
        onClose={() => setShowNotifications(false)}
        userRole="operator"
      />

      {/* Bid Workflow */}
      {showBidWorkflow && (
        <BidWorkflow
          aircraft={{
            id: "N425SC",
            model: "Gulfstream G550",
            tailNumber: "N425SC",
            route: "KJFK → KLAX",
            date: new Date(),
            minBid: 40000,
            askingPrice: 50000
          }}
          bids={[
            {
              id: "1",
              bidderId: "broker1",
              bidderName: "John Smith",
              bidderCompany: "Premium Charter Group",
              bidAmount: 48500,
              originalPrice: 50000,
              submittedAt: new Date(Date.now() - 2 * 60000),
              expiresAt: new Date(Date.now() + 24 * 60 * 60000),
              message: "Ready to confirm immediately. Experienced crew available.",
              bidderRating: 4.8,
              totalDeals: 127,
              verificationStatus: "verified"
            },
            {
              id: "2",
              bidderId: "broker2",
              bidderName: "Sarah Johnson",
              bidderCompany: "Elite Aviation Services",
              bidAmount: 46000,
              originalPrice: 50000,
              submittedAt: new Date(Date.now() - 15 * 60000),
              expiresAt: new Date(Date.now() + 48 * 60 * 60000),
              bidderRating: 4.6,
              totalDeals: 89,
              verificationStatus: "verified"
            }
          ]}
          onAcceptBid={(bidId, bid) => {
            console.log('Accepted bid:', bidId, bid);
            setShowBidWorkflow(false);
            setActiveTab('messages');
          }}
          onRejectBid={(bidId) => {
            console.log('Rejected bid:', bidId);
          }}
          onClose={() => setShowBidWorkflow(false)}
          demoMode={!isVerified}
        />
      )}
    </>
  );
};