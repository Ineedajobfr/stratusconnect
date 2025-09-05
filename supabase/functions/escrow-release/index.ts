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
    const { 
      escrow_account_id, 
      release_amount, 
      recipient_id, 
      release_reason = 'Deal completed successfully' 
    } = await req.json();
    
    console.log(`Releasing ${release_amount} from escrow ${escrow_account_id} to ${recipient_id}`);
    
    // Get escrow account details
    const { data: escrowData, error: escrowError } = await supabase
      .from("escrow_accounts")
      .select("*")
      .eq("account_id", escrow_account_id)
      .single();

    if (escrowError || !escrowData) {
      console.error("Escrow account not found:", escrowError);
      return jsonResponse({ error: "Escrow account not found" }, 404);
    }

    // Check if sufficient balance
    if (escrowData.balance < release_amount) {
      return jsonResponse({ 
        error: `Insufficient escrow balance. Available: ${escrowData.balance}, Requested: ${release_amount}` 
      }, 400);
    }

    // Update escrow balance
    const newBalance = escrowData.balance - release_amount;
    const { error: updateError } = await supabase
      .from("escrow_accounts")
      .update({ 
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq("id", escrowData.id);

    if (updateError) {
      console.error("Error updating escrow balance:", updateError);
      return jsonResponse({ error: "Failed to update escrow balance" }, 500);
    }

    // Record the release transaction in audit logs
    const { error: auditError } = await supabase
      .from("audit_logs")
      .insert({
        actor_id: recipient_id,
        action: 'escrow_release',
        target_type: 'escrow_account',
        target_id: escrow_account_id,
        before_values: { balance: escrowData.balance },
        after_values: { 
          balance: newBalance,
          released_amount: release_amount,
          release_reason 
        }
      });

    if (auditError) {
      console.error("Error creating audit log:", auditError);
      // Continue anyway, the financial transaction is more important
    }

    // Create payment record for the release
    const { error: paymentError } = await supabase
      .from("payments")
      .insert({
        deal_id: escrowData.deal_id,
        payer_id: escrowData.deal_id, // Using deal_id as conceptual "payer" for escrow release
        amount: Math.round(release_amount * 100), // Convert to cents
        currency: escrowData.currency,
        payment_type: 'escrow_release',
        status: 'paid'
      });

    if (paymentError) {
      console.error("Error recording release payment:", paymentError);
      // Continue anyway
    }

    console.log(`Escrow release completed. New balance: ${newBalance}`);

    return jsonResponse({ 
      success: true,
      new_balance: newBalance,
      released_amount: release_amount,
      recipient_id,
      message: "Escrow funds released successfully"
    }, 200);

  } catch (e) {
    console.error("Error in escrow-release:", e);
    return jsonResponse({ error: String(e) }, 500);
  }
});

function jsonResponse(obj: any, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" }
  });
}