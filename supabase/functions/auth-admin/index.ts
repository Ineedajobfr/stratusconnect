import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const sessionToken = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!sessionToken) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify admin session
    const { data: session } = await supabase
      .from('user_sessions')
      .select(`
        user_id,
        users!inner (role, is_active)
      `)
      .eq('session_token', sessionToken)
      .single();

    if (!session || session.users.role !== 'admin' || !session.users.is_active) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    switch (req.method) {
      case 'GET': {
        if (action === 'users') {
          // Get all users with pagination
          const page = parseInt(url.searchParams.get('page') || '1');
          const limit = parseInt(url.searchParams.get('limit') || '50');
          const search = url.searchParams.get('search') || '';
          const role = url.searchParams.get('role') || '';
          const status = url.searchParams.get('status') || '';

          let query = supabase
            .from('users')
            .select(`
              id, username, email, full_name, company_name, role,
              verification_status, last_login_at, failed_login_count,
              is_active, created_at, updated_at
            `, { count: 'exact' });

          if (search) {
            query = query.or(`email.ilike.%${search}%,username.ilike.%${search}%,full_name.ilike.%${search}%`);
          }
          if (role) {
            query = query.eq('role', role);
          }
          if (status) {
            query = query.eq('verification_status', status);
          }

          const { data: users, count, error } = await query
            .range((page - 1) * limit, page * limit - 1)
            .order('created_at', { ascending: false });

          if (error) throw error;

          return new Response(
            JSON.stringify({
              users,
              totalCount: count,
              page,
              limit
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (action === 'audit-logs') {
          // Get audit logs with pagination
          const page = parseInt(url.searchParams.get('page') || '1');
          const limit = parseInt(url.searchParams.get('limit') || '50');
          const userId = url.searchParams.get('userId');

          let query = supabase
            .from('audit_logs')
            .select(`
              id, action, target_type, target_id, ip_address,
              user_agent, created_at,
              users!inner (username, email, role)
            `, { count: 'exact' });

          if (userId) {
            query = query.eq('actor_user_id', userId);
          }

          const { data: logs, count, error } = await query
            .range((page - 1) * limit, page * limit - 1)
            .order('created_at', { ascending: false });

          if (error) throw error;

          return new Response(
            JSON.stringify({
              logs,
              totalCount: count,
              page,
              limit
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (action === 'invite-codes') {
          // Get admin invite codes
          const { data: codes, error } = await supabase
            .from('admin_invite_codes')
            .select(`
              id, code, expires_at, used_at, created_at,
              created_by_user:users!admin_invite_codes_created_by_fkey (username, email),
              used_by_user:users!admin_invite_codes_used_by_fkey (username, email)
            `)
            .order('created_at', { ascending: false });

          if (error) throw error;

          return new Response(
            JSON.stringify({ codes }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'POST': {
        const body = await req.json();

        if (action === 'update-user') {
          // Update user details
          const { userId, updates } = body;
          
          const { data: user, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

          if (error) throw error;

          // Log the action
          await supabase.from('audit_logs').insert({
            actor_user_id: session.user_id,
            action: 'admin_user_update',
            target_type: 'user',
            target_id: userId,
            before_json: {},
            after_json: updates,
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown'
          });

          return new Response(
            JSON.stringify({ success: true, user }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (action === 'create-invite-code') {
          // Create admin invite code
          const { expirationHours = 24 } = body;
          const code = crypto.randomUUID().replace(/-/g, '').substring(0, 12).toUpperCase();
          const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

          const { data: inviteCode, error } = await supabase
            .from('admin_invite_codes')
            .insert({
              code,
              created_by: session.user_id,
              expires_at: expiresAt.toISOString()
            })
            .select()
            .single();

          if (error) throw error;

          // Log the action
          await supabase.from('audit_logs').insert({
            actor_user_id: session.user_id,
            action: 'admin_invite_code_created',
            target_type: 'admin_invite_code',
            target_id: inviteCode.id,
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown'
          });

          return new Response(
            JSON.stringify({ success: true, inviteCode }),
            { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (action === 'revoke-invite-code') {
          // Revoke/delete invite code
          const { codeId } = body;

          const { error } = await supabase
            .from('admin_invite_codes')
            .delete()
            .eq('id', codeId);

          if (error) throw error;

          // Log the action
          await supabase.from('audit_logs').insert({
            actor_user_id: session.user_id,
            action: 'admin_invite_code_revoked',
            target_type: 'admin_invite_code',
            target_id: codeId,
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown'
          });

          return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Admin function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});