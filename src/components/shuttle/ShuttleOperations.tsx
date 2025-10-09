import { EnterpriseCard } from '@/components/enterprise/EnterpriseCard';
import { EnterpriseTable } from '@/components/enterprise/EnterpriseTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar, Percent, Plus, Users } from 'lucide-react';
import React, { useState } from 'react';

interface ShuttleRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  schedule: string; // e.g., "Every Monday 8:00 AM"
  aircraft: string;
  capacity: number;
  bookedSeats: number;
  pricing: {
    economy: number;
    business: number;
    vip: number;
  };
  status: 'active' | 'paused' | 'full';
  loadFactor: number; // percentage
  profitability: number;
}

export const ShuttleOperations: React.FC = () => {
  const [routes, setRoutes] = useState<ShuttleRoute[]>([
    {
      id: '1',
      name: 'NYC-MIA Express',
      from: 'New York (TEB)',
      to: 'Miami (OPF)',
      schedule: 'Every Monday 8:00 AM',
      aircraft: 'Citation X',
      capacity: 8,
      bookedSeats: 6,
      pricing: { economy: 1200, business: 1800, vip: 2500 },
      status: 'active',
      loadFactor: 75,
      profitability: 42,
    },
    {
      id: '2',
      name: 'LAX-SFO Shuttle',
      from: 'Los Angeles (VNY)',
      to: 'San Francisco (SFO)',
      schedule: 'Daily 7:00 AM & 5:00 PM',
      aircraft: 'Phenom 300',
      capacity: 6,
      bookedSeats: 6,
      pricing: { economy: 800, business: 1200, vip: 1600 },
      status: 'full',
      loadFactor: 100,
      profitability: 58,
    },
  ]);

  const columns = [
    {
      key: 'name',
      header: 'Route',
      render: (row: ShuttleRoute) => (
        <div>
          <div className="font-semibold text-white font-mono">{row.name}</div>
          <div className="text-xs text-white/60 font-mono">{row.from} → {row.to}</div>
        </div>
      ),
    },
    {
      key: 'schedule',
      header: 'Schedule',
      render: (row: ShuttleRoute) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 text-white/60" />
          <span className="text-sm font-mono text-white/80">{row.schedule}</span>
        </div>
      ),
    },
    {
      key: 'capacity',
      header: 'Capacity',
      render: (row: ShuttleRoute) => (
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-white/60" />
            <span className="font-mono text-white">{row.bookedSeats}/{row.capacity}</span>
          </div>
          <div className="text-xs font-mono text-white/60">{row.loadFactor}% load factor</div>
        </div>
      ),
    },
    {
      key: 'pricing',
      header: 'Pricing',
      render: (row: ShuttleRoute) => (
        <div className="text-xs font-mono space-y-1">
          <div className="text-white/60">Economy: ${row.pricing.economy}</div>
          <div className="text-white/60">Business: ${row.pricing.business}</div>
          <div className="text-enterprise-gold">VIP: ${row.pricing.vip}</div>
        </div>
      ),
    },
    {
      key: 'profitability',
      header: 'Profit',
      render: (row: ShuttleRoute) => (
        <div className="flex items-center gap-1">
          <Percent className="w-3 h-3 text-enterprise-success" />
          <span className="font-mono font-semibold text-enterprise-success">{row.profitability}%</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: ShuttleRoute) => {
        const statusConfig = {
          active: { label: 'ACTIVE', className: 'status-badge-success' },
          paused: { label: 'PAUSED', className: 'status-badge-warning' },
          full: { label: 'FULLY BOOKED', className: 'status-badge-info' },
        };
        const config = statusConfig[row.status];
        return <Badge className={cn('status-badge', config.className)}>{config.label}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-enterprise-gold font-mono">Shuttle Operations</h2>
          <p className="text-white/60 font-mono text-sm mt-1">Manage recurring routes and seat bookings</p>
        </div>
        <Button className="bg-enterprise-gold text-black hover:bg-enterprise-gold/80">
          <Plus className="w-4 h-4 mr-2" />
          Create New Route
        </Button>
      </div>

      {/* Routes Table */}
      <EnterpriseCard title="Active Shuttle Routes" description={`${routes.length} routes`}>
        <EnterpriseTable
          data={routes}
          columns={columns}
          keyExtractor={(row) => row.id}
        />
      </EnterpriseCard>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EnterpriseCard title="Total Routes" status="live">
          <div className="text-4xl font-bold text-white font-mono">{routes.length}</div>
        </EnterpriseCard>

        <EnterpriseCard title="Avg Load Factor" status="live">
          <div className="text-4xl font-bold text-enterprise-success font-mono">
            {Math.round(routes.reduce((sum, r) => sum + r.loadFactor, 0) / routes.length)}%
          </div>
        </EnterpriseCard>

        <EnterpriseCard title="Revenue Today" status="live">
          <div className="text-4xl font-bold text-enterprise-gold font-mono">$12.4K</div>
        </EnterpriseCard>

        <EnterpriseCard title="Avg Profitability" status="live">
          <div className="text-4xl font-bold text-enterprise-success font-mono">
            {Math.round(routes.reduce((sum, r) => sum + r.profitability, 0) / routes.length)}%
          </div>
        </EnterpriseCard>
      </div>
    </div>
  );
};

