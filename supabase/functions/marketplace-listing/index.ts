// Marketplace Listing Management Edge Function
// Create, update, delete listings (operators only)

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

    // Verify user is an operator
    const { data: userData } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData || (userData.role !== 'operator' && userData.role !== 'admin')) {
      // Also check profiles table
      const { data: profileData } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profileData || (profileData.role !== 'operator' && profileData.role !== 'admin')) {
        throw new Error('Only operators can manage listings')
      }
    }

    const method = req.method
    const url = new URL(req.url)
    const listingId = url.pathname.split('/').pop()

    // CREATE listing
    if (method === 'POST') {
      const body = await req.json()

      const listing = {
        operator_id: user.id,
        aircraft_id: body.aircraft_id || null,
        title: body.title,
        description: body.description || null,
        listing_type: body.listing_type, // 'sale','charter','empty_leg'
        price: body.price || null,
        currency: body.currency || 'USD',
        departure_airport: body.departure_airport || null,
        destination_airport: body.destination_airport || null,
        dep_time: body.dep_time ? new Date(body.dep_time).toISOString() : null,
        arr_time: body.arr_time ? new Date(body.arr_time).toISOString() : null,
        seats: body.seats || null,
        active: true,
        metadata: body.metadata || {}
      }

      const { data, error } = await supabaseClient
        .from('marketplace_listings')
        .insert([listing])
        .select()
        .single()

      if (error) throw error

      // Log security event
      await supabaseClient
        .from('security_events')
        .insert({
          user_id: user.id,
          event_type: 'listing_created',
          details: { listing_id: data.id, listing_type: data.listing_type }
        })

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        }
      )
    }

    // UPDATE listing
    if (method === 'PUT' || method === 'PATCH') {
      if (!listingId) {
        throw new Error('Listing ID required')
      }

      const body = await req.json()

      // Verify ownership
      const { data: existingListing } = await supabaseClient
        .from('marketplace_listings')
        .select('*')
        .eq('id', listingId)
        .single()

      if (!existingListing || existingListing.operator_id !== user.id) {
        throw new Error('Not authorized to update this listing')
      }

      const updates: any = {}
      if (body.title !== undefined) updates.title = body.title
      if (body.description !== undefined) updates.description = body.description
      if (body.price !== undefined) updates.price = body.price
      if (body.currency !== undefined) updates.currency = body.currency
      if (body.departure_airport !== undefined) updates.departure_airport = body.departure_airport
      if (body.destination_airport !== undefined) updates.destination_airport = body.destination_airport
      if (body.dep_time !== undefined) updates.dep_time = new Date(body.dep_time).toISOString()
      if (body.arr_time !== undefined) updates.arr_time = new Date(body.arr_time).toISOString()
      if (body.seats !== undefined) updates.seats = body.seats
      if (body.active !== undefined) updates.active = body.active
      if (body.metadata !== undefined) updates.metadata = body.metadata

      const { data, error } = await supabaseClient
        .from('marketplace_listings')
        .update(updates)
        .eq('id', listingId)
        .select()
        .single()

      if (error) throw error

      // Log security event
      await supabaseClient
        .from('security_events')
        .insert({
          user_id: user.id,
          event_type: 'listing_updated',
          details: { listing_id: data.id, changes: Object.keys(updates) }
        })

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // DELETE listing
    if (method === 'DELETE') {
      if (!listingId) {
        throw new Error('Listing ID required')
      }

      // Verify ownership
      const { data: existingListing } = await supabaseClient
        .from('marketplace_listings')
        .select('*')
        .eq('id', listingId)
        .single()

      if (!existingListing || existingListing.operator_id !== user.id) {
        throw new Error('Not authorized to delete this listing')
      }

      // Soft delete by setting active = false
      const { error } = await supabaseClient
        .from('marketplace_listings')
        .update({ active: false })
        .eq('id', listingId)

      if (error) throw error

      // Log security event
      await supabaseClient
        .from('security_events')
        .insert({
          user_id: user.id,
          event_type: 'listing_deleted',
          details: { listing_id: listingId }
        })

      return new Response(
        JSON.stringify({ success: true, message: 'Listing deleted' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // GET single listing
    if (method === 'GET' && listingId) {
      const { data, error } = await supabaseClient
        .from('marketplace_listings')
        .select(`
          *,
          operator:operator_id (
            id,
            email,
            full_name,
            company_name,
            role
          ),
          aircraft:aircraft_id (
            id,
            type,
            tail_number,
            model,
            category
          )
        `)
        .eq('id', listingId)
        .single()

      if (error) throw error

      // Get trust score
      const { data: trustData } = await supabaseClient
        .from('user_trust')
        .select('*')
        .eq('user_id', data.operator_id)
        .single()

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            ...data,
            operator_trust: trustData
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
    console.error('Marketplace listing error:', error)
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

