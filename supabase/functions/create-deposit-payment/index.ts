import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.18.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DepositPaymentRequest {
  dealId: string;
  amount: number;
  currency: string;
  userId: string;
  metadata: {
    deal_id: string;
    broker: string;
    operator: string;
    deposit_type: string;
  };
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

    const { dealId, amount, currency, userId, metadata }: DepositPaymentRequest = await req.json()

    // Validate required fields
    if (!dealId || !amount || !currency || !userId) {
      throw new Error('Missing required fields: dealId, amount, currency, userId')
    }

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized: User not authenticated')
    }

    // Calculate fees
    const platformFee = Math.round(amount * 0.07) // 7% platform fee
    const netAmount = amount - platformFee

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency.toLowerCase(),
      application_fee_amount: platformFee,
      metadata: {
        deal_id: dealId,
        user_id: userId,
        deposit_type: 'contact_reveal',
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true,
      },
      confirm: false,
    })

    // Generate audit hash
    const auditData = {
      payment_intent_id: paymentIntent.id,
      deal_id: dealId,
      amount,
      platform_fee: platformFee,
      net_amount: netAmount,
      currency,
      user_id: userId,
      timestamp: new Date().toISOString(),
      metadata
    }

    const auditHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(JSON.stringify(auditData))
    )

    // Store payment record in database
    const { error: dbError } = await supabaseClient
      .from('deposit_payments')
      .insert({
        id: paymentIntent.id,
        deal_id: dealId,
        user_id: userId,
        amount,
        currency,
        platform_fee: platformFee,
        net_amount: netAmount,
        status: paymentIntent.status,
        audit_hash: Array.from(new Uint8Array(auditHash))
          .map(b => b.toString(16).padStart(2, '0'))
          .join(''),
        metadata,
        created_at: new Date().toISOString()
      })

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to store payment record')
    }

    return new Response(
      JSON.stringify({
        payment_intent_id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        amount,
        currency,
        platform_fee: platformFee,
        net_amount: netAmount,
        audit_hash: Array.from(new Uint8Array(auditHash))
          .map(b => b.toString(16).padStart(2, '0'))
          .join(''),
        status: paymentIntent.status
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating deposit payment:', error)
    
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
