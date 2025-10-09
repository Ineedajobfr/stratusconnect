import { DataWidget } from '@/components/enterprise/DataWidget';
import { EnterpriseCard } from '@/components/enterprise/EnterpriseCard';
import { supabase } from '@/integrations/supabase/client';
import { Activity, AlertCircle, DollarSign, TrendingUp, Users, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const PlatformOverview: React.FC = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    todayRevenue: 0,
    pendingVerifications: 0,
    activeFlights: 0,
    transactionsToday: 0,
    systemHealth: 100,
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get active users (users who logged in today)
      const today = new Date().toISOString().split('T')[0];
      const { data: activeUsersData } = await supabase
        .from('user_login_history')
        .select('user_id')
        .gte('created_at', today)
        .order('created_at', { ascending: false });

      const uniqueUsers = new Set(activeUsersData?.map(l => l.user_id));

      // Get today's revenue
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('amount, commission_rate')
        .eq('status', 'completed')
        .gte('created_at', today);

      const todayRevenue = transactionsData?.reduce(
        (sum, t) => sum + (t.amount * (t.commission_rate / 100)),
        0
      ) || 0;

      // Get pending verifications
      const { data: pendingData } = await supabase
        .from('profiles')
        .select('id')
        .eq('verification_status', 'pending');

      // Get active flights (mock for now - integrate with real flight tracking)
      const activeFlights = 12; // Mock

      // Get today's transaction count
      const transactionsToday = transactionsData?.length || 0;

      // System health (mock - integrate with real monitoring)
      const systemHealth = 98.5;

      setMetrics({
        activeUsers: uniqueUsers.size,
        todayRevenue,
        pendingVerifications: pendingData?.length || 0,
        activeFlights,
        transactionsToday,
        systemHealth,
      });

      // Get recent activity (last 10 actions from audit log)
      const { data: activityData } = await supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentActivity(activityData || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="enterprise-spinner" />
        <span className="ml-3 text-white/60 font-mono">Loading platform overview...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DataWidget
          metric="Active Users"
          value={metrics.activeUsers}
          trend={12.5}
          icon={<Users className="w-5 h-5" />}
          realtime
        />
        
        <DataWidget
          metric="Today's Revenue"
          value={`$${metrics.todayRevenue.toFixed(2)}`}
          trend={8.3}
          icon={<DollarSign className="w-5 h-5" />}
          unit=""
        />
        
        <DataWidget
          metric="Pending Verifications"
          value={metrics.pendingVerifications}
          trend={metrics.pendingVerifications > 50 ? -5 : 0}
          icon={<AlertCircle className="w-5 h-5" />}
        />
        
        <DataWidget
          metric="Active Flights"
          value={metrics.activeFlights}
          icon={<Activity className="w-5 h-5" />}
          realtime
        />
        
        <DataWidget
          metric="Transactions Today"
          value={metrics.transactionsToday}
          trend={15.7}
          icon={<TrendingUp className="w-5 h-5" />}
          sparkline={[45, 52, 48, 61, 58, 67, metrics.transactionsToday]}
        />
        
        <DataWidget
          metric="System Health"
          value={`${metrics.systemHealth}%`}
          trend={0.2}
          icon={<Zap className="w-5 h-5" />}
          unit=""
        />
      </div>

      {/* Recent Activity */}
      <EnterpriseCard
        title="Recent Admin Activity"
        description="Last 10 admin actions across the platform"
        status="live"
      >
        <div className="space-y-2">
          {recentActivity.length === 0 ? (
            <p className="text-white/40 text-center py-8 font-mono">No recent activity</p>
          ) : (
            recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded bg-black/20 border border-enterprise-primary/10 hover:border-enterprise-primary/30 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-white font-mono text-sm">{activity.action}</p>
                  <p className="text-white/60 text-xs font-mono mt-1">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
                {activity.affected_table && (
                  <span className="text-xs font-mono text-enterprise-gold bg-enterprise-gold/10 px-2 py-1 rounded">
                    {activity.affected_table}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </EnterpriseCard>

      {/* Quick Actions */}
      <EnterpriseCard
        title="Quick Actions"
        description="Common admin tasks"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-4 rounded-lg bg-enterprise-primary/10 border border-enterprise-primary/20 hover:bg-enterprise-primary/20 transition-all text-white font-mono text-sm">
            Approve Users
          </button>
          <button className="p-4 rounded-lg bg-enterprise-primary/10 border border-enterprise-primary/20 hover:bg-enterprise-primary/20 transition-all text-white font-mono text-sm">
            View Transactions
          </button>
          <button className="p-4 rounded-lg bg-enterprise-primary/10 border border-enterprise-primary/20 hover:bg-enterprise-primary/20 transition-all text-white font-mono text-sm">
            System Logs
          </button>
          <button className="p-4 rounded-lg bg-enterprise-primary/10 border border-enterprise-primary/20 hover:bg-enterprise-primary/20 transition-all text-white font-mono text-sm">
            Generate Report
          </button>
        </div>
      </EnterpriseCard>
    </div>
  );
};

