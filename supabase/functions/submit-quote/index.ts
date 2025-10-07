// Submit Quote Edge Function
// Handles quote submission and broker notifications

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
      rfq_id,
      price,
      currency,
      aircraft_id,
      aircraft_model,
      aircraft_tail_number,
      valid_until,
      terms,
      notes
    } = await req.json()

    // Validate required fields
    if (!rfq_id || !price || !valid_until) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's company and role
    const { data: userData, error: userDataError } = await supabaseClient
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (userDataError || !userData || userData.role !== 'operator') {
      return new Response(
        JSON.stringify({ error: 'User must be an operator to submit quotes' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify RFQ exists and is open for quoting
    const { data: rfq, error: rfqError } = await supabaseClient
      .from('rfqs')
      .select('*')
      .eq('id', rfq_id)
      .eq('status', 'open')
      .single()

    if (rfqError || !rfq) {
      return new Response(
        JSON.stringify({ error: 'RFQ not found or not open for quoting' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if operator has already quoted on this RFQ
    const { data: existingQuote, error: existingQuoteError } = await supabaseClient
      .from('quotes')
      .select('id')
      .eq('rfq_id', rfq_id)
      .eq('operator_id', user.id)
      .single()

    if (existingQuote && !existingQuoteError) {
      return new Response(
        JSON.stringify({ error: 'You have already submitted a quote for this RFQ' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create quote
    const { data: quote, error: quoteError } = await supabaseClient
      .from('quotes')
      .insert({
        rfq_id,
        operator_id: user.id,
        operator_company_id: userData.company_id,
        price,
        currency: currency || rfq.currency,
        aircraft_id,
        aircraft_model,
        aircraft_tail_number,
        valid_until,
        terms,
        notes,
        status: 'pending'
      })
      .select()
      .single()

    if (quoteError) {
      console.error('Error creating quote:', quoteError)
      return new Response(
        JSON.stringify({ error: 'Failed to create quote', details: quoteError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update RFQ status to 'quoting' if it's the first quote
    const { data: quoteCount, error: countError } = await supabaseClient
      .from('quotes')
      .select('id', { count: 'exact' })
      .eq('rfq_id', rfq_id)

    if (!countError && quoteCount && quoteCount.length === 1) {
      await supabaseClient
        .from('rfqs')
        .update({ status: 'quoting' })
        .eq('id', rfq_id)
    }

    // Notify broker (in a real implementation, this would send push notifications)
    const { data: broker, error: brokerError } = await supabaseClient
      .from('users')
      .select('id, full_name, email')
      .eq('id', rfq.broker_id)
      .single()

    if (!brokerError && broker) {
      // Log notification attempt
      await supabaseClient
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: 'quote_notification_sent',
          table_name: 'quotes',
          record_id: quote.id,
          new_values: {
            broker_id: rfq.broker_id,
            quote_id: quote.id,
            price
          }
        })
    }

    // Update performance metrics
    await supabaseClient.rpc('update_performance_metrics', {
      p_user_id: user.id,
      p_company_id: userData.company_id,
      p_metric_type: 'quotes_submitted',
      p_metric_value: 1
    })

    // Update broker's response time metrics
    const responseTime = new Date().getTime() - new Date(rfq.created_at).getTime()
    await supabaseClient.rpc('update_performance_metrics', {
      p_user_id: rfq.broker_id,
      p_company_id: rfq.broker_company_id,
      p_metric_type: 'average_response_time',
      p_metric_value: responseTime / 1000 / 60 // Convert to minutes
    })

    // Log the quote submission
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'quote_submitted',
        table_name: 'quotes',
        record_id: quote.id,
        new_values: {
          rfq_id,
          price,
          currency: currency || rfq.currency,
          aircraft_model,
          response_time_minutes: responseTime / 1000 / 60
        }
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        quote,
        broker_notified: !brokerError,
        response_time_minutes: Math.round(responseTime / 1000 / 60)
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in submit-quote function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})