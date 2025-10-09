// Hire Crew Edge Function
// Handles crew hiring with 10% commission

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
      deal_id,
      flight_id,
      pilot_id,
      route,
      departure_date,
      arrival_date,
      daily_rate,
      total_payment,
      commission_rate = 10.00,
      currency = 'USD'
    } = await req.json()

    // Validate required fields
    if (!pilot_id || !route || !departure_date || !arrival_date || !daily_rate || !total_payment) {
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

    if (userDataError || !userData || !['broker', 'operator'].includes(userData.role)) {
      return new Response(
        JSON.stringify({ error: 'User must be a broker or operator to hire crew' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify pilot exists and is available
    const { data: pilot, error: pilotError } = await supabaseClient
      .from('users')
      .select('id, full_name, role, verification_status')
      .eq('id', pilot_id)
      .eq('role', 'pilot')
      .eq('verification_status', 'approved')
      .single()

    if (pilotError || !pilot) {
      return new Response(
        JSON.stringify({ error: 'Pilot not found or not verified' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if pilot is available during the requested period
    const { data: conflictingHires, error: conflictError } = await supabaseClient
      .from('crew_hiring')
      .select('id')
      .eq('pilot_id', pilot_id)
      .eq('status', 'accepted')
      .or(`and(departure_date.lte.${departure_date},arrival_date.gte.${departure_date}),and(departure_date.lte.${arrival_date},arrival_date.gte.${arrival_date})`)

    if (conflictError) {
      console.error('Error checking pilot availability:', conflictError)
      return new Response(
        JSON.stringify({ error: 'Failed to check pilot availability' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (conflictingHires && conflictingHires.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Pilot is not available during the requested period' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate commission
    const commission_amount = (total_payment * commission_rate) / 100

    // Create crew hiring record
    const { data: crewHiring, error: crewHiringError } = await supabaseClient
      .from('crew_hiring')
      .insert({
        deal_id,
        flight_id,
        hiring_party_id: user.id,
        hiring_company_id: userData.company_id,
        pilot_id,
        route,
        departure_date,
        arrival_date,
        daily_rate,
        total_payment,
        commission_rate,
        commission_amount,
        currency,
        status: 'pending'
      })
      .select()
      .single()

    if (crewHiringError) {
      console.error('Error creating crew hiring:', crewHiringError)
      return new Response(
        JSON.stringify({ error: 'Failed to create crew hiring', details: crewHiringError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Notify pilot (in a real implementation, this would send push notifications)
    const { data: pilotProfile, error: pilotProfileError } = await supabaseClient
      .from('users')
      .select('email')
      .eq('id', pilot_id)
      .single()

    if (!pilotProfileError && pilotProfile) {
      // Log notification attempt
      await supabaseClient
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: 'crew_hiring_notification_sent',
          table_name: 'crew_hiring',
          record_id: crewHiring.id,
          new_values: {
            pilot_id,
            route,
            total_payment,
            commission_amount
          }
        })
    }

    // Update performance metrics
    await supabaseClient.rpc('update_performance_metrics', {
      p_user_id: user.id,
      p_company_id: userData.company_id,
      p_metric_type: 'crew_hired',
      p_metric_value: 1
    })

    await supabaseClient.rpc('update_performance_metrics', {
      p_user_id: user.id,
      p_company_id: userData.company_id,
      p_metric_type: 'crew_hiring_revenue',
      p_metric_value: total_payment
    })

    // Log the crew hiring
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'crew_hiring_created',
        table_name: 'crew_hiring',
        record_id: crewHiring.id,
        new_values: {
          pilot_id,
          route,
          total_payment,
          commission_rate,
          commission_amount
        }
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        crew_hiring_id: crewHiring.id,
        pilot_name: pilot.full_name,
        total_payment,
        commission_amount,
        pilot_notified: !pilotProfileError
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in hire-crew function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})



