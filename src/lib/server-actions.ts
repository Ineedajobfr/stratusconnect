// Server Actions - Real Actions for Real Hunters
// FCA Compliant Aviation Platform - No More Pretty Demos

import { supabase } from '@/integrations/supabase/client';

export interface CreateQuoteAction {
  route: string;
  price: number;
  currency: string;
  aircraft_type?: string;
  departure_date?: string;
  passengers?: number;
}

export interface AdjustPriceAction {
  route: string;
  newPrice: number;
  currency: string;
  aircraft_id?: string;
}

export interface RequestPilotAction {
  pilot_id: string;
  route: string;
  departure_date: string;
  rate: number;
  currency: string;
}

export interface RequestCrewAction {
  crew_id: string;
  route: string;
  departure_date: string;
  rate: number;
  currency: string;
}

export interface FleetAction {
  aircraft_id: string;
  action: 'maintenance' | 'deploy' | 'ground';
  reason?: string;
}

// Create Quote Action - Real quote creation
export async function createQuote(action: CreateQuoteAction) {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .insert({
        route: action.route,
        price: action.price,
        currency: action.currency,
        aircraft_type: action.aircraft_type,
        departure_date: action.departure_date,
        passengers: action.passengers,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await supabase.rpc('log_ai_recommendation', {
      p_user_id: 'current_user', // In real implementation, get from auth
      p_role: 'broker',
      p_model_version: 'v0.2-hunter',
      p_insight_type: 'quote_creation',
      p_inputs: action,
      p_outputs: { quote_id: data.id, status: 'created' },
      p_latency_ms: 0
    });

    return { success: true, quote_id: data.id };
  } catch (error) {
    console.error('Create Quote Error:', error);
    return { success: false, error: error.message };
  }
}

// Adjust Price Action - Real price adjustment
export async function adjustPrice(action: AdjustPriceAction) {
  try {
    const { data, error } = await supabase
      .from('marketplace_listings')
      .update({
        price_usd: action.newPrice,
        updated_at: new Date().toISOString()
      })
      .eq('route', action.route)
      .eq('aircraft_id', action.aircraft_id)
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await supabase.rpc('log_ai_recommendation', {
      p_user_id: 'current_user',
      p_role: 'operator',
      p_model_version: 'v0.2-hunter',
      p_insight_type: 'price_adjustment',
      p_inputs: action,
      p_outputs: { listing_id: data.id, new_price: action.newPrice },
      p_latency_ms: 0
    });

    return { success: true, listing_id: data.id };
  } catch (error) {
    console.error('Adjust Price Error:', error);
    return { success: false, error: error.message };
  }
}

// Request Pilot Action - Real pilot request
export async function requestPilot(action: RequestPilotAction) {
  try {
    const { data, error } = await supabase
      .from('pilot_requests')
      .insert({
        pilot_id: action.pilot_id,
        route: action.route,
        departure_date: action.departure_date,
        rate: action.rate,
        currency: action.currency,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await supabase.rpc('log_ai_recommendation', {
      p_user_id: 'current_user',
      p_role: 'operator',
      p_model_version: 'v0.2-hunter',
      p_insight_type: 'pilot_request',
      p_inputs: action,
      p_outputs: { request_id: data.id, status: 'pending' },
      p_latency_ms: 0
    });

    return { success: true, request_id: data.id };
  } catch (error) {
    console.error('Request Pilot Error:', error);
    return { success: false, error: error.message };
  }
}

// Request Crew Action - Real crew request
export async function requestCrew(action: RequestCrewAction) {
  try {
    const { data, error } = await supabase
      .from('crew_requests')
      .insert({
        crew_id: action.crew_id,
        route: action.route,
        departure_date: action.departure_date,
        rate: action.rate,
        currency: action.currency,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await supabase.rpc('log_ai_recommendation', {
      p_user_id: 'current_user',
      p_role: 'operator',
      p_model_version: 'v0.2-hunter',
      p_insight_type: 'crew_request',
      p_inputs: action,
      p_outputs: { request_id: data.id, status: 'pending' },
      p_latency_ms: 0
    });

    return { success: true, request_id: data.id };
  } catch (error) {
    console.error('Request Crew Error:', error);
    return { success: false, error: error.message };
  }
}

// Fleet Action - Real fleet management
export async function fleetAction(action: FleetAction) {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    switch (action.action) {
      case 'maintenance':
        updateData.status = 'maintenance';
        updateData.maintenance_reason = action.reason;
        break;
      case 'deploy':
        updateData.status = 'available';
        break;
      case 'ground':
        updateData.status = 'grounded';
        updateData.ground_reason = action.reason;
        break;
    }

    const { data, error } = await supabase
      .from('aircraft')
      .update(updateData)
      .eq('id', action.aircraft_id)
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await supabase.rpc('log_ai_recommendation', {
      p_user_id: 'current_user',
      p_role: 'operator',
      p_model_version: 'v0.2-hunter',
      p_insight_type: 'fleet_action',
      p_inputs: action,
      p_outputs: { aircraft_id: data.id, new_status: data.status },
      p_latency_ms: 0
    });

    return { success: true, aircraft_id: data.id, new_status: data.status };
  } catch (error) {
    console.error('Fleet Action Error:', error);
    return { success: false, error: error.message };
  }
}

// Get AI Insights - Real data from edge function
export async function getAIInsights(role: string, params: any) {
  try {
    const response = await fetch('/api/ai/demand-price', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role,
        ...params
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, insights: data.insights };
  } catch (error) {
    console.error('Get AI Insights Error:', error);
    return { success: false, error: error.message };
  }
}

// Get Market Data - Real market data
export async function getMarketData(routes: string[]) {
  try {
    const { data, error } = await supabase
      .from('mv_market_demand')
      .select('*')
      .in('route', routes)
      .gte('day', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('day', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Get Market Data Error:', error);
    return { success: false, error: error.message };
  }
}

// Get Fleet Data - Real fleet data
export async function getFleetData(aircraft_ids: string[]) {
  try {
    const { data, error } = await supabase
      .from('mv_fleet_utilization')
      .select('*')
      .in('aircraft_id', aircraft_ids);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Get Fleet Data Error:', error);
    return { success: false, error: error.message };
  }
}

// Get Pilot Data - Real pilot data
export async function getPilotData() {
  try {
    const { data, error } = await supabase
      .from('mv_pilot_performance')
      .select('*')
      .limit(20)
      .order('avg_flight_rating', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Get Pilot Data Error:', error);
    return { success: false, error: error.message };
  }
}

// Get Crew Data - Real crew data
export async function getCrewData() {
  try {
    const { data, error } = await supabase
      .from('crew_profiles')
      .select('*')
      .limit(20)
      .order('rating', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Get Crew Data Error:', error);
    return { success: false, error: error.message };
  }
}
