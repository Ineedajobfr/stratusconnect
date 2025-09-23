// ============================================================================
// Smart Pricing Engine - AI-Powered Pricing Intelligence
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  DollarSign, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  BarChart3,
  Clock,
  MapPin,
  Plane,
  Zap
} from 'lucide-react';

interface PricingAnalysis {
  suggestedPrice: number;
  confidence: number;
  marketTrend: 'up' | 'down' | 'stable';
  factors: {
    routePopularity: number;
    seasonalDemand: number;
    competitorPricing: number;
    fuelCosts: number;
    operatorCapacity: number;
  };
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

interface SmartPricingEngineProps {
  route: string;
  aircraft: string;
  passengers: number;
  date: string;
  onPriceUpdate?: (price: number) => void;
}

export const SmartPricingEngine: React.FC<SmartPricingEngineProps> = ({
  route,
  aircraft,
  passengers,
  date,
  onPriceUpdate
}) => {
  const [analysis, setAnalysis] = useState<PricingAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketData, setMarketData] = useState<any>(null);

  useEffect(() => {
    if (route && aircraft && passengers && date) {
      analyzePricing();
    }
  }, [route, aircraft, passengers, date]);

  const analyzePricing = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with realistic data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalysis: PricingAnalysis = {
      suggestedPrice: Math.floor(Math.random() * 50000) + 50000,
      confidence: Math.floor(Math.random() * 30) + 70,
      marketTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
      factors: {
        routePopularity: Math.floor(Math.random() * 40) + 60,
        seasonalDemand: Math.floor(Math.random() * 30) + 70,
        competitorPricing: Math.floor(Math.random() * 20) + 80,
        fuelCosts: Math.floor(Math.random() * 15) + 85,
        operatorCapacity: Math.floor(Math.random() * 25) + 75
      },
      recommendations: [
        "Consider booking 2-3 weeks in advance for better pricing",
        "This route shows high demand - consider premium pricing",
        "Empty leg opportunities available for 30% savings",
        "Fuel costs are trending down - good timing for booking"
      ],
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    onPriceUpdate?.(mockAnalysis.suggestedPrice);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <BarChart3 className="w-4 h-4 text-blue-400" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-500/20 border-green-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      case 'high': return 'text-red-400 bg-red-500/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  return (
    <Card className="card-predictive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-bright">
          <Brain className="w-5 h-5 text-brand" />
          AI Pricing Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand"></div>
              <span className="text-text/70">Analyzing market conditions...</span>
            </div>
          </div>
        ) : analysis ? (
          <>
            {/* Suggested Price */}
            <div className="text-center p-4 bg-surface-2 rounded-xl border border-terminal-border">
              <div className="text-3xl font-bold text-bright mb-2">
                ${analysis.suggestedPrice.toLocaleString()}
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-text/70">AI Suggested Price</span>
                <Badge className="bg-brand/20 text-brand border-brand/30">
                  {analysis.confidence}% Confidence
                </Badge>
              </div>
              <div className="flex items-center justify-center gap-2">
                {getTrendIcon(analysis.marketTrend)}
                <span className="text-sm text-text/70 capitalize">
                  Market trending {analysis.marketTrend}
                </span>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
              <span className="text-text/70">Risk Level</span>
              <Badge className={getRiskColor(analysis.riskLevel)}>
                {analysis.riskLevel.toUpperCase()}
              </Badge>
            </div>

            {/* Market Factors */}
            <div className="space-y-3">
              <h4 className="font-semibold text-bright">Market Analysis</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(analysis.factors).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-surface-2 rounded-lg">
                    <span className="text-sm text-text/70 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-surface-1 rounded-full">
                        <div 
                          className="h-2 bg-brand rounded-full transition-all duration-500"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <span className="text-xs text-text/70 w-8">{value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h4 className="font-semibold text-bright">AI Recommendations</h4>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-surface-2 rounded-lg">
                    <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-text/80">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button 
                className="flex-1 bg-brand hover:bg-brand-600 text-text"
                onClick={() => onPriceUpdate?.(analysis.suggestedPrice)}
              >
                <Target className="w-4 h-4 mr-2" />
                Use Suggested Price
              </Button>
              <Button 
                variant="outline" 
                className="border-terminal-border text-text hover:bg-surface-2"
                onClick={analyzePricing}
              >
                <Zap className="w-4 h-4 mr-2" />
                Re-analyze
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-brand/50 mx-auto mb-4" />
            <p className="text-text/70">Enter route details to get AI pricing analysis</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
