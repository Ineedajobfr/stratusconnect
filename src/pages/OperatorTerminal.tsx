import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TerminalLayout } from "@/components/TerminalLayout";
import { KPICard } from "@/components/KPICard";
import { Section } from "@/components/Section";
import { DataTile } from "@/components/DataTile";
import FleetManagement from "@/components/FleetManagement";
import EnhancedMessaging from "@/components/EnhancedMessaging";
import EnhancedMarketplace from "@/components/EnhancedMarketplace";
import VerificationSystem from "@/components/VerificationSystem";
import { AviationNews } from "@/components/AviationNews";
import { PrivacyOverlay } from "@/components/PrivacyOverlay";
import { OperatorAnalytics } from "@/components/analytics/OperatorAnalytics";
import { ProfileWidget } from "@/components/ProfileWidget";
import AuthForm from "@/components/AuthForm";
import { Plane, Calendar, DollarSign, TrendingUp, Users, MapPin, Clock, Settings, MessageSquare, BarChart3, CheckCircle, Activity, Gauge, Shield, Globe } from "lucide-react";
import { NavigationArrows } from "@/components/NavigationArrows";
import { OperatorHelpGuide } from "@/components/OperatorHelpGuide";
import type { User } from '@supabase/supabase-js';
const OperatorTerminal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>;
  }
  if (!user) {
    return <AuthForm />;
  }
  const fleetData = [{
    id: "N425SC",
    model: "Gulfstream G550",
    status: "Available",
    location: "JFK",
    nextFlight: "Tomorrow 14:00",
    utilization: "78%"
  }, {
    id: "N892AV",
    model: "Citation X+",
    status: "In Flight",
    location: "En Route MIA→LAX",
    nextFlight: "Dec 29 09:00",
    utilization: "85%"
  }, {
    id: "N156JT",
    model: "Falcon 7X",
    status: "Maintenance",
    location: "TEB",
    nextFlight: "Jan 2 Available",
    utilization: "62%"
  }];
  const bookings = [{
    id: "BKG-2024-089",
    route: "JFK → LAX",
    client: "Corporate Client",
    date: "Dec 28",
    revenue: "$45,200",
    status: "Confirmed"
  }, {
    id: "BKG-2024-090",
    route: "MIA → TEB",
    client: "Private Charter",
    date: "Dec 29",
    revenue: "$18,500",
    status: "Pending"
  }, {
    id: "BKG-2024-091",
    route: "LAX → SFO",
    client: "Executive Travel",
    date: "Dec 30",
    revenue: "$12,800",
    status: "Confirmed"
  }];
  const menuItems = [{
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3
  }, {
    id: "fleet",
    label: "Fleet Management",
    icon: Plane
  }, {
    id: "verification",
    label: "Fortress of Trust",
    icon: Shield
  }, {
    id: "marketplace",
    label: "Marketplace",
    icon: Calendar
  }, {
    id: "messages",
    label: "Messages",
    icon: MessageSquare
  }, {
    id: "news",
    label: "Aviation News",
    icon: Globe
  }, {
    id: "revenue",
    label: "Revenue",
    icon: DollarSign
  }];
  return (
    <>
      <OperatorHelpGuide activeTab={activeTab} showOnMount={true} />
      <TerminalLayout title="Operator Terminal" userRole="Verified Operator" menuItems={menuItems} activeTab={activeTab} onTabChange={setActiveTab} bannerText="Fill the legs. Lift the yield. Control the risk." terminalType="operator">
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* Command Center Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Fleet Command</h1>
              <p className="text-gunmetal mt-2">Comprehensive fleet operations and performance oversight</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-data-positive text-sm">
                <div className="w-2 h-2 bg-data-positive rounded-full terminal-pulse"></div>
                <span className="font-mono">SYSTEMS OPERATIONAL</span>
              </div>
              <div className="text-gunmetal text-sm font-mono">
                {new Date().toLocaleTimeString()} UTC
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Fleet Active"
              value="15"
              delta="12 ACTIVE • 2 FLIGHT • 1 MAINT"
              icon={Plane}
              variant="info"
            />
            <KPICard
              title="Today's Bookings"
              value="8"
              delta="+33% VS LAST WEEK"
              icon={Calendar}
              variant="success"
            />
            <KPICard
              title="Revenue (MTD)"
              value="$1.2M"
              delta="+24.8% VS LAST MONTH"
              icon={DollarSign}
              variant="warning"
            />
            <KPICard
              title="Utilization"
              value="74.5%"
              delta="ABOVE INDUSTRY AVG"
              icon={Gauge}
              variant="info"
            />
          </div>

          {/* Profile Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ProfileWidget />
          </div>

          {/* Fleet Status Overview */}
          <Section 
            title="Live Fleet Status"
            subtitle="Real-time aircraft monitoring and dispatch"
            actions={
              <Button variant="outline" size="sm" className="btn-terminal-secondary">
                <Settings className="w-4 h-4 mr-2" />
                Manage Fleet
              </Button>
            }
          >
            <div className="space-y-0">
              {fleetData.map((aircraft) => (
                <DataTile
                  key={aircraft.id}
                  title={aircraft.model}
                  subtitle={aircraft.id}
                  status={aircraft.status}
                  statusVariant={
                    aircraft.status === 'Available' ? 'success' : 
                    aircraft.status === 'In Flight' ? 'info' : 'warning'
                  }
                  metadata={[
                    {
                      label: "LOC",
                      value: aircraft.location,
                      icon: <MapPin className="w-3 h-3" />
                    },
                    {
                      label: "NEXT",
                      value: aircraft.nextFlight,
                      icon: <Clock className="w-3 h-3" />
                    },
                    {
                      label: "UTIL",
                      value: aircraft.utilization,
                      icon: <Gauge className="w-3 h-3" />
                    }
                  ]}
                  actions={[
                    { label: "Status", onClick: () => {} },
                    { label: "Manage", onClick: () => {} }
                  ]}
                />
              ))}
            </div>
          </Section>

          {/* Recent Bookings */}
          <Section 
            title="Recent Bookings"
            subtitle="Latest confirmed and pending reservations"
            actions={
              <Button variant="outline" size="sm" className="btn-terminal-secondary">
                <BarChart3 className="w-4 h-4 mr-2" />
                View All
              </Button>
            }
          >
            <div className="space-y-0">
              {bookings.map((booking) => (
                <DataTile
                  key={booking.id}
                  title={booking.route}
                  subtitle={booking.id}
                  status={booking.status}
                  statusVariant={booking.status === 'Confirmed' ? 'success' : 'warning'}
                  metadata={[
                    {
                      label: "CLIENT",
                      value: booking.client,
                      icon: <Users className="w-3 h-3" />
                    },
                    {
                      label: "DATE",
                      value: booking.date,
                      icon: <Calendar className="w-3 h-3" />
                    }
                  ]}
                  rightSlot={
                    <div className="text-right">
                      <div className="terminal-value text-data-positive font-mono mb-1">
                        {booking.revenue}
                      </div>
                      {booking.status === 'Confirmed' && (
                        <CheckCircle className="w-4 h-4 text-data-positive ml-auto" />
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          </Section>
        </div>
      )}

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

      {activeTab === "marketplace" && <EnhancedMarketplace />}

      {activeTab === "messages" && <EnhancedMessaging />}

      {activeTab === "news" && (
        <div className="space-y-6">
          <AviationNews />
        </div>
      )}

      {activeTab === "revenue" && (
        <div className="space-y-6">
          <OperatorAnalytics section="revenue" />
          <Card className="terminal-card relative">
            <PrivacyOverlay 
              title="Revenue Analytics" 
              description="Detailed financial reporting and revenue analytics require premium access. Contact support to unlock these features." 
              onUnlock={() => console.log('Unlock revenue analytics')} 
              icon="chart" 
            />
            <CardHeader className="border-b border-terminal-border">
              <CardTitle className="terminal-subheader">Revenue Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="p-12">
              <div className="text-center text-gunmetal">
                <DollarSign className="w-16 h-16 mx-auto mb-6 opacity-30" />
                <p className="terminal-subheader mb-2">Financial Analytics</p>
                <p className="text-sm font-mono">
                  Revenue analytics and financial reporting
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </TerminalLayout>
    </>
  );
};
export default OperatorTerminal;