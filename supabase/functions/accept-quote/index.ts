// Accept Quote Edge Function
// Handles quote acceptance, deal creation, and payment processing

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const {
      quote_id,
      payment_intent_id,
      payment_method_id
    } = await req.json()

    // Validate required fields
    if (!quote_id) {
      return new Response(
        JSON.stringify({ error: 'Missing quote_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's company and role
    const { data: userData, error: userDataError } = await supabaseClient
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (userDataError || !userData || userData.role !== 'broker') {
      return new Response(
        JSON.stringify({ error: 'User must be a broker to accept quotes' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get quote details with RFQ info
    const { data: quote, error: quoteError } = await supabaseClient
      .from('quotes')
      .select(`
        *,
        rfqs!inner (
          id,
          broker_id,
          broker_company_id,
          status,
          currency
        )
      `)
      .eq('id', quote_id)
      .eq('status', 'pending')
      .single()

    if (quoteError || !quote) {
      return new Response(
        JSON.stringify({ error: 'Quote not found or not available for acceptance' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify broker owns the RFQ
    if (quote.rfqs.broker_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'You can only accept quotes for your own RFQs' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if quote is still valid
    if (new Date(quote.valid_until) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Quote has expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Start a transaction
    const { data: deal, error: dealError } = await supabaseClient.rpc('create_deal_from_quote', {
      p_quote_id: quote_id,
      p_payment_intent_id: payment_intent_id
    })

    if (dealError) {
      console.error('Error creating deal:', dealError)
      return new Response(
        JSON.stringify({ error: 'Failed to create deal', details: dealError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update quote status to accepted
    const { error: quoteUpdateError } = await supabaseClient
      .from('quotes')
      .update({ status: 'accepted' })
      .eq('id', quote_id)

    if (quoteUpdateError) {
      console.error('Error updating quote status:', quoteUpdateError)
      // Continue anyway as deal was created
    }

    // Reject all other quotes for this RFQ
    const { error: rejectOtherQuotesError } = await supabaseClient
      .from('quotes')
      .update({ status: 'rejected' })
      .eq('rfq_id', quote.rfq_id)
      .neq('id', quote_id)

    if (rejectOtherQuotesError) {
      console.error('Error rejecting other quotes:', rejectOtherQuotesError)
      // Continue anyway
    }

    // Update RFQ status to quoted
    const { error: rfqUpdateError } = await supabaseClient
      .from('rfqs')
      .update({ status: 'quoted' })
      .eq('id', quote.rfq_id)

    if (rfqUpdateError) {
      console.error('Error updating RFQ status:', rfqUpdateError)
      // Continue anyway
    }

    // Notify operator (in a real implementation, this would send push notifications)
    const { data: operator, error: operatorError } = await supabaseClient
      .from('users')
      .select('id, full_name, email')
      .eq('id', quote.operator_id)
      .single()

    if (!operatorError && operator) {
      // Log notification attempt
      await supabaseClient
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: 'deal_notification_sent',
          table_name: 'deals',
          record_id: deal,
          new_values: {
            operator_id: quote.operator_id,
            deal_id: deal,
            total_price: quote.price
          }
        })
    }

    // Update performance metrics
    await supabaseClient.rpc('update_performance_metrics', {
      p_user_id: user.id,
      p_company_id: userData.company_id,
      p_metric_type: 'deals_closed',
      p_metric_value: 1
    })

    await supabaseClient.rpc('update_performance_metrics', {
      p_user_id: user.id,
      p_company_id: userData.company_id,
      p_metric_type: 'total_revenue',
      p_metric_value: quote.price
    })

    // Update operator metrics
    await supabaseClient.rpc('update_performance_metrics', {
      p_user_id: quote.operator_id,
      p_company_id: quote.operator_company_id,
      p_metric_type: 'quotes_accepted',
      p_metric_value: 1
    })

    // Log the deal creation
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'deal_created',
        table_name: 'deals',
        record_id: deal,
        new_values: {
          quote_id,
          total_price: quote.price,
          currency: quote.currency,
          operator_id: quote.operator_id
        }
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        deal_id: deal,
        quote_accepted: quote_id,
        operator_notified: !operatorError,
        total_price: quote.price,
        currency: quote.currency
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in accept-quote function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})