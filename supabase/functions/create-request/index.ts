import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateRequestPayload {
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  passenger_count: number;
  aircraft_preferences?: Record<string, unknown>;
  notes?: string;
  budget_min?: number;
  budget_max?: number;
  currency?: string;
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
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user profile to verify role and company
    const { data: userProfile, error: profileError } = await supabaseClient
      .from('users')
      .select('role, company_id, full_name')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile) {
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify user is a broker
    if (userProfile.role !== 'broker') {
      return new Response(
        JSON.stringify({ error: 'Only brokers can create requests' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body: CreateRequestPayload = await req.json()

    // Validate required fields
    if (!body.origin || !body.destination || !body.departure_date || !body.passenger_count) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: origin, destination, departure_date, passenger_count' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate dates
    const departureDate = new Date(body.departure_date)
    const returnDate = body.return_date ? new Date(body.return_date) : null
    const now = new Date()

    if (departureDate <= now) {
      return new Response(
        JSON.stringify({ error: 'Departure date must be in the future' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (returnDate && returnDate <= departureDate) {
      return new Response(
        JSON.stringify({ error: 'Return date must be after departure date' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create the request
    const { data: newRequest, error: insertError } = await supabaseClient
      .from('requests')
      .insert({
        broker_company_id: userProfile.company_id,
        created_by: user.id,
        origin: body.origin,
        destination: body.destination,
        departure_date: body.departure_date,
        return_date: body.return_date,
        passenger_count: body.passenger_count,
        aircraft_preferences: body.aircraft_preferences || {},
        notes: body.notes,
        budget_min: body.budget_min,
        budget_max: body.budget_max,
        currency: body.currency || 'USD',
        status: 'open'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating request:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log audit entry
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action_type: 'REQUEST_CREATED',
        details: {
          request_id: newRequest.id,
          origin: body.origin,
          destination: body.destination,
          departure_date: body.departure_date,
          passenger_count: body.passenger_count
        }
      })

    // Notify operators about new request
    const { data: operators } = await supabaseClient
      .from('users')
      .select('id')
      .eq('role', 'operator')
      .not('company_id', 'is', null)

    if (operators && operators.length > 0) {
      const notifications = operators.map(operator => ({
        user_id: operator.id,
        type: 'new_request',
        related_id: newRequest.id,
        message: `New charter request: ${body.origin} to ${body.destination} on ${body.departure_date}`
      }))

      await supabaseClient
        .from('notifications')
        .insert(notifications)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        request_id: newRequest.id,
        message: 'Request created successfully'
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in create-request function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
