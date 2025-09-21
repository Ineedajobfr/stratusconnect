import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Simplified demo users with just essential data
    const demoUsers = [
      {
        email: 'broker@stratusconnect.org',
        password: 'Bk7!mP9$qX2vL',
        role: 'broker',
        fullName: 'Michael Chen',
        username: 'BRK3847',
        headline: 'Senior Aviation Charter Broker',
        bio: 'Experienced charter broker specializing in executive and corporate travel with over 8 years in the industry.',
        location: 'New York, NY',
        company: 'SkyBridge Aviation',
        level: 2,
        trust_score: 85.5
      },
      {
        email: 'operator@stratusconnect.org',
        password: 'Op3#nW8&zR5kM',
        role: 'operator',
        fullName: 'Sarah Johnson',
        username: 'OPR9273',
        headline: 'Fleet Operations Manager',
        bio: 'Managing a diverse fleet of business jets with focus on safety, efficiency, and premium service delivery.',
        location: 'Los Angeles, CA',
        company: 'Elite Charter Co.',
        level: 3,
        trust_score: 92.3
      },
      {
        email: 'crew@stratusconnect.org',
        password: 'Cr9!uE4$tY7nQ',
        role: 'crew',
        fullName: 'Captain James Wilson',
        username: 'CRW5619',
        headline: 'Commercial Pilot & Flight Instructor',
        bio: 'ATP-rated pilot with 15,000+ flight hours across multiple aircraft types. Safety is my top priority.',
        location: 'Miami, FL',
        company: 'Independent',
        level: 2,
        trust_score: 88.7
      },
      {
        email: 'pilot@stratusconnect.org',
        password: 'Pl6#tF2&vB9xK',
        role: 'pilot',
        fullName: 'Emily Rodriguez',
        username: 'PLT8432',
        headline: 'Corporate Jet Captain',
        bio: 'Dedicated aviation professional with extensive experience in international operations and VIP transport.',
        location: 'Dallas, TX',
        company: 'Apex Aviation',
        level: 2,
        trust_score: 91.2
      }
    ];

    const results = [] as Array<{ email: string; success: boolean; message?: string; error?: string }>

    // Process users in parallel to reduce total execution time
    const operations = demoUsers.map(async (userData) => {
      try {
        let userId: string | undefined;

        // Try to create the user first
        const { data: created, error: createErr } = await supabaseClient.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
          user_metadata: {
            full_name: userData.fullName,
            role: userData.role,
            verification_status: 'approved'
          }
        });

        if (createErr) {
          const msg = (createErr as Error).message?.toLowerCase() || '';
          if (msg.includes('already') && msg.includes('registered')) {
            // Find existing
            const { data: list } = await supabaseClient.auth.admin.listUsers();
            const existing = list?.users?.find((u: Record<string, unknown>) => u.email === userData.email);
            if (existing) {
              userId = existing.id;
              await supabaseClient.auth.admin.updateUserById(existing.id, {
                password: userData.password,
                user_metadata: {
                  full_name: userData.fullName,
                  role: userData.role,
                  verification_status: 'approved'
                }
              });
            }
          } else {
            throw createErr;
          }
        } else {
          userId = created?.user?.id;
        }

        if (userId) {
          // Ensure a minimal usable profile exists for the app
          const { error: profileError } = await supabaseClient
            .from('user_profiles')
            .upsert({
              user_id: userId,
              username: userData.username,
              full_name: userData.fullName,
              role: userData.role,
              headline: userData.headline,
              bio: userData.bio,
              location: userData.location,
              company: userData.company,
              level: userData.level,
              trust_score: userData.trust_score,
              email_verified: true,
              phone_verified: false
            }, { onConflict: 'user_id' });

          if (profileError) {
            console.error(`Profile error for ${userData.email}:`, profileError);
          }
        }

        results.push({
          email: userData.email,
          success: true,
          message: 'User processed'
        });
      } catch (error: unknown) {
        console.error(`Error processing ${userData.email}:`, error);
        results.push({
          email: userData.email,
          success: false,
          error: error?.message || 'Unknown error'
        });
      }
    });

    await Promise.allSettled(operations);


    return new Response(
      JSON.stringify({
        message: 'Demo users setup completed',
        results,
        totalProcessed: results.length,
        successful: results.filter(r => r.success).length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error?.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});