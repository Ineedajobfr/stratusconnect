import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

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

    const { emailOrUsername, password }: LoginRequest = await req.json();
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    if (!emailOrUsername || !password) {
      return new Response(
        JSON.stringify({ error: 'Email/username and password required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find user by email or username
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${emailOrUsername},username.eq.${emailOrUsername}`)
      .single();

    if (userError || !user) {
      // Generic error message for security
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const lockExpiry = new Date(user.locked_until);
      const minutesLeft = Math.ceil((lockExpiry.getTime() - Date.now()) / (1000 * 60));
      
      return new Response(
        JSON.stringify({ 
          error: `Account locked. Try again in ${minutesLeft} minutes.`,
          lockedUntil: user.locked_until
        }),
        { status: 423, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if account is active
    if (!user.is_active) {
      return new Response(
        JSON.stringify({ error: 'Account is deactivated' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Hash provided password and compare
    const passwordHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(password + Deno.env.get('PASSWORD_SALT') || 'default_salt')
    );
    const providedHash = Array.from(new Uint8Array(passwordHash)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (providedHash !== user.password_hash) {
      // Increment failed login count
      const newFailedCount = user.failed_login_count + 1;
      const updateData: any = { 
        failed_login_count: newFailedCount 
      };

      // Lock account after 5 failed attempts for 15 minutes
      if (newFailedCount >= 5) {
        const lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        updateData.locked_until = lockUntil.toISOString();
      }

      await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      // Log failed login attempt
      await supabase.from('audit_logs').insert({
        actor_user_id: user.id,
        action: 'login_failed',
        target_type: 'user',
        target_id: user.id,
        ip_address: clientIP,
        user_agent: userAgent
      });

      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check verification status
    if (user.verification_status !== 'approved') {
      return new Response(
        JSON.stringify({ 
          error: 'Account pending approval',
          verificationStatus: user.verification_status,
          requiresApproval: true
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create session token
    const sessionToken = crypto.randomUUID();
    const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save session
    await supabase.from('user_sessions').insert({
      user_id: user.id,
      session_token: sessionToken,
      expires_at: sessionExpiry.toISOString(),
      ip_address: clientIP,
      user_agent: userAgent
    });

    // Update user login info and reset failed count
    await supabase
      .from('users')
      .update({
        last_login_at: new Date().toISOString(),
        failed_login_count: 0,
        locked_until: null
      })
      .eq('id', user.id);

    // Log successful login
    await supabase.from('audit_logs').insert({
      actor_user_id: user.id,
      action: 'login_success',
      target_type: 'user',
      target_id: user.id,
      ip_address: clientIP,
      user_agent: userAgent
    });

    console.log('User logged in successfully:', user.id);

    return new Response(
      JSON.stringify({
        success: true,
        sessionToken,
        expiresAt: sessionExpiry.toISOString(),
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.full_name,
          role: user.role,
          verificationStatus: user.verification_status,
          lastLoginAt: new Date().toISOString()
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});