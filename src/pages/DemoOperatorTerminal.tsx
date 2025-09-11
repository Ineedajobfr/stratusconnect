// Enhanced Demo Operator Terminal - All Features
// FCA Compliant Aviation Platform - 100% Free Until Revenue

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Building
} from 'lucide-react';
import QuoteComposer from '@/components/DealFlow/QuoteComposer';
import ReputationMetrics from '@/components/Reputation/ReputationMetrics';
import MonthlyStatements from '@/components/Billing/MonthlyStatements';

interface Quote {
  id: string;
  rfqId: string;
  broker: string;
  route: string;
  aircraft: string;
  date: string;
  price: number;
  currency: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  responseTime: number;
  dealScore: number;
  specialRequirements: string;
}

interface Hiring {
  id: string;
  pilotId: string;
  pilotName: string;
  role: string;
  salary: number;
  currency: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  kycStatus: 'pending' | 'verified' | 'rejected';
  startDate: string;
  endDate: string;
}

export default function DemoOperatorTerminal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: 'Q-001',
      rfqId: 'RFQ-001',
      broker: 'Elite Brokers Ltd',
      route: 'London - New York',
      aircraft: 'Gulfstream G650',
      date: '2024-01-20',
      price: 45000,
      currency: 'USD',
      status: 'sent',
      responseTime: 3.2,
      dealScore: 89,
      specialRequirements: 'VIP handling, customs clearance'
    },
    {
      id: 'Q-002',
      rfqId: 'RFQ-002',
      broker: 'SkyHigh Brokers',
      route: 'Paris - Dubai',
      aircraft: 'Global 6000',
      date: '2024-01-25',
      price: 32000,
      currency: 'EUR',
      status: 'accepted',
      responseTime: 2.1,
      dealScore: 94,
      specialRequirements: 'Catering for dietary restrictions'
    }
  ]);

  const [hirings, setHirings] = useState<Hiring[]>([
    {
      id: 'H-001',
      pilotId: 'P-001',
      pilotName: 'Captain John Smith',
      role: 'Pilot',
      salary: 3000,
      currency: 'GBP',
      status: 'pending',
      kycStatus: 'verified',
      startDate: '2024-01-20',
      endDate: '2024-01-25'
    },
    {
      id: 'H-002',
      pilotId: 'P-002',
      pilotName: 'First Officer Sarah Johnson',
      role: 'Co-Pilot',
      salary: 2500,
      currency: 'GBP',
      status: 'accepted',
      kycStatus: 'verified',
      startDate: '2024-01-22',
      endDate: '2024-01-28'
    }
  ]);

  const [kycStatus, setKycStatus] = useState({
    verified: true,
    lastChecked: '2024-01-15T10:00:00Z',
    nextCheck: '2024-02-15T10:00:00Z',
    sanctionsClear: true
  });

  const isDemoMode = import.meta.env.VITE_SC_DEMO_MODE === 'true';

  const createHiringPayment = (hiring: Hiring) => {
    const hiringFee = Math.round(hiring.salary * 0.10); // 10% hiring fee
    const netToPilot = hiring.salary - hiringFee;
    
    if (!kycStatus.verified) {
      alert('❌ Payment Blocked\n\nKYC verification required before payouts.\nPlease complete identity verification first.');
      return;
    }

    alert(`👥 Hiring Payment Created\n\n` +
      `Pilot: ${hiring.pilotName}\n` +
      `Role: ${hiring.role}\n` +
      `Salary: £${hiring.salary.toLocaleString()}\n` +
      `Hiring Fee (10%): £${hiringFee.toLocaleString()}\n` +
      `Net to Pilot: £${netToPilot.toLocaleString()}\n\n` +
      `✅ KYC Verified\n` +
      `🔒 Stripe Connect processing\n` +
      `📋 Audit trail created`);
  };

  const generateHiringReceipt = (hiring: Hiring) => {
    const hiringFee = Math.round(hiring.salary * 0.10);
    const netToPilot = hiring.salary - hiringFee;
    const auditHash = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const receipt = {
      transactionId: `HIRING_${Date.now()}`,
      timestamp: new Date().toISOString(),
      operator: 'Demo Operator Ltd',
      pilot: hiring.pilotName,
      role: hiring.role,
      salary: hiring.salary,
      hiringFee: hiringFee,
      netToPilot: netToPilot,
      currency: hiring.currency,
      auditHash: auditHash,
      status: 'completed',
      fcaCompliant: true,
      kycVerified: kycStatus.verified
    };

    const receiptData = JSON.stringify(receipt, null, 2);
    const blob = new Blob([receiptData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hiring_receipt_${receipt.transactionId}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`📄 Hiring Receipt generated with audit hash: ${auditHash}\n\n✅ FCA compliant transaction record`);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="terminal-card hover:terminal-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Active Quotes</p>
                <p className="text-2xl font-bold text-foreground">{quotes.length}</p>
                <p className="text-xs text-green-600">+8% this week</p>
              </div>
              <FileText className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card hover:terminal-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Acceptance Rate</p>
                <p className="text-2xl font-bold text-foreground">94%</p>
                <p className="text-xs text-blue-600">Above average</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card hover:terminal-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Revenue</p>
                <p className="text-2xl font-bold text-foreground">$77K</p>
                <p className="text-xs text-purple-600">This month</p>
              </div>
              <DollarSign className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card hover:terminal-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Avg Response</p>
                <p className="text-2xl font-bold text-foreground">2.7m</p>
                <p className="text-xs text-green-600">Fast lane eligible</p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KYC Status */}
      <Card className={`terminal-card ${kycStatus.verified ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            KYC & Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              {kycStatus.verified ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <p className="font-medium">Identity Verification</p>
                <p className="text-sm text-gray-600">
                  {kycStatus.verified ? 'Verified' : 'Pending'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {kycStatus.sanctionsClear ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <p className="font-medium">Sanctions Screening</p>
                <p className="text-sm text-gray-600">
                  {kycStatus.sanctionsClear ? 'Clear' : 'Review Required'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium">Next Check</p>
                <p className="text-sm text-gray-600">
                  {new Date(kycStatus.nextCheck).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
            {quotes.slice(0, 3).map(quote => (
              <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    quote.status === 'accepted' ? 'bg-green-500' :
                    quote.status === 'sent' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="font-medium">{quote.route}</p>
                    <p className="text-sm text-gunmetal">{quote.broker} • {quote.aircraft}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {quote.status}
                  </Badge>
                  <span className="text-sm font-medium">${quote.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderQuotes = () => (
    <div className="space-y-6">
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Quote
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteComposer 
            rfqId="RFQ-001"
            operatorId="OP-001"
            route="London - New York"
            aircraft="Gulfstream G650"
            passengers={8}
            distanceNm={3000}
            departureDate="2024-01-20"
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {quotes.map(quote => (
          <Card key={quote.id} className="terminal-card hover:terminal-glow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="w-5 h-5" />
                    {quote.route}
                  </CardTitle>
                  <p className="text-gunmetal">{quote.broker} • {quote.aircraft} • {quote.date}</p>
                  {quote.specialRequirements && (
                    <p className="text-sm text-blue-600 mt-1">📋 {quote.specialRequirements}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {quote.status}
                  </Badge>
                  <span className="text-xl font-bold">${quote.price.toLocaleString()}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Deal Score</p>
                  <p className="text-lg font-semibold">{quote.dealScore}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Response Time</p>
                  <p className="text-lg font-semibold">{quote.responseTime}m</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Platform Fee (7%)</p>
                  <p className="text-lg font-semibold text-red-600">-${Math.round(quote.price * 0.07).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Net to You</p>
                  <p className="text-lg font-semibold text-green-600">${Math.round(quote.price * 0.93).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="btn-terminal-accent">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Quote
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Receipt
                </Button>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderHiring = () => (
    <div className="space-y-6">
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Pilot & Crew Hiring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pilotName">Pilot/Crew Name</Label>
              <Input id="pilotName" placeholder="Captain John Smith" />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" placeholder="Pilot, Co-Pilot, Flight Attendant" />
            </div>
            <div>
              <Label htmlFor="salary">Salary</Label>
              <Input id="salary" type="number" placeholder="3000" />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" />
            </div>
          </div>
          <Button className="mt-4 btn-terminal-accent">
            <UserPlus className="w-4 h-4 mr-2" />
            Create Hiring
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {hirings.map(hiring => (
          <Card key={hiring.id} className="terminal-card hover:terminal-glow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    {hiring.pilotName}
                  </CardTitle>
                  <p className="text-gunmetal">{hiring.role} • {hiring.startDate} to {hiring.endDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    hiring.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    hiring.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {hiring.status}
                  </Badge>
                  <span className="text-xl font-bold">£{hiring.salary.toLocaleString()}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">KYC Status</p>
                  <p className={`text-lg font-semibold ${
                    hiring.kycStatus === 'verified' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {hiring.kycStatus === 'verified' ? '✓ Verified' : '⚠ Pending'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hiring Fee (10%)</p>
                  <p className="text-lg font-semibold text-red-600">-£{Math.round(hiring.salary * 0.10).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Net to Pilot</p>
                  <p className="text-lg font-semibold text-green-600">£{Math.round(hiring.salary * 0.90).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-lg font-semibold">7 days</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => createHiringPayment(hiring)}
                  className="btn-terminal-accent"
                  disabled={hiring.kycStatus !== 'verified'}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Process Payment
                </Button>
                <Button 
                  onClick={() => generateHiringReceipt(hiring)}
                  variant="outline"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Receipt
                </Button>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReputation = () => (
    <div className="space-y-6">
      <ReputationMetrics userId="operator_001" userType="operator" />
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
            <h1 className="text-3xl font-bold text-foreground">Operator Terminal</h1>
            <p className="text-gunmetal">FCA Compliant Operations • 100% Free Until Revenue</p>
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
                  <strong>7% platform commission</strong> on all charter deals. 
                  <strong>10% hiring fee</strong> on pilot/crew hires. 
                  All fees automatically calculated and deducted by Stripe Connect. 
                  <strong>No monthly costs</strong> - only pay when you make money.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Quotes
            </TabsTrigger>
            <TabsTrigger value="hiring" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Hiring
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
          <TabsContent value="quotes" className="mt-6">
            {renderQuotes()}
          </TabsContent>
          <TabsContent value="hiring" className="mt-6">
            {renderHiring()}
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
}