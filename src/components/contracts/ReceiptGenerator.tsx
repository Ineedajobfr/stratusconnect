import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Receipt, 
  Download, 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  Calendar,
  Users,
  Plane,
  Briefcase,
  AlertTriangle,
  Plus,
  Save,
  Send,
  FileText,
  CreditCard,
  Banknote
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Deal {
  id: string;
  title: string;
  broker_id: string;
  operator_id: string;
  pilot_id?: string;
  crew_id?: string;
  aircraft_id: string;
  status: string;
  total_amount: number;
  broker_commission: number;
  operator_amount: number;
  pilot_amount?: number;
  crew_amount?: number;
  start_date: string;
  end_date: string;
  broker: {
    name: string;
    company: string;
    email: string;
  };
  operator: {
    name: string;
    company: string;
    email: string;
  };
  pilot?: {
    name: string;
    email: string;
    hourly_rate: number;
  };
  crew?: {
    name: string;
    email: string;
    role: string;
    hourly_rate: number;
  };
  aircraft: {
    make: string;
    model: string;
    registration: string;
  };
}

interface ReceiptData {
  id: string;
  deal_id: string;
  receipt_number: string;
  receipt_type: 'payment' | 'commission' | 'refund' | 'adjustment' | 'final_settlement';
  payer_id: string;
  payee_id: string;
  amount: number;
  currency: string;
  description: string;
  breakdown: {
    base_amount: number;
    commission: number;
    fees: number;
    taxes: number;
    total: number;
  };
  payment_method: string;
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  pdf_url?: string;
  created_at: string;
  updated_at: string;
  payer: {
    name: string;
    company: string;
    email: string;
  };
  payee: {
    name: string;
    company: string;
    email: string;
  };
}

interface ReceiptGeneratorProps {
  dealId: string;
  onClose: () => void;
}

export default function ReceiptGenerator({ dealId, onClose }: ReceiptGeneratorProps) {
  const { user } = useAuth();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceiptType, setSelectedReceiptType] = useState<'payment' | 'commission' | 'refund' | 'adjustment' | 'final_settlement'>('payment');
  const [receiptData, setReceiptData] = useState({
    payer_id: '',
    payee_id: '',
    amount: 0,
    description: '',
    breakdown: {
      base_amount: 0,
      commission: 0,
      fees: 0,
      taxes: 0,
      total: 0
    },
    payment_method: 'bank_transfer',
    transaction_id: ''
  });
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockDeal: Deal = {
      id: dealId,
      title: 'Gulfstream G650 Charter - NYC to LAX',
      broker_id: 'broker-1',
      operator_id: 'operator-1',
      pilot_id: 'pilot-1',
      crew_id: 'crew-1',
      aircraft_id: 'aircraft-1',
      status: 'completed',
      total_amount: 50000,
      broker_commission: 5000,
      operator_amount: 45000,
      pilot_amount: 3000,
      crew_amount: 2000,
      start_date: '2024-02-01',
      end_date: '2024-02-05',
      broker: {
        name: 'John Broker',
        company: 'Elite Aviation Brokers',
        email: 'john@eliteaviation.com'
      },
      operator: {
        name: 'Sarah Operator',
        company: 'SkyHigh Operations',
        email: 'sarah@skyhigh.com'
      },
      pilot: {
        name: 'Captain Mike Smith',
        email: 'mike@skyhigh.com',
        hourly_rate: 150
      },
      crew: {
        name: 'Maria Rodriguez',
        email: 'maria@skyhigh.com',
        role: 'Flight Attendant',
        hourly_rate: 50
      },
      aircraft: {
        make: 'Gulfstream',
        model: 'G650',
        registration: 'N123AB'
      }
    };

    const mockReceipts: ReceiptData[] = [
      {
        id: '1',
        deal_id: dealId,
        receipt_number: 'RECEIPT-2024-000001',
        receipt_type: 'commission',
        payer_id: 'operator-1',
        payee_id: 'broker-1',
        amount: 5000,
        currency: 'USD',
        description: 'Broker commission for Gulfstream G650 charter',
        breakdown: {
          base_amount: 50000,
          commission: 5000,
          fees: 0,
          taxes: 0,
          total: 5000
        },
        payment_method: 'bank_transfer',
        transaction_id: 'TXN-123456789',
        status: 'completed',
        pdf_url: '/documents/receipts/receipt-2024-000001.pdf',
        created_at: '2024-01-25T14:30:00Z',
        updated_at: '2024-01-25T14:30:00Z',
        payer: {
          name: 'Sarah Operator',
          company: 'SkyHigh Operations',
          email: 'sarah@skyhigh.com'
        },
        payee: {
          name: 'John Broker',
          company: 'Elite Aviation Brokers',
          email: 'john@eliteaviation.com'
        }
      },
      {
        id: '2',
        deal_id: dealId,
        receipt_number: 'RECEIPT-2024-000002',
        receipt_type: 'payment',
        payer_id: 'broker-1',
        payee_id: 'pilot-1',
        amount: 3000,
        currency: 'USD',
        description: 'Pilot payment for Gulfstream G650 charter',
        breakdown: {
          base_amount: 3000,
          commission: 0,
          fees: 0,
          taxes: 0,
          total: 3000
        },
        payment_method: 'bank_transfer',
        transaction_id: 'TXN-123456790',
        status: 'completed',
        pdf_url: '/documents/receipts/receipt-2024-000002.pdf',
        created_at: '2024-01-26T10:15:00Z',
        updated_at: '2024-01-26T10:15:00Z',
        payer: {
          name: 'John Broker',
          company: 'Elite Aviation Brokers',
          email: 'john@eliteaviation.com'
        },
        payee: {
          name: 'Captain Mike Smith',
          company: 'SkyHigh Operations',
          email: 'mike@skyhigh.com'
        }
      }
    ];

    setDeal(mockDeal);
    setReceipts(mockReceipts);
    setLoading(false);
  }, [dealId]);

  const handleReceiptTypeChange = (type: string) => {
    setSelectedReceiptType(type as any);
    
    if (!deal) return;

    // Auto-populate based on receipt type
    switch (type) {
      case 'commission':
        setReceiptData(prev => ({
          ...prev,
          payer_id: deal.operator_id,
          payee_id: deal.broker_id,
          amount: deal.broker_commission,
          description: `Broker commission for ${deal.title}`,
          breakdown: {
            base_amount: deal.total_amount,
            commission: deal.broker_commission,
            fees: 0,
            taxes: 0,
            total: deal.broker_commission
          }
        }));
        break;
      case 'payment':
        setReceiptData(prev => ({
          ...prev,
          payer_id: deal.broker_id,
          payee_id: deal.pilot_id || deal.crew_id || '',
          amount: deal.pilot_amount || deal.crew_amount || 0,
          description: `Payment for ${deal.pilot ? 'pilot' : 'crew'} services - ${deal.title}`,
          breakdown: {
            base_amount: deal.pilot_amount || deal.crew_amount || 0,
            commission: 0,
            fees: 0,
            taxes: 0,
            total: deal.pilot_amount || deal.crew_amount || 0
          }
        }));
        break;
      default:
        setReceiptData(prev => ({
          ...prev,
          payer_id: '',
          payee_id: '',
          amount: 0,
          description: '',
          breakdown: {
            base_amount: 0,
            commission: 0,
            fees: 0,
            taxes: 0,
            total: 0
          }
        }));
    }
  };

  const handleGenerateReceipt = async () => {
    if (!deal) return;
    
    setGenerating(true);
    try {
      // TODO: Implement actual API call
      console.log('Generating receipt:', { dealId, receiptType: selectedReceiptType, receiptData });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      alert('Receipt generated successfully!');
      onClose();
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Error generating receipt. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReceipt = async (receiptId: string) => {
    // TODO: Implement actual PDF download
    console.log('Downloading receipt:', receiptId);
  };

  const handleViewReceipt = (receiptId: string) => {
    // TODO: Implement receipt viewer
    console.log('Viewing receipt:', receiptId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'completed': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'failed': return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'cancelled': return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
      case 'refunded': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default: return 'bg-terminal-muted text-terminal-fg';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'refunded': return <CheckCircle className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  const getReceiptTypeIcon = (type: string) => {
    switch (type) {
      case 'payment': return <DollarSign className="h-4 w-4" />;
      case 'commission': return <Briefcase className="h-4 w-4" />;
      case 'refund': return <CreditCard className="h-4 w-4" />;
      case 'adjustment': return <Edit className="h-4 w-4" />;
      case 'final_settlement': return <FileText className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terminal-accent"></div>
      </div>
    );
  }

  if (!deal) {
    return (
      <Alert className="bg-terminal-bg border-terminal-border">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-terminal-fg">
          Deal not found.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-terminal-fg">Receipt Generator</h1>
          <p className="text-terminal-muted">Generate receipts for deal: {deal.title}</p>
        </div>
        <Button variant="outline" onClick={onClose} className="border-terminal-border text-terminal-fg">
          Close
        </Button>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="bg-terminal-bg border-terminal-border">
          <TabsTrigger value="generate" className="data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg">
            <Receipt className="h-4 w-4 mr-2" />
            Generate Receipt
          </TabsTrigger>
          <TabsTrigger value="existing" className="data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg">
            <FileText className="h-4 w-4 mr-2" />
            Existing Receipts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Receipt Type Selection */}
          <Card className="bg-terminal-bg border-terminal-border">
            <CardHeader>
              <CardTitle className="text-terminal-fg">Select Receipt Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { type: 'commission', label: 'Broker Commission', description: 'Commission payment to broker', icon: <Briefcase className="h-6 w-6" /> },
                  { type: 'payment', label: 'Service Payment', description: 'Payment to pilot or crew', icon: <DollarSign className="h-6 w-6" /> },
                  { type: 'refund', label: 'Refund', description: 'Refund for cancelled services', icon: <CreditCard className="h-6 w-6" /> },
                  { type: 'adjustment', label: 'Adjustment', description: 'Payment adjustment', icon: <Edit className="h-6 w-6" /> },
                  { type: 'final_settlement', label: 'Final Settlement', description: 'Final settlement payment', icon: <FileText className="h-6 w-6" /> }
                ].map(({ type, label, description, icon }) => (
                  <Card 
                    key={type} 
                    className={`cursor-pointer transition-colors ${
                      selectedReceiptType === type 
                        ? 'border-terminal-accent bg-terminal-accent/10' 
                        : 'border-terminal-border hover:border-terminal-accent/50'
                    }`}
                    onClick={() => handleReceiptTypeChange(type)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        {icon}
                        <h3 className="font-semibold text-terminal-fg">{label}</h3>
                      </div>
                      <p className="text-sm text-terminal-muted">{description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Receipt Details */}
          {selectedReceiptType && (
            <Card className="bg-terminal-bg border-terminal-border">
              <CardHeader>
                <CardTitle className="text-terminal-fg">Receipt Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-terminal-fg">Payer</label>
                    <Select value={receiptData.payer_id} onValueChange={(value) => setReceiptData(prev => ({ ...prev, payer_id: value }))}>
                      <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                        <SelectValue placeholder="Select payer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={deal.broker_id}>{deal.broker.name} ({deal.broker.company})</SelectItem>
                        <SelectItem value={deal.operator_id}>{deal.operator.name} ({deal.operator.company})</SelectItem>
                        {deal.pilot && <SelectItem value={deal.pilot_id}>{deal.pilot.name}</SelectItem>}
                        {deal.crew && <SelectItem value={deal.crew_id}>{deal.crew.name}</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-terminal-fg">Payee</label>
                    <Select value={receiptData.payee_id} onValueChange={(value) => setReceiptData(prev => ({ ...prev, payee_id: value }))}>
                      <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                        <SelectValue placeholder="Select payee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={deal.broker_id}>{deal.broker.name} ({deal.broker.company})</SelectItem>
                        <SelectItem value={deal.operator_id}>{deal.operator.name} ({deal.operator.company})</SelectItem>
                        {deal.pilot && <SelectItem value={deal.pilot_id}>{deal.pilot.name}</SelectItem>}
                        {deal.crew && <SelectItem value={deal.crew_id}>{deal.crew.name}</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-terminal-fg">Amount</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={receiptData.amount}
                      onChange={(e) => setReceiptData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      className="bg-terminal-bg border-terminal-border text-terminal-fg"
                    />
                  </div>
                  
                  <div>
                    <label className="text-terminal-fg">Payment Method</label>
                    <Select value={receiptData.payment_method} onValueChange={(value) => setReceiptData(prev => ({ ...prev, payment_method: value }))}>
                      <SelectTrigger className="bg-terminal-bg border-terminal-border text-terminal-fg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-terminal-fg">Description</label>
                  <Textarea
                    value={receiptData.description}
                    onChange={(e) => setReceiptData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-terminal-bg border-terminal-border text-terminal-fg"
                    placeholder="Enter receipt description..."
                  />
                </div>

                <div>
                  <label className="text-terminal-fg">Transaction ID (Optional)</label>
                  <Input
                    value={receiptData.transaction_id}
                    onChange={(e) => setReceiptData(prev => ({ ...prev, transaction_id: e.target.value }))}
                    className="bg-terminal-bg border-terminal-border text-terminal-fg"
                    placeholder="Enter transaction ID..."
                  />
                </div>

                <div className="flex space-x-4">
                  <Button 
                    onClick={handleGenerateReceipt}
                    disabled={generating}
                    className="bg-terminal-accent hover:bg-terminal-accent/90"
                  >
                    {generating ? 'Generating...' : 'Generate Receipt'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPreview(true)}
                    className="border-terminal-border text-terminal-fg"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="existing" className="space-y-6">
          {/* Existing Receipts */}
          <Card className="bg-terminal-bg border-terminal-border">
            <CardHeader>
              <CardTitle className="text-terminal-fg">Existing Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              {receipts.length === 0 ? (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 text-terminal-muted mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-terminal-fg mb-2">No Receipts Found</h3>
                  <p className="text-terminal-muted">
                    Generate your first receipt using the form above.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receipts.map(receipt => (
                    <Card key={receipt.id} className="bg-terminal-bg border-terminal-border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center space-x-3">
                              {getReceiptTypeIcon(receipt.receipt_type)}
                              <h3 className="text-lg font-semibold text-terminal-fg">{receipt.description}</h3>
                              <Badge className={getStatusColor(receipt.status)}>
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(receipt.status)}
                                  <span>{receipt.status}</span>
                                </div>
                              </Badge>
                            </div>
                            
                            <p className="text-terminal-muted">Receipt #{receipt.receipt_number}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-terminal-muted">
                              <div>
                                <p className="font-semibold">Amount</p>
                                <p className="text-terminal-fg">{formatCurrency(receipt.amount)}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Payer</p>
                                <p>{receipt.payer.name}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Payee</p>
                                <p>{receipt.payee.name}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Created</p>
                                <p>{formatDate(receipt.created_at)}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewReceipt(receipt.id)}
                              className="border-terminal-border text-terminal-fg"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadReceipt(receipt.id)}
                              className="border-terminal-border text-terminal-fg"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
