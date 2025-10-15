-- Debug Admin Login - Check what's actually in the database
-- Run this in Supabase SQL Editor

-- Check if admin user exists in auth.users
SELECT 
    id,
    email,
    email_confirmed_at,
    encrypted_password IS NOT NULL as has_password,
    raw_user_meta_data,
    created_at
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com';

-- Check if admin user exists in public.users
SELECT 
    id,
    email,
    username,
    full_name,
    role,
    verification_status,
    created_at
FROM public.users 
WHERE email = 'stratuscharters@gmail.com';

-- Check if there are any profiles
SELECT 
    id,
    email,
    full_name,
    role,
    created_at
FROM public.profiles 
WHERE email = 'stratuscharters@gmail.com';

-- Test password verification
SELECT 
    email,
    encrypted_password = crypt('admin123', encrypted_password) as password_correct
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com';

-- Check what triggers exist
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- Show all tables in public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

