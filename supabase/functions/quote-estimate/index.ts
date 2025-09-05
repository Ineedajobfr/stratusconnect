import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CLASS_CRUISE_SPEEDS = {
  very_light: 330,
  light: 360, 
  midsize: 420,
  super_midsize: 450,
  heavy: 470
};

const CLASS_MIN_BLOCK = {
  very_light: 1.0,
  light: 1.2,
  midsize: 1.5,
  super_midsize: 1.7,
  heavy: 2.0
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { origin_icao, dest_icao, pax, class: cls, lead_days } = await req.json();
    
    if (!origin_icao || !dest_icao || !cls) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Quote estimate request:', { origin_icao, dest_icao, pax, cls, lead_days });

    // Get baseline rate for class
    const { data: baseline } = await supabaseClient
      .from('hourly_rate_baseline')
      .select('baseline_usd')
      .eq('class', cls)
      .single();

    if (!baseline) {
      return new Response(JSON.stringify({ error: 'Aircraft class not found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate distance using SQL function
    const { data: distanceResult } = await supabaseClient
      .rpc('distance_nm', { origin_icao, dest_icao });

    if (!distanceResult) {
      return new Response(JSON.stringify({ error: 'Could not calculate distance' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const distance = distanceResult;
    const cruise_speed = CLASS_CRUISE_SPEEDS[cls] || 400;
    const min_block = CLASS_MIN_BLOCK[cls] || 1.5;
    
    // Calculate block time
    const block_time = Math.max(0.3 + distance / cruise_speed, min_block);

    // Reposition factor - simplified for now
    const reposition_nm = Math.min(distance * 0.2, 600); // Assume 20% reposition up to 600nm max
    const reposition_factor = 1 + Math.min(Math.max(reposition_nm / 600, 0), 0.5);

    // Demand factor - simplified baseline
    const demand_factor = 1.0; // Could be enhanced with real utilization data
    
    // Lead time factor
    const lead_time_factor = (lead_days || 7) < 3 ? 1.15 : (lead_days || 7) < 7 ? 1.07 : 1.0;

    const est_price = Math.round(baseline.baseline_usd * block_time * reposition_factor * demand_factor * lead_time_factor);

    const response = {
      est_price_usd: est_price,
      block_time_hr: Math.round(block_time * 10) / 10,
      reposition_nm: Math.round(reposition_nm),
      factors: {
        base_usd_per_hr: baseline.baseline_usd,
        reposition_factor: Math.round(reposition_factor * 100) / 100,
        demand_factor: Math.round(demand_factor * 100) / 100,
        lead_time_factor: Math.round(lead_time_factor * 100) / 100
      }
    };

    // Log the quote for future analysis
    await supabaseClient.from('quotes').insert({
      origin_icao,
      dest_icao,
      pax: pax || null,
      aircraft_choice: cls,
      est_price_usd: est_price,
      driver_breakdown_json: response.factors
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in quote-estimate function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});