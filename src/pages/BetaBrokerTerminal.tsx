// Enhanced Beta Broker Terminal - All Features
// FCA Compliant Aviation Platform - 100% Free Until Revenue

import AdvancedSearch from '@/components/AdvancedSearch';
import { MonthlyStatements } from '@/components/Billing/MonthlyStatements';
import { Brand } from '@/components/Brand';
import CommunicationTools from '@/components/CommunicationTools';
import { MultiLegRFQ } from '@/components/DealFlow/MultiLegRFQ';
import RealTimeFlightTracker from '@/components/RealTimeFlightTracker';
import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground';
import CommunityForums from '@/components/community/CommunityForums';
import ContractGenerator from '@/components/contracts/ContractGenerator';
import ReceiptGenerator from '@/components/contracts/ReceiptGenerator';
import DocumentStorage from '@/components/documents/DocumentStorage';
import JobBoard from '@/components/job-board/JobBoard';
import SavedCrews from '@/components/job-board/SavedCrews';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertTriangle,
    Bell,
    Clock,
    DollarSign,
    FileText,
    MessageCircle,
    Plane,
    Plus,
    Receipt,
    Search,
    Shield,
    TrendingUp,
    Trophy,
    Zap
} from 'lucide-react';
import { useState } from 'react';
// AI removed - using real functionality instead
import { StratusConnectLogo } from '@/components/StratusConnectLogo';

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
  fees?: {
    basePrice: number;
    fuelSurcharge: number;
    handling: number;
    catering: number;
    total: number;
  };
}

export default function BetaBrokerTerminal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showWeekOneScoreboard, setShowWeekOneScoreboard] = useState(false);
  const [showWarRoomChecks, setShowWarRoomChecks] = useState(false);
  const [showEvidencePack, setShowEvidencePack] = useState(false);
  const [liveFlowResult, setLiveFlowResult] = useState<Record<string, unknown> | null>(null);
  const [warRoomResult, setWarRoomResult] = useState<Record<string, unknown> | null>(null);
  const [evidencePack, setEvidencePack] = useState<Record<string, unknown> | null>(null);
  const [showJobBoard, setShowJobBoard] = useState(false);
  const [showCommunityForums, setShowCommunityForums] = useState(false);
  const [showSavedCrews, setShowSavedCrews] = useState(false);
  const [showDocumentStorage, setShowDocumentStorage] = useState(false);
  const [showContractGenerator, setShowContractGenerator] = useState(false);
  const [showReceiptGenerator, setShowReceiptGenerator] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  
  // Beta terminal starts with empty data for AI testing
  const [rfqs, setRfqs] = useState<RFQ[]>([]);

  const [savedSearches, setSavedSearches] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const renderBilling = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Billing & Statements</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowContractGenerator(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Contract
          </Button>
          <Button 
            onClick={() => setShowReceiptGenerator(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Receipt className="w-4 h-4 mr-2" />
            Generate Receipt
          </Button>
        </div>
      </div>
      
      <MonthlyStatements />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <StarfieldRunwayBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <StratusConnectLogo className="h-8 w-8" />
            <div>
              <Brand.PageTitle className="hero-glow">Beta Broker Terminal</Brand.PageTitle>
              <p className="text-muted text-glow-subtle">AI Testing Environment • Ready for Workflow Testing</p>
            </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => window.location.href = '/tutorial/broker'}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Tutorial
                </Button>
                <Brand.StatusChip status="success">
                  <Shield className="w-3 h-3 mr-1 icon-glow" />
                  FCA Compliant
                </Brand.StatusChip>
                <Brand.StatusChip status="info">
                  <Zap className="w-3 h-3 mr-1 icon-glow" />
                  Beta Testing
                </Brand.StatusChip>
                <Brand.StatusChip status="warn">
                  <AlertTriangle className="w-3 h-3 mr-1 icon-glow" />
                  AI Testing Mode
                </Brand.StatusChip>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="rfqs">RFQs</TabsTrigger>
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="job-board">Job Board</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="saved-crews">Saved Crews</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="flight-tracking" className="flex items-center gap-2">
                <Plane className="w-4 h-4 icon-glow" />
                Flight Tracking
              </TabsTrigger>
              <TabsTrigger value="advanced-search" className="flex items-center gap-2">
                <Search className="w-4 h-4 icon-glow" />
                Search
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 icon-glow" />
                Communication
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Brand.Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted">Active RFQs</p>
                      <p className="text-2xl font-bold text-body accent-glow">{rfqs.length}</p>
                      <p className="text-xs text-accent accent-glow">Ready for AI testing</p>
                    </div>
                    <FileText className="w-8 h-8 text-accent icon-glow" />
                  </div>
                </Brand.Card>

                <Brand.Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted">Quotes Received</p>
                      <p className="text-2xl font-bold text-body accent-glow">
                        {rfqs.reduce((sum, rfq) => sum + rfq.quotes.length, 0)}
                      </p>
                      <p className="text-xs text-accent accent-glow">AI responses</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-accent icon-glow" />
                  </div>
                </Brand.Card>

                <Brand.Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted">Deals Closed</p>
                      <p className="text-2xl font-bold text-body accent-glow">
                        {rfqs.filter(rfq => rfq.status === 'paid').length}
                      </p>
                      <p className="text-xs text-accent accent-glow">Beta testing</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-accent icon-glow" />
                  </div>
                </Brand.Card>

                <Brand.Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted">Avg Response Time</p>
                      <p className="text-2xl font-bold text-body accent-glow">-</p>
                      <p className="text-xs text-accent accent-glow">Waiting for AI</p>
                    </div>
                    <Clock className="w-8 h-8 text-accent icon-glow" />
                  </div>
                </Brand.Card>
              </div>

              {/* Real-Time Flight Tracker */}
              <RealTimeFlightTracker terminalType="broker" />

              {/* Advanced Search */}
              <AdvancedSearch terminalType="broker" onResults={(results) => console.log('Search results:', results)} />

              {/* Document Management */}
              <DocumentManagement userRole="broker" />

              {/* Beta Testing Notice */}
              <Brand.Card>
                <Brand.SectionTitle>
                  <Bell className="w-5 h-5 inline mr-2" />
                  Beta Testing Environment
                </Brand.SectionTitle>
                <div className="space-y-3">
                  <Brand.Panel className="bg-surface">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-accent mt-0.5" />
                        <div>
                          <h4 className="font-medium text-body">Ready for AI Testing</h4>
                          <p className="text-sm text-muted">This terminal is cleared of dummy data and ready for AI agent testing. Create RFQs and watch AI operators respond.</p>
                          <p className="text-xs text-muted">All functionality works - just waiting for real data from AI interactions.</p>
                        </div>
                      </div>
                      <Brand.StatusChip status="info">Beta Ready</Brand.StatusChip>
                    </div>
                  </Brand.Panel>
                </div>
              </Brand.Card>
            </TabsContent>

            <TabsContent value="rfqs" className="space-y-6">
              <Card className="terminal-card animate-fade-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New RFQ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MultiLegRFQ 
                    onFlowComplete={setLiveFlowResult}
                    onWarRoomComplete={setWarRoomResult}
                    onEvidenceComplete={setEvidencePack}
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                {rfqs.length === 0 ? (
                  <Card className="terminal-card">
                    <CardContent className="py-12">
                      <div className="text-center text-gunmetal">
                        <Plane className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">No RFQs Yet</h3>
                        <p className="text-sm mb-4">Create your first RFQ above to start the AI testing workflow.</p>
                        <p className="text-xs text-muted">AI operators will be able to respond to your requests.</p>
                      </div>
                    </CardContent>
                  </Card>
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
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-accent/20 text-accent">{rfq.status}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {rfq.quotes.length > 0 ? (
                          <div className="space-y-3">
                            <h4 className="font-semibold">Quotes Received ({rfq.quotes.length})</h4>
                            {rfq.quotes.map(quote => (
                              <div key={quote.id} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">{quote.operator}</p>
                                    <p className="text-sm text-gunmetal">{quote.aircraft}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xl font-bold">${quote.price.toLocaleString()}</p>
                                    <p className="text-sm text-gunmetal">Deal Score: {quote.dealScore}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gunmetal">
                            <Plane className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No quotes received yet</p>
                            <p className="text-sm">AI operators will respond to your RFQ</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="quotes" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Recent Quotes</h2>
              </div>

              <div className="grid gap-4">
                {rfqs.flatMap(rfq => rfq.quotes).map((quote) => (
                  <Card key={quote.id} className="terminal-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-lg font-semibold text-white">{quote.id}</h3>
                            <Badge 
                              className={quote.verified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}
                            >
                              {quote.verified ? 'Verified' : 'Pending'}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-slate-400">Operator</p>
                              <p className="text-white">{quote.operator}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Aircraft</p>
                              <p className="text-white">{quote.aircraft}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Price</p>
                              <p className="text-white">{quote.currency} {quote.price.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Rating</p>
                              <p className="text-white">{quote.rating}/5</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            Accept
                          </Button>
                          <Button size="sm" variant="outline">
                            Negotiate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
              <AdvancedSearch terminalType="broker" onResults={(results) => console.log('Analytics results:', results)} />
            </TabsContent>

            <TabsContent value="job-board" className="space-y-6">
              <JobBoard />
            </TabsContent>

            <TabsContent value="community" className="space-y-6">
              <CommunityForums />
            </TabsContent>

            <TabsContent value="saved-crews" className="space-y-6">
              <SavedCrews />
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <DocumentStorage />
            </TabsContent>

            <TabsContent value="flight-tracking" className="space-y-6">
              <RealTimeFlightTracker terminalType="broker" />
            </TabsContent>

            <TabsContent value="advanced-search" className="space-y-6">
              <AdvancedSearch terminalType="broker" onResults={(results) => console.log('Search results:', results)} />
            </TabsContent>

            <TabsContent value="communication" className="space-y-6">
              <CommunicationTools terminalType="broker" />
            </TabsContent>
          </Tabs>
        </div>

        {/* Beta Testing Notice */}
        <Brand.Card className="mt-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warn mt-0.5" />
            <div>
              <h3 className="font-medium text-body">Beta Testing Mode - AI Workflow Testing</h3>
              <p className="text-muted text-sm mt-1">
                This terminal is cleared of dummy data and ready for AI agent testing. 
                Create RFQs and watch AI operators respond through their beta terminals.
                All functionality works - just waiting for real data from AI interactions.
                <strong> This is where we test if the system actually works.</strong>
              </p>
            </div>
          </div>
        </Brand.Card>

        {/* Modals */}
        {showContractGenerator && (
          <ContractGenerator
            isOpen={showContractGenerator}
            onClose={() => setShowContractGenerator(false)}
            deal={selectedDeal}
          />
        )}

        {showReceiptGenerator && (
          <ReceiptGenerator
            isOpen={showReceiptGenerator}
            onClose={() => setShowReceiptGenerator(false)}
            deal={selectedDeal}
          />
        )}
      </div>
      
      {/* Communication Tools */}
      <CommunicationTools terminalType="broker" />
    </div>
  );
}