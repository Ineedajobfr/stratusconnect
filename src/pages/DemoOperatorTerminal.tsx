// Enhanced Demo Operator Terminal - All Features
// FCA Compliant Aviation Platform - 100% Free Until Revenue

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  UserPlus,
  Briefcase,
  CreditCard,
  Building,
  Activity
} from 'lucide-react';
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
import { FlightRadar24Widget } from '@/components/flight-tracking/FlightRadar24Widget';
import { PersonalizedFeed } from '@/components/feed/PersonalizedFeed';

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

interface Deal {
  id: string;
  rfqId: string;
  broker: string;
  route: string;
  aircraft: string;
  date: string;
  price: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  platformFee: number;
  netAmount: number;
  auditHash: string;
}

interface Pilot {
  id: string;
  name: string;
  role: string;
  rating: number;
  experience: string;
  verified: boolean;
  available: boolean;
  hourlyRate: number;
  currency: string;
  credentials: {
    license: string;
    medical: string;
    typeRating: string[];
    expiry: string;
  };
}

interface Crew {
  id: string;
  name: string;
  role: string;
  rating: number;
  experience: string;
  verified: boolean;
  available: boolean;
  dailyRate: number;
  currency: string;
  credentials: {
    training: string[];
    certificates: string[];
    expiry: string;
  };
}

export default function DemoOperatorTerminal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showWeekOneScoreboard, setShowWeekOneScoreboard] = useState(false);
  const [showWarRoomChecks, setShowWarRoomChecks] = useState(false);
  const [liveFlowResult, setLiveFlowResult] = useState<unknown>(null);
  const [warRoomResult, setWarRoomResult] = useState<unknown>(null);
  
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
      quotes: []
    },
    {
      id: 'RFQ-002',
      route: 'Paris - Dubai',
      aircraft: 'Bombardier Global 6000',
      date: '2024-01-22',
      price: 38000,
      currency: 'EUR',
      status: 'sent',
      legs: 1,
      passengers: 12,
      specialRequirements: 'Pet transport, special catering',
      quotes: []
    }
  ]);

  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: 'Q-001',
      operator: 'Elite Aviation',
      price: 45000,
      currency: 'USD',
      validUntil: '2024-01-18T18:00:00Z',
      aircraft: 'Gulfstream G650',
      verified: true,
      rating: 4.8,
      responseTime: 15,
      dealScore: 92
    },
    {
      id: 'Q-002',
      operator: 'Prime Wings',
      price: 47000,
      currency: 'USD',
      validUntil: '2024-01-18T20:00:00Z',
      aircraft: 'Gulfstream G650',
      verified: true,
      rating: 4.6,
      responseTime: 25,
      dealScore: 88
    }
  ]);

  const [deals, setDeals] = useState<Deal[]>([
    {
      id: 'DEAL-001',
      rfqId: 'RFQ-001',
      broker: 'Elite Aviation Brokers',
      route: 'London - New York',
      aircraft: 'Gulfstream G650',
      date: '2024-01-20',
      price: 45000,
      currency: 'USD',
      status: 'completed',
      platformFee: 3150,
      netAmount: 41850,
      auditHash: 'audit_hash_123'
    }
  ]);

  const [pilots, setPilots] = useState<Pilot[]>([
    {
      id: 'PILOT-001',
      name: 'Sarah Wilson',
      role: 'Captain',
      rating: 4.9,
      experience: '15 years',
      verified: true,
      available: true,
      hourlyRate: 150,
      currency: 'USD',
      credentials: {
        license: 'ATPL',
        medical: 'Class 1',
        typeRating: ['G650', 'G550', 'Citation X'],
        expiry: '2024-12-31'
      }
    },
    {
      id: 'PILOT-002',
      name: 'Mike Johnson',
      role: 'First Officer',
      rating: 4.7,
      experience: '8 years',
      verified: true,
      available: false,
      hourlyRate: 120,
      currency: 'USD',
      credentials: {
        license: 'CPL',
        medical: 'Class 1',
        typeRating: ['G650', 'Citation X'],
        expiry: '2024-11-15'
      }
    }
  ]);

  const [crew, setCrew] = useState<Crew[]>([
    {
      id: 'CREW-001',
      name: 'Emma Davis',
      role: 'Flight Attendant',
      rating: 4.8,
      experience: '10 years',
      verified: true,
      available: true,
      dailyRate: 300,
      currency: 'USD',
      credentials: {
        training: ['Safety', 'Service', 'Emergency'],
        certificates: ['FAA', 'EASA'],
        expiry: '2024-10-20'
      }
    }
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 'ALERT-001',
      type: 'quote_request',
      message: 'New RFQ for London-New York route',
      timestamp: '2024-01-16T10:30:00Z',
      read: false
    },
    {
      id: 'ALERT-002',
      type: 'deal_confirmed',
      message: 'Deal DEAL-001 confirmed and payment received',
      timestamp: '2024-01-16T09:15:00Z',
      read: true
    }
  ]);

  const isDemoMode = true;

  const handleQuoteAccept = (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;

    const platformFee = Math.round(quote.price * 0.07);
    const netAmount = quote.price - platformFee;
    const auditHash = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const receipt = {
      transactionId: `TXN_${Date.now()}`,
      timestamp: new Date().toISOString(),
      broker: 'Demo Broker Ltd',
      operator: 'Demo Operator Ltd',
      route: 'London - New York',
      aircraft: quote.aircraft,
      totalPrice: quote.price,
      platformFee: platformFee,
      netToOperator: netAmount,
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
                <p className="text-xs text-white">+8% this week</p>
              </div>
              <FileText className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card hover:terminal-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Quotes Sent</p>
                <p className="text-2xl font-bold text-foreground">{quotes.length}</p>
                <p className="text-xs text-blue-600">Avg 2.1 per RFQ</p>
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
                  {deals.filter(deal => deal.status === 'completed').length}
                </p>
                <p className="text-xs text-purple-600">$1.8M volume</p>
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
                <p className="text-2xl font-bold text-foreground">3.2m</p>
                <p className="text-xs text-white">Fast lane eligible</p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-body">
              <Bell className="w-5 h-5" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-2 bg-elev rounded border border-default">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${alert.read ? 'bg-muted' : 'bg-info'}`} />
                    <span className="text-sm text-body">{alert.message}</span>
                  </div>
                  <span className="text-xs text-muted">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flight Tracking Widget */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="text-cyan-400">Live Flight Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <FlightRadar24Widget />
        </CardContent>
      </Card>

      {/* Personalized Feed */}
      <PersonalizedFeed />

      {/* Recent Activity */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-white" />
              <div>
                <p className="font-medium">Deal DEAL-001 completed</p>
                <p className="text-sm text-gray-600">London - New York • $45,000</p>
              </div>
              <Badge className="bg-slate-800 text-orange-400 border-orange-500/30">Completed</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">Quote sent for RFQ-002</p>
                <p className="text-sm text-gray-600">Paris - Dubai • $38,000</p>
              </div>
              <Badge className="bg-slate-800 text-orange-400 border-orange-500/30">Pending</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium">Pilot credential expires soon</p>
                <p className="text-sm text-gray-600">Mike Johnson • Medical expires Nov 15</p>
              </div>
              <Badge className="bg-orange-900/20 text-orange-400 border-orange-500/30">Warning</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRFQs = () => (
    <div className="space-y-4">
      {rfqs.map(rfq => (
        <Card key={rfq.id} className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{rfq.route}</h3>
                <p className="text-sm text-gunmetal">{rfq.aircraft} • {rfq.passengers} passengers</p>
                <p className="text-sm text-gunmetal">Date: {rfq.date} • {rfq.legs} leg(s)</p>
                {rfq.specialRequirements && (
                  <p className="text-sm text-accent mt-1">Requirements: {rfq.specialRequirements}</p>
                )}
              </div>
              <Badge className={rfq.status === 'quoted' ? 'bg-slate-800 text-orange-400 border-orange-500/30' : 'bg-orange-900/20 text-orange-400 border-orange-500/30'}>
                {rfq.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button size="sm" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Send Quote
              </Button>
              <Button size="sm" variant="outline">
                <Target className="w-4 h-4 mr-2" />
                Auto-Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderPilots = () => (
    <div className="space-y-4">
      {pilots.map(pilot => (
        <Card key={pilot.id} className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{pilot.name}</h3>
                <p className="text-sm text-gray-600">{pilot.role} • {pilot.experience}</p>
                <p className="text-sm text-gray-600">Rate: ${pilot.hourlyRate}/hour</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(pilot.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{pilot.rating}/5</span>
                </div>
              </div>
              <div className="text-right">
                <Badge className={pilot.available ? 'bg-slate-800 text-orange-400 border-orange-500/30' : 'bg-slate-800 text-slate-300 border-slate-600'}>
                  {pilot.available ? 'Available' : 'Unavailable'}
                </Badge>
                {pilot.verified && (
                  <Badge className="bg-slate-800 text-orange-400 border-orange-500/30 mt-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">License</p>
                <p className="font-medium">{pilot.credentials.license}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Medical</p>
                <p className="font-medium">{pilot.credentials.medical}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type Ratings</p>
                <p className="font-medium">{pilot.credentials.typeRating.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expiry</p>
                <p className="font-medium">{pilot.credentials.expiry}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </Button>
              <Button size="sm" variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Hire
              </Button>
              <Button size="sm" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Credentials
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderCrew = () => (
    <div className="space-y-4">
      {crew.map(crewMember => (
        <Card key={crewMember.id} className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{crewMember.name}</h3>
                <p className="text-sm text-gray-600">{crewMember.role} • {crewMember.experience}</p>
                <p className="text-sm text-gray-600">Rate: ${crewMember.dailyRate}/day</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(crewMember.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{crewMember.rating}/5</span>
                </div>
              </div>
              <div className="text-right">
                <Badge className={crewMember.available ? 'bg-slate-800 text-orange-400 border-orange-500/30' : 'bg-slate-800 text-slate-300 border-slate-600'}>
                  {crewMember.available ? 'Available' : 'Unavailable'}
                </Badge>
                {crewMember.verified && (
                  <Badge className="bg-slate-800 text-orange-400 border-orange-500/30 mt-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Training</p>
                <p className="font-medium">{crewMember.credentials.training.length} courses</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Certificates</p>
                <p className="font-medium">{crewMember.credentials.certificates.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expiry</p>
                <p className="font-medium">{crewMember.credentials.expiry}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </Button>
              <Button size="sm" variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Hire
              </Button>
              <Button size="sm" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Certificates
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderFleet = () => (
    <div className="space-y-4">
      <Card className="terminal-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Gulfstream G650</h3>
              <p className="text-sm text-gray-600">Registration: N650SC</p>
              <p className="text-sm text-gray-600">Capacity: 8 passengers</p>
              <p className="text-sm text-gray-600">Range: 7,500 nm</p>
            </div>
            <Badge className="bg-slate-800 text-orange-400 border-orange-500/30">Available</Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Next Flight</p>
              <p className="font-medium">Jan 20, 14:00</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hours This Month</p>
              <p className="font-medium">45.2</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Maintenance Due</p>
              <p className="font-medium">Feb 15</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="font-medium">$180,000</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button size="sm" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Maintenance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Revenue Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-800 rounded-lg">
              <p className="text-2xl font-bold text-white">$180,000</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="text-center p-4 bg-slate-800 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">$12,600</p>
              <p className="text-sm text-gray-600">Platform Fees (7%)</p>
            </div>
            <div className="text-center p-4 bg-slate-800 rounded-lg border border-orange-500/30">
              <p className="text-2xl font-bold text-orange-400">$167,400</p>
              <p className="text-sm text-slate-300">Net to Operator</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deals.map(deal => (
              <div key={deal.id} className="flex items-center justify-between p-3 bg-slate-800 rounded border border-orange-500/30">
                <div>
                  <p className="font-medium text-white">{deal.route}</p>
                  <p className="text-sm text-white/70">{deal.date} • {deal.aircraft}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">${deal.price.toLocaleString()}</p>
                  <p className="text-sm text-white/70">Fee: ${deal.platformFee.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-app relative overflow-hidden">
      <StarfieldRunwayBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">StratusConnect</h1>
              <p className="text-gunmetal">Operator Terminal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isDemoMode && (
              <Badge className="bg-orange-900/20 text-orange-400 border-orange-500/30">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Demo Mode
              </Badge>
            )}
          </div>
        </div>


        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 bg-terminal-card border-terminal-border text-xs overflow-x-auto">
            <TabsTrigger value="dashboard" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Dashboard</TabsTrigger>
            <TabsTrigger value="rfqs" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">RFQs</TabsTrigger>
            <TabsTrigger value="pilots" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Pilots</TabsTrigger>
            <TabsTrigger value="crew" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Crew</TabsTrigger>
            <TabsTrigger value="fleet" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Fleet</TabsTrigger>
            <TabsTrigger value="billing" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Billing</TabsTrigger>
            <TabsTrigger value="scoreboard" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">Scoreboard</TabsTrigger>
            <TabsTrigger value="warroom" className="text-xs data-[state=active]:bg-accent data-[state=active]:text-white">War Room</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            {renderDashboard()}
          </TabsContent>
          <TabsContent value="rfqs" className="mt-6">
            {renderRFQs()}
          </TabsContent>
          <TabsContent value="pilots" className="mt-6">
            {renderPilots()}
          </TabsContent>
          <TabsContent value="crew" className="mt-6">
            {renderCrew()}
          </TabsContent>
          <TabsContent value="fleet" className="mt-6">
            {renderFleet()}
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
                    <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-orange-500/30">
                      <h3 className="font-semibold mb-2">Results:</h3>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {(warRoomResult as Record<string, unknown>)?.summary as string || 'No summary available'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Demo Notice */}
        {isDemoMode && (
          <Card className="mt-8 bg-slate-800 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Demo Mode Active</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    This is a demonstration of the Operator Terminal. All data is simulated and no real transactions will occur.
                    The platform operates 100% free until revenue is generated.
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