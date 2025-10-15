-- Check and Fix Admin User - Handle both profiles and users tables
-- Run this in Supabase SQL Editor

-- First, let's see what's in both tables for the admin user
SELECT 'auth.users' as table_source, id::text, email, email_confirmed_at, 
       encrypted_password IS NOT NULL as has_password,
       raw_user_meta_data
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com'

UNION ALL

SELECT 'public.users' as table_source, id::text, email, null::timestamp as email_confirmed_at,
       null::boolean as has_password,
       null::jsonb as raw_user_meta_data
FROM public.users 
WHERE email = 'stratuscharters@gmail.com'

UNION ALL

SELECT 'public.profiles' as table_source, id::text, email, null::timestamp as email_confirmed_at,
       null::boolean as has_password,
       null::jsonb as raw_user_meta_data
FROM public.profiles 
WHERE email = 'stratuscharters@gmail.com';

-- Check the structure of both tables
SELECT 'public.users structure' as info, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'public.profiles structure' as info, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Now let's clean up and create the admin user properly
-- Delete from all tables first
DELETE FROM auth.users WHERE email = 'stratuscharters@gmail.com';
DELETE FROM public.users WHERE email = 'stratuscharters@gmail.com';
DELETE FROM public.profiles WHERE email = 'stratuscharters@gmail.com';

-- Create admin user in auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'stratuscharters@gmail.com',
  crypt('Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "StratusConnect Admin", "role": "admin", "username": "admin", "verification_status": "approved"}',
  false,
  'authenticated'
);

-- Get the user ID and insert into both tables
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'stratuscharters@gmail.com';
    
    -- Insert into public.users (if it exists)
    BEGIN
        INSERT INTO public.users (
            id,
            email,
            username,
            full_name,
            role,
            verification_status,
            created_at,
            updated_at
        ) VALUES (
            admin_user_id,
            'stratuscharters@gmail.com',
            'admin',
            'StratusConnect Admin',
            'admin',
            'approved',
            NOW(),
            NOW()
        );
    EXCEPTION
        WHEN undefined_table THEN
            -- Table doesn't exist, skip
            NULL;
        WHEN others THEN
            -- Some other error, log it
            RAISE NOTICE 'Error inserting into public.users: %', SQLERRM;
    END;
    
    -- Insert into public.profiles (if it exists)
    BEGIN
        INSERT INTO public.profiles (
            id,
            full_name,
            email,
            role,
            created_at,
            updated_at
        ) VALUES (
            admin_user_id,
            'StratusConnect Admin',
            'stratuscharters@gmail.com',
            'admin',
            NOW(),
            NOW()
        );
    EXCEPTION
        WHEN undefined_table THEN
            -- Table doesn't exist, skip
            NULL;
        WHEN others THEN
            -- Some other error, log it
            RAISE NOTICE 'Error inserting into public.profiles: %', SQLERRM;
    END;
END $$;

-- Verify the admin user was created
SELECT 
    'Final Result' as status,
    u.id,
    u.email,
    u.email_confirmed_at,
    u.encrypted_password IS NOT NULL as has_password,
    pub_users.username,
    pub_users.role as users_role,
    pub_profiles.role as profiles_role
FROM auth.users u
LEFT JOIN public.users pub_users ON u.id = pub_users.id
LEFT JOIN public.profiles pub_profiles ON u.id = pub_profiles.id
WHERE u.email = 'stratuscharters@gmail.com';

-- Test password verification
SELECT 
    'Password Test' as test,
    email,
    encrypted_password = crypt('Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$', encrypted_password) as password_correct
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com';
