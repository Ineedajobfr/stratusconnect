import { getErrorMessage } from "@/utils/errorHandler";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, Plus, Calendar, CheckCircle, 
  Clock, AlertCircle, CreditCard, Receipt,
  TrendingUp, FileText, Settings
} from "lucide-react";

interface BillingSchedule {
  id: string;
  deal_id: string;
  billing_type: 'milestone' | 'installment' | 'net30' | 'advance';
  schedule_data: {
    milestones?: Array<{
      name: string;
      amount: number;
      due_date: string;
      status: 'pending' | 'paid' | 'overdue';
    }>;
    installments?: Array<{
      amount: number;
      due_date: string;
      status: 'pending' | 'paid' | 'overdue';
    }>;
  };
  total_amount: number;
  currency: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  created_at: string;
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

interface Payment {
  id: string;
  deal_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  payment_type: string;
  created_at: string;
}

export default function BillingSystem() {
  const [billingSchedules, setBillingSchedules] = useState<BillingSchedule[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [availableDeals, setAvailableDeals] = useState<unknown[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const { toast } = useToast();

  const [billingForm, setBillingForm] = useState({
    deal_id: "",
    billing_type: "milestone",
    milestones: [
      { name: "Contract Signing", percentage: 25, days_from_start: 0 },
      { name: "Aircraft Delivery", percentage: 50, days_from_start: 7 },
      { name: "Flight Completion", percentage: 25, days_from_start: 14 }
    ],
    installment_count: 3,
    installment_interval: 30
  });

  useEffect(() => {
    fetchUserData();
    fetchBillingSchedules();
    fetchPayments();
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

  const fetchBillingSchedules = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("billing_schedules")
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
      setBillingSchedules((data || []) as unknown as BillingSchedule[]);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to fetch billing schedules",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchPayments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setPayments((data || []) as Payment[]);
    } catch (error: unknown) {
      console.error("Error fetching payments:", error);
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
    } catch (error: unknown) {
      console.error("Error fetching available deals:", error);
    }
  };

  const createBillingSchedule = async () => {
    if (!billingForm.deal_id) {
      toast({
        title: "Error",
        description: "Please select a deal",
        variant: "destructive",
      });
      return;
    }

  try {
      const selectedDeal = availableDeals.find((d: unknown) => (d as Record<string, unknown>).id === billingForm.deal_id) as Record<string, unknown>;
      if (!selectedDeal) throw new Error("Deal not found");

      let scheduleData = {} as Record<string, unknown>;
      const totalAmount: number = Number(selectedDeal.final_amount) || 0;

      if (billingForm.billing_type === 'milestone') {
        const milestones = billingForm.milestones.map((milestone) => {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + milestone.days_from_start);
          
          return {
            name: milestone.name,
            amount: Math.round((milestone.percentage / 100) * totalAmount),
            due_date: dueDate.toISOString(),
            status: 'pending'
          };
        });
        scheduleData = { milestones };
      } else if (billingForm.billing_type === 'installment') {
        const installmentAmount = Math.round(totalAmount / billingForm.installment_count);
        const installments = Array.from({ length: billingForm.installment_count }, (_, index) => {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + (index * billingForm.installment_interval));
          
          return {
            amount: index === billingForm.installment_count - 1 
              ? totalAmount - (installmentAmount * (billingForm.installment_count - 1))
              : installmentAmount,
            due_date: dueDate.toISOString(),
            status: 'pending'
          };
        });
        scheduleData = { installments };
      }

      const { error } = await supabase
        .from("billing_schedules")
        .insert({
          deal_id: billingForm.deal_id,
          billing_type: billingForm.billing_type,
          schedule_data: scheduleData,
          total_amount: totalAmount,
          currency: 'USD',
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Billing schedule created successfully",
      });

      setIsCreateDialogOpen(false);
      setBillingForm({
        deal_id: "",
        billing_type: "milestone",
        milestones: [
          { name: "Contract Signing", percentage: 25, days_from_start: 0 },
          { name: "Aircraft Delivery", percentage: 50, days_from_start: 7 },
          { name: "Flight Completion", percentage: 25, days_from_start: 14 }
        ],
        installment_count: 3,
        installment_interval: 30
      });
      fetchBillingSchedules();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-terminal-warning';
      case 'active': return 'bg-terminal-info';
      case 'completed': return 'bg-terminal-success';
      case 'cancelled': return 'bg-terminal-danger';
      case 'paid': return 'bg-terminal-success';
      case 'overdue': return 'bg-terminal-danger';
      default: return 'bg-slate-500';
    }
  };

  const calculateProgress = (schedule: BillingSchedule) => {
    if (schedule.billing_type === 'milestone' && schedule.schedule_data.milestones) {
      const paidMilestones = schedule.schedule_data.milestones.filter(m => m.status === 'paid').length;
      return (paidMilestones / schedule.schedule_data.milestones.length) * 100;
    } else if (schedule.billing_type === 'installment' && schedule.schedule_data.installments) {
      const paidInstallments = schedule.schedule_data.installments.filter(i => i.status === 'paid').length;
      return (paidInstallments / schedule.schedule_data.installments.length) * 100;
    }
    return 0;
  };

  const getTotalPaid = (schedule: BillingSchedule) => {
    if (schedule.billing_type === 'milestone' && schedule.schedule_data.milestones) {
      return schedule.schedule_data.milestones
        .filter(m => m.status === 'paid')
        .reduce((sum, m) => sum + m.amount, 0);
    } else if (schedule.billing_type === 'installment' && schedule.schedule_data.installments) {
      return schedule.schedule_data.installments
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + i.amount, 0);
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Billing System</h2>
          <p className="text-slate-400">Manage payment schedules and transactions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-terminal-success hover:bg-terminal-success/80">
              <Plus className="mr-2 h-4 w-4" />
              New Billing Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create Billing Schedule</DialogTitle>
              <DialogDescription className="text-slate-400">
                Set up payment terms for a deal
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Select Deal
                  </label>
                  <Select value={billingForm.deal_id} onValueChange={(value) => 
                    setBillingForm(prev => ({ ...prev, deal_id: value }))
                  }>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Choose a deal" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {availableDeals.map((deal: any) => (
                        <SelectItem key={deal.id} value={deal.id} className="text-white">
                          {deal.aircraft.manufacturer} {deal.aircraft.model} - ${deal.final_amount.toLocaleString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Billing Type
                  </label>
                  <Select value={billingForm.billing_type} onValueChange={(value) => 
                    setBillingForm(prev => ({ ...prev, billing_type: value }))
                  }>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="milestone" className="text-white">Milestone-based</SelectItem>
                      <SelectItem value="installment" className="text-white">Installments</SelectItem>
                      <SelectItem value="net30" className="text-white">Net 30</SelectItem>
                      <SelectItem value="advance" className="text-white">Advance Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {billingForm.billing_type === 'milestone' && (
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Milestones
                  </label>
                  <div className="space-y-2">
                    {billingForm.milestones.map((milestone, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2">
                        <Input
                          value={milestone.name}
                          onChange={(e) => {
                            const newMilestones = [...billingForm.milestones];
                            newMilestones[index].name = e.target.value;
                            setBillingForm(prev => ({ ...prev, milestones: newMilestones }));
                          }}
                          placeholder="Milestone name"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        <Input
                          type="number"
                          value={milestone.percentage}
                          onChange={(e) => {
                            const newMilestones = [...billingForm.milestones];
                            newMilestones[index].percentage = parseInt(e.target.value) || 0;
                            setBillingForm(prev => ({ ...prev, milestones: newMilestones }));
                          }}
                          placeholder="Percentage"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        <Input
                          type="number"
                          value={milestone.days_from_start}
                          onChange={(e) => {
                            const newMilestones = [...billingForm.milestones];
                            newMilestones[index].days_from_start = parseInt(e.target.value) || 0;
                            setBillingForm(prev => ({ ...prev, milestones: newMilestones }));
                          }}
                          placeholder="Days from start"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {billingForm.billing_type === 'installment' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Number of Installments
                    </label>
                    <Input
                      type="number"
                      value={billingForm.installment_count}
                      onChange={(e) => setBillingForm(prev => ({ 
                        ...prev, 
                        installment_count: parseInt(e.target.value) || 3 
                      }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Interval (Days)
                    </label>
                    <Input
                      type="number"
                      value={billingForm.installment_interval}
                      onChange={(e) => setBillingForm(prev => ({ 
                        ...prev, 
                        installment_interval: parseInt(e.target.value) || 30 
                      }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button onClick={createBillingSchedule} className="bg-terminal-success hover:bg-terminal-success/80">
                  Create Schedule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-terminal-success" />
              <div>
                <p className="text-sm text-slate-400">Total Receivable</p>
                <p className="text-lg font-bold text-white">
                  ${billingSchedules.reduce((sum, s) => sum + s.total_amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-terminal-success" />
              <div>
                <p className="text-sm text-slate-400">Paid</p>
                <p className="text-lg font-bold text-white">
                  ${billingSchedules.reduce((sum, s) => sum + getTotalPaid(s), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-terminal-warning" />
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <p className="text-lg font-bold text-white">
                  {billingSchedules.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-terminal-danger" />
              <div>
                <p className="text-sm text-slate-400">Overdue</p>
                <p className="text-lg font-bold text-white">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Schedules */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Active Billing Schedules</h3>
        {billingSchedules.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Receipt className="h-12 w-12 text-slate-500 mb-4" />
              <p className="text-slate-400 text-center">No billing schedules found</p>
              <p className="text-slate-500 text-sm text-center">Create your first billing schedule to get started</p>
            </CardContent>
          </Card>
        ) : (
          billingSchedules.map((schedule) => (
            <Card key={schedule.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">
                      {schedule.deals.aircraft.manufacturer} {schedule.deals.aircraft.model}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {schedule.deals.aircraft.tail_number} • {schedule.billing_type} billing
                    </CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(schedule.status)} text-white`}>
                    {schedule.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Progress</span>
                    <span className="text-white font-medium">
                      {calculateProgress(schedule).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={calculateProgress(schedule)} className="h-2" />
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Total Amount</p>
                      <p className="text-lg font-bold text-white">
                        ${schedule.total_amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Paid</p>
                      <p className="text-lg font-bold text-terminal-success">
                        ${getTotalPaid(schedule).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Remaining</p>
                      <p className="text-lg font-bold text-terminal-warning">
                        ${(schedule.total_amount - getTotalPaid(schedule)).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700">
                      <FileText className="mr-1 h-4 w-4" />
                      Details
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700">
                      <Settings className="mr-1 h-4 w-4" />
                      Manage
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