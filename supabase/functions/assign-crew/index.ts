import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CrewAssignment {
  user_id: string;
  role: string;
}

interface AssignCrewPayload {
  booking_id: string;
  flight_id?: string;
  crew_assignments: CrewAssignment[];
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
        JSON.stringify({ error: 'Only operators can assign crew' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body: AssignCrewPayload = await req.json()

    // Validate required fields
    if (!body.booking_id || !body.crew_assignments || body.crew_assignments.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: booking_id, crew_assignments' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify booking belongs to operator
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select('id, operator_company_id, status')
      .eq('id', body.booking_id)
      .single()

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Booking not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (booking.operator_company_id !== userProfile.company_id) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized to assign crew to this booking' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get flights for this booking
    const { data: flights, error: flightsError } = await supabaseClient
      .from('flights')
      .select('id, departure_datetime, status')
      .eq('booking_id', body.booking_id)
      .order('departure_datetime')

    if (flightsError || !flights || flights.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No flights found for this booking' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Determine which flight to assign crew to
    const targetFlightId = body.flight_id || flights[0].id

    // Verify the flight belongs to this booking
    const targetFlight = flights.find(f => f.id === targetFlightId)
    if (!targetFlight) {
      return new Response(
        JSON.stringify({ error: 'Invalid flight_id for this booking' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate crew assignments
    const validRoles = ['Captain', 'First Officer', 'Flight Attendant', 'Engineer', 'Purser']
    for (const assignment of body.crew_assignments) {
      if (!assignment.user_id || !assignment.role) {
        return new Response(
          JSON.stringify({ error: 'Each crew assignment must have user_id and role' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (!validRoles.includes(assignment.role)) {
        return new Response(
          JSON.stringify({ error: `Invalid role: ${assignment.role}. Valid roles: ${validRoles.join(', ')}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Verify all crew members belong to the operator's company or are available for hire
    const crewUserIds = body.crew_assignments.map(a => a.user_id)
    const { data: crewUsers, error: crewError } = await supabaseClient
      .from('users')
      .select('id, company_id, role, full_name')
      .in('id', crewUserIds)

    if (crewError || !crewUsers) {
      return new Response(
        JSON.stringify({ error: 'Failed to verify crew members' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if all crew members are valid
    for (const assignment of body.crew_assignments) {
      const crewUser = crewUsers.find(u => u.id === assignment.user_id)
      if (!crewUser) {
        return new Response(
          JSON.stringify({ error: `Crew member ${assignment.user_id} not found` }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check if crew member belongs to operator's company or is available for hire
      if (crewUser.company_id !== userProfile.company_id) {
        // Check if they're available for hire (freelance crew)
        const { data: crewProfile } = await supabaseClient
          .from('crew_profiles')
          .select('availability_status')
          .eq('user_id', assignment.user_id)
          .single()

        if (!crewProfile || crewProfile.availability_status !== 'available') {
          return new Response(
            JSON.stringify({ error: `Crew member ${crewUser.full_name} is not available for assignment` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      // Check role compatibility
      if (assignment.role === 'Captain' && crewUser.role !== 'pilot') {
        return new Response(
          JSON.stringify({ error: `Only pilots can be assigned as Captain` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (assignment.role === 'First Officer' && crewUser.role !== 'pilot') {
        return new Response(
          JSON.stringify({ error: `Only pilots can be assigned as First Officer` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Check for existing assignments on this flight
    const { data: existingAssignments } = await supabaseClient
      .from('crew_assignments')
      .select('id, user_id, role')
      .eq('flight_id', targetFlightId)

    // Remove existing assignments for the same roles
    const rolesToAssign = body.crew_assignments.map(a => a.role)
    const assignmentsToRemove = existingAssignments?.filter(a => rolesToAssign.includes(a.role)) || []

    if (assignmentsToRemove.length > 0) {
      const { error: removeError } = await supabaseClient
        .from('crew_assignments')
        .delete()
        .in('id', assignmentsToRemove.map(a => a.id))

      if (removeError) {
        console.error('Error removing existing assignments:', removeError)
        return new Response(
          JSON.stringify({ error: 'Failed to update existing crew assignments' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Create new crew assignments
    const assignmentsToInsert = body.crew_assignments.map(assignment => ({
      flight_id: targetFlightId,
      user_id: assignment.user_id,
      role: assignment.role,
      status: 'assigned'
    }))

    const { data: newAssignments, error: insertError } = await supabaseClient
      .from('crew_assignments')
      .insert(assignmentsToInsert)
      .select()

    if (insertError) {
      console.error('Error creating crew assignments:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to assign crew' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update flight with pilot if Captain is assigned
    const captainAssignment = body.crew_assignments.find(a => a.role === 'Captain')
    if (captainAssignment) {
      await supabaseClient
        .from('flights')
        .update({ pilot_id: captainAssignment.user_id })
        .eq('id', targetFlightId)
    }

    // Log audit entry
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action_type: 'ASSIGN_CREW',
        details: {
          booking_id: body.booking_id,
          flight_id: targetFlightId,
          crew_assignments: body.crew_assignments
        }
      })

    // Notify assigned crew members
    const crewNotifications = body.crew_assignments.map(assignment => {
      const crewUser = crewUsers.find(u => u.id === assignment.user_id)
      return {
        user_id: assignment.user_id,
        type: 'crew_assigned',
        related_id: newAssignments[0]?.id,
        message: `You have been assigned as ${assignment.role} for flight ${targetFlightId}`
      }
    })

    await supabaseClient
      .from('notifications')
      .insert(crewNotifications)

    // Notify broker about crew assignment
    const { data: brokerUsers } = await supabaseClient
      .from('users')
      .select('id')
      .eq('company_id', booking.operator_company_id)

    if (brokerUsers && brokerUsers.length > 0) {
      const brokerNotifications = brokerUsers.map(broker => ({
        user_id: broker.id,
        type: 'crew_assigned',
        related_id: newAssignments[0]?.id,
        message: 'Crew has been assigned for your booking'
      }))

      await supabaseClient
        .from('notifications')
        .insert(brokerNotifications)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        assignments: newAssignments,
        message: 'Crew assigned successfully'
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in assign-crew function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
