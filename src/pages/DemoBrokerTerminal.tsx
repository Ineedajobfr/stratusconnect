// Enhanced Demo Broker Terminal - All Features
// FCA Compliant Aviation Platform - 100% Free Until Revenue

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Trophy
} from 'lucide-react';
import { ComplianceNotice, EvidencePack } from '@/components/ComplianceNotice';
import { evidenceReceiptGenerator } from '@/lib/evidence-receipt-generator';
import { greenLightGateValidator } from '@/lib/green-light-gate';
import { DisputesLane } from '@/components/Disputes/DisputesLane';
import { ChargebacksPlaybook } from '@/components/Chargebacks/ChargebacksPlaybook';
import { CancellationRules } from '@/components/Cancellation/CancellationRules';
import { fxHandler } from '@/lib/fx-handler';
import { invoiceVATHandler } from '@/lib/invoice-vat-handler';
import { savedSearchesRealData } from '@/lib/saved-searches-real-data';
import { ReMarketOnFallThrough } from '@/components/ReMarket/ReMarketOnFallThrough';
import { AdminImpersonation } from '@/components/Admin/AdminImpersonation';
import { WeekOneScoreboard } from '@/components/WeekOneScoreboard';
import { liveFlowTester } from '@/lib/live-flow-tester';
import { warRoomChecker } from '@/lib/war-room-checks';
import { evidencePackGenerator } from '@/lib/evidence-pack-generator';
import { MultiLegRFQ } from '@/components/DealFlow/MultiLegRFQ';
import { QuoteComposer } from '@/components/DealFlow/QuoteComposer';
import { BackhaulMatcher } from '@/components/DealFlow/BackhaulMatcher';
import { SavedSearches } from '@/components/DealFlow/SavedSearches';
import { ReputationMetrics } from '@/components/Reputation/ReputationMetrics';
import { MonthlyStatements } from '@/components/Billing/MonthlyStatements';
import { RankingRulesPage } from '@/components/Ranking/RankingRulesPage';
import { FlightRadar24Widget } from '@/components/flight-tracking/FlightRadar24Widget';
import { SignedQuotePDFGenerator } from '@/lib/signed-quote-pdf';
import { BadgeVerificationService } from '@/lib/badge-verification';
import { CredentialGates } from '@/lib/credential-gates';
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
}

export default function DemoBrokerTerminal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showWeekOneScoreboard, setShowWeekOneScoreboard] = useState(false);
  const [showWarRoomChecks, setShowWarRoomChecks] = useState(false);
  const [showEvidencePack, setShowEvidencePack] = useState(false);
  const [liveFlowResult, setLiveFlowResult] = useState<Record<string, unknown> | null>(null);
  const [warRoomResult, setWarRoomResult] = useState<Record<string, unknown> | null>(null);
  const [evidencePack, setEvidencePack] = useState<Record<string, unknown> | null>(null);
  const [rfqs, setRfqs] = useState<RFQ[]>([
    {
      id: 'RFQ-001',
      route: 'London - New York',
      aircraft: 'Gulfstream G650',
      date: '2024-01-20',
      price: 45000,
      currency: 'USD',
      status: 'quoted',
      legs: 1,
      passengers: 8,
      specialRequirements: 'VIP handling, customs clearance',
      quotes: [
        {
          id: 'Q-001',
          operator: 'Elite Aviation',
          price: 45000,
          currency: 'USD',
          validUntil: '2024-01-18T23:59:59Z',
          aircraft: 'Gulfstream G650',
          verified: true,
          rating: 4.8,
          responseTime: 3.2,
          dealScore: 89
        },
        {
          id: 'Q-002',
          operator: 'SkyHigh Jets',
          price: 48000,
          currency: 'USD',
          validUntil: '2024-01-19T12:00:00Z',
          aircraft: 'Gulfstream G650',
          verified: true,
          rating: 4.6,
          responseTime: 5.1,
          dealScore: 76
        }
      ]
    },
    {
      id: 'RFQ-002',
      route: 'Paris - Dubai',
      aircraft: 'Global 6000',
      date: '2024-01-25',
      price: 32000,
      currency: 'EUR',
      status: 'sent',
      legs: 1,
      passengers: 12,
      specialRequirements: 'Catering for dietary restrictions',
      quotes: []
    }
  ]);

  const [savedSearches, setSavedSearches] = useState([
    {
      id: 'SS-001',
      name: 'LHR to JFK Business',
      from: 'LHR',
      to: 'JFK',
      dateFrom: '2024-01-20',
      dateTo: '2024-01-25',
      passengers: 8,
      budgetMax: 50000,
      currency: 'USD',
      alerts: 3,
      lastAlert: '2024-01-16T14:30:00Z'
    }
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 'ALERT-001',
      type: 'price_drop',
      title: 'Price Drop: LHR to JFK',
      message: 'Gulfstream G650 dropped 18% to $41,000',
      time: '2024-01-16T14:30:00Z',
      unread: true
    },
    {
      id: 'ALERT-002',
      type: 'last_minute',
      title: 'Last Minute: CDG to LHR',
      message: 'Citation X available in 8 hours for $18,000',
      time: '2024-01-16T16:45:00Z',
      unread: true
    }
  ]);

  const isDemoMode = import.meta.env.VITE_SC_DEMO_MODE === 'true';

  const createPaymentIntent = (rfq: RFQ, quote: Quote) => {
    const platformFee = Math.round(quote.price * 0.07);
    const netToOperator = quote.price - platformFee;
    
    alert(`🚀 Payment Intent Created\n\n` +
      `Route: ${rfq.route}\n` +
      `Aircraft: ${quote.aircraft}\n` +
      `Operator: ${quote.operator}\n` +
      `Total Price: $${quote.price.toLocaleString()}\n` +
      `Platform Fee (7%): $${platformFee.toLocaleString()}\n` +
      `Net to Operator: $${netToOperator.toLocaleString()}\n\n` +
      `✅ FCA Compliant - No custody of funds\n` +
      `🔒 Stripe Connect processing\n` +
      `📋 Immutable audit trail created`);
  };

  const generateReceipt = (rfq: RFQ, quote: Quote) => {
    const platformFee = Math.round(quote.price * 0.07);
    const netToOperator = quote.price - platformFee;
    const auditHash = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const receipt = {
      transactionId: `TXN_${Date.now()}`,
      timestamp: new Date().toISOString(),
      broker: 'Demo Broker Ltd',
      operator: quote.operator,
      route: rfq.route,
      aircraft: quote.aircraft,
      totalPrice: quote.price,
      platformFee: platformFee,
      netToOperator: netToOperator,
      currency: quote.currency,
      auditHash: auditHash,
      status: 'completed',
      fcaCompliant: true,
      stripeTransactionId: `pi_${Date.now()}`
    };

    const receiptData = JSON.stringify(receipt, null, 2);
    const blob = new Blob([receiptData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${receipt.transactionId}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`📄 Receipt generated with audit hash: ${auditHash}\n\n✅ FCA compliant transaction record`);
  };

  const runLiveFlowTests = async () => {
    const result = await liveFlowTester.runLiveFlowTests();
    setLiveFlowResult(result);
    alert(`Live Flow Tests: ${result.allPassed ? 'PASSED' : 'FAILED'}\n\n${result.summary}`);
  };

  const runWarRoomChecks = async () => {
    const result = await warRoomChecker.runAllChecks();
    setWarRoomResult(result);
    alert(`War Room Checks: ${result.allChecksPassed ? 'PASSED' : 'FAILED'}\n\n${result.summary}`);
  };

  const generateEvidencePack = async () => {
    const pack = await evidencePackGenerator.generateEvidencePack();
    setEvidencePack(pack);
    evidencePackGenerator.downloadEvidencePack(pack);
    alert('Evidence pack generated and downloaded!');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Brand.Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Active RFQs</p>
              <p className="text-2xl font-bold text-body accent-glow">{rfqs.length}</p>
              <p className="text-xs text-accent accent-glow">+12% this week</p>
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
              <p className="text-xs text-accent accent-glow">Avg 2.3 per RFQ</p>
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
              <p className="text-xs text-accent accent-glow">$2.1M volume</p>
            </div>
            <DollarSign className="w-8 h-8 text-accent icon-glow" />
          </div>
        </Brand.Card>

        <Brand.Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Avg Response Time</p>
              <p className="text-2xl font-bold text-body accent-glow">2.3m</p>
              <p className="text-xs text-accent accent-glow">Fast lane eligible</p>
            </div>
            <Clock className="w-8 h-8 text-accent icon-glow" />
          </div>
        </Brand.Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Brand.Card>
          <Brand.SectionTitle>
            <Bell className="w-5 h-5 inline mr-2" />
            Live Alerts ({alerts.filter(a => a.unread).length} unread)
          </Brand.SectionTitle>
          <div className="space-y-3">
            {alerts.map(alert => (
              <Brand.Panel key={alert.id} className={alert.unread ? 'bg-elev' : 'bg-surface'}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {alert.type === 'price_drop' ? (
                      <TrendingUp className="w-4 h-4 text-accent mt-0.5" />
                    ) : (
                      <Clock className="w-4 h-4 text-accent mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-medium text-body">{alert.title}</h4>
                      <p className="text-sm text-muted">{alert.message}</p>
                      <p className="text-xs text-muted">{new Date(alert.time).toLocaleString()}</p>
                    </div>
                  </div>
                  {alert.unread && (
                    <Brand.StatusChip status="info">New</Brand.StatusChip>
                  )}
                </div>
              </Brand.Panel>
            ))}
          </div>
        </Brand.Card>
      )}

      {/* Recent Activity */}
      <Brand.Card>
        <Brand.SectionTitle>
          <BarChart3 className="w-5 h-5 inline mr-2" />
          Recent Activity
        </Brand.SectionTitle>
        <div className="space-y-3">
          {rfqs.slice(0, 3).map(rfq => (
            <Brand.Panel key={rfq.id} className="hover:bg-elev transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <div>
                    <p className="font-medium text-body">{rfq.route}</p>
                    <p className="text-sm text-muted">{rfq.aircraft} • {rfq.quotes.length} quotes • {rfq.passengers} pax</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Brand.StatusChip status={
                    rfq.status === 'paid' ? 'success' :
                    rfq.status === 'quoted' ? 'info' :
                    'warn'
                  }>
                    {rfq.status}
                  </Brand.StatusChip>
                  <Brand.Secondary size="sm">
                    <Eye className="w-4 h-4" />
                  </Brand.Secondary>
                </div>
              </div>
            </Brand.Panel>
          ))}
        </div>
      </Brand.Card>
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
        {rfqs.map(rfq => (
          <Card key={rfq.id} className="terminal-card hover:terminal-glow animate-fade-in-up" style={{animationDelay: `${(rfq.id || 0) * 0.1}s`}}>
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
                          onClick={() => createPaymentIntent(rfq, quote)}
                          className="btn-terminal-accent"
                          disabled={!quote.verified}
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Create Payment
                        </Button>
                        <Button
                          onClick={() => generateReceipt(rfq, quote)}
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
        ))}
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
                    <span>Jan 20, 2024</span>
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
      <ModernHelpGuide 
        terminalType="broker" 
        activeTab={activeTab} 
        showOnMount={true} 
        isDemo={true}
      />
      <div className="min-h-screen bg-app text-body">
      <header className="sticky top-0 z-20 bg-app/80 backdrop-blur border-b border-default">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <StratusConnectLogo className="text-xl" />
            <div>
              <Brand.PageTitle className="hero-glow">Broker Terminal</Brand.PageTitle>
              <p className="text-muted text-glow-subtle">FCA Compliant Trading Floor • 100% Free Until Revenue</p>
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
              Gold League
            </Brand.StatusChip>
            {isDemoMode && (
              <Brand.StatusChip status="warn">
                <AlertTriangle className="w-3 h-3 mr-1 icon-glow" />
                Demo Mode
              </Brand.StatusChip>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">

        {/* Compliance Notice */}
        <ComplianceNotice />
        
        {/* Evidence Pack */}
        <EvidencePack />

        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-11">
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
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 icon-glow" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="scoreboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 icon-glow" />
              Scoreboard
            </TabsTrigger>
            <TabsTrigger value="warroom" className="flex items-center gap-2">
              <Shield className="w-4 h-4 icon-glow" />
              War Room
            </TabsTrigger>
            <TabsTrigger value="evidence" className="flex items-center gap-2">
              <FileText className="w-4 h-4 icon-glow" />
              Evidence
            </TabsTrigger>
            <TabsTrigger value="ranking" className="flex items-center gap-2">
              <Trophy className="w-4 h-4 icon-glow" />
              Ranking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            {renderDashboard()}
          </TabsContent>
          <TabsContent value="rfqs" className="mt-6">
            {renderRFQs()}
          </TabsContent>
          <TabsContent value="marketplace" className="mt-6">
            {renderMarketplace()}
          </TabsContent>
          <TabsContent value="searches" className="mt-6">
            {renderSavedSearches()}
          </TabsContent>
          <TabsContent value="reputation" className="mt-6">
            {renderReputation()}
          </TabsContent>
          <TabsContent value="billing" className="mt-6">
            {renderBilling()}
          </TabsContent>
          <TabsContent value="scoreboard" className="mt-6">
            <WeekOneScoreboard />
          </TabsContent>
          <TabsContent value="warroom" className="mt-6">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  War Room Checks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={runWarRoomChecks} className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Run War Room Checks
                  </Button>
                  {warRoomResult && (
                    <div className="mt-4 p-4 bg-surface rounded-lg">
                      <h3 className="font-semibold mb-2">Results:</h3>
                      <p className="text-sm text-gunmetal whitespace-pre-line">
                        {warRoomResult.summary}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ranking" className="mt-6">
            <RankingRulesPage />
          </TabsContent>
          
          <TabsContent value="tracking" className="mt-6">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  Live Flight Tracking
                </CardTitle>
                <CardDescription>
                  Monitor aircraft activity and track flights in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FlightRadar24Widget />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evidence" className="mt-6">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Evidence Pack Generator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={runLiveFlowTests} className="w-full">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Run Live Flow Tests
                  </Button>
                  <Button onClick={generateEvidencePack} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Evidence Pack
                  </Button>
                  {evidencePack && (
                    <div className="mt-4 p-4 bg-surface rounded-lg">
                      <h3 className="font-semibold mb-2">Evidence Pack Generated:</h3>
                      <p className="text-sm text-gunmetal">
                        ID: {evidencePack.id}<br/>
                        Generated: {new Date(evidencePack.generatedAt).toLocaleString()}<br/>
                        Version: {evidencePack.version}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

            <TabsContent value="ranking" className="mt-6">
            <div className="space-y-6">
              {/* Ranking Rules Link */}
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('/ranking-rules', '_blank')}
                  className="button-glow"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Ranking Rules
                </Button>
              </div>
              {/* League Status Card */}
              <Card className="terminal-card border-accent border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 title-glow">
                    <Trophy className="w-6 h-6 text-accent" />
                    Your League Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent accent-glow mb-1">
                        Gold League
                      </div>
                      <div className="text-sm text-muted-foreground subtitle-glow">
                        Current League
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground mb-1">
                        567
                      </div>
                      <div className="text-sm text-muted-foreground subtitle-glow">
                        Total Points
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground mb-1">
                        #12
                      </div>
                      <div className="text-sm text-muted-foreground subtitle-glow">
                        Global Rank
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress to Platinum League</span>
                      <span className="text-accent font-semibold">133 points to go</span>
                    </div>
                    <div className="w-full bg-terminal-border rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '81%' }}></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-muted-foreground">+23 this week</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-muted-foreground">14 day streak</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Challenges */}
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 title-glow">
                    <Target className="w-6 h-6 text-accent" />
                    Weekly Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { name: "Quality RFQ Week", description: "Post 3 quality RFQs that pass basic checks this week", points: 15, completed: true, progress: 100 },
                      { name: "Fast Response Week", description: "Respond to 2 saved search alerts within 10 minutes this week", points: 20, completed: false, progress: 50 },
                      { name: "On-Time Completion Week", description: "Complete 2 deals on time with no disputes this week", points: 80, completed: true, progress: 100 },
                      { name: "Credentials Current Week", description: "Keep all credentials valid and current this week", points: 10, completed: true, progress: 100 },
                      { name: "Compliance Clean Week", description: "Maintain clean compliance status this week", points: 5, completed: true, progress: 100 },
                    ].map((challenge, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${
                        challenge.completed 
                          ? 'bg-accent/10 border-accent/30' 
                          : 'bg-terminal-card/50 border-terminal-border'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              challenge.completed ? 'bg-accent text-white' : 'bg-terminal-border'
                            }`}>
                              {challenge.completed ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs">+</span>}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-foreground">{challenge.name}</div>
                              <div className="text-sm text-muted-foreground mb-1">{challenge.description}</div>
                              {!challenge.completed && challenge.progress !== undefined && (
                                <div className="w-full bg-terminal-border rounded-full h-1.5">
                                  <div 
                                    className="bg-accent h-1.5 rounded-full transition-all duration-300" 
                                    style={{ width: `${challenge.progress}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge variant={challenge.completed ? "default" : "outline"}>
                            {challenge.completed ? "✓" : `+${challenge.points}`}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 title-glow">
                    <Zap className="w-6 h-6 text-accent" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: "Submitted quote for NYC-LAX route in 3 minutes", points: 15, time: "2 hours ago" },
                      { action: "Completed London-Dubai charter on schedule with no disputes", points: 40, time: "1 day ago" },
                      { action: "Posted quality RFQ for Tokyo-Singapore route", points: 5, time: "2 days ago" },
                      { action: "Closed Paris-Milan deal without disputes", points: 20, time: "3 days ago" },
                      { action: "Responded to Europe-Asia alert in 8 minutes", points: 10, time: "4 days ago" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-terminal-card/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-accent/20 rounded-lg">
                            <Zap className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{activity.action}</div>
                            <div className="text-sm text-muted-foreground">{activity.time}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-accent">
                          +{activity.points}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Demo Notice */}
        {isDemoMode && (
          <Brand.Card className="mt-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warn mt-0.5" />
              <div>
                <h3 className="font-medium text-body">Demo Mode - All Features Active</h3>
                <p className="text-muted text-sm mt-1">
                  This terminal demonstrates all FCA compliant features with mock data. 
                  In production, all payments would be processed through Stripe Connect with real money.
                  <strong> Zero monthly costs until you generate revenue.</strong>
                </p>
              </div>
            </div>
          </Brand.Card>
        )}
      </main>
    </div>
    </>
  );
}