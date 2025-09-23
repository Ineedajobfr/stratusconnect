// Enhanced Broker Terminal - MCF Connect Inspired Design
// Professional Aviation Marketplace with Modern UI/UX

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
  Brain,
  ArrowRight,
  Check,
  X
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
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboardMetrics, setDashboardMetrics] = useState({
    activeRFQs: 2,
    totalQuotes: 8,
    successRate: 94.2,
    monthlyRevenue: 284750,
    avgResponseTime: 12,
    reputationScore: 98.5
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        setShowHelpGuide(!showHelpGuide);
      }
      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        setShowMaxAI(!showMaxAI);
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
        avgResponseTime: Math.max(8, prev.avgResponseTime + (Math.random() - 0.5) * 4)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
          Broker Terminal
        </h1>
        <p className="text-lg text-neutral-300 max-w-3xl mx-auto mb-8">
          Harness the power of the world's leading aviation marketplace. Connect with verified operators, 
          manage RFQs, and close deals with confidence.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            Start Trading
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            View Analytics
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white/5 backdrop-blur-sm border-neutral-800/50 hover:bg-white/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <FileText className="w-6 h-6 text-orange-400" />
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Active
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{dashboardMetrics.activeRFQs}</h3>
            <p className="text-neutral-400 text-sm">Active RFQs</p>
            <div className="mt-4 flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12% from last week
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-neutral-800/50 hover:bg-white/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                Revenue
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              ${(dashboardMetrics.monthlyRevenue / 1000).toFixed(0)}K
            </h3>
            <p className="text-neutral-400 text-sm">Monthly Revenue</p>
            <div className="mt-4 flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-neutral-800/50 hover:bg-white/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Success
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{dashboardMetrics.successRate}%</h3>
            <p className="text-neutral-400 text-sm">Success Rate</p>
            <div className="mt-4 flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +2.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-neutral-800/50 hover:bg-white/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                Speed
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{dashboardMetrics.avgResponseTime}m</h3>
            <p className="text-neutral-400 text-sm">Avg Response Time</p>
            <div className="mt-4 flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              -15% faster
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-neutral-800/50 hover:bg-white/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                Reputation
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{dashboardMetrics.reputationScore}</h3>
            <p className="text-neutral-400 text-sm">Reputation Score</p>
            <div className="mt-4 flex items-center text-green-400 text-sm">
              <Star className="w-4 h-4 mr-1" />
              Elite Tier
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-neutral-800/50 hover:bg-white/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/20 rounded-xl">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                Network
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{dashboardMetrics.totalQuotes}</h3>
            <p className="text-neutral-400 text-sm">Pending Quotes</p>
            <div className="mt-4 flex items-center text-blue-400 text-sm">
              <Users className="w-4 h-4 mr-1" />
              12 operators
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Search Assistant */}
      <Card className="bg-white/5 backdrop-blur-sm border-neutral-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Brain className="w-6 h-6 text-orange-400" />
            AI Search Assistant
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Get intelligent insights and search across the platform with AI-powered assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AISearchAssistant terminalType="broker" className="mb-6" />
        </CardContent>
      </Card>

      {/* Market Intelligence */}
      <Card className="bg-white/5 backdrop-blur-sm border-neutral-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Brain className="w-6 h-6 text-orange-400" />
            Market Intelligence
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Real-time market analysis and strategic insights for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-orange-400" />
                <h3 className="font-semibold text-white">Charter Demand Surge</h3>
              </div>
              <p className="text-neutral-300 text-sm mb-4">
                Transatlantic routes showing 34% increase in demand this week
              </p>
              <Button 
                size="sm" 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => setActiveTab('marketplace')}
              >
                Explore
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-blue-400" />
                <h3 className="font-semibold text-white">Strategic Opportunity</h3>
              </div>
              <p className="text-neutral-300 text-sm mb-4">
                Gulfstream G650 availability in London - 3 aircraft ready
              </p>
              <Button 
                size="sm" 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => setActiveTab('rfqs')}
              >
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-400" />
                <h3 className="font-semibold text-white">Competitive Advantage</h3>
              </div>
              <p className="text-neutral-300 text-sm mb-4">
                Your reputation score puts you in top 5% of brokers
              </p>
              <Button 
                size="sm" 
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => setActiveTab('reputation')}
              >
                View Ranking
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      <RealPredictiveAnalytics terminalType="broker" />

      {/* Quick Actions */}
      <Card className="bg-white/5 backdrop-blur-sm border-neutral-800/50">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-neutral-400">
            Streamline your workflow with these essential tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50 hover:text-white"
              onClick={() => setActiveTab('rfqs')}
            >
              <FileText className="w-6 h-6" />
              Create RFQ
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50 hover:text-white"
              onClick={() => setActiveTab('marketplace')}
            >
              <Search className="w-6 h-6" />
              Find Aircraft
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50 hover:text-white"
              onClick={() => setActiveTab('tracking')}
            >
              <Plane className="w-6 h-6" />
              Track Flights
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50 hover:text-white"
              onClick={() => setActiveTab('notes')}
            >
              <MessageSquare className="w-6 h-6" />
              Take Notes
            </Button>
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
          <p className="text-neutral-400">Manage your requests for quotes and responses</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New RFQ
        </Button>
      </div>
      <MultiLegRFQ />
      <QuoteComposer />
      <BackhaulMatcher />
    </div>
  );

  const renderMarketplace = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-white">Aircraft Marketplace</h2>
          <p className="text-neutral-400">Find and connect with verified operators</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
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
          <h2 className="text-2xl font-semibold text-white">Saved Searches</h2>
          <p className="text-neutral-400">Your personalized search queries and alerts</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
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
        <h2 className="text-2xl font-semibold text-white">Reputation & Rankings</h2>
        <p className="text-neutral-400">Track your performance and build your reputation</p>
      </div>
      <ReputationMetrics />
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Billing & Statements</h2>
        <p className="text-neutral-400">Manage your account and view transaction history</p>
      </div>
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
      
      <div className="min-h-screen bg-neutral-950">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-xl border-b border-neutral-800/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-6">
                <StratusConnectLogo className="h-10 w-auto" />
                <div className="hidden md:block">
                  <h1 className="text-2xl font-semibold text-white tracking-tight">Broker Terminal</h1>
                  <p className="text-neutral-400 text-sm">Professional Aviation Marketplace</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHelpGuide(true)}
                  className="border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50 hover:text-white transition-all duration-200"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Tutorial
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50 hover:text-white transition-all duration-200"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="overflow-x-auto pb-4">
              <TabsList className="flex w-max min-w-full justify-start space-x-1 bg-white/5 backdrop-blur-sm border border-neutral-800/50 p-1">
                <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 hover:text-white">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="rfqs" className="flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 hover:text-white">
                  <FileText className="w-4 h-4" />
                  RFQs & Quotes
                </TabsTrigger>
                <TabsTrigger value="marketplace" className="flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 hover:text-white">
                  <Plane className="w-4 h-4" />
                  Marketplace
                </TabsTrigger>
                <TabsTrigger value="searches" className="flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 hover:text-white">
                  <Bookmark className="w-4 h-4" />
                  Saved Searches
                </TabsTrigger>
                <TabsTrigger value="reputation" className="flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 hover:text-white">
                  <Award className="w-4 h-4" />
                  Reputation
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 hover:text-white">
                  <DollarSign className="w-4 h-4" />
                  Billing
                </TabsTrigger>
                <TabsTrigger value="scoreboard" className="flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 hover:text-white">
                  <Trophy className="w-4 h-4" />
                  Scoreboard
                </TabsTrigger>
                <TabsTrigger value="ranking" className="flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 hover:text-white">
                  <Star className="w-4 h-4" />
                  Rankings
                </TabsTrigger>
                <TabsTrigger value="tracking" className="flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 hover:text-white">
                  <Globe className="w-4 h-4" />
                  Flight Tracking
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white text-neutral-400 hover:text-white">
                  <MessageSquare className="w-4 h-4" />
                  Notes
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard" className="mt-8">
              {renderDashboard()}
            </TabsContent>
            <TabsContent value="rfqs" className="mt-8">
              {renderRFQs()}
            </TabsContent>
            <TabsContent value="marketplace" className="mt-8">
              {renderMarketplace()}
            </TabsContent>
            <TabsContent value="searches" className="mt-8">
              {renderSavedSearches()}
            </TabsContent>
            <TabsContent value="reputation" className="mt-8">
              {renderReputation()}
            </TabsContent>
            <TabsContent value="billing" className="mt-8">
              {renderBilling()}
            </TabsContent>
            <TabsContent value="scoreboard" className="mt-8">
              <WeekOneScoreboard />
            </TabsContent>
            <TabsContent value="ranking" className="mt-8">
              <RankingRulesPage />
            </TabsContent>
            <TabsContent value="tracking" className="mt-8">
              <ModernFlightTracker terminalType="broker" />
            </TabsContent>
            <TabsContent value="notes" className="mt-8">
              <ModernNotesSystem terminalType="broker" />
            </TabsContent>
          </Tabs>
        </main>
      
        {/* Scroll to Top Button */}
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-orange-500/80 hover:bg-orange-500 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm border border-orange-500/30"
          title="Scroll to Top"
        >
          <ArrowUp className="w-6 h-6 text-white" />
        </Button>
        
        {/* Floating AI Button */}
        {!showMaxAI && (
          <Button
            onClick={() => setShowMaxAI(true)}
            className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
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