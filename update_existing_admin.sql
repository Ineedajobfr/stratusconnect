-- Update existing admin account password
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
WHERE email = 'admin@stratusconnect.org';

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

-- If the table exists but doesn't have the right structure, alter it
DO $$
BEGIN
    -- Add id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
        ALTER TABLE public.profiles ADD COLUMN id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        ALTER TABLE public.profiles ADD PRIMARY KEY (id);
    END IF;
    
    -- Add other columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'full_name') THEN
        ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'email') THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'created_at') THEN
        ALTER TABLE public.profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'updated_at') THEN
        ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Insert or update profile for the admin user
INSERT INTO public.profiles (id, full_name, email, role, updated_at)
SELECT 
    id, 
    'StratusConnect Admin', 
    'admin@stratusconnect.org', 
    'admin', 
    NOW()
FROM auth.users 
WHERE email = 'admin@stratusconnect.org'
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    updated_at = NOW();

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
WHERE email = 'admin@stratusconnect.org';
