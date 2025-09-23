// Enhanced Broker Terminal - Production Ready with Max AI
// FCA Compliant Aviation Platform - 100% Free Until Revenue

import React, { useState } from 'react';
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

export default function BrokerTerminal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [showMaxAI, setShowMaxAI] = useState(true);
  const [showSecurityAI, setShowSecurityAI] = useState(true);

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="terminal-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gunmetal">Active RFQs</p>
                      <p className="text-2xl font-bold text-foreground">2</p>
                      <p className="text-xs text-data-positive">+12% this week</p>
                    </div>
                    <FileText className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="terminal-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gunmetal">Quotes Received</p>
                      <p className="text-2xl font-bold text-foreground">2</p>
                      <p className="text-xs text-gunmetal">Avg 2.3 per RFQ</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="terminal-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gunmetal">Deals Closed</p>
                      <p className="text-2xl font-bold text-foreground">0</p>
                      <p className="text-xs text-gunmetal">$2.1M volume</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="terminal-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gunmetal">Avg Response Time</p>
                      <p className="text-2xl font-bold text-accent">2.3m</p>
                      <p className="text-xs text-gunmetal">Fast lane eligible</p>
                    </div>
                    <Clock className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Search Assistant */}
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Zap className="h-5 w-5 text-accent" />
                  AI Search Assistant
                </CardTitle>
                <CardDescription className="text-gunmetal">
                  Ask complex questions in natural language and get intelligent results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask me anything about aircraft, operators, jobs, or market data..."
                    className="w-full px-4 py-3 bg-terminal-card border border-terminal-border rounded-lg text-foreground placeholder-gunmetal focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                  <Button className="absolute right-2 top-2 h-8 w-8 p-0 bg-accent hover:bg-accent/80">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <div className="flex items-center gap-2 p-3 bg-terminal-card border border-terminal-border rounded-lg">
                    <Search className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Smart Search</p>
                      <p className="text-xs text-gunmetal">Natural language queries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-terminal-card border border-terminal-border rounded-lg">
                    <Target className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Client Matching</p>
                      <p className="text-xs text-gunmetal">AI-powered matching</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-terminal-card border border-terminal-border rounded-lg">
                    <BarChart3 className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Market Analytics</p>
                      <p className="text-xs text-gunmetal">Real-time data</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-terminal-card border border-terminal-border rounded-lg">
                    <Star className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Quality Scoring</p>
                      <p className="text-xs text-gunmetal">Operator ratings</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Zap className="h-5 w-5 text-accent" />
                  AI Insights
                </CardTitle>
                <CardDescription className="text-gunmetal">
                  Get personalized recommendations and market intelligence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-terminal-card border border-terminal-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Market Trend</p>
                        <p className="text-sm text-gunmetal">Charter demand up 15% this month</p>
                      </div>
                    </div>
                    <Badge className="bg-data-positive/20 text-data-positive border-data-positive/30">
                      +15%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-terminal-card border border-terminal-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-accent" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Recommendation</p>
                        <p className="text-sm text-gunmetal">Consider positioning aircraft in Miami</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-white">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-terminal-card border border-terminal-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-accent" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Opportunity</p>
                        <p className="text-sm text-gunmetal">3 new job matches found</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-white">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "rfqs":
        return <MultiLegRFQ />;
      case "marketplace":
        return <DemoMarketplace />;
      case "saved-searches":
        return <SavedSearches />;
      case "reputation":
        return <ReputationMetrics />;
      case "ranking":
        return <RankingRulesPage />;
      case "flight-tracking":
        return <FlightRadar24Widget />;
      case "notes":
        return <NoteTakingSystem />;
      case "billing":
        return <MonthlyStatements />;
      case "scoreboard":
        return <WeekOneScoreboard />;
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
    { id: "rfqs", label: "RFQs & Quotes", icon: FileText },
    { id: "marketplace", label: "Marketplace", icon: Search },
    { id: "saved-searches", label: "Saved Searches", icon: Bell },
    { id: "reputation", label: "Reputation", icon: Award },
    { id: "ranking", label: "Ranking", icon: TrendingUp },
    { id: "flight-tracking", label: "Flight Tracking", icon: Plane },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "billing", label: "Billing", icon: DollarSign },
    { id: "scoreboard", label: "Scoreboard", icon: Trophy }
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
                  <p className="text-sm text-gunmetal">FCA Compliant Trading Floor • 100% Free Until Revenue</p>
                </div>
                <div className="flex items-center space-x-2 text-data-positive text-sm">
                  <div className="w-2 h-2 bg-data-positive rounded-full terminal-pulse"></div>
                  <span className="font-mono">MARKET ACTIVE</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setShowHelpGuide(true)}
                  className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Tutorial
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
            <div className="flex items-center space-x-1 overflow-x-auto py-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === item.id
                      ? "bg-accent text-white shadow-lg"
                      : "text-gunmetal hover:text-foreground hover:bg-terminal-card/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          {renderTabContent()}
        </div>

        {/* Scroll to Top Button */}
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 w-12 h-12 bg-accent hover:bg-accent/80 rounded-full shadow-lg z-40"
          title="Scroll to Top"
        >
          <ArrowUp className="w-6 h-6 text-white" />
        </Button>
        
        {/* Max AI - Advanced Intelligence System */}
        <MaxAI 
          isVisible={showMaxAI} 
          onToggleVisibility={() => setShowMaxAI(!showMaxAI)} 
          userType="broker" 
          isAuthenticated={true} 
        />
        
        {/* Security AI - Advanced Threat Protection */}
        <SecurityAI 
          isVisible={showSecurityAI} 
          onToggleVisibility={() => setShowSecurityAI(!showSecurityAI)} 
          userType="broker" 
        />
      </div>
    </>
  );
}
