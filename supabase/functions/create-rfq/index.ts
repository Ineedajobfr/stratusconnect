// Create RFQ Edge Function
// Handles RFQ creation and operator notifications

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
      client_name,
      client_company,
      client_email,
      client_phone,
      origin,
      destination,
      departure_date,
      return_date,
      passenger_count,
      aircraft_preferences,
      budget_min,
      budget_max,
      currency,
      urgency,
      expires_at,
      notes,
      special_requirements
    } = await req.json()

    // Validate required fields
    if (!client_name || !origin || !destination || !departure_date || !passenger_count) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's company
    const { data: userData, error: userDataError } = await supabaseClient
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    if (userDataError || !userData || userData.role !== 'broker') {
      return new Response(
        JSON.stringify({ error: 'User must be a broker to create RFQs' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create RFQ
    const { data: rfq, error: rfqError } = await supabaseClient
      .from('rfqs')
      .insert({
        broker_id: user.id,
        broker_company_id: userData.company_id,
        client_name,
        client_company,
        client_email,
        client_phone,
        origin,
        destination,
        departure_date,
        return_date,
        passenger_count,
        aircraft_preferences: aircraft_preferences || {},
        budget_min,
        budget_max,
        currency: currency || 'USD',
        urgency: urgency || 'normal',
        expires_at: expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours default
        notes,
        special_requirements,
        status: 'open'
      })
      .select()
      .single()

    if (rfqError) {
      console.error('Error creating RFQ:', rfqError)
      return new Response(
        JSON.stringify({ error: 'Failed to create RFQ', details: rfqError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Notify operators (in a real implementation, this would send push notifications)
    const { data: operators, error: operatorsError } = await supabaseClient
      .from('users')
      .select('id, full_name, email')
      .eq('role', 'operator')
      .eq('verification_status', 'approved')

    if (!operatorsError && operators) {
      // Log notification attempt
      await supabaseClient
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: 'rfq_notification_sent',
          table_name: 'rfqs',
          record_id: rfq.id,
          new_values: {
            operators_notified: operators.length,
            rfq_id: rfq.id
          }
        })
    }

    // Update performance metrics
    await supabaseClient.rpc('update_performance_metrics', {
      p_user_id: user.id,
      p_company_id: userData.company_id,
      p_metric_type: 'rfqs_created',
      p_metric_value: 1
    })

    // Log the creation
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'rfq_created',
        table_name: 'rfqs',
        record_id: rfq.id,
        new_values: {
          client_name,
          origin,
          destination,
          passenger_count,
          urgency
        }
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        rfq,
        operators_notified: operators?.length || 0
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in create-rfq function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})






