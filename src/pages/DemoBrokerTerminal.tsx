// Enhanced Demo Broker Terminal - All Features
// FCA Compliant Aviation Platform - 100% Free Until Revenue

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Download
} from 'lucide-react';
import MultiLegRFQ from '@/components/DealFlow/MultiLegRFQ';
import QuoteComposer from '@/components/DealFlow/QuoteComposer';
import BackhaulMatcher from '@/components/DealFlow/BackhaulMatcher';
import SavedSearches from '@/components/DealFlow/SavedSearches';
import ReputationMetrics from '@/components/Reputation/ReputationMetrics';
import MonthlyStatements from '@/components/Billing/MonthlyStatements';

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

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="terminal-card hover:terminal-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Active RFQs</p>
                <p className="text-2xl font-bold text-foreground">{rfqs.length}</p>
                <p className="text-xs text-green-600">+12% this week</p>
              </div>
              <FileText className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card hover:terminal-glow">
          <CardContent className="p4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Quotes Received</p>
                <p className="text-2xl font-bold text-foreground">
                  {rfqs.reduce((sum, rfq) => sum + rfq.quotes.length, 0)}
                </p>
                <p className="text-xs text-blue-600">Avg 2.3 per RFQ</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card hover:terminal-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Deals Closed</p>
                <p className="text-2xl font-bold text-foreground">
                  {rfqs.filter(rfq => rfq.status === 'paid').length}
                </p>
                <p className="text-xs text-purple-600">$2.1M volume</p>
              </div>
              <DollarSign className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card hover:terminal-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Avg Response Time</p>
                <p className="text-2xl font-bold text-foreground">2.3m</p>
                <p className="text-xs text-green-600">Fast lane eligible</p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="terminal-card border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Bell className="w-5 h-5" />
              Live Alerts ({alerts.filter(a => a.unread).length} unread)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className={`p-3 rounded-lg border ${
                  alert.unread ? 'bg-blue-100 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {alert.type === 'price_drop' ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
                      ) : (
                        <Clock className="w-4 h-4 text-orange-600 mt-0.5" />
                      )}
                      <div>
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                        <p className="text-xs text-gray-500">{new Date(alert.time).toLocaleString()}</p>
                      </div>
                    </div>
                    {alert.unread && (
                      <Badge className="bg-blue-600 text-white">New</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rfqs.slice(0, 3).map(rfq => (
              <div key={rfq.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{rfq.route}</p>
                    <p className="text-sm text-gunmetal">{rfq.aircraft} • {rfq.quotes.length} quotes • {rfq.passengers} pax</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    rfq.status === 'paid' ? 'bg-green-100 text-green-800' :
                    rfq.status === 'quoted' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {rfq.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRFQs = () => (
    <div className="space-y-6">
      <Card className="terminal-card">
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
          <Card key={rfq.id} className="terminal-card hover:terminal-glow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="w-5 h-5" />
                    {rfq.route}
                  </CardTitle>
                  <p className="text-gunmetal">{rfq.aircraft} • {rfq.date} • {rfq.legs} leg(s) • {rfq.passengers} pax</p>
                  {rfq.specialRequirements && (
                    <p className="text-sm text-blue-600 mt-1">📋 {rfq.specialRequirements}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    rfq.status === 'paid' ? 'bg-green-100 text-green-800' :
                    rfq.status === 'quoted' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
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
                    <div key={quote.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{quote.operator}</p>
                            <p className="text-sm text-gunmetal">{quote.aircraft}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">{quote.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">${quote.price.toLocaleString()}</p>
                          <p className="text-sm text-gunmetal">Valid until: {new Date(quote.validUntil).toLocaleDateString()}</p>
                          <p className="text-xs text-green-600">Deal Score: {quote.dealScore}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        {quote.verified ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Unverified
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-blue-600">
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
                <div className="text-center py-8 text-gray-500">
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
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filters</span>
            </div>
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Compare Mode</span>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Alerts Active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="p-4 hover:terminal-glow transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">Elite Aviation</h3>
                    <p className="text-sm text-gray-600">Gulfstream G650</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>LHR → JFK</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Jan 20, 2024</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>8 seats</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl font-bold">$45,000</div>
                  <div className="text-sm text-gray-600">$2,100/NM</div>
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
    <div className="min-h-screen bg-terminal-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Broker Terminal</h1>
            <p className="text-gunmetal">FCA Compliant Trading Floor • 100% Free Until Revenue</p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-green-100 text-green-800">
              <Shield className="w-3 h-3 mr-1" />
              FCA Compliant
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Zap className="w-3 h-3 mr-1" />
              Free Tier
            </Badge>
            {isDemoMode && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Demo Mode
              </Badge>
            )}
          </div>
        </div>

        {/* Compliance Notice */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-800">Fee Structure & Free Operation</h3>
                <p className="text-green-700 text-sm mt-1">
                  <strong>7% platform commission</strong> on all broker-operator deals. 
                  <strong>10% hiring fee</strong> on operator pilot/crew hires. 
                  <strong>0% fees</strong> for pilots and crew. 
                  All fees automatically calculated and deducted by Stripe Connect. 
                  <strong>No monthly costs</strong> - only pay when you make money.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="rfqs" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              RFQs & Quotes
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="searches" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Saved Searches
            </TabsTrigger>
            <TabsTrigger value="reputation" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Reputation
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Billing
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
        </Tabs>

        {/* Demo Notice */}
        {isDemoMode && (
          <Card className="mt-8 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Demo Mode - All Features Active</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    This terminal demonstrates all FCA compliant features with mock data. 
                    In production, all payments would be processed through Stripe Connect with real money.
                    <strong> Zero monthly costs until you generate revenue.</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}