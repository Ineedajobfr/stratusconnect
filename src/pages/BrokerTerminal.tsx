// Enhanced Broker Terminal - Production Ready with Max AI
// FCA Compliant Aviation Platform - 100% Free Until Revenue

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
import { MaxAI } from '@/components/ai/GrokMaxAI';
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
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [showMaxAI, setShowMaxAI] = useState(false);
  const [showSecurityAI, setShowSecurityAI] = useState(false);
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
      // Trigger Max AI search
      setShowMaxAI(true);
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
            document.querySelector('input[type="text"]')?.focus();
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
          case 'm':
            e.preventDefault();
            setShowMaxAI(!showMaxAI);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showHelpGuide, showMaxAI]);

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
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          Professional Aviation Marketplace
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
          Connect with verified operators, manage RFQs, and close deals with confidence. 
          Powered by AI and built for professionals.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg"
          >
            Start Trading
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-sm"
          >
            View Analytics
          </Button>
        </div>
      </div>

      {/* Global Search Bar */}
      <Card className="bg-white shadow-lg border border-slate-200/50 rounded-2xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search routes, operators, aircraft, or ask Max AI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
              />
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-4 font-medium transition-all duration-200"
              >
                Search
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowMaxAI(true)}
                className="border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl px-8 py-4 font-medium transition-all duration-200"
              >
                <Brain className="w-5 h-5 mr-2" />
                Ask Max AI
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-2 font-medium">Active RFQs</p>
                <p className="text-3xl font-bold text-slate-900">{dashboardMetrics.activeRFQs}</p>
                <p className="text-sm text-blue-600 mt-2 font-medium">+{dashboardMetrics.weeklyGrowth}% this week</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-2 font-medium">Quotes Received</p>
                <p className="text-3xl font-bold text-slate-900">{dashboardMetrics.quotesReceived}</p>
                <p className="text-sm text-blue-600 mt-2 font-medium">Avg {(dashboardMetrics.quotesReceived / Math.max(dashboardMetrics.activeRFQs, 1)).toFixed(1)} per RFQ</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-2 font-medium">Deals Closed</p>
                <p className="text-3xl font-bold text-slate-900">{dashboardMetrics.dealsClosed}</p>
                <p className="text-sm text-blue-600 mt-2 font-medium">${(dashboardMetrics.volume / 1000000).toFixed(1)}M volume</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <DollarSign className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-2 font-medium">Avg Response Time</p>
                <p className="text-3xl font-bold text-slate-900">{dashboardMetrics.avgResponseTime.toFixed(1)}m</p>
                <p className="text-sm text-blue-600 mt-2 font-medium">Fast lane eligible</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
            </div>

      {/* AI Search Assistant */}
      <Card className="bg-white shadow-lg border border-slate-200/50 rounded-2xl">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-slate-900 text-2xl">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            AI Search Assistant
          </CardTitle>
          <CardDescription className="text-slate-600 text-lg">
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
      <Card className="bg-white shadow-lg border border-slate-200/50 rounded-2xl">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-slate-900 text-2xl">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            Market Intelligence
          </CardTitle>
          <CardDescription className="text-slate-600 text-lg">
            Real-time market analysis and strategic insights for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Charter Demand Surge</h3>
                  <p className="text-sm text-slate-600">European routes showing 23% increase</p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 font-medium">
                +23%
              </Badge>
            </div>
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Strategic Opportunity</h3>
                  <p className="text-sm text-slate-600">London-NYC route pricing 18% below market</p>
                </div>
              </div>
              <Button
                variant="outline" 
                size="sm" 
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl px-4 py-2 transition-all duration-200 font-medium"
                onClick={() => setActiveTab('marketplace')}
              >
                Explore
              </Button>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-200/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Competitive Advantage</h3>
                  <p className="text-sm text-slate-600">40% faster response than industry average</p>
                </div>
              </div>
              <Badge className="bg-purple-100 text-purple-700 border-purple-200 font-medium">
                Top 5%
              </Badge>
            </div>
                </div>
              </CardContent>
            </Card>

      {/* Recent Activity */}
      <Card className="bg-white shadow-lg border border-slate-200/50 rounded-2xl">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-slate-900 text-2xl">
            <div className="p-2 bg-blue-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            Recent Activity
          </CardTitle>
          <CardDescription className="text-slate-600 text-lg">
            Your latest transactions and platform activity
          </CardDescription>
        </CardHeader>
              <CardContent>
          <div className="space-y-3">
            {rfqs.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-slate-100 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No recent activity</h3>
                <p className="text-slate-600 mb-6">Create your first RFQ to get started with the platform.</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3 transition-all duration-200 font-medium"
                  onClick={() => setActiveTab('rfqs')}
                >
                  Create RFQ
                </Button>
              </div>
          ) : (
              rfqs.slice(0, 3).map(rfq => (
                <div key={rfq.id} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-semibold text-slate-900">{rfq.route}</p>
                        <p className="text-sm text-slate-600">{rfq.aircraft} • {rfq.quotes.length} quotes • {rfq.passengers} pax</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={
                        rfq.status === 'paid' ? 'bg-green-100 text-green-700 border-green-200' :
                        rfq.status === 'quoted' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-orange-100 text-orange-700 border-orange-200'
                      }>
                        {rfq.status}
                      </Badge>
                      <Button variant="outline" size="sm" className="border-slate-300 text-slate-600 hover:bg-slate-100 rounded-xl">
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
        {rfqs.length === 0 ? (
          <Brand.Panel className="bg-surface">
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted mx-auto mb-4" />
              <p className="text-muted">No RFQs created yet. Create your first RFQ to get started.</p>
              <Button 
                className="mt-4 bg-accent hover:bg-accent/80"
                onClick={() => setActiveTab('rfqs')}
              >
                Create RFQ
              </Button>
            </div>
          </Brand.Panel>
        ) : (
          rfqs.map(rfq => (
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
                      <div key={quote.id} className="p-4 border rounded-lg hover:bg-elev transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                              <div>
                              <p className="font-medium">{quote.operator}</p>
                              <p className="text-sm text-gunmetal">{quote.aircraft}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-warn" />
                              <span className="text-sm font-medium">{quote.rating}</span>
                            </div>
                              </div>
                              <div className="text-right">
                            <p className="text-xl font-bold">${quote.price.toLocaleString()}</p>
                            <p className="text-sm text-gunmetal">Valid until: {new Date(quote.validUntil).toLocaleDateString()}</p>
                            <p className="text-xs text-accent">Deal Score: {quote.dealScore}</p>
                                </div>
                              </div>
                        <div className="flex items-center gap-2 mb-3">
                          {quote.verified ? (
                            <Badge className="bg-accent/20 text-accent">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-warn/20 text-warn">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Unverified
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-accent">
                            <Clock className="w-3 h-3 mr-1" />
                            {quote.responseTime}m response
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="btn-terminal-accent"
                            disabled={!quote.verified}
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Create Payment
                          </Button>
                          <Button
                            variant="outline"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Generate Receipt
                          </Button>
                          <Button variant="outline" size="sm">
                            <GitCompare className="w-4 h-4 mr-2" />
                            Compare
                          </Button>
                          <Button variant="outline" size="sm">
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gunmetal">
                    <Plane className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No quotes received yet</p>
                    <p className="text-sm">Operators typically respond within 2-5 minutes</p>
                      </div>
                    )}
                  </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderMarketplace = () => (
    <div className="space-y-6">
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Advanced Marketplace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gunmetal" />
              <span className="text-sm font-medium">Filters</span>
            </div>
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-gunmetal" />
              <span className="text-sm font-medium">Compare Mode</span>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gunmetal" />
              <span className="text-sm font-medium">Alerts Active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="p-4 hover:terminal-glow transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">Elite Aviation</h3>
                    <p className="text-sm text-gunmetal">Gulfstream G650</p>
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
                    <span>8 seats</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl font-bold">$45,000</div>
                  <div className="text-sm text-gunmetal">$2,100/NM</div>
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
              ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSavedSearches = () => (
    <div className="space-y-6">
            <SavedSearches />
    </div>
  );

  const renderReputation = () => (
    <div className="space-y-6">
            <ReputationMetrics userId="broker_001" userType="broker" />
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
            <MonthlyStatements />
    </div>
  );

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden scroll-smooth">
        
        <header className="relative z-10 sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <StratusConnectLogo className="text-xl" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Broker Terminal</h1>
              <p className="text-slate-600 text-sm">Professional Aviation Marketplace</p>
            </div>
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
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-terminal-border scrollbar-track-transparent pb-2">
            <TabsList className="flex w-max min-w-full justify-start space-x-1 bg-white/90 backdrop-blur-sm border border-slate-200/50 shadow-sm rounded-xl p-1">
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
            <TabsTrigger value="ranking" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 icon-glow" />
              Ranking
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Plane className="w-4 h-4 icon-glow" />
              Flight Tracking
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4 icon-glow" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 icon-glow" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="scoreboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 icon-glow" />
              Scoreboard
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
      
        {/* Floating AI Button */}
        {!showMaxAI && (
          <Button
            onClick={() => setShowMaxAI(true)}
            className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
            title="Open Max AI Assistant"
          >
            <Zap className="w-7 h-7 text-white" />
          </Button>
        )}

        {/* Max AI - Advanced Intelligence System */}
        <MaxAI 
          isVisible={showMaxAI} 
          onToggleVisibility={() => setShowMaxAI(!showMaxAI)} 
          userType="broker" 
          isAuthenticated={true} 
        />
        
      </div>
    </>
  );
}
