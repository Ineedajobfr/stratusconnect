import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, Plus, Edit, Eye, Download, 
  CheckCircle, Clock, AlertCircle, Signature,
  User, Building, Calendar
} from "lucide-react";

interface Contract {
  id: string;
  deal_id: string;
  contract_template: string;
  contract_content: string;
  status: 'draft' | 'sent' | 'signed' | 'executed' | 'completed';
  created_by: string;
  signed_by_operator: string | null;
  signed_by_broker: string | null;
  operator_signature_date: string | null;
  broker_signature_date: string | null;
  created_at: string;
  updated_at: string;
  deals: {
    final_amount: number;
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

const CONTRACT_TEMPLATES = {
  charter: `AIRCRAFT CHARTER AGREEMENT

This Charter Agreement is entered into between:

OPERATOR: {{operator_name}} ({{operator_company}})
BROKER: {{broker_name}} ({{broker_company}})

AIRCRAFT DETAILS:
Aircraft: {{aircraft_make}} {{aircraft_model}}
Tail Number: {{tail_number}}

CHARTER DETAILS:
Charter Amount: ${{charter_amount}}
Flight Date: {{flight_date}}

TERMS AND CONDITIONS:
1. Payment terms: Net 30 days
2. Cancellation policy: 48 hours notice required
3. Insurance requirements: Comprehensive coverage required
4. Liability limitations as per standard aviation practice

SIGNATURES:
Operator: ___________________ Date: ___________
Broker: _____________________ Date: ___________`,
  
  sale: `AIRCRAFT SALE AGREEMENT

This Sale Agreement is entered into between:

SELLER: {{operator_name}} ({{operator_company}})
BUYER: {{broker_name}} ({{broker_company}})

AIRCRAFT DETAILS:
Aircraft: {{aircraft_make}} {{aircraft_model}}
Tail Number: {{tail_number}}

SALE DETAILS:
Purchase Price: ${{sale_amount}}
Closing Date: {{closing_date}}

TERMS AND CONDITIONS:
1. Title transfer upon full payment
2. Aircraft delivered "as-is"
3. All documentation included
4. Pre-purchase inspection allowed

SIGNATURES:
Seller: _____________________ Date: ___________
Buyer: ______________________ Date: ___________`
};

export default function ContractManagement() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [availableDeals, setAvailableDeals] = useState<Record<string, unknown>[]>([]);
  const { toast } = useToast();

  const [contractForm, setContractForm] = useState({
    deal_id: "",
    template: "charter",
    custom_content: ""
  });

  useEffect(() => {
    fetchUserData();
    fetchContracts();
    fetchAvailableDeals();
  }, [fetchUserData, fetchContracts, fetchAvailableDeals]);

  const fetchUserData = useCallback(async () => {
              try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                  setCurrentUserId(user.id);
                }
              } catch (error) {
                console.error("Error fetching user data:", error);
              }
            }, [data, user, auth, getUser, id]);

  const fetchContracts = useCallback(async () => {
              try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                  .from("contracts")
                  .select(`
          *,
          deals (
            final_amount,
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
                setContracts((data || []) as unknown as Contract[]);
              } catch (error: unknown) {
                toast({
                  title: "Error",
                  description: "Failed to fetch contracts",
                  variant: "destructive",
                });
              }
            }, [data, user, auth, getUser, from, select, order, ascending, Contract, toast, title, description, variant]);

  const fetchAvailableDeals = useCallback(async () => {
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
              } catch (error: unknown) {
                toast({
                  title: "Error",
                  description: "Failed to fetch available deals",
                  variant: "destructive",
                });
              }
            }, [data, user, auth, getUser, from, select, in, or, id, toast, title, description, variant]);

  const createContract = useCallback(async () => {
    if (!contractForm.deal_id) {
      toast({
        title: "Error",
        description: "Please select a deal",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedDeal = availableDeals.find(d => d.id === contractForm.deal_id);
      if (!selectedDeal) throw new Error("Deal not found");

      let contractContent = contractForm.custom_content;
      if (!contractContent) {
        contractContent = CONTRACT_TEMPLATES[contractForm.template as keyof typeof CONTRACT_TEMPLATES]
          .replace(/{{operator_name}}/g, selectedDeal.operator_profile.full_name)
          .replace(/{{operator_company}}/g, selectedDeal.operator_profile.company_name)
          .replace(/{{broker_name}}/g, selectedDeal.broker_profile.full_name)
          .replace(/{{broker_company}}/g, selectedDeal.broker_profile.company_name)
          .replace(/{{aircraft_make}}/g, selectedDeal.aircraft.manufacturer)
          .replace(/{{aircraft_model}}/g, selectedDeal.aircraft.model)
          .replace(/{{tail_number}}/g, selectedDeal.aircraft.tail_number)
          .replace(/\{\{charter_amount\}\}/g, selectedDeal.final_amount.toLocaleString())
          .replace(/\{\{sale_amount\}\}/g, selectedDeal.final_amount.toLocaleString())
          .replace(/{{flight_date}}/g, new Date().toLocaleDateString())
          .replace(/{{closing_date}}/g, new Date().toLocaleDateString());
      }

      const { error } = await supabase
        .from("contracts")
        .insert({
          deal_id: contractForm.deal_id,
          contract_template: contractForm.template,
          contract_content: contractContent,
          created_by: currentUserId,
          status: 'draft'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contract created successfully",
      });

      setIsCreateDialogOpen(false);
      setContractForm({ deal_id: "", template: "charter", custom_content: "" });
      fetchContracts();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to create contract",
        variant: "destructive",
      });
    }
  }, [contractForm, availableDeals, currentUserId, toast, setIsCreateDialogOpen, setContractForm, fetchContracts]);

  const signContract = async (contractId: string) => {
    try {
      const contract = contracts.find(c => c.id === contractId);
      if (!contract) return;

      const isOperator = contract.deals.operator_profile && currentUserId === contract.deals.operator_profile.full_name;
      const updateData: Record<string, unknown> = { status: 'signed' };

      if (isOperator) {
        updateData.signed_by_operator = currentUserId;
        updateData.operator_signature_date = new Date().toISOString();
      } else {
        updateData.signed_by_broker = currentUserId;
        updateData.broker_signature_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from("contracts")
        .update(updateData)
        .eq("id", contractId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contract signed successfully",
      });

      fetchContracts();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to sign contract",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="h-4 w-4 text-slate-400" />;
      case 'sent': return <Clock className="h-4 w-4 text-terminal-warning" />;
      case 'signed': return <Signature className="h-4 w-4 text-terminal-info" />;
      case 'executed': return <CheckCircle className="h-4 w-4 text-terminal-success" />;
      default: return <AlertCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-slate-500';
      case 'sent': return 'bg-terminal-warning';
      case 'signed': return 'bg-terminal-info';
      case 'executed': return 'bg-terminal-success';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Contract Management</h2>
          <p className="text-slate-400">Manage agreements and legal documents</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-terminal-success hover:bg-terminal-success/80">
              <Plus className="mr-2 h-4 w-4" />
              New Contract
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Contract</DialogTitle>
              <DialogDescription className="text-slate-400">
                Generate a contract for a completed deal
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Select Deal
                  </label>
                  <Select value={contractForm.deal_id} onValueChange={(value) => 
                    setContractForm(prev => ({ ...prev, deal_id: value }))
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
                    Contract Template
                  </label>
                  <Select value={contractForm.template} onValueChange={(value) => 
                    setContractForm(prev => ({ ...prev, template: value }))
                  }>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="charter" className="text-white">Charter Agreement</SelectItem>
                      <SelectItem value="sale" className="text-white">Sale Agreement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Custom Content (Optional)
                </label>
                <Textarea
                  value={contractForm.custom_content}
                  onChange={(e) => setContractForm(prev => ({ ...prev, custom_content: e.target.value }))}
                  placeholder="Enter custom contract content or leave empty to use template"
                  className="min-h-32 bg-slate-700 border-slate-600 text-white"
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
                <Button onClick={createContract} className="bg-terminal-success hover:bg-terminal-success/80">
                  Create Contract
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contracts List */}
      <div className="grid gap-4">
        {contracts.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-slate-500 mb-4" />
              <p className="text-slate-400 text-center">No contracts found</p>
              <p className="text-slate-500 text-sm text-center">Create your first contract to get started</p>
            </CardContent>
          </Card>
        ) : (
          contracts.map((contract) => (
            <Card key={contract.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-white">
                        {contract.deals.aircraft.manufacturer} {contract.deals.aircraft.model}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {contract.deals.aircraft.tail_number} • ${contract.deals.final_amount.toLocaleString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(contract.status)} text-white`}>
                      {getStatusIcon(contract.status)}
                      <span className="ml-1 capitalize">{contract.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">
                      {contract.deals.operator_profile.company_name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">
                      {contract.deals.broker_profile.company_name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">
                      Created: {new Date(contract.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Signature className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">
                      Template: {contract.contract_template}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700">
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-slate-800 border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">Contract Details</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-slate-300 bg-slate-900 p-4 rounded">
                          {contract.contract_content}
                        </pre>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  {contract.status === 'draft' && (
                    <Button 
                      size="sm" 
                      onClick={() => signContract(contract.id)}
                      className="bg-terminal-info hover:bg-terminal-info/80"
                    >
                      <Signature className="mr-1 h-4 w-4" />
                      Sign
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700">
                    <Download className="mr-1 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}