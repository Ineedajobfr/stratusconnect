-- CORRECTED ADMIN CONSOLE FIX
-- This script works with your existing schema where profiles.id is the FK to auth.users.id

-- ============================================================================
-- STEP 1: CREATE OR UPDATE USERS TABLE
-- ============================================================================

-- Check if users table exists, if not create it
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    username TEXT,
    access_code_hash TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    status TEXT DEFAULT 'pending',
    verification_status TEXT DEFAULT 'pending',
    company_name TEXT,
    referral_count INTEGER DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    full_name TEXT,
    last_login TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT FALSE,
    phone TEXT,
    address TEXT,
    license_number TEXT,
    years_experience INTEGER,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Add indexes for performance (only for columns that exist)
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

-- ============================================================================
-- STEP 2: UPDATE PROFILES TABLE (if it exists)
-- ============================================================================

-- Add missing columns to existing profiles table if needed
DO $$
BEGIN
    -- Add columns that might be missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'verification_status') THEN
        ALTER TABLE public.profiles ADD COLUMN verification_status TEXT DEFAULT 'pending';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'last_sign_in_at') THEN
        ALTER TABLE public.profiles ADD COLUMN last_sign_in_at TIMESTAMPTZ;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'first_name') THEN
        ALTER TABLE public.profiles ADD COLUMN first_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'last_name') THEN
        ALTER TABLE public.profiles ADD COLUMN last_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'company') THEN
        ALTER TABLE public.profiles ADD COLUMN company TEXT;
    END IF;
END $$;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    verification_status TEXT DEFAULT 'pending',
    last_sign_in_at TIMESTAMPTZ,
    first_name TEXT,
    last_name TEXT,
    company TEXT,
    phone TEXT,
    bio TEXT
);

-- Add indexes for profiles (using id, not user_id)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ============================================================================
-- STEP 3: ENABLE RLS
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Admin full access to users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Public read access" ON public.users;

DROP POLICY IF EXISTS "Admin full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public read access" ON public.profiles;

-- Create comprehensive policies for users table
CREATE POLICY "Admin full access to users"
    ON public.users
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR is_admin = TRUE)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR is_admin = TRUE)
        )
    );

CREATE POLICY "Users can view their own data"
    ON public.users
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

-- Allow read access for service role (for admin console)
CREATE POLICY "Service role full access"
    ON public.users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Policies for profiles (using id, not user_id)
CREATE POLICY "Admin full access to profiles"
    ON public.profiles
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND (role = 'admin' OR is_admin = TRUE)
        )
    );

CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Service role full access to profiles"
    ON public.profiles
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- STEP 4: INSERT ADMIN USER
-- ============================================================================

-- First, ensure the admin user exists
INSERT INTO public.users (
    email,
    username,
    access_code_hash,
    password_hash,
    full_name,
    role,
    status,
    verification_status,
    is_admin,
    is_active,
    created_at,
    updated_at
)
VALUES (
    'Stratuscharters@gmail.com',
    'stratusadmin',
    'ADMIN_ACCESS_CODE_PLACEHOLDER',
    'ADMIN_PASSWORD_PLACEHOLDER',
    'Stratus Admin',
    'admin',
    'active',
    'approved',
    TRUE,
    TRUE,
    NOW(),
    NOW()
)
ON CONFLICT (email) 
DO UPDATE SET
    role = 'admin',
    is_admin = TRUE,
    status = 'active',
    verification_status = 'approved',
    updated_at = NOW();

-- ============================================================================
-- STEP 5: INSERT TEST USERS
-- ============================================================================

-- Broker user
INSERT INTO public.users (
    email,
    username,
    access_code_hash,
    password_hash,
    full_name,
    role,
    status,
    verification_status,
    company_name,
    license_number,
    years_experience,
    is_active
)
VALUES (
    'broker@test.com',
    'test_broker',
    'BROKER_ACCESS_CODE',
    'BROKER_PASSWORD',
    'Alex Broker',
    'broker',
    'active',
    'approved',
    'Elite Aviation Brokers',
    'BRK-001',
    8,
    TRUE
)
ON CONFLICT (email) DO NOTHING;

-- Operator user
INSERT INTO public.users (
    email,
    username,
    access_code_hash,
    password_hash,
    full_name,
    role,
    status,
    verification_status,
    company_name,
    license_number,
    years_experience,
    is_active
)
VALUES (
    'operator@test.com',
    'test_operator',
    'OPERATOR_ACCESS_CODE',
    'OPERATOR_PASSWORD',
    'Sarah Operator',
    'operator',
    'active',
    'approved',
    'SkyHigh Operations',
    'OPR-001',
    12,
    TRUE
)
ON CONFLICT (email) DO NOTHING;

-- Pilot user
INSERT INTO public.users (
    email,
    username,
    access_code_hash,
    password_hash,
    full_name,
    role,
    status,
    verification_status,
    license_number,
    years_experience,
    bio,
    is_active
)
VALUES (
    'pilot@test.com',
    'test_pilot',
    'PILOT_ACCESS_CODE',
    'PILOT_PASSWORD',
    'Mike Pilot',
    'pilot',
    'active',
    'approved',
    'ATP-8500',
    15,
    'ATP License, 8,500 hours total time',
    TRUE
)
ON CONFLICT (email) DO NOTHING;

-- Crew user
INSERT INTO public.users (
    email,
    username,
    access_code_hash,
    password_hash,
    full_name,
    role,
    status,
    verification_status,
    years_experience,
    bio,
    is_active
)
VALUES (
    'crew@test.com',
    'test_crew',
    'CREW_ACCESS_CODE',
    'CREW_PASSWORD',
    'Emma Crew',
    'crew',
    'active',
    'approved',
    6,
    'Senior Cabin Crew with international experience',
    TRUE
)
ON CONFLICT (email) DO NOTHING;

-- Pending user (for testing verification workflow)
INSERT INTO public.users (
    email,
    username,
    access_code_hash,
    password_hash,
    full_name,
    role,
    status,
    verification_status,
    is_active
)
VALUES (
    'pending@test.com',
    'test_pending',
    'PENDING_ACCESS_CODE',
    'PENDING_PASSWORD',
    'Pending User',
    'broker',
    'pending',
    'pending_verification',
    TRUE
)
ON CONFLICT (email) DO NOTHING;

-- Suspended user (for testing suspension workflow)
INSERT INTO public.users (
    email,
    username,
    access_code_hash,
    password_hash,
    full_name,
    role,
    status,
    verification_status,
    is_active
)
VALUES (
    'suspended@test.com',
    'test_suspended',
    'SUSPENDED_ACCESS_CODE',
    'SUSPENDED_PASSWORD',
    'Suspended User',
    'operator',
    'suspended',
    'suspended',
    FALSE
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- STEP 6: VERIFY DATA
-- ============================================================================

-- Show all users
SELECT 
    email,
    full_name,
    role,
    status,
    verification_status,
    is_admin,
    created_at
FROM public.users
ORDER BY created_at DESC;

-- Count by role
SELECT 
    role,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE status = 'active') as active_count,
    COUNT(*) FILTER (WHERE verification_status = 'approved') as approved_count
FROM public.users
GROUP BY role
ORDER BY role;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Admin Console Setup Complete!';
    RAISE NOTICE '📊 Check the query results above to verify all users were created';
    RAISE NOTICE '🔐 Admin: Stratuscharters@gmail.com';
    RAISE NOTICE '🧪 Test users: broker@test.com, operator@test.com, pilot@test.com, crew@test.com';
    RAISE NOTICE '⏳ Pending user: pending@test.com';
    RAISE NOTICE '🚫 Suspended user: suspended@test.com';
    RAISE NOTICE '📝 Note: Using existing profiles schema with id as FK to auth.users.id';
END $$;
