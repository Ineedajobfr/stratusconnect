-- Fix Admin User Creation - Handle username constraint
-- Run this in Supabase SQL Editor

-- First, let's check what tables exist and their structure
-- This will help us understand the database schema

-- Check if there's a users table and what columns it has
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public';

-- Check if there's a profiles table and what columns it has
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public';

-- Check for any triggers on auth.users
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- Now let's create the admin user properly
-- Delete any existing admin user first
DELETE FROM auth.users WHERE email = 'stratuscharters@gmail.com';

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
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "StratusConnect Admin", "role": "admin", "username": "admin"}',
  false,
  'authenticated'
);

-- Get the user ID
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'stratuscharters@gmail.com';
    
    -- If there's a public.users table, insert there with username
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
        ) ON CONFLICT (id) DO UPDATE SET
            username = 'admin',
            full_name = 'StratusConnect Admin',
            role = 'admin',
            verification_status = 'approved',
            updated_at = NOW();
    EXCEPTION
        WHEN undefined_table THEN
            -- If public.users doesn't exist, create profile instead
            NULL;
    END;
    
    -- If there's a public.profiles table, insert there
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
        ) ON CONFLICT (id) DO UPDATE SET
            full_name = 'StratusConnect Admin',
            email = 'stratuscharters@gmail.com',
            role = 'admin',
            updated_at = NOW();
    EXCEPTION
        WHEN undefined_table THEN
            -- If public.profiles doesn't exist, that's okay
            NULL;
    END;
END $$;

-- Verify the admin user was created
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    u.raw_user_meta_data
FROM auth.users u
WHERE u.email = 'stratuscharters@gmail.com';

-- Check if we can find the user in public tables
SELECT 'users' as table_name, id, email, username, role FROM public.users WHERE email = 'stratuscharters@gmail.com'
UNION ALL
SELECT 'profiles' as table_name, id, email, null as username, role FROM public.profiles WHERE email = 'stratuscharters@gmail.com';

