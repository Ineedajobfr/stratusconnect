// Enhanced Demo Operator Terminal - Production Design Match
// FCA Compliant Aviation Platform - 100% Free Until Revenue

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brand } from '@/components/Brand';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrokerBackdrop from '@/components/BrokerBackdrop';
import { 
  DollarSign, 
  FileText, 
  Shield, 
  CheckCircle, 
  TrendingUp,
  Users,
  Plane,
  Clock,
  Target,
  BarChart3,
  Star,
  Award,
  Brain,
  MessageSquare,
  Trophy
} from 'lucide-react';

export default function DemoOperatorTerminal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Demo data for operator
  const demoMetrics = {
    activeFlights: 8,
    bookingsReceived: 15,
    revenue: 1250000,
    fleetUtilization: 78,
    averageRating: 4.6,
    responseTime: 12
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
                <p className="text-sm text-text/70">Active Flights</p>
                <p className="text-2xl font-bold text-bright">{demoMetrics.activeFlights}</p>
                <p className="text-xs text-blue-400">+2 today</p>
              </div>
              <Plane className="w-8 h-8 text-brand" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-predictive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text/70">Bookings Received</p>
                <p className="text-2xl font-bold text-bright">{demoMetrics.bookingsReceived}</p>
                <p className="text-xs text-green-400">+3 this week</p>
              </div>
              <Target className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-predictive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text/70">Fleet Utilization</p>
                <p className="text-2xl font-bold text-bright">{demoMetrics.fleetUtilization}%</p>
                <p className="text-xs text-purple-400">+5% this month</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-predictive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text/70">Avg Response Time</p>
                <p className="text-2xl font-bold text-bright">{demoMetrics.responseTime}m</p>
                <p className="text-xs text-yellow-400">-20% faster</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
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
                <span className="text-text/70">This Month</span>
                <span className="text-green-400 font-semibold">+18.5%</span>
              </div>
              <div className="w-full bg-surface-2 rounded-full h-2">
                <div className="bg-brand h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-predictive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-bright">
              <Star className="w-5 h-5 text-yellow-400" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text/70">Client Rating</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-bright">{demoMetrics.averageRating}/5.0</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text/70">Fleet Utilization</span>
                <span className="text-xl font-bold text-bright">{demoMetrics.fleetUtilization}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text/70">Industry Rank</span>
                <Badge className="bg-blue-500/20 text-blue-400 border-transparent">Top 10%</Badge>
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
            <Brand />
            <Badge className="bg-blue-500/20 text-blue-400 border-transparent">
              OPERATOR DEMO
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
              value="fleet" 
              className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'fleet' || activeTab === 'fleet' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
              onClick={() => handleSectionClick('fleet')}
            >
              <Plane className="w-4 h-4" />
              Fleet
            </TabsTrigger>
            <TabsTrigger 
              value="bookings" 
              className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'bookings' || activeTab === 'bookings' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
              onClick={() => handleSectionClick('bookings')}
            >
              <FileText className="w-4 h-4" />
              Bookings
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
          <TabsContent value="fleet" className="mt-6 scroll-smooth">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-bright mb-4">Fleet Management</h2>
              <p className="text-text/70">Fleet management features coming soon...</p>
            </div>
          </TabsContent>
          <TabsContent value="bookings" className="mt-6 scroll-smooth">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-bright mb-4">Flight Bookings</h2>
              <p className="text-text/70">Booking management features coming soon...</p>
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