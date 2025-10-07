-- Create Admin Accounts for StratusConnect
-- Run this in your Supabase SQL Editor

-- Enable the pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the main admin account
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_sso_user,
    created_at,
    updated_at
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    'admin@stratusconnect.org',
    crypt('Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"StratusConnect Admin","role":"admin"}',
    FALSE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = crypt('Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$', gen_salt('bf')),
    raw_user_meta_data = '{"full_name":"StratusConnect Admin","role":"admin"}',
    updated_at = NOW();

-- Create a secondary admin account
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_sso_user,
    created_at,
    updated_at
) VALUES (
    'b1fcc0a1-1d2e-4f3a-8b4c-5d6e7f8a9b0c'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    'admin2@stratusconnect.org',
    crypt('Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Secondary Admin","role":"admin"}',
    FALSE,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = crypt('Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$', gen_salt('bf')),
    raw_user_meta_data = '{"full_name":"Secondary Admin","role":"admin"}',
    updated_at = NOW();

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'user',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert profiles for the admin users
INSERT INTO public.profiles (id, full_name, email, role, avatar_url, updated_at)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'StratusConnect Admin', 'admin@stratusconnect.org', 'admin', NULL, NOW()),
    ('b1fcc0a1-1d2e-4f3a-8b4c-5d6e7f8a9b0c'::uuid, 'Secondary Admin', 'admin2@stratusconnect.org', 'admin', NULL, NOW())
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    updated_at = NOW();

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;