import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

interface CommissionSetting {
  id: string;
  transaction_type: string;
  commission_rate: number;
  applies_to_role: string;
}

export const CommissionCalculator = () => {
  const [commissionSettings, setCommissionSettings] = useState<CommissionSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommissionSettings();
  }, []);

  const fetchCommissionSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('commission_settings')
        .select('*')
        .order('transaction_type');

      if (error) throw error;
      setCommissionSettings(data || []);
    } catch (error) {
      console.error('Error fetching commission settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCommission = (amount: number, rate: number): number => {
    return Math.round(amount * rate * 100) / 100;
  };

  const formatRate = (rate: number): string => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  const getCommissionBadge = (type: string) => {
    const colors = {
      booking: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      crew_hiring: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[type as keyof typeof colors] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  // Mock commission totals for demonstration
  const mockStats = {
    totalCommissionCollected: 847392.50,
    bookingCommissions: 623847.25,
    crewCommissions: 223545.25,
    avgBookingCommission: 2850.75,
    avgCrewCommission: 1247.80,
    monthlyGrowth: 12.4
  };

  if (loading) {
    return <div className="text-center text-slate-400">Loading commission data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Commission Control Center</h3>
        <p className="text-slate-400">Automated commission calculation and collection</p>
      </div>

      {/* Commission Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="terminal-label">Total Collected</span>
              </div>
            </div>
            <div className="terminal-metric text-green-400">
              ${mockStats.totalCommissionCollected.toLocaleString()}
            </div>
            <div className="text-slate-400 text-sm font-mono">
              ALL TIME
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="terminal-label">Booking Commissions</span>
              </div>
            </div>
            <div className="terminal-metric text-blue-400">
              ${mockStats.bookingCommissions.toLocaleString()}
            </div>
            <div className="text-slate-400 text-sm font-mono">
              7% RATE
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="terminal-label">Monthly Growth</span>
              </div>
            </div>
            <div className="terminal-metric text-purple-400">
              +{mockStats.monthlyGrowth}%
            </div>
            <div className="text-slate-400 text-sm font-mono">
              TRENDING UP
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Rules */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="terminal-subheader flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Commission Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {commissionSettings.map((setting, index) => (
              <div key={setting.id} className={`p-6 border-b border-slate-800/50 ${index === commissionSettings.length - 1 ? 'border-b-0' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <Badge className={getCommissionBadge(setting.transaction_type)}>
                        {setting.transaction_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-white font-medium">
                        {formatRate(setting.commission_rate)} Commission
                      </span>
                      <span className="text-slate-400 text-sm font-mono">
                        Applied to: {setting.applies_to_role}
                      </span>
                    </div>
                    
                    <div className="text-sm text-slate-400">
                      {setting.transaction_type === 'booking' 
                        ? 'Charged on every confirmed booking between brokers and operators'
                        : 'Charged when operators hire pilots or cabin crew members'
                      }
                    </div>

                    {/* Example Calculations */}
                    <div className="mt-3 p-3 bg-slate-900/50 rounded border border-slate-700">
                      <div className="text-xs text-slate-300 font-mono">
                        <div className="mb-1">Example: $10,000 transaction</div>
                        <div className="flex justify-between">
                          <span>Commission: ${calculateCommission(10000, setting.commission_rate).toLocaleString()}</span>
                          <span>Net to {setting.applies_to_role}: ${(10000 - calculateCommission(10000, setting.commission_rate)).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commission Policy */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="terminal-subheader flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
            Commission Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <div>
                <div className="font-medium text-white">Automatic Collection</div>
                <div className="text-slate-400">Commission is deducted automatically at payment time - no manual intervention required</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <div>
                <div className="font-medium text-white">Zero Tolerance</div>
                <div className="text-slate-400">Attempting to bypass commission or conduct off-platform deals results in immediate account termination</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <div>
                <div className="font-medium text-white">Free for Crew</div>
                <div className="text-slate-400">Pilots and cabin crew are never charged - joining and using the platform is completely free</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
              <div>
                <div className="font-medium text-white">Transparent Rates</div>
                <div className="text-slate-400">All commission rates are clearly displayed before transaction confirmation</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};