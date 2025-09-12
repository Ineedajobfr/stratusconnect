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
    const { deal_id, amount, currency = 'USD' } = await req.json();
    
    console.log(`Creating escrow account for deal ${deal_id}, amount: ${amount} ${currency}`);
    
    // Generate a unique account ID
    const account_id = `ESC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create escrow account
    const { data: escrowData, error: escrowError } = await supabase
      .from("escrow_accounts")
      .insert({
        deal_id,
        account_id,
        balance: 0, // Start with 0, will be funded separately
        currency,
        status: 'active'
      })
      .select()
      .single();

    if (escrowError) {
      console.error("Error creating escrow account:", escrowError);
      return jsonResponse({ error: "Failed to create escrow account" }, 400);
    }

    console.log("Escrow account created successfully:", escrowData);

    return jsonResponse({ 
      escrow_account: escrowData,
      message: "Escrow account created successfully"
    }, 201);

  } catch (e) {
    console.error("Error in escrow-create:", e);
    return jsonResponse({ error: String(e) }, 500);
  }
});

function jsonResponse(obj: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" }
  });
}