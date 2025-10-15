-- ADMIN CONSOLE FIX - ADD COLUMNS FIRST
-- This script adds missing columns to existing users table, then inserts data

-- ============================================================================
-- STEP 1: ADD MISSING COLUMNS TO EXISTING USERS TABLE
-- ============================================================================

-- Add columns that might be missing (safe to run multiple times)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS access_code_hash TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS license_number TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS years_experience INTEGER;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- ============================================================================
-- STEP 2: INSERT TEST USERS WITH ALL COLUMNS
-- ============================================================================

-- Insert admin user
INSERT INTO public.users (
    email,
    username,
    access_code_hash,
    password_hash,
    role,
    status,
    verification_status,
    is_admin,
    full_name,
    is_active,
    created_at,
    updated_at
)
VALUES (
    'Stratuscharters@gmail.com',
    'stratusadmin',
    'ADMIN_ACCESS_CODE_PLACEHOLDER',
    'ADMIN_PASSWORD_PLACEHOLDER',
    'admin',
    'active',
    'approved',
    TRUE,
    'Stratus Admin',
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

-- Insert test users
INSERT INTO public.users (
    email,
    username,
    access_code_hash,
    password_hash,
    role,
    status,
    verification_status,
    company_name,
    license_number,
    years_experience,
    full_name,
    is_active,
    created_at,
    updated_at
)
VALUES 
    (
        'broker@test.com',
        'test_broker',
        'BROKER_ACCESS_CODE',
        'BROKER_PASSWORD',
        'broker',
        'active',
        'approved',
        'Elite Aviation Brokers',
        'BRK-001',
        8,
        'Alex Broker',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'operator@test.com',
        'test_operator',
        'OPERATOR_ACCESS_CODE',
        'OPERATOR_PASSWORD',
        'operator',
        'active',
        'approved',
        'SkyHigh Operations',
        'OPR-001',
        12,
        'Sarah Operator',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'pilot@test.com',
        'test_pilot',
        'PILOT_ACCESS_CODE',
        'PILOT_PASSWORD',
        'pilot',
        'active',
        'approved',
        NULL,
        'ATP-8500',
        15,
        'Mike Pilot',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'crew@test.com',
        'test_crew',
        'CREW_ACCESS_CODE',
        'CREW_PASSWORD',
        'crew',
        'active',
        'approved',
        NULL,
        NULL,
        6,
        'Emma Crew',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'pending@test.com',
        'test_pending',
        'PENDING_ACCESS_CODE',
        'PENDING_PASSWORD',
        'broker',
        'pending',
        'pending_verification',
        NULL,
        NULL,
        NULL,
        'Pending User',
        TRUE,
        NOW(),
        NOW()
    ),
    (
        'suspended@test.com',
        'test_suspended',
        'SUSPENDED_ACCESS_CODE',
        'SUSPENDED_PASSWORD',
        'operator',
        'suspended',
        'suspended',
        NULL,
        NULL,
        NULL,
        'Suspended User',
        FALSE,
        NOW(),
        NOW()
    )
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- STEP 3: ENABLE RLS AND CREATE POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Admin full access to users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Service role full access" ON public.users;

-- Create comprehensive policies
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

-- ============================================================================
-- STEP 4: VERIFY DATA
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
    RAISE NOTICE '📝 All missing columns have been added to the users table';
END $$;
