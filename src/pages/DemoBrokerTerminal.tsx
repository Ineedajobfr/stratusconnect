// Enhanced Demo Broker Terminal - All Features
// FCA Compliant Aviation Platform - 100% Free Until Revenue

import CommunicationTools from '@/components/CommunicationTools';
import DocumentStorage from '@/components/documents/DocumentStorage';
import { ReputationMetrics } from '@/components/Reputation/ReputationMetrics';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { type BrokerMetrics } from '@/lib/broker-dashboard-service';
import {
    AlertCircle,
    Award,
    BarChart3,
    Bell,
    Briefcase,
    Calendar,
    Clock,
    DollarSign,
    FileText,
    GitCompare,
    MapPin,
    MessageCircle,
    Plane,
    Plus,
    Save,
    Search,
    Shield,
    TrendingUp,
    Trophy,
    Users
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface RFQ {
  id: string;
  title: string;
  client: string;
  aircraft: string;
  route: string;
  passengers: number;
  date: string;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected';
  quotes: number;
}

interface Quote {
  id: string;
  rfqId: string;
  operator: string;
  aircraft: string;
  price: number;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const DemoBrokerTerminal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState<BrokerMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [isDocumentManagementCollapsed, setIsDocumentManagementCollapsed] = useState(true);
  const alertsDropdownRef = useRef<HTMLDivElement>(null);
  
  // Feature flags and user preferences
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [showSecondaryFeatures, setShowSecondaryFeatures] = useState(true);
  const [userPreferences, setUserPreferences] = useState({
    showAdvancedFeatures: false,
    showSecondaryFeatures: true,
    compactMode: false,
    showTooltips: true
  });

  // Sample alerts data
  const [alerts] = useState([
    {
      id: '1',
      type: 'rfq',
      message: 'New RFQ from Elite Aviation',
      timestamp: '2 hours ago',
      unread: true
    },
    {
      id: '2', 
      type: 'payment',
      message: 'Payment pending for $12,300',
      timestamp: '4 hours ago',
      unread: true
    },
    {
      id: '3',
      type: 'contract',
      message: 'Contract needs signature',
      timestamp: '6 hours ago',
      unread: false
    }
  ]);

  const unreadAlertsCount = alerts.filter(alert => alert.unread).length;

  const handleAlertClick = (alertId: string) => {
    console.log('Alert clicked:', alertId);
    setShowAlertsDropdown(false);
    // Navigate to relevant section based on alert type
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      if (alert.type === 'rfq') {
        setActiveTab('rfqs');
      } else if (alert.type === 'payment') {
        setActiveTab('billing');
      } else if (alert.type === 'contract') {
        setActiveTab('documents');
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (alertsDropdownRef.current && !alertsDropdownRef.current.contains(event.target as Node)) {
        setShowAlertsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setMetricsLoading(true);
        // const data = await brokerDashboardService.getBrokerMetrics();
        // setMetrics(data);
      } catch (error) {
        console.error('Failed to load broker metrics:', error);
        // Use fallback data
        setMetrics({
          activeRFQs: 10,
          quotesReceived: 23,
          dealsClosed: 5,
          avgResponseTime: 2.3,
          reputationPoints: 567,
          reputationRank: 'Gold',
          weeklyTrend: {
            rfqsChange: 12,
            quotesChange: 8,
            dealsChange: 15
          }
        });
      } finally {
        setMetricsLoading(false);
      }
    };

    loadMetrics();
  }, []);

  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        {/* Cinematic Background - Orange/Red Theme */}
        <div className="fixed inset-0 z-0">
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
          
          {/* Enhanced golden-orange glow in the center */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at center, rgba(255, 140, 0, 0.25) 0%, rgba(255, 140, 0, 0.15) 20%, rgba(255, 140, 0, 0.08) 40%, rgba(255, 140, 0, 0.04) 60%, transparent 80%)',
            }}
          />
          
          {/* Additional orange glow layer for more intensity */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 100% 80% at center, rgba(255, 165, 0, 0.12) 0%, rgba(255, 140, 0, 0.08) 30%, rgba(255, 140, 0, 0.04) 50%, transparent 70%)',
            }}
          />
          
          {/* Subtle pulsing orange glow effect */}
          <div 
            className="absolute inset-0 animate-pulse"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at center, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.04) 25%, transparent 50%)',
              animation: 'pulse 4s ease-in-out infinite',
            }}
          />
          
          {/* Subtle grid pattern overlay - more refined */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgTCAwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] opacity-30"></div>
          </div>
        </div>

        {/* Header */}
        <header className="relative z-50 border-b border-slate-800 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Left - Logo */}
            <div className="flex items-center gap-4">
              <div 
                className="text-white text-lg font-bold bg-black px-6 py-3 rounded backdrop-blur-sm cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => window.location.href = '/'}
                style={{
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 140, 0, 0.2)',
                  border: '1px solid rgba(255, 140, 0, 0.3)',
                  boxShadow: '0 0 15px rgba(255, 140, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                STRATUSCONNECT
            </div>
          </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input 
                  placeholder="Search RFQs, quotes, clients..."
                  className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-accent"
                />
            </div>
          </div>

            {/* Right - Alerts & Actions */}
            <div className="flex items-center gap-4">
              {/* Alerts Bell */}
              <div className="relative" ref={alertsDropdownRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
                  className="relative p-2 text-slate-400 hover:text-white"
                >
                  <Bell className="h-5 w-5" />
                  {unreadAlertsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadAlertsCount}
                    </span>
                  )}
                </Button>

                {/* Alerts Dropdown */}
                {showAlertsDropdown && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-80 rounded-lg shadow-2xl z-[999999]"
                    style={{ 
                      backgroundColor: '#362620',
                      border: '1px solid #4a3429'
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-white">Live Alerts</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Mark all read
                        </Button>
            </div>
                      <div className="space-y-2">
                        {alerts.map((alert) => (
                          <div
                            key={alert.id}
                            onClick={() => handleAlertClick(alert.id)}
                            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-black/20 transition-colors"
                          >
                            <div className={`w-2 h-2 rounded-full ${alert.unread ? 'bg-red-500' : 'bg-slate-500'}`}></div>
                            <div className="flex-1">
                              <p className="text-sm text-white">{alert.message}</p>
                              <p className="text-xs text-slate-400">{alert.timestamp}</p>
          </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
      </div>

              {/* Primary CTA and Help Menu */}
              <div className="flex items-center gap-3">
                {/* Money Button - New RFQ */}
                <Button
                  onClick={() => setActiveTab('rfqs')}
                  className="bg-accent hover:bg-accent/90 text-white font-semibold px-6"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New RFQ
                </Button>
                
                {/* User Preferences Toggle */}
                <Button
                  onClick={() => setShowSecondaryFeatures(!showSecondaryFeatures)}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-400 hover:text-slate-300"
                  title={showSecondaryFeatures ? "Hide secondary features" : "Show secondary features"}
                >
                  {showSecondaryFeatures ? 'Simplified' : 'Full View'}
                </Button>
                
                {/* Help Menu */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setActiveTab('trophy')}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-400 hover:text-slate-300"
                  >
                    <Trophy className="h-4 w-4 mr-1" />
                    Trophy
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/tutorial/broker'}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-400 hover:text-slate-300"
                  >
                    <Trophy className="h-4 w-4 mr-1" />
                    Tutorial
                  </Button>
                </div>
              </div>
      </div>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto p-6 space-y-6 overflow-y-auto scroll-smooth">

        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-terminal-border scrollbar-track-transparent pb-2">
            {/* Primary Navigation - Core Workflows */}
            <TabsList className="flex w-max min-w-full justify-start space-x-1 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 5%, 0.9)' }}>
              {/* Primary Tabs - Essential Workflows */}
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
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 icon-glow" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="warroom" className="flex items-center gap-2">
                <Shield className="w-4 h-4 icon-glow" />
                War Room
              </TabsTrigger>
              
              {/* Secondary Tabs - Important but Secondary */}
              {showSecondaryFeatures && (
                <>
                  <TabsTrigger value="documents" className="flex items-center gap-2 opacity-75">
                    <FileText className="w-4 h-4 icon-glow" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="communication" className="flex items-center gap-2 opacity-75">
                    <MessageCircle className="w-4 h-4 icon-glow" />
                    Communication
                  </TabsTrigger>
                  <TabsTrigger value="reputation" className="flex items-center gap-2 opacity-75">
                    <Award className="w-4 h-4 icon-glow" />
                    Reputation
                  </TabsTrigger>
                </>
              )}
              
              {/* Advanced Features Toggle */}
              <div className="flex items-center ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  {showAdvancedFeatures ? 'Hide' : 'Show'} Advanced
                </Button>
              </div>
            </TabsList>
            
            {/* Secondary Navigation - Advanced Features */}
            {showAdvancedFeatures && (
              <div className="mt-2">
                <TabsList className="flex w-max min-w-full justify-start space-x-1 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 3%, 0.8)' }}>
                  <TabsTrigger value="notes" className="flex items-center gap-2 opacity-60">
                    <FileText className="w-3 h-3" />
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="trophy" className="flex items-center gap-2 opacity-60">
                    <Trophy className="w-3 h-3" />
                    Scoreboard
                  </TabsTrigger>
                  <TabsTrigger value="jobs" className="flex items-center gap-2 opacity-60">
                    <Users className="w-3 h-3" />
                    Job Board
                  </TabsTrigger>
                  <TabsTrigger value="community" className="flex items-center gap-2 opacity-60">
                    <MessageCircle className="w-3 h-3" />
                    Community
                  </TabsTrigger>
                  <TabsTrigger value="saved-crews" className="flex items-center gap-2 opacity-60">
                    <Users className="w-3 h-3" />
                    Saved Crews
                  </TabsTrigger>
                  <TabsTrigger value="flight-tracking" className="flex items-center gap-2 opacity-60">
                    <MapPin className="w-3 h-3" />
                    Flight Tracking
                  </TabsTrigger>
                  <TabsTrigger value="advanced-search" className="flex items-center gap-2 opacity-60">
                    <Search className="w-3 h-3" />
                    Search
                  </TabsTrigger>
                  <TabsTrigger value="searches" className="flex items-center gap-2 opacity-60">
                    <Search className="w-3 h-3" />
                    Saved Searches
                  </TabsTrigger>
                </TabsList>
              </div>
            )}
                    </div>

          <TabsContent value="dashboard" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              {/* Action Required */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="border-slate-600 cursor-pointer hover:opacity-90 transition-all group" style={{ backgroundColor: '#110f0d' }}>
                  <div className="flex h-24">
                    <div className="w-1 bg-amber-500"></div>
                    <CardContent className="flex-1 p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <p className="font-semibold text-amber-400 text-lg" style={{ textShadow: '0 0 10px rgba(255, 193, 7, 0.6)' }}>Reply to 2 RFQs now</p>
                      </div>
                      <p className="text-sm text-slate-400">SLA breach in 3h if ignored</p>
                    </CardContent>
                  </div>
                </Card>

                <Card className="border-slate-600 cursor-pointer hover:opacity-90 transition-all group" style={{ backgroundColor: '#110f0d' }}>
                  <div className="flex h-24">
                    <div className="w-1 bg-blue-500"></div>
                    <CardContent className="flex-1 p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <p className="font-semibold text-blue-400 text-lg" style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.6)' }}>Send contract to 1 client</p>
                      </div>
                      <p className="text-sm text-slate-400">Deal expires in 6h</p>
                    </CardContent>
                  </div>
                </Card>

                <Card className="border-slate-600 cursor-pointer hover:opacity-90 transition-all group" style={{ backgroundColor: '#110f0d' }}>
                  <div className="flex h-24">
                    <div className="w-1 bg-green-500"></div>
                    <CardContent className="flex-1 p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        <p className="font-semibold text-green-400 text-lg" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.6)' }}>Collect 3 payments</p>
                      </div>
                      <p className="text-sm text-slate-400">£12,300 held in pending</p>
                    </CardContent>
                  </div>
                </Card>
              </div>

              {/* Workflow Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <p className="text-xs uppercase tracking-wide text-slate-300 font-medium" style={{ textShadow: '0 0 8px rgba(148, 163, 184, 0.5)' }}>Active RFQs</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground mb-1">10</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-400 font-medium">+12%</span>
                        <span className="text-xs text-slate-500">this week</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">from 9</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        <p className="text-xs uppercase tracking-wide text-slate-300 font-medium" style={{ textShadow: '0 0 8px rgba(148, 163, 184, 0.5)' }}>Quotes received</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground mb-1">23</p>
                      <p className="text-sm text-slate-500">Avg 2.3 per RFQ</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <p className="text-xs uppercase tracking-wide text-slate-300 font-medium" style={{ textShadow: '0 0 8px rgba(148, 163, 184, 0.5)' }}>Deals closed</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground mb-1">5</p>
                      <p className="text-sm text-slate-500">£2.1M volume</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <p className="text-xs uppercase tracking-wide text-slate-300 font-medium" style={{ textShadow: '0 0 8px rgba(148, 163, 184, 0.5)' }}>Response time</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground mb-1">2.3m</p>
                      <p className="text-sm text-slate-500">Fast lane eligible</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Reputation & Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Reputation Metrics */}
                <div className="lg:col-span-2">
                  <Card className="border-slate-600 h-full" style={{ backgroundColor: '#110f0d' }}>
                    <CardContent className="p-6 h-full flex flex-col justify-between">
                      <div className="flex items-center gap-2 mb-6">
                        <Award className="w-4 h-4 text-slate-400" />
                        <p className="text-sm uppercase tracking-wide text-slate-300 font-medium" style={{ textShadow: '0 0 10px rgba(148, 163, 184, 0.6)' }}>Reputation & Performance</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                          <p className="text-2xl font-bold text-accent mb-1">4.8</p>
                          <p className="text-xs text-slate-400">Overall rating</p>
                        </div>
                        <div className="text-center p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                          <p className="text-2xl font-bold text-accent mb-1">98%</p>
                          <p className="text-xs text-slate-400">Client satisfaction</p>
                        </div>
                        <div className="text-center p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                          <p className="text-2xl font-bold text-accent mb-1">127</p>
                          <p className="text-xs text-slate-400">Successful deals</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Ranking Badge */}
                <div>
                  <Card className="border-slate-600 h-full" style={{ backgroundColor: '#110f0d' }}>
                    <CardContent className="p-6 flex flex-col justify-center h-full">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <Trophy className="w-5 h-5 text-accent" />
                          <span className="text-lg font-semibold text-accent" style={{ textShadow: '0 0 15px rgba(255, 140, 0, 0.8)' }}>Golden</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">#12 Global Ranking</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-2xl font-bold text-foreground">567</p>
                            <p className="text-xs text-slate-500">Points</p>
                          </div>
                          <div className="pt-2 border-t border-slate-600">
                            <p className="text-sm text-green-400 font-medium">+23 this week</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rfqs" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              {/* Active RFQs */}
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    Active RFQs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* RFQ 1 */}
                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">London to Dubai Executive Flight</h3>
                          <p className="text-sm text-slate-400">Client: Elite Aviation Group</p>
                          <p className="text-sm text-slate-400">Aircraft: Gulfstream G650</p>
                        </div>
                        <Badge className="bg-amber-500/20 text-amber-400">Urgent</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-slate-500">Route</p>
                          <p className="text-sm text-white">LHR → DXB</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Passengers</p>
                          <p className="text-sm text-white">8 passengers</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Date</p>
                          <p className="text-sm text-white">Sep 15, 2025</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-400">3 quotes received</span>
                          <span className="text-sm text-green-400">Best: £45,000</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View Quotes</Button>
                          <Button size="sm">Accept Quote</Button>
                        </div>
                      </div>
                    </div>

                    {/* RFQ 2 */}
                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">New York to Los Angeles Charter</h3>
                          <p className="text-sm text-slate-400">Client: SkyBridge Ventures</p>
                          <p className="text-sm text-slate-400">Aircraft: Bombardier Global 7500</p>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-400">New</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-slate-500">Route</p>
                          <p className="text-sm text-white">JFK → LAX</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Passengers</p>
                          <p className="text-sm text-white">12 passengers</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Date</p>
                          <p className="text-sm text-white">Sep 18, 2025</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-400">1 quote received</span>
                          <span className="text-sm text-yellow-400">Awaiting more</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View Quote</Button>
                          <Button size="sm" variant="outline">Request More</Button>
                        </div>
                      </div>
                    </div>

                    {/* RFQ 3 */}
                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">Paris to Monaco Luxury Trip</h3>
                          <p className="text-sm text-slate-400">Client: Monaco Elite</p>
                          <p className="text-sm text-slate-400">Aircraft: Citation CJ3+</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">Ready</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-slate-500">Route</p>
                          <p className="text-sm text-white">CDG → MCM</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Passengers</p>
                          <p className="text-sm text-white">6 passengers</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Date</p>
                          <p className="text-sm text-white">Sep 20, 2025</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-400">5 quotes received</span>
                          <span className="text-sm text-green-400">Best: £18,500</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Compare Quotes</Button>
                          <Button size="sm">Book Now</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Quotes */}
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Recent Quotes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                          <span className="text-xs font-semibold">EA</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">Elite Aviation</p>
                          <p className="text-sm text-slate-400">Gulfstream G650 - LHR→DXB</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-400">£45,000</p>
                        <p className="text-xs text-slate-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                          <span className="text-xs font-semibold">GW</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">Global Wings</p>
                          <p className="text-sm text-slate-400">Global 7500 - JFK→LAX</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-400">£78,500</p>
                        <p className="text-xs text-slate-400">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                          <span className="text-xs font-semibold">SC</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">SkyBridge Charters</p>
                          <p className="text-sm text-slate-400">Citation CJ3+ - CDG→MCM</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-400">£18,500</p>
                        <p className="text-xs text-slate-400">6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketplace" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle>Marketplace</CardTitle>
                </CardHeader>
                <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Small Aircraft - Citation CJ3+ */}
                    <Card className="p-4 hover:opacity-80 transition-all border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">Elite Aviation</h3>
                          <p className="text-sm text-gunmetal">Citation CJ3+</p>
                  </div>
                  <Badge className="bg-accent/20 text-accent">Verified</Badge>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gunmetal" />
                    <span>LHR → JFK</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gunmetal" />
                    <span>Sep 20, 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gunmetal" />
                          <span>6 seats</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl font-bold">$28,500</div>
                        <div className="text-sm text-gunmetal">$2,400/NM</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Book
                  </Button>
                  <Button size="sm" variant="outline">
                    <GitCompare className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </Card>

                    {/* Medium Aircraft - Gulfstream G550 */}
                    <Card className="p-4 hover:opacity-80 transition-all border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">SkyBridge Charters</h3>
                          <p className="text-sm text-gunmetal">Gulfstream G550</p>
    </div>
                        <Badge className="bg-purple-500/20 text-purple-400">Premium</Badge>
    </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gunmetal" />
                          <span>LAX → NRT</span>
        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gunmetal" />
                          <span>Sep 22, 2025</span>
      </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-gunmetal" />
                          <span>12 seats</span>
    </div>
              </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl font-bold">$78,000</div>
                        <div className="text-sm text-gunmetal">$1,950/NM</div>
            </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Book
                        </Button>
                        <Button size="sm" variant="outline">
                          <GitCompare className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Save className="w-4 h-4" />
                        </Button>
              </div>
                    </Card>

                    {/* Large Aircraft - Bombardier Global 7500 */}
                    <Card className="p-4 hover:opacity-80 transition-all border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">Global Wings</h3>
                          <p className="text-sm text-gunmetal">Bombardier Global 7500</p>
            </div>
                        <Badge className="bg-green-500/20 text-green-400">New</Badge>
              </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gunmetal" />
                          <span>CDG → LAX</span>
            </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gunmetal" />
                          <span>Sep 25, 2025</span>
          </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-gunmetal" />
                          <span>16 seats</span>
    </div>
        </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl font-bold">$125,000</div>
                        <div className="text-sm text-gunmetal">$1,800/NM</div>
          </div>
          <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Book
            </Button>
                        <Button size="sm" variant="outline">
                          <GitCompare className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Save className="w-4 h-4" />
                        </Button>
          </div>
                    </Card>
        </div>
                </CardContent>
              </Card>
          </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-accent" />
                    Billing & Payments
                </CardTitle>
                  <CardDescription>
                    Monthly statements, pending payments, VAT invoices
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Revenue Overview */}
                <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Revenue Overview</h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                          <p className="text-sm text-muted-foreground">This Month</p>
                          <p className="text-2xl font-bold text-accent">$47,500</p>
                          <p className="text-xs text-green-400">+15% from last month</p>
                    </div>
                        <div className="p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                          <p className="text-sm text-muted-foreground">Pending Payments</p>
                          <p className="text-2xl font-bold text-accent">$12,300</p>
                          <p className="text-xs text-yellow-400">3 transactions</p>
                </div>
                      </div>
                    </div>

                    {/* Payment Actions */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Payment Actions</h3>
                      <div className="space-y-3">
                        <Button className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          Generate VAT Invoice
                        </Button>
                        <Button className="w-full" variant="outline">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Process Pending Payments
                        </Button>
                        <Button className="w-full" variant="outline">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Export Monthly Statement
                </Button>
              </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="warroom" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent" />
                    War Room - Verification Center
                  </CardTitle>
                  <CardDescription>
                    Operator & crew verification, compliance checks, audit trails
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* System Status */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">System Status</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-green-500/30" style={{ backgroundColor: '#110f0d' }}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium">Operator Verification</span>
                      </div>
                          <Badge className="bg-green-500/20 text-green-400">Operational</Badge>
                      </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-green-500/30" style={{ backgroundColor: '#110f0d' }}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium">Crew License Checks</span>
                    </div>
                          <Badge className="bg-green-500/20 text-green-400">Operational</Badge>
                      </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-green-500/30" style={{ backgroundColor: '#110f0d' }}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium">Compliance Monitoring</span>
                      </div>
                          <Badge className="bg-green-500/20 text-green-400">Operational</Badge>
                    </div>
                    </div>
                  </div>
                  
                    {/* Recent Verification Events */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Recent Verification Events</h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                          <p className="font-medium text-foreground">Elite Aviation - License Verified</p>
                          <p className="text-sm text-muted-foreground">Captain James Wilson - ATP License</p>
                          <p className="text-xs text-slate-400">2 hours ago</p>
                    </div>
                        <div className="p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                          <p className="font-medium text-foreground">SkyBridge Charters - Compliance Check</p>
                          <p className="text-sm text-muted-foreground">Insurance certificate renewed</p>
                          <p className="text-xs text-slate-400">1 day ago</p>
                    </div>
                        <div className="p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                          <p className="font-medium text-foreground">Global Wings - Aircraft Inspection</p>
                          <p className="text-sm text-muted-foreground">G650 maintenance records updated</p>
                          <p className="text-xs text-slate-400">3 days ago</p>
                  </div>
                    </div>
                    </div>
                  </div>

                  {/* Manual Verification Tools */}
                  <div className="mt-6 pt-6 border-t border-slate-600">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Manual Verification Tools</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button className="w-full">
                        <Shield className="w-4 h-4 mr-2" />
                        Verify Operator
                      </Button>
                      <Button className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Check Licenses
                      </Button>
                      <Button className="w-full">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Run Audit Trail
                      </Button>
                            </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reputation" className="mt-6 scroll-smooth">
            <ReputationMetrics userId="demo-broker-1" userType="broker" />
          </TabsContent>

          <TabsContent value="documents" className="mt-6 scroll-smooth">
            <DocumentStorage userRole="broker" />
          </TabsContent>
          <TabsContent value="communication" className="mt-6 scroll-smooth">
            <CommunicationTools terminalType="broker" />
          </TabsContent>
          <TabsContent value="notes" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              {/* Quick Notes */}
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    Quick Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Input 
                        placeholder="Add a new note..." 
                        className="flex-1 bg-slate-800/50 border-slate-600 text-white"
                      />
                      <Button className="bg-accent hover:bg-accent/90">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Recent Notes */}
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-white">Elite Aviation Group Follow-up</h4>
                          <span className="text-xs text-slate-500">2 hours ago</span>
                        </div>
                        <p className="text-sm text-slate-300">Client prefers morning departures. Need to confirm catering preferences for Dubai flight.</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-blue-500/20 text-blue-400 text-xs">Client</Badge>
                          <Badge className="bg-amber-500/20 text-amber-400 text-xs">Follow-up</Badge>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-white">Monaco Elite Special Request</h4>
                          <span className="text-xs text-slate-500">5 hours ago</span>
                        </div>
                        <p className="text-sm text-slate-300">Client requested specific champagne service and ground transportation arrangements in Monaco.</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-green-500/20 text-green-400 text-xs">VIP</Badge>
                          <Badge className="bg-purple-500/20 text-purple-400 text-xs">Special</Badge>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-white">SkyBridge Payment Terms</h4>
                          <span className="text-xs text-slate-500">1 day ago</span>
                        </div>
                        <p className="text-sm text-slate-300">Confirmed 50% deposit upfront, 50% on completion. Payment via bank transfer preferred.</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Payment</Badge>
                          <Badge className="bg-slate-500/20 text-slate-400 text-xs">Confirmed</Badge>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-white">Market Research - Gulfstream G650</h4>
                          <span className="text-xs text-slate-500">2 days ago</span>
                        </div>
                        <p className="text-sm text-slate-300">Average market rate for LHR-DXB route is £42,000-£48,000. Current quote at £45,000 is competitive.</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-orange-500/20 text-orange-400 text-xs">Research</Badge>
                          <Badge className="bg-blue-500/20 text-blue-400 text-xs">Market</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Notes */}
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    Client Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                          <span className="text-xs font-semibold">EA</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Elite Aviation Group</h4>
                          <p className="text-sm text-slate-400">Premium client since 2023</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300">Prefers early morning departures. Very particular about catering - only Dom Pérignon champagne. Always books with 48hr notice minimum. Excellent payment history.</p>
                    </div>

                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                          <span className="text-xs font-semibold">ME</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-white">Monaco Elite</h4>
                          <p className="text-sm text-slate-400">VIP client since 2024</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300">Luxury-focused client. Requires ground transportation coordination. Often books last-minute. Pays immediately upon invoicing.</p>
                    </div>

                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                          <span className="text-xs font-semibold">SV</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-white">SkyBridge Ventures</h4>
                          <p className="text-sm text-slate-400">Corporate client since 2022</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300">Business-focused client. Requires detailed invoices for accounting. Prefers larger aircraft for group travel. Standard payment terms.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="trophy" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              {/* Global Rankings */}
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-accent" />
                    Global Broker Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Top 3 Brokers */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* 1st Place */}
                      <div className="p-4 rounded-lg border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-yellow-900" />
                          </div>
                          <h3 className="font-bold text-yellow-400 mb-1">#1 Elite Aviation Brokers</h3>
                          <p className="text-sm text-slate-400 mb-2">London, UK</p>
                          <div className="space-y-1">
                            <p className="text-lg font-bold text-white">2,847 pts</p>
                            <p className="text-xs text-slate-400">127 deals • 98% satisfaction</p>
                          </div>
                        </div>
                      </div>

                      {/* 2nd Place */}
                      <div className="p-4 rounded-lg border border-slate-400/30 bg-gradient-to-br from-slate-400/10 to-slate-500/5">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-slate-900" />
                          </div>
                          <h3 className="font-bold text-slate-300 mb-1">#2 SkyBridge Global</h3>
                          <p className="text-sm text-slate-400 mb-2">New York, USA</p>
                          <div className="space-y-1">
                            <p className="text-lg font-bold text-white">2,634 pts</p>
                            <p className="text-xs text-slate-400">98 deals • 96% satisfaction</p>
                          </div>
                        </div>
                      </div>

                      {/* 3rd Place */}
                      <div className="p-4 rounded-lg border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-orange-600/5">
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-orange-900" />
                          </div>
                          <h3 className="font-bold text-orange-400 mb-1">#3 Monaco Elite Partners</h3>
                          <p className="text-sm text-slate-400 mb-2">Monaco</p>
                          <div className="space-y-1">
                            <p className="text-lg font-bold text-white">2,421 pts</p>
                            <p className="text-xs text-slate-400">89 deals • 97% satisfaction</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Your Ranking */}
                    <div className="p-4 rounded-lg border border-accent/30 bg-gradient-to-r from-accent/10 to-accent/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center">
                            <span className="text-sm font-bold text-black">12</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-accent">Your Ranking</h4>
                            <p className="text-sm text-slate-400">567 points • Golden Tier</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">#12</p>
                          <p className="text-sm text-green-400">+23 this week</p>
                        </div>
                      </div>
                    </div>

                    {/* Ranking Table */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-white mb-3">Top 10 Brokers</h4>
                      <div className="space-y-2">
                        {[
                          { rank: 4, name: "Global Wings Aviation", location: "Dubai, UAE", points: 2156, deals: 76, satisfaction: "95%" },
                          { rank: 5, name: "Atlantic Charter Co.", location: "Miami, USA", points: 2089, deals: 82, satisfaction: "94%" },
                          { rank: 6, name: "European Sky Group", location: "Zurich, CH", points: 1987, deals: 71, satisfaction: "96%" },
                          { rank: 7, name: "Pacific Elite", location: "Singapore", points: 1876, deals: 68, satisfaction: "93%" },
                          { rank: 8, name: "Nordic Aviation", location: "Stockholm, SE", points: 1743, deals: 59, satisfaction: "95%" },
                          { rank: 9, name: "Mediterranean Air", location: "Rome, IT", points: 1634, deals: 54, satisfaction: "92%" },
                          { rank: 10, name: "Caribbean Wings", location: "Barbados", points: 1521, deals: 47, satisfaction: "94%" }
                        ].map((broker) => (
                          <div key={broker.rank} className="flex items-center justify-between p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold">
                                {broker.rank}
                              </span>
                              <div>
                                <p className="font-medium text-white">{broker.name}</p>
                                <p className="text-sm text-slate-400">{broker.location}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-white">{broker.points.toLocaleString()} pts</p>
                              <p className="text-xs text-slate-400">{broker.deals} deals • {broker.satisfaction}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Your Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <p className="text-2xl font-bold text-accent mb-1">567</p>
                      <p className="text-sm text-slate-400">Total Points</p>
                      <p className="text-xs text-green-400 mt-1">+23 this week</p>
                    </div>
                    <div className="text-center p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <p className="text-2xl font-bold text-accent mb-1">98%</p>
                      <p className="text-sm text-slate-400">Client Satisfaction</p>
                      <p className="text-xs text-green-400 mt-1">Above average</p>
                    </div>
                    <div className="text-center p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <p className="text-2xl font-bold text-accent mb-1">2.3h</p>
                      <p className="text-sm text-slate-400">Avg Response Time</p>
                      <p className="text-xs text-green-400 mt-1">Fast lane eligible</p>
                    </div>
                    <div className="text-center p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <p className="text-2xl font-bold text-accent mb-1">127</p>
                      <p className="text-sm text-slate-400">Successful Deals</p>
                      <p className="text-xs text-green-400 mt-1">5 this month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="jobs" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              {/* Job Postings */}
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-accent" />
                    Available Positions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Job 1 */}
                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">Senior Charter Broker</h3>
                          <p className="text-sm text-slate-400">Elite Aviation Group • London, UK</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-green-500/20 text-green-400">Full-time</Badge>
                            <Badge className="bg-blue-500/20 text-blue-400">Remote</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-accent">£75,000</p>
                          <p className="text-sm text-slate-400">per year</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">
                        Seeking experienced charter broker to manage VIP client relationships and coordinate luxury aviation services. 
                        Minimum 5 years experience in private aviation required.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-400">Posted 2 days ago</span>
                          <span className="text-sm text-slate-400">12 applicants</span>
                        </div>
                        <Button size="sm">Apply Now</Button>
                      </div>
                    </div>

                    {/* Job 2 */}
                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">Business Development Manager</h3>
                          <p className="text-sm text-slate-400">SkyBridge Global • New York, USA</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-green-500/20 text-green-400">Full-time</Badge>
                            <Badge className="bg-purple-500/20 text-purple-400">Hybrid</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-accent">$95,000</p>
                          <p className="text-sm text-slate-400">per year</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">
                        Drive growth in corporate aviation market. Develop strategic partnerships and expand client base. 
                        Strong sales background and aviation industry knowledge preferred.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-400">Posted 1 week ago</span>
                          <span className="text-sm text-slate-400">8 applicants</span>
                        </div>
                        <Button size="sm">Apply Now</Button>
                      </div>
                    </div>

                    {/* Job 3 */}
                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">Operations Coordinator</h3>
                          <p className="text-sm text-slate-400">Monaco Elite Partners • Monaco</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-amber-500/20 text-amber-400">Contract</Badge>
                            <Badge className="bg-blue-500/20 text-blue-400">On-site</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-accent">€65,000</p>
                          <p className="text-sm text-slate-400">per year</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">
                        Coordinate flight operations for luxury charter services. Manage schedules, crew assignments, and client communications. 
                        Fluent French and English required.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-400">Posted 3 days ago</span>
                          <span className="text-sm text-slate-400">5 applicants</span>
                        </div>
                        <Button size="sm">Apply Now</Button>
                      </div>
                    </div>

                    {/* Job 4 */}
                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">Client Relations Specialist</h3>
                          <p className="text-sm text-slate-400">Global Wings Aviation • Dubai, UAE</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-green-500/20 text-green-400">Full-time</Badge>
                            <Badge className="bg-blue-500/20 text-blue-400">Remote</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-accent">AED 180,000</p>
                          <p className="text-sm text-slate-400">per year</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">
                        Manage VIP client relationships across Middle East and Asia. Provide exceptional service and coordinate complex travel arrangements. 
                        Arabic language skills preferred.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-400">Posted 5 days ago</span>
                          <span className="text-sm text-slate-400">15 applicants</span>
                        </div>
                        <Button size="sm">Apply Now</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Your Applications */}
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    Your Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div>
                        <h4 className="font-medium text-white">Senior Charter Broker - Elite Aviation</h4>
                        <p className="text-sm text-slate-400">Applied 1 day ago</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400">Under Review</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div>
                        <h4 className="font-medium text-white">Business Development Manager - SkyBridge</h4>
                        <p className="text-sm text-slate-400">Applied 3 days ago</p>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-400">Interview Scheduled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div>
                        <h4 className="font-medium text-white">Operations Coordinator - Monaco Elite</h4>
                        <p className="text-sm text-slate-400">Applied 1 week ago</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">Accepted</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="community" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              {/* Active Discussions */}
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    Active Discussions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                          <span className="text-xs font-semibold">MJ</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-white">Market Trends Q4 2025</h4>
                            <Badge className="bg-blue-500/20 text-blue-400">Trending</Badge>
                          </div>
                          <p className="text-sm text-slate-300 mb-2">What's everyone seeing in terms of pricing for transatlantic routes this quarter? Gulfstream G650 rates seem to be stabilizing around £45-50k.</p>
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>Michael Johnson • 2 hours ago</span>
                            <span>12 replies</span>
                            <span>23 likes</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                          <span className="text-xs font-semibold">SL</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-white">Best Practices for Client Onboarding</h4>
                            <Badge className="bg-green-500/20 text-green-400">Helpful</Badge>
                          </div>
                          <p className="text-sm text-slate-300 mb-2">Sharing our new client onboarding checklist that's helped reduce response time by 40%. Happy to discuss implementation.</p>
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>Sarah Lee • 4 hours ago</span>
                            <span>8 replies</span>
                            <span>15 likes</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                          <span className="text-xs font-semibold">DC</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-white">New Operator Alert: Monaco Elite Partners</h4>
                            <Badge className="bg-amber-500/20 text-amber-400">New</Badge>
                          </div>
                          <p className="text-sm text-slate-300 mb-2">Just worked with Monaco Elite Partners on a CDG-MCM route. Excellent service, competitive pricing. Highly recommend for European luxury charters.</p>
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>David Chen • 6 hours ago</span>
                            <span>5 replies</span>
                            <span>9 likes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Industry News */}
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Industry News
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <h4 className="font-medium text-white mb-1">Gulfstream Announces New G800 Certification</h4>
                      <p className="text-sm text-slate-300 mb-2">Latest ultra-long-range business jet receives EASA certification, opening new route possibilities for charter operators.</p>
                      <p className="text-xs text-slate-400">Aviation Week • 1 hour ago</p>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <h4 className="font-medium text-white mb-1">European Charter Market Grows 15% in Q3</h4>
                      <p className="text-sm text-slate-300 mb-2">Strong demand for luxury travel drives growth across major European routes, particularly Mediterranean destinations.</p>
                      <p className="text-xs text-slate-400">Business Aviation News • 3 hours ago</p>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <h4 className="font-medium text-white mb-1">New Sustainability Initiatives in Private Aviation</h4>
                      <p className="text-sm text-slate-300 mb-2">Major operators commit to carbon offset programs and sustainable aviation fuel adoption by 2026.</p>
                      <p className="text-xs text-slate-400">Private Jet News • 5 hours ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="saved-crews" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              {/* Favorite Crews */}
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    Favorite Crews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                            <span className="text-sm font-semibold">EA</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">Elite Aviation Crew Alpha</h3>
                            <p className="text-sm text-slate-400">Gulfstream G650 Specialist</p>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">Available</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-slate-500">Captain</p>
                          <p className="text-sm text-white">James Mitchell</p>
                          <p className="text-xs text-slate-400">8,500+ hours</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">First Officer</p>
                          <p className="text-sm text-white">Sarah Thompson</p>
                          <p className="text-xs text-slate-400">5,200+ hours</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Flight Attendant</p>
                          <p className="text-sm text-white">Maria Rodriguez</p>
                          <p className="text-xs text-slate-400">10+ years experience</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-400">Last flight: 2 days ago</span>
                          <span className="text-sm text-green-400">Rating: 4.9/5</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View Details</Button>
                          <Button size="sm">Book Crew</Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                            <span className="text-sm font-semibold">GW</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">Global Wings Team Bravo</h3>
                            <p className="text-sm text-slate-400">Bombardier Global 7500</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-400">Scheduled</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-slate-500">Captain</p>
                          <p className="text-sm text-white">Robert Chen</p>
                          <p className="text-xs text-slate-400">12,000+ hours</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">First Officer</p>
                          <p className="text-sm text-white">Emma Wilson</p>
                          <p className="text-xs text-slate-400">6,800+ hours</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Flight Attendant</p>
                          <p className="text-sm text-white">Sophie Laurent</p>
                          <p className="text-xs text-slate-400">Bilingual French/English</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-400">Next available: Sep 22</span>
                          <span className="text-sm text-green-400">Rating: 4.8/5</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View Details</Button>
                          <Button size="sm" variant="outline">Pre-book</Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                            <span className="text-sm font-semibold">SC</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">SkyBridge Crew Charlie</h3>
                            <p className="text-sm text-slate-400">Citation CJ3+ Specialists</p>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">Available</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-slate-500">Captain</p>
                          <p className="text-sm text-white">Alexandre Dubois</p>
                          <p className="text-xs text-slate-400">7,200+ hours</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">First Officer</p>
                          <p className="text-sm text-white">Lisa Anderson</p>
                          <p className="text-xs text-slate-400">4,500+ hours</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Flight Attendant</p>
                          <p className="text-sm text-white">Grace Kim</p>
                          <p className="text-xs text-slate-400">Wine & dining specialist</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-400">Last flight: 1 week ago</span>
                          <span className="text-sm text-green-400">Rating: 4.7/5</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View Details</Button>
                          <Button size="sm">Book Crew</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Crew Search */}
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-accent" />
                    Find New Crews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600">
                          <SelectValue placeholder="Aircraft Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gulfstream-g650">Gulfstream G650</SelectItem>
                          <SelectItem value="global-7500">Global 7500</SelectItem>
                          <SelectItem value="citation-cj3">Citation CJ3+</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600">
                          <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="london">London</SelectItem>
                          <SelectItem value="new-york">New York</SelectItem>
                          <SelectItem value="monaco">Monaco</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="bg-slate-800/50 border-slate-600">
                          <SelectValue placeholder="Availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="within-week">Within Week</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full bg-accent hover:bg-accent/90">
                      <Search className="w-4 h-4 mr-2" />
                      Search Available Crews
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="flight-tracking" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              {/* Active Flights */}
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-accent" />
                    Active Flights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">Flight SBA-2451</h3>
                          <p className="text-sm text-slate-400">Elite Aviation Group • Gulfstream G650</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">In Flight</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-slate-500">Route</p>
                          <p className="text-sm text-white">LHR → DXB</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Status</p>
                          <p className="text-sm text-green-400">On time</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">ETA</p>
                          <p className="text-sm text-white">14:30 UTC</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-400">8 passengers</span>
                          <span className="text-sm text-slate-400">Crew: Mitchell, Thompson, Rodriguez</span>
                        </div>
                        <Button size="sm" variant="outline">Track Flight</Button>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">Flight GW-1873</h3>
                          <p className="text-sm text-slate-400">Global Wings Aviation • Global 7500</p>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-400">Boarding</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-slate-500">Route</p>
                          <p className="text-sm text-white">JFK → LAX</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Status</p>
                          <p className="text-sm text-blue-400">Boarding</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">ETD</p>
                          <p className="text-sm text-white">16:45 UTC</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-400">12 passengers</span>
                          <span className="text-sm text-slate-400">Crew: Chen, Wilson, Laurent</span>
                        </div>
                        <Button size="sm" variant="outline">Track Flight</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Flights */}
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    Upcoming Flights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div>
                        <h4 className="font-medium text-white">SC-3241 • Citation CJ3+</h4>
                        <p className="text-sm text-slate-400">CDG → MCM • Sep 20, 2025 09:30 UTC</p>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-400">Scheduled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div>
                        <h4 className="font-medium text-white">EA-4567 • Gulfstream G650</h4>
                        <p className="text-sm text-slate-400">DXB → LHR • Sep 22, 2025 11:15 UTC</p>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-400">Confirmed</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div>
                        <h4 className="font-medium text-white">GW-2981 • Global 7500</h4>
                        <p className="text-sm text-slate-400">LAX → JFK • Sep 25, 2025 13:00 UTC</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400">Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="advanced-search" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle>Advanced Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Advanced search content will be here</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="searches" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              {/* Saved Search Alerts */}
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-accent" />
                    Saved Search Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">London to Dubai Routes</h3>
                          <p className="text-sm text-slate-400">Gulfstream G650 • £40,000-£50,000 range</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">
                        Monitor LHR-DXB routes for Gulfstream G650 aircraft within budget range. 
                        Get alerts for new listings and price changes.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-400">3 matches found today</span>
                          <span className="text-sm text-slate-400">Last alert: 2 hours ago</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View Results</Button>
                          <Button size="sm" variant="outline">Edit Search</Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">Transatlantic Business Jets</h3>
                          <p className="text-sm text-slate-400">Global 7500 • JFK-LAX routes</p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">
                        Track availability for Global 7500 aircraft on transatlantic routes. 
                        Focus on premium business configurations.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-400">1 match found today</span>
                          <span className="text-sm text-slate-400">Last alert: 6 hours ago</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View Results</Button>
                          <Button size="sm" variant="outline">Edit Search</Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">European Luxury Charters</h3>
                          <p className="text-sm text-slate-400">Citation CJ3+ • CDG-MCM routes</p>
                        </div>
                        <Badge className="bg-amber-500/20 text-amber-400">Paused</Badge>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">
                        Monitor European luxury charter availability, particularly Paris to Monaco routes. 
                        Currently paused due to client travel schedule.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-400">Search paused</span>
                          <span className="text-sm text-slate-400">Last alert: 3 days ago</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Resume</Button>
                          <Button size="sm" variant="outline">Edit Search</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Create New Search */}
              <Card className="border-slate-600" style={{ backgroundColor: '#110f0d' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-accent" />
                    Create New Search Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400 mb-2 block">Search Name</label>
                        <Input placeholder="e.g., Weekend NYC Charters" className="bg-slate-800/50 border-slate-600" />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-2 block">Aircraft Type</label>
                        <Select>
                          <SelectTrigger className="bg-slate-800/50 border-slate-600">
                            <SelectValue placeholder="Select aircraft" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gulfstream-g650">Gulfstream G650</SelectItem>
                            <SelectItem value="global-7500">Global 7500</SelectItem>
                            <SelectItem value="citation-cj3">Citation CJ3+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400 mb-2 block">Origin</label>
                        <Input placeholder="e.g., LHR, JFK" className="bg-slate-800/50 border-slate-600" />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-2 block">Destination</label>
                        <Input placeholder="e.g., DXB, LAX" className="bg-slate-800/50 border-slate-600" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-400 mb-2 block">Max Price</label>
                        <Input placeholder="e.g., £50,000" className="bg-slate-800/50 border-slate-600" />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 mb-2 block">Alert Frequency</label>
                        <Select>
                          <SelectTrigger className="bg-slate-800/50 border-slate-600">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="daily">Daily Summary</SelectItem>
                            <SelectItem value="weekly">Weekly Summary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button className="w-full bg-accent hover:bg-accent/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Search Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </main>
      </div>
    </>
  );
};

export default DemoBrokerTerminal;