-- Create admin demo users that are automatically verified
-- These users will have access to real terminals but with admin privileges

-- First, let's create the users in auth.users if they don't exist
DO $$
DECLARE
    admin_broker_id UUID;
    admin_operator_id UUID;
    admin_crew_id UUID;
    admin_pilot_id UUID;
BEGIN
    -- Create admin broker user
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        role,
        aud,
        raw_user_meta_data,
        confirmation_token,
        email_change_token_new,
        recovery_token
    ) VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000000',
        'admin.broker@stratusconnect.org',
        crypt('AdminBk7!mP9$qX2vL', gen_salt('bf')),
        now(),
        now(),
        now(),
        'authenticated',
        'authenticated',
        '{"role": "broker", "full_name": "Admin Broker User"}',
        '',
        '',
        ''
    ) ON CONFLICT (email) DO NOTHING
    RETURNING id INTO admin_broker_id;

    -- Get the ID if user already exists
    IF admin_broker_id IS NULL THEN
        SELECT id INTO admin_broker_id FROM auth.users WHERE email = 'admin.broker@stratusconnect.org';
    END IF;

    -- Create admin operator user
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        role,
        aud,
        raw_user_meta_data,
        confirmation_token,
        email_change_token_new,
        recovery_token
    ) VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000000',
        'admin.operator@stratusconnect.org',
        crypt('AdminOp3#nW8&zR5kM', gen_salt('bf')),
        now(),
        now(),
        now(),
        'authenticated',
        'authenticated',
        '{"role": "operator", "full_name": "Admin Operator User"}',
        '',
        '',
        ''
    ) ON CONFLICT (email) DO NOTHING
    RETURNING id INTO admin_operator_id;

    IF admin_operator_id IS NULL THEN
        SELECT id INTO admin_operator_id FROM auth.users WHERE email = 'admin.operator@stratusconnect.org';
    END IF;

    -- Create admin crew user
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        role,
        aud,
        raw_user_meta_data,
        confirmation_token,
        email_change_token_new,
        recovery_token
    ) VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000000',
        'admin.crew@stratusconnect.org',
        crypt('AdminCr9!uE4$tY7nQ', gen_salt('bf')),
        now(),
        now(),
        now(),
        'authenticated',
        'authenticated',
        '{"role": "crew", "full_name": "Admin Crew User"}',
        '',
        '',
        ''
    ) ON CONFLICT (email) DO NOTHING
    RETURNING id INTO admin_crew_id;

    IF admin_crew_id IS NULL THEN
        SELECT id INTO admin_crew_id FROM auth.users WHERE email = 'admin.crew@stratusconnect.org';
    END IF;

    -- Create admin pilot user
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        role,
        aud,
        raw_user_meta_data,
        confirmation_token,
        email_change_token_new,
        recovery_token
    ) VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000000',
        'admin.pilot@stratusconnect.org',
        crypt('AdminPl6#tF2&vB9xK', gen_salt('bf')),
        now(),
        now(),
        now(),
        'authenticated',
        'authenticated',
        '{"role": "pilot", "full_name": "Admin Pilot User"}',
        '',
        '',
        ''
    ) ON CONFLICT (email) DO NOTHING
    RETURNING id INTO admin_pilot_id;

    IF admin_pilot_id IS NULL THEN
        SELECT id INTO admin_pilot_id FROM auth.users WHERE email = 'admin.pilot@stratusconnect.org';
    END IF;

    -- Create or update profiles for these admin users
    INSERT INTO public.profiles (
        user_id,
        email,
        full_name,
        role,
        verification_status,
        company_name
    ) VALUES 
        (admin_broker_id, 'admin.broker@stratusconnect.org', 'Admin Broker User', 'admin', 'approved', 'StratusConnect Admin'),
        (admin_operator_id, 'admin.operator@stratusconnect.org', 'Admin Operator User', 'admin', 'approved', 'StratusConnect Admin'),
        (admin_crew_id, 'admin.crew@stratusconnect.org', 'Admin Crew User', 'admin', 'approved', 'StratusConnect Admin'),
        (admin_pilot_id, 'admin.pilot@stratusconnect.org', 'Admin Pilot User', 'admin', 'approved', 'StratusConnect Admin')
    ON CONFLICT (user_id) DO UPDATE SET
        verification_status = 'approved',
        role = 'admin',
        company_name = 'StratusConnect Admin';

END $$;