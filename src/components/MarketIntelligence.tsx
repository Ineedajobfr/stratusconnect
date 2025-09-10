import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, TrendingDown, Minus, BarChart3, Activity, 
  Globe, DollarSign, MapPin, Plane, Calendar, Users,
  Target, Zap, ArrowUp, ArrowDown, AlertTriangle
} from "lucide-react";

interface MarketAnalytics {
  id: string;
  route: string;
  aircraft_type: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  listing_count: number;
  demand_score: number;
  trend_direction: 'up' | 'down' | 'stable';
  created_at: string;
}

interface RouteInsight {
  route: string;
  totalVolume: number;
  averagePrice: number;
  priceChange: number;
  demandLevel: 'high' | 'medium' | 'low';
  competitorCount: number;
}

interface AircraftTypeAnalysis {
  aircraft_type: string;
  marketShare: number;
  avgUtilization: number;
  priceRange: { min: number; max: number; avg: number };
  demandTrend: 'up' | 'down' | 'stable';
}

export default function MarketIntelligence() {
  const [analytics, setAnalytics] = useState<MarketAnalytics[]>([]);
  const [routeInsights, setRouteInsights] = useState<RouteInsight[]>([]);
  const [aircraftAnalysis, setAircraftAnalysis] = useState<AircraftTypeAnalysis[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [marketSummary, setMarketSummary] = useState({
    totalListings: 0,
    avgPriceChange: 0,
    hotRoutes: 0,
    marketActivity: 0
  });

  useEffect(() => {
    fetchMarketData();
    generateMockAnalytics(); // Generate some mock data for demonstration
  }, [selectedTimeframe, selectedRegion, fetchMarketData, generateMockAnalytics]);

  const fetchMarketData = useCallback(async () => {
              try {
                // Fetch real marketplace data
                const { data: listings } = await supabase
                  .from("marketplace_listings")
                  .select(`
          *,
          aircraft:aircraft_id (aircraft_type, manufacturer, model)
        `)
                  .eq("status", "active");

                // Process real data into analytics
                if (listings) {
                  processListingsIntoAnalytics(listings);
                }

                // Fetch existing analytics
                const { data: analyticsData } = await supabase
                  .from("market_analytics")
                  .select("*")
                  .order("created_at", { ascending: false })
                  .limit(50);

                setAnalytics((analyticsData || []) as MarketAnalytics[]);
              } catch (error) {
                console.error("Error fetching market data:", error);
              } finally {
                setLoading(false);
              }
            }, [data, listings, from, select, eq, analyticsData, order, ascending, limit, MarketAnalytics]);

  const processListingsIntoAnalytics = (listings: Record<string, unknown>[]) => {
    const routeMap = new Map<string, Record<string, unknown>[]>();
    const aircraftMap = new Map<string, Record<string, unknown>[]>();

    listings.forEach(listing => {
      const route = `${listing.departure_location}-${listing.destination}`;
      const aircraftType = listing.aircraft?.aircraft_type || 'Unknown';

      if (!routeMap.has(route)) routeMap.set(route, []);
      if (!aircraftMap.has(aircraftType)) aircraftMap.set(aircraftType, []);

      routeMap.get(route)!.push(listing);
      aircraftMap.get(aircraftType)!.push(listing);
    });

    // Generate route insights
    const insights: RouteInsight[] = Array.from(routeMap.entries()).map(([route, routeListings]) => {
      const prices = routeListings.map(l => l.asking_price);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      
      return {
        route,
        totalVolume: routeListings.length,
        averagePrice: avgPrice,
        priceChange: (Math.random() - 0.5) * 20, // Mock price change
        demandLevel: (routeListings.length > 5 ? 'high' : routeListings.length > 2 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
        competitorCount: new Set(routeListings.map(l => l.operator_id)).size
      };
    }).sort((a, b) => b.totalVolume - a.totalVolume);

    // Generate aircraft analysis
    const analysis: AircraftTypeAnalysis[] = Array.from(aircraftMap.entries()).map(([aircraft_type, typeListings]) => {
      const prices = typeListings.map(l => l.asking_price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

      return {
        aircraft_type,
        marketShare: (typeListings.length / listings.length) * 100,
        avgUtilization: Math.random() * 80 + 20, // Mock utilization
        priceRange: { min: minPrice, max: maxPrice, avg: avgPrice },
        demandTrend: (Math.random() > 0.5 ? 'up' : Math.random() > 0.25 ? 'stable' : 'down') as 'up' | 'down' | 'stable'
      };
    }).sort((a, b) => b.marketShare - a.marketShare);

      setRouteInsights(insights.slice(0, 10) as RouteInsight[]);
      setAircraftAnalysis(analysis.slice(0, 8) as AircraftTypeAnalysis[]);

    // Update market summary
    setMarketSummary({
      totalListings: listings.length,
      avgPriceChange: insights.reduce((acc, insight) => acc + insight.priceChange, 0) / insights.length,
      hotRoutes: insights.filter(i => i.demandLevel === 'high').length,
      marketActivity: listings.filter(l => 
        new Date(l.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length
    });
  };

  const generateMockAnalytics = useCallback(async () => {
              // Generate some mock analytics for demonstration
              const mockRoutes = ['KJFK-KLAX', 'KBOS-KMIA', 'KORD-KLAS', 'KATL-KPHX', 'KSEA-KSAN'];
              const mockAircraftTypes = ['Light Jet', 'Mid-Size Jet', 'Heavy Jet', 'Turboprop'];

              const mockAnalytics: MarketAnalytics[] = [];
              
              mockRoutes.forEach(route => {
                mockAircraftTypes.forEach(aircraft_type => {
                  const basePrice = Math.random() * 50000 + 25000;
                  mockAnalytics.push({
                    id: `mock-${route}-${aircraft_type}`,
                    route,
                    aircraft_type,
                    avg_price: basePrice,
                    min_price: basePrice * 0.8,
                    max_price: basePrice * 1.2,
                    listing_count: Math.floor(Math.random() * 20) + 1,
                    demand_score: Math.random() * 10,
                    trend_direction: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down',
                    created_at: new Date().toISOString()
                  });
                });
              });

              setAnalytics(prev => [...prev, ...mockAnalytics].slice(0, 50));
            }, [MarketAnalytics, forEach, random, push, id, avg_price, min_price, max_price, listing_count, floor, demand_score, trend_direction, created_at, toISOString, slice]);

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-terminal-success" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-terminal-danger" />;
      default: return <Minus className="h-4 w-4 text-slate-400" />;
    }
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-terminal-success/20 text-terminal-success border-terminal-success/30';
      case 'medium': return 'bg-terminal-warning/20 text-terminal-warning border-terminal-warning/30';
      default: return 'bg-slate-600/20 text-slate-400 border-slate-600/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Market Intelligence</h2>
          <p className="text-slate-400">Advanced analytics and market insights</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="7d" className="text-white">7 Days</SelectItem>
              <SelectItem value="30d" className="text-white">30 Days</SelectItem>
              <SelectItem value="90d" className="text-white">90 Days</SelectItem>
              <SelectItem value="1y" className="text-white">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="all" className="text-white">All Regions</SelectItem>
              <SelectItem value="northeast" className="text-white">Northeast</SelectItem>
              <SelectItem value="southeast" className="text-white">Southeast</SelectItem>
              <SelectItem value="west" className="text-white">West Coast</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Market Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-slate-400">Total Listings</p>
                <p className="text-2xl font-bold text-white">{marketSummary.totalListings}</p>
                <p className="text-xs text-terminal-success">+12% vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-terminal-success" />
              <div>
                <p className="text-sm text-slate-400">Price Trend</p>
                <p className="text-2xl font-bold text-white">
                  {marketSummary.avgPriceChange > 0 ? '+' : ''}{marketSummary.avgPriceChange.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-400">Average change</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-terminal-warning" />
              <div>
                <p className="text-sm text-slate-400">Hot Routes</p>
                <p className="text-2xl font-bold text-white">{marketSummary.hotRoutes}</p>
                <p className="text-xs text-terminal-warning">High demand</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-terminal-info" />
              <div>
                <p className="text-sm text-slate-400">24h Activity</p>
                <p className="text-2xl font-bold text-white">{marketSummary.marketActivity}</p>
                <p className="text-xs text-terminal-info">New listings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="routes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-700">
          <TabsTrigger value="routes" className="text-white data-[state=active]:bg-primary">
            Route Analysis
          </TabsTrigger>
          <TabsTrigger value="aircraft" className="text-white data-[state=active]:bg-primary">
            Aircraft Types
          </TabsTrigger>
          <TabsTrigger value="pricing" className="text-white data-[state=active]:bg-primary">
            Pricing Trends
          </TabsTrigger>
          <TabsTrigger value="forecasting" className="text-white data-[state=active]:bg-primary">
            Demand Forecast
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Top Routes by Volume</CardTitle>
              <CardDescription className="text-slate-400">
                Most active charter routes with pricing and demand insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routeInsights.map((insight) => (
                  <div key={insight.route} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="text-white font-medium">{insight.route}</h4>
                        <p className="text-sm text-slate-400">
                          {insight.totalVolume} listings • {insight.competitorCount} operators
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-terminal-success font-bold">
                          ${Math.round(insight.averagePrice).toLocaleString()}
                        </span>
                        <div className="flex items-center space-x-1">
                          {insight.priceChange > 0 ? (
                            <ArrowUp className="h-3 w-3 text-terminal-success" />
                          ) : (
                            <ArrowDown className="h-3 w-3 text-terminal-danger" />
                          )}
                          <span className={`text-xs ${
                            insight.priceChange > 0 ? 'text-terminal-success' : 'text-terminal-danger'
                          }`}>
                            {Math.abs(insight.priceChange).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <Badge className={getDemandColor(insight.demandLevel)}>
                        {insight.demandLevel} demand
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aircraft" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Aircraft Type Analysis</CardTitle>
              <CardDescription className="text-slate-400">
                Market share and pricing analysis by aircraft category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aircraftAnalysis.map((analysis) => (
                  <div key={analysis.aircraft_type} className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Plane className="h-4 w-4 text-primary" />
                        <h4 className="text-white font-medium">{analysis.aircraft_type}</h4>
                      </div>
                      {getTrendIcon(analysis.demandTrend)}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Market Share:</span>
                        <span className="text-white">{analysis.marketShare.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Avg. Utilization:</span>
                        <span className="text-white">{analysis.avgUtilization.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Price Range:</span>
                        <span className="text-terminal-success">
                          ${Math.round(analysis.priceRange.min / 1000)}K - ${Math.round(analysis.priceRange.max / 1000)}K
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Pricing Intelligence</CardTitle>
              <CardDescription className="text-slate-400">
                Market-wide pricing trends and opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-4 w-4 text-terminal-success" />
                    <h4 className="text-white font-medium">Competitive Pricing</h4>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">
                    Routes where you can compete effectively
                  </p>
                  <div className="space-y-1">
                    {routeInsights.slice(0, 3).map((route) => (
                      <div key={route.route} className="flex justify-between text-xs">
                        <span className="text-slate-300">{route.route}</span>
                        <span className="text-terminal-success">
                          ${Math.round(route.averagePrice / 1000)}K
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-terminal-warning" />
                    <h4 className="text-white font-medium">Price Alerts</h4>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">
                    Significant price movements detected
                  </p>
                  <div className="space-y-1">
                    {analytics.filter(a => Math.abs(Number(a.demand_score)) > 7).slice(0, 3).map((alert) => (
                      <div key={alert.id} className="flex justify-between text-xs">
                        <span className="text-slate-300">{alert.route}</span>
                        <span className="text-terminal-warning">
                          {getTrendIcon(alert.trend_direction)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-terminal-info" />
                    <h4 className="text-white font-medium">Market Opportunities</h4>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">
                    Underserved routes with high demand
                  </p>
                  <div className="space-y-1">
                    {routeInsights.filter(r => r.competitorCount < 3).slice(0, 3).map((opp) => (
                      <div key={opp.route} className="flex justify-between text-xs">
                        <span className="text-slate-300">{opp.route}</span>
                        <span className="text-terminal-info">
                          {opp.competitorCount} ops
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Demand Forecasting</CardTitle>
              <CardDescription className="text-slate-400">
                AI-powered predictions for market demand and pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-4">7-Day Forecast</h4>
                  <div className="space-y-3">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                      const demandLevel = Math.random() * 100;
                      const isHigh = demandLevel > 70;
                      const isMedium = demandLevel > 40;
                      
                      return (
                        <div key={day} className="flex items-center justify-between">
                          <span className="text-slate-300">{day}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-slate-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  isHigh ? 'bg-terminal-success' : 
                                  isMedium ? 'bg-terminal-warning' : 'bg-slate-500'
                                }`}
                                style={{ width: `${demandLevel}%` }}
                              />
                            </div>
                            <span className={`text-xs ${
                              isHigh ? 'text-terminal-success' : 
                              isMedium ? 'text-terminal-warning' : 'text-slate-400'
                            }`}>
                              {demandLevel.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-4">Market Predictions</h4>
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-700/30 rounded">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-terminal-success" />
                        <span className="text-white text-sm font-medium">Peak Season Approaching</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Expect 25% increase in demand over next 30 days
                      </p>
                    </div>

                    <div className="p-3 bg-slate-700/30 rounded">
                      <div className="flex items-center space-x-2 mb-1">
                        <DollarSign className="h-4 w-4 text-terminal-warning" />
                        <span className="text-white text-sm font-medium">Price Optimization</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Consider 8-12% premium on KJFK-KLAX route
                      </p>
                    </div>

                    <div className="p-3 bg-slate-700/30 rounded">
                      <div className="flex items-center space-x-2 mb-1">
                        <Users className="h-4 w-4 text-terminal-info" />
                        <span className="text-white text-sm font-medium">New Market Segment</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Corporate shuttle demand rising in Southeast
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}