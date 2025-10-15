// Marketplace Search Edge Function
// Searches listings with filters, pagination, and trust-score ranking

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

    const url = new URL(req.url)
    const searchParams = url.searchParams

    // Parse query parameters
    const q = searchParams.get('q') || ''
    const listingType = searchParams.get('listing_type') || ''
    const category = searchParams.get('category') || ''
    const departureAirport = searchParams.get('departure_airport') || ''
    const minPrice = searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : null
    const maxPrice = searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : null
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = Math.min(parseInt(searchParams.get('per_page') || '20'), 100)
    const offset = (page - 1) * perPage

    // Build dynamic SQL query
    let query = supabaseClient
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
      `, { count: 'exact' })
      .eq('active', true)

    // Apply filters
    if (q) {
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    }

    if (listingType) {
      query = query.eq('listing_type', listingType)
    }

    if (departureAirport) {
      query = query.eq('departure_airport', departureAirport)
    }

    if (minPrice !== null) {
      query = query.gte('price', minPrice)
    }

    if (maxPrice !== null) {
      query = query.lte('price', maxPrice)
    }

    // Execute query with pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + perPage - 1)

    const { data: listings, error, count } = await query

    if (error) {
      throw error
    }

    // Enhance results with trust scores
    const enhancedListings = await Promise.all(
      (listings || []).map(async (listing) => {
        if (!listing.operator_id) return listing

        // Get trust score for operator
        const { data: trustData } = await supabaseClient
          .from('user_trust')
          .select('trust_score, reputation_score, verified, activity_count')
          .eq('user_id', listing.operator_id)
          .single()

        return {
          ...listing,
          operator_trust: trustData || {
            trust_score: 0,
            reputation_score: 0,
            verified: false,
            activity_count: 0
          }
        }
      })
    )

    // Sort by trust score (highest first)
    enhancedListings.sort((a, b) => {
      const aTrust = a.operator_trust?.trust_score || 0
      const bTrust = b.operator_trust?.trust_score || 0
      return bTrust - aTrust
    })

    return new Response(
      JSON.stringify({
        success: true,
        page,
        perPage,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / perPage),
        results: enhancedListings
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Marketplace search error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

