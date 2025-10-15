-- CREATE MINIMAL TEST USERS - ESSENTIAL COLUMNS ONLY
-- This script only uses the most basic required columns

-- ============================================================================
-- MINIMAL TEST USER CREATION
-- ============================================================================

-- Broker Test User (minimal fields + required NOT NULL columns)
INSERT INTO public.users (
    id,
    email,
    username,
    role,
    verification_status,
    full_name,
    created_at,
    updated_at,
    is_active,
    access_code_hash,
    password_hash
) VALUES (
    gen_random_uuid(),
    'broker@test.com',
    'broker_test',
    'broker',
    'approved',
    'Alex Broker',
    NOW(),
    NOW(),
    true,
    'TEST_ACCESS_CODE_HASH',
    'TEST_PASSWORD_HASH'
) ON CONFLICT (email) DO UPDATE SET
    role = 'broker',
    verification_status = 'approved',
    updated_at = NOW();

-- Operator Test User (minimal fields + required NOT NULL columns)
INSERT INTO public.users (
    id,
    email,
    username,
    role,
    verification_status,
    full_name,
    created_at,
    updated_at,
    is_active,
    access_code_hash,
    password_hash
) VALUES (
    gen_random_uuid(),
    'operator@test.com',
    'operator_test',
    'operator',
    'approved',
    'Sarah Operator',
    NOW(),
    NOW(),
    true,
    'TEST_ACCESS_CODE_HASH',
    'TEST_PASSWORD_HASH'
) ON CONFLICT (email) DO UPDATE SET
    role = 'operator',
    verification_status = 'approved',
    updated_at = NOW();

-- Pilot Test User (minimal fields + required NOT NULL columns)
INSERT INTO public.users (
    id,
    email,
    username,
    role,
    verification_status,
    full_name,
    created_at,
    updated_at,
    is_active,
    access_code_hash,
    password_hash
) VALUES (
    gen_random_uuid(),
    'pilot@test.com',
    'pilot_test',
    'pilot',
    'approved',
    'Mike Pilot',
    NOW(),
    NOW(),
    true,
    'TEST_ACCESS_CODE_HASH',
    'TEST_PASSWORD_HASH'
) ON CONFLICT (email) DO UPDATE SET
    role = 'pilot',
    verification_status = 'approved',
    updated_at = NOW();

-- Crew Test User (minimal fields + required NOT NULL columns)
INSERT INTO public.users (
    id,
    email,
    username,
    role,
    verification_status,
    full_name,
    created_at,
    updated_at,
    is_active,
    access_code_hash,
    password_hash
) VALUES (
    gen_random_uuid(),
    'crew@test.com',
    'crew_test',
    'crew',
    'approved',
    'Lisa Crew',
    NOW(),
    NOW(),
    true,
    'TEST_ACCESS_CODE_HASH',
    'TEST_PASSWORD_HASH'
) ON CONFLICT (email) DO UPDATE SET
    role = 'crew',
    verification_status = 'approved',
    updated_at = NOW();

-- ============================================================================
-- VERIFY TEST USERS CREATED
-- ============================================================================

SELECT 
    'Test Users Created' as status,
    email,
    username,
    role,
    verification_status,
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
    RAISE NOTICE '✅ MINIMAL TEST USERS CREATED!';
    RAISE NOTICE '🧪 Test users: broker@test.com, operator@test.com, pilot@test.com, crew@test.com';
    RAISE NOTICE '🎯 These users can now be used for testing!';
END $$;
