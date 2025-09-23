import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brand } from '@/components/Brand';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernHelpGuide } from '@/components/ModernHelpGuide';
import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground';
import { 
  DollarSign, 
  FileText, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  Plane,
  Clock,
  Target,
  Search,
  Bell,
  Award,
  BarChart3,
  Zap,
  Star,
  MapPin,
  Calendar,
  GitCompare,
  Save,
  Eye,
  Plus,
  Filter,
  Download,
  Leaf,
  Trophy,
  Globe,
  ArrowUp,
  Menu,
  RefreshCw,
  MessageSquare,
  Bookmark,
  Settings
} from 'lucide-react';
import { ComplianceNotice, EvidencePack } from '@/components/ComplianceNotice';
import { MultiLegRFQ } from '@/components/DealFlow/MultiLegRFQ';
import { QuoteComposer } from '@/components/DealFlow/QuoteComposer';
import { BackhaulMatcher } from '@/components/DealFlow/BackhaulMatcher';
import { SavedSearches } from '@/components/DealFlow/SavedSearches';
import { ReputationMetrics } from '@/components/Reputation/ReputationMetrics';
import { MonthlyStatements } from '@/components/Billing/MonthlyStatements';
import { RankingRulesPage } from '@/components/Ranking/RankingRulesPage';
import AISearchAssistant from '@/components/AISearchAssistant';
import PredictiveAnalytics from '@/components/PredictiveAnalytics';
import NoteTakingSystem from '@/components/NoteTakingSystem';
import { FlightRadar24Widget } from '@/components/flight-tracking/FlightRadar24Widget';
import AviationNews from '@/components/AviationNews';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import { MaxAI } from '@/components/ai/MaxAI';
import { SecurityAI } from '@/components/ai/SecurityAI';
import { WeekOneScoreboard } from '@/components/WeekOneScoreboard';
import DemoMarketplace from './DemoMarketplace';

interface RFQ {
  id: string;
  route: string;
  aircraft: string;
  date: string;
  price: number;
  currency: string;
  status: 'draft' | 'sent' | 'quoted' | 'accepted' | 'paid';
  quotes: Quote[];
  legs: number;
  passengers: number;
  specialRequirements: string;
}

interface Quote {
  id: string;
  operator: string;
  price: number;
  currency: string;
  validUntil: string;
  aircraft: string;
  verified: boolean;
  rating: number;
  responseTime: number;
  dealScore: number;
}

export default function BrokerTerminal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isBetaMode = location.pathname.startsWith('/beta/');
  const searchRef = useRef<HTMLInputElement>(null);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [showMaxAI, setShowMaxAI] = useState(true);
  const [showSecurityAI, setShowSecurityAI] = useState(true);
  const [rfqs, setRfqs] = useState<RFQ[]>([]); // Blank slate - no demo data

  useShortcuts({
    "mod+k": () => searchRef.current?.focus(),
    "mod+f": () => {/* open filters */},
  });

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
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Please log in to access the Broker Terminal</div>
      </div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <TerminalTemplate
            left={
              <div className="space-y-4">
                <div className="text-sm font-semibold">Filters & Search</div>
                <div className="space-y-2">
                  <div className="text-xs text-textDim">Quote Requests Today</div>
                  <div className="text-2xl font-mono tabular">47</div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-textDim">Response Median</div>
                  <div className="text-2xl font-mono tabular">2.3m</div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-textDim">Risk Alerts</div>
                  <div className="text-2xl font-mono tabular text-red-400">3</div>
                </div>
              </div>
            }
            main={
              <div className="space-y-4">
                <div className="text-sm font-semibold">Live RFQs & Quotes</div>
                <div className="overflow-auto rounded-md border border-line">
                  <table className="min-w-full border-separate border-spacing-0 text-sm">
                    <thead className="bg-blue-900/30 text-blue-100 border-b border-blue-700">
                      <tr>
                        <th className="sticky top-0 z-10 border-b border-line px-3 py-2 text-left">Route</th>
                        <th className="sticky top-0 z-10 border-b border-line px-3 py-2 text-left">Aircraft</th>
                        <th className="sticky top-0 z-10 border-b border-line px-3 py-2 text-left">Quote</th>
                        <th className="sticky top-0 z-10 border-b border-line px-3 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="px-3 py-2 font-mono text-xs">JFK → LAX</td>
                        <td className="px-3 py-2 text-xs">G650</td>
                        <td className="px-3 py-2 font-mono text-xs tabular">$45,000</td>
                        <td className="px-3 py-2 text-xs text-white">Active</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono text-xs">LHR → CDG</td>
                        <td className="px-3 py-2 text-xs">A320</td>
                        <td className="px-3 py-2 font-mono text-xs tabular">$12,500</td>
                        <td className="px-3 py-2 text-xs text-yellow-400">Pending</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono text-xs">SFO → NRT</td>
                        <td className="px-3 py-2 text-xs">B777</td>
                        <td className="px-3 py-2 font-mono text-xs tabular">$78,000</td>
                        <td className="px-3 py-2 text-xs text-white">Active</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            }
            right={
              <div className="space-y-4">
                <div className="text-sm font-semibold">Risk & Alerts</div>
                <div className="space-y-2">
                  <div className="text-xs text-textDim">Market Risk</div>
                  <div className="text-lg font-mono tabular text-white">Low</div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-textDim">Messages</div>
                  <div className="text-lg font-mono tabular">12</div>
                </div>
              </div>
            }
            bottom={
              <div className="space-y-2">
                <div className="text-sm font-semibold">Market Tape</div>
                <div className="font-mono text-xs text-textDim">
                  JFK-LAX: $45K ↑ | LHR-CDG: $12.5K → | SFO-NRT: $78K ↑ | Empty legs: 23 available
                </div>
              </div>
            }
          />
        );
      case "marketplace":
        return <DemoMarketplace />;
      default:
        return (
          <div className="space-y-6">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="text-foreground">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Center
                </CardTitle>
                <p className="text-gunmetal">Advanced {activeTab} management and processing system</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto mb-6 text-accent opacity-60" />
                  <h3 className="text-xl font-semibold text-foreground mb-4 capitalize">{activeTab} Management</h3>
                  <p className="text-gunmetal mb-6 max-w-md mx-auto">
                    This section is under development. Advanced {activeTab} features will be available soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

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

  return (
    <>
      {showHelpGuide && (
        <ModernHelpGuide 
          terminalType="broker" 
          activeTab={activeTab} 
          showOnMount={false} 
          isDemo={false}
          onClose={() => setShowHelpGuide(false)}
        />
      )}
      <div className="min-h-screen bg-app relative overflow-hidden">
        <StarfieldRunwayBackground />
        
      {/* Terminal Header */}
        <div className="relative z-10 bg-terminal-card border-b border-terminal-border backdrop-blur-modern">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
                <StratusConnectLogo className="text-2xl" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Broker Terminal</h1>
                  <p className="text-sm text-gunmetal">Professional aviation brokerage platform</p>
                </div>
                <div className="flex items-center space-x-2 text-data-positive text-sm">
                  <div className="w-2 h-2 bg-data-positive rounded-full terminal-pulse"></div>
                <span className="font-mono">MARKET ACTIVE</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
                {/* AI components moved to bottom-right corner */}
                <Button
                  onClick={() => setShowHelpGuide(true)}
                  className="w-12 h-12 bg-accent/20 hover:bg-accent/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-accent/30"
                  title="Help Guide"
                >
                  <Settings className="w-6 h-6 text-white" />
                </Button>
                <div className="text-gunmetal text-sm font-mono">
                {new Date().toLocaleTimeString()} UTC
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Navigation */}
        <div className="relative z-10 border-b border-terminal-border bg-terminal-card/30 backdrop-blur-modern">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8 py-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === item.id
                      ? "bg-accent text-white shadow-glow"
                      : "text-gunmetal hover:text-foreground hover:bg-terminal-card/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
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
              <TabsTrigger value="rfqs" className="flex items-center gap-2">
                <FileText className="w-4 h-4 icon-glow" />
                RFQs & Quotes
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="flex items-center gap-2">
                <Search className="w-4 h-4 icon-glow" />
                Marketplace
              </TabsTrigger>
              <TabsTrigger value="searches" className="flex items-center gap-2">
                <Bell className="w-4 h-4 icon-glow" />
                Saved Searches
              </TabsTrigger>
              <TabsTrigger value="reputation" className="flex items-center gap-2">
                <Award className="w-4 h-4 icon-glow" />
                Reputation
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 icon-glow" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText className="w-4 h-4 icon-glow" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <Plane className="w-4 h-4 icon-glow" />
                Flight Tracking
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-terminal-card border-terminal-border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-8 w-8 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Quote Requests Today</p>
                      <p className="text-2xl font-bold">47</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-terminal-card border-terminal-border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-8 w-8 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Response Median</p>
                      <p className="text-2xl font-bold">2.3m</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-terminal-card border-terminal-border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Alerts</p>
                      <p className="text-2xl font-bold text-red-400">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-terminal-card border-terminal-border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-8 w-8 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="text-2xl font-bold">$2.4M</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Personalized Feed */}
            <PersonalizedFeed />

            {/* Flight Tracking */}
            <FlightRadar24Widget 
              tailNumbers={["N425SC", "N892AV", "N156JT"]}
              role="broker"
              showMap={true}
              autoRefresh={true}
              refreshInterval={30}
            />

            {/* Live RFQs & Quotes */}
            <Card className="bg-terminal-card border-terminal-border">
              <CardHeader>
                <CardTitle className="text-accent">Live RFQs & Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto rounded-md border border-terminal-border">
                  <table className="min-w-full border-separate border-spacing-0 text-sm">
                    <thead className="bg-terminal-card text-foreground border-b border-terminal-border">
                      <tr>
                        <th className="sticky top-0 z-10 border-b border-terminal-border px-3 py-2 text-left">Route</th>
                        <th className="sticky top-0 z-10 border-b border-terminal-border px-3 py-2 text-left">Aircraft</th>
                        <th className="sticky top-0 z-10 border-b border-terminal-border px-3 py-2 text-left">Quote</th>
                        <th className="sticky top-0 z-10 border-b border-terminal-border px-3 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-terminal-border">
                      <tr>
                        <td className="px-3 py-2 font-mono text-xs">JFK → LAX</td>
                        <td className="px-3 py-2 text-xs">G650</td>
                        <td className="px-3 py-2 font-mono text-xs tabular">$45,000</td>
                        <td className="px-3 py-2 text-xs text-white">Active</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono text-xs">LHR → CDG</td>
                        <td className="px-3 py-2 text-xs">A320</td>
                        <td className="px-3 py-2 font-mono text-xs tabular">$12,500</td>
                        <td className="px-3 py-2 text-xs text-yellow-400">Pending</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono text-xs">SFO → NRT</td>
                        <td className="px-3 py-2 text-xs">B777</td>
                        <td className="px-3 py-2 font-mono text-xs tabular">$78,000</td>
                        <td className="px-3 py-2 text-xs text-white">Active</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rfqs" className="space-y-6">
            <Card className="terminal-card animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New RFQ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MultiLegRFQ />
              </CardContent>
            </Card>

            <div className="space-y-4">
              {rfqs.map(rfq => (
                <Card key={rfq.id} className="terminal-card hover:terminal-glow animate-fade-in-up">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Plane className="w-5 h-5" />
                          {rfq.route}
                        </CardTitle>
                        <p className="text-gunmetal">{rfq.aircraft} • {rfq.date} • {rfq.legs} leg(s) • {rfq.passengers} pax</p>
                        {rfq.specialRequirements && (
                          <p className="text-sm text-accent mt-1">📋 {rfq.specialRequirements}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          rfq.status === 'paid' ? 'bg-accent/20 text-accent' :
                          rfq.status === 'quoted' ? 'bg-accent/20 text-accent' :
                          'bg-warn/20 text-warn'
                        }>
                          {rfq.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <GitCompare className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {rfq.quotes.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          Quotes Received ({rfq.quotes.length})
                        </h4>
                        {rfq.quotes.map(quote => (
                          <div key={quote.id} className="p-3 bg-terminal-card/50 rounded-lg border border-terminal-border">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-semibold text-foreground">{quote.operator}</div>
                                <div className="text-sm text-gunmetal">{quote.aircraft}</div>
                                <div className="text-xs text-gunmetal">Response time: {quote.responseTime}m</div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-accent">${quote.price.toLocaleString()}</div>
                                <div className="text-xs text-gunmetal">{quote.currency}</div>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-gunmetal">{quote.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gunmetal">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No quotes received yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <DemoMarketplace />
          </TabsContent>

          <TabsContent value="searches" className="space-y-6">
            <SavedSearches />
          </TabsContent>

          <TabsContent value="reputation" className="space-y-6">
            <ReputationMetrics userId="broker_001" userType="broker" />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <MonthlyStatements />
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Note Taking System</h2>
                <Button className="btn-terminal-accent">
                  <Plus className="w-4 h-4 mr-2" />
                  New Note
                </Button>
              </div>
              <NoteTakingSystem terminalType="broker" />
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Live Flight Tracking
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Monitor aircraft activity and track flights in real-time
                </p>
              </CardHeader>
              <CardContent>
                <FlightRadar24Widget />
              </CardContent>
            </Card>
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
      
      {/* Max AI - Advanced Intelligence System */}
      <MaxAI 
        isVisible={showMaxAI} 
        onToggleVisibility={() => setShowMaxAI(!showMaxAI)} 
        userType="broker" 
        isAuthenticated={!!user} 
      />
      
      {/* Security AI - Advanced Threat Protection */}
      <SecurityAI 
        isVisible={showSecurityAI} 
        onToggleVisibility={() => setShowSecurityAI(!showSecurityAI)} 
        userType="broker" 
      />
    </>
  );
}