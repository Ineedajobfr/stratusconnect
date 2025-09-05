import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function calculateOperatorScore(operator: any, context: any) {
  const legality_ok = operator.certificate_no ? 1 : 0;
  const fleet_fit = operator.hasExactType ? 1 : operator.hasClass ? 0.6 : 0;
  const proximity = 1 - Math.min(context.km_to_origin / 2000, 1); // 0 to 1
  const availability = 1 - Math.min(context.reposition_bias_km / 1500, 1);
  const platform_perf = operator.platformPerf || 0.5; // will improve once live

  return Math.round(
    40 * legality_ok +
    25 * fleet_fit +
    15 * proximity +
    10 * availability +
    10 * platform_perf
  );
}

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

    const { origin_icao, dest_icao, window_start, window_end, class: cls } = await req.json();
    
    if (!origin_icao || !dest_icao || !cls) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Operator match request:', { origin_icao, dest_icao, window_start, window_end, cls });

    // Get operators with aircraft in the specified class
    const { data: operators, error } = await supabaseClient
      .from('operators')
      .select(`
        *,
        aircraft!inner(icao_type, tail_number, home_base_icao)
      `);

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Database query failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Map ICAO types to classes (simplified mapping)
    const typeToClass = {
      'E55P': 'light',      // Phenom 300
      'C56X': 'midsize',    // Citation Excel  
      'G550': 'heavy',      // Gulfstream G550
      'H25B': 'light',      // Hawker 800
      'C680': 'midsize',    // Citation Latitude
      'F2TH': 'heavy',      // Falcon 2000
    };

    const scoredOperators = (operators || []).map(operator => {
      // Check if operator has aircraft matching the class
      const hasExactType = operator.aircraft?.some((a: any) => 
        typeToClass[a.icao_type] === cls
      );
      const hasClass = operator.aircraft?.some((a: any) => 
        typeToClass[a.icao_type]
      );

      // Calculate context for scoring
      const context = {
        km_to_origin: Math.random() * 1000, // Simplified - would calculate real distance
        reposition_bias_km: Math.random() * 500,
      };

      const score = calculateOperatorScore({
        ...operator,
        hasExactType,
        hasClass,
        platformPerf: 0.7 // Default performance score
      }, context);

      const reasons = [];
      if (operator.certificate_no) reasons.push('legal in region');
      if (hasExactType) reasons.push('exact type in fleet');
      else if (hasClass) reasons.push('class match');
      if (context.km_to_origin < 500) reasons.push('close to origin');
      if (context.reposition_bias_km < 200) reasons.push('low reposition');
      reasons.push('good platform performance');

      return {
        name: operator.name,
        score,
        reasons: reasons.slice(0, 3) // Limit to top 3 reasons
      };
    })
    .filter(op => op.score > 30) // Filter out very low scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Top 10 operators

    return new Response(JSON.stringify({ operators: scoredOperators }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in operator-match function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});