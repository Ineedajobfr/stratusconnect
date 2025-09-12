import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Settings, 
  Target, 
  TrendingUp,
  Shield,
  Users,
  DollarSign,
  Clock
} from 'lucide-react';
import { PerformanceDashboard, DEMO_PERFORMANCE_METRICS } from '@/components/league/PerformanceDashboard';
import { AdminConfigPanel } from '@/components/league/AdminConfigPanel';
import { FlywheelVisualization } from '@/components/league/FlywheelVisualization';

export default function AdminLeagueDashboard() {
  const [activeTab, setActiveTab] = useState('performance');

  return (
    <div className="min-h-screen bg-app text-body">
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground title-glow">League Admin Dashboard</h1>
            <p className="text-muted-foreground subtitle-glow">
              Monitor performance, tune levers, and maintain structural edge
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Current Performance</div>
              <div className="text-2xl font-bold text-accent accent-glow">87.3%</div>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="terminal-card border-green-500/30">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-500">8.5m</div>
              <div className="text-sm text-muted-foreground">Time to First Quote</div>
              <div className="text-xs text-green-500">✓ Target: ≤10m</div>
            </CardContent>
          </Card>
          
          <Card className="terminal-card border-green-500/30">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-500">65%</div>
              <div className="text-sm text-muted-foreground">Quote Response Rate</div>
              <div className="text-xs text-green-500">✓ Target: ≥60%</div>
            </CardContent>
          </Card>
          
          <Card className="terminal-card border-green-500/30">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-500">19%</div>
              <div className="text-sm text-muted-foreground">Deal Conversion</div>
              <div className="text-xs text-green-500">✓ Target: ≥18%</div>
            </CardContent>
          </Card>
          
          <Card className="terminal-card border-green-500/30">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-500">96%</div>
              <div className="text-sm text-muted-foreground">On-Platform Settlement</div>
              <div className="text-xs text-green-500">✓ Target: ≥95%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Performance</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Configuration</span>
            </TabsTrigger>
            <TabsTrigger value="flywheel" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Flywheel</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceDashboard metrics={DEMO_PERFORMANCE_METRICS} />
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <AdminConfigPanel />
          </TabsContent>

          <TabsContent value="flywheel" className="space-y-6">
            <FlywheelVisualization />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Structural Edge Analysis */}
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 title-glow">
                    <Shield className="w-6 h-6 text-accent" />
                    <span>Structural Edge Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Speed Monopoly</span>
                      <span className="text-sm font-semibold text-green-500">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Margin Protection</span>
                      <span className="text-sm font-semibold text-green-500">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Quality Filters</span>
                      <span className="text-sm font-semibold text-green-500">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Data Moat</span>
                      <span className="text-sm font-semibold text-green-500">Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Attack Surface Status */}
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 title-glow">
                    <Shield className="w-6 h-6 text-accent" />
                    <span>Attack Surface Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Gaming Attempts Blocked</span>
                      <span className="text-sm font-semibold text-green-500">98.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fraud Detection</span>
                      <span className="text-sm font-semibold text-green-500">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Compliance Gates</span>
                      <span className="text-sm font-semibold text-green-500">All Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Audit Logs</span>
                      <span className="text-sm font-semibold text-green-500">Complete</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Impact */}
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 title-glow">
                    <DollarSign className="w-6 h-6 text-accent" />
                    <span>Revenue Impact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">CAC Reduction</span>
                      <span className="text-sm font-semibold text-green-500">-23%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">LTV Increase</span>
                      <span className="text-sm font-semibold text-green-500">+31%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">On-Platform Revenue</span>
                      <span className="text-sm font-semibold text-green-500">+45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Leakage Prevention</span>
                      <span className="text-sm font-semibold text-green-500">$2.3M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Engagement */}
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 title-glow">
                    <Users className="w-6 h-6 text-accent" />
                    <span>User Engagement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Daily Active Users</span>
                      <span className="text-sm font-semibold text-accent">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Weekly Retention</span>
                      <span className="text-sm font-semibold text-green-500">89%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Sessions per User</span>
                      <span className="text-sm font-semibold text-accent">12.3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Points per User</span>
                      <span className="text-sm font-semibold text-accent">36.7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
