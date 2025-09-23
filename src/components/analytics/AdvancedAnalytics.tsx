import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Clock, 
  Target, 
  Award,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Star,
  Zap,
  Brain,
  MessageSquare,
  Plane,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface PerformanceMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalDeals: number;
  dealsGrowth: number;
  averageDealValue: number;
  dealValueGrowth: number;
  responseTime: number;
  responseTimeChange: number;
  clientSatisfaction: number;
  satisfactionChange: number;
  conversionRate: number;
  conversionChange: number;
}

interface ClientAnalytics {
  totalClients: number;
  newClients: number;
  returningClients: number;
  topClients: Array<{
    name: string;
    revenue: number;
    deals: number;
    lastActivity: string;
  }>;
  clientSegments: Array<{
    segment: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
}

interface MarketTrends {
  popularRoutes: Array<{
    route: string;
    bookings: number;
    revenue: number;
    growth: number;
  }>;
  aircraftTypes: Array<{
    type: string;
    bookings: number;
    averagePrice: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  seasonalPatterns: Array<{
    month: string;
    bookings: number;
    revenue: number;
  }>;
}

interface CustomReport {
  id: string;
  name: string;
  type: 'Performance' | 'Client' | 'Market' | 'Financial';
  lastGenerated: string;
  status: 'ready' | 'generating' | 'error';
}

export const AdvancedAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - in real app, this would come from API
  const performanceMetrics: PerformanceMetrics = {
    totalRevenue: 2847500,
    revenueGrowth: 12.5,
    totalDeals: 127,
    dealsGrowth: 8.3,
    averageDealValue: 22421,
    dealValueGrowth: 4.1,
    responseTime: 18,
    responseTimeChange: -15.2,
    clientSatisfaction: 4.7,
    satisfactionChange: 0.3,
    conversionRate: 23.4,
    conversionChange: 2.1
  };

  const clientAnalytics: ClientAnalytics = {
    totalClients: 89,
    newClients: 12,
    returningClients: 77,
    topClients: [
      { name: 'Elite Aviation Group', revenue: 450000, deals: 18, lastActivity: '2 hours ago' },
      { name: 'Global Jet Services', revenue: 320000, deals: 14, lastActivity: '1 day ago' },
      { name: 'Premier Air Charter', revenue: 280000, deals: 12, lastActivity: '3 hours ago' },
      { name: 'SkyBridge Aviation', revenue: 195000, deals: 9, lastActivity: '5 hours ago' },
      { name: 'AeroConnect Ltd', revenue: 165000, deals: 7, lastActivity: '1 day ago' }
    ],
    clientSegments: [
      { segment: 'Corporate', count: 45, revenue: 1800000, percentage: 63.2 },
      { segment: 'Private', count: 28, revenue: 750000, percentage: 26.3 },
      { segment: 'Government', count: 16, revenue: 297500, percentage: 10.5 }
    ]
  };

  const marketTrends: MarketTrends = {
    popularRoutes: [
      { route: 'LHR → JFK', bookings: 45, revenue: 675000, growth: 15.2 },
      { route: 'LAX → HNL', bookings: 32, revenue: 480000, growth: 8.7 },
      { route: 'CDG → DXB', bookings: 28, revenue: 420000, growth: 22.1 },
      { route: 'NRT → LAX', bookings: 22, revenue: 330000, growth: -3.4 },
      { route: 'FRA → MIA', bookings: 18, revenue: 270000, growth: 12.8 }
    ],
    aircraftTypes: [
      { type: 'Gulfstream G650', bookings: 35, averagePrice: 85000, trend: 'up' },
      { type: 'Bombardier Global 7500', bookings: 28, averagePrice: 92000, trend: 'up' },
      { type: 'Challenger 350', bookings: 42, averagePrice: 45000, trend: 'stable' },
      { type: 'Phenom 300', bookings: 38, averagePrice: 32000, trend: 'down' },
      { type: 'Citation X+', bookings: 25, averagePrice: 55000, trend: 'up' }
    ],
    seasonalPatterns: [
      { month: 'Jan', bookings: 45, revenue: 675000 },
      { month: 'Feb', bookings: 38, revenue: 570000 },
      { month: 'Mar', bookings: 52, revenue: 780000 },
      { month: 'Apr', bookings: 48, revenue: 720000 },
      { month: 'May', bookings: 41, revenue: 615000 },
      { month: 'Jun', bookings: 55, revenue: 825000 },
      { month: 'Jul', bookings: 62, revenue: 930000 },
      { month: 'Aug', bookings: 58, revenue: 870000 },
      { month: 'Sep', bookings: 49, revenue: 735000 },
      { month: 'Oct', bookings: 44, revenue: 660000 },
      { month: 'Nov', bookings: 39, revenue: 585000 },
      { month: 'Dec', bookings: 47, revenue: 705000 }
    ]
  };

  const customReports: CustomReport[] = [
    { id: '1', name: 'Monthly Performance Report', type: 'Performance', lastGenerated: '2024-03-15', status: 'ready' },
    { id: '2', name: 'Client Analysis Q1 2024', type: 'Client', lastGenerated: '2024-03-10', status: 'ready' },
    { id: '3', name: 'Market Trends Analysis', type: 'Market', lastGenerated: '2024-03-12', status: 'generating' },
    { id: '4', name: 'Financial Summary', type: 'Financial', lastGenerated: '2024-03-08', status: 'ready' }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const generateReport = (reportId: string) => {
    // Simulate report generation
    console.log(`Generating report ${reportId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-GB').format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-bright">Advanced Analytics Dashboard</h2>
          <p className="text-text/70">Comprehensive insights to optimize your broker performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-surface-1 border border-terminal-border rounded-lg px-3 py-2 text-text focus:ring-brand/50"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-brand hover:bg-brand-600 text-text"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex w-max min-w-full justify-start space-x-1 bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm rounded-xl p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <TrendingUp className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <Users className="w-4 h-4" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <Target className="w-4 h-4" />
            Market
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-brand/15 data-[state=active]:text-text text-text/80 hover:text-text px-4 py-2 rounded-lg font-medium transition-all duration-200">
            <FileText className="w-4 h-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-predictive">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text/70">Total Revenue</p>
                    <p className="text-2xl font-bold text-bright">{formatCurrency(performanceMetrics.totalRevenue)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">+{performanceMetrics.revenueGrowth}%</span>
                    </div>
                  </div>
                  <DollarSign className="w-8 h-8 text-brand" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-predictive">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text/70">Total Deals</p>
                    <p className="text-2xl font-bold text-bright">{formatNumber(performanceMetrics.totalDeals)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">+{performanceMetrics.dealsGrowth}%</span>
                    </div>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-predictive">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text/70">Avg Deal Value</p>
                    <p className="text-2xl font-bold text-bright">{formatCurrency(performanceMetrics.averageDealValue)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">+{performanceMetrics.dealValueGrowth}%</span>
                    </div>
                  </div>
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-predictive">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text/70">Conversion Rate</p>
                    <p className="text-2xl font-bold text-bright">{performanceMetrics.conversionRate}%</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">+{performanceMetrics.conversionChange}%</span>
                    </div>
                  </div>
                  <Award className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-predictive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-bright">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Response Time Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-text/70">Average Response Time</span>
                    <span className="text-xl font-bold text-bright">{performanceMetrics.responseTime} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text/70">Change from last period</span>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">{Math.abs(performanceMetrics.responseTimeChange)}% faster</span>
                    </div>
                  </div>
                  <div className="w-full bg-surface-2 rounded-full h-2">
                    <div className="bg-brand h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-predictive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-bright">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Client Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-text/70">Average Rating</span>
                    <span className="text-xl font-bold text-bright">{performanceMetrics.clientSatisfaction}/5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text/70">Change from last period</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">+{performanceMetrics.satisfactionChange}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(performanceMetrics.clientSatisfaction)
                            ? 'text-yellow-400 fill-current'
                            : 'text-text/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="card-predictive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-bright">
                <BarChart3 className="w-5 h-5 text-brand" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-surface-2 rounded-lg">
                    <p className="text-sm text-text/70">Revenue Growth</p>
                    <p className="text-2xl font-bold text-green-400">+{performanceMetrics.revenueGrowth}%</p>
                    <p className="text-xs text-text/60">vs last period</p>
                  </div>
                  <div className="p-4 bg-surface-2 rounded-lg">
                    <p className="text-sm text-text/70">Deal Volume</p>
                    <p className="text-2xl font-bold text-blue-400">+{performanceMetrics.dealsGrowth}%</p>
                    <p className="text-xs text-text/60">vs last period</p>
                  </div>
                  <div className="p-4 bg-surface-2 rounded-lg">
                    <p className="text-sm text-text/70">Efficiency</p>
                    <p className="text-2xl font-bold text-purple-400">+{performanceMetrics.conversionChange}%</p>
                    <p className="text-xs text-text/60">conversion rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-predictive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-bright">
                  <Users className="w-5 h-5 text-green-400" />
                  Client Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-text/70">Total Clients</span>
                    <span className="text-2xl font-bold text-bright">{clientAnalytics.totalClients}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text/70">New This Period</span>
                    <span className="text-lg font-semibold text-green-400">+{clientAnalytics.newClients}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text/70">Returning Clients</span>
                    <span className="text-lg font-semibold text-blue-400">{clientAnalytics.returningClients}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-predictive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-bright">
                  <Target className="w-5 h-5 text-purple-400" />
                  Client Segments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clientAnalytics.clientSegments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-text/70">{segment.segment}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-bright">{segment.count}</span>
                        <span className="text-xs text-text/60">({segment.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-predictive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-bright">
                <Award className="w-5 h-5 text-yellow-400" />
                Top Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clientAnalytics.topClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                    <div>
                      <p className="font-medium text-bright">{client.name}</p>
                      <p className="text-sm text-text/70">{client.deals} deals • {formatCurrency(client.revenue)}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {client.lastActivity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-predictive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-bright">
                  <Plane className="w-5 h-5 text-blue-400" />
                  Popular Routes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketTrends.popularRoutes.map((route, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                      <div>
                        <p className="font-medium text-bright">{route.route}</p>
                        <p className="text-sm text-text/70">{route.bookings} bookings</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-bright">{formatCurrency(route.revenue)}</p>
                        <div className="flex items-center gap-1">
                          {route.growth > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`text-sm ${route.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {route.growth > 0 ? '+' : ''}{route.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-predictive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-bright">
                  <Award className="w-5 h-5 text-purple-400" />
                  Aircraft Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketTrends.aircraftTypes.map((aircraft, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                      <div>
                        <p className="font-medium text-bright">{aircraft.type}</p>
                        <p className="text-sm text-text/70">{aircraft.bookings} bookings</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-bright">{formatCurrency(aircraft.averagePrice)}</p>
                        <div className="flex items-center gap-1">
                          {aircraft.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : aircraft.trend === 'down' ? (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          ) : (
                            <div className="w-4 h-4 bg-text/30 rounded-full"></div>
                          )}
                          <span className={`text-sm ${
                            aircraft.trend === 'up' ? 'text-green-400' :
                            aircraft.trend === 'down' ? 'text-red-400' : 'text-text/60'
                          }`}>
                            {aircraft.trend}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="card-predictive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-bright">
                <FileText className="w-5 h-5 text-brand" />
                Custom Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-surface-2 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand/15 rounded-lg">
                        <FileText className="w-5 h-5 text-brand" />
                      </div>
                      <div>
                        <p className="font-medium text-bright">{report.name}</p>
                        <p className="text-sm text-text/70">
                          {report.type} • Last generated: {report.lastGenerated}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${
                          report.status === 'ready' ? 'bg-green-500/20 text-green-400' :
                          report.status === 'generating' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        } border-transparent`}
                      >
                        {report.status === 'ready' ? 'Ready' :
                         report.status === 'generating' ? 'Generating...' : 'Error'}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => generateReport(report.id)}
                        disabled={report.status !== 'ready'}
                        className="bg-brand hover:bg-brand-600 text-text"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        {report.status === 'ready' ? 'Download' : 'Generate'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
