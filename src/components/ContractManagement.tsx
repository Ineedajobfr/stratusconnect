import { getErrorMessage } from "@/utils/errorHandler";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Contract {
  id: string;
  type: string;
  status: string;
  content: string;
  created_at: string;
  deal: {
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

interface Deal {
  id: string;
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
}

const CONTRACT_TEMPLATES = {
  charter: `CHARTER AGREEMENT

PARTIES:
Operator: {{operator_name}} ({{operator_company}})
Broker: {{broker_name}} ({{broker_company}})

AIRCRAFT DETAILS:
Aircraft: {{aircraft_make}} {{aircraft_model}}
Tail Number: {{tail_number}}

CHARTER DETAILS:
Charter Amount: {{charter_amount}}
Flight Date: {{flight_date}}

TERMS AND CONDITIONS:
1. Payment terms: Net 30 days
2. Cancellation policy: 48 hours notice required
3. Insurance: Operator maintains comprehensive coverage
4. Fuel: Included in quoted price
5. Crew: Professional crew provided by operator

This agreement is governed by aviation law and regulations.`,

  sale: `AIRCRAFT SALE AGREEMENT

PARTIES:
Seller: {{operator_name}} ({{operator_company}})
Broker: {{broker_name}} ({{broker_company}})

AIRCRAFT DETAILS:
Aircraft: {{aircraft_make}} {{aircraft_model}}
Tail Number: {{tail_number}}

SALE DETAILS:
Purchase Price: {{sale_amount}}
Closing Date: {{closing_date}}

TERMS AND CONDITIONS:
1. Title transfer upon full payment
2. Aircraft delivered "as-is"
3. All logs and documentation included
4. Pre-purchase inspection allowed
5. Escrow services available

This agreement is legally binding upon execution.`
};

export default function ContractManagement() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [availableDeals, setAvailableDeals] = useState<Deal[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [contractForm, setContractForm] = useState({
    deal_id: "",
    type: "charter",
    template: "charter",
    custom_content: ""
  });
  const { toast } = useToast();

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
  }, [toast]);

  const fetchAvailableDeals = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("deals")
        .select(`
          *,
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
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setAvailableDeals((data || []) as unknown as Deal[]);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to fetch deals",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchUserData();
    fetchContracts();
    fetchAvailableDeals();
  }, [fetchContracts, fetchAvailableDeals]);

  const createContract = async () => {
    try {
      const selectedDeal = availableDeals.find(deal => deal.id === contractForm.deal_id);
      if (!selectedDeal) {
        toast({
          title: "Error",
          description: "Please select a valid deal",
          variant: "destructive",
        });
        return;
      }

      let contractContent = contractForm.custom_content;
      if (!contractContent) {
        contractContent = CONTRACT_TEMPLATES[contractForm.template as keyof typeof CONTRACT_TEMPLATES]
          .replace(/{{operator_name}}/g, (selectedDeal.operator_profile as any)?.full_name || 'N/A')
          .replace(/{{operator_company}}/g, (selectedDeal.operator_profile as any)?.company_name || 'N/A')
          .replace(/{{broker_name}}/g, (selectedDeal.broker_profile as any)?.full_name || 'N/A')
          .replace(/{{broker_company}}/g, (selectedDeal.broker_profile as any)?.company_name || 'N/A')
          .replace(/{{aircraft_make}}/g, (selectedDeal.aircraft as any)?.manufacturer || 'N/A')
          .replace(/{{aircraft_model}}/g, (selectedDeal.aircraft as any)?.model || 'N/A')
          .replace(/{{tail_number}}/g, (selectedDeal.aircraft as any)?.tail_number || 'N/A')
          .replace(/\{\{charter_amount\}\}/g, selectedDeal.final_amount.toLocaleString())
          .replace(/\{\{sale_amount\}\}/g, selectedDeal.final_amount.toLocaleString())
          .replace(/{{flight_date}}/g, new Date().toLocaleDateString())
          .replace(/{{closing_date}}/g, new Date().toLocaleDateString());
      }

      const { error } = await supabase.from("contracts").insert({
        deal_id: contractForm.deal_id,
        contract_template: contractForm.template,
        contract_content: contractContent,
        status: "draft",
        created_by: currentUserId
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contract created successfully",
      });

      setContractForm({
        deal_id: "",
        type: "charter",
        template: "charter",
        custom_content: ""
      });

      fetchContracts();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const signContract = async (contractId: string) => {
    try {
      const { error } = await supabase
        .from("contracts")
        .update({ 
          status: "signed",
          signed_at: new Date().toISOString(),
          signed_by: currentUserId
        })
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
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contract Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Contract</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Contract</DialogTitle>
              <DialogDescription>
                Generate a contract from available deals
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Deal</label>
                  <Select 
                    value={contractForm.deal_id} 
                    onValueChange={(value) => setContractForm({...contractForm, deal_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a deal" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {availableDeals.map((deal) => (
                        <SelectItem key={deal.id as any} value={deal.id as any} className="text-white">
                          {(deal.aircraft as any)?.manufacturer} {(deal.aircraft as any)?.model} - ${deal.final_amount.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contract Type</label>
                  <Select 
                    value={contractForm.type} 
                    onValueChange={(value) => setContractForm({...contractForm, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="charter">Charter Agreement</SelectItem>
                      <SelectItem value="sale">Sale Agreement</SelectItem>
                      <SelectItem value="lease">Lease Agreement</SelectItem>
                      <SelectItem value="management">Management Agreement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Template</label>
                <Select 
                  value={contractForm.template} 
                  onValueChange={(value) => setContractForm({...contractForm, template: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="charter">Charter Template</SelectItem>
                    <SelectItem value="sale">Sale Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Custom Content (Optional)</label>
                <Textarea
                  value={contractForm.custom_content}
                  onChange={(e) => setContractForm({...contractForm, custom_content: e.target.value})}
                  placeholder="Enter custom contract content or leave blank to use template"
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button onClick={createContract}>Create Contract</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {contracts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No contracts found</p>
            </CardContent>
          </Card>
        ) : (
          contracts.map((contract) => (
            <Card key={contract.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Contract #{contract.id.substring(0, 8)}
                      <Badge variant={contract.status === 'signed' ? 'default' : 'secondary'}>
                        {contract.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {contract.type.charAt(0).toUpperCase() + contract.type.slice(1)} Agreement
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(contract.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Contract Content</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {contract.content}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-x-2">
                      {contract.status === 'draft' && (
                        <Button 
                          onClick={() => signContract(contract.id)}
                          size="sm"
                        >
                          Sign Contract
                        </Button>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}