import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405 
        }
      );
    }

    const { email, password, fullName } = await req.json();

    if (!email || !password || !fullName) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and full name are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log('Creating admin user:', email);

    // Create the admin user
    const { data: created, error: createErr } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: 'admin',
        verification_status: 'approved'
      }
    });

    if (createErr) {
      const msg = createErr.message || '';
      if (msg.includes('already') && msg.includes('registered')) {
        // User exists, update their role to admin
        const { data: list } = await supabaseClient.auth.admin.listUsers();
        const existing = list?.users?.find((u: Record<string, unknown>) => u.email === email);
        
        if (existing) {
          // Update existing user to admin
          await supabaseClient.auth.admin.updateUserById(existing.id, {
            user_metadata: {
              full_name: fullName,
              role: 'admin',
              verification_status: 'approved'
            }
          });

          // Update their profile if it exists
          const { error: profileUpdateError } = await supabaseClient
            .from('profiles')
            .upsert({
              user_id: existing.id,
              email: email,
              full_name: fullName,
              role: 'admin',
              verification_status: 'approved'
            }, { onConflict: 'user_id' });

          if (profileUpdateError) {
            console.error('Profile update error:', profileUpdateError);
          }

          return new Response(
            JSON.stringify({
              success: true,
              message: 'Existing user promoted to admin',
              email: email
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          );
        }
      } else {
        throw new Error(createErr.message);
      }
    } else if (created?.user) {
      // New admin user created successfully
      console.log('Admin user created successfully:', created.user.id);

      // Create profile for the new admin user
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert({
          user_id: created.user.id,
          email: email,
          full_name: fullName,
          role: 'admin',
          verification_status: 'approved'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Admin user created successfully',
          email: email,
          userId: created.user.id
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Failed to create admin user' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );

  } catch (error) {
    console.error('Error creating admin user:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: (error as Error)?.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});