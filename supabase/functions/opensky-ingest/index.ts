import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ICAO types for business jets to filter
const BUSINESS_JET_TYPES = [
  'E55P', 'C56X', 'G550', 'H25B', 'C680', 'F2TH', 'C25A', 'C25B', 'C25C',
  'C500', 'C501', 'C510', 'C525', 'C550', 'C560', 'C650', 'C750', 'GLF4',
  'GLF5', 'GLF6', 'G280', 'G650', 'F900', 'FA10', 'FA20', 'FA50', 'FA7X'
];

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

    const openskyUsername = Deno.env.get('OPENSKY_USERNAME');
    const openskyPassword = Deno.env.get('OPENSKY_PASSWORD');

    if (!openskyUsername || !openskyPassword) {
      console.error('OpenSky credentials not found');
      return new Response(JSON.stringify({ error: 'OpenSky credentials not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Starting OpenSky data ingestion...');

    // Fetch current states from OpenSky Network
    const authString = btoa(`${openskyUsername}:${openskyPassword}`);
    const openskyResponse = await fetch('https://opensky-network.org/api/states/all', {
      headers: {
        'Authorization': `Basic ${authString}`
      }
    });

    if (!openskyResponse.ok) {
      throw new Error(`OpenSky API error: ${openskyResponse.status}`);
    }

    const openskyData = await openskyResponse.json();
    console.log(`Received ${openskyData.states?.length || 0} aircraft states from OpenSky`);

    if (!openskyData.states) {
      return new Response(JSON.stringify({ message: 'No states received from OpenSky' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get existing aircraft to match ICAO24 codes
    const { data: existingAircraft } = await supabaseClient
      .from('aircraft')
      .select('tail_number, icao24, icao_type');

    const aircraftMap = new Map();
    existingAircraft?.forEach(aircraft => {
      if (aircraft.icao24) {
        aircraftMap.set(aircraft.icao24.toLowerCase(), aircraft);
      }
    });

    let updatedCount = 0;
    const currentTime = new Date().toISOString();

    for (const state of openskyData.states) {
      const [
        icao24, callsign, origin_country, time_position, last_contact,
        longitude, latitude, baro_altitude, on_ground, velocity,
        true_track, vertical_rate, sensors, geo_altitude, squawk, spi, position_source
      ] = state;

      if (!icao24 || on_ground) continue;

      const aircraft = aircraftMap.get(icao24.toLowerCase());
      if (!aircraft || !BUSINESS_JET_TYPES.includes(aircraft.icao_type)) continue;

      // Find nearest airport (simplified - using a basic distance calculation)
      const { data: nearestAirport } = await supabaseClient
        .rpc('find_nearest_airport', {
          lat_param: latitude,
          lon_param: longitude
        });

      const lastSeenIcao = nearestAirport?.[0]?.icao || 'UNKNOWN';

      // Update or insert signal data
      const { error: signalError } = await supabaseClient
        .from('signals')
        .upsert({
          tail_number: aircraft.tail_number,
          last_seen_time: currentTime,
          last_seen_icao: lastSeenIcao,
          utilisation_hrs_7d: 0, // Will be calculated in a separate process
          reposition_bias_km: 0
        }, {
          onConflict: 'tail_number'
        });

      if (signalError) {
        console.error('Error updating signal:', signalError);
      } else {
        updatedCount++;
      }
    }

    console.log(`Updated signals for ${updatedCount} aircraft`);

    return new Response(JSON.stringify({
      message: `Processed ${openskyData.states.length} states, updated ${updatedCount} aircraft signals`,
      timestamp: currentTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in opensky-ingest function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});