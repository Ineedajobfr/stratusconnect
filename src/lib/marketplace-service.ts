// Marketplace Service - Frontend API for marketplace operations
// Connects to Supabase Edge Functions for marketplace

import { supabase } from '@/integrations/supabase/client';

export interface MarketplaceListing {
  id: string;
  operator_id: string;
  aircraft_id?: string;
  title: string;
  description?: string;
  listing_type: 'sale' | 'charter' | 'empty_leg';
  price?: number;
  currency: string;
  departure_airport?: string;
  destination_airport?: string;
  dep_time?: string;
  arr_time?: string;
  seats?: number;
  active: boolean;
  metadata?: any;
  created_at: string;
  operator?: {
    id: string;
    email: string;
    full_name?: string;
    company_name?: string;
    role: string;
  };
  aircraft?: {
    id: string;
    type?: string;
    tail_number?: string;
    model?: string;
    category?: string;
  };
  operator_trust?: {
    trust_score: number;
    reputation_score: number;
    verified: boolean;
    activity_count: number;
  };
}

export interface TripRequest {
  id: string;
  broker_id: string;
  origin: string;
  destination: string;
  dep_time: string;
  pax: number;
  preferred_category?: string;
  max_budget?: number;
  status: 'open' | 'fulfilled' | 'cancelled';
  metadata?: any;
  created_at: string;
  updated_at: string;
  broker?: {
    id: string;
    email: string;
    full_name?: string;
    company_name?: string;
    role: string;
  };
  broker_trust?: {
    trust_score: number;
    reputation_score: number;
    verified: boolean;
    activity_count: number;
  };
}

export interface MarketplaceSearchParams {
  q?: string;
  listing_type?: 'sale' | 'charter' | 'empty_leg';
  category?: string;
  departure_airport?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  per_page?: number;
}

export interface MarketplaceSearchResult {
  success: boolean;
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  results: MarketplaceListing[];
}

export interface TripRequestSearchParams {
  status?: 'open' | 'fulfilled' | 'cancelled';
  origin?: string;
  destination?: string;
  page?: number;
  per_page?: number;
}

export interface TripRequestSearchResult {
  success: boolean;
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  results: TripRequest[];
}

class MarketplaceService {
  private edgeFunctionUrl = `${supabase.supabaseUrl}/functions/v1`;

  private async callEdgeFunction(
    functionName: string,
    method: string = 'GET',
    body?: any,
    params?: Record<string, string>
  ) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Not authenticated');
    }

    const url = new URL(`${this.edgeFunctionUrl}/${functionName}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return await response.json();
  }

  // ========================================
  // MARKETPLACE LISTINGS
  // ========================================

  /**
   * Search marketplace listings
   */
  async searchListings(params: MarketplaceSearchParams = {}): Promise<MarketplaceSearchResult> {
    const searchParams: Record<string, string> = {};
    
    if (params.q) searchParams.q = params.q;
    if (params.listing_type) searchParams.listing_type = params.listing_type;
    if (params.category) searchParams.category = params.category;
    if (params.departure_airport) searchParams.departure_airport = params.departure_airport;
    if (params.min_price) searchParams.min_price = String(params.min_price);
    if (params.max_price) searchParams.max_price = String(params.max_price);
    searchParams.page = String(params.page || 1);
    searchParams.per_page = String(params.per_page || 20);

    return await this.callEdgeFunction('marketplace-search', 'GET', null, searchParams);
  }

  /**
   * Create a new listing (operators only)
   */
  async createListing(listing: Partial<MarketplaceListing>): Promise<{ success: boolean; data: MarketplaceListing }> {
    return await this.callEdgeFunction('marketplace-listing', 'POST', listing);
  }

  /**
   * Update a listing (owner only)
   */
  async updateListing(listingId: string, updates: Partial<MarketplaceListing>): Promise<{ success: boolean; data: MarketplaceListing }> {
    return await this.callEdgeFunction(`marketplace-listing/${listingId}`, 'PUT', updates);
  }

  /**
   * Delete a listing (owner only)
   */
  async deleteListing(listingId: string): Promise<{ success: boolean; message: string }> {
    return await this.callEdgeFunction(`marketplace-listing/${listingId}`, 'DELETE');
  }

  /**
   * Get single listing by ID
   */
  async getListing(listingId: string): Promise<{ success: boolean; data: MarketplaceListing }> {
    return await this.callEdgeFunction(`marketplace-listing/${listingId}`, 'GET');
  }

  // ========================================
  // TRIP REQUESTS (RFQs)
  // ========================================

  /**
   * Search trip requests
   */
  async searchTripRequests(params: TripRequestSearchParams = {}): Promise<TripRequestSearchResult> {
    const searchParams: Record<string, string> = {};
    
    if (params.status) searchParams.status = params.status;
    if (params.origin) searchParams.origin = params.origin;
    if (params.destination) searchParams.destination = params.destination;
    searchParams.page = String(params.page || 1);
    searchParams.per_page = String(params.per_page || 20);

    return await this.callEdgeFunction('trip-request', 'GET', null, searchParams);
  }

  /**
   * Create a trip request (brokers only)
   */
  async createTripRequest(request: Partial<TripRequest>): Promise<{ success: boolean; data: TripRequest }> {
    return await this.callEdgeFunction('trip-request', 'POST', request);
  }

  /**
   * Update a trip request (owner only)
   */
  async updateTripRequest(requestId: string, updates: Partial<TripRequest>): Promise<{ success: boolean; data: TripRequest }> {
    return await this.callEdgeFunction(`trip-request/${requestId}`, 'PUT', updates);
  }

  /**
   * Get single trip request by ID
   */
  async getTripRequest(requestId: string): Promise<{ success: boolean; data: TripRequest }> {
    return await this.callEdgeFunction(`trip-request/${requestId}`, 'GET');
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  /**
   * Get user's own listings
   */
  async getMyListings(): Promise<MarketplaceListing[]> {
    const { data, error } = await supabase
      .from('marketplace_listings')
      .select(`
        *,
        operator:operator_id (
          id,
          email,
          full_name,
          company_name,
          role
        ),
        aircraft:aircraft_id (
          id,
          type,
          tail_number,
          model,
          category
        )
      `)
      .eq('operator_id', (await supabase.auth.getUser()).data.user?.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as MarketplaceListing[];
  }

  /**
   * Get user's own trip requests
   */
  async getMyTripRequests(): Promise<TripRequest[]> {
    const { data, error } = await supabase
      .from('trip_requests')
      .select(`
        *,
        broker:broker_id (
          id,
          email,
          full_name,
          company_name,
          role
        )
      `)
      .eq('broker_id', (await supabase.auth.getUser()).data.user?.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as TripRequest[];
  }

  /**
   * Get empty legs (quick filter)
   */
  async getEmptyLegs(params: MarketplaceSearchParams = {}): Promise<MarketplaceSearchResult> {
    return this.searchListings({
      ...params,
      listing_type: 'empty_leg'
    });
  }

  /**
   * Get charter listings
   */
  async getCharterListings(params: MarketplaceSearchParams = {}): Promise<MarketplaceSearchResult> {
    return this.searchListings({
      ...params,
      listing_type: 'charter'
    });
  }

  /**
   * Get aircraft for sale
   */
  async getAircraftForSale(params: MarketplaceSearchParams = {}): Promise<MarketplaceSearchResult> {
    return this.searchListings({
      ...params,
      listing_type: 'sale'
    });
  }
}

export const marketplaceService = new MarketplaceService();

