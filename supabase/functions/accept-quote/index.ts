import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AcceptQuotePayload {
  quote_id: string;
  request_id: string;
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
        JSON.stringify({ error: 'Only brokers can accept quotes' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body: AcceptQuotePayload = await req.json()

    // Validate required fields
    if (!body.quote_id || !body.request_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: quote_id, request_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the quote with request details
    const { data: quote, error: quoteError } = await supabaseClient
      .from('quotes')
      .select(`
        id,
        request_id,
        operator_company_id,
        price,
        currency,
        status,
        aircraft_id,
        requests!inner(
          id,
          broker_company_id,
          status
        )
      `)
      .eq('id', body.quote_id)
      .eq('request_id', body.request_id)
      .single()

    if (quoteError || !quote) {
      return new Response(
        JSON.stringify({ error: 'Quote not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the request belongs to the broker's company
    if (quote.requests.broker_company_id !== userProfile.company_id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized to accept this quote' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if quote is still pending
    if (quote.status !== 'pending') {
      return new Response(
        JSON.stringify({ error: 'Quote is no longer available' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if request is still open
    if (quote.requests.status !== 'open') {
      return new Response(
        JSON.stringify({ error: 'Request is no longer accepting quotes' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Start a transaction-like operation
    // First, update the accepted quote
    const { error: updateQuoteError } = await supabaseClient
      .from('quotes')
      .update({ status: 'accepted' })
      .eq('id', body.quote_id)

    if (updateQuoteError) {
      console.error('Error updating quote:', updateQuoteError)
      return new Response(
        JSON.stringify({ error: 'Failed to accept quote' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Reject all other quotes for this request
    const { error: rejectQuotesError } = await supabaseClient
      .from('quotes')
      .update({ status: 'rejected' })
      .eq('request_id', body.request_id)
      .neq('id', body.quote_id)

    if (rejectQuotesError) {
      console.error('Error rejecting other quotes:', rejectQuotesError)
      // Continue anyway as the main operation succeeded
    }

    // Update request status
    const { error: updateRequestError } = await supabaseClient
      .from('requests')
      .update({ status: 'accepted' })
      .eq('id', body.request_id)

    if (updateRequestError) {
      console.error('Error updating request:', updateRequestError)
      return new Response(
        JSON.stringify({ error: 'Failed to update request status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create booking
    const { data: newBooking, error: bookingError } = await supabaseClient
      .from('bookings')
      .insert({
        request_id: body.request_id,
        quote_id: body.quote_id,
        broker_company_id: quote.requests.broker_company_id,
        operator_company_id: quote.operator_company_id,
        total_price: quote.price,
        currency: quote.currency,
        status: 'upcoming',
        payment_status: 'pending'
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
      return new Response(
        JSON.stringify({ error: 'Failed to create booking' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create initial flight record if aircraft is specified
    if (quote.aircraft_id) {
      const { error: flightError } = await supabaseClient
        .from('flights')
        .insert({
          booking_id: newBooking.id,
          departure_airport: 'TBD', // Will be updated by operator
          arrival_airport: 'TBD',
          departure_datetime: new Date().toISOString(),
          arrival_datetime: new Date().toISOString(),
          aircraft_id: quote.aircraft_id,
          status: 'scheduled'
        })

      if (flightError) {
        console.error('Error creating flight:', flightError)
        // Continue anyway as booking was created
      }
    }

    // Log audit entry
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action_type: 'QUOTE_ACCEPTED',
        details: {
          quote_id: body.quote_id,
          request_id: body.request_id,
          booking_id: newBooking.id,
          price: quote.price,
          currency: quote.currency
        }
      })

    // Notify the operator about the accepted quote
    const { data: operatorUsers } = await supabaseClient
      .from('users')
      .select('id')
      .eq('company_id', quote.operator_company_id)

    if (operatorUsers && operatorUsers.length > 0) {
      const notifications = operatorUsers.map(operator => ({
        user_id: operator.id,
        type: 'quote_accepted',
        related_id: newBooking.id,
        message: `Your quote has been accepted! Booking created for $${quote.price.toLocaleString()}`
      }))

      await supabaseClient
        .from('notifications')
        .insert(notifications)
    }

    // Notify other operators whose quotes were rejected
    const { data: rejectedQuotes } = await supabaseClient
      .from('quotes')
      .select(`
        id,
        operator_company_id,
        users!inner(id)
      `)
      .eq('request_id', body.request_id)
      .eq('status', 'rejected')
      .neq('id', body.quote_id)

    if (rejectedQuotes && rejectedQuotes.length > 0) {
      const rejectedNotifications = rejectedQuotes.map(quote => ({
        user_id: quote.users.id,
        type: 'quote_rejected',
        related_id: quote.id,
        message: 'Your quote was not selected for this request'
      }))

      await supabaseClient
        .from('notifications')
        .insert(rejectedNotifications)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        booking_id: newBooking.id,
        message: 'Quote accepted and booking created successfully'
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in accept-quote function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
