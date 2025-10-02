// Enhanced Demo Broker Terminal - All Features
// FCA Compliant Aviation Platform - 100% Free Until Revenue

import AdvancedSearch from '@/components/AdvancedSearch';
import { MonthlyStatements } from '@/components/Billing/MonthlyStatements';
import CommunicationTools from '@/components/CommunicationTools';
import CommunityForums from '@/components/community/CommunityForums';
import ContractGenerator from '@/components/contracts/ContractGenerator';
import ReceiptGenerator from '@/components/contracts/ReceiptGenerator';
import { MultiLegRFQ } from '@/components/DealFlow/MultiLegRFQ';
import { SavedSearches } from '@/components/DealFlow/SavedSearches';
import DocumentManagement from '@/components/DocumentManagement';
import DocumentStorage from '@/components/documents/DocumentStorage';
import JobBoard from '@/components/job-board/JobBoard';
import SavedCrews from '@/components/job-board/SavedCrews';
import { ModernHelpGuide } from '@/components/ModernHelpGuide';
import NoteTakingSystem from '@/components/NoteTakingSystem';
import RealTimeFlightTracker from '@/components/RealTimeFlightTracker';
import { ReputationMetrics } from '@/components/Reputation/ReputationMetrics';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeekOneScoreboard } from '@/components/WeekOneScoreboard';
import { useAuth } from '@/contexts/AuthContext';
import { brokerDashboardService, type BrokerMetrics } from '@/lib/broker-dashboard-service';
import {
    AlertTriangle,
    ArrowUp,
    Award,
    BarChart3,
    Bell,
    Briefcase,
    Calendar,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    DollarSign,
    Eye,
    FileText,
    Filter,
    GitCompare,
    MapPin,
    MessageCircle,
    Plane,
    Plus,
    Receipt,
    Save,
    Search,
    Shield,
    Star,
    Target,
    TrendingUp,
    Trophy,
    Users,
    Zap
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showWeekOneScoreboard, setShowWeekOneScoreboard] = useState(false);
  const [showWarRoomChecks, setShowWarRoomChecks] = useState(false);
  const [showEvidencePack, setShowEvidencePack] = useState(false);
  const [liveFlowResult, setLiveFlowResult] = useState<{ allPassed: boolean; summary: string } | null>(null);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const alertsDropdownRef = useRef<HTMLDivElement>(null);
  const [alerts, setAlerts] = useState([
    {
      id: 'ALERT-001',
      type: 'price_drop',
      title: 'Price Drop: LHR to JFK',
      message: 'Gulfstream G650 dropped 12% to $75,000',
      time: '2025-09-16T14:30:00Z',
      unread: true
    },
    {
      id: 'ALERT-002',
      type: 'last_minute',
      title: 'Last Minute: CDG to LHR',
      message: 'Citation X available in 6 hours for $35,000',
      time: '2025-09-16T16:45:00Z',
      unread: true
    },
    {
      id: 'ALERT-003',
      type: 'new_operator',
      title: 'New Operator: Elite Wings',
      message: 'Premium operator with 4.9 rating joined platform',
      time: '2025-09-16T10:45:00Z',
      unread: false
    },
    {
      id: 'ALERT-004',
      type: 'price_drop',
      title: 'Price Drop: LAX to NRT',
      message: 'Bombardier Global 7500 dropped 8% to $115,000',
      time: '2025-09-15T16:20:00Z',
      unread: true
    },
    {
      id: 'ALERT-005',
      type: 'availability',
      title: 'New Availability: MIA to LHR',
      message: 'Challenger 650 available for $42,000 on Sep 28',
      time: '2025-09-15T14:10:00Z',
      unread: false
    },
    {
      id: 'ALERT-006',
      type: 'fuel_surcharge',
      title: 'Fuel Surcharge Update',
      message: 'Global fuel surcharge increased by 3% across all operators',
      time: '2025-09-15T11:30:00Z',
      unread: false
    }
  ]);
  const [metrics, setMetrics] = useState<BrokerMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [selectedRFQForQuotes, setSelectedRFQForQuotes] = useState<string | null>(null);
  const [quotesForComparison, setQuotesForComparison] = useState<any[]>([]);
  
  // Collapsible sections state
  const [isDocumentManagementCollapsed, setIsDocumentManagementCollapsed] = useState(false);
  const [isCreateRFQCollapsed, setIsCreateRFQCollapsed] = useState(false);
  const [isRFQFormsCollapsed, setIsRFQFormsCollapsed] = useState(false);

  // Load dashboard metrics from database
  useEffect(() => {
    const loadMetrics = async () => {
      if (user?.id) {
        setMetricsLoading(true);
        const data = await brokerDashboardService.getDashboardMetrics(user.id);
        setMetrics(data);
        setMetricsLoading(false);
      }
    };

    loadMetrics();
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Close alerts dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (alertsDropdownRef.current && !alertsDropdownRef.current.contains(event.target as Node)) {
        setShowAlertsDropdown(false);
      }
    };

    if (showAlertsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAlertsDropdown]);

  // Handle quote acceptance - creates booking, generates contract, processes payment
  const handleAcceptQuote = async (quoteId: string) => {
    if (!user?.id) return;

    try {
      // Accept quote and create booking in database
      const success = await brokerDashboardService.acceptQuote(quoteId, user.id);
      
      if (success) {
        // Refresh metrics to show updated deals
        const updatedMetrics = await brokerDashboardService.getDashboardMetrics(user.id);
        setMetrics(updatedMetrics);
        
        // Show success message
        alert('✅ Quote Accepted!\n\n✈️ Booking created\n📄 Contract generated\n💳 Payment processing initiated\n⭐ +40 reputation points awarded');
        
        // Refresh the RFQ list
        setActiveTab('dashboard');
      }
    } catch (error) {
      console.error('Failed to accept quote:', error);
      alert('❌ Failed to accept quote. Please try again.');
    }
  };

  // Handle quote rejection
  const handleRejectQuote = async (quoteId: string) => {
    try {
      const success = await brokerDashboardService.rejectQuote(quoteId);
      
      if (success) {
        // Remove from quotes list
        setQuotesForComparison(prev => prev.filter(q => q.id !== quoteId));
        alert('Quote rejected successfully');
      }
    } catch (error) {
      console.error('Failed to reject quote:', error);
      alert('Failed to reject quote. Please try again.');
    }
  };
  const [warRoomResult, setWarRoomResult] = useState<{ allChecksPassed: boolean; summary: string } | null>(null);
  const [evidencePack, setEvidencePack] = useState<{ id: string; timestamp: string } | null>(null);
  const [showJobBoard, setShowJobBoard] = useState(false);
  const [showCommunityForums, setShowCommunityForums] = useState(false);
  const [showSavedCrews, setShowSavedCrews] = useState(false);
  const [showDocumentStorage, setShowDocumentStorage] = useState(false);
  const [showContractGenerator, setShowContractGenerator] = useState(false);
  const [showReceiptGenerator, setShowReceiptGenerator] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [rfqs, setRfqs] = useState<RFQ[]>([
    {
      id: 'RFQ-001',
      route: 'London - New York',
      aircraft: 'Gulfstream G650',
      date: '2025-09-20',
      price: 85000,
      currency: 'USD',
      status: 'quoted',
      legs: 1,
      passengers: 8,
      specialRequirements: 'VIP handling, customs clearance, catering',
      quotes: [
        {
          id: 'Q-001',
          operator: 'Elite Aviation',
          price: 85000,
          currency: 'USD',
          validUntil: '2025-09-18T23:59:59Z',
          aircraft: 'Gulfstream G650',
          verified: true,
          rating: 4.8,
          responseTime: 3.2,
          dealScore: 89,
          fees: {
            basePrice: 75000,
            fuelSurcharge: 8500,
            handling: 1200,
            catering: 800,
            total: 85000
          }
        },
        {
          id: 'Q-002',
          operator: 'SkyHigh Jets',
          price: 92000,
          currency: 'USD',
          validUntil: '2025-09-19T12:00:00Z',
          aircraft: 'Gulfstream G650',
          verified: true,
          rating: 4.6,
          responseTime: 5.1,
          dealScore: 76,
          fees: {
            basePrice: 82000,
            fuelSurcharge: 7500,
            handling: 1500,
            catering: 1000,
            total: 92000
          }
        }
      ]
    },
    {
      id: 'RFQ-002',
      route: 'Paris - Dubai',
      aircraft: 'Global 6000',
      date: '2025-09-25',
      price: 65000,
      currency: 'EUR',
      status: 'sent',
      legs: 1,
      passengers: 12,
      specialRequirements: 'Catering for dietary restrictions, ground transportation',
      quotes: [
        {
          id: 'Q-003',
          operator: 'Luxury Wings',
          price: 65000,
          currency: 'EUR',
          validUntil: '2025-09-23T18:00:00Z',
          aircraft: 'Global 6000',
          verified: true,
          rating: 4.9,
          responseTime: 2.1,
          dealScore: 94,
          fees: {
            basePrice: 58000,
            fuelSurcharge: 4500,
            handling: 1500,
            catering: 1000,
            total: 65000
          }
        }
      ]
    },
    {
      id: 'RFQ-003',
      route: 'Los Angeles - Tokyo',
      aircraft: 'Bombardier Global 7500',
      date: '2025-10-02',
      price: 125000,
      currency: 'USD',
      status: 'quoted',
      legs: 1,
      passengers: 16,
      specialRequirements: 'Custom interior, premium catering, ground crew',
      quotes: [
        {
          id: 'Q-004',
          operator: 'Pacific Elite',
          price: 125000,
          currency: 'USD',
          validUntil: '2025-09-30T20:00:00Z',
          aircraft: 'Bombardier Global 7500',
          verified: true,
          rating: 4.7,
          responseTime: 4.5,
          dealScore: 87,
          fees: {
            basePrice: 110000,
            fuelSurcharge: 12000,
            handling: 2000,
            catering: 1000,
            total: 125000
          }
        },
        {
          id: 'Q-005',
          operator: 'TransGlobal Aviation',
          price: 135000,
          currency: 'USD',
          validUntil: '2025-10-01T12:00:00Z',
          aircraft: 'Bombardier Global 7500',
          verified: true,
          rating: 4.5,
          responseTime: 6.2,
          dealScore: 82,
          fees: {
            basePrice: 120000,
            fuelSurcharge: 10000,
            handling: 3000,
            catering: 2000,
            total: 135000
          }
        }
      ]
    },
    {
      id: 'RFQ-004',
      route: 'Miami - London',
      aircraft: 'Challenger 650',
      date: '2025-09-28',
      price: 45000,
      currency: 'USD',
      status: 'booked',
      legs: 1,
      passengers: 8,
      specialRequirements: 'Pet transport, special handling',
      quotes: [
        {
          id: 'Q-006',
          operator: 'Atlantic Aviation',
          price: 45000,
          currency: 'USD',
          validUntil: '2025-09-26T15:00:00Z',
          aircraft: 'Challenger 650',
          verified: true,
          rating: 4.8,
          responseTime: 2.8,
          dealScore: 91,
          fees: {
            basePrice: 40000,
            fuelSurcharge: 3500,
            handling: 1000,
            catering: 500,
            total: 45000
          }
        }
      ]
    },
    {
      id: 'RFQ-005',
      route: 'Zurich - Singapore',
      aircraft: 'Falcon 8X',
      date: '2025-10-05',
      price: 95000,
      currency: 'EUR',
      status: 'draft',
      legs: 1,
      passengers: 8,
      specialRequirements: 'VIP terminal access, customs pre-clearance',
      quotes: []
    },
    {
      id: 'RFQ-006',
      route: 'Dubai - Mumbai - Singapore',
      aircraft: 'Bombardier Challenger 350',
      date: '2025-10-10',
      price: 95000,
      currency: 'USD',
      status: 'pending',
      legs: 2,
      passengers: 8,
      specialRequirements: 'Multi-leg itinerary, cargo space for luxury goods',
      quotes: []
    },
    {
      id: 'RFQ-007',
      route: 'New York - London - Paris - Rome',
      aircraft: 'Airbus ACJ320neo',
      date: '2025-10-12',
      price: 280000,
      currency: 'USD',
      status: 'quoted',
      legs: 3,
      passengers: 18,
      specialRequirements: 'European tour, diplomatic clearance, conference facilities',
      quotes: [
        {
          id: 'Q-008',
          operator: 'European Executive',
          price: 280000,
          currency: 'USD',
          validUntil: '2025-10-10T14:00:00Z',
          aircraft: 'Airbus ACJ320neo',
          verified: true,
          rating: 4.8,
          responseTime: 3.5,
          dealScore: 91,
          fees: {
            basePrice: 250000,
            fuelSurcharge: 20000,
            handling: 5000,
            catering: 5000,
            total: 280000
          }
        }
      ]
    },
    {
      id: 'RFQ-008',
      route: 'São Paulo - Buenos Aires',
      aircraft: 'Embraer Legacy 650E',
      date: '2025-10-15',
      price: 55000,
      currency: 'USD',
      status: 'quoted',
      legs: 1,
      passengers: 12,
      specialRequirements: 'Bilingual crew, South American customs expertise',
      quotes: [
        {
          id: 'Q-009',
          operator: 'Latam Executive',
          price: 55000,
          currency: 'USD',
          validUntil: '2025-10-13T16:30:00Z',
          aircraft: 'Embraer Legacy 650E',
          verified: true,
          rating: 4.7,
          responseTime: 2.2,
          dealScore: 88,
          fees: {
            basePrice: 50000,
            fuelSurcharge: 3000,
            handling: 1500,
            catering: 500,
            total: 55000
          }
        }
      ]
    },
    {
      id: 'RFQ-009',
      route: 'Hong Kong - Sydney',
      aircraft: 'Bombardier Global 7500',
      date: '2025-10-18',
      price: 165000,
      currency: 'USD',
      status: 'pending',
      legs: 1,
      passengers: 14,
      specialRequirements: 'Extended range, medical equipment, quarantine protocols',
      quotes: []
    },
    {
      id: 'RFQ-010',
      route: 'Moscow - Istanbul - Dubai',
      aircraft: 'Gulfstream G550',
      date: '2025-10-20',
      price: 120000,
      currency: 'USD',
      status: 'quoted',
      legs: 2,
      passengers: 10,
      specialRequirements: 'Multi-leg business trip, security detail, cargo space',
      quotes: [
        {
          id: 'Q-010',
          operator: 'Eurasian Aviation',
          price: 120000,
          currency: 'USD',
          validUntil: '2025-10-18T12:00:00Z',
          aircraft: 'Gulfstream G550',
          verified: true,
          rating: 4.6,
          responseTime: 4.1,
          dealScore: 83,
          fees: {
            basePrice: 110000,
            fuelSurcharge: 7000,
            handling: 2000,
            catering: 1000,
            total: 120000
          }
        }
      ]
    }
  ]);

  const [savedSearches, setSavedSearches] = useState([
    {
      id: 'SS-001',
      name: 'LHR to JFK Business',
      from: 'LHR',
      to: 'JFK',
      dateFrom: '2025-09-20',
      dateTo: '2025-09-25',
      passengers: 8,
      budgetMax: 95000,
      currency: 'USD',
      alerts: 3,
      lastAlert: '2025-09-16T14:30:00Z'
    },
    {
      id: 'SS-002',
      name: 'CDG to DXB Luxury',
      from: 'CDG',
      to: 'DXB',
      dateFrom: '2025-09-25',
      dateTo: '2025-09-30',
      passengers: 12,
      budgetMax: 70000,
      currency: 'EUR',
      alerts: 1,
      lastAlert: '2025-09-22T09:15:00Z'
    },
    {
      id: 'SS-003',
      name: 'LAX to NRT Premium',
      from: 'LAX',
      to: 'NRT',
      dateFrom: '2025-10-01',
      dateTo: '2025-10-10',
      passengers: 16,
      budgetMax: 140000,
      currency: 'USD',
      alerts: 2,
      lastAlert: '2025-09-28T16:45:00Z'
    },
    {
      id: 'SS-004',
      name: 'MIA to LHR Executive',
      from: 'MIA',
      to: 'LHR',
      dateFrom: '2025-09-28',
      dateTo: '2025-10-05',
      passengers: 8,
      budgetMax: 55000,
      currency: 'USD',
      alerts: 0,
      lastAlert: null
    },
    {
      id: 'SS-005',
      name: 'ZUR to SIN Ultra Long Range',
      from: 'ZUR',
      to: 'SIN',
      dateFrom: '2025-10-05',
      dateTo: '2025-10-15',
      passengers: 8,
      budgetMax: 110000,
      currency: 'EUR',
      alerts: 1,
      lastAlert: '2025-10-02T11:20:00Z'
    }
  ]);


  // Debug alerts state
  useEffect(() => {
    console.log('Alerts state updated:', alerts);
    console.log('Unread alerts count:', alerts.filter(a => a.unread).length);
  }, [alerts]);

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
    const result = { allPassed: true, summary: 'Demo mode - all tests passed' };
    setLiveFlowResult(result);
    alert(`Live Flow Tests: ${result.allPassed ? 'PASSED' : 'FAILED'}\n\n${result.summary}`);
  };

  const runWarRoomChecks = async () => {
    const result = { allChecksPassed: true, summary: 'Demo mode - all checks passed' };
    setWarRoomResult(result);
    alert(`War Room Checks: ${result.allChecksPassed ? 'PASSED' : 'FAILED'}\n\n${result.summary}`);
  };

  const generateEvidencePack = async () => {
    const pack = { id: 'demo-pack', timestamp: new Date().toISOString() };
    setEvidencePack(pack);
    alert('Evidence pack generated and downloaded!');
  };

  const handleAlertClick = (alert: any) => {
    console.log('Alert clicked:', alert);
    
    // Close dropdown immediately
    setShowAlertsDropdown(false);
    
    // Mark alert as read
    setAlerts(prev => prev.map(a => 
      a.id === alert.id ? { ...a, unread: false } : a
    ));

    // Navigate based on alert type with a small delay to ensure dropdown closes first
    setTimeout(() => {
      switch (alert.type) {
        case 'price_drop':
          // Navigate to marketplace to see the price drop
          console.log('Navigating to marketplace for price drop');
          setActiveTab('marketplace');
          break;
        case 'last_minute':
          // Navigate to marketplace for last minute deals
          console.log('Navigating to marketplace for last minute deal');
          setActiveTab('marketplace');
          break;
        case 'new_operator':
          // Navigate to marketplace to see new operators
          console.log('Navigating to marketplace for new operator');
          setActiveTab('marketplace');
          break;
        default:
          // Default to marketplace
          console.log('Navigating to marketplace (default)');
          setActiveTab('marketplace');
      }
    }, 100);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-700" style={{ backgroundColor: '#0e141b' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active RFQs</p>
              <p className="text-2xl font-bold text-foreground">
                {metricsLoading ? '...' : (metrics?.activeRFQs || rfqs.length)}
              </p>
              <p className="text-xs text-accent">
                {metrics?.weeklyTrend.rfqsChange > 0 ? '+' : ''}{metrics?.weeklyTrend.rfqsChange?.toFixed(0) || '+12'}% this week
              </p>
            </div>
            <FileText className="w-8 h-8 text-accent" />
          </div>
        </Card>

        <Card className="p-4 border-slate-700" style={{ backgroundColor: '#0e141b' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Quotes Received</p>
              <p className="text-2xl font-bold text-foreground">
                {metricsLoading ? '...' : (metrics?.quotesReceived || rfqs.reduce((sum, rfq) => sum + rfq.quotes.length, 0))}
              </p>
              <p className="text-xs text-accent">
                Avg {metrics?.quotesReceived && metrics?.activeRFQs ? (metrics.quotesReceived / metrics.activeRFQs).toFixed(1) : '2.3'} per RFQ
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent" />
          </div>
        </Card>

        <Card className="p-4 border-slate-700" style={{ backgroundColor: '#0e141b' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Deals Closed</p>
              <p className="text-2xl font-bold text-foreground">
                {metricsLoading ? '...' : (metrics?.dealsClosed || rfqs.filter(rfq => rfq.status === 'paid').length)}
              </p>
              <p className="text-xs text-accent">
                {metrics?.dealsClosed ? `$${(metrics.dealsClosed * 45000).toLocaleString()}` : '$2.1M'} volume
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-accent" />
          </div>
        </Card>

        <Card className="p-4 border-slate-700" style={{ backgroundColor: '#0e141b' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold text-foreground">
                {metricsLoading ? '...' : `${metrics?.avgResponseTime || 2.3}m`}
              </p>
              <p className="text-xs text-accent">
                {(metrics?.avgResponseTime || 2.3) < 3 ? 'Fast lane eligible' : 'Standard lane'}
              </p>
            </div>
            <Clock className="w-8 h-8 text-accent" />
          </div>
        </Card>
      </div>

      {/* Ranking Widget */}
      <div className="flex justify-end">
        <Card className="w-fit p-4 border-slate-700" style={{ backgroundColor: '#0e141b' }}>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Ranking</p>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                <span className="text-lg font-bold text-accent">Golden</span>
              </div>
              <p className="text-xs text-accent">#12 Global</p>
            </div>
            <div className="w-px h-8" style={{ backgroundColor: '#2a3441' }}></div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Points</p>
              <p className="text-lg font-bold text-foreground">567</p>
              <p className="text-xs text-accent">+23 this week</p>
            </div>
          </div>
        </Card>
      </div>


      {/* Advanced Search */}
      <AdvancedSearch terminalType="broker" onResults={(results) => console.log('Search results:', results)} />

      {/* Document Management - Collapsible */}
      <Card className="p-4 border-slate-700" style={{ backgroundColor: '#0e141b' }}>
        <div 
          className="cursor-pointer flex items-center justify-between mb-4"
          onClick={() => setIsDocumentManagementCollapsed(!isDocumentManagementCollapsed)}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-foreground">Document Management</h2>
          </div>
          {isDocumentManagementCollapsed ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        {!isDocumentManagementCollapsed && (
          <div className="mt-4">
            <DocumentManagement userRole="broker" />
          </div>
        )}
      </Card>


      {/* Recent Activity */}
      <Card className="p-4 border-slate-700" style={{ backgroundColor: '#0e141b' }}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
        </div>
        <div className="space-y-3">
          {rfqs.slice(0, 3).map(rfq => (
            <div key={rfq.id} className="p-3 rounded-lg border border-slate-600 hover:opacity-80 transition-opacity" style={{ backgroundColor: '#1a2332' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <div>
                    <p className="font-medium text-foreground">{rfq.route}</p>
                    <p className="text-sm text-muted-foreground">{rfq.aircraft} • {rfq.quotes.length} quotes • {rfq.passengers} pax</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${
                    rfq.status === 'paid' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    rfq.status === 'quoted' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  }`}>
                    {rfq.status}
                  </Badge>
                  <Button variant="outline" size="sm" className="border-slate-600 text-muted-foreground hover:opacity-80" style={{ backgroundColor: '#1a2332' }}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderRFQs = () => (
    <div className="space-y-6">
      {/* Create New RFQ - Collapsible */}
      <Card className="animate-fade-in-up border-slate-700" style={{ backgroundColor: '#0e141b' }}>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setIsCreateRFQCollapsed(!isCreateRFQCollapsed)}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New RFQ
            </div>
            {isCreateRFQCollapsed ? (
              <ChevronDown className="w-5 h-5 text-muted" />
            ) : (
              <ChevronUp className="w-5 h-5 text-muted" />
            )}
          </CardTitle>
        </CardHeader>
        {!isCreateRFQCollapsed && (
          <CardContent>
            <MultiLegRFQ />
          </CardContent>
        )}
      </Card>

      {/* RFQ Forms with Flight Trackers - Collapsible */}
      <Card className="animate-fade-in-up border-slate-700" style={{ backgroundColor: '#0e141b' }}>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setIsRFQFormsCollapsed(!isRFQFormsCollapsed)}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5" />
              RFQ Forms with Flight Trackers
            </div>
            {isRFQFormsCollapsed ? (
              <ChevronDown className="w-5 h-5 text-muted" />
            ) : (
              <ChevronUp className="w-5 h-5 text-muted" />
            )}
          </CardTitle>
        </CardHeader>
        {!isRFQFormsCollapsed && (
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted">Flight tracking forms and templates will be available here.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Standard RFQ Form</h4>
                  <p className="text-sm text-muted">Basic flight request template</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Multi-Leg RFQ Form</h4>
                  <p className="text-sm text-muted">Complex routing template</p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="space-y-4">
        {rfqs.map(rfq => (
          <Card key={rfq.id} className="hover:opacity-80 animate-fade-in-up border-slate-700" style={{backgroundColor: '#0e141b', animationDelay: `${(rfq.id || 0) * 0.1}s`}}>
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            alert(`🔍 Compare Quote\n\nOperator: ${quote.operator}\nPrice: $${quote.price.toLocaleString()}\nRating: ${quote.rating}/5\nResponse Time: ${quote.responseTime}m\n\n✅ Comparison feature coming soon!`);
                          }}
                        >
                          <GitCompare className="w-4 h-4 mr-2" />
                          Compare
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const savedQuote = {
                              id: quote.id,
                              operator: quote.operator,
                              price: quote.price,
                              savedAt: new Date().toISOString()
                            };
                            localStorage.setItem(`saved_quote_${quote.id}`, JSON.stringify(savedQuote));
                            alert(`💾 Quote Saved!\n\nOperator: ${quote.operator}\nPrice: $${quote.price.toLocaleString()}\n\n✅ Quote saved to your favorites!`);
                          }}
                        >
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
      <Card className="border-slate-700" style={{ backgroundColor: '#0e141b' }}>
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
              <Card key={i} className="p-4 hover:opacity-80 transition-all border-slate-700" style={{ backgroundColor: '#0e141b' }}>
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
                    <span>Sep 20, 2025</span>
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Billing & Analytics</h2>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowContractGenerator(true)}
            className="bg-terminal-accent hover:bg-terminal-accent/90"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Contract
          </Button>
          <Button 
            onClick={() => setShowReceiptGenerator(true)}
            className="bg-terminal-accent hover:bg-terminal-accent/90"
          >
            <Receipt className="w-4 h-4 mr-2" />
            Generate Receipt
          </Button>
        </div>
      </div>
      <MonthlyStatements />
    </div>
  );

  const renderTrophyRoom = () => (
    <div className="space-y-6">
      <Card className="border-slate-700" style={{ backgroundColor: '#0e141b' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            Your Achievements
          </CardTitle>
          <CardDescription>
            Track your progress and unlock new achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-accent" />
                <span className="font-semibold">First Deal</span>
              </div>
              <p className="text-sm text-muted-foreground">Complete your first successful transaction</p>
              <Badge className="mt-2 bg-green-500">Completed</Badge>
            </div>
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-accent" />
                <span className="font-semibold">Top Performer</span>
              </div>
              <p className="text-sm text-muted-foreground">Achieve top 10% performance rating</p>
              <Badge className="mt-2 bg-yellow-500">In Progress</Badge>
            </div>
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-accent" />
                <span className="font-semibold">Client Satisfaction</span>
              </div>
              <p className="text-sm text-muted-foreground">Maintain 95%+ client satisfaction</p>
              <Badge className="mt-2 bg-blue-500">In Progress</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      {activeTab === 'dashboard' && (
        <ModernHelpGuide 
          terminalType="broker" 
          activeTab={activeTab} 
          showOnMount={true} 
          isDemo={true}
        />
      )}
      <div className="min-h-screen relative overflow-hidden scroll-smooth z-0">
        {/* Cinematic Burnt Orange to Obsidian Gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
          }}
        />
        
        {/* Cinematic Vignette - Creates spotlight effect on center */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.3) 80%, rgba(0, 0, 0, 0.6) 100%)',
          }}
        />
        
        {/* Subtle golden-orange glow in the center */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at center, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.04) 30%, transparent 60%)',
          }}
        />
        
        {/* Subtle grid pattern overlay - more refined */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgTCAwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] opacity-30"></div>
        </div>
        
        <header className="relative z-50 sticky top-0 backdrop-blur-modern border-b border-terminal-border bg-slate-800">
        <div className="w-full px-6 py-3 flex items-center justify-between">
          {/* Logo and Alerts */}
          <div className="flex items-center gap-4 relative">
            <StratusConnectLogo className="text-xl" />
            {alerts.length > 0 && (
              <div className="relative z-[100]">
                <button
                  onClick={() => {
                    console.log('Bell clicked, current state:', showAlertsDropdown);
                    setShowAlertsDropdown(!showAlertsDropdown);
                  }}
                  className="relative p-2 rounded-full hover:bg-slate-700/50 transition-colors"
                >
                  <Bell className="w-5 h-5 text-accent" />
                  {alerts.filter(a => a.unread).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {alerts.filter(a => a.unread).length}
                    </span>
                  )}
                </button>
                
                {/* Alerts Dropdown */}
                {showAlertsDropdown && (
                  <div 
                    ref={alertsDropdownRef}
                    className="absolute top-full left-0 mt-2 w-72 border border-slate-600 rounded-lg shadow-2xl"
                    style={{ 
                      backgroundColor: '#362620', 
                      zIndex: 999999,
                      position: 'absolute',
                      isolation: 'isolate'
                    }}
                  >
                    <div className="p-2 border-b border-slate-500/40">
                      <h3 className="text-xs font-semibold text-white">Live Alerts</h3>
                      <p className="text-xs text-slate-300">{alerts.filter(a => a.unread).length} unread</p>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {alerts.map(alert => (
                        <button
                          key={alert.id}
                          onClick={() => handleAlertClick(alert)}
                          className={`w-full p-2 text-left hover:bg-slate-700/40 transition-colors border-b border-slate-500/30 last:border-b-0 ${
                            alert.unread ? 'bg-slate-700/20' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 mt-0.5">
                              {alert.type === 'price_drop' ? (
                                <TrendingUp className="w-3 h-3 text-accent" />
                              ) : alert.type === 'last_minute' ? (
                                <Clock className="w-3 h-3 text-accent" />
                              ) : (
                                <Bell className="w-3 h-3 text-accent" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1 mb-0.5">
                                <h4 className="text-xs font-medium text-white truncate">{alert.title}</h4>
                                {alert.unread && (
                                  <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></span>
                                )}
                              </div>
                              <p className="text-xs text-slate-300 mb-0.5 truncate">{alert.message}</p>
                              <p className="text-xs text-slate-400">{new Date(alert.time).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-slate-500/40 flex justify-between items-center">
                      <button
                        onClick={() => {
                          console.log('Mark all as read clicked');
                          setAlerts(prev => prev.map(alert => ({ ...alert, unread: false })));
                        }}
                        className="text-xs text-slate-300 hover:text-white transition-colors"
                      >
                        Mark all read
                      </button>
                      <button
                        onClick={() => {
                          console.log('Close dropdown clicked');
                          setShowAlertsDropdown(false);
                        }}
                        className="text-xs text-slate-300 hover:text-white transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Middle space cleared for future content */}
          <div className="flex-1"></div>
          
          {/* Tutorial button at absolute right corner */}
          <div className="flex items-center">
            <Button
              onClick={() => window.location.href = '/tutorial/broker'}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Tutorial
            </Button>
          </div>
        </div>
      </header>

        <main className="relative z-10 max-w-7xl mx-auto p-6 space-y-6 overflow-y-auto scroll-smooth">


        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-terminal-border scrollbar-track-transparent pb-2">
            <TabsList className="flex w-max min-w-full justify-start space-x-1 backdrop-blur-sm" style={{ backgroundColor: 'hsla(0, 0%, 5%, 0.9)' }}>
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
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4 icon-glow" />
              Notes
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
            <TabsTrigger value="trophy" className="flex items-center gap-2">
              <Trophy className="w-4 h-4 icon-glow" />
              Trophy
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 icon-glow" />
              Job Board
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="w-4 h-4 icon-glow" />
              Community
            </TabsTrigger>
            <TabsTrigger value="saved-crews" className="flex items-center gap-2">
              <Star className="w-4 h-4 icon-glow" />
              Saved Crews
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4 icon-glow" />
              Documents
            </TabsTrigger>
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
          </div>

          <TabsContent value="dashboard" className="mt-6 scroll-smooth">
            {renderDashboard()}
          </TabsContent>
          <TabsContent value="rfqs" className="mt-6 scroll-smooth">
            {renderRFQs()}
          </TabsContent>
          <TabsContent value="marketplace" className="mt-6 scroll-smooth">
            {renderMarketplace()}
          </TabsContent>
          <TabsContent value="searches" className="mt-6 scroll-smooth">
            {renderSavedSearches()}
          </TabsContent>
          <TabsContent value="reputation" className="mt-6 scroll-smooth">
            {renderReputation()}
          </TabsContent>
          <TabsContent value="billing" className="mt-6 scroll-smooth">
            {renderBilling()}
          </TabsContent>
          <TabsContent value="scoreboard" className="mt-6 scroll-smooth">
            <WeekOneScoreboard />
          </TabsContent>
          <TabsContent value="warroom" className="mt-6 scroll-smooth">
            <Card className="border-slate-700" style={{ backgroundColor: '#0e141b' }}>
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
          

          <TabsContent value="notes" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Note Taking System</h2>
                <Button className="btn-terminal-accent">
                  <Plus className="w-4 h-4 mr-2" />
                  New Note
                </Button>
              </div>
              <NoteTakingSystem terminalType="broker" />
            </div>
          </TabsContent>

          <TabsContent value="trophy" className="mt-6 scroll-smooth">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Trophy Room</h2>
                <Button className="btn-terminal-accent">
                  <Trophy className="w-4 h-4 mr-2" />
                  View Achievements
                </Button>
              </div>
              {renderTrophyRoom()}
              
              {/* League Status Card */}
              <Card className="border-accent border-2" style={{ backgroundColor: '#0e141b' }}>
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
              <Card className="border-slate-700" style={{ backgroundColor: '#0e141b' }}>
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
              <Card className="border-slate-700" style={{ backgroundColor: '#0e141b' }}>
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
          <TabsContent value="jobs" className="mt-6 scroll-smooth">
            <JobBoard userRole="broker" />
          </TabsContent>
          <TabsContent value="community" className="mt-6 scroll-smooth">
            <CommunityForums userRole="broker" />
          </TabsContent>
          <TabsContent value="saved-crews" className="mt-6 scroll-smooth">
            <SavedCrews brokerId="demo-broker-1" />
          </TabsContent>
          <TabsContent value="documents" className="mt-6 scroll-smooth">
            <DocumentStorage userRole="broker" />
          </TabsContent>

          <TabsContent value="flight-tracking" className="mt-6 scroll-smooth">
            <RealTimeFlightTracker terminalType="broker" />
          </TabsContent>

          <TabsContent value="advanced-search" className="mt-6 scroll-smooth">
            <AdvancedSearch terminalType="broker" onResults={(results) => console.log('Search results:', results)} />
          </TabsContent>

          <TabsContent value="communication" className="mt-6 scroll-smooth">
            <CommunicationTools terminalType="broker" />
          </TabsContent>
        </Tabs>

        {/* Demo Notice */}
        {isDemoMode && (
          <div className="mt-8 p-4 border border-slate-700 rounded-lg" style={{ backgroundColor: '#0e141b' }}>
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
          </div>
        )}
        </main>
      </div>
      
      {/* Scroll to Top Button */}
      <Button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-accent/80 hover:bg-accent rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-sm border border-accent/30"
        title="Scroll to Top"
      >
        <ArrowUp className="w-6 h-6 text-white" />
      </Button>
      
      {/* Contract Generator Modal */}
      {showContractGenerator && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-terminal-bg border border-terminal-border rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <ContractGenerator 
              dealId="demo-deal-1" 
              onClose={() => setShowContractGenerator(false)} 
            />
          </div>
        </div>
      )}

      {/* Receipt Generator Modal */}
      {showReceiptGenerator && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-terminal-bg border border-terminal-border rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <ReceiptGenerator 
              dealId="demo-deal-1" 
              onClose={() => setShowReceiptGenerator(false)} 
            />
          </div>
        </div>
      )}

      {/* Intelligent AI Chatbot */}
    </>
  );
}