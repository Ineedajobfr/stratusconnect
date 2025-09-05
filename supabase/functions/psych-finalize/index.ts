import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id, user_id } = await req.json();
    
    console.log(`Processing session ${session_id} for user ${user_id}`);
    
    // Fetch responses with item metadata
    const { data: rows, error: fetchError } = await supabase
      .from("psych_responses")
      .select(`
        item_id,
        response,
        ms_elapsed,
        psych_items(
          type,
          payload,
          trait_map,
          psych_modules(code)
        )
      `)
      .eq("session_id", session_id);

    if (fetchError) {
      console.error("Error fetching responses:", fetchError);
      return jsonResponse({ error: "Failed to fetch responses" }, 400);
    }

    if (!rows || rows.length === 0) {
      console.error("No responses found for session");
      return jsonResponse({ error: "No responses found" }, 400);
    }

    console.log(`Found ${rows.length} responses`);

    const records = rows.map((r: any) => ({
      item_id: r.item_id,
      module_code: r.psych_items?.psych_modules?.code,
      type: r.psych_items?.type,
      payload: r.psych_items?.payload,
      trait_map: r.psych_items?.trait_map,
      response: r.response
    }));

    const raw = scoreResponses(records);
    const norms = await fetchNorms();
    const final = normalizeWithNorms(raw, norms);

    console.log("Calculated scores:", final);

    // Insert scores
    const inserts = Object.entries(final).map(([trait, v]: [string, any]) => ({
      session_id,
      user_id,
      trait,
      raw: v.raw,
      zscore: v.z,
      percentile: v.percentile,
      module_code: null
    }));

    const { error: insertError } = await supabase
      .from("psych_scores")
      .insert(inserts);

    if (insertError) {
      console.error("Error inserting scores:", insertError);
      return jsonResponse({ error: "Failed to save scores" }, 500);
    }

    // Update session status
    const { error: updateError } = await supabase
      .from("psych_sessions")
      .update({ 
        status: "completed", 
        completed_at: new Date().toISOString() 
      })
      .eq("id", session_id);

    if (updateError) {
      console.error("Error updating session:", updateError);
      return jsonResponse({ error: "Failed to update session" }, 500);
    }

    console.log("Session finalized successfully");

    return jsonResponse({ ok: true, traits: final }, 200);
  } catch (e) {
    console.error("Error in psych-finalize:", e);
    return jsonResponse({ error: String(e) }, 500);
  }
});

function jsonResponse(obj: any, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" }
  });
}

function erf(x: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, 
        a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const t = 1 / (1 + p * Math.abs(x));
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

function scoreResponses(rows: any[]): Record<string, number> {
  const totals: Record<string, number> = {};
  
  const add = (k: string, v: number) => {
    totals[k] = (totals[k] || 0) + v;
  };

  for (const r of rows) {
    if (r.type === "likert") {
      const v = Number(r.response?.value ?? 0);
      const scale = r.payload?.scale?.slice(-1)[0] ?? 5;
      const reverse = !!r.payload?.reverse;
      const centred = (reverse ? scale + 1 - v : v) - ((scale + 1) / 2);
      
      for (const [k, w] of Object.entries(r.trait_map || {})) {
        if (k === "KEY") continue;
        add(k, (centred / (scale / 2)) * Number(w));
      }
    }
    
    if (r.type === "scenario") {
      const chosen = Number(r.response?.option ?? -1);
      const key = Number(r.trait_map?.KEY ?? -1);
      const correct = chosen === key;
      
      for (const [k, w] of Object.entries(r.trait_map || {})) {
        if (k === "KEY") continue;
        add(k, (correct ? 1 : -0.3) * Number(w));
      }
    }
  }
  
  return totals;
}

async function fetchNorms(): Promise<Record<string, { mean: number; sd: number }>> {
  const { data } = await supabase.from("psych_norms").select("trait, mean, sd");
  const out: Record<string, { mean: number; sd: number }> = {};
  
  for (const r of (data || [])) {
    out[r.trait] = { mean: Number(r.mean), sd: Number(r.sd || 1) };
  }
  
  return out;
}

function normalizeWithNorms(raw: Record<string, number>, norms: Record<string, { mean: number; sd: number }>) {
  const res: any = {};
  
  for (const [k, v] of Object.entries(raw)) {
    const n = norms[k] || { mean: 0, sd: 1 };
    const z = (v - n.mean) / (n.sd || 1);
    const percentile = Math.round((0.5 * (1 + erf(z / Math.sqrt(2)))) * 100);
    res[k] = { raw: v, z, percentile };
  }
  
  return res;
}