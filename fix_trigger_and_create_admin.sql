-- Fix Trigger and Create Admin - Handle access_code_hash constraint
-- Run this in Supabase SQL Editor

-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- First, let's see the structure of the users table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Drop the problematic trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a new trigger function that handles all required fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.users with all required fields
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
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    COALESCE(NEW.raw_user_meta_data->>'verification_status', 'pending'),
    encode(gen_random_bytes(32), 'hex'), -- Generate random access code hash
    NEW.encrypted_password, -- Copy password hash from auth.users
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    username = COALESCE(EXCLUDED.username, users.username),
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    role = COALESCE(EXCLUDED.role, users.role),
    verification_status = COALESCE(EXCLUDED.verification_status, users.verification_status),
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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

-- Verify the admin user was created successfully
SELECT 
    'SUCCESS' as status,
    u.id,
    u.email,
    u.email_confirmed_at,
    u.encrypted_password IS NOT NULL as has_password,
    pub.username,
    pub.role,
    pub.access_code_hash IS NOT NULL as has_access_code,
    'Admin user created successfully!' as message
FROM auth.users u
LEFT JOIN public.users pub ON u.id = pub.id
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
