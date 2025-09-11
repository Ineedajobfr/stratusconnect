import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DollarSign, 
  Plane, 
  Users, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  TrendingUp,
  Clock,
  BarChart3
} from 'lucide-react';

interface RFQ {
  id: string;
  route: string;
  aircraft: string;
  date: string;
  price: number;
  currency: string;
  status: 'draft' | 'sent' | 'quoted' | 'accepted' | 'paid';
  quotes: Quote[];
}

interface Quote {
  id: string;
  operator: string;
  price: number;
  currency: string;
  validUntil: string;
  aircraft: string;
  verified: boolean;
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
      quotes: [
        {
          id: 'Q-001',
          operator: 'Elite Aviation',
          price: 45000,
          currency: 'USD',
          validUntil: '2024-01-18T23:59:59Z',
          aircraft: 'Gulfstream G650',
          verified: true
        },
        {
          id: 'Q-002',
          operator: 'SkyHigh Jets',
          price: 48000,
          currency: 'USD',
          validUntil: '2024-01-19T12:00:00Z',
          aircraft: 'Gulfstream G650',
          verified: true
        }
      ]
    }
  ]);

  const [newRfq, setNewRfq] = useState({
    route: '',
    aircraft: '',
    date: '',
    price: '',
    currency: 'USD'
  });

  const isDemoMode = import.meta.env.VITE_SC_DEMO_MODE === 'true';

  const createPaymentIntent = (rfq: RFQ, quote: Quote) => {
    const platformFee = Math.round(quote.price * 0.07);
    const netToOperator = quote.price - platformFee;
    
    alert(`Payment Intent Created\n\n` +
      `Route: ${rfq.route}\n` +
      `Aircraft: ${quote.aircraft}\n` +
      `Operator: ${quote.operator}\n` +
      `Total Price: $${quote.price.toLocaleString()}\n` +
      `Platform Fee (7%): $${platformFee.toLocaleString()}\n` +
      `Net to Operator: $${netToOperator.toLocaleString()}\n\n` +
      `In production, this would redirect to Stripe Connect for FCA compliant payment processing.`);
  };

  const generateReceipt = (rfq: RFQ, quote: Quote) => {
    const platformFee = Math.round(quote.price * 0.07);
    const netToOperator = quote.price - platformFee;
    const auditHash = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const receipt = {
      transactionId: `TXN_${Date.now()}`,
      timestamp: new Date().toISOString(),
      broker: 'Demo Broker',
      operator: quote.operator,
      route: rfq.route,
      aircraft: quote.aircraft,
      totalPrice: quote.price,
      platformFee: platformFee,
      netToOperator: netToOperator,
      currency: quote.currency,
      auditHash: auditHash,
      status: 'completed'
    };

    const receiptData = JSON.stringify(receipt, null, 2);
    const blob = new Blob([receiptData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${receipt.transactionId}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`Receipt generated with audit hash: ${auditHash}`);
  };

  const createRFQ = () => {
    if (!newRfq.route || !newRfq.aircraft || !newRfq.date || !newRfq.price) {
      alert('Please fill in all fields');
      return;
    }

    const rfq: RFQ = {
      id: `RFQ-${Date.now()}`,
      route: newRfq.route,
      aircraft: newRfq.aircraft,
      date: newRfq.date,
      price: parseInt(newRfq.price),
      currency: newRfq.currency,
      status: 'sent',
      quotes: []
    };

    setRfqs(prev => [...prev, rfq]);
    setNewRfq({ route: '', aircraft: '', date: '', price: '', currency: 'USD' });
    alert('RFQ created and sent to operators');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Active RFQs</p>
                <p className="text-2xl font-bold text-foreground">{rfqs.length}</p>
              </div>
              <FileText className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Quotes Received</p>
                <p className="text-2xl font-bold text-foreground">
                  {rfqs.reduce((sum, rfq) => sum + rfq.quotes.length, 0)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Deals Closed</p>
                <p className="text-2xl font-bold text-foreground">
                  {rfqs.filter(rfq => rfq.status === 'paid').length}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gunmetal">Avg Response Time</p>
                <p className="text-2xl font-bold text-foreground">2.3m</p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

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
              <div key={rfq.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{rfq.route}</p>
                  <p className="text-sm text-gunmetal">{rfq.aircraft} • {rfq.quotes.length} quotes</p>
                </div>
                <Badge className={
                  rfq.status === 'paid' ? 'bg-green-100 text-green-800' :
                  rfq.status === 'quoted' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }>
                  {rfq.status}
                </Badge>
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
          <CardTitle>Create New RFQ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="route">Route</Label>
              <Input
                id="route"
                placeholder="e.g., London - New York"
                value={newRfq.route}
                onChange={(e) => setNewRfq(prev => ({ ...prev, route: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="aircraft">Aircraft Type</Label>
              <Input
                id="aircraft"
                placeholder="e.g., Gulfstream G650"
                value={newRfq.aircraft}
                onChange={(e) => setNewRfq(prev => ({ ...prev, aircraft: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newRfq.date}
                onChange={(e) => setNewRfq(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="price">Budget</Label>
              <Input
                id="price"
                type="number"
                placeholder="45000"
                value={newRfq.price}
                onChange={(e) => setNewRfq(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
          </div>
          <Button onClick={createRFQ} className="mt-4 btn-terminal-accent">
            Create RFQ
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {rfqs.map(rfq => (
          <Card key={rfq.id} className="terminal-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="w-5 h-5" />
                    {rfq.route}
                  </CardTitle>
                  <p className="text-gunmetal">{rfq.aircraft} • {rfq.date}</p>
                </div>
                <Badge className={
                  rfq.status === 'paid' ? 'bg-green-100 text-green-800' :
                  rfq.status === 'quoted' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }>
                  {rfq.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {rfq.quotes.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-semibold">Quotes Received</h4>
                  {rfq.quotes.map(quote => (
                    <div key={quote.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{quote.operator}</p>
                          <p className="text-sm text-gunmetal">{quote.aircraft}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">${quote.price.toLocaleString()}</p>
                          <p className="text-sm text-gunmetal">Valid until: {new Date(quote.validUntil).toLocaleDateString()}</p>
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
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gunmetal">No quotes received yet</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-terminal-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Broker Terminal</h1>
            <p className="text-gunmetal">FCA Compliant Trading Floor</p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-green-100 text-green-800">
              <Shield className="w-3 h-3 mr-1" />
              FCA Compliant
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
                <h3 className="font-medium text-green-800">Fee Structure</h3>
                <p className="text-green-700 text-sm mt-1">
                  7% platform commission on all broker-operator deals. Fees are automatically calculated and deducted by Stripe Connect. 
                  No custody of client funds. All transactions are FCA compliant.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setActiveTab('dashboard')}
            variant={activeTab === 'dashboard' ? 'default' : 'outline'}
          >
            Dashboard
          </Button>
          <Button
            onClick={() => setActiveTab('rfqs')}
            variant={activeTab === 'rfqs' ? 'default' : 'outline'}
          >
            RFQs & Quotes
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' ? renderDashboard() : renderRFQs()}

        {/* Demo Notice */}
        {isDemoMode && (
          <Card className="mt-8 bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Demo Mode</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    This terminal demonstrates FCA compliant payment processing with Stripe Connect. 
                    In production, all payments would be processed through regulated payment rails.
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