import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, TrendingDown, BarChart3, 
  PieChart, LineChart, Activity, 
  Target, Zap, AlertCircle, 
  Calendar, Filter, RefreshCw
} from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

interface MarketTrend {
  id: string;
  route: string;
  aircraft_type: string;
  trend_data: {
    price_trend: number;
    volume_trend: number;
    demand_score: number;
    predictions: Array<{
      date: string;
      predicted_price: number;
      confidence: number;
    }>;
  };
  confidence_score: number;
  forecast_period: string;
  created_at: string;
}

interface PerformanceMetric {
  id: string;
  user_id: string;
  metric_type: string;
  metric_value: number;
  period_start: string;
  period_end: string;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function AdvancedAnalytics() {
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30d");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockPriceData = [
    { date: '2024-01', price: 45000, volume: 25, demand: 8.2 },
    { date: '2024-02', price: 47500, volume: 32, demand: 8.7 },
    { date: '2024-03', price: 46800, volume: 28, demand: 8.1 },
    { date: '2024-04', price: 49200, volume: 35, demand: 9.1 },
    { date: '2024-05', price: 51000, volume: 42, demand: 9.3 },
    { date: '2024-06', price: 48900, volume: 38, demand: 8.8 },
  ];

  const mockRouteData = [
    { route: 'NYC-LAX', deals: 45, revenue: 2250000, avg_price: 50000 },
    { route: 'MIA-NYC', deals: 32, revenue: 1440000, avg_price: 45000 },
    { route: 'LAX-SFO', deals: 28, revenue: 980000, avg_price: 35000 },
    { route: 'CHI-NYC', deals: 38, revenue: 1710000, avg_price: 45000 },
    { route: 'NYC-BOS', deals: 22, revenue: 660000, avg_price: 30000 },
  ];

  const mockAircraftPerformance = [
    { type: 'Light Jet', count: 45, value: 45, utilization: 78 },
    { type: 'Midsize Jet', count: 32, value: 32, utilization: 82 },
    { type: 'Heavy Jet', count: 18, value: 18, utilization: 85 },
    { type: 'Turboprop', count: 12, value: 12, utilization: 65 },
  ];

  useEffect(() => {
    fetchUserData();
    fetchMarketTrends();
    fetchPerformanceMetrics();
    generateMockData();
  }, [selectedRoute, selectedPeriod]);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchMarketTrends = async () => {
    try {
      const { data, error } = await supabase
        .from("market_trends")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setMarketTrends((data || []) as MarketTrend[]);
    } catch (error: any) {
      console.error("Error fetching market trends:", error);
    }
  };

  const fetchPerformanceMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("performance_metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("period_start", { ascending: false })
        .limit(100);

      if (error) throw error;
      setPerformanceMetrics(data || []);
    } catch (error: any) {
      console.error("Error fetching performance metrics:", error);
    }
  };

  const generateMockData = async () => {
    if (marketTrends.length === 0) {
      // Generate some mock market trends for demonstration
      const mockTrends = [
        {
          route: 'NYC-LAX',
          aircraft_type: 'Light Jet',
          trend_data: {
            price_trend: 12.5,
            volume_trend: 8.3,
            demand_score: 9.2,
            predictions: mockPriceData.map(d => ({
              date: d.date,
              predicted_price: d.price * 1.05,
              confidence: 0.85
            }))
          },
          confidence_score: 0.89,
          forecast_period: '6_months'
        },
        {
          route: 'MIA-NYC',
          aircraft_type: 'Midsize Jet',
          trend_data: {
            price_trend: -3.2,
            volume_trend: 15.7,
            demand_score: 8.7,
            predictions: mockPriceData.map(d => ({
              date: d.date,
              predicted_price: d.price * 0.97,
              confidence: 0.78
            }))
          },
          confidence_score: 0.82,
          forecast_period: '6_months'
        }
      ];

      try {
        const { error } = await supabase
          .from("market_trends")
          .insert(mockTrends.map(trend => ({
            route: trend.route,
            aircraft_type: trend.aircraft_type,
            trend_data: trend.trend_data,
            confidence_score: trend.confidence_score,
            forecast_period: trend.forecast_period
          })));

        if (!error) {
          setMarketTrends(mockTrends as MarketTrend[]);
        }
      } catch (error) {
        console.error("Error generating mock data:", error);
      }
    }
  };

  const refreshAnalytics = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchMarketTrends(),
        fetchPerformanceMetrics()
      ]);
      toast({
        title: "Analytics Updated",
        description: "Data has been refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendColor = (trend: number) => {
    if (trend > 5) return 'text-terminal-success';
    if (trend > 0) return 'text-terminal-warning';
    return 'text-terminal-danger';
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 
      ? <TrendingUp className="h-4 w-4" />
      : <TrendingDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Advanced Analytics</h2>
          <p className="text-slate-400">Market insights and performance analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedRoute} onValueChange={setSelectedRoute}>
            <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="all" className="text-white">All Routes</SelectItem>
              <SelectItem value="NYC-LAX" className="text-white">NYC-LAX</SelectItem>
              <SelectItem value="MIA-NYC" className="text-white">MIA-NYC</SelectItem>
              <SelectItem value="LAX-SFO" className="text-white">LAX-SFO</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-24 bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="7d" className="text-white">7D</SelectItem>
              <SelectItem value="30d" className="text-white">30D</SelectItem>
              <SelectItem value="90d" className="text-white">90D</SelectItem>
              <SelectItem value="1y" className="text-white">1Y</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshAnalytics}
            disabled={isLoading}
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Market Growth</p>
                <p className="text-2xl font-bold text-terminal-success">+12.5%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-terminal-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Deal Size</p>
                <p className="text-2xl font-bold text-white">$48.2K</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Volume Trend</p>
                <p className="text-2xl font-bold text-terminal-warning">+8.3%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-terminal-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Demand Score</p>
                <p className="text-2xl font-bold text-terminal-info">9.2</p>
              </div>
              <Target className="h-8 w-8 text-terminal-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Trends Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <LineChart className="mr-2 h-5 w-5" />
            Market Price Trends
          </CardTitle>
          <CardDescription className="text-slate-400">
            Historical pricing and volume analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={mockPriceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Avg Price ($)"
              />
              <Line 
                type="monotone" 
                dataKey="volume" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Volume"
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route Performance */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Route Performance
            </CardTitle>
            <CardDescription className="text-slate-400">
              Top performing routes by revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockRouteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="route" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }} 
                />
                <Bar dataKey="deals" fill="#10b981" name="Deals" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Aircraft Type Distribution */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Aircraft Distribution
            </CardTitle>
            <CardDescription className="text-slate-400">
              Fleet composition by aircraft type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={mockAircraftPerformance}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ type, value }) => `${type}: ${value}`}
                >
                  {mockAircraftPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }} 
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Market Trends */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Market Trend Analysis</CardTitle>
          <CardDescription className="text-slate-400">
            AI-powered market insights and predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketTrends.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">No trend data available</p>
                <p className="text-slate-500 text-sm">Market analysis will appear as data becomes available</p>
              </div>
            ) : (
              marketTrends.slice(0, 5).map((trend) => (
                <div key={trend.id} className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{trend.route}</span>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {trend.aircraft_type}
                      </Badge>
                    </div>
                    <Badge className="bg-terminal-info text-white">
                      Confidence: {(trend.confidence_score * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">Price Trend:</span>
                      <div className={`flex items-center space-x-1 ${getTrendColor(trend.trend_data.price_trend)}`}>
                        {getTrendIcon(trend.trend_data.price_trend)}
                        <span className="font-medium">
                          {trend.trend_data.price_trend > 0 ? '+' : ''}{trend.trend_data.price_trend.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">Volume:</span>
                      <div className={`flex items-center space-x-1 ${getTrendColor(trend.trend_data.volume_trend)}`}>
                        {getTrendIcon(trend.trend_data.volume_trend)}
                        <span className="font-medium">
                          {trend.trend_data.volume_trend > 0 ? '+' : ''}{trend.trend_data.volume_trend.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">Demand Score:</span>
                      <span className="text-terminal-success font-medium">
                        {trend.trend_data.demand_score.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            AI Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-terminal-success/10 border border-terminal-success/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <TrendingUp className="h-5 w-5 text-terminal-success mt-0.5" />
                <div>
                  <p className="text-terminal-success font-medium">Market Opportunity</p>
                  <p className="text-slate-300 text-sm">
                    Light jets on NYC-LAX route showing 12.5% price increase. Consider increasing capacity.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-terminal-warning/10 border border-terminal-warning/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-terminal-warning mt-0.5" />
                <div>
                  <p className="text-terminal-warning font-medium">Market Alert</p>
                  <p className="text-slate-300 text-sm">
                    Volume on MIA-NYC route increasing 15.7% but prices declining. Monitor competition.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-terminal-info/10 border border-terminal-info/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Target className="h-5 w-5 text-terminal-info mt-0.5" />
                <div>
                  <p className="text-terminal-info font-medium">Performance Tip</p>
                  <p className="text-slate-300 text-sm">
                    Your average response time is 15% faster than market average. Leverage this in negotiations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add missing import
import { DollarSign } from "lucide-react";