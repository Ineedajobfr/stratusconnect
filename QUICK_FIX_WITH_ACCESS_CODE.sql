-- QUICK FIX - Add access_code_hash to all INSERT statements

-- Insert test users with access_code_hash (to satisfy NOT NULL constraint)
INSERT INTO public.users (
    email,
    username,
    access_code_hash,
    role,
    verification_status,
    created_at,
    updated_at
)
VALUES 
    ('broker@test.com', 'test_broker', 'BROKER_ACCESS_CODE', 'broker', 'approved', NOW(), NOW()),
    ('operator@test.com', 'test_operator', 'OPERATOR_ACCESS_CODE', 'operator', 'approved', NOW(), NOW()),
    ('pilot@test.com', 'test_pilot', 'PILOT_ACCESS_CODE', 'pilot', 'approved', NOW(), NOW()),
    ('crew@test.com', 'test_crew', 'CREW_ACCESS_CODE', 'crew', 'approved', NOW(), NOW()),
    ('pending@test.com', 'test_pending', 'PENDING_ACCESS_CODE', 'broker', 'pending_verification', NOW(), NOW()),
    ('suspended@test.com', 'test_suspended', 'SUSPENDED_ACCESS_CODE', 'operator', 'suspended', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Show all users
SELECT 
    email,
    username,
    role,
    verification_status,
    created_at
FROM public.users
ORDER BY created_at DESC;

DO $$
BEGIN
    RAISE NOTICE '✅ Test users created with access codes!';
    RAISE NOTICE '📊 You should now see users in the admin console';
END $$;
