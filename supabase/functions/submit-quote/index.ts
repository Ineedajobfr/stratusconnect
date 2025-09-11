import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SubmitQuotePayload {
  request_id: string;
  price: number;
  currency?: string;
  aircraft_id?: string;
  notes?: string;
  valid_until?: string;
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

    // Verify user is an operator
    if (userProfile.role !== 'operator') {
      return new Response(
        JSON.stringify({ error: 'Only operators can submit quotes' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body: SubmitQuotePayload = await req.json()

    // Validate required fields
    if (!body.request_id || !body.price) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: request_id, price' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate price
    if (body.price <= 0) {
      return new Response(
        JSON.stringify({ error: 'Price must be greater than 0' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if request exists and is open
    const { data: request, error: requestError } = await supabaseClient
      .from('requests')
      .select('id, status, broker_company_id, created_at')
      .eq('id', body.request_id)
      .single()

    if (requestError || !request) {
      return new Response(
        JSON.stringify({ error: 'Request not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (request.status !== 'open') {
      return new Response(
        JSON.stringify({ error: 'Request is no longer accepting quotes' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if operator has already quoted on this request
    const { data: existingQuote, error: quoteCheckError } = await supabaseClient
      .from('quotes')
      .select('id')
      .eq('request_id', body.request_id)
      .eq('operator_company_id', userProfile.company_id)
      .single()

    if (existingQuote) {
      return new Response(
        JSON.stringify({ error: 'You have already submitted a quote for this request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If aircraft_id is provided, verify it belongs to the operator
    if (body.aircraft_id) {
      const { data: aircraft, error: aircraftError } = await supabaseClient
        .from('aircraft')
        .select('id, status')
        .eq('id', body.aircraft_id)
        .eq('operator_company_id', userProfile.company_id)
        .single()

      if (aircraftError || !aircraft) {
        return new Response(
          JSON.stringify({ error: 'Aircraft not found or not owned by your company' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (aircraft.status !== 'available') {
        return new Response(
          JSON.stringify({ error: 'Selected aircraft is not available' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Create the quote
    const { data: newQuote, error: insertError } = await supabaseClient
      .from('quotes')
      .insert({
        request_id: body.request_id,
        operator_company_id: userProfile.company_id,
        created_by: user.id,
        price: body.price,
        currency: body.currency || 'USD',
        aircraft_id: body.aircraft_id,
        notes: body.notes,
        valid_until: body.valid_until,
        status: 'pending'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating quote:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create quote' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log audit entry
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action_type: 'QUOTE_SUBMITTED',
        details: {
          quote_id: newQuote.id,
          request_id: body.request_id,
          price: body.price,
          currency: body.currency || 'USD'
        }
      })

    // Notify the broker about the new quote
    const { data: brokerUsers } = await supabaseClient
      .from('users')
      .select('id')
      .eq('company_id', request.broker_company_id)

    if (brokerUsers && brokerUsers.length > 0) {
      const notifications = brokerUsers.map(broker => ({
        user_id: broker.id,
        type: 'quote_submitted',
        related_id: newQuote.id,
        message: `New quote received for your request: $${body.price.toLocaleString()}`
      }))

      await supabaseClient
        .from('notifications')
        .insert(notifications)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        quote_id: newQuote.id,
        message: 'Quote submitted successfully'
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in submit-quote function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
