import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UpdateFlightStatusPayload {
  flight_id: string;
  status: string;
  actual_departure_time?: string;
  actual_arrival_time?: string;
  delay_reason?: string;
  notes?: string;
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

    // Parse request body
    const body: UpdateFlightStatusPayload = await req.json()

    // Validate required fields
    if (!body.flight_id || !body.status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: flight_id, status' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate status
    const validStatuses = ['scheduled', 'boarding', 'departed', 'in_flight', 'landed', 'delayed', 'cancelled']
    if (!validStatuses.includes(body.status)) {
      return new Response(
        JSON.stringify({ error: `Invalid status. Valid statuses: ${validStatuses.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get flight details with booking and crew information
    const { data: flight, error: flightError } = await supabaseClient
      .from('flights')
      .select(`
        id,
        booking_id,
        pilot_id,
        status,
        departure_datetime,
        arrival_datetime,
        bookings!inner(
          id,
          broker_company_id,
          operator_company_id
        ),
        crew_assignments!inner(
          user_id
        )
      `)
      .eq('id', body.flight_id)
      .single()

    if (flightError || !flight) {
      return new Response(
        JSON.stringify({ error: 'Flight not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check authorization
    const isOperator = userProfile.role === 'operator' && flight.bookings.operator_company_id === userProfile.company_id
    const isPilot = userProfile.role === 'pilot' && flight.pilot_id === user.id
    const isCrew = userProfile.role === 'crew' && flight.crew_assignments.some(ca => ca.user_id === user.id)
    const isAdmin = userProfile.role === 'admin'

    if (!isOperator && !isPilot && !isCrew && !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized to update this flight status' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Additional validation for pilots and crew
    if ((isPilot || isCrew) && !['boarding', 'departed', 'in_flight', 'landed'].includes(body.status)) {
      return new Response(
        JSON.stringify({ error: 'Pilots and crew can only update operational statuses' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate status transitions
    const currentStatus = flight.status
    const newStatus = body.status

    // Define valid status transitions
    const validTransitions: Record<string, string[]> = {
      'scheduled': ['boarding', 'delayed', 'cancelled'],
      'boarding': ['departed', 'delayed', 'cancelled'],
      'departed': ['in_flight', 'landed'],
      'in_flight': ['landed'],
      'landed': [], // Terminal state
      'delayed': ['boarding', 'departed', 'cancelled'],
      'cancelled': [] // Terminal state
    }

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      return new Response(
        JSON.stringify({ 
          error: `Invalid status transition from ${currentStatus} to ${newStatus}`,
          validTransitions: validTransitions[currentStatus] || []
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      status: newStatus,
      updated_at: new Date().toISOString()
    }

    // Set actual times based on status
    if (newStatus === 'departed' && body.actual_departure_time) {
      updateData.actual_departure_time = body.actual_departure_time
    } else if (newStatus === 'departed' && !body.actual_departure_time) {
      updateData.actual_departure_time = new Date().toISOString()
    }

    if (newStatus === 'landed' && body.actual_arrival_time) {
      updateData.actual_arrival_time = body.actual_arrival_time
    } else if (newStatus === 'landed' && !body.actual_arrival_time) {
      updateData.actual_arrival_time = new Date().toISOString()
    }

    if (body.delay_reason) {
      updateData.delay_reason = body.delay_reason
    }

    // Update the flight
    const { data: updatedFlight, error: updateError } = await supabaseClient
      .from('flights')
      .update(updateData)
      .eq('id', body.flight_id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating flight:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update flight status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log audit entry
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action_type: 'FLIGHT_STATUS_UPDATED',
        details: {
          flight_id: body.flight_id,
          old_status: currentStatus,
          new_status: newStatus,
          actual_departure_time: updateData.actual_departure_time,
          actual_arrival_time: updateData.actual_arrival_time,
          delay_reason: body.delay_reason
        }
      })

    // Check for delays and notify if significant
    if (newStatus === 'delayed' || newStatus === 'landed') {
      const departureTime = new Date(flight.departure_datetime)
      const actualTime = newStatus === 'landed' && updateData.actual_arrival_time 
        ? new Date(updateData.actual_arrival_time)
        : new Date()

      const delayMinutes = Math.round((actualTime.getTime() - departureTime.getTime()) / (1000 * 60))

      // Notify if delay is significant (> 30 minutes)
      if (delayMinutes > 30) {
        const { data: brokerUsers } = await supabaseClient
          .from('users')
          .select('id')
          .eq('company_id', flight.bookings.broker_company_id)

        if (brokerUsers && brokerUsers.length > 0) {
          const delayNotifications = brokerUsers.map(broker => ({
            user_id: broker.id,
            type: 'flight_delay',
            related_id: body.flight_id,
            message: `Flight ${body.flight_id} is delayed by ${delayMinutes} minutes${body.delay_reason ? `: ${body.delay_reason}` : ''}`
          }))

          await supabaseClient
            .from('notifications')
            .insert(delayNotifications)
        }

        // Alert admin if delay is very significant (> 2 hours)
        if (delayMinutes > 120) {
          const { data: adminUsers } = await supabaseClient
            .from('users')
            .select('id')
            .eq('role', 'admin')

          if (adminUsers && adminUsers.length > 0) {
            const adminNotifications = adminUsers.map(admin => ({
              user_id: admin.id,
              type: 'admin_alert',
              related_id: body.flight_id,
              message: `SIGNIFICANT DELAY: Flight ${body.flight_id} delayed by ${delayMinutes} minutes`
            }))

            await supabaseClient
              .from('notifications')
              .insert(adminNotifications)
          }
        }
      }
    }

    // If flight landed, check if it's the last flight in the booking
    if (newStatus === 'landed') {
      const { data: allFlights } = await supabaseClient
        .from('flights')
        .select('id, status')
        .eq('booking_id', flight.booking_id)

      const allLanded = allFlights?.every(f => f.status === 'landed') || false

      if (allLanded) {
        // Update booking status to completed
        await supabaseClient
          .from('bookings')
          .update({ status: 'completed' })
          .eq('id', flight.booking_id)

        // Notify broker and operator about completion
        const { data: brokerUsers } = await supabaseClient
          .from('users')
          .select('id')
          .eq('company_id', flight.bookings.broker_company_id)

        const { data: operatorUsers } = await supabaseClient
          .from('users')
          .select('id')
          .eq('company_id', flight.bookings.operator_company_id)

        const completionNotifications = [
          ...(brokerUsers || []).map(broker => ({
            user_id: broker.id,
            type: 'booking_completed',
            related_id: flight.booking_id,
            message: 'Your charter flight has been completed successfully'
          })),
          ...(operatorUsers || []).map(operator => ({
            user_id: operator.id,
            type: 'booking_completed',
            related_id: flight.booking_id,
            message: 'Charter flight completed successfully'
          }))
        ]

        if (completionNotifications.length > 0) {
          await supabaseClient
            .from('notifications')
            .insert(completionNotifications)
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        flight: updatedFlight,
        message: 'Flight status updated successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in update-flight-status function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
