-- FINAL ADMIN FIX - Using the CORRECT email address!
-- Run this in Supabase SQL Editor

BEGIN;

-- Clean up ALL existing admin attempts
DELETE FROM auth.identities WHERE user_id IN (
    SELECT id FROM auth.users WHERE email LIKE '%stratuscharters%' OR email LIKE '%admin%stratusconnect%'
);
DELETE FROM auth.users WHERE email LIKE '%stratuscharters%' OR email LIKE '%admin%stratusconnect%';
DELETE FROM public.users WHERE email LIKE '%stratuscharters%' OR email LIKE '%admin%stratusconnect%';
DELETE FROM public.profiles WHERE email LIKE '%stratuscharters%' OR email LIKE '%admin%stratusconnect%';

-- Create admin user with the CORRECT email
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
    'admin@stratusconnect.com',  -- THE CORRECT EMAIL!
    crypt('admin123', gen_salt('bf')),
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
WHERE u.email = 'admin@stratusconnect.com';

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
WHERE u.email = 'admin@stratusconnect.com';

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
WHERE u.email = 'admin@stratusconnect.com';

COMMIT;

-- Verify the admin user was created correctly
SELECT 
    'SUCCESS_CHECK' as status,
    u.id,
    u.email,
    u.email_confirmed_at,
    CASE WHEN u.encrypted_password IS NOT NULL THEN 'YES' ELSE 'NO' END as has_password,
    CASE WHEN i.id IS NOT NULL THEN 'YES' ELSE 'NO' END as has_identity,
    CASE WHEN pu.id IS NOT NULL THEN 'YES' ELSE 'NO' END as has_public_user,
    CASE WHEN pp.id IS NOT NULL THEN 'YES' ELSE 'NO' END as has_profile
FROM auth.users u
LEFT JOIN auth.identities i ON u.id = i.user_id AND i.provider = 'email'
LEFT JOIN public.users pu ON u.id = pu.id
LEFT JOIN public.profiles pp ON u.id = pp.id
WHERE u.email = 'admin@stratusconnect.com';

-- Test password verification
SELECT 
    'PASSWORD_TEST' as test,
    email,
    CASE 
        WHEN encrypted_password = crypt('admin123', encrypted_password) 
        THEN '✅ PASSWORD WORKS' 
        ELSE '❌ PASSWORD FAILS' 
    END as result
FROM auth.users 
WHERE email = 'admin@stratusconnect.com';

SELECT '🎉 ADMIN USER WITH CORRECT EMAIL CREATED! 🎉' as message;

