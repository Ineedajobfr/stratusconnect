// Marketplace Service - Frontend API for marketplace operations
// Connects to Supabase Edge Functions and direct Supabase queries

import { supabase } from '@/integrations/supabase/client';
import { fromDbListing, toDbListing } from './marketplace-schema-adapter';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type TripType = 'one-way' | 'round-trip' | 'multi-leg';
export type AircraftCategory = 'heavy' | 'medium' | 'light' | 'turboprop' | 'helicopter';
export type ArgusRating = 'platinum' | 'gold' | 'silver' | 'not_rated';
export type WyvernStatus = 'elite' | 'certified' | 'not_certified';

export interface TripLeg {
  origin: string;
  destination: string;
  dep_time: string;
  pax?: number;
}

export interface MarketplaceListing {
  id: string;
  operator_id: string;
  aircraft_id?: string;
  aircraft_model_id?: string;
  title: string;
  description?: string;
  listing_type: 'sale' | 'charter' | 'empty_leg';
  category?: AircraftCategory;
  price?: number;
  original_price?: number;
  discount_percent?: number;
  currency: string;
  departure_airport?: string;
  destination_airport?: string;
  dep_time?: string;
  arr_time?: string;
  seats?: number;
  distance_nm?: number;
  view_count?: number;
  inquiry_count?: number;
  active: boolean;
  expires_at?: string;
  metadata?: any;
  created_at: string;
  operator?: {
    id: string;
    email: string;
    full_name?: string;
    company_name?: string;
    role: string;
    argus_rating?: ArgusRating;
    wyvern_status?: WyvernStatus;
    avg_response_time_minutes?: number;
    completion_rate?: number;
  };
  aircraft?: {
    id: string;
    type?: string;
    tail_number?: string;
    model?: string;
    category?: AircraftCategory;
  };
  aircraft_model?: {
    id: string;
    manufacturer: string;
    model: string;
    category: AircraftCategory;
    typical_pax?: number;
    max_range_nm?: number;
    cruise_speed_kts?: number;
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
  trip_type: TripType;
  origin: string;
  destination: string;
  dep_time: string;
  return_date?: string;
  legs?: TripLeg[];
  pax: number;
  preferred_category?: AircraftCategory;
  max_budget?: number;
  urgency?: 'low' | 'normal' | 'high' | 'urgent';
  total_distance_nm?: number;
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
  quotes?: Quote[];
}

export interface Quote {
  id: string;
  trip_request_id: string;
  operator_id: string;
  aircraft_id?: string;
  price: number;
  currency: string;
  valid_until?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';
  response_time_minutes?: number;
  created_at: string;
  updated_at: string;
  operator?: {
    id: string;
    email: string;
    full_name?: string;
    company_name?: string;
    argus_rating?: ArgusRating;
    wyvern_status?: WyvernStatus;
  };
}

export interface AircraftModel {
  id: string;
  manufacturer: string;
  model: string;
  category: AircraftCategory;
  typical_pax?: number;
  max_range_nm?: number;
  cruise_speed_kts?: number;
  baggage_capacity_cuft?: number;
  description?: string;
  image_url?: string;
}

export interface Airport {
  id: string;
  icao_code: string;
  iata_code?: string;
  name: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  popular?: boolean;
}

export interface PreferredVendor {
  id: string;
  broker_id: string;
  operator_id: string;
  notes?: string;
  created_at: string;
  operator?: {
    id: string;
    email: string;
    full_name?: string;
    company_name?: string;
    argus_rating?: ArgusRating;
    wyvern_status?: WyvernStatus;
  };
}

export interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  search_type: 'aircraft' | 'empty_leg' | 'trip_request';
  filters: Record<string, any>;
  notify_on_match: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdvancedSearchFilters {
  q?: string;
  listing_type?: 'sale' | 'charter' | 'empty_leg' | 'all';
  category?: AircraftCategory | AircraftCategory[];
  aircraft_model_id?: string;
  departure_airport?: string;
  destination_airport?: string;
  dep_date_from?: string;
  dep_date_to?: string;
  min_pax?: number;
  max_pax?: number;
  min_price?: number;
  max_price?: number;
  min_discount?: number;
  argus_rating?: ArgusRating[];
  wyvern_status?: WyvernStatus[];
  verified_only?: boolean;
  min_trust_score?: number;
  sort_by?: 'price_asc' | 'price_desc' | 'trust_score' | 'response_time' | 'discount' | 'date';
  page?: number;
  per_page?: number;
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
  trip_type?: TripType;
  origin?: string;
  destination?: string;
  category?: AircraftCategory;
  min_budget?: number;
  max_budget?: number;
  urgency?: 'low' | 'normal' | 'high' | 'urgent';
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

export interface CreateTripRequestInput {
  trip_type: TripType;
  origin: string;
  destination: string;
  dep_time: string;
  return_date?: string;
  legs?: TripLeg[];
  pax: number;
  preferred_category?: AircraftCategory;
  max_budget?: number;
  urgency?: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: any;
}

// ============================================================================
// MARKETPLACE SERVICE CLASS
// ============================================================================

class MarketplaceService {
  // ========================================
  // ADVANCED SEARCH
  // ========================================

  /**
   * Advanced search with comprehensive filters
   */
  async advancedSearch(filters: AdvancedSearchFilters): Promise<MarketplaceSearchResult> {
    let query = supabase
      .from('marketplace_listings')
      .select(`
        *,
        operator:profiles!marketplace_listings_operator_id_fkey (
          id,
          full_name,
          company_name,
          role,
          verified,
          reputation_score,
          argus_rating,
          wyvern_status,
          avg_response_time_minutes,
          completion_rate
        ),
        aircraft_model:aircraft_models (
          id,
          manufacturer,
          model,
          category,
          typical_pax,
          max_range_nm,
          cruise_speed_kts
        )
      `, { count: 'exact' })
      .eq('status', 'active');

    // Apply filters
    if (filters.listing_type && filters.listing_type !== 'all') {
      query = query.eq('listing_type', filters.listing_type);
    }

    if (filters.category) {
      if (Array.isArray(filters.category)) {
        query = query.in('category', filters.category);
      } else {
        query = query.eq('category', filters.category);
      }
    }

    if (filters.aircraft_model_id) {
      query = query.eq('aircraft_model_id', filters.aircraft_model_id);
    }

    if (filters.departure_airport) {
      query = query.eq('departure_location', filters.departure_airport.toUpperCase());
    }

    if (filters.destination_airport) {
      query = query.eq('destination', filters.destination_airport.toUpperCase());
    }

    if (filters.min_price) {
      query = query.gte('asking_price', filters.min_price);
    }

    if (filters.max_price) {
      query = query.lte('asking_price', filters.max_price);
    }

    if (filters.min_pax) {
      query = query.gte('passengers', filters.min_pax);
    }

    if (filters.min_discount) {
      query = query.gte('discount_percent', filters.min_discount);
    }

    // Sorting (using existing column names)
    switch (filters.sort_by) {
      case 'price_asc':
        query = query.order('asking_price', { ascending: true, nullsFirst: false });
        break;
      case 'price_desc':
        query = query.order('asking_price', { ascending: false, nullsFirst: false });
        break;
      case 'discount':
        query = query.order('discount_percent', { ascending: false, nullsFirst: false });
        break;
      case 'date':
        query = query.order('departure_date', { ascending: true, nullsFirst: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Pagination
    const page = filters.page || 1;
    const perPage = filters.per_page || 24;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    // Map database format to frontend format
    const mappedResults = (data || []).map(fromDbListing);

    return {
      success: true,
      page,
      perPage,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / perPage),
      results: mappedResults as MarketplaceListing[]
    };
  }

  /**
   * Search empty legs with optimized filters
   */
  async searchEmptyLegs(filters: Partial<AdvancedSearchFilters> = {}): Promise<MarketplaceSearchResult> {
    return this.advancedSearch({
      ...filters,
      listing_type: 'empty_leg',
      sort_by: filters.sort_by || 'discount'
    });
  }

  /**
   * Search aircraft directory (all available aircraft)
   */
  async searchAircraftDirectory(filters: Partial<AdvancedSearchFilters> = {}): Promise<MarketplaceSearchResult> {
    return this.advancedSearch({
      ...filters,
      listing_type: 'charter',
      sort_by: filters.sort_by || 'price_asc'
    });
  }

  // ========================================
  // MARKETPLACE LISTINGS CRUD
  // ========================================

  /**
   * Create a new marketplace listing
   */
  async createListing(listing: Partial<MarketplaceListing>): Promise<MarketplaceListing> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    // Convert frontend format to database format
    const dbListing = toDbListing(listing);

    const { data, error } = await supabase
      .from('marketplace_listings')
      .insert([{
        ...dbListing,
        operator_id: user.user.id,
        status: 'active',
        view_count: 0,
        inquiry_count: 0
      }])
      .select()
      .single();

    if (error) throw error;
    
    // Convert back to frontend format
    return fromDbListing(data) as MarketplaceListing;
  }

  /**
   * Update a listing
   */
  async updateListing(listingId: string, updates: Partial<MarketplaceListing>): Promise<MarketplaceListing> {
    // Convert frontend format to database format
    const dbUpdates = toDbListing(updates);

    const { data, error } = await supabase
      .from('marketplace_listings')
      .update(dbUpdates)
      .eq('id', listingId)
      .select()
      .single();

    if (error) throw error;
    
    // Convert back to frontend format
    return fromDbListing(data) as MarketplaceListing;
  }

  /**
   * Delete a listing
   */
  async deleteListing(listingId: string): Promise<void> {
    const { error } = await supabase
      .from('marketplace_listings')
      .delete()
      .eq('id', listingId);

    if (error) throw error;
  }

  /**
   * Get single listing by ID and increment view count
   */
  async getListing(listingId: string): Promise<MarketplaceListing> {
    // Increment view count (silent fail if function doesn't exist)
    try {
      await supabase
        .from('marketplace_listings')
        .update({ view_count: supabase.sql`view_count + 1` })
        .eq('id', listingId);
    } catch (e) {
      // Ignore if view_count doesn't exist yet
    }

    const { data, error } = await supabase
      .from('marketplace_listings')
      .select(`
        *,
        operator:profiles!marketplace_listings_operator_id_fkey (
          id,
          full_name,
          company_name,
          role,
          verified,
          reputation_score,
          argus_rating,
          wyvern_status,
          avg_response_time_minutes,
          completion_rate,
          total_deals_completed
        ),
        aircraft_model:aircraft_models (
          id,
          manufacturer,
          model,
          category,
          typical_pax,
          max_range_nm,
          cruise_speed_kts,
          description
        )
      `)
      .eq('id', listingId)
      .single();

    if (error) throw error;
    
    // Convert database format to frontend format
    return fromDbListing(data) as MarketplaceListing;
  }

  /**
   * Get user's own listings
   */
  async getMyListings(): Promise<MarketplaceListing[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('marketplace_listings')
      .select(`
        *,
        aircraft_model:aircraft_models (
          manufacturer,
          model,
          category
        )
      `)
      .eq('operator_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Map database format to frontend format
    return (data || []).map(fromDbListing) as MarketplaceListing[];
  }

  // ========================================
  // TRIP REQUESTS (RFQs)
  // ========================================

  /**
   * Create a trip request with multi-leg support
   */
  async createTripRequest(input: CreateTripRequestInput): Promise<TripRequest> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const requestData: any = {
      broker_id: user.user.id,
      trip_type: input.trip_type,
      origin: input.origin.toUpperCase(),
      destination: input.destination.toUpperCase(),
      dep_time: input.dep_time,
      pax: input.pax,
      preferred_category: input.preferred_category,
      max_budget: input.max_budget,
      urgency: input.urgency || 'normal',
      status: 'open',
      metadata: input.metadata || {}
    };

    // Handle round-trip
    if (input.trip_type === 'round-trip' && input.return_date) {
      requestData.return_date = input.return_date;
    }

    // Handle multi-leg
    if (input.trip_type === 'multi-leg' && input.legs) {
      requestData.legs = input.legs;
    }

    const { data, error } = await supabase
      .from('trip_requests')
      .insert([requestData])
      .select()
      .single();

    if (error) throw error;
    return data as TripRequest;
  }

  /**
   * Search trip requests (for operators to browse)
   */
  async searchTripRequests(params: TripRequestSearchParams = {}): Promise<TripRequestSearchResult> {
    let query = supabase
      .from('trip_requests')
      .select(`
        *,
        broker:profiles!trip_requests_broker_id_fkey (
          id,
          full_name,
          company_name,
          role,
          verified,
          reputation_score
        )
      `, { count: 'exact' });

    // Apply filters
    if (params.status) {
      query = query.eq('status', params.status);
    } else {
      query = query.eq('status', 'open'); // Default to open requests
    }

    if (params.trip_type) {
      query = query.eq('trip_type', params.trip_type);
    }

    if (params.origin) {
      query = query.eq('origin', params.origin.toUpperCase());
    }

    if (params.destination) {
      query = query.eq('destination', params.destination.toUpperCase());
    }

    if (params.category) {
      query = query.eq('preferred_category', params.category);
    }

    if (params.min_budget) {
      query = query.gte('max_budget', params.min_budget);
    }

    if (params.urgency) {
      query = query.eq('urgency', params.urgency);
    }

    // Sort by urgency and creation date
    query = query.order('urgency', { ascending: false });
    query = query.order('created_at', { ascending: false });

    // Pagination
    const page = params.page || 1;
    const perPage = params.per_page || 20;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      success: true,
      page,
      perPage,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / perPage),
      results: data as TripRequest[]
    };
  }

  /**
   * Get user's own trip requests
   */
  async getMyTripRequests(): Promise<TripRequest[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('trip_requests')
      .select(`
        *,
        quotes:quotes (
          id,
          price,
          currency,
          status,
          operator:profiles!quotes_operator_id_fkey (
            id,
          full_name,
          company_name,
            argus_rating,
            wyvern_status
          )
        )
      `)
      .eq('broker_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as TripRequest[];
  }

  /**
   * Get trip request by ID with quotes
   */
  async getTripRequest(requestId: string): Promise<TripRequest> {
    const { data, error } = await supabase
      .from('trip_requests')
      .select(`
        *,
        broker:profiles!trip_requests_broker_id_fkey (
          id,
          full_name,
          company_name,
          verified
        ),
        quotes:quotes (
          id,
          price,
          currency,
          message,
          status,
          valid_until,
          response_time_minutes,
          created_at,
          operator:profiles!quotes_operator_id_fkey (
            id,
            full_name,
            company_name,
            argus_rating,
            wyvern_status,
            avg_response_time_minutes,
            completion_rate
          )
        )
      `)
      .eq('id', requestId)
      .single();

    if (error) throw error;
    return data as TripRequest;
  }

  // ========================================
  // QUOTES
  // ========================================

  /**
   * Submit a quote for a trip request (operators only)
   */
  async submitQuote(tripRequestId: string, quoteData: Partial<Quote>): Promise<Quote> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data: tripRequest } = await supabase
      .from('trip_requests')
      .select('created_at')
      .eq('id', tripRequestId)
      .single();

    const responseTimeMinutes = tripRequest
      ? Math.floor((new Date().getTime() - new Date(tripRequest.created_at).getTime()) / 60000)
      : undefined;

    const { data, error } = await supabase
      .from('quotes')
      .insert([{
        trip_request_id: tripRequestId,
        operator_id: user.user.id,
        price: quoteData.price,
        currency: quoteData.currency || 'USD',
        message: quoteData.message,
        valid_until: quoteData.valid_until,
        status: 'pending',
        response_time_minutes: responseTimeMinutes
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Quote;
  }

  /**
   * Accept a quote (brokers only)
   */
  async acceptQuote(quoteId: string): Promise<void> {
    const { error } = await supabase
      .from('quotes')
      .update({ status: 'accepted' })
      .eq('id', quoteId);

    if (error) throw error;
  }

  /**
   * Reject a quote (brokers only)
   */
  async rejectQuote(quoteId: string): Promise<void> {
    const { error } = await supabase
      .from('quotes')
      .update({ status: 'rejected' })
      .eq('id', quoteId);

    if (error) throw error;
  }

  // ========================================
  // AIRCRAFT MODELS & AIRPORT LOOKUP
  // ========================================

  /**
   * Get all aircraft models
   */
  async getAircraftModels(category?: AircraftCategory): Promise<AircraftModel[]> {
    let query = supabase
      .from('aircraft_models')
      .select('*')
      .order('manufacturer', { ascending: true })
      .order('model', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as AircraftModel[];
  }

  /**
   * Search airports by ICAO, IATA, or city name
   */
  async searchAirports(query: string): Promise<Airport[]> {
    const searchTerm = query.toUpperCase();

    const { data, error } = await supabase
      .from('airports')
      .select('*, icao as icao_code, iata as iata_code, lat as latitude, lon as longitude')
      .or(`icao.ilike.%${searchTerm}%,iata.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`)
      .limit(20);

    if (error) throw error;
    return data as Airport[];
  }

  /**
   * Get popular airports
   */
  async getPopularAirports(): Promise<Airport[]> {
    // Get major airports (fallback to all if no popular flag)
    const { data, error } = await supabase
      .from('airports')
      .select('*, icao as icao_code, iata as iata_code, lat as latitude, lon as longitude')
      .limit(25);

    if (error) throw error;
    return data as Airport[];
  }

  // ========================================
  // PREFERRED VENDORS
  // ========================================

  /**
   * Add operator to preferred vendors list
   */
  async addPreferredVendor(operatorId: string, notes?: string): Promise<PreferredVendor> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('preferred_vendors')
      .insert([{
        broker_id: user.user.id,
        operator_id: operatorId,
        notes
      }])
      .select(`
        *,
        operator:profiles!preferred_vendors_operator_id_fkey (
          id,
          full_name,
          company_name,
          argus_rating,
          wyvern_status
        )
      `)
      .single();

    if (error) throw error;
    return data as PreferredVendor;
  }

  /**
   * Remove operator from preferred vendors
   */
  async removePreferredVendor(vendorId: string): Promise<void> {
    const { error } = await supabase
      .from('preferred_vendors')
      .delete()
      .eq('id', vendorId);

    if (error) throw error;
  }

  /**
   * Get preferred vendors list
   */
  async getPreferredVendors(): Promise<PreferredVendor[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('preferred_vendors')
      .select(`
        *,
        operator:profiles!preferred_vendors_operator_id_fkey (
          id,
          full_name,
          company_name,
          argus_rating,
          wyvern_status,
          avg_response_time_minutes,
          completion_rate,
          total_deals_completed
        )
      `)
      .eq('broker_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as PreferredVendor[];
  }

  // ========================================
  // SAVED SEARCHES
  // ========================================

  /**
   * Save a search
   */
  async saveSearch(search: Partial<SavedSearch>): Promise<SavedSearch> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('saved_searches')
      .insert([{
        user_id: user.user.id,
        name: search.name,
        search_type: search.search_type,
        filters: search.filters,
        notify_on_match: search.notify_on_match || false
      }])
      .select()
      .single();

    if (error) throw error;
    return data as SavedSearch;
  }

  /**
   * Get saved searches
   */
  async getSavedSearches(): Promise<SavedSearch[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as SavedSearch[];
  }

  /**
   * Delete a saved search
   */
  async deleteSavedSearch(searchId: string): Promise<void> {
    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', searchId);

    if (error) throw error;
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Calculate trust score badge info
   */
  getTrustBadge(trustScore: number): { color: string; label: string; bgClass: string } {
    if (trustScore >= 90) return { color: 'text-emerald-400', label: 'Excellent', bgClass: 'bg-emerald-500' };
    if (trustScore >= 75) return { color: 'text-green-400', label: 'Very Good', bgClass: 'bg-green-500' };
    if (trustScore >= 60) return { color: 'text-blue-400', label: 'Good', bgClass: 'bg-blue-500' };
    if (trustScore >= 40) return { color: 'text-yellow-400', label: 'Fair', bgClass: 'bg-yellow-500' };
    return { color: 'text-gray-400', label: 'New', bgClass: 'bg-gray-500' };
  }

  /**
   * Format ARGUS rating
   */
  formatArgusRating(rating?: ArgusRating): string {
    if (!rating || rating === 'not_rated') return '';
    return `ARGUS ${rating.charAt(0).toUpperCase() + rating.slice(1)}`;
  }

  /**
   * Format WYVERN status
   */
  formatWyvernStatus(status?: WyvernStatus): string {
    if (!status || status === 'not_certified') return '';
    return `WYVERN ${status === 'elite' ? 'Elite' : 'Certified'}`;
  }
}

export const marketplaceService = new MarketplaceService();


