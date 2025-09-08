import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SanctionCheckPayload {
  user_id?: string;
  company_id?: string;
  name?: string;
  check_type: 'user' | 'company' | 'manual';
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

    // Get user profile to verify role
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

    // Only admins can run sanction checks
    if (userProfile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Only admins can run sanction checks' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body: SanctionCheckPayload = await req.json()

    // Validate required fields
    if (!body.check_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: check_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let checkName = ''
    let checkEntityId = ''

    if (body.check_type === 'user' && body.user_id) {
      // Get user details
      const { data: targetUser, error: userError } = await supabaseClient
        .from('users')
        .select('id, full_name, email')
        .eq('id', body.user_id)
        .single()

      if (userError || !targetUser) {
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      checkName = targetUser.full_name || targetUser.email
      checkEntityId = targetUser.id
    } else if (body.check_type === 'company' && body.company_id) {
      // Get company details
      const { data: targetCompany, error: companyError } = await supabaseClient
        .from('companies')
        .select('id, name')
        .eq('id', body.company_id)
        .single()

      if (companyError || !targetCompany) {
        return new Response(
          JSON.stringify({ error: 'Company not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      checkName = targetCompany.name
      checkEntityId = targetCompany.id
    } else if (body.check_type === 'manual' && body.name) {
      checkName = body.name
      checkEntityId = 'manual_check'
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid check_type or missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Simulate sanction check (in real implementation, this would call external APIs)
    // For demo purposes, we'll use a simple pattern matching approach
    const sanctionPatterns = [
      /terrorist/i,
      /sanctioned/i,
      /banned/i,
      /prohibited/i,
      /restricted/i,
      /no.fly/i,
      /watch.list/i
    ]

    const isSanctioned = sanctionPatterns.some(pattern => pattern.test(checkName))

    // Check against known problematic names (demo data)
    const knownSanctionedNames = [
      'john terrorist',
      'jane banned',
      'test sanctioned',
      'demo restricted'
    ]

    const isKnownSanctioned = knownSanctionedNames.some(name => 
      checkName.toLowerCase().includes(name.toLowerCase())
    )

    const isFlagged = isSanctioned || isKnownSanctioned

    // Record the sanction check
    const { data: sanctionRecord, error: insertError } = await supabaseClient
      .from('sanctions')
      .insert({
        user_id: body.check_type === 'user' ? checkEntityId : null,
        company_id: body.check_type === 'company' ? checkEntityId : null,
        list_name: 'Internal Check',
        matched_name: checkName,
        status: isFlagged ? 'flagged' : 'clear',
        notes: isFlagged ? 'Pattern match detected in name' : 'No issues found'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error recording sanction check:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to record sanction check' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log audit entry
    await supabaseClient
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action_type: 'SANCTION_CHECK',
        details: {
          check_type: body.check_type,
          check_entity_id: checkEntityId,
          check_name: checkName,
          result: isFlagged ? 'flagged' : 'clear',
          sanction_record_id: sanctionRecord.id
        }
      })

    // If flagged, create admin alert
    if (isFlagged) {
      const { data: adminUsers } = await supabaseClient
        .from('users')
        .select('id')
        .eq('role', 'admin')
        .neq('id', user.id) // Don't notify the user who ran the check

      if (adminUsers && adminUsers.length > 0) {
        const alertNotifications = adminUsers.map(admin => ({
          user_id: admin.id,
          type: 'admin_alert',
          related_id: sanctionRecord.id,
          message: `SANCTION ALERT: ${checkName} flagged during ${body.check_type} check`
        }))

        await supabaseClient
          .from('notifications')
          .insert(alertNotifications)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        result: {
          check_type: body.check_type,
          check_name: checkName,
          check_entity_id: checkEntityId,
          status: isFlagged ? 'flagged' : 'clear',
          sanction_record_id: sanctionRecord.id,
          details: isFlagged ? 'Potential match found in sanctions database' : 'No issues detected'
        },
        message: `Sanction check completed for ${checkName}`
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in sanction-check function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
