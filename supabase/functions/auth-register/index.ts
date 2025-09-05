import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
  role: 'broker' | 'operator' | 'pilot' | 'crew';
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

    const { email, password, fullName, companyName, role }: RegisterRequest = await req.json();

    // Validate input
    if (!email || !password || !fullName || !role) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate password strength (minimum 12 chars, at least one letter and number)
    if (password.length < 12 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 12 characters with letters and numbers' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Email already registered' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique username and access code
    const { data: username } = await supabase.rpc('generate_unique_username');
    const accessCode = await supabase.rpc('generate_access_code');

    if (!username || !accessCode.data) {
      throw new Error('Failed to generate credentials');
    }

    // Hash password and access code
    const passwordHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(password + Deno.env.get('PASSWORD_SALT') || 'default_salt')
    );
    const accessCodeHash = await crypto.subtle.digest(
      'SHA-256', 
      new TextEncoder().encode(accessCode.data + Deno.env.get('ACCESS_CODE_SALT') || 'default_salt')
    );

    // Generate email verification token
    const verificationToken = crypto.randomUUID();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user record
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: Array.from(new Uint8Array(passwordHash)).map(b => b.toString(16).padStart(2, '0')).join(''),
        username: username,
        access_code_hash: Array.from(new Uint8Array(accessCodeHash)).map(b => b.toString(16).padStart(2, '0')).join(''),
        full_name: fullName,
        company_name: companyName || null,
        role,
        email_verification_token: verificationToken,
        email_verification_expires_at: verificationExpiry.toISOString()
      })
      .select('id, username, email, role, verification_status')
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create user account' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log registration audit
    await supabase.from('audit_logs').insert({
      actor_user_id: newUser.id,
      action: 'user_registration',
      target_type: 'user',
      target_id: newUser.id,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown'
    });

    console.log('User registered successfully:', newUser.id);

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
          accessCode: accessCode.data, // Only shown once
          email: newUser.email,
          role: newUser.role,
          verificationStatus: newUser.verification_status
        },
        verificationToken // For email verification
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});