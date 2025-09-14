import { getErrorMessage } from '@/utils/errorHandler';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Shield, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Eye,
  RefreshCw,
  CreditCard,
  Building,
  User
} from 'lucide-react';
import { 
  stripeConnect, 
  PaymentIntent, 
  StripeAccount 
} from '@/lib/stripe-connect';
import { kycScreening } from '@/lib/kyc-aml';
import { useToast } from '@/hooks/use-toast';

interface CompliantEscrowManagementProps {
  dealId?: string;
  userRole: 'broker' | 'operator' | 'admin';
  userId: string;
}

export default function CompliantEscrowManagement({ 
  dealId, 
  userRole, 
  userId 
}: CompliantEscrowManagementProps) {
  const [paymentIntents, setPaymentIntents] = useState<PaymentIntent[]>([]);
  const [stripeAccounts, setStripeAccounts] = useState<StripeAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntent, setSelectedIntent] = useState<PaymentIntent | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [kycStatus, setKycStatus] = useState<any>(null);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load KYC status
      const kyc = kycScreening.getKYCStatus(userId);
      setKycStatus(kyc);
      
      // Load payment intents (in production, this would come from API)
      const intents = await loadPaymentIntents();
      setPaymentIntents(intents);
      
      // Load Stripe accounts (in production, this would come from API)
      const accounts = await loadStripeAccounts();
      setStripeAccounts(accounts);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load escrow data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadPaymentIntents = async (): Promise<PaymentIntent[]> => {
    // In production, this would fetch from your API
    return [];
  };

  const loadStripeAccounts = async (): Promise<StripeAccount[]> => {
    // In production, this would fetch from your API
    return [];
  };

  const createBrokerOperatorPayment = async (formData: FormData) => {
    try {
      const amount = parseFloat(formData.get('amount') as string);
      const currency = formData.get('currency') as string;
      const operatorAccountId = formData.get('operatorAccountId') as string;
      const description = formData.get('description') as string;

      // Check if operator can receive payouts
      const canReceivePayouts = kycScreening.canReceivePayouts(operatorAccountId);
      if (!canReceivePayouts) {
        toast({
          title: "Payment Blocked",
          description: "Operator must complete KYC verification before receiving payouts",
          variant: "destructive"
        });
        return;
      }

      // Create payment intent
      const paymentIntent = await stripeConnect.createBrokerOperatorPayment({
        dealId: dealId || crypto.randomUUID(),
        amount: amount * 100, // Convert to cents
        currency: currency.toLowerCase(),
        brokerAccountId: userId, // Current user's account
        operatorAccountId,
        description,
      });

      toast({
        title: "Payment Intent Created",
        description: `Payment intent created for ${currency} ${amount}`,
      });

      setShowCreateDialog(false);
      loadData();
    } catch (error: unknown) {
      console.error('Error creating payment intent:', error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive"
      });
    }
  };

  const createHiringPayment = async (formData: FormData) => {
    try {
      const amount = parseFloat(formData.get('amount') as string);
      const currency = formData.get('currency') as string;
      const pilotAccountId = formData.get('pilotAccountId') as string;
      const description = formData.get('description') as string;

      // Check if pilot can receive payouts
      const canReceivePayouts = kycScreening.canReceivePayouts(pilotAccountId);
      if (!canReceivePayouts) {
        toast({
          title: "Payment Blocked",
          description: "Pilot must complete KYC verification before receiving payouts",
          variant: "destructive"
        });
        return;
      }

      // Create hiring payment
      const paymentIntent = await stripeConnect.createHiringPayment({
        dealId: dealId || crypto.randomUUID(),
        amount: amount * 100, // Convert to cents
        currency: currency.toLowerCase(),
        operatorAccountId: userId, // Current user's account
        pilotAccountId,
        description,
      });

      toast({
        title: "Hiring Payment Created",
        description: `Hiring payment created for ${currency} ${amount}`,
      });

      setShowCreateDialog(false);
      loadData();
    } catch (error: unknown) {
      console.error('Error creating hiring payment:', error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive"
      });
    }
  };

  const processPayment = async (paymentIntentId: string) => {
    try {
      // In production, this would redirect to Stripe Checkout or use Stripe Elements
      toast({
        title: "Payment Processing",
        description: "Redirecting to secure payment processing...",
      });
    } catch (error: unknown) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'requires_payment_method':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'requires_confirmation':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'requires_action':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'succeeded':
        return <CheckCircle className="w-4 h-4 text-white" />;
      case 'canceled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requires_payment_method':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30';
      case 'requires_confirmation':
        return 'bg-orange-900/20 text-orange-400 border-orange-500/30';
      case 'requires_action':
        return 'bg-orange-900/20 text-orange-400 border-orange-500/30';
      case 'processing':
        return 'bg-blue-900/20 text-blue-400 border-blue-500/30';
      case 'succeeded':
        return 'bg-green-900/20 text-green-400 border-green-500/30';
      case 'canceled':
        return 'bg-red-900/20 text-red-400 border-red-500/30';
      default:
        return 'bg-purple-900/30 text-purple-200';
    }
  };

  const getFeeStructure = () => {
    return stripeConnect.getFeeStructure();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading escrow data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Compliant Escrow Management</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="btn-terminal-accent"
            disabled={!kycStatus || kycStatus.status !== 'verified'}
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Create Payment
          </Button>
          <Button
            onClick={loadData}
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Compliance Notice */}
      <Card className="bg-slate-800 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-white mt-0.5" />
            <div>
              <h3 className="font-medium text-white">FCA Compliant Payments</h3>
              <p className="text-white text-sm mt-1">
                All payments are processed through Stripe Connect. Stratus Connect never holds client funds. 
                Our platform fee is automatically deducted by Stripe during processing. All transactions are 
                safeguarded and compliant with FCA regulations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Status */}
      {kycStatus && (
        <Card className={kycStatus.status === 'verified' ? 'bg-slate-800 border-green-200' : 'bg-slate-800 border-yellow-200'}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-white mt-0.5" />
              <div>
                <h3 className="font-medium text-white">KYC Status</h3>
                <p className="text-white text-sm mt-1">
                  {kycStatus.status === 'verified' 
                    ? 'Identity verified. You can send and receive payments.'
                    : 'Identity verification required before processing payments.'
                  }
                </p>
                {kycStatus.status !== 'verified' && (
                  <Button size="sm" className="mt-2">
                    Complete Verification
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fee Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Fee Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-800 rounded-lg">
              <Building className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold text-foreground">Broker-Operator</h3>
              <p className="text-2xl font-bold text-blue-600">
                {getFeeStructure().brokerOperatorCommission}%
              </p>
              <p className="text-sm text-gunmetal">Platform commission</p>
            </div>
            <div className="text-center p-4 bg-slate-800 rounded-lg">
              <User className="w-8 h-8 mx-auto mb-2 text-white" />
              <h3 className="font-semibold text-foreground">Operator Hiring</h3>
              <p className="text-2xl font-bold text-white">
                {getFeeStructure().operatorHiringFee}%
              </p>
              <p className="text-sm text-gunmetal">Hiring fee</p>
            </div>
            <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-700">
              <User className="w-8 h-8 mx-auto mb-2 text-white/70" />
              <h3 className="font-semibold text-white">Pilots & Crew</h3>
              <p className="text-2xl font-bold text-white">
                {getFeeStructure().pilotCrewFee}%
              </p>
              <p className="text-sm text-white/70">Always free</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Intents List */}
      <div className="space-y-4">
        {paymentIntents.map((intent) => (
          <Card key={intent.id} className="terminal-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    {getStatusIcon(intent.status)}
                    Payment Intent #{intent.id.slice(-8)}
                  </CardTitle>
                  <p className="text-gunmetal text-sm mt-1">
                    Deal ID: {intent.dealId}
                  </p>
                </div>
                <Badge className={getStatusColor(intent.status)}>
                  {intent.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Amount</Label>
                  <p className="text-foreground font-mono">
                    {intent.currency.toUpperCase()} {(intent.amount / 100).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Platform Fee</Label>
                  <p className="text-foreground font-mono">
                    {intent.currency.toUpperCase()} {(intent.applicationFeeAmount / 100).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Net Amount</Label>
                  <p className="text-foreground font-mono">
                    {intent.currency.toUpperCase()} {((intent.amount - intent.applicationFeeAmount) / 100).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Created</Label>
                  <p className="text-foreground text-sm">
                    {new Date(intent.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedIntent(intent)}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                
                {intent.status === 'requires_payment_method' && (
                  <Button
                    onClick={() => processPayment(intent.id)}
                    size="sm"
                    className="btn-terminal-accent"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay Now
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {paymentIntents.length === 0 && (
        <Card className="terminal-card">
          <CardContent className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-accent opacity-60" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Payment Intents
            </h3>
            <p className="text-gunmetal mb-4">
              Create a payment intent to process a transaction through Stripe Connect
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="btn-terminal-accent"
              disabled={!kycStatus || kycStatus.status !== 'verified'}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Create First Payment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Payment Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Payment Intent</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            if (userRole === 'operator') {
              createHiringPayment(formData);
            } else {
              createBrokerOperatorPayment(formData);
            }
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select name="currency" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gbp">GBP</SelectItem>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="operatorAccountId">
                {userRole === 'operator' ? 'Pilot Account ID' : 'Operator Account ID'}
              </Label>
              <Input
                id="operatorAccountId"
                name="operatorAccountId"
                required
                placeholder="Enter account ID"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="Describe the transaction..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="btn-terminal-accent">
                Create Payment Intent
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
