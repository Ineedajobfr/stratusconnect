-- FINAL QUICK FIX - Just create the test users
-- This will work with your existing schema

-- Insert test users with usernames (to satisfy NOT NULL constraint)
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
    RAISE NOTICE '✅ Test users created!';
    RAISE NOTICE '📊 You should now see users in the admin console';
END $$;
