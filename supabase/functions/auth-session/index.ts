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

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'validate';
    const sessionToken = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!sessionToken && action !== 'logout') {
      return new Response(
        JSON.stringify({ error: 'Session token required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (action) {
      case 'validate': {
        // Validate session and get user data
        const { data: session, error: sessionError } = await supabase
          .from('user_sessions')
          .select(`
            *,
            users (
              id, email, username, full_name, role, 
              verification_status, is_active, last_login_at
            )
          `)
          .eq('session_token', sessionToken)
          .single();

        if (sessionError || !session) {
          return new Response(
            JSON.stringify({ error: 'Invalid session' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check if session has expired
        if (new Date(session.expires_at) < new Date()) {
          // Clean up expired session
          await supabase
            .from('user_sessions')
            .delete()
            .eq('session_token', sessionToken);

          return new Response(
            JSON.stringify({ error: 'Session expired' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check if user is still active
        if (!session.users.is_active) {
          return new Response(
            JSON.stringify({ error: 'Account deactivated' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Update last activity
        await supabase
          .from('user_sessions')
          .update({ last_activity: new Date().toISOString() })
          .eq('session_token', sessionToken);

        return new Response(
          JSON.stringify({
            valid: true,
            user: session.users,
            sessionExpiry: session.expires_at
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'refresh': {
        // Refresh/extend session
        const { data: session } = await supabase
          .from('user_sessions')
          .select('user_id, expires_at')
          .eq('session_token', sessionToken)
          .single();

        if (!session || new Date(session.expires_at) < new Date()) {
          return new Response(
            JSON.stringify({ error: 'Invalid or expired session' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Extend session by 24 hours
        const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await supabase
          .from('user_sessions')
          .update({ 
            expires_at: newExpiry.toISOString(),
            last_activity: new Date().toISOString()
          })
          .eq('session_token', sessionToken);

        return new Response(
          JSON.stringify({
            success: true,
            expiresAt: newExpiry.toISOString()
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'logout': {
        if (sessionToken) {
          // Get user ID for audit log
          const { data: session } = await supabase
            .from('user_sessions')
            .select('user_id')
            .eq('session_token', sessionToken)
            .single();

          // Delete session
          await supabase
            .from('user_sessions')
            .delete()
            .eq('session_token', sessionToken);

          // Log logout
          if (session) {
            await supabase.from('audit_logs').insert({
              actor_user_id: session.user_id,
              action: 'logout',
              target_type: 'session',
              target_id: sessionToken,
              ip_address: req.headers.get('x-forwarded-for') || 'unknown',
              user_agent: req.headers.get('user-agent') || 'unknown'
            });
          }
        }

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'logout-all': {
        // Logout from all sessions
        if (sessionToken) {
          const { data: session } = await supabase
            .from('user_sessions')
            .select('user_id')
            .eq('session_token', sessionToken)
            .single();

          if (session) {
            // Delete all user sessions
            await supabase
              .from('user_sessions')
              .delete()
              .eq('user_id', session.user_id);

            // Log logout all
            await supabase.from('audit_logs').insert({
              actor_user_id: session.user_id,
              action: 'logout_all_sessions',
              target_type: 'user',
              target_id: session.user_id,
              ip_address: req.headers.get('x-forwarded-for') || 'unknown',
              user_agent: req.headers.get('user-agent') || 'unknown'
            });
          }
        }

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Session management error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});