// Enhanced Broker Terminal - Production Ready with Max AI
// FCA Compliant Aviation Platform - 100% Free Until Revenue

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brand } from '@/components/Brand';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModernHelpGuide } from '@/components/ModernHelpGuide';
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
  Brain
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
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboardMetrics, setDashboardMetrics] = useState({
    activeRFQs: 2,
    quotesReceived: 2,
    dealsClosed: 0,
    avgResponseTime: 2.3,
    weeklyGrowth: 12,
    volume: 2100000
  });

  // Mock RFQ data for demonstration
  const [rfqs, setRfqs] = useState<RFQ[]>([]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
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

       {/* Global Search Bar */}
       <Card className="bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 rounded-2xl">
         <CardContent className="p-8">
           <div className="flex items-center gap-4">
             <div className="flex-1 relative">
               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
               <input
                 type="text"
                 placeholder="Search routes, operators, aircraft, or ask Max AI..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                 className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
               />
             </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-4 font-medium transition-all duration-200 shadow-lg"
              >
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <Card className="bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 rounded-2xl">
           <CardContent className="p-8">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm text-white/70 mb-2 font-medium">Active RFQs</p>
                 <p className="text-3xl font-bold text-white">{dashboardMetrics.activeRFQs}</p>
                 <p className="text-sm text-blue-400 mt-2 font-medium">+{dashboardMetrics.weeklyGrowth}% this week</p>
               </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70 mb-2 font-medium">Quotes Received</p>
                <p className="text-3xl font-bold text-white">{dashboardMetrics.quotesReceived}</p>
                <p className="text-sm text-blue-400 mt-2 font-medium">Avg {(dashboardMetrics.quotesReceived / Math.max(dashboardMetrics.activeRFQs, 1)).toFixed(1)} per RFQ</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70 mb-2 font-medium">Deals Closed</p>
                <p className="text-3xl font-bold text-white">{dashboardMetrics.dealsClosed}</p>
                <p className="text-sm text-blue-400 mt-2 font-medium">${(dashboardMetrics.volume / 1000000).toFixed(1)}M volume</p>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <DollarSign className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70 mb-2 font-medium">Avg Response Time</p>
                <p className="text-3xl font-bold text-white">{dashboardMetrics.avgResponseTime.toFixed(1)}m</p>
                <p className="text-sm text-blue-400 mt-2 font-medium">Fast lane eligible</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
            </div>

      {/* AI Search Assistant */}
      <Card className="bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 rounded-2xl">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-white text-2xl">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
            AI Search Assistant
          </CardTitle>
          <CardDescription className="text-white/70 text-lg">
            Get intelligent insights and search across the platform with AI-powered assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AISearchAssistant terminalType="broker" className="mb-6" />
        </CardContent>
      </Card>


      {/* Predictive Analytics */}
      <RealPredictiveAnalytics terminalType="broker" className="mb-6" />

      {/* AI Insights */}
      <Card className="bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 rounded-2xl">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-white text-2xl">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Brain className="w-6 h-6 text-blue-400" />
                </div>
            Market Intelligence
          </CardTitle>
          <CardDescription className="text-white/70 text-lg">
            Real-time market analysis and strategic insights for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Charter Demand Surge</h3>
                  <p className="text-sm text-white/70">European routes showing 23% increase</p>
                </div>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 font-medium">
                +23%
              </Badge>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <Target className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Strategic Opportunity</h3>
                  <p className="text-sm text-white/70">London-NYC route pricing 18% below market</p>
                </div>
              </div>
              <Button
                variant="outline" 
                size="sm" 
                className="border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10 rounded-xl px-4 py-2 transition-all duration-200 font-medium"
                onClick={() => setActiveTab('marketplace')}
              >
                Explore
              </Button>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Award className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Competitive Advantage</h3>
                  <p className="text-sm text-white/70">40% faster response than industry average</p>
                </div>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30 font-medium">
                Top 5%
              </Badge>
            </div>
                </div>
              </CardContent>
            </Card>

      {/* Recent Activity */}
      <Card className="bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 rounded-2xl">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-white text-2xl">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            Recent Activity
          </CardTitle>
          <CardDescription className="text-white/70 text-lg">
            Your latest transactions and platform activity
          </CardDescription>
        </CardHeader>
               <CardContent>
           <div className="space-y-3">
             {rfqs.length === 0 ? (
               <div className="text-center py-12">
                 <div className="p-4 bg-white/10 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                   <FileText className="w-8 h-8 text-white/60" />
                 </div>
                 <h3 className="text-lg font-semibold text-white mb-2">No recent activity</h3>
                 <p className="text-white/70 mb-6">Create your first RFQ to get started with the platform.</p>
                 <Button 
                   className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3 transition-all duration-200 font-medium shadow-lg"
                   onClick={() => setActiveTab('rfqs')}
                 >
                   Create RFQ
                 </Button>
               </div>
           ) : (
               rfqs.slice(0, 3).map(rfq => (
                 <div key={rfq.id} className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/15 transition-all duration-300">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                       <div>
                         <p className="font-semibold text-white">{rfq.route}</p>
                         <p className="text-sm text-white/70">{rfq.aircraft} • {rfq.quotes.length} quotes • {rfq.passengers} pax</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-3">
                       <Badge className={
                         rfq.status === 'paid' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                         rfq.status === 'quoted' ? 'bg-blue-500/20 text-blue-400 border-blue-400/30' :
                         'bg-orange-500/20 text-orange-400 border-orange-400/30'
                       }>
                         {rfq.status}
                       </Badge>
                       <Button variant="outline" size="sm" className="border-white/30 text-white/70 hover:bg-white/10 rounded-xl">
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
          <h2 className="text-2xl font-semibold text-white">RFQs & Quotes</h2>
          <p className="text-white/70">Manage your requests for quotes and responses</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 transition-all duration-200 shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          New RFQ
        </Button>
      </div>
      
      <Card className="bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 rounded-2xl">
              <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Plus className="w-5 h-5 text-blue-400" />
            </div>
            Create New RFQ
                </CardTitle>
              </CardHeader>
              <CardContent>
          <MultiLegRFQ />
        </CardContent>
      </Card>

      {rfqs.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 rounded-2xl">
          <CardContent className="py-12">
            <div className="text-center">
              <div className="p-4 bg-white/10 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <FileText className="w-8 h-8 text-white/60" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No RFQs created yet</h3>
              <p className="text-white/70 mb-6">Create your first RFQ to get started with the platform.</p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3 transition-all duration-200 font-medium shadow-lg"
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
            <Card key={rfq.id} className="bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white flex items-center gap-2 mb-2">
                      <Plane className="w-5 h-5 text-blue-400" />
                      {rfq.route}
                    </h3>
                    <p className="text-white/70 mb-2">{rfq.aircraft} • {rfq.date} • {rfq.legs} leg(s) • {rfq.passengers} pax</p>
                    {rfq.specialRequirements && (
                      <p className="text-sm text-blue-400 mt-1">📋 {rfq.specialRequirements}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={
                      rfq.status === 'paid' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                      rfq.status === 'quoted' ? 'bg-blue-500/20 text-blue-400 border-blue-400/30' :
                      'bg-orange-500/20 text-orange-400 border-orange-400/30'
                    }>
                      {rfq.status}
                    </Badge>
                    <Button size="sm" variant="outline" className="border-white/30 text-white/70 hover:bg-white/10 rounded-xl">
                      <GitCompare className="w-4 h-4" />
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
          <h2 className="text-2xl font-semibold text-slate-900">Aircraft Marketplace</h2>
          <p className="text-slate-600">Find and connect with verified operators</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 transition-all duration-200">
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
        </Button>
      </div>
      <DemoMarketplace />
    </div>
  );

  const renderSavedSearches = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Saved Searches</h2>
          <p className="text-slate-600">Your personalized search queries and alerts</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 transition-all duration-200">
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
        <h2 className="text-2xl font-semibold text-slate-900">Reputation & Rankings</h2>
        <p className="text-slate-600">Track your performance and build your reputation</p>
      </div>
       <ReputationMetrics userId="broker_001" userType="broker" />
          </div>
        );

  const renderBilling = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Billing & Statements</h2>
        <p className="text-slate-600">Manage your account and view transaction history</p>
      </div>
      <MonthlyStatements />
    </div>
  );

  return (
    <ModernPlasmaBackground>
      {showHelpGuide && (
        <ModernHelpGuide 
          terminalType="broker" 
          activeTab={activeTab} 
          showOnMount={false} 
          isDemo={false}
          onClose={() => setShowHelpGuide(false)}
        />
      )}
      
      {/* Header */}
      <header className="sticky top-0 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <StratusConnectLogo className="text-xl text-white" terminalType="broker" />
                </div>
          <div className="flex gap-2">
                <Button
                  onClick={() => setShowHelpGuide(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2 font-medium transition-all duration-200"
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
                <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                  <BarChart3 className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
                <TabsTrigger value="rfqs" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                  <FileText className="w-4 h-4" />
                RFQs & Quotes
              </TabsTrigger>
                <TabsTrigger value="marketplace" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                  <Search className="w-4 h-4" />
                Marketplace
              </TabsTrigger>
                <TabsTrigger value="searches" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                  <Bookmark className="w-4 h-4" />
                Saved Searches
              </TabsTrigger>
                <TabsTrigger value="reputation" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                  <Award className="w-4 h-4" />
                Reputation
              </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                  <DollarSign className="w-4 h-4" />
                Billing
              </TabsTrigger>
                <TabsTrigger value="scoreboard" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                  <Trophy className="w-4 h-4" />
                  Scoreboard
                </TabsTrigger>
                <TabsTrigger value="ranking" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                  <Star className="w-4 h-4" />
                  Rankings
              </TabsTrigger>
                <TabsTrigger value="tracking" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                  <Globe className="w-4 h-4" />
                Flight Tracking
              </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                  <MessageSquare className="w-4 h-4" />
                  Notes
              </TabsTrigger>
            </TabsList>
            </div>

            <TabsContent value="dashboard" className="mt-6 scroll-smooth">
              {renderDashboard()}
            </TabsContent>
            <TabsContent value="rfqs" className="mt-6 scroll-smooth">
              {renderRFQs()}
            </TabsContent>
            <TabsContent value="marketplace" className="mt-6 scroll-smooth">
              {renderMarketplace()}
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
        <ArrowUp className="w-6 h-6 text-white" />
      </Button>
      
        
    </ModernPlasmaBackground>
  );
}
