import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { escrow_account_id, amount, currency = 'USD' } = await req.json();
    
    console.log(`Funding escrow account ${escrow_account_id}, amount: ${amount} ${currency}`);
    
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

    // Get the user's email from the deal
    const { data: dealData, error: dealError } = await supabase
      .from("deals")
      .select(`
        *,
        broker_profiles:broker_id(user_id),
        operator_profiles:operator_id(user_id)
      `)
      .eq("id", escrowData.deal_id)
      .single();

    if (dealError || !dealData) {
      console.error("Deal not found:", dealError);
      return jsonResponse({ error: "Deal not found" }, 404);
    }

    // Create Stripe checkout session for escrow funding
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { 
              name: `Escrow Funding - Deal ${escrowData.deal_id.substring(0, 8)}`,
              description: "Secure escrow payment for aviation transaction"
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/escrow-success?session_id={CHECKOUT_SESSION_ID}&escrow_id=${escrow_account_id}`,
      cancel_url: `${req.headers.get("origin")}/escrow-cancelled?escrow_id=${escrow_account_id}`,
      metadata: {
        escrow_account_id,
        deal_id: escrowData.deal_id
      }
    });

    // Record the payment attempt
    const { error: paymentError } = await supabase
      .from("payments")
      .insert({
        deal_id: escrowData.deal_id,
        payer_id: dealData.broker_id, // Assuming broker pays into escrow
        amount: Math.round(amount * 100), // Store in cents
        currency: currency.toLowerCase(),
        payment_type: 'escrow_funding',
        stripe_session_id: session.id,
        status: 'pending'
      });

    if (paymentError) {
      console.error("Error recording payment:", paymentError);
      // Continue anyway, payment can be tracked via Stripe
    }

    console.log("Escrow funding session created:", session.id);

    return jsonResponse({ 
      checkout_url: session.url,
      session_id: session.id
    }, 200);

  } catch (e) {
    console.error("Error in escrow-fund:", e);
    return jsonResponse({ error: String(e) }, 500);
  }
});

function jsonResponse(obj: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" }
  });
}