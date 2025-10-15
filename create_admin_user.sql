-- Create Admin User for stratuscharters@gmail.com
-- Run this in Supabase SQL Editor

-- First, create the admin user in auth.users
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'stratuscharters@gmail.com',
    crypt('AdminPassword123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Admin","last_name":"User","role":"admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (email) DO UPDATE SET
    email_confirmed_at = NOW(),
    raw_user_meta_data = '{"first_name":"Admin","last_name":"User","role":"admin"}';

-- Create admin profile
INSERT INTO public.profiles (
    id,
    email,
    role,
    first_name,
    last_name,
    verification_status,
    verified_at,
    verified_by
) 
SELECT 
    id,
    'stratuscharters@gmail.com',
    'admin',
    'Admin',
    'User',
    'approved',
    NOW(),
    id -- Self-verified
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com'
ON CONFLICT (id) DO UPDATE SET
    verification_status = 'approved',
    verified_at = NOW();

-- Verify the admin user was created
SELECT 
    u.email,
    u.email_confirmed_at,
    p.role,
    p.first_name,
    p.last_name,
    p.verification_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'stratuscharters@gmail.com';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Admin user created successfully!';
    RAISE NOTICE '📧 Email: stratuscharters@gmail.com';
    RAISE NOTICE '🔐 Password: AdminPassword123!';
    RAISE NOTICE '🎯 Role: admin';
    RAISE NOTICE '✅ Status: verified and approved';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 You can now use magic link authentication from the Staff Portal';
END $$;

