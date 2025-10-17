// Operator Billing Dashboard
// Real Stripe Connect integration for operator payouts and transaction history

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { billingService, type CommissionBreakdown, type OperatorBillingData } from "@/lib/billing-service";
import {
    AlertCircle,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    ExternalLink,
    Loader2,
    RefreshCw,
    Settings,
    TrendingUp
} from "lucide-react";
import { useEffect, useState } from "react";

interface OperatorBillingProps {
  operatorId: string;
}

export function OperatorBilling({ operatorId }: OperatorBillingProps) {
  const { toast } = useToast();
  const [billingData, setBillingData] = useState<OperatorBillingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [commissionBreakdown, setCommissionBreakdown] = useState<CommissionBreakdown | null>(null);
  const [showStripeSetup, setShowStripeSetup] = useState(false);
  const [stripeEmail, setStripeEmail] = useState("");

  useEffect(() => {
    loadBillingData();
  }, [operatorId]);

  const loadBillingData = async () => {
    setLoading(true);
    try {
      const data = await billingService.getOperatorBillingData(operatorId);
      setBillingData(data);
      
      // Load commission breakdown for current month
      const startDate = new Date();
      startDate.setDate(1); // First day of current month
      const endDate = new Date();
      
      const breakdown = await billingService.getCommissionBreakdown(
        operatorId,
        startDate.toISOString(),
        endDate.toISOString()
      );
      setCommissionBreakdown(breakdown);
    } catch (error) {
      console.error('Error loading billing data:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load billing data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStripeSetup = async () => {
    if (!stripeEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    try {
      const accountId = await billingService.createStripeConnectAccount(operatorId, stripeEmail);
      toast({
        title: "Stripe Account Created",
        description: "Your Stripe Connect account has been created successfully"
      });
      setShowStripeSetup(false);
      loadBillingData();
    } catch (error) {
      console.error('Error creating Stripe account:', error);
      toast({
        title: "Setup Failed",
        description: "Failed to create Stripe Connect account",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount / 100); // Convert from cents
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'payment': return <DollarSign className="h-4 w-4" />;
      case 'payout': return <TrendingUp className="h-4 w-4" />;
      case 'refund': return <RefreshCw className="h-4 w-4" />;
      case 'chargeback': return <AlertCircle className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Billing Data Unavailable</h3>
        <p className="text-gray-400 mb-6">
          Unable to load billing information. Please try again later.
        </p>
        <Button onClick={loadBillingData} className="bg-orange-500 hover:bg-orange-600 text-white">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Billing & Payments</h2>
          <p className="text-gray-400">Manage your payouts and view transaction history</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={loadBillingData}
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => setShowStripeSetup(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Stripe Setup
          </Button>
        </div>
      </div>

      {/* Stripe Connect Status */}
      {!billingData.stripeConnectStatus.chargesEnabled && (
        <Card className="bg-yellow-900/20 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div>
                <h3 className="font-semibold text-yellow-400">Stripe Connect Setup Required</h3>
                <p className="text-sm text-gray-300">
                  Complete your Stripe Connect setup to start receiving payouts
                </p>
              </div>
              <Button
                onClick={() => setShowStripeSetup(true)}
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Setup Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Earned</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(billingData.totalEarned)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending Payouts</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {formatCurrency(billingData.pendingPayouts)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Commission Paid</p>
                <p className="text-2xl font-bold text-orange-400">
                  {formatCurrency(billingData.commissionPaid)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Next Payout</p>
                <p className="text-2xl font-bold text-blue-400">
                  {formatCurrency(billingData.payoutSchedule.nextPayoutAmount)}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDate(billingData.payoutSchedule.nextPayoutDate)}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-600">
          <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500">
            Overview
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-blue-500">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="commission" className="data-[state=active]:bg-green-500">
            Commission
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-purple-500">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Transactions</CardTitle>
                <CardDescription>Your latest payment activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {billingData.recentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTransactionTypeIcon(transaction.type)}
                        <div>
                          <p className="text-white font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-400">{formatDate(transaction.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">
                          {transaction.type === 'payout' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                        <Badge className={getTransactionStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payout Schedule */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Payout Schedule</CardTitle>
                <CardDescription>Your next payout information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Next Payout</span>
                    <span className="text-white font-medium">
                      {formatCurrency(billingData.payoutSchedule.nextPayoutAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Payout Date</span>
                    <span className="text-white font-medium">
                      {formatDate(billingData.payoutSchedule.nextPayoutDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Frequency</span>
                    <span className="text-white font-medium capitalize">
                      {billingData.payoutSchedule.payoutFrequency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Minimum Amount</span>
                    <span className="text-white font-medium">
                      {formatCurrency(billingData.payoutSchedule.minimumPayoutAmount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Transaction History</CardTitle>
              <CardDescription>Complete history of all your transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {billingData.recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      {getTransactionTypeIcon(transaction.type)}
                      <div>
                        <p className="text-white font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-400">
                          {formatDate(transaction.createdAt)}
                          {transaction.dealId && ` • Deal: ${transaction.dealId}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-white font-medium">
                          {transaction.type === 'payout' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {transaction.completedAt ? `Completed ${formatDate(transaction.completedAt)}` : 'Pending'}
                        </p>
                      </div>
                      <Badge className={getTransactionStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                      <Button size="sm" variant="outline" className="border-slate-600 text-white hover:bg-slate-600">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commission Tab */}
        <TabsContent value="commission" className="space-y-6">
          {commissionBreakdown && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Commission Breakdown</CardTitle>
                  <CardDescription>This month's commission details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Total Revenue</span>
                      <span className="text-white font-medium">
                        {formatCurrency(commissionBreakdown.totalRevenue)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Platform Commission</span>
                      <span className="text-orange-400 font-medium">
                        {formatCurrency(commissionBreakdown.platformCommission)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Your Payout</span>
                      <span className="text-green-400 font-medium">
                        {formatCurrency(commissionBreakdown.operatorPayout)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Commission Rate</span>
                      <span className="text-white font-medium">
                        {commissionBreakdown.commissionRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Transaction Summary</CardTitle>
                  <CardDescription>Activity this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Total Transactions</span>
                      <span className="text-white font-medium">
                        {commissionBreakdown.transactionCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Average Transaction</span>
                      <span className="text-white font-medium">
                        {formatCurrency(commissionBreakdown.totalRevenue / Math.max(commissionBreakdown.transactionCount, 1))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Payout Settings</CardTitle>
              <CardDescription>Configure your payout preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Payout Frequency</Label>
                  <Select defaultValue={billingData.payoutSchedule.payoutFrequency}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="daily" className="text-white">Daily</SelectItem>
                      <SelectItem value="weekly" className="text-white">Weekly</SelectItem>
                      <SelectItem value="monthly" className="text-white">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Minimum Payout Amount</Label>
                  <Input
                    type="number"
                    defaultValue={billingData.payoutSchedule.minimumPayoutAmount / 100}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stripe Setup Dialog */}
      <Dialog open={showStripeSetup} onOpenChange={setShowStripeSetup}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Setup Stripe Connect</DialogTitle>
            <DialogDescription>
              Connect your Stripe account to start receiving payouts
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="text-white">Email Address</Label>
              <Input
                type="email"
                value={stripeEmail}
                onChange={(e) => setStripeEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-300">
                By connecting your Stripe account, you agree to Stripe's terms of service and 
                StratusConnect's payment processing policies.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleStripeSetup}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect Stripe Account
              </Button>
              <Button
                onClick={() => setShowStripeSetup(false)}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
