// ============================================================================
// Market Intelligence Dashboard - Real-time Market Data & Analysis
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Globe, 
  Plane, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Zap,
  Target,
  MapPin,
  Users,
  Calendar,
  Filter,
  RefreshCw,
  Bell,
  Eye,
  Download
} from 'lucide-react';

interface MarketData {
  route: string;
  price: number;
  change: number;
  volume: number;
  availability: number;
  trend: 'up' | 'down' | 'stable';
}

interface CompetitorAnalysis {
  operator: string;
  marketShare: number;
  avgPrice: number;
  responseTime: number;
  rating: number;
  trend: 'up' | 'down' | 'stable';
}

interface MarketAlert {
  id: string;
  type: 'price' | 'availability' | 'route' | 'operator';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  action?: string;
}

export const MarketIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorAnalysis[]>([]);
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadMarketData();
    loadCompetitorData();
    loadAlerts();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadMarketData = () => {
    // Simulate real-time market data
    const mockData: MarketData[] = [
      {
        route: 'LHR → JFK',
        price: 85000,
        change: 5.2,
        volume: 45,
        availability: 78,
        trend: 'up'
      },
      {
        route: 'LAX → NRT',
        price: 120000,
        change: -2.1,
        volume: 32,
        availability: 65,
        trend: 'down'
      },
      {
        route: 'CDG → MIA',
        price: 95000,
        change: 1.8,
        volume: 28,
        availability: 82,
        trend: 'up'
      },
      {
        route: 'FRA → LAX',
        price: 110000,
        change: 0.0,
        volume: 38,
        availability: 71,
        trend: 'stable'
      },
      {
        route: 'JFK → LHR',
        price: 82000,
        change: 3.5,
        volume: 52,
        availability: 85,
        trend: 'up'
      }
    ];
    setMarketData(mockData);
  };

  const loadCompetitorData = () => {
    const mockCompetitors: CompetitorAnalysis[] = [
      {
        operator: 'Elite Aviation',
        marketShare: 23.5,
        avgPrice: 85000,
        responseTime: 15,
        rating: 4.8,
        trend: 'up'
      },
      {
        operator: 'SkyBridge',
        marketShare: 18.2,
        avgPrice: 78000,
        responseTime: 22,
        rating: 4.6,
        trend: 'stable'
      },
      {
        operator: 'Prime Wings',
        marketShare: 15.8,
        avgPrice: 92000,
        responseTime: 18,
        rating: 4.7,
        trend: 'down'
      },
      {
        operator: 'Global Air',
        marketShare: 12.3,
        avgPrice: 75000,
        responseTime: 25,
        rating: 4.4,
        trend: 'up'
      }
    ];
    setCompetitors(mockCompetitors);
  };

  const loadAlerts = () => {
    const mockAlerts: MarketAlert[] = [
      {
        id: '1',
        type: 'price',
        title: 'Price Drop Alert',
        description: 'Gulfstream G650 on LHR-JFK route dropped 12% to $75,000',
        priority: 'high',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        action: 'View Details'
      },
      {
        id: '2',
        type: 'availability',
        title: 'New Empty Leg',
        description: 'Citation X available for JFK-LAX tomorrow at 40% discount',
        priority: 'medium',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        action: 'Book Now'
      },
      {
        id: '3',
        type: 'operator',
        title: 'New Operator Added',
        description: 'Premium Aviation joined the platform with 5 Gulfstream aircraft',
        priority: 'low',
        timestamp: new Date(Date.now() - 1000 * 60 * 45)
      }
    ];
    setAlerts(mockAlerts);
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadMarketData();
    loadCompetitorData();
    loadAlerts();
    setIsRefreshing(false);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <BarChart3 className="w-4 h-4 text-blue-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-bright">Market Intelligence</h2>
          <p className="text-text/70">Real-time market data and competitive analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
            className="border-terminal-border text-text hover:bg-surface-2"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-terminal-border text-text hover:bg-surface-2"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-surface-2">
          <TabsTrigger value="overview" className="data-[state=active]:bg-brand data-[state=active]:text-text">
            Overview
          </TabsTrigger>
          <TabsTrigger value="routes" className="data-[state=active]:bg-brand data-[state=active]:text-text">
            Routes
          </TabsTrigger>
          <TabsTrigger value="competitors" className="data-[state=active]:bg-brand data-[state=active]:text-text">
            Competitors
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-brand data-[state=active]:text-text">
            Alerts
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="card-predictive">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-text/70">Market Growth</p>
                    <p className="text-xl font-bold text-bright">+12.5%</p>
                    <p className="text-xs text-green-400">vs last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-predictive">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Plane className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-text/70">Active Routes</p>
                    <p className="text-xl font-bold text-bright">247</p>
                    <p className="text-xs text-blue-400">+8 this week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-predictive">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-text/70">Avg Price</p>
                    <p className="text-xl font-bold text-bright">$89K</p>
                    <p className="text-xs text-yellow-400">+2.3% this week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-predictive">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-text/70">Operators</p>
                    <p className="text-xl font-bold text-bright">156</p>
                    <p className="text-xs text-purple-400">+3 this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Trends Chart */}
          <Card className="card-predictive">
            <CardHeader>
              <CardTitle className="text-bright">Market Trends (7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-surface-2 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-brand/50 mx-auto mb-2" />
                  <p className="text-text/70">Interactive chart would be here</p>
                  <p className="text-xs text-text/50">Integration with charting library</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-4">
          <Card className="card-predictive">
            <CardHeader>
              <CardTitle className="text-bright">Popular Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketData.map((route, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-brand" />
                      <div>
                        <p className="font-medium text-text">{route.route}</p>
                        <p className="text-sm text-text/70">
                          {route.volume} flights • {route.availability}% available
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-text">${route.price.toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(route.trend)}
                          <span className={`text-xs ${route.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {route.change >= 0 ? '+' : ''}{route.change}%
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-brand/30 text-brand hover:bg-brand/10">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitors Tab */}
        <TabsContent value="competitors" className="space-y-4">
          <Card className="card-predictive">
            <CardHeader>
              <CardTitle className="text-bright">Competitor Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitors.map((competitor, index) => (
                  <div key={index} className="p-4 bg-surface-2 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand/20 rounded-full flex items-center justify-center">
                          <Plane className="w-5 h-5 text-brand" />
                        </div>
                        <div>
                          <p className="font-medium text-text">{competitor.operator}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(competitor.rating)
                                      ? 'text-yellow-400'
                                      : 'text-gray-400'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-text/70">{competitor.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-text/70">Market Share</p>
                          <p className="font-bold text-text">{competitor.marketShare}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-text/70">Avg Price</p>
                          <p className="font-bold text-text">${competitor.avgPrice.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-text/70">Response</p>
                          <p className="font-bold text-text">{competitor.responseTime}m</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(competitor.trend)}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-surface-1 rounded-full h-2">
                      <div
                        className="bg-brand h-2 rounded-full transition-all duration-500"
                        style={{ width: `${competitor.marketShare}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card className="card-predictive">
            <CardHeader>
              <CardTitle className="text-bright">Market Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 bg-surface-2 rounded-lg border border-terminal-border">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-brand/20 rounded-lg">
                        <Bell className="w-4 h-4 text-brand" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-text">{alert.title}</h4>
                          <Badge className={getPriorityColor(alert.priority)}>
                            {alert.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-text/70 mb-2">{alert.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-text/50">
                            {alert.timestamp.toLocaleTimeString()}
                          </span>
                          {alert.action && (
                            <Button size="sm" variant="outline" className="border-brand/30 text-brand hover:bg-brand/10">
                              {alert.action}
                            </Button>
                          )}
                        </div>
                      </div>
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
