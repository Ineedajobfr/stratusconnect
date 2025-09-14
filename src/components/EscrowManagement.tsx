import React, { useState, useEffect } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { createPaymentProvider, EscrowIntent, EscrowRelease } from '@/lib/payment-providers';

import { useToast } from '@/hooks/use-toast';

// Helper function to extract error messages
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

interface EscrowManagementProps {
  dealId?: string;
  userRole: 'broker' | 'operator' | 'admin';
}

export default function EscrowManagement({ dealId, userRole }: EscrowManagementProps) {
  const [escrowIntents, setEscrowIntents] = useState<EscrowIntent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntent, setSelectedIntent] = useState<EscrowIntent | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showReleaseDialog, setShowReleaseDialog] = useState(false);
  const [releaseAmount, setReleaseAmount] = useState('');
  const [releaseReason, setReleaseReason] = useState('');
  const { toast } = useToast();

  const paymentProvider = createPaymentProvider();

  useEffect(() => {
    loadEscrowIntents();
  }, [dealId]);

  const loadEscrowIntents = async () => {
    try {
      setLoading(true);
      // No backend table yet; showing empty list for now
      setEscrowIntents([]);
    } catch (error) {
      console.error('Error loading escrow intents:', error);
      toast({
        title: "Error",
        description: "Failed to load escrow intents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createEscrowIntent = async (formData: FormData) => {
    try {
      const amount = parseFloat(formData.get('amount') as string);
      const currency = formData.get('currency') as string;
      const buyerId = formData.get('buyerId') as string;
      const sellerId = formData.get('sellerId') as string;
      const description = formData.get('description') as string;

      const intent = await paymentProvider.createEscrowIntent({
        dealId: dealId || crypto.randomUUID(),
        amount,
        currency,
        buyerId,
        sellerId,
        description,
        expiresInDays: 30,
      });

      // Update local state
      setEscrowIntents((prev) => [intent, ...prev]);

      toast({
        title: "Escrow Intent Created",
        description: `Escrow intent created for ${currency} ${amount}`,
      });

      setShowCreateDialog(false);
      loadEscrowIntents();
    } catch (error: unknown) {
      console.error('Error creating escrow intent:', error);
      toast({
        title: "Error",
        description: (error as Error)?.message || "Failed to create escrow intent",
        variant: "destructive"
      });
    }
  };

  const fundEscrowIntent = async (intentId: string) => {
    try {
      const intent = await paymentProvider.fundEscrowIntent(intentId);

      // Update local state
      setEscrowIntents(prev => prev.map(i => i.id === intentId ? intent : i));

      toast({
        title: "Escrow Funded",
        description: "Funds have been secured in escrow",
      });

      loadEscrowIntents();
    } catch (error: unknown) {
      console.error('Error funding escrow:', error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive"
      });
    }
  };

  const releaseEscrow = async () => {
    if (!selectedIntent || !releaseAmount || !releaseReason) return;

    try {
      const release: EscrowRelease = {
        intentId: selectedIntent.id,
        amount: parseFloat(releaseAmount),
        reason: releaseReason,
        releasedBy: 'current-user',
        releasedAt: new Date().toISOString(),
      };

      const intent = await paymentProvider.releaseEscrow(selectedIntent.id, release);

      // Update local state
      setEscrowIntents(prev => prev.map(i => i.id === selectedIntent.id ? intent : i));

      toast({
        title: "Escrow Released",
        description: `${selectedIntent.currency} ${release.amount} released to seller`,
      });

      setShowReleaseDialog(false);
      setSelectedIntent(null);
      setReleaseAmount('');
      setReleaseReason('');
      loadEscrowIntents();
    } catch (error: unknown) {
      console.error('Error releasing escrow:', error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive"
      });
    }
  };

  const refundEscrow = async (intentId: string) => {
    try {
      const intent = await paymentProvider.refundEscrow(intentId, 'Refund requested by user');

      // Update local state
      setEscrowIntents(prev => prev.map(i => i.id === intentId ? intent : i));

      toast({
        title: "Escrow Refunded",
        description: "Funds have been refunded to buyer",
      });

      loadEscrowIntents();
    } catch (error: unknown) {
      console.error('Error refunding escrow:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to refund escrow",
        variant: "destructive"
      });
    }
  };

  const generateReceipt = async (intentId: string) => {
    try {
      const receipt = await paymentProvider.generateReceipt(intentId);
      
      // Open receipt PDF in new tab
      window.open(receipt.pdfUrl, '_blank');
      
      toast({
        title: "Receipt Generated",
        description: "Receipt PDF opened in new tab",
      });
    } catch (error: unknown) {
      console.error('Error generating receipt:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate receipt",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'funded':
        return <Shield className="w-4 h-4 text-green-500" />;
      case 'released':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'refunded':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'disputed':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30';
      case 'funded':
        return 'bg-green-900/20 text-green-400 border-green-500/30';
      case 'released':
        return 'bg-green-900/20 text-green-400 border-green-500/30';
      case 'refunded':
        return 'bg-red-900/20 text-red-400 border-red-500/30';
      case 'disputed':
        return 'bg-orange-900/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-slate-900/20 text-slate-400 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading escrow intents...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Escrow Management</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="btn-terminal-accent"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Create Escrow
          </Button>
          <Button
            onClick={loadEscrowIntents}
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {escrowIntents.map((intent) => (
          <Card key={intent.id} className="terminal-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    {getStatusIcon(intent.status)}
                    Escrow Intent #{intent.id.slice(-8)}
                  </CardTitle>
                  <p className="text-gunmetal text-sm mt-1">
                    {intent.description}
                  </p>
                </div>
                <Badge className={getStatusColor(intent.status)}>
                  {intent.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Amount</Label>
                  <p className="text-foreground font-mono">
                    {intent.currency} {intent.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Buyer</Label>
                  <p className="text-foreground text-sm">
                    {intent.buyerId.slice(0, 8)}...
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gunmetal">Seller</Label>
                  <p className="text-foreground text-sm">
                    {intent.sellerId.slice(0, 8)}...
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
                
                {intent.status === 'pending' && (
                  <Button
                    onClick={() => fundEscrowIntent(intent.id)}
                    size="sm"
                    className="btn-terminal-accent"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Fund
                  </Button>
                )}
                
                {intent.status === 'funded' && userRole !== 'broker' && (
                  <Button
                    onClick={() => {
                      setSelectedIntent(intent);
                      setShowReleaseDialog(true);
                    }}
                    size="sm"
                    className="btn-terminal-accent"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Release
                  </Button>
                )}
                
                {(intent.status === 'funded' || intent.status === 'pending') && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <XCircle className="w-4 h-4 mr-2" />
                        Refund
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Refund Escrow</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to refund this escrow? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => refundEscrow(intent.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Refund
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                
                <Button
                  onClick={() => generateReceipt(intent.id)}
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

      {escrowIntents.length === 0 && (
        <Card className="terminal-card">
          <CardContent className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-accent opacity-60" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Escrow Intents
            </h3>
            <p className="text-gunmetal mb-4">
              Create an escrow intent to secure funds for a transaction
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="btn-terminal-accent"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Create First Escrow
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Escrow Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Escrow Intent</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); createEscrowIntent(fd); }} className="space-y-4">
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
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="buyerId">Buyer ID</Label>
              <Input
                id="buyerId"
                name="buyerId"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="sellerId">Seller ID</Label>
              <Input
                id="sellerId"
                name="sellerId"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
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
                Create Escrow
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Release Escrow Dialog */}
      <Dialog open={showReleaseDialog} onOpenChange={setShowReleaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Release Escrow</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="releaseAmount">Release Amount</Label>
              <Input
                id="releaseAmount"
                value={releaseAmount}
                onChange={(e) => setReleaseAmount(e.target.value)}
                type="number"
                step="0.01"
                max={selectedIntent?.amount}
                required
              />
              {selectedIntent && (
                <p className="text-sm text-gunmetal mt-1">
                  Maximum: {selectedIntent.currency} {selectedIntent.amount}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="releaseReason">Release Reason</Label>
              <Textarea
                id="releaseReason"
                value={releaseReason}
                onChange={(e) => setReleaseReason(e.target.value)}
                placeholder="Describe why funds are being released..."
                required
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReleaseDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={releaseEscrow}
                className="btn-terminal-accent"
                disabled={!releaseAmount || !releaseReason}
              >
                Release Funds
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}