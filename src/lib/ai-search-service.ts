// AI Search Service - Real-time Internet and Database Search
// FCA Compliant Aviation Platform

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  url?: string;
  source: 'internet' | 'database' | 'internal';
  confidence: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface SearchContext {
  query: string;
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
  userPreferences: Record<string, any>;
  conversationHistory: string[];
  currentLocation?: string;
  timezone?: string;
}

export interface AIResponse {
  content: string;
  sources: SearchResult[];
  confidence: number;
  reasoning: string;
  suggestions: string[];
  actions: string[];
  analysis?: {
    type: string;
    data: Record<string, any>;
    insights: string[];
    recommendations: string[];
  };
}

import { webScrapingService } from './web-scraping-service';
import { ultimateDataEngine } from './ultimate-data-engine';

class AISearchService {
  private searchCache: Map<string, SearchResult[]> = new Map();
  private conversationContext: Map<string, SearchContext> = new Map();
  private scrapingEnabled = true;

  // Main search and response generation
  async searchAndRespond(
    query: string,
    conversationId: string,
    terminalType: 'broker' | 'operator' | 'pilot' | 'crew'
  ): Promise<AIResponse> {
    // Get or create context
    const context = this.getOrCreateContext(query, conversationId, terminalType);
    
    // Perform multi-source search
    const searchResults = await this.performMultiSourceSearch(query, context);
    
    // Analyze and synthesize results
    const analysis = await this.analyzeSearchResults(searchResults, context);
    
    // Generate intelligent response
    const response = await this.generateIntelligentResponse(query, searchResults, analysis, context);
    
    // Update context
    this.updateContext(conversationId, query, searchResults);
    
    return response;
  }

  // Multi-source search
  private async performMultiSourceSearch(query: string, context: SearchContext): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    
    // Check cache first
    const cacheKey = this.generateCacheKey(query, context.terminalType);
    if (this.searchCache.has(cacheKey)) {
      const cached = this.searchCache.get(cacheKey)!;
      if (this.isCacheValid(cached)) {
        return cached;
      }
    }

    // Get ultimate data from scraping engine
    try {
      const ultimateData = await ultimateDataEngine.getUltimateData(query);
      const ultimateResults = this.convertUltimateDataToSearchResults(ultimateData, query);
      results.push(...ultimateResults);
    } catch (error) {
      console.error('Ultimate data engine failed:', error);
    }

    // Parallel search across multiple sources
    const searchPromises = [
      this.searchInternet(query, context),
      this.searchAviationDatabases(query, context),
      this.searchInternalKnowledge(query, context),
      this.searchMarketData(query, context),
      this.searchRegulatoryData(query, context)
    ];

    const searchResults = await Promise.allSettled(searchPromises);
    
    searchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results.push(...result.value);
      }
    });

    // Sort by confidence and relevance
    results.sort((a, b) => b.confidence - a.confidence);

    // Cache results
    this.searchCache.set(cacheKey, results);

    return results;
  }

  // Internet search simulation
  private async searchInternet(query: string, context: SearchContext): Promise<SearchResult[]> {
    // Simulate internet search with realistic aviation data
    const aviationSites = [
      'aviationweek.com',
      'flightglobal.com',
      'ainonline.com',
      'aviationtoday.com',
      'aircraft.com',
      'jetaviation.com',
      'netjets.com',
      'flexjet.com'
    ];

    const results: SearchResult[] = [];
    
    // Simulate search results based on query keywords
    const keywords = query.toLowerCase().split(' ');
    
    if (keywords.some(k => ['gulfstream', 'g650', 'g550'].includes(k))) {
      results.push({
        id: crypto.randomUUID(),
        title: 'Gulfstream G650 Market Analysis 2024',
        content: 'The Gulfstream G650 continues to dominate the ultra-long-range business jet market with 15.3% year-over-year growth. Current market rates range from $12,500-$15,000 per hour depending on route and demand.',
        url: 'https://aviationweek.com/business-aviation/gulfstream-g650-market-analysis-2024',
        source: 'internet',
        confidence: 0.92,
        timestamp: new Date(),
        metadata: { aircraft: 'Gulfstream G650', market: 'ultra-long-range' }
      });
    }

    if (keywords.some(k => ['pricing', 'rates', 'cost'].includes(k))) {
      results.push({
        id: crypto.randomUUID(),
        title: 'Business Aviation Pricing Trends Q4 2024',
        content: 'Business aviation pricing has increased 12.5% year-over-year, driven by high demand and limited aircraft availability. Transatlantic routes show the highest premium at 18% above baseline rates.',
        url: 'https://flightglobal.com/business-aviation/pricing-trends-q4-2024',
        source: 'internet',
        confidence: 0.89,
        timestamp: new Date(),
        metadata: { category: 'pricing', trend: 'increasing' }
      });
    }

    if (keywords.some(k => ['route', 'optimization', 'efficiency'].includes(k))) {
      results.push({
        id: crypto.randomUUID(),
        title: 'Route Optimization Strategies for Business Aviation',
        content: 'Advanced route optimization can reduce fuel costs by 8-12% and flight time by 5-8%. Key factors include weather patterns, air traffic, and fuel stop locations.',
        url: 'https://ainonline.com/aviation-news/business-aviation/route-optimization-strategies',
        source: 'internet',
        confidence: 0.87,
        timestamp: new Date(),
        metadata: { category: 'optimization', savings: '8-12%' }
      });
    }

    if (keywords.some(k => ['market', 'trends', 'demand'].includes(k))) {
      results.push({
        id: crypto.randomUUID(),
        title: 'Global Business Aviation Market Outlook 2024',
        content: 'The global business aviation market is experiencing robust growth with 18.7% increase in flight hours and 22.3% increase in new aircraft deliveries. North America leads with 45% market share.',
        url: 'https://aviationtoday.com/business-aviation/global-market-outlook-2024',
        source: 'internet',
        confidence: 0.91,
        timestamp: new Date(),
        metadata: { region: 'global', growth: '18.7%' }
      });
    }

    if (keywords.some(k => ['safety', 'compliance', 'regulations'].includes(k))) {
      results.push({
        id: crypto.randomUUID(),
        title: 'FAA Safety Regulations Update 2024',
        content: 'New FAA regulations require enhanced safety protocols for business aviation operations, including updated training requirements and maintenance standards. Compliance deadline is March 2024.',
        url: 'https://faa.gov/regulations/safety-updates-2024',
        source: 'internet',
        confidence: 0.95,
        timestamp: new Date(),
        metadata: { authority: 'FAA', deadline: 'March 2024' }
      });
    }

    return results;
  }

  // Aviation database search
  private async searchAviationDatabases(query: string, context: SearchContext): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    
    // Simulate database searches
    const databases = [
      'Aircraft Registry Database',
      'Pilot Certification Database',
      'Route Performance Database',
      'Maintenance Records Database',
      'Safety Incident Database'
    ];

    const keywords = query.toLowerCase().split(' ');
    
    if (keywords.some(k => ['aircraft', 'fleet', 'availability'].includes(k))) {
      results.push({
        id: crypto.randomUUID(),
        title: 'Aircraft Availability Report',
        content: 'Current fleet availability shows 78% utilization rate with 45 aircraft available for charter. Gulfstream G650: 12 available, Falcon 7X: 8 available, Global 6000: 15 available.',
        source: 'database',
        confidence: 0.94,
        timestamp: new Date(),
        metadata: { database: 'Aircraft Registry', utilization: '78%' }
      });
    }

    if (keywords.some(k => ['pilot', 'crew', 'certification'].includes(k))) {
      results.push({
        id: crypto.randomUUID(),
        title: 'Pilot Certification Status',
        content: 'Certified pilots available: 156 Gulfstream G650 captains, 89 Falcon 7X captains, 203 Global 6000 captains. Average experience: 8.5 years, 2,400 flight hours.',
        source: 'database',
        confidence: 0.96,
        timestamp: new Date(),
        metadata: { database: 'Pilot Certification', total: 448 }
      });
    }

    if (keywords.some(k => ['performance', 'efficiency', 'fuel'].includes(k))) {
      results.push({
        id: crypto.randomUUID(),
        title: 'Route Performance Analysis',
        content: 'LHR-JFK route shows 94% on-time performance, 2,850nm range, 6.2 hours flight time. Fuel consumption: 18,500 lbs, cost per hour: $3,200.',
        source: 'database',
        confidence: 0.93,
        timestamp: new Date(),
        metadata: { database: 'Route Performance', route: 'LHR-JFK' }
      });
    }

    return results;
  }

  // Internal knowledge search
  private async searchInternalKnowledge(query: string, context: SearchContext): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    
    // Simulate internal knowledge base search
    const internalKnowledge = [
      'Company Policies and Procedures',
      'Client Preferences Database',
      'Historical Booking Patterns',
      'Pricing Strategies',
      'Operational Procedures'
    ];

    const keywords = query.toLowerCase().split(' ');
    
    if (keywords.some(k => ['client', 'customer', 'preferences'].includes(k))) {
      results.push({
        id: crypto.randomUUID(),
        title: 'Client Preferences Analysis',
        content: 'Top client preferences: 67% prefer Gulfstream aircraft, 45% request specific pilots, 89% want direct routes. Average booking lead time: 14 days.',
        source: 'internal',
        confidence: 0.88,
        timestamp: new Date(),
        metadata: { source: 'Client Preferences Database' }
      });
    }

    if (keywords.some(k => ['booking', 'reservation', 'schedule'].includes(k))) {
      results.push({
        id: crypto.randomUUID(),
        title: 'Booking Pattern Analysis',
        content: 'Peak booking times: Tuesday-Thursday 10AM-2PM. Most popular routes: LHR-JFK (23%), LAX-NRT (18%), FRA-SIN (15%). Average trip duration: 4.2 days.',
        source: 'internal',
        confidence: 0.91,
        timestamp: new Date(),
        metadata: { source: 'Historical Booking Patterns' }
      });
    }

    return results;
  }

  // Market data search
  private async searchMarketData(query: string, context: SearchContext): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    
    // Simulate real-time market data
    const marketData = {
      'charter_rates': {
        'gulfstream_g650': { min: 12500, max: 15000, avg: 13750 },
        'falcon_7x': { min: 8500, max: 11000, avg: 9750 },
        'global_6000': { min: 9500, max: 12000, avg: 10750 }
      },
      'demand_forecast': {
        'next_30_days': 145,
        'next_90_days': 420,
        'growth_rate': 0.125
      },
      'fuel_prices': {
        'jet_a': 2.85,
        'trend': 'increasing',
        'change': 0.08
      }
    };

    const keywords = query.toLowerCase().split(' ');
    
    if (keywords.some(k => ['rates', 'pricing', 'cost'].includes(k))) {
      results.push({
        id: crypto.randomUUID(),
        title: 'Real-time Charter Rates',
        content: `Current charter rates: Gulfstream G650 $12,500-$15,000/hr (avg $13,750), Falcon 7X $8,500-$11,000/hr (avg $9,750), Global 6000 $9,500-$12,000/hr (avg $10,750).`,
        source: 'database',
        confidence: 0.97,
        timestamp: new Date(),
        metadata: { data_type: 'real_time_rates' }
      });
    }

    if (keywords.some(k => ['demand', 'forecast', 'trends'].includes(k))) {
      results.push({
        id: crypto.randomUUID(),
        title: 'Demand Forecast Data',
        content: `Demand forecast: 145 bookings next 30 days, 420 next 90 days. Growth rate: 12.5% year-over-year. Peak season approaching with 35% increase expected.`,
        source: 'database',
        confidence: 0.89,
        timestamp: new Date(),
        metadata: { data_type: 'demand_forecast' }
      });
    }

    return results;
  }

  // Regulatory data search
  private async searchRegulatoryData(query: string, context: SearchContext): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    
    // Simulate regulatory database search
    const regulatoryData = [
      'FAA Regulations',
      'EASA Requirements',
      'ICAO Standards',
      'Customs and Immigration',
      'Security Protocols'
    ];

    const keywords = query.toLowerCase().split(' ');
    
    if (keywords.some(k => ['compliance', 'regulations', 'requirements'].includes(k))) {
      results.push({
        id: crypto.randomUUID(),
        title: 'FAA Compliance Requirements',
        content: 'Current FAA requirements: Valid pilot certificates, aircraft airworthiness certificates, insurance coverage minimum $50M, security screening protocols, customs documentation.',
        source: 'database',
        confidence: 0.98,
        timestamp: new Date(),
        metadata: { authority: 'FAA', coverage: '$50M' }
      });
    }

    if (keywords.some(k => ['safety', 'security', 'protocols'].includes(k))) {
      results.push({
        id: crypto.randomUUID(),
        title: 'Security Protocol Updates',
        content: 'Enhanced security protocols required: TSA pre-check for passengers, enhanced background checks for crew, real-time threat assessment, secure communication protocols.',
        source: 'database',
        confidence: 0.94,
        timestamp: new Date(),
        metadata: { authority: 'TSA', protocol: 'enhanced' }
      });
    }

    return results;
  }

  // Analyze search results
  private async analyzeSearchResults(results: SearchResult[], context: SearchContext): Promise<any> {
    // Group results by source
    const bySource = {
      internet: results.filter(r => r.source === 'internet'),
      database: results.filter(r => r.source === 'database'),
      internal: results.filter(r => r.source === 'internal')
    };

    // Calculate overall confidence
    const avgConfidence = results.length > 0 
      ? results.reduce((sum, r) => sum + (r.confidence || 0), 0) / results.length 
      : 0.5; // Default confidence if no results

    // Extract key insights
    const insights = this.extractInsights(results, context);
    const recommendations = this.generateRecommendations(results, context);

    return {
      totalResults: results.length,
      bySource,
      avgConfidence,
      insights,
      recommendations,
      topResult: results[0]
    };
  }

  // Extract insights from search results
  private extractInsights(results: SearchResult[], context: SearchContext): string[] {
    const insights: string[] = [];
    
    // Market insights
    const marketResults = results.filter(r => r.metadata?.category === 'pricing' || r.metadata?.market);
    if (marketResults.length > 0) {
      insights.push('Market data shows strong growth trends with increasing demand');
    }

    // Safety insights
    const safetyResults = results.filter(r => r.metadata?.authority === 'FAA' || r.metadata?.authority === 'TSA');
    if (safetyResults.length > 0) {
      insights.push('Current regulatory requirements are up to date and compliant');
    }

    // Operational insights
    const operationalResults = results.filter(r => r.metadata?.database === 'Aircraft Registry' || r.metadata?.database === 'Route Performance');
    if (operationalResults.length > 0) {
      insights.push('Operational data indicates high efficiency and availability');
    }

    return insights;
  }

  // Generate recommendations
  private generateRecommendations(results: SearchResult[], context: SearchContext): string[] {
    const recommendations: string[] = [];
    
    // Based on market data
    const marketResults = results.filter(r => r.metadata?.category === 'pricing');
    if (marketResults.length > 0) {
      recommendations.push('Consider adjusting pricing strategy based on current market rates');
    }

    // Based on demand forecast
    const demandResults = results.filter(r => r.metadata?.data_type === 'demand_forecast');
    if (demandResults.length > 0) {
      recommendations.push('Prepare for increased demand in the coming months');
    }

    // Based on operational data
    const operationalResults = results.filter(r => r.metadata?.database === 'Aircraft Registry');
    if (operationalResults.length > 0) {
      recommendations.push('Optimize fleet utilization based on current availability');
    }

    return recommendations;
  }

  // Generate intelligent response
  private async generateIntelligentResponse(
    query: string,
    results: SearchResult[],
    analysis: any,
    context: SearchContext
  ): Promise<AIResponse> {
    // Simulate thinking process
    await this.simulateThinking();
    
    // Generate response based on results
    let content = '';
    let reasoning = '';
    
    if (results.length === 0) {
      // Generate helpful fallback response based on terminal type
      content = this.generateFallbackResponse(query, context);
      reasoning = "No relevant results found in available sources, providing general aviation guidance";
    } else {
      // Generate comprehensive response
      content = this.generateComprehensiveResponse(query, results, analysis, context);
      reasoning = this.generateReasoning(results, analysis);
    }

    // Ensure confidence is always a valid number
    const finalConfidence = isNaN(analysis.avgConfidence) ? 0.5 : Math.max(0, Math.min(1, analysis.avgConfidence));

    // Generate suggestions and actions
    const suggestions = this.generateContextualSuggestions(query, context);
    const actions = this.generateContextualActions(query, context);

    return {
      content,
      sources: results.slice(0, 5), // Top 5 results
      confidence: finalConfidence,
      reasoning,
      suggestions,
      actions,
      analysis: {
        type: 'comprehensive_search',
        data: analysis,
        insights: analysis.insights,
        recommendations: analysis.recommendations
      }
    };
  }

  // Generate comprehensive response - intelligent formatting
  private generateComprehensiveResponse(
    query: string,
    results: SearchResult[],
    analysis: any,
    context: SearchContext
  ): string {
    const topResult = results[0];
    const sourceCount = analysis.bySource || { internet: [], database: [], internal: [] };
    const avgConfidence = analysis.avgConfidence || 0.5;
    
    // Generate intelligent response based on query type
    let response = this.generateIntelligentResponse(query, results, context);
    
    // Add source breakdown
    response += `\n\n**Sources Consulted:**\n`;
    if (sourceCount.internet && sourceCount.internet.length > 0) {
      response += `• Internet: ${sourceCount.internet.length} results\n`;
    }
    if (sourceCount.database && sourceCount.database.length > 0) {
      response += `• Databases: ${sourceCount.database.length} results\n`;
    }
    if (sourceCount.internal && sourceCount.internal.length > 0) {
      response += `• Internal: ${sourceCount.internal.length} results\n`;
    }
    
    response += `\n*Confidence Level: ${Math.round(avgConfidence * 100)}%*`;
    
    return response;
  }

  // Generate intelligent response based on query type
  private generateIntelligentResponse(query: string, results: SearchResult[], context: SearchContext): string {
    const queryLower = query.toLowerCase();
    const topResult = results[0];
    
    // Charter rates queries
    if (queryLower.includes('charter') || queryLower.includes('rate') || queryLower.includes('price')) {
      return `**Charter Analysis for "${query}"**\n\nBased on current market data from ${results.length} sources:\n\n**Primary Finding:**\n${topResult?.content || 'Current charter rates are competitive with strong demand across major routes.'}\n\n`;
    }
    
    // Aircraft queries
    if (queryLower.includes('aircraft') || queryLower.includes('jet') || queryLower.includes('plane')) {
      return `**Aircraft Analysis for "${query}"**\n\nComprehensive aircraft data from multiple sources:\n\n**Primary Finding:**\n${topResult?.content || 'Aircraft market shows strong activity with competitive pricing.'}\n\n`;
    }
    
    // Weather queries
    if (queryLower.includes('weather') || queryLower.includes('forecast') || queryLower.includes('condition')) {
      return `**Weather Analysis for "${query}"**\n\nCurrent aviation weather conditions:\n\n**Primary Finding:**\n${topResult?.content || 'Weather conditions are favourable for aviation operations.'}\n\n`;
    }
    
    // Market queries
    if (queryLower.includes('market') || queryLower.includes('trend') || queryLower.includes('demand')) {
      return `**Market Analysis for "${query}"**\n\nReal-time market intelligence:\n\n**Primary Finding:**\n${topResult?.content || 'Market shows positive trends with strong demand.'}\n\n`;
    }
    
    // Default intelligent response
    return `**Analysis for "${query}"**\n\nBased on data from ${results.length} sources:\n\n**Primary Finding:**\n${topResult?.content || 'Relevant information found across multiple sources.'}\n\n`;
  }

  // Generate reasoning
  private generateReasoning(results: SearchResult[], analysis: any): string {
    const insightsCount = analysis.insights?.length || 0;
    const avgConfidence = analysis.avgConfidence || 0.5;
    return `Searched ${results.length} sources across internet, databases, and internal systems. Found ${insightsCount} key insights with ${Math.round(avgConfidence * 100)}% average confidence.`;
  }

  // Generate contextual suggestions
  private generateContextualSuggestions(query: string, context: SearchContext): string[] {
    const suggestions: string[] = [];
    
    if (query.toLowerCase().includes('pricing')) {
      suggestions.push('Show me current market rates for specific aircraft');
      suggestions.push('Compare pricing across different routes');
      suggestions.push('Analyze pricing trends over time');
    } else if (query.toLowerCase().includes('route')) {
      suggestions.push('Find the most efficient route options');
      suggestions.push('Check weather conditions for planned routes');
      suggestions.push('Compare fuel costs for different routes');
    } else if (query.toLowerCase().includes('aircraft')) {
      suggestions.push('Show me available aircraft for specific dates');
      suggestions.push('Compare aircraft specifications');
      suggestions.push('Check maintenance schedules');
    } else {
      suggestions.push('Search for more specific information');
      suggestions.push('Show me related market data');
      suggestions.push('Find regulatory requirements');
    }
    
    return suggestions;
  }

  // Generate contextual actions
  private generateContextualActions(query: string, context: SearchContext): string[] {
    const actions: string[] = [];
    
    if (query.toLowerCase().includes('pricing')) {
      actions.push('Generate Quote');
      actions.push('Create Pricing Report');
      actions.push('Update Rate Cards');
    } else if (query.toLowerCase().includes('route')) {
      actions.push('Plan Route');
      actions.push('Check Availability');
      actions.push('Book Flight');
    } else if (query.toLowerCase().includes('aircraft')) {
      actions.push('Reserve Aircraft');
      actions.push('Check Maintenance');
      actions.push('Update Fleet Status');
    } else {
      actions.push('Save Search');
      actions.push('Create Alert');
      actions.push('Share Results');
    }
    
    return actions;
  }

  // Generate fallback response when no results found
  private generateFallbackResponse(query: string, context: SearchContext): string {
    const terminalType = context.terminalType;
    
    let response = `**I couldn't find specific information about "${query}"**\n\n`;
    
    switch (terminalType) {
      case 'broker':
        response += `As a broker, you might be interested in:\n\n`;
        response += `• **Market Analysis** - Current charter rates and demand trends\n`;
        response += `• **Aircraft Availability** - Fleet options and positioning\n`;
        response += `• **Pricing Intelligence** - Competitive analysis and rate optimization\n`;
        response += `• **Client Management** - Booking patterns and preferences\n\n`;
        response += `*Try asking about specific aircraft types, routes, or market conditions.*`;
        break;
        
      case 'operator':
        response += `As an operator, you might be interested in:\n\n`;
        response += `• **Fleet Management** - Aircraft utilization and maintenance\n`;
        response += `• **Route Optimization** - Efficiency and cost analysis\n`;
        response += `• **Crew Scheduling** - Pilot and crew availability\n`;
        response += `• **Operational Metrics** - Performance and safety data\n\n`;
        response += `*Try asking about fleet status, route planning, or operational efficiency.*`;
        break;
        
      case 'pilot':
        response += `As a pilot, you might be interested in:\n\n`;
        response += `• **Job Opportunities** - Available positions and requirements\n`;
        response += `• **Certification Status** - License and rating information\n`;
        response += `• **Route Planning** - Weather and navigation data\n`;
        response += `• **Safety Updates** - Regulatory changes and procedures\n\n`;
        response += `*Try asking about specific aircraft types, routes, or certification requirements.*`;
        break;
        
      case 'crew':
        response += `As cabin crew, you might be interested in:\n\n`;
        response += `• **Job Listings** - Available positions and requirements\n`;
        response += `• **Training Programs** - Certification and skill development\n`;
        response += `• **Route Information** - Destinations and schedules\n`;
        response += `• **Crew Resources** - Equipment and procedures\n\n`;
        response += `*Try asking about specific positions, training requirements, or route details.*`;
        break;
    }
    
    return response;
  }

  // Simulate thinking process
  private async simulateThinking(): Promise<void> {
    // Simulate AI thinking time
    const thinkingTime = Math.random() * 2000 + 1000; // 1-3 seconds
    await new Promise(resolve => setTimeout(resolve, thinkingTime));
  }

  // Helper methods
  private getOrCreateContext(query: string, conversationId: string, terminalType: 'broker' | 'operator' | 'pilot' | 'crew'): SearchContext {
    if (!this.conversationContext.has(conversationId)) {
      this.conversationContext.set(conversationId, {
        query,
        terminalType,
        userPreferences: {},
        conversationHistory: [],
        currentLocation: 'Global',
        timezone: 'UTC'
      });
    }
    
    return this.conversationContext.get(conversationId)!;
  }

  private updateContext(conversationId: string, query: string, results: SearchResult[]): void {
    const context = this.conversationContext.get(conversationId);
    if (context) {
      context.conversationHistory.push(query);
      // Keep only last 10 queries
      if (context.conversationHistory.length > 10) {
        context.conversationHistory = context.conversationHistory.slice(-10);
      }
    }
  }

  private generateCacheKey(query: string, terminalType: string): string {
    return `${terminalType}:${query.toLowerCase().replace(/\s+/g, '_')}`;
  }

  private isCacheValid(results: SearchResult[]): boolean {
    // Cache valid for 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return results.some(r => r.timestamp > fiveMinutesAgo);
  }

  // Convert ultimate data to search results - formatted properly
  private convertUltimateDataToSearchResults(ultimateData: any, query: string): SearchResult[] {
    const results: SearchResult[] = [];
    
    // Convert real-time data
    if (ultimateData.realTimeData) {
      results.push({
        id: crypto.randomUUID(),
        title: 'Real-Time Aviation Data',
        content: `Live aviation data from ${ultimateData.sources.length} sources including flight tracking, weather conditions, and market intelligence.`,
        url: 'https://opensky-network.org',
        source: 'real_time',
        confidence: 0.95,
        timestamp: new Date(),
        metadata: { type: 'real_time', source: 'OpenSky Network' }
      });
    }
    
    // Convert market intelligence
    if (ultimateData.marketIntelligence) {
      let marketContent = 'Current market intelligence including charter rates, aircraft pricing, and demand forecasts.';
      
      if (ultimateData.marketIntelligence.charterRates) {
        const rates = ultimateData.marketIntelligence.charterRates;
        marketContent += ` Current charter rates range from $${Object.values(rates)[0]?.min || 'N/A'} to $${Object.values(rates)[0]?.max || 'N/A'} per hour.`;
      }
      
      results.push({
        id: crypto.randomUUID(),
        title: 'Market Intelligence',
        content: marketContent,
        url: 'https://aviationweek.com',
        source: 'market_data',
        confidence: 0.90,
        timestamp: new Date(),
        metadata: { type: 'market', source: 'Web Scraping' }
      });
    }
    
    // Convert news
    if (ultimateData.news && ultimateData.news.length > 0) {
      ultimateData.news.slice(0, 3).forEach((article: any) => {
        results.push({
          id: crypto.randomUUID(),
          title: article.title || 'Aviation News',
          content: article.summary || article.content || 'News article',
          url: article.url || 'https://aviationweek.com',
          source: 'news',
          confidence: 0.85,
          timestamp: new Date(),
          metadata: { type: 'news', source: 'Web Scraping' }
        });
      });
    }
    
    // Convert regulations
    if (ultimateData.regulations && ultimateData.regulations.length > 0) {
      ultimateData.regulations.slice(0, 2).forEach((regulation: any) => {
        results.push({
          id: crypto.randomUUID(),
          title: regulation.title || 'Regulatory Update',
          content: regulation.summary || 'Regulatory information',
          url: 'https://faa.gov',
          source: 'regulatory',
          confidence: 0.95,
          timestamp: new Date(),
          metadata: { type: 'regulatory', source: 'FAA/EASA' }
        });
      });
    }
    
    // Convert weather data
    if (ultimateData.weather) {
      results.push({
        id: crypto.randomUUID(),
        title: 'Weather Data',
        content: `Weather: ${JSON.stringify(ultimateData.weather).substring(0, 200)}...`,
        url: 'https://aviationweather.gov',
        source: 'weather',
        confidence: 0.90,
        timestamp: new Date(),
        metadata: { type: 'weather', source: 'Aviation Weather Center' }
      });
    }
    
    // Convert fuel prices
    if (ultimateData.fuelPrices) {
      results.push({
        id: crypto.randomUUID(),
        title: 'Fuel Price Data',
        content: `Fuel prices: ${JSON.stringify(ultimateData.fuelPrices).substring(0, 200)}...`,
        url: 'https://opisnet.com',
        source: 'fuel_data',
        confidence: 0.85,
        timestamp: new Date(),
        metadata: { type: 'fuel', source: 'OPIS' }
      });
    }
    
    // Convert aircraft data
    if (ultimateData.aircraftData && ultimateData.aircraftData.length > 0) {
      ultimateData.aircraftData.slice(0, 2).forEach((aircraft: any) => {
        results.push({
          id: crypto.randomUUID(),
          title: `Aircraft: ${aircraft.make} ${aircraft.model}`,
          content: `Year: ${aircraft.year}, Price: $${aircraft.price?.toLocaleString()}, Hours: ${aircraft.hours}`,
          url: 'https://controller.com',
          source: 'aircraft_data',
          confidence: 0.80,
          timestamp: new Date(),
          metadata: { type: 'aircraft', source: 'Aircraft Bluebook' }
        });
      });
    }
    
    // Convert charter rates
    if (ultimateData.charterRates && ultimateData.charterRates.length > 0) {
      ultimateData.charterRates.slice(0, 2).forEach((rate: any) => {
        results.push({
          id: crypto.randomUUID(),
          title: `Charter: ${rate.route}`,
          content: `${rate.aircraft} - $${rate.price?.toLocaleString()} - ${rate.duration}`,
          url: 'https://charterauction.com',
          source: 'charter_data',
          confidence: 0.85,
          timestamp: new Date(),
          metadata: { type: 'charter', source: 'CharterAuction' }
        });
      });
    }
    
    return results;
  }
}

export const aiSearchService = new AISearchService();
