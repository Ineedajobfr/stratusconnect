-- Fix Password Hash - Use Supabase's preferred method
-- Run this in Supabase SQL Editor

BEGIN;

-- First, let's see what the current password hash looks like
SELECT 'CURRENT_HASH' as info, encrypted_password, LENGTH(encrypted_password) as length
FROM auth.users WHERE email = 'stratuscharters@gmail.com';

-- Delete the current admin user completely
DELETE FROM auth.identities WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'stratuscharters@gmail.com'
);
DELETE FROM auth.users WHERE email = 'stratuscharters@gmail.com';
DELETE FROM public.users WHERE email = 'stratuscharters@gmail.com';
DELETE FROM public.profiles WHERE email = 'stratuscharters@gmail.com';

-- Create admin user with a SIMPLE password first to test
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
    crypt('admin123', gen_salt('bf')),  -- Simple password first
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "StratusConnect Admin", "role": "admin", "username": "admin", "verification_status": "approved"}',
    false,
    'authenticated'
);

-- Create auth.identities entry
INSERT INTO auth.identities (
    id,
    user_id,
    provider,
    provider_id,
    identity_data,
    created_at,
    updated_at
) SELECT
    gen_random_uuid(),
    u.id,
    'email',
    u.email,
    jsonb_build_object('email', u.email),
    NOW(),
    NOW()
FROM auth.users u
WHERE u.email = 'stratuscharters@gmail.com';

-- Insert into public.users
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
) SELECT
    u.id,
    u.email,
    'admin',
    'StratusConnect Admin',
    'admin',
    'approved',
    encode(gen_random_bytes(32), 'hex'),
    u.encrypted_password,
    NOW(),
    NOW()
FROM auth.users u
WHERE u.email = 'stratuscharters@gmail.com';

-- Insert into public.profiles
INSERT INTO public.profiles (
    id,
    full_name,
    email,
    role,
    created_at,
    updated_at
) SELECT
    u.id,
    'StratusConnect Admin',
    u.email,
    'admin',
    NOW(),
    NOW()
FROM auth.users u
WHERE u.email = 'stratuscharters@gmail.com';

COMMIT;

-- Test the simple password
SELECT 
    'SIMPLE_PASSWORD_TEST' as test,
    email,
    CASE 
        WHEN encrypted_password = crypt('admin123', encrypted_password) 
        THEN '✅ SIMPLE PASSWORD WORKS' 
        ELSE '❌ SIMPLE PASSWORD FAILS' 
    END as result
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com';

-- Show the new hash format
SELECT 
    'NEW_HASH_INFO' as info,
    email,
    encrypted_password,
    LENGTH(encrypted_password) as length,
    SUBSTRING(encrypted_password, 1, 15) as start
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com';

SELECT '🎉 ADMIN USER WITH SIMPLE PASSWORD CREATED! 🎉' as message;

