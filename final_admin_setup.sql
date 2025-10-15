-- Final Admin Setup - Clean and Simple
-- Run this in Supabase SQL Editor

-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Clean up any existing admin user
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

-- Get the user ID and insert into public tables
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'stratuscharters@gmail.com';
    
    -- Insert into public.users
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
            RAISE NOTICE 'public.users table does not exist';
        WHEN OTHERS THEN
            RAISE NOTICE 'Error inserting into public.users: %', SQLERRM;
    END;
    
    -- Insert into public.profiles
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
            RAISE NOTICE 'public.profiles table does not exist';
        WHEN OTHERS THEN
            RAISE NOTICE 'Error inserting into public.profiles: %', SQLERRM;
    END;
END $$;

-- Verify the admin user was created
SELECT 
    'SUCCESS' as status,
    u.id,
    u.email,
    u.email_confirmed_at,
    u.encrypted_password IS NOT NULL as has_password,
    'Admin user created successfully!' as message
FROM auth.users u
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

