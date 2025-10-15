// Trip Request (RFQ) Management Edge Function
// Brokers post trip requests, operators can view and respond

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get authenticated user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('Unauthorized')
    }

    const method = req.method
    const url = new URL(req.url)
    const requestId = url.pathname.split('/').pop()

    // CREATE trip request (brokers only)
    if (method === 'POST') {
      // Verify user is a broker
      const { data: userData } = await supabaseClient
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!userData || (userData.role !== 'broker' && userData.role !== 'admin')) {
        // Also check profiles table
        const { data: profileData } = await supabaseClient
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (!profileData || (profileData.role !== 'broker' && profileData.role !== 'admin')) {
          throw new Error('Only brokers can create trip requests')
        }
      }

      const body = await req.json()

      const tripRequest = {
        broker_id: user.id,
        origin: body.origin,
        destination: body.destination,
        dep_time: new Date(body.dep_time).toISOString(),
        pax: body.pax,
        preferred_category: body.preferred_category || null,
        max_budget: body.max_budget || null,
        status: 'open',
        metadata: body.metadata || {}
      }

      const { data, error } = await supabaseClient
        .from('trip_requests')
        .insert([tripRequest])
        .select()
        .single()

      if (error) throw error

      // Log security event
      await supabaseClient
        .from('security_events')
        .insert({
          user_id: user.id,
          event_type: 'trip_request_created',
          details: {
            request_id: data.id,
            route: `${data.origin}-${data.destination}`
          }
        })

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        }
      )
    }

    // UPDATE trip request (owner only)
    if (method === 'PUT' || method === 'PATCH') {
      if (!requestId) {
        throw new Error('Request ID required')
      }

      const body = await req.json()

      // Verify ownership
      const { data: existingRequest } = await supabaseClient
        .from('trip_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (!existingRequest || existingRequest.broker_id !== user.id) {
        throw new Error('Not authorized to update this request')
      }

      const updates: any = {}
      if (body.origin !== undefined) updates.origin = body.origin
      if (body.destination !== undefined) updates.destination = body.destination
      if (body.dep_time !== undefined) updates.dep_time = new Date(body.dep_time).toISOString()
      if (body.pax !== undefined) updates.pax = body.pax
      if (body.preferred_category !== undefined) updates.preferred_category = body.preferred_category
      if (body.max_budget !== undefined) updates.max_budget = body.max_budget
      if (body.status !== undefined) updates.status = body.status
      if (body.metadata !== undefined) updates.metadata = body.metadata

      const { data, error } = await supabaseClient
        .from('trip_requests')
        .update(updates)
        .eq('id', requestId)
        .select()
        .single()

      if (error) throw error

      // Log security event
      await supabaseClient
        .from('security_events')
        .insert({
          user_id: user.id,
          event_type: 'trip_request_updated',
          details: {
            request_id: data.id,
            changes: Object.keys(updates)
          }
        })

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // GET trip requests (with filters)
    if (method === 'GET' && !requestId) {
      const searchParams = url.searchParams
      const status = searchParams.get('status') || 'open'
      const origin = searchParams.get('origin')
      const destination = searchParams.get('destination')
      const page = parseInt(searchParams.get('page') || '1')
      const perPage = Math.min(parseInt(searchParams.get('per_page') || '20'), 100)
      const offset = (page - 1) * perPage

      let query = supabaseClient
        .from('trip_requests')
        .select(`
          *,
          broker:broker_id (
            id,
            email,
            full_name,
            company_name,
            role
          )
        `, { count: 'exact' })

      // Apply filters
      if (status) {
        query = query.eq('status', status)
      }

      if (origin) {
        query = query.eq('origin', origin)
      }

      if (destination) {
        query = query.eq('destination', destination)
      }

      // Execute query with pagination
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + perPage - 1)

      const { data: requests, error, count } = await query

      if (error) throw error

      // Enhance results with broker trust scores
      const enhancedRequests = await Promise.all(
        (requests || []).map(async (request) => {
          if (!request.broker_id) return request

          const { data: trustData } = await supabaseClient
            .from('user_trust')
            .select('trust_score, reputation_score, verified, activity_count')
            .eq('user_id', request.broker_id)
            .single()

          return {
            ...request,
            broker_trust: trustData || {
              trust_score: 0,
              reputation_score: 0,
              verified: false,
              activity_count: 0
            }
          }
        })
      )

      return new Response(
        JSON.stringify({
          success: true,
          page,
          perPage,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / perPage),
          results: enhancedRequests
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // GET single trip request
    if (method === 'GET' && requestId) {
      const { data, error } = await supabaseClient
        .from('trip_requests')
        .select(`
          *,
          broker:broker_id (
            id,
            email,
            full_name,
            company_name,
            role
          )
        `)
        .eq('id', requestId)
        .single()

      if (error) throw error

      // Get trust score
      const { data: trustData } = await supabaseClient
        .from('user_trust')
        .select('*')
        .eq('user_id', data.broker_id)
        .single()

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            ...data,
            broker_trust: trustData
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    throw new Error('Method not allowed')

  } catch (error) {
    console.error('Trip request error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 400,
      }
    )
  }
})

