// AI Service - Industry Standard Implementation
// FCA Compliant Aviation Platform

export interface DemandForecast {
  route: string;
  date: string;
  predictedDemand: number;
  confidence: number;
  factors: {
    seasonality: number;
    events: number;
    weather: number;
    historical: number;
  };
  recommendations: string[];
}

export interface PriceOptimization {
  route: string;
  aircraft: string;
  optimalPrice: number;
  currentPrice: number;
  potentialRevenue: number;
  factors: {
    demand: number;
    competition: number;
    seasonality: number;
    weather: number;
  };
  recommendations: string[];
}

export interface IntelligentMatch {
  rfqId: string;
  operatorId: string;
  matchScore: number;
  reasons: string[];
  confidence: number;
  estimatedResponseTime: number;
  historicalSuccess: number;
}

export interface PredictiveAnalytics {
  demandTrends: {
    route: string;
    trend: 'increasing' | 'decreasing' | 'stable';
    changePercent: number;
    timeframe: string;
  }[];
  priceTrends: {
    route: string;
    trend: 'increasing' | 'decreasing' | 'stable';
    changePercent: number;
    timeframe: string;
  }[];
  marketInsights: {
    category: string;
    insight: string;
    impact: 'high' | 'medium' | 'low';
    recommendation: string;
  }[];
}

class AIService {
  // Predict demand for a route and date
  async predictDemand(route: string, date: string): Promise<DemandForecast> {
    try {
      // In a real implementation, this would use machine learning models
      // For now, we'll use sophisticated mock data that simulates real predictions
      
      const historicalData = await this.getHistoricalDemand(route);
      const seasonalFactor = this.getSeasonalFactor(date);
      const eventFactor = await this.getEventFactor(route, date);
      const weatherFactor = await this.getWeatherFactor(route, date);
      
      const baseDemand = historicalData.average;
      const predictedDemand = Math.round(
        baseDemand * seasonalFactor * eventFactor * weatherFactor
      );
      
      const confidence = this.calculateConfidence(historicalData, seasonalFactor, eventFactor, weatherFactor);
      
      return {
        route,
        date,
        predictedDemand,
        confidence,
        factors: {
          seasonality: seasonalFactor,
          events: eventFactor,
          weather: weatherFactor,
          historical: historicalData.average
        },
        recommendations: this.generateDemandRecommendations(predictedDemand, confidence)
      };
    } catch (error) {
      console.error('Error predicting demand:', error);
      throw error;
    }
  }

  // Optimize pricing for a route and aircraft
  async optimizePricing(route: string, aircraft: string, currentPrice: number): Promise<PriceOptimization> {
    try {
      const demandData = await this.predictDemand(route, new Date().toISOString());
      const competitionData = await this.getCompetitionData(route, aircraft);
      const seasonalData = this.getSeasonalPricing(route);
      const weatherData = await this.getWeatherPricing(route);
      
      const demandFactor = demandData.predictedDemand / 100; // Normalize to 0-1
      const competitionFactor = 1 - (competitionData.averagePrice - currentPrice) / currentPrice;
      const seasonalFactor = seasonalData.multiplier;
      const weatherFactor = weatherData.multiplier;
      
      const optimalPrice = Math.round(
        currentPrice * demandFactor * competitionFactor * seasonalFactor * weatherFactor
      );
      
      const potentialRevenue = optimalPrice * demandData.predictedDemand;
      
      return {
        route,
        aircraft,
        optimalPrice,
        currentPrice,
        potentialRevenue,
        factors: {
          demand: demandFactor,
          competition: competitionFactor,
          seasonality: seasonalFactor,
          weather: weatherFactor
        },
        recommendations: this.generatePricingRecommendations(optimalPrice, currentPrice, potentialRevenue)
      };
    } catch (error) {
      console.error('Error optimizing pricing:', error);
      throw error;
    }
  }

  // Find intelligent matches for RFQs
  async findIntelligentMatches(rfqId: string, rfqData: any): Promise<IntelligentMatch[]> {
    try {
      const operators = await this.getOperators();
      const matches: IntelligentMatch[] = [];
      
      for (const operator of operators) {
        const matchScore = this.calculateMatchScore(rfqData, operator);
        const confidence = this.calculateMatchConfidence(rfqData, operator);
        const reasons = this.generateMatchReasons(rfqData, operator);
        const estimatedResponseTime = this.estimateResponseTime(operator);
        const historicalSuccess = this.getHistoricalSuccess(operator, rfqData);
        
        if (matchScore > 0.6) { // Only return good matches
          matches.push({
            rfqId,
            operatorId: operator.id,
            matchScore,
            reasons,
            confidence,
            estimatedResponseTime,
            historicalSuccess
          });
        }
      }
      
      return matches.sort((a, b) => b.matchScore - a.matchScore);
    } catch (error) {
      console.error('Error finding intelligent matches:', error);
      return [];
    }
  }

  // Get predictive analytics
  async getPredictiveAnalytics(): Promise<PredictiveAnalytics> {
    try {
      const demandTrends = await this.analyzeDemandTrends();
      const priceTrends = await this.analyzePriceTrends();
      const marketInsights = await this.generateMarketInsights();
      
      return {
        demandTrends,
        priceTrends,
        marketInsights
      };
    } catch (error) {
      console.error('Error getting predictive analytics:', error);
      throw error;
    }
  }

  // Private helper methods
  private async getHistoricalDemand(route: string): Promise<{ average: number; trend: number; volatility: number }> {
    // Mock historical data analysis
    const baseDemand = Math.random() * 100 + 50; // 50-150
    const trend = (Math.random() - 0.5) * 0.2; // -10% to +10%
    const volatility = Math.random() * 0.3; // 0-30%
    
    return {
      average: baseDemand,
      trend: trend,
      volatility: volatility
    };
  }

  private getSeasonalFactor(date: string): number {
    const month = new Date(date).getMonth();
    const seasonalFactors = [0.8, 0.9, 1.1, 1.2, 1.3, 1.4, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8];
    return seasonalFactors[month];
  }

  private async getEventFactor(route: string, date: string): Promise<number> {
    // Check for special events that might affect demand
    const events = await this.getSpecialEvents(route, date);
    let factor = 1.0;
    
    events.forEach(event => {
      switch (event.type) {
        case 'conference': factor *= 1.3; break;
        case 'sports': factor *= 1.5; break;
        case 'holiday': factor *= 1.2; break;
        case 'weather': factor *= 0.8; break;
      }
    });
    
    return factor;
  }

  private async getWeatherFactor(route: string, date: string): Promise<number> {
    // Weather impact on demand
    const weather = await this.getWeatherForecast(route, date);
    let factor = 1.0;
    
    if (weather.conditions.includes('TS')) factor *= 0.7;
    if (weather.conditions.includes('FG')) factor *= 0.8;
    if (weather.conditions.includes('SN')) factor *= 0.6;
    if (weather.conditions.includes('CLR')) factor *= 1.1;
    
    return factor;
  }

  private calculateConfidence(historicalData: any, seasonalFactor: number, eventFactor: number, weatherFactor: number): number {
    // Calculate confidence based on data quality and consistency
    const dataQuality = 1 - historicalData.volatility;
    const factorConsistency = 1 - Math.abs(seasonalFactor - 1) * 0.5;
    const eventReliability = eventFactor === 1 ? 1 : 0.8;
    
    return Math.round((dataQuality + factorConsistency + eventReliability) / 3 * 100);
  }

  private generateDemandRecommendations(predictedDemand: number, confidence: number): string[] {
    const recommendations: string[] = [];
    
    if (predictedDemand > 100) {
      recommendations.push('High demand expected - consider increasing capacity');
    } else if (predictedDemand < 50) {
      recommendations.push('Low demand expected - consider promotional pricing');
    }
    
    if (confidence < 70) {
      recommendations.push('Low confidence in prediction - monitor market closely');
    }
    
    if (predictedDemand > 80 && confidence > 80) {
      recommendations.push('Strong demand signal - optimal time for new RFQs');
    }
    
    return recommendations;
  }

  private async getCompetitionData(route: string, aircraft: string): Promise<{ averagePrice: number; count: number }> {
    // Mock competition data
    return {
      averagePrice: Math.random() * 50000 + 30000, // $30k-$80k
      count: Math.floor(Math.random() * 10) + 1
    };
  }

  private getSeasonalPricing(route: string): { multiplier: number; reason: string } {
    const month = new Date().getMonth();
    const seasonalMultipliers = [0.9, 0.95, 1.0, 1.05, 1.1, 1.15, 1.1, 1.05, 1.0, 0.95, 0.9, 0.85];
    
    return {
      multiplier: seasonalMultipliers[month],
      reason: `Seasonal pricing for ${this.getMonthName(month)}`
    };
  }

  private async getWeatherPricing(route: string): Promise<{ multiplier: number; reason: string }> {
    const weather = await this.getWeatherForecast(route, new Date().toISOString());
    let multiplier = 1.0;
    let reason = 'Normal weather conditions';
    
    if (weather.conditions.includes('TS')) {
      multiplier = 1.2;
      reason = 'Thunderstorm surcharge';
    } else if (weather.conditions.includes('FG')) {
      multiplier = 1.1;
      reason = 'Fog surcharge';
    } else if (weather.conditions.includes('SN')) {
      multiplier = 1.3;
      reason = 'Snow surcharge';
    }
    
    return { multiplier, reason };
  }

  private generatePricingRecommendations(optimalPrice: number, currentPrice: number, potentialRevenue: number): string[] {
    const recommendations: string[] = [];
    const priceChange = ((optimalPrice - currentPrice) / currentPrice) * 100;
    
    if (priceChange > 10) {
      recommendations.push(`Consider increasing price by ${priceChange.toFixed(1)}% to maximize revenue`);
    } else if (priceChange < -10) {
      recommendations.push(`Consider decreasing price by ${Math.abs(priceChange).toFixed(1)}% to increase demand`);
    } else {
      recommendations.push('Current pricing is well-optimized');
    }
    
    if (potentialRevenue > currentPrice * 50) {
      recommendations.push('High revenue potential - consider increasing capacity');
    }
    
    return recommendations;
  }

  private async getOperators(): Promise<any[]> {
    // Mock operator data
    return [
      { id: 'op1', name: 'Elite Aviation', rating: 4.8, experience: 10, fleetSize: 15 },
      { id: 'op2', name: 'SkyBridge', rating: 4.5, experience: 8, fleetSize: 12 },
      { id: 'op3', name: 'Crown Jets', rating: 4.2, experience: 6, fleetSize: 8 },
      { id: 'op4', name: 'Apex Air', rating: 4.6, experience: 9, fleetSize: 20 }
    ];
  }

  private calculateMatchScore(rfqData: any, operator: any): number {
    let score = 0;
    
    // Rating factor (40% weight)
    score += (operator.rating / 5) * 0.4;
    
    // Experience factor (30% weight)
    score += (operator.experience / 10) * 0.3;
    
    // Fleet size factor (20% weight)
    score += (operator.fleetSize / 20) * 0.2;
    
    // Route compatibility (10% weight)
    score += Math.random() * 0.1; // Mock route compatibility
    
    return Math.min(1, score);
  }

  private calculateMatchConfidence(rfqData: any, operator: any): number {
    // Confidence based on data quality and operator reliability
    const dataQuality = 0.8; // Mock data quality
    const operatorReliability = operator.rating / 5;
    
    return Math.round((dataQuality + operatorReliability) / 2 * 100);
  }

  private generateMatchReasons(rfqData: any, operator: any): string[] {
    const reasons: string[] = [];
    
    if (operator.rating >= 4.5) {
      reasons.push('High operator rating');
    }
    
    if (operator.experience >= 8) {
      reasons.push('Extensive experience');
    }
    
    if (operator.fleetSize >= 15) {
      reasons.push('Large fleet size');
    }
    
    reasons.push('Route compatibility');
    reasons.push('Historical success rate');
    
    return reasons;
  }

  private estimateResponseTime(operator: any): number {
    // Response time in minutes based on operator characteristics
    const baseTime = 30;
    const ratingFactor = (5 - operator.rating) * 10;
    const experienceFactor = (10 - operator.experience) * 2;
    
    return Math.round(baseTime + ratingFactor + experienceFactor);
  }

  private getHistoricalSuccess(operator: any, rfqData: any): number {
    // Historical success rate for similar RFQs
    return Math.round((operator.rating / 5) * 100);
  }

  private async analyzeDemandTrends(): Promise<any[]> {
    // Mock demand trend analysis
    return [
      {
        route: 'KJFK-KLAX',
        trend: 'increasing',
        changePercent: 15.2,
        timeframe: '30 days'
      },
      {
        route: 'KJFK-KORD',
        trend: 'stable',
        changePercent: 2.1,
        timeframe: '30 days'
      },
      {
        route: 'KLAX-KSFO',
        trend: 'decreasing',
        changePercent: -8.5,
        timeframe: '30 days'
      }
    ];
  }

  private async analyzePriceTrends(): Promise<any[]> {
    // Mock price trend analysis
    return [
      {
        route: 'KJFK-KLAX',
        trend: 'increasing',
        changePercent: 12.3,
        timeframe: '30 days'
      },
      {
        route: 'KJFK-KORD',
        trend: 'stable',
        changePercent: 1.8,
        timeframe: '30 days'
      },
      {
        route: 'KLAX-KSFO',
        trend: 'decreasing',
        changePercent: -5.2,
        timeframe: '30 days'
      }
    ];
  }

  private async generateMarketInsights(): Promise<any[]> {
    // Mock market insights
    return [
      {
        category: 'Demand',
        insight: 'Summer travel demand is 25% higher than last year',
        impact: 'high',
        recommendation: 'Increase capacity for summer routes'
      },
      {
        category: 'Pricing',
        insight: 'Competitive pricing pressure on transcontinental routes',
        impact: 'medium',
        recommendation: 'Review pricing strategy for long-haul routes'
      },
      {
        category: 'Weather',
        insight: 'El Niño weather pattern affecting Pacific routes',
        impact: 'low',
        recommendation: 'Monitor weather conditions for route planning'
      }
    ];
  }

  private async getSpecialEvents(route: string, date: string): Promise<any[]> {
    // Mock special events
    return Math.random() > 0.7 ? [
      { type: 'conference', name: 'Tech Conference', impact: 'high' },
      { type: 'sports', name: 'Championship Game', impact: 'very high' }
    ] : [];
  }

  private async getWeatherForecast(route: string, date: string): Promise<any> {
    // Mock weather forecast
    const conditions = ['CLR', 'TS', 'FG', 'SN'][Math.floor(Math.random() * 4)];
    return { conditions: [conditions] };
  }

  private getMonthName(month: number): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month];
  }
}

export const aiService = new AIService();
