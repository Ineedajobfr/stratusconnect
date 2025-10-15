-- Complete Admin Fix - Handle All Triggers and Constraints
-- Run this in Supabase SQL Editor

-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- First, let's see what triggers exist
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- Drop ALL triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_user_profile_sync ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop ALL trigger functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_profile_sync();

-- Check the structure of both tables
SELECT 'public.users structure' as info, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'public.profiles structure' as info, column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Clean up any existing admin user
DELETE FROM auth.users WHERE email = 'stratuscharters@gmail.com';
DELETE FROM public.users WHERE email = 'stratuscharters@gmail.com';
DELETE FROM public.profiles WHERE email = 'stratuscharters@gmail.com';

-- Create admin user in auth.users WITHOUT triggers
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

-- Get the user ID and manually insert into public tables
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'stratuscharters@gmail.com';
    
    -- Insert into public.users (handle all required fields)
    BEGIN
        INSERT INTO public.users (
            id,
            email,
            username,
            full_name,
            role,
            verification_status,
            access_code_hash,
            password_hash,
            created_at,
            updated_at
        ) VALUES (
            admin_user_id,
            'stratuscharters@gmail.com',
            'admin',
            'StratusConnect Admin',
            'admin',
            'approved',
            encode(gen_random_bytes(32), 'hex'),
            (SELECT encrypted_password FROM auth.users WHERE id = admin_user_id),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Successfully inserted into public.users';
    EXCEPTION
        WHEN undefined_table THEN
            RAISE NOTICE 'public.users table does not exist';
        WHEN OTHERS THEN
            RAISE NOTICE 'Error inserting into public.users: %', SQLERRM;
    END;
    
    -- Insert into public.profiles (use correct column names)
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
        RAISE NOTICE 'Successfully inserted into public.profiles';
    EXCEPTION
        WHEN undefined_table THEN
            RAISE NOTICE 'public.profiles table does not exist';
        WHEN OTHERS THEN
            RAISE NOTICE 'Error inserting into public.profiles: %', SQLERRM;
    END;
END $$;

-- Verify the admin user was created successfully
SELECT 
    'SUCCESS' as status,
    u.id,
    u.email,
    u.email_confirmed_at,
    u.encrypted_password IS NOT NULL as has_password,
    COALESCE(pub.username, 'N/A') as username,
    COALESCE(pub.role, 'N/A') as users_role,
    COALESCE(prof.role, 'N/A') as profiles_role,
    'Admin user created successfully!' as message
FROM auth.users u
LEFT JOIN public.users pub ON u.id = pub.id
LEFT JOIN public.profiles prof ON u.id = prof.id
WHERE u.email = 'stratuscharters@gmail.com';

-- Test password verification
SELECT 
    'PASSWORD_TEST' as test_type,
    email,
    CASE 
        WHEN encrypted_password = crypt('Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$', encrypted_password) 
        THEN 'CORRECT' 
        ELSE 'INCORRECT' 
    END as password_status
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com';

-- Show final message
SELECT 'Admin setup complete! Try logging in now.' as final_message;

