import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, Clock, DollarSign, Download, Eye, Shield } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface LocalDeal {
  id: string;
  title: string;
  buyer_id: string;
  seller_id: string;
  aircraft_id: string;
  price: number;
  total_amount?: number;
  currency?: string;
  fee_bps?: number;
  operator_name?: string;
  rfq_id?: string; // Added
  broker_id?: string; // Added
  operator_id?: string; // Added
  updated_at?: string; // Added
  status: string;
  created_at: string;
  escrow_amount: number;
  completion_date?: string;
  transactions: LocalEscrowTransaction[];
}

interface LocalEscrowTransaction {
  id: string;
  deal_id: string;
  type: 'payment_intent' | 'funds_held' | 'release_to_operator' | 'payout_fee' | 'refund' | 'chargeback';
  amount: number;
  currency: string;
  provider_tx: string;
  created_at: string;
  created_by: string;
  status: 'pending' | 'completed' | 'failed' | 'disputed';
}

interface Deal {
  id: string;
  rfq_id: string;
  quote_id?: string;
  broker_id: string;
  broker_name?: string;
  broker_commission?: number;
  operator_amount?: number;
  platform_fee?: number; // Added
  operator_id: string;
  operator_name: string;
  status: 'initiated' | 'funds_held' | 'in_dispute' | 'released' | 'refunded' | 'chargeback';
  fee_bps: number;
  total_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
  transactions: LocalEscrowTransaction[];
}

const statusColors = {
  initiated: 'text-blue-400',
  funds_held: 'text-yellow-400',
  in_dispute: 'text-red-400',
  released: 'text-green-400',
  refunded: 'text-gray-400',
  chargeback: 'text-red-400',
};

const statusLabels = {
  initiated: 'Initiated',
  funds_held: 'Funds Held',
  in_dispute: 'In Dispute',
  released: 'Released',
  refunded: 'Refunded',
  chargeback: 'Chargeback',
};

const transactionIcons = {
  payment_intent: DollarSign,
  funds_held: Shield,
  release_to_operator: CheckCircle,
  payout_fee: DollarSign,
  refund: Clock,
  chargeback: AlertTriangle,
};

const transactionColors = {
  payment_intent: 'text-blue-400',
  funds_held: 'text-yellow-400',
  release_to_operator: 'text-green-400',
  payout_fee: 'text-orange-400',
  refund: 'text-gray-400',
  chargeback: 'text-red-400',
};

export const EscrowManager: React.FC = () => {
  const { user } = useAuth();
  const [deals, setDeals] = useState<LocalDeal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  // Load deals from real workflow with fallback to mock data
  useEffect(() => {
    const loadDeals = async () => {
      if (!user?.id) {
        // Load mock data if no user
        loadMockDeals();
        return;
      }
      
      try {
        setLoading(true);
        // This would need to be implemented to get deals for the current user
        // const data = await EscrowWorkflow.getUserDeals(user.id);
        // setDeals(data);
        // For now, fallback to mock data
        loadMockDeals();
      } catch (error) {
        console.error('Error loading deals from real workflow, falling back to mock data:', error);
        // Fallback to mock data if real workflow fails
        loadMockDeals();
      } finally {
        setLoading(false);
      }
    };

    const loadMockDeals = () => {
      const mockDeals: Deal[] = [
        {
          id: '1',
          rfq_id: 'rfq-1',
          quote_id: 'quote-1',
          broker_id: user?.id || 'demo-broker',
          operator_id: 'op-1',
          broker_name: 'Demo Broker',
          operator_name: 'SkyHigh Aviation',
          status: 'funds_held',
          fee_bps: 250, // Added - 2.5%
          total_amount: 45000,
          broker_commission: 2250,
          operator_amount: 40500,
          platform_fee: 1125,
          currency: 'USD',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          transactions: [
            {
              id: 'tx-1',
              deal_id: '1',
              type: 'payment_intent',
              amount: 45000,
              currency: 'USD',
              provider_tx: 'pi_1234567890',
              // stripe_payment_intent_id: 'pi_1234567890',
              status: 'completed',
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
              created_by: user?.id || 'demo-broker',
            },
            {
              id: 'tx-2',
              deal_id: '1',
              type: 'funds_held',
              amount: 45000,
              currency: 'USD',
              provider_tx: 'ch_1234567890',
              status: 'completed',
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
              created_by: 'system',
            }
          ],
        },
        {
          id: '2',
          rfq_id: 'rfq-2',
          quote_id: 'quote-2',
          broker_id: user?.id || 'demo-broker',
          operator_id: 'op-2',
          broker_name: 'Demo Broker',
          operator_name: 'Elite Aviation',
          status: 'released',
          fee_bps: 250, // Added - 2.5%
          total_amount: 32000,
          broker_commission: 1600,
          operator_amount: 28800,
          platform_fee: 1600,
          currency: 'USD',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          transactions: [
            {
              id: 'tx-3',
              deal_id: '2',
              type: 'payment_intent',
              amount: 32000,
              currency: 'USD',
              provider_tx: 'pi_0987654321',
              // stripe_payment_intent_id: 'pi_0987654321',
              status: 'completed',
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
              created_by: user?.id || 'demo-broker',
            },
            {
              id: 'tx-4',
              deal_id: '2',
              type: 'funds_held',
              amount: 32000,
              currency: 'USD',
              provider_tx: 'ch_0987654321',
              status: 'completed',
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
              created_by: 'system',
            },
            {
              id: 'tx-5',
              deal_id: '2',
              type: 'release_to_operator',
              amount: 28800,
              currency: 'USD',
              provider_tx: 'tr_0987654321',
              // stripe_transfer_id: 'tr_0987654321',
              status: 'completed',
              created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
              created_by: user?.id || 'demo-broker',
            }
          ],
        }
      ];
      setDeals(mockDeals as any);
    };

    loadDeals();
  }, [user?.id]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockDeals: Deal[] = [
      {
        id: '1',
        rfq_id: 'rfq-1',
        broker_id: 'broker-1',
        operator_id: 'op-1',
        operator_name: 'SkyHigh Aviation',
        status: 'funds_held',
        fee_bps: 250,
        total_amount: 45000,
        currency: 'USD',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        transactions: [
          {
            id: 'tx-1',
            deal_id: '1',
            type: 'payment_intent',
            amount: 45000,
            currency: 'USD',
            provider_tx: 'pi_1234567890',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
            created_by: 'broker-1',
            status: 'completed',
          },
          {
            id: 'tx-2',
            deal_id: '1',
            type: 'funds_held',
            amount: 45000,
            currency: 'USD',
            provider_tx: 'ch_1234567890',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
            created_by: 'system',
            status: 'completed',
          },
        ],
      },
      {
        id: '2',
        rfq_id: 'rfq-2',
        broker_id: 'broker-1',
        operator_id: 'op-2',
        operator_name: 'Elite Air Charter',
        status: 'released',
        fee_bps: 250,
        total_amount: 52000,
        currency: 'USD',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        transactions: [
          {
            id: 'tx-3',
            deal_id: '2',
            type: 'payment_intent',
            amount: 52000,
            currency: 'USD',
            provider_tx: 'pi_0987654321',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            created_by: 'broker-1',
            status: 'completed',
          },
          {
            id: 'tx-4',
            deal_id: '2',
            type: 'funds_held',
            amount: 52000,
            currency: 'USD',
            provider_tx: 'ch_0987654321',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
            created_by: 'system',
            status: 'completed',
          },
          {
            id: 'tx-5',
            deal_id: '2',
            type: 'release_to_operator',
            amount: 50700,
            currency: 'USD',
            provider_tx: 'tr_0987654321',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            created_by: 'broker-1',
            status: 'completed',
          },
          {
            id: 'tx-6',
            deal_id: '2',
            type: 'payout_fee',
            amount: 1300,
            currency: 'USD',
            provider_tx: 'tr_1122334455',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            created_by: 'system',
            status: 'completed',
          },
        ],
      },
    ];

    setDeals(mockDeals as any);
  }, []);

  const releaseFunds = (dealId: string) => {
    setDeals(prev => 
      prev.map(deal => 
        deal.id === dealId 
          ? { 
              ...deal, 
              status: 'released' as const,
              updated_at: new Date().toISOString(),
              transactions: [
                ...deal.transactions,
                {
                  id: `tx-${Date.now()}`,
                  deal_id: dealId,
                  type: 'release_to_operator',
                  amount: deal.total_amount * 0.975, // 97.5% to operator
                  currency: deal.currency,
                  provider_tx: `tr_${Date.now()}`,
                  created_at: new Date().toISOString(),
                  created_by: 'broker-1',
                  status: 'completed',
                },
                {
                  id: `tx-fee-${Date.now()}`,
                  deal_id: dealId,
                  type: 'payout_fee',
                  amount: deal.total_amount * 0.025, // 2.5% fee
                  currency: deal.currency,
                  provider_tx: `tr_fee_${Date.now()}`,
                  created_at: new Date().toISOString(),
                  created_by: 'system',
                  status: 'completed',
                }
              ]
            }
          : deal
      )
    );
  };

  const getEscrowProgress = (deal: Deal) => {
    const steps = [
      { key: 'initiated', label: 'Initiated', completed: true },
      { key: 'funds_held', label: 'Funds Held', completed: deal.status !== 'initiated' },
      { key: 'released', label: 'Released', completed: deal.status === 'released' || deal.status === 'refunded' },
    ];
    
    const completedSteps = steps.filter(step => step.completed).length;
    return { steps, progress: (completedSteps / steps.length) * 100 };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Escrow Management</h2>
          <p className="text-gray-400">Secure payment processing and fund management</p>
        </div>
      </div>

      <div className="grid gap-6">
        {deals.length === 0 ? (
          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No escrow transactions</h3>
              <p className="text-gray-500">Escrow transactions will appear here when deals are created.</p>
            </CardContent>
          </Card>
        ) : (
          deals.map((deal) => {
            const { steps, progress } = getEscrowProgress(deal);
            const totalFees = deal.total_amount * (deal.fee_bps / 10000);
            const operatorAmount = deal.total_amount - totalFees;
            
            return (
              <Card key={deal.id} className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{deal.operator_name}</CardTitle>
                      <p className="text-sm text-gray-400">Deal #{deal.id.slice(-8)}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        ${deal.total_amount.toLocaleString()}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${statusColors[deal.status]}`}
                      >
                        {statusLabels[deal.status]}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Escrow Progress</span>
                      <span className="text-gray-400">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      {steps.map((step, index) => (
                        <div key={step.key} className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            step.completed ? 'bg-orange-500' : 'bg-gray-600'
                          }`} />
                          <span className={step.completed ? 'text-orange-400' : 'text-gray-500'}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded">
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Total Amount</div>
                      <div className="text-lg font-semibold text-white">
                        ${deal.total_amount.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">To Operator</div>
                      <div className="text-lg font-semibold text-green-400">
                        ${operatorAmount.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Platform Fee</div>
                      <div className="text-lg font-semibold text-orange-400">
                        ${totalFees.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Transaction History */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-400">Transaction History</h4>
                    <div className="space-y-2">
                      {deal.transactions.map((transaction) => {
                        const Icon = transactionIcons[transaction.type];
                        return (
                          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded">
                            <div className="flex items-center gap-3">
                              <Icon className={`h-4 w-4 ${transactionColors[transaction.type]}`} />
                              <div>
                                <div className="text-sm font-medium text-white capitalize">
                                  {transaction.type.replace('_', ' ')}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-white">
                                ${transaction.amount.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-400">
                                {transaction.provider_tx}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  {deal.status === 'funds_held' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-700">
                      <Button 
                        className="bg-green-600 hover:bg-green-700 flex-1"
                        onClick={() => releaseFunds(deal.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Release Funds
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {deal.status === 'released' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-700">
                      <Button variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
