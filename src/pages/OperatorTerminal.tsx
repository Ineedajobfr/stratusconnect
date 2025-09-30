import AdvancedSearch from "@/components/AdvancedSearch";
import { OperatorAnalytics } from "@/components/analytics/OperatorAnalytics";
import AuthForm from "@/components/AuthForm";
import { AviationNews } from "@/components/AviationNews";
import CommunicationTools from "@/components/CommunicationTools";
import { DataTile } from "@/components/DataTile";
import DocumentManagement from "@/components/DocumentManagement";
import EnhancedMarketplace from "@/components/EnhancedMarketplace";
import EnhancedMessaging from "@/components/EnhancedMessaging";
import { PersonalizedFeed } from "@/components/feed/PersonalizedFeed";
import FleetManagement from "@/components/FleetManagement";
import { FlightRadar24Widget } from "@/components/flight-tracking/FlightRadar24Widget";
import { KPICard } from "@/components/KPICard";
import { ModernHelpGuide } from "@/components/ModernHelpGuide";
import NoteTakingSystem from "@/components/NoteTakingSystem";
import { PrivacyOverlay } from "@/components/PrivacyOverlay";
import { ProfileWidget } from "@/components/ProfileWidget";
import RealTimeFlightTracker from "@/components/RealTimeFlightTracker";
import { Section } from "@/components/Section";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VerificationSystem from "@/components/VerificationSystem";
import { supabase } from "@/integrations/supabase/client";
import type { User } from '@supabase/supabase-js';
import { Activity, ArrowUp, BarChart3, Calendar, DollarSign, FileText, Globe, HelpCircle, MessageSquare, Navigation, Plane, Plus, RefreshCw, Search, Settings, Shield, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OperatorTerminal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isBetaMode = location.pathname.startsWith('/beta/');

  useEffect(() => {
    if (isBetaMode) {
      // Beta mode - create mock user
      setUser({
        id: 'beta-operator-user',
        email: 'beta.operator@stratusconnect.org',
        user_metadata: {
          full_name: 'Beta Operator',
          role: 'operator'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as User);
      setLoading(false);
      return;
    }

    // Regular auth mode
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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [isBetaMode]);

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>;
  }

  if (!user && !isBetaMode) {
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
    model: "Bombardier Challenger 350",
    status: "In Flight",
    location: "LAX",
    nextFlight: "Landing 16:30",
    utilization: "85%"
  }, {
    id: "N156JT",
    model: "Cessna Citation X",
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
    id: "analytics",
    label: "Analytics",
    icon: TrendingUp
  }, {
    id: "profile",
    label: "Profile",
    icon: Users
  }, {
    id: "settings",
    label: "Settings",
    icon: Settings
  }, {
    id: "privacy",
    label: "Privacy",
    icon: Shield
  }, {
    id: "help",
    label: "Help",
    icon: BarChart3
  }, {
    id: "revenue",
    label: "Revenue",
    icon: DollarSign
  }];

  return (
    <>
      {showHelpGuide && (
        <ModernHelpGuide 
          terminalType="operator" 
          activeTab={activeTab} 
          showOnMount={false} 
          isDemo={false}
          onClose={() => setShowHelpGuide(false)}
        />
      )}
      <div className="min-h-screen relative overflow-hidden">
        {/* Cinematic Burnt Orange to Obsidian Gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
          }}
        />
        
        {/* Cinematic Vignette - Creates spotlight effect on center */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.3) 80%, rgba(0, 0, 0, 0.6) 100%)',
          }}
        />
        
        {/* Subtle golden-orange glow in the center */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at center, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.04) 30%, transparent 60%)',
          }}
        />
        
        {/* Subtle grid pattern overlay - more refined */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgTCAwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] opacity-30"></div>
        </div>
        
        {/* Terminal Header */}
        <div className="relative z-10 bg-terminal-card border-b border-terminal-border backdrop-blur-modern">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <StratusConnectLogo className="text-2xl" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Operator Terminal</h1>
                  <p className="text-sm text-gunmetal">Fleet management and operations platform</p>
                </div>
                <div className="flex items-center space-x-2 text-data-positive text-sm">
                  <div className="w-2 h-2 bg-data-positive rounded-full terminal-pulse"></div>
                  <span className="font-mono">FLEET ACTIVE</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setShowHelpGuide(true)}
                  className="w-12 h-12 bg-accent/20 hover:bg-accent/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-accent/30"
                  title="Help Guide"
                >
                  <HelpCircle className="w-6 h-6 text-white" />
                </Button>
                <div className="text-gunmetal text-sm font-mono">
                  {new Date().toLocaleTimeString()} UTC
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-terminal-border scrollbar-track-transparent pb-2">
              <TabsList className="flex w-max min-w-full justify-start space-x-1 bg-terminal-card/50 backdrop-blur-sm">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 icon-glow" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="fleet" className="flex items-center gap-2">
                  <Plane className="w-4 h-4 icon-glow" />
                  Fleet
                </TabsTrigger>
                <TabsTrigger value="verification" className="flex items-center gap-2">
                  <Shield className="w-4 h-4 icon-glow" />
                  Trust
                </TabsTrigger>
                <TabsTrigger value="marketplace" className="flex items-center gap-2">
                  <Search className="w-4 h-4 icon-glow" />
                  Marketplace
                </TabsTrigger>
                <TabsTrigger value="messages" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 icon-glow" />
                  Messages
                </TabsTrigger>
                <TabsTrigger value="news" className="flex items-center gap-2">
                  <Globe className="w-4 h-4 icon-glow" />
                  News
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 icon-glow" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <FileText className="w-4 h-4 icon-glow" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="tracking" className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 icon-glow" />
                  Tracking
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <Users className="w-4 h-4 icon-glow" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4 icon-glow" />
                  Settings
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Shield className="w-4 h-4 icon-glow" />
                  Privacy
                </TabsTrigger>
                <TabsTrigger value="help" className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 icon-glow" />
                  Help
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Command Center Header */}
              <div className="flex items-center justify-between animate-fade-in-up">
                <div>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">Fleet Command</h1>
                  <p className="text-gunmetal mt-2">Comprehensive fleet operations and performance oversight</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-data-positive text-sm">
                    <div className="w-2 h-2 bg-data-positive rounded-full terminal-pulse"></div>
                    <span className="font-mono">FLEET ACTIVE</span>
                  </div>
                  <div className="text-gunmetal text-sm font-mono">
                    {new Date().toLocaleTimeString()} UTC
                  </div>
                </div>
              </div>

              {/* Personalized Feed */}
              <PersonalizedFeed />

              {/* Real-Time Flight Tracker */}
              <RealTimeFlightTracker terminalType="operator" />

              {/* Advanced Search */}
              <AdvancedSearch terminalType="operator" onResults={(results) => console.log('Search results:', results)} />

              {/* Document Management */}
              <DocumentManagement userRole="operator" />

              {/* Flight Tracking Widget */}
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Live Flight Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <FlightRadar24Widget />
                </CardContent>
              </Card>

              {/* KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                  title="Fleet Utilization"
                  value="78%"
                  change="+5.2%"
                  trend="up"
                  icon={Activity}
                  className="animate-fade-in-up"
                />
                <KPICard
                  title="Monthly Revenue"
                  value="$2.4M"
                  change="+12.3%"
                  trend="up"
                  icon={DollarSign}
                  className="animate-fade-in-up"
                  style={{animationDelay: '0.1s'}}
                />
                <KPICard
                  title="Active Aircraft"
                  value="12"
                  change="+2"
                  trend="up"
                  icon={Plane}
                  className="animate-fade-in-up"
                  style={{animationDelay: '0.2s'}}
                />
                <KPICard
                  title="Bookings Today"
                  value="8"
                  change="+3"
                  trend="up"
                  icon={Calendar}
                  className="animate-fade-in-up"
                  style={{animationDelay: '0.3s'}}
                />
              </div>

              {/* Fleet Status Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Section
                  title="Fleet Status"
                  subtitle="Real-time aircraft availability and status"
                >
                  <div className="space-y-3">
                    {fleetData.map((aircraft, index) => (
                      <DataTile
                        key={aircraft.id}
                        label={aircraft.id}
                        value={aircraft.status}
                        subtext={`${aircraft.model} • ${aircraft.location}`}
                        status={aircraft.status === "Available" ? "success" : "warning"}
                        className="data-tile-modern animate-slide-in-right"
                        style={{animationDelay: `${index * 0.1}s`}}
                      />
                    ))}
                  </div>
                </Section>

                <Section
                  title="Recent Bookings"
                  subtitle="Latest confirmed and pending bookings"
                >
                  <div className="space-y-3">
                    {bookings.map((booking, index) => (
                      <DataTile
                        key={booking.id}
                        label={booking.route}
                        value={booking.revenue}
                        subtext={`${booking.client} • ${booking.date}`}
                        status={booking.status === "Confirmed" ? "success" : "warning"}
                        className="data-tile-modern animate-slide-in-right"
                        style={{animationDelay: `${index * 0.1}s`}}
                      />
                    ))}
                  </div>
                </Section>
              </div>
            </TabsContent>

            <TabsContent value="fleet">
              <FleetManagement />
            </TabsContent>

            <TabsContent value="verification">
              <VerificationSystem />
            </TabsContent>

            <TabsContent value="marketplace">
              <EnhancedMarketplace />
            </TabsContent>

            <TabsContent value="messages">
              <EnhancedMessaging />
            </TabsContent>

            <TabsContent value="news">
              <AviationNews />
            </TabsContent>

            <TabsContent value="analytics">
              <OperatorAnalytics />
            </TabsContent>

            <TabsContent value="notes">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-foreground">Note Taking System</h2>
                  <Button className="btn-terminal-accent">
                    <Plus className="w-4 h-4 mr-2" />
                    New Note
                  </Button>
                </div>
                <NoteTakingSystem terminalType="operator" />
              </div>
            </TabsContent>

            <TabsContent value="tracking">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-foreground">Flight Tracking</h2>
                  <Button className="btn-terminal-accent">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
                <FlightRadar24Widget 
                  tailNumbers={['N123SC', 'N456AV', 'N789OP']}
                  showMap={true}
                  autoRefresh={true}
                  refreshInterval={30}
                  role="operator"
                />
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <ProfileWidget />
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Settings</h2>
                <p className="text-muted-foreground">Terminal configuration and preferences</p>
              </div>
            </TabsContent>

            <TabsContent value="privacy">
              <PrivacyOverlay />
            </TabsContent>

            <TabsContent value="help">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Help & Support</h2>
                <p className="text-muted-foreground">Get assistance with your operator terminal</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Scroll to Top Button */}
      <Button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-accent/80 hover:bg-accent rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm border border-accent/30"
        title="Scroll to Top"
      >
        <ArrowUp className="w-6 h-6 text-white" />
      </Button>
      
      {/* Communication Tools */}
      <CommunicationTools terminalType="operator" />
    </>
  );
};

export default OperatorTerminal;