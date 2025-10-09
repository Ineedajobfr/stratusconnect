import { DataWidget } from '@/components/enterprise/DataWidget';
import { EnterpriseCard } from '@/components/enterprise/EnterpriseCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, DollarSign, Plane, TrendingUp, Users, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface FlightMetrics {
  totalFlights: number;
  totalRevenue: number;
  averageUtilization: number;
  emptyLegConversion: number;
  customerSatisfaction: number;
  profitMargin: number;
}

interface RoutePerformance {
  route: string;
  flights: number;
  revenue: number;
  profitability: number;
  demand: number;
}

export const PostFlightIntelligence: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [metrics, setMetrics] = useState<FlightMetrics>({
    totalFlights: 0,
    totalRevenue: 0,
    averageUtilization: 0,
    emptyLegConversion: 0,
    customerSatisfaction: 0,
    profitMargin: 0,
  });
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const revenueData = [
    { month: 'Jul', revenue: 145000, costs: 98000, profit: 47000 },
    { month: 'Aug', revenue: 162000, costs: 103000, profit: 59000 },
    { month: 'Sep', revenue: 178000, costs: 112000, profit: 66000 },
    { month: 'Oct', revenue: 195000, costs: 118000, profit: 77000 },
    { month: 'Nov', revenue: 187000, costs: 115000, profit: 72000 },
    { month: 'Dec', revenue: 212000, costs: 125000, profit: 87000 },
  ];

  const utilizationData = [
    { aircraft: 'Citation X', utilization: 78, target: 80 },
    { aircraft: 'G450', utilization: 85, target: 80 },
    { aircraft: 'Phenom 300', utilization: 72, target: 75 },
    { aircraft: 'King Air', utilization: 68, target: 70 },
    { aircraft: 'Learjet 75', utilization: 82, target: 80 },
  ];

  const costBreakdown = [
    { name: 'Fuel', value: 42, amount: 52500 },
    { name: 'Crew', value: 28, amount: 35000 },
    { name: 'Maintenance', value: 18, amount: 22500 },
    { name: 'Fees', value: 12, amount: 15000 },
  ];

  const routePerformance: RoutePerformance[] = [
    { route: 'NYC → MIA', flights: 45, revenue: 892000, profitability: 92, demand: 88 },
    { route: 'LAX → SFO', flights: 38, revenue: 456000, profitability: 85, demand: 95 },
    { route: 'CHI → HOU', flights: 32, revenue: 378000, profitability: 78, demand: 72 },
    { route: 'DAL → ATL', flights: 28, revenue: 312000, profitability: 81, demand: 68 },
    { route: 'BOS → DC', flights: 24, revenue: 234000, profitability: 73, demand: 65 },
  ];

  const COLORS = ['#FFD700', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    
    // Simulate data loading
    setTimeout(() => {
      setMetrics({
        totalFlights: 167,
        totalRevenue: 1879000,
        averageUtilization: 77,
        emptyLegConversion: 34,
        customerSatisfaction: 4.7,
        profitMargin: 38,
      });
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="enterprise-spinner" />
        <span className="ml-3 text-white/60 font-mono">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-enterprise-gold font-mono">Post-Flight Intelligence</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px] bg-black/30 border-enterprise-primary/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DataWidget
          metric="Total Flights"
          value={metrics.totalFlights}
          trend={12.3}
          icon={<Plane className="w-5 h-5" />}
          sparkline={[142, 156, 148, 165, 159, 172, 167]}
        />
        
        <DataWidget
          metric="Total Revenue"
          value={`$${(metrics.totalRevenue / 1000).toFixed(0)}K`}
          trend={8.7}
          icon={<DollarSign className="w-5 h-5" />}
        />
        
        <DataWidget
          metric="Avg Utilization"
          value={`${metrics.averageUtilization}%`}
          trend={-2.1}
          icon={<Activity className="w-5 h-5" />}
        />
        
        <DataWidget
          metric="Empty Leg Conversion"
          value={`${metrics.emptyLegConversion}%`}
          trend={15.2}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        
        <DataWidget
          metric="Customer Satisfaction"
          value={metrics.customerSatisfaction}
          unit="/5"
          trend={4.3}
          icon={<Users className="w-5 h-5" />}
        />
        
        <DataWidget
          metric="Profit Margin"
          value={`${metrics.profitMargin}%`}
          trend={3.8}
          icon={<Zap className="w-5 h-5" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <EnterpriseCard title="Revenue & Profitability" description="6-month trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1c', border: '1px solid rgba(139, 69, 19, 0.3)' }}
                labelStyle={{ color: '#FFD700' }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#FFD700" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} name="Profit" />
              <Line type="monotone" dataKey="costs" stroke="#EF4444" strokeWidth={2} name="Costs" />
            </LineChart>
          </ResponsiveContainer>
        </EnterpriseCard>

        {/* Aircraft Utilization */}
        <EnterpriseCard title="Aircraft Utilization" description="Current vs Target">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="aircraft" stroke="rgba(255,255,255,0.6)" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1c', border: '1px solid rgba(139, 69, 19, 0.3)' }}
              />
              <Legend />
              <Bar dataKey="utilization" fill="#FFD700" name="Current %" />
              <Bar dataKey="target" fill="rgba(255, 215, 0, 0.3)" name="Target %" />
            </BarChart>
          </ResponsiveContainer>
        </EnterpriseCard>

        {/* Cost Breakdown */}
        <EnterpriseCard title="Cost Breakdown" description="Operating costs by category">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1c', border: '1px solid rgba(139, 69, 19, 0.3)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm font-mono">
            {costBreakdown.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-white/80">{item.name}</span>
                </div>
                <span className="text-enterprise-gold">${item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </EnterpriseCard>

        {/* Top Routes */}
        <EnterpriseCard title="Top Performing Routes" description="By profitability">
          <div className="space-y-3">
            {routePerformance.map((route, idx) => (
              <div key={route.route} className="flex items-center gap-4 p-3 bg-black/20 rounded border border-enterprise-primary/10">
                <div className="text-2xl font-bold text-enterprise-gold font-mono">
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white font-mono">{route.route}</div>
                  <div className="text-xs text-white/60 font-mono mt-1">
                    {route.flights} flights • ${route.revenue.toLocaleString()} revenue
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-enterprise-success font-mono">
                    {route.profitability}%
                  </div>
                  <div className="text-xs text-white/60 font-mono">profit margin</div>
                </div>
              </div>
            ))}
          </div>
        </EnterpriseCard>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EnterpriseCard title="Crew Efficiency" status="live">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/60 font-mono text-sm">On-time Performance</span>
              <span className="text-enterprise-success font-mono font-semibold">94%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-mono text-sm">Avg Turnaround Time</span>
              <span className="text-white font-mono">42 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-mono text-sm">Safety Score</span>
              <span className="text-enterprise-success font-mono font-semibold">99.8%</span>
            </div>
          </div>
        </EnterpriseCard>

        <EnterpriseCard title="Fuel Efficiency" status="live">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/60 font-mono text-sm">Avg Fuel Cost</span>
              <span className="text-white font-mono">$3,145/flight</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-mono text-sm">vs Last Month</span>
              <span className="text-enterprise-danger font-mono">+5.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-mono text-sm">Optimization Potential</span>
              <span className="text-enterprise-warning font-mono">$15K/month</span>
            </div>
          </div>
        </EnterpriseCard>

        <EnterpriseCard title="Customer Insights" status="live">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/60 font-mono text-sm">Repeat Customers</span>
              <span className="text-enterprise-success font-mono font-semibold">67%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-mono text-sm">Avg Booking Lead Time</span>
              <span className="text-white font-mono">8.5 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-mono text-sm">Referral Rate</span>
              <span className="text-enterprise-success font-mono font-semibold">42%</span>
            </div>
          </div>
        </EnterpriseCard>
      </div>
    </div>
  );
};

