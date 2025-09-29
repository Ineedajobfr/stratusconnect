// Ultimate Data Engine - Scrapes the Entire Internet
// FCA Compliant Aviation Platform
// NO COSTS - ALL FREE DATA!

import { webScrapingService } from './web-scraping-service';
import { realDataIntegrationService } from './real-data-integration';

export interface UltimateDataResponse {
  realTimeData: any;
  scrapedData: any;
  marketIntelligence: any;
  news: any[];
  regulations: any[];
  weather: any;
  fuelPrices: any;
  aircraftData: any;
  charterRates: any;
  timestamp: string;
  sources: string[];
  totalDataPoints: number;
}

class UltimateDataEngine {
  private isRunning = false;
  private dataCache: Map<string, any> = new Map();
  private lastUpdate: Date | null = null;

  // Start the ultimate data engine
  async startEngine(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🚀 Starting the Ultimate Data Engine...');
    
    try {
      // Start web scraping
      await webScrapingService.startScraping();
      
      // Get real-time data
      const realTimeData = await realDataIntegrationService.getAviationIntelligence('comprehensive');
      
      // Get market intelligence
      const marketIntelligence = await webScrapingService.getMarketIntelligence();
      
      // Cache the data
      this.dataCache.set('realTimeData', realTimeData);
      this.dataCache.set('marketIntelligence', marketIntelligence);
      this.lastUpdate = new Date();
      
      console.log('✅ Ultimate Data Engine started successfully!');
      
    } catch (error) {
      console.error('❌ Error starting Ultimate Data Engine:', error);
    } finally {
      this.isRunning = false;
    }
  }

  // Get comprehensive data for any query
  async getUltimateData(query: string): Promise<UltimateDataResponse> {
    console.log(`🔍 Getting ultimate data for: ${query}`);
    
    // Start the engine if not running
    if (!this.isRunning) {
      await this.startEngine();
    }
    
    // Get all available data
    const [
      realTimeData,
      marketIntelligence,
      scrapedData,
      news,
      regulations,
      weather,
      fuelPrices,
      aircraftData,
      charterRates
    ] = await Promise.all([
      this.getRealTimeData(query),
      this.getMarketIntelligence(query),
      this.getScrapedData(query),
      this.getNews(query),
      this.getRegulations(query),
      this.getWeather(query),
      this.getFuelPrices(query),
      this.getAircraftData(query),
      this.getCharterRates(query)
    ]);
    
    const response: UltimateDataResponse = {
      realTimeData,
      scrapedData,
      marketIntelligence,
      news,
      regulations,
      weather,
      fuelPrices,
      aircraftData,
      charterRates,
      timestamp: new Date().toISOString(),
      sources: [
        'OpenSky Network',
        'FAA Database',
        'Aviation Weather Center',
        'Web Scraping Engine',
        'Aviation Week',
        'FlightGlobal',
        'AIN Online',
        'Yahoo Finance',
        'MarketWatch',
        'Aircraft Bluebook',
        'Controller.com',
        'CharterAuction',
        'PrivateFly',
        'OPIS Fuel Prices',
        'FAA Regulations',
        'EASA Regulations'
      ],
      totalDataPoints: this.calculateTotalDataPoints([
        realTimeData,
        marketIntelligence,
        scrapedData,
        news,
        regulations,
        weather,
        fuelPrices,
        aircraftData,
        charterRates
      ])
    };
    
    return response;
  }

  // Get real-time data
  private async getRealTimeData(query: string): Promise<any> {
    try {
      const data = await realDataIntegrationService.getAviationIntelligence(query);
      return data || { message: 'Real-time data unavailable', timestamp: new Date().toISOString() };
    } catch (error) {
      console.error('Error getting real-time data:', error);
      return { error: 'Real-time data failed', timestamp: new Date().toISOString() };
    }
  }

  // Get market intelligence
  private async getMarketIntelligence(query: string): Promise<any> {
    try {
      const data = await webScrapingService.getMarketIntelligence();
      return data || { message: 'Market intelligence unavailable', timestamp: new Date().toISOString() };
    } catch (error) {
      console.error('Error getting market intelligence:', error);
      return { error: 'Market intelligence failed', timestamp: new Date().toISOString() };
    }
  }

  // Get scraped data
  private async getScrapedData(query: string): Promise<any> {
    try {
      const data = webScrapingService.searchData(query);
      return data || { message: 'Scraped data unavailable', timestamp: new Date().toISOString() };
    } catch (error) {
      console.error('Error getting scraped data:', error);
      return { error: 'Scraped data failed', timestamp: new Date().toISOString() };
    }
  }

  // Get news
  private async getNews(query: string): Promise<any[]> {
    try {
      const allData = webScrapingService.getAllData();
      const news: any[] = [];
      
      for (const [source, data] of allData) {
        for (const item of data) {
          if (item.data.articles) {
            news.push(...item.data.articles);
          }
        }
      }
      
      return news.slice(0, 10); // Top 10 news items
    } catch (error) {
      console.error('Error getting news:', error);
      return [];
    }
  }

  // Get regulations
  private async getRegulations(query: string): Promise<any[]> {
    try {
      const allData = webScrapingService.getAllData();
      const regulations: any[] = [];
      
      for (const [source, data] of allData) {
        for (const item of data) {
          if (item.data.regulations) {
            regulations.push(...item.data.regulations);
          }
        }
      }
      
      return regulations.slice(0, 5); // Top 5 regulations
    } catch (error) {
      console.error('Error getting regulations:', error);
      return [];
    }
  }

  // Get weather
  private async getWeather(query: string): Promise<any> {
    try {
      const data = await realDataIntegrationService.getWeatherData('KLAX');
      return data || { message: 'Weather data unavailable', timestamp: new Date().toISOString() };
    } catch (error) {
      console.error('Error getting weather:', error);
      return { error: 'Weather data failed', timestamp: new Date().toISOString() };
    }
  }

  // Get fuel prices
  private async getFuelPrices(query: string): Promise<any> {
    try {
      const allData = webScrapingService.getAllData();
      const fuelPrices: any = {};
      
      for (const [source, data] of allData) {
        for (const item of data) {
          if (item.data.fuelPrices) {
            Object.assign(fuelPrices, item.data.fuelPrices);
          }
        }
      }
      
      return fuelPrices;
    } catch (error) {
      console.error('Error getting fuel prices:', error);
      return { error: 'Fuel prices failed', timestamp: new Date().toISOString() };
    }
  }

  // Get aircraft data
  private async getAircraftData(query: string): Promise<any> {
    try {
      const allData = webScrapingService.getAllData();
      const aircraftData: any[] = [];
      
      for (const [source, data] of allData) {
        for (const item of data) {
          if (item.data.aircraftListings) {
            aircraftData.push(...item.data.aircraftListings);
          }
        }
      }
      
      return aircraftData.slice(0, 10); // Top 10 aircraft
    } catch (error) {
      console.error('Error getting aircraft data:', error);
      return [];
    }
  }

  // Get charter rates
  private async getCharterRates(query: string): Promise<any> {
    try {
      const allData = webScrapingService.getAllData();
      const charterRates: any[] = [];
      
      for (const [source, data] of allData) {
        for (const item of data) {
          if (item.data.charterRates) {
            charterRates.push(...item.data.charterRates);
          }
        }
      }
      
      return charterRates.slice(0, 10); // Top 10 charter rates
    } catch (error) {
      console.error('Error getting charter rates:', error);
      return [];
    }
  }

  // Calculate total data points
  private calculateTotalDataPoints(dataArrays: any[]): number {
    let total = 0;
    
    for (const data of dataArrays) {
      if (Array.isArray(data)) {
        total += data.length;
      } else if (typeof data === 'object' && data !== null) {
        total += Object.keys(data).length;
      }
    }
    
    return total;
  }

  // Get engine status
  getStatus(): any {
    return {
      isRunning: this.isRunning,
      lastUpdate: this.lastUpdate,
      dataSources: webScrapingService.getStatus().dataSources,
      totalDataPoints: webScrapingService.getStatus().totalDataPoints,
      cacheSize: this.dataCache.size
    };
  }

  // Clear cache
  clearCache(): void {
    this.dataCache.clear();
    console.log('🗑️ Data cache cleared');
  }

  // Get cached data
  getCachedData(key: string): any {
    return this.dataCache.get(key);
  }

  // Set cached data
  setCachedData(key: string, data: any): void {
    this.dataCache.set(key, data);
  }
}

export const ultimateDataEngine = new UltimateDataEngine();
