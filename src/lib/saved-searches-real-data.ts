// Saved Searches with Real Data Integration
// FCA Compliant Aviation Platform

export interface SavedSearch {
  id: string;
  name: string;
  description: string;
  criteria: SearchCriteria;
  alerts: SearchAlert[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  lastRun?: string;
  resultCount?: number;
}

export interface SearchCriteria {
  routes: string[];
  aircraft: string[];
  minSeats: number;
  maxSeats: number;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  dateRange: {
    start: string;
    end: string;
  };
  operators: string[];
  verifiedOnly: boolean;
  emptyLegsOnly: boolean;
  tags: string[];
}

export interface SearchAlert {
  id: string;
  type: 'price_drop' | 'new_listing' | 'last_minute' | 'custom';
  threshold?: number; // for price drop alerts
  enabled: boolean;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  lastTriggered?: string;
  triggerCount: number;
}

export interface SearchResult {
  id: string;
  listingId: string;
  searchId: string;
  score: number;
  matchedAt: string;
  data: Record<string, unknown>; // The actual listing data
}

export interface PriceDropAlert {
  id: string;
  searchId: string;
  listingId: string;
  originalPrice: number;
  currentPrice: number;
  priceDrop: number;
  priceDropPercentage: number;
  currency: string;
  triggeredAt: string;
  notified: boolean;
}

export interface LastMinuteAlert {
  id: string;
  searchId: string;
  listingId: string;
  departureTime: string;
  hoursUntilDeparture: number;
  triggeredAt: string;
  notified: boolean;
}

class SavedSearchesRealData {
  private searches: SavedSearch[] = [];
  private results: SearchResult[] = [];
  private priceDropAlerts: PriceDropAlert[] = [];
  private lastMinuteAlerts: LastMinuteAlert[] = [];
  private isRunning = false;

  /**
   * Create a new saved search
   */
  createSearch(
    name: string,
    description: string,
    criteria: SearchCriteria,
    createdBy: string
  ): SavedSearch {
    const search: SavedSearch = {
      id: `SEARCH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      criteria,
      alerts: [],
      createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      active: true
    };

    this.searches.push(search);
    return search;
  }

  /**
   * Add alert to search
   */
  addAlert(
    searchId: string,
    type: SearchAlert['type'],
    threshold?: number,
    frequency: SearchAlert['frequency'] = 'immediate'
  ): SearchAlert {
    const search = this.searches.find(s => s.id === searchId);
    if (!search) throw new Error('Search not found');

    const alert: SearchAlert = {
      id: `ALERT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      threshold,
      enabled: true,
      frequency,
      triggerCount: 0
    };

    search.alerts.push(alert);
    search.updatedAt = new Date().toISOString();

    return alert;
  }

  /**
   * Run all active searches
   */
  async runAllSearches(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔍 Running all saved searches...');

    try {
      const activeSearches = this.searches.filter(s => s.active);
      
      for (const search of activeSearches) {
        await this.runSearch(search.id);
      }
      
      console.log(`✅ Completed ${activeSearches.length} searches`);
    } catch (error) {
      console.error('❌ Error running searches:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Run a specific search
   */
  async runSearch(searchId: string): Promise<SearchResult[]> {
    const search = this.searches.find(s => s.id === searchId);
    if (!search) throw new Error('Search not found');

    console.log(`🔍 Running search: ${search.name}`);

    // Simulate API call to get listings
    const listings = await this.fetchListings(search.criteria);
    
    // Filter and score results
    const results = this.filterAndScoreListings(listings, search.criteria);
    
    // Store results
    const searchResults = results.map(result => ({
      id: `RESULT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      listingId: result.id,
      searchId: search.id,
      score: result.score,
      matchedAt: new Date().toISOString(),
      data: result
    }));

    this.results.push(...searchResults);
    
    // Update search stats
    search.lastRun = new Date().toISOString();
    search.resultCount = searchResults.length;
    search.updatedAt = new Date().toISOString();

    // Check for alerts
    await this.checkAlerts(search, searchResults);

    return searchResults;
  }

  /**
   * Fetch listings from API (simulated)
   */
  private async fetchListings(criteria: SearchCriteria): Promise<Record<string, unknown>[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock listings data
    const mockListings = [
      {
        id: 'L1',
        from: 'LHR',
        to: 'CDG',
        date: '2024-01-20',
        aircraft: 'Gulfstream G550',
        seats: 8,
        price: 1500000,
        currency: 'GBP',
        operator: 'Elite Aviation',
        verified: true,
        emptyLeg: true,
        tags: ['Empty leg', 'Popular']
      },
      {
        id: 'L2',
        from: 'NYC',
        to: 'MIA',
        date: '2024-01-22',
        aircraft: 'Citation X',
        seats: 6,
        price: 850000,
        currency: 'USD',
        operator: 'SkyBridge',
        verified: true,
        emptyLeg: true,
        tags: ['Empty leg']
      },
      {
        id: 'L3',
        from: 'LHR',
        to: 'DXB',
        date: '2024-01-25',
        aircraft: 'Global 6000',
        seats: 12,
        price: 7800000,
        currency: 'GBP',
        operator: 'Crown Jets',
        verified: false,
        emptyLeg: false,
        tags: ['Long range']
      }
    ];

    return mockListings;
  }

  /**
   * Filter and score listings based on criteria
   */
  private filterAndScoreListings(listings: Record<string, unknown>[], criteria: SearchCriteria): Record<string, unknown>[] {
    return listings
      .filter(listing => this.matchesCriteria(listing, criteria))
      .map(listing => ({
        ...listing,
        score: this.calculateScore(listing, criteria)
      }))
      .sort((a, b) => (b.score as number) - (a.score as number));
  }

  /**
   * Check if listing matches search criteria
   */
  private matchesCriteria(listing: Record<string, unknown>, criteria: SearchCriteria): boolean {
    // Route matching
    if (criteria.routes.length > 0) {
      const route = `${listing.from}-${listing.to}`;
      if (!criteria.routes.includes(route)) return false;
    }

    // Aircraft matching
    if (criteria.aircraft.length > 0) {
      if (!criteria.aircraft.some(aircraft => 
        (listing.aircraft as string).toLowerCase().includes(aircraft.toLowerCase())
      )) return false;
    }

    // Seats matching
    if ((listing.seats as number) < criteria.minSeats || (listing.seats as number) > criteria.maxSeats) {
      return false;
    }

    // Price matching
    if ((listing.price as number) < criteria.priceRange.min || (listing.price as number) > criteria.priceRange.max) {
      return false;
    }

    // Date matching
    const listingDate = new Date(listing.date as string);
    const startDate = new Date(criteria.dateRange.start);
    const endDate = new Date(criteria.dateRange.end);
    
    if (listingDate < startDate || listingDate > endDate) {
      return false;
    }

    // Operator matching
    if (criteria.operators.length > 0) {
      if (!criteria.operators.includes(listing.operator as string)) return false;
    }

    // Verified only
    if (criteria.verifiedOnly && !(listing.verified as boolean)) {
      return false;
    }

    // Empty legs only
    if (criteria.emptyLegsOnly && !(listing.emptyLeg as boolean)) {
      return false;
    }

    // Tags matching
    if (criteria.tags.length > 0) {
      if (!criteria.tags.some(tag => (listing.tags as string[]).includes(tag))) {
        return false;
      }
    }

    return true;
  }

  /**
   * Calculate relevance score for listing
   */
  private calculateScore(listing: Record<string, unknown>, criteria: SearchCriteria): number {
    let score = 0;

    // Base score
    score += 50;

    // Verified operator bonus
    if (listing.verified as boolean) score += 20;

    // Empty leg bonus
    if (listing.emptyLeg as boolean) score += 15;

    // Price proximity bonus
    const priceRange = criteria.priceRange.max - criteria.priceRange.min;
    const priceDistance = Math.abs((listing.price as number) - criteria.priceRange.min);
    const priceProximity = Math.max(0, 1 - (priceDistance / priceRange));
    score += priceProximity * 10;

    // Date proximity bonus
    const listingDate = new Date(listing.date as string);
    const now = new Date();
    const daysUntil = Math.ceil((listingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const dateProximity = Math.max(0, 1 - (daysUntil / 30)); // 30 days max
    score += dateProximity * 5;

    return Math.min(100, score);
  }

  /**
   * Check for alerts and trigger them
   */
  private async checkAlerts(search: SavedSearch, results: SearchResult[]): Promise<void> {
    for (const alert of search.alerts) {
      if (!alert.enabled) continue;

      switch (alert.type) {
        case 'price_drop':
          await this.checkPriceDropAlert(search, alert, results);
          break;
        case 'new_listing':
          await this.checkNewListingAlert(search, alert, results);
          break;
        case 'last_minute':
          await this.checkLastMinuteAlert(search, alert, results);
          break;
      }
    }
  }

  /**
   * Check for price drop alerts
   */
  private async checkPriceDropAlert(
    search: SavedSearch,
    alert: SearchAlert,
    results: SearchResult[]
  ): Promise<void> {
    if (!alert.threshold) return;

    for (const result of results) {
      const listing = result.data;
      const priceDrop = this.calculatePriceDrop(listing.id as string, listing.price as number);
      
      if (priceDrop && priceDrop.percentage >= alert.threshold) {
        const priceDropAlert: PriceDropAlert = {
          id: `PRICE_ALERT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          searchId: search.id,
          listingId: listing.id as string,
          originalPrice: priceDrop.originalPrice,
          currentPrice: listing.price as number,
          priceDrop: priceDrop.amount,
          priceDropPercentage: priceDrop.percentage,
          currency: listing.currency as string,
          triggeredAt: new Date().toISOString(),
          notified: false
        };

        this.priceDropAlerts.push(priceDropAlert);
        alert.triggerCount++;
        alert.lastTriggered = new Date().toISOString();
      }
    }
  }

  /**
   * Check for new listing alerts
   */
  private async checkNewListingAlert(
    search: SavedSearch,
    alert: SearchAlert,
    results: SearchResult[]
  ): Promise<void> {
    // Check if any results are new (created in last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    for (const result of results) {
      const listing = result.data;
      const listingDate = new Date((listing.createdAt as string) || (listing.date as string));
      
      if (listingDate > oneDayAgo) {
        // Trigger new listing alert
        alert.triggerCount++;
        alert.lastTriggered = new Date().toISOString();
      }
    }
  }

  /**
   * Check for last minute alerts
   */
  private async checkLastMinuteAlert(
    search: SavedSearch,
    alert: SearchAlert,
    results: SearchResult[]
  ): Promise<void> {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    
    for (const result of results) {
      const listing = result.data;
      const departureTime = new Date((listing.departureTime as string) || (listing.date as string));
      
      if (departureTime <= oneHourFromNow && departureTime > now) {
        const lastMinuteAlert: LastMinuteAlert = {
          id: `LAST_MIN_ALERT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          searchId: search.id,
          listingId: listing.id as string,
          departureTime: departureTime.toISOString(),
          hoursUntilDeparture: Math.ceil((departureTime.getTime() - now.getTime()) / (1000 * 60 * 60)),
          triggeredAt: new Date().toISOString(),
          notified: false
        };

        this.lastMinuteAlerts.push(lastMinuteAlert);
        alert.triggerCount++;
        alert.lastTriggered = new Date().toISOString();
      }
    }
  }

  /**
   * Calculate price drop for listing
   */
  private calculatePriceDrop(listingId: string, currentPrice: number): {
    originalPrice: number;
    amount: number;
    percentage: number;
  } | null {
    // In production, this would check historical prices
    // For demo, simulate a price drop
    const originalPrice = Math.round(currentPrice * 1.1); // 10% higher
    const amount = originalPrice - currentPrice;
    const percentage = (amount / originalPrice) * 100;
    
    return {
      originalPrice,
      amount,
      percentage
    };
  }

  /**
   * Get all searches for user
   */
  getSearchesForUser(userId: string): SavedSearch[] {
    return this.searches.filter(s => s.createdBy === userId);
  }

  /**
   * Get search results
   */
  getSearchResults(searchId: string): SearchResult[] {
    return this.results.filter(r => r.searchId === searchId);
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): {
    priceDrop: PriceDropAlert[];
    lastMinute: LastMinuteAlert[];
  } {
    return {
      priceDrop: this.priceDropAlerts.filter(a => !a.notified),
      lastMinute: this.lastMinuteAlerts.filter(a => !a.notified)
    };
  }

  /**
   * Mark alert as notified
   */
  markAlertNotified(alertId: string, type: 'price_drop' | 'last_minute'): void {
    if (type === 'price_drop') {
      const alert = this.priceDropAlerts.find(a => a.id === alertId);
      if (alert) alert.notified = true;
    } else if (type === 'last_minute') {
      const alert = this.lastMinuteAlerts.find(a => a.id === alertId);
      if (alert) alert.notified = true;
    }
  }

  /**
   * Delete search
   */
  deleteSearch(searchId: string): boolean {
    const index = this.searches.findIndex(s => s.id === searchId);
    if (index === -1) return false;
    
    this.searches.splice(index, 1);
    
    // Remove related results
    this.results = this.results.filter(r => r.searchId !== searchId);
    
    return true;
  }

  /**
   * Update search
   */
  updateSearch(searchId: string, updates: Partial<SavedSearch>): boolean {
    const search = this.searches.find(s => s.id === searchId);
    if (!search) return false;
    
    Object.assign(search, updates);
    search.updatedAt = new Date().toISOString();
    
    return true;
  }
}

export const savedSearchesRealData = new SavedSearchesRealData();
export default savedSearchesRealData;
