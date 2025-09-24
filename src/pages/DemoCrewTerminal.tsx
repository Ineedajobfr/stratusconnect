// Enhanced Demo Crew Terminal - Production Design Match
// FCA Compliant Aviation Platform - 100% Free Until Revenue

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrokerBackdrop from '@/components/BrokerBackdrop';
import { ModernHelpGuide } from '@/components/ModernHelpGuide';
import { ChatGPTHelper } from '@/components/ai/ChatGPTHelper';
import { RealTimeChat } from '@/components/chat/RealTimeChat';
import MarketIntelligence from '@/components/MarketIntelligence';
import { WorkflowAutomation } from '@/components/automation/WorkflowAutomation';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import { ClientPortal } from '@/components/portal/ClientPortal';
import { 
  Plane,
  Clock,
  Shield,
  Target,
  Award,
  BarChart3,
  Star,
  Heart,
  Brain,
  MessageSquare,
  Trophy,
  Users
} from 'lucide-react';

export default function DemoCrewTerminal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Demo data for crew
  const demoMetrics = {
    flightsServed: 89,
    upcomingFlights: 3,
    clientSatisfaction: 4.9,
    serviceHours: 1250,
    certifications: 6,
    safetyScore: 99,
    onTimePerformance: 98,
    totalPassengers: 1240
  };

  // Demo certifications data
  const demoCertifications = [
    { id: 1, name: 'Cabin Safety Training', status: 'valid', expiry: '2024-12-15' },
    { id: 2, name: 'Emergency Procedures', status: 'expiring', expiry: '2024-02-28' },
    { id: 3, name: 'First Aid Certification', status: 'valid', expiry: '2024-08-20' },
    { id: 4, name: 'Security Awareness', status: 'valid', expiry: '2024-11-10' }
  ];

  const handleSectionClick = (section: string) => {
    setHighlightedSection(section);
    setTimeout(() => setHighlightedSection(null), 2000);
  };

  const renderFlights = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-bright mb-4">Flight Assignments</h2>
        <p className="text-text/70">Flight assignment features coming soon...</p>
      </div>
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-6">
      <div className="grid gap-4">
        {demoCertifications.slice(0, 2).map((cert) => (
          <div key={cert.id} className="flex items-center justify-between p-2 bg-surface-2 rounded">
            <div>
              <p className="text-sm font-medium text-bright">{cert.name}</p>
              <p className="text-xs text-text/60">Expires: {cert.expiry}</p>
            </div>
            <Badge className={`${
              cert.status === 'valid' ? 'bg-green-500/20 text-green-400' :
              cert.status === 'expiring' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            } border-transparent text-xs`}>
              {cert.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-predictive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
                  <div>
                <p className="text-sm text-text/70">Flights Served</p>
                <p className="text-2xl font-bold text-bright">{demoMetrics.flightsServed}</p>
                <p className="text-xs text-blue-400">+12 this month</p>
              </div>
              <Plane className="w-8 h-8 text-brand" />
          </div>
        </CardContent>
      </Card>

        <Card className="card-predictive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text/70">Client Satisfaction</p>
                <p className="text-2xl font-bold text-bright">{demoMetrics.clientSatisfaction}/5.0</p>
                <p className="text-xs text-green-400">Excellent</p>
              </div>
              <Star className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-predictive">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text/70">Service Hours</p>
                <p className="text-2xl font-bold text-bright">{demoMetrics.serviceHours.toLocaleString()}</p>
                <p className="text-xs text-purple-400">+85 this month</p>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
          </div>
        </CardContent>
      </Card>

        <Card className="card-predictive">
            <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                <p className="text-sm text-text/70">Safety Score</p>
                <p className="text-2xl font-bold text-bright">{demoMetrics.safetyScore}%</p>
                <p className="text-xs text-green-400">Outstanding</p>
              </div>
              <Shield className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance & Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-predictive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-bright">
              <Heart className="w-5 h-5 text-red-400" />
              Service Excellence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text/70">Total Passengers Served</span>
                <span className="text-xl font-bold text-bright">{demoMetrics.totalPassengers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text/70">On-Time Performance</span>
                <span className="text-xl font-bold text-bright">{demoMetrics.onTimePerformance}%</span>
            </div>
              <div className="flex justify-between items-center">
                <span className="text-text/70">Upcoming Flights</span>
                <span className="text-xl font-bold text-bright">{demoMetrics.upcomingFlights}</span>
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
                    <p className="text-sm font-medium text-bright">Flight Attendant Certificate</p>
                    <p className="text-xs text-text/60">Expires: 2025-06-15</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-transparent text-xs">
                    valid
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-surface-2 rounded">
                  <div>
                    <p className="text-sm font-medium text-bright">First Aid & CPR</p>
                    <p className="text-xs text-text/60">Expires: 2024-09-20</p>
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
    <BrokerBackdrop>
      <div className="min-h-screen bg-app text-body relative overflow-hidden">
        {/* Header */}
      <header className="sticky top-0 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-4">
            <StratusConnectLogo className="text-xl text-text" terminalType="crew" />
            <Badge className="bg-pink-500/20 text-pink-400 border-transparent">
              CREW DEMO
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
                onClick={() => setShowHelpGuide(true)}
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
              value="market-intelligence"
              className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'market-intelligence' || activeTab === 'market-intelligence' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
              onClick={() => handleSectionClick('market-intelligence')}
            >
              <Target className="w-4 h-4" />
              Market Intelligence
            </TabsTrigger>
            <TabsTrigger
              value="automation"
              className={`flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200 ${highlightedSection === 'automation' || activeTab === 'automation' ? 'ring-2 ring-brand/50 bg-brand/10' : ''}`}
              onClick={() => handleSectionClick('automation')}
            >
              <Brain className="w-4 h-4" />
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
          </TabsList>

          <TabsContent value="dashboard" className="mt-6 scroll-smooth">
              {renderDashboard()}
            </TabsContent>
          <TabsContent value="flights" className="mt-6 scroll-smooth">
            {renderFlights()}
          </TabsContent>
          <TabsContent value="certifications" className="mt-6 scroll-smooth">
            {renderCertifications()}
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
        </Tabs>
      </main>

      {/* Help Guide Modal */}
      {showHelpGuide && (
        <ModernHelpGuide
          terminalType="crew"
          activeTab={activeTab}
          onClose={() => setShowHelpGuide(false)}
          showOnMount={false}
          isDemo={true}
        />
      )}

      {/* AI Assistant */}
      {showAIAssistant && (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 w-96 max-h-[80vh]">
          <ChatGPTHelper
            isOpen={showAIAssistant}
            onClose={() => setShowAIAssistant(false)}
            context={{
              activeTab,
              userRole: 'crew',
              recentActivity: []
            }}
          />
        </div>
      )}

      {/* Real-time Chat */}
      {showChat && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 w-96 max-h-[80vh]">
          <RealTimeChat
            chatId="demo_crew_chat_001"
            participants={[
              { id: 'crew_001', name: 'You', role: 'team', isOnline: true },
              { id: 'pilot_001', name: 'Captain Smith', role: 'team', isOnline: true },
              { id: 'op_001', name: 'Elite Aviation', role: 'operator', isOnline: true }
            ]}
            onClose={() => setShowChat(false)}
          />
        </div>
      )}
      </div>
    </BrokerBackdrop>
  );
}