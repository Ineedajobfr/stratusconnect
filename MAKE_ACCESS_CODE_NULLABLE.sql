-- MAKE ACCESS_CODE_HASH NULLABLE (easier for testing)

-- Make access_code_hash nullable so we don't need to provide it
ALTER TABLE public.users ALTER COLUMN access_code_hash DROP NOT NULL;

-- Now insert test users without access_code_hash
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
    RAISE NOTICE '✅ Access code hash is now nullable!';
    RAISE NOTICE '✅ Test users created!';
    RAISE NOTICE '📊 You should now see users in the admin console';
END $$;
