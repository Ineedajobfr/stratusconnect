// Admin Dashboard Charts
// Rich visualizations for the admin dashboard

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, DollarSign, Plane, Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface ChartData {
  labels: string[];
  values: number[];
  colors?: string[];
}

interface AdminChartsProps {
  systemStats: any;
  users: any[];
  deals: any[];
  securityEvents: any[];
}

const AdminCharts = ({ systemStats, users, deals, securityEvents }: AdminChartsProps) => {
  // Generate sample data for charts
  const generateChartData = (type: string): ChartData => {
    switch (type) {
      case 'users':
        return {
          labels: ['Brokers', 'Operators', 'Pilots', 'Crew', 'Admins'],
          values: [
            users.filter(u => u.role === 'broker').length,
            users.filter(u => u.role === 'operator').length,
            users.filter(u => u.role === 'pilot').length,
            users.filter(u => u.role === 'crew').length,
            users.filter(u => u.role === 'admin').length
          ],
          colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
        };
      case 'deals':
        return {
          labels: ['Quoted', 'Accepted', 'In Progress', 'Completed', 'Cancelled'],
          values: [
            deals.filter(d => d.status === 'quoted').length,
            deals.filter(d => d.status === 'accepted').length,
            deals.filter(d => d.status === 'in_progress').length,
            deals.filter(d => d.status === 'completed').length,
            deals.filter(d => d.status === 'cancelled').length
          ],
          colors: ['#6B7280', '#3B82F6', '#F59E0B', '#10B981', '#EF4444']
        };
      case 'security':
        return {
          labels: ['Low', 'Medium', 'High', 'Critical'],
          values: [
            securityEvents.filter(e => e.severity === 'low').length,
            securityEvents.filter(e => e.severity === 'medium').length,
            securityEvents.filter(e => e.severity === 'high').length,
            securityEvents.filter(e => e.severity === 'critical').length
          ],
          colors: ['#10B981', '#F59E0B', '#EF4444', '#DC2626']
        };
      default:
        return { labels: [], values: [], colors: [] };
    }
  };

  const userData = generateChartData('users');
  const dealData = generateChartData('deals');
  const securityData = generateChartData('security');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Distribution Chart */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            User Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userData.labels.map((label, index) => {
              const percentage = userData.values[index] / Math.max(userData.values.reduce((a, b) => a + b, 0), 1) * 100;
              return (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: userData.colors?.[index] }}
                    ></div>
                    <span className="text-sm text-foreground">{label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">{userData.values[index]}</span>
                    <div className="w-20 bg-terminal-border rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: userData.colors?.[index]
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Deal Status Chart */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plane className="w-5 h-5 mr-2" />
            Deal Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dealData.labels.map((label, index) => {
              const percentage = dealData.values[index] / Math.max(dealData.values.reduce((a, b) => a + b, 0), 1) * 100;
              return (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: dealData.colors?.[index] }}
                    ></div>
                    <span className="text-sm text-foreground">{label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">{dealData.values[index]}</span>
                    <div className="w-20 bg-terminal-border rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: dealData.colors?.[index]
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Events Chart */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityData.labels.map((label, index) => {
              const percentage = securityData.values[index] / Math.max(securityData.values.reduce((a, b) => a + b, 0), 1) * 100;
              return (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: securityData.colors?.[index] }}
                    ></div>
                    <span className="text-sm text-foreground">{label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">{securityData.values[index]}</span>
                    <div className="w-20 bg-terminal-border rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: securityData.colors?.[index]
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Trend */}
      <Card className="terminal-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Revenue</span>
              <span className="text-2xl font-bold text-data-positive">
                ${(systemStats.totalRevenue || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Platform Commission</span>
              <span className="text-lg font-semibold text-foreground">
                ${(systemStats.totalCommission || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Deal Value</span>
              <span className="text-lg font-semibold text-foreground">
                ${Math.round((systemStats.totalRevenue || 0) / Math.max(systemStats.totalDeals || 1, 1)).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Growth Rate</span>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-data-positive" />
                <span className="text-sm text-data-positive">+15.3%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCharts;
