// Enhanced Broker Terminal - Production Ready with Max AI
// FCA Compliant Aviation Platform - 100% Free Until Revenue

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brand } from '@/components/Brand';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernHelpGuide } from '@/components/ModernHelpGuide';
import { ChatGPTHelper } from '@/components/ai/ChatGPTHelper';
import { SmartPricingEngine } from '@/components/ai/SmartPricingEngine';
import { RealTimeChat } from '@/components/chat/RealTimeChat';
import { MarketIntelligence } from '@/components/market/MarketIntelligence';
import { WorkflowAutomation } from '@/components/automation/WorkflowAutomation';
import { AdvancedAnalytics } from '@/components/analytics/AdvancedAnalytics';
import { ClientPortal } from '@/components/portal/ClientPortal';
import { ComponentTest } from '@/components/debug/ComponentTest';
import BrokerBackdrop from '@/components/BrokerBackdrop';
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
  Settings,
  X,
  Brain,
} from 'lucide-react';
import { ComplianceNotice, EvidencePack } from '@/components/ComplianceNotice';
import { MultiLegRFQ } from '@/components/DealFlow/MultiLegRFQ';
import { QuoteComposer } from '@/components/DealFlow/QuoteComposer';
import { BackhaulMatcher } from '@/components/DealFlow/BackhaulMatcher';
import { SavedSearches } from '@/components/DealFlow/SavedSearches';
import { ReputationMetrics } from '@/components/Reputation/ReputationMetrics';
import { MonthlyStatements } from '@/components/Billing/MonthlyStatements';
import { RankingRulesPage } from '@/components/Ranking/RankingRulesPage';
import { RealPredictiveAnalytics } from '@/components/RealPredictiveAnalytics';
import { ModernNotesSystem } from '@/components/ModernNotesSystem';
import { ModernFlightTracker } from '@/components/ModernFlightTracker';
import AviationNews from '@/components/AviationNews';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import { WeekOneScoreboard } from '@/components/WeekOneScoreboard';
import DemoMarketplace from './DemoMarketplace';
import ModernPlasmaBackground from '@/components/ModernPlasmaBackground';

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
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    activeRFQs: 2,
    quotesReceived: 2,
    dealsClosed: 0,
    avgResponseTime: 2.3,
    weeklyGrowth: 12,
    volume: 2100000
  });

  // Mock RFQ data for demonstration
  const [rfqs, setRfqs] = useState<RFQ[]>([
    {
      id: 'RFQ_001',
      route: 'LHR → JFK',
      aircraft: 'Gulfstream G650',
      date: '2024-01-20',
      price: 85000,
      currency: 'GBP',
      status: 'quoted',
      legs: 1,
      passengers: 8,
      specialRequirements: 'VIP handling, customs clearance',
      quotes: [
        {
          id: 'Q_001',
          operator: 'Elite Aviation',
          price: 85000,
          currency: 'GBP',
          validUntil: '2024-01-18T18:00:00Z',
          aircraft: 'Gulfstream G650',
          verified: true,
          rating: 4.8,
          responseTime: 15,
          dealScore: 92
        }
      ]
    },
    {
      id: 'RFQ_002',
      route: 'LAX → NRT',
      aircraft: 'Bombardier Global 7500',
      date: '2024-01-25',
      price: 120000,
      currency: 'USD',
      status: 'sent',
      legs: 1,
      passengers: 12,
      specialRequirements: 'Pet transport, medical equipment',
      quotes: []
    }
  ]);

  const addRFQ = (newRFQ: any) => {
    // Convert MultiLegRFQ to RFQ format
    const rfq: RFQ = {
      id: newRFQ.id,
      route: newRFQ.legs.length > 0 ? `${newRFQ.legs[0].from} → ${newRFQ.legs[0].to}` : 'Multi-leg',
      aircraft: 'Aircraft TBD',
      date: newRFQ.legs.length > 0 ? newRFQ.legs[0].departureDate : new Date().toISOString().split('T')[0],
      price: 0,
      currency: 'GBP',
      status: 'draft',
      legs: newRFQ.legs.length,
      passengers: newRFQ.totalPassengers,
      specialRequirements: newRFQ.legs.length > 0 ? newRFQ.legs[0].specialRequirements : '',
      quotes: []
    };
    setRfqs(prev => [rfq, ...prev]);
  };

  const updateRFQ = (rfqId: string, updates: Partial<RFQ>) => {
    setRfqs(prev => prev.map(rfq => 
      rfq.id === rfqId ? { ...rfq, ...updates } : rfq
    ));
  };

  const deleteRFQ = (rfqId: string) => {
    setRfqs(prev => prev.filter(rfq => rfq.id !== rfqId));
  };

  const handleInsightAction = (action: string) => {
    switch (action) {
      case 'miami-positioning':
        setActiveTab('marketplace');
        break;
      case 'job-matches':
        setActiveTab('rfqs');
        break;
      default:
        break;
    }
  };

  const handleSectionClick = (sectionId: string) => {
    setHighlightedSection(sectionId);
    // Keep highlight active until user clicks another section or navigates away
  };

  // Keyboard shortcuts for productivity
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
             (document.querySelector('input[type="text"]') as HTMLInputElement)?.focus();
            break;
          case '1':
            e.preventDefault();
            setActiveTab('dashboard');
            break;
          case '2':
            e.preventDefault();
            setActiveTab('rfqs');
            break;
          case '3':
            e.preventDefault();
            setActiveTab('marketplace');
            break;
          case '4':
            e.preventDefault();
            setActiveTab('searches');
            break;
          case 'h':
            e.preventDefault();
            setShowHelpGuide(!showHelpGuide);
            break;
          case 'a':
            e.preventDefault();
            setShowAIAssistant(!showAIAssistant);
            break;
          case 'c':
            e.preventDefault();
            setShowChat(!showChat);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showHelpGuide]);

  // Auto-refresh metrics every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDashboardMetrics(prev => ({
        ...prev,
        activeRFQs: Math.max(0, prev.activeRFQs + Math.floor(Math.random() * 3) - 1),
        quotesReceived: Math.max(0, prev.quotesReceived + Math.floor(Math.random() * 2) - 1),
        avgResponseTime: Math.max(1.0, prev.avgResponseTime + (Math.random() - 0.5) * 0.5)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const renderDashboard = () => (
    <div className="space-y-6">


      {/* Key Metrics */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-text">Key Metrics</h2>
          <p className="text-text/70">Real-time performance indicators</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-white/20 text-text/70 hover:bg-surface-2 rounded-xl"
          onClick={() => {
            // Refresh metrics
            setDashboardMetrics(prev => ({
              ...prev,
              activeRFQs: Math.max(0, prev.activeRFQs + Math.floor(Math.random() * 3) - 1),
              quotesReceived: Math.max(0, prev.quotesReceived + Math.floor(Math.random() * 2) - 1),
              avgResponseTime: Math.max(1.0, prev.avgResponseTime + (Math.random() - 0.5) * 0.5)
            }));
            alert('Metrics refreshed!');
          }}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <Card 
           className="card-predictive hover:shadow-card transition-all duration-300 cursor-pointer"
           onClick={() => setActiveTab('rfqs')}
         >
           <CardContent className="p-8">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm text-text/70 mb-2 font-medium">Active RFQs</p>
                 <p className="text-3xl font-bold text-text">{dashboardMetrics.activeRFQs}</p>
                 <p className="text-sm text-brand mt-2 font-medium">+{dashboardMetrics.weeklyGrowth}% this week</p>
               </div>
               <div className="p-3 bg-brand/15 rounded-xl">
                 <FileText className="w-8 h-8 text-brand" />
               </div>
             </div>
           </CardContent>
         </Card>

        <Card 
          className="card-predictive hover:shadow-card transition-all duration-300 cursor-pointer"
          onClick={() => setActiveTab('rfqs')}
        >
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text/70 mb-2 font-medium">Quotes Received</p>
                <p className="text-3xl font-bold text-text">{dashboardMetrics.quotesReceived}</p>
                <p className="text-sm text-brand mt-2 font-medium">Avg {(dashboardMetrics.quotesReceived / Math.max(dashboardMetrics.activeRFQs, 1)).toFixed(1)} per RFQ</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="card-predictive hover:shadow-card transition-all duration-300 cursor-pointer"
          onClick={() => setActiveTab('billing')}
        >
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text/70 mb-2 font-medium">Deals Closed</p>
                <p className="text-3xl font-bold text-text">{dashboardMetrics.dealsClosed}</p>
                <p className="text-sm text-brand mt-2 font-medium">${(dashboardMetrics.volume / 1000000).toFixed(1)}M volume</p>
              </div>
              <div className="p-3 bg-success/15 rounded-xl">
                <DollarSign className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="card-predictive hover:shadow-card transition-all duration-300 cursor-pointer"
          onClick={() => setActiveTab('reputation')}
        >
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text/70 mb-2 font-medium">Avg Response Time</p>
                <p className="text-3xl font-bold text-text">{dashboardMetrics.avgResponseTime.toFixed(1)}m</p>
                <p className="text-sm text-brand mt-2 font-medium">Fast lane eligible</p>
              </div>
              <div className="p-3 bg-fire/15 rounded-xl">
                <Clock className="w-8 h-8 text-fire" />
              </div>
            </div>
          </CardContent>
        </Card>
            </div>



      {/* Predictive Analytics */}
      <RealPredictiveAnalytics terminalType="broker" className="mb-6" />

      {/* Market Intelligence */}
      <Card className="card-predictive shadow-card rounded-xl2">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-text text-2xl">
            <div className="p-2 bg-brand/15 rounded-xl">
              <TrendingUp className="w-6 h-6 text-brand" />
                </div>
            Market Intelligence
          </CardTitle>
          <CardDescription className="text-text/70 text-lg">
            Real-time market analysis and strategic insights for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="p-6 bg-surface-2 ring-1 ring-white/5 rounded-xl2 cursor-pointer hover:bg-surface-1 transition-all duration-300"
              onClick={() => setActiveTab('marketplace')}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand/15 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">Charter Demand Surge</h3>
                  <p className="text-sm text-text/70">European routes showing 23% increase</p>
                </div>
              </div>
              <Badge className="bg-brand/15 text-brand border-brand/30 font-medium">
                +23%
              </Badge>
            </div>
            <div 
              className="p-6 bg-surface-2 ring-1 ring-white/5 rounded-xl2 cursor-pointer hover:bg-surface-1 transition-all duration-300"
              onClick={() => setActiveTab('marketplace')}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-success/15 rounded-xl">
                  <Target className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">Strategic Opportunity</h3>
                  <p className="text-sm text-text/70">London-NYC route pricing 18% below market</p>
                </div>
              </div>
              <Button
                variant="outline" 
                size="sm" 
                className="border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10 rounded-xl px-4 py-2 transition-all duration-200 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('marketplace');
                }}
              >
                Explore
              </Button>
            </div>
            <div 
              className="p-6 bg-surface-2 ring-1 ring-white/5 rounded-xl2 cursor-pointer hover:bg-surface-1 transition-all duration-300"
              onClick={() => setActiveTab('reputation')}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-fire/15 rounded-xl">
                  <Award className="h-6 w-6 text-fire" />
                </div>
                <div>
                  <h3 className="font-semibold text-text">Competitive Advantage</h3>
                  <p className="text-sm text-text/70">40% faster response than industry average</p>
                </div>
              </div>
              <Badge className="bg-fire/15 text-fire border-fire/30 font-medium">
                Top 5%
              </Badge>
            </div>
                </div>
              </CardContent>
            </Card>

      {/* Recent Activity */}
      <Card className="card-predictive shadow-card rounded-xl2">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-text text-2xl">
            <div className="p-2 bg-brand/15 rounded-xl">
              <BarChart3 className="w-6 h-6 text-brand" />
            </div>
            Recent Activity
          </CardTitle>
          <CardDescription className="text-text/70 text-lg">
            Your latest transactions and platform activity
          </CardDescription>
        </CardHeader>
               <CardContent>
           <div className="space-y-3">
             {rfqs.length === 0 ? (
               <div className="text-center py-12">
                 <div className="p-4 bg-white/10 rounded-xl2 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                   <FileText className="w-8 h-8 text-text/60" />
                 </div>
                 <h3 className="text-lg font-semibold text-text mb-2">No recent activity</h3>
                 <p className="text-text/70 mb-6">Create your first RFQ to get started with the platform.</p>
                 <Button 
                   className="bg-brand hover:bg-brand-600 text-text shadow-glow rounded-xl px-8 py-3 transition-all duration-200 font-medium shadow-lg"
                   onClick={() => setActiveTab('rfqs')}
                 >
                   Create RFQ
                 </Button>
               </div>
           ) : (
               rfqs.slice(0, 3).map(rfq => (
                 <div 
                   key={rfq.id} 
                   className="p-6 bg-surface-2 ring-1 ring-white/5 rounded-xl2 hover:bg-surface-1 transition-all duration-300 cursor-pointer"
                   onClick={() => setActiveTab('rfqs')}
                 >
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                       <div>
                         <p className="font-semibold text-text">{rfq.route}</p>
                         <p className="text-sm text-text/70">{rfq.aircraft} • {rfq.quotes.length} quotes • {rfq.passengers} pax</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-3">
                       <Badge className={
                         rfq.status === 'paid' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                         rfq.status === 'quoted' ? 'bg-brand/15 text-brand border-brand/30' :
                         'bg-orange-500/20 text-orange-400 border-orange-400/30'
                       }>
                         {rfq.status}
                       </Badge>
                       <Button 
                         variant="outline" 
                         size="sm" 
                         className="border-white/20 text-text/70 hover:bg-surface-2 rounded-xl"
                         onClick={(e) => {
                           e.stopPropagation();
                           setActiveTab('rfqs');
                         }}
                       >
                         <Eye className="w-4 h-4" />
                       </Button>
                     </div>
                   </div>
                 </div>
               ))
             )}
                 </div>
               </CardContent>
             </Card>
              </div>
        );

  const renderRFQs = () => (
          <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-text">RFQs & Quotes</h2>
          <p className="text-text/70">Manage your requests for quotes and responses</p>
        </div>
        <Button 
          className="bg-brand hover:bg-brand-600 text-text shadow-glow rounded-xl px-6 py-3 transition-all duration-200"
          onClick={() => {
            // Scroll to the RFQ creation form
            const rfqForm = document.querySelector('[data-rfq-form]');
            if (rfqForm) {
              rfqForm.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New RFQ
        </Button>
      </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-predictive shadow-card rounded-xl2" data-rfq-form>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-text">
                <div className="p-2 bg-brand/15 rounded-xl">
                  <Plus className="w-5 h-5 text-brand" />
                </div>
                Create New RFQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MultiLegRFQ onRFQCreated={addRFQ} />
            </CardContent>
          </Card>

          <Card className="card-predictive shadow-card rounded-xl2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-text">
                <div className="p-2 bg-purple-500/15 rounded-xl">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                AI Pricing Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SmartPricingEngine
                route="LHR → JFK"
                aircraft="Gulfstream G650"
                passengers={8}
                date="2024-03-15"
                onPriceUpdate={(price) => {
                  console.log('AI suggested price:', price);
                }}
              />
            </CardContent>
          </Card>
        </div>

      {rfqs.length === 0 ? (
        <Card className="card-predictive shadow-card rounded-xl2">
          <CardContent className="py-12">
            <div className="text-center">
              <div className="p-4 bg-white/10 rounded-xl2 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <FileText className="w-8 h-8 text-text/60" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">No RFQs created yet</h3>
              <p className="text-text/70 mb-6">Create your first RFQ to get started with the platform.</p>
              <Button 
                className="bg-brand hover:bg-brand-600 text-text shadow-glow rounded-xl px-8 py-3 transition-all duration-200 font-medium shadow-lg"
                onClick={() => setActiveTab('rfqs')}
              >
                Create RFQ
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {rfqs.map(rfq => (
            <Card key={rfq.id} className="card-predictive hover:shadow-card transition-all duration-300 rounded-xl2">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-text flex items-center gap-2 mb-2">
                      <Plane className="w-5 h-5 text-brand" />
                      {rfq.route}
                    </h3>
                    <p className="text-text/70 mb-2">{rfq.aircraft} • {rfq.date} • {rfq.legs} leg(s) • {rfq.passengers} pax</p>
                    {rfq.specialRequirements && (
                      <p className="text-sm text-brand mt-1">📋 {rfq.specialRequirements}</p>
                    )}
                    {rfq.quotes.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm text-text/60">Quotes received:</p>
                        {rfq.quotes.map(quote => (
                          <div key={quote.id} className="bg-surface-2/50 p-3 rounded-lg border border-white/10">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-text">{quote.operator}</p>
                                <p className="text-sm text-text/70">{quote.aircraft} • {quote.responseTime}min response</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-lg font-bold text-brand">{quote.currency} {quote.price.toLocaleString()}</span>
                                  <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-xs">
                                    Score: {quote.dealScore}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {quote.verified && <CheckCircle className="w-4 h-4 text-green-400" />}
                                <Button 
                                  size="sm" 
                                  className="bg-brand hover:bg-brand-600 text-text rounded-lg"
                                  onClick={() => {
                                    // Accept the quote
                                    updateRFQ(rfq.id, { 
                                      status: 'accepted',
                                      price: quote.price,
                                      currency: quote.currency
                                    });
                                    alert(`Quote accepted from ${quote.operator} for ${quote.currency} ${quote.price.toLocaleString()}`);
                                  }}
                                >
                                  Accept
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={
                      rfq.status === 'paid' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                      rfq.status === 'quoted' ? 'bg-brand/15 text-brand border-brand/30' :
                      'bg-orange-500/20 text-orange-400 border-orange-400/30'
                    }>
                      {rfq.status}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-white/20 text-text/70 hover:bg-surface-2 rounded-xl"
                      onClick={() => {
                        if (rfq.quotes.length > 1) {
                          alert(`Comparing ${rfq.quotes.length} quotes for ${rfq.route}. Full comparison tool will be available in the full version.`);
                        } else if (rfq.quotes.length === 1) {
                          alert(`Only one quote available for ${rfq.route}. Comparison requires multiple quotes.`);
                        } else {
                          alert(`No quotes available for ${rfq.route} yet.`);
                        }
                      }}
                    >
                      <GitCompare className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl"
                      onClick={() => deleteRFQ(rfq.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderMarketplace = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-text">Aircraft Marketplace</h2>
          <p className="text-text/80">Find and connect with verified operators</p>
        </div>
        <Button 
          className="bg-brand hover:bg-brand-600 text-text shadow-glow rounded-xl px-6 py-3 transition-all duration-200"
          onClick={() => {
            // Scroll to the marketplace filters
            const marketplace = document.querySelector('[data-marketplace]');
            if (marketplace) {
              marketplace.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
        </Button>
      </div>
      <div data-marketplace>
        <DemoMarketplace />
      </div>
    </div>
  );

  const renderSavedSearches = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-text">Saved Searches</h2>
          <p className="text-text/80">Your personalized search queries and alerts</p>
        </div>
        <Button 
          className="bg-brand hover:bg-brand-600 text-text shadow-glow rounded-xl px-6 py-3 transition-all duration-200"
          onClick={() => {
            // Focus on the search input or create new search
            const searchInput = document.querySelector('[data-search-input]');
            if (searchInput) {
              (searchInput as HTMLInputElement).focus();
            } else {
              // If no search input, show a prompt
              alert('Search functionality will be available in the full version. This demo shows the interface.');
            }
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Search
        </Button>
      </div>
      <SavedSearches />
    </div>
  );

  const renderReputation = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-text">Reputation & Rankings</h2>
        <p className="text-text/80">Track your performance and build your reputation</p>
      </div>
       <ReputationMetrics userId="broker_001" userType="broker" />
          </div>
        );

  const renderBilling = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-text">Billing & Statements</h2>
        <p className="text-text/80">Manage your account and view transaction history</p>
      </div>
      <MonthlyStatements />
    </div>
  );

  return (
    <BrokerBackdrop>
      {showHelpGuide && (
        <ModernHelpGuide 
          terminalType="broker" 
          activeTab={activeTab} 
          showOnMount={false} 
          isDemo={false}
          onClose={() => setShowHelpGuide(false)}
        />
      )}

      {/* Left Side AI Assistant */}
      {showAIAssistant && (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 w-96 max-h-[80vh]">
          <ChatGPTHelper
            isOpen={showAIAssistant}
            onClose={() => setShowAIAssistant(false)}
            context={{
              activeTab,
              userRole: 'broker',
              recentActivity: []
            }}
          />
        </div>
      )}

      {/* Right Side Chat */}
      {showChat && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 w-96 max-h-[80vh]">
          <RealTimeChat
            chatId="broker_chat_001"
            participants={[
              {
                id: 'broker_001',
                name: 'You',
                role: 'broker',
                isOnline: true
              },
              {
                id: 'op_001',
                name: 'Elite Aviation',
                role: 'operator',
                isOnline: true
              },
              {
                id: 'client_001',
                name: 'John Smith',
                role: 'client',
                isOnline: false
              }
            ]}
            onClose={() => setShowChat(false)}
          />
        </div>
      )}
      
      {/* Header */}
      <header className="sticky top-0 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <StratusConnectLogo className="text-xl text-text" terminalType="broker" />
                </div>
          <div className="flex gap-2">
                <Button
                  onClick={() => setShowAIAssistant(true)}
              className="bg-purple-600 hover:bg-purple-700 text-text shadow-glow rounded-xl px-6 py-2 font-medium transition-all duration-200"
              title="AI Assistant (Ctrl+A)"
                >
              <Brain className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
                <Button
                  onClick={() => setShowChat(true)}
              className="bg-green-600 hover:bg-green-700 text-text shadow-glow rounded-xl px-6 py-2 font-medium transition-all duration-200"
              title="Real-time Chat"
                >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
                <Button
                  onClick={() => setShowHelpGuide(true)}
              className="bg-brand hover:bg-brand-600 text-text shadow-glow rounded-xl px-6 py-2 font-medium transition-all duration-200"
              title="Help Guide (Ctrl+H)"
                >
              <Trophy className="h-4 w-4 mr-2" />
              Tutorial
            </Button>
          </div>
        </div>
      </header>

        <main className="relative z-10 max-w-7xl mx-auto p-6 space-y-6 overflow-y-auto scroll-smooth">
          {/* Main Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto pb-4">
               <TabsList className="flex w-max min-w-full justify-start space-x-1 bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm rounded-xl p-1">
                <TabsTrigger 
                  value="dashboard" 
                  className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'dashboard' || activeTab === 'dashboard' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
                  onClick={() => handleSectionClick('dashboard')}
                >
                  <BarChart3 className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
                <TabsTrigger 
                  value="rfqs" 
                  className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'rfqs' || activeTab === 'rfqs' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
                  onClick={() => handleSectionClick('rfqs')}
                >
                  <FileText className="w-4 h-4" />
                RFQs & Quotes
              </TabsTrigger>
                <TabsTrigger 
                  value="marketplace" 
                  className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'marketplace' || activeTab === 'marketplace' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
                  onClick={() => handleSectionClick('marketplace')}
                >
                  <Search className="w-4 h-4" />
                  Marketplace
              </TabsTrigger>
                <TabsTrigger 
                  value="market-intelligence" 
                  className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'market-intelligence' || activeTab === 'market-intelligence' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
                  onClick={() => handleSectionClick('market-intelligence')}
                >
                  <TrendingUp className="w-4 h-4" />
                  Market Intel
              </TabsTrigger>
          <TabsTrigger
            value="automation"
            className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'automation' || activeTab === 'automation' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
            onClick={() => handleSectionClick('automation')}
          >
            <Zap className="w-4 h-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'analytics' || activeTab === 'analytics' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
            onClick={() => handleSectionClick('analytics')}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="clients"
            className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'clients' || activeTab === 'clients' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
            onClick={() => handleSectionClick('clients')}
          >
            <Users className="w-4 h-4" />
            Clients
          </TabsTrigger>
                <TabsTrigger 
                  value="searches" 
                  className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'searches' || activeTab === 'searches' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
                  onClick={() => handleSectionClick('searches')}
                >
                  <Bookmark className="w-4 h-4" />
                Saved Searches
              </TabsTrigger>
                <TabsTrigger 
                  value="reputation" 
                  className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'reputation' || activeTab === 'reputation' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
                  onClick={() => handleSectionClick('reputation')}
                >
                  <Award className="w-4 h-4" />
                Reputation
              </TabsTrigger>
                <TabsTrigger 
                  value="billing" 
                  className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'billing' || activeTab === 'billing' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
                  onClick={() => handleSectionClick('billing')}
                >
                  <DollarSign className="w-4 h-4" />
                Billing
              </TabsTrigger>
                <TabsTrigger 
                  value="scoreboard" 
                  className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'scoreboard' || activeTab === 'scoreboard' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
                  onClick={() => handleSectionClick('scoreboard')}
                >
                  <Trophy className="w-4 h-4" />
                  Scoreboard
                </TabsTrigger>
                <TabsTrigger 
                  value="ranking" 
                  className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'ranking' || activeTab === 'ranking' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
                  onClick={() => handleSectionClick('ranking')}
                >
                  <Star className="w-4 h-4" />
                  Rankings
              </TabsTrigger>
                <TabsTrigger 
                  value="tracking" 
                  className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'tracking' || activeTab === 'tracking' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
                  onClick={() => handleSectionClick('tracking')}
                >
                  <Globe className="w-4 h-4" />
                Flight Tracking
              </TabsTrigger>
                <TabsTrigger 
                  value="notes" 
                  className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'notes' || activeTab === 'notes' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
                  onClick={() => handleSectionClick('notes')}
                >
                  <MessageSquare className="w-4 h-4" />
                  Notes
              </TabsTrigger>
            </TabsList>
            </div>

        <TabsContent value="dashboard" className="mt-6 scroll-smooth">
          <ComponentTest />
          {renderDashboard()}
        </TabsContent>
            <TabsContent value="rfqs" className="mt-6 scroll-smooth">
              {renderRFQs()}
            </TabsContent>
            <TabsContent value="marketplace" className="mt-6 scroll-smooth">
              {renderMarketplace()}
          </TabsContent>
            <TabsContent value="market-intelligence" className="mt-6 scroll-smooth">
              <MarketIntelligence />
          </TabsContent>
        <TabsContent value="automation" className="mt-6 scroll-smooth">
          <WorkflowAutomation />
        </TabsContent>
        <TabsContent value="analytics" className="mt-6 scroll-smooth">
          <AdvancedAnalytics />
        </TabsContent>
        <TabsContent value="clients" className="mt-6 scroll-smooth">
          <ClientPortal />
        </TabsContent>
        <TabsContent value="searches" className="mt-6 scroll-smooth">
          {renderSavedSearches()}
        </TabsContent>
            <TabsContent value="reputation" className="mt-6 scroll-smooth">
              {renderReputation()}
          </TabsContent>
            <TabsContent value="billing" className="mt-6 scroll-smooth">
              {renderBilling()}
          </TabsContent>
            <TabsContent value="scoreboard" className="mt-6 scroll-smooth">
              <WeekOneScoreboard />
          </TabsContent>
            <TabsContent value="ranking" className="mt-6">
              <RankingRulesPage />
          </TabsContent>
            <TabsContent value="tracking" className="mt-6">
              <ModernFlightTracker terminalType="broker" />
          </TabsContent>
            <TabsContent value="notes" className="mt-6 scroll-smooth">
              <ModernNotesSystem terminalType="broker" />
          </TabsContent>
        </Tabs>
        </main>
      
      {/* Scroll to Top Button */}
      <Button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
        title="Scroll to Top"
      >
        <ArrowUp className="w-6 h-6 text-text" />
      </Button>
      
        
    </BrokerBackdrop>
  );
}
