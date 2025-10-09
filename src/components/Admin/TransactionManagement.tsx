import { EnterpriseCard } from '@/components/enterprise/EnterpriseCard';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Download, RefreshCw, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  amount: number;
  commission_rate: number;
  commission_amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'broker_transaction' | 'operator_transaction' | 'crew_hire' | 'pilot_hire';
  user_id: string;
  created_at: string;
  user_email?: string;
  user_role?: string;
}

export const TransactionManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Analytics
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    brokerCommission: 0,
    operatorCommission: 0,
    crewHireCommission: 0,
    pilotHireCommission: 0,
    transactionCount: 0,
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchQuery, statusFilter, typeFilter]);

  const loadTransactions = async () => {
    try {
      setLoading(true);

      // Get all transactions
      const { data: transactionsData, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles:user_id (
            email,
            role
          )
        `)
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      // Calculate commission amounts
      const enrichedTransactions: Transaction[] = transactionsData?.map((t: any) => ({
        ...t,
        commission_amount: t.amount * (t.commission_rate / 100),
        user_email: t.profiles?.email,
        user_role: t.profiles?.role,
      })) || [];

      setTransactions(enrichedTransactions);
      calculateAnalytics(enrichedTransactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.amount.toString().includes(searchQuery)
      );
    }

    setFilteredTransactions(filtered);
  };

  const calculateAnalytics = (txns: Transaction[]) => {
    const completed = txns.filter(t => t.status === 'completed');

    const brokerCommission = completed
      .filter(t => t.type === 'broker_transaction')
      .reduce((sum, t) => sum + t.commission_amount, 0);

    const operatorCommission = completed
      .filter(t => t.type === 'operator_transaction')
      .reduce((sum, t) => sum + t.commission_amount, 0);

    const crewHireCommission = completed
      .filter(t => t.type === 'crew_hire')
      .reduce((sum, t) => sum + t.commission_amount, 0);

    const pilotHireCommission = completed
      .filter(t => t.type === 'pilot_hire')
      .reduce((sum, t) => sum + t.commission_amount, 0);

    const totalRevenue = brokerCommission + operatorCommission + crewHireCommission + pilotHireCommission;

    setAnalytics({
      totalRevenue,
      brokerCommission,
      operatorCommission,
      crewHireCommission,
      pilotHireCommission,
      transactionCount: completed.length,
    });
  };

  const exportTransactions = () => {
    const csv = [
      ['ID', 'Amount', 'Commission Rate', 'Commission Amount', 'Status', 'Type', 'User Email', 'Date'].join(','),
      ...filteredTransactions.map(t => [
        t.id,
        t.amount,
        t.commission_rate,
        t.commission_amount,
        t.status,
        t.type,
        t.user_email || '',
        new Date(t.created_at).toISOString(),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const statusColors = {
    pending: 'status-badge-warning',
    completed: 'status-badge-success',
    failed: 'status-badge-danger',
    refunded: 'status-badge-info',
  };

  const typeLabels = {
    broker_transaction: 'Broker (7%)',
    operator_transaction: 'Operator (7%)',
    crew_hire: 'Crew Hire (10%)',
    pilot_hire: 'Pilot Hire (10%)',
  };

  const columns = [
    {
      key: 'id',
      header: 'Transaction ID',
      width: '200px',
      render: (row: Transaction) => (
        <span className="font-mono text-xs">{row.id.slice(0, 8)}...</span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row: Transaction) => (
        <span className="font-mono font-semibold">${row.amount.toLocaleString()}</span>
      ),
    },
    {
      key: 'commission_amount',
      header: 'Commission',
      render: (row: Transaction) => (
        <span className="font-mono text-enterprise-gold">
          ${row.commission_amount.toFixed(2)} ({row.commission_rate}%)
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (row: Transaction) => (
        <span className="text-xs font-mono text-white/80">
          {typeLabels[row.type] || row.type}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Transaction) => (
        <Badge className={cn('status-badge', statusColors[row.status])}>
          {row.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'user_email',
      header: 'User',
      render: (row: Transaction) => (
        <span className="font-mono text-xs text-white/80">{row.user_email || 'N/A'}</span>
      ),
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (row: Transaction) => (
        <span className="font-mono text-xs text-white/60">
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="enterprise-spinner" />
        <span className="ml-3 text-white/60 font-mono">Loading transactions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <EnterpriseCard title="Total Commission Revenue" status="live">
          <div className="text-4xl font-bold text-enterprise-gold font-mono">
            ${analytics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-sm text-white/60 mt-2 font-mono">
            From {analytics.transactionCount} completed transactions
          </p>
        </EnterpriseCard>

        <EnterpriseCard title="Broker/Operator Revenue" status="completed">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/60 font-mono text-sm">Broker (7%)</span>
              <span className="text-white font-mono">${analytics.brokerCommission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-mono text-sm">Operator (7%)</span>
              <span className="text-white font-mono">${analytics.operatorCommission.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-white/10">
              <div className="flex justify-between">
                <span className="text-enterprise-gold font-mono text-sm font-semibold">Subtotal</span>
                <span className="text-enterprise-gold font-mono font-semibold">
                  ${(analytics.brokerCommission + analytics.operatorCommission).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </EnterpriseCard>

        <EnterpriseCard title="Crew/Pilot Hiring Revenue" status="completed">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/60 font-mono text-sm">Crew Hire (10%)</span>
              <span className="text-white font-mono">${analytics.crewHireCommission.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-mono text-sm">Pilot Hire (10%)</span>
              <span className="text-white font-mono">${analytics.pilotHireCommission.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-white/10">
              <div className="flex justify-between">
                <span className="text-enterprise-gold font-mono text-sm font-semibold">Subtotal</span>
                <span className="text-enterprise-gold font-mono font-semibold">
                  ${(analytics.crewHireCommission + analytics.pilotHireCommission).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </EnterpriseCard>
      </div>

      {/* Transactions Table */}
      <EnterpriseCard
        title="All Transactions"
        description={`${filteredTransactions.length} transactions`}
        actions={
          <div className="flex gap-2">
            <Button
              onClick={loadTransactions}
              variant="outline"
              size="sm"
              className="border-enterprise-primary/20 text-white hover:bg-enterprise-primary/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={exportTransactions}
              variant="outline"
              size="sm"
              className="border-enterprise-primary/20 text-white hover:bg-enterprise-primary/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        }
      >
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="Search by ID, email, amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/30 border-enterprise-primary/20 text-white"
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-black/30 border-enterprise-primary/20 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px] bg-black/30 border-enterprise-primary/20 text-white">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="broker_transaction">Broker (7%)</SelectItem>
              <SelectItem value="operator_transaction">Operator (7%)</SelectItem>
              <SelectItem value="crew_hire">Crew Hire (10%)</SelectItem>
              <SelectItem value="pilot_hire">Pilot Hire (10%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <EnterpriseTable
          data={filteredTransactions}
          columns={columns}
          keyExtractor={(row) => row.id}
          searchable={false}
          exportable={false}
        />
      </EnterpriseCard>
    </div>
  );
};

