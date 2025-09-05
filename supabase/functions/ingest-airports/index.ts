import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    console.log('Starting OurAirports data ingestion...');

    // Fetch airports CSV from OurAirports
    const response = await fetch('https://davidmegginson.github.io/ourairports-data/airports.csv');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch airports data: ${response.status}`);
    }

    const csvText = await response.text();
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
    
    console.log(`Processing ${lines.length - 1} airport records...`);

    let insertedCount = 0;
    const batchSize = 100;
    const airports = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(v => v.replace(/"/g, ''));
      const airport = {};
      
      headers.forEach((header, index) => {
        airport[header] = values[index] || null;
      });

      // Only process airports with ICAO codes and coordinates
      if (!airport.ident || !airport.latitude_deg || !airport.longitude_deg) continue;
      if (airport.type !== 'large_airport' && airport.type !== 'medium_airport' && airport.type !== 'small_airport') continue;

      const lat = parseFloat(airport.latitude_deg);
      const lon = parseFloat(airport.longitude_deg);
      
      if (isNaN(lat) || isNaN(lon)) continue;

      airports.push({
        icao: airport.ident,
        iata: airport.iata_code || null,
        name: airport.name || null,
        country: airport.iso_country || null,
        lat: lat,
        lon: lon,
        geom: `POINT(${lon} ${lat})` // PostGIS format
      });

      // Insert in batches
      if (airports.length >= batchSize) {
        const { error } = await supabaseClient
          .from('airports')
          .upsert(airports, { onConflict: 'icao' });

        if (error) {
          console.error('Batch insert error:', error);
        } else {
          insertedCount += airports.length;
          console.log(`Inserted batch of ${airports.length} airports. Total: ${insertedCount}`);
        }
        
        airports.length = 0; // Clear the batch
      }
    }

    // Insert remaining airports
    if (airports.length > 0) {
      const { error } = await supabaseClient
        .from('airports')
        .upsert(airports, { onConflict: 'icao' });

      if (error) {
        console.error('Final batch insert error:', error);
      } else {
        insertedCount += airports.length;
      }
    }

    console.log(`Airport ingestion completed. Processed ${insertedCount} airports.`);

    return new Response(JSON.stringify({
      message: `Successfully processed ${insertedCount} airports`,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ingest-airports function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});