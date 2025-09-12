import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.18.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CheckPaymentRequest {
  paymentIntentId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    })

    const { paymentIntentId }: CheckPaymentRequest = await req.json()

    // Validate required fields
    if (!paymentIntentId) {
      throw new Error('Missing required field: paymentIntentId')
    }

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized: User not authenticated')
    }

    // Check payment intent status in Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Verify user has access to this payment intent
    if (paymentIntent.metadata.user_id !== user.id) {
      throw new Error('Unauthorized: User does not have access to this payment intent')
    }

    // Update database with latest status if it has changed
    if (paymentIntent.status !== 'requires_payment_method') {
      const { error: dbError } = await supabaseClient
        .from('deposit_payments')
        .update({
          status: paymentIntent.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentIntentId)

      if (dbError) {
        console.error('Database update error:', dbError)
        // Don't throw here, just log the error
      }
    }

    return new Response(
      JSON.stringify({
        payment_intent_id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        created: paymentIntent.created,
        client_secret: paymentIntent.client_secret,
        metadata: paymentIntent.metadata
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error checking payment status:', error)
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
