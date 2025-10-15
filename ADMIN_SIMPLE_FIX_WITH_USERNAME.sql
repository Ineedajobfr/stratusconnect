-- SIMPLE ADMIN CONSOLE FIX - WITH USERNAME
-- This script works with your existing schema and includes required username field

-- ============================================================================
-- STEP 1: INSERT TEST USERS INTO EXISTING USERS TABLE (WITH USERNAME)
-- ============================================================================

-- Insert admin user (with username)
INSERT INTO public.users (
    email,
    username,
    role,
    verification_status,
    created_at,
    updated_at
)
VALUES (
    'Stratuscharters@gmail.com',
    'stratusadmin',
    'admin',
    'approved',
    NOW(),
    NOW()
)
ON CONFLICT (email) 
DO UPDATE SET
    role = 'admin',
    verification_status = 'approved',
    updated_at = NOW();

-- Insert test users (with usernames)
INSERT INTO public.users (
    email,
    username,
    role,
    verification_status,
    created_at,
    updated_at
)
VALUES 
    ('broker@test.com', 'test_broker', 'broker', 'approved', NOW(), NOW()),
    ('operator@test.com', 'test_operator', 'operator', 'approved', NOW(), NOW()),
    ('pilot@test.com', 'test_pilot', 'pilot', 'approved', NOW(), NOW()),
    ('crew@test.com', 'test_crew', 'crew', 'approved', NOW(), NOW()),
    ('pending@test.com', 'test_pending', 'broker', 'pending_verification', NOW(), NOW()),
    ('suspended@test.com', 'test_suspended', 'operator', 'suspended', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- STEP 2: SIMPLE RLS POLICIES (without is_admin column)
-- ============================================================================

-- Enable RLS if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Admin access" ON public.users;
DROP POLICY IF EXISTS "Users own data" ON public.users;
DROP POLICY IF EXISTS "Service role access" ON public.users;

-- Simple admin policy (based on role = 'admin')
CREATE POLICY "Admin access"
    ON public.users
    FOR ALL
    TO authenticated
    USING (role = 'admin')
    WITH CHECK (role = 'admin');

-- Users can view their own data
CREATE POLICY "Users own data"
    ON public.users
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

-- Service role gets full access
CREATE POLICY "Service role access"
    ON public.users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- STEP 3: VERIFY DATA
-- ============================================================================

-- Show all users
SELECT 
    email,
    username,
    role,
    verification_status,
    created_at
FROM public.users
ORDER BY created_at DESC;

-- Count by role
SELECT 
    role,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE verification_status = 'approved') as approved_count
FROM public.users
GROUP BY role
ORDER BY role;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Simple Admin Console Setup Complete!';
    RAISE NOTICE '📊 Check the query results above to verify all users were created';
    RAISE NOTICE '🔐 Admin: Stratuscharters@gmail.com (username: stratusadmin)';
    RAISE NOTICE '🧪 Test users: broker@test.com, operator@test.com, pilot@test.com, crew@test.com';
    RAISE NOTICE '⏳ Pending user: pending@test.com';
    RAISE NOTICE '🚫 Suspended user: suspended@test.com';
    RAISE NOTICE '📝 Note: All users now have required username field';
END $$;
