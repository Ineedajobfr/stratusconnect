// Enhanced Demo Broker Terminal - Production Design Match
// FCA Compliant Aviation Platform - 100% Free Until Revenue

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Brain
} from 'lucide-react';

export default function DemoBrokerTerminal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Demo data
  const demoMetrics = {
    activeRFQs: 12,
    quotesReceived: 28,
    dealsClosed: 8,
    averageResponseTime: 18,
    revenue: 2847500,
    revenueGrowth: 12.5,
    clientSatisfaction: 4.7,
    conversionRate: 23.4
  };

  const handleSectionClick = (section: string) => {
    setHighlightedSection(section);
    setTimeout(() => setHighlightedSection(null), 2000);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-predictive">
          <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-text/70">Active RFQs</p>
                <p className="text-2xl font-bold text-bright">{demoMetrics.activeRFQs}</p>
                <p className="text-xs text-green-400">+2 this week</p>
              </div>
              <FileText className="w-8 h-8 text-brand" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-predictive">
          <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-text/70">Quotes Received</p>
                <p className="text-2xl font-bold text-bright">{demoMetrics.quotesReceived}</p>
                <p className="text-xs text-blue-400">+5 today</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-predictive">
          <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-text/70">Deals Closed</p>
                <p className="text-2xl font-bold text-bright">{demoMetrics.dealsClosed}</p>
                <p className="text-xs text-green-400">+3 this month</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-predictive">
          <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-text/70">Avg Response Time</p>
                <p className="text-2xl font-bold text-bright">{demoMetrics.averageResponseTime}m</p>
                <p className="text-xs text-purple-400">-15% faster</p>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-predictive">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-bright">
              <DollarSign className="w-5 h-5 text-brand" />
              Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
      <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text/70">Total Revenue</span>
                <span className="text-2xl font-bold text-bright">£{demoMetrics.revenue.toLocaleString()}</span>
                </div>
              <div className="flex justify-between items-center">
                <span className="text-text/70">Growth</span>
                <span className="text-green-400 font-semibold">+{demoMetrics.revenueGrowth}%</span>
              </div>
              <div className="w-full bg-surface-2 rounded-full h-2">
                <div className="bg-brand h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
            </CardContent>
          </Card>

        <Card className="card-predictive">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-bright">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text/70">Client Satisfaction</span>
            <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-bright">{demoMetrics.clientSatisfaction}/5.0</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text/70">Conversion Rate</span>
                <span className="text-xl font-bold text-bright">{demoMetrics.conversionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text/70">Industry Rank</span>
                <Badge className="bg-green-500/20 text-green-400 border-transparent">Top 5%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-app text-body relative overflow-hidden">
      <BrokerBackdrop />
      
      {/* Header */}
      <header className="sticky top-0 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <StratusConnectLogo className="text-xl text-text" terminalType="broker" />
            <Badge className="bg-green-500/20 text-green-400 border-transparent">
              DEMO MODE
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
                className="bg-purple-600 hover:bg-purple-700 text-text shadow-glow rounded-xl px-6 py-2 font-medium transition-all duration-200"
                title="AI Assistant (Ctrl+A)"
              >
                <Brain className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-text shadow-glow rounded-xl px-6 py-2 font-medium transition-all duration-200"
                title="Real-time Chat"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
              <Button
                className="bg-brand hover:bg-brand-600 text-text shadow-glow rounded-xl px-6 py-2 font-medium transition-all duration-200"
                title="Help Guide (Ctrl+H)"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Tutorial
            </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
              RFQs
            </TabsTrigger>
            <TabsTrigger 
              value="marketplace" 
              className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'marketplace' || activeTab === 'marketplace' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
              onClick={() => handleSectionClick('marketplace')}
            >
              <Plane className="w-4 h-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'analytics' || activeTab === 'analytics' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
              onClick={() => handleSectionClick('analytics')}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            </TabsList>

          <TabsContent value="dashboard" className="mt-6 scroll-smooth">
            {renderDashboard()}
          </TabsContent>
          <TabsContent value="rfqs" className="mt-6 scroll-smooth">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-bright mb-4">RFQ Management</h2>
              <p className="text-text/70">RFQ management features coming soon...</p>
            </div>
          </TabsContent>
          <TabsContent value="marketplace" className="mt-6 scroll-smooth">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-bright mb-4">Aircraft Marketplace</h2>
              <p className="text-text/70">Marketplace features coming soon...</p>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="mt-6 scroll-smooth">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-bright mb-4">Analytics Dashboard</h2>
              <p className="text-text/70">Analytics features coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
        </main>
      </div>
  );
}