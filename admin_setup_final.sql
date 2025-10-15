-- Simple Admin Update - Drop and recreate profiles table
-- Run this in your Supabase SQL Editor

-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update the existing admin account password and metadata
UPDATE auth.users
SET 
    encrypted_password = crypt('Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$', gen_salt('bf')),
    raw_user_meta_data = '{"full_name":"StratusConnect Admin","role":"admin"}',
    updated_at = NOW(),
    email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'stratuscharters@gmail.com';

-- Drop and recreate profiles table to avoid column conflicts
DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'user',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert profile for the admin user
INSERT INTO public.profiles (id, full_name, email, role, updated_at)
SELECT 
    id, 
    'StratusConnect Admin', 
    'stratuscharters@gmail.com', 
    'admin', 
    NOW()
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com';

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create basic policies for profiles table
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

-- Show the updated user info
SELECT 
    id, 
    email, 
    raw_user_meta_data,
    email_confirmed_at,
    updated_at
FROM auth.users 
WHERE email = 'stratuscharters@gmail.com';

