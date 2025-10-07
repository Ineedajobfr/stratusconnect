// Notify RFQ Edge Function
// Sends real-time notifications to operators when new RFQs are created

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

    // Parse request body
    const { rfq_id } = await req.json()

    if (!rfq_id) {
      return new Response(
        JSON.stringify({ error: 'Missing rfq_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get RFQ details
    const { data: rfq, error: rfqError } = await supabaseClient
      .from('rfqs')
      .select(`
        *,
        users!rfqs_broker_id_fkey (
          full_name,
          email
        )
      `)
      .eq('id', rfq_id)
      .single()

    if (rfqError || !rfq) {
      return new Response(
        JSON.stringify({ error: 'RFQ not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get all verified operators
    const { data: operators, error: operatorsError } = await supabaseClient
      .from('users')
      .select(`
        id,
        full_name,
        email,
        companies (
          name,
          type
        )
      `)
      .eq('role', 'operator')
      .eq('verification_status', 'approved')

    if (operatorsError) {
      console.error('Error fetching operators:', operatorsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch operators' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create notification payload
    const notification = {
      type: 'new_rfq',
      rfq_id: rfq.id,
      broker_name: rfq.users?.full_name || 'Unknown Broker',
      client_name: rfq.client_name,
      origin: rfq.origin,
      destination: rfq.destination,
      departure_date: rfq.departure_date,
      passenger_count: rfq.passenger_count,
      urgency: rfq.urgency,
      budget_min: rfq.budget_min,
      budget_max: rfq.budget_max,
      currency: rfq.currency,
      expires_at: rfq.expires_at,
      created_at: rfq.created_at
    }

    // Send notifications to all operators
    const notifications = operators?.map(operator => ({
      user_id: operator.id,
      type: 'new_rfq',
      title: `New RFQ: ${rfq.origin} → ${rfq.destination}`,
      message: `${rfq.client_name} needs ${rfq.passenger_count} passengers from ${rfq.origin} to ${rfq.destination}`,
      data: notification,
      created_at: new Date().toISOString()
    })) || []

    // Insert notifications into database
    if (notifications.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('notifications')
        .insert(notifications)

      if (insertError) {
        console.error('Error inserting notifications:', insertError)
        // Continue anyway
      }
    }

    // Log the notification attempt
    await supabaseClient
      .from('audit_logs')
      .insert({
        action: 'rfq_notifications_sent',
        table_name: 'rfqs',
        record_id: rfq_id,
        new_values: {
          operators_notified: operators?.length || 0,
          notification_type: 'new_rfq'
        }
      })

    return new Response(
      JSON.stringify({ 
        success: true,
        operators_notified: operators?.length || 0,
        rfq_id,
        notification
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in notify-rfq function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})


