// Enhanced Demo Pilot Terminal - Production Design Match
// FCA Compliant Aviation Platform - 100% Free Until Revenue

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brand } from '@/components/Brand';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrokerBackdrop from '@/components/BrokerBackdrop';
import { 
  Clock,
  Plane,
  Shield,
  Target,
  Award,
  BarChart3,
  Star,
  Brain,
  MessageSquare,
  Trophy
} from 'lucide-react';

export default function DemoPilotTerminal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Demo data for pilot
  const demoMetrics = {
    flightHours: 1250,
    upcomingFlights: 4,
    certifications: 8,
    safetyScore: 98,
    fuelEfficiency: 94,
    onTimePerformance: 96,
    clientRating: 4.8,
    totalFlights: 156
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
                <p className="text-sm text-text/70">Flight Hours</p>
                <p className="text-2xl font-bold text-bright">{demoMetrics.flightHours.toLocaleString()}</p>
                <p className="text-xs text-blue-400">+45 this month</p>
              </div>
              <Clock className="w-8 h-8 text-brand" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-predictive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text/70">Upcoming Flights</p>
                <p className="text-2xl font-bold text-bright">{demoMetrics.upcomingFlights}</p>
                <p className="text-xs text-green-400">Next: Tomorrow</p>
              </div>
              <Plane className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-predictive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text/70">Safety Score</p>
                <p className="text-2xl font-bold text-bright">{demoMetrics.safetyScore}%</p>
                <p className="text-xs text-green-400">Excellent</p>
              </div>
              <Shield className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-predictive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text/70">On-Time Performance</p>
                <p className="text-2xl font-bold text-bright">{demoMetrics.onTimePerformance}%</p>
                <p className="text-xs text-purple-400">+2% this month</p>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance & Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <span className="text-xl font-bold text-bright">{demoMetrics.clientRating}/5.0</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text/70">Fuel Efficiency</span>
                <span className="text-xl font-bold text-bright">{demoMetrics.fuelEfficiency}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text/70">Total Flights</span>
                <span className="text-xl font-bold text-bright">{demoMetrics.totalFlights}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-predictive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-bright">
              <Award className="w-5 h-5 text-blue-400" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text/70">Active Certifications</span>
                <span className="text-lg font-bold text-bright">{demoMetrics.certifications}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-surface-2 rounded">
                  <div>
                    <p className="text-sm font-medium text-bright">ATP License</p>
                    <p className="text-xs text-text/60">Expires: 2025-12-15</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-transparent text-xs">
                    valid
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-surface-2 rounded">
                  <div>
                    <p className="text-sm font-medium text-bright">Gulfstream G650 Type Rating</p>
                    <p className="text-xs text-text/60">Expires: 2024-08-20</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-transparent text-xs">
                    valid
                  </Badge>
                </div>
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
            <Badge className="bg-orange-500/20 text-orange-400 border-transparent">
              PILOT DEMO
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
              value="flights" 
              className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'flights' || activeTab === 'flights' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
              onClick={() => handleSectionClick('flights')}
            >
              <Plane className="w-4 h-4" />
              Flights
            </TabsTrigger>
            <TabsTrigger 
              value="certifications" 
              className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'certifications' || activeTab === 'certifications' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
              onClick={() => handleSectionClick('certifications')}
            >
              <Award className="w-4 h-4" />
              Certifications
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
          <TabsContent value="flights" className="mt-6 scroll-smooth">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-bright mb-4">Flight Schedule</h2>
              <p className="text-text/70">Flight management features coming soon...</p>
            </div>
          </TabsContent>
          <TabsContent value="certifications" className="mt-6 scroll-smooth">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-bright mb-4">Certifications & Training</h2>
              <p className="text-text/70">Certification management features coming soon...</p>
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