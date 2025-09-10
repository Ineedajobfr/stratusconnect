import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, Plus, DollarSign, ArrowRight, 
  ArrowLeft, CheckCircle, Clock, AlertTriangle,
  Lock, Unlock, Eye, History
} from "lucide-react";

interface EscrowAccount {
  id: string;
  deal_id: string;
  account_id: string;
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'released' | 'closed';
  created_at: string;
  updated_at: string;
  deals: {
    final_amount: number;
    status: string;
    aircraft: {
      tail_number: string;
      manufacturer: string;
      model: string;
    };
    operator_profile: {
      full_name: string;
      company_name: string;
    };
    broker_profile: {
      full_name: string;
      company_name: string;
    };
  };
}

interface Transaction {
  id: string;
  escrow_id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'fee';
  amount: number;
  description: string;
  created_at: string;
  status: 'pending' | 'completed' | 'failed';
}

export default function EscrowManagement() {
  const [escrowAccounts, setEscrowAccounts] = useState<EscrowAccount[]>([]);
  const [availableDeals, setAvailableDeals] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<EscrowAccount | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const { toast } = useToast();

  const [escrowForm, setEscrowForm] = useState({
    deal_id: "",
    initial_deposit: 0
  });

  const [transactionForm, setTransactionForm] = useState({
    type: "deposit",
    amount: 0,
    description: ""
  });

  useEffect(() => {
    fetchUserData();
    fetchEscrowAccounts();
    fetchAvailableDeals();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchEscrowAccounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("escrow_accounts")
        .select(`
          *,
          deals (
            final_amount,
            status,
            aircraft (
              tail_number,
              manufacturer,
              model
            ),
            operator_profile:profiles!deals_operator_id_fkey (
              full_name,
              company_name
            ),
            broker_profile:profiles!deals_broker_id_fkey (
              full_name,
              company_name
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEscrowAccounts((data || []) as unknown as EscrowAccount[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch escrow accounts",
        variant: "destructive",
      });
    }
  };

  const fetchAvailableDeals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("deals")
        .select(`
          *,
          aircraft:aircraft!deals_aircraft_id_fkey (
            tail_number,
            manufacturer,
            model
          ),
          operator_profile:profiles!deals_operator_id_fkey (
            full_name,
            company_name
          ),
          broker_profile:profiles!deals_broker_id_fkey (
            full_name,
            company_name
          )
        `)
        .in("status", ["accepted", "in_progress"])
        .or(`operator_id.eq.${user.id},broker_id.eq.${user.id}`);

      if (error) throw error;
      setAvailableDeals(data || []);
    } catch (error: any) {
      console.error("Error fetching available deals:", error);
    }
  };

  const createEscrowAccount = async () => {
    if (!escrowForm.deal_id) {
      toast({
        title: "Error",
        description: "Please select a deal",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedDeal = availableDeals.find(d => d.id === escrowForm.deal_id);
      if (!selectedDeal) throw new Error("Deal not found");

      // Generate a unique account ID
      const accountId = `ESC-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const { error } = await supabase
        .from("escrow_accounts")
        .insert({
          deal_id: escrowForm.deal_id,
          account_id: accountId,
          balance: escrowForm.initial_deposit,
          currency: 'USD',
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Escrow account created successfully",
      });

      setIsCreateDialogOpen(false);
      setEscrowForm({ deal_id: "", initial_deposit: 0 });
      fetchEscrowAccounts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create escrow account",
        variant: "destructive",
      });
    }
  };

  const processTransaction = async () => {
    if (!selectedAccount || !transactionForm.amount) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      let newBalance = selectedAccount.balance;
      
      if (transactionForm.type === 'deposit') {
        newBalance += transactionForm.amount;
      } else if (transactionForm.type === 'withdrawal') {
        if (transactionForm.amount > selectedAccount.balance) {
          throw new Error("Insufficient balance for withdrawal");
        }
        newBalance -= transactionForm.amount;
      }

      const { error } = await supabase
        .from("escrow_accounts")
        .update({ balance: newBalance })
        .eq("id", selectedAccount.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${transactionForm.type} processed successfully`,
      });

      setIsTransactionDialogOpen(false);
      setTransactionForm({ type: "deposit", amount: 0, description: "" });
      setSelectedAccount(null);
      fetchEscrowAccounts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process transaction",
        variant: "destructive",
      });
    }
  };

  const releaseEscrow = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from("escrow_accounts")
        .update({ 
          status: 'released',
          balance: 0
        })
        .eq("id", accountId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Escrow funds released successfully",
      });

      fetchEscrowAccounts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to release escrow funds",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Shield className="h-4 w-4 text-terminal-success" />;
      case 'frozen': return <Lock className="h-4 w-4 text-terminal-warning" />;
      case 'released': return <Unlock className="h-4 w-4 text-terminal-info" />;
      case 'closed': return <CheckCircle className="h-4 w-4 text-slate-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-terminal-success';
      case 'frozen': return 'bg-terminal-warning';
      case 'released': return 'bg-terminal-info';
      case 'closed': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  const totalEscrowBalance = escrowAccounts.reduce((sum, account) => sum + account.balance, 0);
  const activeAccounts = escrowAccounts.filter(account => account.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Escrow Management</h2>
          <p className="text-slate-400">Secure fund management for transactions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-terminal-success hover:bg-terminal-success/80">
              <Plus className="mr-2 h-4 w-4" />
              Create Escrow
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create Escrow Account</DialogTitle>
              <DialogDescription className="text-slate-400">
                Set up secure escrow for a deal
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Select Deal
                </label>
                <Select value={escrowForm.deal_id} onValueChange={(value) => 
                  setEscrowForm(prev => ({ ...prev, deal_id: value }))
                }>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Choose a deal" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {availableDeals.map((deal) => (
                      <SelectItem key={deal.id} value={deal.id} className="text-white">
                        {deal.aircraft.manufacturer} {deal.aircraft.model} - ${deal.final_amount.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Initial Deposit (USD)
                </label>
                <Input
                  type="number"
                  value={escrowForm.initial_deposit}
                  onChange={(e) => setEscrowForm(prev => ({ 
                    ...prev, 
                    initial_deposit: parseFloat(e.target.value) || 0 
                  }))}
                  placeholder="0.00"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button onClick={createEscrowAccount} className="bg-terminal-success hover:bg-terminal-success/80">
                  Create Account
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-terminal-success" />
              <div>
                <p className="text-sm text-slate-400">Total Balance</p>
                <p className="text-xl font-bold text-white">
                  ${totalEscrowBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-terminal-info" />
              <div>
                <p className="text-sm text-slate-400">Active Accounts</p>
                <p className="text-xl font-bold text-white">{activeAccounts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-terminal-success" />
              <div>
                <p className="text-sm text-slate-400">Total Accounts</p>
                <p className="text-xl font-bold text-white">{escrowAccounts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Escrow Accounts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Escrow Accounts</h3>
        {escrowAccounts.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="h-12 w-12 text-slate-500 mb-4" />
              <p className="text-slate-400 text-center">No escrow accounts found</p>
              <p className="text-slate-500 text-sm text-center">Create your first escrow account to get started</p>
            </CardContent>
          </Card>
        ) : (
          escrowAccounts.map((account) => (
            <Card key={account.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span>{account.account_id}</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {account.deals.aircraft.manufacturer} {account.deals.aircraft.model} • {account.deals.aircraft.tail_number}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(account.status)} text-white`}>
                      {getStatusIcon(account.status)}
                      <span className="ml-1 capitalize">{account.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-400">Current Balance</p>
                    <p className="text-2xl font-bold text-terminal-success">
                      ${account.balance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Deal Amount</p>
                    <p className="text-lg font-semibold text-white">
                      ${account.deals.final_amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Operator</p>
                    <p className="text-sm text-slate-300">
                      {account.deals.operator_profile.company_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Broker</p>
                    <p className="text-sm text-slate-300">
                      {account.deals.broker_profile.company_name}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSelectedAccount(account);
                      setIsTransactionDialogOpen(true);
                    }}
                    className="border-slate-600 text-white hover:bg-slate-700"
                    disabled={account.status !== 'active'}
                  >
                    <ArrowRight className="mr-1 h-4 w-4" />
                    Transaction
                  </Button>
                  
                  {account.status === 'active' && account.balance > 0 && (
                    <Button 
                      size="sm" 
                      onClick={() => releaseEscrow(account.id)}
                      className="bg-terminal-info hover:bg-terminal-info/80"
                    >
                      <Unlock className="mr-1 h-4 w-4" />
                      Release
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Transaction Dialog */}
      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Process Transaction</DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedAccount && `Account: ${selectedAccount.account_id} (Balance: $${selectedAccount.balance.toLocaleString()})`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Transaction Type
              </label>
              <Select value={transactionForm.type} onValueChange={(value) => 
                setTransactionForm(prev => ({ ...prev, type: value }))
              }>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="deposit" className="text-white">Deposit</SelectItem>
                  <SelectItem value="withdrawal" className="text-white">Withdrawal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Amount (USD)
              </label>
              <Input
                type="number"
                value={transactionForm.amount}
                onChange={(e) => setTransactionForm(prev => ({ 
                  ...prev, 
                  amount: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0.00"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Description
              </label>
              <Input
                value={transactionForm.description}
                onChange={(e) => setTransactionForm(prev => ({ 
                  ...prev, 
                  description: e.target.value 
                }))}
                placeholder="Transaction description"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsTransactionDialogOpen(false);
                  setSelectedAccount(null);
                }}
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button onClick={processTransaction} className="bg-terminal-success hover:bg-terminal-success/80">
                Process
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}