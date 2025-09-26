// AI Insights Widget - Industry Standard
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Lightbulb, 
  Target,
  DollarSign,
  Users,
  RefreshCw,
  Eye,
  Download
} from 'lucide-react';
import { aiService, type DemandForecast, type PriceOptimization, type PredictiveAnalytics } from '@/lib/ai-service';
import { toast } from '@/hooks/use-toast';

interface AIInsightsWidgetProps {
  className?: string;
}

export function AIInsightsWidget({ className = '' }: AIInsightsWidgetProps) {
  const [demandForecasts, setDemandForecasts] = useState<DemandForecast[]>([]);
  const [priceOptimizations, setPriceOptimizations] = useState<PriceOptimization[]>([]);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState<PredictiveAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'demand' | 'pricing' | 'analytics'>('demand');

  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    try {
      setLoading(true);
      
      // Load demand forecasts for popular routes
      const routes = ['KJFK-KLAX', 'KJFK-KORD', 'KLAX-KSFO', 'KJFK-KMIA'];
      const forecasts = await Promise.all(
        routes.map(route => aiService.predictDemand(route, new Date().toISOString()))
      );
      setDemandForecasts(forecasts);
      
      // Load price optimizations
      const optimizations = await Promise.all(
        routes.map(route => aiService.optimizePricing(route, 'Gulfstream G650', 50000))
      );
      setPriceOptimizations(optimizations);
      
      // Load predictive analytics
      const analytics = await aiService.getPredictiveAnalytics();
      setPredictiveAnalytics(analytics);
      
      toast({
        title: "AI Insights Updated",
        description: "Latest AI predictions and recommendations are ready.",
      });
    } catch (error) {
      console.error('Error loading AI insights:', error);
      toast({
        title: "AI Error",
        description: "Failed to load AI insights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-400';
      case 'decreasing': return 'text-red-400';
      case 'stable': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Card className={`terminal-card ${className}`}>
        <CardContent className="text-center py-12">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-accent" />
          <p className="text-gunmetal">Loading AI insights...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-accent" />
              AI Insights
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={loadAIInsights}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === 'demand' ? 'default' : 'outline'}
              onClick={() => setActiveTab('demand')}
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-2" />
              Demand
            </Button>
            <Button
              variant={activeTab === 'pricing' ? 'default' : 'outline'}
              onClick={() => setActiveTab('pricing')}
              className="flex-1"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Pricing
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'outline'}
              onClick={() => setActiveTab('analytics')}
              className="flex-1"
            >
              <Target className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>

          {/* Demand Forecasts */}
          {activeTab === 'demand' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Demand Forecasts</h3>
              {demandForecasts.map((forecast, index) => (
                <Card key={index} className="terminal-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-foreground">{forecast.route}</h4>
                        <p className="text-sm text-gunmetal">{forecast.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">
                          {forecast.predictedDemand}
                        </div>
                        <div className="text-sm text-gunmetal">predicted demand</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gunmetal">Confidence</span>
                        <div className="flex items-center gap-2">
                          <Progress value={forecast.confidence} className="w-20 h-2" />
                          <span className="text-sm text-foreground">{forecast.confidence}%</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gunmetal">Seasonality:</span>
                          <span className="ml-2 text-foreground">{(forecast.factors.seasonality * 100).toFixed(0)}%</span>
                        </div>
                        <div>
                          <span className="text-gunmetal">Events:</span>
                          <span className="ml-2 text-foreground">{(forecast.factors.events * 100).toFixed(0)}%</span>
                        </div>
                        <div>
                          <span className="text-gunmetal">Weather:</span>
                          <span className="ml-2 text-foreground">{(forecast.factors.weather * 100).toFixed(0)}%</span>
                        </div>
                        <div>
                          <span className="text-gunmetal">Historical:</span>
                          <span className="ml-2 text-foreground">{forecast.factors.historical.toFixed(0)}</span>
                        </div>
                      </div>
                      
                      {forecast.recommendations.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium text-foreground mb-2">Recommendations</h5>
                          <ul className="space-y-1">
                            {forecast.recommendations.map((rec, recIndex) => (
                              <li key={recIndex} className="text-xs text-accent flex items-center gap-1">
                                <Lightbulb className="w-3 h-3" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Price Optimizations */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Price Optimizations</h3>
              {priceOptimizations.map((optimization, index) => (
                <Card key={index} className="terminal-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-foreground">{optimization.route}</h4>
                        <p className="text-sm text-gunmetal">{optimization.aircraft}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">
                          {formatCurrency(optimization.optimalPrice)}
                        </div>
                        <div className="text-sm text-gunmetal">optimal price</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gunmetal">Current Price</span>
                        <span className="text-sm text-foreground">{formatCurrency(optimization.currentPrice)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gunmetal">Potential Revenue</span>
                        <span className="text-sm text-accent">{formatCurrency(optimization.potentialRevenue)}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gunmetal">Demand Factor:</span>
                          <span className="ml-2 text-foreground">{(optimization.factors.demand * 100).toFixed(0)}%</span>
                        </div>
                        <div>
                          <span className="text-gunmetal">Competition:</span>
                          <span className="ml-2 text-foreground">{(optimization.factors.competition * 100).toFixed(0)}%</span>
                        </div>
                        <div>
                          <span className="text-gunmetal">Seasonality:</span>
                          <span className="ml-2 text-foreground">{(optimization.factors.seasonality * 100).toFixed(0)}%</span>
                        </div>
                        <div>
                          <span className="text-gunmetal">Weather:</span>
                          <span className="ml-2 text-foreground">{(optimization.factors.weather * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      
                      {optimization.recommendations.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium text-foreground mb-2">Recommendations</h5>
                          <ul className="space-y-1">
                            {optimization.recommendations.map((rec, recIndex) => (
                              <li key={recIndex} className="text-xs text-accent flex items-center gap-1">
                                <Lightbulb className="w-3 h-3" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Predictive Analytics */}
          {activeTab === 'analytics' && predictiveAnalytics && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Predictive Analytics</h3>
              
              {/* Demand Trends */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Demand Trends</h4>
                <div className="space-y-2">
                  {predictiveAnalytics.demandTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-terminal-card/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(trend.trend)}
                        <span className="text-sm text-foreground">{trend.route}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${getTrendColor(trend.trend)}`}>
                          {trend.changePercent > 0 ? '+' : ''}{trend.changePercent}%
                        </span>
                        <span className="text-xs text-gunmetal">{trend.timeframe}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Trends */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Price Trends</h4>
                <div className="space-y-2">
                  {predictiveAnalytics.priceTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-terminal-card/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(trend.trend)}
                        <span className="text-sm text-foreground">{trend.route}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${getTrendColor(trend.trend)}`}>
                          {trend.changePercent > 0 ? '+' : ''}{trend.changePercent}%
                        </span>
                        <span className="text-xs text-gunmetal">{trend.timeframe}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Market Insights */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Market Insights</h4>
                <div className="space-y-2">
                  {predictiveAnalytics.marketInsights.map((insight, index) => (
                    <div key={index} className="p-3 bg-terminal-card/30 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">{insight.category}</span>
                      </div>
                      <p className="text-sm text-gunmetal mb-2">{insight.insight}</p>
                      <p className="text-xs text-accent">{insight.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
