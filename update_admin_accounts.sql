-- Update/Create Admin Accounts (Safer Approach)
-- This uses UPDATE first, then INSERT if no rows were updated

-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

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

-- Function to create or update admin user
CREATE OR REPLACE FUNCTION create_admin_user(
    user_id UUID,
    user_email TEXT,
    user_password TEXT,
    user_name TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    rows_updated INTEGER;
BEGIN
    -- Try to update existing user first
    UPDATE auth.users
    SET encrypted_password = crypt(user_password, gen_salt('bf')),
        raw_user_meta_data = json_build_object('full_name', user_name, 'role', 'admin'),
        updated_at = NOW(),
        email_confirmed_at = COALESCE(email_confirmed_at, NOW())
    WHERE email = user_email;
    
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    
    -- If no rows were updated, insert new user
    IF rows_updated = 0 THEN
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password,
            email_confirmed_at, last_sign_in_at, raw_app_meta_data,
            raw_user_meta_data, is_sso_user, created_at, updated_at
        ) VALUES (
            user_id,
            '00000000-0000-0000-0000-000000000000'::uuid,
            'authenticated',
            'authenticated',
            user_email,
            crypt(user_password, gen_salt('bf')),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            json_build_object('full_name', user_name, 'role', 'admin'),
            FALSE,
            NOW(),
            NOW()
        );
    END IF;
    
    -- Create or update profile
    INSERT INTO public.profiles (id, full_name, email, role, updated_at)
    VALUES (user_id, user_name, user_email, 'admin', NOW())
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        updated_at = NOW();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create the admin accounts using the function
SELECT create_admin_user(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'admin@stratusconnect.org',
    'Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$',
    'StratusConnect Admin'
);

SELECT create_admin_user(
    'b1fcc0a1-1d2e-4f3a-8b4c-5d6e7f8a9b0c'::uuid,
    'admin2@stratusconnect.org',
    'Str4tu$C0nn3ct_M4st3r_4dm1n_2025!#$',
    'Secondary Admin'
);

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

-- Clean up the function
DROP FUNCTION create_admin_user(UUID, TEXT, TEXT, TEXT);
