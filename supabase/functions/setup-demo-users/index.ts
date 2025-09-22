import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

async function createUserProfile(supabaseClient: unknown, userId: string, userData: Record<string, unknown>) {
  try {
    // Upsert user profile
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
        phone_verified: true
      }, { onConflict: 'user_id' });

    if (profileError) console.error('Profile error:', profileError);

    // Clear and recreate experience
    await supabaseClient.from('experience').delete().eq('user_id', userId);
    if (userData.experience?.length > 0) {
      const experienceData = userData.experience.map((exp: Record<string, unknown>) => ({
        ...exp,
        user_id: userId
      }));
      const { error: expError } = await supabaseClient.from('experience').insert(experienceData);
      if (expError) console.error('Experience error:', expError);
    }

    // Clear and recreate credentials
    await supabaseClient.from('credentials').delete().eq('user_id', userId);
    if (userData.credentials?.length > 0) {
      const credentialsData = userData.credentials.map((cred: Record<string, unknown>) => ({
        ...cred,
        user_id: userId
      }));
      const { error: credError } = await supabaseClient.from('credentials').insert(credentialsData);
      if (credError) console.error('Credentials error:', credError);
    }

    // References table not present in schema - skipping

    // Upsert privacy settings
    const { error: privacyError } = await supabaseClient
      .from('privacy_settings')
      .upsert({
        user_id: userId,
        show_email: false,
        show_phone: false,
        show_activity: true,
        allow_messages: true
      }, { onConflict: 'user_id' });

    if (privacyError) console.error('Privacy error:', privacyError);

    // Activity table not present in schema - skipping

  } catch (error) {
    console.error('Error creating user profile:', error);
  }
}

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

    // Demo users and admin users
    const demoUsers = [
      // Admin accounts - FULLY FUNCTIONAL SYSTEM ADMINISTRATORS
      {
        email: 'admin@stratusconnect.org',
        password: 'Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$',
        role: 'admin',
        fullName: 'StratusConnect System Administrator',
        username: 'SYSADMIN001',
        headline: 'System Administrator',
        bio: 'Platform administrator with full system access and oversight capabilities.',
        location: 'Global',
        company: 'StratusConnect Administration',
        level: 5,
        trust_score: 100.0,
        experience: [
          {
            title: 'System Administrator',
            company: 'StratusConnect',
            start_date: '2024-01-01',
            description: 'Full platform administration and user management oversight.'
          }
        ],
        credentials: [
          { type: 'Admin Access', issuer: 'StratusConnect', status: 'valid', expires_at: '2030-12-31' }
        ],
        references: []
      },
      {
        email: 'stratuscharters@gmail.com',
        password: 'Str4tu$Ch4rt3r$_0wn3r_S3cur3_2025!@#$%',
        role: 'admin',
        fullName: 'Stratus Charters Owner',
        username: 'OWNER001',
        headline: 'Platform Owner',
        bio: 'Platform owner with full administrative access and business oversight.',
        location: 'United Kingdom',
        company: 'StratusConnect Administration',
        level: 5,
        trust_score: 100.0,
        experience: [
          {
            title: 'Platform Owner',
            company: 'Stratus Charters',
            start_date: '2023-01-01',
            description: 'Founded and owns the StratusConnect aviation platform.'
          }
        ],
        credentials: [
          { type: 'Owner Access', issuer: 'StratusConnect', status: 'valid', expires_at: '2030-12-31' }
        ],
        references: []
      },
      {
        email: 'lordbroctree1@gmail.com',
        password: 'L0rd_Br0ctr33_4dm1n_M4st3r_2025!@#$%^&',
        role: 'admin',
        fullName: 'Lord Broctree Administrator',
        username: 'ADMIN001',
        headline: 'Senior Administrator',
        bio: 'Senior platform administrator with comprehensive system management capabilities.',
        location: 'United Kingdom',
        company: 'StratusConnect Administration',
        level: 5,
        trust_score: 100.0,
        experience: [
          {
            title: 'Senior Administrator',
            company: 'StratusConnect',
            start_date: '2024-01-01',
            description: 'Senior administrative oversight and strategic platform management.'
          }
        ],
        credentials: [
          { type: 'Senior Admin Access', issuer: 'StratusConnect', status: 'valid', expires_at: '2030-12-31' }
        ],
        references: []
      },
      {
        email: 'admin.broker@stratusconnect.org',
        password: 'AdminBk7!mP9$qX2vL',
        role: 'broker',
        fullName: 'Admin Broker',
        username: 'ADMIN_BROKER',
        headline: 'Admin Broker Account',
        bio: 'Administrative broker account with full platform access.',
        location: 'Global',
        company: 'StratusConnect',
        level: 5,
        trust_score: 100.0,
        experience: [],
        credentials: [],
        references: []
      },
      {
        email: 'admin.operator@stratusconnect.org',
        password: 'AdminOp3#nW8&zR5kM',
        role: 'operator',
        fullName: 'Admin Operator',
        username: 'ADMIN_OPERATOR',
        headline: 'Admin Operator Account',
        bio: 'Administrative operator account with full platform access.',
        location: 'Global',
        company: 'StratusConnect',
        level: 5,
        trust_score: 100.0,
        experience: [],
        credentials: [],
        references: []
      },
      {
        email: 'admin.pilot@stratusconnect.org',
        password: 'AdminPl6#tF2&vB9xK',
        role: 'pilot',
        fullName: 'Admin Pilot',
        username: 'ADMIN_PILOT',
        headline: 'Admin Pilot Account',
        bio: 'Administrative pilot account with full platform access.',
        location: 'Global',
        company: 'StratusConnect',
        level: 5,
        trust_score: 100.0,
        experience: [],
        credentials: [],
        references: []
      },
      {
        email: 'admin.crew@stratusconnect.org',
        password: 'AdminCr9!uE4$tY7nQ',
        role: 'crew',
        fullName: 'Admin Crew',
        username: 'ADMIN_CREW',
        headline: 'Admin Crew Account',
        bio: 'Administrative crew account with full platform access.',
        location: 'Global',
        company: 'StratusConnect',
        level: 5,
        trust_score: 100.0,
        experience: [],
        credentials: [],
        references: []
      },
      // Regular demo users
      {
        email: 'broker@stratusconnect.org',
        password: 'Bk7!mP9$qX2vL',
        role: 'broker',
        fullName: 'Alexandra Mitchell',
        username: 'AMI2847',
        headline: 'Senior Aviation Broker & Charter Specialist',
        bio: 'Experienced aviation broker with 12+ years specializing in executive charter solutions. Expert in international route planning and luxury aircraft sourcing.',
        location: 'New York, NY',
        company: 'Elite Aviation Partners',
        level: 2,
        trust_score: 94.5,
        experience: [
          {
            title: 'Senior Aviation Broker',
            company: 'Elite Aviation Partners',
            start_date: '2018-03-01',
            description: 'Leading broker for high-net-worth clients, specializing in transcontinental routes and luxury aircraft sourcing.'
          },
          {
            title: 'Charter Sales Manager',
            company: 'Skyline Charter',
            start_date: '2015-06-01',
            end_date: '2018-02-28',
            description: 'Managed charter sales operations and built lasting client relationships in the premium aviation market.'
          }
        ],
        credentials: [
          { type: 'Government ID', issuer: 'US Passport', status: 'valid', expires_at: '2029-08-15' },
          { type: 'Company Registration', issuer: 'NY State', status: 'valid', expires_at: '2025-12-31' },
          { type: 'IATA Certificate', issuer: 'IATA', status: 'valid', expires_at: '2025-04-30' }
        ],
        references: [
          { ref_name: 'Michael Harrison', ref_company: 'Harrison Industries', note: 'Outstanding service and attention to detail. Always delivers on promises.', status: 'approved' },
          { ref_name: 'Sarah Chen', ref_company: 'Global Ventures', note: 'Highly professional and knowledgeable. Excellent communication throughout.', status: 'approved' }
        ]
      },
      {
        email: 'operator@stratusconnect.org',
        password: 'Op3#nW8&zR5kM',
        role: 'operator',
        fullName: 'Captain Robert Sterling',
        username: 'RST3921',
        headline: 'Fleet Operations Director & Chief Pilot',
        bio: 'Aviation operations leader with 20+ years of flight experience. Managing premium charter fleet operations across North America and Europe.',
        location: 'Miami, FL',
        company: 'Sterling Aviation Services',
        level: 2,
        trust_score: 98.2,
        experience: [
          {
            title: 'Fleet Operations Director',
            company: 'Sterling Aviation Services',
            start_date: '2020-01-01',
            description: 'Overseeing fleet of 15 aircraft, operations planning, and safety management for premium charter services.'
          },
          {
            title: 'Chief Pilot',
            company: 'Executive Air',
            start_date: '2012-08-01',
            end_date: '2019-12-31',
            description: 'Led pilot training programs and maintained highest safety standards for corporate aviation operations.'
          }
        ],
        credentials: [
          { type: 'Government ID', issuer: 'US Driver License', status: 'valid', expires_at: '2027-05-20' },
          { type: 'AOC Certificate', issuer: 'FAA', status: 'valid', expires_at: '2025-09-15' },
          { type: 'Insurance Certificate', issuer: 'Aviation Underwriters', status: 'valid', expires_at: '2024-12-31' },
          { type: 'Safety Management Certificate', issuer: 'NATA', status: 'valid', expires_at: '2025-06-30' }
        ],
        references: [
          { ref_name: 'Jennifer Walsh', ref_company: 'Walsh Group', note: 'Exceptional safety record and operational excellence. Highly recommend.', status: 'approved' },
          { ref_name: 'David Martinez', ref_company: 'Martinez Holdings', note: 'Professional service with unmatched attention to detail and safety.', status: 'approved' }
        ]
      },
      {
        email: 'crew@stratusconnect.org',
        password: 'Cr9!uE4$tY7nQ',
        role: 'crew',
        fullName: 'Emma Rodriguez',
        username: 'ERO4756',
        headline: 'Corporate Flight Attendant & Safety Specialist',
        bio: 'Experienced corporate flight attendant with expertise in luxury service standards and emergency procedures. Fluent in English, Spanish, and French.',
        location: 'Los Angeles, CA',
        company: 'Freelance',
        level: 2,
        trust_score: 96.8,
        experience: [
          {
            title: 'Senior Flight Attendant',
            company: 'Luxury Air Services',
            start_date: '2019-04-01',
            description: 'Providing exceptional service aboard ultra-long-range aircraft for VIP clientele and corporate executives.'
          },
          {
            title: 'Corporate Flight Attendant',
            company: 'Executive Airways',
            start_date: '2016-09-01',
            end_date: '2019-03-31',
            description: 'Delivered premium cabin service and ensured passenger safety on domestic and international flights.'
          }
        ],
        credentials: [
          { type: 'Government ID', issuer: 'US Passport', status: 'valid', expires_at: '2030-11-10' },
          { type: 'Flight Attendant Certificate', issuer: 'FAA', status: 'valid', expires_at: '2025-08-20' },
          { type: 'First Aid Certificate', issuer: 'Red Cross', status: 'valid', expires_at: '2024-07-15' },
          { type: 'Security Training Certificate', issuer: 'TSA', status: 'valid', expires_at: '2024-12-05' }
        ],
        references: [
          { ref_name: 'Captain James Wilson', ref_company: 'Wilson Aviation', note: 'Outstanding professionalism and service delivery. Asset to any flight operation.', status: 'approved' },
          { ref_name: 'Lisa Thompson', ref_company: 'Thompson Enterprises', note: 'Exceptional attention to detail and passenger care. Highly skilled professional.', status: 'approved' }
        ]
      },
      {
        email: 'pilot@stratusconnect.org',
        password: 'Pl6#tF2&vB9xK',
        role: 'pilot',
        fullName: 'Captain Marcus Thompson',
        username: 'MTH5893',
        headline: 'Senior Captain - Gulfstream & Citation Expert',
        bio: 'ATP-rated pilot with 8,500+ flight hours across multiple aircraft types. Specialized in international operations and complex weather conditions.',
        location: 'Dallas, TX',
        company: 'Freelance',
        level: 2,
        trust_score: 99.1,
        experience: [
          {
            title: 'Contract Captain',
            company: 'Various Operators',
            start_date: '2021-01-01',
            description: 'Flying Gulfstream G650, Citation X, and other high-performance aircraft for corporate and charter operations.'
          },
          {
            title: 'Chief Pilot',
            company: 'Apex Aviation',
            start_date: '2017-05-01',
            end_date: '2020-12-31',
            description: 'Managed flight operations and pilot training for 12-aircraft corporate fleet.'
          }
        ],
        credentials: [
          { type: 'Government ID', issuer: 'US Passport', status: 'valid', expires_at: '2028-09-25' },
          { type: 'ATP License', issuer: 'FAA', status: 'valid', expires_at: '2026-03-15' },
          { type: 'Medical Certificate', issuer: 'FAA AME', status: 'valid', expires_at: '2024-11-30' },
          { type: 'Type Rating - G650', issuer: 'FlightSafety', status: 'valid', expires_at: '2024-10-15' }
        ],
        references: [
          { ref_name: 'Captain Susan Brooks', ref_company: 'Brooks Aviation', note: 'Exceptional pilot skills and professional demeanor. Highly recommended.', status: 'approved' },
          { ref_name: 'Tom Anderson', ref_company: 'Anderson Corp', note: 'Outstanding safety record and technical expertise. True professional.', status: 'approved' }
        ]
      }
    ];

    const results = [];

    for (const userData of demoUsers) {
      try {
        // Try to create auth user
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
          const msg = createErr.message || '';
          if (msg.includes('already') && msg.includes('registered')) {
            // User exists, get their ID and update metadata
            const { data: list } = await supabaseClient.auth.admin.listUsers();
            const existing = list?.users?.find((u: Record<string, unknown>) => u.email === userData.email);
            
            if (existing) {
              // Update existing user's metadata and password
              await supabaseClient.auth.admin.updateUserById(existing.id, {
                password: userData.password,
                user_metadata: {
                  full_name: userData.fullName,
                  role: userData.role,
                  verification_status: 'approved'
                }
              });
              
              // Create/update profile
              await createUserProfile(supabaseClient, existing.id, userData);
              
              results.push({
                email: userData.email,
                success: true,
                message: 'User already exists'
              });
            }
          } else {
            throw new Error(createErr.message);
          }
        } else if (created?.user) {
          // New user created successfully
          await createUserProfile(supabaseClient, created.user.id, userData);
          
          results.push({
            email: userData.email,
            success: true,
            message: 'User created successfully'
          });
        }

      } catch (error) {
        console.error(`Error processing user ${userData.email}:`, error);
        results.push({
          email: userData.email,
          success: false,
          error: 'Database error creating new user'
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Demo users setup completed',
        results
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
        details: (error as Error)?.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});