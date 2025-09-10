import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
import AuthForm from "@/components/AuthForm";
import EnhancedMarketplace from "@/components/EnhancedMarketplace";
import EnhancedMessaging from "@/components/EnhancedMessaging";
import { BarChart3, MessageSquare, TrendingUp, DollarSign, Clock, Users, Globe, Bookmark, FileText, Settings, AlertTriangle, Star, Calendar, Shield, Brain } from "lucide-react";
import { NavigationArrows } from "@/components/NavigationArrows";
import type { User } from '@supabase/supabase-js';
const BrokerTerminal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isBetaMode = location.pathname.startsWith('/beta/');

  useEffect(() => {
    if (isBetaMode) {
      // Beta mode - create mock user
      setUser({
        id: 'beta-broker-user',
        email: 'beta.broker@stratusconnect.org',
        user_metadata: {
          full_name: 'Beta Broker',
          role: 'broker'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as User);
      setLoading(false);
      return;
    }

    // Regular auth mode
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
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

  // Sample data for the broker terminal
  const liveRequests = [{
    id: "REQ-2024-001",
    route: "JFK → LAX",
    date: "Dec 28",
    pax: 8,
    status: "Active",
    offers: 3
  }, {
    id: "REQ-2024-002",
    route: "MIA → TEB",
    date: "Dec 29",
    pax: 4,
    status: "Pending",
    offers: 1
  }, {
    id: "REQ-2024-003",
    route: "LAX → LAS",
    date: "Dec 30",
    pax: 6,
    status: "Active",
    offers: 5
  }];
  const marketData = [{
    route: "JFK → LAX",
    avgPrice: "$42,000",
    change: "+8.2%",
    trend: "up"
  }, {
    route: "MIA → TEB",
    avgPrice: "$18,500",
    change: "-3.1%",
    trend: "down"
  }, {
    route: "DFW → ORD",
    avgPrice: "$15,200",
    change: "+12.5%",
    trend: "up"
  }];
  const recentTransactions = [{
    id: "TXN-847",
    route: "JFK → LAX",
    amount: "$45,200",
    commission: "$2,260",
    status: "Completed"
  }, {
    id: "TXN-846",
    route: "MIA → LAS",
    amount: "$28,900",
    commission: "$1,445",
    status: "Processing"
  }, {
    id: "TXN-845",
    route: "LAX → SFO",
    amount: "$12,800",
    commission: "$640",
    status: "Completed"
  }];
  const menuItems = [{
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3
  }, {
    id: "marketplace",
    label: "Marketplace",
    icon: Globe
  }, {
    id: "verification",
    label: "Fortress of Trust",
    icon: Shield
  }, {
    id: "psychometric",
    label: "Personality Test",
    icon: Brain
  }, {
    id: "requests",
    label: "My Requests",
    icon: FileText
  }, {
    id: "quotes",
    label: "Quotes",
    icon: DollarSign
  }, {
    id: "messages",
    label: "Messages",
    icon: MessageSquare
  }, {
    id: "directory",
    label: "Directory",
    icon: Users
  }, {
    id: "analytics",
    label: "Analytics",
    icon: TrendingUp
  }, {
    id: "transactions",
    label: "Transactions",
    icon: DollarSign
  }, {
    id: "alerts",
    label: "Alerts",
    icon: AlertTriangle
  }, {
    id: "saved",
    label: "Saved Jets",
    icon: Bookmark
  }, {
    id: "profile",
    label: "Profile",
    icon: Settings
  }];
  return <TerminalLayout title="Broker Terminal" userRole="Verified Broker" menuItems={menuItems} activeTab={activeTab} onTabChange={setActiveTab} bannerText="Speed creates advantage. Win more quotes with a cleaner cockpit." terminalType="broker">
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* Broker Command Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Broker Command</h1>
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
              value="24"
              delta="+8 this week"
              icon={FileText}
              variant="info"
            />
            <KPICard
              title="Quotes Sent"
              value="147"
              delta="+23% win rate"
              icon={DollarSign}
              variant="success"
            />
            <KPICard
              title="Avg Response Time"
              value="8m"
              delta="-2m improvement"
              icon={Clock}
              variant="warning"
            />
            <KPICard
              title="Win Rate"
              value="73%"
              delta="Above average"
              icon={TrendingUp}
              variant="success"
            />
          </div>

          {/* Live Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ProfileWidget />
            
            <Section 
              title="Empty Legs Near Me"
              subtitle="Available charter opportunities"
            >
              <div className="space-y-0">
                {[
                  { route: "JFK → LAX", aircraft: "G550", price: "$42K", available: "Today 14:00" },
                  { route: "MIA → TEB", aircraft: "Citation X", price: "$18K", available: "Tomorrow 09:00" },
                  { route: "DFW → LAS", aircraft: "Falcon 7X", price: "$28K", available: "Dec 30" }
                ].map((leg, index) => (
                  <DataTile
                    key={index}
                    title={leg.route}
                    subtitle={`${leg.aircraft} • ${leg.available}`}
                    rightSlot={
                      <div className="text-right">
                        <div className="text-accent font-semibold">{leg.price}</div>
                        <Button size="sm" className="btn-terminal-accent text-xs mt-1">Quote</Button>
                      </div>
                    }
                  />
                ))}
              </div>
            </Section>

            <Section 
              title="New Operator Availability"
              subtitle="Recently available operators"
            >
              <div className="space-y-0">
                {[
                  { operator: "Elite Aviation", aircraft: "G650", location: "JFK", rating: 4.8 },
                  { operator: "Charter Pro", aircraft: "Citation Sovereign", location: "MIA", rating: 4.9 },
                  { operator: "Executive Jets", aircraft: "Falcon 2000", location: "LAX", rating: 4.7 }
                ].map((op, index) => (
                  <DataTile
                    key={index}
                    title={op.operator}
                    subtitle={`${op.aircraft} • ${op.location}`}
                    rightSlot={
                      <div className="text-right">
                        <div className="flex items-center text-accent text-sm mb-1">
                          <Star className="w-3 h-3 mr-1" />
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
        </div>
      )}

      {activeTab === "marketplace" && <EnhancedMarketplace />}

      {activeTab === "verification" && (
        <div className="space-y-6">
          <VerificationSystem />
        </div>
      )}

      {activeTab === "psychometric" && (
        <div className="space-y-6">
          <Card className="terminal-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                Aviation Personality Assessment
              </CardTitle>
              <p className="text-gunmetal">Complete your psychometric evaluation to enhance your broker profile and improve matching with clients and operators</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Brain className="w-16 h-16 mx-auto mb-6 text-accent opacity-60" />
                <h3 className="text-xl font-semibold text-foreground mb-4">Personality Test</h3>
                <p className="text-gunmetal mb-6 max-w-md mx-auto">
                  Take our aviation-specific personality assessment to understand your working style, communication preferences, and how you interact with clients and operators.
                </p>
                <Button 
                  onClick={() => window.open('/psych', '_blank')}
                  className="btn-terminal-accent"
                >
                  Start Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "analytics" && (
        <Card className="terminal-card relative">
          <PrivacyOverlay 
            title="Advanced Analytics" 
            description="Sign in to view live operational analytics and performance metrics." 
            onUnlock={() => console.log('Unlock analytics')} 
            icon="chart" 
          />
          <CardContent className="p-12">
            <div className="text-center text-gunmetal opacity-20">
              <BarChart3 className="w-16 h-16 mx-auto mb-6" />
              <p className="terminal-subheader mb-2">Performance Analytics</p>
              <div className="grid grid-cols-3 gap-8 mt-8">
                <div>
                  <div className="text-3xl font-bold mb-2">94.2%</div>
                  <div className="text-sm">Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">$84K</div>
                  <div className="text-sm">Commission MTD</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">247</div>
                  <div className="text-sm">Active Clients</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages Section */}
      {activeTab === "messages" && <EnhancedMessaging />}

      {/* Add other sections with analytics */}
      {["requests", "quotes", "directory", "transactions", "alerts", "saved", "profile"].includes(activeTab) && (
        <div className="space-y-6">
          <BrokerAnalytics section={activeTab} />
          <Section 
            title={`${activeTab.charAt(0).toUpperCase()}${activeTab.slice(1)} Center`}
            subtitle={`Advanced ${activeTab} management and processing system`}
          >
            <div className="text-center text-gunmetal py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-6 opacity-30" />
              <p className="terminal-subheader mb-2 capitalize">{activeTab} Management</p>
              <p className="text-sm">
                Advanced {activeTab} management and processing system
              </p>
            </div>
          </Section>
        </div>
      )}
    </TerminalLayout>;
};
export default BrokerTerminal;