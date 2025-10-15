-- CREATE REAL TEST USERS FOR ADMIN CONSOLE - FIXED SCHEMA
-- These users will have real data and access real terminals

-- ============================================================================
-- STEP 1: Create Test Users in auth.users (Supabase Auth)
-- ============================================================================

-- Note: You need to create these users manually in Supabase Auth Dashboard
-- Go to: Supabase Dashboard → Authentication → Users → Add User
-- 
-- Users to create:
-- 1. Email: broker@test.com, Password: testpass123
-- 2. Email: operator@test.com, Password: testpass123  
-- 3. Email: pilot@test.com, Password: testpass123
-- 4. Email: crew@test.com, Password: testpass123
--
-- For each user, check "Email Confirmed"

-- ============================================================================
-- STEP 2: Create Test Users in public.users (MATCHING ACTUAL SCHEMA)
-- ============================================================================

-- Insert test users into public.users table
-- These will be linked to the auth.users via email

-- Broker Test User
INSERT INTO public.users (
    id,
    email,
    username,
    role,
    status,
    verification_status,
    full_name,
    company_name,
    phone,
    password_hash,
    access_code_hash,
    created_at,
    updated_at,
    is_active
) VALUES (
    gen_random_uuid(),
    'broker@test.com',
    'broker_test',
    'broker',
    'active',
    'approved',
    'Alex Broker',
    'Test Brokerage LLC',
    '+1-555-0101',
    'TEST_PASSWORD_HASH',
    'TEST_ACCESS_CODE',
    NOW(),
    NOW(),
    true
) ON CONFLICT (email) DO UPDATE SET
    role = 'broker',
    status = 'active',
    verification_status = 'approved',
    updated_at = NOW();

-- Operator Test User
INSERT INTO public.users (
    id,
    email,
    username,
    role,
    status,
    verification_status,
    full_name,
    company_name,
    phone,
    password_hash,
    access_code_hash,
    created_at,
    updated_at,
    is_active
) VALUES (
    gen_random_uuid(),
    'operator@test.com',
    'operator_test',
    'operator',
    'active',
    'approved',
    'Sarah Operator',
    'Test Aviation Group',
    '+1-555-0102',
    'TEST_PASSWORD_HASH',
    'TEST_ACCESS_CODE',
    NOW(),
    NOW(),
    true
) ON CONFLICT (email) DO UPDATE SET
    role = 'operator',
    status = 'active',
    verification_status = 'approved',
    updated_at = NOW();

-- Pilot Test User
INSERT INTO public.users (
    id,
    email,
    username,
    role,
    status,
    verification_status,
    full_name,
    company_name,
    phone,
    password_hash,
    access_code_hash,
    created_at,
    updated_at,
    is_active
) VALUES (
    gen_random_uuid(),
    'pilot@test.com',
    'pilot_test',
    'pilot',
    'active',
    'approved',
    'Mike Pilot',
    'Test Aviation Group',
    '+1-555-0103',
    'TEST_PASSWORD_HASH',
    'TEST_ACCESS_CODE',
    NOW(),
    NOW(),
    true
) ON CONFLICT (email) DO UPDATE SET
    role = 'pilot',
    status = 'active',
    verification_status = 'approved',
    updated_at = NOW();

-- Crew Test User
INSERT INTO public.users (
    id,
    email,
    username,
    role,
    status,
    verification_status,
    full_name,
    company_name,
    phone,
    password_hash,
    access_code_hash,
    created_at,
    updated_at,
    is_active
) VALUES (
    gen_random_uuid(),
    'crew@test.com',
    'crew_test',
    'crew',
    'active',
    'approved',
    'Lisa Crew',
    'Test Aviation Group',
    '+1-555-0104',
    'TEST_PASSWORD_HASH',
    'TEST_ACCESS_CODE',
    NOW(),
    NOW(),
    true
) ON CONFLICT (email) DO UPDATE SET
    role = 'crew',
    status = 'active',
    verification_status = 'approved',
    updated_at = NOW();

-- ============================================================================
-- STEP 3: Create Sample Data for Test Users (Optional)
-- ============================================================================

-- Create sample aircraft for operator (if aircraft table exists)
-- INSERT INTO public.aircraft (
--     id,
--     operator_id,
--     registration,
--     aircraft_type,
--     capacity,
--     range_nm,
--     hourly_rate,
--     status,
--     created_at
-- ) VALUES (
--     gen_random_uuid(),
--     (SELECT id FROM public.users WHERE email = 'operator@test.com'),
--     'N-TEST1',
--     'Citation CJ3',
--     6,
--     2000,
--     3500,
--     'available',
--     NOW()
-- ) ON CONFLICT DO NOTHING;

-- Create sample RFQ for broker (if requests table exists)
-- INSERT INTO public.requests (
--     id,
--     requester_id,
--     departure_airport,
--     arrival_airport,
--     departure_date,
--     return_date,
--     passengers,
--     aircraft_type,
--     status,
--     created_at
-- ) VALUES (
--     gen_random_uuid(),
--     (SELECT id FROM public.users WHERE email = 'broker@test.com'),
--     'KJFK',
--     'KLAX',
--     NOW() + INTERVAL '7 days',
--     NOW() + INTERVAL '10 days',
--     4,
--     'Citation CJ3',
--     'open',
--     NOW()
-- ) ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 4: Verify Test Users
-- ============================================================================

SELECT 
    'Test Users Created' as status,
    email,
    username,
    role,
    verification_status,
    status as user_status,
    full_name
FROM public.users 
WHERE email IN (
    'broker@test.com',
    'operator@test.com', 
    'pilot@test.com',
    'crew@test.com'
)
ORDER BY role;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ REAL TEST USERS CREATED!';
    RAISE NOTICE '🧪 Test users with real data: broker@test.com, operator@test.com, pilot@test.com, crew@test.com';
    RAISE NOTICE '📝 IMPORTANT: Create these users in Supabase Auth Dashboard with password: testpass123';
    RAISE NOTICE '🎯 Test users can now access real terminals with real data!';
END $$;
